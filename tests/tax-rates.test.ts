import { test } from 'node:test';
import assert from 'node:assert/strict';
import { basicIncomeTax, inheritanceGiftTax, localIncomeTax } from '../src/lib/tax/rules/rates.ts';
import { splitVat } from '../src/lib/tax/rules/vat.ts';
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
