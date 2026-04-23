export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-8">개인정보처리방침</h1>

            <div className="space-y-8 text-sm leading-7 text-slate-600">
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">1. 개인정보 수집에 대한 안내</h2>
                    <p>
                        세금계산기.kr은 기본적으로 사용자가 입력한 계산 정보 자체를 회원 식별 정보로 저장하지 않으며,
                        서비스 개선 및 접속 통계 확인을 위해 최소한의 기술적 정보가 수집될 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">2. 수집 가능한 정보 항목</h2>
                    <p>
                        서비스 이용 과정에서 브라우저 정보, 접속 일시, IP 주소, 기기 정보, 쿠키 정보 등이 자동으로 수집될 수 있습니다.
                        이는 사이트 운영 안정성 확보, 오류 분석, 서비스 품질 개선 목적에 한해 활용됩니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">3. 개인정보 이용 목적</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>서비스 제공 및 유지보수</li>
                        <li>이용 통계 분석</li>
                        <li>오류 확인 및 품질 개선</li>
                        <li>부정 이용 방지 및 보안 대응</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">4. 쿠키 사용 안내</h2>
                    <p>
                        본 사이트는 사용자 경험 개선과 방문 통계 확인을 위해 쿠키를 사용할 수 있습니다.
                        사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">5. 제3자 서비스 이용</h2>
                    <p>
                        본 사이트는 방문 통계 분석, 광고 게재, 사이트 운영 효율화를 위해 제3자 서비스를 사용할 수 있습니다.
                        예를 들어 Google Analytics, Google AdSense 등의 서비스가 적용될 수 있으며,
                        각 서비스의 데이터 처리 방식은 해당 제공업체의 정책을 따릅니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">6. 보유 및 이용 기간</h2>
                    <p>
                        관련 법령에서 별도로 정한 경우를 제외하고, 수집된 정보는 이용 목적 달성 후 지체 없이 파기하거나
                        비식별 통계 데이터 형태로만 보관할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">7. 이용자 권리</h2>
                    <p>
                        이용자는 자신의 개인정보 처리와 관련한 문의를 할 수 있으며, 관련 법령이 정하는 범위 내에서
                        열람, 정정, 삭제 요청 등을 할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">8. 문의</h2>
                    <p>
                        개인정보처리방침 관련 문의는 문의 페이지를 통해 전달할 수 있습니다.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">9. 시행일</h2>
                    <p>본 개인정보처리방침은 2026년 4월 23일부터 적용됩니다.</p>
                </section>
            </div>
        </main>
    );
}