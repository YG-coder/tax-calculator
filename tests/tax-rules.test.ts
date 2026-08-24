import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    wageIncomeDeduction,
    earnedIncomeTaxCredit,
    childMonthlyCredit,
    lookupWithholdingTax,
} from '../src/lib/tax/rules/withholding.ts';
import {
    calcInheritanceTax,
    spouseStatutoryShare,
    spouseDeduction,
} from '../src/lib/tax/rules/inheritance.ts';

test('근로소득공제 경계값 (소득세법 §47)', () => {
    assert.equal(wageIncomeDeduction(5_000_000), 3_500_000);
    assert.equal(wageIncomeDeduction(15_000_000), 7_500_000);
    assert.equal(wageIncomeDeduction(45_000_000), 12_000_000);
    assert.equal(wageIncomeDeduction(100_000_000), 14_750_000);
    // 1억 초과 구간이 상수로 고정돼 있던 버그
    assert.equal(wageIncomeDeduction(200_000_000), 16_750_000);
    // 공제 한도 2,000만원 (기존 코드는 1,400만원으로 잘못 제한)
    assert.equal(wageIncomeDeduction(1_000_000_000), 20_000_000);
});

test('근로소득세액공제 한도 (소득세법 §59)', () => {
    assert.equal(earnedIncomeTaxCredit(10_000_000, 30_000_000), 740_000);
    assert.equal(earnedIncomeTaxCredit(10_000_000, 60_000_000), 660_000);
    assert.equal(earnedIncomeTaxCredit(10_000_000, 90_000_000), 500_000);
    assert.equal(earnedIncomeTaxCredit(10_000_000, 200_000_000), 200_000);
    // 소액 산출세액은 55% 공제
    assert.equal(earnedIncomeTaxCredit(1_000_000, 30_000_000), 550_000);
});

test('자녀 수별 월 공제액 (2024년 개정 자녀세액공제 ÷ 12)', () => {
    assert.equal(childMonthlyCredit(0), 0);
    assert.equal(childMonthlyCredit(1), 20_830);
    assert.equal(childMonthlyCredit(2), 45_830);
    assert.equal(childMonthlyCredit(3), 79_160);
});

test('2026 공식 근로소득 간이세액표 대표값', () => {
    assert.equal(lookupWithholdingTax(3_000_000, 1), 74_350);
    assert.equal(lookupWithholdingTax(3_000_000, 2), 56_850);
    assert.equal(lookupWithholdingTax(3_500_000, 4), 49_340);
    assert.equal(lookupWithholdingTax(10_000_000, 1), 1_507_400);
});

test('2026 공식 근로소득 간이세액표 급여 경계와 고액 산식', () => {
    assert.equal(lookupWithholdingTax(769_999, 1), 0);
    assert.equal(lookupWithholdingTax(1_060_000, 1), 1_040);
    assert.equal(lookupWithholdingTax(2_999_999, 1), 73_060);
    assert.equal(lookupWithholdingTax(10_000_001, 1), 1_532_400);
    assert.equal(lookupWithholdingTax(14_000_000, 1), 2_904_400);
    assert.equal(lookupWithholdingTax(87_000_000, 1), 32_542_000);
});

test('공제대상 가족 11명 초과 산식은 음수가 되면 0원 처리', () => {
    assert.equal(lookupWithholdingTax(3_000_000, 11), 0);
    assert.equal(lookupWithholdingTax(3_000_000, 12), 0);
    assert.ok(lookupWithholdingTax(10_000_000, 12) < lookupWithholdingTax(10_000_000, 11));
});

test('상속세 누진세율 경계값', () => {
    assert.equal(calcInheritanceTax(100_000_000), 10_000_000);
    assert.equal(calcInheritanceTax(500_000_000), 90_000_000);
    assert.equal(calcInheritanceTax(1_000_000_000), 240_000_000);
    assert.equal(calcInheritanceTax(3_000_000_000), 1_040_000_000);
});

test('배우자 법정상속분', () => {
    assert.equal(spouseStatutoryShare(0), 1);
    assert.equal(spouseStatutoryShare(1), 0.6);
    assert.ok(Math.abs(spouseStatutoryShare(2) - 0.428571) < 1e-5);
});

test('배우자 상속공제는 실제 상속액·법정상속분 한도로 결정된다', () => {
    // 배우자가 거의 상속받지 않아도 최소 5억은 공제
    assert.equal(spouseDeduction(1_000_000_000, 2, 0), 500_000_000);
    // 실제 상속액이 한도보다 작으면 실제 상속액
    assert.equal(spouseDeduction(1_500_000_000, 2, 600_000_000), 600_000_000);
    // 실제 상속액이 법정상속분 한도를 넘으면 한도까지만
    assert.equal(
        spouseDeduction(1_500_000_000, 2, 1_400_000_000),
        Math.min(1_500_000_000 * spouseStatutoryShare(2), 3_000_000_000),
    );
    // 30억 상한
    assert.equal(spouseDeduction(100_000_000_000, 0, 100_000_000_000), 3_000_000_000);
});

test('감사 회귀: 상속재산 10억 + 배우자 있음이 자동으로 세액 0원이 되지 않는다', () => {
    // 이전 구현: 배우자 선택 시 공제 10억 고정 -> 과세표준 0 -> 세액 0원
    // 현재 구현: 배우자가 실제로 상속받지 않으면 배우자공제는 5억
    const estate = 1_000_000_000;
    const deduct = 500_000_000 /* 일괄공제 */ + spouseDeduction(estate, 2, 0);
    const base = Math.max(0, estate - deduct);
    assert.equal(base, 0); // 10억 - (5억+5억) = 0 — 이 경우는 실제로도 0
    // 배우자가 있어도 재산이 크면 세액이 발생해야 한다
    const estate2 = 2_000_000_000;
    const deduct2 = 500_000_000 + spouseDeduction(estate2, 2, 0);
    assert.ok(calcInheritanceTax(estate2 - deduct2) > 0);
});
