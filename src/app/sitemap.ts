import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: BASE_URL, lastModified: new Date(), priority: 1 },
        { url: `${BASE_URL}/salary-calculator`, lastModified: new Date(), priority: 0.8 },
    ];
}