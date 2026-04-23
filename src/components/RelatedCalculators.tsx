import Link from 'next/link';

export default function RelatedCalculators() {
    return (
        <section className="mt-12">
            <h2 className="text-lg font-bold mb-3">다른 계산기</h2>

            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                <li><Link href="/vat-calculator">부가세 계산기</Link></li>
                <li><Link href="/income-tax-calculator">종합소득세 계산기</Link></li>
                <li><Link href="/withholding-calculator">원천징수 계산기</Link></li>
                <li><Link href="/severance-calculator">퇴직금 계산기</Link></li>
                <li><Link href="/freelancer-tax-calculator">프리랜서 3.3% 계산기</Link></li>
                <li><Link href="/insurance-calculator">4대보험 계산기</Link></li>
            </ul>
        </section>
    );
}