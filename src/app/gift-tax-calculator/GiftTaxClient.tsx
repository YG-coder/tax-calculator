// src/app/gift-tax-calculator/GiftTaxClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 증여세 누진세율 (2026년 기준) — 지방소득세는 부과되지 않음
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
  const tax      = calcGiftTax(taxBase)            // 산출세액 (증여세 본세)
  const afterCredit = Math.floor(tax * 0.97)       // 신고세액공제 3% 적용 시 예상 납부액

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
          <p className="calc-hint">10년 합산 기준 증여재산공제 한도 (배우자 6억, 직계존·비속 성인 5천만, 미성년 2천만)</p>
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
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 증여세 (산출세액)</p>
              <p className="text-4xl font-black tabular-nums">{fmt(tax)}<span className="text-2xl font-bold ml-1">원</span></p>
              <div className="mt-3 pt-3 border-t border-white/20 text-sm text-blue-100">
                과세표준 {fmt(taxBase)}원 기준 · 기한 내 신고 시 신고세액공제(3%) 적용 약 {fmt(afterCredit)}원
              </div>
            </div>
          ) : (
            <div className="calc-card p-6 bg-emerald-50 border-emerald-100">
              <p className="text-base font-bold text-emerald-700 mb-1">증여세 없음</p>
              <p className="text-sm text-emerald-600">증여금액이 공제한도 이하이므로 증여세가 발생하지 않습니다. (단, 10년 내 동일인 증여분과 합산해야 정확합니다)</p>
            </div>
          )}

          {taxBase > 0 && (
            <div className="calc-card p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
              <ul className="space-y-2.5">
                <li className="flex justify-between text-sm"><span className="text-slate-600">증여금액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(giftNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">증여재산공제</span><span className="font-bold text-slate-700 tabular-nums">−{fmt(deductNum)} 원</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
                <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                  <span className="font-bold text-slate-800">증여세 (산출세액)</span>
                  <span className="font-bold text-blue-600 tabular-nums">{fmt(tax)} 원</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-slate-500">신고세액공제 3% 적용 시</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">약 {fmt(afterCredit)} 원</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          증여금액을 입력하면 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">증여세란?</h2>
          <p>
            증여세는 타인으로부터 재산을 <strong>무상으로 이전받은 사람(수증자)</strong>이
            납부하는 세금입니다. 현금·예금·부동산·주식·회원권 등 재산적 가치가 있는 모든 것이
            대상이며, 부모가 자녀에게 자금을 보태주거나 부동산을 명의 이전하는 경우가 대표적입니다.
          </p>
          <p className="mt-2">
            증여세는 원칙적으로 받는 사람이 납부합니다. 다만 수증자가 비거주자이거나
            납부 능력이 없는 경우 등 일정한 사유가 있으면 증여한 사람이 연대하여 납부할 의무를 집니다.
            소득세·양도소득세와 달리 <strong>증여세에는 지방소득세 10%가 붙지 않으며</strong>, 본세만 납부합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">증여재산공제 한도 (10년 합산)</h2>
          <p className="mb-3">
            동일인에게서 받은 증여는 <strong>10년 단위로 합산</strong>해 과세합니다. 아래 공제 한도도
            건별이 아니라 10년간의 누적 기준입니다. 즉 5년 전 부모에게 3천만 원을 받았고 올해 다시
            3천만 원을 받으면, 합산 6천만 원에서 성인 자녀 공제 5천만 원을 뺀 1천만 원이 과세표준이 됩니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>배우자: <strong>6억 원</strong></li>
            <li>직계존·비속 (성인 자녀·부모 등): <strong>5,000만 원</strong></li>
            <li>직계존·비속 (미성년 자녀): <strong>2,000만 원</strong></li>
            <li>기타 친족 (형제자매·며느리·사위 등 4촌 이내 혈족, 3촌 이내 인척): <strong>1,000만 원</strong></li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            혼인·출산 증여재산 공제(직계존속 → 자녀, 별도 1억 원 추가 등) 같은 특례는 본 계산기에 반영되어
            있지 않으므로, 해당된다면 홈택스 모의계산을 함께 확인하세요.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2026년 증여세 세율표</h2>
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
            누진세율이므로 <strong>산출세액 = 과세표준 × 세율 − 누진공제</strong>로 계산하면 빠릅니다.
            예를 들어 과세표준 2.5억 원이면 2.5억 × 20% − 1,000만 = 4,000만 원입니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. 성인 자녀에게 현금 3억 원 증여</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 3억 − 5,000만(성인 자녀 공제) = <strong>2억 5,000만 원</strong></li>
              <li>산출세액 = 2.5억 × 20% − 1,000만 = <strong>4,000만 원</strong></li>
              <li>기한 내 신고 시(공제 3%) 약 <strong>3,880만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 배우자에게 7억 원 증여</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 7억 − 6억(배우자 공제) = <strong>1억 원</strong></li>
              <li>산출세액 = 1억 × 10% = <strong>1,000만 원</strong></li>
              <li>기한 내 신고 시(공제 3%) 약 <strong>970만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 미성년 자녀에게 2억 원 증여</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 2억 − 2,000만(미성년 공제) = <strong>1억 8,000만 원</strong></li>
              <li>산출세액 = 1.8억 × 20% − 1,000만 = <strong>2,600만 원</strong></li>
              <li>기한 내 신고 시(공제 3%) 약 <strong>2,522만 원</strong></li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>10년 합산을 빼먹는다:</strong> 같은 사람에게서 10년 내 받은 증여는 모두 합산됩니다. 과거 증여를 누락하면 가산세가 붙습니다.</li>
            <li><strong>공제를 건별로 또 받을 수 있다고 착각:</strong> 공제 한도는 10년 누적 기준입니다. 작년에 5천만 원 공제를 다 썼다면 올해는 추가 공제가 없습니다.</li>
            <li><strong>증여세에 지방소득세를 더한다:</strong> 증여세에는 지방소득세가 없습니다. 양도·종합소득세와 헷갈리지 마세요.</li>
            <li><strong>세대생략 할증을 모른다:</strong> 부모를 건너뛰어 조부모가 손주에게 직접 증여하면 산출세액의 30%(미성년·20억 초과 시 40%)가 가산됩니다.</li>
            <li><strong>차용증 없는 가족 간 금전거래:</strong> 빌려준 것이라 주장해도 증빙(차용증·이자지급·상환내역)이 없으면 증여로 추정될 수 있습니다.</li>
            <li><strong>신고기한을 넘긴다:</strong> 무신고가산세(20%)와 납부지연가산세가 부과되고, 신고세액공제(3%)도 받지 못합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">참고할 수 있는 절세 포인트</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>10년 주기 분할 증여:</strong> 공제 한도가 10년 단위로 갱신되므로, 긴 호흡으로 나누어 증여하면 누진세율 부담을 낮출 수 있습니다.</li>
            <li><strong>증여 시점 평가:</strong> 부동산·주식은 평가 기준 시점에 따라 과세표준이 달라집니다. 가치가 낮을 때 증여하면 세 부담이 줄어듭니다.</li>
            <li><strong>혼인·출산 증여공제 특례 확인:</strong> 요건을 충족하면 일반 공제와 별도로 추가 공제가 가능합니다.</li>
            <li><strong>기한 내 신고로 3% 공제:</strong> 신고기한을 지키는 것만으로 산출세액의 3%를 줄일 수 있습니다.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            절세는 합법적 범위 내에서만 가능합니다. 본 내용은 일반적인 참고 정보이며, 실제 적용은 개별
            상황과 최신 세법에 따라 달라질 수 있으므로 신고 전 홈택스 또는 세무 전문가의 확인을 권장합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기와 절차</h2>
          <p>
            증여세는 <strong>증여받은 날이 속하는 달의 말일부터 3개월 이내</strong>에 수증자의 주소지
            관할 세무서 또는 홈택스를 통해 신고·납부합니다. 예를 들어 4월 10일에 증여받았다면
            7월 31일까지 신고해야 합니다.
          </p>
          <p className="mt-2">
            기한 내 신고하면 산출세액의 <strong>3%를 신고세액공제</strong>로 차감해 줍니다. 반대로 기한을
            넘기면 무신고가산세(일반 20%, 부정 40%)와 납부지연가산세가 부과됩니다. 납부세액이
            1,000만 원을 초과하면 2개월 분납이, 2,000만 원을 초과하면 담보 제공을 전제로 연부연납이
            가능합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부모님이 생활비·교육비를 보태주는 것도 증여세 대상인가요?</p>
              <p>
                사회통념상 인정되는 생활비·교육비는 비과세입니다. 다만 그 돈을 쓰지 않고 예금·주식·부동산
                취득에 사용하면 증여로 볼 수 있습니다. 용도가 핵심입니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 증여세에 지방소득세가 추가로 붙나요?</p>
              <p>
                아닙니다. 지방소득세는 종합소득세·양도소득세 등 소득세와 법인세에 10% 부과되는 세금이며,
                증여세와 상속세에는 부과되지 않습니다. 증여세는 본세만 납부합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 공제 한도 안의 금액이면 신고하지 않아도 되나요?</p>
              <p>
                납부할 세액이 없더라도 신고하는 것이 안전합니다. 특히 자금 출처가 문제 될 수 있는
                부동산·전세보증금 등은 무상 이전 사실을 신고로 남겨두는 편이 향후 소명에 유리합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 10년 합산은 언제부터 다시 시작되나요?</p>
              <p>
                마지막 증여일을 기준으로 그 이전 10년을 합산합니다. 따라서 직전 증여로부터 10년이 지나면
                공제 한도가 새로 적용됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 증여받은 재산을 돌려주면 증여세를 안 내도 되나요?</p>
              <p>
                신고기한(3개월) 이내에 반환하면 처음부터 증여가 없었던 것으로 보아 과세하지 않습니다.
                다만 기한이 지난 뒤 반환하면 반환분에 대해 다시 증여세가 부과될 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 본 계산기 결과와 실제 세액이 다른 이유는?</p>
              <p>
                본 계산기는 10년 합산, 세대생략 할증, 혼인·출산 특례, 가산세 등을 반영하지 않은 간이
                도구입니다. 정확한 세액은 홈택스 증여세 모의계산 또는 세무사 상담으로 확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 2026년 증여세 누진세율을 단순 적용한 도구이며, 10년 합산과세·세대생략 할증·각종
            특례·가산세 등을 반영하지 않습니다. 실제 신고 세액과 차이가 있을 수 있으니 국세청 홈택스 또는
            세무 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>상속세 및 증여세법 제56조(세율)·제53조(증여재산공제)·제68조(신고기한) — 국가법령정보센터</li>
            <li>국세청 증여세 안내 (홈택스)</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="gift-tax-calculator" />
    </main>
  )
}
