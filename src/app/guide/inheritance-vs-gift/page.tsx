// src/app/guide/inheritance-vs-gift/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '상속세 vs 증여세, 뭐가 더 유리할까 (2026)',
  description:
    '세율은 같은데 결과는 다른 상속세와 증여세. 공제·과세방식·사전증여 합산의 차이와 어떤 상황에서 미리 증여하는 게 유리한지 사례로 정리했습니다.',
  alternates: { canonical: '/guide/inheritance-vs-gift' },
}

export default function InheritanceVsGiftGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">상속·증여</span>
          <span className="text-xs text-slate-400">약 8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          상속세 vs 증여세, 뭐가 더 유리할까
        </h1>
        <p className="text-slate-500">
          세율표는 똑같이 10~50%인데 왜 결과가 다를까요? 공제·과세방식·합산 규칙의 차이를 알면 어느 쪽이
          유리한지 판단할 수 있습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">세율은 같다, 차이는 「공제」와 「방식」</h2>
          <p>
            상속세와 증여세는 동일한 누진세율(10~50%)을 씁니다. 결과가 갈리는 이유는 ① 공제 한도가 다르고,
            ② 과세 단위가 다르며, ③ 합산 규칙이 다르기 때문입니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 상속은 「전체 유산」에 큰 공제(일괄 5억+배우자공제), 증여는 「받는 사람별」로
              작은 공제(10년 5,000만 등). 두 제도를 어떻게 조합하느냐가 절세의 핵심입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">한눈에 비교</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[420px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">구분</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">상속세</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">증여세</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['세율', '10~50%', '10~50% (동일)'],
                  ['과세방식', '유산 전체 기준(유산세)', '받는 사람별(유산취득세)'],
                  ['주요 공제', '일괄 5억 + 배우자공제 등', '10년 5,000만(성인 자녀) 등'],
                  ['발생 시점', '사망(상속 개시)', '생전 무상 이전'],
                  ['신고기한', '6개월 이내', '3개월 이내'],
                  ['지방소득세', '없음', '없음'],
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
          <h2 className="text-lg font-bold text-slate-800 mb-2">사전증여 합산 — 미리 줘도 다 분리되진 않는다</h2>
          <p>
            상속 개시 전 <strong>10년 이내(상속인) / 5년 이내(상속인 외)</strong>에 증여한 재산은 상속재산에
            <strong> 합산</strong>됩니다. 즉 사망 직전에 급히 증여하면 절세 효과가 없습니다. 분할 증여가
            의미 있으려면 충분히 일찍, 길게 나누어야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">언제 미리 증여가 유리한가</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>재산 규모가 커서 상속 시 높은 누진구간이 예상될 때 → 미리 분할 증여로 구간 분산</li>
            <li>부동산·주식 등 <strong>가치 상승이 예상되는 자산</strong> → 가치가 낮을 때 증여하면 상승분 절세</li>
            <li>자녀가 어려 10년 구간을 여러 번 쓸 시간이 있을 때</li>
          </ul>
          <p className="mt-3"><strong>반대로 상속이 유리한 경우</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>재산이 일괄공제(5억)+배우자공제 범위 안이라 상속세가 거의 안 나올 때</li>
            <li>증여 시 취득세 등 부대비용이 부담될 때</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 총재산 8억, 배우자+자녀</p>
            <p>일괄공제 5억 + 배우자공제로 상속세가 거의 발생하지 않음 → <strong>상속이 단순·유리</strong>.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 총재산 30억, 자녀 2명</p>
            <p>
              상속 시 높은 누진구간(40~50%) 진입. 미리 자녀별로 10년 단위 분할 증여하면 구간을 분산해 전체
              세 부담을 낮출 수 있음 → <strong>사전 증여 병행 유리</strong>.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 개발 예정 토지 (가치 상승 예상)</p>
            <p>가치가 오르기 전 일찍 증여하면 미래 상승분에 대한 세금까지 줄일 수 있음.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 세율이 같은데 왜 증여가 더 나올 수 있나요?</p>
              <p>상속은 일괄공제 5억 등 공제가 크고, 증여는 공제(10년 5,000만)가 작기 때문입니다. 그래서 소규모 재산은 상속이 유리한 경우가 많습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 죽기 직전에 증여하면 절세되나요?</p>
              <p>상속 전 10년(상속인) 이내 증여는 상속재산에 합산되어 효과가 없습니다. 일찍 시작해야 합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 증여하면 취득세도 내나요?</p>
              <p>부동산 증여 시 증여 취득세 등 부대비용이 발생합니다. 절세 효과와 함께 비용도 비교해야 합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 둘 중 하나만 골라야 하나요?</p>
              <p>아닙니다. 일찍부터 일부는 증여로 분산하고 나머지는 상속으로 받는 「병행 전략」이 일반적입니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/inheritance-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 상속세 계산기</Link>
              <span className="text-slate-500"> · 상속재산·공제 기준 예상 세액</span>
            </li>
            <li>
              <Link href="/gift-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 증여세 계산기</Link>
              <span className="text-slate-500"> · 증여금액·공제 기준 예상 세액</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/gift-split" className="text-blue-700 hover:underline font-semibold">→ 증여세 절세, 10년 단위 분할 증여</Link></li>
            <li><Link href="/guide/inheritance-renounce" className="text-blue-700 hover:underline font-semibold">→ 상속 포기·한정승인, 3개월 안에 결정하기</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>상속세 및 증여세법 제13조 (상속세 과세가액, 사전증여 합산), 제18조~제24조 (상속공제), 제53조 (증여재산공제)</li>
            <li>국세청 「상속세·증여세 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며, 어느 쪽이 유리한지는 재산 규모·구성·시점에 따라 크게 달라집니다.
            실제 의사결정은 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
