import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAmount, formatAmount, readPercent } from '../src/lib/utils/amount.ts';

test('정상 입력', () => {
    assert.equal(readAmount('3500000').value, 3_500_000);
    assert.equal(readAmount('3,500,000').value, 3_500_000);
    assert.equal(readAmount('').value, 0);
    assert.equal(readAmount('').error, null);
});

test('감사에서 지적된 잘못된 입력을 조용히 통과시키지 않는다', () => {
    // -100 -> 100 으로 바뀌던 버그
    assert.equal(readAmount('-100').value, 0);
    assert.match(readAmount('-100').error!, /음수/);

    // 1e6 -> 16 으로 바뀌던 버그
    assert.equal(readAmount('1e6').value, 0);
    assert.match(readAmount('1e6').error!, /숫자만/);

    // 100원200 -> 100200 으로 바뀌던 버그
    assert.equal(readAmount('100원200').value, 0);
    assert.match(readAmount('100원200').error!, /숫자만/);
});

test('안전 정수 범위를 넘는 입력 거부', () => {
    assert.equal(readAmount('9'.repeat(15)).value, 999_999_999_999_999);
    assert.equal(readAmount('9'.repeat(16)).value, 0);
    assert.notEqual(readAmount('9'.repeat(16)).error, null);
});

test('표시 문자열', () => {
    assert.equal(formatAmount('3500000'), '3,500,000');
    assert.equal(formatAmount('-100'), '-100'); // 오류 입력은 그대로 두고 메시지로 알린다
    assert.equal(formatAmount(''), '');
});

test('비율 입력', () => {
    assert.equal(readPercent('100').value, 100);
    assert.equal(readPercent('50.5').value, 50.5);
    assert.equal(readPercent('101').value, 0);
    assert.equal(readPercent('-1').value, 0);
});
