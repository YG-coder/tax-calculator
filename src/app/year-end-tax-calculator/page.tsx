import { buildMetadata } from '@/lib/metadata'
import YearEndTaxClient from './YearEndTaxClient'

const title = '연말정산 계산기'
const description = '2026년 귀속 급여와 인적공제·카드·연금·보험·의료비·교육비·기부금·월세 공제를 반영해 예상 환급액과 추가 납부액을 계산합니다. 이미 낸 소득세와 지방소득세를 비교하고 계산 과정을 확인하세요.'
const path = '/year-end-tax-calculator'
const url = `https://taxsim.kr${path}`
export const metadata = buildMetadata({ title, description, path, keywords: ['2026 연말정산 계산기', '연말정산 환급액', '추가 납부액', '결정세액', '기납부세액', '연말정산 공제'] })
const schema = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, description, url, applicationCategory: 'FinanceApplication', operatingSystem: 'All', inLanguage: 'ko-KR', isAccessibleForFree: true },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '세금계산기', item: 'https://taxsim.kr' }, { '@type': 'ListItem', position: 2, name: title, item: url }] },
]
export default function Page() {
  return <>{schema.map((item) => <script key={item['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }} />)}<YearEndTaxClient /></>
}
