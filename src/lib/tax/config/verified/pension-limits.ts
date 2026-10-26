import type { EffectivePeriodConfig } from "../../types";

export const PENSION_LIMITS: EffectivePeriodConfig[] = [
    {
        id: 'KR-PENSION-2024-07',
        authority: '보건복지부',
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        yearLabel: '2024-2025',
        floor: 390000,
        ceiling: 6170000,
        rate: 0.045,
        verified: true,
    },
    {
        id: 'KR-PENSION-2025-07',
        authority: '보건복지부',
        startDate: '2025-07-01',
        endDate: '2025-12-31',
        yearLabel: '2025-H2',
        floor: 400000,
        ceiling: 6370000,
        rate: 0.045,
        verified: true,
    },
    {
        id: 'KR-PENSION-2026-01',
        authority: '국민연금공단',
        startDate: '2026-01-01',
        endDate: '2026-06-30',
        yearLabel: '2026-H1',
        floor: 400000,
        ceiling: 6370000,
        rate: 0.0475,
        verified: true,
    },
    {
        id: 'KR-PENSION-2026-07',
        authority: '국민연금공단',
        startDate: '2026-07-01',
        // 2026·2027년 경계는 한국 시각으로 적었다. 이 구간을 나눌 당시 simulateSalary는 날짜만 적힌 값을
        // UTC 0시(한국 9시)로 읽어, 날짜만 쓰면 2026-12-31 9시부터 2027-01-01 9시 사이가 비었기 때문이다(당시 경계 보완 기록).
        // 지금 simulateSalary는 날짜만 적힌 시작일을 그날 한국 시각 0시, 종료일을 그날 끝(23:59:59.999)까지로 보고,
        // 이처럼 시간대가 적힌 값은 적힌 시각 그대로 쓴다.
        endDate: '2026-12-31T23:59:59.999+09:00',
        yearLabel: '2026-H2',
        floor: 410000,
        ceiling: 6590000,
        rate: 0.0475,
        verified: true,
    },
    {
        // 국민연금법 부칙(법률 제20903호) 제4조제1항제2호: 2027년 사업장가입자 기여금·사용자 부담금 각각 1만분의 500.
        // 상·하한은 2026년 7월~2027년 6월 고시 구간 값을 그대로 쓴다. 2027년 7월 이후 구간은 고시 확인 전이라 두지 않는다.
        id: 'KR-PENSION-2027-01',
        authority: '국민연금공단',
        startDate: '2027-01-01T00:00:00+09:00',
        endDate: '2027-06-30',
        yearLabel: '2027-H1',
        floor: 410000,
        ceiling: 6590000,
        rate: 0.05,
        verified: true,
    },
];