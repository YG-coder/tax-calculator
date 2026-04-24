'use client';

import Link from 'next/link';
import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

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
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
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

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">프리랜서 3.3% 세금이란?</h2>
                    <p>
                        프리랜서나 개인 용역 제공자는 대금을 지급받을 때 일반적으로 3.3%의 세금을
                        원천징수당합니다. 이 3.3%는 소득세 3%와 지방소득세 0.3%를 합친 금액으로,
                        실제 지급하는 사업자가 미리 세금을 떼고 남은 금액을 지급하는 구조입니다.
                    </p>
                    <p>
                        예를 들어 프리랜서가 100만 원의 수입을 받는다면 약 3만 3천 원이 먼저 공제되고,
                        실수령액은 약 96만 7천 원이 됩니다. 계약 금액을 정할 때 이 구조를 모르고 있으면
                        실제 손에 들어오는 금액이 예상보다 적어질 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">언제 사용하는 계산기인가요?</h2>
                    <p>
                        이 계산기는 외주 계약, 프리랜서 작업, 강의료, 자문료, 원고료, 디자인 비용 등
                        3.3% 원천징수 대상이 되는 수입의 실수령액을 빠르게 확인할 때 사용합니다.
                        실제로는 계약서 금액과 통장에 찍히는 금액이 다를 수 있기 때문에,
                        미리 세후 금액을 확인하는 용도로 매우 유용합니다.
                    </p>
                    <p>
                        특히 여러 건의 외주를 병행하는 경우 건별 수입에서 얼마가 빠지고 얼마가 남는지
                        계산해야 월 매출과 실수입을 현실적으로 파악할 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 계산기는 입력한 수입 금액에 3.3%를 곱해 원천징수 세금을 계산하고,
                        이를 제외한 금액을 실수령액으로 보여줍니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>원천징수 세금 = 수입 × 3.3%</li>
                        <li>실수령액 = 수입 - 원천징수 세금</li>
                    </ul>
                    <p>
                        계산 방식은 단순하지만 실제 계약 금액을 검토하거나 견적을 조정할 때
                        매우 실용적으로 사용할 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        3.3%는 최종 세금이 아니라 원천징수 개념입니다. 따라서 종합소득세 신고 시
                        실제 소득, 필요경비, 공제 항목에 따라 추가 납부가 생길 수도 있고,
                        반대로 환급이 발생할 수도 있습니다.
                    </p>
                    <p>
                        본 계산기는 참고용으로 활용해야 하며, 정확한 신고 세액은 홈택스 신고 내역이나
                        세무 전문가 상담을 통해 다시 확인하는 것이 좋습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

                    <div>
                        <p className="font-semibold">Q. 3.3%는 어떤 세금인가요?</p>
                        <p>
                            A. 일반적으로 소득세 3%와 지방소득세 0.3%를 합친 원천징수 세율입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 실제 세금과 차이가 있나요?</p>
                        <p>
                            A. 있습니다. 종합소득세 신고 시 필요경비와 공제 항목에 따라 최종 세액은 달라질 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 세금을 돌려받을 수도 있나요?</p>
                        <p>
                            A. 가능합니다. 선납한 3.3%보다 실제 납부세액이 적으면 환급이 발생할 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 모든 프리랜서가 무조건 3.3%인가요?</p>
                        <p>
                            A. 일반적인 용역 소득 기준으로 많이 적용되지만, 계약 형태와 소득 유형에 따라 달라질 수 있습니다.
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