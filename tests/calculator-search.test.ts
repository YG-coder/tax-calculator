import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ENABLED_CALCULATORS, calculatorsFor, type Audience } from '../src/lib/calculators.ts'
import { filterCalculators } from '../src/lib/calculator-search.ts'

const slugs = (query: string, audience: Audience | null = null) =>
  filterCalculators(ENABLED_CALCULATORS, query, audience).map((calculator) => calculator.slug)

describe('계산기 검색', () => {
  it('빈 검색어는 원래 순서의 전체 목록을 보여준다', () => {
    assert.deepEqual(filterCalculators(ENABLED_CALCULATORS, '  '), ENABLED_CALCULATORS)
  })

  it('자주 쓰는 세금 약칭과 비과세 항목을 찾는다', () => {
    assert.deepEqual(slugs('양도세'), ['capital-gains-tax-calculator'])
    assert.deepEqual(slugs('종부세'), ['comprehensive-real-estate-tax-calculator'])
    assert.deepEqual(slugs('종소세'), ['income-tax-calculator'])
    assert.deepEqual(slugs('간이세액표'), ['withholding-calculator'])
    assert.deepEqual(slugs('식대'), ['tax-free-income-calculator'])
    assert.ok(slugs('부가가치세').includes('vat-calculator'))
  })

  it('근로소득세·갑근세·다주택으로 관련 계산기를 찾는다', () => {
    assert.deepEqual(slugs('근로소득세'), ['withholding-calculator', 'tax-free-income-calculator'])
    assert.deepEqual(slugs('갑근세'), ['withholding-calculator'])
    assert.deepEqual(slugs('다주택'), ['capital-gains-tax-calculator', 'comprehensive-real-estate-tax-calculator'])
    assert.deepEqual(slugs('갑근세', 'employee'), ['withholding-calculator'])
    assert.deepEqual(slugs('다주택', 'business'), [])
  })

  it('띄어 쓴 세목 이름과 복수 검색어를 함께 처리한다', () => {
    assert.deepEqual(slugs('종합 소득세'), ['income-tax-calculator'])
    assert.deepEqual(slugs('자동차 연납'), ['car-tax-calculator'])
    assert.deepEqual(slugs('직장인 비과세'), ['tax-free-income-calculator'])
    assert.deepEqual(slugs('  부동산   양도세  '), ['capital-gains-tax-calculator'])
    assert.deepEqual(slugs('양도세 자동차'), [])
  })

  it('영문 대소문자와 전각 문자를 같은 검색어로 처리한다', () => {
    assert.deepEqual(slugs('ＶＡＴ'), slugs('vat'))
    assert.deepEqual(slugs('３.３％'), slugs('3.3%'))
    assert.deepEqual(slugs('CAPITAL-GAINS-TAX-CALCULATOR'), ['capital-gains-tax-calculator'])
  })

  it('상황 필터 안에서 검색하고 검색을 비워도 필터를 유지한다', () => {
    assert.deepEqual(filterCalculators(ENABLED_CALCULATORS, '', 'employee'), calculatorsFor('employee'))
    assert.deepEqual(slugs('양도세', 'realEstate'), ['capital-gains-tax-calculator'])
    assert.deepEqual(slugs('양도세', 'employee'), [])
    assert.deepEqual(slugs('부가세', 'car'), [])
    assert.deepEqual(slugs('자동차세'), ['car-tax-calculator'])
  })

  it('전달받은 목록에 없는 계산기를 검색 결과에 추가하지 않는다', () => {
    assert.deepEqual(filterCalculators(calculatorsFor('car'), '종부세'), [])
    assert.deepEqual(slugs('없는계산기'), [])
  })
})
