// src/lib/content-registry.ts
//
// 각 페이지의 "최근 점검일 / 적용 기준 / 근거 법령"을 한 곳에서 관리한다.
//
// · 사이트맵의 lastModified 가 여기서 나온다. (모든 URL에 빌드 시각을 넣으면
//   변경되지 않은 페이지까지 매번 최신으로 표시되어 색인 신호가 왜곡된다)
// · 계산기 하단의 근거 표시도 여기서 렌더링한다.
// · CALCULATOR_META 는 CalculatorSlug 전체를 키로 갖는 Record 라서,
//   계산기를 추가하고 여기 항목을 빠뜨리면 타입 검사에서 빌드가 실패한다.

import type { CalculatorSlug } from './calculators';

/**
 * 국가법령정보센터 조문 직통 링크.
 * 링크 규칙: https://www.law.go.kr/법령/{법령명}/{조문}
 */
function law(name: string, article?: string): string {
    const path = ['법령', name, ...(article ? [article] : [])]
        .map(encodeURIComponent)
        .join('/');
    return `https://www.law.go.kr/${path}`;
}

export type SourceLink = { label: string; url: string };

export type ContentMeta = {
    /** 계산 로직과 표기 기준을 확인한 날짜 (YYYY-MM-DD) */
    lastReviewed: string;
    /** 어떤 기준을 적용했는지 (연도·표 적용기간 등) */
    appliesTo: string;
    /** 근거 법령·자료 직통 링크 */
    sources: SourceLink[];
};

export const CALCULATOR_META: Record<CalculatorSlug, ContentMeta> = {
    'vat-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 부가가치세율 10% 기준',
        sources: [
            { label: '부가가치세법 제30조(세율)', url: law('부가가치세법', '제30조') },
            { label: '국세청 부가가치세 안내', url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7802&mi=2355' },
        ],
    },
    'income-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 종합소득세 기본세율(6~45%) 기준',
        sources: [
            { label: '소득세법 제55조(세율)', url: law('소득세법', '제55조') },
            { label: '소득세법 제70조(과세표준확정신고)', url: law('소득세법', '제70조') },
        ],
    },
    'freelancer-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '사업소득 원천징수 3% + 지방소득세 0.3% 기준',
        sources: [
            { label: '소득세법 제129조(원천징수세율)', url: law('소득세법', '제129조') },
            { label: '지방세법 제103조의13(특별징수)', url: law('지방세법', '제103조의13') },
        ],
    },
    'capital-gains-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2년 이상 보유 자산의 기본세율만 적용 (장기보유특별공제·중과세율 미반영)',
        sources: [
            { label: '소득세법 제104조(세율)', url: law('소득세법', '제104조') },
            { label: '소득세법 제95조(장기보유특별공제)', url: law('소득세법', '제95조') },
            { label: '소득세법 제89조(비과세 양도소득)', url: law('소득세법', '제89조') },
        ],
    },
    'property-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 주택 재산세 기준 (공정시장가액비율·1주택 특례 포함)',
        sources: [
            { label: '지방세법 제111조(세율)', url: law('지방세법', '제111조') },
            { label: '지방세법 제110조(과세표준)', url: law('지방세법', '제110조') },
            { label: '지방세법 제122조(세부담의 상한)', url: law('지방세법', '제122조') },
        ],
    },
    'gift-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 증여세 누진세율(10~50%) 기준 · 10년 합산·세대생략 할증 미반영',
        sources: [
            { label: '상속세 및 증여세법 제56조(세율)', url: law('상속세 및 증여세법', '제56조') },
            { label: '상속세 및 증여세법 제53조(증여재산 공제)', url: law('상속세 및 증여세법', '제53조') },
            { label: '국세청 증여세 안내', url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7728&mi=2451' },
        ],
    },
    'inheritance-tax-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 상속세 누진세율 · 일괄공제·배우자공제·채무공제만 반영',
        sources: [
            { label: '상속세 및 증여세법 제26조(세율)', url: law('상속세 및 증여세법', '제26조') },
            { label: '상속세 및 증여세법 제19조(배우자 상속공제)', url: law('상속세 및 증여세법', '제19조') },
            { label: '상속세 및 증여세법 제21조(일괄공제)', url: law('상속세 및 증여세법', '제21조') },
            { label: '민법 제1009조(법정상속분)', url: law('민법', '제1009조') },
        ],
    },
    'withholding-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '⚠️ 공식 간이세액표 미적용 · 연 환산 방식 근사 계산',
        sources: [
            { label: '소득세법 제134조(근로소득 원천징수)', url: law('소득세법', '제134조') },
            { label: '소득세법 제59조(근로소득세액공제)', url: law('소득세법', '제59조') },
            { label: '소득세법 시행령 제189조(근로소득 간이세액표)', url: law('소득세법 시행령', '제189조') },
            { label: '홈택스 근로소득 간이세액표 조회', url: 'https://hometax.go.kr' },
        ],
    },
    'tax-free-income-calculator': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 근로소득 비과세 한도 기준',
        sources: [
            { label: '소득세법 제12조(비과세소득)', url: law('소득세법', '제12조') },
            { label: '소득세법 시행령 제17조의2(식사대)', url: law('소득세법 시행령', '제17조의2') },
            { label: '소득세법 시행령 제12조(실비변상적 급여)', url: law('소득세법 시행령', '제12조') },
        ],
    },
    'vat-type-compare': {
        lastReviewed: '2026-08-24',
        appliesTo: '2026년 간이과세 기준 · 납부의무 면제 4,800만원',
        sources: [
            { label: '부가가치세법 제61조(간이과세의 적용범위)', url: law('부가가치세법', '제61조') },
            { label: '부가가치세법 제63조(간이과세자의 납부세액)', url: law('부가가치세법', '제63조') },
            { label: '부가가치세법 제69조(간이과세자에 대한 납부의무의 면제)', url: law('부가가치세법', '제69조') },
        ],
    },
};

/**
 * 가이드·정적 페이지의 최근 수정일 (git 이력 기준, YYYY-MM-DD).
 * 실제로 내용을 고친 날짜만 적는다. 빌드할 때마다 오늘 날짜로 밀지 않는다.
 */
export const GUIDE_LAST_MODIFIED = {
    'freelancer-tax': '2026-05-05',
    'vat-filing': '2026-07-22',
    'income-tax-may': '2026-05-05',
    'simplified-vs-general-vat': '2026-07-20',
    'freelancer-refund': '2026-06-13',
    'business-registration': '2026-06-13',
    'one-house-exemption': '2026-06-13',
    'withholding-year-end': '2026-06-13',
    'gift-split': '2026-06-13',
    'family-loan': '2026-06-13',
    'inheritance-vs-gift': '2026-06-13',
    'inheritance-renounce': '2026-06-13',
    'capital-gains-expenses': '2026-06-13',
    'long-term-holding-deduction': '2026-07-06',
    'non-taxable-allowance': '2026-07-27',
    'tax-free-income': '2026-08-17',
    'property-tax': '2026-07-27',
} as const;

export type GuideSlug = keyof typeof GUIDE_LAST_MODIFIED;

export const STATIC_PAGE_LAST_MODIFIED = {
    '/': '2026-08-24',
    '/guide': '2026-07-27',
    '/about': '2026-07-27',
    '/privacy': '2026-08-24',
    '/terms': '2026-07-27',
    '/contact': '2026-04-24',
} as const;
