'use client';

import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

export default function InsuranceCalculator() {
    const [salary, setSalary] = useState('');

    const parsed = Number(salary.replace(/,/g, '')) || 0;

    const pension = Math.floor(parsed * 0.045);
    const health = Math.floor(parsed * 0.03545);
    const care = Math.floor(health * 0.1295);
    const employment = Math.floor(parsed * 0.009);

    const total = pension + health + care + employment;
    const net = parsed - total;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, '');
        if (!raw) {
            setSalary('');
            return;
        }
        setSalary(Number(raw).toLocaleString('ko-KR'));
    };

    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-8">4대보험 계산기</h1>

            {/* 입력 */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <label className="text-sm font-semibold text-slate-700">
                    월 급여 (원)
                </label>

                <input
                    type="text"
                    value={salary}
                    onChange={handleChange}
                    placeholder="예: 3,000,000"
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                />

                <p className="mt-2 text-xs text-slate-400">
                    일반적인 근로자 부담 기준으로 4대보험 공제액을 계산합니다.
                </p>
            </div>

            {/* 결과 */}
            {parsed > 0 ? (
                <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl">
                    <p className="text-slate-400 text-sm mb-2">공제 내역</p>

                    <div className="space-y-2 text-lg">
                        <div className="flex justify-between">
                            <span>국민연금 (4.5%)</span>
                            <span>{format(pension)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>건강보험 (3.545%)</span>
                            <span>{format(health)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>장기요양보험</span>
                            <span>{format(care)} 원</span>
                        </div>

                        <div className="flex justify-between">
                            <span>고용보험 (0.9%)</span>
                            <span>{format(employment)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold border-t pt-3 mt-3 text-red-400">
                            <span>총 공제액</span>
                            <span>{format(total)} 원</span>
                        </div>

                        <div className="flex justify-between font-bold text-xl text-green-400">
                            <span>예상 실수령액</span>
                            <span>{format(net)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    급여를 입력하면 계산됩니다
                </div>
            )}

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">4대보험 계산기란?</h2>
                    <p>
                        4대보험 계산기는 월 급여를 기준으로 국민연금, 건강보험, 장기요양보험,
                        고용보험 공제액을 빠르게 확인할 수 있는 계산기입니다.
                        직장인의 급여명세서에서 가장 많이 확인하는 항목이기 때문에,
                        실수령액을 예상하고 급여 구조를 이해하는 데 매우 유용합니다.
                    </p>
                    <p>
                        실제 급여를 받기 전 또는 연봉 협상, 이직, 입사 조건 비교 시
                        단순히 세전 금액만 보는 것이 아니라 실제로 얼마가 공제되고
                        얼마를 받을 수 있는지 확인하는 것이 중요합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">4대보험에는 무엇이 포함되나요?</h2>
                    <p>
                        일반적으로 4대보험은 국민연금, 건강보험, 장기요양보험, 고용보험으로 구성됩니다.
                        각 항목은 근로자와 회사가 일정 비율을 나누어 부담하며,
                        본 계산기는 근로자 부담분을 기준으로 계산합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>국민연금: 노후 보장을 위한 사회보험</li>
                        <li>건강보험: 의료비 부담 완화를 위한 보험</li>
                        <li>장기요양보험: 고령·질병 장기요양 지원 보험</li>
                        <li>고용보험: 실업급여 및 고용안정 지원 보험</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 계산기는 월 급여를 입력하면 각 보험의 일반적인 요율을 적용하여
                        예상 공제액을 보여줍니다. 이후 총 공제액과 실수령액도 함께 확인할 수 있습니다.
                    </p>
                    <p>
                        급여명세서를 보기 전 대략적인 공제 규모를 확인하거나,
                        연봉 실수령액 계산과 함께 활용하기에 적합합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        실제 4대보험 공제액은 보수월액 기준, 상·하한, 사업장 조건,
                        개인 상황 등에 따라 달라질 수 있습니다.
                        따라서 본 계산기는 참고용으로 활용해야 하며 실제 급여명세서와 차이가 날 수 있습니다.
                    </p>
                    <p>
                        또한 비과세 항목, 상한액 적용 여부, 회사별 급여 구조 차이에 따라
                        최종 실수령액은 달라질 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

                    <div>
                        <p className="font-semibold">Q. 4대보험은 누구나 똑같이 적용되나요?</p>
                        <p>
                            A. 기본 구조는 비슷하지만 급여 수준, 사업장 형태, 가입 조건에 따라 차이가 있을 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 왜 실제 급여명세서와 차이가 나나요?</p>
                        <p>
                            A. 상·하한 적용, 비과세 항목, 개인별 조건, 회사 급여 처리 기준이 다를 수 있기 때문입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 연봉 계산기와 같이 써도 되나요?</p>
                        <p>
                            A. 그렇습니다. 연봉 기준 실수령액을 볼 때 4대보험 공제 구조를 이해하는 데 도움이 됩니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 이 계산기 결과를 그대로 믿어도 되나요?</p>
                        <p>
                            A. 참고용으로는 좋지만, 최종 금액은 실제 급여명세서나 공식 계산 기준으로 다시 확인하는 것이 좋습니다.
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCalculators />
        </main>
    );
}