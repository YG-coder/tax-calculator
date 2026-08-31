import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ageDiscountRate,
  calculateCarTax,
  floorTo10,
  parseIntegerInput,
  prepayDeductiblePeriod,
  prepayInterestRate,
  isPrepayTimingSupported,
  UNVERIFIED_PREPAY_TIMINGS,
  LAST_VERIFIED_PREPAY_YEAR,
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

  it("윤년 과세연도에는 분모 확인 안내가 붙는다", () => {
    const r = ok({
      ...base,
      year: 2028,
      displacementCc: 2000,
      firstRegistrationDate: "2027-03-01",
      prepay: "jan",
      assumeLatestPrepayRate: true,
    });
    assert.equal(r.notes.some((n) => n.includes("윤년")), true);
    // 분모는 365로 고정: 335/365 × 5%
    assert.ok(r.prepay);
    assert.ok(Math.abs(r.prepay.effectiveRate - (335 / 365) * 0.05) < 10 ** -6 / 2);
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

  it("6월·9월 연납은 검증 필요 표시가 아니라 계산 자체를 거부한다", () => {
    for (const timing of ["jun", "sep"] as const) {
      const r = calculateCarTax({ ...car, prepay: timing });
      assert.equal(r.ok, false);
      if (!r.ok) {
        assert.equal(r.errors.some((e) => e.includes("공식 고지 방식을 확인하는 중")), true);
      }
    }
  });

  it("윤년 연납은 분모 미확정 사유가 붙는다", () => {
    const r = ok({
      ...base,
      year: 2028,
      displacementCc: 2000,
      firstRegistrationDate: "2027-03-01",
      prepay: "jan",
      assumeLatestPrepayRate: true,
    });
    assert.equal(r.status, "verificationRequired");
    assert.equal(r.verificationNotes.some((n) => n.includes("366")), true);
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

describe("미검증 연납 시기 거부 — 6월·9월", () => {
  const car: CarTaxInput = {
    ...base,
    displacementCc: 2000,
    firstRegistrationDate: "2020-01-10",
    period: "year",
  };

  it("비활성 목록에 6월·9월이 들어 있다", () => {
    assert.deepEqual([...UNVERIFIED_PREPAY_TIMINGS], ["jun", "sep"]);
    assert.equal(isPrepayTimingSupported("jun"), false);
    assert.equal(isPrepayTimingSupported("sep"), false);
  });

  it("none·1월·3월은 계속 지원한다", () => {
    assert.equal(isPrepayTimingSupported("none"), true);
    assert.equal(isPrepayTimingSupported("jan"), true);
    assert.equal(isPrepayTimingSupported("mar"), true);
    assert.equal(ok({ ...car, prepay: "jan" }).status, "confirmed");
    assert.equal(ok({ ...car, prepay: "mar" }).status, "confirmed");
  });

  it("6월 연납은 오류로 거부하고 계산 결과를 내지 않는다", () => {
    const r = calculateCarTax({ ...car, prepay: "jun" });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.errors.some((e) => e.includes("제125조 제3항")), true);
      assert.equal(r.errors.some((e) => e.includes("위택스")), true);
    }
  });

  it("9월 연납도 같은 사유로 거부한다", () => {
    const r = calculateCarTax({ ...car, prepay: "sep" });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.errors.some((e) => e.includes("공식 고지 방식을 확인하는 중")), true);
    }
  });

  it("기분(제1기분·제2기분) 선택과 무관하게 거부한다", () => {
    for (const period of ["year", "first", "second"] as const) {
      assert.equal(calculateCarTax({ ...car, period, prepay: "jun" }).ok, false);
      assert.equal(calculateCarTax({ ...car, period, prepay: "sep" }).ok, false);
    }
  });

  it("가정 계산 옵션으로도 우회할 수 없다", () => {
    const r = calculateCarTax({ ...car, prepay: "jun", assumeLatestPrepayRate: true });
    assert.equal(r.ok, false);
  });

  it("차종·용도를 바꿔도 우회할 수 없다", () => {
    const truck = calculateCarTax({
      ...car,
      usage: "business",
      vehicleType: "truck",
      loadCapacityKg: 1000,
      displacementCc: null,
      prepay: "sep",
    });
    assert.equal(truck.ok, false);
  });

  it("다른 입력 오류와 함께 있어도 거부 사유가 함께 보고된다", () => {
    const r = calculateCarTax({ ...car, displacementCc: -1, prepay: "jun" });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.errors.some((e) => e.includes("공식 고지 방식을 확인하는 중")), true);
    }
  });

  it("공제대상 일수 계산 함수 자체는 살아 있다 (재개 시 근거)", () => {
    assert.equal(prepayDeductiblePeriod(2026, "jun").days, 184);
    assert.equal(prepayDeductiblePeriod(2026, "sep").days, 92);
  });
});
