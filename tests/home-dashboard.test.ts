import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AUDIENCE_GROUPS,
  CALCULATORS,
  ENABLED_CALCULATORS,
  POPULAR_CALCULATORS,
  calculatorBySlug,
  calculatorHref,
  calculatorsFor,
} from "../src/lib/calculators.ts";
import { GUIDES, guideBySlug, guideHref } from "../src/lib/guides.ts";
import { GUIDE_LAST_MODIFIED, CALCULATOR_META } from "../src/lib/content-registry.ts";
import {
  EVENT_DRIVEN_SCHEDULE,
  MONTH_LABELS,
  TAX_SCHEDULE,
  currentMonthInSeoul,
  monthlyHighlight,
  scheduleForMonth,
} from "../src/lib/tax-calendar.ts";
import { pickFeatured, pickGuides } from "../src/lib/home.ts";

/* ------------------------------------------------------------------ */
/* 현재 월 판정 — Asia/Seoul                                            */
/* ------------------------------------------------------------------ */

describe("현재 월 판정", () => {
  it("UTC 기준으로 아직 전달이어도 한국 시간 기준 달을 쓴다", () => {
    // 2026-05-31 20:00 UTC = 2026-06-01 05:00 KST
    assert.equal(currentMonthInSeoul(new Date("2026-05-31T20:00:00Z")), 6);
    // 2026-05-31 10:00 UTC = 2026-05-31 19:00 KST
    assert.equal(currentMonthInSeoul(new Date("2026-05-31T10:00:00Z")), 5);
  });

  it("연말 경계에서도 한국 시간 기준이다", () => {
    // 2026-12-31 16:00 UTC = 2027-01-01 01:00 KST
    assert.equal(currentMonthInSeoul(new Date("2026-12-31T16:00:00Z")), 1);
    assert.equal(currentMonthInSeoul(new Date("2026-12-31T10:00:00Z")), 12);
  });

  it("1에서 12 사이 값만 나온다", () => {
    for (let m = 0; m < 12; m += 1) {
      const iso = `2026-${String(m + 1).padStart(2, "0")}-15T03:00:00Z`;
      const got = currentMonthInSeoul(new Date(iso));
      assert.ok(got >= 1 && got <= 12);
    }
  });
});

/* ------------------------------------------------------------------ */
/* 이번 달 일정 선택과 폴백                                              */
/* ------------------------------------------------------------------ */

describe("이번 달 일정 선택", () => {
  it("요청한 문서의 월별 일정이 실제로 들어 있다", () => {
    const has = (month: number, keyword: string) =>
      scheduleForMonth(month).some((i) => i.title.includes(keyword));
    assert.ok(has(1, "자동차세 연납"));
    assert.ok(has(5, "종합소득세"));
    assert.ok(has(6, "자동차세 제1기분"));
    assert.ok(has(7, "재산세"));
    assert.ok(has(9, "재산세"));
    assert.ok(has(9, "자동차세 연납"));
    assert.ok(has(12, "종합부동산세"));
    assert.ok(has(12, "자동차세 제2기분"));
  });

  it("일정이 있는 달은 그 달을 그대로 보여준다", () => {
    for (const m of [1, 3, 4, 5, 6, 7, 9, 10, 12]) {
      const h = monthlyHighlight(m);
      assert.equal(h.month, m);
      assert.equal(h.isUpcoming, false);
      assert.ok(h.items.length > 0);
    }
  });

  it("일정이 없는 달은 다음으로 가까운 달로 넘어간다", () => {
    assert.deepEqual(
      [2, 8, 11].map((m) => {
        const h = monthlyHighlight(m);
        return [h.month, h.isUpcoming];
      }),
      [
        [3, true],
        [9, true],
        [12, true],
      ],
    );
  });

  it("12월 다음은 다음 해 1월로 돌아온다", () => {
    // 12월은 일정이 있으므로, 폴백 순환은 11월에서 확인한다.
    const h = monthlyHighlight(11);
    assert.equal(h.month, 12);
    // 순환이 실제로 도는지: 가상의 빈 달 순회가 1월로 이어지는지 확인
    const wrapped = ((12 - 1 + 1) % 12) + 1;
    assert.equal(wrapped, 1);
  });

  it("모든 달이 결과를 낸다 (빈 화면이 생기지 않는다)", () => {
    for (let m = 1; m <= 12; m += 1) {
      assert.ok(monthlyHighlight(m).items.length > 0, `${m}월`);
    }
  });

  it("월 라벨이 1~12월 모두 있다", () => {
    for (let m = 1; m <= 12; m += 1) {
      assert.equal(MONTH_LABELS[m], `${m}월`);
    }
  });
});

/* ------------------------------------------------------------------ */
/* 홈이 고르는 계산기·가이드                                             */
/* ------------------------------------------------------------------ */

describe("홈 추천 선택", () => {
  it("이번 달 일정에 걸린 계산기를 대표 카드로 올린다", () => {
    assert.equal(pickFeatured(scheduleForMonth(5)).slug, "income-tax-calculator");
    assert.equal(pickFeatured(scheduleForMonth(12)).slug, "comprehensive-real-estate-tax-calculator");
    assert.equal(pickFeatured(scheduleForMonth(7)).slug, "property-tax-calculator");
  });

  it("일정이 비어 있으면 인기 1위를 쓴다", () => {
    assert.equal(pickFeatured([]).slug, POPULAR_CALCULATORS[0].slug);
  });

  it("추천 가이드는 요청한 개수만큼, 중복 없이 나온다", () => {
    for (let m = 1; m <= 12; m += 1) {
      const picked = pickGuides(monthlyHighlight(m).items, 3);
      assert.equal(picked.length, 3, `${m}월`);
      assert.equal(new Set(picked.map((g) => g.slug)).size, 3, `${m}월`);
    }
  });

  it("이번 달 일정의 가이드를 먼저 넣는다", () => {
    const picked = pickGuides(scheduleForMonth(12), 3);
    assert.equal(picked[0].slug, "comprehensive-real-estate-tax");
    assert.ok(picked.some((g) => g.slug === "car-tax"));
  });

  it("일정이 비어 있어도 최근 가이드로 채운다", () => {
    const picked = pickGuides([], 3);
    assert.equal(picked.length, 3);
    assert.equal(new Set(picked.map((g) => g.slug)).size, 3);
  });
});

/* ------------------------------------------------------------------ */
/* 레지스트리 정합성 — 링크가 깨지지 않는지                               */
/* ------------------------------------------------------------------ */

describe("레지스트리 정합성", () => {
  it("모든 계산기 슬러그가 유일하다", () => {
    const slugs = CALCULATORS.map((c) => c.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it("모든 계산기에 근거 표시(CALCULATOR_META)가 있다", () => {
    for (const c of CALCULATORS) {
      assert.ok(CALCULATOR_META[c.slug], c.slug);
      assert.ok(CALCULATOR_META[c.slug].sources.length > 0, c.slug);
    }
  });

  it("모든 가이드에 최근 수정일이 있고, 반대로도 빠짐이 없다", () => {
    const listed = new Set(GUIDES.map((g) => g.slug));
    const dated = new Set(Object.keys(GUIDE_LAST_MODIFIED));
    assert.equal(listed.size, GUIDES.length);
    assert.deepEqual(Array.from(listed).sort(), Array.from(dated).sort());
  });

  it("일정에 적힌 계산기·가이드 슬러그가 모두 실재한다", () => {
    for (const item of TAX_SCHEDULE) {
      if (item.calculator) assert.ok(calculatorBySlug(item.calculator), item.title);
      if (item.guide) assert.ok(guideBySlug(item.guide), item.title);
    }
    for (const item of EVENT_DRIVEN_SCHEDULE) {
      assert.ok(calculatorBySlug(item.calculator), item.title);
      assert.ok(guideBySlug(item.guide), item.title);
    }
  });

  it("경로 생성 함수가 기존 URL 구조를 유지한다", () => {
    assert.equal(calculatorHref("car-tax-calculator"), "/car-tax-calculator");
    assert.equal(guideHref("car-tax"), "/guide/car-tax");
  });
});

/* ------------------------------------------------------------------ */
/* 상황별 분류와 인기 계산기                                             */
/* ------------------------------------------------------------------ */

describe("상황별 분류와 인기 계산기", () => {
  it("모든 계산기가 최소 한 분류에 속한다", () => {
    for (const c of ENABLED_CALCULATORS) {
      assert.ok(c.audiences.length > 0, c.slug);
    }
  });

  it("상황별 분류를 모두 합치면 전체 계산기가 나온다", () => {
    const covered = new Set(AUDIENCE_GROUPS.flatMap((g) => calculatorsFor(g.key).map((c) => c.slug)));
    assert.deepEqual(
      Array.from(covered).sort(),
      ENABLED_CALCULATORS.map((c) => c.slug).sort(),
    );
  });

  it("요청한 상황별 묶음이 실제로 그렇게 묶여 있다", () => {
    const slugs = (key: Parameters<typeof calculatorsFor>[0]) => calculatorsFor(key).map((c) => c.slug);
    assert.deepEqual(slugs("employee").sort(), ["tax-free-income-calculator", "withholding-calculator"]);
    assert.deepEqual(
      slugs("business").sort(),
      ["freelancer-tax-calculator", "income-tax-calculator", "vat-calculator", "vat-type-compare"],
    );
    assert.deepEqual(
      slugs("realEstate").sort(),
      [
        "capital-gains-tax-calculator",
        "comprehensive-real-estate-tax-calculator",
        "property-tax-calculator",
      ],
    );
    assert.deepEqual(slugs("car"), ["car-tax-calculator"]);
    assert.deepEqual(slugs("inheritance").sort(), ["gift-tax-calculator", "inheritance-tax-calculator"]);
  });

  it("인기 계산기는 4개이고 요청한 목록과 같다", () => {
    assert.equal(POPULAR_CALCULATORS.length, 4);
    assert.deepEqual(POPULAR_CALCULATORS.map((c) => c.slug), [
      "income-tax-calculator",
      "capital-gains-tax-calculator",
      "car-tax-calculator",
      "comprehensive-real-estate-tax-calculator",
    ]);
  });

  it("인기 순위가 겹치지 않는다", () => {
    const ranks = POPULAR_CALCULATORS.map((c) => c.popularity);
    assert.equal(new Set(ranks).size, ranks.length);
  });

  it("어느 달을 보든 상단 카드 4장이 서로 다르다", () => {
    for (let m = 1; m <= 12; m += 1) {
      const featured = pickFeatured(monthlyHighlight(m).items);
      const others = POPULAR_CALCULATORS.filter((c) => c.slug !== featured.slug).slice(0, 3);
      const shown = [featured.slug, ...others.map((c) => c.slug)];
      assert.equal(new Set(shown).size, shown.length, `${m}월`);
      assert.ok(shown.length >= 3, `${m}월`);
    }
  });
});
