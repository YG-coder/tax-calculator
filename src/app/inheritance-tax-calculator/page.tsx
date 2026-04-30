import { buildMetadata } from '@/lib/metadata'
import InheritanceTaxClient from './InheritanceTaxClient'

export const metadata = buildMetadata({
    title: '상속세 계산기',
    description:
        '상속재산가액과 공제금액을 기준으로 예상 상속세를 계산할 수 있는 상속세 계산기입니다.',
    path: '/inheritance-tax-calculator',
})

export default function Page() {
    return <InheritanceTaxClient />
}