// src/app/income-tax-calculator/IncomeTaxClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

// 2026년 종합소득세 누진세율
function calcIncomeTax(base: number): number {
  if (base <= 14_000_000)  return Math.floor(base * 0.06)
  if (base <= 50_000_000)  return Math.floor(840_000    + (base - 14_000_000)  * 0.15)
  if (base <= 88_000_000)  return Math.floor(6_240_000  + (base - 50_000_000)  * 0.24)
  if (base <= 150_000_000) return Math.floor(15_360_000 + (base - 88_000_000)  * 0.35)
  if (base <= 300_000_000) return Math.floor(37_060_000 + (base - 150_000_000) * 0.38)
  if (base <= 500_000_000) return Math.floor(94_060_000 + (base - 300_000_000) * 0.40)
  if (base <= 1_000_000_000) return Math.floor(174_060_000 + (base - 500_000_000) * 0.42)
  return Math.floor(384_060_000 + (base - 1_000_000_000) * 0.45)
}

export default function IncomeTaxClient() {
  const [income, setIncome]   = useState('')
  const [expense, setExpense] = useState('')

  const incomeNum  = parseNum(income)
  const expenseNum = parseNum(expense)
  const hasValue   = incomeNum > 0

  const taxBase    = Math.max(0, incomeNum - expenseNum)
  const incomeTax  = calcIncomeTax(taxBase)
  const localTax   = Math.floor(incomeTax * 0.1)
  const totalTax   = incomeTax + localTax
  const netIncome  = incomeNum - totalTax
  const effectiveRate = incomeNum > 0 ? ((totalTax / incomeNum) * 100).toFixed(1) : '0'

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">종합소득세 계산기</h1>
      <p className="text-slate-500 mb-6">2026년 누진세율 기준 · 간이 계산 (공제 미반영)</p>

      {/* 입력 카드 */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">소득 정보 입력</h2>

        <div>
          <label className="calc-label">연 소득 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={income}
              onChange={(e) => setIncome(formatInput(e.target.value))}
              placeholder="예: 50,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">세전 연간 총 소득을 입력하세요</p>
        </div>

        <div>
          <label className="calc-label">필요경비 / 공제액 <span className="text-xs font-normal text-slate-400">(선택)</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={expense}
              onChange={(e) => setExpense(formatInput(e.target.value))}
              placeholder="예: 10,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">필요경비, 소득공제 합계 (입력 시 과세표준에서 차감)</p>
        </div>

        {hasValue && (
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">입력 요약</p>
            <div className="flex justify-between"><span>연 소득</span><span className="font-medium text-slate-700">{fmt(incomeNum)}원</span></div>
            {expenseNum > 0 && <div className="flex justify-between"><span>필요경비/공제</span><span className="font-medium text-emerald-600">−{fmt(expenseNum)}원</span></div>}
            <div className="flex justify-between"><span>과세표준</span><span className="font-medium text-slate-700">{fmt(taxBase)}원</span></div>
          </div>
        )}
      </div>

      {/* 결과 */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">총 세액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(totalTax)}<span className="text-2xl font-bold ml-1">원</span></p>
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
              <span>실효세율 {effectiveRate}%</span>
              <span>과세표준 {fmt(taxBase)}원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="calc-card p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">세후 소득</p>
              <p className="text-lg font-bold text-emerald-600 tabular-nums">{fmt(netIncome)}원</p>
            </div>
            <div className="calc-card p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">과세표준</p>
              <p className="text-lg font-bold text-slate-900 tabular-nums">{fmt(taxBase)}원</p>
            </div>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">세금 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">과세표준</span><span className="font-bold text-slate-800 tabular-nums">{fmt(taxBase)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세</span><span className="font-bold text-blue-600 tabular-nums">{fmt(incomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (소득세×10%)</span><span className="font-bold text-slate-700 tabular-nums">{fmt(localTax)} 원</span></li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">총 세액</span>
                <span className="font-bold text-red-500 tabular-nums">−{fmt(totalTax)} 원</span>
              </li>
            </ul>
          </div>

          <div className="calc-card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong className="font-semibold">⚠ 간이 계산 안내:</strong> 본 계산기는 기본공제, 세액공제, 감면 등 각종 공제를 반영하지 않은 단순 참고용입니다. 실제 신고 시 홈택스 또는 세무사를 이용하세요.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          소득을 입력하면 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">종합소득세란?</h2>
          <p>
            종합소득세는 한 해 동안 발생한 여러 종류의 소득을 모두 합산해 신고·납부하는
            세금입니다. 사업소득(개인사업자), 인적용역소득(프리랜서), 부동산임대소득,
            금융소득(이자·배당), 연금소득, 기타소득 등이 모두 합산 대상이며,
            <strong> 매년 5월 1일부터 5월 31일</strong> 사이에 전년도 소득을 신고합니다.
          </p>
          <p className="mt-2">
            근로소득만 있는 직장인은 회사가 연말정산으로 처리하므로 별도 신고 의무가 없지만,
            근로소득 외에 다른 소득이 있거나 두 곳 이상의 회사에서 근로소득을 받았다면
            5월에 종합소득세를 신고해야 합니다. 프리랜서가 매년 받는 환급금이 바로 이
            종합소득세 신고를 통해 확정됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">2026년 종합소득세 세율표</h2>
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
            누진세율이므로 과세표준 전체에 한 가지 세율이 적용되는 것이 아니라,
            구간별로 해당 세율이 적용됩니다. 예를 들어 과세표준 6천만 원이면 1,400만 원까지는
            6%, 1,400만~5,000만 원 구간은 15%, 5,000만~6,000만 원 구간은 24%가 차등 적용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. 프리랜서 연 수입 5,000만 원, 필요경비 1,500만 원</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 5,000만 − 1,500만 = <strong>3,500만 원</strong></li>
              <li>소득세 = 84만 + (3,500만 − 1,400만) × 15% = <strong>399만 원</strong></li>
              <li>지방소득세 = 39.9만 원</li>
              <li>총 세액 ≈ <strong>438.9만 원</strong></li>
              <li className="text-xs text-slate-500 mt-1">3.3%로 이미 165만 원 원천징수됐다면 약 274만 원 추가 납부</li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 개인사업자 매출 1억 원, 필요경비 6,000만 원</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 1억 − 6,000만 = <strong>4,000만 원</strong></li>
              <li>소득세 = 84만 + (4,000만 − 1,400만) × 15% = <strong>474만 원</strong></li>
              <li>지방소득세 = 47.4만 원</li>
              <li>총 세액 ≈ <strong>521.4만 원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 고소득 프리랜서 연 수입 1.5억, 경비 4,000만 원</p>
            <ul className="space-y-1 text-slate-600">
              <li>과세표준 = 1.1억 원</li>
              <li>소득세 = 1,536만 + (1.1억 − 8,800만) × 35% = <strong>2,306만 원</strong></li>
              <li>지방소득세 = 230.6만 원</li>
              <li>총 세액 ≈ <strong>2,536.6만 원</strong></li>
              <li className="text-xs text-slate-500 mt-1">실효세율 약 16.9%</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>전체 소득에 최고 세율 곱하기:</strong> 누진세율은 구간별로 다르게 적용됩니다. 5천만 원이라고 해서 5천만 × 15%가 아니라, 1,400만까지는 6%, 나머지가 15%로 계산됩니다.</li>
            <li><strong>지방소득세 누락:</strong> 종합소득세의 10%가 지방소득세로 추가됩니다. 자주 놓치는 항목입니다.</li>
            <li><strong>3.3% 원천징수가 끝이라고 착각:</strong> 3.3%는 선납입니다. 실제 종합소득세를 계산해 환급 또는 추가 납부가 발생합니다.</li>
            <li><strong>필요경비 증빙 미수집:</strong> 영수증·세금계산서·간이영수증·계좌이체 내역 등 증빙이 있어야 경비 처리 가능합니다.</li>
            <li><strong>5월 신고 기간 놓치기:</strong> 무신고가산세(20%) + 납부지연가산세가 부과됩니다.</li>
            <li><strong>경비율 잘못 적용:</strong> 단순경비율과 기준경비율은 업종별·매출별로 다릅니다. 적용 가능한 신고 유형을 먼저 확인해야 합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">절세 팁 (참고용)</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>사업 관련 지출 영수증 모으기:</strong> 통신비, 사무용품비, 교통비, 도서구입비, 회의비 등은 사업 관련성을 입증하면 경비 처리 가능합니다.</li>
            <li><strong>노란우산공제·연금저축 활용:</strong> 노란우산공제는 사업소득에서 직접 차감(연 최대 500만 원), 연금저축은 세액공제(연 최대 600만 원, IRP 포함 900만 원).</li>
            <li><strong>건강보험료 지역가입자 변동 확인:</strong> 종합소득세 신고 결과는 건강보험료 산정에도 반영됩니다.</li>
            <li><strong>홈택스 모두채움 신고서 활용:</strong> 일정 요건의 단순경비율 적용 사업자는 모두채움 서비스로 간편 신고 가능합니다.</li>
            <li><strong>세무대리인 비용도 경비 처리:</strong> 세무사 수수료, 회계 프로그램 구독료 등도 경비 인정.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            절세는 합법적인 범위 내에서만 가능합니다. 무리한 경비 부풀리기는 세무조사
            대상이 될 수 있으니 주의하세요.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기와 절차</h2>
          <p>
            종합소득세 신고 기간은 <strong>매년 5월 1일부터 5월 31일</strong>까지입니다.
            신고는 국세청 홈택스 또는 모바일 손택스를 통해 비대면으로 가능하며, 직접
            세무서를 방문할 수도 있습니다. 성실신고확인대상자는 6월 30일까지로 1개월 연장됩니다.
          </p>
          <p className="mt-2">
            기한을 넘기면 무신고가산세(일반 20%, 부정 40%)와 납부지연가산세(연 약 8%대)가
            부과되므로 반드시 5월 31일 이전에 신고해야 합니다. 신고는 했으나 납부할 자금이
            부족하다면 분납(2개월 분납) 또는 납부기한 연장을 신청할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 직장인도 종합소득세 신고를 해야 하나요?</p>
              <p>
                근로소득만 있는 경우 회사 연말정산으로 종료됩니다. 다만 ① 부업 소득(프리랜서·임대 등)이
                있거나, ② 두 군데 이상에서 근로소득을 받았거나, ③ 금융소득이 연 2,000만 원을 초과하면
                5월에 종합소득세 신고가 필요합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 프리랜서는 무조건 환급받나요?</p>
              <p>
                대부분 환급받지만 항상 그런 것은 아닙니다. 연 수입이 일정 수준을 넘어가면(통상 4,000만~5,000만 원
                이상) 종합소득세 누적 세액이 3.3% 원천징수액을 초과해 추가 납부가 발생할 수 있습니다.
                실제 결과는 필요경비·공제 항목에 따라 달라집니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 단순경비율과 기준경비율 중 어떤 게 유리한가요?</p>
              <p>
                일반적으로 실제 경비가 많으면 「장부 작성(복식부기·간편장부)」이 유리하고,
                경비가 적으면 추정 경비율을 적용하는 단순경비율이 유리합니다. 직전 연도 매출 규모와
                업종 코드에 따라 적용 가능한 신고 유형이 정해지므로 사전에 확인이 필요합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 종합소득세를 안 내면 어떻게 되나요?</p>
              <p>
                무신고가산세 20%(부정 40%), 납부지연가산세 연 약 8%(일할 계산), 그리고 향후
                건강보험료·국민연금 산정에도 영향을 미칩니다. 5년이 지나면 시효가 완성되지만
                고의적 누락은 10년까지 추징될 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 분납이 가능한가요?</p>
              <p>
                납부 세액이 1,000만 원을 초과하는 경우, 1,000만 원 초과분은 2개월 이내 분납이
                가능합니다. 신고 시 분납 신청을 함께 체크하면 됩니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 본 계산기 결과와 실제 세액이 차이 나는 이유는?</p>
              <p>
                본 계산기는 인적공제, 세액공제(자녀·근로·기부금·의료비·교육비), 감면 항목,
                중간예납세액, 기납부세액(원천징수분) 등을 반영하지 않은 간이 도구입니다.
                실제 세액은 홈택스 모의계산 또는 세무사 상담을 통해 확인하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 2026년 누진세율을 단순 적용한 도구이며, 인적공제·세액공제·감면·기납부세액 등을
            반영하지 않습니다. 실효세율은 일반적으로 본 계산기 결과보다 낮게 나옵니다.
            정확한 신고는 국세청 홈택스 또는 세무사를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제55조 (세율) — 국세법령정보시스템</li>
            <li>소득세법 시행령 — 필요경비·소득공제 기준</li>
            <li>국세청 종합소득세 신고 안내 (홈택스)</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="income-tax-calculator" />
    </main>
  )
}
