'use client';

import Link from 'next/link';
import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

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
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
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

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">종합소득세 계산기란?</h2>
                    <p>
                        종합소득세 계산기는 1년 동안 발생한 소득을 기준으로 예상 세금을 계산하는 도구입니다.
                        프리랜서, 개인사업자, 부업 소득이 있는 직장인처럼 다양한 소득원이 있는 사람은
                        종합소득세 신고 전에 예상 세금 규모를 미리 확인해두는 것이 중요합니다.
                    </p>
                    <p>
                        대한민국 종합소득세는 누진세 구조를 가지고 있기 때문에 소득이 높아질수록 더 높은 세율이 적용됩니다.
                        그래서 단순히 일정 비율만 곱해서 계산하는 것이 아니라,
                        소득 구간에 따라 나누어 계산해야 보다 현실적인 예상이 가능합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">언제 사용하는 계산기인가요?</h2>
                    <p>
                        이 계산기는 종합소득세 신고 시즌 전에 예상 세금을 확인하거나,
                        프리랜서·사업자·부업 소득자의 연간 세금 부담을 가늠할 때 유용합니다.
                        또한 예상 세후 소득을 확인해 자금 계획을 세우는 데도 도움이 됩니다.
                    </p>
                    <p>
                        특히 3.3% 원천징수를 당하는 프리랜서라면 연말 또는 다음 해 신고 시
                        실제로 추가 납부가 필요한지, 환급 가능성이 있는지 대략적으로 감을 잡는 용도로 활용할 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 계산기는 입력한 연 소득을 기준으로 종합소득세 누진세율을 적용해 소득세를 계산합니다.
                        이후 지방소득세 10%를 추가해 총 세금을 추정하고, 세후 소득도 함께 표시합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>소득세 = 과세표준 구간별 누진세율 적용</li>
                        <li>지방소득세 = 소득세 × 10%</li>
                        <li>세후 소득 = 연 소득 - 총 세금</li>
                    </ul>
                    <p>
                        다만 본 계산기는 공제, 필요경비, 세액공제, 감면 항목을 반영하지 않는 단순 계산기이므로
                        참고용으로 활용하는 것이 적절합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        실제 종합소득세는 필요경비, 인적공제, 카드공제, 보험료공제, 세액감면,
                        신고 방식 등에 따라 크게 달라질 수 있습니다.
                        특히 프리랜서나 개인사업자는 경비 처리 여부에 따라 최종 세액 차이가 커집니다.
                    </p>
                    <p>
                        따라서 본 계산기는 대략적인 세금 규모를 파악하는 참고용 도구로 활용해야 하며,
                        실제 신고는 홈택스 계산 결과 또는 세무 전문가의 안내를 따르는 것이 좋습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

                    <div>
                        <p className="font-semibold">Q. 종합소득세는 누구에게 적용되나요?</p>
                        <p>
                            A. 사업소득, 프리랜서 소득, 기타소득, 금융소득 등 여러 소득이 있는 개인에게 적용됩니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 실제 세금과 왜 차이가 나나요?</p>
                        <p>
                            A. 공제, 감면, 필요경비, 신고 방식 등이 반영되지 않았기 때문입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 지방소득세는 무엇인가요?</p>
                        <p>
                            A. 소득세의 10%가 추가로 붙는 지방세 개념으로 함께 부담하는 경우가 일반적입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 3.3% 원천징수를 했으면 신고 안 해도 되나요?</p>
                        <p>
                            A. 아닙니다. 3.3%는 선납 개념이기 때문에 종합소득세 신고를 통해 최종 정산해야 합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* 연봉계산기 연동 CTA */}
            <section className="mt-12 rounded-2xl border bg-green-50 p-6">
                <h2 className="text-xl font-bold mb-2 text-slate-900">
                    연봉 실수령액도 확인해보세요
                </h2>

                <p className="text-slate-600 mb-4">
                    세금 계산과 함께 연봉 기준 월 실수령액, 4대보험 공제 후 금액도 확인할 수 있습니다.
                </p>

                <Link
                    href="https://연봉계산기.kr"
                    className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    연봉 계산기 바로가기 →
                </Link>
            </section>

            <RelatedCalculators />
        </main>
    );
}