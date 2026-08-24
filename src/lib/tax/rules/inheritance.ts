// src/lib/tax/rules/inheritance.ts
//
// 상속세 관련 순수 계산 함수.

import { inheritanceGiftTax } from './rates.ts';

/** 상속세 산출세액 (상증법 §26) — 증여세와 세율표가 같다 */
export function calcInheritanceTax(taxBase: number): number {
    return Math.floor(inheritanceGiftTax(taxBase));
}

/** 배우자 법정상속분 — 배우자 1.5 : 자녀 각 1 (민법 §1009) */
export function spouseStatutoryShare(childCount: number): number {
    return 1.5 / (1.5 + Math.max(0, childCount));
}

/**
 * 배우자 상속공제 (상속세 및 증여세법 §19)
 *   공제액 = min(배우자가 실제 상속받은 금액, 한도)
 *   한도  = min(상속세 과세가액 × 배우자 법정상속분, 30억원)
 *   단, 실제 상속받은 금액이 5억원에 못 미쳐도 5억원은 공제한다.
 *
 * "배우자가 있으면 무조건 10억 공제"가 아니다.
 */
export function spouseDeduction(
    taxableEstate: number,
    childCount: number,
    spouseActualInheritance: number,
): number {
    const MIN = 500_000_000;
    const CAP = 3_000_000_000;
    const limit = Math.min(taxableEstate * spouseStatutoryShare(childCount), CAP);
    return Math.max(MIN, Math.min(spouseActualInheritance, limit));
}
