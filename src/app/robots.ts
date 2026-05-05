import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // 모든 봇 (Googlebot, Bingbot 등)
                userAgent: '*',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                // 네이버 검색로봇 (Yeti) — 명시적으로 허용
                userAgent: 'Yeti',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                // 네이버 블로그 검색 (NaverBot)
                userAgent: 'NaverBot',
                allow: '/',
                disallow: ['/api/'],
            },
            {
                // 다음/카카오 (Daumoa)
                userAgent: 'Daumoa',
                allow: '/',
                disallow: ['/api/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
