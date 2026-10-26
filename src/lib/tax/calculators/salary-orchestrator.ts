import type { SalaryInput, SalaryResult } from "../types";
import { PENSION_LIMITS } from "../config/verified/pension-limits.ts";
import { lookupWithholdingTax } from "../rules/withholding-engine.ts";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;
// 고용보험 근로자 요율 0.009 = 1000분의 9
const EMPLOYMENT_RATE_PER_1000 = 9;
// 장기요양보험료율(건강보험료 대비) 0.1314 = 1만분의 1314
const LTC_RATE_PER_10000 = 1314;

// 기간 경계는 한국 달력으로 읽는다. 날짜만 적힌 시작일은 그날 한국 시각 0시, 날짜만 적힌 종료일은 그날 끝까지다.
// 시간대가 적힌 시각은 그 시각을 그대로 쓴다. 한국은 일광절약시간이 없어 하루를 24시간으로 센다.
function periodStartMs(value: string): number {
    return DATE_ONLY.test(value) ? Date.parse(`${value}T00:00:00+09:00`) : Date.parse(value);
}

function periodEndMs(value: string): number {
    return DATE_ONLY.test(value) ? Date.parse(`${value}T00:00:00+09:00`) + DAY_MS - 1 : Date.parse(value);
}

// targetDate는 생략하면 현재 시각이다(기존 동작). 테스트가 시계를 건드리지 않고 시각을 정할 수 있게 둔다.
export function simulateSalary(input: SalaryInput, targetDate: Date = new Date()): SalaryResult | null {
    const target = targetDate.getTime();
    const pensionConfig = PENSION_LIMITS.find(config =>
        target >= periodStartMs(config.startDate) && target <= periodEndMs(config.endDate)
    );

    if (!pensionConfig) return null;

    const monthlyGross = Math.floor(input.annualSalary / 12);
    // 비과세액이 월급보다 클 경우를 대비해 하한선 0 설정
    const taxableMonthly = Math.max(0, monthlyGross - input.nonTaxableMonthly);

    // 기준소득월액: 소득월액의 천원 미만을 버린 뒤 상·하한을 적용한다(국민연금법 시행령 제5조제1항·제5항).
    let pBase = Math.floor(taxableMonthly / 1000) * 1000;
    if (pBase < pensionConfig.floor) pBase = pensionConfig.floor;
    if (pBase > pensionConfig.ceiling) pBase = pensionConfig.ceiling;
    const pension = Math.floor((pBase * pensionConfig.rate) / 10) * 10;

    const health = Math.floor((taxableMonthly * 0.03595) / 10) * 10;
    // 0.1314를 부동소수로 곱하면 나눠떨어지는 일부 값(예: 건강보험료 50,000원 → 6,570원)이 10원 내려가므로 정수로 곱한 뒤 나눈다(10원 미만 버림은 그대로).
    const ltc = Math.floor((health * LTC_RATE_PER_10000) / 100_000) * 10;
    // 0.009를 부동소수로 곱하면 10원 경계에서 값이 내려가므로 정수로 곱한 뒤 나눈다(10원 미만 버림은 그대로).
    const employment = Math.floor((taxableMonthly * EMPLOYMENT_RATE_PER_1000) / 10_000) * 10;

    const incomeTax = lookupWithholdingTax(taxableMonthly, input.dependents);
    const isTableFound = true;
    const localTax = Math.floor(incomeTax * 0.1);

    const totalDeductions = pension + health + ltc + employment + incomeTax + localTax;

    return {
        monthly: {
            gross: monthlyGross,
            pension, health, longTermCare: ltc, employment,
            incomeTax, localTax,
            totalDeductions,
            netPay: monthlyGross - totalDeductions
        },
        basis: { pensionConfig, isTableFound }
    };
}
