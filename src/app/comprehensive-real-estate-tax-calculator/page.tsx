import type { Metadata } from 'next'
import Link from 'next/link'
import ComprehensiveRealEstateTaxClient from './ComprehensiveRealEstateTaxClient'
import { buildMetadata } from '@/lib/metadata'
import { CRET_PAYMENT_PERIOD, CRET_TAX_YEAR } from '@/lib/tax/rules/comprehensive-real-estate'

const title = '종합부동산세 계산기'
const description =
    '2026년 기준 종합부동산세 계산기. 개인 주택분의 공시가격 합계부터 기본공제·공정시장가액비율·구간별 세율·재산세 중복분 공제·고령자 및 장기보유 세액공제·세부담 상한·농어촌특별세까지 단계별로 계산합니다.'

export const metadata: Metadata = buildMetadata({
    title,
    description,
    path: '/comprehensive-real-estate-tax-calculator',
})

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    url: 'https://taxsim.kr/comprehensive-real-estate-tax-calculator',
    description:
        '종합부동산세법 제8조·제9조·제10조에 따른 개인 주택분 종합부동산세와 농어촌특별세를 단계별로 계산하는 무료 계산기입니다.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    inLanguage: 'ko-KR',
}

export default function Page() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <header className="mb-8">
                <p className="text-xs font-medium text-slate-500">국세 · {CRET_TAX_YEAR}년 기준</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">종합부동산세 계산기</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    개인이 소유한 <strong>주택분</strong> 종합부동산세를 계산합니다. 과세기준일은 6월 1일이고, 납부기간은{' '}
                    {CRET_PAYMENT_PERIOD}입니다. 공시가격 합계 → 공제금액 → 과세표준 → 세율 → 재산세 중복분 공제 →
                    세액공제 → 세부담 상한 → 종합부동산세 → 농어촌특별세 → 최종 예상액 순서로 보여줍니다.
                </p>
            </header>

            <ComprehensiveRealEstateTaxClient />

            <section className="mt-12 space-y-6 text-sm leading-relaxed text-slate-600">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">계산에 적용한 기준</h2>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">과세표준</h3>
                    <p className="mt-2">
                        <span className="font-mono text-xs">
                            (주택 공시가격 합계 − 공제금액) × 공정시장가액비율 60%
                        </span>{' '}
                        입니다. 공제금액은 1세대 1주택자 12억원, 그 밖의 개인 9억원입니다. (법 제8조 제1항, 영 제2조의4
                        제1항)
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">주택분 세율 (법 제9조 제1항)</h3>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[420px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">과세표준</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">2주택 이하</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">3주택 이상</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ['3억원 이하', '0.5%', '0.5%'],
                                    ['3억 초과 6억 이하', '0.7%', '0.7%'],
                                    ['6억 초과 12억 이하', '1.0%', '1.0%'],
                                    ['12억 초과 25억 이하', '1.3%', '2.0%'],
                                    ['25억 초과 50억 이하', '1.5%', '3.0%'],
                                    ['50억 초과 94억 이하', '2.0%', '4.0%'],
                                    ['94억원 초과', '2.7%', '5.0%'],
                                ].map(([range, a, b]) => (
                                    <tr key={range} className="bg-white">
                                        <td className="px-3 py-2 text-slate-600">{range}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{a}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{b}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        법 조문은 1천분율(예: 1천분의 5)로 규정되어 있습니다. 12억원 이하 구간은 주택 수와 무관하게 같습니다.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">재산세 중복분 공제 (법 제9조 제3항, 영 제4조의3)</h3>
                    <p className="mt-2">
                        같은 주택에 재산세와 종합부동산세가 함께 부과되므로 겹치는 부분을 빼 줍니다. 공제액은{' '}
                        <span className="font-mono text-xs">
                            재산세 부과세액 × (종부세 과세표준 × 재산세 공정시장가액비율에 재산세 표준세율을 적용한 세액) ÷
                            (주택 합산 재산세 표준세율 상당액)
                        </span>{' '}
                        입니다.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">1세대 1주택자 세액공제 (법 제9조 제5항~제9항)</h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="mb-1 text-xs font-semibold text-slate-700">연령별</p>
                            <ul className="space-y-0.5 text-xs">
                                <li>만 60세 이상 65세 미만 — 20%</li>
                                <li>만 65세 이상 70세 미만 — 30%</li>
                                <li>만 70세 이상 — 40%</li>
                            </ul>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-semibold text-slate-700">보유기간별</p>
                            <ul className="space-y-0.5 text-xs">
                                <li>5년 이상 10년 미만 — 20%</li>
                                <li>10년 이상 15년 미만 — 40%</li>
                                <li>15년 이상 — 50%</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        두 공제는 중복 적용되지만 <strong>합계 80%가 한도</strong>입니다.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">세부담 상한과 농어촌특별세</h3>
                    <p className="mt-2">
                        해당 연도의 재산세와 종합부동산세 합계액이 직전년도 합계액의 <strong>150%</strong>를 초과하면 그
                        초과분은 없는 것으로 봅니다. (법 제10조) 종합부동산세액의 <strong>20%</strong>가 농어촌특별세로
                        함께 부과됩니다. (「농어촌특별세법」 제5조 제1항 제8호)
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">공동명의 주택</h3>
                    <p className="mt-2">
                        원칙적으로 각자 지분만큼 납세의무를 져 부부가 각각 9억원씩 공제받습니다. 「종합부동산세법」
                        제10조의2의 <strong>공동명의 1주택자 특례</strong>를 9월 16일 ~ 9월 30일에 신청하면 한 사람이 주택
                        전체에 대해 1세대 1주택자로 계산되어 12억원 공제와 고령자·장기보유 세액공제를 받습니다. 어느 쪽이
                        유리한지는 공시가격과 연령·보유기간에 따라 달라지므로 계산기가 두 경우를 나란히 보여줍니다.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-sm font-semibold text-slate-800">지원 범위와 후속 확장 항목</h3>
                    <ul className="mt-2 space-y-1.5 text-sm">
                        <li>· 지원: 개인 주택분 (1세대 1주택자·일반 소유자, 부부 공동명의 1주택, 2주택 이하·3주택 이상 세율)</li>
                        <li>· 미지원: 법인·법인으로 보는 단체의 주택분 (법 제9조 제2항의 27‰·50‰ 단일세율)</li>
                        <li>· 미지원: 종합합산토지분·별도합산토지분 (법 제13조·제14조)</li>
                        <li>· 미지원: 합산배제 임대주택·사원용 주택 등 (법 제8조 제2항)</li>
                        <li>· 미지원: 일시적 2주택·상속주택·지방 저가주택의 1세대 1주택자 판정 특례 (법 제8조 제4항). 요건 판정은 국세청에 확인한 뒤 1세대 1주택자로 선택해 계산하세요</li>
                        <li>· 미지원: 신탁주택, 부부 외 공동명의, 「지방세법」 제111조 제3항의 조례 가감조정 세율</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-sm font-semibold text-slate-800">함께 보면 좋은 문서</h3>
                    <div className="mt-2 flex flex-col gap-2 text-sm">
                        <Link href="/guide/comprehensive-real-estate-tax" className="font-semibold text-blue-700 hover:underline">
                            종합부동산세 계산 방법과 12월 납부기간 →
                        </Link>
                        <Link href="/property-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            재산세 계산기 — 7월·9월 납부액 →
                        </Link>
                        <Link href="/capital-gains-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            양도소득세 계산기 — 팔 때의 세금 →
                        </Link>
                        <Link href="/tax-calendar" className="font-semibold text-blue-700 hover:underline">
                            세금 납부 일정 달력 →
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
                    <p className="mb-1 font-semibold text-slate-800">⚠️ 참고용 안내</p>
                    <p>
                        이 계산기는 법령 조문에 따른 예상액을 보여주는 참고용 도구입니다. 합산배제 신고, 1세대 1주택자
                        판정 특례, 조례 세율 등에 따라 실제 고지액은 달라질 수 있습니다. 최종 세액은 국세청 홈택스 또는
                        관할 세무서를 통해 확인하시기 바랍니다.
                    </p>
                </div>
            </section>
        </main>
    )
}
