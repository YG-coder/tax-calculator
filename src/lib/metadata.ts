import type { Metadata } from 'next';
import { SITE } from './site';

type BuildMetadataParams = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
};

export function buildMetadata({
                                  title,
                                  description,
                                  path = '',
                                  keywords = [],
                              }: BuildMetadataParams): Metadata {
    const normalizedPath = path
        ? path.startsWith('/')
            ? path
            : `/${path}`
        : '';

    const url = `${SITE.url}${normalizedPath}`;

    return {
        metadataBase: new URL(SITE.url),

        title: `${title} | ${SITE.title}`,
        description,
        keywords,

        alternates: {
            canonical: url,
        },

        robots: {
            index: true,
            follow: true,
        },

        openGraph: {
            title: `${title} | ${SITE.title}`,
            description,
            url,
            siteName: SITE.name,
            locale: 'ko_KR',
            type: 'website',
        },

        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${SITE.title}`,
            description,
        },
    };
}