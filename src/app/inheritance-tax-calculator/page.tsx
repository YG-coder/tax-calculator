import { buildMetadata } from '@/lib/metadata'
import InheritanceTaxClient from './InheritanceTaxClient'

const title = '상속세 계산기'
const description =
    '상속재산가액과 공제금액을 기준으로 예상 상속세를 간편하게 계산할 수 있는 상속세 계산기입니다.'
const path = '/inheritance-tax-calculator'
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
            <InheritanceTaxClient />
        </>
    )
}