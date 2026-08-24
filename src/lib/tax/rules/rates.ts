// src/lib/tax/rules/rates.ts
//
// 세율표는 여러 계산기가 공유한다. 한 곳에만 둬서 표가 어긋나지 않게 한다.

/**
 * 소득세 기본세율 (소득세법 §55) — 6~45%.
 * 종합소득세·양도소득세(기본세율)와 원천징수 회귀 비교용 계산이 이 표를 쓴다.
 * 원 단위 절사는 호출하는 쪽에서 한다.
 */
export function basicIncomeTax(taxBase: number): number {
    if (taxBase <= 0) return 0;
    if (taxBase <= 14_000_000) return taxBase * 0.06;
    if (taxBase <= 50_000_000) return 840_000 + (taxBase - 14_000_000) * 0.15;
    if (taxBase <= 88_000_000) return 6_240_000 + (taxBase - 50_000_000) * 0.24;
    if (taxBase <= 150_000_000) return 15_360_000 + (taxBase - 88_000_000) * 0.35;
    if (taxBase <= 300_000_000) return 37_060_000 + (taxBase - 150_000_000) * 0.38;
    if (taxBase <= 500_000_000) return 94_060_000 + (taxBase - 300_000_000) * 0.4;
    if (taxBase <= 1_000_000_000) return 174_060_000 + (taxBase - 500_000_000) * 0.42;
    return 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
}

/**
 * 상속세·증여세 누진세율 (상증법 §26, §56) — 10~50%.
 * 두 세목의 세율표는 동일하다.
 */
export function inheritanceGiftTax(taxBase: number): number {
    if (taxBase <= 0) return 0;
    if (taxBase <= 100_000_000) return taxBase * 0.1;
    if (taxBase <= 500_000_000) return 10_000_000 + (taxBase - 100_000_000) * 0.2;
    if (taxBase <= 1_000_000_000) return 90_000_000 + (taxBase - 500_000_000) * 0.3;
    if (taxBase <= 3_000_000_000) return 240_000_000 + (taxBase - 1_000_000_000) * 0.4;
    return 1_040_000_000 + (taxBase - 3_000_000_000) * 0.5;
}

/** 지방소득세(소득분) = 소득세 × 10%. 상속세·증여세에는 부과되지 않는다. */
export function localIncomeTax(incomeTax: number): number {
    return Math.floor(incomeTax * 0.1);
}
