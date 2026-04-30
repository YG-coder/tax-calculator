import { buildMetadata } from '@/lib/metadata'
import CapitalGainsTaxClient from './CapitalGainsTaxClient'

const title = '양도소득세 계산기'
const description =
    '양도가액, 취득가액, 필요경비를 기준으로 예상 양도소득세를 간편하게 계산할 수 있는 양도세 계산기입니다.'
const path = '/capital-gains-tax-calculator'
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
            <CapitalGainsTaxClient />
        </>
    )
}