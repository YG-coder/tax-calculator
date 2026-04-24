'use client';

import Link from 'next/link';
import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

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

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">원천징수 계산기란?</h2>
                    <p>
                        원천징수 계산기는 급여를 지급할 때 미리 공제되는 세금을 대략적으로 확인하기 위한 도구입니다.
                        직장인은 월급명세서를 보기 전에 어느 정도 세금이 빠지는지 궁금할 때가 많고,
                        급여 담당자나 소규모 사업장도 대략적인 공제 규모를 빠르게 확인해야 하는 경우가 많습니다.
                    </p>
                    <p>
                        실제 원천징수는 국세청 간이세액표를 기준으로 계산되지만,
                        본 계산기는 급여 수준에 따라 참고용 예상치를 빠르게 보여주는 목적에 맞춰 구성되었습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">언제 사용하는 계산기인가요?</h2>
                    <p>
                        이 계산기는 월 급여 기준으로 소득세와 지방소득세가 얼마나 공제될지 대략적으로 확인할 때 사용합니다.
                        입사 제안을 받을 때, 월급 조건을 비교할 때, 또는 세전 급여와 실수령액 차이를 빠르게 확인할 때 유용합니다.
                    </p>
                    <p>
                        또한 연봉 계산기나 4대보험 계산기와 함께 보면,
                        월급에서 세금과 보험료가 각각 얼마나 빠지는지 구조를 이해하는 데 도움이 됩니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 페이지는 월 급여를 기준으로 소득세를 단순 추정하고,
                        지방소득세를 소득세의 10%로 계산하여 총 공제액을 보여줍니다.
                        이후 총 공제액을 제외한 예상 실수령액을 함께 표시합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>소득세 = 월 급여 기준 참고용 단순 추정</li>
                        <li>지방소득세 = 소득세 × 10%</li>
                        <li>예상 실수령액 = 월 급여 - 총 공제액</li>
                    </ul>
                    <p>
                        정확한 원천징수 계산은 부양가족 수, 비과세 항목, 간이세액표, 4대보험 반영 여부 등에 따라 달라질 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        실제 급여명세서에는 소득세와 지방소득세 외에도 국민연금, 건강보험, 장기요양보험,
                        고용보험 등이 함께 공제될 수 있습니다. 따라서 본 계산기의 결과는 세금 항목 중심의 단순 추정으로 이해해야 합니다.
                    </p>
                    <p>
                        또한 국세청 간이세액표, 회사 급여 구조, 비과세 수당, 인적공제 조건에 따라 실제 원천징수 금액은 달라질 수 있습니다.
                        따라서 최종 급여명세서와 차이가 날 수 있으며 참고용으로 활용하는 것이 적절합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

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