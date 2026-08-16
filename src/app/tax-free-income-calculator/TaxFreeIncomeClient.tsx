// src/app/tax-free-income-calculator/TaxFreeIncomeClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return Math.round(n).toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

/* ────────────────────────────────────────────────────────────
   2026년 근로소득 비과세 한도 (국세청·국가법령정보센터 기준)
   · 식대                    : 월 20만원 (소득령 §17의2)
   · 자가운전보조금          : 월 20만원 (소득령 §12)
   · 출산·보육수당(6세 이하) : 자녀 1인당 월 20만원 (2026 개정, 소득세법 §12)
   · 연구보조비·연구활동비   : 월 20만원 (소득령 §12)
   · 국외근로소득            : 일반 월 100만원 / 원양어업·외항선박·해외건설현장 월 500만원 (소득령 §16)
   · 생산직 연장·야간·휴일   : 연 240만원, 월정액급여 260만원 이하 + 직전연도 총급여 3,700만원 이하 (소득령 §17)
   ──────────────────────────────────────────────────────────── */
const CAP = {
  MEAL: 200_000,
  CAR: 200_000,
  CHILDCARE_PER_CHILD: 200_000,
  RESEARCH: 200_000,
  OVERSEAS_GENERAL: 1_000_000,
  OVERSEAS_SPECIAL: 5_000_000,
  PRODUCTION_ANNUAL: 2_400_000,
  PRODUCTION_FIXED_PAY: 2_600_000,
  PRODUCTION_PREV_SALARY: 37_000_000,
} as const

type Row = {
  key: string
  label: string
  paid: number        // 월 지급액
  free: number        // 월 비과세 인정액
  eligible: boolean   // 요건 충족 여부
  note: string        // 요건/상태 설명
}

export default function TaxFreeIncomeCalculatorPage() {
  // 과세 기본급
  const [base, setBase] = useState('')

  // 식대
  const [meal, setMeal] = useState('')
  const [mealNoMeals, setMealNoMeals] = useState(false)

  // 자가운전보조금
  const [car, setCar] = useState('')
  const [carOwn, setCarOwn] = useState(false)
  const [carWork, setCarWork] = useState(false)
  const [carNoTravel, setCarNoTravel] = useState(false)

  // 출산·보육수당
  const [childcare, setChildcare] = useState('')
  const [childCount, setChildCount] = useState('0')

  // 연구보조비
  const [research, setResearch] = useState('')
  const [researchEligible, setResearchEligible] = useState(false)

  // 국외근로소득
  const [overseas, setOverseas] = useState('')
  const [overseasType, setOverseasType] = useState<'none' | 'general' | 'special'>('none')

  // 생산직 초과근로수당
  const [production, setProduction] = useState('')
  const [prodIsProduction, setProdIsProduction] = useState(false)
  const [prodFixedPay, setProdFixedPay] = useState('')
  const [prodPrevSalary, setProdPrevSalary] = useState('')
  const [prodYtdFree, setProdYtdFree] = useState('') // 올해 이번 달 직전까지 적용받은 비과세 초과근로수당

  // 기타 비과세
  const [other, setOther] = useState('')
  const [otherConfirm, setOtherConfirm] = useState(false)

  // ── 숫자 변환
  const baseN = parseNum(base)
  const mealN = parseNum(meal)
  const carN = parseNum(car)
  const childcareN = parseNum(childcare)
  const childN = Math.max(0, Number(childCount) || 0)
  const researchN = parseNum(research)
  const overseasN = parseNum(overseas)
  const productionN = parseNum(production)
  const prodFixedN = parseNum(prodFixedPay)
  const prodPrevN = parseNum(prodPrevSalary)
  const prodYtdFreeN = parseNum(prodYtdFree)
  const otherN = parseNum(other)

  // ── 항목별 비과세 판정 (월 기준)
  const carOk = carOwn && carWork && carNoTravel
  const overseasCap =
    overseasType === 'general' ? CAP.OVERSEAS_GENERAL
      : overseasType === 'special' ? CAP.OVERSEAS_SPECIAL
        : 0
  const prodOk =
    prodIsProduction &&
    prodFixedN > 0 && prodFixedN <= CAP.PRODUCTION_FIXED_PAY &&
    prodPrevN > 0 && prodPrevN <= CAP.PRODUCTION_PREV_SALARY

  // 생산직: 연 240만원은 "연 누적 한도"이며 월 한도가 아님.
  // 이번 달 비과세 = min(이번 달 지급액, 잔여 연한도)
  const prodRemainingCap = Math.max(0, CAP.PRODUCTION_ANNUAL - prodYtdFreeN)
  const prodMonthlyFree = prodOk ? Math.min(productionN, prodRemainingCap) : 0

  const rows: Row[] = [
    {
      key: 'meal',
      label: '식대',
      paid: mealN,
      free: mealNoMeals ? Math.min(mealN, CAP.MEAL) : 0,
      eligible: mealNoMeals,
      note: !mealNoMeals
        ? '현물 식사 미제공 요건 미확인 → 전액 과세'
        : mealN > CAP.MEAL ? `월 20만원 초과분 ${fmt(mealN - CAP.MEAL)}원 과세` : '월 20만원 한도 내 비과세',
    },
    {
      key: 'car',
      label: '자가운전보조금',
      paid: carN,
      free: carOk ? Math.min(carN, CAP.CAR) : 0,
      eligible: carOk,
      note: !carOk
        ? '본인 차량·업무용·여비 미수령 요건 미충족 → 전액 과세'
        : carN > CAP.CAR ? `월 20만원 초과분 ${fmt(carN - CAP.CAR)}원 과세` : '월 20만원 한도 내 비과세',
    },
    {
      key: 'childcare',
      label: '출산·보육수당',
      paid: childcareN,
      free: Math.min(childcareN, CAP.CHILDCARE_PER_CHILD * childN),
      eligible: childN > 0,
      note: childN === 0
        ? '6세 이하 자녀 0명 → 비과세 불가'
        : childcareN > CAP.CHILDCARE_PER_CHILD * childN
          ? `자녀 ${childN}명 × 월 20만원 초과분 과세`
          : `자녀 ${childN}명 기준 월 ${fmt(CAP.CHILDCARE_PER_CHILD * childN)}원 한도 내 비과세`,
    },
    {
      key: 'research',
      label: '연구보조비·연구활동비',
      paid: researchN,
      free: researchEligible ? Math.min(researchN, CAP.RESEARCH) : 0,
      eligible: researchEligible,
      note: !researchEligible
        ? '교원·연구원 등 대상 요건 미확인 → 전액 과세'
        : researchN > CAP.RESEARCH ? `월 20만원 초과분 ${fmt(researchN - CAP.RESEARCH)}원 과세` : '월 20만원 한도 내 비과세',
    },
    {
      key: 'overseas',
      label: '국외근로소득',
      paid: overseasN,
      free: Math.min(overseasN, overseasCap),
      eligible: overseasType !== 'none',
      note: overseasType === 'none'
        ? '국외근무 아님 → 과세'
        : overseasN > overseasCap
          ? `한도(월 ${fmt(overseasCap)}원) 초과분 과세`
          : `${overseasType === 'special' ? '건설·해운 등 월 500만원' : '일반 월 100만원'} 한도 내 비과세`,
    },
    {
      key: 'production',
      label: '생산직 초과근로수당',
      paid: productionN,
      free: prodMonthlyFree,
      eligible: prodOk,
      note: !prodIsProduction
        ? '생산직 아님 → 과세'
        : !(prodFixedN > 0 && prodFixedN <= CAP.PRODUCTION_FIXED_PAY)
          ? '월정액급여 260만원 이하 요건 미충족 → 과세'
          : !(prodPrevN > 0 && prodPrevN <= CAP.PRODUCTION_PREV_SALARY)
            ? '직전연도 총급여 3,700만원 이하 요건 미충족 → 과세'
            : prodRemainingCap === 0
              ? '올해 연 한도 240만원 소진 → 이번 달 전액 과세'
              : productionN > prodRemainingCap
                ? `잔여 연한도 ${fmt(prodRemainingCap)}원까지 비과세, 초과분 ${fmt(productionN - prodRemainingCap)}원 과세`
                : `연 240만원 한도 내 비과세 (적용 후 잔여 ${fmt(prodRemainingCap - prodMonthlyFree)}원)`,
    },
    {
      key: 'other',
      label: '기타 비과세 급여',
      paid: otherN,
      free: otherConfirm ? otherN : 0,
      eligible: otherConfirm,
      note: !otherConfirm
        ? '비과세 요건 충족 확인 필요 → 과세 처리'
        : '요건 충족 확인됨 (사용자 입력 기준)',
    },
  ]

  // ── 합계
  const monthlyGross = baseN + rows.reduce((s, r) => s + r.paid, 0)
  const monthlyFree = rows.reduce((s, r) => s + r.free, 0)
  const monthlyTaxable = monthlyGross - monthlyFree

  const annualGross = monthlyGross * 12
  // 생산직 초과근로수당은 월×12 단순 환산이 아니라 연 240만원 누적 한도(올해 직전월까지 적용분 + 이번 달)를 적용
  const annualProdFree = Math.min(CAP.PRODUCTION_ANNUAL, prodYtdFreeN + prodMonthlyFree)
  const annualFree = (monthlyFree - prodMonthlyFree) * 12 + annualProdFree
  const annualTaxable = annualGross - annualFree

  const hasValue = monthlyGross > 0

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">근로소득 비과세 계산기</h1>
      <p className="text-slate-500 mb-6">
        식대·자가운전보조금·출산·보육수당 등 비과세 급여를 반영해 월·연 과세대상 급여를 계산합니다 · 2026년 기준 · 참고용
      </p>

      {/* ── 입력 ─────────────────────────────────────────── */}
      <div className="calc-card p-6 space-y-6">
        <div>
          <label className="calc-label">월 기본급 및 과세 수당 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={base}
              onChange={(e) => setBase(formatInput(e.target.value))}
              placeholder="예: 3,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">비과세 항목을 뺀, 과세되는 급여(기본급·직책수당 등)를 입력하세요</p>
        </div>

        {/* 식대 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">식대 <span className="text-slate-400 font-normal">(월 20만원 한도)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={meal}
              onChange={(e) => setMeal(formatInput(e.target.value))}
              placeholder="예: 200,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <label className="flex items-start gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={mealNoMeals} onChange={(e) => setMealNoMeals(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs text-slate-500">회사에서 현물 식사(구내식당 등)를 제공받지 않습니다</span>
          </label>
        </div>

        {/* 자가운전보조금 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">자가운전보조금 <span className="text-slate-400 font-normal">(월 20만원 한도)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={car}
              onChange={(e) => setCar(formatInput(e.target.value))}
              placeholder="예: 200,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <div className="mt-2 space-y-1.5">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={carOwn} onChange={(e) => setCarOwn(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs text-slate-500">세법상 비과세 대상이 되는 본인 소유 또는 본인 명의 임차 차량입니다</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={carWork} onChange={(e) => setCarWork(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs text-slate-500">회사 업무 수행에 차량을 사용합니다</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={carNoTravel} onChange={(e) => setCarNoTravel(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-xs text-slate-500">별도의 실제 여비(출장비)를 받지 않습니다</span>
            </label>
          </div>
        </div>

        {/* 출산·보육수당 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">출산·보육수당 <span className="text-slate-400 font-normal">(6세 이하 자녀 1인당 월 20만원)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={childcare}
              onChange={(e) => setChildcare(formatInput(e.target.value))}
              placeholder="예: 200,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint mb-1.5">6세 이하(만 6세가 되는 날이 속하는 과세기간까지) 자녀 수</p>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button key={n} type="button" onClick={() => setChildCount(String(n))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  childCount === String(n)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{n}명</button>
            ))}
          </div>
        </div>

        {/* 연구보조비 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">연구보조비·연구활동비 <span className="text-slate-400 font-normal">(월 20만원 한도)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={research}
              onChange={(e) => setResearch(formatInput(e.target.value))}
              placeholder="예: 200,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <label className="flex items-start gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={researchEligible} onChange={(e) => setResearchEligible(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs text-slate-500">교원·연구원 등 연구보조비 비과세 대상 직종입니다</span>
          </label>
        </div>

        {/* 국외근로소득 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">국외근로소득</label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={overseas}
              onChange={(e) => setOverseas(formatInput(e.target.value))}
              placeholder="예: 1,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint mb-1.5">근무 유형을 선택하세요 (한도가 달라집니다)</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              ['none', '해당 없음'],
              ['general', '일반 (월 100만)'],
              ['special', '건설·해운 (월 500만)'],
            ] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setOverseasType(v)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  overseasType === v
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {/* 생산직 초과근로수당 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">생산직 연장·야간·휴일근로수당 <span className="text-slate-400 font-normal">(연 240만원 누적 한도)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={production}
              onChange={(e) => setProduction(formatInput(e.target.value))}
              placeholder="이번 달 지급액 예: 500,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">이번 달 지급된 연장·야간·휴일근로수당을 입력하세요 (월 한도가 아니라 연 240만원 누적 한도가 적용됩니다)</p>
          <label className="flex items-start gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={prodIsProduction} onChange={(e) => setProdIsProduction(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs text-slate-500">공장·광산·운전·운송 등 생산 및 그 관련직 근로자입니다</span>
          </label>
          {prodIsProduction && (
            <div className="mt-3 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">월정액급여</label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={prodFixedPay}
                      onChange={(e) => setProdFixedPay(formatInput(e.target.value))}
                      placeholder="예: 2,000,000" className="calc-input pr-8 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
                  </div>
                  <p className="calc-hint">260만원 이하 요건</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">직전연도 총급여</label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={prodPrevSalary}
                      onChange={(e) => setProdPrevSalary(formatInput(e.target.value))}
                      placeholder="예: 28,000,000" className="calc-input pr-8 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
                  </div>
                  <p className="calc-hint">3,700만원 이하 요건</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">올해 이번 달 직전까지 적용받은 비과세 초과근로수당</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={prodYtdFree}
                    onChange={(e) => setProdYtdFree(formatInput(e.target.value))}
                    placeholder="예: 0 (없으면 0)" className="calc-input pr-8 text-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
                </div>
                <p className="calc-hint">연 240만원 한도 중 이미 사용한 금액. 잔여 한도 내에서 이번 달 지급액이 비과세됩니다. 누적액을 입력하지 않으면 올해 처음 비과세 적용을 받는 것으로 계산합니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 기타 비과세 */}
        <div className="border-t border-slate-100 pt-5">
          <label className="calc-label">기타 비과세 급여</label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={other}
              onChange={(e) => setOther(formatInput(e.target.value))}
              placeholder="예: 0" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <label className="flex items-start gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={otherConfirm} onChange={(e) => setOtherConfirm(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs text-slate-500">위 금액이 소득세법상 비과세 요건을 충족함을 확인합니다 (미확인 시 과세로 처리)</span>
          </label>
        </div>
      </div>

      {/* ── 결과 ─────────────────────────────────────────── */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">월 비과세 금액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(monthlyFree)}<span className="text-2xl font-bold ml-1">원</span></p>
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
              <span>월 지급총액 {fmt(monthlyGross)}원</span>
              <span>월 과세대상 급여 {fmt(monthlyTaxable)}원</span>
            </div>
          </div>

          {/* 항목별 내역 */}
          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">항목별 비과세 인정 내역 (월 기준)</h3>
            <ul className="space-y-3">
              {rows.filter((r) => r.paid > 0).map((r) => (
                <li key={r.key} className="text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">{r.label}</span>
                    <span className="tabular-nums">
                      <span className={r.free > 0 ? 'font-bold text-blue-600' : 'text-slate-400'}>비과세 {fmt(r.free)}원</span>
                      {r.paid - r.free > 0 && (
                        <span className="text-slate-400"> · 과세 {fmt(r.paid - r.free)}원</span>
                      )}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${r.eligible ? 'text-slate-400' : 'text-amber-600'}`}>{r.note}</p>
                </li>
              ))}
              {rows.every((r) => r.paid === 0) && (
                <li className="text-sm text-slate-400">입력한 비과세 항목이 없습니다.</li>
              )}
            </ul>
            <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
              ※ 각 항목은 <strong>입력하신 요건(체크박스·자녀 수·근무유형 등)을 충족한다고 가정한 참고값</strong>입니다.
              실제 비과세 인정 여부는 회사 급여규정·지급 명목·증빙에 따라 달라질 수 있습니다.
            </p>
          </div>

          {/* 연간 요약 */}
          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">연간 요약</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">연간 지급총액</span><span className="font-semibold text-slate-700 tabular-nums">{fmt(annualGross)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">연간 비과세 금액</span><span className="font-bold text-blue-600 tabular-nums">{fmt(annualFree)} 원</span></li>
              <li className="flex justify-between text-sm pt-2.5 border-t border-slate-100">
                <span className="font-bold text-slate-800">연간 과세대상 급여</span>
                <span className="font-bold text-slate-800 tabular-nums">{fmt(annualTaxable)} 원</span>
              </li>
            </ul>
            {prodMonthlyFree > 0 && (
              <p className="mt-3 text-xs text-slate-400">
                ※ 생산직 초과근로수당은 월 단순 환산(×12)이 아니라 <strong>연 240만원 누적 한도</strong>(올해 직전월까지 적용분 + 이번 달)를 반영했습니다.
              </p>
            )}
          </div>

          {/* 비과세 적용 전후 차이 */}
          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">비과세 적용 전후 (연간 과세대상 급여 기준)</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">적용 전</p>
                <p className="text-sm font-bold text-slate-700 tabular-nums">{fmt(annualGross)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500 mb-1">적용 후</p>
                <p className="text-sm font-bold text-slate-700 tabular-nums">{fmt(annualTaxable)}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-xs text-blue-600 mb-1">과세대상 감소</p>
                <p className="text-sm font-bold text-blue-700 tabular-nums">−{fmt(annualFree)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              ※ 위 금액은 <strong>과세대상 급여의 감소분</strong>이며, 실제 줄어드는 소득세·4대보험료는 개인의 한계세율·공제 구조에 따라 달라집니다.
              월별 예상 세액은 <Link href="/withholding-calculator" className="text-blue-600 hover:underline">원천징수세액 계산기</Link>로 확인하세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm text-center px-4">
          월 기본급과 비과세 항목을 입력하면 과세대상 급여가 계산됩니다
        </div>
      )}

      {/* 가이드 CTA */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <p className="text-sm font-bold text-slate-800 mb-1">비과세 항목별 조건이 헷갈리시나요?</p>
        <p className="text-sm text-slate-600 mb-3">각 항목의 적용 요건·한도·자주 틀리는 사례를 정리한 가이드를 참고하세요.</p>
        <Link href="/guide/tax-free-income" className="text-sm text-blue-700 font-semibold hover:underline">
          → 근로소득 비과세 판정 방법 가이드
        </Link>
      </div>

      {/* ── SEO 본문 ─────────────────────────────────────── */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">근로소득 비과세란?</h2>
          <p>
            비과세 근로소득은 회사에서 받는 급여 중 <strong>일정한 법정 요건과 한도를 충족하면 소득세 과세 대상에서 제외</strong>되는
            금액입니다. 비과세분은 처음부터 과세표준에 들어가지 않으므로, 같은 연봉이라도 비과세 항목이 많으면
            원천징수세액과 연말정산 세액이 줄어듭니다. 다만 금액을 받았다고 무조건 비과세가 되는 것은 아니며,
            항목마다 요건(현물 식사 제공 여부, 차량 명의, 자녀 연령, 직종 등)을 충족해야 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">이 계산기의 사용법</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>급여명세서에서 <strong>과세 급여</strong>(기본급·직책수당 등)를 먼저 입력합니다.</li>
            <li>식대·자가운전보조금 등 각 <strong>비과세 항목의 지급액</strong>을 입력합니다.</li>
            <li>항목마다 <strong>적용 요건 체크박스</strong>를 확인합니다. 요건을 만족하지 않으면 과세로 처리됩니다.</li>
            <li>한도를 넘는 금액은 <strong>초과분만 과세</strong>되며 한도까지는 비과세로 인정됩니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2026년 항목별 비과세 한도</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[360px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">항목</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">한도</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">핵심 요건</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['식대', '월 20만원', '현물 식사 미제공'],
                  ['자가운전보조금', '월 20만원', '본인 차량·업무용·여비 미수령'],
                  ['출산·보육수당', '자녀 1인당 월 20만원', '6세 이하 자녀'],
                  ['연구보조비', '월 20만원', '교원·연구원 등'],
                  ['국외근로소득', '월 100만 / 500만원', '국외 근무지·업종'],
                  ['생산직 초과근로수당', '연 240만원', '월정액급여 260만원·총급여 3,700만원 이하'],
                ].map(([k, v, c]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{k}</td>
                    <td className="px-3 py-2 font-bold text-blue-600">{v}</td>
                    <td className="px-3 py-2 text-slate-500">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            이 밖에 사용자가 지급하는 <strong>출산지원금</strong>은 자녀 출생일 이후 2년 이내·2회 이내 지급분에 한해 전액 비과세되며(한도 없음),
            본 계산기의 &lsquo;출산·보육수당&rsquo; 항목(6세 이하 월 20만원)과는 별개입니다.
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 국세청·국가법령정보센터의 비과세 근로소득 기준을 반영한 <strong>참고용 도구</strong>입니다.
            실제 비과세 인정 여부는 회사의 급여 규정, 지급 명목, 증빙에 따라 달라질 수 있으며, 4대보험 산정 기준과
            세법상 비과세 기준이 항목별로 다를 수 있습니다. 정확한 적용은 국세청 또는 세무 전문가의 안내를 함께 확인하세요.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제12조(비과세소득) — 국가법령정보센터</li>
            <li>소득세법 시행령 제12조·제16조·제17조·제17조의2 — 국가법령정보센터</li>
            <li>국세청 「비과세 근로소득」 안내 (홈택스)</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="tax-free-income-calculator" />
    </main>
  )
}
