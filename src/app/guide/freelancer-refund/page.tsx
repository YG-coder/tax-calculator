// src/app/guide/freelancer-refund/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '프리랜서 3.3%, 환급받는 사람 vs 추가납부하는 사람 (2026)',
  description:
    '프리랜서 3.3% 원천징수가 환급으로 돌아오는 사람과 오히려 추가 납부가 생기는 사람의 차이를 수입 구간·경비별로 정리. 환급을 늘리는 방법까지 사례로 설명합니다.',
  alternates: { canonical: '/guide/freelancer-refund' },
}

export default function FreelancerRefundGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">프리랜서</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          프리랜서 3.3%, 환급받는 사람 vs 추가납부하는 사람
        </h1>
        <p className="text-slate-500">
          누구는 5월에 환급을 받고 누구는 더 내야 합니다. 그 차이가 어디서 갈리는지, 그리고 어떻게 하면
          환급을 늘릴 수 있는지를 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">3.3%는 세금이 아니라 「선납」입니다</h2>
          <p>
            프리랜서가 대금을 받을 때 떼이는 <strong>3.3%</strong>는 소득세 3% + 지방소득세 0.3%로,
            미리 떼어 두는 <strong>기납부세액</strong>입니다. 실제 세금은 1년치 수입에서 경비와 공제를 뺀
            금액에 누진세율(6~45%)을 적용한 종합소득세이며, 매년 5월에 확정됩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 환급/추가납부 = (1년간 떼인 3.3%) − (실제 종합소득세).
              실제 세금이 3.3% 합계보다 적으면 환급, 많으면 추가 납부입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">왜 대부분은 환급을 받을까</h2>
          <p>
            3.3%는 수입의 3%를 일률적으로 떼지만, 실제 종합소득세는 누진세율이라 낮은 구간일수록
            실효세율이 3%보다 낮습니다. 과세표준 1,400만 원까지는 6% 구간이지만, 여기에 경비와
            인적공제·각종 세액공제가 더해지면 실효세율이 3% 아래로 내려가는 경우가 많습니다. 그래서
            수입이 크지 않은 프리랜서는 환급을 받는 경우가 흔합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">반대로 추가납부가 생기는 경우</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>수입이 커서 누진세율 15%, 24% 이상 구간에 들어가는 경우 — 3.3% 선납으로는 부족</li>
            <li>경비가 거의 없어 과세표준이 수입과 비슷한 경우</li>
            <li>근로소득 등 다른 소득과 합산되어 전체 과세표준이 높아지는 경우</li>
            <li>인적공제·세액공제 받을 항목이 적은 경우</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            대략적으로 경비가 적은 단독 프리랜서 기준 연 수입이 4,000만~5,000만 원을 넘어가면 추가
            납부가 발생하기 시작하는 경우가 많지만, 실제는 경비·공제에 따라 크게 달라집니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 부업 프리랜서 (연 수입 1,200만, 경비 200만)</p>
            <ul className="space-y-1 text-slate-600">
              <li>1년간 떼인 3.3% = 약 39.6만 원</li>
              <li>과세표준 = 1,000만 → 6% 구간, 인적공제 반영 시 실제 세액 거의 0에 가까움</li>
              <li>→ 대부분 <strong>환급</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 전업 프리랜서 (연 수입 3,000만, 경비 800만)</p>
            <ul className="space-y-1 text-slate-600">
              <li>1년간 떼인 3.3% = 99만 원</li>
              <li>과세표준 ≈ 2,200만(공제 전), 인적·연금 공제 반영 시 실제 세액이 선납보다 낮은 경우 많음</li>
              <li>→ 보통 <strong>소액 환급 또는 비슷</strong> (경비·공제에 따라 변동)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 고소득 프리랜서 (연 수입 8,000만, 경비 1,500만)</p>
            <ul className="space-y-1 text-slate-600">
              <li>1년간 떼인 3.3% = 264만 원</li>
              <li>과세표준 ≈ 6,500만 → 24% 구간 진입, 실제 세액이 선납액을 크게 초과</li>
              <li>→ <strong>추가 납부</strong> 가능성 높음</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">환급을 늘리는(=세금을 줄이는) 방법</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>경비 빠짐없이 처리:</strong> 노트북·소프트웨어·통신비·교통비·도서·회의비 등 업무 관련 지출 영수증을 1년 내내 모으세요.</li>
            <li><strong>노란우산공제:</strong> 사업소득에서 직접 차감(연 최대 500만 원).</li>
            <li><strong>연금저축 + IRP:</strong> 합산 연 900만 원까지 세액공제(13.2~16.5%).</li>
            <li><strong>인적공제:</strong> 부양가족 1인당 150만 원 추가 공제.</li>
            <li><strong>국민연금·건강보험료:</strong> 본인 부담분 공제.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 환급은 언제 들어오나요?</p>
              <p>5월에 신고하면 보통 1~2개월 내, 늦어도 6~7월경 신고 시 입력한 본인 계좌로 입금됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 신고를 안 하면 어떻게 되나요?</p>
              <p>
                환급 대상이라면 신고하지 않으면 환급을 못 받습니다. 반대로 추가 납부 대상인데 신고를
                안 하면 무신고가산세(20%)와 납부지연가산세가 부과됩니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 홈택스에 안 잡힌 현금 수입도 신고해야 하나요?</p>
              <p>네. 지급명세서에 없는 수입도 본인이 추가 입력해야 합니다. 누락하면 추후 가산세 대상이 됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 내가 환급인지 추가납부인지 미리 알 수 있나요?</p>
              <p>
                연 수입과 경비를 넣어 종합소득세 계산기로 예상 세액을 구한 뒤, 1년간 떼인 3.3% 합계와
                비교하면 대략 가늠할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/freelancer-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 프리랜서 3.3% 계산기</Link>
              <span className="text-slate-500"> · 계약금액에서 실수령액·원천징수 확인</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 종합소득세 계산기</Link>
              <span className="text-slate-500"> · 연 수입·경비로 예상 세액 계산</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/freelancer-tax" className="text-blue-700 hover:underline font-semibold">→ 프리랜서 종합소득세 신고 완벽 가이드</Link></li>
            <li><Link href="/guide/income-tax-may" className="text-blue-700 hover:underline font-semibold">→ 5월 종합소득세 신고 가이드</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제55조 (세율), 제129조 (원천징수세율)</li>
            <li>국세청 「종합소득세 신고 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인 사정에 따라 적용이 달라질 수 있습니다. 중요한 의사결정 시
            국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
