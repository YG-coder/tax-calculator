'use client';

import Link from 'next/link';
import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

function format(num: number) {
    return num.toLocaleString('ko-KR');
}

export default function SeveranceCalculator() {
    const [salary, setSalary] = useState('');
    const [years, setYears] = useState('');

    const monthly = Number(salary.replace(/,/g, '')) || 0;
    const workYears = Number(years) || 0;

    const hasValue = monthly > 0 && workYears > 0;

    // 단순화된 참고용 계산
    const dailyWage = monthly / 30;
    const severance = Math.floor(dailyWage * 30 * workYears);

    // 참고용 단순 세금
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
                        className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold">근속 연수 (년)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="예: 5"
                        className="w-full mt-2 border rounded-lg p-3 text-xl font-bold focus:ring-2 focus:ring-slate-900 outline-none"
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

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">퇴직금 계산기란?</h2>
                    <p>
                        퇴직금 계산기는 근속 기간과 평균 임금을 기준으로 예상 퇴직금을 확인하는 도구입니다.
                        퇴직이나 이직을 준비하는 직장인에게는 실제로 얼마를 받을 수 있는지 미리 확인하는 것이 매우 중요합니다.
                        특히 퇴직 전 자금 계획이나 생활비 준비, 이직 시점 판단에 도움이 됩니다.
                    </p>
                    <p>
                        일반적으로 퇴직금은 1년 이상 근무한 근로자에게 지급되며,
                        기본 개념은 1년 근속당 평균임금 30일분입니다.
                        본 계산기는 이 기준을 단순화하여 빠르게 예상 금액을 확인할 수 있도록 구성했습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">언제 사용하는 계산기인가요?</h2>
                    <p>
                        이 계산기는 퇴직 예정자, 이직 준비자, 인사·총무 실무자,
                        그리고 자신의 예상 퇴직금을 미리 확인하고 싶은 직장인이 사용할 수 있습니다.
                        근속 연수와 월 평균 급여만 입력하면 대략적인 퇴직금 규모와 세후 수령액을 빠르게 확인할 수 있습니다.
                    </p>
                    <p>
                        특히 퇴사 전 협의, 중간정산 여부 검토, 이직 시 자금 계획을 세울 때
                        대략적인 기준 금액을 파악하는 데 유용합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 계산기는 월 평균 급여를 바탕으로 평균임금 30일분을 계산하고,
                        이를 근속 연수와 곱해 예상 퇴직금을 산출합니다.
                        이후 참고용 단순 세율을 적용해 세후 수령액도 함께 보여줍니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>퇴직금 = 평균임금 30일분 × 근속 연수</li>
                        <li>참고용 퇴직소득세 = 퇴직금 × 단순 비율</li>
                        <li>예상 실수령액 = 퇴직금 - 세금</li>
                    </ul>
                    <p>
                        실제 퇴직금 산정은 평균임금 계산 방식과 재직일수, 각종 수당 반영 여부에 따라 차이가 날 수 있습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        본 계산기는 참고용 단순 계산기입니다. 실제 퇴직금은 평균임금 산정 기준,
                        상여금·수당 반영 여부, 재직 기간, 퇴직소득세 계산 구조 등에 따라 달라질 수 있습니다.
                    </p>
                    <p>
                        특히 퇴직소득세는 단순 비율이 아니라 여러 요소를 반영해 계산되므로,
                        본 페이지의 세금 결과는 참고용으로만 보아야 합니다.
                        최종 금액은 회사 정산 내역이나 전문가 확인을 통해 검토하는 것이 좋습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

                    <div>
                        <p className="font-semibold">Q. 퇴직금 계산 기준은 무엇인가요?</p>
                        <p>
                            A. 일반적으로 1년 근속당 평균임금 30일분을 기준으로 계산합니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 실제 금액과 왜 차이가 나나요?</p>
                        <p>
                            A. 평균임금 산정 방식, 수당 반영 여부, 재직일수, 중간정산 이력 등에 따라 달라질 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 세금은 정확한가요?</p>
                        <p>
                            A. 본 계산기의 세금은 참고용 단순 계산이며 실제 퇴직소득세와 차이가 있을 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 중간정산 이력이 있으면 어떻게 되나요?</p>
                        <p>
                            A. 중간정산 여부에 따라 실제 퇴직금 계산 결과가 달라질 수 있으므로 별도 확인이 필요합니다.
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