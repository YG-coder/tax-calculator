import type { Metadata } from 'next';
import { SITE } from './site';

type BuildMetadataParams = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    /** OG 이미지 경로 (기본: /og-image.png). 페이지별 OG 이미지가 있으면 지정. */
    ogImage?: string;
};

export function buildMetadata({
                                  title,
                                  description,
                                  path = '',
                                  keywords = [],
                                  ogImage,
                              }: BuildMetadataParams): Metadata {
    const normalizedPath = path
        ? path.startsWith('/')
            ? path
            : `/${path}`
        : '';

    const url = `${SITE.url}${normalizedPath}`;
    const ogImageUrl = ogImage
        ? (ogImage.startsWith('http') ? ogImage : `${SITE.url}${ogImage}`)
        : `${SITE.url}/og-image.png`;

    // 루트 레이아웃의 title.template('%s | 세금 계산기')이 사이트명을 붙인다.
    // 여기서 다시 붙이면 "… | 세금계산기 | 세금 계산기"처럼 중복되므로 순수 페이지 제목만 반환한다.
    // OG/트위터에는 template이 적용되지 않으므로 사이트명을 붙인 제목을 따로 쓴다.
    const socialTitle = `${title} | ${SITE.title}`;

    return {
        metadataBase: new URL(SITE.url),

        title,
        description,
        keywords,

        alternates: {
            canonical: url,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1,
            },
        },

        openGraph: {
            title: socialTitle,
            description,
            url,
            siteName: SITE.name,
            locale: 'ko_KR',
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: socialTitle,
                    type: 'image/png',
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: socialTitle,
            description,
            images: [ogImageUrl],
        },

        // 네이버 검색 미리보기를 위한 추가 메타
        other: {
            'og:locale': 'ko_KR',
            'og:type': 'website',
        },
    };
}
