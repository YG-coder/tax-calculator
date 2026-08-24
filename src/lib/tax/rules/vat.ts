// src/lib/tax/rules/vat.ts
//
// 부가가치세 (부가가치세법 §30) — 일반과세 세율 10%

export type VatMode = 'inclusive' | 'exclusive';

export type VatSplit = { supply: number; vat: number; total: number };

/**
 * 부가세 포함/별도 금액을 공급가액·세액·합계로 분해한다.
 * 포함 금액에서 공급가액을 뽑을 때는 원 단위를 절사하고 나머지를 세액으로 둬서
 * 공급가액 + 세액 = 입력 금액이 항상 성립하게 한다.
 */
export function splitVat(amount: number, mode: VatMode): VatSplit {
    if (amount <= 0) return { supply: 0, vat: 0, total: 0 };

    if (mode === 'inclusive') {
        const supply = Math.floor(amount / 1.1);
        return { supply, vat: amount - supply, total: amount };
    }

    const vat = Math.floor(amount * 0.1);
    return { supply: amount, vat, total: amount + vat };
}
