// src/lib/tax/rules/vat.ts
//
// 부가가치세 (부가가치세법 §30) — 일반과세 세율 10%
// 포함 금액의 역산은 §29⑦(공급가액에 세액 포함 여부가 불분명한 때 110분의 100)의
// 비율을 정수 산술로 적용한다. 1.1 로 나누는 부동소수점 연산은 1,100,000원을
// 999,999원/100,001원으로 만드는 오차가 있어 쓰지 않는다.

export type VatMode = 'inclusive' | 'exclusive';

export type VatSplit = { supply: number; vat: number; total: number };

/**
 * 안전 정수 범위(입력 허용 15자리 포함)에서 정확한 floor(n / d).
 * n/d 의 부동소수점 몫이 정수 경계에서 흔들릴 수 있으므로 정수 곱셈으로 보정한다.
 */
function floorDiv(n: number, d: number): number {
    let q = Math.floor(n / d);
    if (q * d > n) q -= 1;
    else if ((q + 1) * d <= n) q += 1;
    return q;
}

/** 세액 포함 금액 × 100/110 의 원 단위 절사. 중간 곱(amount × 10)이 안전 정수를 넘지 않도록 몫·나머지로 나눠 계산한다. */
export function supplyFromInclusive(amount: number): number {
    const q = floorDiv(amount, 11);      // amount = 11q + r (0 ≤ r ≤ 10)
    const r = amount - q * 11;
    return q * 10 + floorDiv(r * 10, 11); // floor(10 × amount / 11)
}

export type VatOnInclusive = { taxBase: number; vat: number };

/**
 * 공급대가(부가가치세가 포함된 금액)에서 **과세표준과 세액**을 구한다 — 간이·일반과세 비교 계산기용.
 *
 *   과세표준(공급가액) = 공급대가 × 100/110  (부가가치세법 §29⑦)  … 원 미만 절사 (국고금관리법 §47② 과세표준 원 미만 끝수 미계산)
 *   세액             = 과세표준 × 10%       (§30 세율, §37① 매출세액 = 과세표준 × 세율) … 원 미만 절사
 *
 * ⚠ `splitVat` 의 포함 모드와 다르다. 그쪽은 공급가액을 절사한 뒤 **나머지를 세액**으로 두어 공급가액 + 세액 = 입력 금액을
 *   보존한다(이 계산기의 금액 배분 정책). 여기서는 세액을 과세표준 × 10% 로 따로 계산하므로 공급대가가 11로 나누어떨어지지 않으면
 *   세액이 `splitVat` 보다 1원 작을 수 있다(예: 10,001원 → 과세표준 9,091원·세액 909원, splitVat 은 세액 910원).
 *   합계 보존 배분의 적법성·약정 조건과 세액 자체 원 미만 처리의 현행 직접 근거는 별도 확인이 필요하다.
 *   §47②는 과세표준 끝수의 근거이며 세액 절사까지 정하는 조항은 아니다.
 * ⚠ 종전 비교 계산기는 `Math.floor((금액 / 1.1) * 0.1)` 로 계산해 검사한 일부 11의 배수에서 1원 적게 나왔다
 *   (55,000,000원 → 4,999,999원, 99원 → 8원). 정수 산술로 바꿨다. `taxBase × 10%` 는 floor(taxBase / 10) 이고,
 *   정수론상 floor(floor(10n/11)/10) = floor(n/11) 이므로 결과는 floor(공급대가 / 11) 과 같다.
 * ⚠ 입력 허용 15자리까지 안전 정수 범위에서 정확하다(`supplyFromInclusive` 가 몫·나머지로 나눠 중간 곱을 제한).
 * ⚠ 납부 단계의 10원 미만 끝수 처리(국고금관리법 §47①)는 적용하지 않는다 — 화면은 원 단위 참고값이다.
 */
export function vatOnInclusiveAmount(amount: number): VatOnInclusive {
    if (!(amount > 0) || !Number.isSafeInteger(amount)) return { taxBase: 0, vat: 0 };
    const taxBase = supplyFromInclusive(amount);
    return { taxBase, vat: floorDiv(taxBase, 10) };
}

/**
 * 부가세 포함/별도 금액을 공급가액·세액·합계로 분해한다.
 * 포함 금액에서 공급가액을 뽑을 때는 원 단위를 절사하고 나머지를 세액으로 둬서
 * 공급가액 + 세액 = 입력 금액이 항상 성립하게 한다.
 */
export function splitVat(amount: number, mode: VatMode): VatSplit {
    if (!(amount > 0) || !Number.isSafeInteger(amount)) return { supply: 0, vat: 0, total: 0 };

    if (mode === 'inclusive') {
        const supply = supplyFromInclusive(amount);
        return { supply, vat: amount - supply, total: amount };
    }

    const vat = floorDiv(amount, 10);
    return { supply: amount, vat, total: amount + vat };
}
