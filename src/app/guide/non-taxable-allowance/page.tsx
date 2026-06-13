// src/app/guide/non-taxable-allowance/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '비과세 수당 종류와 한도 — 식대·자가운전 등 (2026)',
  description:
    '근로소득 중 세금이 붙지 않는 비과세 수당의 종류와 한도를 국세청 기준으로 정리. 식대 월 20만원, 자가운전보조금, 출산·보육수당, 야간근로수당 등을 사례·FAQ와 함께 설명합니다.',
  alternates: { canonical: '/guide/non-taxable-allowance' },
}

export default function NonTaxableAllowanceGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">근로소득</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          비과세 수당 종류와 한도
        </h1>
        <p className="text-slate-500">
          급여 중 일부 항목은 세금이 붙지 않습니다. 비과세 한도를 알면 같은 연봉이라도 실수령액을 더
          정확히 이해할 수 있습니다. 국세청 기준으로 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">비과세 수당이란</h2>
          <p>
            근로소득 중 일정 요건과 한도 안에서 <strong>소득세가 과세되지 않는 항목</strong>을 비과세 수당이라
            합니다. 비과세분은 과세표준에서 제외되므로 원천징수세액과 연말정산 세액이 줄어듭니다. 한도를
            넘는 금액은 과세 대상이 됩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 비과세는 「항목」과 「한도」가 정해져 있습니다. 대표적으로 식대는
              월 20만 원까지 비과세이며, 초과분은 과세됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">대표 비과세 항목과 한도</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[360px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">항목</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">비과세 한도</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['식대 (현물 급식 미제공 시)', '월 20만 원'],
                  ['자가운전보조금 (본인 차량·업무용)', '월 20만 원'],
                  ['출산·6세 이하 보육수당', '월 20만 원'],
                  ['연구보조비·연구활동비 (교원·연구원 등)', '월 20만 원'],
                  ['생산직 근로자 야간근로수당 등', '연 240만 원'],
                  ['국외근로소득 (일반)', '월 100만 원'],
                  ['직무발명보상금', '연 700만 원'],
                ].map(([k, v]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{k}</td>
                    <td className="px-3 py-2 font-bold text-blue-600">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            이 밖에 일직·숙직료, 실비 변상적 여비, 4대보험의 사용자 부담분, 일정 요건의 사택 제공 이익 등도
            비과세로 다뤄집니다. 한도와 요건은 항목별로 다릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 헷갈리는 요건</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>식대:</strong> 회사가 현물(구내식당 등)로 식사를 제공하면 그 식사는 비과세지만, 식사를 제공받으면서 별도 식대까지 받으면 그 식대는 과세될 수 있습니다.</li>
            <li><strong>자가운전보조금:</strong> 본인 명의(또는 본인이 직접 운전하는) 차량을 업무에 사용하고, 실제 여비를 따로 받지 않을 때 월 20만 원까지 비과세입니다.</li>
            <li><strong>출산·보육수당:</strong> 6세 이하 자녀 보육과 관련해 받는 수당이 대상이며 월 20만 원까지입니다.</li>
            <li><strong>야간근로수당:</strong> 생산직 등 일정 직종·급여 요건을 갖춘 근로자에게 연 240만 원 한도로 적용됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 식대 월 25만 원 받는 직장인</p>
            <p>20만 원은 비과세, 초과 5만 원은 과세. 비과세 한도까지만 세금이 빠집니다.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 식대 20만 + 자가운전 20만 + 보육수당 20만</p>
            <p>요건을 모두 갖추면 월 60만 원이 비과세 → 과세표준이 줄어 원천징수·연말정산 세액 감소.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 회사 구내식당 이용 + 식대 10만 원 별도</p>
            <p>현물 식사를 제공받으면서 식대까지 받으면 그 식대는 과세될 수 있어 주의가 필요합니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 비과세 수당은 4대보험에서도 빠지나요?</p>
              <p>세금(소득세)과 4대보험 기준은 별개입니다. 일부 항목은 보험료 산정 기준에서도 제외되지만 항목별로 다르므로 확인이 필요합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 비과세 한도를 넘으면 어떻게 되나요?</p>
              <p>한도 초과분은 과세 대상 급여로 합산됩니다. 예를 들어 식대 25만 원 중 5만 원은 과세됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 식대 비과세는 언제 20만 원으로 올랐나요?</p>
              <p>식대 비과세 한도는 2023년부터 월 10만 원에서 20만 원으로 상향되었습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 배우자 명의 차량도 자가운전보조금 비과세인가요?</p>
              <p>본인이 직접 운전·업무 사용하는 요건을 따집니다. 명의·사용 요건을 충족하는지 회사 규정과 함께 확인해야 합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 비과세가 많으면 무조건 이득인가요?</p>
              <p>당장의 세금은 줄지만, 항목에 따라 퇴직금·일부 보험 급여 산정 기준에 영향을 줄 수 있어 종합적으로 봐야 합니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/withholding-calculator" className="text-blue-700 hover:underline font-semibold">→ 원천징수세액 계산기</Link>
              <span className="text-slate-500"> · 월 급여 기준 예상 원천징수 확인</span>
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
            <li><Link href="/guide/withholding-year-end" className="text-blue-700 hover:underline font-semibold">→ 원천징수와 연말정산은 어떻게 연결되나</Link></li>
            <li><Link href="/guide/income-tax-may" className="text-blue-700 hover:underline font-semibold">→ 5월 종합소득세 신고 가이드</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제12조 (비과세소득), 소득세법 시행령 제17조의2·제18조</li>
            <li>국세청 「근로소득 비과세 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 비과세 한도·요건은 개정될 수
            있고 항목별로 다르므로, 실제 적용은 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
