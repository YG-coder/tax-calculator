import { PRODUCTION_ANNUAL_LIMIT, productionRulesForYear } from '../config/verified/production-exemption.ts'
export { PRODUCTION_ANNUAL_LIMIT } from '../config/verified/production-exemption.ts'

/** 일반 생산직 대상 판정. 광산근로자·일용근로자 별도 규정은 계산기 지원 범위 밖이다. */
export function isProductionEligible({
  year,
  relevantOccupation,
  fixedMonthlyPay,
  previousYearSalary,
}: {
  year: number
  relevantOccupation: boolean
  fixedMonthlyPay: number | null
  previousYearSalary: number | null
}): boolean {
  const rules = productionRulesForYear(year)
  return rules !== null && relevantOccupation &&
    typeof fixedMonthlyPay === 'number' && Number.isSafeInteger(fixedMonthlyPay) &&
    fixedMonthlyPay >= 0 && fixedMonthlyPay <= rules.fixedMonthlyPayLimit &&
    typeof previousYearSalary === 'number' && Number.isSafeInteger(previousYearSalary) &&
    previousYearSalary >= 0 && previousYearSalary <= rules.previousYearSalaryLimit
}

/** 이번 달 실제 잔여 한도와, 동일 급여가 12개월 지급된다는 연간 가정을 구분한다. */
export function calculateProductionExemption({
  monthlyPaid,
  eligible,
  usedThisYear,
}: {
  monthlyPaid: number
  eligible: boolean
  usedThisYear: number
}) {
  const remainingAnnualLimit = Math.max(0, PRODUCTION_ANNUAL_LIMIT - usedThisYear)
  return {
    remainingAnnualLimit,
    monthlyExemption: eligible ? Math.min(monthlyPaid, remainingAnnualLimit) : 0,
    annualExemption: eligible ? Math.min(monthlyPaid * 12, PRODUCTION_ANNUAL_LIMIT) : 0,
  }
}
