export interface EffectivePeriodConfig {
    id: string;
    authority: string;
    startDate: string;
    endDate: string;
    yearLabel: string;
    floor: number;
    ceiling: number;
    rate: number;
    verified: boolean;
}

export interface WithholdingRow {
    min: number;
    max: number;
    taxes: number[];
}

export interface SalaryInput {
    annualSalary: number;
    nonTaxableMonthly: number;
    dependents: number;
}

export interface SalaryResult {
    monthly: {
        gross: number;
        pension: number;
        health: number;
        longTermCare: number;
        employment: number;
        incomeTax: number;
        localTax: number;
        totalDeductions: number;
        netPay: number;
    };
    basis: {
        pensionConfig: EffectivePeriodConfig;
        isTableFound: boolean;
    };
}