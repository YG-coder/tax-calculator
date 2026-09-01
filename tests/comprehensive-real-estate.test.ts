import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AGE_CREDIT_TABLE,
  BASIC_DEDUCTION_GENERAL,
  BASIC_DEDUCTION_ONE_HOUSE,
  CRET_FAIR_MARKET_RATIO,
  HOLDING_CREDIT_TABLE,
  LAST_VERIFIED_CRET_YEAR,
  RURAL_TAX_RATE,
  TAX_BURDEN_CAP_RATE,
  calculateComprehensiveRealEstateTax,
  cretRateTable,
  cretTaxByTable,
  lookupCreditPercent,
  type CretInput,
  type CretSuccess,
} from "../src/lib/tax/rules/comprehensive-real-estate.ts";

const ok = (input: CretInput): CretSuccess => {
  const r = calculateComprehensiveRealEstateTax(input);
  if (!r.ok) throw new Error(`계산 실패: ${r.errors.join(" / ")}`);
  return r;
};

const base: CretInput = {
  year: 2026,
  publishedPriceTotal: 2_000_000_000,
  ownershipType: "sole",
  isOneHouseOneHousehold: true,
  houseCount: 1,
  age: null,
  holdingYears: null,
};

/* ------------------------------------------------------------------ */
/* 세율표 경계 — 법 제9조 제1항                                          */
/* ------------------------------------------------------------------ */

describe("주택분 세율표 경계", () => {
  const t2 = cretRateTable(2);
  const t3 = cretRateTable(3);

  it("2주택 이하 세율표의 각 구간 경계값", () => {
    assert.equal(cretTaxByTable(0, t2), 0);
    assert.equal(cretTaxByTable(300_000_000, t2), 1_500_000);
    assert.equal(cretTaxByTable(600_000_000, t2), 3_600_000);
    assert.equal(cretTaxByTable(1_200_000_000, t2), 9_600_000);
    assert.equal(cretTaxByTable(2_500_000_000, t2), 26_500_000);
    assert.equal(cretTaxByTable(5_000_000_000, t2), 64_000_000);
    assert.equal(cretTaxByTable(9_400_000_000, t2), 152_000_000);
    assert.equal(cretTaxByTable(10_000_000_000, t2), 168_200_000);
  });

  it("3주택 이상 세율표의 각 구간 경계값", () => {
    assert.equal(cretTaxByTable(300_000_000, t3), 1_500_000);
    assert.equal(cretTaxByTable(600_000_000, t3), 3_600_000);
    assert.equal(cretTaxByTable(1_200_000_000, t3), 9_600_000);
    assert.equal(cretTaxByTable(2_500_000_000, t3), 35_600_000);
    assert.equal(cretTaxByTable(5_000_000_000, t3), 110_600_000);
    assert.equal(cretTaxByTable(9_400_000_000, t3), 286_600_000);
    assert.equal(cretTaxByTable(10_000_000_000, t3), 316_600_000);
  });

  it("12억원 이하 구간은 두 표가 같다", () => {
    for (const tb of [1, 300_000_000, 600_000_000, 900_000_000, 1_200_000_000]) {
      assert.equal(cretTaxByTable(tb, t2), cretTaxByTable(tb, t3));
    }
  });

  it("12억원을 넘으면 3주택 이상 세율이 더 무겁다", () => {
    assert.ok(cretTaxByTable(1_200_000_001, t3) > cretTaxByTable(1_200_000_001, t2));
  });

  it("주택 수 2와 3의 경계에서 표가 바뀐다", () => {
    assert.equal(cretRateTable(2), cretRateTable(1));
    assert.notEqual(cretRateTable(3), cretRateTable(2));
    assert.equal(cretRateTable(10), cretRateTable(3));
  });
});

/* ------------------------------------------------------------------ */
/* 기본공제와 과세표준 — 법 제8조 제1항, 영 제2조의4                      */
/* ------------------------------------------------------------------ */

describe("기본공제와 과세표준", () => {
  it("1세대 1주택자는 12억원, 그 밖은 9억원을 공제한다", () => {
    assert.equal(ok(base).basicDeduction, BASIC_DEDUCTION_ONE_HOUSE);
    assert.equal(ok({ ...base, isOneHouseOneHousehold: false }).basicDeduction, BASIC_DEDUCTION_GENERAL);
  });

  it("공시가격이 공제금액 이하이면 세액이 0이다", () => {
    const r = ok({ ...base, publishedPriceTotal: BASIC_DEDUCTION_ONE_HOUSE });
    assert.equal(r.taxBase, 0);
    assert.equal(r.totalPayable, 0);
    assert.equal(r.notes.some((n) => n.includes("납세의무가 없습니다")), true);
  });

  it("공제금액을 1원 넘으면 과세표준이 생긴다", () => {
    const r = ok({ ...base, publishedPriceTotal: BASIC_DEDUCTION_ONE_HOUSE + 1_000_000 });
    assert.equal(r.afterDeduction, 1_000_000);
    assert.equal(r.taxBase, 600_000);
  });

  it("과세표준 = (공시가격 − 공제) × 공정시장가액비율 60%", () => {
    const r = ok(base); // 20억 − 12억 = 8억
    assert.equal(r.fairMarketRatio, CRET_FAIR_MARKET_RATIO);
    assert.equal(r.afterDeduction, 800_000_000);
    assert.equal(r.taxBase, 480_000_000);
  });
});

/* ------------------------------------------------------------------ */
/* 재산세 중복분 공제 — 법 제9조 제3항, 영 제4조의3                       */
/* ------------------------------------------------------------------ */

describe("재산세 중복분 공제", () => {
  it("1세대 1주택 20억 주택의 공제액", () => {
    const r = ok(base);
    // 재산세 공정시장가액비율 45% (1세대 1주택, 6억 초과)
    assert.equal(r.propertyTaxCredit.fmvRatio, 0.45);
    assert.equal(r.propertyTaxCredit.propertyTaxBase, 900_000_000);
    // 분모: 표준세율(9억) = 570,000 + 6억 × 0.4% = 2,970,000
    assert.equal(r.propertyTaxCredit.denominator, 2_970_000);
    // 분자: 표준세율(4.8억 × 45% = 2.16억) = 195,000 + 6,600만 × 0.25% = 360,000
    assert.equal(r.propertyTaxCredit.numerator, 360_000);
    assert.equal(r.propertyTaxCredit.amount, 360_000);
    assert.equal(r.grossTax, 2_760_000);
    assert.equal(r.calculatedTax, 2_400_000);
  });

  it("1세대 1주택이 아니면 재산세 공정시장가액비율이 60%다", () => {
    const r = ok({ ...base, isOneHouseOneHousehold: false, houseCount: 2 });
    assert.equal(r.propertyTaxCredit.fmvRatio, 0.6);
    assert.equal(r.propertyTaxCredit.propertyTaxBase, 1_200_000_000);
    assert.equal(r.propertyTaxCredit.denominator, 4_170_000);
    assert.equal(r.propertyTaxCredit.numerator, 954_000);
    assert.equal(r.grossTax, 4_200_000);
    assert.equal(r.calculatedTax, 3_246_000);
  });

  it("실제 재산세를 입력하면 그 금액으로 안분한다", () => {
    const estimated = ok(base);
    const given = ok({ ...base, propertyTaxPaid: 1_485_000 }); // 추정치의 절반
    assert.equal(estimated.propertyTaxCredit.estimated, true);
    assert.equal(given.propertyTaxCredit.estimated, false);
    assert.equal(given.propertyTaxCredit.amount, 180_000);
  });

  it("공제액은 세율 적용액을 넘지 않는다", () => {
    const r = ok({ ...base, publishedPriceTotal: 1_210_000_000, propertyTaxPaid: 999_999_999 });
    assert.equal(r.propertyTaxCredit.amount, r.grossTax);
    assert.equal(r.calculatedTax, 0);
  });

  it("재산세를 입력하지 않으면 추정 안내가 붙는다", () => {
    assert.equal(ok(base).notes.some((n) => n.includes("실제 재산세 본세를 입력")), true);
  });
});

/* ------------------------------------------------------------------ */
/* 세액공제 — 법 제9조 제5항~제9항                                       */
/* ------------------------------------------------------------------ */

describe("고령자·장기보유 세액공제", () => {
  it("연령별 공제율 경계", () => {
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 59).percent, 0);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 60).percent, 20);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 64).percent, 20);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 65).percent, 30);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 69).percent, 30);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 70).percent, 40);
    assert.equal(lookupCreditPercent(AGE_CREDIT_TABLE, 95).percent, 40);
  });

  it("보유기간별 공제율 경계", () => {
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 4).percent, 0);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 5).percent, 20);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 9).percent, 20);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 10).percent, 40);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 14).percent, 40);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 15).percent, 50);
    assert.equal(lookupCreditPercent(HOLDING_CREDIT_TABLE, 40).percent, 50);
  });

  it("만 65세 · 보유 12년이면 70%를 공제한다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12 });
    assert.equal(r.taxCredits.agePercent, 30);
    assert.equal(r.taxCredits.holdingPercent, 40);
    assert.equal(r.taxCredits.appliedPercent, 70);
    assert.equal(r.taxCredits.capped, false);
    assert.equal(r.taxCredits.amount, 1_680_000);
    assert.equal(r.afterCredits, 720_000);
  });

  it("합계가 80%를 넘으면 80%로 제한된다", () => {
    const r = ok({ ...base, age: 70, holdingYears: 15 });
    assert.equal(r.taxCredits.agePercent, 40);
    assert.equal(r.taxCredits.holdingPercent, 50);
    assert.equal(r.taxCredits.appliedPercent, 80);
    assert.equal(r.taxCredits.capped, true);
    assert.equal(r.taxCredits.amount, 1_920_000);
    assert.equal(r.afterCredits, 480_000);
  });

  it("1세대 1주택자가 아니면 세액공제가 없다", () => {
    const r = ok({ ...base, isOneHouseOneHousehold: false, age: 75, holdingYears: 30 });
    assert.equal(r.taxCredits.appliedPercent, 0);
    assert.equal(r.taxCredits.amount, 0);
  });

  it("나이·보유기간을 입력하지 않으면 안내가 붙는다", () => {
    const r = ok(base);
    assert.equal(r.notes.some((n) => n.includes("만 나이")), true);
    assert.equal(r.notes.some((n) => n.includes("보유기간")), true);
  });
});

/* ------------------------------------------------------------------ */
/* 공동명의 — 법 제10조의2                                              */
/* ------------------------------------------------------------------ */

describe("공동명의 처리", () => {
  const joint: CretInput = {
    ...base,
    ownershipType: "spouseJoint",
    ownershipRatio: 0.5,
    isOneHouseOneHousehold: false,
  };

  it("특례를 신청하지 않으면 지분만큼만 과세하고 9억을 공제한다", () => {
    const r = ok(joint);
    assert.equal(r.publishedPrice, 1_000_000_000);
    assert.equal(r.basicDeduction, BASIC_DEDUCTION_GENERAL);
    assert.equal(r.taxBase, 60_000_000);
    assert.equal(r.grossTax, 300_000);
    assert.equal(r.treatedAsOneHouse, false);
    assert.equal(r.calculatedTax, 264_000);
  });

  it("특례를 신청하면 주택 전체를 1세대 1주택자로 계산한다", () => {
    const r = ok({ ...joint, applyJointOneHouseSpecial: true, age: 70, holdingYears: 15 });
    assert.equal(r.treatedAsOneHouse, true);
    assert.equal(r.publishedPrice, 2_000_000_000);
    assert.equal(r.basicDeduction, BASIC_DEDUCTION_ONE_HOUSE);
    assert.equal(r.taxCredits.appliedPercent, 80);
    assert.equal(r.afterCredits, 480_000);
  });

  it("특례 신청 여부를 비교할 수 있게 안내한다", () => {
    assert.equal(ok(joint).notes.some((n) => n.includes("제10조의2")), true);
  });

  it("다른 주택이 있으면 특례를 적용할 수 없다", () => {
    const r = calculateComprehensiveRealEstateTax({
      ...joint,
      applyJointOneHouseSpecial: true,
      houseCount: 2,
    });
    assert.equal(r.ok, false);
  });

  it("지분율 경계값", () => {
    assert.equal(calculateComprehensiveRealEstateTax({ ...joint, ownershipRatio: 0 }).ok, false);
    assert.equal(calculateComprehensiveRealEstateTax({ ...joint, ownershipRatio: 1.01 }).ok, false);
    assert.equal(ok({ ...joint, ownershipRatio: 1 }).publishedPrice, 2_000_000_000);
  });
});

/* ------------------------------------------------------------------ */
/* 세부담 상한 — 법 제10조                                              */
/* ------------------------------------------------------------------ */

describe("세부담 상한", () => {
  it("직전년도 총세액을 입력하지 않으면 검토하지 않는다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12 });
    assert.equal(r.burdenCap.checked, false);
    assert.equal(r.burdenCap.excluded, 0);
    assert.equal(r.notes.some((n) => n.includes("세부담 상한")), true);
  });

  it("직전년도 총세액의 150%를 넘으면 초과분을 제외한다", () => {
    // 당해 총세액상당액 = 재산세 2,970,000 + 종부세 720,000 = 3,690,000
    // 직전년도 2,000,000 × 150% = 3,000,000 → 초과 690,000
    const r = ok({ ...base, age: 65, holdingYears: 12, prevYearTotalTax: 2_000_000 });
    assert.equal(r.burdenCap.checked, true);
    assert.equal(r.burdenCap.limit, 3_000_000);
    assert.equal(r.burdenCap.currentTotal, 3_690_000);
    assert.equal(r.burdenCap.applied, true);
    assert.equal(r.burdenCap.excluded, 690_000);
    assert.equal(r.comprehensiveTax, 30_000);
  });

  it("상한에 걸리지 않으면 그대로 부과된다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12, prevYearTotalTax: 10_000_000 });
    assert.equal(r.burdenCap.applied, false);
    assert.equal(r.comprehensiveTax, 720_000);
  });

  it("상한 초과분은 종합부동산세액을 넘어 차감되지 않는다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12, prevYearTotalTax: 0 });
    assert.equal(r.comprehensiveTax, 0);
    assert.equal(r.totalPayable, 0);
  });

  it("세부담 상한율은 150%다", () => {
    assert.equal(TAX_BURDEN_CAP_RATE, 1.5);
  });
});

/* ------------------------------------------------------------------ */
/* 농어촌특별세와 최종 납부액                                             */
/* ------------------------------------------------------------------ */

describe("농어촌특별세와 최종 납부액", () => {
  it("농어촌특별세는 종합부동산세의 20%다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12 });
    assert.equal(RURAL_TAX_RATE, 0.2);
    assert.equal(r.comprehensiveTax, 720_000);
    assert.equal(r.ruralTax, 144_000);
    assert.equal(r.totalPayable, 864_000);
  });

  it("종합부동산세가 0이면 농어촌특별세도 0이다", () => {
    const r = ok({ ...base, publishedPriceTotal: 1_000_000_000 });
    assert.equal(r.comprehensiveTax, 0);
    assert.equal(r.ruralTax, 0);
    assert.equal(r.totalPayable, 0);
  });

  it("10원 미만은 절사한다", () => {
    const r = ok({ ...base, publishedPriceTotal: 1_200_000_100 });
    assert.equal(r.comprehensiveTax % 10, 0);
    assert.equal(r.ruralTax % 10, 0);
  });

  it("계산 과정이 요구된 11단계로 나온다", () => {
    const r = ok({ ...base, age: 65, holdingYears: 12, prevYearTotalTax: 2_000_000 });
    assert.equal(r.steps.length, 11);
    const labels = r.steps.map((s) => s.label);
    assert.ok(labels[0].includes("공시가격"));
    assert.ok(labels[1].includes("공제"));
    assert.ok(labels[2].includes("과세표준"));
    assert.ok(labels[3].includes("세율"));
    assert.ok(labels[4].includes("재산세"));
    assert.ok(labels[5].includes("산출세액"));
    assert.ok(labels[6].includes("세액공제"));
    assert.ok(labels[7].includes("세부담 상한"));
    assert.ok(labels[8].includes("종합부동산세"));
    assert.ok(labels[9].includes("농어촌특별세"));
    assert.ok(labels[10].includes("최종"));
  });
});

/* ------------------------------------------------------------------ */
/* 연도 관리와 입력 검증                                                 */
/* ------------------------------------------------------------------ */

describe("연도 관리와 입력 검증", () => {
  it("확인한 마지막 연도 이후는 가정 계산을 선택해야 계산된다", () => {
    const next = LAST_VERIFIED_CRET_YEAR + 1;
    assert.equal(calculateComprehensiveRealEstateTax({ ...base, year: next }).ok, false);
    const r = ok({ ...base, year: next, assumeLatestRules: true });
    assert.equal(r.status, "verificationRequired");
  });

  it("과거 연도는 조용히 같은 값을 쓰지 않고 거부한다", () => {
    const r = calculateComprehensiveRealEstateTax({ ...base, year: LAST_VERIFIED_CRET_YEAR - 1 });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes("등록되어 있지 않습니다")), true);
  });

  it("2026년은 확정 상태다", () => {
    assert.equal(ok(base).status, "confirmed");
  });

  it("음수·소수 공시가격을 거부한다", () => {
    assert.equal(calculateComprehensiveRealEstateTax({ ...base, publishedPriceTotal: -1 }).ok, false);
    assert.equal(calculateComprehensiveRealEstateTax({ ...base, publishedPriceTotal: 1.5 }).ok, false);
  });

  it("나이·보유기간 범위를 검증한다", () => {
    assert.equal(calculateComprehensiveRealEstateTax({ ...base, age: -1 }).ok, false);
    assert.equal(calculateComprehensiveRealEstateTax({ ...base, holdingYears: 200 }).ok, false);
  });

  it("법인·토지분을 미지원으로 명시한다", () => {
    const r = ok(base);
    assert.equal(r.unsupported.some((u) => u.includes("법인")), true);
    assert.equal(r.unsupported.some((u) => u.includes("토지")), true);
    assert.equal(r.unsupported.some((u) => u.includes("합산배제")), true);
  });
});
