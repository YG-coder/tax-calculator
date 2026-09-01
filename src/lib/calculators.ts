// src/lib/calculators.ts
//
// 계산기 레지스트리 — 홈, 내비, 사이트맵, 근거 표시가 모두 이 목록에서 파생된다.
//
// 홈 대시보드가 쓰는 두 가지 분류도 여기에 함께 둔다.
// · popularity: 홈 상단 "인기 계산기"에 올릴 순서. 낮은 숫자가 앞이다.
// · audiences:  세목 이름을 모르는 사용자를 위한 상황별 탐색 분류.
// 이 정보를 컴포넌트에 하드코딩하면 계산기를 추가할 때 한쪽만 고쳐져 어긋난다.

/** 상황별 탐색 분류 */
export type Audience = 'employee' | 'business' | 'realEstate' | 'car' | 'inheritance';

export const CALCULATORS = [
  {
    slug: 'vat-calculator',
    title: '부가세 계산기',
    description: '공급가액·부가세·총금액 자동 계산. 포함/별도 선택 지원.',
    emoji: '🧾',
    enabled: true,
    audiences: ['business'],
  },
  {
    slug: 'income-tax-calculator',
    title: '종합소득세 계산기',
    description: '연 소득 기준 예상 소득세·지방소득세 간이 계산.',
    emoji: '📊',
    enabled: true,
    audiences: ['business'],
    popularity: 1,
  },
  {
    slug: 'freelancer-tax-calculator',
    title: '프리랜서 3.3% 계산기',
    description: '원천징수 3.3% 세금과 실수령액을 즉시 확인.',
    emoji: '💻',
    enabled: true,
    audiences: ['business'],
  },
  {
    slug: 'capital-gains-tax-calculator',
    title: '양도소득세 계산기',
    description: '장기보유특별공제·1세대 1주택 비과세·단기·다주택 중과까지 반영한 양도세 계산.',
    emoji: '🏠',
    enabled: true,
    audiences: ['realEstate'],
    popularity: 2,
  },
  {
    slug: 'property-tax-calculator',
    title: '재산세 계산기',
    description: '주택 공시가격으로 연간 재산세와 7월·9월 납부액을 계산합니다.',
    emoji: '🏡',
    enabled: true,
    audiences: ['realEstate'],
  },
  {
    slug: 'comprehensive-real-estate-tax-calculator',
    title: '종합부동산세 계산기',
    description: '공시가격 합계 기준 개인 주택분 종부세와 농어촌특별세를 단계별로 계산.',
    emoji: '🏢',
    enabled: true,
    audiences: ['realEstate'],
    popularity: 4,
    isNew: true,
  },
  {
    slug: 'gift-tax-calculator',
    title: '증여세 계산기',
    description: '증여금액·공제 기준 예상 증여세 누진세율 계산.',
    emoji: '🎁',
    enabled: true,
    audiences: ['inheritance'],
  },
  {
    slug: 'inheritance-tax-calculator',
    title: '상속세 계산기',
    description: '상속재산·공제 기준 예상 상속세 간이 계산.',
    emoji: '📋',
    enabled: true,
    audiences: ['inheritance'],
  },
  {
    slug: 'withholding-calculator',
    title: '원천징수세액 계산기',
    description: '월 급여·부양가족 수 기준 예상 원천징수세액 확인.',
    emoji: '💰',
    enabled: true,
    audiences: ['employee'],
  },
  {
    slug: 'tax-free-income-calculator',
    title: '근로소득 비과세 계산기',
    description: '식대·자가운전·보육수당 등 비과세 급여와 과세대상 급여 계산.',
    emoji: '🧮',
    enabled: true,
    audiences: ['employee'],
  },
  {
    slug: 'car-tax-calculator',
    title: '자동차세 계산기',
    description: '배기량·차령 경감·지방교육세·연납 공제까지 구분해 계산.',
    emoji: '🚗',
    enabled: true,
    audiences: ['car'],
    popularity: 3,
  },
  {
    slug: 'vat-type-compare',
    title: '간이과세 vs 일반과세 비교',
    description: '연매출·매입·업종 기준 간이·일반과세 부가세 비교 및 유불리 안내.',
    emoji: '⚖️',
    enabled: true,
    audiences: ['business'],
  },
] as const satisfies readonly {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  enabled: boolean;
  audiences: readonly Audience[];
  /** 홈 상단 노출 순서. 없으면 인기 계산기에 올리지 않는다. */
  popularity?: number;
  /** 최근에 추가한 계산기 — 홈에서 배지로 표시한다. */
  isNew?: boolean;
}[];

export type Calculator = typeof CALCULATORS[number];
export type CalculatorSlug = Calculator['slug'];

/** 노출 중인 계산기 */
export const ENABLED_CALCULATORS = CALCULATORS.filter((c) => c.enabled);

/** 계산기 경로. 링크를 만들 때 이 함수만 쓴다. */
export function calculatorHref(slug: CalculatorSlug): string {
  return `/${slug}`;
}

const BY_SLUG = new Map<string, Calculator>(CALCULATORS.map((c) => [c.slug, c]));

export function calculatorBySlug(slug: CalculatorSlug): Calculator {
  const hit = BY_SLUG.get(slug);
  // 타입상 도달할 수 없다. 레지스트리를 손으로 고치다 어긋났을 때만 걸린다.
  if (!hit) throw new Error(`알 수 없는 계산기 슬러그: ${slug}`);
  return hit;
}

/**
 * 홈 상단에 강조할 계산기. popularity 오름차순.
 * 목록 자체는 레지스트리에서 파생되므로 컴포넌트가 슬러그를 다시 적을 필요가 없다.
 */
export const POPULAR_CALCULATORS = ENABLED_CALCULATORS
  .filter((c): c is Extract<Calculator, { popularity: number }> => 'popularity' in c)
  .slice()
  .sort((a, b) => a.popularity - b.popularity);

/** 상황별 탐색 분류. 표시 순서는 이 배열 순서를 따른다. */
export const AUDIENCE_GROUPS: { key: Audience; label: string; hint: string }[] = [
  { key: 'employee', label: '직장인', hint: '월급에서 떼는 세금과 비과세 수당' },
  { key: 'business', label: '프리랜서·사업자', hint: '3.3% 원천징수부터 부가세·종합소득세까지' },
  { key: 'realEstate', label: '부동산', hint: '보유할 때와 팔 때 내는 세금' },
  { key: 'car', label: '자동차', hint: '자동차세와 연납 공제' },
  { key: 'inheritance', label: '상속·증여', hint: '물려주거나 물려받을 때' },
];

/** 해당 분류에 속한 계산기 */
export function calculatorsFor(audience: Audience): Calculator[] {
  return ENABLED_CALCULATORS.filter((c) => (c.audiences as readonly Audience[]).includes(audience));
}
