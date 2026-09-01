// src/app/inheritance-tax-calculator/InheritanceTaxClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'
import SourceNote from '@/components/SourceNote'
import { amountError, amountValue, formatAmount } from '@/lib/utils/amount'
import { calcInheritanceTax, spouseDeduction, spouseStatutoryShare } from '@/lib/tax/rules/inheritance'

function fmt(n: number) { return n.toLocaleString('ko-KR') }

const DEDUCTION_PRESETS = [
  { label: '일괄공제 5억', value: '500000000', desc: '대부분 이쪽이 유리' },
  { label: '기초공제+기타인적공제 직접 입력', value: 'custom', desc: '합계가 5억을 넘을 때' },
]

export default function InheritanceTaxCalculatorPage() {
  const [estate,        setEstate]        = useState('')
  const [debts,         setDebts]         = useState('')
  const [deductPreset,  setDeductPreset]  = useState('500000000')
  const [customDeduct,  setCustomDeduct]  = useState('')
  const [hasSpouse,     setHasSpouse]     = useState(false)
  const [childCount,    setChildCount]    = useState('0')
  const [spouseShare,   setSpouseShare]   = useState('')

  const estateNum  = amountValue(estate)
  const debtsNum   = amountValue(debts)
  const childNum   = Math.max(0, Number(childCount) || 0)
  const spouseNum  = amountValue(spouseShare)

  // 상속세 과세가액 = 상속재산 − 채무·공과금·장례비
  const taxableEstate = Math.max(0, estateNum - debtsNum)

  const baseDeduct   = deductPreset === 'custom' ? amountValue(customDeduct) : amountValue(deductPreset)
  const spouseDeduct = hasSpouse ? spouseDeduction(taxableEstate, childNum, spouseNum) : 0
  const deductNum    = baseDeduct + spouseDeduct
  const hasValue     = estateNum > 0

  const taxBase  = Math.max(0, taxableEstate - deductNum)
  const tax      = calcInheritanceTax(taxBase)
  const filingCredit = Math.floor(tax * 0.03)  // 기한 내 신고 시 신고세액공제 3%
  // 상속세에는 지방소득세가 부과되지 않음.
  // 지방소득세(개인분 10%)는 소득세(종합·양도소득세 등)와 법인세에만 부과되며,
  // 상속세·증여세는 상속세 및 증여세법상 국세로 지방소득세 대상이 아님. → 본세(tax)만 표시.
  const totalTax = tax

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">상속세 계산기</h1>
      <p className="text-slate-500 mb-6">상속재산·공제 기준 예상 상속세 간이 계산 · 참고용</p>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">상속 정보 입력</h2>

        <div>
          <label htmlFor="estate" className="calc-label">상속재산 총액 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" pattern="[0-9,]*" id="estate" value={formatAmount(estate)}
              onChange={(e) => setEstate(e.target.value)}
              aria-invalid={amountError(estate) !== null}
              aria-describedby={amountError(estate) ? 'estate-error' : undefined}
              placeholder="예: 1,000,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          {amountError(estate) && (
            <p id="estate-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{amountError(estate)}</p>
          )}
          <p className="calc-hint">부동산, 금융자산, 기타 상속재산의 합계 (시가 기준)</p>
        </div>

        <div>
          <label htmlFor="debts" className="calc-label">채무·공과금·장례비</label>
          <div className="relative">
            <input type="text" inputMode="numeric" pattern="[0-9,]*" id="debts" value={formatAmount(debts)}
              onChange={(e) => setDebts(e.target.value)}
              aria-invalid={amountError(debts) !== null}
              aria-describedby={amountError(debts) ? 'debts-error' : undefined}
              placeholder="예: 100,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          {amountError(debts) && (
            <p id="debts-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{amountError(debts)}</p>
          )}
          <p className="calc-hint">피상속인의 채무, 미납 공과금, 장례비용 — 상속재산에서 차감됩니다</p>
        </div>

        <div>
          <label className="calc-label">상속공제 선택</label>
          <div className="flex flex-wrap gap-2">
            {DEDUCTION_PRESETS.map(({ label, value, desc }) => (
              <button key={value} type="button"
                aria-pressed={deductPreset === value}
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
            <>
              <div className="relative mt-2">
                <input type="text" inputMode="numeric" pattern="[0-9,]*" id="custom-deduct" value={formatAmount(customDeduct)}
                  onChange={(e) => setCustomDeduct(e.target.value)}
                  aria-invalid={amountError(customDeduct) !== null}
                  aria-describedby={amountError(customDeduct) ? 'custom-deduct-error' : undefined}
                  placeholder="공제금액 직접 입력" className="calc-input pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              {amountError(customDeduct) && (
                <p id="custom-deduct-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{amountError(customDeduct)}</p>
              )}
            </>
          )}
          <p className="calc-hint">기본공제 2억 + 기타인적공제, 또는 일괄공제 5억 중 큰 금액 선택 가능</p>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between">
            <span className="calc-label mb-0">배우자 상속공제</span>
            <button type="button" aria-pressed={hasSpouse}
              onClick={() => setHasSpouse((v) => !v)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${
                hasSpouse ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'
              }`}>
              {hasSpouse ? '배우자 있음' : '배우자 없음'}
            </button>
          </div>

          {hasSpouse ? (
            <div className="mt-3 space-y-4">
              <div>
                <span className="calc-label">자녀(직계비속) 수</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button key={n} type="button" aria-pressed={childCount === String(n)}
                      onClick={() => setChildCount(String(n))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        childCount === String(n)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}>{n}명</button>
                  ))}
                </div>
                <p className="calc-hint">
                  배우자 법정상속분 = 1.5 ÷ (1.5 + 자녀 수) = {(spouseStatutoryShare(childNum) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <label htmlFor="spouse-share" className="calc-label">배우자가 실제 상속받는 금액</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" pattern="[0-9,]*" id="spouse-share" value={formatAmount(spouseShare)}
                    onChange={(e) => setSpouseShare(e.target.value)}
                    aria-invalid={amountError(spouseShare) !== null}
                    aria-describedby={amountError(spouseShare) ? 'spouse-share-error' : undefined}
                    placeholder="예: 600,000,000" className="calc-input pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
                </div>
                {amountError(spouseShare) && (
                  <p id="spouse-share-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{amountError(spouseShare)}</p>
                )}
                <p className="calc-hint">
                  공제액 = min(실제 상속액, 과세가액 × 법정상속분, 30억) — 단, 5억원은 최소 보장됩니다.
                  비워 두면 최소 5억원만 공제합니다.
                </p>
              </div>

              {hasValue && (
                <div className="rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between"><span>법정상속분 기준 한도</span>
                    <span className="font-medium text-slate-700">{fmt(Math.floor(Math.min(taxableEstate * spouseStatutoryShare(childNum), 3_000_000_000)))}원</span></div>
                  <div className="flex justify-between"><span>적용 배우자공제</span>
                    <span className="font-semibold text-blue-700">{fmt(Math.floor(spouseDeduct))}원</span></div>
                </div>
              )}
            </div>
          ) : (
            <p className="calc-hint mt-2">
              배우자가 있는 경우에도 공제액은 &lsquo;실제 상속받은 금액&rsquo;과 법정상속분 한도로 결정됩니다.
              배우자가 있다는 이유만으로 10억 원이 자동 공제되지는 않습니다.
            </p>
          )}
        </div>

        {hasValue && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">입력 요약</p>
            <div className="flex justify-between"><span>상속재산</span><span className="font-medium text-slate-700">{fmt(estateNum)}원</span></div>
            {debtsNum > 0 && (
              <div className="flex justify-between"><span>채무·공과금·장례비</span><span className="font-medium text-emerald-600">−{fmt(debtsNum)}원</span></div>
            )}
            <div className="flex justify-between"><span>상속세 과세가액</span><span className="font-medium text-slate-700">{fmt(taxableEstate)}원</span></div>
            <div className="flex justify-between"><span>일괄공제 등</span><span className="font-medium text-emerald-600">−{fmt(baseDeduct)}원</span></div>
            {hasSpouse && (
              <div className="flex justify-between"><span>배우자 상속공제</span><span className="font-medium text-emerald-600">−{fmt(Math.floor(spouseDeduct))}원</span></div>
            )}
            <div className="flex justify-between"><span>과세표준</span><span className="font-medium text-slate-700">{fmt(taxBase)}원</span></div>
          </div>
        )}
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up" aria-live="polite">
          {taxBase > 0 ? (
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 상속세 (산출세액)</p>
              <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
              <p className="mt-2 text-sm text-blue-100">과세표준 {fmt(taxBase)}원 기준 · 지방소득세 없음</p>
            </div>
          ) : (
            <div className="calc-card p-6 bg-emerald-50 border-emerald-100">
              <p className="text-base font-bold text-emerald-700 mb-1">상속세 없음</p>
              <p className="text-sm text-emerald-600">상속재산이 공제한도 이하이므로 상속세가 발생하지 않습니다.</p>
            </div>
          )}

          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">이 결과에 반영되지 않은 항목</p>
            <p>
              금융재산 상속공제(순금융재산의 20%, 최대 2억), 동거주택 상속공제(최대 6억),
              사전증여재산 합산(상속인 10년·그 외 5년), 감정평가수수료, 가업·영농 상속공제는
              반영하지 않았습니다. 해당 사항이 있으면 실제 세액과 차이가 큽니다.
            </p>
          </div>

          {taxBase > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">상속재산 총액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(estateNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">채무·공과금·장례비</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(debtsNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">일괄공제 등</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(baseDeduct)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">배우자 상속공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(Math.floor(spouseDeduct))} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">예상 상속세 (산출세액)</span>
                  <span className="font-bold text-blue-600 tabular-nums">{fmt(totalTax)} 원</span>
                </li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">기한 내 신고 시 신고세액공제 3%</span><span className="font-bold text-emerald-600 tabular-nums">−{fmt(filingCredit)} 원</span></li>
                <li className="flex justify-between text-sm">
                  <span className="font-bold text-slate-800">신고세액공제 적용 후</span>
                  <span className="font-bold text-slate-900 tabular-nums">{fmt(totalTax - filingCredit)} 원</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          상속재산을 입력하면 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">상속세란?</h2>
          <p>
            상속세는 사망(상속 개시)으로 재산이 무상 이전될 때 부과되는 세금입니다. 우리나라는
            <strong> 피상속인(돌아가신 분)이 남긴 유산 총액을 기준으로 과세</strong>하는 유산세 방식을
            취합니다. 받는 사람별로 나누어 과세하는 증여세(유산취득세 방식)와 이 점이 다릅니다.
          </p>
          <p className="mt-2">
            세율 구조(10~50%)는 증여세와 동일하지만, 공제 항목과 과세 단위가 다릅니다. 또한
            소득세·양도소득세와 달리 <strong>상속세에는 지방소득세 10%가 붙지 않습니다.</strong>
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">주요 상속공제 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>일괄공제 5억 원:</strong> 기초공제(2억) + 그 밖의 인적공제 합계와 비교해 큰 금액을 선택. 대부분 일괄공제 5억이 유리합니다.</li>
            <li><strong>배우자 상속공제:</strong> 최소 5억 원, 배우자가 실제 상속받은 금액 기준 최대 30억 원까지.</li>
            <li><strong>금융재산 상속공제:</strong> 순금융재산의 20%(최대 2억 원, 2천만 원 이하는 전액).</li>
            <li><strong>동거주택 상속공제:</strong> 요건 충족 시 최대 6억 원.</li>
            <li><strong>신고세액공제:</strong> 기한 내 신고 시 산출세액의 3%.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            본 계산기는 일괄공제(또는 직접 입력한 기초공제+기타인적공제)에 배우자 상속공제를 더해 계산합니다.
            배우자 상속공제는 &lsquo;배우자가 실제 상속받은 금액&rsquo;을 기준으로, 과세가액 × 법정상속분과 30억원 중
            작은 금액을 한도로 하며 최소 5억원이 보장됩니다(상증법 §19). 금융재산·동거주택 공제와
            사전증여 합산은 반영하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2026년 상속세 세율표</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[320px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">과세표준</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">세율</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">누진공제</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['1억원 이하','10%','—'],
                  ['1억~5억원','20%','1,000만원'],
                  ['5억~10억원','30%','6,000만원'],
                  ['10억~30억원','40%','1억 6,000만원'],
                  ['30억원 초과','50%','4억 6,000만원'],
                ].map(([range,rate,deduction])=>(
                  <tr key={range} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{range}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{rate}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{deduction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            산출세액 = 과세표준 × 세율 − 누진공제. 예) 과세표준 5억이면 5억 × 20% − 1,000만 = 9,000만 원.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. 상속재산 10억, 일괄공제 5억</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 10억 − 5억 = <strong>5억 원</strong></li>
              <li>산출세액 = 5억 × 20% − 1,000만 = <strong>9,000만 원</strong></li>
              <li>기한 내 신고 시(공제 3%) 약 <strong>8,730만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 상속재산 7억, 일괄공제 5억</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 7억 − 5억 = <strong>2억 원</strong></li>
              <li>산출세액 = 2억 × 20% − 1,000만 = <strong>3,000만 원</strong></li>
              <li>기한 내 신고 시(공제 3%) 약 <strong>2,910만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 상속재산 15억, 배우자 1명 + 자녀 2명, 배우자가 6억 상속</p>
            <ul className="space-y-1 text-slate-600">
              <li>배우자 법정상속분 = 1.5 ÷ (1.5+2) = <strong>42.9%</strong> → 한도 15억 × 42.9% = 약 <strong>6억 4천만 원</strong></li>
              <li>배우자공제 = min(실제 6억, 한도 6.4억) = <strong>6억 원</strong></li>
              <li>총 공제 = 일괄공제 5억 + 배우자공제 6억 = <strong>11억 원</strong></li>
              <li>과세표준 = 15억 − 11억 = <strong>4억 원</strong> → 산출세액 = 4억 × 20% − 1,000만 = <strong>7,000만 원</strong></li>
              <li className="text-xs text-slate-500 mt-1">같은 15억이라도 배우자가 실제로 얼마를 상속받느냐에 따라 세액이 달라집니다.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>사전증여 합산 누락:</strong> 상속개시 전 10년 이내 상속인에게, 5년 이내 상속인 외의 자에게 증여한 재산은 상속재산에 합산됩니다.</li>
            <li><strong>일괄공제를 인적공제와 중복 계산:</strong> 일괄공제 5억과 (기초공제+기타인적공제)는 둘 중 큰 금액 하나만 적용됩니다.</li>
            <li><strong>상속세에 지방소득세 가산:</strong> 상속세에는 지방소득세가 없습니다. 양도·종합소득세와 혼동하지 마세요.</li>
            <li><strong>채무·장례비 공제 누락:</strong> 피상속인의 채무, 공과금, 장례비용은 상속재산에서 차감됩니다.</li>
            <li><strong>신고기한 착오:</strong> 상속개시일이 아니라 &lsquo;속하는 달의 말일&rsquo;부터 6개월입니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기와 절차</h2>
          <p>
            상속세는 <strong>상속개시일이 속하는 달의 말일부터 6개월 이내</strong>(피상속인이 비거주자인
            경우 9개월)에 신고·납부합니다. 예를 들어 3월 15일 사망이면 9월 30일까지입니다. 기한 내
            신고하면 산출세액의 3%를 신고세액공제로 차감해 줍니다.
          </p>
          <p className="mt-2">
            납부세액이 큰 경우 분납(1,000만 원 초과분), 연부연납(2,000만 원 초과 시 담보 제공),
            요건을 갖춘 부동산·유가증권의 물납이 가능합니다. 기한을 넘기면 무신고가산세와
            납부지연가산세가 부과됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 상속세와 증여세는 세율이 같은데 무엇이 다른가요?</p>
              <p>
                세율표(10~50%)는 동일합니다. 다만 상속세는 피상속인의 전체 유산을 기준으로(유산세),
                증여세는 받는 사람별로(유산취득세) 과세합니다. 공제 항목과 신고기한도 다릅니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 배우자가 있으면 상속세가 거의 안 나온다던데 사실인가요?</p>
              <p>
                배우자 상속공제(최소 5억~최대 30억)와 일괄공제 5억이 더해지면 중산층 규모 상속에서는
                과세표준이 0이 되는 경우가 많습니다. 다만 배우자공제는 &lsquo;배우자가 있다&rsquo;는 사실만으로
                자동 적용되는 정액 공제가 아니라, 배우자가 실제로 상속받은 금액과 법정상속분 한도로
                결정됩니다. 배우자가 상속을 거의 받지 않으면 최소 5억원만 공제됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 상속세에 지방소득세가 붙나요?</p>
              <p>
                붙지 않습니다. 지방소득세는 소득세·법인세에만 부과되며, 상속세·증여세에는 부과되지
                않습니다. 상속세는 본세만 납부합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 빚이 더 많으면 상속을 포기할 수 있나요?</p>
              <p>
                상속개시를 안 날부터 3개월 이내에 가정법원에 상속포기 또는 한정승인을 신청할 수
                있습니다. 기한이 짧으므로 채무가 많다면 빠르게 검토해야 합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 본 계산기 결과와 실제 세액이 다른 이유는?</p>
              <p>
                본 계산기는 일괄공제·배우자공제·채무 공제만 반영하는 간이 도구로, 금융재산공제·
                동거주택공제·사전증여 합산·가업상속공제 등을 반영하지 않습니다. 정확한 세액은 홈택스 또는 세무사를 통해
                확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 2026년 상속세 누진세율에 일괄공제·배우자 상속공제·채무 공제만 적용한 간이
            도구입니다. 금융재산공제·동거주택공제·사전증여 합산·가업상속공제 등 실제 적용 항목을
            반영하지 않으므로 신고 세액과 차이가 있을 수 있습니다. 정확한 신고는
            국세청 홈택스 또는 세무 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <SourceNote calculator="inheritance-tax-calculator" />
      </section>

      <RelatedCalculators current="inheritance-tax-calculator" />
    </main>
  )
}
