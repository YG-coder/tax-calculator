// src/app/guide/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '세금 가이드 | 종합소득세·부가세·양도·상속·증여 신고법',
  description:
    '프리랜서·사업자 세금 신고법부터 양도세 필요경비·장기보유특별공제, 상속·증여 절세, 근로소득 비과세까지 한국 세금에 참고할 수 있는 무료 가이드를 제공합니다.',
  alternates: { canonical: '/guide' },
}

const GUIDES = [
  {
    href: '/guide/freelancer-tax',
    title: '프리랜서 종합소득세 신고 완벽 가이드',
    description: '3.3% 원천징수부터 5월 종합소득세 신고까지, 프리랜서가 꼭 알아야 할 절차와 절세 팁을 단계별로 정리했습니다.',
    category: '프리랜서',
    readTime: '약 8분',
  },
  {
    href: '/guide/freelancer-refund',
    title: '프리랜서 3.3%, 환급받는 사람 vs 추가납부하는 사람',
    description: '3.3% 원천징수가 환급으로 돌아오는 사람과 추가 납부가 생기는 사람의 차이를 수입 구간·경비별로 정리했습니다.',
    category: '프리랜서',
    readTime: '약 7분',
  },
  {
    href: '/guide/vat-filing',
    title: '부가세 신고 체크리스트 (개인사업자)',
    description: '1월·7월 부가세 신고 시즌, 빠뜨리면 안 되는 매출·매입 자료와 신고 절차를 한눈에 확인할 수 있도록 정리한 체크리스트.',
    category: '부가세',
    readTime: '약 7분',
  },
  {
    href: '/guide/simplified-vs-general-vat',
    title: '간이과세자 vs 일반과세자, 차이와 전환 기준',
    description: '매출 1억 400만원 기준, 세율·세금계산서·신고 횟수 차이와 내게 어느 쪽이 유리한지 사례로 정리했습니다.',
    category: '부가세',
    readTime: '약 7분',
  },
  {
    href: '/guide/business-registration',
    title: '사업자등록 처음 하는 법',
    description: '신청 기한(20일), 필요 서류, 간이·일반·면세 과세유형 선택, 등록 후 세금 의무까지 단계별로 정리했습니다.',
    category: '사업자',
    readTime: '약 8분',
  },
  {
    href: '/guide/income-tax-may',
    title: '5월 종합소득세 신고 가이드',
    description: '대상자 확인부터 모두채움 신고서, 분납 신청, 자주 하는 실수까지 5월 종합소득세 신고의 전체 흐름을 정리했습니다.',
    category: '종합소득세',
    readTime: '약 9분',
  },
  {
    href: '/guide/withholding-year-end',
    title: '원천징수와 연말정산은 어떻게 연결되나',
    description: '매월 떼는 원천징수와 다음 해 연말정산의 관계, 13월의 월급(환급)이 생기는 원리를 사례로 설명합니다.',
    category: '근로소득',
    readTime: '약 7분',
  },
  {
    href: '/guide/non-taxable-allowance',
    title: '비과세 수당 종류와 한도',
    description: '식대 월 20만원, 자가운전보조금, 출산·보육수당 등 세금이 붙지 않는 수당의 종류와 한도를 국세청 기준으로 정리했습니다.',
    category: '근로소득',
    readTime: '약 7분',
  },
  {
    href: '/guide/one-house-exemption',
    title: '1세대 1주택 양도세 비과세 요건 총정리',
    description: '2년 보유·거주 요건, 양도가액 12억 기준, 고가주택 과세, 일시적 2주택 특례까지 핵심만 정리했습니다.',
    category: '양도소득세',
    readTime: '약 8분',
  },
  {
    href: '/guide/capital-gains-expenses',
    title: '양도세 필요경비, 인정되는 것과 안 되는 것',
    description: '자본적 지출과 수익적 지출의 구분, 증빙 요건을 국세청 기준으로 정리해 양도차익을 정확히 줄이는 법을 설명합니다.',
    category: '양도소득세',
    readTime: '약 7분',
  },
  {
    href: '/guide/long-term-holding-deduction',
    title: '장기보유특별공제 계산 방법',
    description: '표1(일반, 최대 30%)과 표2(1세대 1주택, 보유+거주 최대 80%)의 공제율과 계산 방법을 사례로 정리했습니다.',
    category: '양도소득세',
    readTime: '약 7분',
  },
  {
    href: '/guide/gift-split',
    title: '증여세 절세, 10년 단위 분할 증여 완벽 정리',
    description: '공제가 10년마다 갱신되는 원리를 활용한 분할 증여 전략과 혼인·출산 증여공제 특례까지 정리했습니다.',
    category: '증여세',
    readTime: '약 7분',
  },
  {
    href: '/guide/family-loan',
    title: '부모 자식 간 차용증 쓰는 법',
    description: '가족 간 금전거래가 증여로 추정되지 않도록, 적정이자율 4.6%·연 이자 차액 1천만원 기준과 차용증 필수 항목을 정리했습니다.',
    category: '증여세',
    readTime: '약 7분',
  },
  {
    href: '/guide/inheritance-vs-gift',
    title: '상속세 vs 증여세, 뭐가 더 유리할까',
    description: '세율은 같지만 결과는 다른 두 제도의 공제·과세방식·사전증여 합산 차이를 비교하고 유리한 선택을 사례로 정리했습니다.',
    category: '상속·증여',
    readTime: '약 8분',
  },
  {
    href: '/guide/inheritance-renounce',
    title: '상속 포기·한정승인, 3개월 안에 결정하기',
    description: '빚이 더 많은 상속을 마주했을 때의 선택지. 3개월 기한, 후순위 상속인 함정, 특별한정승인까지 정리했습니다.',
    category: '상속',
    readTime: '약 7분',
  },
]

export default function GuideIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">세금 가이드</h1>
      <p className="text-center text-sm text-slate-500 mb-10">
        한국 세금 신고에 참고할 수 있는 무료 가이드
      </p>

      <div className="space-y-4">
        {GUIDES.map(({ href, title, description, category, readTime }) => (
          <Link
            key={href}
            href={href}
            className="block calc-card p-6 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">
                {category}
              </span>
              <span className="text-xs text-slate-400">{readTime}</span>
            </div>
            <h2 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
              {title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600 leading-relaxed">
        <h2 className="text-base font-bold text-slate-800 mb-2">가이드 작성 원칙</h2>
        <p>
          본 가이드는 국세청 공식 자료(소득세법, 부가가치세법, 상속세 및 증여세법,
          국세청 신고 안내 등)를 바탕으로 일반 사용자가 이해하기 쉽도록
          정리한 참고용 정보입니다. 실제 신고 및 세무 처리는
          국세청 홈택스 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
        </p>
      </section>
    </main>
  )
}
