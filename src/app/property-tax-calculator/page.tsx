// app/property-tax-calculator/page.tsx
// ⚠️ metadata 필드(canonical/openGraph/verification 형식)는 기존 계산기 page.tsx 컨벤션에 맞춰 정렬할 것.

import type { Metadata } from "next";
import PropertyTaxCalculatorClient from "./PropertyTaxCalculatorClient";
import RelatedCalculators from "@/components/RelatedCalculators";
import { TAX_YEAR } from "./calc";

export const metadata: Metadata = {
  title: `재산세 계산기 | ${TAX_YEAR}년 주택 재산세·7월·9월 납부액 계산`,
  description: `주택 공시가격으로 ${TAX_YEAR}년 연간 재산세와 7월·9월 납부액을 계산합니다. 1세대 1주택 특례세율, 공정시장가액비율, 도시지역분, 지방교육세, 세부담상한을 반영합니다.`,
  alternates: { canonical: "https://taxsim.kr/property-tax-calculator" },
  openGraph: {
    title: `재산세 계산기 | ${TAX_YEAR}년 주택 재산세·7월·9월 납부액`,
    description:
      "공시가격만 입력하면 연간 재산세와 7월·9월 납부액을 계산합니다. 1세대 1주택 특례 반영.",
    url: "https://taxsim.kr/property-tax-calculator",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="px-4 py-10">
      <header className="mx-auto max-w-3xl mb-8">
        <h1 className="text-2xl font-bold tracking-tight">재산세 계산기</h1>
        <p className="mt-2 text-gray-600">
          주택 공시가격으로 {TAX_YEAR}년 연간 재산세와 7월·9월 납부액을 계산합니다. 1세대 1주택
          특례세율과 공정시장가액비율, 도시지역분, 지방교육세, 세부담상한을 반영합니다.
        </p>
      </header>

      <PropertyTaxCalculatorClient />

      {/* 가이드 내부링크 (가이드 배포 후 활성화) */}
      <div className="mx-auto max-w-3xl mt-8 text-sm">
        <a href="/guide/property-tax" className="text-blue-600 hover:underline">
          → {TAX_YEAR}년 재산세 계산 방법과 7월·9월 납부기간 가이드
        </a>
      </div>

      <div className="mx-auto max-w-3xl">
        <RelatedCalculators
          current="property-tax-calculator"
          items={[
            { href: "/capital-gains-tax-calculator", label: "양도소득세 계산기", emoji: "🏠" },
            { href: "/gift-tax-calculator", label: "증여세 계산기", emoji: "🎁" },
            { href: "/inheritance-tax-calculator", label: "상속세 계산기", emoji: "📋" },
          ]}
        />
      </div>
    </main>
  );
}
