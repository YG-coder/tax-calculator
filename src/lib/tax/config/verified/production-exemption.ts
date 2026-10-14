// 확인일: 2026-10-14. 소득세법 시행령 제17조 및 제36129호(2026-02-27) 부칙 제3조.
// 대상 확대는 2026년 과세기간에 지급받는 급여부터 적용한다. 7월 지급분으로 한정하지 않는다.
export const PRODUCTION_ANNUAL_LIMIT = 2_400_000
export const PRODUCTION_RULES_VERIFIED_AT = '2026-10-14'
export const PRODUCTION_ARTICLE_URL = 'https://www.law.go.kr/LSW/lsLawLinkInfo.do?lsJoLnkSeq=1000318571&chrClsCd=010202'
export const PRODUCTION_AMENDMENT_URL = 'https://www.law.go.kr/LSW/lsRvsDocListP.do?lsId=003956&lsRvsGubun=all&chrClsCd=010202'

// 과거 규정은 덮어쓰지 않고 별도 보존한다. 검증하지 않은 미래 연도는 자동 적용하지 않는다.
export const PRODUCTION_RULES_2025 = {
  taxYear: 2025,
  appliesFrom: '2025-01-01',
  appliesThrough: '2025-12-31',
  fixedMonthlyPayLimit: 2_100_000,
  previousYearSalaryLimit: 30_000_000,
  annualExemptionLimit: PRODUCTION_ANNUAL_LIMIT,
  basis: '제36129호 개정 전 소득세법 시행령 제17조제1항',
} as const

export const PRODUCTION_RULES_2026 = {
  taxYear: 2026,
  appliesFrom: '2026-01-01',
  appliesThrough: '2026-12-31',
  fixedMonthlyPayLimit: 2_600_000,
  previousYearSalaryLimit: 37_000_000,
  annualExemptionLimit: PRODUCTION_ANNUAL_LIMIT,
  publishedOn: '2026-02-27',
  basis: '소득세법 시행령 제17조제1항 및 제36129호 부칙 제3조',
} as const

export function productionRulesForYear(year: number) {
  return [PRODUCTION_RULES_2025, PRODUCTION_RULES_2026].find((rule) => rule.taxYear === year) ?? null
}
