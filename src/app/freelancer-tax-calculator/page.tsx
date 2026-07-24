// src/app/freelancer-tax-calculator/page.tsx

import { buildMetadata } from '@/lib/metadata'
import FreelancerTaxClient from './FreelancerTaxClient'

const title = '프리랜서 3.3% 계산기 실수령액·환급'
const description =
    '프리랜서 3.3% 원천징수 세금과 실수령액을 바로 계산합니다. 100만원이면 실수령 96만 7천원. 5월 종합소득세 신고 시 환급 가능 여부까지 확인하세요. 가입 없이 무료.'
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