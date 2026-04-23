'use client';

import { useState } from 'react';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

export default function SeveranceCalculator() {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');

    const monthly = Number(salary.replace(/,/g, '')) || 0;
    const workYears = Number(years) || 0;

    const hasValue = monthly > 0 && workYears > 0;

    // ✔ 실제 기준 공식 (단순화)
    const dailyWage = monthly / 30;
    const severance = Math.floor(dailyWage * 30 * workYears);

    // ✔ 세금 (간이 추정)
    const tax = Math.floor(severance * 0.05);
    const net = severance - tax;

    const handleSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setSalary('');
            return;
        }
        setSalary(Number(raw).toLocaleString('ko-KR'));
    };

    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-8">퇴직금 계산기</h1>

            {/* 입력 */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                    <label className="text-sm font-semibold">월 평균 급여 (원)</label>
                    <input
                        type="text"
                        value={salary}
                        onChange={handleSalary}
                        placeholder="예: 3,000,000"
                        className="w-full mt-2 border rounded-lg p-3 text-xl font-bold"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold">근속 연수 (년)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="예: 5"
                        className="w-full mt-2 border rounded-lg p-3 text-xl font-bold"
                    />
                </div>
            </div>

            {/* 결과 */}
            {hasValue ? (
                <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-2">예상 퇴직금</p>

                    <div className="space-y-2 text-lg">
                        <div className="flex justify-between">
                            <span>총 퇴직금</span>
                            <span>{format(severance)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>퇴직소득세</span>
                            <span>{format(tax)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
                            <span>예상 실수령액</span>
                            <span>{format(net)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    급여와 근속연수를 입력하면 계산됩니다
                </div>
            )}

            {/* SEO */}
            <section className="mt-12 space-y-8">

                <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">퇴직금 계산기란?</h2>
                    <p>
                        퇴직금 계산기는 근속 기간과 평균 임금을 기준으로 예상 퇴직금을 확인하는 도구입니다.
                        퇴사 또는 이직을 준비하는 직장인이 예상 수령 금액을 미리 파악하는 데 유용합니다.
                    </p>
                    <p>
                        일반적으로 퇴직금은 1년 근속 시 평균임금 30일분을 기준으로 계산되며,
                        본 계산기는 이를 단순화하여 빠르게 결과를 확인할 수 있도록 구성되었습니다.
                    </p>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">사용 방법</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>월 평균 급여를 입력합니다.</li>
                        <li>근속 연수를 입력합니다.</li>
                        <li>예상 퇴직금과 실수령액을 확인합니다.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">Q. 퇴직금 계산 기준은 무엇인가요?</p>
                            <p>A. 1년 근속당 평균임금 30일분 기준입니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 실제 금액과 차이가 나는 이유는?</p>
                            <p>A. 평균임금 산정 방식, 수당, 근무일수 등에 따라 달라집니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 세금은 정확한가요?</p>
                            <p>A. 본 계산기는 참고용이며 실제 퇴직소득세와 차이가 있습니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 중간정산하면 어떻게 되나요?</p>
                            <p>A. 중간정산 이력에 따라 실제 퇴직금이 달라질 수 있습니다.</p>
                        </div>
                    </div>
                </div>

            </section>
        </main>
    );
}