// src/lib/guides.ts
//
// 가이드 목록의 단일 소스.
//
// · /guide 목록 페이지와 홈의 추천 가이드가 같은 데이터를 쓴다.
//   제목·설명을 두 곳에 적으면 한쪽만 고쳐져 어긋난다.
// · slug 는 GuideSlug(content-registry 의 GUIDE_LAST_MODIFIED 키)로 타입이 묶여 있어서,
//   가이드를 추가하면서 최근 수정일을 빠뜨리면 타입 검사에서 걸린다.

import type { GuideSlug } from './content-registry';

export type Guide = {
    slug: GuideSlug;
    title: string;
    description: string;
    category: string;
};

export const GUIDES: Guide[] = [
  {
    slug: 'freelancer-tax',
    title: '프리랜서 종합소득세 신고 완벽 가이드',
    description: '3.3% 원천징수부터 5월 종합소득세 신고까지, 프리랜서가 꼭 알아야 할 절차와 절세 팁을 단계별로 정리했습니다.',
    category: '프리랜서',
  },
  {
    slug: 'freelancer-refund',
    title: '프리랜서 3.3%, 환급받는 사람 vs 추가납부하는 사람',
    description: '3.3% 원천징수가 환급으로 돌아오는 사람과 추가 납부가 생기는 사람의 차이를 수입 구간·경비별로 정리했습니다.',
    category: '프리랜서',
  },
  {
    slug: 'vat-filing',
    title: '부가세 신고 체크리스트 (개인사업자)',
    description: '1월·7월 부가세 신고 시즌, 빠뜨리면 안 되는 매출·매입 자료와 신고 절차를 한눈에 확인할 수 있도록 정리한 체크리스트.',
    category: '부가세',
  },
  {
    slug: 'simplified-vs-general-vat',
    title: '간이과세자 vs 일반과세자, 차이와 전환 기준',
    description: '매출 1억 400만원 기준, 세율·세금계산서·신고 횟수 차이와 내게 어느 쪽이 유리한지 사례로 정리했습니다.',
    category: '부가세',
  },
  {
    slug: 'business-registration',
    title: '사업자등록 처음 하는 법',
    description: '신청 기한(20일), 필요 서류, 간이·일반·면세 과세유형 선택, 등록 후 세금 의무까지 단계별로 정리했습니다.',
    category: '사업자',
  },
  {
    slug: 'income-tax-may',
    title: '5월 종합소득세 신고 가이드',
    description: '대상자 확인부터 모두채움 신고서, 분납 신청, 자주 하는 실수까지 5월 종합소득세 신고의 전체 흐름을 정리했습니다.',
    category: '종합소득세',
  },
  {
    slug: 'withholding-year-end',
    title: '원천징수와 연말정산은 어떻게 연결되나',
    description: '매월 떼는 원천징수와 다음 해 연말정산의 관계, 13월의 월급(환급)이 생기는 원리를 사례로 설명합니다.',
    category: '근로소득',
  },
  {
    slug: 'non-taxable-allowance',
    title: '비과세 수당 종류와 한도',
    description: '식대 월 20만원, 자가운전보조금, 출산·보육수당 등 세금이 붙지 않는 수당의 종류와 한도를 국세청 기준으로 정리했습니다.',
    category: '근로소득',
  },
  {
    slug: 'tax-free-income',
    title: '근로소득 비과세 판정 방법',
    description: '내 급여가 비과세인지 판정하는 방법. 비과세·소득공제·세액공제·감면의 차이, 항목별 적용 조건, 자주 틀리는 사례를 2026년 국세청 기준으로 정리했습니다.',
    category: '근로소득',
  },
  {
    slug: 'one-house-exemption',
    title: '1세대 1주택 양도세 비과세 요건 총정리',
    description: '2년 보유·거주 요건, 양도가액 12억 기준, 고가주택 과세, 일시적 2주택 특례까지 핵심만 정리했습니다.',
    category: '양도소득세',
  },
  {
    slug: 'capital-gains-expenses',
    title: '양도세 필요경비, 인정되는 것과 안 되는 것',
    description: '자본적 지출과 수익적 지출의 구분, 증빙 요건을 국세청 기준으로 정리해 양도차익을 정확히 줄이는 법을 설명합니다.',
    category: '양도소득세',
  },
  {
    slug: 'long-term-holding-deduction',
    title: '장기보유특별공제 계산 방법',
    description: '표1(일반, 최대 30%)과 표2(1세대 1주택, 보유+거주 최대 80%)의 공제율과 계산 방법을 사례로 정리했습니다.',
    category: '양도소득세',
  },
  {
    slug: 'car-tax',
    title: '자동차세 과세 기준과 연납 완전 정리',
    description: '배기량별 세액, 차령 경감, 지방교육세, 제1·2기분 납기, 1·3·6·9월 연납의 신청 시기별 공제 계산식을 지방세법 조문 기준으로 정리했습니다.',
    category: '자동차세',
  },
  {
    slug: 'comprehensive-real-estate-tax',
    title: '종합부동산세 계산 방법과 12월 납부기간',
    description: '공시가격 합계에서 최종 납부액까지, 기본공제·공정시장가액비율·세율·재산세 중복분 공제·세액공제·세부담 상한·농어촌특별세를 순서대로 정리했습니다.',
    category: '종합부동산세',
  },
  {
    slug: 'property-tax',
    title: '2026년 재산세 계산 가이드',
    description: '주택 공시가격에 적용되는 공정시장가액비율과 세율, 도시지역분·지방교육세·세부담상한, 7월·9월 납부 방식을 정리했습니다.',
    category: '재산세',
  },
  {
    slug: 'gift-split',
    title: '증여세 절세, 10년 단위 분할 증여 완벽 정리',
    description: '공제가 10년마다 갱신되는 원리를 활용한 분할 증여 전략과 혼인·출산 증여공제 특례까지 정리했습니다.',
    category: '증여세',
  },
  {
    slug: 'family-loan',
    title: '부모 자식 간 차용증 쓰는 법',
    description: '가족 간 금전거래가 증여로 추정되지 않도록, 적정이자율 4.6%·연 이자 차액 1천만원 기준과 차용증 필수 항목을 정리했습니다.',
    category: '증여세',
  },
  {
    slug: 'inheritance-vs-gift',
    title: '상속세 vs 증여세, 뭐가 더 유리할까',
    description: '세율은 같지만 결과는 다른 두 제도의 공제·과세방식·사전증여 합산 차이를 비교하고 유리한 선택을 사례로 정리했습니다.',
    category: '상속·증여',
  },
  {
    slug: 'inheritance-renounce',
    title: '상속 포기·한정승인, 3개월 안에 결정하기',
    description: '빚이 더 많은 상속을 마주했을 때의 선택지. 3개월 기한, 후순위 상속인 함정, 특별한정승인까지 정리했습니다.',
    category: '상속',
  },
]

/** 경로로 변환. 가이드 링크를 만들 때 이 함수만 쓴다. */
export function guideHref(slug: GuideSlug): string {
    return `/guide/${slug}`;
}

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

/** 슬러그로 가이드를 찾는다. 목록에 없으면 null */
export function guideBySlug(slug: GuideSlug): Guide | null {
    return BY_SLUG.get(slug) ?? null;
}
