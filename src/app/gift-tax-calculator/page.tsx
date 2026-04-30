import { buildMetadata } from '@/lib/metadata'
import GiftTaxClient from './GiftTaxClient'

export const metadata = buildMetadata({
    title: '증여세 계산기',
    description:
        '증여재산가액과 공제금액을 기준으로 예상 증여세를 계산할 수 있는 증여세 계산기입니다.',
    path: '/gift-tax-calculator',
})

export default function Page() {
    return <GiftTaxClient />
}