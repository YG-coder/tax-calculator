import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BASIC_DEDUCTION,
  HIGH_PRICE_HOUSE_THRESHOLD,
  LAST_VERIFIED_CG_YEAR,
  calculateCapitalGains,
  cgRulesFor,
  completedYears,
  holdingDays,
  lookupRate,
  parseCgDate,
  yearThresholdDate,
  type CapitalGainsInput,
  type CapitalGainsSuccess,
} from "../src/lib/tax/rules/capital-gains.ts";

const ok = (input: CapitalGainsInput): CapitalGainsSuccess => {
  const r = calculateCapitalGains(input);
  if (!r.ok) throw new Error(`계산 실패: ${r.errors.join(" / ")}`);
  return r;
};

const base: CapitalGainsInput = {
  assetType: "house",
  transferPrice: 1_000_000_000,
  acquisitionPrice: 500_000_000,
  expenses: 0,
  acquisitionDate: "2016-01-01",
  transferDate: "2026-06-30",
  oneHouseOneHousehold: false,
  adjustedAreaAtAcquisition: false,
  residenceMonths: 0,
  housesOwned: 1,
  adjustedAreaAtTransfer: false,
};

/* ------------------------------------------------------------------ */
/* 보유기간 경계 — 법 제95조 제4항 (초일 산입) + 민법 제160조            */
/* ------------------------------------------------------------------ */

describe("보유기간 경계", () => {
  const acq = parseCgDate("2024-01-01")!;

  it("2년 요건은 취득일 다음 2년째 응당일의 전날에 충족된다", () => {
    assert.equal(new Date(yearThresholdDate(acq, 2)).toISOString().slice(0, 10), "2025-12-31");
    assert.equal(new Date(yearThresholdDate(acq, 1)).toISOString().slice(0, 10), "2024-12-31");
    assert.equal(new Date(yearThresholdDate(acq, 3)).toISOString().slice(0, 10), "2026-12-31");
  });

  it("경계 하루 앞뒤로 보유 연수가 갈린다", () => {
    assert.equal(completedYears(acq, Date.parse("2025-12-30T00:00:00Z")), 1);
    assert.equal(completedYears(acq, Date.parse("2025-12-31T00:00:00Z")), 2);
    assert.equal(completedYears(acq, Date.parse("2026-01-01T00:00:00Z")), 2);
  });

  it("2월 29일 취득은 응당일이 없는 해에 그 달 말일을 기준으로 한다", () => {
    const leap = parseCgDate("2024-02-29")!;
    assert.equal(new Date(yearThresholdDate(leap, 1)).toISOString().slice(0, 10), "2025-02-27");
    assert.equal(new Date(yearThresholdDate(leap, 4)).toISOString().slice(0, 10), "2028-02-28");
  });

  it("보유일수는 초일을 산입한다", () => {
    assert.equal(holdingDays(Date.parse("2026-01-01T00:00:00Z"), Date.parse("2026-01-01T00:00:00Z")), 1);
    assert.equal(holdingDays(Date.parse("2026-01-01T00:00:00Z"), Date.parse("2026-01-31T00:00:00Z")), 31);
  });

  it("보유기간 경계에 걸리면 검증 필요 상태가 된다", () => {
    const r = ok({ ...base, acquisitionDate: "2024-01-01", transferDate: "2025-12-31" });
    assert.equal(r.status, "verificationRequired");
    assert.equal(r.verificationNotes.some((n) => n.includes("제98조")), true);
  });
});

/* ------------------------------------------------------------------ */
/* 1세대 1주택 비과세 — 법 제89조 제1항 제3호, 영 제154조·제160조         */
/* ------------------------------------------------------------------ */

describe("1세대 1주택 비과세", () => {
  const house: CapitalGainsInput = {
    ...base,
    oneHouseOneHousehold: true,
    acquisitionDate: "2016-01-01",
    transferDate: "2026-06-30",
    residenceMonths: 120,
  };

  it("양도가액 12억 이하면 전액 비과세다", () => {
    const r = ok({ ...house, transferPrice: HIGH_PRICE_HOUSE_THRESHOLD, acquisitionPrice: 500_000_000 });
    assert.equal(r.exemption?.fullyExempt, true);
    assert.equal(r.taxableGain, 0);
    assert.equal(r.totalTax, 0);
  });

  it("12억을 1원이라도 넘으면 고가주택으로 과세된다", () => {
    const r = ok({ ...house, transferPrice: HIGH_PRICE_HOUSE_THRESHOLD + 1, acquisitionPrice: 500_000_000 });
    assert.equal(r.exemption?.fullyExempt, false);
    assert.equal(r.exemption?.eligible, true);
    assert.ok(r.exemption!.taxableRatio > 0);
  });

  it("고가주택 과세 양도차익은 (양도가액 − 12억) ÷ 양도가액으로 안분한다", () => {
    // 양도 20억 · 취득 10억 → 양도차익 10억, 과세비율 (20억−12억)/20억 = 40%
    const r = ok({ ...house, transferPrice: 2_000_000_000, acquisitionPrice: 1_000_000_000 });
    assert.equal(r.grossGain, 1_000_000_000);
    assert.equal(r.taxableGain, 400_000_000);
  });

  it("보유 2년 미만이면 비과세 요건을 갖추지 못한다", () => {
    const r = ok({ ...house, acquisitionDate: "2025-06-01", transferDate: "2026-06-30", residenceMonths: 12 });
    assert.equal(r.exemption?.eligible, false);
    assert.equal(r.taxableGain, r.grossGain);
  });

  it("취득 당시 조정대상지역이면 거주 2년이 추가로 필요하다", () => {
    const noResidence = ok({ ...house, adjustedAreaAtAcquisition: true, residenceMonths: 23 });
    assert.equal(noResidence.exemption?.eligible, false);
    const withResidence = ok({ ...house, adjustedAreaAtAcquisition: true, residenceMonths: 24 });
    assert.equal(withResidence.exemption?.eligible, true);
  });

  it("취득 당시 비조정대상지역이면 거주기간 0개월이어도 비과세된다", () => {
    const r = ok({ ...house, adjustedAreaAtAcquisition: false, residenceMonths: 0, transferPrice: 900_000_000 });
    assert.equal(r.exemption?.fullyExempt, true);
  });
});

/* ------------------------------------------------------------------ */
/* 장기보유특별공제 — 법 제95조 제2항 표 1·표 2                          */
/* ------------------------------------------------------------------ */

describe("장기보유특별공제", () => {
  const rules = cgRulesFor(2026)!.rules;

  it("표 1은 3년 6%에서 15년 이상 30%까지 2%p씩 오른다", () => {
    assert.equal(lookupRate(rules.table1, 2), 0);
    assert.equal(lookupRate(rules.table1, 3), 0.06);
    assert.equal(lookupRate(rules.table1, 10), 0.2);
    assert.equal(lookupRate(rules.table1, 15), 0.3);
    assert.equal(lookupRate(rules.table1, 30), 0.3);
  });

  it("표 2는 보유 3년 12%에서 10년 이상 40%까지 4%p씩 오른다", () => {
    assert.equal(lookupRate(rules.table2Holding, 2), 0);
    assert.equal(lookupRate(rules.table2Holding, 3), 0.12);
    assert.equal(lookupRate(rules.table2Holding, 10), 0.4);
    assert.equal(lookupRate(rules.table2Holding, 20), 0.4);
  });

  it("표 2 거주기간별은 2년 이상 3년 미만이 8%다", () => {
    assert.equal(lookupRate(rules.table2Residence, 1), 0);
    assert.equal(lookupRate(rules.table2Residence, 2), 0.08);
    assert.equal(lookupRate(rules.table2Residence, 3), 0.12);
    assert.equal(lookupRate(rules.table2Residence, 10), 0.4);
  });

  it("보유 3년 미만은 공제가 없다", () => {
    const r = ok({ ...base, acquisitionDate: "2024-06-01", transferDate: "2026-06-30" });
    assert.equal(r.longTerm.table, "없음");
    assert.equal(r.longTerm.amount, 0);
    assert.ok(r.longTerm.excludedReason?.includes("3년 미만"));
  });

  it("보유 3년 경계에서 공제가 시작된다", () => {
    // 취득 2023-07-01 → 3년 충족일 2026-06-30
    const justBefore = ok({ ...base, acquisitionDate: "2023-07-01", transferDate: "2026-06-29" });
    assert.equal(justBefore.longTerm.amount, 0);
    const justAfter = ok({ ...base, acquisitionDate: "2023-07-01", transferDate: "2026-06-30" });
    assert.equal(justAfter.longTerm.table, "표1");
    assert.equal(justAfter.longTerm.holdingRate, 0.06);
  });

  it("1세대 1주택 + 거주 2년 이상이면 표 2로 최대 80%까지 공제한다", () => {
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      transferPrice: 2_000_000_000,
      acquisitionPrice: 1_000_000_000,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      residenceMonths: 120,
    });
    assert.equal(r.longTerm.table, "표2");
    assert.equal(r.longTerm.holdingRate, 0.4);
    assert.equal(r.longTerm.residenceRate, 0.4);
    assert.equal(r.longTerm.totalRate, 0.8);
    // 과세 양도차익 4억 × 80% = 3.2억
    assert.equal(r.longTerm.amount, 320_000_000);
  });

  it("1세대 1주택이라도 거주 2년 미만이면 표 1이 적용된다", () => {
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      transferPrice: 2_000_000_000,
      acquisitionPrice: 1_000_000_000,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      residenceMonths: 23,
    });
    assert.equal(r.longTerm.table, "표1");
    assert.equal(r.longTerm.totalRate, 0.2); // 보유 10년 → 20%
    assert.equal(r.notes.some((n) => n.includes("제159조의4")), true);
  });

  it("거주 2년 이상 3년 미만은 거주기간 공제 8%가 붙는다", () => {
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      transferPrice: 2_000_000_000,
      acquisitionPrice: 1_000_000_000,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      residenceMonths: 24,
    });
    assert.equal(r.longTerm.table, "표2");
    assert.equal(r.longTerm.residenceRate, 0.08);
    assert.equal(r.longTerm.totalRate, 0.48);
  });

  it("고가주택은 장기보유특별공제도 같은 비율로 안분된다", () => {
    // 양도 24억 · 취득 12억 → 양도차익 12억, 과세비율 50%, 과세 양도차익 6억
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      transferPrice: 2_400_000_000,
      acquisitionPrice: 1_200_000_000,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      residenceMonths: 120,
    });
    assert.equal(r.taxableGain, 600_000_000);
    assert.equal(r.longTerm.amount, 480_000_000);
    assert.equal(r.gainAmount, 120_000_000);
  });

  it("분양권은 장기보유특별공제 대상이 아니다", () => {
    const r = ok({ ...base, assetType: "salesRight", acquisitionDate: "2016-01-01" });
    assert.equal(r.longTerm.amount, 0);
    assert.ok(r.longTerm.excludedReason?.includes("분양권"));
  });
});

/* ------------------------------------------------------------------ */
/* 세율 — 법 제104조 제1항                                              */
/* ------------------------------------------------------------------ */

describe("단기 보유 세율", () => {
  const short = (assetType: CapitalGainsInput["assetType"], transferDate: string) =>
    ok({
      ...base,
      assetType,
      acquisitionDate: "2025-01-01",
      transferDate,
      transferPrice: 600_000_000,
      acquisitionPrice: 500_000_000,
    });

  it("주택 1년 미만은 70%다", () => {
    const r = short("house", "2025-12-30");
    assert.equal(r.holdingYears, 0);
    assert.equal(r.rate.flatRate, 0.7);
  });

  it("주택 1년 이상 2년 미만은 60%다", () => {
    const r = short("house", "2026-06-30");
    assert.equal(r.holdingYears, 1);
    assert.equal(r.rate.flatRate, 0.6);
  });

  it("조합원입주권도 70% / 60%다", () => {
    assert.equal(short("residencyRight", "2025-12-30").rate.flatRate, 0.7);
    assert.equal(short("residencyRight", "2026-06-30").rate.flatRate, 0.6);
  });

  it("그 밖의 토지·건물은 50% / 40%다", () => {
    assert.equal(short("land", "2025-12-30").rate.flatRate, 0.5);
    assert.equal(short("land", "2026-06-30").rate.flatRate, 0.4);
  });

  it("1년 경계 하루 차이로 세율이 70%에서 60%로 바뀐다", () => {
    // 취득 2025-01-01 → 1년 충족일 2025-12-31
    assert.equal(short("house", "2025-12-30").rate.flatRate, 0.7);
    assert.equal(short("house", "2025-12-31").rate.flatRate, 0.6);
  });

  it("2년 경계 하루 차이로 단일세율에서 기본세율로 바뀐다", () => {
    assert.equal(short("house", "2026-12-30").rate.flatRate, 0.6);
    const long = short("house", "2026-12-31");
    assert.equal(long.rate.kind, "basic");
    assert.equal(long.rate.flatRate, null);
  });

  it("분양권은 2년 이상 보유해도 60% 단일세율이다", () => {
    const r = ok({
      ...base,
      assetType: "salesRight",
      acquisitionDate: "2020-01-01",
      transferDate: "2026-06-30",
      transferPrice: 600_000_000,
      acquisitionPrice: 500_000_000,
    });
    assert.equal(r.holdingYears, 6);
    assert.equal(r.rate.flatRate, 0.6);
  });

  it("단기 세액은 과세표준 × 세율이다", () => {
    // 양도차익 1억, 장특공 없음, 기본공제 250만 → 과세표준 9,750만 × 70%
    const r = short("house", "2025-12-30");
    assert.equal(r.taxBase, 97_500_000);
    assert.equal(r.incomeTax, 68_250_000);
    assert.equal(r.localTax, 6_825_000);
    assert.equal(r.totalTax, 75_075_000);
  });
});

/* ------------------------------------------------------------------ */
/* 다주택 중과 — 법 제104조 제7항                                        */
/* ------------------------------------------------------------------ */

describe("조정대상지역 다주택 중과", () => {
  const heavy = (housesOwned: 1 | 2 | 3, extra: Partial<CapitalGainsInput> = {}) =>
    ok({
      ...base,
      housesOwned,
      adjustedAreaAtTransfer: true,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      transferPrice: 1_000_000_000,
      acquisitionPrice: 500_000_000,
      ...extra,
    });

  it("2주택은 기본세율 + 20%p", () => {
    const r = heavy(2);
    assert.equal(r.rate.surcharge, 0.2);
    assert.equal(r.longTerm.amount, 0);
    assert.ok(r.longTerm.excludedReason?.includes("중과"));
    // 양도차익 5억, 장특공 배제, 기본공제 250만 → 과세표준 497,500,000
    assert.equal(r.taxBase, 497_500_000);
    // 기본세율 174,060,000 − ... : 94,060,000 + (497,500,000−300,000,000)×40% = 173,060,000
    // 중과 20%p: 497,500,000 × 20% = 99,500,000
    assert.equal(r.incomeTax, 173_060_000 + 99_500_000);
  });

  it("3주택 이상은 기본세율 + 30%p", () => {
    const r = heavy(3);
    assert.equal(r.rate.surcharge, 0.3);
    assert.equal(r.incomeTax, 173_060_000 + 149_250_000);
  });

  it("일반지역이면 중과되지 않고 장기보유특별공제가 살아난다", () => {
    const r = heavy(3, { adjustedAreaAtTransfer: false });
    assert.equal(r.rate.surcharge, 0);
    assert.equal(r.longTerm.table, "표1");
  });

  it("1주택이면 중과 대상이 아니다", () => {
    assert.equal(heavy(1).rate.surcharge, 0);
  });

  it("중과 배제 대상을 선택하면 기본세율로 계산한다", () => {
    const r = heavy(3, { heavyTaxExcluded: true });
    assert.equal(r.rate.surcharge, 0);
    assert.equal(r.rate.kind, "basic");
    assert.equal(r.longTerm.table, "표1");
  });

  it("보유 2년 미만 중과 대상은 중과세액과 단기세액 중 큰 세액을 적용한다", () => {
    const r = heavy(2, { acquisitionDate: "2025-01-01", transferDate: "2026-06-30" });
    assert.equal(r.rate.kind, "heavyVsShort");
    assert.equal(r.rate.compared.length, 2);
    const max = Math.max(...r.rate.compared.map((c) => c.tax));
    assert.equal(r.incomeTax, max);
  });

  it("2주택 1년 미만은 70% 단기세액이 중과세액보다 커서 70%가 적용된다", () => {
    // 기본세율 최고 45% + 20%p = 65% < 70%
    const r = heavy(2, { acquisitionDate: "2026-01-02", transferDate: "2026-06-30" });
    const short = r.rate.compared.find((c) => c.label.includes("단기"))!;
    assert.equal(r.incomeTax, short.tax);
  });

  it("한시 배제 종료일 이후 양도에는 경과조치 안내가 붙는다", () => {
    const r = heavy(3);
    assert.equal(r.notes.some((n) => n.includes("2026-05-09")), true);
  });

  it("한시 배제 기간 내 양도에는 배제 안내가 붙는다", () => {
    const r = heavy(3, { transferDate: "2026-05-09" });
    assert.equal(r.notes.some((n) => n.includes("제167조의3")), true);
  });

  it("전액 비과세되는 1세대 1주택은 중과 대상이 되지 않는다", () => {
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      housesOwned: 1,
      adjustedAreaAtTransfer: true,
      transferPrice: 1_000_000_000,
      residenceMonths: 120,
    });
    assert.equal(r.totalTax, 0);
  });
});

/* ------------------------------------------------------------------ */
/* 기본공제·지방소득세·전체 흐름                                          */
/* ------------------------------------------------------------------ */

describe("기본공제와 지방소득세", () => {
  it("연 250만원을 공제한다", () => {
    const r = ok({ ...base, transferPrice: 600_000_000, acquisitionPrice: 500_000_000 });
    assert.equal(r.basicDeduction, BASIC_DEDUCTION);
  });

  it("이미 사용한 기본공제만큼 줄어든다", () => {
    const r = ok({
      ...base,
      transferPrice: 600_000_000,
      acquisitionPrice: 500_000_000,
      basicDeductionUsed: 1_000_000,
    });
    assert.equal(r.basicDeduction, 1_500_000);
  });

  it("양도소득금액보다 큰 기본공제는 양도소득금액까지만 적용된다", () => {
    // 양도차익 100만원, 보유 10년 표1 20% → 장특공 20만원, 양도소득금액 80만원
    const r = ok({ ...base, transferPrice: 501_000_000, acquisitionPrice: 500_000_000 });
    assert.equal(r.gainAmount, 800_000);
    assert.equal(r.basicDeduction, 800_000);
    assert.equal(r.taxBase, 0);
    assert.equal(r.totalTax, 0);
  });

  it("지방소득세는 산출세액의 10%다", () => {
    const r = ok({ ...base, transferPrice: 600_000_000, acquisitionPrice: 500_000_000 });
    assert.equal(r.localTax, Math.floor(r.incomeTax * 0.1));
    assert.equal(r.totalTax, r.incomeTax + r.localTax);
  });

  it("양도차익이 없으면 세액이 0이다", () => {
    const r = ok({ ...base, transferPrice: 400_000_000, acquisitionPrice: 500_000_000 });
    assert.equal(r.grossGain, -100_000_000);
    assert.equal(r.taxableGain, 0);
    assert.equal(r.totalTax, 0);
    assert.equal(r.notes.some((n) => n.includes("양도차익이 0 이하")), true);
  });

  it("필요경비가 양도차익을 줄인다", () => {
    const withExpense = ok({ ...base, transferPrice: 600_000_000, acquisitionPrice: 500_000_000, expenses: 10_000_000 });
    assert.equal(withExpense.grossGain, 90_000_000);
  });
});

/* ------------------------------------------------------------------ */
/* 연도별 규칙 관리                                                      */
/* ------------------------------------------------------------------ */

describe("연도별 규칙", () => {
  it("확인한 마지막 연도 이후 양도는 가정 계산을 선택해야 계산된다", () => {
    const next = LAST_VERIFIED_CG_YEAR + 1;
    const args: CapitalGainsInput = { ...base, transferDate: `${next}-06-30` };
    assert.equal(calculateCapitalGains(args).ok, false);
    const r = ok({ ...args, assumeLatestRules: true });
    assert.equal(r.status, "verificationRequired");
    assert.equal(r.verificationNotes.some((n) => n.includes("가정 계산")), true);
  });

  it("등록되지 않은 과거 연도는 거부한다", () => {
    const r = calculateCapitalGains({ ...base, acquisitionDate: "2010-01-01", transferDate: "2015-06-30" });
    assert.equal(r.ok, false);
  });

  it("2026년 양도는 확정 상태다", () => {
    const r = ok({ ...base, transferDate: "2026-06-30" });
    assert.equal(r.status, "confirmed");
  });
});

/* ------------------------------------------------------------------ */
/* 입력 검증                                                            */
/* ------------------------------------------------------------------ */

describe("입력 검증", () => {
  it("잘못된 날짜 형식을 거부한다", () => {
    assert.equal(calculateCapitalGains({ ...base, acquisitionDate: "2026-02-30" }).ok, false);
    assert.equal(calculateCapitalGains({ ...base, transferDate: "20260630" }).ok, false);
  });

  it("양도일이 취득일보다 빠르면 거부한다", () => {
    const r = calculateCapitalGains({ ...base, acquisitionDate: "2026-06-30", transferDate: "2026-06-29" });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes("빠를 수 없습니다")), true);
  });

  it("음수·소수 금액을 거부한다", () => {
    assert.equal(calculateCapitalGains({ ...base, acquisitionPrice: -1 }).ok, false);
    assert.equal(calculateCapitalGains({ ...base, expenses: 1.5 }).ok, false);
  });

  it("양도가액 0을 거부한다", () => {
    assert.equal(calculateCapitalGains({ ...base, transferPrice: 0 }).ok, false);
  });
});

/* ------------------------------------------------------------------ */
/* 공식 예시 회귀                                                        */
/* ------------------------------------------------------------------ */

describe("공식 예시 회귀", () => {
  it("1세대 1주택 20억(취득 10억, 보유·거주 10년) 고가주택", () => {
    const r = ok({
      ...base,
      oneHouseOneHousehold: true,
      transferPrice: 2_000_000_000,
      acquisitionPrice: 1_000_000_000,
      acquisitionDate: "2016-01-01",
      transferDate: "2026-06-30",
      residenceMonths: 120,
    });
    assert.equal(r.grossGain, 1_000_000_000);
    assert.equal(r.taxableGain, 400_000_000);   // × (20억−12억)/20억
    assert.equal(r.longTerm.amount, 320_000_000); // 80%
    assert.equal(r.gainAmount, 80_000_000);
    assert.equal(r.taxBase, 77_500_000);
    // 6,240,000 + (77,500,000 − 50,000,000) × 24% = 12,840,000
    assert.equal(r.incomeTax, 12_840_000);
    assert.equal(r.localTax, 1_284_000);
    assert.equal(r.totalTax, 14_124_000);
  });

  it("일반 2년 이상 보유 주택 (취득 3억 → 양도 5억)", () => {
    const r = ok({
      ...base,
      transferPrice: 500_000_000,
      acquisitionPrice: 300_000_000,
      acquisitionDate: "2023-01-01",
      transferDate: "2026-06-30",
    });
    assert.equal(r.grossGain, 200_000_000);
    assert.equal(r.longTerm.table, "표1");
    assert.equal(r.longTerm.holdingRate, 0.06); // 보유 3년
    assert.equal(r.longTerm.amount, 12_000_000);
    assert.equal(r.gainAmount, 188_000_000);
    assert.equal(r.taxBase, 185_500_000);
    // 37,060,000 + (185,500,000 − 150,000,000) × 38% = 50,550,000
    assert.equal(r.incomeTax, 50_550_000);
  });

  it("계산 과정 단계가 모두 채워진다", () => {
    const r = ok({ ...base, transferPrice: 600_000_000, acquisitionPrice: 500_000_000 });
    assert.ok(r.steps.length >= 7);
    for (const s of r.steps) {
      assert.ok(s.label.length > 0);
      assert.ok(s.expression.length > 0);
      assert.ok(s.value.length > 0);
    }
  });
});
