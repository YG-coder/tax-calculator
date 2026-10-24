import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCapitalGains, type CapitalGainsInput } from '../src/lib/tax/rules/capital-gains.ts';
import { cardDeduction2026 } from '../src/lib/tax/rules/year-end.ts';

const highPriceOneHouse = (transferPrice: number, acquisitionPrice: number): CapitalGainsInput => ({
    assetType: 'house',
    transferPrice,
    acquisitionPrice,
    expenses: 0,
    acquisitionDate: '2015-03-02',
    transferDate: '2026-10-01',
    oneHouseOneHousehold: true,
    adjustedAreaAtAcquisition: false,
    residenceMonths: 60,
    housesOwned: 1,
    adjustedAreaAtTransfer: false,
    basicDeductionUsed: 0,
    assumeLatestRules: true,
});

const shortTerm = (assetType: CapitalGainsInput['assetType'], transferPrice: number, acquisitionPrice: number): CapitalGainsInput => ({
    assetType,
    transferPrice,
    acquisitionPrice,
    expenses: 0,
    acquisitionDate: '2026-01-10',
    transferDate: '2026-10-01',
    oneHouseOneHousehold: false,
    housesOwned: 1,
    adjustedAreaAtTransfer: false,
    basicDeductionUsed: 0,
    assumeLatestRules: true,
});

test('고가 1주택 과세 양도차익: 차익 × (양도가 − 12억) ÷ 양도가가 정확히 정수면 1원을 빼지 않는다', () => {
    // 2,799,210,999 × 2,587,580,000 ÷ 3,787,580,000 = 1,912,350,999 (정수)
    const a = calculateCapitalGains(highPriceOneHouse(3_787_580_000, 988_369_001));
    assert.equal(a.ok, true);
    if (!a.ok) return;
    assert.equal(a.taxableGain, 1_912_350_999);
    // 1,347,443,001 × 1,768,590,000 ÷ 2,968,590,000 = 802,763,001 (정수)
    const b = calculateCapitalGains(highPriceOneHouse(2_968_590_000, 1_621_146_999));
    assert.equal(b.ok, true);
    if (!b.ok) return;
    assert.equal(b.taxableGain, 802_763_001);
    // 이후 단계는 바로잡힌 과세 양도차익으로 이어진다
    assert.equal(b.taxBase, b.taxableGain - b.longTerm.amount - b.basicDeduction);
    assert.equal(b.longTerm.amount, Math.floor((b.taxableGain * Math.round(b.longTerm.totalRate * 100)) / 100));
});

test('1년 미만 70% 단일세율: 과세표준이 10원 단위면 산출세액도 정확히 계산한다', () => {
    const a = calculateCapitalGains(shortTerm('salesRight', 604_498_674, 513_451_124));
    assert.equal(a.ok, true);
    if (!a.ok) return;
    assert.equal(a.taxBase, 88_547_550);
    assert.equal(a.incomeTax, 61_983_285);
    assert.equal(a.localTax, 6_198_328);
    const b = calculateCapitalGains(shortTerm('house', 1_100_546_483, 355_724_573));
    assert.equal(b.ok, true);
    if (!b.ok) return;
    assert.equal(b.taxBase, 742_321_910);
    assert.equal(b.incomeTax, 519_625_337);
});

test('1년 미만 70% 단일세율: 10원 단위 과세표준 전 구간 표본이 정수 계산과 같다', () => {
    const mismatches: number[] = [];
    for (let k = 1; k <= 3_000; k++) {
        const taxBase = k * 33_330;               // 10원 단위
        const gain = taxBase + 2_500_000;         // 기본공제 250만원
        const r = calculateCapitalGains(shortTerm('house', 500_000_000 + gain, 500_000_000));
        if (!r.ok || r.taxBase !== taxBase || r.incomeTax !== (taxBase / 10) * 7) mismatches.push(taxBase);
    }
    assert.deepEqual(mismatches, []);
});

test('신용카드 등 소득공제: 세 구간 공제액의 합이 정수인 경계에서 1원이 빠지지 않는다', () => {
    const a = cardDeduction2026(35_225_036, 0, { credit: 48_012_741, debitCash: 15_867_316, market: 3_470_651, transit: 3_753_758, cultureCredit: 471_203, cultureDebit: 2_263_908 });
    assert.equal(a.raw, 14_351_464);
    const b = cardDeduction2026(143_324_012, 2, { credit: 41_079_390, debitCash: 29_855_361, market: 7_551_815, transit: 1_326_134, cultureCredit: 1_804_111, cultureDebit: 2_977_838 });
    assert.equal(b.raw, 14_459_014);
});

test('신용카드 등 소득공제: 정상값(문턱 미만·문턱 초과)은 기존과 같다', () => {
    assert.equal(cardDeduction2026(40_000_000, 0, { credit: 5_000_000, debitCash: 0, market: 0, transit: 0, cultureCredit: 0, cultureDebit: 0 }).raw, 0);
    // 문턱 1,000만원 → 신용 2,000만원 중 1,000만원 × 15% = 1,500,000원
    assert.equal(cardDeduction2026(40_000_000, 0, { credit: 20_000_000, debitCash: 0, market: 0, transit: 0, cultureCredit: 0, cultureDebit: 0 }).raw, 1_500_000);
});
