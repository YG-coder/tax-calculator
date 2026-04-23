/** @path src/app/terms/page.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "이용안내 | 세금계산기",
    description:
        "taxsim.kr의 이용안내 페이지입니다. 서비스 목적, 계산 결과의 한계, 책임 제한, 외부 링크 안내 등을 확인할 수 있습니다.",
};

export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-black mb-10 text-center">이용안내</h1>

            <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-8 text-sm leading-7 text-slate-600">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. 서비스 목적</h2>
                    <p>
                        taxsim.kr는 사용자가 세금 관련 금액을 쉽고 빠르게 확인할 수 있도록 돕는
                        참고용 계산 서비스입니다. 본 사이트는 부가세, 종합소득세, 원천징수, 퇴직금,
                        프리랜서 3.3%, 4대보험 등 다양한 계산 기능을 제공하며,
                        사용자의 이해를 돕기 위한 설명 콘텐츠를 함께 제공합니다.
                    </p>
                    <p>
                        본 사이트의 계산 결과는 일반적인 기준에 따라 단순화된 계산값으로 제공되며,
                        실제 신고·납부·정산 금액과 차이가 발생할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. 계산 결과의 한계</h2>
                    <p>
                        각 계산기는 사용자가 입력한 값과 일반적인 세율 또는 공제 구조를 기준으로 결과를 제공합니다.
                        그러나 실제 세금은 공제 항목, 감면 여부, 필요경비, 비과세 항목, 개인별 상황,
                        법령 개정, 신고 시점 등에 따라 달라질 수 있습니다.
                    </p>
                    <p>
                        따라서 본 사이트의 계산 결과는 참고용으로 활용해야 하며,
                        실제 세금 신고나 정산 시에는 국세청 홈택스, 회사 급여명세서,
                        또는 세무 전문가 안내를 통해 다시 확인하는 것이 필요합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. 법적 책임 제한</h2>
                    <p>
                        본 사이트의 계산 결과와 콘텐츠는 정보 제공 목적의 참고 자료이며,
                        법률적·세무적 자문을 대체하지 않습니다.
                    </p>
                    <p>
                        사용자가 본 사이트의 계산 결과나 설명을 바탕으로 의사결정을 내린 결과에 대해
                        사이트 운영자는 법적 책임을 지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">4. 서비스 변경 및 중단</h2>
                    <p>
                        운영자는 서비스 품질 향상, 정책 변경, 시스템 점검 등을 위해
                        계산 로직, 페이지 구성, 제공 콘텐츠를 사전 고지 없이 수정하거나
                        일부 기능을 중단할 수 있습니다.
                    </p>
                    <p>
                        다만 사용자의 혼란을 줄이기 위해 가능한 범위 내에서 안정적인 서비스를 제공하도록 노력합니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">5. 외부 링크 및 참고 정보</h2>
                    <p>
                        본 사이트는 사용자 편의를 위해 외부 사이트, 공공기관 페이지, 참고 자료 등을 안내할 수 있습니다.
                        외부 링크는 정보 제공 목적이며, 해당 사이트의 정보 정확성, 안정성, 운영 정책에 대해서는
                        본 사이트가 책임지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">6. 광고 및 제휴 안내</h2>
                    <p>
                        본 사이트는 광고 또는 제휴 링크를 포함할 수 있으며,
                        일부 콘텐츠는 광고 수익 또는 제휴 수익과 연결될 수 있습니다.
                        다만 사이트 이용자에게 도움이 되는 정보 제공을 우선으로 하며,
                        계산 결과 자체는 광고 여부와 관계없이 동일한 기준으로 제공됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">7. 문의</h2>
                    <p>
                        서비스 이용 중 계산 오류, 개선 요청, 제휴 문의 등은 문의 페이지를 통해 전달할 수 있습니다.
                    </p>
                    <p className="font-medium text-slate-800 mt-2">
                        support@taxsim.kr
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">8. 이용자 유의사항</h2>
                    <p>
                        본 사이트의 콘텐츠와 계산 결과는 참고용 자료이므로,
                        실제 세금 신고, 계약, 급여 협의, 세무 판단 등 중요한 의사결정에는
                        반드시 공식 자료와 전문가 검토를 함께 활용하는 것이 좋습니다.
                    </p>
                </section>
            </div>
        </main>
    );
}