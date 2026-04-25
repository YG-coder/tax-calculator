// src/app/gift-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 증여세·상속세 누진세율 (2026년 기준)
function calcGiftTax(base: number): number {
  if (base <= 0) return 0
  if (base <= 100_000_000)   return Math.floor(base * 0.10)
  if (base <= 500_000_000)   return Math.floor(10_000_000  + (base - 100_000_000) * 0.20)
  if (base <= 1_000_000_000) return Math.floor(90_000_000  + (base - 500_000_000) * 0.30)
  if (base <= 3_000_000_000) return Math.floor(240_000_000 + (base - 1_000_000_000) * 0.40)
  return Math.floor(1_040_000_000 + (base - 3_000_000_000) * 0.50)
}

const DEDUCTION_PRESETS = [
  { label: '배우자 (6억)', value: '600000000' },
  { label: '성인 자녀 (5천만)', value: '50000000' },
  { label: '미성년 자녀 (2천만)', value: '20000000' },
  { label: '기타 친족 (1천만)', value: '10000000' },
  { label: '직접 입력', value: 'custom' },
]

export default function GiftTaxCalculatorPage() {
  const [giftAmount, setGiftAmount]       = useState('')
  const [deductPreset, setDeductPreset]   = useState('50000000')
  const [customDeduct, setCustomDeduct]   = useState('')

  const giftNum   = parseNum(giftAmount)
  const deductNum = deductPreset === 'custom' ? parseNum(customDeduct) : parseNum(deductPreset)
  const hasValue  = giftNum > 0

  const taxBase  = Math.max(0, giftNum - deductNum)
  const tax      = calcGiftTax(taxBase)
  const localTax = Math.floor(tax * 0.1)
  const totalTax = tax + localTax

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">증여세 계산기</h1>
      <p className="text-slate-500 mb-6">증여금액·공제 기준 예상 증여세 간이 계산 · 참고용</p>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">증여 정보 입력</h2>

        <div>
          <label className="calc-label">증여금액 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={giftAmount}
              onChange={(e) => setGiftAmount(formatInput(e.target.value))}
              placeholder="예: 100,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">증여하는 재산의 시가 기준 금액</p>
        </div>

        <div>
          <label className="calc-label">증여공제 선택</label>
          <div className="flex flex-wrap gap-2">
            {DEDUCTION_PRESETS.map(({ label, value }) => (
              <button key={value} type="button"
                onClick={() => setDeductPreset(value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  deductPreset === value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{label}</button>
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
          <p className="calc-hint">10년 합산 기준 증여공제 한도 (배우자 6억, 직계존·비속 성인 5천만, 미성년 2천만)</p>
        </div>

        {hasValue && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">입력 요약</p>
            <div className="flex justify-between"><span>증여금액</span><span className="font-medium text-slate-700">{fmt(giftNum)}원</span></div>
            <div className="flex justify-between"><span>증여공제</span><span className="font-medium text-emerald-600">−{fmt(deductNum)}원</span></div>
            <div className="flex justify-between"><span>과세표준</span><span className="font-medium text-slate-700">{fmt(taxBase)}원</span></div>
          </div>
        )}
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          {taxBase > 0 ? (
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 증여세</p>
              <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
              <p className="mt-2 text-sm text-blue-100">과세표준 {fmt(taxBase)}원 기준</p>
            </div>
          ) : (
            <div className="calc-card p-6 bg-emerald-50 border-emerald-100">
              <p className="text-base font-bold text-emerald-700 mb-1">증여세 없음</p>
              <p className="text-sm text-emerald-600">증여금액이 공제한도 이하이므로 증여세가 발생하지 않습니다.</p>
            </div>
          )}

          {taxBase > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">증여금액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(giftNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">증여공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(deductNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">증여세</span><span className="font-bold text-blue-600 tabular-nums">{fmt(tax)} 원</span></li>
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
              <strong className="font-semibold">⚠ 참고용 계산:</strong> 본 계산기는 증여세 누진세율(10~50%)을 적용한 간이 계산입니다. 10년 합산 과세, 신고세액공제, 연부연납 등 실제 적용 항목은 반영하지 않습니다. 정확한 신고 세액은 세무사 상담을 권장합니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          증여금액을 입력하면 계산됩니다
        </div>
      )}

      <section className="mt-10 rounded-2xl border border-green-100 bg-green-50 p-5">
        <p className="text-sm font-semibold text-slate-800 mb-1">연봉 실수령액도 확인해보세요</p>
        <p className="text-xs text-slate-500 mb-3">직장인 급여 계산은 연봉계산기.kr에서.</p>
        <Link href="https://연봉계산기.kr" target="_blank" rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors">
          연봉 계산기 바로가기 →
        </Link>
      </section>

      <section className="mt-10 space-y-5 text-sm text-slate-600 leading-relaxed">
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">증여세란?</h2>
          <p>타인에게 재산을 무상으로 이전할 때 수증자(받는 사람)가 납부하는 세금입니다. 10년 이내 동일인 증여금액을 합산해 과세표준을 계산합니다.</p>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">증여공제 한도 (10년 합산)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>배우자: 6억원</li>
            <li>직계존·비속 (성인): 5,000만원</li>
            <li>직계존·비속 (미성년): 2,000만원</li>
            <li>기타 친족: 1,000만원</li>
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-2">증여세 세율 (2026년)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[280px]">
              <thead><tr className="bg-slate-50"><th className="px-3 py-2 text-left font-semibold text-slate-600">과세표준</th><th className="px-3 py-2 text-right font-semibold text-slate-600">세율</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[['1억원 이하','10%'],['1억~5억원','20%'],['5억~10억원','30%'],['10억~30억원','40%'],['30억원 초과','50%']].map(([r,t])=>(
                  <tr key={r} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{r}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <RelatedCalculators current="gift-tax-calculator" />
    </main>
  )
}
