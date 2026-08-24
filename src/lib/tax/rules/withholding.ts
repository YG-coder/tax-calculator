// src/lib/tax/rules/withholding.ts
//
// 근로소득 원천징수 관련 순수 계산 함수.
// UI 컴포넌트에서 분리해 테스트 가능한 형태로 둔다.

import { basicIncomeTax } from './rates.ts';
export { lookupWithholdingTax } from './withholding-engine.ts';

/** 근로소득공제 (소득세법 §47) — 공제 한도 2,000만원 */
export function wageIncomeDeduction(annual: number): number {
    let d: number;
    if (annual <= 5_000_000) d = annual * 0.7;
    else if (annual <= 15_000_000) d = 3_500_000 + (annual - 5_000_000) * 0.4;
    else if (annual <= 45_000_000) d = 7_500_000 + (annual - 15_000_000) * 0.15;
    else if (annual <= 100_000_000) d = 12_000_000 + (annual - 45_000_000) * 0.05;
    else d = 14_750_000 + (annual - 100_000_000) * 0.02;
    return Math.min(d, 20_000_000);
}

/** 근로소득세액공제 (소득세법 §59) — 총급여 구간별 한도 적용 */
export function earnedIncomeTaxCredit(grossTax: number, annualSalary: number): number {
    const credit =
        grossTax <= 1_300_000 ? grossTax * 0.55 : 715_000 + (grossTax - 1_300_000) * 0.3;

    let cap: number;
    if (annualSalary <= 33_000_000) cap = 740_000;
    else if (annualSalary <= 70_000_000)
        cap = Math.max(660_000, 740_000 - (annualSalary - 33_000_000) * 0.008);
    else if (annualSalary <= 120_000_000)
        cap = Math.max(500_000, 660_000 - (annualSalary - 70_000_000) * 0.5);
    else cap = Math.max(200_000, 500_000 - (annualSalary - 120_000_000) * 0.5);

    return Math.min(credit, cap);
}

/**
 * 8세 이상 20세 이하 자녀 수에 따른 월 공제액.
 * 자녀세액공제(소득세법 §59의2, 2024년 개정) 연 25만 / 55만 / 초과 1명당 40만원을
 * 12개월로 나눈 금액이 간이세액표에 반영되어 있다.
 */
export function childMonthlyCredit(childCount: number): number {
    const n = Math.max(0, childCount);
    if (n === 0) return 0;
    if (n === 1) return 20_830;
    if (n === 2) return 45_830;
    return 45_830 + (n - 2) * 33_330;
}

/**
 * 월 원천징수 근로소득세 근사 계산(회귀 비교용).
 *
 * 국세청 근로소득 간이세액표(소득세법 시행령 별표2)를 직접 조회하지 않는다.
 * 연 환산 후 연말정산 방식으로 재계산한 근사값이라 공식 표와 차이가 난다.
 * (예: 월급여 300만원·부양가족 1명 → 공식 표 74,350원 / 본 근사식 약 61,500원)
 * 화면 계산에는 사용하지 않고 공식 표 조회와의 회귀 비교에만 사용한다.
 */
export function calcWithholdingTax(monthlyTaxable: number, dependents: number): number {
    const annual = monthlyTaxable * 12;
    const taxBase = Math.max(
        0,
        annual - wageIncomeDeduction(annual) - 1_500_000 * Math.max(1, dependents),
    );
    const grossTax = basicIncomeTax(taxBase);
    const annualTax = Math.max(0, grossTax - earnedIncomeTaxCredit(grossTax, annual));
    return Math.floor(Math.floor(annualTax / 12) / 10) * 10;
}
