// src/app/freelancer-tax-calculator/page.tsx

import { buildMetadata } from '@/lib/metadata'
import FreelancerTaxClient from './FreelancerTaxClient'

export const metadata = buildMetadata({
    title: '프리랜서 3.3% 계산기',
    description:
        '프리랜서 원천징수 3.3% 세금과 실수령액을 간편하게 계산할 수 있는 계산기입니다.',
    path: '/freelancer-tax-calculator',
})

export default function Page() {
    return <FreelancerTaxClient />
}