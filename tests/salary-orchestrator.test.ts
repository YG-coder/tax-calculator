import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSalary } from '../src/lib/tax/calculators/salary-orchestrator.ts';

// 기대값은 함수와 따로 정수 산술로 구한다.
// - 국민연금: 소득월액의 천원 미만을 버리고(국민연금법 시행령 제5조제1항) 상·하한을 적용한 뒤
//   근로자 부담률(국민연금법 부칙 <법률 제20903호> 제4조제1항: 2026년 1만분의 475, 2027년 1만분의 500)을 곱하고 10원 미만을 버린다.
// - 고용보험: 기존 요율 0.009(1000분의 9)를 곱하고 10원 미만을 버린다.
const floor10 = (numerator: number, denominator: number) => Math.floor(numerator / (denominator * 10)) * 10;
const pensionExpected = (taxable: number, per10000: number, floor: number, ceiling: number) => {
    const base = Math.min(Math.max(Math.floor(taxable / 1000) * 1000, floor), ceiling);
    return floor10(base * per10000, 10_000);
};
const employmentExpected = (taxable: number) => floor10(taxable * 9, 1000);

const monthlyInput = (taxableMonthly: number, nonTaxableMonthly = 0) => ({
    annualSalary: (taxableMonthly + nonTaxableMonthly) * 12,
    nonTaxableMonthly,
    dependents: 1,
});
const at = (iso: string) => new Date(iso);
const periodId = (iso: string) => simulateSalary(monthlyInput(3_000_000), at(iso))?.basis.pensionConfig.id ?? null;

// 기존 구간: [id, 시작일, 종료일(그날 끝까지), 다음 구간 id]
const PERIODS: [string, string, string, string | null][] = [
    ['KR-PENSION-2024-07', '2024-07-01', '2025-06-30', 'KR-PENSION-2025-07'],
    ['KR-PENSION-2025-07', '2025-07-01', '2025-12-31', 'KR-PENSION-2026-01'],
    ['KR-PENSION-2026-01', '2026-01-01', '2026-06-30', 'KR-PENSION-2026-07'],
    ['KR-PENSION-2026-07', '2026-07-01', '2026-12-31', 'KR-PENSION-2027-01'],
    ['KR-PENSION-2027-01', '2027-01-01', '2027-06-30', null],
];
const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

test('simulateSalary: 각 구간 말일은 한국 시각 하루 전체를 포함하고 다음 날 0시에 다음 구간으로 넘어간다', () => {
    for (const [id, , end, next] of PERIODS) {
        for (const time of ['00:00:00', '09:00:00', '12:00:00', '23:59:59.999']) {
            assert.equal(periodId(`${end}T${time}+09:00`), id, `${end} ${time} KST`);
        }
        assert.equal(periodId(`${nextDay(end)}T00:00:00+09:00`), next, `${nextDay(end)} 00:00 KST`);
    }
});

test('simulateSalary: 각 구간은 시작일 한국 시각 0시부터 적용된다', () => {
    for (const [id, start] of PERIODS) {
        assert.equal(periodId(`${start}T00:00:00+09:00`), id, `${start} 00:00 KST`);
    }
    // 첫 구간 앞과 마지막 구간 뒤는 기존처럼 미지원(null)
    assert.equal(periodId('2024-06-30T23:59:59.999+09:00'), null);
    assert.equal(periodId('2027-07-01T00:00:00+09:00'), null);
});

test('simulateSalary: 2027-06-30 12:00 KST에 null이 아니다', () => {
    const r = simulateSalary(monthlyInput(3_000_000), at('2027-06-30T12:00:00+09:00'));
    assert.ok(r);
    assert.equal(r.basis.pensionConfig.id, 'KR-PENSION-2027-01');
    assert.equal(r.monthly.pension, 150_000);
});

test('simulateSalary: 2026-12-31 → 2027-01-01에 국민연금 요율이 4.75%에서 5%로 바뀐다', () => {
    const before = simulateSalary(monthlyInput(3_000_000), at('2026-12-31T23:59:59.999+09:00'));
    const after = simulateSalary(monthlyInput(3_000_000), at('2027-01-01T00:00:00+09:00'));
    assert.equal(before?.monthly.pension, pensionExpected(3_000_000, 475, 410_000, 6_590_000));
    assert.equal(after?.monthly.pension, pensionExpected(3_000_000, 500, 410_000, 6_590_000));
    assert.equal(before?.monthly.pension, 142_500);
    assert.equal(after?.monthly.pension, 150_000);
});

test('simulateSalary: 판정이 실행 프로세스 시간대에 좌우되지 않는다', () => {
    const original = process.env.TZ;
    try {
        for (const tz of ['UTC', 'Asia/Seoul', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
            process.env.TZ = tz;
            assert.equal(periodId('2026-06-30T23:59:59.999+09:00'), 'KR-PENSION-2026-01', tz);
            assert.equal(periodId('2026-07-01T00:00:00+09:00'), 'KR-PENSION-2026-07', tz);
            assert.equal(periodId('2026-12-31T23:59:59.999+09:00'), 'KR-PENSION-2026-07', tz);
            assert.equal(periodId('2027-01-01T00:00:00+09:00'), 'KR-PENSION-2027-01', tz);
            assert.equal(periodId('2027-06-30T23:59:59.999+09:00'), 'KR-PENSION-2027-01', tz);
            assert.equal(periodId('2027-07-01T00:00:00+09:00'), null, tz);
        }
    } finally {
        if (original === undefined) delete process.env.TZ;
        else process.env.TZ = original;
    }
});

test('simulateSalary: 기준소득월액의 천원 미만을 버리고 상·하한을 적용한다', () => {
    const when = at('2027-01-15T12:00:00+09:00');
    const cases: [number, number][] = [
        [3_456_789, 172_800],
        [3_456_999, 172_800],
        [3_457_000, 172_850],
        [3_457_001, 172_850],
        [300_000, 20_500],
        [409_999, 20_500],
        [410_000, 20_500],
        [410_999, 20_500],
        [411_000, 20_550],
        [6_589_999, 329_450],
        [6_590_000, 329_500],
        [6_590_999, 329_500],
        [8_000_000, 329_500],
    ];
    for (const [taxable, expected] of cases) {
        assert.equal(pensionExpected(taxable, 500, 410_000, 6_590_000), expected, `기대값 계산 ${taxable}`);
        assert.equal(simulateSalary(monthlyInput(taxable), when)?.monthly.pension, expected, `${taxable}원`);
    }
    // 2026년 구간은 4.75%
    assert.equal(simulateSalary(monthlyInput(3_456_789), at('2026-08-15T12:00:00+09:00'))?.monthly.pension, 164_160);
});

test('simulateSalary: 비과세액이 있으면 비과세를 뺀 금액으로 계산한다', () => {
    const when = at('2027-01-15T12:00:00+09:00');
    const cases: [number, number][] = [[3_300_000, 200_000], [3_333_333, 123_456], [0, 5_000_000]];
    for (const [taxable, nonTaxable] of cases) {
        const r = simulateSalary(monthlyInput(taxable, nonTaxable), when);
        assert.ok(r);
        assert.equal(r.monthly.gross, taxable + nonTaxable);
        assert.equal(r.monthly.pension, pensionExpected(taxable, 500, 410_000, 6_590_000));
        assert.equal(r.monthly.employment, employmentExpected(taxable));
    }
    assert.equal(simulateSalary(monthlyInput(3_333_333, 123_456), when)?.monthly.pension, 166_650);
    assert.equal(simulateSalary(monthlyInput(3_333_333, 123_456), when)?.monthly.employment, 29_990);
    // 비과세액이 월급보다 크면 과세 월급 0 → 국민연금은 하한, 고용보험 0
    assert.equal(simulateSalary(monthlyInput(0, 5_000_000), when)?.monthly.pension, 20_500);
    assert.equal(simulateSalary(monthlyInput(0, 5_000_000), when)?.monthly.employment, 0);
});

test('simulateSalary: 고용보험을 정확한 산술로 계산하고 10원 미만을 버린다', () => {
    const when = at('2026-08-15T12:00:00+09:00');
    const cases: [number, number][] = [
        [2_999_999, 26_990],
        [3_000_000, 27_000],
        [3_000_001, 27_000],
        [1_111_111, 9_990],
        [1_111_112, 10_000],
        [50_000, 450],
        [100_000, 900],
        [3_456_789, 31_110],
    ];
    for (const [taxable, expected] of cases) {
        assert.equal(employmentExpected(taxable), expected, `기대값 계산 ${taxable}`);
        assert.equal(simulateSalary(monthlyInput(taxable), when)?.monthly.employment, expected, `${taxable}원`);
    }
});

test('simulateSalary: 기본 호출과 반환 구조를 유지하고 공제합계·실수령액이 공제액과 맞는다', () => {
    const input = monthlyInput(3_000_000);
    const explicit = simulateSalary(input, new Date());
    const implicit = simulateSalary(input);
    // 날짜를 생략하면 현재 시각으로 같은 결과(두 호출 사이에 구간 경계를 지나는 경우는 제외)
    assert.deepEqual(implicit, explicit);
    const r = simulateSalary(input, at('2026-08-15T12:00:00+09:00'));
    assert.ok(r);
    assert.deepEqual(Object.keys(r).sort(), ['basis', 'monthly']);
    assert.deepEqual(Object.keys(r.monthly).sort(), ['employment', 'gross', 'health', 'incomeTax', 'localTax', 'longTermCare', 'netPay', 'pension', 'totalDeductions']);
    assert.deepEqual(Object.keys(r.basis).sort(), ['isTableFound', 'pensionConfig']);
    const m = r.monthly;
    assert.equal(m.totalDeductions, m.pension + m.health + m.longTermCare + m.employment + m.incomeTax + m.localTax);
    assert.equal(m.netPay, m.gross - m.totalDeductions);
    assert.equal(m.pension, 142_500);
    assert.equal(m.employment, 27_000);
});
