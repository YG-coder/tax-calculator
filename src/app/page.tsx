/* src/app/page.tsx — 세금계산기 허브 홈 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { CALCULATORS } from '@/lib/calculators'

export const metadata: Metadata = {
  title: '세금 계산기 모음 | 부가세·소득세·양도세·증여세·상속세',
  description:
    '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 한 곳에서. 2026년 세율 기준 무료 제공.',
}

export default function HomePage() {
  const list = CALCULATORS.filter((c) => c.enabled)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      {/* 히어로 */}
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight text-slate-900">
          세금 계산기 모음
        </h1>
        <p className="text-slate-500 text-base sm:text-lg">
          부가세부터 상속세까지 · 2026년 기준 · 무료 · 로그인 불필요
        </p>
      </section>

      {/* 계산기 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {list.map((calc) => (
          <Link
            key={calc.slug}
            href={`/${calc.slug}`}
            className="calc-card p-5 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-3">{calc.emoji}</div>
            <h2 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
              {calc.title}
            </h2>
            <p className="text-xs text-slate-500">{calc.description}</p>
          </Link>
        ))}
      </div>

      {/* 연봉계산기 CTA */}
      <section className="rounded-2xl border bg-green-50 border-green-100 p-6 mb-10">
        <h2 className="text-base font-bold mb-1 text-slate-900">
          연봉 실수령액이 궁금하신가요?
        </h2>
        <p className="text-slate-600 text-sm mb-4">
          4대보험, 퇴직금, 연차수당 등 직장인 급여 계산기는 연봉계산기.kr에서 제공합니다.
        </p>
        <Link
          href="https://연봉계산기.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          연봉 계산기 바로가기 →
        </Link>
      </section>

      {/* SEO 본문 */}
      <section className="text-sm text-slate-600 leading-relaxed space-y-4">
        <h2 className="text-lg font-bold text-slate-800">세금 계산기 안내</h2>
        <p>
          세금 계산기는 부가세, 종합소득세, 프리랜서 원천징수, 양도소득세, 증여세, 상속세 등
          다양한 세금 항목을 빠르게 확인할 수 있도록 설계된 무료 도구입니다.
          2026년 최신 세율을 기준으로 계산하며, 로그인 없이 누구나 이용할 수 있습니다.
        </p>
        <p>
          각 계산기는 간이 계산 도구로, 실제 세금 신고는 홈택스 또는 세무사를 통해 확인하세요.
          본 서비스의 계산 결과는 참고용입니다.
        </p>
      </section>

    </main>
  )
}
