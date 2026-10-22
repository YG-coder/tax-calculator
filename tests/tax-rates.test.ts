import { test } from 'node:test';
import assert from 'node:assert/strict';
import { basicIncomeTax, inheritanceGiftTax, localIncomeTax } from '../src/lib/tax/rules/rates.ts';
import { splitVat, vatOnInclusiveAmount } from '../src/lib/tax/rules/vat.ts';
import { freelancerWithholding } from '../src/lib/tax/rules/freelancer.ts';
import { calcPropertyTax } from '../src/app/property-tax-calculator/calc.ts';

test('소득세 기본세율 경계값 (소득세법 §55)', () => {
    assert.equal(basicIncomeTax(0), 0);
    assert.equal(basicIncomeTax(-1), 0);
    assert.equal(basicIncomeTax(14_000_000), 840_000);
    assert.equal(basicIncomeTax(14_000_001), 840_000 + 0.15);
    assert.equal(basicIncomeTax(50_000_000), 6_240_000);
    assert.equal(basicIncomeTax(88_000_000), 15_360_000);
    assert.equal(basicIncomeTax(150_000_000), 37_060_000);
    assert.equal(basicIncomeTax(300_000_000), 94_060_000);
    assert.equal(basicIncomeTax(500_000_000), 174_060_000);
    assert.equal(basicIncomeTax(1_000_000_000), 384_060_000);
});

test('감사 통과 사례 재확인: 양도가 5억·취득가 3억·기본공제 250만', () => {
    const taxBase = 500_000_000 - 300_000_000 - 2_500_000;
    const tax = Math.floor(basicIncomeTax(taxBase));
    assert.equal(tax, 55_110_000);
    assert.equal(localIncomeTax(tax), 5_511_000);
});

test('상속·증여세 누진세율 경계값 (상증법 §26·§56)', () => {
    assert.equal(inheritanceGiftTax(0), 0);
    assert.equal(inheritanceGiftTax(100_000_000), 10_000_000);
    assert.equal(inheritanceGiftTax(500_000_000), 90_000_000);
    assert.equal(inheritanceGiftTax(1_000_000_000), 240_000_000);
    assert.equal(inheritanceGiftTax(3_000_000_000), 1_040_000_000);
    assert.equal(inheritanceGiftTax(5_000_000_000), 2_040_000_000);
});

test('부가세: 공급가액 + 세액 = 입력 금액', () => {
    const inc = splitVat(11_000, 'inclusive');
    assert.deepEqual(inc, { supply: 10_000, vat: 1_000, total: 11_000 });
    assert.equal(inc.supply + inc.vat, 11_000);

    // 나누어떨어지지 않는 금액도 합계가 어긋나면 안 된다
    const odd = splitVat(10_001, 'inclusive');
    assert.equal(odd.supply + odd.vat, 10_001);

    assert.deepEqual(splitVat(10_000, 'exclusive'), { supply: 10_000, vat: 1_000, total: 11_000 });
    assert.deepEqual(splitVat(0, 'inclusive'), { supply: 0, vat: 0, total: 0 });
});

test('부가세 포함 역산: 110분의 100 을 정수로 적용해 1.1 나눗셈 오차가 없다 (부가가치세법 §29⑦·§30)', () => {
    // 기대값은 구현을 호출하지 않고 손으로 적는다: 공급가액 = floor(금액 × 10 / 11), 세액 = 금액 − 공급가액
    const cases: [number, number, number][] = [
        [110, 100, 10],
        [1_100, 1_000, 100],
        [11_000, 10_000, 1_000],
        [33_000, 30_000, 3_000],
        [110_000, 100_000, 10_000],
        [1_100_000, 1_000_000, 100_000],
        [3_300_000, 3_000_000, 300_000],
        [11_000_000, 10_000_000, 1_000_000],
        [10_001, 9_091, 910],
        [999_999_999_999_999, 909_090_909_090_908, 90_909_090_909_091], // 입력 허용 최대 15자리
    ];
    for (const [amount, supply, vat] of cases) {
        assert.deepEqual(splitVat(amount, 'inclusive'), { supply, vat, total: amount }, `${amount}원`);
        assert.equal(supply + vat, amount);
    }
    // BigInt 로 만든 독립 기준과 1원 단위 구간 비교 (구현의 산술을 복제하지 않는다)
    for (let amount = 1; amount <= 200_000; amount += 1) {
        const supply = Number((BigInt(amount) * BigInt(10)) / BigInt(11));
        const actual = splitVat(amount, 'inclusive');
        if (actual.supply !== supply || actual.vat !== amount - supply) {
            throw new Error(`${amount}원: 기대 ${supply}/${amount - supply}, 실제 ${actual.supply}/${actual.vat}`);
        }
    }
    for (const amount of [999_999_999_999_989, 999_999_999_999_990, 999_999_999_999_999, 123_456_789_012_345]) {
        const supply = Number((BigInt(amount) * BigInt(10)) / BigInt(11));
        assert.deepEqual(splitVat(amount, 'inclusive'), { supply, vat: amount - supply, total: amount });
    }
});

test('부가세 별도: 세액 = floor(공급가액 / 10), 큰 금액과 0·음수 계약 유지', () => {
    assert.deepEqual(splitVat(10_001, 'exclusive'), { supply: 10_001, vat: 1_000, total: 11_001 });
    assert.deepEqual(splitVat(999_999_999_999_999, 'exclusive'), { supply: 999_999_999_999_999, vat: 99_999_999_999_999, total: 1_099_999_999_999_998 });
    assert.deepEqual(splitVat(0, 'exclusive'), { supply: 0, vat: 0, total: 0 });
    assert.deepEqual(splitVat(-5, 'inclusive'), { supply: 0, vat: 0, total: 0 });
});

test('프리랜서 3.3% (소득세법 §129)', () => {
    const r = freelancerWithholding(1_000_000);
    assert.equal(r.incomeTax, 30_000);
    assert.equal(r.localTax, 3_000);
    assert.equal(r.totalTax, 33_000);
    assert.equal(r.net, 967_000);
    assert.deepEqual(freelancerWithholding(0), { incomeTax: 0, localTax: 0, totalTax: 0, net: 0 });
});

test('재산세: 공정시장가액비율 구간과 1주택 특례', () => {
    const single3 = calcPropertyTax({ publishedPrice: 300_000_000, isSingleHome: true, applyUrbanArea: true });
    assert.equal(single3.fmvRatio, 0.43);
    assert.equal(single3.rateType, '1주택 특례세율');

    const single6 = calcPropertyTax({ publishedPrice: 600_000_000, isSingleHome: true, applyUrbanArea: true });
    assert.equal(single6.fmvRatio, 0.44);

    const single7 = calcPropertyTax({ publishedPrice: 700_000_000, isSingleHome: true, applyUrbanArea: true });
    assert.equal(single7.fmvRatio, 0.45);

    const multi = calcPropertyTax({ publishedPrice: 300_000_000, isSingleHome: false, applyUrbanArea: true });
    assert.equal(multi.fmvRatio, 0.6);
    assert.equal(multi.rateType, '일반세율');
});

test('재산세: 9억 초과 1주택은 특례세율이 아니다', () => {
    const over9 = calcPropertyTax({ publishedPrice: 1_000_000_000, isSingleHome: true, applyUrbanArea: true });
    assert.equal(over9.rateType, '일반세율');
});

test('재산세: 7월·9월 분할 합계가 연세액과 일치', () => {
    const r = calcPropertyTax({ publishedPrice: 500_000_000, isSingleHome: true, applyUrbanArea: true });
    assert.equal(r.july + r.sept, r.annualTotal);
});

test('재산세: 전년도 세액 미입력이 세액 0원으로 눌리지 않는다', () => {
    const withNull = calcPropertyTax({
        publishedPrice: 500_000_000, isSingleHome: true, applyUrbanArea: true,
        prevYearBaseTax: null, prevYearUrbanTax: null,
    });
    assert.ok(withNull.baseTax > 0);
    assert.equal(withNull.ceilingChecked, false);
});

test('공급대가 → 과세표준·세액(비교 계산기): 현재 구현의 100/110 과세표준 절사와 세액 절사 산술 (법적 적정성 판정 아님)', () => {
    // 기대값은 손으로 적는다: 과세표준 = floor(공급대가 × 10 / 11), 세액 = floor(과세표준 / 10)
    const cases: [number, number, number][] = [
        [0, 0, 0],
        [1, 0, 0],
        [10, 9, 0],
        [11, 10, 1],
        [99, 90, 9],                 // 종전 소수식은 8원
        [100, 90, 9],
        [110, 100, 10],
        [10_001, 9_091, 909],        // splitVat 포함 모드는 세액 910원(나머지) — 규칙이 다르다
        [10_999, 9_999, 999],
        [11_000, 10_000, 1_000],
        [11_001, 10_000, 1_000],
        [1_100_000, 1_000_000, 100_000],
        [33_000_000, 30_000_000, 3_000_000],
        [55_000_000, 50_000_000, 5_000_000],   // 종전 소수식은 4,999,999원 (재현 입력)
        [104_000_000, 94_545_454, 9_454_545],  // 간이과세 기준금액
        [999_999_999_999_999, 909_090_909_090_908, 90_909_090_909_090], // 입력 허용 최대 15자리
    ];
    for (const [amount, taxBase, vat] of cases) {
        assert.deepEqual(vatOnInclusiveAmount(amount), { taxBase, vat }, `${amount}원`);
    }
    assert.deepEqual(vatOnInclusiveAmount(-5), { taxBase: 0, vat: 0 });
    assert.deepEqual(vatOnInclusiveAmount(1.5), { taxBase: 0, vat: 0 });
});

test('공급대가 세액: BigInt 독립 기준과 1원 단위 전수 비교, 종전 소수식 오차 재현', () => {
    let legacyMismatches = 0;
    for (let amount = 0; amount <= 200_000; amount += 1) {
        const taxBase = Number((BigInt(amount) * BigInt(10)) / BigInt(11));
        const vat = Number(BigInt(taxBase) / BigInt(10));
        const actual = vatOnInclusiveAmount(amount);
        if (actual.taxBase !== taxBase || actual.vat !== vat) {
            throw new Error(`${amount}원: 기대 ${taxBase}/${vat}, 실제 ${actual.taxBase}/${actual.vat}`);
        }
        // 정수론: floor(floor(10n/11)/10) = floor(n/11)
        assert.equal(vat, Number(BigInt(amount) / BigInt(11)));
        if (Math.floor((amount / 1.1) * 0.1) !== vat) legacyMismatches += 1;
    }
    assert.ok(legacyMismatches > 0, '종전 소수식이 전 구간에서 정확하다면 이 테스트의 전제가 틀린 것이다');
    for (const amount of [999_999_999_999_989, 999_999_999_999_990, 999_999_999_999_999, 123_456_789_012_345]) {
        const taxBase = Number((BigInt(amount) * BigInt(10)) / BigInt(11));
        assert.deepEqual(vatOnInclusiveAmount(amount), { taxBase, vat: Number(BigInt(taxBase) / BigInt(10)) });
    }
});

test('비교 계산기 일반과세 납부·환급: 매출·매입에 같은 규칙, 같으면 0, 매입이 크면 음수(환급) 유지', () => {
    const net = (rev: number, pur: number) => vatOnInclusiveAmount(rev).vat - vatOnInclusiveAmount(pur).vat;
    assert.equal(net(55_000_000, 55_000_000), 0);
    assert.equal(net(55_000_000, 0), 5_000_000);
    assert.equal(net(33_000_000, 55_000_000), -2_000_000); // 종전 소수식은 -1,999,999원
    assert.equal(net(1_100_000, 10_001), 100_000 - 909);
    assert.equal(net(0, 0), 0);
});
