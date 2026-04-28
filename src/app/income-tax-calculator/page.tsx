// src/app/income-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 2026년 종합소득세 누진세율
function calcIncomeTax(base: number): number {
  if (base <= 14_000_000)  return Math.floor(base * 0.06)
  if (base <= 50_000_000)  return Math.floor(840_000    + (base - 14_000_000)  * 0.15)
  if (base <= 88_000_000)  return Math.floor(6_240_000  + (base - 50_000_000)  * 0.24)
  if (base <= 150_000_000) return Math.floor(15_360_000 + (base - 88_000_000)  * 0.35)
  if (base <= 300_000_000) return Math.floor(37_060_000 + (base - 150_000_000) * 0.38)
  if (base <= 500_000_000) return Math.floor(94_060_000 + (base - 300_000_000) * 0.40)
  if (base <= 1_000_000_000) return Math.floor(174_060_000 + (base - 500_000_000) * 0.42)
  return Math.floor(384_060_000 + (base - 1_000_000_000) * 0.45)
}

export default function IncomeTaxCalculatorPage() {
  const [income, setIncome]   = useState('')
  const [expense, setExpense] = useState('')

  const incomeNum  = parseNum(income)
  const expenseNum = parseNum(expense)
  const hasValue   = incomeNum > 0

  const taxBase    = Math.max(0, incomeNum - expenseNum)
  const incomeTax  = calcIncomeTax(taxBase)
  const localTax   = Math.floor(incomeTax * 0.1)
  const totalTax   = incomeTax + localTax
  const netIncome  = incomeNum - totalTax
  const effectiveRate = incomeNum > 0 ? ((totalTax / incomeNum) * 100).toFixed(1) : '0'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">종합소득세 계산기</h1>
      <p className="text-slate-500 mb-6">2026년 누진세율 기준 · 간이 계산 (공제 미반영)</p>

      {/* 입력 카드 */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">소득 정보 입력</h2>

        <div>
          <label className="calc-label">연 소득 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={income}
              onChange={(e) => setIncome(formatInput(e.target.value))}
              placeholder="예: 50,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">세전 연간 총 소득을 입력하세요</p>
        </div>

        <div>
          <label className="calc-label">필요경비 / 공제액 <span className="text-xs font-normal text-slate-400">(선택)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={expense}
              onChange={(e) => setExpense(formatInput(e.target.value))}
              placeholder="예: 10,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">필요경비, 소득공제 합계 (입력 시 과세표준에서 차감)</p>
        </div>

        {hasValue && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">입력 요약</p>
            <div className="flex justify-between"><span>연 소득</span><span className="font-medium text-slate-700">{fmt(incomeNum)}원</span></div>
            {expenseNum > 0 && <div className="flex justify-between"><span>필요경비/공제</span><span className="font-medium text-emerald-600">−{fmt(expenseNum)}원</span></div>}
            <div className="flex justify-between"><span>과세표준</span><span className="font-medium text-slate-700">{fmt(taxBase)}원</span></div>
          </div>
        )}
      </div>

      {/* 결과 */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">총 세액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
              <span>실효세율 {effectiveRate}%</span>
              <span>과세표준 {fmt(taxBase)}원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="calc-card p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">세후 소득</p>
              <p className="text-lg font-bold text-emerald-600 tabular-nums">{fmt(netIncome)}원</p>
            </div>
            <div className="calc-card p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">과세표준</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmt(taxBase)}원</p>
            </div>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">세금 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세</span><span className="font-bold text-blue-600 tabular-nums">{fmt(incomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (소득세×10%)</span><span className="font-bold text-slate-700 tabular-nums">{fmt(localTax)} 원</span></li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">총 세액</span>
                <span className="font-bold text-red-500 tabular-nums">−{fmt(totalTax)} 원</span>
              </li>
            </ul>
          </div>

          <div className="calc-card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">⚠ 간이 계산 안내:</strong> 본 계산기는 기본공제, 세액공제, 감면 등 각종 공제를 반영하지 않은 단순 참고용입니다. 실제 신고 시 홈택스 또는 세무사를 이용하세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          소득을 입력하면 계산됩니다
        </div>
      )}

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">종합소득세란?</h2>
          <p>사업소득, 프리랜서 소득, 금융소득, 기타소득 등 여러 소득을 합산해 신고하는 세금입니다. 매년 5월 종합소득세 신고 기간에 신고합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">2026년 종합소득세 세율표</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[320px]">
              <thead><tr className="bg-slate-50"><th className="px-3 py-2 text-left font-semibold text-slate-600">과세표준</th><th className="px-3 py-2 text-right font-semibold text-slate-600">세율</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[['1,400만원 이하','6%'],['1,400만~5,000만원','15%'],['5,000만~8,800만원','24%'],['8,800만~1.5억원','35%'],['1.5억~3억원','38%'],['3억~5억원','40%'],['5억~10억원','42%'],['10억원 초과','45%']].map(([range,rate])=>(
                  <tr key={range} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{range}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주의사항</h2>
          <p>실제 종합소득세는 필요경비, 인적공제, 세액공제, 감면 항목에 따라 크게 달라집니다. 본 계산기는 대략적인 규모 파악용입니다.</p>
        </div>
      </section>

      <RelatedCalculators current="income-tax-calculator" />
    </main>
  )
}
