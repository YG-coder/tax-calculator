/**
 * 자동차세(소유분) 계산 로직 — UI와 분리된 순수 함수 모듈
 *
 * 근거 법령
 * - 「지방세법」 제127조(과세표준과 세율)  [시행 2026. 1. 1.] [법률 제21308호, 2025. 12. 31., 일부개정]
 * - 「지방세법」 제128조(납기와 징수방법) — 제1항 기분·납기, 제3항 연납 공제 계산식, 제4항 소액 일시부과
 * - 「지방세법」 제130조(수시부과 시의 세액계산) — 일할계산, 2천원 미만 미징수
 * - 「지방세법 시행령」 제122조(영업용과 비영업용의 구분 및 차령 계산)
 * - 「지방세법 시행령」 제123조(자동차의 종류)
 * - 「지방세법 시행령」 제125조 제6항 — 연납 공제 이자율 100분의 5 (개정 2024. 12. 31.)
 *   [시행 2026. 7. 1.] [대통령령 제36445호, 2026. 6. 23., 타법개정]
 * - 지방교육세: 비영업용 승용자동차에 대한 자동차세액의 100분의 30
 *
 * 최근 점검일: 2026-09-01
 *   2026-09-01 법 제128조 제3항의 계산식 표 원문(국가법령정보센터)을 직접 확인해
 *   6월·9월 연납 계산식과 윤년 분모(366일)를 확정하고 계산을 활성화했다.
 */

export const CAR_TAX_YEAR = 2026;
export const CAR_TAX_LAST_REVIEWED = "2026-09-01";

/**
 * 연납 공제 이자율을 실제로 확인한 마지막 과세연도.
 * 이 연도를 넘어서면 같은 이자율을 쓰되 결과에 "검증 필요" 상태를 붙인다.
 * 시행령을 다시 확인하면 이 값을 올린다.
 */
export const LAST_VERIFIED_PREPAY_YEAR = 2026;

/**
 * 「지방세법 시행령」 제125조 제6항 — 연납 공제 이자율.
 *
 * 과세연도별로 관리한다. 2020. 12. 31. 신설 당시에는 연도별 표(2025년 이후 100분의 3)였으나,
 * 2024. 12. 31. 개정으로 연도 구분이 삭제되고 100분의 5 단일값이 되었다.
 * 현행: 지방세법 시행령 [시행 2026. 7. 1.] [대통령령 제36445호] 제125조 제6항
 *
 * 미래 연도에 시행령이 다시 개정되면 이 표를 갱신해야 한다.
 */
const PREPAY_INTEREST_RATE_BY_YEAR: { from: number; to: number; rate: number; basis: string }[] = [
  {
    from: 2021,
    to: 2022,
    rate: 0.1,
    basis: "영 제125조 제6항 제1호 (신설 2020. 12. 31.) — 2021년 및 2022년: 100분의 10",
  },
  {
    from: 2023,
    to: 2023,
    rate: 0.07,
    basis: "영 제125조 제6항 제2호 (신설 2020. 12. 31.) — 2023년: 100분의 7",
  },
  {
    from: 2024,
    to: 2024,
    rate: 0.05,
    basis: "영 제125조 제6항 제3호 (신설 2020. 12. 31.) — 2024년: 100분의 5",
  },
  {
    from: 2025,
    to: LAST_VERIFIED_PREPAY_YEAR,
    rate: 0.05,
    basis: "영 제125조 제6항 (개정 2024. 12. 31.) — 연도 구분을 삭제하고 100분의 5로 단일화",
  },
];

export function prepayInterestRate(
  year: number,
): { rate: number; basis: string; verified: boolean } | null {
  const row = PREPAY_INTEREST_RATE_BY_YEAR.find((r) => year >= r.from && year <= r.to);
  if (row) return { rate: row.rate, basis: row.basis, verified: true };
  if (year > LAST_VERIFIED_PREPAY_YEAR) {
    // 현행 시행령에 연도 제한은 없지만, 확인한 시점 이후의 개정 여부를 보증할 수 없다.
    const latest = PREPAY_INTEREST_RATE_BY_YEAR[PREPAY_INTEREST_RATE_BY_YEAR.length - 1];
    return { rate: latest.rate, basis: latest.basis, verified: false };
  }
  return null;
}

/**
 * 「지방세법」 제128조 제3항 계산식 — 2026-09-01 국가법령정보센터에서 원문(계산식 표)을 직접 확인했다.
 * [시행 2026. 1. 1.] [법률 제21308호, 2025. 12. 31., 일부개정]
 *
 * | 신고납부기간        | 계산식                                                                  |
 * |---------------------|-------------------------------------------------------------------------|
 * | 1/16~1/31, 3/16~3/31 | 연세액 × (납부기한 다음 날 ~ 12/31 일수) / 365(윤년 366) × 이자율        |
 * | 6/16~6/30            | 제2기분 세액 × 이자율                                                   |
 * | 9/16~9/30            | 제2기분 세액 × (납부기한 다음 날 ~ 12/31 일수) / 184 × 이자율            |
 *
 * 공제액은 「과세기간 경과분을 차감한 연세액」의 100분의 10을 넘지 못한다(법 §128③ 본문).
 * 「과세기간 경과분을 차감한 연세액」의 범위는 영 제125조 제3항이 정한다.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 1월·3월 연납 계산식의 분모 — 365일, 윤년은 366일 (법 §128③ 계산식) */
export function prepayDayBase(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/** 9월 연납 계산식의 분모 — 제2기분 기간(7월 1일 ~ 12월 31일)의 일수 184일로 법에 고정되어 있다 */
export const SECOND_HALF_DAY_BASE = 184;

/** 법 §128③ 본문 — 공제액 상한 100분의 10 */
export const PREPAY_DEDUCTION_CAP_RATE = 0.1;

/** 법 §128④ — 연세액이 이 금액 이하이면 제1기분 부과 시 전액을 부과·징수할 수 있다 */
export const LUMP_SUM_LEVY_THRESHOLD = 100_000;
/** 지방교육세율 — 비영업용 승용자동차 자동차세액의 30% */
export const EDUCATION_TAX_RATE = 0.3;
/** 「지방세법」 제127조 제1항 제2호 — 차령 1년당 경감률 */
export const AGE_DISCOUNT_PER_YEAR = 0.05;
/** 경감이 시작되는 차령 */
export const AGE_DISCOUNT_START = 3;
/** 차령 상한 (12년 초과는 12년으로 봄) → 최대 경감률 50% */
export const AGE_CAP = 12;
/** 「지방세법」 제130조 제4항 — 일할계산 세액이 2천원 미만이면 징수하지 않음 */
export const MIN_LEVY = 2000;

/** 입력 상한 — 비정상 입력 차단용 */
export const MAX_CC = 30_000;
export const MAX_LOAD_KG = 10_000;

export type Usage = "nonBusiness" | "business";

export type VehicleType =
  /** 승용자동차 (배기량 과세) — 법 제127조 제1항 제1호·제2호 */
  | "passenger"
  /** 그 밖의 승용자동차 (전기·태양열·알코올) — 법 제127조 제1항 제3호, 영 제123조 제2호 */
  | "otherPassenger"
  /** 승합자동차 — 법 제127조 제1항 제4호 */
  | "van"
  /** 화물자동차 — 법 제127조 제1항 제5호 */
  | "truck"
  /** 특수자동차 — 법 제127조 제1항 제6호 */
  | "special";

export type VanClass =
  | "highwayBus" // 고속버스
  | "largeCharterBus" // 대형전세버스
  | "smallCharterBus" // 소형전세버스
  | "largeRegularBus" // 대형일반버스
  | "smallRegularBus"; // 소형일반버스

export type SpecialClass = "large" | "small";

/** 연납 신청 시기. 각 값의 납부기한이 공제대상 기간의 기산점이 된다. */
export type PrepayTiming = "none" | "jan" | "mar" | "jun" | "sep";

export type TaxPeriod = "year" | "first" | "second";

export interface CarTaxInput {
  year?: number;
  usage: Usage;
  vehicleType: VehicleType;
  /** 승용자동차만 사용 */
  displacementCc?: number | null;
  /** 승합자동차만 사용 */
  vanClass?: VanClass | null;
  /** 화물자동차만 사용 (적재정량 kg) */
  loadCapacityKg?: number | null;
  /** 특수자동차만 사용 */
  specialClass?: SpecialClass | null;
  /** 최초 등록일 "YYYY-MM-DD" — 차령 기산일 */
  firstRegistrationDate?: string | null;
  period?: TaxPeriod;
  prepay?: PrepayTiming;
  /**
   * 일할계산 사유. 「지방세법」 제130조 제1항.
   * - newRegistration: 신규등록 → 등록일 ~ 기분 말일
   * - deregistration:  말소등록 → 기분 초일 ~ 말소등록일
   * 승계취득(양도·양수, 법 제129조)은 양도인/양수인 귀속일 경계를 공식 자료로 확정하지 못해 지원하지 않는다.
   * 연납과는 함께 계산하지 않는다.
   */
  prorate?: { kind: "newRegistration" | "deregistration"; date: string } | null;
  /**
   * 이미 납부한 금액 (자동차세 + 지방교육세 합계).
   * 말소등록 일할계산 시 환급 예상액을 산출하는 데만 쓴다.
   * 연납으로 납부한 경우 연납 공제 후 실제 납부액을 입력한다.
   */
  alreadyPaid?: number | null;
  /**
   * 연납 공제 이자율을 확인한 마지막 연도(LAST_VERIFIED_PREPAY_YEAR) 이후의 과세연도에 대해
   * 마지막 확인값을 가정하고 계산할지 여부.
   * 기본값은 false이며, 이 경우 해당 연도의 연납 계산은 거부한다.
   */
  assumeLatestPrepayRate?: boolean;
}

export interface HalfBreakdown {
  half: 1 | 2;
  /** 비영업용 승용자동차(배기량 과세)만 값이 있다. 그 외에는 null */
  vehicleAge: number | null;
  /** 0 ~ 0.5 */
  ageDiscountRate: number;
  /** 경감 전 기분세액 (연세액 ÷ 2) */
  baseHalfTax: number;
  /** 차령 경감액 */
  ageReduction: number;
  /** 일할계산 정보 (해당 시) */
  prorate: { usedDays: number; totalDays: number } | null;
  /** 일할계산 전 자동차세 기분세액 (10원 미만 절사) */
  carTaxBeforeProrate: number;
  /** 일할계산 전 지방교육세 기분세액 (10원 미만 절사) */
  educationTaxBeforeProrate: number;
  /** 10원 미만 절사 후 자동차세 기분세액 */
  carTax: number;
  /** 10원 미만 절사 후 지방교육세 기분세액 */
  educationTax: number;
  /** 제130조 제4항에 따라 2천원 미만으로 미징수 처리된 경우 */
  belowMinLevy: boolean;
}

/** 법 §128③ 계산식이 공제 기준으로 삼는 세액의 범위 */
export type PrepayDeductionBase = "annual" | "secondHalf";

export interface PrepayBreakdown {
  timing: Exclude<PrepayTiming, "none">;
  /** 연납 납부기한 */
  dueDate: string;
  /** 공제대상 기간 (납부기한 다음 날 ~ 12월 31일) */
  deductiblePeriod: { from: string; to: string; days: number };
  /** 법 §128③ 계산식의 공제 기준 세액 — 1·3월은 연세액, 6·9월은 제2기분 세액 */
  deductionBase: PrepayDeductionBase;
  /** 공제 기준 세액의 표시용 이름 */
  deductionBaseLabel: string;
  /** 계산식의 분모. 6월 연납은 일수 비례가 없어 null */
  dayBase: number | null;
  /** 해당 과세연도에 적용된 이자율 */
  interestRate: number;
  /** 이자율의 근거 (시행령 개정 이력) */
  interestRateBasis: string;
  /** 공제 기준 세액 대비 실효 공제율 (= 계산식에서 이자율에 곱해지는 비율 × 이자율) */
  effectiveRate: number;
  /** 연납으로 실제 납부하는 세액의 범위 — 9월 연납은 제2기분만 납부한다 */
  payableScope: "annual" | "secondHalf";
  /** 연납으로 납부하는 세액 (공제 전, 자동차세 + 지방교육세) */
  payableBeforeDeduction: number;
  /** 연납 대상 납부세액 대비 실효 공제율 */
  effectiveRateOnPayable: number;
  /** 화면 표시용 계산식 */
  formula: string;
  /** 법 §128③ 본문의 100분의 10 상한에 걸렸는지 */
  capApplied: boolean;
  carTaxDeduction: number;
  educationTaxDeduction: number;
  totalDeduction: number;
}

export interface CalcStep {
  label: string;
  expression: string;
  value: string;
}

export type ResultStatus = "confirmed" | "verificationRequired";

export interface RefundBreakdown {
  /** 환급 산정 범위. period 선택과 무관하게 항상 연간 기준이다. */
  scope: "annual";
  /** 연간 일할계산 후 실제 부담액 — 환급 산정의 기준 */
  annualProratedTax: number;
  /** 사용자가 입력한 연간 기납부액 */
  alreadyPaid: number;
  /** 연간 기납부액 − 연간 일할 후 부담액. 음수면 추가 납부 */
  estimatedRefund: number;
}

export interface ProrationInfo {
  kind: "newRegistration" | "deregistration";
  date: string;
  /** 연간 일할 전 부담액 (자동차세 + 지방교육세) */
  annualTax: number;
  /** 연간 일할 후 부담액 */
  annualProratedTax: number;
  /** 화면에 선택된 기분의 일할 전 세액 */
  periodTax: number;
  /** 화면에 선택된 기분의 일할 후 세액 */
  periodProratedTax: number;
}

export interface CarTaxSuccess {
  ok: true;
  /**
   * confirmed: 공식 근거로 확인된 계산만 사용한 결과
   * verificationRequired: 근거를 확정하지 못한 규칙이 결과에 섞여 있어 대조가 필요한 상태
   */
  status: ResultStatus;
  /** status가 verificationRequired인 이유 */
  verificationNotes: string[];
  /** 일할계산이 적용된 경우의 공통 정보. 신규등록·말소등록 모두 값이 있다. */
  proration: ProrationInfo | null;
  /** 말소등록에서 기납부액이 있을 때만 산출되는 환급 정보 */
  refund: RefundBreakdown | null;
  year: number;
  period: TaxPeriod;
  /** 법 제127조 제1항 제1호·제3호~제6호에 따른 연세액 (차령 경감 전) */
  annualBaseTax: number;
  /** 승용자동차의 cc당 세액 (그 외 차종은 null) */
  ccRate: number | null;
  /** 적용된 세율 설명 */
  rateLabel: string;
  halves: HalfBreakdown[];
  /** 차령 경감 후 자동차세 합계 */
  carTax: number;
  /** 지방교육세 합계 */
  educationTax: number;
  /** 차령 경감액 합계 */
  ageReduction: number;
  /** 표시용 차령 경감률 (기분 경감률의 평균) */
  ageDiscountRate: number;
  /** 자동차세 + 지방교육세 (연납 공제 전) */
  subtotal: number;
  prepay: PrepayBreakdown | null;
  /** 연납 공제까지 반영한 최종 납부액 */
  finalPayable: number;
  steps: CalcStep[];
  notes: string[];
}

export interface CarTaxFailure {
  ok: false;
  errors: string[];
}

export type CarTaxResult = CarTaxSuccess | CarTaxFailure;

/* ------------------------------------------------------------------ */
/* 세율표 — 「지방세법」 제127조 제1항                                  */
/* ------------------------------------------------------------------ */

/** 제1호 승용자동차: 배기량 구간별 cc당 세액 */
const PASSENGER_CC_RATES: Record<Usage, { upTo: number; rate: number }[]> = {
  nonBusiness: [
    { upTo: 1000, rate: 80 },
    { upTo: 1600, rate: 140 },
    { upTo: Infinity, rate: 200 },
  ],
  business: [
    { upTo: 1000, rate: 18 },
    { upTo: 1600, rate: 18 },
    { upTo: 2000, rate: 19 },
    { upTo: 2500, rate: 19 },
    { upTo: Infinity, rate: 24 },
  ],
};

/** 제3호 그 밖의 승용자동차 (전기·태양열·알코올) */
const OTHER_PASSENGER_TAX: Record<Usage, number> = {
  business: 20_000,
  nonBusiness: 100_000,
};

/** 제4호 승합자동차. null = 해당 용도 구분에 세율이 규정되어 있지 않음 */
const VAN_TAX: Record<VanClass, Record<Usage, number | null>> = {
  highwayBus: { business: 100_000, nonBusiness: null },
  largeCharterBus: { business: 70_000, nonBusiness: null },
  smallCharterBus: { business: 50_000, nonBusiness: null },
  largeRegularBus: { business: 42_000, nonBusiness: 115_000 },
  smallRegularBus: { business: 25_000, nonBusiness: 65_000 },
};

/** 제5호 화물자동차 (적재정량 1만kg 이하 구간만 지원) */
const TRUCK_TAX: { upToKg: number; business: number; nonBusiness: number }[] = [
  { upToKg: 1_000, business: 6_600, nonBusiness: 28_500 },
  { upToKg: 2_000, business: 9_600, nonBusiness: 34_500 },
  { upToKg: 3_000, business: 13_500, nonBusiness: 48_000 },
  { upToKg: 4_000, business: 18_000, nonBusiness: 63_000 },
  { upToKg: 5_000, business: 22_500, nonBusiness: 79_500 },
  { upToKg: 8_000, business: 36_000, nonBusiness: 130_500 },
  { upToKg: 10_000, business: 45_000, nonBusiness: 157_500 },
];

/** 제6호 특수자동차 */
const SPECIAL_TAX: Record<SpecialClass, Record<Usage, number>> = {
  large: { business: 36_000, nonBusiness: 157_500 },
  small: { business: 13_500, nonBusiness: 58_500 },
};

/** 연납 신청 시기별 납부기한 (월, 일) — 법 제128조 제3항 각 호, 영 제125조 제3항 */
const PREPAY_DUE: Record<Exclude<PrepayTiming, "none">, { month: number; day: number; label: string }> = {
  jan: { month: 1, day: 31, label: "1월 (1월 16일 ~ 1월 31일)" },
  mar: { month: 3, day: 31, label: "3월 (3월 16일 ~ 3월 31일)" },
  jun: { month: 6, day: 30, label: "6월 (6월 16일 ~ 6월 30일)" },
  sep: { month: 9, day: 30, label: "9월 (9월 16일 ~ 9월 30일)" },
};

/**
 * 공식 근거를 확인하지 못해 계산을 제공하지 않는 연납 신청 시기.
 *
 * 2026-08-31 시점에는 6월·9월이 여기 있었다. 「지방세법」 제128조 제3항의 계산식이
 * 국가법령정보센터에 이미지로만 제공되어 원문을 읽지 못했기 때문이다.
 * 2026-09-01 원문(계산식 표)을 직접 확인해 6월·9월 계산식이 확정되었으므로 목록을 비웠다.
 *   · 6월: 제2기분 세액 × 이자율
 *   · 9월: 제2기분 세액 × (납부기한 다음 날 ~ 12/31 일수) / 184 × 이자율
 *
 * 앞으로 근거가 불확실한 시기가 다시 생기면 이 배열에 넣는다. 그러면 UI와 순수 함수 양쪽에서 거부된다.
 */
export const UNVERIFIED_PREPAY_TIMINGS: readonly PrepayTiming[] = [];

/** UNVERIFIED_PREPAY_TIMINGS 를 선택했을 때 돌려주는 거부 사유 */
export const UNVERIFIED_PREPAY_REASON =
  "이 신청 시기의 연납 계산식은 공식 근거를 확인하는 중이어서 계산을 제공하지 않습니다. " +
  "위택스에서 고지액을 확인해 주세요.";

/** 해당 연납 신청 시기의 계산을 제공하는지 */
export function isPrepayTimingSupported(timing: PrepayTiming): boolean {
  return !UNVERIFIED_PREPAY_TIMINGS.includes(timing);
}

export const PREPAY_TIMING_LABELS: Record<PrepayTiming, string> = {
  none: "연납 신청 안 함",
  jan: PREPAY_DUE.jan.label,
  mar: PREPAY_DUE.mar.label,
  jun: PREPAY_DUE.jun.label,
  sep: PREPAY_DUE.sep.label,
};

export const VAN_CLASS_LABELS: Record<VanClass, string> = {
  highwayBus: "고속버스",
  largeCharterBus: "대형전세버스",
  smallCharterBus: "소형전세버스",
  largeRegularBus: "대형일반버스",
  smallRegularBus: "소형일반버스",
};

/* ------------------------------------------------------------------ */
/* 유틸                                                                */
/* ------------------------------------------------------------------ */

/** 10원 미만 절사 */
export function floorTo10(value: number): number {
  return Math.floor(value / 10) * 10;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "YYYY-MM-DD" 를 UTC 기준으로 파싱한다. 형식·존재하지 않는 날짜는 null */
export function parseDate(value: string): { y: number; m: number; d: number } | null {
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d };
}

function utc(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d);
}

/** 두 날짜 사이의 일수 (양끝 포함) */
function inclusiveDays(fromMs: number, toMs: number): number {
  if (toMs < fromMs) return 0;
  return Math.round((toMs - fromMs) / 86_400_000) + 1;
}

function isoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * 문자열 입력을 정수로 변환한다.
 * 지수 표기, 음수, 소수, 숫자 외 문자, 자릿수 초과를 모두 거부한다.
 */
export function parseIntegerInput(raw: string, max: number): { ok: true; value: number } | { ok: false; reason: string } {
  const text = raw.trim();
  if (text === "") return { ok: false, reason: "값을 입력해 주세요." };
  if (text.length > 12) return { ok: false, reason: "입력값이 너무 깁니다." };
  if (!/^\d+$/.test(text.replace(/,/g, ""))) {
    return { ok: false, reason: "숫자만 입력해 주세요. (음수·소수·지수 표기 불가)" };
  }
  const value = Number(text.replace(/,/g, ""));
  if (!Number.isSafeInteger(value)) return { ok: false, reason: "입력값이 올바르지 않습니다." };
  if (value <= 0) return { ok: false, reason: "0보다 큰 값을 입력해 주세요." };
  if (value > max) return { ok: false, reason: `${max.toLocaleString("ko-KR")} 이하로 입력해 주세요.` };
  return { ok: true, value };
}

/* ------------------------------------------------------------------ */
/* 차령 계산 — 「지방세법 시행령」 제122조                              */
/* ------------------------------------------------------------------ */

/**
 * 차령 기산일과 과세연도로 기분별 차령을 구한다.
 *
 * - 기산일이 1월 1일 ~ 6월 30일 사이: 제1기분·제2기분 모두 (과세연도 - 기산일 연도) + 1
 * - 기산일이 7월 1일 ~ 12월 31일 사이: 제1기분 (과세연도 - 기산일 연도),
 *                                     제2기분 (과세연도 - 기산일 연도) + 1
 */
export function vehicleAgeForHalf(registrationYear: number, registrationMonth: number, taxYear: number, half: 1 | 2): number {
  const firstHalfOrigin = registrationMonth <= 6;
  const diff = taxYear - registrationYear;
  if (firstHalfOrigin) return diff + 1;
  return half === 1 ? diff : diff + 1;
}

/**
 * 차령에 따른 경감률(%) — 정수. 차령 3년 미만은 0, 12년 초과는 12년으로 본다.
 *
 * 부동소수점 오차를 피하려고 백분율 정수로 다룬다.
 * 0.05 * 7 은 0.35000000000000003 이 되어 200,000원 기분세액이 129,999.99…원이 되고,
 * 10원 미만 절사에서 130,000원이 아니라 129,990원으로 잘리는 문제가 있었다.
 */
export function ageDiscountPercent(age: number): number {
  if (age < AGE_DISCOUNT_START) return 0;
  const capped = Math.min(age, AGE_CAP);
  return 5 * (capped - 2);
}

/** 차령에 따른 경감률 (0 ~ 0.5). 차령 3년 미만은 0 */
export function ageDiscountRate(age: number): number {
  return ageDiscountPercent(age) / 100;
}

/* ------------------------------------------------------------------ */
/* 연세액 (차령 경감 전)                                               */
/* ------------------------------------------------------------------ */

interface BaseTaxResult {
  annual: number;
  ccRate: number | null;
  rateLabel: string;
}

function passengerCcRate(usage: Usage, cc: number): number {
  const table = PASSENGER_CC_RATES[usage];
  for (const row of table) {
    if (cc <= row.upTo) return row.rate;
  }
  return table[table.length - 1].rate;
}

function computeBaseTax(input: CarTaxInput, errors: string[]): BaseTaxResult | null {
  const usage = input.usage;

  switch (input.vehicleType) {
    case "passenger": {
      const cc = input.displacementCc;
      if (typeof cc !== "number" || !Number.isSafeInteger(cc) || cc <= 0) {
        errors.push("배기량(cc)을 1 이상의 정수로 입력해 주세요.");
        return null;
      }
      if (cc > MAX_CC) {
        errors.push(`배기량은 ${MAX_CC.toLocaleString("ko-KR")}cc 이하로 입력해 주세요.`);
        return null;
      }
      const ccRate = passengerCcRate(usage, cc);
      return {
        annual: cc * ccRate,
        ccRate,
        rateLabel: `${usage === "business" ? "영업용" : "비영업용"} 승용 · ${cc.toLocaleString("ko-KR")}cc × ${ccRate}원/cc`,
      };
    }

    case "otherPassenger": {
      const annual = OTHER_PASSENGER_TAX[usage];
      return {
        annual,
        ccRate: null,
        rateLabel: `그 밖의 승용자동차(전기·태양열·알코올) ${usage === "business" ? "영업용" : "비영업용"} 정액 ${annual.toLocaleString("ko-KR")}원`,
      };
    }

    case "van": {
      const cls = input.vanClass;
      if (!cls || !(cls in VAN_TAX)) {
        errors.push("승합자동차 종류를 선택해 주세요.");
        return null;
      }
      const annual = VAN_TAX[cls][usage];
      if (annual === null) {
        errors.push(
          `${VAN_CLASS_LABELS[cls]}는 「지방세법」 제127조 제1항 제4호에 ${usage === "business" ? "영업용" : "비영업용"} 세율이 규정되어 있지 않습니다. 관할 지자체에 확인해 주세요.`,
        );
        return null;
      }
      return {
        annual,
        ccRate: null,
        rateLabel: `${VAN_CLASS_LABELS[cls]} ${usage === "business" ? "영업용" : "비영업용"} 정액 ${annual.toLocaleString("ko-KR")}원`,
      };
    }

    case "truck": {
      const kg = input.loadCapacityKg;
      if (typeof kg !== "number" || !Number.isSafeInteger(kg) || kg <= 0) {
        errors.push("적재정량(kg)을 1 이상의 정수로 입력해 주세요.");
        return null;
      }
      if (kg > MAX_LOAD_KG) {
        errors.push(
          "적재정량 1만kg 초과 화물자동차는 이 계산기에서 지원하지 않습니다. 「지방세법」 제127조 제1항 제5호 단서의 가산 방식은 관할 지자체 또는 위택스에서 확인해 주세요.",
        );
        return null;
      }
      const row = TRUCK_TAX.find((r) => kg <= r.upToKg);
      if (!row) {
        errors.push("적재정량 구간을 확인할 수 없습니다.");
        return null;
      }
      const annual = usage === "business" ? row.business : row.nonBusiness;
      return {
        annual,
        ccRate: null,
        rateLabel: `화물 ${usage === "business" ? "영업용" : "비영업용"} · 적재정량 ${row.upToKg.toLocaleString("ko-KR")}kg 이하 정액 ${annual.toLocaleString("ko-KR")}원`,
      };
    }

    case "special": {
      const cls = input.specialClass;
      if (cls !== "large" && cls !== "small") {
        errors.push("특수자동차 규모(대형/소형)를 선택해 주세요.");
        return null;
      }
      const annual = SPECIAL_TAX[cls][usage];
      return {
        annual,
        ccRate: null,
        rateLabel: `${cls === "large" ? "대형" : "소형"}특수자동차 ${usage === "business" ? "영업용" : "비영업용"} 정액 ${annual.toLocaleString("ko-KR")}원`,
      };
    }

    default:
      errors.push("지원하지 않는 차량 종류입니다.");
      return null;
  }
}

/** 지방교육세 부과 대상인지 — 비영업용 승용자동차(전기차 포함) */
function hasEducationTax(input: CarTaxInput): boolean {
  return input.usage === "nonBusiness" && (input.vehicleType === "passenger" || input.vehicleType === "otherPassenger");
}

/** 차령 경감 대상인지 — 「지방세법」 제127조 제1항 제2호: 제1호의 비영업용 승용자동차만 */
function hasAgeDiscount(input: CarTaxInput): boolean {
  return input.usage === "nonBusiness" && input.vehicleType === "passenger";
}

/* ------------------------------------------------------------------ */
/* 연납 공제                                                           */
/* ------------------------------------------------------------------ */

/** 연납 신청 시기별 공제대상 기간 (납부기한 다음 날 ~ 12월 31일) */
export function prepayDeductiblePeriod(
  year: number,
  timing: Exclude<PrepayTiming, "none">,
): { from: string; to: string; days: number; dueDate: string } {
  const due = PREPAY_DUE[timing];
  const dueMs = utc(year, due.month, due.day);
  const fromMs = dueMs + 86_400_000;
  const toMs = utc(year, 12, 31);
  return {
    dueDate: isoDate(dueMs),
    from: isoDate(fromMs),
    to: isoDate(toMs),
    days: inclusiveDays(fromMs, toMs),
  };
}

/* ------------------------------------------------------------------ */
/* 메인 계산                                                           */
/* ------------------------------------------------------------------ */

export function calculateCarTax(input: CarTaxInput): CarTaxResult {
  const errors: string[] = [];
  const notes: string[] = [];
  const year = input.year ?? CAR_TAX_YEAR;
  const period: TaxPeriod = input.period ?? "year";
  const prepayTiming: PrepayTiming = input.prepay ?? "none";

  if (!Number.isSafeInteger(year) || year < 2000 || year > 2100) {
    return { ok: false, errors: ["과세연도가 올바르지 않습니다."] };
  }

  // UI에서 비활성화했더라도 순수 함수를 직접 호출하는 경로가 남으므로 여기서도 거부한다.
  if (!isPrepayTimingSupported(prepayTiming)) {
    errors.push(UNVERIFIED_PREPAY_REASON);
  }

  const base = computeBaseTax(input, errors);
  if (!base) return { ok: false, errors };

  /* 차령 기산일 */
  let regYear: number | null = null;
  let regMonth: number | null = null;
  let regMs: number | null = null;

  if (input.firstRegistrationDate) {
    const parsed = parseDate(input.firstRegistrationDate);
    if (!parsed) {
      errors.push("최초 등록일 형식이 올바르지 않습니다. (YYYY-MM-DD)");
    } else if (parsed.y < 1950 || parsed.y > year) {
      errors.push(`최초 등록일은 1950년 이후, 과세연도(${year}년) 이내여야 합니다.`);
    } else {
      regYear = parsed.y;
      regMonth = parsed.m;
      regMs = utc(parsed.y, parsed.m, parsed.d);
    }
  } else if (hasAgeDiscount(input)) {
    errors.push("차령 경감 판단을 위해 최초 등록일을 입력해 주세요.");
  }

  /* 일할계산 — 법 제130조 제1항 */
  const proration = input.prorate ?? null;
  let prorateMs: number | null = null;
  if (proration) {
    const parsed = parseDate(proration.date);
    if (!parsed) {
      errors.push("일할계산 기준일 형식이 올바르지 않습니다. (YYYY-MM-DD)");
    } else if (parsed.y !== year) {
      errors.push(`일할계산 기준일은 과세연도(${year}년) 내의 날짜여야 합니다.`);
    } else {
      prorateMs = utc(parsed.y, parsed.m, parsed.d);
    }
    if (proration.kind === "newRegistration" && regMs !== null && prorateMs !== null && prorateMs !== regMs) {
      errors.push("신규등록 일할계산의 기준일은 최초 등록일과 같아야 합니다.");
    }
    if (prepayTiming !== "none") {
      errors.push("일할계산과 연납은 함께 계산하지 않습니다. 관할 지자체 고지 내용을 확인해 주세요.");
    }
  }

  /* alreadyPaid 검증 — 순수 함수를 직접 호출하는 경우에도 잘못된 값을 묵살하지 않는다 */
  const alreadyPaidRaw = input.alreadyPaid;
  let alreadyPaid: number | null = null;
  if (alreadyPaidRaw !== undefined && alreadyPaidRaw !== null) {
    if (typeof alreadyPaidRaw !== "number" || !Number.isFinite(alreadyPaidRaw)) {
      errors.push("기납부액은 숫자여야 합니다.");
    } else if (!Number.isSafeInteger(alreadyPaidRaw)) {
      errors.push("기납부액은 소수 없는 정수여야 합니다.");
    } else if (alreadyPaidRaw < 0) {
      errors.push("기납부액은 0 이상이어야 합니다.");
    } else if (proration === null || proration.kind !== "deregistration") {
      errors.push("기납부액은 말소등록 일할계산에서만 사용합니다.");
    } else {
      alreadyPaid = alreadyPaidRaw;
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  /* 기분별 계산 */
  const halfWindows: Record<1 | 2, { start: number; end: number }> = {
    1: { start: utc(year, 1, 1), end: utc(year, 6, 30) },
    2: { start: utc(year, 7, 1), end: utc(year, 12, 31) },
  };

  // period와 무관하게 항상 두 기분을 계산한다.
  // 화면 표시용 기분 결과와 환급 산정용 연간 부담액을 여기서 각각 파생한다.
  const allHalves: HalfBreakdown[] = ([1, 2] as (1 | 2)[]).map((half) => {
    const baseHalfTax = base.annual / 2;

    let age: number | null = null;
    let discountPercent = 0;
    if (hasAgeDiscount(input) && regYear !== null && regMonth !== null) {
      age = vehicleAgeForHalf(regYear, regMonth, year, half);
      discountPercent = ageDiscountPercent(age);
    }
    const discount = discountPercent / 100;

    // 법 §127①2: 각 기분세액 = A/2 − (A/2 × 5/100)(n − 2)
    // 백분율 정수로 곱한 뒤 100으로 나눠 부동소수점 오차를 없앤다.
    const afterAge = (baseHalfTax * (100 - discountPercent)) / 100;
    const ageReductionRaw = baseHalfTax - afterAge;

    let prorateInfo: { usedDays: number; totalDays: number } | null = null;
    let afterProrate = afterAge;

    if (proration && prorateMs !== null) {
      const win = halfWindows[half];
      const totalDays = inclusiveDays(win.start, win.end);
      let usedDays: number;
      if (proration.kind === "newRegistration") {
        // 등록일 ~ 기분 말일
        usedDays = prorateMs > win.end ? 0 : inclusiveDays(Math.max(prorateMs, win.start), win.end);
      } else {
        // 기분 초일 ~ 말소등록일
        usedDays = prorateMs < win.start ? 0 : inclusiveDays(win.start, Math.min(prorateMs, win.end));
      }
      prorateInfo = { usedDays, totalDays };
      afterProrate = (afterAge * usedDays) / totalDays;
    }

    const carTaxBeforeProrate = floorTo10(afterAge);
    const educationTaxBeforeProrate = hasEducationTax(input)
      ? floorTo10(carTaxBeforeProrate * EDUCATION_TAX_RATE)
      : 0;

    let carTax = floorTo10(afterProrate);
    let belowMinLevy = false;
    if (proration && carTax > 0 && carTax < MIN_LEVY) {
      belowMinLevy = true;
      carTax = 0;
    }

    const educationTax = hasEducationTax(input) ? floorTo10(carTax * EDUCATION_TAX_RATE) : 0;

    return {
      half,
      vehicleAge: age,
      ageDiscountRate: discount,
      baseHalfTax,
      ageReduction: floorTo10(ageReductionRaw),
      prorate: prorateInfo,
      carTaxBeforeProrate,
      educationTaxBeforeProrate,
      carTax,
      educationTax,
      belowMinLevy,
    };
  });

  const targetHalves: (1 | 2)[] = period === "first" ? [1] : period === "second" ? [2] : [1, 2];
  const halves: HalfBreakdown[] = allHalves.filter((h) => targetHalves.includes(h.half));

  /** 법 §128③ 계산식이 말하는 "제2기분 세액" — 차령 경감 후 제2기분 세액 */
  const secondHalf = allHalves[1];

  const carTax = halves.reduce((sum, h) => sum + h.carTax, 0);
  const educationTax = halves.reduce((sum, h) => sum + h.educationTax, 0);
  const ageReduction = halves.reduce((sum, h) => sum + h.ageReduction, 0);
  const avgDiscount = halves.reduce((sum, h) => sum + h.ageDiscountRate, 0) / halves.length;
  const subtotal = carTax + educationTax;

  /* 연납 공제 — 연간 기준으로만 계산 */
  let prepay: PrepayBreakdown | null = null;
  let unverifiedPrepayYear = false;
  if (prepayTiming !== "none") {
    if (period !== "year") {
      notes.push("연납 공제는 연세액 기준으로만 계산되므로 과세기간을 ‘연간’으로 선택해야 표시됩니다.");
    } else {
      const p = prepayDeductiblePeriod(year, prepayTiming);
      const rateInfo = prepayInterestRate(year);
      if (!rateInfo) {
        return {
          ok: false,
          errors: [
            `${year}년의 연납 공제 이자율은 이 계산기에 등록되어 있지 않습니다. 「지방세법 시행령」 제125조 제6항을 확인해 주세요.`,
          ],
        };
      }
      if (!rateInfo.verified && input.assumeLatestPrepayRate !== true) {
        return {
          ok: false,
          errors: [
            `${year}년의 연납 공제 이자율은 확인되지 않았습니다. 이 계산기가 확인한 마지막 과세연도는 ${LAST_VERIFIED_PREPAY_YEAR}년입니다. ` +
              `「지방세법 시행령」 제125조 제6항의 개정 여부를 확인하거나, ${LAST_VERIFIED_PREPAY_YEAR}년 기준을 가정한 계산을 원하면 가정 계산을 선택해 주세요.`,
          ],
        };
      }
      if (!rateInfo.verified) {
        unverifiedPrepayYear = true;
      }

      const ratePct = `${(rateInfo.rate * 100).toFixed(0)}%`;
      const dayBaseForYear = prepayDayBase(year);

      /*
       * 법 §128③ 계산식 (2026-09-01 국가법령정보센터 원문 확인)
       *   1·3월: 연세액       × 일수/365(윤년 366) × 이자율
       *   6월  : 제2기분 세액 × 이자율
       *   9월  : 제2기분 세액 × 일수/184           × 이자율
       */
      let baseCarTax: number;
      let baseEducationTax: number;
      /** 계산식에서 이자율 앞에 곱해지는 기간 비율 */
      let periodRatio: number;
      let dayBase: number | null;
      let deductionBase: PrepayDeductionBase;
      let deductionBaseLabel: string;
      let payableScope: "annual" | "secondHalf";
      let formula: string;

      if (prepayTiming === "jan" || prepayTiming === "mar") {
        baseCarTax = carTax;
        baseEducationTax = educationTax;
        periodRatio = p.days / dayBaseForYear;
        dayBase = dayBaseForYear;
        deductionBase = "annual";
        deductionBaseLabel = "연세액";
        payableScope = "annual";
        formula = `연세액 × ${p.days}일 / ${dayBaseForYear}일 × ${ratePct}`;
      } else if (prepayTiming === "jun") {
        baseCarTax = secondHalf.carTax;
        baseEducationTax = secondHalf.educationTax;
        periodRatio = 1;
        dayBase = null;
        deductionBase = "secondHalf";
        deductionBaseLabel = "제2기분 세액";
        payableScope = "annual";
        formula = `제2기분 세액 × ${ratePct}`;
      } else {
        baseCarTax = secondHalf.carTax;
        baseEducationTax = secondHalf.educationTax;
        periodRatio = p.days / SECOND_HALF_DAY_BASE;
        dayBase = SECOND_HALF_DAY_BASE;
        deductionBase = "secondHalf";
        deductionBaseLabel = "제2기분 세액";
        payableScope = "secondHalf";
        formula = `제2기분 세액 × ${p.days}일 / ${SECOND_HALF_DAY_BASE}일 × ${ratePct}`;
      }

      // 법 §128③ 본문: 공제액은 「과세기간 경과분을 차감한 연세액」의 100분의 10을 넘지 못한다.
      // 그 금액은 계산식의 (기준 세액 × 기간 비율)과 같으므로, 비율로 비교하면 이자율 vs 10%가 된다.
      const capApplied = rateInfo.rate > PREPAY_DEDUCTION_CAP_RATE;
      const appliedRate = Math.min(rateInfo.rate, PREPAY_DEDUCTION_CAP_RATE);
      const factor = periodRatio * appliedRate;

      const carTaxDeduction = floorTo10(baseCarTax * factor);
      const educationTaxDeduction = floorTo10(baseEducationTax * factor);
      const totalDeduction = carTaxDeduction + educationTaxDeduction;

      const payableBeforeDeduction =
        payableScope === "annual" ? subtotal : secondHalf.carTax + secondHalf.educationTax;

      prepay = {
        timing: prepayTiming,
        interestRate: rateInfo.rate,
        interestRateBasis: rateInfo.basis,
        dueDate: p.dueDate,
        deductiblePeriod: { from: p.from, to: p.to, days: p.days },
        deductionBase,
        deductionBaseLabel,
        dayBase,
        effectiveRate: factor,
        payableScope,
        payableBeforeDeduction,
        effectiveRateOnPayable:
          payableBeforeDeduction > 0 ? totalDeduction / payableBeforeDeduction : 0,
        formula,
        capApplied,
        carTaxDeduction,
        educationTaxDeduction,
        totalDeduction,
      };
    }
  }

  const finalPayable = prepay
    ? prepay.payableBeforeDeduction - prepay.totalDeduction
    : subtotal;

  /* 일할계산 공통 정보와, 말소등록에 한정한 환급 정보 */
  let prorationInfo: ProrationInfo | null = null;
  let refund: RefundBreakdown | null = null;
  if (proration) {
    const sumBefore = (rows: HalfBreakdown[]) =>
      rows.reduce((sum, h) => sum + h.carTaxBeforeProrate + h.educationTaxBeforeProrate, 0);
    const sumAfter = (rows: HalfBreakdown[]) => rows.reduce((sum, h) => sum + h.carTax + h.educationTax, 0);

    const annualProratedTax = sumAfter(allHalves);
    prorationInfo = {
      kind: proration.kind,
      date: proration.date,
      annualTax: sumBefore(allHalves),
      annualProratedTax,
      periodTax: sumBefore(halves),
      periodProratedTax: sumAfter(halves),
    };

    // 환급은 말소등록에서만, 그리고 기납부액이 있을 때만 의미가 있다.
    // 환급 산정은 언제나 연간 기준이다. period는 화면 표시 범위일 뿐 환급 범위가 아니다.
    if (proration.kind === "deregistration" && alreadyPaid !== null) {
      refund = {
        scope: "annual",
        annualProratedTax,
        alreadyPaid,
        estimatedRefund: alreadyPaid - annualProratedTax,
      };
    }
  }

  /* 근거를 확정하지 못한 규칙이 결과에 섞였는지 */
  const verificationNotes: string[] = [];
  if (unverifiedPrepayYear) {
    verificationNotes.push(
      `${year}년 연납 공제 이자율은 사용자가 선택한 가정 계산입니다. ${LAST_VERIFIED_PREPAY_YEAR}년까지 확인한 값(100분의 5)을 그대로 적용했으며, 이후 시행령 개정 여부는 확인되지 않았습니다.`,
    );
  }
  // 윤년 분모(366일)와 6월·9월 계산식은 2026-09-01 법 §128③ 원문으로 확정되어 검증 사유에서 제외했다.
  if (refund) {
    verificationNotes.push(
      "환급 예상액은 연간 기납부액에서 연간 일할계산 후 부담액을 뺀 값입니다. 과세기간을 기분으로 선택해도 환급 산정은 연간 기준으로 계산됩니다. 실제 환급은 관할 지자체 신청 절차와 처리 기준에 따릅니다.",
    );
  }
  const status: ResultStatus = verificationNotes.length > 0 ? "verificationRequired" : "confirmed";

  /* 계산 과정 */
  const steps: CalcStep[] = [];
  steps.push({
    label: "① 연세액 (차령 경감 전)",
    expression: base.rateLabel,
    value: `${base.annual.toLocaleString("ko-KR")}원`,
  });

  for (const h of halves) {
    if (h.vehicleAge !== null && h.ageDiscountRate > 0) {
      steps.push({
        label: `② 제${h.half}기분 차령 경감`,
        expression: `${h.baseHalfTax.toLocaleString("ko-KR")}원 − (${h.baseHalfTax.toLocaleString("ko-KR")}원 × 5% × (${h.vehicleAge} − 2)) = 경감률 ${(h.ageDiscountRate * 100).toFixed(0)}%`,
        value: `${h.carTax.toLocaleString("ko-KR")}원`,
      });
    } else {
      steps.push({
        label: `② 제${h.half}기분 자동차세`,
        expression:
          h.prorate && h.prorate.usedDays !== h.prorate.totalDays
            ? `${h.baseHalfTax.toLocaleString("ko-KR")}원 × ${h.prorate.usedDays}일 / ${h.prorate.totalDays}일 (일할계산)`
            : `연세액 ÷ 2 (10원 미만 절사)`,
        value: `${h.carTax.toLocaleString("ko-KR")}원`,
      });
    }
  }

  if (educationTax > 0) {
    steps.push({
      label: "③ 지방교육세",
      expression: `자동차세 기분세액 × 30% (기분별 10원 미만 절사)`,
      value: `${educationTax.toLocaleString("ko-KR")}원`,
    });
  }

  if (prepay) {
    steps.push({
      label: "④ 연납 공제",
      expression:
        `${prepay.formula} — 법 제128조 제3항 계산식` +
        (prepay.dayBase !== null
          ? ` · 공제대상 기간 ${prepay.deductiblePeriod.from} ~ ${prepay.deductiblePeriod.to} (${prepay.deductiblePeriod.days}일)`
          : ` · 제2기분 과세기간 ${year}-07-01 ~ ${year}-12-31`),
      value: `−${prepay.totalDeduction.toLocaleString("ko-KR")}원`,
    });
  }

  steps.push({
    label: "⑤ 최종 납부액",
    expression: prepay
      ? prepay.payableScope === "secondHalf"
        ? "제2기분 자동차세 + 제2기분 지방교육세 − 연납 공제액"
        : "자동차세 + 지방교육세 − 연납 공제액"
      : "자동차세 + 지방교육세",
    value: `${finalPayable.toLocaleString("ko-KR")}원`,
  });

  /* 안내 */
  if (input.vehicleType === "otherPassenger") {
    notes.push(
      "전기·태양열·알코올 자동차는 배기량이 없어 정액 과세되며, 「지방세법」 제127조 제1항 제2호의 차령 경감 대상이 아닙니다.",
    );
  }
  if (!hasEducationTax(input)) {
    notes.push("지방교육세는 비영업용 승용자동차에만 부과되므로 이 조건에서는 계산되지 않습니다.");
  }
  if (input.vehicleType === "van" || input.vehicleType === "truck" || input.vehicleType === "special") {
    notes.push("승합·화물·특수자동차는 차령 경감 대상이 아니며, 대형·소형 구분은 자동차등록증 기재 내용을 기준으로 선택해야 합니다.");
  }
  if (proration) {
    notes.push(
      "일할계산은 신규등록·말소등록만 지원합니다. 매매·증여에 따른 승계취득(법 제129조)은 양도인·양수인 귀속일 경계를 공식 자료로 확정하지 못해 지원하지 않습니다.",
    );
  }
  if (prepay) {
    if (prepay.payableScope === "secondHalf") {
      notes.push(
        "9월 연납은 제2기분(7~12월분)만 미리 납부합니다. 제1기분은 6월 정기분으로 이미 부과·납부된 것으로 보고 최종 납부액에서 제외했습니다.",
      );
    } else if (prepay.timing === "jun") {
      notes.push(
        "6월 연납은 제1기분 납기(6월 16~30일) 중에 연세액 전액을 신고납부하는 방식입니다. 공제는 「지방세법」 제128조 제3항에 따라 제2기분 세액에만 이자율을 곱해 계산합니다.",
      );
    }
    if (isLeapYear(year) && prepay.dayBase === 366) {
      notes.push("윤년 과세연도이므로 법 제128조 제3항 계산식의 분모를 366일로 적용했습니다.");
    }
  }
  if (base.annual <= LUMP_SUM_LEVY_THRESHOLD) {
    notes.push(
      `연세액이 ${LUMP_SUM_LEVY_THRESHOLD.toLocaleString("ko-KR")}원 이하입니다. 「지방세법」 제128조 제4항에 따라 지방자치단체가 제1기분을 부과할 때 연세액 전액을 한 번에 부과·징수할 수 있으며, 이 경우 제2기분 세액에 이자율을 곱한 금액이 공제됩니다. 실제 고지 방식은 관할 지자체에 따라 다를 수 있습니다.`,
    );
  }
  notes.push(
    "10원 미만 절사는 기분세액·지방교육세·연납 공제액 각 단계에서 적용했습니다. 단계별 절사인지 최종 세액 절사인지는 근거 조문을 특정하지 못했고, 지자체 공식 계산예시(지방교육세 35,946원 → 35,940원)로 확인한 범위입니다.",
  );
  if (halves.some((h) => h.belowMinLevy)) {
    notes.push("일할계산 결과가 2천원 미만이어서 「지방세법」 제130조 제4항에 따라 징수하지 않는 것으로 처리했습니다.");
  }

  return {
    ok: true,
    status,
    verificationNotes,
    proration: prorationInfo,
    refund,
    year,
    period,
    annualBaseTax: base.annual,
    ccRate: base.ccRate,
    rateLabel: base.rateLabel,
    halves,
    carTax,
    educationTax,
    ageReduction,
    ageDiscountRate: avgDiscount,
    subtotal,
    prepay,
    finalPayable,
    steps,
    notes,
  };
}
