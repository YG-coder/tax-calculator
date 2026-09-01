// src/app/guide/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES, guideHref } from '@/lib/guides'

export const metadata: Metadata = {
  title: '세금 가이드 | 종합소득세·부가세·양도·상속·증여 신고법',
  description:
    '프리랜서·사업자 세금 신고법부터 양도세 필요경비·장기보유특별공제, 상속·증여 절세, 근로소득 비과세까지 한국 세금에 참고할 수 있는 무료 가이드를 제공합니다.',
  alternates: { canonical: '/guide' },
}


export default function GuideIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">세금 가이드</h1>
      <p className="text-center text-sm text-slate-500 mb-10">
        한국 세금 신고에 참고할 수 있는 무료 가이드
      </p>

      <div className="space-y-4">
        {GUIDES.map(({ slug, title, description, category }) => (
          <Link
            key={slug}
            href={guideHref(slug)}
            className="block calc-card p-6 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">
                {category}
              </span>
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
