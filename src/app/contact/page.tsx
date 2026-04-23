/** @path src/app/contact/page.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "문의 | 세금계산기",
    description:
        "세금계산기 이용 중 오류, 계산 문의, 광고 및 제휴 문의는 이 페이지를 통해 연락해주세요.",
};

export default function ContactPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-3xl">
            <h1 className="text-3xl font-black mb-10 text-center">문의</h1>

            <div className="bg-white border rounded-2xl p-8 space-y-8 shadow-sm">

                {/* 소개 */}
                <p className="text-slate-600 leading-relaxed text-sm">
                    taxsim.kr는 세금 계산 정보를 제공하는 사이트이며,
                    이용 중 오류, 계산 관련 문의, 제휴 및 광고 문의가 있을 경우
                    아래 안내를 참고하여 연락 주시면 확인 후 답변드립니다.
                </p>

                {/* 문의 유형 */}
                <div>
                    <h2 className="font-bold text-lg mb-3">문의 안내</h2>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                        <li>계산 결과 오류 제보</li>
                        <li>기능 개선 요청</li>
                        <li>광고 및 제휴 문의</li>
                        <li>기타 사이트 이용 관련 문의</li>
                    </ul>
                </div>

                {/* 이메일 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">이메일 문의</h2>
                    <p className="text-slate-800 font-medium">
                        support@taxsim.kr
                    </p>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        영업일 기준 1~2일 이내에 답변드립니다.<br />
                        계산 오류 문의 시 입력값과 예상 결과, 실제 표시 결과를 함께 보내주시면
                        더 빠르게 확인 가능합니다.
                    </p>
                </div>

                {/* 안내 */}
                <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
                    문의 시 사용한 계산기 이름, 입력값, 예상 결과와 실제 표시된 결과를 함께
                    전달해주시면 보다 정확하고 빠른 답변이 가능합니다.
                </div>

                {/* 중요: 애드센스 신뢰 문구 */}
                <div className="text-xs text-slate-400 leading-relaxed border-t pt-4">
                    본 사이트는 세금 계산 정보를 제공하는 참고용 서비스이며,
                    법적 책임을 지지 않습니다.<br />
                    정확한 세금은 국세청 또는 세무 전문가를 통해 확인하시기 바랍니다.
                </div>

            </div>
        </main>
    );
}