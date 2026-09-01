// src/app/tax-calendar/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { EVENT_DRIVEN_SCHEDULE, MONTH_LABELS, TAX_SCHEDULE } from '@/lib/tax-calendar'

const title = '세금 납부 일정 달력'
const description =
    '1월 자동차세 연납부터 5월 종합소득세, 6월 자동차세 제1기분, 7·9월 재산세, 12월 종합부동산세와 자동차세 제2기분까지 월별 세금 일정을 법령 근거와 함께 정리하고 관련 계산기로 바로 이동할 수 있습니다.'

export const metadata: Metadata = buildMetadata({
    title,
    description,
    path: '/tax-calendar',
})

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: 'https://taxsim.kr/tax-calendar',
    inLanguage: 'ko-KR',
}

const MONTHS = Array.from(new Set(TAX_SCHEDULE.map((s) => s.month))).sort((a, b) => a - b)

const KIND_STYLE: Record<string, string> = {
    국세: 'bg-blue-50 text-blue-700',
    지방세: 'bg-emerald-50 text-emerald-700',
}

export default function TaxCalendarPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <header className="mb-8">
                <p className="text-xs font-medium text-slate-500">2026년 기준</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">세금 납부 일정 달력</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    한 해 동안 챙겨야 할 주요 세금 일정을 월별로 정리했습니다. 각 일정의 기간은 법령 조문에서 확인한
                    값이며, 관련 계산기와 가이드로 바로 이동할 수 있습니다.
                </p>
            </header>

            <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-relaxed text-slate-700">
                <p className="mb-1 font-semibold text-slate-800">기한이 휴일이면 다음 날로 밀립니다</p>
                <p>
                    신고·납부 기한의 마지막 날이 토요일, 일요일, 「공휴일에 관한 법률」에 따른 공휴일·대체공휴일 또는
                    근로자의 날이면 그 다음 날이 기한이 됩니다. 국세는 「국세기본법」 제5조 제1항, 지방세는
                    「지방세기본법」 제24조 제1항에 따릅니다. 따라서 아래 날짜는 연도에 따라 하루 이틀 달라질 수 있으니
                    실제 기한은 홈택스·위택스 또는 고지서로 확인하세요.
                </p>
            </div>

            <div className="space-y-8">
                {MONTHS.map((month) => (
                    <section key={month}>
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                            <span className="inline-flex h-8 w-12 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                                {MONTH_LABELS[month]}
                            </span>
                        </h2>
                        <div className="space-y-3">
                            {TAX_SCHEDULE.filter((s) => s.month === month).map((item) => (
                                <article key={item.title} className="calc-card p-5">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${KIND_STYLE[item.kind]}`}>
                                            {item.kind}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500">{item.period}</span>
                                    </div>
                                    <h3 className="mb-1.5 text-base font-bold text-slate-800">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-600">{item.summary}</p>
                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                        {item.calculator && (
                                            <Link href={item.calculator.href} className="font-semibold text-blue-700 hover:underline">
                                                {item.calculator.label} →
                                            </Link>
                                        )}
                                        {item.guide && (
                                            <Link href={item.guide.href} className="font-semibold text-blue-700 hover:underline">
                                                {item.guide.label} →
                                            </Link>
                                        )}
                                        <a
                                            href={item.basisUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-slate-500 hover:underline"
                                        >
                                            {item.basis}
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <section className="mt-12">
                <h2 className="mb-3 text-lg font-bold text-slate-900">달이 정해져 있지 않은 일정</h2>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">
                    아래 세금은 거래가 있었던 날을 기준으로 기한이 정해집니다.
                </p>
                <div className="space-y-3">
                    {EVENT_DRIVEN_SCHEDULE.map((item) => (
                        <article key={item.title} className="calc-card p-5">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${KIND_STYLE[item.kind]}`}>
                                    {item.kind}
                                </span>
                                <span className="text-xs font-semibold text-slate-500">{item.period}</span>
                            </div>
                            <h3 className="mb-1.5 text-base font-bold text-slate-800">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-slate-600">{item.summary}</p>
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                <Link href={item.calculator.href} className="font-semibold text-blue-700 hover:underline">
                                    {item.calculator.label} →
                                </Link>
                                <Link href={item.guide.href} className="font-semibold text-blue-700 hover:underline">
                                    {item.guide.label} →
                                </Link>
                                <a
                                    href={item.basisUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-slate-500 hover:underline"
                                >
                                    {item.basis}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mt-12 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm leading-relaxed text-slate-600">
                <h2 className="mb-2 text-base font-bold text-slate-800">일정 확인은 어디에서</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>
                        국세(종합소득세·부가가치세·양도소득세·상속세·증여세·종합부동산세):{' '}
                        <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            국세청 홈택스
                        </a>
                    </li>
                    <li>
                        지방세(자동차세·재산세):{' '}
                        <a href="https://www.wetax.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            위택스
                        </a>{' '}
                        또는 관할 지방자치단체
                    </li>
                </ul>
                <p className="mt-3 text-xs text-slate-500">
                    이 페이지는 법령에 규정된 기한을 정리한 참고 자료입니다. 개별 고지서의 납부기한이 다르면 고지서를
                    따르세요.
                </p>
            </section>
        </main>
    )
}
