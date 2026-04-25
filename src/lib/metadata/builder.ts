import { Metadata } from 'next';
import { BASE_URL } from '../env';

export function buildMetadata(title: string, description: string, path: string): Metadata {
    return {
        title: `${title} | taxsim.kr`,
        description,
        alternates: { canonical: `${BASE_URL}${path}` },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}${path}`,
            siteName: 'taxsim.kr',
            locale: 'ko_KR',
            type: 'website',
        },
    };
}