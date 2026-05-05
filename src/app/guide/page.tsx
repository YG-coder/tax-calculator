// src/app/guide/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '세금 가이드 | 종합소득세·부가세·프리랜서 신고법',
  description:
    '프리랜서 종합소득세 신고법, 부가세 신고 체크리스트, 5월 종소세 신고 가이드 등 한국 세금 신고 실무에 도움이 되는 무료 가이드를 제공합니다.',
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
    href: '/guide/vat-filing',
    title: '부가세 신고 체크리스트 (개인사업자)',
    description: '1월·7월 부가세 신고 시즌, 빠뜨리면 안 되는 매출·매입 자료와 신고 절차를 한눈에 확인할 수 있는 실무 체크리스트.',
    category: '부가세',
    readTime: '약 7분',
  },
  {
    href: '/guide/income-tax-may',
    title: '5월 종합소득세 신고 가이드',
    description: '대상자 확인부터 모두채움 신고서, 분납 신청, 자주 하는 실수까지 5월 종합소득세 신고의 전체 흐름을 정리했습니다.',
    category: '종합소득세',
    readTime: '약 9분',
  },
]

export default function GuideIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">세금 가이드</h1>
      <p className="text-center text-sm text-slate-500 mb-10">
        한국 세금 신고 실무에 도움이 되는 무료 가이드
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
          본 가이드는 운영자(Incomelab)의 실무 경험과 국세청 공식 자료(소득세법, 부가가치세법,
          국세청 신고 안내 등)를 기반으로 작성되었습니다. 모든 내용은 일반 사용자가 이해하기 쉽도록
          단순화한 참고 정보이며, 실제 신고는 국세청 홈택스 또는 세무 전문가의 안내를 함께 참고해
          진행하시기 바랍니다.
        </p>
      </section>
    </main>
  )
}
