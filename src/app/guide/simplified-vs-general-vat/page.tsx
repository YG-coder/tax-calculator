// src/app/guide/simplified-vs-general-vat/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '간이과세자 vs 일반과세자 차이와 전환 기준 (2026)',
  description:
    '간이과세자와 일반과세자의 매출 기준, 세율, 세금계산서 발급, 신고 횟수 차이를 한눈에 정리. 1억 400만원 기준, 전환 시점, 어느 쪽이 유리한지 사례로 설명합니다.',
  alternates: { canonical: '/guide/simplified-vs-general-vat' },
}

export default function SimplifiedVsGeneralVatGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">부가세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          간이과세자 vs 일반과세자, 차이와 전환 기준
        </h1>
        <p className="text-slate-500">
          개인사업자가 처음 마주하는 갈림길. 매출 기준, 세율, 세금계산서, 신고 횟수가 어떻게 다른지와
          내게 어느 쪽이 유리한지를 사례로 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">한 줄 요약</h2>
          <p>
            <strong>간이과세자</strong>는 매출 규모가 작은 사업자에게 적용되는 간소화된 부가세 제도이고,
            <strong> 일반과세자</strong>는 그 외 모든 사업자에게 적용되는 기본 제도입니다. 갈리는 기준은
            <strong> 직전 연도 공급대가(부가세 포함 매출) 1억 400만 원</strong>입니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 직전 연도 매출 1억 400만 원 미만 → 간이과세 대상,
              그 이상 → 일반과세. (단, 부동산임대업·과세유흥장소는 4,800만 원 기준)
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">핵심 차이 비교표</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[420px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">구분</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">간이과세자</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">일반과세자</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['적용 기준', '직전 매출 1억 400만 미만', '1억 400만 이상 또는 배제 업종'],
                  ['세율(실효)', '1.5~4% (업종별 부가가치율×10%)', '10%'],
                  ['매입세액공제', '매입액의 0.5%만', '매입세액 전액 공제'],
                  ['세금계산서 발급', '4,800만 미만은 불가', '발급 가능·의무'],
                  ['부가세 신고', '연 1회 (1월)', '연 2회 (1월·7월)'],
                  ['환급', '불가', '가능'],
                  ['납부 면제', '매출 4,800만 미만 시 면제', '없음'],
                ].map(([k, s, g]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 font-semibold text-slate-700">{k}</td>
                    <td className="px-3 py-2 text-slate-600">{s}</td>
                    <td className="px-3 py-2 text-slate-600">{g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">간이과세가 유리한 경우 / 불리한 경우</h2>
          <p className="mb-2"><strong>간이과세가 유리한 경우</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>최종 소비자(일반 고객)를 주로 상대하는 업종 — 미용실, 식당, 소매점, 학원 등</li>
            <li>매입(원가)이 적어 매입세액공제 받을 게 별로 없는 경우</li>
            <li>세금계산서를 발급할 일이 거의 없는 경우</li>
          </ul>
          <p className="mt-3 mb-2"><strong>일반과세가 유리한 경우</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>거래처(사업자)를 상대해 세금계산서 발급이 필요한 경우</li>
            <li>초기 인테리어·설비 투자 등 매입이 커서 환급을 받아야 하는 경우 (간이는 환급 불가)</li>
            <li>매입세액공제 규모가 큰 도소매·제조업</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">과세유형은 언제 어떻게 바뀌나</h2>
          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">자동 전환</p>
              <p>
                매출이 기준을 넘거나 밑돌면 다음 해 7월 1일에 과세유형이 자동으로 바뀝니다. 별도 신청
                없이 국세청이 직전 연도 매출을 보고 판정하며, 대상자에게는 사전 통지가 발송됩니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">간이과세 포기</p>
              <p>
                세금계산서 발급이나 환급이 필요해 일반과세를 택하고 싶다면 <strong>「간이과세 포기 신고」</strong>를
                할 수 있습니다. 단, 포기하면 이후 3년간 다시 간이과세로 돌아갈 수 없으므로 신중히 판단해야
                합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">전자세금계산서 의무</p>
              <p>
                직전 연도 공급가액 8,000만 원 이상인 개인사업자는 과세유형과 관계없이 전자세금계산서를
                의무 발급해야 합니다. 간이과세자라도 이 기준에 걸리면 발급·전송 의무가 생깁니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 동네 카페 (연 매출 6,000만)</p>
            <p>
              주로 일반 손님을 상대하고 세금계산서 발급이 거의 없습니다. 매출 4,800만 원은 넘으니
              세금계산서 발급은 가능하지만, 간이과세(부가가치율 적용)로 부가세 부담이 일반과세보다
              훨씬 낮습니다. → <strong>간이과세 유리</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 신규 인테리어 후 개업한 식당 (초기 투자 1억)</p>
            <p>
              개업 시 설비·인테리어로 매입세액이 1,000만 원 발생했습니다. 일반과세자라면 이 매입세액을
              환급받을 수 있지만, 간이과세자는 환급이 불가능합니다. 초기 환급을 노린다면
              → <strong>일반과세 유리</strong> (간이과세 포기 신고 고려).
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. B2B 외주 디자인 사업자 (거래처 상대)</p>
            <p>
              거래처가 세금계산서를 요구합니다. 매출 4,800만 원 미만 간이과세자는 세금계산서를
              발급할 수 없어 거래에 지장이 생깁니다. → <strong>일반과세 또는 매출 4,800만 이상 간이</strong>가
              현실적입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 간이과세자도 부가세 신고를 해야 하나요?</p>
              <p>
                네. 매출 4,800만 원 미만이면 납부는 면제되지만 신고 의무는 남아 있습니다. 연 1회(1월)
                신고합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 처음 사업자 등록할 때 무엇으로 등록하나요?</p>
              <p>
                예상 매출이 1억 400만 원 미만이고 소비자 상대 업종이면 간이과세가 유리한 경우가 많습니다.
                다만 세금계산서 발급이나 초기 환급이 필요하면 일반과세를 선택할 수 있습니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 간이과세자가 세금계산서를 받으면 공제가 되나요?</p>
              <p>
                매입 시 받은 세금계산서·신용카드 매출전표 등에 대해 매입액(공급대가)의 0.5%만큼
                세액공제를 받습니다. 일반과세자처럼 매입세액 전액을 공제받지는 못합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 한 번 일반과세자가 되면 다시 간이로 못 돌아가나요?</p>
              <p>
                매출이 기준 아래로 떨어지면 다시 간이과세로 자동 전환될 수 있습니다. 단, 본인이
                간이과세 포기 신고를 한 경우에는 이후 3년간 간이과세 적용이 제한됩니다.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/vat-type-compare" className="text-blue-700 hover:underline font-semibold">→ 간이과세 vs 일반과세 비교</Link>
              <span className="text-slate-500"> · 내 조건에서 어느 유형이 유리한지 비교</span>
            </li>
            <li>
              <Link href="/vat-calculator" className="text-blue-700 hover:underline font-semibold">→ 부가세 계산기</Link>
              <span className="text-slate-500"> · 공급가액·부가세·총금액을 즉시 계산</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 종합소득세 계산기</Link>
              <span className="text-slate-500"> · 사업소득 예상 세액 확인</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/business-registration" className="text-blue-700 hover:underline font-semibold">→ 사업자등록 처음 하는 법</Link></li>
            <li><Link href="/guide/vat-filing" className="text-blue-700 hover:underline font-semibold">→ 부가세 신고 체크리스트 (개인사업자)</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>부가가치세법 제61조 (간이과세의 적용 범위), 부가가치세법 시행령 제109조</li>
            <li>국세청 「부가가치세 기본정보 — 일반·간이과세자」</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 실제 신고 및 과세유형
            선택은 국세청 홈택스 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
