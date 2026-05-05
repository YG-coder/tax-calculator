import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { CALCULATORS } from '@/lib/calculators';

const GUIDES = [
    'freelancer-tax',
    'vat-filing',
    'income-tax-may',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const calculatorRoutes = CALCULATORS
        .filter((c) => c.enabled)
        .map((c) => ({
            url: `${BASE_URL}/${c.slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }));

    const guideRoutes = GUIDES.map((slug) => ({
        url: `${BASE_URL}/guide/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/guide`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: now,
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly' as const,
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: now,
            changeFrequency: 'yearly' as const,
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: now,
            changeFrequency: 'yearly' as const,
            priority: 0.4,
        },
        ...calculatorRoutes,
        ...guideRoutes,
    ];
}
