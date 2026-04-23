import { MetadataRoute } from 'next';
import { CALCULATORS } from '@/lib/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taxsim.kr';

    const calculatorRoutes = CALCULATORS
        .filter((item) => item.enabled)
        .map((item) => ({
            url: `${baseUrl}/${item.slug}`,
            lastModified: new Date(),
            priority: 0.8,
        }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            priority: 0.5,
        },
        ...calculatorRoutes,
    ];
}