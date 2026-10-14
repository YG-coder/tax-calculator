import {
  AUDIENCE_GROUPS,
  type Audience,
  type Calculator,
  type CalculatorSlug,
} from './calculators.ts'

// 세목의 정식 이름을 몰라도 자주 쓰는 약칭으로 도구를 찾을 수 있다.
const SEARCH_ALIASES: Partial<Record<CalculatorSlug, readonly string[]>> = {
  'vat-calculator': ['부가가치세', 'VAT'],
  'income-tax-calculator': ['종소세', '소득세', '사업소득'],
  'freelancer-tax-calculator': ['3.3%', '삼쩜삼', '용역비', '실수령액'],
  'capital-gains-tax-calculator': ['양도세', '집 매도', '주택 매도'],
  'property-tax-calculator': ['보유세', '주택 재산세'],
  'comprehensive-real-estate-tax-calculator': ['종부세', '보유세', '다주택'],
  'withholding-calculator': ['간이세액표', '월급', '급여 소득세', '근로소득세', '갑근세'],
  'tax-free-income-calculator': ['식대', '보육수당', '자가운전보조금', '근로소득세'],
  'car-tax-calculator': ['차량', '배기량', '연납'],
  'vat-type-compare': ['부가가치세', '간이과세자', '일반과세자', 'VAT'],
}

function normalize(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(/\s+/g, '')
}

/** 선택한 상황 안에서 검색한다. 공백으로 구분한 검색어는 모두 만족해야 한다. */
export function filterCalculators(
  calculators: readonly Calculator[],
  query: string,
  audience: Audience | null = null,
): Calculator[] {
  const terms = query.normalize('NFKC').trim().split(/\s+/).filter(Boolean).map(normalize)

  return calculators.filter((calculator) => {
    const audiences = calculator.audiences as readonly Audience[]
    if (audience && !audiences.includes(audience)) return false
    if (terms.length === 0) return true

    const audienceText = AUDIENCE_GROUPS
      .filter((group) => audiences.includes(group.key))
      .map((group) => group.label)
      .join(' ')
    const haystack = normalize([
      calculator.title,
      calculator.description,
      calculator.slug,
      audienceText,
      ...(SEARCH_ALIASES[calculator.slug] ?? []),
    ].join(' '))

    return terms.every((term) => haystack.includes(term))
  })
}
