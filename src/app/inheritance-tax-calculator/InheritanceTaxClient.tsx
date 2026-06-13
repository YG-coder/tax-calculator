// src/app/inheritance-tax-calculator/InheritanceTaxClient.tsx
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

          {taxBase > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">상속재산 총액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(estateNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">상속공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(deductNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">예상 상속세 (산출세액)</span>
                  <span className="font-bold text-blue-600 tabular-nums">{fmt(totalTax)} 원</span>
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
            본 계산기의 공제 프리셋은 일괄공제 5억 또는 &lsquo;5억+배우자공제&rsquo; 가정값으로 단순화한 것입니다.
            실제 배우자공제는 법정상속분과 실제 상속액에 따라 달라지므로 차이가 발생할 수 있습니다.
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
            <p className="font-semibold text-slate-800 mb-2">예시 3. 상속재산 15억, 배우자 포함 공제 10억(가정)</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 15억 − 10억 = <strong>5억 원</strong></li>
              <li>산출세액 = 5억 × 20% − 1,000만 = <strong>9,000만 원</strong></li>
              <li className="text-xs text-slate-500 mt-1">실제 배우자공제는 상속 구성에 따라 달라져 결과가 크게 변동될 수 있습니다.</li>
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
                과세표준이 0이 되는 경우가 많습니다. 다만 재산 규모와 상속 구성에 따라 달라집니다.
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
                본 계산기는 일괄공제·배우자공제를 단순 가정한 간이 도구로, 금융재산공제·동거주택공제·
                사전증여 합산·채무 공제 등을 반영하지 않습니다. 정확한 세액은 홈택스 또는 세무사를 통해
                확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 2026년 상속세 누진세율에 일괄공제(또는 배우자 포함 가정값)만 적용한 간이
            도구입니다. 금융재산공제·동거주택공제·사전증여 합산·채무 공제·신고세액공제 등 실제
            적용 항목을 반영하지 않으므로 신고 세액과 상당한 차이가 있을 수 있습니다. 정확한 신고는
            국세청 홈택스 또는 세무 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>상속세 및 증여세법 제26조(세율)·제18조~제24조(공제)·제67조(신고기한) — 국가법령정보센터</li>
            <li>국세청 상속세 안내 (홈택스)</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="inheritance-tax-calculator" />
    </main>
  )
}
