import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSalary } from '../src/lib/tax/calculators/salary-orchestrator.ts';
import { getLongTermCareRate } from '../src/lib/tax/config/verified/long-term-care-rates.ts';

const run = (date: string, taxable = 2781700, nonTaxableMonthly = 0) => simulateSalary({
    annualSalary: (taxable + nonTaxableMonthly) * 12, nonTaxableMonthly, dependents: 1,
}, new Date(date));

test('2027년 월분부터 공식 발표 13.90% 적용: 건보료 10만원 → 13,900원', () => {
    const before = run('2026-12-31T14:59:59.999Z');
    const after = run('2026-12-31T15:00:00Z');
    assert.equal(before?.monthly.health, 100000);
    assert.equal(before?.monthly.longTermCare, 13140);
    assert.equal(after?.monthly.health, 100000);
    assert.equal(after?.monthly.longTermCare, 13900);
    assert.equal(getLongTermCareRate(new Date('2026-12-31T15:00:00Z'))?.incomeRatePerMillion, 9994);
});

test('2027년 1~6월의 각 월분에서 요율을 적용하고 다른 구간 지원은 늘리지 않는다', () => {
    for (const month of ['01', '02', '03', '04', '05', '06']) {
        assert.equal(run(`2027-${month}-01T00:00:00+09:00`)?.monthly.longTermCare, 13900);
    }
    assert.equal(run('2027-06-30T23:59:59.999+09:00')?.monthly.longTermCare, 13900);
    // 하반기 장기요양 비율 자체는 등록돼 있지만 국민연금 상·하한이 미등록이므로 전체 함수는 기존처럼 null.
    assert.equal(getLongTermCareRate(new Date('2027-12-31T23:59:59.999+09:00'))?.healthPremiumRatePer10000, 1390);
    assert.equal(run('2027-07-01T00:00:00+09:00'), null);
    assert.equal(getLongTermCareRate(new Date('2028-01-01T00:00:00+09:00')), null);
    assert.equal(run('invalid'), null);
});

test('2027년 일반·비과세 사례의 장기요양과 공제합계를 독립 정수 산술로 검증한다', () => {
    for (const taxable of [0, 100000, 1390821, 2000000, 2781700, 3000000, 3456789, 5000000, 10000000, 20000000]) {
        for (const nonTaxable of [0, 200000]) {
            const result = run('2027-01-15T12:00:00+09:00', taxable, nonTaxable);
            assert.ok(result);
            const m = result.monthly;
            const expected = Number(BigInt(m.health) * BigInt(139) / BigInt(10000) * BigInt(10));
            assert.equal(m.longTermCare, expected);
            assert.equal(m.totalDeductions, m.pension + m.health + expected + m.employment + m.incomeTax + m.localTax);
            assert.equal(m.netPay, m.gross - m.totalDeductions);
        }
    }
});

test('2027년 모든 10원 단위 건보료 표본은 13.90%의 정확한 내림과 일치한다', () => {
    for (let health = 0; health <= 719000; health += 10) {
        const taxable = Math.ceil(health * 100000 / 3595);
        const result = run('2027-06-30T12:00:00+09:00', taxable);
        assert.ok(result);
        const expected = Number(BigInt(result.monthly.health) * BigInt(139) / BigInt(10000) * BigInt(10));
        assert.equal(result.monthly.longTermCare, expected, `건보료 ${health}`);
    }
});

test('2027년 경계는 프로세스 시간대와 무관하게 한국시각 0시다', () => {
    const original = process.env.TZ;
    try {
        for (const tz of ['UTC', 'Asia/Seoul', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
            process.env.TZ = tz;
            assert.equal(run('2026-12-31T14:59:59.999Z')?.monthly.longTermCare, 13140);
            assert.equal(run('2026-12-31T15:00:00Z')?.monthly.longTermCare, 13900);
        }
    } finally {
        if (original === undefined) delete process.env.TZ;
        else process.env.TZ = original;
    }
});
