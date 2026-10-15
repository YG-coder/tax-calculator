import type { Metadata } from 'next';
import { SITE } from './site';

type BuildMetadataParams = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    /** OG 이미지 경로 (기본: /og-image.png). 페이지별 OG 이미지가 있으면 지정. */
    ogImage?: string;
    type?: "website" | "article";
};

export function buildMetadata({
                                  title,
                                  description,
                                  path = '',
                                  keywords = [],
                                  ogImage,
                                  type = "website",
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
            type,
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
            'og:type': type,
        },
    };
}

/** 페이지별 제목·설명을 유지하며 검색·공유 주소와 이미지를 반드시 제공한다. */
export function withPageMetadata(meta: Metadata, path: string): Metadata {
 const url = new URL(path, SITE.url).href;
 const image = `${SITE.url}/og-image.png`;
 return {
  ...meta,
  metadataBase: new URL(SITE.url),
  alternates: { ...meta.alternates, canonical: url },
  openGraph: {
   title: typeof meta.title === 'string' ? meta.title : SITE.name,
   description: meta.description ?? SITE.description,
   type: 'website', locale: 'ko_KR', siteName: SITE.name,
   ...meta.openGraph, url, images: meta.openGraph?.images ?? [{url:image,width:1200,height:630,alt:SITE.name}],
  },
  twitter: {
   title: typeof meta.title === 'string' ? meta.title : SITE.name,
   description: meta.description ?? SITE.description,
   ...meta.twitter, card:'summary_large_image', images: meta.twitter?.images ?? [image],
  },
 };
}
