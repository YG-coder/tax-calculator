'use client';

import Link from 'next/link';
import { useState } from 'react';
import RelatedCalculators from '@/components/RelatedCalculators';

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

            {/* SEO 본문 */}
            <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">부가세 계산기란?</h2>
                    <p>
                        부가세 계산기는 공급가액과 부가가치세를 쉽고 빠르게 계산하기 위한 도구입니다.
                        사업자 거래에서는 부가세 포함 금액과 부가세 별도 금액이 함께 사용되기 때문에,
                        실제 공급가액과 세액을 정확히 나눠서 확인하는 것이 중요합니다.
                    </p>
                    <p>
                        특히 세금계산서 발행, 견적 작성, 거래 금액 검토, 비용 처리 검토 과정에서는
                        공급가액과 부가세를 명확히 구분해야 합니다. 본 계산기는 입력한 금액을 기준으로
                        부가세 포함 방식과 부가세 별도 방식을 모두 빠르게 계산할 수 있도록 구성했습니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">언제 사용하는 계산기인가요?</h2>
                    <p>
                        부가세 계산기는 사업자가 거래 금액을 검토할 때 가장 자주 사용하는 계산기 중 하나입니다.
                        예를 들어 총 금액만 알고 있을 때 공급가액을 나누거나,
                        공급가액만 있을 때 실제 청구할 총 금액을 확인하는 데 유용합니다.
                    </p>
                    <p>
                        부가세 신고 전 금액을 다시 확인하거나, 거래처에 금액을 안내하기 전에
                        부가세 포함 여부를 점검할 때도 매우 실용적입니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">계산 방법</h2>
                    <p>
                        본 계산기는 두 가지 방식을 지원합니다. 첫째, 부가세 포함 금액을 입력하면
                        공급가액과 부가세를 자동으로 분리해 보여줍니다. 둘째, 부가세 별도 금액을 입력하면
                        부가세 10%를 적용해 총 금액을 계산합니다.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>부가세 포함 금액 → 공급가액 = 총 금액 ÷ 1.1</li>
                        <li>부가세 포함 금액 → 부가세 = 총 금액 - 공급가액</li>
                        <li>부가세 별도 금액 → 부가세 = 공급가액 × 10%</li>
                        <li>부가세 별도 금액 → 총 금액 = 공급가액 + 부가세</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">주의사항</h2>
                    <p>
                        본 계산기는 일반적인 10% 부가가치세율을 기준으로 동작합니다.
                        따라서 간이과세자, 면세사업자, 업종별 특수 세율, 실제 계약 조건 등은 반영하지 않습니다.
                    </p>
                    <p>
                        실제 세금계산서 발행 또는 신고 시에는 사업자 유형, 과세 기준, 거래 조건을 다시 확인하는 것이 좋습니다.
                        본 페이지의 결과는 참고용 계산값으로 활용해야 합니다.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">자주 묻는 질문 (FAQ)</h2>

                    <div>
                        <p className="font-semibold">Q. 부가세는 몇 퍼센트인가요?</p>
                        <p>
                            A. 일반적으로 대한민국 부가가치세는 10%입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 공급가액이란 무엇인가요?</p>
                        <p>
                            A. 부가세를 제외한 실제 거래 금액입니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 간이과세자도 동일하게 계산되나요?</p>
                        <p>
                            A. 본 계산기는 일반과세자 기준 참고용이며, 간이과세자는 실제와 차이가 있을 수 있습니다.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Q. 세금계산서 금액 확인용으로 써도 되나요?</p>
                        <p>
                            A. 기본 검토용으로는 유용하지만, 실제 발행 전에는 거래 조건과 사업자 유형을 다시 확인하는 것이 좋습니다.
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