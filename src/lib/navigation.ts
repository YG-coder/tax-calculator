// src/lib/navigation.ts
//
// 상단 내비게이션 항목과 "지금 어느 메뉴에 있는가" 판정.
//
// 예전에는 계산기 4개를 골라 내비에 박아 뒀다. 계산기가 늘 때마다 목록이 어긋났고,
// 어떤 세목만 우대하는 것처럼 보였다. 이제 내비는 구역 세 개(계산기·세금 일정·가이드)만 두고,
// 어떤 계산기가 "계산기" 구역에 속하는지는 계산기 레지스트리에서 파생한다.

import { ENABLED_CALCULATORS } from './calculators.ts';

export type NavKey = 'calculators' | 'calendar' | 'guide';

export type NavItem = {
    key: NavKey;
    label: string;
    href: string;
};

export const NAV_ITEMS: NavItem[] = [
    // 홈 하단의 "모든 계산기" 구역으로 보낸다. 계산기 목록은 그곳 한 곳에서만 관리한다.
    { key: 'calculators', label: '계산기', href: '/#all-calculators' },
    { key: 'calendar', label: '세금 일정', href: '/tax-calendar' },
    { key: 'guide', label: '가이드', href: '/guide' },
];

/** 계산기 상세 경로인지 — 레지스트리에서 파생한다 */
export function isCalculatorPath(pathname: string): boolean {
    return ENABLED_CALCULATORS.some((c) => pathname === `/${c.slug}`);
}

/**
 * 현재 경로가 어느 메뉴에 해당하는지.
 *
 * - 'page'    정확히 그 페이지 (aria-current="page")
 * - 'section' 그 구역 안의 하위 페이지 (aria-current="true")
 * - null      해당 없음
 *
 * 홈(/)은 어느 메뉴도 강조하지 않는다. 로고가 홈 링크 역할을 한다.
 */
export function navState(item: NavItem, pathname: string): 'page' | 'section' | null {
    switch (item.key) {
        case 'calculators':
            return isCalculatorPath(pathname) ? 'section' : null;
        case 'calendar':
            return pathname === '/tax-calendar' ? 'page' : null;
        case 'guide':
            if (pathname === '/guide') return 'page';
            return pathname.startsWith('/guide/') ? 'section' : null;
        default:
            return null;
    }
}

/** aria-current 값. 해당 없으면 undefined */
export function ariaCurrent(state: 'page' | 'section' | null): 'page' | 'true' | undefined {
    if (state === 'page') return 'page';
    if (state === 'section') return 'true';
    return undefined;
}
