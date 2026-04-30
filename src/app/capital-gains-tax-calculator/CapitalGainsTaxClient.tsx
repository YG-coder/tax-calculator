// src/app/capital-gains-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 양도소득세 누진세율 (기본세율, 2026년 기준)
function calcCapitalGainsTax(base: number): number {
  if (base <= 0) return 0
  if (base <= 14_000_000)  return Math.floor(base * 0.06)
  if (base <= 50_000_000)  return Math.floor(840_000    + (base - 14_000_000)  * 0.15)
  if (base <= 88_000_000)  return Math.floor(6_240_000  + (base - 50_000_000)  * 0.24)
  if (base <= 150_000_000) return Math.floor(15_360_000 + (base - 88_000_000)  * 0.35)
  if (base <= 300_000_000) return Math.floor(37_060_000 + (base - 150_000_000) * 0.38)
  if (base <= 500_000_000) return Math.floor(94_060_000 + (base - 300_000_000) * 0.40)
  if (base <= 1_000_000_000) return Math.floor(174_060_000 + (base - 500_000_000) * 0.42)
  return Math.floor(384_060_000 + (base - 1_000_000_000) * 0.45)
}

export default function CapitalGainsTaxCalculatorPage() {
  const [acquisition, setAcquisition] = useState('')
  const [transfer,    setTransfer]    = useState('')
  const [expense,     setExpense]     = useState('')
  const [deduction,   setDeduction]   = useState('2500000')  // 기본공제 250만원

  const acqNum  = parseNum(acquisition)
  const trnNum  = parseNum(transfer)
  const expNum  = parseNum(expense)
  const dedNum  = parseNum(deduction)

  const hasValue = acqNum > 0 && trnNum > 0

  const gain    = Math.max(0, trnNum - acqNum - expNum)   // 양도차익
  const taxBase = Math.max(0, gain - dedNum)               // 과세표준
  const tax     = calcCapitalGainsTax(taxBase)
  const localTax = Math.floor(tax * 0.1)
  const totalTax = tax + localTax

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">양도소득세 계산기</h1>
      <p className="text-slate-500 mb-6">취득가액·양도가액 기준 예상 세액 간이 계산 · 참고용</p>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">양도 정보 입력</h2>

        {[
          { label: '취득가액', value: acquisition, set: setAcquisition, hint: '매입 당시 가격 (취득세·중개비 포함 가능)', required: true },
          { label: '양도가액', value: transfer,    set: setTransfer,    hint: '매도 금액', required: true },
          { label: '필요경비', value: expense,     set: setExpense,     hint: '중개수수료, 수리비, 취득세 등 (선택)', required: false },
        ].map(({ label, value, set, hint, required }) => (
          <div key={label}>
            <label className="calc-label">
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <input type="text" inputMode="numeric" value={value}
                onChange={(e) => set(formatInput(e.target.value))}
                placeholder="예: 500,000,000" className="calc-input pr-8" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
            </div>
            <p className="calc-hint">{hint}</p>
          </div>
        ))}

        <div>
          <label className="calc-label">기본공제</label>
          <div className="flex gap-2">
            {[{ v: '2500000', l: '250만원 (일반)' }, { v: '0', l: '공제 없음' }].map(({ v, l }) => (
              <button key={v} type="button"
                onClick={() => setDeduction(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  deduction === v
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{l}</button>
            ))}
          </div>
          <p className="calc-hint">연간 양도소득 기본공제 250만원 (1회)</p>
        </div>
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          {gain > 0 ? (
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 양도소득세</p>
              <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
              <p className="mt-2 text-sm text-blue-100">양도차익 {fmt(gain)}원 기준</p>
            </div>
          ) : (
            <div className="calc-card p-6 bg-emerald-50 border-emerald-100">
              <p className="text-base font-bold text-emerald-700 mb-1">양도차익 없음</p>
              <p className="text-sm text-emerald-600">양도가액이 취득가액 이하이므로 양도소득세가 발생하지 않습니다.</p>
            </div>
          )}

          {gain > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">양도가액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(trnNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">취득가액</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(acqNum)} 원</span></li>
                {expNum > 0 && <li className="flex justify-between text-sm"><span className="text-slate-600">필요경비</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(expNum)} 원</span></li>}
                <li className="flex justify-between text-sm"><span className="text-slate-600">양도차익</span><span className="font-bold text-slate-800 tabular-nums">{fmt(gain)} 원</span></li>
                {dedNum > 0 && <li className="flex justify-between text-sm"><span className="text-slate-600">기본공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(dedNum)} 원</span></li>}
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">양도소득세</span><span className="font-bold text-blue-600 tabular-nums">{fmt(tax)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (×10%)</span><span className="font-bold text-slate-600 tabular-nums">{fmt(localTax)} 원</span></li>
                <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">총 세액</span>
                  <span className="font-bold text-red-500 tabular-nums">−{fmt(totalTax)} 원</span>
                </li>
              </ul>
            </div>
          )}

          <div className="calc-card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">⚠ 참고용 계산:</strong> 본 계산기는 기본세율(누진세율)을 적용한 간이 계산입니다. 1세대 1주택 비과세, 장기보유특별공제, 단기양도 중과세, 다주택 중과세, 분양권·주식 등 자산별 규정은 반영하지 않습니다. 실제 세액은 세무사 상담을 통해 확인하세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          취득가액과 양도가액을 입력하면 계산됩니다
        </div>
      )}

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">양도소득세란?</h2>
          <p>부동산, 주식 등 자산을 양도(매도)해 발생한 차익에 부과하는 세금입니다. 취득가액과 양도가액의 차액(양도차익)에서 공제 후 세율을 적용해 계산합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주요 비과세·공제 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>1세대 1주택 2년 이상 보유 시 9억원 이하 비과세</li>
            <li>장기보유특별공제: 보유기간에 따라 최대 80% 공제</li>
            <li>기본공제: 연간 250만원</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주의사항</h2>
          <p>본 계산기는 기본세율 적용 간이 계산입니다. 다주택 중과세, 단기양도, 분양권·주식 등 자산 유형별로 세율이 크게 다를 수 있으므로 반드시 세무 전문가에게 확인하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="capital-gains-tax-calculator" />
    </main>
  )
}
