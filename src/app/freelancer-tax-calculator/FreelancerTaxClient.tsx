// src/app/freelancer-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

export default function FreelancerTaxCalculatorPage() {
  const [amount, setAmount] = useState('')

  const parsed   = parseNum(amount)
  const hasValue = parsed > 0

  const incomeTax = Math.floor(parsed * 0.03)   // 소득세 3%
  const localTax  = Math.floor(parsed * 0.003)  // 지방소득세 0.3%
  const totalTax  = incomeTax + localTax         // 합계 3.3%
  const net       = parsed - totalTax

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">프리랜서 3.3% 계산기</h1>
      <p className="text-slate-500 mb-6">원천징수 3.3% · 소득세 3% + 지방소득세 0.3%</p>

      <div className="calc-card p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800">계약 금액 입력</h2>
        <div>
          <label className="calc-label">수입 금액 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={amount}
              onChange={(e) => setAmount(formatInput(e.target.value))}
              placeholder="예: 1,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">계약금액(세전)을 입력하세요</p>
        </div>
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">실수령액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(net)}<span className="text-2xl font-bold ml-1">원</span></p>
            <p className="mt-2 text-sm text-blue-100">원천징수 {fmt(totalTax)}원 공제 후</p>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">공제 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">계약금액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(parsed)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세 (3%)</span><span className="font-bold text-blue-600 tabular-nums">−{fmt(incomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (0.3%)</span><span className="font-bold text-slate-600 tabular-nums">−{fmt(localTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-500">합계 원천징수 (3.3%)</span><span className="text-slate-500 tabular-nums">−{fmt(totalTax)} 원</span></li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">실수령액</span>
                <span className="font-bold text-emerald-600 tabular-nums">{fmt(net)} 원</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 text-center">
            3.3%는 선납 원천징수입니다. 종합소득세 신고 시 실제 세액에 따라 환급 또는 추가 납부가 발생할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          금액을 입력하면 계산됩니다
        </div>
      )}

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">프리랜서 3.3% 원천징수란?</h2>
          <p>프리랜서·개인 용역 제공자는 대금 수령 시 소득세 3%와 지방소득세 0.3%를 합산한 3.3%가 먼저 원천징수됩니다. 발주처(사업자)가 세금을 떼고 나머지를 지급하는 구조입니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">계산 방법</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>소득세 = 수입금액 × 3%</li>
            <li>지방소득세 = 수입금액 × 0.3%</li>
            <li>총 원천징수 = 수입금액 × 3.3%</li>
            <li>실수령액 = 수입금액 − 총 원천징수</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주의사항</h2>
          <p>3.3%는 최종 세금이 아닌 선납 개념입니다. 종합소득세 신고 시 실제 소득·필요경비·공제에 따라 추가 납부 또는 환급이 발생합니다. 본 계산기는 참고용입니다.</p>
        </div>
      </section>

      <RelatedCalculators current="freelancer-tax-calculator" />
    </main>
  )
}
