import { buildMetadata } from '@/lib/metadata'
import VatCalculatorClient from './VatCalculatorClient'

export const metadata = buildMetadata({
    title: '부가세 계산기',
    description:
        '공급가액, 부가세, 합계금액을 기준으로 부가가치세를 간편하게 계산할 수 있는 부가세 계산기입니다.',
    path: '/vat-calculator',
})

export default function Page() {
    return <VatCalculatorClient />
}