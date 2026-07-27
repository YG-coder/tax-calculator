// app/property-tax-calculator/calc.ts
// 2026년 주택 재산세 계산 엔진 (주택분 전용)
// 검증 완료: 공정시장가액비율 3분기 / 세율특례 9억 경계 / 세부담상한 항목별 처리 / null-vs-0

export const TAX_YEAR = 2026; // 연도 단일 소스. 메타데이터·본문·라벨이 이 값을 공유.

export interface PropertyTaxInput {
  publishedPrice: number;        // 공시가격 (원)
  isSingleHome: boolean;         // 1세대 1주택 여부
  ownershipRatio?: number;       // 소유지분율 (0~1), 기본 1
  applyUrbanArea: boolean;       // 도시지역분 적용 여부
  prevYearBaseTax?: number | null;   // 전년도 재산세 본세 (선택, 미입력 시 null)
  prevYearUrbanTax?: number | null;  // 전년도 도시지역분 (선택, 미입력 시 null)
}

export interface PropertyTaxResult {
  fmvRatio: number;
  taxBase: number;               // 주택 전체 과세표준 (지분 반영 전)
  rateType: "1주택 특례세율" | "일반세율";
  baseTax: number;               // 재산세 본세 (상한·지분 반영 후)
  urbanTax: number;              // 도시지역분 (상한·지분 반영 후)
  eduTax: number;                // 지방교육세 (지분 반영 후)
  annualTotal: number;
  july: number;
  sept: number;
  ceilingChecked: boolean;       // 전년도 세액을 입력해 상한을 검토했는가
  ceilingApplied: boolean;       // 실제로 상한에 걸려 제한됐는가
  ceilingRate: number;
  lumpSumEligible: boolean;      // 7월 일괄부과 가능(예상)
  ownershipRatio: number;
}

const ceilingRate = (price: number): number =>
  price <= 300_000_000 ? 1.05 : price <= 600_000_000 ? 1.1 : 1.3;

const fairMarketRatio = (isSingleHome: boolean, price: number): number => {
  if (!isSingleHome) return 0.6;
  if (price <= 300_000_000) return 0.43;
  if (price <= 600_000_000) return 0.44;
  return 0.45; // 6억 초과 (9억 초과 1주택 포함)
};

const standardTax = (base: number): number => {
  if (base <= 60_000_000) return base * 0.001;
  if (base <= 150_000_000) return 60_000 + (base - 60_000_000) * 0.0015;
  if (base <= 300_000_000) return 195_000 + (base - 150_000_000) * 0.0025;
  return 570_000 + (base - 300_000_000) * 0.004;
};

const specialTax = (base: number): number => {
  if (base <= 60_000_000) return base * 0.0005;
  if (base <= 150_000_000) return 30_000 + (base - 60_000_000) * 0.001;
  if (base <= 300_000_000) return 120_000 + (base - 150_000_000) * 0.002;
  return 420_000 + (base - 300_000_000) * 0.0035;
};

export function calcPropertyTax(input: PropertyTaxInput): PropertyTaxResult {
  const {
    publishedPrice,
    isSingleHome,
    ownershipRatio = 1,
    applyUrbanArea,
    prevYearBaseTax = null,
    prevYearUrbanTax = null,
  } = input;

  const ratio = fairMarketRatio(isSingleHome, publishedPrice);
  const taxBase = publishedPrice * ratio;

  // 세율특례는 1주택 AND 공시가격 9억 이하만. 9억 초과 1주택은 45%비율 + 일반세율.
  const useSpecialRate = isSingleHome && publishedPrice <= 900_000_000;
  const rawBaseTax = useSpecialRate ? specialTax(taxBase) : standardTax(taxBase);

  const cRate = ceilingRate(publishedPrice);

  // 세부담상한: 본세 / 도시지역분을 각각 독립적으로, 전년도 상당액 기준 처리.
  // 미입력(null)이면 상한 미검토. 0과 null을 구분하는 책임은 호출부에 있음.
  let baseTax = rawBaseTax;
  let baseCapped = false;
  if (prevYearBaseTax != null) {
    const cap = prevYearBaseTax * cRate;
    if (rawBaseTax > cap) {
      baseTax = cap;
      baseCapped = true;
    }
  }

  const rawUrban = applyUrbanArea ? taxBase * 0.0014 : 0;
  let urbanTax = rawUrban;
  let urbanCapped = false;
  if (applyUrbanArea && prevYearUrbanTax != null) {
    const cap = prevYearUrbanTax * cRate;
    if (rawUrban > cap) {
      urbanTax = cap;
      urbanCapped = true;
    }
  }

  // 지방교육세 = 확정(상한 적용 후) 본세 × 20%
  let eduTax = baseTax * 0.2;

  // 소유지분율: 전체 산정 후 최종 세액에 적용
  baseTax *= ownershipRatio;
  urbanTax *= ownershipRatio;
  eduTax *= ownershipRatio;

  const annualTotal = baseTax + urbanTax + eduTax;

  // 일괄부과 판정: 주택분 재산세(본세+도시지역분, 지방교육세 제외), 지분 반영 후
  const housingPropertyTax = baseTax + urbanTax;
  const lumpSumEligible = housingPropertyTax <= 200_000;

  const ceilingChecked =
    prevYearBaseTax != null || (applyUrbanArea && prevYearUrbanTax != null);

  return {
    fmvRatio: ratio,
    taxBase,
    rateType: useSpecialRate ? "1주택 특례세율" : "일반세율",
    baseTax,
    urbanTax,
    eduTax,
    annualTotal,
    july: lumpSumEligible ? annualTotal : annualTotal / 2,
    sept: lumpSumEligible ? 0 : annualTotal / 2,
    ceilingChecked,
    ceilingApplied: baseCapped || urbanCapped,
    ceilingRate: cRate,
    lumpSumEligible,
    ownershipRatio,
  };
}
