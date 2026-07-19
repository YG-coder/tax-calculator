// src/app/vat-type-compare/VatTypeCompareClient.tsx
'use client'

// ─────────────────────────────────────────────────────────────
// ⚠️ 세법 개정 영향 계산기 — 유지보수 주석
// 기준연도: 2026
// 마지막 검증일: 2026-07 (국세청 자료 기준)
// 개정 시 반드시 재확인할 항목:
//   1. 간이과세 기준금액 (일반 1억400만, 부동산임대·과세유흥 4,800만, §61)
//      ※ 과세유흥장소는 부가가치율 미확정으로 계산기 미지원 (안내만)
//   2. 납부의무 면제 기준 (현재 공급대가 4,800만원 미만, §69)
//   3. 업종별 부가가치율 (현재 15/20/25/30/40%, 2021.7.1 이후 시행령 §111)
//      - 15 소매·음식점·재생용재료 / 20 제조·농림어업·소화물운송 / 25 숙박
//      - 30 건설·운수창고·정보통신·그밖의서비스 / 40 금융·전문·부동산임대 등
//   4. 간이과세 매입공제율 (현재 매입 공급대가 0.5%, §63③)
//   5. 간이과세 배제 기준 (업종·지역 고시, 2026 배제지역 확대)
// 출처: 국가법령정보센터 부가가치세법, 국세청 홈택스·배제기준 고시
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 간이과세자 업종별 부가가치율 (2021.7.1. 이후, 부가가치세법 시행령 §111)
// 실효세율 = 부가가치율 × 10%
// threshold: 간이과세 적용 상한 (일반 1억400만, 부동산임대·과세유흥 4,800만)
const INDUSTRIES = [
  { key: 'retail',    label: '소매업·음식점업·재생용재료',            rate: 0.15, threshold: 104_000_000 },
  { key: 'manufact',  label: '제조업·농림어업·소화물전문운송',        rate: 0.20, threshold: 104_000_000 },
  { key: 'lodging',   label: '숙박업',                              rate: 0.25, threshold: 104_000_000 },
  { key: 'construct', label: '건설업·운수창고·정보통신·그 밖의 서비스업', rate: 0.30, threshold: 104_000_000, note: '인물사진·행사용 영상 촬영업 포함' },
  { key: 'finance',   label: '금융보험·전문과학기술·사업지원 서비스',  rate: 0.40, threshold: 104_000_000, note: '인물사진·행사용 영상 촬영업 제외' },
  { key: 'realEstate',label: '부동산임대업',                    rate: 0.40, threshold: 48_000_000 },
] as const

type IndustryKey = typeof INDUSTRIES[number]['key']

// 간이과세 기준금액 (직전연도 공급대가, 2024.1.1. 이후) — 부가가치세법 제61조
// 간이과세 기준금액은 업종별 threshold로 관리 (§61) — 위 INDUSTRIES 참조
// 부가세 납부의무 면제 기준 (공급대가) — 제69조 (업종 공통)
const EXEMPTION_THRESHOLD = 48_000_000

export default function VatTypeCompareClient() {
  const [revenue,  setRevenue]  = useState('')
  const [purchase, setPurchase] = useState('')
  const [industry, setIndustry] = useState<IndustryKey>('retail')
  const [txnType,  setTxnType]  = useState<'b2b' | 'b2c'>('b2c')

  const revNum = parseNum(revenue)
  const purNum = parseNum(purchase)
  const hasValue = revNum > 0

  const selectedIndustry = INDUSTRIES.find(i => i.key === industry)!
  const rate = selectedIndustry.rate
  const industryThreshold = selectedIndustry.threshold

  // --- 일반과세자 부가세 (매출세액 - 매입세액) ---
  // 입력 매출/매입은 공급대가(부가세 포함)로 간주 → 1.1로 나눠 공급가액 환산
  // 음수면 환급 예상 (0으로 자르지 않음 — 환급도 일반과세의 실제 결과)
  const generalSalesVat    = Math.floor((revNum / 1.1) * 0.1)
  const generalPurchaseVat = Math.floor((purNum / 1.1) * 0.1)
  const generalNetVat = generalSalesVat - generalPurchaseVat   // 음수 = 환급
  const generalIsRefund = generalNetVat < 0
  // 비교용 부담값: 환급은 음수 부담으로 취급 (일반과세 장점 반영)
  const generalBurden = generalNetVat

  // --- 간이과세자 부가세 (제63조) ---
  // 산출세액 = 공급대가 × 업종별 부가가치율 × 10%
  // 매입공제 = 세금계산서등 발급받은 매입 공급대가 × 0.5% (제63조 제3항)
  // 납부세액 = max(0, 산출세액 − 매입공제)  ※ 초과분 환급 없음
  // 공급대가 4,800만원 미만이면 납부의무 면제 (제69조)
  const simplifiedExempt = revNum < EXEMPTION_THRESHOLD
  const simplifiedGross  = Math.floor(revNum * rate * 0.1)       // 산출세액
  const simplifiedCredit = Math.floor(purNum * 0.005)            // 매입공제 0.5%
  const simplifiedVat    = simplifiedExempt
    ? 0
    : Math.max(0, simplifiedGross - simplifiedCredit)

  // --- 자격 스크리닝 (판정 아님, 안내) ---
  const overThreshold = revNum >= industryThreshold

  // --- 조건부 유불리 해석 (세법 근거 조건 + 실제 세액 비교) ---
  // 임의 임계값 없이, 두 시나리오의 실제 계산 결과로 판단한다.
  const thresholdLabel = industryThreshold === 48_000_000 ? '4,800만원' : '1억 400만원'
  let advice: { lean: 'simplified' | 'general' | 'neutral'; reason: string }
  if (overThreshold) {
    advice = { lean: 'general', reason: `입력한 연매출이 이 업종의 간이과세 기준(${thresholdLabel})을 넘어, 일반과세자에 해당할 가능성이 높습니다.` }
  } else if (generalIsRefund) {
    advice = { lean: 'general', reason: `매입세액이 매출세액보다 많아 일반과세라면 약 ${fmt(Math.abs(generalNetVat))}원 환급이 예상됩니다. 간이과세자는 환급이 없으므로, 이 조건에서는 일반과세가 유리합니다.` }
  } else if (simplifiedExempt && generalBurden > 0) {
    advice = { lean: 'simplified', reason: '연매출이 4,800만원 미만이면 간이과세자는 부가세 납부의무가 면제될 수 있어, 이 조건에서는 간이과세 부담이 더 낮습니다.' }
  } else if (simplifiedVat < generalBurden) {
    const gap = generalBurden - simplifiedVat
    advice = { lean: 'simplified', reason: `이 입력 기준 실제 예상 세액은 간이과세가 약 ${fmt(gap)}원 더 낮습니다. 매입이 적거나 소비자 상대(B2C) 매출이 많다면 간이과세가 유리한 경우가 많습니다.` }
  } else if (generalBurden < simplifiedVat) {
    const gap = simplifiedVat - generalBurden
    advice = { lean: 'general', reason: `이 입력 기준 실제 예상 세액은 일반과세가 약 ${fmt(gap)}원 더 낮습니다. 매입이 많으면 매입세액 공제·환급이 가능한 일반과세가 유리한 경우가 많습니다.` }
  } else {
    advice = { lean: 'neutral', reason: '이 조건에서는 두 유형의 예상 세액이 비슷합니다. 세금계산서 발급 부담, 거래처 요구 등 비세액 요소로 판단하는 것이 좋습니다.' }
  }

  // B2B/B2C는 세액 계산에 직접 반영되지 않는 정성 요소 (안내용)
  const b2bNote = txnType === 'b2b'
    ? '사업자 거래(B2B)가 많다면 세금계산서 발급 의무·가능 여부와 거래처 요구를 함께 확인해야 합니다. (일정 조건의 간이과세자도 세금계산서를 발급할 수 있습니다.)'
    : '소비자 상대(B2C) 위주라면 세금계산서 발급 부담이 적어, 세액이 낮은 쪽을 선택하기 더 자유롭습니다.'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">간이과세 vs 일반과세 비교</h1>
      <p className="text-slate-500 mb-6">내 조건에서 어느 과세유형이 유리한지 비교하는 선택 도우미 · 참고용</p>

      {/* 입력 카드 */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">사업 정보 입력</h2>

        <div>
          <label className="calc-label">예상 연매출 (공급대가, 부가세 포함) <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={revenue}
              onChange={(e) => setRevenue(formatInput(e.target.value))}
              placeholder="예: 60,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">1년 동안의 예상 총 매출 (부가세 포함 금액)</p>
        </div>

        <div>
          <label className="calc-label">연간 매입액 (부가세 포함, 선택)</label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={purchase}
              onChange={(e) => setPurchase(formatInput(e.target.value))}
              placeholder="예: 20,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">재료·설비·임차료 등 사업 관련 매입 (세금계산서·카드 증빙분)</p>
        </div>

        <div>
          <label className="calc-label">업종</label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(({ key, label, rate, threshold }) => (
              <button key={key} type="button"
                onClick={() => setIndustry(key)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                  industry === key
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>
                {label}
                <span className={`block text-[11px] mt-0.5 ${industry === key ? 'text-blue-200' : 'text-slate-400'}`}>
                  부가가치율 {rate * 100}%{threshold === 48_000_000 && ' · 기준 4,800만원'}
                </span>
              </button>
            ))}
          </div>
          <p className="calc-hint">간이과세 부가세는 업종별 부가가치율로 계산됩니다. 부동산임대업은 기준금액이 4,800만원입니다.</p>
          <p className="text-[11px] text-slate-400 mt-1">※ 과세유흥장소는 간이과세 적용·세액 계산 기준이 일반 업종과 달라 본 계산기에서 지원하지 않습니다. 관할 세무서 또는 세무전문가에게 확인하세요.</p>
        </div>

        <div>
          <label className="calc-label">주요 거래처</label>
          <div className="flex gap-2">
            {([['b2c','소비자 상대 (B2C)'],['b2b','사업자 상대 (B2B)']] as const).map(([v, l]) => (
              <button key={v} type="button"
                onClick={() => setTxnType(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  txnType === v
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{l}</button>
            ))}
          </div>
          <p className="calc-hint">세액 계산에는 영향 없으나, 세금계산서 발급 부담 등 선택 참고 정보로 안내됩니다</p>
        </div>
      </div>

      {/* 결과 */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">

          {/* 자격 안내 (판정 아님) */}
          {overThreshold && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-slate-700">
              입력한 연매출이 이 업종의 간이과세 기준(<strong>{thresholdLabel}</strong>)을 넘습니다. 이 경우 일반과세자에 해당할 가능성이 높습니다.
              아래 비교는 참고용으로 두 유형의 세금 구조를 보여줍니다.
            </div>
          )}

          {/* 두 시나리오 비교 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 간이과세 */}
            <div className={`calc-card p-5 ${advice.lean === 'simplified' ? 'ring-2 ring-blue-500' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">간이과세자라면</p>
              <p className="text-2xl font-black tabular-nums text-slate-900">{fmt(simplifiedVat)}<span className="text-base font-bold ml-1">원</span></p>
              <p className="text-xs text-slate-400 mb-3">예상 부가세 {simplifiedExempt && '(납부면제 가능)'}</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>· 산출세액 {fmt(simplifiedGross)}원 (공급대가×{rate * 100}%×10%)</li>
                <li>· 매입공제 {fmt(simplifiedCredit)}원 (매입×0.5%)</li>
                <li>· 공제는 산출세액 한도, 초과분 <strong>환급 없음</strong></li>
                <li>· 4,800만원 미만 시 납부면제</li>
              </ul>
            </div>

            {/* 일반과세 */}
            <div className={`calc-card p-5 ${advice.lean === 'general' ? 'ring-2 ring-blue-500' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">일반과세자라면</p>
              <p className={`text-2xl font-black tabular-nums ${generalIsRefund ? 'text-emerald-600' : 'text-slate-900'}`}>
                {fmt(Math.abs(generalNetVat))}<span className="text-base font-bold ml-1">원</span>
              </p>
              <p className="text-xs text-slate-400 mb-3">{generalIsRefund ? '예상 부가세 (환급)' : '예상 부가세 (납부)'}</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>· 매출세액 {fmt(generalSalesVat)}원</li>
                <li>· 매입세액 {fmt(generalPurchaseVat)}원 공제</li>
                <li>· {generalIsRefund ? <strong className="text-emerald-600">매입이 많아 환급 예상</strong> : '매입 많으면 환급 가능'}</li>
                <li>· 세금계산서 발급 의무</li>
              </ul>
            </div>
          </div>

          {/* 조건부 해석 */}
          <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">이 조건에서는</p>
            <p className="text-lg font-bold mb-1">
              {advice.lean === 'simplified' ? '간이과세가 유리할 가능성이 높습니다' :
               advice.lean === 'general' ? '일반과세가 유리할 가능성이 높습니다' :
               '두 유형의 부담이 비슷합니다'}
            </p>
            <p className="text-sm text-blue-100">{advice.reason}</p>
          </div>

          {/* 판단 기준 공개 (블랙박스 방지) */}
          <div className="calc-card p-4">
            <p className="text-xs font-bold text-slate-700 mb-2">이 판단은 어떤 기준으로 나왔나요?</p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>· 연매출 <strong>{thresholdLabel} 이상</strong> → 일반과세 해당 (간이 불가){industryThreshold === 48_000_000 && ' — 부동산임대업은 4,800만원 기준'}</li>
              <li>· 연매출 <strong>4,800만원 미만</strong> → 간이과세 납부면제 가능</li>
              <li>· 그 외에는 <strong>두 유형의 실제 예상 세액을 비교</strong>해 낮은 쪽을 안내</li>
            </ul>
            <p className="text-[11px] text-slate-400 mt-2">임의 기준 없이 실제 계산 결과로 비교합니다. 확정 판정이 아닙니다.</p>
          </div>

          {/* B2B/B2C 정성 안내 (세액과 별개) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600 mb-1">거래처 관련 참고 (세액 계산과 별개)</p>
            <p>{b2bNote}</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
            <p><strong className="text-slate-600">일반과세 예상 세액</strong>은 「매출세액 − 매입세액」만 반영한 단순 비교값입니다.
            실제 신고 시에는 신용카드매출 세액공제, 의제매입세액, 재고매입세액, 가산세 등이 적용되어 달라집니다.
            간이과세 세액도 신용카드매출 세액공제 등이 반영되지 않은 단순값입니다.</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          연매출을 입력하면 두 유형을 비교합니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                          SEO 본문                            */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">간이과세 vs 일반과세, 무엇이 다른가요?</h2>
          <p>
            개인사업자는 부가가치세 과세유형에 따라 <strong>간이과세자</strong>와 <strong>일반과세자</strong>로 나뉩니다.
            가장 큰 차이는 세금 계산 방식과 매입세액 환급 여부입니다. 일반과세자는 「매출세액 − 매입세액」으로
            부가세를 계산하고 매입이 많으면 환급을 받을 수 있는 반면, 간이과세자는 「공급대가 × 업종별 부가가치율 × 10%」로
            계산하고 세금계산서등을 받은 <strong>매입 공급대가의 0.5%를 납부세액에서 공제</strong>합니다.
            다만 이 공제액이 산출세액을 초과하더라도 <strong>초과분은 환급되지 않습니다.</strong>
          </p>
          <p className="mt-2">
            본 도구는 어느 유형에 &lsquo;해당하는지&rsquo;를 판정하는 것이 아니라, 두 유형의 예상 부담을 나란히 비교해
            <strong> 내 조건에서 어느 쪽이 유리한지</strong>를 판단하도록 돕는 것이 목적입니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">간이과세 기준 (2024년 이후)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>직전연도 공급대가 합계액 <strong>1억 400만원 미만</strong>인 개인사업자 (부가가치세법 제61조)</li>
            <li>부동산임대업·과세유흥장소는 <strong>4,800만원</strong> 기준으로 별도 적용 (과세유흥장소는 본 계산기 미지원)</li>
            <li>공급대가 <strong>4,800만원 미만</strong>이면 부가세 납부의무 면제 (제69조)</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            단, 매출 기준을 충족해도 <strong>업종·사업장 소재지(간이과세 배제지역) 등</strong>에 따라 간이과세가
            배제될 수 있습니다. 2026년부터는 특정 배제지역 사업자는 매출과 무관하게 일반과세자로 전환됩니다.
            최종 적용 여부는 관할 세무서 또는 국세청 기준을 확인하세요.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">업종별 부가가치율 (2021.7.1. 이후)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[320px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">업종</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">부가가치율</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">실효세율</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['소매업·음식점업·재생용재료수집판매업','15%','1.5%'],
                  ['제조업·농림어업·소화물전문운송업','20%','2.0%'],
                  ['숙박업','25%','2.5%'],
                  ['건설·운수창고·정보통신·그 밖의 서비스업(인물사진·행사영상 촬영 포함)','30%','3.0%'],
                  ['금융보험·전문과학기술(인물사진·행사영상 제외)·사업지원·부동산관련·부동산임대업','40%','4.0%'],
                ].map(([industry, rate, eff]) => (
                  <tr key={industry} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{industry}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{rate}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{eff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            실효세율 = 부가가치율 × 10%. 업종 분류 세부는 국세청 고시를 따르며, 겸업 시 업종별로 구분 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">어떤 경우 어느 쪽이 유리한가요?</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>매입이 많다면 → 일반과세 유리 경우가 많음:</strong> 사업 초기 인테리어·설비 등 대규모 투자가 있으면 일반과세자로 매입세액 환급을 받는 편이 유리할 수 있습니다. 간이과세자는 환급이 불가합니다.</li>
            <li><strong>소비자 상대(B2C)·매입 적음 → 간이과세 유리 경우가 많음:</strong> 세금계산서 발급이 적고 매입이 적은 소매·음식점 등은 낮은 실효세율의 간이과세가 유리한 경우가 많습니다.</li>
            <li><strong>거래처가 사업자(B2B) 위주 → 일반과세 고려:</strong> 거래처가 매입세액 공제를 위해 세금계산서를 요구하는 경우, 발급이 원활한 일반과세자가 거래에 유리할 수 있습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 이 도구가 내 과세유형을 확정해 주나요?</p>
              <p>
                아니요. 간이과세 적용 여부는 매출 외에 업종·사업장 소재지·관계 법령에 따라 달라지므로, 본 도구는
                &lsquo;해당 여부&rsquo;를 판정하지 않습니다. 대신 두 유형의 예상 부담을 비교해 어느 쪽이 유리한지 판단을 돕습니다.
                최종 적용 여부는 관할 세무서에서 확인하세요.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 간이과세자는 부가세 환급을 받을 수 있나요?</p>
              <p>
                간이과세자는 세금계산서등을 받은 매입 공급대가의 0.5%를 납부세액에서 공제받을 수 있습니다.
                다만 이 공제액이 산출세액을 초과하더라도 초과분은 환급되지 않습니다(부가가치세법 제63조). 매입세액
                전액을 공제·환급받는 일반과세자와 이 점이 다릅니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 처음 사업자등록할 때 유형을 선택할 수 있나요?</p>
              <p>
                신규 사업자는 간이과세 배제 업종·지역이 아니라면 간이과세로 등록할 수 있습니다. 다만 매입세액 환급이
                필요하면 일반과세자로 등록하는 것이 유리할 수 있습니다. 유형은 이후 매출에 따라 자동 전환되기도 합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 2026년에 무엇이 바뀌었나요?</p>
              <p>
                2026년부터 국세청 고시에 따라 특정 간이과세 배제지역에 등록된 사업자는 매출액과 관계없이 일반과세자로
                전환됩니다. 매출 기준(1억 400만원)은 그대로지만 사업장 소재지가 새 변수가 되었습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 도구는 입력값 기준으로 간이과세·일반과세의 예상 부가세를 단순 비교하는 참고용 도구입니다.
            간이과세 적용 여부는 연매출 외에도 업종, 사업장 소재지(간이과세 배제지역 여부), 관계 법령 등에 따라
            달라질 수 있습니다. 신용카드매출 세액공제·의제매입세액 등도 반영되지 않습니다.
            최종 적용 여부와 세액은 관할 세무서 또는 국세청 홈택스를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm">
          <p className="font-semibold text-slate-800 mb-2">관련 가이드</p>
          <ul className="space-y-1.5">
            <li>
              <a href="/guide/simplified-vs-general-vat" className="text-blue-700 hover:underline font-semibold">→ 간이과세 vs 일반과세 완벽 정리</a>
              <span className="text-slate-500"> · 제도 차이와 선택 기준을 더 자세히</span>
            </li>
            <li>
              <a href="/guide/vat-filing" className="text-blue-700 hover:underline font-semibold">→ 부가세 신고 방법</a>
              <span className="text-slate-500"> · 신고 시기와 절차 안내</span>
            </li>
          </ul>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>부가가치세법 제61조(간이과세)·제63조(납부세액)·제69조(납부의무 면제) — 국가법령정보센터</li>
            <li>부가가치세법 시행령 — 업종별 부가가치율(2021.7.1. 이후)</li>
            <li>국세청 「2026.1.1. 시행 간이과세배제기준 고시」</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="vat-type-compare" />
    </main>
  )
}
