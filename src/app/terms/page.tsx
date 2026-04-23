export default function TermsPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-8">이용안내</h1>

            <div className="space-y-8 text-sm leading-7 text-slate-600">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. 서비스 목적</h2>
                    <p>
                        texsim.kr은 사용자가 세금 관련 금액을 쉽고 빠르게 확인할 수 있도록 돕는 참고용 계산 서비스입니다.
                        본 사이트에서 제공하는 계산 결과는 일반적인 기준을 바탕으로 한 시뮬레이션이며,
                        실제 신고 및 납부 금액과 차이가 발생할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. 계산 결과의 한계</h2>
                    <p>
                        각 계산기는 입력값과 단순화된 기준에 따라 결과를 제공합니다.
                        실제 세금은 공제 항목, 감면 여부, 개인별 상황, 법령 개정, 신고 시점 등에 따라 달라질 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. 법적 책임 제한</h2>
                    <p>
                        본 사이트의 계산 결과와 콘텐츠는 참고 자료이며, 법률적·세무적 자문을 대체하지 않습니다.
                        사용자가 본 사이트 정보를 바탕으로 의사결정을 내린 결과에 대해서 사이트 운영자는 법적 책임을 지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">4. 서비스 변경</h2>
                    <p>
                        운영자는 서비스 품질 향상 및 정책 변경을 위해 계산 로직, 페이지 구성, 제공 콘텐츠를 사전 고지 없이 수정할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">5. 외부 링크 및 참고 정보</h2>
                    <p>
                        본 사이트는 사용자 편의를 위해 외부 사이트 또는 관련 정보를 안내할 수 있습니다.
                        외부 사이트의 정보 정확성, 안정성, 정책에 대해서는 책임을 지지 않습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">6. 문의</h2>
                    <p>
                        서비스 이용과 관련한 문의는 문의 페이지를 통해 전달할 수 있습니다.
                    </p>
                </section>
            </div>
        </main>
    );
}