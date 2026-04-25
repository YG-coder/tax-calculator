// src/lib/calculators.ts

export const CALCULATORS = [
  {
    slug: 'vat-calculator',
    title: '부가세 계산기',
    description: '공급가액·부가세·총금액 자동 계산. 포함/별도 선택 지원.',
    emoji: '🧾',
    enabled: true,
  },
  {
    slug: 'income-tax-calculator',
    title: '종합소득세 계산기',
    description: '연 소득 기준 예상 소득세·지방소득세 간이 계산.',
    emoji: '📊',
    enabled: true,
  },
  {
    slug: 'freelancer-tax-calculator',
    title: '프리랜서 3.3% 계산기',
    description: '원천징수 3.3% 세금과 실수령액을 즉시 확인.',
    emoji: '💻',
    enabled: true,
  },
  {
    slug: 'capital-gains-tax-calculator',
    title: '양도소득세 계산기',
    description: '취득가액·양도가액 기준 예상 양도차익 및 세액 계산.',
    emoji: '🏠',
    enabled: true,
  },
  {
    slug: 'gift-tax-calculator',
    title: '증여세 계산기',
    description: '증여금액·공제 기준 예상 증여세 누진세율 계산.',
    emoji: '🎁',
    enabled: true,
  },
  {
    slug: 'inheritance-tax-calculator',
    title: '상속세 계산기',
    description: '상속재산·공제 기준 예상 상속세 간이 계산.',
    emoji: '📋',
    enabled: true,
  },
  {
    slug: 'withholding-calculator',
    title: '원천징수세액 계산기',
    description: '월 급여·부양가족 수 기준 예상 원천징수세액 확인.',
    emoji: '💰',
    enabled: true,
  },
] as const;

export type CalculatorSlug = typeof CALCULATORS[number]['slug'];
