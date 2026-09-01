/**
 * 종합부동산세(개인 주택분) 계산 로직 — UI와 분리된 순수 함수 모듈
 *
 * 근거 법령 (2026-09-01 국가법령정보센터 원문 확인)
 * - 「종합부동산세법」 [시행 2026. 1. 1.] [법률 제21224호, 2025. 12. 23., 일부개정]
 *   · 제8조 제1항 — 과세표준. 공시가격 합계 − 공제금액(1세대 1주택자 12억원 / 그 밖 9억원) × 공정시장가액비율
 *   · 제9조 제1항 — 주택분 세율 (2주택 이하 / 3주택 이상)
 *   · 제9조 제3항 — 주택분 재산세로 부과된 세액의 공제
 *   · 제9조 제5항~제9항 — 1세대 1주택자 세액공제 (연령별·보유기간별, 합계 100분의 80 한도)
 *   · 제10조 — 세부담의 상한 100분의 150
 *   · 제10조의2 — 공동명의 1주택자의 납세의무 등에 관한 특례
 *   · 제16조 — 납부기간 12월 1일 ~ 12월 15일
 * - 「종합부동산세법 시행령」 [시행 2026. 2. 27.] [대통령령 제36132호, 2026. 2. 27., 일부개정]
 *   · 제2조의4 제1항 — 주택분 공정시장가액비율 100분의 60
 *   · 제4조의3 제1항 — 주택분 종합부동산세액에서 공제되는 재산세액의 계산식
 * - 「농어촌특별세법」 제5조 제1항 제8호 — 종합부동산세액의 100분의 20
 *
 * 최근 점검일: 2026-09-01
 */

import {
  propertyFairMarketRatio,
  propertyStandardTax,
  propertySpecialTax,
  usesSpecialRate,
} from "./property-tax.ts";

export const CRET_TAX_YEAR = 2026;
export const CRET_LAST_REVIEWED = "2026-09-01";

/** 세율·공제표를 법령 원문으로 확인한 마지막 과세연도 */
export const LAST_VERIFIED_CRET_YEAR = 2026;

/** 「종합부동산세법 시행령」 제2조의4 제1항 — 주택분 공정시장가액비율 */
export const CRET_FAIR_MARKET_RATIO = 0.6;

/** 「종합부동산세법」 제8조 제1항 — 기본공제 */
export const BASIC_DEDUCTION_ONE_HOUSE = 1_200_000_000;
export const BASIC_DEDUCTION_GENERAL = 900_000_000;

/** 「종합부동산세법」 제9조 제5항 — 세액공제 합계 한도 */
export const TAX_CREDIT_CAP = 0.8;

/** 「종합부동산세법」 제10조 — 세부담 상한 */
export const TAX_BURDEN_CAP_RATE = 1.5;

/** 「농어촌특별세법」 제5조 제1항 제8호 */
export const RURAL_TAX_RATE = 0.2;

/** 「종합부동산세법」 제16조 제1항 */
export const CRET_PAYMENT_PERIOD = "12월 1일 ~ 12월 15일";

/* ------------------------------------------------------------------ */
/* 세율표 — 법 제9조 제1항                                              */
/* ------------------------------------------------------------------ */

export interface CretRateBracket {
  /** 이 구간의 상한 (이하). 마지막 구간은 Infinity */
  upTo: number;
  /** 누진 기초세액 */
  base: number;
  /** 초과분에 곱하는 세율 (1천분율을 소수로) */
  rate: number;
  /** 구간 하한 */
  from: number;
}

function brackets(rows: [number, number, number, number][]): CretRateBracket[] {
  return rows.map(([from, upTo, base, permille]) => ({ from, upTo, base, rate: permille / 1000 }));
}

/** 법 제9조 제1항 제1호 — 2주택 이하 */
const RATE_UP_TO_2_HOUSES = brackets([
  [0, 300_000_000, 0, 5],
  [300_000_000, 600_000_000, 1_500_000, 7],
  [600_000_000, 1_200_000_000, 3_600_000, 10],
  [1_200_000_000, 2_500_000_000, 9_600_000, 13],
  [2_500_000_000, 5_000_000_000, 26_500_000, 15],
  [5_000_000_000, 9_400_000_000, 64_000_000, 20],
  [9_400_000_000, Infinity, 152_000_000, 27],
]);

/** 법 제9조 제1항 제2호 — 3주택 이상 */
const RATE_3_HOUSES_OR_MORE = brackets([
  [0, 300_000_000, 0, 5],
  [300_000_000, 600_000_000, 1_500_000, 7],
  [600_000_000, 1_200_000_000, 3_600_000, 10],
  [1_200_000_000, 2_500_000_000, 9_600_000, 20],
  [2_500_000_000, 5_000_000_000, 35_600_000, 30],
  [5_000_000_000, 9_400_000_000, 110_600_000, 40],
  [9_400_000_000, Infinity, 286_600_000, 50],
]);

export function cretRateTable(houseCount: number): CretRateBracket[] {
  return houseCount >= 3 ? RATE_3_HOUSES_OR_MORE : RATE_UP_TO_2_HOUSES;
}

export function cretTaxByTable(taxBase: number, table: CretRateBracket[]): number {
  if (taxBase <= 0) return 0;
  for (const b of table) {
    if (taxBase <= b.upTo) return b.base + (taxBase - b.from) * b.rate;
  }
  const last = table[table.length - 1];
  return last.base + (taxBase - last.from) * last.rate;
}

/** 적용된 한계세율 (표시용) */
export function cretMarginalRate(taxBase: number, table: CretRateBracket[]): number {
  for (const b of table) {
    if (taxBase <= b.upTo) return b.rate;
  }
  return table[table.length - 1].rate;
}

/* ------------------------------------------------------------------ */
/* 세액공제표 — 법 제9조 제6항·제8항                                     */
/* ------------------------------------------------------------------ */

export interface CreditRow {
  from: number;
  /** 백분율 정수 (부동소수점 오차 방지) */
  percent: number;
  label: string;
}

/** 법 제9조 제6항 — 연령별 공제율 */
export const AGE_CREDIT_TABLE: CreditRow[] = [
  { from: 60, percent: 20, label: "만 60세 이상 만 65세 미만" },
  { from: 65, percent: 30, label: "만 65세 이상 만 70세 미만" },
  { from: 70, percent: 40, label: "만 70세 이상" },
];

/** 법 제9조 제8항 — 보유기간별 공제율 */
export const HOLDING_CREDIT_TABLE: CreditRow[] = [
  { from: 5, percent: 20, label: "5년 이상 10년 미만" },
  { from: 10, percent: 40, label: "10년 이상 15년 미만" },
  { from: 15, percent: 50, label: "15년 이상" },
];

export function lookupCreditPercent(table: CreditRow[], value: number): { percent: number; label: string } {
  let hit = { percent: 0, label: "해당 없음" };
  for (const row of table) {
    if (value >= row.from) hit = { percent: row.percent, label: row.label };
  }
  return hit;
}

/* ------------------------------------------------------------------ */
/* 입출력                                                               */
/* ------------------------------------------------------------------ */

/** 소유 형태 */
export type OwnershipType =
  /** 단독 소유 */
  | "sole"
  /** 배우자와 공동명의 1주택 */
  | "spouseJoint";

export interface CretInput {
  year?: number;
  /** 주택 전체의 공시가격 합계 (지분 반영 전) */
  publishedPriceTotal: number;
  ownershipType: OwnershipType;
  /** 공동명의일 때 본인 지분율 (0 초과 1 이하) */
  ownershipRatio?: number;
  /** 「종합부동산세법」 제10조의2 공동명의 1주택자 특례를 신청했는지 */
  applyJointOneHouseSpecial?: boolean;
  /** 1세대 1주택자인지 (단독 소유 기준) */
  isOneHouseOneHousehold?: boolean;
  /** 납세의무자가 소유한 주택 수 — 세율표 선택 (2주택 이하 / 3주택 이상) */
  houseCount?: number;
  /** 과세기준일(6월 1일) 현재 만 나이 */
  age?: number | null;
  /** 과세기준일 현재 보유기간 (년) */
  holdingYears?: number | null;
  /** 실제 부과된 주택분 재산세 본세. 미입력이면 표준·특례세율로 계산한 값을 쓴다. */
  propertyTaxPaid?: number | null;
  /** 직전년도 주택에 대한 총세액상당액 (재산세 + 종부세). 미입력이면 세부담 상한을 검토하지 않는다. */
  prevYearTotalTax?: number | null;
  /** 확인된 마지막 연도 이후 과세연도에 같은 규칙을 가정하고 계산할지 */
  assumeLatestRules?: boolean;
}

export interface CretStep {
  label: string;
  expression: string;
  value: string;
}

export interface CretSuccess {
  ok: true;
  status: "confirmed" | "verificationRequired";
  verificationNotes: string[];
  year: number;

  /** 실제로 1세대 1주택자로 보아 계산했는지 */
  treatedAsOneHouse: boolean;
  /** 납세의무자에게 귀속되는 공시가격 */
  publishedPrice: number;
  ownershipRatio: number;
  basicDeduction: number;
  /** 공시가격 − 공제 (0 미만이면 0) */
  afterDeduction: number;
  fairMarketRatio: number;
  taxBase: number;
  marginalRate: number;
  rateTableLabel: string;
  /** 세율 적용 결과 */
  grossTax: number;
  /** 재산세 중복분 공제 */
  propertyTaxCredit: {
    /** 재산세 공정시장가액비율 */
    fmvRatio: number;
    /** 주택 전체 재산세 과세표준 */
    propertyTaxBase: number;
    /** 실제(또는 추정) 부과 재산세 본세 */
    leviedPropertyTax: number;
    /** 추정값인지 */
    estimated: boolean;
    /** 계산식의 분자 — 종부세 과세표준 × 재산세 공정시장가액비율에 표준세율 적용 */
    numerator: number;
    /** 계산식의 분모 — 주택 합산 재산세 표준세율 상당액 */
    denominator: number;
    amount: number;
  };
  /** 재산세 공제 후 산출세액 */
  calculatedTax: number;
  taxCredits: {
    ageYears: number | null;
    agePercent: number;
    ageLabel: string;
    holdingYears: number | null;
    holdingPercent: number;
    holdingLabel: string;
    /** 합계 공제율 (80% 한도 적용 후) */
    appliedPercent: number;
    capped: boolean;
    amount: number;
  };
  /** 세액공제 후 세액 */
  afterCredits: number;
  burdenCap: {
    checked: boolean;
    applied: boolean;
    /** 직전년도 총세액상당액 */
    prevYearTotalTax: number | null;
    /** 한도 = 직전년도 총세액상당액 × 150% */
    limit: number | null;
    /** 당해 총세액상당액 (재산세 + 종부세) */
    currentTotal: number;
    /** 상한 초과로 제외된 세액 */
    excluded: number;
  };
  /** 납부할 종합부동산세 */
  comprehensiveTax: number;
  ruralTax: number;
  totalPayable: number;
  steps: CretStep[];
  notes: string[];
  unsupported: string[];
}

export interface CretFailure {
  ok: false;
  errors: string[];
}

export type CretResult = CretSuccess | CretFailure;

/* ------------------------------------------------------------------ */
/* 계산                                                                 */
/* ------------------------------------------------------------------ */

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;

/** 국고금 관리 관행에 따라 10원 미만을 절사한다. */
export function floorTo10(value: number): number {
  return Math.floor(value / 10) * 10;
}

export function calculateComprehensiveRealEstateTax(input: CretInput): CretResult {
  const errors: string[] = [];
  const notes: string[] = [];
  const unsupported: string[] = [];
  const verificationNotes: string[] = [];

  const year = input.year ?? CRET_TAX_YEAR;
  if (!Number.isSafeInteger(year) || year < 2005 || year > 2100) {
    return { ok: false, errors: ["과세연도가 올바르지 않습니다."] };
  }
  if (year > LAST_VERIFIED_CRET_YEAR) {
    if (input.assumeLatestRules !== true) {
      return {
        ok: false,
        errors: [
          `${year}년 종합부동산세의 세율·공제액은 확인되지 않았습니다. 이 계산기가 법령 원문으로 확인한 마지막 과세연도는 ${LAST_VERIFIED_CRET_YEAR}년입니다. ` +
            `${LAST_VERIFIED_CRET_YEAR}년 기준을 가정한 계산을 원하면 가정 계산을 선택해 주세요.`,
        ],
      };
    }
    verificationNotes.push(
      `${year}년 세율·공제액은 사용자가 선택한 가정 계산입니다. ${LAST_VERIFIED_CRET_YEAR}년 기준을 그대로 적용했으며, 이후 개정 여부는 확인되지 않았습니다.`,
    );
  }
  if (year < LAST_VERIFIED_CRET_YEAR) {
    return {
      ok: false,
      errors: [
        `${year}년 종합부동산세는 이 계산기에 등록되어 있지 않습니다. 공제액·공정시장가액비율·세율이 해마다 달라 과거 연도는 지원하지 않습니다.`,
      ],
    };
  }

  const price = input.publishedPriceTotal;
  if (typeof price !== "number" || !Number.isFinite(price) || !Number.isSafeInteger(price) || price < 0) {
    errors.push("공시가격 합계를 0 이상의 정수로 입력해 주세요.");
  }

  const isJoint = input.ownershipType === "spouseJoint";
  const ratioRaw = isJoint ? (input.ownershipRatio ?? 0.5) : 1;
  if (typeof ratioRaw !== "number" || !Number.isFinite(ratioRaw) || ratioRaw <= 0 || ratioRaw > 1) {
    errors.push("지분율은 0을 초과하고 1 이하인 값이어야 합니다.");
  }

  const houseCount = input.houseCount ?? 1;
  if (!Number.isSafeInteger(houseCount) || houseCount < 1 || houseCount > 100) {
    errors.push("주택 수는 1 이상의 정수로 입력해 주세요.");
  }

  const age = input.age ?? null;
  if (age !== null && (!Number.isFinite(age) || age < 0 || age > 130)) {
    errors.push("나이는 0에서 130 사이여야 합니다.");
  }
  const holdingYears = input.holdingYears ?? null;
  if (holdingYears !== null && (!Number.isFinite(holdingYears) || holdingYears < 0 || holdingYears > 130)) {
    errors.push("보유기간은 0에서 130 사이여야 합니다.");
  }

  const prevYearTotalTax = input.prevYearTotalTax ?? null;
  if (prevYearTotalTax !== null && (!Number.isFinite(prevYearTotalTax) || prevYearTotalTax < 0)) {
    errors.push("직전년도 총세액상당액은 0 이상이어야 합니다.");
  }
  const propertyTaxPaid = input.propertyTaxPaid ?? null;
  if (propertyTaxPaid !== null && (!Number.isFinite(propertyTaxPaid) || propertyTaxPaid < 0)) {
    errors.push("납부한 재산세는 0 이상이어야 합니다.");
  }

  const jointSpecial = isJoint && input.applyJointOneHouseSpecial === true;
  if (jointSpecial && houseCount > 1) {
    errors.push("공동명의 1주택자 특례는 1세대가 그 주택 외에 다른 주택을 소유하지 않은 경우에만 적용됩니다.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const ratio = ratioRaw;

  /*
   * ① 공시가격
   *
   * 공동명의는 원칙적으로 각자 지분만큼 납세의무를 진다(법 제7조 제1항).
   * 다만 법 제10조의2 특례를 신청하면 한 사람이 주택 전체에 대해 1세대 1주택자로 계산한다.
   */
  const publishedPrice = jointSpecial ? price : Math.round(price * ratio);

  const treatedAsOneHouse = jointSpecial || (!isJoint && input.isOneHouseOneHousehold === true);
  const basicDeduction = treatedAsOneHouse ? BASIC_DEDUCTION_ONE_HOUSE : BASIC_DEDUCTION_GENERAL;

  /* ② 과세표준 — 법 제8조 제1항, 영 제2조의4 제1항 */
  const afterDeduction = Math.max(0, publishedPrice - basicDeduction);
  const taxBase = Math.floor(afterDeduction * CRET_FAIR_MARKET_RATIO);

  /* ③ 세율 — 법 제9조 제1항 */
  const table = cretRateTable(houseCount);
  const rateTableLabel = houseCount >= 3 ? "3주택 이상 세율 (법 제9조 제1항 제2호)" : "2주택 이하 세율 (법 제9조 제1항 제1호)";
  const grossTax = Math.floor(cretTaxByTable(taxBase, table));
  const marginalRate = cretMarginalRate(taxBase, table);

  /*
   * ④ 재산세 중복분 공제 — 법 제9조 제3항, 영 제4조의3 제1항
   *
   *  공제액 = 주택분 재산세로 부과된 세액의 합계액
   *           × [ (종부세 과세표준 × 재산세 공정시장가액비율) 에 재산세 표준세율을 적용한 세액 ]
   *           ÷ [ 주택을 합산하여 재산세 표준세율로 계산한 재산세 상당액 ]
   */
  const propertyFmv = propertyFairMarketRatio(treatedAsOneHouse, publishedPrice);
  const propertyTaxBase = publishedPrice * propertyFmv;
  const denominator = propertyStandardTax(propertyTaxBase);
  const numerator = propertyStandardTax(taxBase * propertyFmv);

  const estimatedLevy = usesSpecialRate(treatedAsOneHouse, publishedPrice)
    ? propertySpecialTax(propertyTaxBase)
    : denominator;
  const leviedPropertyTax = propertyTaxPaid ?? estimatedLevy;

  const rawCredit = denominator > 0 ? (leviedPropertyTax * numerator) / denominator : 0;
  const propertyCreditAmount = Math.min(grossTax, Math.floor(rawCredit));

  const calculatedTax = Math.max(0, grossTax - propertyCreditAmount);

  /* ⑤ 1세대 1주택자 세액공제 — 법 제9조 제5항~제9항 */
  let agePercent = 0;
  let ageLabel = "해당 없음";
  let holdingPercent = 0;
  let holdingLabel = "해당 없음";

  if (treatedAsOneHouse) {
    if (age !== null) {
      const hit = lookupCreditPercent(AGE_CREDIT_TABLE, age);
      agePercent = hit.percent;
      ageLabel = hit.label;
    }
    if (holdingYears !== null) {
      const hit = lookupCreditPercent(HOLDING_CREDIT_TABLE, holdingYears);
      holdingPercent = hit.percent;
      holdingLabel = hit.label;
    }
  }

  const rawPercent = agePercent + holdingPercent;
  const capPercent = TAX_CREDIT_CAP * 100;
  const appliedPercent = Math.min(rawPercent, capPercent);
  const creditCapped = rawPercent > capPercent;
  const creditAmount = Math.floor((calculatedTax * appliedPercent) / 100);
  const afterCredits = Math.max(0, calculatedTax - creditAmount);

  /* ⑥ 세부담 상한 — 법 제10조 */
  const currentTotal = leviedPropertyTax + afterCredits;
  let burdenExcluded = 0;
  let burdenApplied = false;
  const burdenLimit = prevYearTotalTax !== null ? prevYearTotalTax * TAX_BURDEN_CAP_RATE : null;
  if (burdenLimit !== null && currentTotal > burdenLimit) {
    burdenExcluded = Math.min(afterCredits, Math.floor(currentTotal - burdenLimit));
    burdenApplied = burdenExcluded > 0;
  }

  const comprehensiveTax = floorTo10(Math.max(0, afterCredits - burdenExcluded));
  const ruralTax = floorTo10(comprehensiveTax * RURAL_TAX_RATE);
  const totalPayable = comprehensiveTax + ruralTax;

  /* 계산 과정 */
  const steps: CretStep[] = [
    {
      label: "① 공시가격 합계",
      expression: jointSpecial
        ? "공동명의 1주택자 특례 — 주택 전체 공시가격으로 계산 (법 제10조의2 제3항)"
        : isJoint
          ? `주택 전체 ${won(price)} × 본인 지분 ${(ratio * 100).toFixed(1)}%`
          : "납세의무자가 소유한 주택의 공시가격 합계",
      value: won(publishedPrice),
    },
    {
      label: "② 공제금액",
      expression: treatedAsOneHouse
        ? "1세대 1주택자 12억원 (법 제8조 제1항 제1호)"
        : "그 밖의 납세의무자 9억원 (법 제8조 제1항 제3호)",
      value: `−${won(basicDeduction)}`,
    },
    {
      label: "③ 과세표준",
      expression: `(공시가격 − 공제금액) × 공정시장가액비율 ${(CRET_FAIR_MARKET_RATIO * 100).toFixed(0)}% (영 제2조의4 제1항)`,
      value: won(taxBase),
    },
    {
      label: "④ 세율 적용",
      expression: `${rateTableLabel} — 한계세율 1천분의 ${(marginalRate * 1000).toFixed(0)}`,
      value: won(grossTax),
    },
    {
      label: "⑤ 재산세 중복분 공제",
      expression:
        `재산세 부과세액 ${won(leviedPropertyTax)} × ${won(numerator)} ÷ ${won(denominator)} (영 제4조의3 제1항)` +
        (propertyTaxPaid === null ? " · 재산세는 표준·특례세율로 추정" : ""),
      value: `−${won(propertyCreditAmount)}`,
    },
    {
      label: "⑥ 산출세액",
      expression: "세율 적용액 − 재산세 중복분",
      value: won(calculatedTax),
    },
    {
      label: "⑦ 세액공제",
      expression: treatedAsOneHouse
        ? `연령 ${agePercent}% (${ageLabel}) + 보유 ${holdingPercent}% (${holdingLabel}) = ${appliedPercent}%` +
          (creditCapped ? ` — 합계 80% 한도 적용 (법 제9조 제5항)` : "")
        : "1세대 1주택자만 적용됩니다 (법 제9조 제5항)",
      value: `−${won(creditAmount)}`,
    },
    {
      label: "⑧ 세부담 상한",
      expression:
        burdenLimit === null
          ? "직전년도 총세액상당액을 입력하지 않아 검토하지 않았습니다 (법 제10조)"
          : `직전년도 총세액상당액 ${won(prevYearTotalTax ?? 0)} × 150% = ${won(burdenLimit)} · 당해 총세액상당액 ${won(currentTotal)}`,
      value: burdenExcluded > 0 ? `−${won(burdenExcluded)}` : "해당 없음",
    },
    {
      label: "⑨ 종합부동산세",
      expression: "세액공제 후 세액 − 세부담 상한 초과분 (10원 미만 절사)",
      value: won(comprehensiveTax),
    },
    {
      label: "⑩ 농어촌특별세",
      expression: `종합부동산세 × 20% (「농어촌특별세법」 제5조 제1항 제8호)`,
      value: won(ruralTax),
    },
    {
      label: "⑪ 최종 예상 납부액",
      expression: `종합부동산세 + 농어촌특별세 · 납부기간 ${CRET_PAYMENT_PERIOD} (법 제16조)`,
      value: won(totalPayable),
    },
  ];

  /* 안내 */
  notes.push(
    "과세기준일은 6월 1일이며, 종합부동산세는 12월 1일부터 12월 15일까지 부과·징수합니다. (법 제16조 제1항)",
  );
  if (isJoint && !jointSpecial) {
    notes.push(
      "공동명의는 원칙적으로 각자 지분만큼 납세의무를 집니다. 부부 각각 9억원씩 공제받는 대신 고령자·장기보유 세액공제는 받을 수 없습니다.",
    );
    notes.push(
      "「종합부동산세법」 제10조의2의 공동명의 1주택자 특례를 신청하면 한 사람이 12억원 공제와 세액공제를 함께 적용받습니다. 어느 쪽이 유리한지는 두 방식을 모두 계산해 비교하세요. 신청기간은 9월 16일부터 9월 30일까지입니다.",
    );
  }
  if (jointSpecial) {
    notes.push(
      "공동명의 1주택자 특례를 적용해 주택 전체 공시가격을 기준으로 1세대 1주택자로 계산했습니다. 연령·보유기간은 특례를 신청한 납세의무자를 기준으로 판단합니다. (법 제10조의2, 영 제4조의5)",
    );
  }
  if (treatedAsOneHouse && age === null) {
    notes.push("과세기준일 현재 만 나이를 입력하면 연령별 세액공제를 반영합니다. (법 제9조 제6항)");
  }
  if (treatedAsOneHouse && holdingYears === null) {
    notes.push("과세기준일 현재 보유기간을 입력하면 장기보유 세액공제를 반영합니다. (법 제9조 제8항)");
  }
  if (propertyTaxPaid === null) {
    notes.push(
      "재산세 중복분은 실제 고지된 재산세 대신 「지방세법」 제111조·제111조의2의 세율로 계산한 값을 썼습니다. 조례에 따른 가감조정 세율이나 재산세 세부담 상한이 적용된 경우에는 실제 재산세 본세를 입력해야 정확합니다.",
    );
  }
  if (burdenLimit === null) {
    notes.push(
      "직전년도에 부과된 재산세와 종합부동산세의 합계액을 입력하면 세부담 상한(150%) 초과분을 반영합니다. (법 제10조)",
    );
  }
  if (publishedPrice <= basicDeduction) {
    notes.push("공시가격이 공제금액 이하이므로 종합부동산세 납세의무가 없습니다.");
  }

  unsupported.push(
    "법인·법인으로 보는 단체의 주택분 (법 제9조 제2항의 27‰·50‰ 단일세율)",
    "종합합산토지분·별도합산토지분 (법 제13조·제14조)",
    "합산배제 임대주택·사원용 주택 등 (법 제8조 제2항)",
    "일시적 2주택·상속주택·지방 저가주택의 1세대 1주택자 판정 특례 (법 제8조 제4항) — 해당하면 1세대 1주택자로 선택해 계산하세요",
    "신탁주택, 부부 외 공동명의, 주택 수 계산 특례 (영 제4조의3 제3항)",
    "「지방세법」 제111조 제3항의 조례 가감조정 세율이 적용된 재산세",
  );

  const status: CretSuccess["status"] = verificationNotes.length > 0 ? "verificationRequired" : "confirmed";

  return {
    ok: true,
    status,
    verificationNotes,
    year,
    treatedAsOneHouse,
    publishedPrice,
    ownershipRatio: ratio,
    basicDeduction,
    afterDeduction,
    fairMarketRatio: CRET_FAIR_MARKET_RATIO,
    taxBase,
    marginalRate,
    rateTableLabel,
    grossTax,
    propertyTaxCredit: {
      fmvRatio: propertyFmv,
      propertyTaxBase,
      leviedPropertyTax,
      estimated: propertyTaxPaid === null,
      numerator,
      denominator,
      amount: propertyCreditAmount,
    },
    calculatedTax,
    taxCredits: {
      ageYears: age,
      agePercent,
      ageLabel,
      holdingYears,
      holdingPercent,
      holdingLabel,
      appliedPercent,
      capped: creditCapped,
      amount: creditAmount,
    },
    afterCredits,
    burdenCap: {
      checked: burdenLimit !== null,
      applied: burdenApplied,
      prevYearTotalTax,
      limit: burdenLimit,
      currentTotal,
      excluded: burdenExcluded,
    },
    comprehensiveTax,
    ruralTax,
    totalPayable,
    steps,
    notes,
    unsupported,
  };
}
