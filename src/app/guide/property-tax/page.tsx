// src/app/guide/property-tax/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '2026년 재산세 계산 방법과 7월·9월 납부기간',
  description:
    '주택 공시가격에서 시작하는 2026년 재산세 계산 구조를 공정시장가액비율, 1세대 1주택 특례세율, 도시지역분, 지방교육세, 세부담상한 순으로 정리하고 7월·9월 납부기간과 20만 원 일괄부과 기준까지 사례로 설명합니다.',
  alternates: { canonical: '/guide/property-tax' },
}

export default function PropertyTaxGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">재산세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          2026년 재산세 계산 방법과 7월·9월 납부기간
        </h1>
        <p className="text-slate-500">
          공시가격에서 최종 납부액까지, 주택 재산세가 어떻게 계산되는지 순서대로 정리했습니다.
          1세대 1주택 특례, 세부담상한, 7월·9월로 나뉘는 납부기간까지 핵심만 담았습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">재산세 계산의 큰 흐름</h2>
          <p>
            주택 재산세는 시세가 아니라 공시가격에서 출발합니다. 공시가격에 공정시장가액비율을 곱해
            과세표준을 구하고, 여기에 세율을 적용해 본세를 계산한 뒤 도시지역분과 지방교육세를 더합니다.
            마지막으로 전년 대비 급등을 막는 세부담상한을 적용합니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 공시가격 × 공정시장가액비율 = 과세표준 → 세율 적용 → 도시지역분·
              세부담상한 → 확정 본세의 20% 지방교육세. 주택분은 이 연간 세액을 7월과 9월에 절반씩 냅니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">과세기준일과 납세의무자</h2>
          <p>
            재산세 과세기준일은 매년 <strong>6월 1일</strong>입니다. 이날 현재 주택을 사실상 소유한
            사람이 그해 재산세 납세의무자가 됩니다. 따라서 6월 1일 전후로 주택을 매매하면 잔금 지급일,
            등기일 등 사실상 취득 시점에 따라 납세의무자가 달라질 수 있습니다. 구체적인 귀속은 매매계약과
            취득 시점을 기준으로 관할 지방자치단체에 확인하는 것이 안전합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">계산 순서 한눈에 보기</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>공시가격에 공정시장가액비율을 곱해 과세표준을 구합니다.</li>
            <li>과세표준에 세율을 적용해 재산세 본세를 계산합니다.</li>
            <li>도시지역에 있는 주택이면 도시지역분을 계산합니다.</li>
            <li>전년도 세액 대비 급등을 막는 세부담상한을 본세와 도시지역분에 <strong>각각</strong> 적용합니다.</li>
            <li>세부담상한 적용 후 확정된 본세의 20%를 지방교육세로 계산합니다.</li>
            <li>공동명의 등 지분 소유라면 마지막에 지분율을 반영합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">공정시장가액비율과 과세표준</h2>
          <p>
            과세표준은 공시가격에 그대로 세율을 곱하지 않고, 공정시장가액비율을 먼저 곱해 낮춘 금액입니다.
            2026년에도 1세대 1주택 특례 비율은 전년과 동일하게 유지됩니다.
          </p>
          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">일반 주택(다주택 포함)</p>
              <p>공정시장가액비율 <strong>60%</strong></p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">1세대 1주택</p>
              <p>
                공시가격 3억 원 이하 <strong>43%</strong>, 3억 원 초과 6억 원 이하 <strong>44%</strong>,
                6억 원 초과 <strong>45%</strong>. 이 특례 비율은 공시가격이 9억 원을 넘는 1주택에도 45%가
                적용됩니다.
              </p>
            </div>
          </div>
          <p className="mt-3">
            예를 들어 공시가격 5억 원인 1세대 1주택이라면 과세표준은 5억 원 × 44% = 2억 2,000만 원입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">세율과 1세대 1주택 특례세율</h2>
          <p>주택분 재산세 표준세율은 과세표준 구간별 누진 구조입니다.</p>
          <div className="rounded-xl border border-slate-100 p-4 mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 pr-3 font-semibold">과세표준</th>
                  <th className="py-2 pr-3 font-semibold">표준세율</th>
                  <th className="py-2 font-semibold">1주택 특례세율</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-50"><td className="py-2 pr-3">6,000만 원 이하</td><td className="py-2 pr-3">0.1%</td><td className="py-2">0.05%</td></tr>
                <tr className="border-b border-slate-50"><td className="py-2 pr-3">6,000만~1억 5,000만 원</td><td className="py-2 pr-3">6만 원 + 초과분 0.15%</td><td className="py-2">3만 원 + 초과분 0.1%</td></tr>
                <tr className="border-b border-slate-50"><td className="py-2 pr-3">1억 5,000만~3억 원</td><td className="py-2 pr-3">19만 5,000원 + 초과분 0.25%</td><td className="py-2">12만 원 + 초과분 0.2%</td></tr>
                <tr><td className="py-2 pr-3">3억 원 초과</td><td className="py-2 pr-3">57만 원 + 초과분 0.4%</td><td className="py-2">42만 원 + 초과분 0.35%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              ⚠️ <strong>주의:</strong> 세율을 0.05%포인트 낮춰주는 특례세율은 <strong>공시가격 9억 원 이하
              1세대 1주택</strong>에만 적용됩니다. 9억 원을 넘는 1주택은 공정시장가액비율 특례(45%)는 받지만
              세율은 표준세율을 적용받습니다. 같은 12억 원 주택이라도 1주택은 45% 비율 + 표준세율,
              다주택은 60% 비율 + 표준세율로 세액이 달라집니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">도시지역분과 지방교육세</h2>
          <p>
            도시지역에 있는 주택에는 과세표준의 <strong>0.14%</strong>가 재산세 도시지역분으로 추가됩니다.
            소재지가 부과 대상이 아니면 이 항목은 붙지 않습니다. 또한 재산세 본세에는 <strong>지방교육세</strong>가
            함께 부과되며, 세율은 세부담상한 적용 후 확정된 본세의 <strong>20%</strong>입니다. 도시지역분에는
            지방교육세가 부가되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">세부담상한</h2>
          <p>
            공시가격이 크게 올라도 재산세가 한꺼번에 급등하지 않도록, 전년도 세액 대비 일정 비율을 넘지
            못하게 하는 장치입니다. 주택은 공시가격 구간에 따라 상한율이 다릅니다.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>공시가격 3억 원 이하: 전년 세액의 <strong>105%</strong></li>
            <li>3억 원 초과 6억 원 이하: <strong>110%</strong></li>
            <li>6억 원 초과: <strong>130%</strong></li>
          </ul>
          <p className="mt-3">
            상한은 본세와 도시지역분을 <strong>각각</strong> 전년도 상당액을 기준으로 적용합니다. 두 항목을
            합쳐 한 번에 상한을 씌우는 것이 아니므로, 전년도 세액으로 확인할 때는 본세와 도시지역분을 따로
            보는 것이 정확합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">7월·9월 납부기간과 일괄부과</h2>
          <p>
            주택분 재산세는 연간 세액의 절반을 <strong>7월 16일~31일</strong>, 나머지 절반을
            <strong> 9월 16일~30일</strong>에 납부합니다. 다만 해당 연도에 부과할 주택분 재산세가
            20만 원 이하이면 지방자치단체 조례에 따라 7월에 한꺼번에 부과·징수할 수 있습니다. 이는 자동
            확정이 아니라 조례로 정하는 바에 따른 것이므로, 실제 고지 방식은 관할 지방자치단체에서 확인해야
            합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 공시가격 5억 원, 1세대 1주택, 도시지역</p>
            <p>
              과세표준 5억 × 44% = 2억 2,000만 원. 특례세율 적용 시 본세 약 26만 원, 도시지역분
              약 30만 8,000원, 지방교육세 약 5만 2,000원. 7월과 9월에 절반씩 납부합니다.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 같은 5억 원 주택을 부부 공동명의(각 50%)로 보유</p>
            <p>
              전체 세액을 계산한 뒤 각자 지분 50%만큼 나누어 부과됩니다. 본세 자체가 줄어드는 것은 아니며,
              개인이 부담하는 금액이 지분에 비례해 절반이 됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 공시가격은 어디서 확인하나요?</p>
              <p>국토교통부 부동산공시가격 알리미에서 확인합니다. 아파트·연립·다세대는 공동주택 공시가격, 단독주택은 표준 또는 개별주택 공시가격을 조회하면 됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 1세대 1주택 특례는 신청해야 하나요?</p>
              <p>별도 신청 없이 지방자치단체가 요건을 판단해 적용합니다. 다만 세대 기준으로 판정하므로, 세대원의 다른 주택 보유 여부에 따라 달라질 수 있어 고지서에서 적용 여부를 확인하는 것이 좋습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 재산세가 20만 원 이하면 무조건 7월에 한 번에 내나요?</p>
              <p>자동은 아닙니다. 20만 원 이하일 때 지방자치단체 조례로 정하는 바에 따라 7월에 일괄부과할 수 있는 것이므로, 실제 고지 방식은 관할 지자체 기준을 확인해야 합니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/property-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 재산세 계산기</Link>
              <span className="text-slate-500"> · 공시가격으로 7월·9월 납부액 계산</span>
            </li>
            <li>
              <Link href="/capital-gains-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 양도소득세 계산기</Link>
              <span className="text-slate-500"> · 주택 양도 시 예상 세액 계산</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/one-house-exemption" className="text-blue-700 hover:underline font-semibold">→ 1세대 1주택 양도세 비과세 요건 총정리</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>지방세법 제111조(세율), 제111조의2(1세대 1주택 세율 특례), 제112조(도시지역분), 제115조(납기), 제122조(세부담의 상한)</li>
            <li>지방세법 시행령 제109조(공정시장가액비율)</li>
            <li>국토교통부 부동산공시가격 알리미, 관할 지방자치단체 고지</li>
          </ul>
          <p className="mt-3">
            본 가이드는 주택분 재산세를 설명하기 위한 일반 안내입니다. 토지·건축물 등 주택 외 재산,
            지역자원시설세, 감면, 과세표준상한제, 지방자치단체 조례에 따른 조정은 반영하지 않았습니다.
            정확한 세액은 관할 지방자치단체 고지서를 기준으로 합니다.
          </p>
        </section>
      </article>
    </main>
  )
}
