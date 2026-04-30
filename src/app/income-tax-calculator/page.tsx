import { buildMetadata } from '@/lib/metadata'
import IncomeTaxClient from './IncomeTaxClient'

export const metadata = buildMetadata({
    title: '종합소득세 계산기',
    description:
        '연 소득을 기준으로 예상 종합소득세와 지방소득세를 간편하게 계산할 수 있는 종합소득세 계산기입니다.',
    path: '/income-tax-calculator',
})

export default function Page() {
    return <IncomeTaxClient />
}