import { buildMetadata } from '@/lib/metadata'
import GiftTaxClient from './GiftTaxClient'

const title = '증여세 계산기'
const description =
    '증여재산가액과 공제금액을 기준으로 예상 증여세를 간편하게 계산할 수 있는 증여세 계산기입니다.'
const path = '/gift-tax-calculator'
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
            <GiftTaxClient />
        </>
    )
}