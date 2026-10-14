import { YEAR_END_2026 as R } from '../config/verified/year-end-2026.ts'
import { basicIncomeTax } from './rates.ts'
import { wageIncomeDeduction, earnedIncomeTaxCredit } from './withholding.ts'

export type DeductionMethod = 'auto' | 'itemized' | 'standard'
export type Child = {
  birthYear: number
  disabled: boolean
  relationship: 'child' | 'grandchild'
  adoptedThisYear: boolean
  birthOrder: 'first' | 'second' | 'third'
}
export type EducationRelationship = 'self' | 'descendant' | 'spouse' | 'sibling' | 'parent'
export type EducationExpense = { relationship: EducationRelationship; kind: keyof typeof R.educationLimits; amount: number }
export type YearEndInput = {
  year: number
  annualPay: number
  nonTaxablePay: number
  prepaidIncomeTax: number
  prepaidLocalTax: number | null
  otherDependents: number
  selfSenior: boolean
  selfDisabled: boolean
  seniorOthers: number
  disabledOthers: number
  personalExtra: 'none' | 'woman' | 'singleParent'
  children: Child[]
  publicPension: number
  healthEmploymentInsurance: number
  housingDeduction: number
  housingSavingsDeduction: number
  card: { credit: number; debitCash: number; market: number; transit: number; cultureCredit: number; cultureDebit: number }
  pensionSaving: number
  retirementSaving: number
  isaTransfer: number
  isaTarget: 'pension' | 'retirement'
  insurance: number
  disabilityInsurance: number
  medical: { ordinary: number; unlimited: number; premature: number; infertility: number }
  education: EducationExpense[]
  donations: { political: number; hometown: number; special: number; general: number; religious: number }
  rentEligible: boolean
  rentPaid: number
  marriedThisYear: boolean
  method: DeductionMethod
}
export const EMPTY_YEAR_END_INPUT: YearEndInput = {
  year: 2026, annualPay: 0, nonTaxablePay: 0, prepaidIncomeTax: 0, prepaidLocalTax: null,
  otherDependents: 0, selfSenior: false, selfDisabled: false, seniorOthers: 0, disabledOthers: 0, personalExtra: 'none', children: [],
  publicPension: 0, healthEmploymentInsurance: 0, housingDeduction: 0, housingSavingsDeduction: 0,
  card: { credit: 0, debitCash: 0, market: 0, transit: 0, cultureCredit: 0, cultureDebit: 0 },
  pensionSaving: 0, retirementSaving: 0, isaTransfer: 0, isaTarget: 'retirement', insurance: 0, disabilityInsurance: 0,
  medical: { ordinary: 0, unlimited: 0, premature: 0, infertility: 0 }, education: [],
  donations: { political: 0, hometown: 0, special: 0, general: 0, religious: 0 },
  rentEligible: false, rentPaid: 0, marriedThisYear: false, method: 'auto',
}
export type TaxLine = { label: string; amount: number; note?: string }
const percent = (amount: number, rate: number) => Math.floor(amount * rate / 100)
const tenWon = (amount: number) => Math.floor(Math.max(0, amount) / 10) * 10
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

/** 2026년 자녀세액공제의 본문 연령과 경과규정을 함께 적용한다. 기본공제 요건은 별도로 검증한다. */
export function eligibleChildCredit2026(birthYear: number): boolean {
  return Number.isInteger(birthYear) && birthYear >= 1900 && birthYear <= R.year &&
    R.year - birthYear >= R.childMinimumAge && birthYear !== R.excludedChildBirthYear
}

/** 특별 사용분은 일반 신용·체크 사용분과 중복하지 않는다. 문화비는 7천만원 초과 시 원 결제수단으로 환원한다. */
export function cardDeduction2026(salary: number, children: number, card: YearEndInput['card']) {
  const low = salary <= R.cardSalaryThreshold
  const culture = low ? card.cultureCredit + card.cultureDebit : 0
  const credit = card.credit + (low ? 0 : card.cultureCredit)
  const debit = card.debitCash + (low ? 0 : card.cultureDebit)
  let threshold = salary * 25 / 100
  const tier = (amount: number, rate: number) => {
    const used = Math.min(amount, threshold)
    threshold -= used
    return (amount - used) * rate / 100
  }
  const raw = Math.floor(tier(credit, 15) + tier(debit + culture, 30) + tier(card.market + card.transit, 40))
  const cap = (low ? R.cardLowSalaryCaps : R.cardHighSalaryCaps)[Math.max(0, Math.min(2, Math.floor(children)))]
  const special = percent(card.market + card.transit, 40) + percent(culture, 30)
  const extra = Math.min(Math.max(0, raw - cap), special, low ? R.cardLowExtraLimit : R.cardHighExtraLimit)
  return { amount: Math.min(raw, cap) + extra, raw, cap, extra, threshold: salary * 25 / 100 }
}

/** 의료비 3% 문턱은 일반→한도 없는 항목→미숙아→난임 순서로 차감한다(제59조의4 제2항). */
export function medicalCredit2026(salary: number, medical: YearEndInput['medical']) {
  let threshold = salary * 3 / 100
  const eligible = (amount: number) => {
    const used = Math.min(amount, threshold)
    threshold -= used
    return amount - used
  }
  const ordinary = Math.min(eligible(medical.ordinary), R.medicalOrdinaryLimit)
  const unlimited = eligible(medical.unlimited)
  const premature = eligible(medical.premature)
  const infertility = eligible(medical.infertility)
  return {
    amount: percent(ordinary + unlimited, 15) + percent(premature, 20) + percent(infertility, 30),
    ordinary, unlimited, premature, infertility,
  }
}

export function educationCredit2026(education: EducationExpense[]) {
  const eligible = sum(education.map(({ kind, amount }) => {
    const cap = R.educationLimits[kind]
    return cap === null ? amount : Math.min(amount, cap)
  }))
  return { amount: percent(eligible, 15), eligible }
}

/** 해당 연도 기부금만 계산한다. 일반기부금은 소득금액 한도를 적용하며 이월액은 자동 사용하지 않는다. */
export function donationCredits2026(wageIncome: number, donations: YearEndInput['donations']) {
  const politicalEligible = Math.min(wageIncome, donations.political)
  const political = Math.floor(Math.min(politicalEligible, 100_000) * 100 / 110) +
    percent(Math.min(Math.max(0, politicalEligible - 100_000), 29_900_000), 15) +
    percent(Math.max(0, politicalEligible - 30_000_000), 25)
  const hometownEligible = Math.min(R.hometownPaymentLimit, Math.max(0, wageIncome - politicalEligible), donations.hometown)
  const hometown = Math.floor(Math.min(hometownEligible, 100_000) * 100 / 110) +
    percent(Math.min(Math.max(0, hometownEligible - 100_000), 100_000), 40) +
    percent(Math.max(0, hometownEligible - 200_000), 15)
  const available = Math.max(0, wageIncome - politicalEligible - hometownEligible)
  const specialEligible = Math.min(donations.special, available)
  const generalIncome = available - specialEligible
  const generalLimit = donations.religious > 0
    ? percent(generalIncome, 10) + Math.min(percent(generalIncome, 20), donations.general)
    : percent(generalIncome, 30)
  const generalEligible = Math.min(donations.general, generalLimit)
  const religiousEligible = Math.min(donations.religious, percent(generalIncome, 10), Math.max(0, generalLimit - generalEligible))
  const ordinaryEligible = specialEligible + generalEligible + religiousEligible
  const ordinary = percent(Math.min(ordinaryEligible, 10_000_000), 15) + percent(Math.max(0, ordinaryEligible - 10_000_000), 30)
  return { political, hometown, ordinary, politicalEligible, hometownEligible, specialEligible, generalEligible, religiousEligible }
}

/** ISA 전환은 실제 납입액에 포함한다. 추가 한도는 납입액 자체를 늘리는 공제가 아니다. */
export function pensionCredit2026(salary: number, saving: number, retirement: number, isa: number, target: 'pension' | 'retirement') {
  const extra = Math.min(percent(isa, 10), R.isaAdditionalLimit)
  const savingAmount = saving + (target === 'pension' ? isa : 0)
  const savingCap = R.pensionSavingLimit + (target === 'pension' ? extra : 0)
  const retirementAmount = retirement + (target === 'retirement' ? isa : 0)
  const eligible = Math.min(Math.min(savingAmount, savingCap) + retirementAmount, R.pensionCombinedLimit + extra)
  return { eligible, extra, amount: percent(eligible, salary <= R.pensionSalaryThreshold ? 15 : 12) }
}

function validate(input: YearEndInput): string[] {
  const errors: string[] = []
  if (input.year !== R.year) errors.push('확인한 2026년 귀속 기준만 지원합니다.')
  if (!['pension', 'retirement'].includes(input.isaTarget)) errors.push('ISA 전환 계좌를 확인하세요.')
  if (!['auto', 'itemized', 'standard'].includes(input.method)) errors.push('공제 방식을 확인하세요.')
  if (!['none', 'woman', 'singleParent'].includes(input.personalExtra)) errors.push('추가 인적공제 유형을 확인하세요.')
  if (typeof input.selfSenior !== 'boolean' || typeof input.selfDisabled !== 'boolean') errors.push('본인 추가공제 여부를 확인하세요.')
  const itemized = input.method !== 'standard'
  const money = [input.annualPay, input.nonTaxablePay, input.prepaidIncomeTax, input.prepaidLocalTax ?? 0,
    input.publicPension, input.housingSavingsDeduction, ...Object.values(input.card), input.pensionSaving, input.retirementSaving,
    input.isaTransfer, input.donations.political, input.donations.hometown,
    ...(itemized ? [input.healthEmploymentInsurance, input.housingDeduction, input.insurance, input.disabilityInsurance,
      ...Object.values(input.medical), ...input.education.map((row) => row.amount), input.donations.special,
      input.donations.general, input.donations.religious, ...(input.rentEligible ? [input.rentPaid] : [])] : []),
  ]
  if (money.some((value) => !Number.isSafeInteger(value) || value < 0 || value > R.maxInputAmount)) {
    errors.push('금액은 0원부터 1조원까지의 정수로 입력하세요.')
  }
  if (input.annualPay <= 0) errors.push('연간 지급총액을 입력하세요.')
  if (input.nonTaxablePay > input.annualPay) errors.push('비과세 급여가 연간 지급총액을 넘을 수 없습니다.')
  for (const count of [input.otherDependents, input.seniorOthers, input.disabledOthers]) {
    if (!Number.isSafeInteger(count) || count < 0 || count > 100) errors.push('가족 수는 0명부터 100명 사이 정수로 입력하세요.')
  }
  if (input.children.length > 100 || input.education.length > 100) errors.push('대상자는 100명 이하로 입력하세요.')
  if (input.seniorOthers > input.otherDependents || input.disabledOthers > input.otherDependents) {
    errors.push('추가공제 가족 수가 자녀 외 기본공제 대상 가족 수를 넘습니다. 본인은 별도 항목으로 선택하세요.')
  }
  if (input.personalExtra === 'singleParent' && input.children.length === 0) errors.push('한부모 공제에는 기본공제 대상 직계비속·입양자가 필요합니다.')
  input.children.forEach((child, index) => {
    if (!Number.isInteger(child.birthYear) || child.birthYear < 1900 || child.birthYear > R.year) errors.push(`자녀 ${index + 1}의 출생연도를 확인하세요.`)
    if (!child.disabled && R.year - child.birthYear > 20) errors.push(`자녀 ${index + 1}은 20세를 초과해 기본공제 나이 요건을 충족하지 않습니다. 장애인 예외 여부를 확인하세요.`)
    if (!['child', 'grandchild'].includes(child.relationship) || !['first', 'second', 'third'].includes(child.birthOrder)) errors.push('자녀 관계와 출산·입양 순위를 확인하세요.')
  })
  if (itemized) input.education.forEach((row, index) => {
    if (!Object.hasOwn(R.educationLimits, row.kind) || !['self', 'descendant', 'spouse', 'sibling', 'parent'].includes(row.relationship)) {
      errors.push(`교육비 대상자 ${index + 1}의 관계와 유형을 확인하세요.`)
    } else if ((row.kind === 'self' && row.relationship !== 'self') ||
      (row.relationship === 'self' && row.kind !== 'self' && row.kind !== 'disability') ||
      (row.relationship === 'parent' && row.kind !== 'disability')) {
      errors.push(`교육비 대상자 ${index + 1}: 본인 일반교육비는 본인 유형, 부모·조부모 교육비는 장애인 특수교육 유형으로 입력하세요.`)
    }
  })
  return Array.from(new Set(errors))
}

export function calculateYearEndTax(input: YearEndInput) {
  const errors = validate(input)
  if (errors.length) return { ok: false as const, errors }
  const salary = input.annualPay - input.nonTaxablePay
  const wageDeduction = Math.floor(wageIncomeDeduction(salary))
  const wageIncome = Math.max(0, salary - wageDeduction)
  const familyCount = 1 + input.otherDependents + input.children.length
  const seniorCount = Number(input.selfSenior) + input.seniorOthers + input.children.filter((child) => R.year - child.birthYear >= 70).length
  const disabledCount = Number(input.selfDisabled) + input.disabledOthers + input.children.filter((child) => child.disabled).length
  const extra = input.personalExtra === 'singleParent' ? R.singleParentDeduction
    : input.personalExtra === 'woman' && wageIncome <= R.womanIncomeLimit ? R.womanDeduction : 0
  const basic = familyCount * R.basicDeduction
  const additional = seniorCount * R.seniorDeduction + disabledCount * R.disabilityDeduction + extra
  const card = cardDeduction2026(salary, input.children.length, input.card)
  const eligibleChildren = input.children.filter((child) => eligibleChildCredit2026(child.birthYear)).length
  const childCredit = eligibleChildren === 0 ? 0 : eligibleChildren === 1 ? R.childFirstCredit
    : R.childSecondTotalCredit + Math.max(0, eligibleChildren - 2) * R.childAdditionalCredit
  const birthCredit = sum(input.children.filter((child) => child.relationship === 'child' &&
    (child.birthYear === R.year || child.adoptedThisYear)).map((child) => R.birthCredits[child.birthOrder]))
  const pension = pensionCredit2026(salary, input.pensionSaving, input.retirementSaving, input.isaTransfer, input.isaTarget)
  const donations = donationCredits2026(wageIncome, input.method === 'standard'
    ? { ...input.donations, special: 0, general: 0, religious: 0 } : input.donations)
  const marriageCredit = input.marriedThisYear ? R.marriageCredit : 0

  function scenario(method: 'itemized' | 'standard') {
    const detailed = method === 'itemized'
    const housing = detailed ? input.housingDeduction : 0
    const combinedLimited = Math.min(R.comprehensiveDeductionLimit, housing + input.housingSavingsDeduction + card.amount)
    const deductions: TaxLine[] = [
      { label: '기본공제', amount: basic, note: `본인 포함 ${familyCount}명` },
      { label: '추가 인적공제', amount: additional, note: `경로우대 ${seniorCount}명 · 장애인 ${disabledCount}명${extra ? ' · 부녀자 또는 한부모 공제 포함' : ''}` },
      { label: '공적연금보험료 공제', amount: input.publicPension },
      { label: '건강·고용·장기요양보험료 공제', amount: detailed ? input.healthEmploymentInsurance : 0 },
      { label: '주택자금·청약·신용카드 소득공제', amount: combinedLimited, note: `카드 ${card.amount.toLocaleString('ko-KR')}원 · 청약 ${input.housingSavingsDeduction.toLocaleString('ko-KR')}원 · 주택자금 ${housing.toLocaleString('ko-KR')}원, 종합한도 적용` },
    ]
    const appliedDeductions = Math.min(wageIncome, sum(deductions.map((line) => line.amount)))
    const taxBase = Math.max(0, wageIncome - appliedDeductions)
    const grossTax = Math.floor(basicIncomeTax(taxBase))
    const earnedCredit = Math.floor(earnedIncomeTaxCredit(grossTax, salary))
    const medical = detailed ? medicalCredit2026(salary, input.medical).amount : 0
    const education = detailed ? educationCredit2026(input.education).amount : 0
    const rent = detailed && input.rentEligible && salary <= R.rentSalaryLimit
      ? percent(Math.min(input.rentPaid, R.rentPaymentLimit), salary <= R.rentHigherRateSalaryLimit ? 17 : 15) : 0
    const credits: TaxLine[] = [
      { label: '근로소득세액공제', amount: earnedCredit },
      { label: '자녀세액공제', amount: childCredit, note: `2026년 대상 ${eligibleChildren}명(2017년생 제외)` },
      { label: '출산·입양 세액공제', amount: birthCredit },
      { label: '연금저축·IRP·ISA 전환 세액공제', amount: pension.amount, note: `대상 납입액 ${pension.eligible.toLocaleString('ko-KR')}원` },
      { label: '보장성보험료 세액공제', amount: detailed ? percent(Math.min(input.insurance, 1_000_000), 12) + percent(Math.min(input.disabilityInsurance, 1_000_000), 15) : 0 },
      { label: '의료비 세액공제', amount: medical },
      { label: '교육비 세액공제', amount: education },
      { label: '정치자금 기부금 세액공제', amount: donations.political },
      { label: '고향사랑 기부금 세액공제', amount: donations.hometown },
      { label: '특례·일반·종교 기부금 세액공제', amount: detailed ? donations.ordinary : 0 },
      { label: '월세액 세액공제', amount: rent },
      { label: '혼인 세액공제', amount: marriageCredit },
      { label: '표준세액공제', amount: detailed ? 0 : R.standardCredit },
    ]
    const nominalCredits = sum(credits.map((line) => line.amount))
    const appliedCredits = Math.min(grossTax, nominalCredits)
    const incomeTax = tenWon(grossTax - appliedCredits)
    const localTax = tenWon(incomeTax / 10)
    return { method, deductions, appliedDeductions, taxBase, grossTax, credits, nominalCredits, appliedCredits, incomeTax, localTax }
  }
  // 표준 방식 선택 시 제외되는 입력은 읽지 않는다. 남아 있는 오류값도 결과를 막지 않는다.
  const itemized = input.method === 'standard' ? null : scenario('itemized')
  const standard = scenario('standard')
  const selected = input.method === 'standard' ? standard : input.method === 'itemized' ? itemized!
    : standard.incomeTax <= itemized!.incomeTax ? standard : itemized!
  const prepaidLocalTax = input.prepaidLocalTax ?? tenWon(input.prepaidIncomeTax / 10)
  const incomeDifference = selected.incomeTax - input.prepaidIncomeTax
  const localDifference = selected.localTax - prepaidLocalTax
  const balance = incomeDifference + localDifference
  return {
    ok: true as const, year: R.year, salary, wageDeduction, wageIncome, familyCount, eligibleChildren,
    card, selected, itemized, standard, prepaidIncomeTax: input.prepaidIncomeTax, prepaidLocalTax,
    localTaxAssumed: input.prepaidLocalTax === null, incomeDifference, localDifference, balance,
    refund: Math.max(0, -balance), additionalPayment: Math.max(0, balance),
  }
}
export type YearEndResult = Extract<ReturnType<typeof calculateYearEndTax>, { ok: true }>
