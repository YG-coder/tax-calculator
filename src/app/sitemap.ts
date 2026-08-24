import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { CALCULATORS } from '@/lib/calculators';
import {
    CALCULATOR_META,
    GUIDE_LAST_MODIFIED,
    STATIC_PAGE_LAST_MODIFIED,
} from '@/lib/content-registry';

/**
 * lastModified 는 content-registry 에 적힌 "실제로 내용을 고친 날짜"를 쓴다.
 * 예전처럼 모든 URL에 빌드 시각(new Date())을 넣으면 변경되지 않은 페이지까지
 * 매번 최신으로 표시되어 색인 신호가 왜곡된다.
 */
function day(date: string): Date {
    return new Date(`${date}T00:00:00+09:00`);
}

export default function sitemap(): MetadataRoute.Sitemap {
    const calculatorRoutes = CALCULATORS
        .filter((c) => c.enabled)
        .map((c) => ({
            url: `${BASE_URL}/${c.slug}`,
            lastModified: day(CALCULATOR_META[c.slug].lastReviewed),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }));

    const guideRoutes = Object.entries(GUIDE_LAST_MODIFIED).map(([slug, date]) => ({
        url: `${BASE_URL}/guide/${slug}`,
        lastModified: day(date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/']), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/guide`, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/guide']), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/about`, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/about']), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${BASE_URL}/privacy`, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/privacy']), changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/terms`, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/terms']), changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/contact`, lastModified: day(STATIC_PAGE_LAST_MODIFIED['/contact']), changeFrequency: 'yearly', priority: 0.4 },
    ];

    return [...staticRoutes, ...calculatorRoutes, ...guideRoutes];
}
