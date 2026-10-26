import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PENSION_LIMITS } from '../src/lib/tax/config/verified/pension-limits.ts';

// 국민연금법 부칙 <법률 제20903호> 제4조제1항: 사업장가입자의 기여금과 사용자의 부담금은 각각
// 2026년 1만분의 475, 2027년 1만분의 500. 설정의 rate는 근로자(기여금) 부담률이다.
const WORKER_RATE_2026 = 475 / 10_000;
const WORKER_RATE_2027 = 500 / 10_000;

const byId = (id: string) => {
    const found = PENSION_LIMITS.find((c) => c.id === id);
    assert.ok(found, `${id} 구간이 없다`);
    return found;
};

// 설정 문자열을 new Date로 읽어 start <= 시각 <= end로 거르는 보조 비교다. simulateSalary와 같은 비교가 아니다.
// 날짜만 적힌 값은 여기서 UTC 0시(한국 9시)로 읽히지만, simulateSalary는 한국 달력의 하루 전체로 본다.
// 이 파일은 이 보조 비교를 다음 시각에만 쓴다.
// - 설정에 한국 시각으로 적힌 2026-07 구간 끝(2026-12-31T23:59:59.999+09:00)과 2027-01 구간 시작(2027-01-01T00:00:00+09:00) 주변:
//   2026-12-31 00:00, 2026-12-31 23:59:59.999, 2027-01-01 00:00, 2027-06-15 12:00(모두 한국 시각)
// - 마지막 구간 끝('2027-06-30') 뒤인 2027-07-01T00:00:00Z(한국 9시)
// 이 시각들은 날짜만 적힌 경계일에 걸리지 않아 두 해석의 결과가 같다.
// 날짜만 적힌 경계의 실제 판정은 tests/salary-orchestrator.test.ts가 simulateSalary로 확인한다.
const periodsAt = (iso: string) => {
    const t = new Date(iso);
    return PENSION_LIMITS.filter((c) => t >= new Date(c.startDate) && t <= new Date(c.endDate)).map((c) => c.id);
};

test('국민연금 2026년 구간의 요율과 상·하한은 그대로다', () => {
    const h1 = byId('KR-PENSION-2026-01');
    assert.equal(h1.startDate, '2026-01-01');
    assert.equal(h1.endDate, '2026-06-30');
    assert.equal(h1.rate, WORKER_RATE_2026);
    assert.equal(h1.floor, 400_000);
    assert.equal(h1.ceiling, 6_370_000);

    const h2 = byId('KR-PENSION-2026-07');
    assert.equal(h2.startDate, '2026-07-01');
    assert.equal(h2.rate, WORKER_RATE_2026);
    assert.equal(h2.floor, 410_000);
    assert.equal(h2.ceiling, 6_590_000);
});

test('국민연금 2027년 1~6월은 근로자 부담률 1만분의 500을 쓴다', () => {
    const p = byId('KR-PENSION-2027-01');
    // 2027년 요율은 한국 시각 2027-01-01 00시부터
    assert.equal(new Date(p.startDate).toISOString(), '2026-12-31T15:00:00.000Z');
    assert.equal(p.endDate, '2027-06-30');
    assert.equal(p.rate, WORKER_RATE_2027);
    // 근로자·사용자 합계(1만분의 1,000)를 근로자 부담률로 쓰지 않는다
    assert.notEqual(p.rate, 1_000 / 10_000);
    // 상·하한은 2026년 7월~2027년 6월 고시 구간 값 그대로
    assert.equal(p.floor, 410_000);
    assert.equal(p.ceiling, 6_590_000);
});

test('한국 시각 2026-12-31과 2027-01-01 사이에 구간이 비거나 겹치지 않는다', () => {
    assert.deepEqual(periodsAt('2026-12-31T00:00:00+09:00'), ['KR-PENSION-2026-07']);
    assert.deepEqual(periodsAt('2026-12-31T23:59:59.999+09:00'), ['KR-PENSION-2026-07']);
    assert.deepEqual(periodsAt('2027-01-01T00:00:00+09:00'), ['KR-PENSION-2027-01']);
    assert.deepEqual(periodsAt('2027-06-15T12:00:00+09:00'), ['KR-PENSION-2027-01']);
});

test('2027년 7월 이후 국민연금 구간은 추정해 두지 않는다', () => {
    const lastEnd = PENSION_LIMITS.map((c) => c.endDate).sort().at(-1);
    assert.equal(lastEnd, '2027-06-30');
    assert.deepEqual(periodsAt('2027-07-01T00:00:00Z'), []);
});

test('국민연금 구간끼리 겹치지 않는다', () => {
    const sorted = [...PENSION_LIMITS].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    for (let i = 1; i < sorted.length; i++) {
        assert.ok(new Date(sorted[i - 1].endDate) < new Date(sorted[i].startDate), `${sorted[i - 1].id}와 ${sorted[i].id}가 겹친다`);
    }
});
