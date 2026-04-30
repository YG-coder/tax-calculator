import { buildMetadata } from '@/lib/metadata'
import WithholdingClient from './WithholdingClient'

export const metadata = buildMetadata({
    title: '원천징수세액 계산기',
    description:
        '근로소득, 사업소득, 기타소득 등에 대한 예상 원천징수세액을 계산할 수 있는 계산기입니다.',
    path: '/withholding-calculator',
})

export default function Page() {
    return <WithholdingClient />
}