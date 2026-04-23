import { MetadataRoute } from 'next';
import { CALCULATORS } from '@/lib/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taxsim.kr';

    const calculatorRoutes = CALCULATORS
        .filter((item) => item.enabled)
        .map((item) => ({
            url: `${baseUrl}/${item.slug}`,
            lastModified: new Date(),
        }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
        },
        ...calculatorRoutes,
    ];
}