import { buildMetadata } from '@/lib/metadata'
import WithholdingClient from './WithholdingClient'

const title = '원천징수세액 계산기'
const description =
    '근로소득, 사업소득, 기타소득 등에 대한 예상 원천징수세액을 간편하게 계산할 수 있는 계산기입니다.'
const path = '/withholding-calculator'
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
            <WithholdingClient />
        </>
    )
}