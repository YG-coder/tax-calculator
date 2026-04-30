// src/app/inheritance-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 상속세 누진세율 (증여세와 동일, 2026년 기준)
function calcInheritanceTax(base: number): number {
  if (base <= 0) return 0
  if (base <= 100_000_000)   return Math.floor(base * 0.10)
  if (base <= 500_000_000)   return Math.floor(10_000_000  + (base - 100_000_000) * 0.20)
  if (base <= 1_000_000_000) return Math.floor(90_000_000  + (base - 500_000_000) * 0.30)
  if (base <= 3_000_000_000) return Math.floor(240_000_000 + (base - 1_000_000_000) * 0.40)
  return Math.floor(1_040_000_000 + (base - 3_000_000_000) * 0.50)
}

const DEDUCTION_PRESETS = [
  { label: '일괄공제 5억', value: '500000000', desc: '기본 선택' },
  { label: '배우자 포함 (최소 5억+배우자공제)', value: '1000000000', desc: '배우자 존재 시' },
  { label: '직접 입력', value: 'custom', desc: '' },
]

export default function InheritanceTaxCalculatorPage() {
  const [estate,        setEstate]        = useState('')
  const [deductPreset,  setDeductPreset]  = useState('500000000')
  const [customDeduct,  setCustomDeduct]  = useState('')

  const estateNum = parseNum(estate)
  const deductNum = deductPreset === 'custom' ? parseNum(customDeduct) : parseNum(deductPreset)
  const hasValue  = estateNum > 0

  const taxBase  = Math.max(0, estateNum - deductNum)
  const tax      = calcInheritanceTax(taxBase)
  const totalTax = tax  // 상속세는 지방소득세 없음

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">상속세 계산기</h1>
      <p className="text-slate-500 mb-6">상속재산·공제 기준 예상 상속세 간이 계산 · 참고용</p>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">상속 정보 입력</h2>

        <div>
          <label className="calc-label">상속재산 총액 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={estate}
              onChange={(e) => setEstate(formatInput(e.target.value))}
              placeholder="예: 1,000,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">부동산, 금융자산, 기타 상속재산의 합계 (시가 기준)</p>
        </div>

        <div>
          <label className="calc-label">상속공제 선택</label>
          <div className="flex flex-wrap gap-2">
            {DEDUCTION_PRESETS.map(({ label, value, desc }) => (
              <button key={value} type="button"
                onClick={() => setDeductPreset(value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all text-left ${
                  deductPreset === value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>
                <span>{label}</span>
                {desc && <span className={`block text-xs mt-0.5 ${deductPreset === value ? 'text-blue-200' : 'text-slate-400'}`}>{desc}</span>}
              </button>
            ))}
          </div>
          {deductPreset === 'custom' && (
            <div className="relative mt-2">
              <input type="text" inputMode="numeric" value={customDeduct}
                onChange={(e) => setCustomDeduct(formatInput(e.target.value))}
                placeholder="공제금액 직접 입력" className="calc-input pr-8" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
            </div>
          )}
          <p className="calc-hint">기본공제 2억 + 기타인적공제, 또는 일괄공제 5억 중 큰 금액 선택 가능</p>
        </div>

        {hasValue && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">입력 요약</p>
            <div className="flex justify-between"><span>상속재산</span><span className="font-medium text-slate-700">{fmt(estateNum)}원</span></div>
            <div className="flex justify-between"><span>상속공제</span><span className="font-medium text-emerald-600">−{fmt(deductNum)}원</span></div>
            <div className="flex justify-between"><span>과세표준</span><span className="font-medium text-slate-700">{fmt(taxBase)}원</span></div>
          </div>
        )}
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          {taxBase > 0 ? (
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 상속세</p>
              <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
              <p className="mt-2 text-sm text-blue-100">과세표준 {fmt(taxBase)}원 기준</p>
            </div>
          ) : (
            <div className="calc-card p-6 bg-emerald-50 border-emerald-100">
              <p className="text-base font-bold text-emerald-700 mb-1">상속세 없음</p>
              <p className="text-sm text-emerald-600">상속재산이 공제한도 이하이므로 상속세가 발생하지 않습니다.</p>
            </div>
          )}

          {taxBase > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">상속재산 총액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(estateNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">상속공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(deductNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">예상 상속세</span>
                  <span className="font-bold text-red-500 tabular-nums">−{fmt(totalTax)} 원</span>
                </li>
              </ul>
            </div>
          )}

          <div className="calc-card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">⚠ 참고용 계산:</strong> 실제 상속세는 상속인 구성, 배우자공제, 금융재산공제, 동거주택공제, 신고세액공제(3%) 등 다양한 항목이 반영됩니다. 본 계산기는 과세표준에 기본 누진세율을 적용한 간이 계산으로, 실제 신고 세액과 상당한 차이가 있을 수 있습니다. 반드시 세무사 상담을 통해 확인하세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          상속재산을 입력하면 계산됩니다
        </div>
      )}

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">상속세란?</h2>
          <p>사망으로 인한 재산의 무상 이전 시 상속인이 납부하는 세금입니다. 상속재산 합계에서 상속공제를 차감한 과세표준에 누진세율을 적용합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주요 상속공제 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>일괄공제: 5억원 (기본공제 2억 + 기타인적공제와 비교해 큰 금액 선택)</li>
            <li>배우자공제: 최소 5억원 ~ 최대 30억원</li>
            <li>금융재산공제: 금융재산의 20% (최대 2억원)</li>
            <li>동거주택 상속공제: 최대 6억원</li>
            <li>신고세액공제: 납부세액의 3%</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="inheritance-tax-calculator" />
    </main>
  )
}
