/** @path src/app/privacy/page.tsx */
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "개인정보처리방침 | 세금계산기",
    description:
        "taxsim.kr의 개인정보처리방침 안내 페이지입니다. 수집 정보, 이용 목적, 보관 기간, 문의 방법을 확인할 수 있습니다.",
};

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-black mb-10 text-center">개인정보처리방침</h1>

            <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-8 text-sm leading-7 text-slate-600">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. 개인정보 수집에 대한 안내</h2>
                    <p>
                        taxsim.kr는 세금 계산 정보를 제공하는 웹사이트입니다.
                        본 사이트는 회원가입 기능을 기본적으로 제공하지 않으며,
                        사용자가 계산 과정에서 입력한 금액 자체를 회원 식별 정보로 저장하지 않습니다.
                    </p>
                    <p>
                        다만 서비스 운영과 안정성 유지, 방문 통계 확인, 오류 분석을 위해
                        최소한의 기술적 정보가 자동으로 수집될 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. 수집 가능한 정보 항목</h2>
                    <p>
                        본 사이트는 서비스 제공 과정에서 다음과 같은 정보가 자동으로 수집될 수 있습니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>브라우저 종류 및 버전</li>
                        <li>운영체제 정보</li>
                        <li>접속 일시</li>
                        <li>IP 주소</li>
                        <li>쿠키 및 접속 로그</li>
                        <li>기기 정보 및 이용 기록</li>
                    </ul>
                    <p>
                        위 정보는 개별 사용자를 직접 식별하기 위한 목적이 아니라
                        서비스 운영 및 품질 개선을 위한 기술적 목적으로만 활용됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. 개인정보 이용 목적</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>서비스 제공 및 운영 안정성 확보</li>
                        <li>사이트 이용 통계 분석</li>
                        <li>오류 확인 및 기능 개선</li>
                        <li>부정 이용 방지 및 보안 대응</li>
                        <li>광고 및 콘텐츠 품질 최적화</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">4. 쿠키 사용 안내</h2>
                    <p>
                        본 사이트는 사용자 경험 개선, 방문 통계 분석, 광고 제공을 위해
                        쿠키를 사용할 수 있습니다. 쿠키는 웹사이트가 사용자의 브라우저에 저장하는
                        작은 텍스트 파일로, 접속 환경과 이용 패턴을 보다 효율적으로 분석하는 데 사용됩니다.
                    </p>
                    <p>
                        사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
                        다만 쿠키 사용을 제한할 경우 일부 기능 이용에 영향을 받을 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">5. 제3자 서비스 이용</h2>
                    <p>
                        본 사이트는 방문 통계 분석, 광고 게재, 서비스 개선을 위해
                        제3자 서비스를 사용할 수 있습니다.
                        예를 들어 Google Analytics, Google AdSense 등의 서비스가 적용될 수 있으며,
                        각 서비스 제공업체는 자체 정책에 따라 데이터를 처리할 수 있습니다.
                    </p>
                    <p>
                        제3자 서비스의 데이터 처리 방식은 각 업체의 개인정보처리방침 및 약관을 따릅니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">6. 개인정보 보유 및 이용 기간</h2>
                    <p>
                        본 사이트는 원칙적으로 개인정보를 직접 수집·보관하지 않으며,
                        자동 수집되는 기술적 정보는 관련 법령이 정한 범위 내에서만 보관될 수 있습니다.
                    </p>
                    <p>
                        수집 목적이 달성되었거나 보관 필요성이 없는 경우에는 지체 없이 파기하거나
                        비식별 통계 데이터 형태로만 보관할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">7. 이용자의 권리</h2>
                    <p>
                        이용자는 자신의 개인정보 처리와 관련하여 문의할 수 있으며,
                        관련 법령이 정하는 범위 내에서 열람, 정정, 삭제 요청 등을 할 수 있습니다.
                    </p>
                    <p>
                        다만 본 사이트가 직접 보유하지 않는 데이터에 대해서는
                        해당 제3자 서비스 제공업체의 정책에 따라 처리될 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">8. 개인정보 보호를 위한 조치</h2>
                    <p>
                        본 사이트는 서비스 안정성과 보안을 위해 합리적인 수준의 기술적·관리적 보호 조치를 적용하기 위해 노력합니다.
                        다만 인터넷 환경의 특성상 완전한 보안을 절대적으로 보장할 수는 없습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">9. 문의 방법</h2>
                    <p>
                        개인정보처리방침 관련 문의는 문의 페이지 또는 아래 이메일을 통해 전달할 수 있습니다.
                    </p>
                    <p className="font-medium text-slate-800 mt-2">
                        support@taxsim.kr
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">10. 시행일</h2>
                    <p>
                        본 개인정보처리방침은 2026년 4월 24일부터 적용됩니다.
                    </p>
                </section>
            </div>
        </main>
    );
}