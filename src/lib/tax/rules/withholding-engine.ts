import { WITHHOLDING_TABLE_2025 } from "../config/verified/withholding-table-2025";

export function lookupWithholdingTax(taxableMonthly: number, dependents: number) {
    const row = WITHHOLDING_TABLE_2025.find(
        r => taxableMonthly >= r.min && taxableMonthly < r.max
    );
    if (!row) return { incomeTax: 0, isTableFound: false };
    const familyIdx = Math.min(dependents - 1, row.taxes.length - 1);
    return { incomeTax: row.taxes[familyIdx] || 0, isTableFound: true };
}