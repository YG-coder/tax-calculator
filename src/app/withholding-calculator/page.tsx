import { buildMetadata } from '@/lib/metadata'
import WithholdingClient from './WithholdingClient'

const title = '원천징수세액 계산기 – 월급여 기준 근로소득세'
const description =
    '2026년 공식 근로소득 간이세액표를 기준으로 월 급여와 부양가족 수에 따른 소득세·지방소득세를 계산합니다. 4대보험은 포함되지 않습니다.'
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
