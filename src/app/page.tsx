import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CALCULATORS } from '@/lib/calculators';

export default function HomePage() {
    const enabledCalculators = CALCULATORS.filter((item) => item.enabled);

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
                {enabledCalculators.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        className="group border rounded-2xl p-6 hover:shadow-lg transition"
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
        </main>
    );
}