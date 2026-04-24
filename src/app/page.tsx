import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CALCULATORS } from '@/lib/calculators';

export default function HomePage() {
    const enabledCalculators = CALCULATORS.filter((item) => item.enabled);

    return (
        <main className="container mx-auto py-24 px-4 max-w-5xl">

            {/* 헤드라인 */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-snug">
                    내 세금, <br />
                    <span className="text-blue-600">데이터</span>로 명확하게.
                </h1>

                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    부가세, 종합소득세, 원천징수, 퇴직금, 프리랜서 3.3%, 4대보험 계산기를 제공합니다.
                </p>
            </div>

            {/* 계산기 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enabledCalculators.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="group border rounded-2xl p-6 hover:shadow-lg transition bg-white"
                    >
                        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                        <p className="text-slate-500 text-sm mb-4">
                            {item.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold">
                            계산하기
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* 🔥 연봉계산기 연동 CTA */}
            <section className="mt-12 rounded-2xl border bg-green-50 p-6">
                <h2 className="text-xl font-bold mb-2 text-slate-900">
                    연봉 실수령액이 궁금하신가요?
                </h2>

                <p className="text-slate-600 mb-4">
                    세금 계산과 함께 연봉 기준 월 실수령액을 확인할 수 있습니다.
                </p>

                <Link
                    href="https://연봉계산기.kr"
                    className="inline-flex items-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    연봉 계산기 바로가기
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </section>

            {/* SEO 본문 */}
            <section className="mt-16 space-y-6 text-sm text-slate-600 leading-7">
                <h2 className="text-2xl font-bold text-slate-900">세금 계산기 안내</h2>

                <p>
                    세금 계산기는 부가세, 종합소득세, 원천징수, 4대보험 등 다양한 세금 항목을 빠르게 계산할 수 있도록 도와주는 도구입니다.
                </p>

                <p>
                    실제 세금은 개인 상황에 따라 달라질 수 있으므로 본 계산기는 참고용으로 활용하시기 바랍니다.
                </p>
            </section>

        </main>
    );
}