import type { Metadata } from "next";
import CarTaxClient from "./CarTaxClient";
import RelatedCalculators from "@/components/RelatedCalculators";
import SourceNote from "@/components/SourceNote";
import { buildMetadata } from "@/lib/metadata";
import { CAR_TAX_YEAR } from "@/lib/tax/rules/car-tax";

export const metadata: Metadata = buildMetadata({
  title: "자동차세 계산기",
  description:
    "2026년 지방세법 기준 자동차세 계산기. 배기량·차령 경감·지방교육세·연납 공제를 구분해 계산합니다. 비영업용/영업용 승용차와 전기차, 승합·화물·특수자동차를 지원합니다.",
  path: "/car-tax-calculator",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "자동차세 계산기",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  url: "https://taxsim.kr/car-tax-calculator",
  description:
    "지방세법 제127조·제128조에 따른 자동차세와 지방교육세, 차령 경감액, 연납 공제액을 계산하는 무료 계산기입니다.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  inLanguage: "ko-KR",
};

export default function CarTaxCalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-8">
        <p className="text-xs font-medium text-slate-500">지방세 · {CAR_TAX_YEAR}년 기준</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">자동차세 계산기</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          「지방세법」 제127조의 표준세율을 적용해 자동차세 본세와 지방교육세, 차령 경감액, 연납 공제액을 나누어
          계산합니다. 과세기준일은 제1기분 6월 1일, 제2기분 12월 1일이며, 적용 연도는 {CAR_TAX_YEAR}년입니다.
        </p>
      </header>

      <CarTaxClient />

      <section className="mt-12 space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">계산에 적용한 기준</h2>

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
            연납 공제액은 고정 할인율이 아니라 <span className="font-mono text-xs">연세액 × (공제대상 일수 ÷ 365) × 5%</span>{" "}
            로 산출합니다. 공제대상 기간은 한꺼번에 납부하는 납부기한의 다음 날부터 12월 31일까지이며, {CAR_TAX_YEAR}년
            기준으로 1월 334일, 3월 275일, 6월 184일, 9월 92일입니다. 이자율 5%는 「지방세법 시행령」 제125조 제6항에
            따른 값입니다. 다만 6월·9월 연납은 공식 고지 방식을 확인하는 중이어서 계산을 제공하지 않습니다.
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
              · 잠정 제외: 6월·9월 연납. 「지방세법 시행령」 제125조 제3항이 6월분을 ‘제2기분에 해당하는 세액’으로
              규정하는데 이 계산기의 일수 비례 방식과 일치하는지 확인되지 않아, 확정 전까지 계산을 제공하지 않습니다.
            </li>
            <li>· 미확정: 연납 계산식의 분모가 윤년에 366일로 바뀌는지, 10원 미만 절사가 단계별인지 최종인지는 확인되지 않았습니다</li>
          </ul>
        </div>
      </section>

      <SourceNote calculator="car-tax-calculator" />

      <RelatedCalculators current="car-tax-calculator" />
    </main>
  );
}
