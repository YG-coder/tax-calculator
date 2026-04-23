export const CALCULATORS = [
    {
        slug: "vat-calculator",
        title: "부가세 계산기",
        description: "공급가액, 부가세, 총금액 계산",
        enabled: true,
    },
    {
        slug: "income-tax-calculator",
        title: "종합소득세 계산기",
        description: "연 소득 기준 예상 세금 계산",
        enabled: true,
    },
    {
        slug: "withholding-calculator",
        title: "원천징수 계산기",
        description: "월 급여 기준 공제 및 실수령액 확인",
        enabled: true,
    },
    {
        slug: "severance-calculator",
        title: "퇴직금 계산기",
        description: "근속 연수 기준 퇴직금 및 실수령액 계산",
        enabled: true,
    },
    {
        slug: "freelancer-tax-calculator",
        title: "프리랜서 3.3% 계산기",
        description: "원천징수 3.3% 세금과 실수령액 계산",
        enabled: true,
    },
    {
        slug: "insurance-calculator",
        title: "4대보험 계산기",
        description: "국민연금, 건강보험 등 공제액 계산",
        enabled: true,
    },
] as const;