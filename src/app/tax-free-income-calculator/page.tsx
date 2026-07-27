import { buildMetadata } from '@/lib/metadata'
import TaxFreeIncomeClient from './TaxFreeIncomeClient'

const title = '근로소득 비과세 계산기'
const description =
    '식대, 자가운전보조금, 출산·보육수당 등 근로소득 비과세 금액과 과세대상 급여를 2026년 국세청 기준으로 계산합니다. 항목별 적용 요건을 확인해 실제 비과세 금액을 산출합니다.'
const path = '/tax-free-income-calculator'
const url = `https://taxsim.kr${path}`

export const metadata = buildMetadata({
    title,
    description,
    path,
    keywords: [
        '비과세 계산기',
        '근로소득 비과세',
        '식대 비과세',
        '자가운전보조금',
        '출산보육수당 비과세',
        '과세대상 급여 계산',
    ],
})

const appJsonLd = {
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

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: '세금계산기', item: 'https://taxsim.kr' },
        { '@type': 'ListItem', position: 2, name: '근로소득 비과세 계산기', item: url },
    ],
}

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(appJsonLd).replace(/</g, '\\u003c'),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
                }}
            />
            <TaxFreeIncomeClient />
        </>
    )
}
