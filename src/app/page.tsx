import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
    return (
        <main className="container mx-auto py-24 px-4 max-w-5xl">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black mb-6 leading-tight">
                    내 세금, <br />
                    <span className="text-blue-600">데이터</span>로 명확하게.
                </h1>

                <p className="text-slate-500 text-lg">
                    복잡한 세금 계산을 쉽고 빠르게 확인하세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/vat-calculator" className="group border rounded-2xl p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">부가세 계산기</h2>
                    <p className="text-slate-500 text-sm mb-4">
                        공급가액, 부가세, 총금액 계산
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                        계산하기
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>

                <Link href="/income-tax-calculator" className="group border rounded-2xl p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">종합소득세 계산기</h2>
                    <p className="text-slate-500 text-sm mb-4">
                        연 소득 기준 예상 세금 계산
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                        계산하기
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>

                <Link href="/withholding-calculator" className="group border rounded-2xl p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">원천징수 계산기</h2>
                    <p className="text-slate-500 text-sm mb-4">
                        월 급여 기준 공제 및 실수령액 확인
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                        계산하기
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>

                <Link href="/severance-calculator" className="group border rounded-2xl p-6 hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">퇴직금 계산기</h2>
                    <p className="text-slate-500 text-sm mb-4">
                        근속 연수 기준 퇴직금 및 실수령액 계산
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                        계산하기
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                    </div>
                </Link>
            </div>
        </main>
    );
}