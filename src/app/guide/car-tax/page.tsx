// src/app/guide/car-tax/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import GuideReviewDate from '@/components/GuideReviewDate'

export const metadata: Metadata = {
    title: '자동차세 과세 기준과 연납 완전 정리',
    description:
        '배기량별 cc당 세액, 차령 3년부터 시작되는 경감, 지방교육세 30%, 제1기분·제2기분 납기, 그리고 1·3·6·9월 연납 신청 시기별 공제 계산식을 지방세법 조문 기준으로 정리했습니다.',
    alternates: { canonical: '/guide/car-tax' },
}

const law = (name: string, article: string) =>
    `https://www.law.go.kr/${['법령', name, article].map(encodeURIComponent).join('/')}`

export default function CarTaxGuidePage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">자동차세</span>
                    <GuideReviewDate slug="car-tax" />
                </div>
                <h1 className="mb-3 text-3xl font-bold leading-tight text-slate-900">
                    자동차세 과세 기준과 연납 완전 정리
                </h1>
                <p className="text-slate-500">
                    자동차세가 어떻게 계산되는지, 언제 내는지, 미리 내면 얼마나 아끼는지를 「지방세법」 조문 기준으로
                    정리했습니다. 6월·9월 연납은 계산식이 1월·3월과 다릅니다.
                </p>
            </div>

            <article className="prose prose-slate max-w-none space-y-8 text-sm leading-7 text-slate-700">
                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">자동차세는 1년에 두 번 낸다</h2>
                    <p>
                        자동차세(소유분)는 연세액을 절반씩 나눠 1년에 두 번 냅니다. 제1기분은 1월부터 6월까지에 해당하고
                        납기는 6월 16일부터 6월 30일까지, 제2기분은 7월부터 12월까지에 해당하고 납기는 12월 16일부터
                        12월 31일까지입니다. (
                        <a href={law('지방세법', '제128조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제128조 제1항
                        </a>
                        )
                    </p>
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm leading-relaxed text-slate-700">
                            💡 <strong>핵심:</strong> 연세액 → 기분세액(÷2) → 차령 경감 → 지방교육세 30% → 연납 공제 순서로
                            계산합니다.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">승용차는 배기량 × cc당 세액</h2>
                    <p>
                        비영업용 승용자동차는 1,000cc 이하 80원, 1,600cc 이하 140원, 1,600cc 초과 200원을 배기량에 곱해
                        연세액을 구합니다. 영업용은 1,600cc 이하 18원, 2,000cc 이하 19원, 2,500cc 이하 19원, 2,500cc 초과
                        24원입니다. (
                        <a href={law('지방세법', '제127조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제127조 제1항 제1호
                        </a>
                        )
                    </p>
                    <p className="mt-2">
                        전기차·수소차처럼 배기량이 없는 승용자동차는 정액으로 과세합니다. 비영업용 10만원, 영업용 2만원
                        입니다. 배기량 기준이 아니므로 <strong>차령 경감을 받지 못합니다</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">차령 경감은 3년부터, 12년에 50%로 멈춘다</h2>
                    <p>
                        차령이 3년 이상인 <strong>비영업용 승용자동차</strong>는 기분세액이 매년 5%씩 줄어듭니다. 계산식은{' '}
                        <span className="font-mono text-xs">A / 2 − (A / 2 × 5 / 100) × (n − 2)</span> 이고 A는 연세액,
                        n은 차령입니다. 차령이 12년을 넘으면 12년으로 보므로 경감률은 50%에서 멈춥니다. (
                        <a href={law('지방세법', '제127조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제127조 제1항 제2호
                        </a>
                        )
                    </p>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[360px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">차령</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">경감률</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">2,000cc 기분세액</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ['2년 이하', '0%', '200,000원'],
                                    ['3년', '5%', '190,000원'],
                                    ['5년', '15%', '170,000원'],
                                    ['9년', '35%', '130,000원'],
                                    ['12년 이상', '50%', '100,000원'],
                                ].map(([age, rate, tax]) => (
                                    <tr key={age} className="bg-white">
                                        <td className="px-3 py-2 text-slate-600">{age}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{rate}</td>
                                        <td className="px-3 py-2 text-right text-slate-600">{tax}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        연세액 400,000원(2,000cc × 200원) 기준. 승합·화물·특수자동차와 전기차는 경감 대상이 아닙니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">지방교육세 30%가 함께 붙는다</h2>
                    <p>
                        비영업용 승용자동차(전기차 포함)에는 자동차세액의 30%가 지방교육세로 추가됩니다. 영업용 승용차와
                        승합·화물·특수자동차에는 붙지 않습니다. 고지서의 &lsquo;합계&rsquo;는 자동차세 본세와 지방교육세를
                        더한 금액입니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">연납은 신청 시기마다 계산식이 다르다</h2>
                    <p>
                        연세액을 한꺼번에 납부하면 공제를 받습니다. 흔히 &lsquo;5% 할인&rsquo;이라고 부르지만 정확히는
                        고정 할인율이 아니라 남은 기간에 대한 이자를 돌려주는 구조입니다. 이자율 5%는{' '}
                        <a href={law('지방세법 시행령', '제125조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 시행령 제125조 제6항
                        </a>
                        에 규정돼 있고, 계산식은{' '}
                        <a href={law('지방세법', '제128조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제128조 제3항
                        </a>
                        의 표에 신청 시기별로 따로 정해져 있습니다.
                    </p>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full min-w-[540px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">신청 기간</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">계산식</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">연세액 대비</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ['1월 16~31일', '연세액 × 334일 / 365일 × 5%', '약 4.58%'],
                                    ['3월 16~31일', '연세액 × 275일 / 365일 × 5%', '약 3.77%'],
                                    ['6월 16~30일', '제2기분 세액 × 5%', '2.50%'],
                                    ['9월 16~30일', '제2기분 세액 × 92일 / 184일 × 5%', '1.25%'],
                                ].map(([period, formula, rate]) => (
                                    <tr key={period} className="bg-white">
                                        <td className="whitespace-nowrap px-3 py-2 text-slate-600">{period}</td>
                                        <td className="px-3 py-2 font-mono text-[11px] text-slate-600">{formula}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-right font-bold text-blue-600">{rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3">
                        1월·3월은 <strong>연세액</strong>에 남은 일수 비율을 곱하지만, 6월·9월은 <strong>제2기분 세액</strong>을
                        기준으로 합니다. 6월에는 제1기분 납기가 함께 오기 때문에 연세액 전액을 내고, 9월에는 제1기분을 이미
                        냈으므로 제2기분만 미리 냅니다. 분모 365일은 윤년에 366일로 바뀌고, 9월의 분모 184일은 제2기분
                        과세기간(7월 1일 ~ 12월 31일)의 일수로 법에 고정돼 있습니다.
                    </p>
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                        <p className="mb-2 font-semibold text-slate-800">예시 · 2,000cc 비영업용 신차 (연세액 40만원)</p>
                        <ul className="space-y-1 text-slate-600">
                            <li>자동차세 400,000원 + 지방교육세 120,000원 = 520,000원</li>
                            <li>1월 연납: 23,790원 공제 → 496,210원</li>
                            <li>6월 연납: 13,000원 공제 → 507,000원 (연세액 전액 납부)</li>
                            <li>9월 연납: 6,500원 공제 → 253,500원 (제2기분만 납부)</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">연세액이 10만원 이하이면</h2>
                    <p>
                        연세액이 10만원 이하인 자동차는 지방자치단체가 제1기분을 부과할 때 전액을 한 번에 부과·징수할 수
                        있습니다. 이 경우에도 제2기분 세액에 이자율을 곱한 금액이 공제됩니다. (
                        <a href={law('지방세법', '제128조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제128조 제4항
                        </a>
                        ) 실제 고지 방식은 지자체마다 다를 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">신규등록·말소등록은 일할계산</h2>
                    <p>
                        연도 중간에 자동차를 새로 등록하거나 말소하면 그 기분의 세액을 일할계산합니다. 신규등록은 등록일부터
                        기분 말일까지, 말소등록은 기분 초일부터 말소등록일까지입니다. 일할계산한 세액이 2천원 미만이면
                        징수하지 않습니다. (
                        <a href={law('지방세법', '제130조')} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                            지방세법 제130조
                        </a>
                        )
                    </p>
                    <p className="mt-2">
                        연납한 뒤 차를 말소하면 남은 기간분을 환급받을 수 있습니다. 환급 신청은 관할 지방자치단체에 합니다.
                    </p>
                </section>

                <section>
                    <h2 className="mb-2 text-lg font-bold text-slate-800">자주 하는 실수</h2>
                    <ul className="list-disc space-y-2 pl-5">
                        <li>
                            <strong>연납을 &lsquo;무조건 5% 할인&rsquo;으로 아는 것:</strong> 5%는 이자율이지 할인율이
                            아닙니다. 실제 공제율은 1월 약 4.58%, 9월 1.25%로 신청 시기에 따라 크게 다릅니다.
                        </li>
                        <li>
                            <strong>전기차도 차령 경감을 받는다고 생각하는 것:</strong> 차령 경감은 배기량으로 과세하는
                            비영업용 승용자동차만 대상입니다.
                        </li>
                        <li>
                            <strong>6월 1일·12월 1일 과세기준일을 놓치는 것:</strong> 기분별 과세기준일 현재 소유자가
                            납세의무자입니다. 매매 시점에 따라 누가 내는지 달라집니다.
                        </li>
                        <li>
                            <strong>연납 후 이사·매도한 경우:</strong> 연납은 이미 낸 것이므로 이후 소재지가 바뀌어도
                            그해 자동차세를 다시 부과하지 않습니다.
                        </li>
                    </ul>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="mb-2 text-base font-bold text-slate-800">계산해 보기</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link href="/car-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            자동차세 계산기 — 배기량·차령·연납까지 반영 →
                        </Link>
                        <Link href="/tax-calendar" className="font-semibold text-blue-700 hover:underline">
                            세금 납부 일정 달력 →
                        </Link>
                        <a href="https://www.wetax.go.kr" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline">
                            위택스에서 실제 고지액 조회·납부 →
                        </a>
                    </div>
                </section>

                <p className="text-xs text-slate-500">
                    이 글은 「지방세법」과 같은 법 시행령 조문을 바탕으로 정리한 참고 자료입니다. 지방자치단체 조례에 따른
                    탄력세율과 「지방세특례제한법」상 감면은 반영하지 않았습니다. 실제 부과액은 위택스 또는 관할
                    지방자치단체에서 확인하세요.
                </p>
            </article>
        </main>
    )
}
