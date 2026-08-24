// src/lib/utils/amount.ts
//
// 모든 계산기의 "금액 입력" 파싱을 한 곳에서 처리한다.
//
// 기존 구현(`Number(v.replace(/[^0-9]/g, ''))`)은 숫자가 아닌 문자를 조용히 지워서
// 사용자가 의도하지 않은 값으로 계산되는 문제가 있었다.
//   -100    -> 100
//   1e6     -> 16
//   100원200 -> 100200
// 이 모듈은 그런 입력을 "지워서 통과"시키지 않고 오류로 되돌려준다.

/** 입력 허용 자릿수. 15자리 = 999조 원 (Number.MAX_SAFE_INTEGER 안쪽) */
export const MAX_AMOUNT_DIGITS = 15;

/** 입력 허용 최대 금액 (999,999,999,999,999원) */
export const MAX_AMOUNT = 10 ** MAX_AMOUNT_DIGITS - 1;

export type AmountReading = {
    /** 유효한 입력이면 그 값, 아니면 0 */
    value: number;
    /** 사용자에게 보여줄 오류 메시지. 유효하면 null */
    error: string | null;
};

const ERR_NEGATIVE = '음수 금액은 입력할 수 없습니다';
const ERR_NOT_NUMBER = '숫자만 입력할 수 있습니다 (예: 3500000)';
const ERR_TOO_LARGE = `입력 가능한 최대 금액(${MAX_AMOUNT_DIGITS}자리)을 초과했습니다`;

/** 입력 문자열을 금액으로 읽는다. 유효하지 않으면 value 0 + error 메시지. */
export function readAmount(text: string | null | undefined): AmountReading {
    const raw = (text ?? '').replace(/[,\s]/g, '');

    if (raw === '') return { value: 0, error: null };
    if (raw.startsWith('-')) return { value: 0, error: ERR_NEGATIVE };
    if (!/^\d+$/.test(raw)) return { value: 0, error: ERR_NOT_NUMBER };

    const normalized = raw.replace(/^0+(?=\d)/, '');
    if (normalized.length > MAX_AMOUNT_DIGITS) return { value: 0, error: ERR_TOO_LARGE };

    const value = Number(normalized);
    if (!Number.isSafeInteger(value)) return { value: 0, error: ERR_TOO_LARGE };

    return { value, error: null };
}

/** 금액 값만 필요할 때. 유효하지 않으면 0. */
export function amountValue(text: string | null | undefined): number {
    return readAmount(text).value;
}

/** 오류 메시지만 필요할 때. 유효하면 null. */
export function amountError(text: string | null | undefined): string | null {
    return readAmount(text).error;
}

/**
 * 화면 표시용 문자열.
 * 유효한 값이면 천 단위 콤마로 정리하고,
 * 유효하지 않으면 사용자가 입력한 그대로 남겨 오류 메시지와 함께 보이게 한다.
 */
export function formatAmount(text: string | null | undefined): string {
    if (!text) return '';
    const { value, error } = readAmount(text);
    if (error) return text;
    if (text.replace(/[,\s]/g, '') === '') return '';
    return value.toLocaleString('ko-KR');
}

/** 0~100 사이 비율(%) 입력 파싱. 소수 한 자리까지 허용. */
export function readPercent(text: string | null | undefined): AmountReading {
    const raw = (text ?? '').replace(/[,\s%]/g, '');
    if (raw === '') return { value: 0, error: null };
    if (raw.startsWith('-')) return { value: 0, error: ERR_NEGATIVE };
    if (!/^\d+(\.\d+)?$/.test(raw)) return { value: 0, error: '0에서 100 사이 숫자를 입력하세요' };

    const value = Number(raw);
    if (!Number.isFinite(value) || value > 100) {
        return { value: 0, error: '0에서 100 사이 숫자를 입력하세요' };
    }
    return { value, error: null };
}
