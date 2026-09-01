// src/lib/tax-calendar.ts
//
// 월별 주요 세금 일정. 날짜는 모두 법령 조문으로 확인한 값만 넣는다.
// 2026-09-01 국가법령정보센터 원문 확인.

import type { CalculatorSlug } from "./calculators.ts";
import type { GuideSlug } from "./content-registry.ts";

export type TaxKind = "국세" | "지방세";

export interface TaxScheduleItem {
    /** 표시 순서를 정하는 월 (1~12) */
    month: number;
    /** 일정 이름 */
    title: string;
    /** 기간 표기 */
    period: string;
    kind: TaxKind;
    /** 무엇을 하는 일정인지 */
    summary: string;
    /** 근거 조문 */
    basis: string;
    basisUrl: string;
    /** 관련 계산기. 라벨과 경로는 계산기 레지스트리에서 가져온다 */
    calculator?: CalculatorSlug;
    /** 관련 가이드. 제목과 경로는 가이드 레지스트리에서 가져온다 */
    guide?: GuideSlug;
}

function law(name: string, article: string): string {
    return `https://www.law.go.kr/${["법령", name, article].map(encodeURIComponent).join("/")}`;
}

export const TAX_SCHEDULE: TaxScheduleItem[] = [
    {
        month: 1,
        title: "자동차세 연납 신청·납부",
        period: "1월 16일 ~ 1월 31일",
        kind: "지방세",
        summary:
            "한 해 자동차세를 한꺼번에 납부하면 연세액에서 2월 1일부터 12월 31일까지의 기간에 해당하는 세액에 이자율 5%를 곱한 금액을 공제받습니다. 2026년 기준 연세액의 약 4.58%입니다.",
        basis: "지방세법 제128조 제3항",
        basisUrl: law("지방세법", "제128조"),
        calculator: "car-tax-calculator",
        guide: "car-tax",
    },
    {
        month: 1,
        title: "부가가치세 제2기 확정신고·납부",
        period: "1월 1일 ~ 1월 25일",
        kind: "국세",
        summary: "직전 연도 7월 1일부터 12월 31일까지의 제2기 과세기간에 대한 부가가치세를 신고·납부합니다.",
        basis: "부가가치세법 제49조 제1항",
        basisUrl: law("부가가치세법", "제49조"),
        calculator: "vat-calculator",
        guide: "vat-filing",
    },
    {
        month: 3,
        title: "자동차세 연납 신청·납부 (분할납부기간)",
        period: "3월 16일 ~ 3월 31일",
        kind: "지방세",
        summary:
            "1월 연납을 놓쳤다면 3월에 신청할 수 있습니다. 4월 1일부터 12월 31일까지의 기간에 해당하는 세액에 5%를 곱한 금액을 공제받습니다. 2026년 기준 연세액의 약 3.77%입니다.",
        basis: "지방세법 제128조 제3항",
        basisUrl: law("지방세법", "제128조"),
        calculator: "car-tax-calculator",
        guide: "car-tax",
    },
    {
        month: 4,
        title: "부가가치세 제1기 예정신고·납부 (법인)",
        period: "4월 1일 ~ 4월 25일",
        kind: "국세",
        summary:
            "법인사업자는 1월 1일부터 3월 31일까지의 예정신고기간에 대해 신고·납부합니다. 개인 일반과세자는 원칙적으로 고지 납부합니다.",
        basis: "부가가치세법 제48조",
        basisUrl: law("부가가치세법", "제48조"),
        calculator: "vat-calculator",
    },
    {
        month: 5,
        title: "종합소득세 확정신고·납부",
        period: "5월 1일 ~ 5월 31일",
        kind: "국세",
        summary:
            "직전 연도에 종합소득이 있는 거주자가 종합소득 과세표준을 신고·납부합니다. 프리랜서 3.3% 원천징수분의 정산도 이때 이뤄집니다.",
        basis: "소득세법 제70조 제1항",
        basisUrl: law("소득세법", "제70조"),
        calculator: "income-tax-calculator",
        guide: "income-tax-may",
    },
    {
        month: 6,
        title: "재산세·종합부동산세 과세기준일",
        period: "6월 1일",
        kind: "지방세",
        summary:
            "이날 현재 재산을 사실상 소유한 사람이 그해 재산세와 종합부동산세의 납세의무자가 됩니다. 6월 1일 전후의 매매 시점에 따라 납세의무자가 달라집니다.",
        basis: "지방세법 제114조, 종합부동산세법 제3조",
        basisUrl: law("지방세법", "제114조"),
        calculator: "property-tax-calculator",
        guide: "property-tax",
    },
    {
        month: 6,
        title: "자동차세 제1기분 납부",
        period: "6월 16일 ~ 6월 30일",
        kind: "지방세",
        summary:
            "1월부터 6월까지에 해당하는 제1기분 자동차세를 납부합니다. 이 기간에 연세액 전액을 신고납부하면 제2기분 세액의 5%를 공제받습니다.",
        basis: "지방세법 제128조 제1항·제3항",
        basisUrl: law("지방세법", "제128조"),
        calculator: "car-tax-calculator",
        guide: "car-tax",
    },
    {
        month: 7,
        title: "재산세 납부 (주택 1/2·건축물)",
        period: "7월 16일 ~ 7월 31일",
        kind: "지방세",
        summary:
            "주택분 재산세의 절반과 건축물·선박·항공기분 재산세를 납부합니다. 주택분 연세액이 20만원 이하이면 조례에 따라 7월에 한꺼번에 부과할 수 있습니다.",
        basis: "지방세법 제115조 제1항",
        basisUrl: law("지방세법", "제115조"),
        calculator: "property-tax-calculator",
        guide: "property-tax",
    },
    {
        month: 7,
        title: "부가가치세 제1기 확정신고·납부",
        period: "7월 1일 ~ 7월 25일",
        kind: "국세",
        summary: "1월 1일부터 6월 30일까지의 제1기 과세기간에 대한 부가가치세를 신고·납부합니다.",
        basis: "부가가치세법 제49조 제1항",
        basisUrl: law("부가가치세법", "제49조"),
        calculator: "vat-calculator",
        guide: "vat-filing",
    },
    {
        month: 9,
        title: "재산세 납부 (주택 나머지 1/2·토지)",
        period: "9월 16일 ~ 9월 30일",
        kind: "지방세",
        summary: "주택분 재산세의 나머지 절반과 토지분 재산세를 납부합니다.",
        basis: "지방세법 제115조 제1항",
        basisUrl: law("지방세법", "제115조"),
        calculator: "property-tax-calculator",
        guide: "property-tax",
    },
    {
        month: 9,
        title: "자동차세 연납 신청·납부 (제2기분)",
        period: "9월 16일 ~ 9월 30일",
        kind: "지방세",
        summary:
            "12월에 낼 제2기분 자동차세를 미리 납부합니다. 제2기분 세액에 10월 1일부터 12월 31일까지의 일수(92일)를 184일로 나눈 비율과 5%를 곱한 금액을 공제받습니다. 연세액 대비 1.25%입니다.",
        basis: "지방세법 제128조 제3항",
        basisUrl: law("지방세법", "제128조"),
        calculator: "car-tax-calculator",
        guide: "car-tax",
    },
    {
        month: 9,
        title: "종합부동산세 합산배제·특례 신청",
        period: "9월 16일 ~ 9월 30일",
        kind: "국세",
        summary:
            "합산배제 임대주택 보유현황 신고, 공동명의 1주택자 특례, 일시적 2주택·상속주택·지방 저가주택의 1세대 1주택자 판정 특례를 신청하는 기간입니다.",
        basis: "종합부동산세법 제8조 제3항·제5항, 제10조의2 제2항",
        basisUrl: law("종합부동산세법", "제8조"),
        calculator: "comprehensive-real-estate-tax-calculator",
        guide: "comprehensive-real-estate-tax",
    },
    {
        month: 10,
        title: "부가가치세 제2기 예정신고·납부 (법인)",
        period: "10월 1일 ~ 10월 25일",
        kind: "국세",
        summary: "법인사업자는 7월 1일부터 9월 30일까지의 예정신고기간에 대해 신고·납부합니다.",
        basis: "부가가치세법 제48조",
        basisUrl: law("부가가치세법", "제48조"),
        calculator: "vat-calculator",
    },
    {
        month: 12,
        title: "종합부동산세 납부",
        period: "12월 1일 ~ 12월 15일",
        kind: "국세",
        summary:
            "관할 세무서장이 세액을 결정해 부과·징수합니다. 신고납부 방식을 선택할 수도 있습니다. 종합부동산세액의 20%가 농어촌특별세로 함께 부과됩니다.",
        basis: "종합부동산세법 제16조 제1항",
        basisUrl: law("종합부동산세법", "제16조"),
        calculator: "comprehensive-real-estate-tax-calculator",
        guide: "comprehensive-real-estate-tax",
    },
    {
        month: 12,
        title: "자동차세 제2기분 납부",
        period: "12월 16일 ~ 12월 31일",
        kind: "지방세",
        summary: "7월부터 12월까지에 해당하는 제2기분 자동차세를 납부합니다. 과세기준일은 12월 1일입니다.",
        basis: "지방세법 제128조 제1항",
        basisUrl: law("지방세법", "제128조"),
        calculator: "car-tax-calculator",
        guide: "car-tax",
    },
];

/** 거래가 있었던 날을 기준으로 기한이 정해지는 일정 */
export type EventDrivenScheduleItem = {
    title: string;
    period: string;
    kind: TaxKind;
    summary: string;
    basis: string;
    basisUrl: string;
    calculator: CalculatorSlug;
    guide: GuideSlug;
};

/** 양도소득세처럼 고정된 달이 없는 일정 */
export const EVENT_DRIVEN_SCHEDULE: EventDrivenScheduleItem[] = [
    {
        title: "양도소득세 예정신고·납부",
        period: "양도일이 속하는 달의 말일부터 2개월",
        kind: "국세",
        summary:
            "토지·건물·부동산에 관한 권리를 양도하면 양도일이 속하는 달의 말일부터 2개월 이내에 예정신고·납부합니다. 부담부증여의 채무액 부분은 3개월, 주식은 양도일이 속하는 반기의 말일부터 2개월입니다.",
        basis: "소득세법 제105조 제1항",
        basisUrl: law("소득세법", "제105조"),
        calculator: "capital-gains-tax-calculator",
        guide: "one-house-exemption",
    },
    {
        title: "증여세 신고·납부",
        period: "증여받은 날이 속하는 달의 말일부터 3개월",
        kind: "국세",
        summary: "증여재산을 받은 날이 속하는 달의 말일부터 3개월 이내에 신고·납부합니다.",
        basis: "상속세 및 증여세법 제68조 제1항",
        basisUrl: law("상속세 및 증여세법", "제68조"),
        calculator: "gift-tax-calculator",
        guide: "gift-split",
    },
    {
        title: "상속세 신고·납부",
        period: "상속개시일이 속하는 달의 말일부터 6개월",
        kind: "국세",
        summary:
            "상속개시일(피상속인이 사망한 날)이 속하는 달의 말일부터 6개월 이내에 신고·납부합니다. 피상속인이나 상속인이 외국에 주소를 둔 경우에는 9개월입니다.",
        basis: "상속세 및 증여세법 제67조 제1항",
        basisUrl: law("상속세 및 증여세법", "제67조"),
        calculator: "inheritance-tax-calculator",
        guide: "inheritance-vs-gift",
    },
];

export const MONTH_LABELS: Record<number, string> = {
    1: "1월", 2: "2월", 3: "3월", 4: "4월", 5: "5월", 6: "6월",
    7: "7월", 8: "8월", 9: "9월", 10: "10월", 11: "11월", 12: "12월",
};

/* ------------------------------------------------------------------ */
/* 현재 월 판정과 일정 조회                                              */
/* ------------------------------------------------------------------ */

/**
 * Asia/Seoul 기준 현재 월 (1~12).
 *
 * 서버는 대개 UTC로 돌기 때문에 `new Date().getMonth()` 를 그대로 쓰면
 * 한국 시간으로 월이 바뀌는 날 앞뒤 9시간 동안 다른 달을 보여준다.
 * 홈은 이 값을 서버에서 계산해 HTML에 그대로 렌더링한다.
 */
export function currentMonthInSeoul(now: Date = new Date()): number {
    const month = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        month: 'numeric',
    }).format(now);
    return Number(month);
}

/** 해당 월의 일정 (등록 순서 유지) */
export function scheduleForMonth(month: number): TaxScheduleItem[] {
    return TAX_SCHEDULE.filter((item) => item.month === month);
}

export type MonthlyHighlight = {
    /** 실제로 보여주는 월 */
    month: number;
    /** 그 월의 일정 */
    items: TaxScheduleItem[];
    /** 요청한 월에 일정이 없어 다음 일정으로 넘어갔는가 */
    isUpcoming: boolean;
};

/**
 * 이번 달 일정. 이번 달에 아무 일정도 없으면(2·8·11월) 다음으로 가까운 달의 일정을 돌려준다.
 * 12월을 넘어가면 다음 해 1월로 돌아온다.
 */
export function monthlyHighlight(month: number): MonthlyHighlight {
    const thisMonth = scheduleForMonth(month);
    if (thisMonth.length > 0) {
        return { month, items: thisMonth, isUpcoming: false };
    }
    for (let step = 1; step <= 12; step += 1) {
        const next = ((month - 1 + step) % 12) + 1;
        const items = scheduleForMonth(next);
        if (items.length > 0) {
            return { month: next, items, isUpcoming: true };
        }
    }
    // TAX_SCHEDULE 이 비어 있을 때만 도달한다.
    return { month, items: [], isUpcoming: false };
}
