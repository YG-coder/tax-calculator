import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSalary } from '../src/lib/tax/calculators/salary-orchestrator.ts';

// 기대값은 함수와 따로 정수 산술로 구한다.
// - 건강보험료: 과세 월급 × 100,000분의 3595(기존 0.03595) → 10원 미만 버림
// - 장기요양보험료: 건강보험료 × 1만분의 1314(기존 0.1314) → 10원 미만 버림
const healthExpected = (taxable: number) => Math.floor((taxable * 3595) / 1_000_000) * 10;
const ltcExpected = (health: number) => Math.floor((health * 1314) / 100_000) * 10;
// 건강보험료가 health가 되는 가장 작은 과세 월급: ceil(health × 100,000 / 3595)
const taxableForHealth = (health: number) => Math.floor((health * 100_000 + 3594) / 3595);

const AT = new Date('2026-08-15T12:00:00+09:00');
const run = (taxable: number, nonTaxable = 0, at = AT) =>
    simulateSalary({ annualSalary: (taxable + nonTaxable) * 12, nonTaxableMonthly: nonTaxable, dependents: 1 }, at);

test('simulateSalary 장기요양: 건강보험료 50,000원이면 6,570원이다', () => {
    const taxable = taxableForHealth(50_000);
    assert.equal(taxable, 1_390_821);
    const r = run(taxable);
    assert.ok(r);
    assert.equal(r.monthly.health, 50_000);
    assert.equal(r.monthly.longTermCare, 6_570);
    // 같은 건강보험료 구간의 끝 값도 같다
    assert.equal(run(1_391_098)?.monthly.health, 50_000);
    assert.equal(run(1_391_098)?.monthly.longTermCare, 6_570);
    // 2027년 구간에서도 같다(장기요양은 날짜와 무관)
    assert.equal(run(taxable, 0, new Date('2027-01-15T12:00:00+09:00'))?.monthly.longTermCare, 6_570);
});

test('simulateSalary 장기요양: 보고된 건강보험료 사례가 정확한 값이다', () => {
    const cases: [number, number][] = [
        [100_000, 13_140],
        [200_000, 26_280],
        [350_000, 45_990],
        [400_000, 52_560],
        [450_000, 59_130],
        [700_000, 91_980],
    ];
    for (const [health, expected] of cases) {
        assert.equal(ltcExpected(health), expected, `기대값 계산 ${health}`);
        const r = run(taxableForHealth(health));
        assert.equal(r?.monthly.health, health, `건강보험료 ${health}`);
        assert.equal(r?.monthly.longTermCare, expected, `건강보험료 ${health}원의 장기요양`);
    }
});

test('simulateSalary 장기요양: 정상값은 그대로다', () => {
    const cases: [number, number, number][] = [
        // [과세 월급, 건강보험료, 장기요양]
        [3_000_000, 107_850, 14_170],
        [4_172_462, 150_000, 19_710],
        [2_000_000, 71_900, 9_440],
        [0, 0, 0],
    ];
    for (const [taxable, health, ltc] of cases) {
        assert.equal(healthExpected(taxable), health, `기대값 계산 ${taxable}`);
        assert.equal(ltcExpected(health), ltc, `기대값 계산 ${health}`);
        const r = run(taxable);
        assert.equal(r?.monthly.health, health, `${taxable}원 건강보험료`);
        assert.equal(r?.monthly.longTermCare, ltc, `${taxable}원 장기요양`);
    }
});

test('simulateSalary 장기요양: 나눠떨어지는 건강보험료(5만 원 배수)의 직전·경계·직후', () => {
    // 1314/100,000 × 건강보험료가 정수가 되는 건강보험료는 5만 원의 배수다(버림 경계).
    for (let health = 50_000; health <= 700_000; health += 50_000) {
        for (const h of [health - 10, health, health + 10]) {
            const r = run(taxableForHealth(h));
            assert.equal(r?.monthly.health, h, `건강보험료 ${h}`);
            assert.equal(r?.monthly.longTermCare, ltcExpected(h), `건강보험료 ${h}원의 장기요양`);
        }
        assert.equal(ltcExpected(health), (health / 50_000) * 6_570);
        assert.equal(ltcExpected(health - 10), (health / 50_000) * 6_570 - 10);
    }
});

test('simulateSalary 장기요양: 비과세액이 있으면 과세 월급의 건강보험료로 계산한다', () => {
    const r = run(1_390_821, 200_000);
    assert.ok(r);
    assert.equal(r.monthly.gross, 1_590_821);
    assert.equal(r.monthly.health, 50_000);
    assert.equal(r.monthly.longTermCare, 6_570);
    const zero = run(0, 5_000_000);
    assert.equal(zero?.monthly.health, 0);
    assert.equal(zero?.monthly.longTermCare, 0);
});

test('simulateSalary 장기요양: 건강보험료 0~719,000원의 모든 10원 단위에서 정확한 값이다', () => {
    let checked = 0;
    for (let health = 0; health <= 719_000; health += 10) {
        const m = run(taxableForHealth(health))?.monthly;
        assert.equal(m?.health, health, `건강보험료 ${health}`);
        if (m?.longTermCare !== ltcExpected(health)) assert.fail(`건강보험료 ${health}원: ${m?.longTermCare} ≠ ${ltcExpected(health)}`);
        checked++;
    }
    assert.equal(checked, 71_901);
});

test('simulateSalary 장기요양: 공제합계와 실수령액이 공제액과 맞는다', () => {
    for (const taxable of [1_390_821, 2_781_642, 19_471_489, 3_000_000]) {
        const m = run(taxable)?.monthly;
        assert.ok(m);
        assert.equal(m.totalDeductions, m.pension + m.health + m.longTermCare + m.employment + m.incomeTax + m.localTax);
        assert.equal(m.netPay, m.gross - m.totalDeductions);
    }
});
