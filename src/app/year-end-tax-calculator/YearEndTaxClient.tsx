'use client'

import { SITE } from "@/lib/site";
import { useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import RelatedCalculators from '@/components/RelatedCalculators'
import SourceNote from '@/components/SourceNote'
import ResultActions from '@/components/ResultActions'
import { requiredAmountError, readAmount, formatAmount } from '@/lib/utils/amount'
import { YEAR_END_2026 } from '@/lib/tax/config/verified/year-end-2026'
import { calculateYearEndTax, type Child, type DeductionMethod, type EducationExpense, type TaxLine, type YearEndInput, type YearEndResult } from '@/lib/tax/rules/year-end'

const fmt = (value: number) => `${value.toLocaleString('ko-KR')}원`
const moneyKeys = ['annualPay', 'nonTaxablePay', 'prepaidIncomeTax', 'prepaidLocalTax', 'publicPension', 'healthEmploymentInsurance', 'housingDeduction', 'housingSavingsDeduction', 'credit', 'debitCash', 'market', 'transit', 'cultureCredit', 'cultureDebit', 'pensionSaving', 'retirementSaving', 'isaTransfer', 'insurance', 'disabilityInsurance', 'ordinary', 'unlimited', 'premature', 'infertility', 'political', 'hometown', 'special', 'general', 'religious', 'rentPaid'] as const
type MoneyKey = typeof moneyKeys[number]
type MoneyState = Record<MoneyKey, string>
const emptyMoney = () => Object.fromEntries(moneyKeys.map((key) => [key, ''])) as MoneyState
const commonKeys: MoneyKey[] = ['annualPay', 'nonTaxablePay', 'prepaidIncomeTax', 'prepaidLocalTax', 'publicPension', 'housingSavingsDeduction', 'credit', 'debitCash', 'market', 'transit', 'cultureCredit', 'cultureDebit', 'pensionSaving', 'retirementSaving', 'isaTransfer', 'political', 'hometown']
const specialKeys: MoneyKey[] = ['healthEmploymentInsurance', 'housingDeduction', 'insurance', 'disabilityInsurance', 'ordinary', 'unlimited', 'premature', 'infertility', 'special', 'general', 'religious']
const fieldClass = 'w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
const noteClass = 'text-xs leading-5 text-slate-500'
function reading(text: string) {
  const read = readAmount(text)
  return read.error || read.value > YEAR_END_2026.maxInputAmount
    ? { value: 0, error: read.error ?? '1조원 이하로 입력하세요.' } : read
}
function MoneyField({ id, label, value, onChange, hint, required = false }: { id: string; label: string; value: string; onChange: (value: string) => void; hint?: string; required?: boolean }) {
  const { error } = reading(value)
  return <div className="min-w-0">
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}{required && <span className="ml-1 text-blue-600">필수</span>}</label>
    <div className="relative"><input id={id} type="text" inputMode="numeric" value={value} onChange={(event) => onChange(formatAmount(event.target.value))} placeholder={required ? '금액 입력' : '0'} aria-required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className={`${fieldClass} pr-9 ${error ? 'border-red-400' : ''}`} /><span className="pointer-events-none absolute right-3 top-2.5 text-sm text-slate-500">원</span></div>
    {error ? <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p> : hint && <p id={`${id}-hint`} className={`mt-1 ${noteClass}`}>{hint}</p>}
  </div>
}
function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return <details className="rounded-2xl border border-slate-200 bg-white"><summary className="cursor-pointer px-5 py-4 text-sm font-bold text-slate-800">{title}</summary><div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4">{hint && <p className={noteClass}>{hint}</p>}{children}</div></details>
}
function CountField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  const error = !/^\d+$/.test(value) || Number(value) > 100
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label><input id={id} inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined} />{error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">0~100명 사이 정수로 입력하세요.</p>}</div>
}
function Lines({ lines }: { lines: TaxLine[] }) {
  return <dl className="space-y-2">{lines.filter((line) => line.amount > 0).map((line) => <div key={line.label}><div className="flex flex-wrap justify-between gap-x-3 text-sm"><dt className="text-slate-600">{line.label}</dt><dd className="font-medium tabular-nums text-slate-900">{fmt(line.amount)}</dd></div>{line.note && <p className={noteClass}>{line.note}</p>}</div>)}</dl>
}
function Result({ result }: { result: YearEndResult }) {
  const selected = result.selected
  const status = result.refund > 0 ? '예상 환급액' : result.additionalPayment > 0 ? '예상 추가 납부액' : '환급·추가 납부 없음'
  const difference = (amount: number) => amount < 0 ? `${fmt(-amount)} 환급` : amount > 0 ? `${fmt(amount)} 추가 납부` : '정산액 0원'
  return <div data-testid="year-end-result" className="space-y-5">
    <p className="text-xs text-slate-500">입력하지 않은 공제 항목은 적용하지 않은 예상치입니다.</p>
    <div role="status" aria-live="polite" aria-atomic="true" className={`rounded-2xl p-5 ${result.additionalPayment > 0 ? 'bg-amber-50' : 'bg-blue-50'}`}>
      <p className="text-sm font-semibold text-slate-700">{status}</p>
      <p data-testid="settlement-amount" className="mt-2 break-words text-3xl font-extrabold tracking-tight text-slate-900">{fmt(result.refund || result.additionalPayment)}</p>
      <p className={`mt-2 ${noteClass}`}>소득세와 지방소득세를 합친 예상 정산액입니다.</p>
    </div>
    <dl className="space-y-3 text-sm">
      <div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">이미 낸 세금 합계</dt><dd className="font-semibold">{fmt(result.prepaidIncomeTax + result.prepaidLocalTax)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">예상 최종 세금 합계</dt><dd data-testid="final-tax" className="font-semibold">{fmt(selected.incomeTax + selected.localTax)}</dd></div>
      <div className="border-t border-slate-100 pt-3"><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">소득세 정산</dt><dd data-testid="income-settlement" className="font-semibold">{difference(result.incomeDifference)}</dd></div><p className={noteClass}>최종 {fmt(selected.incomeTax)} − 선납 {fmt(result.prepaidIncomeTax)}</p></div>
      <div><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">지방소득세 정산</dt><dd className="font-semibold">{difference(result.localDifference)}</dd></div><p className={noteClass}>최종 {fmt(selected.localTax)} − 선납 {fmt(result.prepaidLocalTax)}</p></div>
    </dl>
    {result.localTaxAssumed && <p className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">이미 낸 지방소득세는 소득세의 10%로 추정했습니다. 실제 납부액을 입력하면 정산액이 달라질 수 있습니다.</p>}
    <div className="rounded-xl border border-slate-200 p-3"><p className="text-sm font-semibold text-slate-800">적용 방식: {selected.method === 'standard' ? '표준세액공제' : '개별 공제'}</p>{result.itemized && <p className={`mt-1 ${noteClass}`}>소득세 기준 · 개별 공제 {fmt(result.itemized.incomeTax)} / 표준세액공제 {fmt(result.standard.incomeTax)}</p>}<p className={`mt-1 ${noteClass}`}>표준세액공제는 특별소득공제·특별세액공제·월세액 공제를 대신합니다.</p></div>
    <details className="rounded-xl border border-slate-200 p-3"><summary className="cursor-pointer text-sm font-semibold text-slate-700">계산 과정과 공제 내역</summary><div className="mt-4 space-y-4">
      <dl className="space-y-2 text-sm">{[['비과세 제외 총급여', result.salary], ['근로소득공제', result.wageDeduction], ['근로소득금액', result.wageIncome], ['적용 소득공제 합계', selected.appliedDeductions], ['과세표준', selected.taxBase], ['산출세액', selected.grossTax], ['적용 세액공제 합계', selected.appliedCredits], ['예상 결정세액 (소득세)', selected.incomeTax]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-slate-600">{label}</dt><dd className="font-semibold">{fmt(value as number)}</dd></div>)}</dl>
      <div className="border-t pt-3"><p className="mb-3 text-sm font-bold text-slate-800">소득공제 항목</p><Lines lines={selected.deductions} /></div>
      <div className="border-t pt-3"><p className="mb-3 text-sm font-bold text-slate-800">세액공제 항목</p><Lines lines={selected.credits} /></div>
      <p className={noteClass}>항목별 금액은 한도 적용 후 산정액입니다. 소득공제 합계는 근로소득금액, 세액공제 합계는 산출세액까지 적용하므로 항목 합계와 실제 적용 합계가 다를 수 있습니다. 최종 세액은 10원 미만을 버려 추정합니다.</p>
    </div></details>
    <ResultActions title="2026년 귀속 연말정산 예상 결과" lines={[{ label: status, value: fmt(result.refund || result.additionalPayment) }, { label: '예상 결정세액 (소득세)', value: fmt(selected.incomeTax) }, { label: '예상 지방소득세', value: fmt(selected.localTax) }, { label: '이미 낸 소득세', value: fmt(result.prepaidIncomeTax) }, { label: '이미 낸 지방소득세', value: fmt(result.prepaidLocalTax), note: result.localTaxAssumed ? '소득세의 10%로 추정' : undefined }, { label: '적용 공제 방식', value: selected.method === 'standard' ? '표준세액공제' : '개별 공제' }]} footer={['2026-10-14 확인 법령 기준 · 근로소득만 있는 거주자 예상치', '최종 정산은 홈택스와 회사의 연말정산 자료로 확인하세요.', `${SITE.url}/year-end-tax-calculator`]} />
  </div>
}

type ChildRow = Omit<Child, 'birthYear'> & { id: number; birthYear: string }
type EducationRow = { id: number; relationship: EducationExpense['relationship']; kind: EducationExpense['kind']; amount: string }
export default function YearEndTaxClient() {
  const [money, setMoney] = useState<MoneyState>(emptyMoney)
  const [method, setMethod] = useState<DeductionMethod>('auto')
  const [otherDependents, setOtherDependents] = useState('0')
  const [selfSenior, setSelfSenior] = useState(false)
  const [selfDisabled, setSelfDisabled] = useState(false)
  const [seniorOthers, setSeniorOthers] = useState('0')
  const [disabledOthers, setDisabledOthers] = useState('0')
  const [personalExtra, setPersonalExtra] = useState<YearEndInput['personalExtra']>('none')
  const [children, setChildren] = useState<ChildRow[]>([])
  const [education, setEducation] = useState<EducationRow[]>([])
  const [rentEligible, setRentEligible] = useState(false)
  const [marriedThisYear, setMarriedThisYear] = useState(false)
  const [isaTarget, setIsaTarget] = useState<YearEndInput['isaTarget']>('retirement')
  const nextId = useRef(1)
  const itemized = method !== 'standard'
  const activeKeys = [...commonKeys, ...(itemized ? specialKeys : []), ...(itemized && rentEligible ? ['rentPaid' as const] : [])]
  const inputErrors = activeKeys.some((key) => reading(money[key]).error) || (itemized && education.some((row) => requiredAmountError(row.amount) !== null))
  const amount = (key: MoneyKey) => reading(money[key]).value
  const count = (text: string) => /^\d+$/.test(text) ? Number(text) : NaN
  const input: YearEndInput = {
    year: 2026, annualPay: amount('annualPay'), nonTaxablePay: amount('nonTaxablePay'), prepaidIncomeTax: amount('prepaidIncomeTax'), prepaidLocalTax: amount('prepaidLocalTax'),
    otherDependents: count(otherDependents), selfSenior, selfDisabled, seniorOthers: count(seniorOthers), disabledOthers: count(disabledOthers), personalExtra,
    children: children.map(({ birthYear, ...child }) => ({ ...child, birthYear: count(birthYear) })),
    publicPension: amount('publicPension'), healthEmploymentInsurance: itemized ? amount('healthEmploymentInsurance') : 0,
    housingDeduction: itemized ? amount('housingDeduction') : 0, housingSavingsDeduction: amount('housingSavingsDeduction'),
    card: { credit: amount('credit'), debitCash: amount('debitCash'), market: amount('market'), transit: amount('transit'), cultureCredit: amount('cultureCredit'), cultureDebit: amount('cultureDebit') },
    pensionSaving: amount('pensionSaving'), retirementSaving: amount('retirementSaving'), isaTransfer: amount('isaTransfer'), isaTarget,
    insurance: itemized ? amount('insurance') : 0, disabilityInsurance: itemized ? amount('disabilityInsurance') : 0,
    medical: { ordinary: itemized ? amount('ordinary') : 0, unlimited: itemized ? amount('unlimited') : 0, premature: itemized ? amount('premature') : 0, infertility: itemized ? amount('infertility') : 0 },
    education: itemized ? education.map(({ relationship, kind, amount: text }) => ({ relationship, kind, amount: reading(text).value })) : [],
    donations: { political: amount('political'), hometown: amount('hometown'), special: itemized ? amount('special') : 0, general: itemized ? amount('general') : 0, religious: itemized ? amount('religious') : 0 },
    rentEligible: itemized && rentEligible, rentPaid: itemized && rentEligible ? amount('rentPaid') : 0, marriedThisYear, method,
  }
  const calculated = calculateYearEndTax(input)
  const requiredReady = ['annualPay', 'nonTaxablePay', 'prepaidIncomeTax', 'prepaidLocalTax'].every(key => requiredAmountError(money[key as MoneyKey]) === null)
  const result = requiredReady && !inputErrors && calculated.ok ? calculated : null
  const field = (key: MoneyKey, label: string, hint?: string, required = false) => <MoneyField id={`ye-${key}`} label={label} value={money[key]} onChange={(value) => setMoney((previous) => ({ ...previous, [key]: value }))} hint={hint} required={required} />
  const updateChild = (id: number, patch: Partial<ChildRow>) => setChildren((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row))
  const reset = () => { setMoney(emptyMoney()); setMethod('auto'); setOtherDependents('0'); setSelfSenior(false); setSelfDisabled(false); setSeniorOthers('0'); setDisabledOthers('0'); setPersonalExtra('none'); setChildren([]); setEducation([]); setRentEligible(false); setMarriedThisYear(false); setIsaTarget('retirement') }

  return <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-10">
    <div className="mb-7"><span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">2026년 귀속 · 근로소득</span><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">연말정산 계산기</h1><p className="mt-3 text-sm leading-6 text-slate-600">1년간 받은 급여와 공제, 이미 낸 세금을 입력하면 예상 환급액 또는 추가 납부액을 계산합니다. 근로소득만 있는 국내 거주자를 기준으로 합니다.</p></div>
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <section aria-label="연말정산 입력" className="contents">
        <div className="order-1 min-w-0 space-y-4 lg:col-start-1 lg:row-start-1">
        <div className="calc-card space-y-4 p-5"><div className="flex items-center justify-between gap-2"><h2 className="text-base font-bold text-slate-800">급여와 이미 낸 세금</h2><button type="button" onClick={reset} className="min-h-[44px] text-xs font-semibold text-slate-500 hover:text-blue-700">전체 초기화</button></div>
          {field('annualPay', '연간 지급총액', '비과세와 상여를 포함한 1년치 지급액입니다. 이직했다면 종전·현재 회사 금액을 합칩니다.', true)}
          {field('nonTaxablePay', '연간 비과세 급여', '비과세 요건을 충족하는 금액만 입력합니다. 없으면 0을 직접 입력하세요.', true)}
          {field('prepaidIncomeTax', '이미 낸 소득세', '급여에서 원천징수한 1년치 소득세 합계입니다. 낸 세금이 없으면 0을 입력하세요.', true)}
          {field('prepaidLocalTax', '이미 낸 지방소득세', '실제 납부한 연간 지방소득세를 입력하세요. 납부액이 없으면 0을 직접 입력하세요.', true)}
          <p className={noteClass}>연중 예상이라면 남은 기간의 급여·선납세액·공제도 함께 추정해 입력하세요. 모든 금액은 연간 합계입니다.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5"><h2 className="text-sm font-bold text-slate-800">공제 적용 방식</h2><div className="mt-3 flex flex-wrap gap-2">{([['auto', '유리한 방식 자동 선택'], ['itemized', '개별 공제'], ['standard', '표준세액공제']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={method === value} onClick={() => setMethod(value)} className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-semibold ${method === value ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600'}`}>{label}</button>)}</div><p className={`mt-3 ${noteClass}`}>보험료·의료비·교육비·일반 기부금·월세와 특별소득공제를 개별 적용하거나, 이 항목들을 대신하는 표준세액공제 13만원을 적용합니다. 인적공제·카드·연금계좌 등은 두 방식 모두 반영합니다.</p></div>
        </div>
        <div className="order-3 min-w-0 space-y-4 lg:col-start-1 lg:row-start-2">
        <h2 className="text-base font-bold text-slate-800">공제 추가 <span className="text-xs font-normal text-slate-500">해당하는 항목을 펼쳐 입력하세요</span></h2>
        <Group title="가족·자녀·추가 인적공제" hint="본인은 자동으로 포함합니다. 다른 가족은 연 소득금액 100만원 이하(근로소득만 있다면 총급여 500만원 이하) 등 기본공제 요건을 충족하고 다른 가족과 중복 공제하지 않는 사람만 입력하세요. 부모 등은 60세 이상, 자녀는 20세 이하가 원칙이며 장애인은 나이 제한이 없습니다.">
          <div className="space-y-1 rounded-xl bg-slate-50 p-3">
            <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-700"><input id="ye-selfDisabled" type="checkbox" checked={selfDisabled} onChange={(event) => setSelfDisabled(event.target.checked)} />본인 장애인 추가공제</label>
            <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-700"><input id="ye-selfSenior" type="checkbox" checked={selfSenior} onChange={(event) => setSelfSenior(event.target.checked)} />본인 70세 이상 추가공제 (1956년생 또는 이전 출생)</label>
            <p className={noteClass}>본인 장애인 200만원, 70세 이상 100만원을 추가 공제합니다. 두 요건을 모두 충족하면 함께 선택할 수 있습니다. 아래 가족 수에는 본인과 자녀를 제외하세요.</p>
          </div>
          <CountField id="ye-otherDependents" label="자녀 외 기본공제 대상 가족 수" value={otherDependents} onChange={setOtherDependents} />
          <div className="grid gap-4 sm:grid-cols-2"><CountField id="ye-seniorOthers" label="70세 이상 가족 수 (본인·자녀 제외)" value={seniorOthers} onChange={setSeniorOthers} /><CountField id="ye-disabledOthers" label="장애인 가족 수 (본인·자녀 제외)" value={disabledOthers} onChange={setDisabledOthers} /></div>
          <div><label htmlFor="ye-personalExtra" className="mb-1.5 block text-sm font-semibold text-slate-700">추가 공제 유형</label><select id="ye-personalExtra" value={personalExtra} onChange={(event) => setPersonalExtra(event.target.value as YearEndInput['personalExtra'])} className={fieldClass}><option value="none">해당 없음</option><option value="woman">부녀자 공제 요건 충족</option><option value="singleParent">한부모 공제 요건 충족</option></select><p className={`mt-1 ${noteClass}`}>부녀자: 근로소득금액 3천만원 이하인 기혼 여성 또는 부양가족이 있는 미혼 여성 세대주. 한부모: 배우자가 없고 기본공제 대상 직계비속·입양자가 있는 경우. 두 요건 모두 충족하면 한부모 공제를 선택하세요.</p></div>
          <p className={noteClass}>자녀·손자녀는 아래에 한 명씩 추가하세요. 기본공제와 2026년 카드 한도에 함께 반영합니다. 자녀세액공제는 2016년생 이전 대상자에게 적용하고, 2017년생은 경과규정에 따라 제외합니다.</p>
          {children.map((child, index) => <div key={child.id} className="space-y-3 rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between"><p className="text-sm font-bold">자녀 {index + 1}</p><button type="button" aria-label={`자녀 ${index + 1} 삭제`} onClick={() => setChildren((rows) => rows.filter((row) => row.id !== child.id))} className="min-h-[44px] px-2 text-xs text-slate-500">삭제</button></div><div className="grid gap-3 sm:grid-cols-2"><div><label htmlFor={`child-year-${child.id}`} className="mb-1 block text-sm font-semibold">출생연도</label><input id={`child-year-${child.id}`} aria-label={`자녀 ${index + 1} 출생연도`} inputMode="numeric" value={child.birthYear} onChange={(event) => updateChild(child.id, { birthYear: event.target.value })} className={fieldClass} /></div><div><label htmlFor={`child-relation-${child.id}`} className="mb-1 block text-sm font-semibold">관계</label><select id={`child-relation-${child.id}`} aria-label={`자녀 ${index + 1} 관계`} value={child.relationship} onChange={(event) => updateChild(child.id, { relationship: event.target.value as Child['relationship'] })} className={fieldClass}><option value="child">자녀·입양자</option><option value="grandchild">손자녀</option></select></div></div><label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" checked={child.disabled} onChange={(event) => updateChild(child.id, { disabled: event.target.checked })} />장애인 대상 (자녀 {index + 1})</label>{child.relationship === 'child' && <><label className="flex min-h-[44px] items-center gap-2 text-sm"><input type="checkbox" checked={child.adoptedThisYear} onChange={(event) => updateChild(child.id, { adoptedThisYear: event.target.checked })} />2026년에 입양 (자녀 {index + 1})</label>{(child.birthYear === '2026' || child.adoptedThisYear) && <div><label htmlFor={`child-order-${child.id}`} className="mb-1 block text-sm font-semibold">이번 출산·입양 자녀의 순위</label><select id={`child-order-${child.id}`} aria-label={`자녀 ${index + 1} 출산·입양 순위`} value={child.birthOrder} onChange={(event) => updateChild(child.id, { birthOrder: event.target.value as Child['birthOrder'] })} className={fieldClass}><option value="first">첫째 (30만원)</option><option value="second">둘째 (50만원)</option><option value="third">셋째 이상 (70만원)</option></select></div>}</>}</div>)}
          <button type="button" disabled={children.length >= 100} onClick={() => setChildren((rows) => [...rows, { id: nextId.current++, birthYear: '2016', disabled: false, relationship: 'child', adoptedThisYear: false, birthOrder: 'first' }])} className="min-h-[44px] rounded-xl border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 disabled:opacity-40">+ 자녀 추가</button>
        </Group>
        <Group title="공적연금·건강보험·주택자금" hint="공적연금과 건강·고용보험은 근로자 본인 부담액을 입력합니다. 주택자금은 대출 상환액 자체가 아니라 공제 요건과 개별 한도를 확인한 소득공제 금액을 입력하세요.">
          {field('publicPension', '국민연금 등 공적연금보험료', '해당 연도 본인이 부담한 공제 대상 보험료입니다.')}
          {field('housingSavingsDeduction', '주택청약저축 소득공제 금액', '무주택·총급여·납입 한도를 확인해 산정한 공제액입니다. 납입액 자체가 아닙니다.')}
          {itemized && <>{field('healthEmploymentInsurance', '건강·장기요양·고용보험료', '본인이 낸 보험료 합계입니다.')}{field('housingDeduction', '주택임차차입금·장기주택저당차입금 공제액', '대출 종류·차입 시기·상환 방식 등 개별 한도를 적용한 공제액만 입력하세요.')}</>}
        </Group>
        <Group title="신용카드·체크카드·현금영수증" hint="공제 대상 사용액만 입력하세요. 전통시장·대중교통·문화체육 금액은 일반 카드 사용액에서 빼서 중복 없이 입력합니다. 세금·보험료·신차 구입·해외 사용 등 제외 항목과 근무하지 않은 기간 사용액은 빼세요.">
          {field('credit', '일반 신용카드 사용액')}{field('debitCash', '일반 체크카드·현금영수증 사용액')}
          <div className="grid gap-4 sm:grid-cols-2">{field('market', '전통시장 사용액')}{field('transit', '대중교통 사용액')}</div>
          {field('cultureCredit', '문화체육 사용액 (신용카드)', '지정 사업자의 도서·공연·영화·수영장·체력단련장 등 공제 대상 금액만 입력하세요.')}{field('cultureDebit', '문화체육 사용액 (체크·현금영수증)', '총급여 7천만원 초과 시 문화체육 사용액은 원래 결제수단의 일반 공제율로 계산합니다.')}
        </Group>
        <Group title="연금저축·IRP·ISA 전환" hint="본인이 낸 세액공제 대상 납입액만 입력합니다. 회사 부담금·퇴직금 이체·다른 연금계좌에서 이전한 금액은 제외합니다. ISA는 일반 납입액과 중복 입력하지 마세요.">
          {field('pensionSaving', '연금저축 납입액 (ISA 제외)')}{field('retirementSaving', 'IRP·퇴직연금 본인 납입액 (ISA 제외)')}{field('isaTransfer', 'ISA 만기자금 연금계좌 전환액', '만기 후 60일 이내 적격 전환액입니다. 이전 연도에 걸친 전환이나 전년 추가 한도를 사용한 경우는 이 계산의 지원 범위 밖입니다.')}
          <div><label htmlFor="ye-isaTarget" className="mb-1.5 block text-sm font-semibold text-slate-700">ISA 전환 계좌</label><select id="ye-isaTarget" value={isaTarget} onChange={(event) => setIsaTarget(event.target.value as YearEndInput['isaTarget'])} className={fieldClass}><option value="retirement">IRP·퇴직연금</option><option value="pension">연금저축</option></select></div>
        </Group>
        {itemized && <>
          <Group title="보장성보험료·의료비" hint="보험료는 기본공제 대상자를 위한 공제 대상 보험료만 입력합니다. 의료비는 실손보험금·지원금 등을 뺀 본인 부담액 중 공제 대상 금액을 입력하고, 각 항목은 중복하지 마세요.">
            {field('insurance', '일반 보장성보험료')}{field('disabilityInsurance', '장애인 전용 보장성보험료')}
            {field('ordinary', '일반 부양가족 의료비', '총급여 3% 문턱과 연 700만원 한도를 적용합니다.')}{field('unlimited', '본인·65세 이상·6세 이하 등 의료비', '본인, 장애인, 65세 이상, 연초 6세 이하, 법정 중증질환자 등의 공제 대상 의료비입니다. 항목별 안경·산후조리원 등의 지출 한도는 먼저 적용하세요.')}{field('premature', '미숙아·선천성이상아 의료비')}{field('infertility', '난임시술비')}
          </Group>
          <Group title="교육비" hint="같은 사람의 교육비는 합산해 한 줄에 입력하세요. 장학금·지원금을 제외한 공제 대상 금액만 입력합니다. 2026년 1월 1일 이후 지출분은 교육비 공제 대상인 배우자·직계비속·형제자매·입양자 등의 나이·소득 제한을 적용하지 않습니다. 관계·기관·지출 종류 등의 요건과 학원비·체험학습비 등 개별 한도는 확인해야 합니다.">
            {education.map((row, index) => <div key={row.id} className="space-y-3 rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between"><p className="text-sm font-bold">교육비 대상자 {index + 1}</p><button type="button" aria-label={`교육비 대상자 ${index + 1} 삭제`} onClick={() => setEducation((rows) => rows.filter((item) => item.id !== row.id))} className="min-h-[44px] px-2 text-xs text-slate-500">삭제</button></div>
              <div>
                <label htmlFor={`edu-relation-${row.id}`} className="mb-1 block text-sm font-semibold">관계</label>
                <select id={`edu-relation-${row.id}`} aria-label={`교육비 대상자 ${index + 1} 관계`} value={row.relationship} onChange={(event) => {
                  const relationship = event.target.value as EducationExpense['relationship']
                  setEducation((rows) => rows.map((item) => item.id === row.id ? { ...item, relationship, kind: relationship === 'self' ? 'self' : relationship === 'parent' ? 'disability' : item.kind === 'self' ? 'school' : item.kind } : item))
                }} className={fieldClass}>
                  <option value="descendant">자녀·손자녀·입양자</option><option value="spouse">배우자</option><option value="sibling">형제자매</option><option value="self">본인</option><option value="parent">부모·조부모 (장애인 특수교육)</option>
                </select>
              </div>
              <div>
                <label htmlFor={`edu-kind-${row.id}`} className="mb-1 block text-sm font-semibold">교육 대상</label>
                <select id={`edu-kind-${row.id}`} aria-label={`교육비 대상자 ${index + 1} 유형`} value={row.kind} onChange={(event) => setEducation((rows) => rows.map((item) => item.id === row.id ? { ...item, kind: event.target.value as EducationExpense['kind'] } : item))} className={fieldClass}>
                  {row.relationship !== 'self' && row.relationship !== 'parent' && <><option value="school">취학 전·초·중·고 (300만원 한도)</option><option value="university">대학생 (900만원 한도)</option></>}
                  {row.relationship === 'self' && <option value="self">본인 (한도 없음)</option>}
                  <option value="disability">장애인 특수교육 (한도 없음)</option>
                </select>
                <p className={`mt-1 ${noteClass}`}>
                  {row.kind === 'disability' ? '법정 장애인 특수교육만 해당합니다. 부모·조부모도 포함할 수 있습니다. 대상 시설과 발달재활서비스 기관의 18세 미만 요건 등 개별 조건을 확인하세요.' : row.relationship === 'self' ? '본인의 대학원 교육비·적격 학자금 대출 상환액 등은 해당 요건을 충족하면 포함할 수 있습니다.' : '2026년 지출 교육비에는 대상 가족의 나이·소득 제한이 없습니다. 다른 사람과 중복 공제하지 마세요. 가족의 대학원 교육비와 가족이 학자금 대출로 지급한 교육비는 제외합니다.'}
                </p>
              </div>
              <MoneyField id={`edu-amount-${row.id}`} label={`대상자 ${index + 1} 교육비`} value={row.amount} onChange={(value) => setEducation((rows) => rows.map((item) => item.id === row.id ? { ...item, amount: value } : item))} />
            </div>)}
            <button type="button" disabled={education.length >= 100} onClick={() => setEducation((rows) => [...rows, { id: nextId.current++, relationship: 'descendant', kind: 'school', amount: '' }])} className="min-h-[44px] rounded-xl border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 disabled:opacity-40">+ 교육비 대상자 추가</button>
          </Group>
        </>}
        <Group title="기부금" hint="2026년에 낸 기부금만 입력합니다. 정치자금·고향사랑은 본인 기부액만 해당합니다. 이전 연도 이월 기부금·우리사주조합 기부금·특별재난지역 고향사랑 기부금은 지원 범위 밖입니다.">
          {field('political', '정치자금 기부금')}{field('hometown', '고향사랑 기부금 (일반지역)')}
          {itemized && <>{field('special', '특례 기부금', '국가·지방자치단체·법정 공익기관 등 해당 유형 기부금입니다.')}{field('general', '일반 기부금 (종교단체 제외)')}{field('religious', '종교단체 기부금')}</>}
        </Group>
        <Group title="월세·혼인">
          {itemized && <><label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={rentEligible} onChange={(event) => setRentEligible(event.target.checked)} />월세 세액공제의 주택·계약·거주 요건 충족</label><p className={noteClass}>무주택 등 세대 요건, 국민주택규모 또는 기준시가 4억원 이하 주택, 계약서와 주민등록 주소 일치 등 요건을 확인하세요. 총급여 8천만원 이하 기준을 자동 적용합니다. 배우자와 나누는 경우 합산 지출 한도 1천만원을 고려한 본인 공제 대상액만 입력하세요.</p>{rentEligible && field('rentPaid', '공제 대상 연간 월세액')}</>}
          <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={marriedThisYear} onChange={(event) => setMarriedThisYear(event.target.checked)} />2026년 혼인신고 · 생애 최초 혼인세액공제 신청</label><p className={noteClass}>본인 1명의 혼인세액공제 50만원을 반영합니다. 배우자의 세금은 별도로 계산하세요.</p>
        </Group>
        </div>
      </section>
      <aside aria-label="연말정산 결과" className="order-2 min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2"><div className="calc-card p-5 lg:sticky lg:top-6"><h2 className="mb-4 text-base font-bold text-slate-800">예상 정산 결과</h2>{result ? <Result result={result} /> : <div className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-semibold text-slate-700">{inputErrors ? '입력 오류를 수정해 주세요.' : !requiredReady ? '급여·비과세 급여·이미 낸 소득세와 지방소득세를 입력해 주세요.' : '입력 조건을 확인해 주세요.'}</p>{requiredReady && !calculated.ok && <ul role="alert" className="mt-3 list-disc space-y-1 pl-4 text-xs leading-5 text-red-600">{calculated.errors.map((error) => <li key={error}>{error}</li>)}</ul>}<p className={`mt-3 ${noteClass}`}>필수 입력이 갖춰지면 즉시 계산합니다. 이미 낸 소득세가 없으면 0을 입력하세요. 공제는 해당하는 항목만 추가하면 됩니다. 선택하지 않은 공제 항목은 적용하지 않습니다.</p></div>}</div></aside>
    </div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600"><h2 className="mb-2 font-bold text-slate-800">이 결과는 어떻게 계산하나요?</h2><p>지급총액에서 비과세 급여와 근로소득공제·소득공제를 빼 과세표준을 구합니다. 누진세율로 산출한 세금에서 세액공제를 빼 최종 세금을 예상한 뒤, 이미 낸 세금과 비교합니다. 선납액이 더 크면 환급, 부족하면 추가 납부입니다.</p><p className="mt-2">2026년 귀속 기준은 2026년 10월 14일까지 확인한 법령과 적용례를 반영했습니다. 외국인 단일세율·중소기업 취업자 감면·해외납부세액·투자조합 공제 등 별도 특례와 다른 종류의 소득은 포함하지 않습니다. 지방소득세는 예상 소득세의 10%로 계산합니다.</p><p className="mt-2">공제 대상 여부와 개별 지출 한도는 홈택스 간소화 자료·영수증에서 확인한 금액을 사용하세요. 입력값은 브라우저에서만 계산하며 저장하지 않습니다.</p><Link href="/guide/withholding-year-end" className="mt-3 inline-block font-semibold text-blue-700 underline">원천징수와 연말정산이 이어지는 원리 →</Link></section>
    <div className="mt-6"><SourceNote calculator="year-end-tax-calculator" /></div>
    <RelatedCalculators current="year-end-tax-calculator" items={[{ href: '/withholding-calculator', label: '원천징수세액 계산기', emoji: '💰' }, { href: '/tax-free-income-calculator', label: '근로소득 비과세 계산기', emoji: '🧮' }, { href: '/income-tax-calculator', label: '종합소득세 계산기', emoji: '📊' }]} />
  </main>
}
