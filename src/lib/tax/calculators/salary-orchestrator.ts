import { SalaryInput, SalaryResult } from "../types";
import { PENSION_LIMITS } from "../config/verified/pension-limits";
import { lookupWithholdingTax } from "../rules/withholding-engine";

export function simulateSalary(input: SalaryInput): SalaryResult | null {
    const targetDate = new Date();
    const pensionConfig = PENSION_LIMITS.find(config => {
        const start = new Date(config.startDate);
        const end = new Date(config.endDate);
        return targetDate >= start && targetDate <= end;
    });

    if (!pensionConfig) return null;

    const monthlyGross = Math.floor(input.annualSalary / 12);
    // 비과세액이 월급보다 클 경우를 대비해 하한선 0 설정
    const taxableMonthly = Math.max(0, monthlyGross - input.nonTaxableMonthly);

    let pBase = taxableMonthly;
    if (pBase < pensionConfig.floor) pBase = pensionConfig.floor;
    if (pBase > pensionConfig.ceiling) pBase = pensionConfig.ceiling;
    const pension = Math.floor((pBase * pensionConfig.rate) / 10) * 10;

    const health = Math.floor((taxableMonthly * 0.03545) / 10) * 10;
    const ltc = Math.floor((health * 0.1295) / 10) * 10;
    const employment = Math.floor((taxableMonthly * 0.009) / 10) * 10;

    const { incomeTax, isTableFound } = lookupWithholdingTax(taxableMonthly, input.dependents);
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