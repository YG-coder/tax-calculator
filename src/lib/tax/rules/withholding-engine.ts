import {
    TEN_MILLION_BASE_2026,
    WITHHOLDING_TABLE_2026,
} from "../config/verified/withholding-table-2026.ts";

/**
 * 근로소득 간이세액표 조회.
 *
 * 소득세법 시행령 별표 2 <개정 2026. 2. 27.>의 표와
 * 월급여 1,000만원 초과 구간 산식을 그대로 적용한다.
 */
export function lookupWithholdingTax(taxableMonthly: number, dependents: number): number {
    if (!Number.isFinite(taxableMonthly) || taxableMonthly <= 0) return 0;

    const familyCount = Math.max(1, Math.floor(dependents));
    const tableFamilyIndex = Math.min(familyCount, 11) - 1;
    let tax: number;

    if (taxableMonthly < 770_000) {
        tax = 0;
    } else if (taxableMonthly < 10_000_000) {
        const row = WITHHOLDING_TABLE_2026.find(
            ([min, max]) => taxableMonthly >= min && taxableMonthly < max,
        );
        tax = row?.[tableFamilyIndex + 2] ?? 0;
    } else if (taxableMonthly === 10_000_000) {
        tax = TEN_MILLION_BASE_2026[tableFamilyIndex];
    } else {
        const base = TEN_MILLION_BASE_2026[tableFamilyIndex];
        if (taxableMonthly <= 14_000_000) {
            tax = base + 25_000 + (taxableMonthly - 10_000_000) * 0.98 * 0.35;
        } else if (taxableMonthly <= 28_000_000) {
            tax = base + 1_397_000 + (taxableMonthly - 14_000_000) * 0.98 * 0.38;
        } else if (taxableMonthly <= 30_000_000) {
            tax = base + 6_610_600 + (taxableMonthly - 28_000_000) * 0.98 * 0.4;
        } else if (taxableMonthly <= 45_000_000) {
            tax = base + 7_394_600 + (taxableMonthly - 30_000_000) * 0.4;
        } else if (taxableMonthly <= 87_000_000) {
            tax = base + 13_394_600 + (taxableMonthly - 45_000_000) * 0.42;
        } else {
            tax = base + 31_034_600 + (taxableMonthly - 87_000_000) * 0.45;
        }
    }

    // 가족 11명 초과 시 별표 2 제4호의 차감 산식 적용.
    if (familyCount > 11) {
        const tax10 = lookupWithholdingTax(taxableMonthly, 10);
        const tax11 = lookupWithholdingTax(taxableMonthly, 11);
        tax = tax11 - (tax10 - tax11) * (familyCount - 11);
    }

    return Math.max(0, Math.floor(tax / 10) * 10);
}
