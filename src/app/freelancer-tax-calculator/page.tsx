// src/app/freelancer-tax-calculator/page.tsx

import { buildMetadata } from '@/lib/metadata'
import FreelancerTaxClient from './FreelancerTaxClient'

const title = '프리랜서 3.3% 계산기'
const description =
    '프리랜서 원천징수 3.3% 세금과 실수령액을 간편하게 계산할 수 있는 계산기입니다.'
const path = '/freelancer-tax-calculator'
const url = `https://taxsim.kr${path}`

export const metadata = buildMetadata({
    title,
    description,
    path,
})

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    inLanguage: 'ko-KR',
}

export default function Page() {
    return (
        <>
            {/* 🔥 JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />

            <FreelancerTaxClient />
        </>
    )
}