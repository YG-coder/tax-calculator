// src/app/guide/comprehensive-real-estate-tax/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: '종합부동산세 계산 방법과 12월 납부기간',
    description:
        '공시가격 합계에서 시작하는 종합부동산세 계산 구조를 기본공제 9억·12억, 공정시장가액비율 60%, 구간별 세율, 재산세 중복분 공제, 고령자·장기보유 세액공제, 세부담 상한, 농어촌특별세 순서로 정리했습니다.',
    alternates: { canonical: '/guide/comprehensive-real-estate-tax' },
}

const law = (name: string, article: string) =>
    `https://www.law.go.kr/${['법령', name, article].map(encodeURIComponent).join('/')}`

export default function CretGuidePage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">종합부동산세</span>
                    <span className="text-xs text-slate-400">약 9분 읽기</span>
                </div>
                <h1 className="mb-3 text-3xl font-bold leading-tight text-slate-900">
                    종합부동산세 계산 방법과 12월 납부기간
                </h1>
                <p className="text-slate-500">
                    공시가격에서 최종 납부액까지, 주택분 종합부동산세가 어떻게 계산되는지 순서대로 정리했습니다.
                    부부 공동명의라면 특례를 신청하는 쪽이 유리한지도 확인해 보세요.
                </p>
            </div>

            <article className="prose prose-slate max-w-none space-y-8 text-sm leading-7 text-slate-700">
                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">누가 내는가</h2>
                    <p>
                        과세기준일인 <strong>6월 1일</strong> 현재 주택을 소유한 사람 중, 공시가격 합계가 공제금액을
                        넘는 사람이 냅니다. 재산세는 주택을 가진 모두가 내지만 종합부동산세는 일정 금액을 넘는 사람만
                        냅니다. 납부기간은 <strong>12월 1일부터 12월 15일까지</strong>입니다. (
                        <a href={law('종합부동산세법', '제16조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            종합부동산세법 제16조 제1항
                        </a>
                        )
                    </p>
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm leading-relaxed text-slate-700">
                            💡 <strong>계산 순서:</strong> 공시가격 합계 → 공제금액 → 과세표준 → 세율 → 재산세 중복분 공제
                            → 세액공제 → 세부담 상한 → 종합부동산세 → 농어촌특별세 → 최종 납부액
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">1단계. 공제금액과 과세표준</h2>
                    <p>
                        공시가격 합계에서 공제금액을 뺀 뒤 공정시장가액비율 60%를 곱하면 과세표준입니다. 공제금액은
                        1세대 1주택자 <strong>12억원</strong>, 그 밖의 개인 <strong>9억원</strong>입니다. (
                        <a href={law('종합부동산세법', '제8조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            종합부동산세법 제8조 제1항
                        </a>
                        ,{' '}
                        <a href={law('종합부동산세법 시행령', '제2조의4')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            시행령 제2조의4 제1항
                        </a>
                        )
                    </p>
                    <p className="mt-2">
                        예를 들어 1세대 1주택자가 공시가격 20억원 주택을 가지고 있다면 20억 − 12억 = 8억, 여기에 60%를
                        곱한 4억 8천만원이 과세표준입니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">2단계. 세율은 주택 수에 따라 갈린다</h2>
                    <p>
                        과세표준 12억원까지는 주택 수와 관계없이 같은 세율이지만, 그 위부터는 3주택 이상 보유자에게 더
                        높은 세율이 적용됩니다. (
                        <a href={law('종합부동산세법', '제9조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            종합부동산세법 제9조 제1항
                        </a>
                        )
                    </p>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[400px] border-collapse text-xs">
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
                                    ['3억 ~ 6억', '0.7%', '0.7%'],
                                    ['6억 ~ 12억', '1.0%', '1.0%'],
                                    ['12억 ~ 25억', '1.3%', '2.0%'],
                                    ['25억 ~ 50억', '1.5%', '3.0%'],
                                    ['50억 ~ 94억', '2.0%', '4.0%'],
                                    ['94억 초과', '2.7%', '5.0%'],
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
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">3단계. 재산세와 겹치는 부분을 뺀다</h2>
                    <p>
                        같은 주택에 7월·9월 재산세와 12월 종합부동산세가 모두 부과되므로 겹치는 부분을 빼 줍니다.
                        종부세 과세표준에 해당하는 만큼의 재산세를 계산해 공제하는 방식입니다. (
                        <a href={law('종합부동산세법', '제9조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            법 제9조 제3항
                        </a>
                        ,{' '}
                        <a href={law('종합부동산세법 시행령', '제4조의3')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            시행령 제4조의3
                        </a>
                        )
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">4단계. 1세대 1주택자 세액공제</h2>
                    <p>
                        1세대 1주택자는 나이와 보유기간에 따라 세액을 공제받습니다. 두 공제는 중복 적용되지만 합계
                        <strong> 80%가 한도</strong>입니다. (
                        <a href={law('종합부동산세법', '제9조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            법 제9조 제5항~제9항
                        </a>
                        )
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="mb-1.5 text-xs font-semibold text-slate-700">연령별 (과세기준일 현재 만 나이)</p>
                            <ul className="space-y-0.5 text-xs text-slate-600">
                                <li>60세 이상 65세 미만 — 20%</li>
                                <li>65세 이상 70세 미만 — 30%</li>
                                <li>70세 이상 — 40%</li>
                            </ul>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="mb-1.5 text-xs font-semibold text-slate-700">보유기간별</p>
                            <ul className="space-y-0.5 text-xs text-slate-600">
                                <li>5년 이상 10년 미만 — 20%</li>
                                <li>10년 이상 15년 미만 — 40%</li>
                                <li>15년 이상 — 50%</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        예: 만 70세 · 보유 15년이면 40% + 50% = 90%지만 한도 80%까지만 공제됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">5단계. 세부담 상한과 농어촌특별세</h2>
                    <p>
                        해당 연도의 재산세와 종합부동산세 합계가 직전년도 합계의 <strong>150%</strong>를 넘으면 그 초과분은
                        없는 것으로 봅니다. (
                        <a href={law('종합부동산세법', '제10조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            법 제10조
                        </a>
                        ) 마지막으로 종합부동산세액의 <strong>20%</strong>가 농어촌특별세로 함께 부과됩니다. (
                        <a href={law('농어촌특별세법', '제5조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            농어촌특별세법 제5조 제1항 제8호
                        </a>
                        )
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">부부 공동명의, 어느 쪽이 유리한가</h2>
                    <p>
                        원칙적으로 공동명의는 각자 지분만큼 납세의무를 지므로 부부가 각각 9억원씩, 합쳐서 18억원을
                        공제받습니다. 대신 1세대 1주택자가 아니어서 고령자·장기보유 세액공제는 받지 못합니다.
                    </p>
                    <p className="mt-2">
                        「종합부동산세법」 제10조의2의 <strong>공동명의 1주택자 특례</strong>를 신청하면 한 사람이 주택
                        전체에 대해 1세대 1주택자로 계산됩니다. 공제는 12억원으로 줄지만 세액공제를 최대 80%까지 받을 수
                        있습니다. 신청기간은 <strong>9월 16일부터 9월 30일까지</strong>입니다. (
                        <a href={law('종합부동산세법', '제10조의2')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            법 제10조의2
                        </a>
                        )
                    </p>
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                        <p className="mb-2 font-semibold text-slate-800">일반적인 판단 기준</p>
                        <ul className="space-y-1 text-slate-600">
                            <li>· 공시가격이 18억원 이하이면 특례를 신청하지 않는 쪽이 대체로 유리합니다 (세액 자체가 0)</li>
                            <li>· 나이가 많고 오래 보유해 세액공제율이 높을수록 특례가 유리해집니다</li>
                            <li>· 정확한 비교는 두 방식을 모두 계산해 보는 것이 확실합니다</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">9월에 챙겨야 할 신청</h2>
                    <p>
                        합산배제 임대주택·사원용 주택 등의 보유현황 신고, 공동명의 1주택자 특례, 일시적 2주택·상속주택·
                        지방 저가주택의 1세대 1주택자 판정 특례는 모두 <strong>9월 16일부터 9월 30일까지</strong>
                        신청해야 합니다. 이 기간을 놓치면 12월 고지에 반영되지 않습니다. (
                        <a href={law('종합부동산세법', '제8조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            법 제8조 제3항·제5항
                        </a>
                        )
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">자주 하는 실수</h2>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            <strong>시가로 계산하는 것:</strong> 종합부동산세는 시세가 아니라 공시가격 기준입니다.
                            부동산공시가격알리미에서 확인하세요.
                        </li>
                        <li>
                            <strong>6월 1일 기준을 놓치는 것:</strong> 5월 31일에 팔면 그해 종부세를 내지 않지만,
                            6월 2일에 팔면 냅니다.
                        </li>
                        <li>
                            <strong>재산세를 냈으니 끝났다고 생각하는 것:</strong> 재산세와 종합부동산세는 별개이며,
                            겹치는 부분만 공제됩니다.
                        </li>
                        <li>
                            <strong>농어촌특별세를 빼먹는 것:</strong> 종합부동산세의 20%가 함께 부과되므로 실제 부담은
                            고지된 종부세보다 큽니다.
                        </li>
                    </ul>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="mb-2 text-base font-bold text-slate-800">계산해 보기</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link href="/comprehensive-real-estate-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            종합부동산세 계산기 — 공동명의 특례 비교까지 →
                        </Link>
                        <Link href="/property-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            재산세 계산기 →
                        </Link>
                        <Link href="/guide/property-tax" className="font-semibold text-blue-700 hover:underline">
                            재산세 계산 방법과 7월·9월 납부기간 →
                        </Link>
                        <Link href="/tax-calendar" className="font-semibold text-blue-700 hover:underline">
                            세금 납부 일정 달력 →
                        </Link>
                    </div>
                </section>

                <p className="text-xs text-slate-500">
                    이 글은 「종합부동산세법」과 같은 법 시행령, 「농어촌특별세법」 조문을 바탕으로 정리한 참고 자료입니다.
                    법인·토지분, 합산배제 임대주택 등은 다루지 않습니다. 실제 고지 세액은 국세청 홈택스 또는 관할
                    세무서에서 확인하세요.
                </p>
            </article>
        </main>
    )
}
