import { EffectivePeriodConfig } from "../../types";

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
        endDate: '2026-06-30',
        yearLabel: '2025-2026',
        floor: 400000,
        ceiling: 6370000,
        rate: 0.045,
        verified: true,
    }
];