/* src/app/page.tsx — 세금계산기 허브 홈 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { CALCULATORS } from '@/lib/calculators'

export const metadata: Metadata = {
  title: '세금 계산기 모음 | 부가세·소득세·양도세·증여세·상속세',
  description:
    '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 한 곳에서. 2026년 세율 기준 무료 제공.',
  alternates: { canonical: '/' },
}

// JSON-LD: WebSite + Organization (검색 미리보기 강화)
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '세금계산기',
  alternateName: 'taxsim.kr',
  url: 'https://taxsim.kr',
  inLanguage: 'ko-KR',
  description:
    '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세 계산기를 무료로 제공합니다.',
  publisher: {
    '@type': 'Organization',
    name: 'Incomelab',
    url: 'https://taxsim.kr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://taxsim.kr/icon-512.png',
      width: 512,
      height: 512,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://taxsim.kr/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

// 계산기 ItemList (홈에서 컬렉션을 검색엔진에 알림)
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '세금 계산기 모음',
  numberOfItems: 7,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '부가세 계산기', url: 'https://taxsim.kr/vat-calculator' },
    { '@type': 'ListItem', position: 2, name: '종합소득세 계산기', url: 'https://taxsim.kr/income-tax-calculator' },
    { '@type': 'ListItem', position: 3, name: '프리랜서 3.3% 계산기', url: 'https://taxsim.kr/freelancer-tax-calculator' },
    { '@type': 'ListItem', position: 4, name: '양도소득세 계산기', url: 'https://taxsim.kr/capital-gains-tax-calculator' },
    { '@type': 'ListItem', position: 5, name: '증여세 계산기', url: 'https://taxsim.kr/gift-tax-calculator' },
    { '@type': 'ListItem', position: 6, name: '상속세 계산기', url: 'https://taxsim.kr/inheritance-tax-calculator' },
    { '@type': 'ListItem', position: 7, name: '원천징수세액 계산기', url: 'https://taxsim.kr/withholding-calculator' },
  ],
}

export default function HomePage() {
  const list = CALCULATORS.filter((c) => c.enabled)

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* 히어로 - 큰 로고 아이콘 추가 */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <div className="relative w-20 h-20 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient id="hero-bg" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563eb"/>
                    <stop offset="100%" stopColor="#1d4ed8"/>
                  </linearGradient>
                </defs>
                <rect width="80" height="80" rx="20" fill="url(#hero-bg)"/>
              </svg>
              <span
                className="relative font-black text-white leading-none"
                style={{
                  fontSize: '44px',
                  fontFamily: "'Noto Sans CJK KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
                }}
              >
                税
              </span>
            </div>
          </div>
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

        {/* 가이드 CTA - 외부 사이트 대신 내부 가이드로 유도 */}
        <section className="rounded-2xl border bg-blue-50/50 border-blue-100 p-6 mb-10">
          <h2 className="text-base font-bold mb-1 text-slate-900">
            세금 신고가 처음이신가요?
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            프리랜서 종합소득세, 부가세 신고, 5월 종소세 신고법 등 실무 가이드를 무료로 제공합니다.
          </p>
          <Link
            href="/guide"
            className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            세금 가이드 보기 →
          </Link>
        </section>

        {/* SEO 본문 */}
        <section className="text-sm text-slate-600 leading-relaxed space-y-4">
          <h2 className="text-lg font-bold text-slate-800">세금 계산기 안내</h2>
          <p>
            세금 계산기는 부가세, 종합소득세, 프리랜서 원천징수, 양도소득세, 증여세, 상속세 등
            다양한 세금 항목을 빠르게 확인할 수 있도록 설계된 무료 도구입니다.
            2026년 최신 세율을 기준으로 계산하며, 회원가입이나 로그인 없이 누구나 즉시 이용할 수 있습니다.
          </p>
          <p>
            모든 계산은 사용자 브라우저에서만 처리되며, 입력한 금액 정보는 서버로 전송되지 않습니다.
            각 계산기는 간이 도구이며, 실제 세금 신고는 국세청 홈택스 또는 세무사를 통해 확인하시기 바랍니다.
            본 서비스의 계산 결과는 참고용입니다.
          </p>
        </section>

      </main>
    </>
  )
}
