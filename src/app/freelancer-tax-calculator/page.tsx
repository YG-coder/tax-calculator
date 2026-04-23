'use client';

import { useState } from 'react';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

export default function FreelancerTaxCalculator() {
    const [amount, setAmount] = useState('');

    const parsed = Number(amount.replace(/,/g, '')) || 0;

    const tax = Math.floor(parsed * 0.033);
    const net = parsed - tax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setAmount('');
            return;
        }
        setAmount(Number(raw).toLocaleString('ko-KR'));
    };

    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">

            <h1 className="text-3xl font-black mb-8">프리랜서 3.3% 계산기</h1>

            {/* 입력 */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <label className="text-sm font-semibold text-slate-700">
                    수입 금액 (원)
                </label>

                <input
                    type="text"
                    value={amount}
                    onChange={handleChange}
                    placeholder="예: 1,000,000"
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold"
                />

                <p className="mt-2 text-xs text-slate-400">
                    프리랜서 원천징수 3.3% 기준으로 계산됩니다.
                </p>
            </div>

            {/* 결과 */}
            {parsed > 0 ? (
                <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl">

                    <p className="text-slate-400 text-sm mb-2">계산 결과</p>

                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span>원천징수 세금 (3.3%)</span>
                            <span>{format(tax)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3 text-green-400">
                            <span>실수령액</span>
                            <span>{format(net)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    금액을 입력하면 계산됩니다
                </div>
            )}

            {/* SEO */}
            <section className="mt-12 space-y-8">

                <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">프리랜서 3.3%란?</h2>
                    <p>
                        프리랜서 소득에 대해 원천징수되는 세율은 일반적으로 3.3%입니다.
                        이는 소득세 3%와 지방소득세 0.3%가 포함된 금액입니다.
                    </p>
                    <p>
                        본 계산기는 입력한 수입 금액 기준으로 원천징수 세금과 실수령액을 빠르게 확인할 수 있도록 구성되었습니다.
                    </p>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">사용 방법</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>수입 금액을 입력합니다.</li>
                        <li>자동으로 3.3% 세금이 계산됩니다.</li>
                        <li>실수령액을 확인합니다.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">Q. 3.3%는 어떤 세금인가요?</p>
                            <p>A. 소득세 3% + 지방소득세 0.3%입니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 실제 세금과 차이가 있나요?</p>
                            <p>A. 연말정산 또는 종합소득세 신고 시 차이가 발생할 수 있습니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 모든 프리랜서가 3.3%인가요?</p>
                            <p>A. 일반적인 원천징수 기준이며 상황에 따라 달라질 수 있습니다.</p>
                        </div>
                    </div>
                </div>

            </section>

        </main>
    );
}