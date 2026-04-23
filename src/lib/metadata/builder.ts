import { Metadata } from 'next';
import { BASE_URL } from '../env';

export function buildMetadata(title: string, description: string, path: string): Metadata {
    return {
        title: `${title} | 세금 시뮬레이터`,
        description,
        alternates: { canonical: `${BASE_URL}${path}` },
        openGraph: {
            title,
            description,
            url: `${BASE_URL}${path}`,
            siteName: 'TaxSim Korea',
            locale: 'ko_KR',
            type: 'website',
        },
    };
}