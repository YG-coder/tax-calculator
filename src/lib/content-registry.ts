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
    /** 계산 결과를 최종 확인할 기관·서비스 안내 */
    confirmationGuidance?: string;
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
        lastReviewed: '2026-09-01',
        appliesTo:
            '2026년 양도분 기준 · 장기보유특별공제(표1·표2)·1세대 1주택 비과세·단기 보유 세율·조정대상지역 다주택 중과 반영 · 1세대 1주택 특례와 감면·이월과세 미반영',
        sources: [
            { label: '소득세법 제89조(비과세 양도소득)', url: law('소득세법', '제89조') },
            { label: '소득세법 제95조(양도소득금액과 장기보유 특별공제액)', url: law('소득세법', '제95조') },
            { label: '소득세법 제103조(양도소득 기본공제)', url: law('소득세법', '제103조') },
            { label: '소득세법 제104조(양도소득세의 세율)', url: law('소득세법', '제104조') },
            { label: '소득세법 시행령 제154조(1세대1주택의 범위)', url: law('소득세법 시행령', '제154조') },
            { label: '소득세법 시행령 제159조의4(장기보유특별공제)', url: law('소득세법 시행령', '제159조의4') },
            { label: '소득세법 시행령 제160조(고가주택에 대한 양도차익등의 계산)', url: law('소득세법 시행령', '제160조') },
            { label: '소득세법 시행령 제167조의3(1세대 3주택 이상에 해당하는 주택의 범위)', url: law('소득세법 시행령', '제167조의3') },
            { label: '국세청 양도소득세 세율', url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2312&cntntsId=7711' },
            { label: '국세청 장기보유특별공제율', url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2311&cntntsId=7710' },
        ],
        confirmationGuidance: '실제 신고 세액은 국세청 홈택스 양도소득세 모의계산 또는 세무 전문가를 통해 확인하세요.',
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
    'comprehensive-real-estate-tax-calculator': {
        lastReviewed: '2026-09-01',
        appliesTo:
            '2026년 개인 주택분 기준 · 기본공제(1세대 1주택자 12억원 / 그 밖 9억원)·공정시장가액비율 60%·구간별 세율·재산세 중복분 공제·고령자 및 장기보유 세액공제·세부담 상한·농어촌특별세 반영 · 법인·토지분·합산배제 미지원',
        sources: [
            { label: '종합부동산세법 제8조(과세표준)', url: law('종합부동산세법', '제8조') },
            { label: '종합부동산세법 제9조(세율 및 세액)', url: law('종합부동산세법', '제9조') },
            { label: '종합부동산세법 제10조(세부담의 상한)', url: law('종합부동산세법', '제10조') },
            { label: '종합부동산세법 제10조의2(공동명의 1주택자 특례)', url: law('종합부동산세법', '제10조의2') },
            { label: '종합부동산세법 제16조(부과·징수 등)', url: law('종합부동산세법', '제16조') },
            { label: '종합부동산세법 시행령 제2조의4(공정시장가액비율)', url: law('종합부동산세법 시행령', '제2조의4') },
            { label: '종합부동산세법 시행령 제4조의3(공제되는 재산세액의 계산)', url: law('종합부동산세법 시행령', '제4조의3') },
            { label: '농어촌특별세법 제5조(과세표준과 세율)', url: law('농어촌특별세법', '제5조') },
            { label: '지방세법 시행령 제109조(공정시장가액비율)', url: law('지방세법 시행령', '제109조') },
        ],
        confirmationGuidance: '실제 고지 세액은 국세청 홈택스 또는 관할 세무서를 통해 확인하세요.',
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
        appliesTo: '2026년 근로소득 간이세액표 · 2026-03-01 시행',
        sources: [
            { label: '소득세법 제134조(근로소득 원천징수)', url: law('소득세법', '제134조') },
            { label: '소득세법 제59조(근로소득세액공제)', url: law('소득세법', '제59조') },
            { label: '소득세법 시행령 제189조(근로소득 간이세액표)', url: law('소득세법 시행령', '제189조') },
            { label: '소득세법 시행령 별표 2 공식 PDF(2026.2.27. 개정)', url: 'https://www.law.go.kr/LSW/flDownload.do?flSeq=164357181&bylClsCd=110201' },
            { label: '홈택스 근로소득 간이세액표 조회', url: 'https://www.hometax.go.kr/websquare/websquare.wq?tm2lIdx=0113000000&tmIdx=0&w2xPath=%2Fui%2Fpp%2Findex_pp.xml' },
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
    'car-tax-calculator': {
        lastReviewed: '2026-09-01',
        appliesTo: '2026년 지방세법 표준세율 기준 · 차령 경감·지방교육세·연납 공제(1·3·6·9월) 반영 · 조례 탄력세율과 지방세특례제한법 감면 미반영',
        sources: [
            { label: '지방세법 제127조(과세표준과 세율)', url: law('지방세법', '제127조') },
            { label: '지방세법 제128조(납기와 징수방법)', url: law('지방세법', '제128조') },
            { label: '지방세법 제130조(수시부과 시의 세액계산)', url: law('지방세법', '제130조') },
            { label: '지방세법 시행령 제122조(영업용과 비영업용의 구분 및 차령 계산)', url: law('지방세법 시행령', '제122조') },
            { label: '지방세법 시행령 제125조(연납 공제)', url: law('지방세법 시행령', '제125조') },
            { label: '위택스 자동차세 조회·연납 신청·납부', url: 'https://www.wetax.go.kr' },
        ],
        confirmationGuidance: '실제 부과·납부 세액은 위택스 또는 관할 지방자치단체를 통해 확인하세요.',
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
    'car-tax': '2026-09-01',
    'comprehensive-real-estate-tax': '2026-09-01',
} as const;

export type GuideSlug = keyof typeof GUIDE_LAST_MODIFIED;

export const STATIC_PAGE_LAST_MODIFIED = {
    '/': '2026-10-08',
    '/guide': '2026-09-01',
    '/tax-calendar': '2026-09-01',
    '/about': '2026-07-27',
    '/privacy': '2026-10-03',
    '/terms': '2026-10-03',
    '/contact': '2026-04-24',
} as const;
