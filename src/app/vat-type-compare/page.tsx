import { buildMetadata } from '@/lib/metadata'
import VatTypeCompareClient from './VatTypeCompareClient'

const title = '간이과세 vs 일반과세 비교'
const description =
    '예상 연매출·매입·업종을 입력하면 간이과세자와 일반과세자의 예상 부가세를 비교해 어느 쪽이 유리한지 알려주는 선택 도우미입니다.'
const path = '/vat-type-compare'
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
            <VatTypeCompareClient />
        </>
    )
}
