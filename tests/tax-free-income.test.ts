import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { calculateProductionExemption, isProductionEligible } from '../src/lib/tax/rules/tax-free-income.ts'
import { productionRulesForYear } from '../src/lib/tax/config/verified/production-exemption.ts'

const exemption = (monthlyPaid: number, usedThisYear = 0, eligible = true) =>
  calculateProductionExemption({monthlyPaid, usedThisYear, eligible})

describe('생산직 초과근로수당: 이번 달 계산과 연간 예상', () => {
  it('기본급 200만원·수당 20만원이면 연간 과세급여는 2,400만원이다', () => {
    const result = exemption(200_000)
    const annualGross = (2_000_000 + 200_000) * 12
    assert.equal(result.monthlyExemption, 200_000)
    assert.equal(annualGross, 26_400_000)
    assert.equal(result.annualExemption, 2_400_000)
    assert.equal(annualGross - result.annualExemption, 24_000_000)
  })

  it('월 수당이 적으면 연간 한도 대신 실제 12개월 지급액만 비과세한다', () => {
    assert.equal(exemption(100_000).annualExemption, 1_200_000)
  })

  it('월 수당이 많아도 연간 비과세액은 240만원을 넘지 않는다', () => {
    assert.equal(exemption(500_000).annualExemption, 2_400_000)
  })

  it('누적 비과세액은 이번 달 한도만 줄이고 동일 급여의 연간 예상은 바꾸지 않는다', () => {
    const result = exemption(200_000, 2_300_000)
    assert.equal(result.remainingAnnualLimit, 100_000)
    assert.equal(result.monthlyExemption, 100_000)
    assert.equal(result.annualExemption, 2_400_000)
  })

  it('연간 한도를 이미 소진하면 이번 달 비과세는 0원이다', () => {
    for (const used of [2_400_000, 2_500_000]) {
      const result = exemption(200_000, used)
      assert.equal(result.remainingAnnualLimit, 0)
      assert.equal(result.monthlyExemption, 0)
      assert.equal(result.annualExemption, 2_400_000)
    }
  })

  it('생산직 옵션을 끄거나 요건을 충족하지 않으면 월·연 비과세를 적용하지 않는다', () => {
    const result = exemption(200_000, 1_000_000, false)
    assert.equal(result.monthlyExemption, 0)
    assert.equal(result.annualExemption, 0)
  })

  it('이번 달 수당이 없으면 과거 누적 비과세만으로 연간 예상 공제를 만들지 않는다', () => {
    const result = exemption(0, 1_000_000)
    assert.equal(result.monthlyExemption, 0)
    assert.equal(result.annualExemption, 0)
  })
})

const eligible = (year: number, fixedMonthlyPay: number | null, previousYearSalary: number | null, relevantOccupation = true) =>
  isProductionEligible({year, fixedMonthlyPay, previousYearSalary, relevantOccupation})

describe('생산직 대상 기준의 2026년 개정 및 적용례', () => {
  it('2025년 210만원·3천만원 기준을 보존한다', () => {
    assert.equal(eligible(2025, 2_100_000, 30_000_000), true)
    assert.equal(eligible(2025, 2_100_001, 30_000_000), false)
    assert.equal(eligible(2025, 2_100_000, 30_000_001), false)
  })

  it('종전 기준을 넘더라도 2026년 확대 기준 이하면 비과세 대상이다', () => {
    assert.equal(eligible(2025, 2_300_000, 32_000_000), false)
    const qualifies = eligible(2026, 2_300_000, 32_000_000)
    assert.equal(qualifies, true)
    assert.equal(exemption(200_000, 0, qualifies).annualExemption, 2_400_000)
  })

  it('2026년 260만원·3,700만원 경계값은 포함하고 1원 초과는 제외한다', () => {
    assert.equal(eligible(2026, 2_600_000, 37_000_000), true)
    assert.equal(eligible(2026, 2_600_001, 37_000_000), false)
    assert.equal(eligible(2026, 2_600_000, 37_000_001), false)
  })

  it('해당 월정액급여가 기준을 넘으면 수당은 월·연 예상 모두 전액 과세한다', () => {
    const result = exemption(500_000, 0, eligible(2026, 2_600_001, 30_000_000))
    assert.equal(result.monthlyExemption, 0)
    assert.equal(result.annualExemption, 0)
  })

  it('부칙 제3조에 따라 확대 기준은 2026년 전체 과세기간 급여에 적용한다', () => {
    const rules = productionRulesForYear(2026)!
    assert.equal(rules.appliesFrom, '2026-01-01')
    assert.equal(rules.appliesThrough, '2026-12-31')
    for (const paymentDate of ['2026-01-01', '2026-06-30', '2026-07-01', '2026-12-31']) {
      assert.ok(paymentDate >= rules.appliesFrom && paymentDate <= rules.appliesThrough)
      assert.equal(eligible(Number(paymentDate.slice(0, 4)), 2_300_000, 32_000_000), true)
    }
  })

  it('빈 입력과 0원 입력을 구분하고 대상 직종 확인을 요구한다', () => {
    assert.equal(eligible(2026, null, 30_000_000), false)
    assert.equal(eligible(2026, 2_000_000, null), false)
    assert.equal(eligible(2026, 2_000_000, 0), true)
    assert.equal(eligible(2026, 2_000_000, 30_000_000, false), false)
  })

  it('검증하지 않은 과거·미래 연도에 현재 규정을 자동 적용하지 않는다', () => {
    for (const year of [2024, 2027, NaN]) {
      assert.equal(productionRulesForYear(year), null)
      assert.equal(eligible(year, 2_000_000, 30_000_000), false)
    }
  })

  it('음수·비정상 급여는 대상 판정에서 제외한다', () => {
    for (const amount of [-1, Infinity, NaN, 1.5]) {
      assert.equal(eligible(2026, amount, 30_000_000), false)
      assert.equal(eligible(2026, 2_000_000, amount), false)
    }
  })
})
