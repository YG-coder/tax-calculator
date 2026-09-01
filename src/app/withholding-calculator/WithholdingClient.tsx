// src/app/withholding-calculator/WithholdingClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'
import SourceNote from '@/components/SourceNote'
import { amountError, amountValue, formatAmount } from '@/lib/utils/amount'
import { childMonthlyCredit, lookupWithholdingTax } from '@/lib/tax/rules/withholding'

function fmt(n: number) { return n.toLocaleString('ko-KR') }

export default function WithholdingCalculatorPage() {
  const [salary,     setSalary]     = useState('')
  const [dependents, setDependents] = useState('1')
  const [childCount, setChildCount] = useState('0')

  const salaryNum   = amountValue(salary)
  const depNum      = Math.max(1, Number(dependents) || 1)
  const childNum    = Math.max(0, Number(childCount) || 0)
  const hasValue    = salaryNum > 0

  // 근로소득세에는 지방소득세 10%가 부과됨 (지방세법, 소득분).
  // 근로소득세 원천징수 시 지방소득세도 함께 특별징수 → 아래 finalLocalTax에서 반영.
  const incomeTax  = lookupWithholdingTax(salaryNum, depNum)

  // 간이세액표 자녀수별 공제 (8세 이상 20세 이하)
  const childCredit = childMonthlyCredit(childNum)

  const finalIncomeTax = Math.max(0, incomeTax - childCredit)
  const finalLocalTax  = Math.floor(finalIncomeTax * 0.1 / 10) * 10
  const finalTotal     = finalIncomeTax + finalLocalTax
  const finalNet       = salaryNum - finalTotal

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">원천징수세액 계산기</h1>
      <p className="text-slate-500 mb-4">2026년 공식 근로소득 간이세액표 기준 · 참고용</p>

      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-slate-700">
        <p className="font-semibold text-slate-900 mb-1">2026년 공식 간이세액표 적용</p>
        <p>
          소득세법 시행령 별표 2(2026년 2월 27일 개정, 3월 1일 시행)의 646개 급여 구간과
          1,000만원 초과 산식을 적용합니다. 회사의 비과세 급여 처리와 가족 정보에 따라 실제 금액은 달라질 수 있습니다.
        </p>
        <p className="mt-2">
          <a href="https://www.hometax.go.kr/websquare/websquare.wq?tm2lIdx=0113000000&amp;tmIdx=0&amp;w2xPath=%2Fui%2Fpp%2Findex_pp.xml" target="_blank" rel="noopener noreferrer"
             className="font-semibold text-blue-700 underline">
            홈택스 근로소득 간이세액표 조회 →
          </a>
        </p>
      </div>

      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">급여 정보 입력</h2>

        <div>
          <label htmlFor="salary" className="calc-label">월 급여 (세전) <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" pattern="[0-9,]*" id="salary" value={formatAmount(salary)}
              onChange={(e) => setSalary(e.target.value)}
              aria-invalid={amountError(salary) !== null}
              aria-describedby={amountError(salary) ? 'salary-error' : undefined}
              placeholder="예: 3,500,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          {amountError(salary) && (
            <p id="salary-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{amountError(salary)}</p>
          )}
          <p className="calc-hint">비과세 소득과 학자금 지원액을 제외한 월 급여를 입력하세요</p>
        </div>

        <div>
          <label htmlFor="dependents" className="calc-label">부양가족 수 (본인 포함)</label>
          <select id="dependents" value={dependents}
            onChange={(event) => {
              const n = Number(event.target.value)
              setDependents(event.target.value)
              if (Number(childCount) >= n) setChildCount(String(Math.max(0, n - 1)))
            }}
            className="calc-input">
            {Array.from({ length: 11 }, (_, index) => index + 1).map((n) => (
              <option key={n} value={n}>{n}명</option>
            ))}
          </select>
          <p className="calc-hint">본인과 배우자도 각각 1명으로 포함해 선택하세요</p>
        </div>

        <div>
          <label htmlFor="child-count" className="calc-label">8세 이상 20세 이하 자녀 수</label>
          <select id="child-count" value={childCount} onChange={(event) => setChildCount(event.target.value)}
            className="calc-input">
            {Array.from({ length: depNum }, (_, index) => index).map((n) => (
              <option key={n} value={n}>{n}명</option>
            ))}
          </select>
          <p className="calc-hint">간이세액표 자녀수 공제 반영 · 8세 이상 자녀 (1명 월 20,830원, 2명 월 45,830원, 3명~ +월 33,330원/명)</p>
        </div>
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up" aria-live="polite">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">예상 실수령액 (세금만 차감)</p>
            <p className="text-4xl font-black tabular-nums">{fmt(finalNet)}<span className="text-2xl font-bold ml-1">원</span></p>
            <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-100">
              <span>월 세전 {fmt(salaryNum)}원</span>
              <span>세금 공제 {fmt(finalTotal)}원</span>
            </div>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">원천징수 내역 (세금만)</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세 (2026 공식 간이세액표)</span><span className="font-bold text-blue-600 tabular-nums">{fmt(finalIncomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (소득세×10%)</span><span className="font-bold text-slate-600 tabular-nums">{fmt(finalLocalTax)} 원</span></li>
              {childCredit > 0 && (
                <li className="flex justify-between text-sm"><span className="text-emerald-600">자녀수 공제 적용 (간이세액표)</span><span className="font-bold text-emerald-600 tabular-nums">−{fmt(childCredit)} 원/월</span></li>
              )}
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">세금 합계</span>
                <span className="font-bold text-blue-600 tabular-nums">{fmt(finalTotal)} 원</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              ※ 위 실수령액은 소득세·지방소득세만 차감한 값입니다. 실제 급여에서는 국민연금·건강보험·
              장기요양·고용보험(4대보험)이 추가로 공제됩니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          월 급여를 입력하면 예상 원천징수세액이 표시됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">원천징수세액이란?</h2>
          <p>
            원천징수는 회사(원천징수의무자)가 급여를 줄 때 근로소득세와 지방소득세를 미리 떼어
            대신 납부하는 제도입니다. 매월 정확한 연 세액을 계산하기 어렵기 때문에, 국세청이 제공하는
            <strong> 근로소득 간이세액표</strong>에 따라 월급과 부양가족 수 기준으로 개략적인 금액을 떼고,
            이듬해 <strong>연말정산</strong>에서 실제 세액과 정산(환급 또는 추가 납부)합니다.
          </p>
          <p className="mt-2">
            근로소득세는 소득세의 한 종류이므로 <strong>소득세의 10%가 지방소득세로 함께 징수</strong>됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">계산 흐름</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>월 급여 구간과 공제대상 가족 수로 공식 표의 기본 세액 조회</li>
            <li>간이세액표 <strong>자녀수 공제</strong> 추가 적용</li>
            <li>지방소득세 = 소득세 × 10%</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            본 계산기는 소득세법 시행령 별표 2의 공식 표를 정적으로 참조합니다. 실제 급여명세서와 차이가 있다면
            비과세 소득, 학자금 지원액, 회사에 신고한 공제대상 가족 수를 먼저 확인하세요.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">무엇이 원천징수액을 바꾸나</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>부양가족 수:</strong> 공제 대상 부양가족이 늘수록 과세표준이 줄어 매월 떼는 세금이 감소합니다.</li>
            <li><strong>8세 이상 20세 이하 자녀 수:</strong> 간이세액표 자녀수 공제만큼 월 세액이 추가로 줄어듭니다. (연말정산 자녀세액공제와는 별개입니다)</li>
            <li><strong>비과세 수당:</strong> 식대(월 20만 원 한도), 자가운전보조금 등 비과세 항목은 과세 대상에서 빠지므로 실제 세금이 더 낮을 수 있습니다. (본 계산기는 비과세를 반영하지 않습니다)</li>
            <li><strong>간이세액표 비율 선택:</strong> 회사에 신청하면 간이세액표의 80% 또는 120%로 조정할 수 있습니다. 80%는 매월 적게 떼고 연말정산에서 더 내거나 덜 받는 구조입니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">원천징수와 연말정산의 관계</h2>
          <p>
            매월 떼는 원천징수액은 어디까지나 &lsquo;선납&rsquo;입니다. 실제로 부담할 세금은 연말정산에서
            의료비·교육비·신용카드·연금저축 등 각종 공제를 반영해 확정됩니다. 1년간 원천징수로 낸
            금액이 확정세액보다 많으면 환급, 적으면 추가 납부가 발생합니다. 흔히 말하는
            &lsquo;13월의 월급&rsquo;이 바로 이 환급금입니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 이 계산기 결과가 급여명세서 실수령액과 다른 이유는?</p>
              <p>
                본 계산기는 소득세·지방소득세만 반영합니다. 실제 급여에서는 국민연금(4.75%), 건강보험,
                장기요양, 고용보험 등 4대보험이 추가로 공제되므로 실수령액은 더 낮습니다. 4대보험 포함
                실수령액은 연봉계산기 류 도구로 확인하세요.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 원천징수를 적게 떼면 이득인가요?</p>
              <p>
                아닙니다. 적게 떼면 연말정산에서 그만큼 더 내거나 덜 환급받습니다. 1년 총 부담세액은
                동일합니다. 현금 흐름 선호에 따라 비율(80~120%)을 선택하는 것일 뿐입니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부양가족은 누구까지 넣을 수 있나요?</p>
              <p>
                기본공제 대상은 본인, 배우자, 직계존비속 등으로 소득·나이 요건을 충족해야 합니다.
                연 소득금액 100만 원(근로소득만 있으면 총급여 500만 원) 이하 등의 요건이 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 정확한 월 원천징수액은 어디서 확인하나요?</p>
              <p>
                국세청 홈택스의 &lsquo;근로소득 간이세액표&rsquo; 조회에서 월급여와 공제대상 가족 수를
                입력하면 공식 표 기준 금액을 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 2026년 3월 1일 시행 공식 간이세액표를 적용하며 소득세·지방소득세만 반영합니다.
            비과세 수당, 상여금, 중도 입·퇴사, 4대보험, 회사별 급여 구조에 따라 실제 금액과 차이가 날 수
            있습니다. 신고·정산 전에는 급여명세서와 홈택스 조회 결과를 함께 확인하세요.
          </p>
        </div>

        <SourceNote calculator="withholding-calculator" />
      </section>

      <RelatedCalculators current="withholding-calculator" />
    </main>
  )
}
