// src/lib/home.ts
//
// 홈 대시보드가 "무엇을 먼저 보여줄지" 고르는 규칙.
// 화면(page.tsx)에서 떼어 놓아야 테스트할 수 있다.

import {
    POPULAR_CALCULATORS,
    calculatorBySlug,
    type Calculator,
} from './calculators.ts';
import { GUIDES, guideBySlug, type Guide } from './guides.ts';
import { GUIDE_LAST_MODIFIED } from './content-registry.ts';
import type { TaxScheduleItem } from './tax-calendar.ts';

/**
 * 추천 가이드.
 *
 * 이번 달 일정에 연결된 가이드를 먼저 채우고, 모자라면 최근에 고친 가이드로 채운다.
 * 제목·설명은 가이드 레지스트리에서 가져오므로 홈에 다시 적지 않는다.
 */
export function pickGuides(items: TaxScheduleItem[], count: number): Guide[] {
    const picked: Guide[] = [];
    const seen = new Set<string>();

    for (const item of items) {
        if (!item.guide || seen.has(item.guide)) continue;
        const guide = guideBySlug(item.guide);
        if (!guide) continue;
        seen.add(guide.slug);
        picked.push(guide);
        if (picked.length === count) return picked;
    }

    const recent = [...GUIDES].sort((a, b) =>
        GUIDE_LAST_MODIFIED[b.slug].localeCompare(GUIDE_LAST_MODIFIED[a.slug]),
    );
    for (const guide of recent) {
        if (seen.has(guide.slug)) continue;
        seen.add(guide.slug);
        picked.push(guide);
        if (picked.length === count) break;
    }
    return picked;
}

/**
 * 가장 큰 카드로 올릴 계산기.
 * 이번 달 일정에 걸린 계산기를 먼저 쓰고, 없으면 인기 1위를 쓴다.
 */
export function pickFeatured(items: TaxScheduleItem[]): Calculator {
    const fromSchedule = items.find((item) => item.calculator)?.calculator;
    return fromSchedule ? calculatorBySlug(fromSchedule) : POPULAR_CALCULATORS[0];
}
