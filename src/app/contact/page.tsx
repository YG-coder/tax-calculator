export default function ContactPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-black mb-8">문의</h1>

            <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
                <p className="text-sm leading-7 text-slate-600">
                    세금계산기.kr 이용 중 오류가 발생했거나, 계산기 개선 제안, 광고 및 제휴 문의가 있다면 아래 안내를 참고해 주세요.
                </p>

                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">문의 안내</h2>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                        <li>계산 오류 제보</li>
                        <li>기능 개선 요청</li>
                        <li>광고 및 제휴 문의</li>
                        <li>기타 운영 관련 문의</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">이메일 문의</h2>
                    <p className="text-sm text-slate-600">
                        support@세금계산기.kr
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        실제 운영 이메일 주소가 준비되면 해당 주소로 변경하세요.
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 leading-6">
                    문의 시 사용한 계산기 이름, 입력값, 예상한 결과와 실제 표시된 결과를 함께 적어주시면 확인이 더 빠릅니다.
                </div>
            </div>
        </main>
    );
}