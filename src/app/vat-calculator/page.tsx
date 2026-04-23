'use client';

import { useState } from 'react';

function formatNumber(value: number) {
    return value.toLocaleString('ko-KR');
}

export default function VatCalculatorPage() {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'inclusive' | 'exclusive'>('inclusive');

    const parsed = Number(amount.replace(/,/g, '')) || 0;

    const hasValue = parsed > 0;

    const supply = mode === 'inclusive'
        ? Math.floor(parsed / 1.1)
        : parsed;

    const vat = mode === 'inclusive'
        ? parsed - supply
        : Math.floor(parsed * 0.1);

    const total = mode === 'inclusive'
        ? parsed
        : supply + vat;

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

            <h1 className="text-3xl font-black mb-8">부가세 계산기</h1>

            {/* 입력 영역 */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">

                <div className="flex gap-4">
                    <button
                        onClick={() => setMode('inclusive')}
                        className={`px-4 py-2 rounded-lg border ${
                            mode === 'inclusive'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white'
                        }`}
                    >
                        부가세 포함
                    </button>

                    <button
                        onClick={() => setMode('exclusive')}
                        className={`px-4 py-2 rounded-lg border ${
                            mode === 'exclusive'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white'
                        }`}
                    >
                        부가세 별도
                    </button>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-700">
                        금액 입력 (원)
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={amount}
                        onChange={handleChange}
                        placeholder="예: 1,100,000"
                        className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                </div>
            </div>

            {/* 결과 영역 */}
            {hasValue ? (
                <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-2">계산 결과</p>

                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span>공급가액</span>
                            <span>{formatNumber(supply)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>부가세</span>
                            <span>{formatNumber(vat)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
                            <span>총 금액</span>
                            <span>{formatNumber(total)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    금액을 입력하면 자동 계산됩니다
                </div>
            )}

            {/* 🔥 SEO 영역 */}
            <section className="mt-12 space-y-8">

                <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">
                        부가세 계산기란?
                    </h2>
                    <p>
                        부가세 계산기는 공급가액과 부가가치세를 쉽고 빠르게 계산하기 위한 도구입니다.
                        사업자 거래에서는 부가세 포함 금액과 부가세 별도 금액이 혼용되기 때문에,
                        실제 공급가액과 세액을 정확히 분리해서 확인하는 것이 중요합니다.
                    </p>
                    <p>
                        본 계산기는 부가세 포함 금액을 입력하면 공급가액과 부가세를 자동으로 나누어 보여주고,
                        반대로 공급가액 기준 입력 시 총 금액까지 계산할 수 있도록 설계되었습니다.
                        세금계산서 발행 전 금액 검토, 견적 작성, 거래 금액 확인 등 다양한 상황에서 활용할 수 있습니다.
                    </p>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">
                        사용 방법
                    </h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>금액을 입력합니다.</li>
                        <li>부가세 포함 또는 별도를 선택합니다.</li>
                        <li>공급가액과 부가세, 총 금액을 확인합니다.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">
                        자주 묻는 질문 (FAQ)
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <p className="font-semibold">
                                Q. 부가세는 몇 퍼센트인가요?
                            </p>
                            <p>
                                A. 대한민국 부가가치세는 일반적으로 10%입니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Q. 공급가액이란 무엇인가요?
                            </p>
                            <p>
                                A. 부가세를 제외한 실제 거래 금액입니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Q. 간이과세자도 동일하게 계산되나요?
                            </p>
                            <p>
                                A. 본 계산기는 일반과세자 기준이며 참고용입니다.
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Q. 계산 결과는 정확한 세금인가요?
                            </p>
                            <p>
                                A. 참고용이며 실제 신고 금액과 차이가 있을 수 있습니다.
                            </p>
                        </div>

                    </div>
                </div>

            </section>

        </main>
    );
}