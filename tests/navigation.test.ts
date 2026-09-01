import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  NAV_ITEMS,
  ariaCurrent,
  isCalculatorPath,
  navState,
  type NavItem,
} from "../src/lib/navigation.ts";
import { ENABLED_CALCULATORS, calculatorHref } from "../src/lib/calculators.ts";
import { GUIDES, guideHref } from "../src/lib/guides.ts";

const byKey = (key: NavItem["key"]) => NAV_ITEMS.find((i) => i.key === key)!;

describe("내비게이션 항목", () => {
  it("구역 세 개만 둔다 — 계산기가 늘어도 항목이 늘지 않는다", () => {
    assert.equal(NAV_ITEMS.length, 3);
    assert.deepEqual(NAV_ITEMS.map((i) => i.label), ["계산기", "세금 일정", "가이드"]);
  });

  it("계산기 항목은 홈의 전체 목록 구역으로 보낸다", () => {
    assert.equal(byKey("calculators").href, "/#all-calculators");
  });

  it("내비에 개별 계산기 경로를 박아 두지 않는다", () => {
    const calculatorPaths = new Set(ENABLED_CALCULATORS.map((c) => calculatorHref(c.slug)));
    for (const item of NAV_ITEMS) {
      assert.equal(calculatorPaths.has(item.href), false, item.href);
    }
  });

  it("항목 키가 유일하다", () => {
    assert.equal(new Set(NAV_ITEMS.map((i) => i.key)).size, NAV_ITEMS.length);
  });
});

describe("계산기 경로 판정", () => {
  it("모든 계산기 경로를 계산기 구역으로 본다", () => {
    for (const c of ENABLED_CALCULATORS) {
      assert.equal(isCalculatorPath(calculatorHref(c.slug)), true, c.slug);
    }
  });

  it("계산기가 아닌 경로는 제외한다", () => {
    for (const p of ["/", "/guide", "/tax-calendar", "/about", "/privacy", "/guide/car-tax"]) {
      assert.equal(isCalculatorPath(p), false, p);
    }
  });

  it("접두어만 같은 경로에 속지 않는다", () => {
    assert.equal(isCalculatorPath("/car-tax-calculator/extra"), false);
    assert.equal(isCalculatorPath("/car-tax-calculator2"), false);
  });
});

describe("현재 메뉴 판정", () => {
  it("계산기 상세 페이지에서는 계산기 메뉴를 강조한다", () => {
    for (const c of ENABLED_CALCULATORS) {
      const path = calculatorHref(c.slug);
      assert.equal(navState(byKey("calculators"), path), "section", c.slug);
      assert.equal(navState(byKey("calendar"), path), null, c.slug);
      assert.equal(navState(byKey("guide"), path), null, c.slug);
    }
  });

  it("세금 일정 페이지에서는 그 메뉴만 강조한다", () => {
    assert.equal(navState(byKey("calendar"), "/tax-calendar"), "page");
    assert.equal(navState(byKey("calculators"), "/tax-calendar"), null);
    assert.equal(navState(byKey("guide"), "/tax-calendar"), null);
  });

  it("가이드 목록은 page, 개별 가이드는 section 이다", () => {
    assert.equal(navState(byKey("guide"), "/guide"), "page");
    for (const g of GUIDES) {
      assert.equal(navState(byKey("guide"), guideHref(g.slug)), "section", g.slug);
    }
  });

  it("홈에서는 어느 메뉴도 강조하지 않는다 (로고가 홈 링크다)", () => {
    for (const item of NAV_ITEMS) {
      assert.equal(navState(item, "/"), null, item.key);
    }
  });

  it("정적 페이지에서도 어느 메뉴도 강조하지 않는다", () => {
    for (const p of ["/about", "/privacy", "/terms", "/contact"]) {
      for (const item of NAV_ITEMS) {
        assert.equal(navState(item, p), null, `${p} / ${item.key}`);
      }
    }
  });

  it("어떤 경로에서도 두 메뉴가 동시에 강조되지 않는다", () => {
    const paths = [
      "/",
      "/tax-calendar",
      "/guide",
      "/about",
      ...ENABLED_CALCULATORS.map((c) => calculatorHref(c.slug)),
      ...GUIDES.map((g) => guideHref(g.slug)),
    ];
    for (const p of paths) {
      const active = NAV_ITEMS.filter((i) => navState(i, p) !== null);
      assert.ok(active.length <= 1, `${p}: ${active.map((i) => i.key).join(",")}`);
    }
  });
});

describe("aria-current 값", () => {
  it("정확한 페이지는 page, 구역 하위 페이지는 true, 나머지는 없음", () => {
    assert.equal(ariaCurrent("page"), "page");
    assert.equal(ariaCurrent("section"), "true");
    assert.equal(ariaCurrent(null), undefined);
  });

  it("실제 경로에 대해 값이 맞게 나온다", () => {
    assert.equal(ariaCurrent(navState(byKey("calendar"), "/tax-calendar")), "page");
    assert.equal(ariaCurrent(navState(byKey("guide"), "/guide")), "page");
    assert.equal(ariaCurrent(navState(byKey("guide"), "/guide/car-tax")), "true");
    assert.equal(ariaCurrent(navState(byKey("calculators"), "/car-tax-calculator")), "true");
    assert.equal(ariaCurrent(navState(byKey("calculators"), "/")), undefined);
  });
});
