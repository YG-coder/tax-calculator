'use client';

import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

// ✔ 누진세 계산 함수
function calculateTax(income: number) {
    let tax = 0;

    if (income <= 12000000) tax = income * 0.06;
    else if (income <= 46000000)
        tax = 720000 + (income - 12000000) * 0.15;
    else if (income <= 88000000)
        tax = 5820000 + (income - 46000000) * 0.24;
    else if (income <= 150000000)
        tax = 15900000 + (income - 88000000) * 0.35;
    else if (income <= 300000000)
        tax = 37000000 + (income - 150000000) * 0.38;
    else if (income <= 500000000)
        tax = 94000000 + (income - 300000000) * 0.40;
    else if (income <= 1000000000)
        tax = 174000000 + (income - 500000000) * 0.42;
    else
        tax = 384000000 + (income - 1000000000) * 0.45;

    return Math.floor(tax);
}

export default function IncomeTaxCalculator() {
    const [income, setIncome] = useState('');

    const parsed = Number(income.replace(/,/g, '')) || 0;
    const hasValue = parsed > 0;

    const tax = calculateTax(parsed);
    const localTax = Math.floor(tax * 0.1);
    const totalTax = tax + localTax;
    const net = parsed - totalTax;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setIncome('');
            return;
        }
        setIncome(Number(raw).toLocaleString('ko-KR'));
    };

    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">

            <h1 className="text-3xl font-black mb-8">종합소득세 계산기</h1>

            {/* 입력 */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <label className="text-sm font-semibold text-slate-700">
                    연 소득 입력 (원)
                </label>

                <input
                    type="text"
                    value={income}
                    onChange={handleChange}
                    placeholder="예: 50,000,000"
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold"
                />

                <p className="mt-2 text-xs text-slate-400">
                    본 계산기는 공제 없이 단순 세율 기준으로 계산된 참고용 결과입니다.
                </p>
            </div>

            {/* 결과 */}
            {hasValue ? (
                <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl">

                    <p className="text-slate-400 text-sm mb-2">예상 세금</p>

                    <div className="space-y-3 text-lg">
                        <div className="flex justify-between">
                            <span>소득세</span>
                            <span>{format(tax)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>지방소득세</span>
                            <span>{format(localTax)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl border-t pt-3 mt-3">
                            <span>총 세금</span>
                            <span>{format(totalTax)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl mt-3 text-green-400">
                            <span>세후 소득</span>
                            <span>{format(net)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    소득을 입력하면 계산됩니다
                </div>
            )}

            {/* 🔥 SEO */}
            <section className="mt-12 space-y-8">

                <div className="text-sm text-slate-600 leading-relaxed space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">종합소득세 계산기란?</h2>
                    <p>
                        종합소득세 계산기는 연간 소득을 기준으로 예상 세금을 계산하는 도구입니다.
                        프리랜서, 자영업자, 투자자 등 다양한 소득을 가진 개인이 자신의 세금 부담을
                        미리 확인하는 데 활용할 수 있습니다.
                    </p>
                    <p>
                        대한민국 종합소득세는 누진세 구조를 가지고 있어 소득이 증가할수록
                        세율이 높아집니다. 본 계산기는 주요 세율 구간을 기준으로
                        단순화하여 빠르게 결과를 확인할 수 있도록 구성되었습니다.
                    </p>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">사용 방법</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>연간 총 소득을 입력합니다.</li>
                        <li>예상 소득세와 지방소득세를 확인합니다.</li>
                        <li>세후 소득을 참고합니다.</li>
                    </ul>
                </div>

                <div className="text-sm text-slate-600">
                    <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

                    <div className="space-y-4">

                        <div>
                            <p className="font-semibold">Q. 종합소득세는 누구에게 적용되나요?</p>
                            <p>A. 사업소득, 프리랜서 소득, 금융소득 등이 있는 개인에게 적용됩니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 왜 실제 세금과 다를 수 있나요?</p>
                            <p>A. 공제, 감면, 비용 처리 등이 반영되지 않았기 때문입니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 지방소득세는 무엇인가요?</p>
                            <p>A. 소득세의 10%가 추가로 부과되는 세금입니다.</p>
                        </div>

                        <div>
                            <p className="font-semibold">Q. 정확한 세금 계산은 어떻게 하나요?</p>
                            <p>A. 국세청 홈택스 신고 기준을 따라야 합니다.</p>
                        </div>

                    </div>
                </div>

            </section>

            <RelatedCalculators />
        </main>
    );
}