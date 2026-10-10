import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { carTaxResultTitle } from "../src/lib/car-tax-presentation.ts";
import {
  ageDiscountPercent,
  ageDiscountRate,
  calculateCarTax,
  floorTo10,
  parseIntegerInput,
  prepayDeductiblePeriod,
  prepayInterestRate,
  prepayDayBase,
  isLeapYear,
  isPrepayTimingSupported,
  UNVERIFIED_PREPAY_TIMINGS,
  LAST_VERIFIED_PREPAY_YEAR,
  SECOND_HALF_DAY_BASE,
  LUMP_SUM_LEVY_THRESHOLD,
  vehicleAgeForHalf,
  type CarTaxInput,
  type CarTaxSuccess,
} from "../src/lib/tax/rules/car-tax.ts";

const ok = (input: CarTaxInput): CarTaxSuccess => {
  const result = calculateCarTax(input);
  if (!result.ok) throw new Error(`계산 실패: ${result.errors.join(" / ")}`);
  return result;
};

const base: CarTaxInput = {
  year: 2026,
  usage: "nonBusiness",
  vehicleType: "passenger",
  displacementCc: 1998,
  firstRegistrationDate: "2025-03-10",
  period: "year",
  prepay: "none",
};

describe("배기량 구간 경계 — 비영업용 승용", () => {
  it("1,000cc는 80원/cc 구간이다", () => {
    const r = ok({ ...base, displacementCc: 1000 });
    assert.equal(r.ccRate, 80);
    assert.equal(r.annualBaseTax, 80_000);
  });

  it("1,001cc는 140원/cc 구간으로 넘어간다", () => {
    const r = ok({ ...base, displacementCc: 1001 });
    assert.equal(r.ccRate, 140);
    assert.equal(r.annualBaseTax, 140_140);
  });

  it("1,600cc는 140원/cc 구간이다", () => {
    const r = ok({ ...base, displacementCc: 1600 });
    assert.equal(r.ccRate, 140);
    assert.equal(r.annualBaseTax, 224_000);
  });

  it("1,601cc는 200원/cc 구간으로 넘어간다", () => {
    const r = ok({ ...base, displacementCc: 1601 });
    assert.equal(r.ccRate, 200);
    assert.equal(r.annualBaseTax, 320_200);
  });
});

describe("배기량 구간 경계 — 영업용 승용", () => {
  it("1,600cc 이하는 18원/cc", () => {
    assert.equal(ok({ ...base, usage: "business", displacementCc: 1600 }).ccRate, 18);
  });
  it("2,000cc 이하는 19원/cc", () => {
    assert.equal(ok({ ...base, usage: "business", displacementCc: 2000 }).ccRate, 19);
  });
  it("2,500cc 이하는 19원/cc", () => {
    assert.equal(ok({ ...base, usage: "business", displacementCc: 2500 }).ccRate, 19);
  });
  it("2,501cc 초과는 24원/cc", () => {
    assert.equal(ok({ ...base, usage: "business", displacementCc: 2501 }).ccRate, 24);
  });
  it("영업용에는 지방교육세가 붙지 않는다", () => {
    const r = ok({ ...base, usage: "business", displacementCc: 2000 });
    assert.equal(r.educationTax, 0);
  });
});

describe("차령 계산 — 시행령 제122조", () => {
  it("기산일이 상반기이면 두 기분 모두 (과세연도 − 기산연도) + 1", () => {
    assert.equal(vehicleAgeForHalf(2020, 3, 2026, 1), 7);
    assert.equal(vehicleAgeForHalf(2020, 3, 2026, 2), 7);
  });

  it("기산일이 하반기이면 제1기분과 제2기분의 차령이 1년 차이난다", () => {
    assert.equal(vehicleAgeForHalf(2020, 9, 2026, 1), 6);
    assert.equal(vehicleAgeForHalf(2020, 9, 2026, 2), 7);
  });
});

describe("차령별 경감률", () => {
  it("차령 1년·2년은 경감 없음", () => {
    assert.equal(ageDiscountRate(1), 0);
    assert.equal(ageDiscountRate(2), 0);
  });
  it("차령 3년부터 5%씩 경감", () => {
    assert.ok(Math.abs((ageDiscountRate(3)) - (0.05)) < 10 ** -2 / 2);
    assert.ok(Math.abs((ageDiscountRate(4)) - (0.1)) < 10 ** -2 / 2);
  });
  it("차령 12년에서 50%로 최대", () => {
    assert.ok(Math.abs((ageDiscountRate(12)) - (0.5)) < 10 ** -2 / 2);
  });
  it("차령 12년 초과는 12년으로 보아 50%를 넘지 않는다", () => {
    assert.ok(Math.abs((ageDiscountRate(20)) - (0.5)) < 10 ** -2 / 2);
    assert.ok(Math.abs((ageDiscountRate(99)) - (0.5)) < 10 ** -2 / 2);
  });

  it("차령 2년 차량은 경감이 적용되지 않는다", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2025-03-01" });
    assert.equal(r.ageReduction, 0);
    assert.equal(r.carTax, 400_000);
  });

  it("차령 3년 차량은 제1·2기분 각각 5% 경감된다", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2024-03-01" });
    assert.equal(r.halves[0].vehicleAge, 3);
    assert.equal(r.carTax, 380_000); // 200,000 × 0.95 × 2
  });
});

describe("공식 예시 검증 — 서초구청 자동차세(소유분) 계산 예시", () => {
  // 1,997cc 비영업용, 2008.3.1 신규등록, 2017년 제1기분
  // 자동차세 119,820원 / 지방교육세 35,940원 / 합계 155,760원
  it("1,997cc · 2008-03-01 등록 · 2017년 제1기분", () => {
    const r = ok({
      year: 2017,
      usage: "nonBusiness",
      vehicleType: "passenger",
      displacementCc: 1997,
      firstRegistrationDate: "2008-03-01",
      period: "first",
      prepay: "none",
    });
    assert.equal(r.annualBaseTax, 399_400);
    assert.equal(r.halves[0].vehicleAge, 10);
    assert.equal(r.carTax, 119_820);
    assert.equal(r.educationTax, 35_940); // 35,946 → 10원 미만 절사
    assert.equal(r.finalPayable, 155_760);
  });
});

describe("상·하반기 분리", () => {
  it("기산일이 하반기인 차량은 제1기분과 제2기분 세액이 다르다", () => {
    const first = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2020-09-01", period: "first" });
    const second = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2020-09-01", period: "second" });
    assert.equal(first.halves[0].vehicleAge, 6);
    assert.equal(second.halves[0].vehicleAge, 7);
    assert.ok((first.carTax) > (second.carTax));
  });

  it("연간 세액은 두 기분의 합과 같다", () => {
    const args = { ...base, displacementCc: 2000, firstRegistrationDate: "2020-09-01" } as CarTaxInput;
    const year = ok({ ...args, period: "year" });
    const first = ok({ ...args, period: "first" });
    const second = ok({ ...args, period: "second" });
    assert.equal(year.carTax, first.carTax + second.carTax);
    assert.equal(year.educationTax, first.educationTax + second.educationTax);
  });
});

describe("전기자동차 등 그 밖의 승용자동차", () => {
  it("비영업용은 자동차세 10만원 + 지방교육세 3만원", () => {
    const r = ok({ ...base, vehicleType: "otherPassenger", displacementCc: null });
    assert.equal(r.annualBaseTax, 100_000);
    assert.equal(r.carTax, 100_000);
    assert.equal(r.educationTax, 30_000);
    assert.equal(r.finalPayable, 130_000);
  });

  it("영업용은 자동차세 2만원, 지방교육세 없음", () => {
    const r = ok({ ...base, vehicleType: "otherPassenger", usage: "business", displacementCc: null });
    assert.equal(r.carTax, 20_000);
    assert.equal(r.educationTax, 0);
  });

  it("차령이 오래되어도 경감되지 않는다", () => {
    const r = ok({
      ...base,
      vehicleType: "otherPassenger",
      displacementCc: null,
      firstRegistrationDate: "2010-01-01",
    });
    assert.equal(r.ageReduction, 0);
    assert.equal(r.carTax, 100_000);
  });
});

describe("연납 공제 — 법 제128조 제3항, 영 제125조 제6항 (5%)", () => {
  it("2026년 신청 시기별 공제대상 일수", () => {
    assert.equal(prepayDeductiblePeriod(2026, "jan").days, 334);
    assert.equal(prepayDeductiblePeriod(2026, "mar").days, 275);
    assert.equal(prepayDeductiblePeriod(2026, "jun").days, 184);
    assert.equal(prepayDeductiblePeriod(2026, "sep").days, 92);
  });

  it("윤년(2028년)에는 1월 연납 공제대상 일수가 335일이 된다", () => {
    assert.equal(prepayDeductiblePeriod(2028, "jan").days, 335);
  });

  it("2,000cc 비영업용 신차의 1월 연납 최종 납부액", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2025-03-01", prepay: "jan" });
    assert.equal(r.carTax, 400_000);
    assert.equal(r.educationTax, 120_000);
    assert.equal(r.prepay?.deductiblePeriod.days, 334);
    // 400,000 × 334/365 × 5% = 18,301.4 → 18,300
    assert.equal(r.prepay?.carTaxDeduction, 18_300);
    // 120,000 × 334/365 × 5% = 5,490.4 → 5,490
    assert.equal(r.prepay?.educationTaxDeduction, 5_490);
    assert.equal(r.finalPayable, 496_210);
  });

  it("신청 시기가 늦을수록 공제액이 줄어든다 (지원 시기 기준)", () => {
    const make = (prepay: CarTaxInput["prepay"]) =>
      ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2025-03-01", prepay });
    const jan = make("jan").prepay!.totalDeduction;
    const mar = make("mar").prepay!.totalDeduction;
    assert.ok(jan > mar);
    assert.ok(mar > 0);
  });

  it("공제대상 일수 자체는 신청 시기가 늦을수록 짧아진다", () => {
    const days = (timing: "jan" | "mar" | "jun" | "sep") => prepayDeductiblePeriod(2026, timing).days;
    assert.ok(days("jan") > days("mar"));
    assert.ok(days("mar") > days("jun"));
    assert.ok(days("jun") > days("sep"));
  });

  it("1월 연납 실효 공제율은 약 4.57%이다", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2025-03-01", prepay: "jan" });
    assert.ok(r.prepay);
    assert.ok(Math.abs(r.prepay.effectiveRate - 0.045753) < 10 ** -5 / 2);
  });
});

describe("승합·화물·특수자동차", () => {
  it("영업용 고속버스는 10만원", () => {
    const r = ok({ ...base, vehicleType: "van", usage: "business", vanClass: "highwayBus", displacementCc: null });
    assert.equal(r.carTax, 100_000);
  });

  it("비영업용 대형일반버스는 115,000원", () => {
    const r = ok({ ...base, vehicleType: "van", vanClass: "largeRegularBus", displacementCc: null });
    assert.equal(r.carTax, 115_000);
    assert.equal(r.educationTax, 0);
  });

  it("비영업용 고속버스는 세율이 규정되어 있지 않아 계산하지 않는다", () => {
    const r = calculateCarTax({ ...base, vehicleType: "van", vanClass: "highwayBus", displacementCc: null });
    assert.equal(r.ok, false);
  });

  it("화물자동차 적재정량 구간 경계", () => {
    assert.equal(ok({ ...base, vehicleType: "truck", loadCapacityKg: 1000, displacementCc: null }).carTax, 28_500);
    assert.equal(ok({ ...base, vehicleType: "truck", loadCapacityKg: 1001, displacementCc: null }).carTax, 34_500);
    assert.equal(ok({ ...base, vehicleType: "truck", usage: "business", loadCapacityKg: 10_000, displacementCc: null }).carTax, 45_000);
  });

  it("적재정량 1만kg 초과는 지원하지 않는다", () => {
    const r = calculateCarTax({ ...base, vehicleType: "truck", loadCapacityKg: 10_001, displacementCc: null });
    assert.equal(r.ok, false);
  });

  it("특수자동차 대형/소형", () => {
    assert.equal(ok({ ...base, vehicleType: "special", specialClass: "large", displacementCc: null }).carTax, 157_500);
    assert.equal(ok({ ...base, vehicleType: "special", usage: "business", specialClass: "small", displacementCc: null }).carTax, 13_500);
  });
});

describe("일할계산 — 법 제130조", () => {
  it("신규등록: 2026-04-15 등록 차량의 제1기분은 77/181일", () => {
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2026-04-15",
      period: "first",
      prorate: { kind: "newRegistration", date: "2026-04-15" },
    });
    assert.deepEqual(r.halves[0].prorate, { usedDays: 77, totalDays: 181 });
    // 200,000 × 77/181 = 85,082.8 → 85,080
    assert.equal(r.carTax, 85_080);
  });

  it("신규등록: 등록 이전 기분은 세액이 0이다", () => {
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2026-09-01",
      period: "first",
      prorate: { kind: "newRegistration", date: "2026-09-01" },
    });
    assert.equal(r.carTax, 0);
  });

  it("말소등록: 기분 초일 ~ 말소일까지만 과세한다", () => {
    // 제1기분 1/1~6/30 (181일), 3/31 말소 → 1/1~3/31 = 90일
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2020-01-10",
      period: "first",
      prorate: { kind: "deregistration", date: "2026-03-31" },
    });
    assert.deepEqual(r.halves[0].prorate, { usedDays: 90, totalDays: 181 });
  });

  it("말소등록: 말소일 이후 기분은 세액이 0이다", () => {
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2020-01-10",
      period: "second",
      prorate: { kind: "deregistration", date: "2026-03-31" },
    });
    assert.equal(r.carTax, 0);
  });

  it("말소등록 일할계산에도 차령 경감이 먼저 적용된다", () => {
    // 2020-01-10 등록 → 2026년 차령 7년 → 경감률 25%
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2020-01-10",
      period: "first",
      prorate: { kind: "deregistration", date: "2026-03-31" },
    });
    assert.equal(r.halves[0].vehicleAge, 7);
    assert.ok(Math.abs((r.halves[0].ageDiscountRate) - (0.25)) < 10 ** -2 / 2);
    // 200,000 × 0.75 × 90/181 = 74,585.6 → 74,580
    assert.equal(r.carTax, 74_580);
  });

  it("일할계산과 연납은 함께 계산하지 않는다", () => {
    const r = calculateCarTax({
      ...base,
      firstRegistrationDate: "2026-04-15",
      prorate: { kind: "newRegistration", date: "2026-04-15" },
      prepay: "jan",
    });
    assert.equal(r.ok, false);
  });
});

describe("연납 이자율의 과세연도별 관리 — 영 제125조 제6항", () => {
  it("연도별 이자율", () => {
    assert.equal(prepayInterestRate(2022)?.rate, 0.1);
    assert.equal(prepayInterestRate(2023)?.rate, 0.07);
    assert.equal(prepayInterestRate(2024)?.rate, 0.05);
    assert.equal(prepayInterestRate(2026)?.rate, 0.05);
  });

  it("2024년과 2025년 이후는 근거가 서로 다르다", () => {
    const y2024 = prepayInterestRate(2024)!;
    const y2025 = prepayInterestRate(2025)!;
    assert.equal(y2024.rate, y2025.rate);
    assert.notEqual(y2024.basis, y2025.basis);
    assert.ok((y2024.basis).includes("신설 2020. 12. 31."));
    assert.ok((y2025.basis).includes("개정 2024. 12. 31."));
  });

  it("확인한 마지막 연도까지는 verified, 그 이후는 unverified다", () => {
    assert.equal(prepayInterestRate(LAST_VERIFIED_PREPAY_YEAR)?.verified, true);
    assert.equal(prepayInterestRate(LAST_VERIFIED_PREPAY_YEAR + 1)?.verified, false);
  });

  it("확인 범위를 넘는 연도의 연납은 기본적으로 거부한다", () => {
    const r = calculateCarTax({
      ...base,
      year: LAST_VERIFIED_PREPAY_YEAR + 1,
      displacementCc: 2000,
      firstRegistrationDate: "2020-03-01",
      prepay: "jan",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes("확인되지 않았습니다")), true);
  });

  it("가정 계산을 명시적으로 선택하면 계산하되 검증 필요 상태가 된다", () => {
    const r = ok({
      ...base,
      year: LAST_VERIFIED_PREPAY_YEAR + 1,
      displacementCc: 2000,
      firstRegistrationDate: "2020-03-01",
      prepay: "jan",
      assumeLatestPrepayRate: true,
    });
    assert.equal(r.status, "verificationRequired");
    assert.equal(r.verificationNotes.some((n) => n.includes("가정 계산")), true);
    assert.equal(r.prepay?.interestRate, 0.05);
  });

  it("연납을 쓰지 않으면 미확인 연도라도 계산된다", () => {
    const r = ok({
      ...base,
      year: LAST_VERIFIED_PREPAY_YEAR + 5,
      displacementCc: 2000,
      firstRegistrationDate: "2020-03-01",
      prepay: "none",
    });
    assert.equal(r.status, "confirmed");
    assert.ok((r.carTax) > (0));
  });

  it("이자율 표에 없는 연도는 연납을 계산하지 않는다", () => {
    assert.equal(prepayInterestRate(2019), null);
    const r = calculateCarTax({
      ...base,
      year: 2019,
      displacementCc: 2000,
      firstRegistrationDate: "2018-03-01",
      prepay: "jan",
    });
    assert.equal(r.ok, false);
  });

  it("2023년 연납은 7% 이자율로 계산된다", () => {
    const r = ok({
      ...base,
      year: 2023,
      displacementCc: 2000,
      firstRegistrationDate: "2022-03-01",
      prepay: "jan",
    });
    assert.equal(r.prepay?.interestRate, 0.07);
    assert.ok(r.prepay);
    assert.ok(Math.abs(r.prepay.effectiveRate - (334 / 365) * 0.07) < 10 ** -6 / 2);
  });

  it("윤년 과세연도에는 분모가 366일이 된다 (법 §128③ 계산식)", () => {
    const r = ok({
      ...base,
      year: 2028,
      displacementCc: 2000,
      firstRegistrationDate: "2027-03-01",
      prepay: "jan",
      assumeLatestPrepayRate: true,
    });
    assert.equal(r.notes.some((n) => n.includes("윤년")), true);
    assert.ok(r.prepay);
    assert.equal(r.prepay.dayBase, 366);
    assert.ok(Math.abs(r.prepay.effectiveRate - (335 / 366) * 0.05) < 10 ** -6 / 2);
  });
});

describe("지방교육세 부과 대상과 적용 순서", () => {
  it("비영업용 승용에만 부과된다", () => {
    assert.ok((ok({ ...base, displacementCc: 2000 }).educationTax) > (0));
    assert.equal(ok({ ...base, usage: "business", displacementCc: 2000 }).educationTax, 0);
    assert.equal(ok({ ...base, vehicleType: "van", vanClass: "smallRegularBus", displacementCc: null }).educationTax, 0);
    assert.equal(ok({ ...base, vehicleType: "truck", loadCapacityKg: 1000, displacementCc: null }).educationTax, 0);
    assert.equal(ok({ ...base, vehicleType: "special", specialClass: "small", displacementCc: null }).educationTax, 0);
  });

  it("비영업용 전기 승용차에는 부과된다", () => {
    assert.equal(ok({ ...base, vehicleType: "otherPassenger", displacementCc: null }).educationTax, 30_000);
  });

  it("과세표준은 차령 경감 후 자동차세액이다 — 중간값까지 고정", () => {
    // 2,000cc 비영업용, 2020-01-10 등록 → 2026년 차령 7년 → 경감률 25%
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2020-01-10" });
    assert.equal(r.annualBaseTax, 400_000);
    for (const half of r.halves) {
      assert.equal(half.vehicleAge, 7);
      assert.equal(half.baseHalfTax, 200_000);
      assert.ok(Math.abs((half.ageDiscountRate) - (0.25)) < 10 ** -2 / 2);
      assert.equal(half.carTax, 150_000); // 200,000 × 0.75
      assert.equal(half.educationTax, 45_000); // 150,000 × 30%
    }
    assert.equal(r.carTax, 300_000);
    assert.equal(r.educationTax, 90_000);
    assert.equal(r.finalPayable, 390_000);
  });
});

describe("잘못된 입력 차단", () => {
  it("배기량 0 또는 음수", () => {
    assert.equal(calculateCarTax({ ...base, displacementCc: 0 }).ok, false);
    assert.equal(calculateCarTax({ ...base, displacementCc: -100 }).ok, false);
  });

  it("배기량 상한 초과", () => {
    assert.equal(calculateCarTax({ ...base, displacementCc: 1e6 }).ok, false);
  });

  it("소수 배기량", () => {
    assert.equal(calculateCarTax({ ...base, displacementCc: 1998.5 }).ok, false);
  });

  it("잘못된 날짜", () => {
    assert.equal(calculateCarTax({ ...base, firstRegistrationDate: "2026-02-30" }).ok, false);
    assert.equal(calculateCarTax({ ...base, firstRegistrationDate: "2020/01/01" }).ok, false);
  });

  it("과세연도보다 미래의 등록일", () => {
    assert.equal(calculateCarTax({ ...base, firstRegistrationDate: "2027-01-01" }).ok, false);
  });

  it("parseIntegerInput은 음수·지수·문자 혼입을 거부한다", () => {
    assert.equal(parseIntegerInput("-100", 30_000).ok, false);
    assert.equal(parseIntegerInput("1e6", 30_000).ok, false);
    assert.equal(parseIntegerInput("100원200", 30_000).ok, false);
    assert.equal(parseIntegerInput("1998.5", 30_000).ok, false);
    assert.equal(parseIntegerInput("999999999999999", 30_000).ok, false);
    assert.equal(parseIntegerInput("", 30_000).ok, false);
    assert.deepEqual(parseIntegerInput("1,998", 30_000), { ok: true, value: 1998 });
  });
});

describe("10원 미만 절사", () => {
  it("floorTo10", () => {
    assert.equal(floorTo10(35_946), 35_940);
    assert.equal(floorTo10(119_820), 119_820);
    assert.equal(floorTo10(9), 0);
  });

  it("홀수 배기량에서도 절사가 적용된다", () => {
    // 1,591cc × 140 = 222,740 → 기분 111,370
    const r = ok({ ...base, displacementCc: 1591, firstRegistrationDate: "2025-01-05" });
    assert.equal(r.annualBaseTax, 222_740);
    assert.equal(r.carTax, 222_740);
    // 기분세액 111,370 × 30% = 33,411 → 10원 절사 33,410, 두 기분 합계 66,820
    assert.equal(r.educationTax, 66_820);
  });
});


describe("말소등록 환급 예상 — 세액 구성 분리", () => {
  const deregistered: CarTaxInput = {
    ...base,
    displacementCc: 2000,
    firstRegistrationDate: "2020-01-10", // 차령 7년, 경감률 25%
    period: "year",
    prorate: { kind: "deregistration", date: "2026-03-31" },
  };

  // 경감 후 연간세액 = 자동차세 300,000 + 교육세 90,000 = 390,000
  // 제1기분 90/181일: 150,000 × 90/181 = 74,585.6 → 74,580, 교육세 22,374 → 22,370
  // 제2기분 0/184일: 0
  const ANNUAL_BEFORE = 390_000;
  const H1_AFTER = 74_580 + 22_370; // 96,950
  const H2_AFTER = 0;
  const ANNUAL_AFTER = H1_AFTER + H2_AFTER;

  it("연간세액·기분세액·일할 후 부담액을 각각 분리해 제공한다", () => {
    const r = ok(deregistered);
    assert.equal(r.proration?.kind, "deregistration");
    assert.equal(r.proration?.annualTax, ANNUAL_BEFORE);
    assert.equal(r.proration?.annualProratedTax, ANNUAL_AFTER);
    assert.deepEqual(r.halves[0].prorate, { usedDays: 90, totalDays: 181 });
    assert.deepEqual(r.halves[1].prorate, { usedDays: 0, totalDays: 184 });
    assert.equal(r.halves[0].carTax, 74_580);
    assert.equal(r.halves[0].educationTax, 22_370);
    assert.equal(r.halves[1].carTax, H2_AFTER);
  });

  it("기납부액을 입력하면 환급 예상액을 계산한다", () => {
    const r = ok({ ...deregistered, alreadyPaid: ANNUAL_BEFORE });
    assert.equal(r.refund?.alreadyPaid, ANNUAL_BEFORE);
    assert.equal(r.refund?.estimatedRefund, ANNUAL_BEFORE - ANNUAL_AFTER);
  });

  it("연납 공제 후 납부액을 기준으로도 환급 예상액이 나온다", () => {
    // 1월 연납 실납부액 = 390,000 − floor10(300,000×334/365×5%) − floor10(90,000×334/365×5%)
    //                  = 390,000 − 13,720 − 4,110 = 372,170
    const r = ok({ ...deregistered, alreadyPaid: 372_170 });
    assert.equal(r.refund?.estimatedRefund, 372_170 - ANNUAL_AFTER);
  });

  it("과세기간을 제1기분으로 선택해도 연간세액과 환급액은 연간 기준으로 유지된다", () => {
    const r = ok({ ...deregistered, period: "first", alreadyPaid: ANNUAL_BEFORE });
    // 화면 표시는 제1기분만
    assert.equal((r.halves).length, 1);
    assert.equal(r.halves[0].half, 1);
    assert.equal(r.proration?.periodTax, 195_000); // 150,000 + 45,000
    assert.equal(r.proration?.periodProratedTax, H1_AFTER);
    // 환급 산정은 연간
    assert.equal(r.refund?.scope, "annual");
    assert.equal(r.refund?.annualProratedTax, ANNUAL_AFTER);
    assert.equal(r.refund?.estimatedRefund, ANNUAL_BEFORE - ANNUAL_AFTER);
  });

  it("과세기간을 제2기분으로 선택해도 환급액은 달라지지 않는다", () => {
    const r = ok({ ...deregistered, period: "second", alreadyPaid: ANNUAL_BEFORE });
    assert.equal((r.halves).length, 1);
    assert.equal(r.halves[0].half, 2);
    // 말소 이후 기분이므로 표시 부담액은 0
    assert.equal(r.proration?.periodProratedTax, H2_AFTER);
    assert.equal(r.proration?.periodTax, 195_000);
    // 환급액은 연간·제1기분 선택과 동일
    assert.equal(r.refund?.annualProratedTax, ANNUAL_AFTER);
    assert.equal(r.refund?.estimatedRefund, ANNUAL_BEFORE - ANNUAL_AFTER);
  });

  it("세 가지 과세기간 선택에서 환급 예상액이 모두 같다", () => {
    const refunds = (["year", "first", "second"] as const).map(
      (period) => ok({ ...deregistered, period, alreadyPaid: ANNUAL_BEFORE }).refund?.estimatedRefund,
    );
    assert.equal(new Set(refunds).size, 1);
    assert.equal(refunds[0], ANNUAL_BEFORE - ANNUAL_AFTER);
  });

  it("하반기 말소: 제1기분은 전액, 제2기분은 일할계산된다", () => {
    // 9/30 말소 → 제1기분 181/181, 제2기분 7/1~9/30 = 92/184
    const r = ok({ ...deregistered, prorate: { kind: "deregistration", date: "2026-09-30" } });
    assert.deepEqual(r.halves[0].prorate, { usedDays: 181, totalDays: 181 });
    assert.deepEqual(r.halves[1].prorate, { usedDays: 92, totalDays: 184 });
    assert.equal(r.halves[0].carTax, 150_000);
    // 150,000 × 92/184 = 75,000
    assert.equal(r.halves[1].carTax, 75_000);
    assert.equal(r.proration?.annualProratedTax, 150_000 + 45_000 + 75_000 + 22_500);
  });

  it("기납부액이 부담액보다 적으면 추가 납부(음수)로 나온다", () => {
    const r = ok({ ...deregistered, alreadyPaid: 50_000 });
    assert.equal(r.refund?.estimatedRefund, 50_000 - ANNUAL_AFTER);
    assert.ok((r.refund!.estimatedRefund!) < (0));
  });

  it("기납부액이 없으면 refund는 null이고 proration만 남는다", () => {
    const r = ok(deregistered);
    assert.equal(r.refund, null);
    assert.notEqual(r.proration, null);
  });

  it("일할계산이 없으면 proration과 refund가 모두 null이다", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2020-01-10" });
    assert.equal(r.proration, null);
    assert.equal(r.refund, null);
  });

  it("신규등록에는 환급 정보가 만들어지지 않는다", () => {
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2026-04-15",
      prorate: { kind: "newRegistration", date: "2026-04-15" },
    });
    assert.equal(r.proration?.kind, "newRegistration");
    assert.equal(r.refund, null);
  });

  it("신규등록에 기납부액을 넘기면 오류다", () => {
    const r = calculateCarTax({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2026-04-15",
      prorate: { kind: "newRegistration", date: "2026-04-15" },
      alreadyPaid: 100_000,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes("말소등록")), true);
  });
});

describe("검증 필요 상태", () => {
  const car: CarTaxInput = { ...base, displacementCc: 2000, firstRegistrationDate: "2020-01-10" };

  it("1월·3월 연납은 확정 상태다", () => {
    assert.equal(ok({ ...car, prepay: "jan" }).status, "confirmed");
    assert.equal(ok({ ...car, prepay: "mar" }).status, "confirmed");
  });

  it("6월·9월 연납도 확정 상태다 (법 §128③ 계산식 원문 확인)", () => {
    assert.equal(ok({ ...car, prepay: "jun" }).status, "confirmed");
    assert.equal(ok({ ...car, prepay: "sep" }).status, "confirmed");
  });

  it("윤년 연납은 더 이상 검증 필요 사유가 아니다", () => {
    const r = ok({
      ...base,
      year: 2028,
      displacementCc: 2000,
      firstRegistrationDate: "2027-03-01",
      prepay: "jan",
      assumeLatestPrepayRate: true,
    });
    // 이자율 미확인(가정 계산)만 남는다. 분모는 확정됐다.
    assert.equal(r.verificationNotes.some((n) => n.includes("366")), false);
    assert.equal(r.verificationNotes.some((n) => n.includes("이자율")), true);
  });

  it("환급 예상액이 산출되면 검증 필요 상태가 된다", () => {
    const r = ok({ ...car, prorate: { kind: "deregistration", date: "2026-03-31" }, alreadyPaid: 390_000 });
    assert.equal(r.status, "verificationRequired");
  });

  it("연납 없는 일반 계산은 확정 상태다", () => {
    assert.equal(ok(car).status, "confirmed");
  });
});


describe("alreadyPaid 직접 호출 검증 — 순수 함수 경계", () => {
  const dereg: CarTaxInput = {
    ...base,
    displacementCc: 2000,
    firstRegistrationDate: "2020-01-10",
    prorate: { kind: "deregistration", date: "2026-03-31" },
  };

  const rejects = (alreadyPaid: unknown, expected: string) => {
    const r = calculateCarTax({ ...dereg, alreadyPaid: alreadyPaid as number });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes(expected)), true);
  };

  it("음수는 거부한다", () => rejects(-1, "0 이상"));
  it("소수는 거부한다", () => rejects(1000.5, "정수"));
  it("NaN은 거부한다", () => rejects(Number.NaN, "숫자"));
  it("Infinity는 거부한다", () => rejects(Number.POSITIVE_INFINITY, "숫자"));
  it("문자열은 거부한다", () => rejects("390000", "숫자"));
  it("안전 정수 범위를 넘으면 거부한다", () => rejects(Number.MAX_SAFE_INTEGER + 2, "정수"));

  it("null과 undefined는 오류가 아니라 미입력으로 처리한다", () => {
    assert.equal(ok({ ...dereg, alreadyPaid: null }).refund, null);
    assert.equal(ok({ ...dereg, alreadyPaid: undefined }).refund, null);
  });

  it("0은 유효한 값이다", () => {
    const r = ok({ ...dereg, alreadyPaid: 0 });
    assert.equal(r.refund?.alreadyPaid, 0);
    assert.ok((r.refund!.estimatedRefund) < (0));
  });
});

/* ------------------------------------------------------------------ */
/* 연납 6월·9월 — 법 제128조 제3항 계산식 (2026-09-01 원문 확인)        */
/*                                                                     */
/*  | 신고납부기간 | 계산식                                            */
/*  | 1·3월        | 연세액 × 일수/365(윤년 366) × 이자율               */
/*  | 6월          | 제2기분 세액 × 이자율                              */
/*  | 9월          | 제2기분 세액 × 일수/184 × 이자율                   */
/* ------------------------------------------------------------------ */

describe("연납 6월·9월 — 법 제128조 제3항 계산식", () => {
  // 2,000cc 비영업용, 2025-03-01 최초등록 → 2026년 차령 2년(경감 없음)
  // 연세액 400,000 / 기분세액 200,000 / 기분 지방교육세 60,000
  const car: CarTaxInput = {
    ...base,
    displacementCc: 2000,
    firstRegistrationDate: "2025-03-01",
    period: "year",
  };

  it("비활성 목록이 비어 있고 모든 신청 시기를 지원한다", () => {
    assert.deepEqual([...UNVERIFIED_PREPAY_TIMINGS], []);
    for (const t of ["none", "jan", "mar", "jun", "sep"] as const) {
      assert.equal(isPrepayTimingSupported(t), true);
    }
  });

  it("6월 연납: 제2기분 세액 × 5% — 일수 비례가 없다", () => {
    const r = ok({ ...car, prepay: "jun" });
    assert.ok(r.prepay);
    assert.equal(r.prepay.deductionBase, "secondHalf");
    assert.equal(r.prepay.dayBase, null);
    assert.equal(r.prepay.effectiveRate, 0.05);
    // 200,000 × 5% = 10,000 / 60,000 × 5% = 3,000
    assert.equal(r.prepay.carTaxDeduction, 10_000);
    assert.equal(r.prepay.educationTaxDeduction, 3_000);
    assert.equal(r.prepay.totalDeduction, 13_000);
  });

  it("6월 연납은 연세액 전액을 납부한다 (제1기분 포함)", () => {
    const r = ok({ ...car, prepay: "jun" });
    assert.equal(r.prepay?.payableScope, "annual");
    assert.equal(r.prepay?.payableBeforeDeduction, 520_000);
    assert.equal(r.finalPayable, 507_000);
  });

  it("6월 연납의 연세액 대비 실효 공제율은 2.5%다", () => {
    const r = ok({ ...car, prepay: "jun" });
    assert.ok(r.prepay);
    assert.ok(Math.abs(r.prepay.effectiveRateOnPayable - 0.025) < 10 ** -6 / 2);
  });

  it("9월 연납: 제2기분 세액 × 92일/184일 × 5%", () => {
    const r = ok({ ...car, prepay: "sep" });
    assert.ok(r.prepay);
    assert.equal(r.prepay.deductionBase, "secondHalf");
    assert.equal(r.prepay.dayBase, SECOND_HALF_DAY_BASE);
    assert.equal(r.prepay.deductiblePeriod.days, 92);
    assert.ok(Math.abs(r.prepay.effectiveRate - 0.025) < 10 ** -9);
    // 200,000 × 2.5% = 5,000 / 60,000 × 2.5% = 1,500
    assert.equal(r.prepay.carTaxDeduction, 5_000);
    assert.equal(r.prepay.educationTaxDeduction, 1_500);
    assert.equal(r.prepay.totalDeduction, 6_500);
  });

  it("9월 연납은 제2기분만 납부한다", () => {
    const r = ok({ ...car, prepay: "sep" });
    assert.equal(r.prepay?.payableScope, "secondHalf");
    assert.equal(r.prepay?.payableBeforeDeduction, 260_000);
    assert.equal(r.finalPayable, 253_500);
  });

  it("9월 연납의 연세액 대비 공제율은 1.25% (서울시 공식 안내와 일치)", () => {
    const r = ok({ ...car, prepay: "sep" });
    assert.ok(r.prepay);
    assert.ok(Math.abs(r.prepay.totalDeduction / 520_000 - 0.0125) < 10 ** -6 / 2);
  });

  it("공제액은 1월 > 3월 > 6월 > 9월 순으로 줄어든다", () => {
    const d = (t: CarTaxInput["prepay"]) => ok({ ...car, prepay: t }).prepay!.totalDeduction;
    assert.ok(d("jan") > d("mar"));
    assert.ok(d("mar") > d("jun"));
    assert.ok(d("jun") > d("sep"));
  });

  it("9월 연납 공제액은 6월 연납 공제액의 정확히 절반이다", () => {
    const jun = ok({ ...car, prepay: "jun" }).prepay!.totalDeduction;
    const sep = ok({ ...car, prepay: "sep" }).prepay!.totalDeduction;
    assert.equal(sep * 2, jun);
  });

  it("차령 경감이 있으면 제2기분 세액이 줄어 6·9월 공제액도 함께 줄어든다", () => {
    // 2018-01-10 최초등록 → 2026년 차령 9년, 경감률 35%
    const aged: CarTaxInput = { ...car, firstRegistrationDate: "2018-01-10" };
    const r = ok({ ...aged, prepay: "jun" });
    const second = r.halves.find((h) => h.half === 2)!;
    assert.equal(second.ageDiscountRate, 0.35);
    assert.equal(second.carTax, 130_000); // 200,000 × 65%
    assert.equal(second.educationTax, 39_000);
    assert.equal(r.prepay?.carTaxDeduction, 6_500);
    assert.equal(r.prepay?.educationTaxDeduction, 1_950);
  });

  it("기분 상·하반기 차령이 다르면 6·9월 공제는 제2기분 세액만 쓴다", () => {
    // 2017-08-01 최초등록 → 2026년 제1기분 차령 9년(35%), 제2기분 차령 10년(40%)
    const r = ok({ ...car, firstRegistrationDate: "2017-08-01", prepay: "jun" });
    const first = r.halves.find((h) => h.half === 1)!;
    const second = r.halves.find((h) => h.half === 2)!;
    assert.equal(first.vehicleAge, 9);
    assert.equal(second.vehicleAge, 10);
    assert.equal(second.carTax, 120_000); // 200,000 × 60%
    assert.equal(r.prepay?.carTaxDeduction, 6_000); // 제1기분(130,000)이 아니라 제2기분 기준
  });

  it("영업용 화물차는 지방교육세가 없어 자동차세 공제만 생긴다", () => {
    const r = ok({
      ...base,
      usage: "business",
      vehicleType: "truck",
      loadCapacityKg: 1_000,
      displacementCc: null,
      firstRegistrationDate: null,
      prepay: "jun",
    });
    assert.equal(r.educationTax, 0);
    assert.equal(r.prepay?.educationTaxDeduction, 0);
    // 연세액 6,600 → 제2기분 3,300 × 5% = 165 → 10원 미만 절사 160
    assert.equal(r.prepay?.carTaxDeduction, 160);
  });

  it("과세기간을 기분으로 선택하면 연납 공제를 계산하지 않고 안내만 남긴다", () => {
    for (const period of ["first", "second"] as const) {
      const r = ok({ ...car, period, prepay: "jun" });
      assert.equal(r.prepay, null);
      assert.equal(r.notes.some((n) => n.includes("연간")), true);
    }
  });

  it("일할계산과 6·9월 연납을 함께 요청하면 거부한다", () => {
    const r = calculateCarTax({
      ...car,
      prepay: "sep",
      prorate: { kind: "deregistration", date: "2026-08-31" },
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.errors.some((e) => e.includes("일할계산과 연납")), true);
  });

  it("공제대상 일수는 신청 시기가 늦을수록 짧아진다", () => {
    assert.equal(prepayDeductiblePeriod(2026, "jan").days, 334);
    assert.equal(prepayDeductiblePeriod(2026, "mar").days, 275);
    assert.equal(prepayDeductiblePeriod(2026, "jun").days, 184);
    assert.equal(prepayDeductiblePeriod(2026, "sep").days, 92);
  });
});

describe("연납 계산식 분모 — 법 제128조 제3항 (윤년 366일)", () => {
  it("isLeapYear", () => {
    assert.equal(isLeapYear(2026), false);
    assert.equal(isLeapYear(2028), true);
    assert.equal(isLeapYear(2100), false);
    assert.equal(isLeapYear(2000), true);
  });

  it("prepayDayBase는 평년 365일, 윤년 366일", () => {
    assert.equal(prepayDayBase(2026), 365);
    assert.equal(prepayDayBase(2028), 366);
  });

  it("9월 연납 분모는 윤년에도 184일로 고정된다", () => {
    const r = ok({
      ...base,
      year: 2028,
      displacementCc: 2000,
      firstRegistrationDate: "2027-03-01",
      prepay: "sep",
      assumeLatestPrepayRate: true,
    });
    assert.equal(r.prepay?.dayBase, 184);
    assert.equal(r.prepay?.deductiblePeriod.days, 92);
  });
});

/* ------------------------------------------------------------------ */
/* 제2기분(7~12월분) — 법 제128조 제1항                                 */
/* ------------------------------------------------------------------ */

describe("제2기분(12월 납기, 7~12월분) 계산", () => {
  it("경감 없는 차량의 제2기분은 연세액의 정확히 절반이다", () => {
    const r = ok({ ...base, displacementCc: 2000, firstRegistrationDate: "2025-03-01", period: "second" });
    assert.equal(r.annualBaseTax, 400_000);
    assert.equal(r.carTax, 200_000);
    assert.equal(r.educationTax, 60_000);
    assert.equal(r.finalPayable, 260_000);
    assert.equal(r.halves.length, 1);
    assert.equal(r.halves[0].half, 2);
  });

  it("제1기분 + 제2기분 = 연간 세액", () => {
    const args = { ...base, displacementCc: 1998, firstRegistrationDate: "2016-11-20" };
    const first = ok({ ...args, period: "first" });
    const second = ok({ ...args, period: "second" });
    const year = ok({ ...args, period: "year" });
    assert.equal(first.carTax + second.carTax, year.carTax);
    assert.equal(first.educationTax + second.educationTax, year.educationTax);
    assert.equal(first.finalPayable + second.finalPayable, year.finalPayable);
  });

  it("하반기 등록 차량은 제2기분 차령이 제1기분보다 1년 많다", () => {
    // 2016-11-20 등록 → 2026년 제1기분 10년, 제2기분 11년
    const args = { ...base, displacementCc: 1998, firstRegistrationDate: "2016-11-20" };
    const first = ok({ ...args, period: "first" });
    const second = ok({ ...args, period: "second" });
    assert.equal(first.halves[0].vehicleAge, 10);
    assert.equal(second.halves[0].vehicleAge, 11);
    assert.equal(first.halves[0].ageDiscountRate, 0.4);
    assert.equal(second.halves[0].ageDiscountRate, 0.45);
    assert.ok(second.carTax < first.carTax);
  });

  it("전기차 제2기분은 정액의 절반이고 지방교육세가 붙는다", () => {
    const r = ok({
      ...base,
      vehicleType: "otherPassenger",
      displacementCc: null,
      firstRegistrationDate: "2020-01-01",
      period: "second",
    });
    assert.equal(r.carTax, 50_000);
    assert.equal(r.educationTax, 15_000);
    assert.equal(r.ageReduction, 0);
  });
});

/* ------------------------------------------------------------------ */
/* 법 제128조 제4항 — 연세액 10만원 이하 일시부과 안내                   */
/* ------------------------------------------------------------------ */

describe("연세액 10만원 이하 안내 — 법 제128조 제4항", () => {
  it("연세액이 10만원 이하이면 일시부과 안내가 붙는다", () => {
    // 1,000cc 비영업용 = 80,000원
    const r = ok({ ...base, displacementCc: 1_000, firstRegistrationDate: "2025-01-01" });
    assert.equal(r.annualBaseTax, 80_000);
    assert.equal(r.notes.some((n) => n.includes("제128조 제4항")), true);
  });

  it("경계값 정확히 10만원도 안내 대상이다", () => {
    // 1,250cc × 140원 = 175,000 → 아님. 전기차 비영업용 정액 100,000원으로 경계 확인
    const r = ok({
      ...base,
      vehicleType: "otherPassenger",
      displacementCc: null,
      firstRegistrationDate: "2025-01-01",
    });
    assert.equal(r.annualBaseTax, LUMP_SUM_LEVY_THRESHOLD);
    assert.equal(r.notes.some((n) => n.includes("제128조 제4항")), true);
  });

  it("10만원을 넘으면 안내가 붙지 않는다", () => {
    const r = ok({ ...base, displacementCc: 2_000, firstRegistrationDate: "2025-01-01" });
    assert.equal(r.notes.some((n) => n.includes("제128조 제4항")), false);
  });
});

/* ------------------------------------------------------------------ */
/* 회귀: 차령 경감률의 부동소수점 오차                                   */
/* ------------------------------------------------------------------ */

describe("회귀 — 차령 경감 부동소수점", () => {
  it("경감률은 백분율 정수에서 파생되어 오차가 없다", () => {
    for (let age = 3; age <= 12; age += 1) {
      const pct = ageDiscountPercent(age);
      assert.equal(pct, 5 * (age - 2));
      assert.equal(ageDiscountRate(age), pct / 100);
    }
    assert.equal(ageDiscountPercent(2), 0);
    assert.equal(ageDiscountPercent(13), 50);
    assert.equal(ageDiscountPercent(30), 50);
  });

  it("경감률 35%에서 200,000원 기분세액이 129,990원으로 잘리지 않는다", () => {
    // 0.05 * 7 = 0.35000000000000003 으로 계산하면 129,999.99…원 → 129,990원이 됐다.
    const r = ok({
      ...base,
      displacementCc: 2000,
      firstRegistrationDate: "2018-01-10",
      period: "second",
    });
    assert.equal(r.halves[0].vehicleAge, 9);
    assert.equal(r.carTax, 130_000);
    assert.equal(r.educationTax, 39_000);
  });

  it("차령 3~12년 전 구간에서 기분세액이 100원 단위로 떨어진다 (400,000원 연세액)", () => {
    const expected: Record<number, number> = {
      3: 190_000, 4: 180_000, 5: 170_000, 6: 160_000, 7: 150_000,
      8: 140_000, 9: 130_000, 10: 120_000, 11: 110_000, 12: 100_000,
    };
    for (const [ageText, tax] of Object.entries(expected)) {
      const age = Number(ageText);
      const regYear = 2026 - age + 1; // 1~6월 등록 → 차령 = 과세연도 − 등록연도 + 1
      const r = ok({
        ...base,
        displacementCc: 2000,
        firstRegistrationDate: `${regYear}-01-10`,
        period: "second",
      });
      assert.equal(r.halves[0].vehicleAge, age);
      assert.equal(r.carTax, tax);
    }
  });
});

it("결과 제목은 9월 연납의 제2기분 납부 범위를 구분하고 기존 기간 제목을 유지한다", () => {
  for (const prepay of ["jan", "mar", "jun", "sep"] as const) {
    const result = ok({ ...base, prepay });
    assert.equal(result.prepay?.payableScope, prepay === "sep" ? "secondHalf" : "annual");
    assert.equal(
      carTaxResultTitle(result),
      prepay === "sep" ? "2026년 제2기분 연납 예상 납부액" : "2026년 연간 예상 납부액",
      prepay,
    );
  }
  for (const [period, label] of [
    ["year", "연간"], ["first", "제1기분 (1~6월)"], ["second", "제2기분 (7~12월)"],
  ] as const) {
    assert.equal(carTaxResultTitle(ok({ ...base, period })), `2026년 ${label} 예상 납부액`);
  }
});
