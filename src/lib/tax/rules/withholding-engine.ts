import {
    IS_OFFICIAL_TABLE,
    WITHHOLDING_TABLE_2025,
} from "../config/verified/withholding-table-2025";

/**
 * 근로소득 간이세액표 조회.
 *
 * 표 데이터가 아직 공식 전체 표로 교체되지 않았으면, 잘못된 세액이 화면에
 * 노출되는 것을 막기 위해 조회 자체를 실패시킨다.
 * (사람이 주의하는 대신 코드가 막는다)
 */
export function lookupWithholdingTax(taxableMonthly: number, dependents: number) {
    if (!IS_OFFICIAL_TABLE) {
        throw new Error(
            "근로소득 간이세액표가 공식 데이터로 교체되지 않았습니다. " +
            "withholding-table-2025.ts 를 홈택스 공식 표로 채우고 IS_OFFICIAL_TABLE 을 true 로 바꾸세요.",
        );
    }

    const row = WITHHOLDING_TABLE_2025.find(
        r => taxableMonthly >= r.min && taxableMonthly < r.max
    );
    if (!row) return { incomeTax: 0, isTableFound: false };
    const familyIdx = Math.min(dependents - 1, row.taxes.length - 1);
    return { incomeTax: row.taxes[familyIdx] || 0, isTableFound: true };
}
