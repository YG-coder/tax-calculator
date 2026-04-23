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
                    className="w-full mt-2 border rounded-lg p-3 text-xl font-bold"
                />
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
                            <span>실수령액</span>
                            <span>{format(net)} 원</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-8 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-slate-400">
                    급여를 입력하면 계산됩니다
                </div>
            )}

            {/* SEO */}
            <section className="mt-12 space-y-6 text-sm text-slate-600 leading-relaxed">
                <h2 className="text-lg font-bold text-slate-800">4대보험이란?</h2>
                <p>
                    4대보험은 국민연금, 건강보험, 장기요양보험, 고용보험으로 구성된 사회보험입니다.
                    직장인은 급여에서 일정 비율이 자동 공제됩니다.
                </p>
                <p>
                    본 계산기는 월 급여 기준으로 각 보험료와 실수령액을 간편하게 확인할 수 있도록 구성되었습니다.
                </p>
            </section>

            <RelatedCalculators />
        </main>
    );
}