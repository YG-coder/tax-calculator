/* src/app/page.tsx — 세금계산기 홈 (대시보드형) */
import type { Metadata } from 'next'
import Link from 'next/link'
import CalculatorDirectory from '@/components/CalculatorDirectory'
import GuideReviewDate from '@/components/GuideReviewDate'
import {
  AUDIENCE_GROUPS,
  ENABLED_CALCULATORS,
  POPULAR_CALCULATORS,
  calculatorBySlug,
  calculatorHref,
  calculatorsFor,
} from '@/lib/calculators'
import { guideBySlug, guideHref } from '@/lib/guides'
import { pickFeatured, pickGuides } from '@/lib/home'
import { MONTH_LABELS, currentMonthInSeoul, monthlyHighlight } from '@/lib/tax-calendar'

const TAX_YEAR = 2026

/**
 * "이번 달" 표시는 서버에서 렌더링한다. 홈 전체를 클라이언트 컴포넌트로 바꾸지 않기 위해서다.
 * 정적 생성된 HTML이 달을 넘겨서도 그대로 남지 않도록 한 시간마다 다시 만든다.
 */
export const revalidate = 3600

export const metadata: Metadata = {
  title: '세금 계산기 · 이번 달 세금 일정 | 부가세·소득세·양도세·재산세·종부세·자동차세',
  description:
    '이번 달에 내야 할 세금과 마감일을 먼저 확인하고, 상황에 맞는 계산기를 바로 찾으세요. 2026년 세율과 공식 법령 기준으로 부가세·종합소득세·양도소득세·재산세·종합부동산세·자동차세 등 12개 계산기를 무료로 제공합니다.',
  alternates: { canonical: '/' },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '세금계산기',
  alternateName: 'taxsim.kr',
  url: 'https://taxsim.kr',
  inLanguage: 'ko-KR',
  description:
    '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 재산세, 종합부동산세, 자동차세, 근로소득 비과세, 증여세, 상속세 계산기를 무료로 제공합니다.',
  publisher: {
    '@type': 'Organization',
    name: 'Incomelab',
    url: 'https://taxsim.kr',
    logo: {
      '@type': 'ImageObject',
      url: 'https://taxsim.kr/og-image.png',
      width: 1200,
      height: 630,
    },
  },
  // 사이트 내 검색 기능이 없으므로 SearchAction은 선언하지 않는다.
}

// 계산기 ItemList (홈에서 컬렉션을 검색엔진에 알림)
// 목록을 손으로 적으면 계산기를 추가할 때마다 어긋나므로 레지스트리에서 생성한다.
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '세금 계산기 모음',
  numberOfItems: ENABLED_CALCULATORS.length,
  itemListElement: ENABLED_CALCULATORS.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.title,
    url: `https://taxsim.kr/${c.slug}`,
  })),
}

const KIND_STYLE: Record<string, string> = {
  국세: 'bg-blue-50 text-blue-700',
  지방세: 'bg-emerald-50 text-emerald-700',
}

export default function HomePage() {
  const month = currentMonthInSeoul()
  const highlight = monthlyHighlight(month)
  const featured = pickFeatured(highlight.items)
  // 대표 카드가 인기 목록 밖의 계산기면 인기 4개를 그대로 작은 카드로 보여준다.
  // 인기 목록 안의 계산기가 대표로 올라간 달에는 나머지 3개만 남는다.
  const otherPopular = POPULAR_CALCULATORS.filter((c) => c.slug !== featured.slug)
  const guides = pickGuides(highlight.items, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, '\\u003c') }}
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {/* ── 1. 히어로 ─────────────────────────────────────────── */}
        <section className="mb-8">
          <p className="text-xs font-semibold text-blue-700">{TAX_YEAR}년 적용 기준</p>
          <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
            복잡한 세금, 내 조건만 입력하면 간단하게
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            {TAX_YEAR}년 세율과 공식 법령 기준으로 예상 세액과 납부 일정을 확인하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#all-calculators"
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              계산기 찾기
            </a>
            <a
              href="#this-month"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              이번 달 세금 보기
            </a>
          </div>
        </section>

        {/* ── 2. 이번 달 세금 ───────────────────────────────────── */}
        <section id="this-month" className="mb-10 scroll-mt-16">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {highlight.isUpcoming
                ? `다음 세금 일정 · ${MONTH_LABELS[highlight.month]}`
                : `${MONTH_LABELS[highlight.month]}에 낼 세금`}
            </h2>
            <Link href="/tax-calendar" className="inline-flex min-h-[32px] items-center text-sm font-semibold text-blue-700 hover:underline">
              전체 일정 보기 →
            </Link>
          </div>

          {highlight.isUpcoming && (
            <p className="mb-3 text-sm text-slate-600">
              {MONTH_LABELS[month]}에는 정기 납부 일정이 없습니다. 다음으로 가까운 일정을 보여드립니다.
            </p>
          )}

          <ul className="space-y-2">
            {highlight.items.map((item) => (
              <li key={item.title} className="calc-card p-4 sm:p-5">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${KIND_STYLE[item.kind]}`}>
                    {item.kind}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.period}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                  {item.calculator && (
                    <Link
                      href={calculatorHref(item.calculator)}
                      className="inline-flex min-h-[32px] items-center font-semibold text-blue-700 hover:underline"
                    >
                      {calculatorBySlug(item.calculator).title} →
                    </Link>
                  )}
                  {item.guide && guideBySlug(item.guide) && (
                    <Link href={guideHref(item.guide)} className="inline-flex min-h-[32px] items-center font-semibold text-blue-700 hover:underline">
                      {guideBySlug(item.guide)!.title} →
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
            기한 마지막 날이 토요일·일요일·공휴일이면 그 다음 날이 기한이 됩니다(「국세기본법」 제5조,
            「지방세기본법」 제24조). 연도에 따라 날짜가 하루 이틀 달라질 수 있으니 실제 기한은 고지서나
            홈택스·위택스에서 확인하세요.
          </p>
        </section>

        {/* ── 3. 인기 계산기 ───────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">많이 찾는 계산기</h2>
          <Link
            href={calculatorHref(featured.slug)}
            className="calc-card group mb-3 block p-5 transition-all hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="text-3xl sm:text-4xl">
                {featured.emoji}
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {highlight.isUpcoming ? '다음 일정 관련' : `${MONTH_LABELS[highlight.month]} 추천`}
                  </span>
                  {'isNew' in featured && featured.isNew && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      신규
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                  {featured.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{featured.description}</p>
              </div>
            </div>
          </Link>

          <div
            className={
              otherPopular.length === 4
                ? 'grid grid-cols-2 gap-3 sm:grid-cols-4'
                : 'grid grid-cols-1 gap-3 sm:grid-cols-3'
            }
          >
            {otherPopular.map((calc) => (
              <Link
                key={calc.slug}
                href={calculatorHref(calc.slug)}
                className="calc-card group p-4 transition-all hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span aria-hidden="true" className="text-2xl">
                    {calc.emoji}
                  </span>
                  {'isNew' in calc && calc.isNew && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      신규
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                  {calc.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{calc.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. 상황별 찾기 ───────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-1 text-lg font-bold text-slate-900">어떤 상황이신가요</h2>
          <p className="mb-3 text-sm text-slate-600">세목 이름을 몰라도 상황으로 찾을 수 있습니다.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AUDIENCE_GROUPS.map((group) => {
              const list = calculatorsFor(group.key)
              if (list.length === 0) return null
              return (
                <div key={group.key} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-slate-800">{group.label}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{group.hint}</p>
                  <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
                    {list.map((calc) => (
                      <li key={calc.slug}>
                        <Link
                          href={calculatorHref(calc.slug)}
                          className="inline-flex min-h-[40px] items-center rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          {calc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 5. 추천 가이드 ───────────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">지금 읽어두면 좋은 가이드</h2>
            <Link href="/guide" className="inline-flex min-h-[32px] items-center text-sm font-semibold text-blue-700 hover:underline">
              가이드 전체 보기 →
            </Link>
          </div>
          <ul className="space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={guideHref(guide.slug)}
                  className="calc-card group block p-4 transition-all hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {guide.category}
                    </span>
                    <GuideReviewDate slug={guide.slug} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-700">
                    {guide.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{guide.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 6. 모든 계산기 ───────────────────────────────────── */}
        <section id="all-calculators" className="mb-10 scroll-mt-16">
          <h2 className="mb-3 text-lg font-bold text-slate-900">모든 계산기</h2>
          <CalculatorDirectory calculators={[...ENABLED_CALCULATORS]} />
        </section>

        {/* ── 7. 신뢰·면책 ─────────────────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-3 text-base font-bold text-slate-900">이 계산기를 믿어도 되는 이유</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            <li>
              <strong className="text-slate-800">{TAX_YEAR}년 적용 기준.</strong> 계산기마다 적용 연도와 최근
              점검일을 표시하고, 확인하지 못한 연도는 계산하지 않습니다.
            </li>
            <li>
              <strong className="text-slate-800">공식 자료 우선.</strong> 국가법령정보센터의 법령 원문과
              국세청·위택스 안내를 근거로 삼고, 계산기 하단에 근거 조문 링크를 답니다.
            </li>
            <li>
              <strong className="text-slate-800">브라우저 안에서만 계산.</strong> 입력한 금액은 서버로 전송되지
              않습니다.
            </li>
            <li>
              <strong className="text-slate-800">로그인 없이 무료.</strong> 회원가입이나 앱 설치가 필요 없습니다.
            </li>
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
            계산 결과는 참고용이며 세무 자문이 아닙니다. 각 계산기는 반영하지 않는 조건을 화면에 밝히고 있으니
            해당하는 항목이 있는지 확인하세요. 실제 신고·납부 세액은 국세청 홈택스, 위택스 또는 세무 전문가를
            통해 확인하시기 바랍니다.
          </p>
        </section>
      </main>
    </>
  )
}
