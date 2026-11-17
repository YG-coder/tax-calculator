/**
 * 장기요양 월분별 요율 등록. 공개 급여 화면을 새로 연결하거나 전체 제도의 정확성을 확장하는 설정이 아니다.
 * 2026년까지는 내부 함수의 기존 13.14% 계산을 보존한다(공식 산식 전체를 확인했다는 뜻이 아님).
 * 2027년: 보건복지부 2026-10-30 의결 자료, 소득 대비 0.9994% / 건강보험료 대비 13.90%.
 * https://www.mohw.go.kr/gallery.es?act=view&bid=0003&list_no=380579&mid=a10505000000
 */
export const LONG_TERM_CARE_RATE_PERIODS = [
    {
        startDate: '2024-07-01T00:00:00+09:00',
        endExclusive: '2027-01-01T00:00:00+09:00',
        incomeRatePerMillion: null, // 과거 구간은 기존 동작 보존. 당시 소득 대비 법정요율로 해석하지 않는다.
        healthPremiumRatePer10000: 1314,
        basis: 'legacy-preserved',
    },
    {
        startDate: '2027-01-01T00:00:00+09:00',
        endExclusive: '2028-01-01T00:00:00+09:00',
        incomeRatePerMillion: 9994,
        healthPremiumRatePer10000: 1390,
        basis: 'mohw-resolution-2026-10-30',
    },
] as const;

export function getLongTermCareRate(date: Date) {
    const time = date.getTime();
    return LONG_TERM_CARE_RATE_PERIODS.find(period =>
        time >= Date.parse(period.startDate) && time < Date.parse(period.endExclusive)
    ) ?? null;
}
