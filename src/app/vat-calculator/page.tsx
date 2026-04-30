import { buildMetadata } from '@/lib/metadata'
import VatCalculatorClient from './VatCalculatorClient'

const title = '부가세 계산기'
const description =
    '공급가액, 부가세, 합계금액을 기준으로 부가가치세를 간편하게 계산할 수 있는 부가세 계산기입니다.'
const path = '/vat-calculator'
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
            {/* 🔥 JSON-LD 추가 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />

            <VatCalculatorClient />
        </>
    )
}