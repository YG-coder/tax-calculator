// src/app/guide/inheritance-renounce/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '상속 포기·한정승인, 3개월 안에 결정하기 (2026)',
  description:
    '빚이 더 많은 상속을 마주했을 때 선택지인 상속포기와 한정승인을 정리. 3개월 기한, 후순위 상속인 함정, 단순승인 간주, 특별한정승인까지 사례로 설명합니다.',
  alternates: { canonical: '/guide/inheritance-renounce' },
}

export default function InheritanceRenounceGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">상속</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          상속 포기·한정승인, 3개월 안에 결정하기
        </h1>
        <p className="text-slate-500">
          재산보다 빚이 많은 상속을 마주했다면 가만히 있으면 안 됩니다. 기한이 짧은 두 가지 선택지와
          빠지기 쉬운 함정을 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">상속은 빚도 물려받는다</h2>
          <p>
            상속은 재산뿐 아니라 <strong>채무도 함께 이전</strong>됩니다. 빚이 재산보다 많다면 그대로 두면
            상속인이 빚을 떠안게 됩니다. 이를 피하는 법적 장치가 <strong>상속포기</strong>와
            <strong> 한정승인</strong>입니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 상속개시(사망)를 안 날부터 <strong>3개월 이내</strong>에 가정법원에
              신청해야 합니다. 아무것도 안 하면 「단순승인」으로 빚까지 상속됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">상속포기 vs 한정승인</h2>
          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">상속포기</p>
              <p>
                상속을 <strong>전부 받지 않는</strong> 것. 재산도 빚도 일절 승계하지 않습니다. 명백히 빚이
                더 많을 때 선택합니다. 단, 본인이 포기하면 상속권이 다음 순위로 넘어갑니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">한정승인</p>
              <p>
                <strong>상속받은 재산 한도 내에서만</strong> 빚을 갚는 것. 재산과 빚 중 어느 쪽이 많은지
                불확실할 때 안전합니다. 상속재산으로 빚을 청산하고 남으면 받고, 모자라도 추가 부담은 없습니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">가장 흔한 함정 — 후순위 상속인</h2>
          <p>
            선순위 상속인(예: 자녀)이 모두 포기하면 상속권은 <strong>다음 순위(손자녀, 부모, 형제자매 등)로
            그대로 넘어갑니다.</strong> 자녀만 포기하고 안심하다가 손주나 형제에게 빚이 넘어가 다시 포기
            절차를 밟아야 하는 일이 흔합니다. 그래서 빚이 명백히 많다면 <strong>상속인 1명이 한정승인</strong>을
            하고 나머지가 포기하거나, 가족 전원이 함께 정리하는 방식이 자주 쓰입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">「단순승인」으로 간주되는 행동</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>3개월 기한 내에 아무 신청도 하지 않은 경우</li>
            <li>상속재산을 처분하거나 써버린 경우 (예금 인출·부동산 매각 등)</li>
            <li>상속재산을 숨기거나 한정승인 시 재산 목록을 고의로 누락한 경우</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            단순승인으로 간주되면 빚 전액을 떠안게 되므로, 결정 전에는 상속재산에 손대지 않는 것이 안전합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">나중에 빚을 알게 됐다면 — 특별한정승인</h2>
          <p>
            상속인이 중대한 과실 없이 빚이 재산을 초과하는 사실을 3개월 내에 몰랐다면, 그 사실을
            <strong> 안 날부터 3개월 이내</strong>에 「특별한정승인」을 신청할 수 있습니다. 뒤늦게 채무
            독촉장을 받은 경우의 구제 수단입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 빚이 명백히 더 많음</p>
            <p>자녀 전원 상속포기 → 단, 손주·부모 등 후순위로 넘어가니 가족 전원이 함께 정리해야 함.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 재산·빚 규모 불확실</p>
            <p>상속인 1명이 한정승인 → 상속재산 범위 내에서만 변제, 후순위로 빚이 넘어가는 것도 방지.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 3개월 지난 뒤 빚 발견</p>
            <p>중대한 과실 없이 몰랐다면 안 날부터 3개월 내 특별한정승인 신청 검토.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 어디에 신청하나요?</p>
              <p>피상속인의 마지막 주소지 관할 가정법원에 상속포기 또는 한정승인 심판을 청구합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 3개월은 언제부터 시작되나요?</p>
              <p>「상속개시를 안 날」부터입니다. 보통 사망을 안 날이지만, 본인이 상속인이 된 사실을 안 날로 보는 경우도 있습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 장례비나 보험금도 처분에 해당하나요?</p>
              <p>상속인 고유의 사망보험금은 상속재산과 별개로 보는 경우가 많습니다. 다만 상속재산을 함부로 쓰면 단순승인으로 간주될 수 있어 주의가 필요합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 한정승인을 하면 상속세는 어떻게 되나요?</p>
              <p>상속재산 범위 내 채무를 청산하는 구조라 과세표준 자체가 작아지는 경우가 많습니다. 구체적 계산은 전문가 확인이 필요합니다.</p>
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
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/inheritance-vs-gift" className="text-blue-700 hover:underline font-semibold">→ 상속세 vs 증여세, 뭐가 더 유리할까</Link></li>
            <li><Link href="/guide/gift-split" className="text-blue-700 hover:underline font-semibold">→ 증여세 절세, 10년 단위 분할 증여</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>민법 제1019조 (승인·포기의 기간), 제1028조 (한정승인), 제1041조 (포기의 방식)</li>
            <li>대한민국 법원 「상속포기·한정승인 안내」</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인 사정에 따라 적용이 달라질 수 있습니다. 기한이 매우 짧은
            절차이므로, 빚이 의심되면 신속히 법률 전문가의 도움을 받으시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
