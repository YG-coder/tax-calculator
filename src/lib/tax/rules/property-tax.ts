/**
 * 주택분 재산세 세율·공정시장가액비율 — 여러 계산기가 공유한다.
 *
 * 재산세 계산기와 종합부동산세 계산기가 같은 표를 쓰기 때문에 한 곳에만 둔다.
 * (종부세는 「종합부동산세법 시행령」 제4조의3에 따라 재산세 중복분을 공제할 때
 *  「지방세법」 제111조 제1항 제3호의 재산세 "표준세율"과
 *  「지방세법 시행령」 제109조 제1항 제2호의 공정시장가액비율을 그대로 인용한다.)
 *
 * 근거 (2026-09-01 국가법령정보센터 원문 확인)
 * - 「지방세법」 제110조(과세표준), 제111조 제1항 제3호(주택 표준세율)
 * - 「지방세법」 제111조의2(1세대 1주택에 대한 주택 세율 특례)
 * - 「지방세법 시행령」 제109조 제1항 제2호(공정시장가액비율)
 *   [시행 2026. 7. 1.] [대통령령 제36445호, 2026. 6. 23., 타법개정]
 */

/** 재산세 세율·비율을 확인한 마지막 과세연도 */
export const PROPERTY_TAX_LAST_VERIFIED_YEAR = 2026;

/**
 * 주택분 재산세 공정시장가액비율 — 「지방세법 시행령」 제109조 제1항 제2호.
 *
 * 원칙 60%. 2026년도 납세의무 성립분 중 1세대 1주택으로 인정되는 주택은
 * 시가표준액 3억원 이하 43%, 3억 초과 6억 이하 44%, 6억 초과 45%.
 */
export function propertyFairMarketRatio(isSingleHome: boolean, publishedPrice: number): number {
    if (!isSingleHome) return 0.6;
    if (publishedPrice <= 300_000_000) return 0.43;
    if (publishedPrice <= 600_000_000) return 0.44;
    return 0.45;
}

/** 주택분 재산세 표준세율 — 「지방세법」 제111조 제1항 제3호 */
export function propertyStandardTax(taxBase: number): number {
    if (taxBase <= 0) return 0;
    if (taxBase <= 60_000_000) return taxBase * 0.001;
    if (taxBase <= 150_000_000) return 60_000 + (taxBase - 60_000_000) * 0.0015;
    if (taxBase <= 300_000_000) return 195_000 + (taxBase - 150_000_000) * 0.0025;
    return 570_000 + (taxBase - 300_000_000) * 0.004;
}

/** 1세대 1주택 특례세율 — 「지방세법」 제111조의2 (공시가격 9억원 이하) */
export function propertySpecialTax(taxBase: number): number {
    if (taxBase <= 0) return 0;
    if (taxBase <= 60_000_000) return taxBase * 0.0005;
    if (taxBase <= 150_000_000) return 30_000 + (taxBase - 60_000_000) * 0.001;
    if (taxBase <= 300_000_000) return 120_000 + (taxBase - 150_000_000) * 0.002;
    return 420_000 + (taxBase - 300_000_000) * 0.0035;
}

/** 특례세율 적용 대상인지 — 1세대 1주택이면서 공시가격 9억원 이하 */
export const PROPERTY_SPECIAL_RATE_LIMIT = 900_000_000;

export function usesSpecialRate(isSingleHome: boolean, publishedPrice: number): boolean {
    return isSingleHome && publishedPrice <= PROPERTY_SPECIAL_RATE_LIMIT;
}
