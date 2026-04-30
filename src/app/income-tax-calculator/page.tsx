import { buildMetadata } from '@/lib/metadata'
import IncomeTaxClient from './IncomeTaxClient'

const title = '종합소득세 계산기'
const description =
    '연 소득을 기준으로 예상 종합소득세와 지방소득세를 간편하게 계산할 수 있는 종합소득세 계산기입니다.'
const path = '/income-tax-calculator'
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
    isAccessibleForFree: true,
}

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />
            <IncomeTaxClient />
        </>
    )
}