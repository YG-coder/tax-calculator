// src/app/guide/long-term-holding-deduction/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '장기보유특별공제 계산 방법 (표1·표2, 2026)',
  description:
    '양도소득세 장기보유특별공제의 표1(일반, 최대 30%)과 표2(1세대 1주택, 보유+거주 최대 80%) 공제율과 계산 방법을 국세청 기준으로 정리. 사례와 FAQ 포함.',
  alternates: { canonical: '/guide/long-term-holding-deduction' },
}

export default function LongTermHoldingDeductionGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">양도소득세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          장기보유특별공제 계산 방법
        </h1>
        <p className="text-slate-500">
          오래 보유한 부동산을 팔 때 양도차익의 상당 부분을 깎아 주는 제도입니다. 일반(표1)과 1세대
          1주택(표2)의 공제율과 계산법을 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">장기보유특별공제란</h2>
          <p>
            장기보유특별공제는 토지·건물 등을 <strong>3년 이상 보유</strong>한 경우 보유기간(과 거주기간)에
            따라 양도차익의 일정 비율을 공제해 주는 제도입니다. 공제는 양도차익에서 차감되어 과세표준을
            줄여 줍니다. 공제율표는 두 종류 — <strong>표1(일반)</strong>과 <strong>표2(1세대 1주택)</strong>로
            나뉩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 일반 부동산은 표1(최대 30%), 1세대 1주택은 표2(보유 최대 40% + 거주
              최대 40% = 최대 80%). 단, 표2는 2년 이상 거주가 전제입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">표1 — 일반 (보유기간만, 최대 30%)</h2>
          <p className="mb-2">
            토지·건물 및 1세대 1주택이 아닌 주택에 적용됩니다. 3년부터 6%, 이후 1년당 2%p씩 늘어
            15년 이상이면 30%입니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[320px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">보유기간</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">공제율</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['3년 이상 4년 미만', '6%'],
                  ['5년', '10%'],
                  ['7년', '14%'],
                  ['10년', '20%'],
                  ['12년', '24%'],
                  ['15년 이상', '30% (최대)'],
                ].map(([k, v]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{k}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">표2 — 1세대 1주택 (보유 + 거주, 최대 80%)</h2>
          <p className="mb-2">
            1세대 1주택으로서 <strong>2년 이상 거주</strong>한 경우 적용됩니다. 보유기간 공제율과
            거주기간 공제율을 <strong>합산</strong>합니다(각각 최대 40%, 합산 최대 80%).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[360px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">기간</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">보유 공제율</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">거주 공제율</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['2년', '—', '8%'],
                  ['3년', '12%', '12%'],
                  ['5년', '20%', '20%'],
                  ['7년', '28%', '28%'],
                  ['10년 이상', '40% (최대)', '40% (최대)'],
                ].map(([k, b, c]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{k}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{b}</td>
                    <td className="px-3 py-2 text-right font-bold text-blue-600">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            보유기간 공제율은 3년부터 연 4%, 거주기간 공제율은 2년(8%)부터 연 4%로 늘어 각각 10년에
            40%에 도달합니다. 거주 요건(2년)을 못 채우면 표2가 아니라 표1(최대 30%)이 적용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">계산 방법</h2>
          <p>
            장기보유특별공제액 = <strong>양도차익 × 공제율</strong>. 표2는 (보유 공제율 + 거주 공제율)을
            합쳐 적용합니다. 1세대 1주택 고가주택(12억 초과)은 12억 초과분에 해당하는 과세 양도차익에
            대해 공제율을 적용합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 일반 토지, 12년 보유 (표1)</p>
            <p>공제율 24%. 양도차익 2억이면 장특공 = 2억 × 24% = <strong>4,800만 원</strong> 공제.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 1세대 1주택, 10년 보유·10년 거주 (표2)</p>
            <p>보유 40% + 거주 40% = <strong>80%</strong>. 과세 양도차익 3억이면 2.4억 공제.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 1세대 1주택, 10년 보유했으나 거주 안 함</p>
            <p>
              거주 2년 요건 미충족 → 표2 적용 불가, 표1(보유 10년 = 20%) 적용. 거주 여부가 공제율을 크게
              바꿉니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 3년 미만 보유면 공제가 전혀 없나요?</p>
              <p>네. 장기보유특별공제는 3년 이상 보유부터 적용됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 표2는 거주를 안 해도 보유만으로 40% 받나요?</p>
              <p>표2 자체를 적용받으려면 2년 이상 거주가 전제입니다. 거주 요건을 못 채우면 표1(최대 30%)만 적용됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 비과세인 1세대 1주택도 장특공이 의미 있나요?</p>
              <p>양도가액 12억 이하 전액 비과세면 과세 차익이 없어 의미가 적지만, 12억 초과 고가주택은 과세분에 표2가 적용되어 세 부담이 크게 줄어듭니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 다주택자도 장특공을 받나요?</p>
              <p>일반 표1은 받을 수 있습니다. 다만 다주택자 양도세 중과 유예가 2026년 5월 9일 종료되어, 조정대상지역 주택을 양도하는 다주택자가 중과 대상이 되는 경우에는 장기보유특별공제가 배제됩니다. 해당 여부는 홈택스 모의계산으로 확인하세요.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 보유기간은 언제부터 계산하나요?</p>
              <p>원칙적으로 취득일부터 양도일까지입니다. 상속·증여로 취득한 경우 기산일이 달라질 수 있어 확인이 필요합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 미등기 양도도 공제되나요?</p>
              <p>미등기 양도자산은 장기보유특별공제 대상에서 제외됩니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/capital-gains-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 양도소득세 계산기</Link>
              <span className="text-slate-500"> · 취득·양도가액으로 예상 세액 계산</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/one-house-exemption" className="text-blue-700 hover:underline font-semibold">→ 1세대 1주택 양도세 비과세 요건 총정리</Link></li>
            <li><Link href="/guide/capital-gains-expenses" className="text-blue-700 hover:underline font-semibold">→ 양도세 필요경비, 인정되는 것과 안 되는 것</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제95조 (양도소득금액과 장기보유 특별공제액)</li>
            <li>국세청 「양도소득세 — 장기보유특별공제」 안내, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 공제율 적용은 자산 유형·
            보유 형태에 따라 달라질 수 있으므로, 실제 적용은 국세청 또는 세무 전문가의 안내를 함께
            참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
