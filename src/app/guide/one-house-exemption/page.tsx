// src/app/guide/one-house-exemption/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '1세대 1주택 양도세 비과세 요건 총정리 (12억 기준, 2026)',
  description:
    '1세대 1주택 양도소득세 비과세의 핵심 요건을 정리. 2년 보유·거주 요건, 양도가액 12억 기준, 고가주택 과세, 일시적 2주택 특례까지 사례로 설명합니다.',
  alternates: { canonical: '/guide/one-house-exemption' },
}

export default function OneHouseExemptionGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">양도소득세</span>
          <span className="text-xs text-slate-400">약 8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          1세대 1주택 양도세 비과세 요건 총정리
        </h1>
        <p className="text-slate-500">
          내 집을 팔 때 양도소득세를 안 내려면 어떤 조건을 갖춰야 할까요? 2년 요건, 12억 기준,
          일시적 2주택 특례까지 핵심만 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">비과세의 3가지 핵심 요건</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>1세대가 1주택을 보유</strong>할 것 (세대 기준)</li>
            <li><strong>2년 이상 보유</strong>할 것 (취득 당시 조정대상지역이면 2년 거주 요건 추가)</li>
            <li><strong>양도가액 12억 원 이하</strong>일 것 (초과분은 과세)</li>
          </ul>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 1세대 1주택 + 2년 보유(필요 시 거주) + 양도가액 12억 이하 →
              양도세 비과세. 12억을 넘으면 12억 초과분에 대해서만 과세됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">「1세대」와 「2년」을 정확히 이해하기</h2>
          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">1세대란?</p>
              <p>
                본인과 배우자, 같은 주소에서 생계를 함께하는 가족(직계존비속·형제자매 등)을 하나의
                세대로 봅니다. 부부는 각자 따로 살아도 동일 세대로 보므로, 부부 합산 1주택이어야 합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">2년 보유·거주</p>
              <p>
                보유기간은 취득일부터 양도일까지로 계산합니다. 취득 당시 조정대상지역이었다면 2년 보유에
                더해 <strong>2년 거주</strong> 요건이 추가됩니다. 비조정지역이면 거주 요건 없이 2년 보유만
                충족하면 됩니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">12억 초과 고가주택은 어떻게 과세되나</h2>
          <p>
            양도가액이 12억 원을 넘으면 전체가 과세되는 것이 아니라, <strong>12억 초과분에 해당하는
            양도차익만</strong> 과세됩니다. 즉 과세 대상 차익 = 전체 양도차익 × (양도가액 − 12억) ÷ 양도가액
            방식으로 안분합니다. 여기에 장기보유특별공제(보유·거주 기간에 따라 최대 80%)가 적용되어 실제
            세 부담은 더 줄어듭니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">일시적 2주택 특례</h2>
          <p>
            이사 등으로 잠깐 2주택이 되는 경우, 일정 기간 내 종전 주택을 팔면 1주택으로 보아 비과세를
            받을 수 있습니다. 일반적으로 새 집 취득일부터 <strong>3년 이내</strong> 종전 주택을 양도하고,
            종전 주택이 2년 보유 요건을 갖춘 경우입니다. 세부 기간·요건은 취득 시기와 지역에 따라
            달라지므로 반드시 확인이 필요합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 비조정지역 아파트, 3년 보유, 양도 9억</p>
            <p>1세대 1주택 + 2년 보유 충족, 양도가액 12억 이하 → <strong>전액 비과세</strong>.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 조정지역 취득 주택, 2년 보유했으나 거주 안 함</p>
            <p>
              취득 당시 조정대상지역이면 2년 거주 요건이 필요합니다. 거주를 안 했다면 비과세가 적용되지
              않아 → <strong>과세 대상</strong>이 될 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 1세대 1주택, 양도 15억 (고가주택)</p>
            <p>
              12억 이하분은 비과세, 12억 초과분(3억)에 해당하는 양도차익만 과세. 장기보유특별공제로
              과세 차익이 추가로 줄어듭니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 분양권·입주권도 주택 수에 포함되나요?</p>
              <p>2021년 이후 취득한 분양권은 주택 수에 포함될 수 있습니다. 취득 시기에 따라 다르므로 확인이 필요합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부모님과 함께 살면 세대가 합쳐지나요?</p>
              <p>
                생계를 같이하면 동일 세대로 볼 수 있습니다. 다만 일정 연령·소득 요건을 갖추면 별도 세대로
                인정되는 경우가 있으니 구체적 상황 확인이 필요합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 12억은 양도차익 기준인가요, 매도가 기준인가요?</p>
              <p>매도가(양도가액) 기준입니다. 차익이 아니라 판 금액이 12억을 넘는지로 고가주택 여부를 판단합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 비과세인데도 신고를 해야 하나요?</p>
              <p>고가주택(12억 초과)은 과세분이 있어 신고가 필요합니다. 전액 비과세라도 신고로 남겨두는 것이 안전합니다.</p>
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
            <li><Link href="/guide/income-tax-may" className="text-blue-700 hover:underline font-semibold">→ 5월 종합소득세 신고 가이드</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제89조 (비과세 양도소득), 제95조 (장기보유특별공제)</li>
            <li>소득세법 시행령 제154조 (1세대 1주택의 범위)</li>
            <li>국세청 「양도소득세 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며, 비과세 요건은 취득 시기·지역·세대 구성에 따라 크게 달라집니다.
            실제 적용은 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
