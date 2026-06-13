// src/app/guide/withholding-year-end/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '원천징수와 연말정산은 어떻게 연결되나 (2026)',
  description:
    '매월 떼는 원천징수와 다음 해 연말정산이 어떻게 이어지는지 정리. 13월의 월급(환급)이 생기는 원리, 추가 납부가 나오는 이유, 공제 챙기는 법을 사례로 설명합니다.',
  alternates: { canonical: '/guide/withholding-year-end' },
}

export default function WithholdingYearEndGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">근로소득</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          원천징수와 연말정산은 어떻게 연결되나
        </h1>
        <p className="text-slate-500">
          매월 급여에서 떼이는 세금과 다음 해 연말정산은 한 묶음입니다. 「13월의 월급」이 생기는 원리와
          추가 납부가 나오는 이유를 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">매월 원천징수 = 선납, 연말정산 = 정산</h2>
          <p>
            회사는 급여를 줄 때 국세청 <strong>근로소득 간이세액표</strong>에 따라 소득세와 지방소득세를
            미리 떼어 대신 납부합니다. 이건 정확한 1년 세금이 아니라 <strong>대략적인 선납</strong>입니다.
            실제 세금은 다음 해 1~2월 <strong>연말정산</strong>에서 1년치 소득과 각종 공제를 반영해
            확정됩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 환급/추가납부 = (1년간 원천징수로 낸 세금) − (연말정산으로 확정된 세금).
              미리 낸 게 더 많으면 환급(13월의 월급), 부족하면 추가 납부입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">왜 환급/추가납부가 갈릴까</h2>
          <p>
            간이세액표는 부양가족 수 정도만 반영한 평균치라, 개인별 공제(의료비·교육비·기부금·연금저축·
            주택자금 등)는 매월 단계에서 반영되지 않습니다. 그래서 공제 항목이 많은 사람은 연말정산에서
            세금이 크게 줄어 환급을 받고, 공제가 적거나 중도에 소득이 늘어난 사람은 추가 납부가
            나오기도 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">연말정산에서 챙기는 주요 공제</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>인적공제:</strong> 본인·배우자·부양가족 1인당 150만 원</li>
            <li><strong>신용카드 등 사용액 소득공제:</strong> 총급여 25% 초과 사용분에 대해 일정률 공제</li>
            <li><strong>연금저축·IRP 세액공제:</strong> 합산 연 900만 원까지 (공제율 13.2~16.5%)</li>
            <li><strong>의료비·교육비·기부금 세액공제</strong></li>
            <li><strong>월세·주택자금 공제</strong> (요건 충족 시)</li>
            <li><strong>자녀세액공제</strong> (8세 이상 자녀 수에 따라)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">간이세액표 비율 조정 (80~120%)</h2>
          <p>
            회사에 신청하면 매월 떼는 원천징수액을 간이세액표의 <strong>80%·100%·120%</strong> 중에서 고를 수
            있습니다. 80%를 택하면 매월 적게 떼지만 연말정산에서 더 내거나 덜 환급받고, 120%를 택하면
            매월 많이 떼는 대신 환급이 커집니다. 1년 총 세금은 동일하며, 현금 흐름 선호의 문제입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 공제 많은 직장인 (연금저축·의료비·월세)</p>
            <p>매월 평균치로 떼였지만 연말정산에서 공제가 크게 반영 → <strong>환급</strong>(13월의 월급).</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 공제 거의 없는 사회초년생</p>
            <p>간이세액표대로 떼인 금액과 실제 세액이 비슷 → <strong>환급·추가납부 소액</strong>.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 연중 성과급·이직으로 소득 급증</p>
            <p>매월 선납이 부족했고 공제도 적음 → <strong>추가 납부</strong> 발생.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 원천징수를 적게 떼면 이득인가요?</p>
              <p>아닙니다. 적게 떼면 연말정산에서 그만큼 더 내거나 덜 환급받습니다. 1년 총 부담세액은 같습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 연말정산은 누가 하나요?</p>
              <p>회사(원천징수의무자)가 진행하며, 근로자는 공제 자료(홈택스 간소화 자료 등)를 제출합니다. 보통 다음 해 1~2월에 이뤄집니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 중도 퇴사하면 연말정산은 어떻게 되나요?</p>
              <p>퇴사 시 회사가 약식 정산을 하고, 누락된 공제가 있으면 다음 해 5월 종합소득세로 추가 정산할 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부업 소득이 있으면요?</p>
              <p>근로소득 외 사업·기타 소득이 있으면 연말정산과 별개로 5월에 종합소득세 신고로 합산 정산해야 합니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/withholding-calculator" className="text-blue-700 hover:underline font-semibold">→ 원천징수세액 계산기</Link>
              <span className="text-slate-500"> · 월 급여·부양가족 기준 예상 원천징수</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 종합소득세 계산기</Link>
              <span className="text-slate-500"> · 합산 소득 예상 세액</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/income-tax-may" className="text-blue-700 hover:underline font-semibold">→ 5월 종합소득세 신고 가이드</Link></li>
            <li><Link href="/guide/freelancer-refund" className="text-blue-700 hover:underline font-semibold">→ 프리랜서 3.3% 환급과 추가납부</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제134조 (근로소득 원천징수), 제137조 (연말정산)</li>
            <li>국세청 「연말정산 안내」, 근로소득 간이세액표, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인 사정에 따라 적용이 달라질 수 있습니다. 정확한 공제·정산은
            국세청 홈택스 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
