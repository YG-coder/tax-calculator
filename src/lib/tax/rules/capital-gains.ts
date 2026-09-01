/**
 * 양도소득세 계산 로직 — UI와 분리된 순수 함수 모듈
 *
 * 근거 법령 (2026-09-01 국가법령정보센터 원문 확인)
 * - 「소득세법」 [시행 2026. 1. 1.] [법률 제21221호, 2025. 12. 23., 일부개정]
 *   · 제55조 제1항 — 기본세율 6~45%
 *   · 제89조 제1항 제3호 — 1세대 1주택 비과세, 고가주택 12억원 기준
 *   · 제95조 — 양도소득금액과 장기보유 특별공제액 (표 1 / 표 2)
 *   · 제95조 제2항 — 제104조 제7항 각 호에 따른 자산(중과 대상 주택)은 장기보유특별공제 제외
 *   · 제103조 — 양도소득 기본공제 250만원
 *   · 제104조 제1항 제1호~제3호 — 단기 보유 세율
 *   · 제104조 제7항 — 조정대상지역 다주택 중과세율 (+20%p / +30%p)
 * - 「소득세법 시행령」 [시행 2026. 7. 1.] [대통령령 제36343호, 2026. 5. 22., 일부개정]
 *   · 제154조 제1항 — 1세대 1주택 요건 (보유 2년, 취득 당시 조정대상지역이면 거주 2년)
 *   · 제156조 — 고가주택의 범위 (12억원)
 *   · 제159조의4 — 장기보유특별공제 표 2 적용 요건 (보유기간 중 거주기간 2년 이상)
 *   · 제160조 — 고가주택 양도차익·장기보유특별공제액 안분 계산
 *   · 제167조의3 제1항 제12호의2 — 다주택 중과 한시 배제 (2026년 5월 9일까지 양도분)
 * - 국세청 「양도소득세 세율」·「장기보유특별공제율」 안내표로 교차 확인
 *
 * 최근 점검일: 2026-09-01
 */

import { basicIncomeTax, localIncomeTax } from "./rates.ts";

export const CAPITAL_GAINS_TAX_YEAR = 2026;
export const CAPITAL_GAINS_LAST_REVIEWED = "2026-09-01";

/** 세율·공제표를 법령 원문으로 확인한 마지막 양도 연도. 이 연도를 넘으면 조용히 같은 값을 쓰지 않는다. */
export const LAST_VERIFIED_CG_YEAR = 2026;

/** 고가주택 기준 — 법 제89조 제1항 제3호, 영 제156조 */
export const HIGH_PRICE_HOUSE_THRESHOLD = 1_200_000_000;

/** 양도소득 기본공제 — 법 제103조 제1항 */
export const BASIC_DEDUCTION = 2_500_000;

/** 다주택 중과 한시 배제의 마지막 양도일 — 영 제167조의3 제1항 제12호의2 가목 */
export const HEAVY_TAX_GRACE_LAST_DATE = "2026-05-09";

/* ------------------------------------------------------------------ */
/* 자산 구분                                                            */
/* ------------------------------------------------------------------ */

export type CgAssetType =
  /** 주택 (이에 딸린 토지 포함) */
  | "house"
  /** 그 밖의 토지·건물 */
  | "land"
  /** 조합원입주권 */
  | "residencyRight"
  /** 분양권 */
  | "salesRight";

export const CG_ASSET_LABELS: Record<CgAssetType, string> = {
  house: "주택 (이에 딸린 토지 포함)",
  land: "그 밖의 토지·건물",
  residencyRight: "조합원입주권",
  salesRight: "분양권",
};

/** 1세대가 보유한 주택 수. 3 은 "3주택 이상"을 뜻한다. */
export type HouseCount = 1 | 2 | 3;

/* ------------------------------------------------------------------ */
/* 연도별 규칙                                                          */
/* ------------------------------------------------------------------ */

export interface LongTermRow {
  /** 이 행이 적용되는 최소 연수 (이상) */
  years: number;
  /** 공제율 백분율 (정수). 부동소수점 오차를 피하려고 정수로 보관한다. */
  percent: number;
  /** 공제율 (0~1) */
  rate: number;
}

export interface CgRules {
  /** 법 제95조 제2항 표 1 — 일반 장기보유특별공제 */
  table1: LongTermRow[];
  /** 법 제95조 제2항 표 2 — 1세대 1주택 보유기간별 */
  table2Holding: LongTermRow[];
  /** 법 제95조 제2항 표 2 — 1세대 1주택 거주기간별 */
  table2Residence: LongTermRow[];
  /** 법 제104조 제7항 — 조정대상지역 다주택 중과 가산세율 (주택 수 → %p) */
  heavySurcharge: Record<2 | 3, number>;
  /** 법 제104조 제1항 제3호 — 보유 1년 미만 세율 */
  shortTermUnder1Year: Record<CgAssetType, number>;
  /** 법 제104조 제1항 제2호 — 보유 1년 이상 2년 미만 세율 */
  shortTermUnder2Years: Record<CgAssetType, number>;
  /** 법 제104조 제1항 제1호 — 보유 2년 이상. null 이면 기본세율 */
  longTermFlatRate: Record<CgAssetType, number | null>;
  basicDeduction: number;
  highPriceThreshold: number;
}

/** 백분율 정수를 표 행으로 만든다. 부동소수점 오차를 피하려고 정수에서 파생한다. */
function rows(entries: [number, number][]): LongTermRow[] {
  return entries.map(([years, percent]) => ({ years, percent, rate: percent / 100 }));
}

const RULES_2021_ONWARD: CgRules = {
  // 법 제95조 제2항 표 1 — 3년 6% 부터 15년 이상 30% 까지 매년 2%p
  table1: rows([
    [3, 6], [4, 8], [5, 10], [6, 12], [7, 14], [8, 16], [9, 18],
    [10, 20], [11, 22], [12, 24], [13, 26], [14, 28], [15, 30],
  ]),
  // 표 2 보유기간별 — 3년 12% 부터 10년 이상 40% 까지 매년 4%p
  table2Holding: rows([
    [3, 12], [4, 16], [5, 20], [6, 24], [7, 28], [8, 32], [9, 36], [10, 40],
  ]),
  // 표 2 거주기간별 — 2년 이상 3년 미만 8% (보유 3년 이상에 한정), 3년부터 12%~40%
  table2Residence: rows([
    [2, 8], [3, 12], [4, 16], [5, 20], [6, 24], [7, 28], [8, 32], [9, 36], [10, 40],
  ]),
  heavySurcharge: { 2: 0.2, 3: 0.3 },
  shortTermUnder1Year: { house: 0.7, residencyRight: 0.7, salesRight: 0.7, land: 0.5 },
  shortTermUnder2Years: { house: 0.6, residencyRight: 0.6, salesRight: 0.6, land: 0.4 },
  longTermFlatRate: { house: null, residencyRight: null, salesRight: 0.6, land: null },
  basicDeduction: BASIC_DEDUCTION,
  highPriceThreshold: HIGH_PRICE_HOUSE_THRESHOLD,
};

const CG_RULES_BY_YEAR: { from: number; to: number; rules: CgRules; basis: string }[] = [
  {
    from: 2023,
    to: LAST_VERIFIED_CG_YEAR,
    rules: RULES_2021_ONWARD,
    basis:
      "법 제55조 제1항 기본세율(2023년 이후 과세표준 구간), 법 제95조 제2항 표 1·표 2(2021년 이후 양도분), " +
      "법 제104조 제1항·제7항 (2026-09-01 국가법령정보센터 원문 확인)",
  },
];

export function cgRulesFor(year: number): { rules: CgRules; basis: string; verified: boolean } | null {
  const row = CG_RULES_BY_YEAR.find((r) => year >= r.from && year <= r.to);
  if (row) return { rules: row.rules, basis: row.basis, verified: true };
  if (year > LAST_VERIFIED_CG_YEAR) {
    const latest = CG_RULES_BY_YEAR[CG_RULES_BY_YEAR.length - 1];
    return { rules: latest.rules, basis: latest.basis, verified: false };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* 날짜·기간                                                            */
/* ------------------------------------------------------------------ */

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCgDate(value: string): { y: number; m: number; d: number; ms: number } | null {
  const match = DATE_RE.exec(value.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d, ms: dt.getTime() };
}

const DAY_MS = 86_400_000;

/**
 * 보유기간 n년 요건을 충족하는 첫 양도일.
 *
 * 「국세기본법」 제4조는 기간 계산을 「민법」에 따르도록 하되 세법에 특별한 규정이 있으면 그에 따른다.
 * 「소득세법」 제95조 제4항·제104조 제2항은 보유기간을 "취득일부터 양도일까지"로 정하므로 초일을 산입하고,
 * 「민법」 제160조에 따라 기간은 최후의 해에서 기산일에 해당하는 날의 전날에 만료한다.
 * 따라서 취득일 2024-01-01 자산의 2년 보유 요건은 2025-12-31 양도부터 충족된다.
 *
 * 2월 29일 취득처럼 응당일이 없는 해는 그 달의 말일을 응당일로 본다.
 */
export function yearThresholdDate(acquired: { y: number; m: number; d: number }, years: number): number {
  const targetYear = acquired.y + years;
  const lastDayOfMonth = new Date(Date.UTC(targetYear, acquired.m, 0)).getUTCDate();
  const day = Math.min(acquired.d, lastDayOfMonth);
  return Date.UTC(targetYear, acquired.m - 1, day) - DAY_MS;
}

/** 취득일부터 양도일까지 만 몇 년인지 (초일 산입, 민법 제160조 기준) */
export function completedYears(acquired: { y: number; m: number; d: number }, transferMs: number): number {
  let years = 0;
  // 실무상 필요한 범위(최대 60년)까지만 센다.
  while (years < 60 && transferMs >= yearThresholdDate(acquired, years + 1)) years += 1;
  return years;
}

/** 취득일부터 양도일까지의 일수 (초일 산입) */
export function holdingDays(acquiredMs: number, transferMs: number): number {
  if (transferMs < acquiredMs) return 0;
  return Math.round((transferMs - acquiredMs) / DAY_MS) + 1;
}

function isoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** 표에서 해당 연수의 공제율 백분율(정수)을 찾는다. 표에 미치지 못하면 0. */
export function lookupPercent(table: LongTermRow[], years: number): number {
  let percent = 0;
  for (const row of table) {
    if (years >= row.years) percent = row.percent;
  }
  return percent;
}

/** 표에서 해당 연수의 공제율(0~1)을 찾는다. 표에 미치지 못하면 0. */
export function lookupRate(table: LongTermRow[], years: number): number {
  return lookupPercent(table, years) / 100;
}

/* ------------------------------------------------------------------ */
/* 입출력 타입                                                          */
/* ------------------------------------------------------------------ */

export interface CapitalGainsInput {
  assetType: CgAssetType;
  /** 양도가액 (실지거래가액) */
  transferPrice: number;
  /** 취득가액 (실지거래가액) */
  acquisitionPrice: number;
  /** 필요경비 */
  expenses?: number;
  /** 취득일 YYYY-MM-DD — 「소득세법」 제98조의 취득시기(원칙: 대금청산일) */
  acquisitionDate: string;
  /** 양도일 YYYY-MM-DD */
  transferDate: string;

  /** 주택: 양도일 현재 1세대 1주택인지 */
  oneHouseOneHousehold?: boolean;
  /** 주택: 취득 당시 조정대상지역이었는지 (영 제154조 제1항의 거주요건) */
  adjustedAreaAtAcquisition?: boolean;
  /** 주택: 보유기간 중 거주기간 (개월) */
  residenceMonths?: number | null;

  /** 주택: 1세대가 보유한 주택 수 (조합원입주권·분양권 포함). 3 은 3주택 이상 */
  housesOwned?: HouseCount;
  /** 주택: 양도 당시 조정대상지역인지 (법 제104조 제7항) */
  adjustedAreaAtTransfer?: boolean;
  /** 중과 배제 대상(장기임대주택·상속주택·지방 저가주택·경과조치 등)에 해당하는지 */
  heavyTaxExcluded?: boolean;

  /** 같은 과세기간에 이미 사용한 양도소득 기본공제액 */
  basicDeductionUsed?: number;
  /** 확인된 마지막 연도 이후의 양도에 대해 같은 규칙을 가정하고 계산할지 */
  assumeLatestRules?: boolean;
}

export interface CgStep {
  label: string;
  expression: string;
  value: string;
}

export interface LongTermDeductionInfo {
  /** 적용한 표 */
  table: "표1" | "표2" | "없음";
  holdingYears: number;
  holdingRate: number;
  residenceYears: number;
  residenceRate: number;
  totalRate: number;
  amount: number;
  /** 배제 사유 (배제된 경우) */
  excludedReason: string | null;
}

export interface CgRateInfo {
  /** 적용한 세율 방식 */
  kind: "basic" | "flat" | "heavy" | "heavyVsShort";
  label: string;
  /** 단일세율일 때의 세율 (기본세율이면 null) */
  flatRate: number | null;
  /** 중과 가산세율 (%p, 없으면 0) */
  surcharge: number;
  /** 경합 비교에 쓰인 세액들 */
  compared: { label: string; tax: number }[];
}

export interface CapitalGainsSuccess {
  ok: true;
  status: "confirmed" | "verificationRequired";
  verificationNotes: string[];
  year: number;
  rulesBasis: string;

  holdingYears: number;
  holdingDays: number;
  /** 다음 보유기간 기준(2년/3년 등)을 충족하는 날 */
  thresholds: { years: number; date: string; met: boolean }[];
  residenceYears: number;

  /** 양도차익 = 양도가액 − 취득가액 − 필요경비 */
  grossGain: number;
  /** 1세대 1주택 비과세 판정 */
  exemption: {
    eligible: boolean;
    /** 전액 비과세인지 */
    fullyExempt: boolean;
    /** 고가주택으로 과세되는 비율 (0~1) */
    taxableRatio: number;
    reasons: string[];
  } | null;
  /** 과세 대상 양도차익 */
  taxableGain: number;
  longTerm: LongTermDeductionInfo;
  /** 양도소득금액 = 과세 양도차익 − 장기보유특별공제 */
  gainAmount: number;
  basicDeduction: number;
  taxBase: number;
  rate: CgRateInfo;
  /** 양도소득 산출세액 */
  incomeTax: number;
  /** 지방소득세 (양도소득분) */
  localTax: number;
  totalTax: number;
  /** 세후 실수령 예상액 = 양도가액 − 취득가액 − 필요경비 − 총세액 */
  netProceeds: number;
  steps: CgStep[];
  notes: string[];
  unsupported: string[];
}

export interface CapitalGainsFailure {
  ok: false;
  errors: string[];
}

export type CapitalGainsResult = CapitalGainsSuccess | CapitalGainsFailure;

/* ------------------------------------------------------------------ */
/* 계산                                                                 */
/* ------------------------------------------------------------------ */

const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}원`;
const pct = (r: number) => {
  const v = Math.round(r * 10_000) / 100;
  return `${Number.isInteger(v) ? v : v.toFixed(2)}%`;
};

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const errors: string[] = [];
  const notes: string[] = [];
  const unsupported: string[] = [];
  const verificationNotes: string[] = [];

  /* 입력 검증 */
  const acq = parseCgDate(input.acquisitionDate ?? "");
  const trn = parseCgDate(input.transferDate ?? "");
  if (!acq) errors.push("취득일을 YYYY-MM-DD 형식으로 입력해 주세요.");
  if (!trn) errors.push("양도일을 YYYY-MM-DD 형식으로 입력해 주세요.");
  if (acq && trn && trn.ms < acq.ms) errors.push("양도일은 취득일보다 빠를 수 없습니다.");

  for (const [label, value] of [
    ["양도가액", input.transferPrice],
    ["취득가액", input.acquisitionPrice],
    ["필요경비", input.expenses ?? 0],
    ["이미 사용한 기본공제", input.basicDeductionUsed ?? 0],
  ] as [string, number][]) {
    if (typeof value !== "number" || !Number.isFinite(value)) errors.push(`${label}은(는) 숫자여야 합니다.`);
    else if (value < 0) errors.push(`${label}은(는) 0 이상이어야 합니다.`);
    else if (!Number.isSafeInteger(value)) errors.push(`${label}은(는) 정수여야 합니다.`);
  }
  if (input.transferPrice <= 0) errors.push("양도가액을 입력해 주세요.");

  const residenceMonths = input.residenceMonths ?? 0;
  if (typeof residenceMonths !== "number" || !Number.isFinite(residenceMonths) || residenceMonths < 0) {
    errors.push("거주기간(개월)은 0 이상의 숫자여야 합니다.");
  }

  if (errors.length > 0 || !acq || !trn) return { ok: false, errors };

  const year = trn.y;
  const ruleInfo = cgRulesFor(year);
  if (!ruleInfo) {
    return {
      ok: false,
      errors: [`${year}년 양도분의 세율·공제표는 이 계산기에 등록되어 있지 않습니다.`],
    };
  }
  if (!ruleInfo.verified && input.assumeLatestRules !== true) {
    return {
      ok: false,
      errors: [
        `${year}년 양도분의 세율·공제표는 확인되지 않았습니다. 이 계산기가 법령 원문으로 확인한 마지막 양도 연도는 ${LAST_VERIFIED_CG_YEAR}년입니다. ` +
          `${LAST_VERIFIED_CG_YEAR}년 기준을 가정한 계산을 원하면 가정 계산을 선택해 주세요.`,
      ],
    };
  }
  const rules = ruleInfo.rules;
  if (!ruleInfo.verified) {
    verificationNotes.push(
      `${year}년 양도분의 세율·공제표는 사용자가 선택한 가정 계산입니다. ${LAST_VERIFIED_CG_YEAR}년 기준을 그대로 적용했으며, 이후 개정 여부는 확인되지 않았습니다.`,
    );
  }

  const isHouse = input.assetType === "house";
  const expenses = input.expenses ?? 0;

  /* 보유기간 — 법 제95조 제4항·제104조 제2항 */
  const years = completedYears(acq, trn.ms);
  const days = holdingDays(acq.ms, trn.ms);
  const thresholdYears = [1, 2, 3, 10, 15];
  const thresholds = thresholdYears.map((n) => {
    const ms = yearThresholdDate(acq, n);
    return { years: n, date: isoDate(ms), met: trn.ms >= ms };
  });
  // 경계 하루 차이는 취득·양도시기 판정(법 제98조)에 따라 결과가 뒤집힌다.
  const nearBoundary = thresholds.some((t) => {
    const ms = Date.parse(`${t.date}T00:00:00Z`);
    return Math.abs(trn.ms - ms) <= DAY_MS;
  });
  if (nearBoundary) {
    verificationNotes.push(
      "양도일이 보유기간 요건의 경계(하루 차이)에 있습니다. 취득·양도시기는 「소득세법」 제98조에 따라 원칙적으로 대금청산일로 판단하므로, 등기일·잔금일에 따라 결과가 달라질 수 있습니다. 국세청 홈택스 모의계산으로 대조하세요.",
    );
  }
  const residenceYears = Math.floor(residenceMonths / 12);

  /* ① 양도차익 */
  const grossGain = input.transferPrice - input.acquisitionPrice - expenses;
  if (grossGain <= 0) {
    notes.push("양도차익이 0 이하입니다. 양도소득세는 발생하지 않으며, 같은 과세기간의 다른 양도소득과 통산할 수 있습니다.");
  }
  const positiveGain = Math.max(0, grossGain);

  /* ② 1세대 1주택 비과세 — 법 제89조 제1항 제3호, 영 제154조 제1항 */
  let exemption: CapitalGainsSuccess["exemption"] = null;
  let taxableRatio = 1;

  if (isHouse && input.oneHouseOneHousehold) {
    const reasons: string[] = [];
    const holdOk = years >= 2;
    const needResidence = input.adjustedAreaAtAcquisition === true;
    const residenceOk = !needResidence || residenceMonths >= 24;

    if (!holdOk) reasons.push("보유기간이 2년 미만이어서 1세대 1주택 비과세 요건을 갖추지 못했습니다.");
    if (needResidence && !residenceOk) {
      reasons.push("취득 당시 조정대상지역 주택은 보유 2년에 더해 거주 2년 이상이 필요합니다.");
    }

    const eligible = holdOk && residenceOk;
    const isHighPrice = input.transferPrice > rules.highPriceThreshold;

    if (eligible && !isHighPrice) {
      taxableRatio = 0;
      reasons.push(`양도가액이 ${won(rules.highPriceThreshold)} 이하이므로 전액 비과세입니다.`);
    } else if (eligible && isHighPrice) {
      taxableRatio = (input.transferPrice - rules.highPriceThreshold) / input.transferPrice;
      reasons.push(
        `양도가액이 ${won(rules.highPriceThreshold)}을 초과하는 고가주택이므로 초과분만 과세합니다. (영 제160조)`,
      );
    }

    exemption = {
      eligible,
      fullyExempt: eligible && !isHighPrice,
      taxableRatio,
      reasons,
    };
  }

  const taxableGain = Math.floor(positiveGain * taxableRatio);

  /* ③ 중과 판정 — 법 제104조 제7항 */
  const housesOwned: HouseCount = input.housesOwned ?? 1;
  const heavyEligible =
    isHouse &&
    housesOwned >= 2 &&
    input.adjustedAreaAtTransfer === true &&
    input.heavyTaxExcluded !== true &&
    exemption?.fullyExempt !== true;
  const surcharge = heavyEligible ? rules.heavySurcharge[housesOwned === 3 ? 3 : 2] : 0;

  if (isHouse && housesOwned >= 2 && input.adjustedAreaAtTransfer === true) {
    const graceMs = Date.parse(`${HEAVY_TAX_GRACE_LAST_DATE}T00:00:00Z`);
    if (trn.ms <= graceMs) {
      notes.push(
        `양도일이 ${HEAVY_TAX_GRACE_LAST_DATE} 이전입니다. 「소득세법 시행령」 제167조의3 제1항 제12호의2 가목에 따라 보유기간 2년 이상 주택은 중과가 배제되므로, 중과 배제 대상 여부를 함께 선택해 주세요.`,
      );
    } else {
      notes.push(
        `다주택 중과 한시 배제는 ${HEAVY_TAX_GRACE_LAST_DATE} 양도분까지였습니다. 다만 ${HEAVY_TAX_GRACE_LAST_DATE}까지 매매계약을 체결한 주택 등에는 경과조치가 있고, 장기임대주택·상속주택·지방 저가주택(기준시가 3억원 이하) 등도 중과에서 제외됩니다. 해당하면 ‘중과 배제 대상’을 선택해 주세요.`,
      );
    }
  }

  /* ④ 장기보유특별공제 — 법 제95조 제2항, 영 제159조의4, 제160조 */
  let longTerm: LongTermDeductionInfo = {
    table: "없음",
    holdingYears: years,
    holdingRate: 0,
    residenceYears,
    residenceRate: 0,
    totalRate: 0,
    amount: 0,
    excludedReason: null,
  };

  if (taxableGain > 0) {
    if (input.assetType === "salesRight") {
      longTerm.excludedReason = "분양권은 장기보유특별공제 대상이 아닙니다. (법 제95조 제2항)";
    } else if (input.assetType === "residencyRight") {
      longTerm.excludedReason =
        "조합원입주권의 장기보유특별공제는 원조합원이 관리처분계획 인가 전 토지·건물분 양도차익에 대해서만 적용됩니다. 이 계산기는 그 안분을 지원하지 않아 공제를 적용하지 않았습니다. (법 제95조 제2항)";
      unsupported.push("조합원입주권의 관리처분계획 인가 전·후 양도차익 안분");
    } else if (heavyEligible) {
      longTerm.excludedReason =
        "조정대상지역 다주택 중과 대상 주택은 장기보유특별공제에서 제외됩니다. (법 제95조 제2항 괄호, 법 제104조 제7항)";
    } else if (years < 3) {
      longTerm.excludedReason = "보유기간이 3년 미만이면 장기보유특별공제가 적용되지 않습니다. (법 제95조 제2항)";
    } else {
      // 표 2 요건: 양도일 현재 1세대 1주택 + 보유기간 중 거주기간 2년 이상 (영 제159조의4)
      const useTable2 = isHouse && input.oneHouseOneHousehold === true && residenceMonths >= 24;
      if (useTable2) {
        // 백분율 정수로 더한 뒤 100으로 나눈다. 0.4 + 0.08 은 0.48000000000000004 이 된다.
        const holdingPercent = lookupPercent(rules.table2Holding, years);
        const residencePercent = lookupPercent(rules.table2Residence, residenceYears);
        const totalPercent = holdingPercent + residencePercent;
        longTerm = {
          table: "표2",
          holdingYears: years,
          holdingRate: holdingPercent / 100,
          residenceYears,
          residenceRate: residencePercent / 100,
          totalRate: totalPercent / 100,
          amount: Math.floor((taxableGain * totalPercent) / 100),
          excludedReason: null,
        };
      } else {
        const holdingPercent = lookupPercent(rules.table1, years);
        longTerm = {
          table: "표1",
          holdingYears: years,
          holdingRate: holdingPercent / 100,
          residenceYears,
          residenceRate: 0,
          totalRate: holdingPercent / 100,
          amount: Math.floor((taxableGain * holdingPercent) / 100),
          excludedReason: null,
        };
        if (isHouse && input.oneHouseOneHousehold === true && residenceMonths < 24) {
          notes.push(
            "1세대 1주택이라도 보유기간 중 거주기간이 2년 미만이면 표 2(최대 80%)가 아니라 표 1(최대 30%)이 적용됩니다. (영 제159조의4)",
          );
        }
      }
    }
  }

  /* ⑤ 양도소득금액 · 과세표준 */
  const gainAmount = Math.max(0, taxableGain - longTerm.amount);
  const usedDeduction = Math.min(input.basicDeductionUsed ?? 0, rules.basicDeduction);
  const availableDeduction = Math.max(0, rules.basicDeduction - usedDeduction);
  const basicDeduction = Math.min(availableDeduction, gainAmount);
  const taxBase = Math.max(0, gainAmount - basicDeduction);

  /* ⑥ 세율 — 법 제104조 제1항·제7항 */
  const compared: { label: string; tax: number }[] = [];
  let incomeTax = 0;
  let rateInfo: CgRateInfo;

  const flatShort =
    years < 1
      ? rules.shortTermUnder1Year[input.assetType]
      : years < 2
        ? rules.shortTermUnder2Years[input.assetType]
        : null;
  const flatLong = rules.longTermFlatRate[input.assetType];

  if (taxBase === 0) {
    rateInfo = { kind: "basic", label: "과세표준 0원", flatRate: null, surcharge: 0, compared: [] };
  } else if (heavyEligible) {
    // 중과세액: 기본세율 + 가산세율
    const heavyTax = Math.floor(basicIncomeTax(taxBase) + taxBase * surcharge);
    compared.push({ label: `기본세율 + ${(surcharge * 100).toFixed(0)}%p (중과)`, tax: heavyTax });
    if (flatShort !== null) {
      const shortTax = Math.floor(taxBase * flatShort);
      compared.push({ label: `단기 보유 ${pct(flatShort)}`, tax: shortTax });
    }
    incomeTax = Math.max(...compared.map((c) => c.tax));
    const winner = compared.find((c) => c.tax === incomeTax)!;
    rateInfo = {
      kind: compared.length > 1 ? "heavyVsShort" : "heavy",
      label:
        compared.length > 1
          ? `${winner.label} — 법 제104조 제7항 후단에 따라 두 산출세액 중 큰 세액`
          : winner.label,
      flatRate: null,
      surcharge,
      compared,
    };
  } else if (flatShort !== null) {
    incomeTax = Math.floor(taxBase * flatShort);
    compared.push({ label: `단기 보유 ${pct(flatShort)}`, tax: incomeTax });
    rateInfo = {
      kind: "flat",
      label: `보유기간 ${years < 1 ? "1년 미만" : "1년 이상 2년 미만"} 단일세율 ${pct(flatShort)}`,
      flatRate: flatShort,
      surcharge: 0,
      compared,
    };
  } else if (flatLong !== null) {
    incomeTax = Math.floor(taxBase * flatLong);
    compared.push({ label: `단일세율 ${pct(flatLong)}`, tax: incomeTax });
    rateInfo = {
      kind: "flat",
      label: `${CG_ASSET_LABELS[input.assetType]} 단일세율 ${pct(flatLong)} (법 제104조 제1항 제1호)`,
      flatRate: flatLong,
      surcharge: 0,
      compared,
    };
  } else {
    incomeTax = Math.floor(basicIncomeTax(taxBase));
    compared.push({ label: "기본세율 6~45%", tax: incomeTax });
    rateInfo = { kind: "basic", label: "기본세율 6~45% (법 제55조 제1항)", flatRate: null, surcharge: 0, compared };
  }

  const localTax = localIncomeTax(incomeTax);
  const totalTax = incomeTax + localTax;
  const netProceeds = grossGain - totalTax;

  /* 계산 과정 */
  const steps: CgStep[] = [];
  steps.push({
    label: "① 양도차익",
    expression: `양도가액 ${won(input.transferPrice)} − 취득가액 ${won(input.acquisitionPrice)}${expenses > 0 ? ` − 필요경비 ${won(expenses)}` : ""}`,
    value: won(grossGain),
  });
  if (exemption) {
    steps.push({
      label: "② 1세대 1주택 비과세",
      expression: exemption.fullyExempt
        ? `양도가액 ${won(input.transferPrice)} ≤ ${won(rules.highPriceThreshold)} — 전액 비과세`
        : exemption.eligible
          ? `과세 비율 = (양도가액 − ${won(rules.highPriceThreshold)}) ÷ 양도가액 = ${(taxableRatio * 100).toFixed(2)}%`
          : "비과세 요건 미충족 — 전액 과세",
      value: won(taxableGain),
    });
  }
  steps.push({
    label: `${exemption ? "③" : "②"} 장기보유특별공제`,
    expression: longTerm.excludedReason
      ? longTerm.excludedReason
      : longTerm.table === "표2"
        ? `${longTerm.table} — 보유 ${longTerm.holdingYears}년 ${pct(longTerm.holdingRate)} + 거주 ${longTerm.residenceYears}년 ${pct(longTerm.residenceRate)} = ${pct(longTerm.totalRate)}`
        : longTerm.table === "표1"
          ? `${longTerm.table} — 보유 ${longTerm.holdingYears}년 ${pct(longTerm.holdingRate)}`
          : "적용 없음",
    value: `−${won(longTerm.amount)}`,
  });
  steps.push({
    label: `${exemption ? "④" : "③"} 양도소득금액`,
    expression: "과세 양도차익 − 장기보유특별공제",
    value: won(gainAmount),
  });
  steps.push({
    label: `${exemption ? "⑤" : "④"} 양도소득 기본공제`,
    expression: usedDeduction > 0
      ? `연 ${won(rules.basicDeduction)} 중 이미 사용 ${won(usedDeduction)} 차감 (법 제103조)`
      : `연 ${won(rules.basicDeduction)} (법 제103조)`,
    value: `−${won(basicDeduction)}`,
  });
  steps.push({
    label: `${exemption ? "⑥" : "⑤"} 과세표준`,
    expression: "양도소득금액 − 기본공제",
    value: won(taxBase),
  });
  steps.push({
    label: `${exemption ? "⑦" : "⑥"} 산출세액`,
    expression: rateInfo.label,
    value: won(incomeTax),
  });
  steps.push({
    label: `${exemption ? "⑧" : "⑦"} 지방소득세`,
    expression: "양도소득 산출세액 × 10% (「지방세법」 제103조의3)",
    value: won(localTax),
  });
  steps.push({
    label: `${exemption ? "⑨" : "⑧"} 총 부담세액`,
    expression: "양도소득세 + 지방소득세",
    value: won(totalTax),
  });

  /* 안내 */
  notes.push(
    `보유기간은 「소득세법」 제95조 제4항에 따라 취득일부터 양도일까지로 계산했습니다. 초일을 산입하므로 ${isoDate(yearThresholdDate(acq, 2))}부터 보유 2년을 충족합니다.`,
  );
  if (isHouse && input.oneHouseOneHousehold && input.adjustedAreaAtAcquisition) {
    notes.push("취득 당시 조정대상지역 주택은 보유 2년에 더해 거주 2년 이상을 갖춰야 비과세됩니다. (영 제154조 제1항)");
  }
  if (input.assetType === "salesRight") {
    notes.push("분양권은 보유기간과 무관하게 60%(1년 미만 70%)의 단일세율이 적용되고 장기보유특별공제가 없습니다.");
  }

  unsupported.push(
    "일시적 2주택·상속주택·동거봉양·혼인 등 1세대 1주택 특례 (영 제155조)",
    "장기임대주택·거주주택 특례와 「조세특례제한법」상 감면",
    "배우자·직계존비속 증여 후 양도 시 취득가액 이월과세 (법 제97조의2)",
    "비사업용 토지 가산세율(기본세율 +10%p)과 미등기양도자산 70% 세율",
    "주식·파생상품·기타자산, 부담부증여, 국외자산 양도",
    "취득가액을 환산가액·기준시가로 계산하는 경우",
  );

  const status: CapitalGainsSuccess["status"] = verificationNotes.length > 0 ? "verificationRequired" : "confirmed";

  return {
    ok: true,
    status,
    verificationNotes,
    year,
    rulesBasis: ruleInfo.basis,
    holdingYears: years,
    holdingDays: days,
    thresholds,
    residenceYears,
    grossGain,
    exemption,
    taxableGain,
    longTerm,
    gainAmount,
    basicDeduction,
    taxBase,
    rate: rateInfo,
    incomeTax,
    localTax,
    totalTax,
    netProceeds,
    steps,
    notes,
    unsupported,
  };
}
