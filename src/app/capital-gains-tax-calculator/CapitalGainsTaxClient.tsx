// src/app/capital-gains-tax-calculator/CapitalGainsTaxClient.tsx
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
  // 양도소득세에는 지방소득세 10%가 별도로 부과됨 (지방세법 제103조의3 등).
  // 양도소득세는 소득세의 한 종류이므로 지방소득세(소득분) 과세 대상 → localTax 유지.
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
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 양도소득세 (지방소득세 포함)</p>
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
                  <span className="font-bold text-blue-600 tabular-nums">{fmt(totalTax)} 원</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          취득가액과 양도가액을 입력하면 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">양도소득세란?</h2>
          <p>
            양도소득세는 부동산·주식 등 자산을 팔아(양도) 생긴 차익에 부과하는 세금입니다.
            <strong> 양도차익 = 양도가액 − 취득가액 − 필요경비</strong>로 계산하고, 여기서 장기보유특별공제와
            기본공제(연 250만 원)를 뺀 과세표준에 세율을 적용합니다.
          </p>
          <p className="mt-2">
            양도소득세는 소득세의 한 종류이므로 <strong>산출세액의 10%가 지방소득세로 추가</strong>됩니다.
            본 계산기 결과에는 이 지방소득세가 포함되어 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">기본세율 (보유 2년 이상 일반세율)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[320px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">과세표준</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">세율</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">누진공제</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['1,400만원 이하','6%','—'],
                  ['1,400만~5,000만원','15%','126만원'],
                  ['5,000만~8,800만원','24%','576만원'],
                  ['8,800만~1.5억원','35%','1,544만원'],
                  ['1.5억~3억원','38%','1,994만원'],
                  ['3억~5억원','40%','2,594만원'],
                  ['5억~10억원','42%','3,594만원'],
                  ['10억원 초과','45%','6,594만원'],
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
            위 기본세율은 2년 이상 보유한 부동산 등에 적용됩니다. 단기 보유, 다주택, 분양권·주식은
            별도의 중과세율이 적용되므로 본 계산기 결과와 크게 달라질 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">주요 비과세·공제 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>1세대 1주택 비과세:</strong> 2년 이상 보유(취득 당시 조정대상지역은 2년 거주 요건 추가), 양도가액 <strong>12억 원 이하</strong> 비과세. 12억 초과분은 과세.</li>
            <li><strong>장기보유특별공제:</strong> 보유기간에 따라 양도차익의 일정 비율 공제. 1세대 1주택 고가주택은 보유·거주 기간을 합쳐 최대 80%.</li>
            <li><strong>기본공제:</strong> 양도소득 연 250만 원 (자산 그룹별 연 1회).</li>
            <li><strong>필요경비:</strong> 취득세, 중개수수료, 자본적 지출(샷시·확장 등)은 경비로 인정. 도배·장판 등 수익적 지출은 불인정.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시 (기본세율)</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. 취득 3억 → 양도 5억 (경비 0)</p>
            <ul className="space-y-1 text-slate-600">
              <li>양도차익 = 5억 − 3억 = <strong>2억 원</strong></li>
              <li>과세표준 = 2억 − 250만 = <strong>1억 9,750만 원</strong></li>
              <li>양도소득세 = 1억 9,750만 × 38% − 1,994만 = <strong>5,511만 원</strong></li>
              <li>지방소득세 = 약 551만 원 / 총 약 <strong>6,062만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 취득 2억 → 양도 2.5억 (경비 1,000만)</p>
            <ul className="space-y-1 text-slate-600">
              <li>양도차익 = 2.5억 − 2억 − 1,000만 = <strong>4,000만 원</strong></li>
              <li>과세표준 = 4,000만 − 250만 = <strong>3,750만 원</strong></li>
              <li>양도소득세 = 3,750만 × 15% − 126만 = <strong>약 437만 원</strong></li>
              <li>지방소득세 약 44만 원 / 총 약 <strong>480만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 1세대 1주택, 양도 10억, 2년 보유</p>
            <ul className="space-y-1 text-slate-600">
              <li>양도가액 12억 이하 → <strong>비과세</strong> (세액 0)</li>
              <li className="text-xs text-slate-500 mt-1">단, 다주택이거나 12억 초과면 과세 대상으로 바뀝니다.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>단기·다주택 중과세를 기본세율로 착각:</strong> 1년 미만 보유 주택·분양권은 70%까지 단기 중과세가 적용될 수 있습니다. 본 계산기는 기본세율만 적용합니다.</li>
            <li><strong>장기보유특별공제 누락:</strong> 보유기간이 길수록 공제율이 커집니다. 빼먹으면 세액이 과대 계산됩니다.</li>
            <li><strong>필요경비 증빙 미보관:</strong> 영수증·세금계산서가 없으면 경비로 인정받기 어렵습니다.</li>
            <li><strong>지방소득세를 빼먹음:</strong> 양도소득세의 10%가 지방소득세로 추가됩니다. (상속·증여세와 달리 양도세에는 붙습니다)</li>
            <li><strong>예정신고 기한 도과:</strong> 부동산은 양도일이 속하는 달의 말일부터 2개월 이내 예정신고해야 합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기와 절차</h2>
          <p>
            부동산 등의 양도소득세는 <strong>양도일이 속하는 달의 말일부터 2개월 이내</strong>에 예정신고·
            납부합니다. 같은 해에 두 건 이상 양도했다면 다음 해 5월에 확정신고로 합산 정산합니다.
            주식은 양도 시기에 따라 반기별로 신고합니다.
          </p>
          <p className="mt-2">
            납부세액이 1,000만 원을 초과하면 2개월 분납이 가능합니다. 기한을 넘기면 무신고가산세와
            납부지연가산세가 부과됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 1주택인데 무조건 비과세인가요?</p>
              <p>
                2년 이상 보유(조정대상지역 취득분은 2년 거주 추가) 요건을 갖추고 양도가액이 12억 원
                이하면 비과세입니다. 12억을 초과하면 초과분에 대해서는 과세됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 양도소득세에 지방소득세가 붙나요?</p>
              <p>
                네. 양도소득세는 소득세의 한 종류라 산출세액의 10%가 지방소득세로 추가됩니다.
                상속세·증여세에는 붙지 않는 것과 다릅니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 다주택자 중과세는 본 계산기에 반영되나요?</p>
              <p>
                반영되지 않습니다. 본 계산기는 기본세율(2년 이상 보유)만 적용합니다. 다주택 중과세는
                정책에 따라 적용·유예가 자주 바뀌므로, 해당된다면 홈택스 모의계산으로 확인하세요.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 어떤 비용을 필요경비로 넣을 수 있나요?</p>
              <p>
                취득세, 법무사·중개수수료, 자본적 지출(발코니 확장, 샷시 교체 등)은 인정됩니다. 단순
                수리·도배 같은 수익적 지출은 원칙적으로 제외됩니다. 증빙 보관이 필수입니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 본 계산기 결과와 실제 세액이 다른 이유는?</p>
              <p>
                본 계산기는 기본세율만 적용하고 장기보유특별공제·1세대1주택 비과세·단기 및 다주택
                중과세를 반영하지 않습니다. 정확한 세액은 홈택스 양도소득세 모의계산 또는 세무사 상담으로
                확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 양도소득세 기본세율(2년 이상 보유)에 지방소득세 10%를 더한 간이 계산 도구입니다.
            1세대 1주택 비과세, 장기보유특별공제, 단기·다주택 중과세, 분양권·주식 등 자산별 규정은
            반영하지 않으므로 실제 세액과 큰 차이가 날 수 있습니다. 정확한 신고는 국세청 홈택스 또는
            세무 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제104조(세율)·제95조(장기보유특별공제)·제89조(비과세)·제105조(예정신고) — 국가법령정보센터</li>
            <li>지방세법 제103조의3 (양도소득에 대한 개인지방소득세)</li>
            <li>국세청 양도소득세 안내 (홈택스)</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="capital-gains-tax-calculator" />
    </main>
  )
}
