import { buildMetadata } from '@/lib/metadata'
import PropertyTaxCalculatorClient from './PropertyTaxCalculatorClient'
import { TAX_YEAR } from './calc'

const title = '재산세 계산기'
const description =
    `주택 공시가격으로 ${TAX_YEAR}년 연간 재산세와 7월·9월 납부액을 계산합니다. 1세대 1주택 특례세율, 공정시장가액비율, 도시지역분, 지방교육세, 세부담상한을 반영합니다.`
const path = '/property-tax-calculator'
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
            <PropertyTaxCalculatorClient />
        </>
    )
}
