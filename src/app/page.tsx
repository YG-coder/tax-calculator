import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CALCULATORS } from '@/lib/calculators';

export default function HomePage() {
    const enabledCalculators = CALCULATORS.filter((item) => item.enabled);

    return (
        <main className="container mx-auto py-24 px-4 max-w-5xl">
            {/* 헤드라인 */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-6 leading-tight">
                    내 세금, <br />
                    <span className="text-blue-600">데이터</span>로 명확하게.
                </h1>

                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    복잡한 세금 계산을 쉽고 빠르게 확인할 수 있도록
                    부가세, 종합소득세, 원천징수, 퇴직금, 프리랜서 3.3%, 4대보험 계산기를 제공합니다.
                </p>
            </div>

            {/* 계산기 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enabledCalculators.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="group border rounded-2xl p-6 hover:shadow-lg transition bg-white"
                    >
                        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                        <p className="text-slate-500 text-sm mb-4">
                            {item.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold">
                            계산하기
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* SEO 본문 */}
            <section className="mt-16 space-y-10 text-sm text-slate-600 leading-7">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">세금계산기 사이트란?</h2>
                    <p>
                        taxsim.kr는 일상에서 자주 필요한 세금 계산을 쉽고 빠르게 확인할 수 있도록 만든
                        온라인 세금 계산기 사이트입니다. 부가세 계산, 종합소득세 계산, 원천징수 계산,
                        퇴직금 계산, 프리랜서 3.3% 계산, 4대보험 계산 등 실제 생활에서 자주 쓰이는
                        계산 기능을 중심으로 구성되어 있습니다.
                    </p>
                    <p>
                        세금은 단순히 숫자만 보는 것이 아니라, 실제로 얼마가 빠지고 얼마가 남는지,
                        그리고 어떤 기준으로 계산되는지를 이해하는 것이 중요합니다.
                        본 사이트는 복잡한 계산식을 몰라도 입력값만 넣으면 바로 결과를 확인할 수 있도록 설계되었습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">어떤 계산기를 제공하나요?</h2>
                    <p>
                        현재 taxsim.kr에서는 부가세 계산기, 종합소득세 계산기, 원천징수 계산기,
                        퇴직금 계산기, 프리랜서 3.3% 계산기, 4대보험 계산기를 제공하고 있습니다.
                        각 계산기는 실제로 자주 찾는 검색 의도를 반영해 구성했으며,
                        사용자가 원하는 계산 결과를 가능한 한 빠르게 확인할 수 있도록 만들었습니다.
                    </p>
                    <p>
                        예를 들어 사업자는 부가세 포함 금액과 공급가액을 빠르게 구할 수 있고,
                        프리랜서는 3.3% 원천징수 후 실수령액을 바로 확인할 수 있습니다.
                        직장인은 원천징수와 4대보험, 퇴직금을 함께 참고해 급여 구조를 더 쉽게 이해할 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">이 사이트는 어떻게 활용하면 좋나요?</h2>
                    <p>
                        이 사이트는 단순히 숫자만 보여주는 계산기가 아니라,
                        세금 관련 금액을 빠르게 검토하고 의사결정에 참고할 수 있는 도구로 활용할 수 있습니다.
                        거래 금액을 검토할 때는 부가세 계산기를,
                        연간 세금 부담을 확인할 때는 종합소득세 계산기를,
                        급여 구조를 확인할 때는 원천징수 계산기와 4대보험 계산기를 함께 사용할 수 있습니다.
                    </p>
                    <p>
                        또한 계산기 페이지마다 설명 본문과 자주 묻는 질문을 함께 제공하여
                        단순 계산을 넘어 개념 이해와 실무적인 참고까지 가능하도록 구성했습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">이용 시 참고사항</h2>
                    <p>
                        본 사이트의 모든 계산 결과는 참고용으로 제공됩니다.
                        실제 세금은 개인별 상황, 공제 항목, 법령 개정, 신고 시점, 회사 정책 등에 따라 달라질 수 있습니다.
                        따라서 최종 세금 신고나 중요한 의사결정 전에는 국세청 홈택스, 공식 자료,
                        또는 세무 전문가의 안내를 함께 확인하는 것이 좋습니다.
                    </p>
                    <p>
                        taxsim.kr는 앞으로도 사용자에게 실질적으로 도움이 되는 계산기와 설명 콘텐츠를
                        계속 확장해 나갈 예정입니다.
                    </p>
                </div>
            </section>
        </main>
    );
}