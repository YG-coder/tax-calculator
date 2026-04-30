import { buildMetadata } from '@/lib/metadata'
import CapitalGainsTaxClient from './CapitalGainsTaxClient'

export const metadata = buildMetadata({
    title: '양도소득세 계산기',
    description:
        '양도가액, 취득가액, 필요경비를 기준으로 예상 양도소득세를 계산할 수 있는 양도세 계산기입니다.',
    path: '/capital-gains-tax-calculator',
})

export default function Page() {
    return <CapitalGainsTaxClient />
}