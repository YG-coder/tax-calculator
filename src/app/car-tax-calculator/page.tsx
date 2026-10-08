import type { Metadata } from "next";
import CarTaxClient from "./CarTaxClient";
import RelatedCalculators from "@/components/RelatedCalculators";
import SourceNote from "@/components/SourceNote";
import { buildMetadata } from "@/lib/metadata";
import { CAR_TAX_YEAR } from "@/lib/tax/rules/car-tax";
import { CALCULATOR_META } from "@/lib/content-registry";

const PAGE_TITLE = `자동차세 계산기 ${CAR_TAX_YEAR} · 배기량·연납 공제 계산`;
const PAGE_DESCRIPTION =
  "배기량과 최초 등록일로 예상 자동차세를 계산하세요. 지방교육세·차령 경감·연납 공제액을 구분하고, 전기차와 영업용 차량도 계산할 수 있습니다.";
const contentMeta = CALCULATOR_META["car-tax-calculator"];

export const metadata: Metadata = buildMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: "/car-tax-calculator",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "자동차세 계산기",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  url: "https://taxsim.kr/car-tax-calculator",
  description: PAGE_DESCRIPTION,
  dateModified: contentMeta.lastModified,
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko-KR",
};

export default function CarTaxCalculatorPage() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <header className="mb-8">
        <p className="text-xs font-medium text-slate-500">지방세 · {CAR_TAX_YEAR}년 기준</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">자동차세 계산기</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          내 차의 자동차세가 얼마인지 계산해 보세요. 차량 종류·배기량·최초 등록일을 입력하면 예상 세액과
          연납 공제액을 확인할 수 있습니다. 전기차와 영업용 차량도 차량 종류와 용도를 선택해 계산하세요.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          페이지 문구 수정일: <time dateTime={contentMeta.lastModified}>{contentMeta.lastModified}</time>
          {" · "}계산 기준 점검일: <time dateTime={contentMeta.lastReviewed}>{contentMeta.lastReviewed}</time>
        </p>
      </header>

      <CarTaxClient />

      <section className="mt-12 space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">자동차세는 어떤 기준으로 계산하나요?</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          「지방세법」 제127조의 표준세율을 적용해 자동차세 본세와 지방교육세, 차령 경감액, 연납 공제액을 나누어
          계산합니다. 과세기준일은 제1기분 6월 1일, 제2기분 12월 1일이며, 적용 연도는 {CAR_TAX_YEAR}년입니다.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">승용자동차 배기량별 cc당 세액</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-medium">
                    배기량
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    비영업용
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    영업용
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    1,000cc 이하
                  </th>
                  <td className="px-3 py-2 text-right">80원</td>
                  <td className="px-3 py-2 text-right">18원</td>
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    1,600cc 이하
                  </th>
                  <td className="px-3 py-2 text-right">140원</td>
                  <td className="px-3 py-2 text-right">18원</td>
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    2,000cc 이하
                  </th>
                  <td className="px-3 py-2 text-right">200원</td>
                  <td className="px-3 py-2 text-right">19원</td>
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    2,500cc 이하
                  </th>
                  <td className="px-3 py-2 text-right">200원</td>
                  <td className="px-3 py-2 text-right">19원</td>
                </tr>
                <tr>
                  <th scope="row" className="px-3 py-2 text-left font-normal">
                    2,500cc 초과
                  </th>
                  <td className="px-3 py-2 text-right">200원</td>
                  <td className="px-3 py-2 text-right">24원</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            비영업용은 1,600cc를 초과하면 배기량과 관계없이 cc당 200원입니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">차령 경감</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            차령이 3년 이상인 비영업용 승용자동차는 기분세액이 매년 5%씩 줄어들고, 차령 12년에서 50%로 상한에
            도달합니다. 기분세액은 <span className="font-mono text-xs">A/2 − (A/2 × 5/100) × (n − 2)</span> 로
            계산하며, A는 연세액, n은 차령(2 ≤ n ≤ 12)입니다. 전기차 등 배기량이 없는 승용자동차와 승합·화물·특수
            자동차는 차령 경감 대상이 아닙니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">연납 공제</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            연납 공제액은 고정 할인율이 아니라 「지방세법」 제128조 제3항의 계산식으로 산출합니다. 신청 시기마다
            계산식이 다릅니다. 이자율 5%는 「지방세법 시행령」 제125조 제6항에 따른 값입니다.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">신고납부기간</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">계산식 (법 제128조 제3항)</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">
                    {CAR_TAX_YEAR}년 연세액 대비
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['1월 16~31일', '연세액 × 334일 / 365일 × 5%', '약 4.58%'],
                  ['3월 16~31일', '연세액 × 275일 / 365일 × 5%', '약 3.77%'],
                  ['6월 16~30일', '제2기분 세액 × 5%', '2.50%'],
                  ['9월 16~30일', '제2기분 세액 × 92일 / 184일 × 5%', '1.25%'],
                ].map(([period, formula, rate]) => (
                  <tr key={period} className="bg-white">
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">{period}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{formula}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-blue-600">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            1월·3월 연납의 분모는 365일이며 윤년에는 366일입니다. 9월 연납의 분모 184일은 제2기분 과세기간(7월 1일 ~
            12월 31일)의 일수로 법에 고정되어 있습니다. 1월·3월·6월 연납은 연세액 전액을, 9월 연납은 제2기분
            (7~12월분)만 납부합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800">지원 범위와 제외 항목</h3>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600">
            <li>· 지원: 승용(비영업용·영업용), 전기·태양열·알코올 승용, 승합, 화물(적재정량 1만kg 이하), 특수자동차</li>
            <li>· 제외: 적재정량 1만kg 초과 화물자동차, 3륜 이하 소형자동차, 이륜자동차, 건설기계(덤프트럭·콘크리트믹서트럭)</li>
            <li>· 제외: 지방자치단체 조례에 따른 탄력세율(표준세율의 50% 범위 내 초과 적용)</li>
            <li>
              · 제외: 장애인·국가유공자 등 「지방세특례제한법」상 감면. 이는 취득세 감면과 별개이며, 요건 확인이 필요해
              계산에 반영하지 않습니다.
            </li>
            <li>· 일할계산: 신규등록·말소등록만 지원. 매매·증여에 따른 승계취득(법 제129조)은 미지원</li>
            <li>
              · 참고: 연세액이 10만원 이하이면 「지방세법」 제128조 제4항에 따라 지방자치단체가 제1기분을 부과할 때
              연세액 전액을 한 번에 부과·징수할 수 있습니다. 실제 고지 방식은 관할 지자체에 따라 다릅니다.
            </li>
            <li>· 미확정: 10원 미만 절사가 단계별인지 최종 세액 기준인지는 근거 조문을 특정하지 못했습니다</li>
          </ul>
        </div>
      </section>

      <SourceNote calculator="car-tax-calculator" />

      <RelatedCalculators current="car-tax-calculator" />
    </main>
  );
}
