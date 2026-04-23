/** @path src/app/about/page.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "사이트 소개 | 세금계산기",
    description:
        "taxsim.kr는 세금 계산을 쉽게 돕기 위한 온라인 계산기 서비스입니다. 운영 목적과 제공 기능을 확인하세요.",
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-black mb-10 text-center">사이트 소개</h1>

            <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-8 text-sm leading-7 text-slate-600">

                {/* 소개 */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">taxsim.kr 소개</h2>
                    <p>
                        taxsim.kr는 복잡한 세금 계산을 쉽고 빠르게 확인할 수 있도록 돕기 위해 만들어진
                        온라인 계산기 서비스입니다. 일반 사용자부터 프리랜서, 직장인, 개인사업자까지
                        누구나 간편하게 세금 관련 금액을 확인할 수 있도록 다양한 계산 기능을 제공합니다.
                    </p>
                    <p>
                        부가세, 종합소득세, 원천징수, 퇴직금, 프리랜서 3.3%, 4대보험 등
                        실제 생활에서 자주 사용되는 세금 계산을 중심으로 구성되어 있으며,
                        복잡한 공식 없이 직관적으로 결과를 확인할 수 있도록 설계되었습니다.
                    </p>
                </section>

                {/* 목적 */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">운영 목적</h2>
                    <p>
                        세금은 많은 사람들이 어려워하는 영역 중 하나입니다.
                        taxsim.kr는 이러한 복잡한 세금 계산을 단순화하여
                        누구나 쉽게 이해하고 활용할 수 있도록 돕는 것을 목표로 합니다.
                    </p>
                    <p>
                        단순히 숫자를 계산하는 것을 넘어,
                        사용자가 실제 상황에서 활용할 수 있는 기준 정보를 제공하는 것이
                        본 사이트의 핵심 목적입니다.
                    </p>
                </section>

                {/* 제공 기능 */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">제공 기능</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>부가세 계산기</li>
                        <li>종합소득세 계산기</li>
                        <li>원천징수 계산기</li>
                        <li>퇴직금 계산기</li>
                        <li>프리랜서 3.3% 계산기</li>
                        <li>4대보험 계산기</li>
                    </ul>
                    <p className="mt-2">
                        모든 계산기는 입력값 기반으로 즉시 결과를 확인할 수 있으며,
                        별도의 회원가입 없이 자유롭게 이용할 수 있습니다.
                    </p>
                </section>

                {/* 이용 안내 */}
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">이용 안내</h2>
                    <p>
                        본 사이트의 계산 결과는 일반적인 기준을 바탕으로 제공되는 참고용 정보입니다.
                        실제 세금은 개인의 상황, 공제 항목, 법령 변경 등에 따라 달라질 수 있습니다.
                    </p>
                    <p>
                        따라서 중요한 의사결정이나 세금 신고 시에는
                        국세청 자료 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
                    </p>
                </section>

                {/* 신뢰 문구 (중요) */}
                <section className="border-t pt-4 text-xs text-slate-400 leading-relaxed">
                    본 사이트는 세금 계산 정보를 제공하는 참고용 서비스이며,
                    법적 책임을 지지 않습니다.<br />
                    정확한 세금은 국세청 또는 세무 전문가를 통해 확인하시기 바랍니다.
                </section>

            </div>
        </main>
    );
}