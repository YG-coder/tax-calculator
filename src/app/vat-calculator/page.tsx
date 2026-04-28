// src/app/vat-calculator/page.tsx
'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

// metadata는 'use client'와 함께 사용 불가 → layout 또는 별도 처리
// 이 파일은 Client Component이므로 metadata는 generateMetadata로 불가
// → page 상단에 export metadata 제거, SEO는 layout template으로 처리

function fmt(n: number) { return n.toLocaleString('ko-KR') }

function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

export default function VatCalculatorPage() {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'inclusive' | 'exclusive'>('inclusive')

  const parsed = parseNum(amount)
  const hasValue = parsed > 0

  const supply = mode === 'inclusive' ? Math.floor(parsed / 1.1) : parsed
  const vat    = mode === 'inclusive' ? parsed - supply : Math.floor(parsed * 0.1)
  const total  = mode === 'inclusive' ? parsed : supply + vat

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">부가세 계산기</h1>
      <p className="text-slate-500 mb-6">부가세 포함/별도 선택 · 공급가액·세액·합계 자동 계산</p>

      {/* 입력 카드 */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">금액 입력</h2>

        <div className="flex gap-2">
          {(['inclusive', 'exclusive'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                mode === m
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {m === 'inclusive' ? '부가세 포함' : '부가세 별도'}
            </button>
          ))}
        </div>

        <div>
          <label className="calc-label">
            {mode === 'inclusive' ? '부가세 포함 금액' : '공급가액 (부가세 제외)'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(formatInput(e.target.value))}
              placeholder="예: 1,100,000"
              className="calc-input pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">
            {mode === 'inclusive' ? '부가세가 포함된 총금액을 입력하세요' : '부가세를 제외한 순수 공급가액을 입력하세요'}
          </p>
        </div>
      </div>

      {/* 결과 */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          {/* 메인 결과 */}
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">총 금액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(total)}<span className="text-2xl font-bold ml-1">원</span></p>
          </div>

          {/* 내역 */}
          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm">
                <span className="text-slate-600">공급가액</span>
                <span className="font-bold text-slate-800 tabular-nums">{fmt(supply)} 원</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-slate-600">부가세 (10%)</span>
                <span className="font-bold text-blue-600 tabular-nums">{fmt(vat)} 원</span>
              </li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">합계</span>
                <span className="font-bold text-slate-900 tabular-nums">{fmt(total)} 원</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 text-center">
            일반과세자 기준 10% 세율 적용. 간이과세자·면세사업자는 실제와 다를 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          금액을 입력하면 자동 계산됩니다
        </div>
      )}

      {/* SEO */}
      <section className="mt-10 space-y-6 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">부가세 계산기란?</h2>
          <p>부가세 계산기는 공급가액과 부가가치세(VAT)를 빠르게 계산하는 도구입니다. 사업자 거래, 세금계산서 발행, 견적 작성 시 공급가액과 부가세를 명확히 구분해야 할 때 사용합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">계산 공식</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>부가세 포함 → 공급가액 = 총금액 ÷ 1.1</li>
            <li>부가세 포함 → 부가세 = 총금액 − 공급가액</li>
            <li>부가세 별도 → 부가세 = 공급가액 × 10%</li>
            <li>부가세 별도 → 합계 = 공급가액 + 부가세</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">주의사항</h2>
          <p>본 계산기는 일반과세자 기준 10% 세율을 적용합니다. 간이과세자, 면세사업자, 업종별 특수 세율은 반영하지 않으므로 참고용으로만 활용하세요.</p>
        </div>
      </section>

      <RelatedCalculators current="vat-calculator" />
    </main>
  )
}
