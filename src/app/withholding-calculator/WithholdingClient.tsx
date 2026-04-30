// src/app/withholding-calculator/page.tsx
'use client'

import { useState, useCallback } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 간이세액표 근사 계산 (2025~2026년 기준)
// 정확한 결과는 국세청 간이세액표 사용 필요
function calcWithholdingTax(monthlyTaxable: number, dependents: number): number {
  const annual = monthlyTaxable * 12

  // 근로소득공제
  let wageDeduction = 0
  if      (annual <= 5_000_000)   wageDeduction = annual * 0.70
  else if (annual <= 15_000_000)  wageDeduction = 3_500_000  + (annual - 5_000_000)   * 0.40
  else if (annual <= 45_000_000)  wageDeduction = 7_500_000  + (annual - 15_000_000)  * 0.15
  else if (annual <= 100_000_000) wageDeduction = 12_000_000 + (annual - 45_000_000)  * 0.05
  else                            wageDeduction = 14_750_000
  wageDeduction = Math.min(wageDeduction, 14_000_000)

  const basicDeduction = 1_500_000 * Math.max(1, dependents)
  const taxBase = Math.max(0, annual - wageDeduction - basicDeduction)

  let grossTax = 0
  if      (taxBase <= 14_000_000)    grossTax = taxBase * 0.06
  else if (taxBase <= 50_000_000)    grossTax = 840_000    + (taxBase - 14_000_000)  * 0.15
  else if (taxBase <= 88_000_000)    grossTax = 6_240_000  + (taxBase - 50_000_000)  * 0.24
  else if (taxBase <= 150_000_000)   grossTax = 15_360_000 + (taxBase - 88_000_000)  * 0.35
  else if (taxBase <= 300_000_000)   grossTax = 37_060_000 + (taxBase - 150_000_000) * 0.38
  else if (taxBase <= 500_000_000)   grossTax = 94_060_000 + (taxBase - 300_000_000) * 0.40
  else if (taxBase <= 1_000_000_000) grossTax = 174_060_000 + (taxBase - 500_000_000) * 0.42
  else                               grossTax = 384_060_000 + (taxBase - 1_000_000_000) * 0.45

  let credit = grossTax <= 1_300_000 ? grossTax * 0.55 : 715_000 + (grossTax - 1_300_000) * 0.30
  credit = Math.min(credit, 740_000)

  const annualTax = Math.max(0, grossTax - credit)
  return Math.floor(Math.floor(annualTax / 12) / 10) * 10
}

export default function WithholdingCalculatorPage() {
  const [salary,     setSalary]     = useState('')
  const [dependents, setDependents] = useState('1')
  const [childCount, setChildCount] = useState('0')

  const salaryNum   = parseNum(salary)
  const depNum      = Math.max(1, Number(dependents) || 1)
  const childNum    = Math.max(0, Number(childCount) || 0)
  const hasValue    = salaryNum > 0

  const handleCalc = useCallback(() => {}, [])  // 입력 시 즉시 계산 (실시간)

  const incomeTax  = calcWithholdingTax(salaryNum, depNum)
  const localTax   = Math.floor(incomeTax * 0.1 / 10) * 10
  const totalTax   = incomeTax + localTax
  const netPay     = salaryNum - totalTax

  // 20세 이하 자녀 세액공제 (월 환산)
  // 1명: 연 15만원, 2명: 연 35만원, 3명~: +30만원/명
  const childCredit = childNum === 0 ? 0
    : childNum === 1 ? Math.floor(150_000 / 12)
    : childNum === 2 ? Math.floor(350_000 / 12)
    : Math.floor((350_000 + (childNum - 2) * 300_000) / 12)

  const finalIncomeTax = Math.max(0, incomeTax - childCredit)
  const finalLocalTax  = Math.floor(finalIncomeTax * 0.1 / 10) * 10
  const finalTotal     = finalIncomeTax + finalLocalTax
  const finalNet       = salaryNum - finalTotal

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">원천징수세액 계산기</h1>
      <p className="text-slate-500 mb-6">월 급여·부양가족 기준 예상 원천징수세액 간이 계산</p>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">급여 정보 입력</h2>

        <div>
          <label className="calc-label">월 급여 (세전) <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={salary}
              onChange={(e) => setSalary(formatInput(e.target.value))}
              placeholder="예: 3,500,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">월 세전 급여를 입력하세요</p>
        </div>

        <div>
          <label className="calc-label">부양가족 수 (본인 포함)</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((n) => (
              <button key={n} type="button"
                onClick={() => setDependents(String(n))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  dependents === String(n)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{n}명</button>
            ))}
          </div>
          <p className="calc-hint">본인 포함 기본공제 대상 인원 (1인당 연 150만원 공제)</p>
        </div>

        <div>
          <label className="calc-label">20세 이하 자녀 수</label>
          <div className="flex gap-2">
            {[0,1,2,3].map((n) => (
              <button key={n} type="button"
                onClick={() => setChildCount(String(n))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  childCount === String(n)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{n}명</button>
            ))}
          </div>
          <p className="calc-hint">자녀세액공제 반영 (1명 15만원/년, 2명 35만원/년, 3명~ +30만원/명)</p>
        </div>
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 실수령액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(finalNet)}<span className="text-2xl font-bold ml-1">원</span></p>
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
              <span>월 세전 {fmt(salaryNum)}원</span>
              <span>총 공제 {fmt(finalTotal)}원</span>
            </div>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">원천징수 내역 (세금만)</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세 (간이세액표 근사)</span><span className="font-bold text-blue-600 tabular-nums">{fmt(finalIncomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (소득세×10%)</span><span className="font-bold text-slate-600 tabular-nums">{fmt(finalLocalTax)} 원</span></li>
              {childCredit > 0 && (
                <li className="flex justify-between text-sm"><span className="text-emerald-600">자녀세액공제 적용</span><span className="font-bold text-emerald-600 tabular-nums">−{fmt(childCredit)} 원/월</span></li>
              )}
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">세금 합계</span>
                <span className="font-bold text-red-500 tabular-nums">−{fmt(finalTotal)} 원</span>
              </li>
            </ul>
          </div>

          <div className="calc-card p-4 bg-sky-50 border-sky-100">
            <p className="text-xs text-sky-700 leading-relaxed">
              <strong className="font-semibold">ℹ 안내:</strong> 본 결과는 소득세·지방소득세만 반영한 참고값입니다. 실제 급여명세서에는 국민연금, 건강보험, 장기요양, 고용보험 등 4대보험 공제가 추가됩니다.
              4대보험 포함 전체 실수령액은{' '}
              <a href="https://연봉계산기.kr/salary-calculator" className="underline font-medium" target="_blank" rel="noopener noreferrer">연봉계산기.kr</a>에서 확인하세요.
            </p>
          </div>

          <div className="calc-card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">⚠ 간이 계산 안내:</strong> 본 계산기는 국세청 간이세액표를 직접 참조하지 않는 근사값입니다. 비과세 수당, 상여금, 중도입사·퇴사, 회사별 급여 구조에 따라 실제와 차이가 납니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          월 급여를 입력하면 예상 원천징수세액이 표시됩니다
        </div>
      )}

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">원천징수세액이란?</h2>
          <p>급여 지급 시 사용자(회사)가 미리 공제하는 소득세·지방소득세입니다. 국세청 간이세액표를 기준으로 매월 공제하고, 연말정산에서 최종 세액을 정산합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">계산 방법</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>근로소득공제 → 과세표준 산출</li>
            <li>누진세율 적용 → 소득세 산출</li>
            <li>근로소득세액공제 (최대 74만원) 적용</li>
            <li>자녀세액공제 추가 적용</li>
            <li>지방소득세 = 소득세 × 10%</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주의사항</h2>
          <p>본 계산기는 간이 근사값으로, 국세청 간이세액표 직접 참조 결과와 차이가 있을 수 있습니다. 비과세 항목, 중도입사, 상여금 등은 반영하지 않습니다. 4대보험 공제는 별도 계산이 필요합니다.</p>
        </div>
      </section>

      <RelatedCalculators current="withholding-calculator" />
    </main>
  )
}
