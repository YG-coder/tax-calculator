// src/app/guide/capital-gains-expenses/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '양도세 필요경비, 인정되는 것과 안 되는 것 (2026)',
  description:
    '양도소득세 계산 시 필요경비로 인정되는 자본적 지출과 인정되지 않는 수익적 지출을 국세청 기준으로 구분. 증빙 요건과 실제 사례, FAQ까지 정리했습니다.',
  alternates: { canonical: '/guide/capital-gains-expenses' },
}

export default function CapitalGainsExpensesGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">양도소득세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          양도세 필요경비, 인정되는 것과 안 되는 것
        </h1>
        <p className="text-slate-500">
          양도차익을 줄이려면 필요경비를 빠짐없이 넣어야 합니다. 다만 모든 지출이 인정되는 건 아닙니다.
          국세청 기준으로 인정/불인정을 구분했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">필요경비란</h2>
          <p>
            양도차익은 <strong>양도가액 − 취득가액 − 필요경비</strong>로 계산합니다. 즉 필요경비가 클수록
            과세 대상 차익이 줄어듭니다. 필요경비는 크게 ① 취득가액에 더해지는 부대비용, ② 자산 가치를
            높이는 <strong>자본적 지출</strong>, ③ 양도 과정에서 든 비용으로 나뉩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 「자산의 가치를 높이거나 수명을 늘린 지출(자본적 지출)」은 인정,
              「원상 유지·수리(수익적 지출)」는 불인정이 기본 원칙입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">인정되는 필요경비</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>취득 부대비용:</strong> 취득세·등록면허세, 취득 시 중개수수료, 법무사 비용, 취득 관련 컨설팅·소송 비용</li>
            <li><strong>자본적 지출:</strong> 발코니(베란다) 확장, 샷시 교체, 난방시설(보일러) 교체, 방·욕실 증설, 토지 형질변경, 용도변경·개량 비용</li>
            <li><strong>양도비용:</strong> 양도 시 중개수수료, 양도소득세 신고서 작성 비용(세무대리 수수료), 매각 광고비, 국민주택채권 매각 차손</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">인정되지 않는 지출</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>수익적 지출(원상 유지·수리):</strong> 벽지·장판 교체, 도배, 외벽 도색, 싱크대·주방기구 단순 교체, 조명·콘센트 교체, 보일러 단순 수리, 하수도·타일 수리</li>
            <li><strong>보유 중 비용:</strong> 재산세·종합부동산세 등 보유세, 대출 이자, 관리비, 화재보험료</li>
            <li><strong>증빙 없는 지출:</strong> 적격증빙(세금계산서·계산서·카드·현금영수증)이나 금융거래 증빙이 없는 비용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">증빙이 핵심이다</h2>
          <p>
            자본적 지출이라도 <strong>적격증빙(세금계산서·계산서·신용카드·현금영수증) 또는 실제 지출을
            확인할 수 있는 금융거래 증빙</strong>이 있어야 인정됩니다. 공사 후 영수증을 챙기지 않으면
            나중에 비용 처리를 받기 어렵습니다. 계약서, 이체 내역, 시공 내역서를 함께 보관하세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 발코니 확장 + 샷시 교체 (1,200만)</p>
            <p>자산 가치를 높이는 자본적 지출 → <strong>필요경비 인정</strong>(세금계산서 등 증빙 보관 시).</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 도배·장판·페인트 (300만)</p>
            <p>원상 유지·미관 개선에 가까운 수익적 지출 → <strong>원칙적으로 불인정</strong>.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 취득세 + 중개수수료 (1,500만)</p>
            <p>취득 부대비용 → <strong>취득가액에 더해 필요경비로 인정</strong>.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 인테리어 비용은 무조건 경비로 인정되나요?</p>
              <p>아닙니다. 가치를 높인 자본적 지출(확장·증설 등)은 인정되지만, 도배·장판 같은 수익적 지출은 원칙적으로 인정되지 않습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 현금으로 지급한 공사비도 인정되나요?</p>
              <p>적격증빙이나 이체 내역 등 실제 지출 증빙이 있어야 합니다. 증빙이 없으면 인정받기 어렵습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 대출 이자도 필요경비인가요?</p>
              <p>아닙니다. 보유 중 발생한 이자, 보유세, 관리비는 필요경비로 인정되지 않습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 중개수수료는 취득·양도 둘 다 인정되나요?</p>
              <p>네. 취득 시 중개수수료는 취득 부대비용, 양도 시 중개수수료는 양도비용으로 각각 인정됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 양도세 신고를 세무사에게 맡긴 비용은요?</p>
              <p>양도소득세 신고서 작성 비용은 양도비용으로 필요경비에 포함할 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 증빙을 잃어버렸는데 추정으로 인정되나요?</p>
              <p>원칙적으로 증빙이 없으면 인정이 어렵습니다. 공사 계약서, 이체 내역 등 가능한 자료를 최대한 확보해야 합니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/capital-gains-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 양도소득세 계산기</Link>
              <span className="text-slate-500"> · 필요경비를 반영해 예상 세액 계산</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/long-term-holding-deduction" className="text-blue-700 hover:underline font-semibold">→ 장기보유특별공제 계산 방법</Link></li>
            <li><Link href="/guide/one-house-exemption" className="text-blue-700 hover:underline font-semibold">→ 1세대 1주택 양도세 비과세 요건 총정리</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제97조 (양도소득의 필요경비 계산), 소득세법 시행령 제163조 (양도자산의 필요경비)</li>
            <li>국세청 「양도소득세 필요경비 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 자본적·수익적 지출의
            구분은 사안에 따라 판단이 달라질 수 있으므로, 실제 적용은 국세청 또는 세무 전문가의 안내를
            함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
