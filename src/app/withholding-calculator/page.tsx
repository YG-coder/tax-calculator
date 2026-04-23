'use client';

import { useState } from 'react';

function formatNumber(value: number) {
    return value.toLocaleString('ko-KR');
}

export default function WithholdingCalculatorPage() {
    const [salary, setSalary] = useState('');

    const monthlySalary = Number(salary.replace(/,/g, '')) || 0;
    const hasValue = monthlySalary > 0;

    // 참고용 단순 추정
    const incomeTax = Math.floor(monthlySalary * 0.03);
    const localIncomeTax = Math.floor(incomeTax * 0.1);
    const totalWithholding = incomeTax + localIncomeTax;
    const netPay = monthlySalary - totalWithholding;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setSalary('');
            return;
        }
        setSalary(Number(raw).toLocaleString('ko-KR'));
    };

    return (
        <main className="container mx-auto max-w-4xl px-4 py-12">
            <h1 className="mb-8 text-3xl font-black">원천징수 계산기</h1>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <label className="text-sm font-semibold text-slate-700">
                    월 급여 입력 (원)
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={salary}
                    onChange={handleChange}
                    placeholder="예: 3,000,000"
                    className="mt-2 w-full rounded-lg border p-3 text-xl font-bold outline-none focus:ring-2 focus:ring-slate-900"
                />
                <p className="mt-2 text-xs text-slate-400">
                    본 계산기는 참고용 단순 추정치이며 실제 간이세액표 적용 결과와 다를 수 있습니다.
                </p>
            </div>

            {hasValue ? (
                <>
                    <div className="mt-8 rounded-2xl bg-slate-900 p-8 text-white">
                        <p className="mb-2 text-sm text-slate-400">예상 원천징수 결과</p>

                        <div className="space-y-3 text-lg">
                            <div className="flex justify-between">
                                <span>소득세</span>
                                <span>{formatNumber(incomeTax)} 원</span>
                            </div>

                            <div className="flex justify-between">
                                <span>지방소득세</span>
                                <span>{formatNumber(localIncomeTax)} 원</span>
                            </div>

                            <div className="mt-3 flex justify-between border-t pt-3 text-xl font-bold">
                                <span>총 공제액</span>
                                <span>{formatNumber(totalWithholding)} 원</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border bg-white p-6">
                        <div className="flex justify-between text-lg font-bold">
                            <span>예상 실수령액</span>
                            <span>{formatNumber(netPay)} 원</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed text-slate-400">
                    월 급여를 입력하면 예상 공제액과 실수령액이 표시됩니다
                </div>
            )}

            <section className="mt-12 space-y-8">
                <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800">원천징수 계산기란?</h2>
                    <p>
                        원천징수 계산기는 급여 지급 시 미리 공제되는 세금을 대략적으로 확인하기 위한 도구입니다.
                        직장인이나 급여 담당자가 월급에서 어느 정도 세금이 빠질지 참고할 때 유용합니다.
                    </p>
                    <p>
                        실제 원천징수는 국세청 간이세액표, 부양가족 수, 비과세 항목, 급여 구조, 4대보험 반영 여부 등에 따라 달라집니다.
                        따라서 본 페이지는 간단한 참고용 추정 계산기로 활용하고, 실제 급여명세서와는 차이가 있을 수 있습니다.
                    </p>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="mb-2 text-lg font-bold text-slate-800">사용 방법</h2>
                    <ul className="list-disc space-y-1 pl-5">
                        <li>월 급여 금액을 입력합니다.</li>
                        <li>예상 소득세와 지방소득세를 확인합니다.</li>
                        <li>공제 후 예상 실수령액을 참고합니다.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="mb-3 text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">Q. 원천징수는 왜 미리 떼나요?</p>
                            <p>
                                A. 세금을 한 번에 납부하는 부담을 줄이기 위해 급여 지급 시 일정 금액을 미리 공제합니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 실제 급여명세서와 왜 다른가요?</p>
                            <p>
                                A. 실제 계산에는 간이세액표, 비과세 항목, 부양가족 수, 4대보험 등이 반영되기 때문입니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 프리랜서 3.3%와 같은 계산인가요?</p>
                            <p>
                                A. 아닙니다. 본 페이지는 일반적인 급여 기준 참고용이며, 프리랜서 원천징수와는 계산 구조가 다릅니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 지방소득세는 왜 같이 붙나요?</p>
                            <p>
                                A. 일반적으로 지방소득세는 소득세의 10% 수준으로 함께 계산됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}