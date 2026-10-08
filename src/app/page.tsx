/* src/app/page.tsx — 세금계산기 홈 (대시보드형) */
import type { Metadata } from 'next'
import Link from 'next/link'
import CalculatorDirectory from '@/components/CalculatorDirectory'
import GuideReviewDate from '@/components/GuideReviewDate'
import {
  ENABLED_CALCULATORS,
  POPULAR_CALCULATORS,
  calculatorBySlug,
  calculatorHref,
} from '@/lib/calculators'
import { guideBySlug, guideHref } from '@/lib/guides'
import { pickFeatured, pickGuides } from '@/lib/home'
import { MONTH_LABELS, currentMonthInSeoul, monthlyHighlight } from '@/lib/tax-calendar'

import { CALCULATOR_META, STATIC_PAGE_LAST_MODIFIED } from '@/lib/content-registry'
import { BASE_URL, SITE } from '@/lib/site'

const HOME_URL = `${BASE_URL}/`
const HOME_TITLE = '세금계산기 | 부가세·소득세·양도세 계산과 납부 일정'
const HOME_DESCRIPTION =
  '세금계산기로 부가세·종합소득세·양도소득세·자동차세 등 예상 세액을 계산하세요. 내 상황에 맞는 도구를 선택하고 적용 기준과 신고·납부 일정을 확인할 수 있습니다.'
const HOME_MODIFIED_AT = STATIC_PAGE_LAST_MODIFIED['/']

/**
 * "이번 달" 표시는 서버에서 렌더링한다. 홈 전체를 클라이언트 컴포넌트로 바꾸지 않기 위해서다.
 * 정적 생성된 HTML이 달을 넘겨서도 그대로 남지 않도록 한 시간마다 다시 만든다.
 */
export const revalidate = 3600

export const metadata: Metadata = {
  // 루트 layout의 제목 template으로 사이트명이 한 번 더 붙지 않도록 한다.
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: HOME_URL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: HOME_URL,
    siteName: SITE.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${HOME_URL}#website`,
  name: SITE.name,
  alternateName: 'taxsim.kr',
  url: HOME_URL,
  inLanguage: 'ko-KR',
  description: HOME_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE.operatorName,
    url: HOME_URL,
  },
  // 홈에서만 목록을 필터링하므로 검색 결과 URL을 요구하는 SearchAction은 선언하지 않는다.
}

// 화면의 전체 계산기 목록과 동일한 레지스트리 및 순서를 사용한다.
const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${HOME_URL}#calculator-list`,
  name: '세금 계산기 모음',
  numberOfItems: ENABLED_CALCULATORS.length,
  itemListElement: ENABLED_CALCULATORS.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.title,
    url: `${BASE_URL}${calculatorHref(c.slug)}`,
  })),
}

// 홈은 실제 상위 경로가 없으므로 BreadcrumbList를 만들지 않는다.
const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${HOME_URL}#webpage`,
  url: HOME_URL,
  name: HOME_TITLE,
  description: HOME_DESCRIPTION,
  inLanguage: 'ko-KR',
  dateModified: HOME_MODIFIED_AT,
  isPartOf: { '@id': `${HOME_URL}#website` },
  mainEntity: { '@id': `${HOME_URL}#calculator-list` },
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd).replace(/</g, '\\u003c') }}
      />

      <main className="mx-auto w-full min-w-0 max-w-4xl px-4 py-8 sm:py-10">
        {/* ── 1. 히어로 ─────────────────────────────────────────── */}
        <section className="mb-8">
          <p className="text-xs font-semibold text-blue-700">내 상황에 맞는 예상 세액 계산</p>
          <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
            세금계산기, 내 상황에 맞는 계산기를 찾아보세요
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            세금 계산기란 소득·재산·거래 금액 등 입력 조건을 바탕으로 예상 세액을 계산하는 도구입니다.
            부가세, 종합소득세, 양도소득세, 자동차세 등 필요한 도구를 선택하세요.
            계산 전에는 해당 도구의 적용 기준과 제외 조건을 확인하세요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="#all-calculators"
              className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              계산기 선택하기
            </a>
            <a
              href="#this-month"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              신고·납부 일정 보기
            </a>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            적용 연도·법령 기준은 각 계산기에서 확인하세요. 계산 결과는 참고용입니다.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            홈 안내 수정일: <time dateTime={HOME_MODIFIED_AT}>{HOME_MODIFIED_AT}</time>
          </p>
        </section>

        {/* ── 2. 빠른 계산기 선택 ───────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-slate-900">바로 계산하려면 어떤 도구를 선택하나요?</h2>
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
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {featured.title}의 근거 자료:{' '}
            {CALCULATOR_META[featured.slug].sources.slice(0, 2).map((source, index) => (
              <span key={source.url}>
                {index > 0 && ' · '}
                <a href={source.url} className="text-blue-700 hover:underline">{source.label}</a>
              </span>
            ))}
          </p>
        </section>

        {/* ── 3. 검색·상황별 선택 ───────────────────────────────────── */}
        <section id="all-calculators" className="mb-10 scroll-mt-16">
          <h2 className="mb-3 text-lg font-bold text-slate-900">어떤 상황의 세금을 계산하시나요?</h2>
          <p className="mb-3 text-sm text-slate-600">상황을 선택하거나 계산기 이름으로 검색하세요.</p>
          <CalculatorDirectory calculators={[...ENABLED_CALCULATORS]} />
        </section>

        {/* ── 4. 이번 달 세금 ───────────────────────────────────── */}
        <section id="this-month" className="mb-10 scroll-mt-16">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {highlight.isUpcoming
                ? `다음 신고·납부 일정은 무엇인가요? · ${MONTH_LABELS[highlight.month]}`
                : `${MONTH_LABELS[highlight.month]}에 신고·납부할 세금은 무엇인가요?`}
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
                  <a href={item.basisUrl} className="inline-flex min-h-[32px] items-center text-xs text-blue-700 hover:underline">
                    근거: {item.basis}
                  </a>
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
            일정 자료 수정일:{' '}
            <time dateTime={STATIC_PAGE_LAST_MODIFIED['/tax-calendar']}>{STATIC_PAGE_LAST_MODIFIED['/tax-calendar']}</time>
            {' · '}표시 기간은 법령상 기본 기한이며, 실제 기한은 휴일 등에 따라 달라질 수 있습니다.
          </p>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
            기한 마지막 날이 토요일·일요일·공휴일이면 그 다음 날이 기한이 됩니다(
            <a href="https://www.law.go.kr/법령/국세기본법/제5조" className="text-blue-700 hover:underline">국세기본법 제5조</a>,{' '}
            <a href="https://www.law.go.kr/법령/지방세기본법/제24조" className="text-blue-700 hover:underline">지방세기본법 제24조</a>
            ). 실제 기한은 고지서나{' '}
            <a href="https://www.hometax.go.kr/" className="text-blue-700 hover:underline">국세청 홈택스</a>·
            <a href="https://www.wetax.go.kr/" className="text-blue-700 hover:underline">위택스</a>에서 확인하세요.
          </p>
        </section>

        {/* ── 5. 추천 가이드 ───────────────────────────────────── */}
        <section className="mb-10">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">세금 계산 방법은 어디서 알아볼 수 있나요?</h2>
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

        {/* ── 6. 직접 답변 ─────────────────────────────────────── */}
        <section className="mb-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">계산 결과와 실제 납부액은 같나요?</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            계산 결과는 입력 조건과 반영 범위에 따른 예상값입니다. 공제·감면·신고 유형 등 개별 조건에 따라
            실제 금액이 달라질 수 있으므로 신고·납부 전 공식 조회 결과와 비교하세요.
          </p>
          <div>
            <h3 className="text-sm font-bold text-slate-800">적용 연도는 어디에서 확인하나요?</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              이용하려는 계산기의 적용 기준과 최근 점검일을 확인하세요. 계산하려는 과세연도와 적용 기준이
              다르면 해당 결과를 그대로 사용하지 마세요.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">계산 근거는 어디에서 확인하나요?</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              각 계산기의 근거 자료와 반영 범위를 확인하세요. 법령 원문은 국가법령정보센터에서,
              신고·납부 안내는 홈택스와 위택스에서 확인할 수 있습니다.
            </p>
            <a href="#calculation-sources" className="mt-2 inline-flex min-h-[40px] items-center text-sm font-semibold text-blue-700 hover:underline">
              계산기별 기준과 공식 출처 보기 →
            </a>
          </div>
        </section>

        {/* ── 7. 실제 레지스트리의 기준·출처 ────────────────────── */}
        <section id="calculation-sources" className="mb-10 scroll-mt-16">
          <h2 className="mb-2 text-lg font-bold text-slate-900">계산 기준과 공식 자료는 무엇인가요?</h2>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            아래는 계산기별로 기록된 최근 점검일과 대표 근거 조문입니다. 전체 적용 기준과 제외 조건은
            해당 계산기의 근거 자료를 확인하세요. 홈 안내 수정일과 계산 기준 점검일은 서로 다릅니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">계산기별 최근 점검일과 대표 공식 출처</caption>
              <thead className="bg-slate-50 text-xs text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3">계산기</th>
                  <th scope="col" className="px-4 py-3">최근 점검일</th>
                  <th scope="col" className="px-4 py-3">대표 근거 조문 · 국가법령정보센터</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ENABLED_CALCULATORS.map((calc) => {
                  const meta = CALCULATOR_META[calc.slug]
                  const source = meta.sources[0]
                  return (
                    <tr key={calc.slug}>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                        <Link href={calculatorHref(calc.slug)} className="hover:text-blue-700 hover:underline">{calc.title}</Link>
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        <time dateTime={meta.lastReviewed}>{meta.lastReviewed}</time>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <a href={source.url} className="text-blue-700 hover:underline">{source.label}</a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 8. 이용 안내 ─────────────────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="mb-3 text-base font-bold text-slate-900">이용 전에 무엇을 확인해야 하나요?</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
            <li>
              <strong className="text-slate-800">적용 기준 확인.</strong> 계산기별 적용 연도·최근 점검일과
              반영하지 않는 조건을 확인하세요.
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
