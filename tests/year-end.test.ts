import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_YEAR_END_INPUT, calculateYearEndTax, eligibleChildCredit2026, cardDeduction2026, medicalCredit2026, educationCredit2026, pensionCredit2026, donationCredits2026, type Child, type YearEndInput } from '../src/lib/tax/rules/year-end.ts'

const input = (patch: Partial<YearEndInput> = {}): YearEndInput => ({ ...structuredClone(EMPTY_YEAR_END_INPUT), annualPay: 50_000_000, prepaidIncomeTax: 4_000_000, ...patch })
const calculate = (patch: Partial<YearEndInput> = {}) => {
  const result = calculateYearEndTax(input(patch))
  assert.equal(result.ok, true, JSON.stringify(result))
  if (!result.ok) throw new Error('invalid fixture')
  return result
}
const child = (birthYear: number, patch: Partial<Child> = {}): Child => ({ birthYear, disabled: false, relationship: 'child', adoptedThisYear: false, birthOrder: 'first', ...patch })
const credit = (patch: Partial<YearEndInput>, label: string) => calculate(patch).selected.credits.find((line) => line.label === label)!.amount
const card = (patch: Partial<YearEndInput['card']> = {}) => ({ ...EMPTY_YEAR_END_INPUT.card, ...patch })
const donation = (patch: Partial<YearEndInput['donations']> = {}) => ({ ...EMPTY_YEAR_END_INPUT.donations, ...patch })
const medical = (patch: Partial<YearEndInput['medical']> = {}) => ({ ...EMPTY_YEAR_END_INPUT.medical, ...patch })

describe('2026년 귀속 연말정산: 독립적으로 검산한 정산 예시', () => {
  it('급여 5천만원·선납 소득세 400만원·본인만 공제: 673,750원 환급', () => {
    const r = calculate()
    assert.equal(r.salary, 50_000_000)
    assert.equal(r.wageDeduction, 12_250_000)
    assert.equal(r.wageIncome, 37_750_000)
    assert.equal(r.selected.taxBase, 36_250_000)
    assert.equal(r.selected.grossTax, 4_177_500)
    assert.equal(r.selected.appliedCredits, 790_000)
    assert.equal(r.selected.incomeTax, 3_387_500)
    assert.equal(r.selected.localTax, 338_750)
    assert.equal(r.prepaidLocalTax, 400_000)
    assert.equal(r.refund, 673_750)
    assert.equal(r.additionalPayment, 0)
    assert.equal(r.selected.method, 'standard')
  })
  it('같은 최종세액에 선납이 적으면 추가 납부액이 나온다', () => {
    const r = calculate({ prepaidIncomeTax: 3_000_000, prepaidLocalTax: 300_000 })
    assert.equal(r.additionalPayment, 426_250)
    assert.equal(r.refund, 0)
    assert.equal(r.localTaxAssumed, false)
  })
  it('지방소득세 실제 선납액은 추정액 대신 그대로 쓴다', () => {
    const r = calculate({ prepaidLocalTax: 123_450 })
    assert.equal(r.localDifference, 215_300)
    assert.equal(r.refund, 397_200)
  })
  it('비과세 급여를 먼저 빼서 공제·문턱·세율 기준 총급여를 구한다', () => {
    const r = calculate({ annualPay: 52_400_000, nonTaxablePay: 2_400_000 })
    assert.equal(r.salary, 50_000_000)
    assert.equal(r.refund, 673_750)
  })
  it('선납액이 정확히 최종세액과 같으면 정산액은 0이다', () => {
    const r = calculate({ prepaidIncomeTax: 3_387_500, prepaidLocalTax: 338_750 })
    assert.equal(r.balance, 0)
  })
  it('세액공제는 세금을 0원 아래로 만들지 않으며 선납액만 환급한다', () => {
    const r = calculate({ annualPay: 10_000_000, pensionSaving: 6_000_000, prepaidIncomeTax: 100_000, prepaidLocalTax: 10_000 })
    assert.equal(r.selected.incomeTax, 0)
    assert.equal(r.refund, 110_000)
    assert.ok(r.selected.appliedCredits <= r.selected.grossTax)
  })
  it('지급액 전액이 비과세면 과세표준과 최종세액이 0이다', () => {
    const r = calculate({ nonTaxablePay: 50_000_000 })
    assert.equal(r.selected.taxBase, 0)
    assert.equal(r.refund, 4_400_000)
  })
})

describe('공제 선택·공제 중복 방지', () => {
  it('건강보험료 200만원이면 개별 공제가 유리하다', () => {
    const r = calculate({ annualPay: 40_000_000, healthEmploymentInsurance: 2_000_000 })
    assert.equal(r.standard.incomeTax, 2_013_500)
    assert.equal(r.itemized!.incomeTax, 1_843_500)
    assert.equal(r.selected.method, 'itemized')
    assert.equal(credit({ annualPay: 40_000_000, healthEmploymentInsurance: 2_000_000 }, '표준세액공제'), 0)
  })
  it('건강보험료 10만원이면 표준 공제가 유리하며 건강보험 소득공제를 중복하지 않는다', () => {
    const r = calculate({ annualPay: 40_000_000, healthEmploymentInsurance: 100_000 })
    assert.equal(r.itemized!.incomeTax, 2_128_500)
    assert.equal(r.selected.incomeTax, 2_013_500)
    assert.equal(r.selected.deductions.find((line) => line.label.startsWith('건강'))!.amount, 0)
  })
  it('표준 방식에서도 국민연금·주택청약·카드·연금계좌·정치자금 공제는 남는다', () => {
    const r = calculate({ method: 'standard', publicPension: 2_000_000, housingSavingsDeduction: 1_200_000, card: card({ credit: 20_000_000 }), pensionSaving: 1_000_000, donations: donation({ political: 100_000, hometown: 200_000, general: NaN }) })
    assert.equal(r.selected.appliedDeductions, 5_825_000)
    assert.equal(r.selected.credits.find((line) => line.label.startsWith('연금저축'))!.amount, 150_000)
    assert.equal(r.selected.credits.find((line) => line.label.startsWith('정치'))!.amount, 90_909)
    assert.equal(r.selected.credits.find((line) => line.label.startsWith('고향'))!.amount, 130_909)
    assert.equal(r.selected.credits.find((line) => line.label.startsWith('특례'))!.amount, 0)
  })
  it('직접 개별 방식을 선택하면 자동 선택이 덮어쓰지 않는다', () => {
    const r = calculate({ method: 'itemized' })
    assert.equal(r.selected.incomeTax, 3_517_500)
    assert.equal(r.selected.method, 'itemized')
  })
  it('주택자금·청약·카드 종합한도 2,500만원을 적용하고 국민연금은 별도 공제한다', () => {
    const r = calculate({ method: 'itemized', housingDeduction: 24_000_000, housingSavingsDeduction: 1_200_000, publicPension: 3_000_000, card: card({ credit: 50_000_000 }) })
    assert.equal(r.selected.appliedDeductions, 29_500_000)
  })
})

describe('2026년 자녀 연령·기본공제·출산', () => {
  it('개정 본문과 경과규정: 2016년생 가능, 2017·2018년생 제외', () => {
    assert.equal(eligibleChildCredit2026(2016), true)
    assert.equal(eligibleChildCredit2026(2017), false)
    assert.equal(eligibleChildCredit2026(2018), false)
    assert.equal(eligibleChildCredit2026(NaN), false)
    assert.equal(credit({ children: [child(2016), child(2017), child(2018)] }, '자녀세액공제'), 250_000)
    assert.equal(calculate({ children: [child(2016), child(2017), child(2018)] }).familyCount, 4)
  })
  it('대상 1·2·3명은 각각 25·55·95만원이다', () => {
    for (const [count, expected] of [[1, 250_000], [2, 550_000], [3, 950_000]]) {
      assert.equal(credit({ children: Array.from({ length: count }, () => child(2010)) }, '자녀세액공제'), expected)
    }
  })
  it('20세 나이 경계와 장애인 예외를 검증한다', () => {
    assert.equal(calculateYearEndTax(input({ children: [child(2006)] })).ok, true)
    assert.equal(calculateYearEndTax(input({ children: [child(2005)] })).ok, false)
    assert.equal(calculateYearEndTax(input({ children: [child(2005, { disabled: true })] })).ok, true)
    assert.equal(calculate({ children: [child(2005, { disabled: true })] }).selected.deductions.find((line) => line.label === '추가 인적공제')!.amount, 2_000_000)
  })
  it('2026년 출산은 자녀 정기 세액공제 없이 출산 순위별 공제를 받는다', () => {
    assert.equal(credit({ children: [child(2026, { birthOrder: 'second' })] }, '출산·입양 세액공제'), 500_000)
    assert.equal(credit({ children: [child(2026)] }, '자녀세액공제'), 0)
    assert.equal(credit({ children: [child(2026, { relationship: 'grandchild' })] }, '출산·입양 세액공제'), 0)
  })
  it('입양한 기존 연령 자녀도 입양 순위 공제를 적용한다', () => {
    assert.equal(credit({ children: [child(2010, { adoptedThisYear: true, birthOrder: 'third' })] }, '출산·입양 세액공제'), 700_000)
  })
  it('부녀자 소득 한도와 한부모 우선 적용을 확인한다', () => {
    assert.equal(calculate({ annualPay: 40_000_000, personalExtra: 'woman' }).selected.deductions[1].amount, 500_000)
    assert.equal(calculate({ personalExtra: 'woman' }).selected.deductions[1].amount, 0)
    assert.equal(calculate({ personalExtra: 'singleParent', children: [child(2016)] }).selected.deductions[1].amount, 1_000_000)
    assert.equal(calculateYearEndTax(input({ personalExtra: 'singleParent' })).ok, false)
  })
})

describe('카드·의료·교육·연금 공제 문턱과 개인별 한도', () => {
  it('카드 25% 문턱과 결제수단 순서를 적용한다', () => {
    assert.equal(cardDeduction2026(40_000_000, 0, card({ debitCash: 10_000_000 })).amount, 0)
    assert.equal(cardDeduction2026(40_000_000, 0, card({ credit: 12_000_000, debitCash: 4_000_000 })).amount, 1_500_000)
  })
  it('2026년 자녀 수별 카드 기본 한도를 적용한다', () => {
    for (const [salary, caps] of [[70_000_000, [3_000_000, 3_500_000, 4_000_000]], [70_000_001, [2_500_000, 2_750_000, 3_000_000]]] as const) {
      caps.forEach((cap, count) => assert.equal(cardDeduction2026(salary, count, card({ credit: 100_000_000 })).amount, cap))
    }
    assert.equal(calculate({ children: [child(2026)] }).card.cap, 3_500_000)
  })
  it('시장·교통 추가한도는 실제 특별 사용분의 공제액만 인정한다', () => {
    const r = cardDeduction2026(40_000_000, 0, card({ credit: 40_000_000, market: 3_000_000 }))
    assert.equal(r.raw, 5_700_000)
    assert.equal(r.extra, 1_200_000)
    assert.equal(r.amount, 4_200_000)
    assert.equal(cardDeduction2026(40_000_000, 0, card({ market: 100_000_000 })).amount, 6_000_000)
  })
  it('총급여 7천만원 초과 문화체육비는 실제 결제수단으로 처리한다', () => {
    assert.equal(cardDeduction2026(80_000_000, 0, card({ cultureCredit: 22_000_000 })).amount, 300_000)
    assert.equal(cardDeduction2026(80_000_000, 0, card({ cultureDebit: 22_000_000 })).amount, 600_000)
  })
  it('의료비 문턱을 순차 차감하며 난임 30%까지 정확히 반영한다', () => {
    assert.equal(medicalCredit2026(50_000_000, medical({ ordinary: 500_000, unlimited: 300_000, premature: 400_000, infertility: 500_000 })).amount, 60_000)
    assert.equal(medicalCredit2026(50_000_000, medical({ ordinary: 10_000_000 })).amount, 1_050_000)
    assert.equal(medicalCredit2026(50_000_000, medical({ unlimited: 10_000_000 })).amount, 1_275_000)
  })
  it('교육비 한도는 대상자별로 적용하며 남은 한도를 다른 사람에게 넘기지 않는다', () => {
    assert.equal(educationCredit2026([{ kind: 'school', amount: 4_000_000 }, { kind: 'school', amount: 1_000_000 }]).amount, 600_000)
    assert.equal(educationCredit2026([{ kind: 'university', amount: 12_000_000 }]).amount, 1_350_000)
    assert.equal(educationCredit2026([{ kind: 'self', amount: 12_000_000 }]).amount, 1_800_000)
  })
  it('연금저축 600만원·합산 900만원, 총급여 5,500만원 공제율 경계를 적용한다', () => {
    assert.equal(pensionCredit2026(55_000_000, 9_000_000, 0, 0, 'retirement').amount, 900_000)
    assert.equal(pensionCredit2026(55_000_000, 6_000_000, 6_000_000, 0, 'retirement').amount, 1_350_000)
    assert.equal(pensionCredit2026(55_000_001, 6_000_000, 3_000_000, 0, 'retirement').amount, 1_080_000)
  })
  it('ISA 추가 한도는 실제 납입액을 넘겨 공제액을 만들어내지 않는다', () => {
    assert.equal(pensionCredit2026(50_000_000, 0, 0, 1_000_000, 'retirement').eligible, 1_000_000)
    assert.equal(pensionCredit2026(50_000_000, 0, 0, 30_000_000, 'retirement').eligible, 12_000_000)
    assert.equal(pensionCredit2026(50_000_000, 0, 0, 30_000_000, 'pension').eligible, 9_000_000)
    assert.equal(pensionCredit2026(50_000_000, 6_000_000, 3_000_000, 30_000_000, 'pension').eligible, 12_000_000)
  })
})

describe('기부금·월세·혼인 공제', () => {
  it('정치자금 3천만원은 총 기부금 기준으로 25% 경계를 나눈다', () => {
    assert.equal(donationCredits2026(100_000_000, donation({ political: 30_000_000 })).political, 4_575_909)
    assert.equal(donationCredits2026(100_000_000, donation({ political: 31_000_000 })).political, 4_825_909)
  })
  it('2026년 고향사랑 10~20만원 구간에 40%를 적용하고 2천만원을 한도로 한다', () => {
    assert.equal(donationCredits2026(100_000_000, donation({ hometown: 200_000 })).hometown, 130_909)
    assert.equal(donationCredits2026(100_000_000, donation({ hometown: 300_000 })).hometown, 145_909)
    assert.equal(donationCredits2026(100_000_000, donation({ hometown: 30_000_000 })).hometownEligible, 20_000_000)
  })
  it('일반·종교 기부금은 소득금액과 30%·10% 한도를 적용한다', () => {
    const r = donationCredits2026(100_000_000, donation({ general: 20_000_000, religious: 20_000_000 }))
    assert.equal(r.generalEligible, 20_000_000)
    assert.equal(r.religiousEligible, 10_000_000)
    assert.equal(r.ordinary, 7_500_000)
    assert.equal(donationCredits2026(40_000_000, donation({ special: 50_000_000 })).specialEligible, 40_000_000)
    assert.equal(donationCredits2026(100_000_000, donation({ religious: 20_000_000 })).religiousEligible, 10_000_000)
  })
  it('월세는 지급액 1천만원 한도와 5,500·8,000만원 급여 경계를 적용한다', () => {
    const patch = { method: 'itemized' as const, rentEligible: true, rentPaid: 12_000_000 }
    assert.equal(credit({ ...patch, annualPay: 55_000_000 }, '월세액 세액공제'), 1_700_000)
    assert.equal(credit({ ...patch, annualPay: 55_000_001 }, '월세액 세액공제'), 1_500_000)
    assert.equal(credit({ ...patch, annualPay: 80_000_000 }, '월세액 세액공제'), 1_500_000)
    assert.equal(credit({ ...patch, annualPay: 80_000_001 }, '월세액 세액공제'), 0)
    assert.equal(credit({ ...patch, rentEligible: false }, '월세액 세액공제'), 0)
    assert.equal(credit({ ...patch, method: 'standard' }, '월세액 세액공제'), 0)
  })
  it('혼인 공제는 본인 한 명 50만원이며 표준 방식에서도 적용한다', () => {
    assert.equal(credit({ method: 'standard', marriedThisYear: true }, '혼인 세액공제'), 500_000)
  })
})

describe('잘못된 입력과 지원 연도', () => {
  it('음수·소수·무한대·한도 초과는 결과를 반환하지 않는다', () => {
    for (const annualPay of [-1, 0, 1.1, Infinity, 1_000_000_000_001]) assert.equal(calculateYearEndTax(input({ annualPay })).ok, false)
    assert.equal(calculateYearEndTax(input({ nonTaxablePay: 50_000_001 })).ok, false)
    assert.equal(calculateYearEndTax(input({ prepaidIncomeTax: NaN })).ok, false)
    assert.equal(calculateYearEndTax(input({ otherDependents: 0.5 })).ok, false)
  })
  it('활성 입력만 검사하고 숨겨진 월세·표준 제외 항목 오류는 무시한다', () => {
    assert.equal(calculateYearEndTax(input({ rentEligible: false, rentPaid: NaN })).ok, true)
    assert.equal(calculateYearEndTax(input({ rentEligible: true, rentPaid: NaN })).ok, false)
    assert.equal(calculateYearEndTax(input({ method: 'standard', healthEmploymentInsurance: NaN, insurance: NaN, medical: medical({ ordinary: NaN }), education: [{ kind: 'school', amount: NaN }], donations: donation({ general: NaN }) })).ok, true)
    assert.equal(calculateYearEndTax(input({ healthEmploymentInsurance: NaN })).ok, false)
  })
  it('선납 0원도 정상 입력이며 확인하지 않은 과거·미래 연도로 기준을 재사용하지 않는다', () => {
    assert.equal(calculate({ prepaidIncomeTax: 0 }).additionalPayment, 3_726_250)
    for (const year of [2025, 2027]) assert.equal(calculateYearEndTax(input({ year })).ok, false)
  })
})
