// src/components/SourceNote.tsx
import type { CalculatorSlug } from '@/lib/calculators';
import { CALCULATOR_META } from '@/lib/content-registry';

/**
 * 계산기 하단 근거 표시.
 * 최근 점검일·적용 기준·근거 법령 직통 링크를 content-registry 한 곳에서 렌더링한다.
 */
export default function SourceNote({ calculator }: { calculator: CalculatorSlug }) {
    const meta = CALCULATOR_META[calculator];

    return (
        <div className="text-xs text-slate-500 border-t pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                <span>
                    <span className="font-semibold text-slate-700">최근 점검일</span>{' '}
                    <time dateTime={meta.lastReviewed}>{meta.lastReviewed}</time>
                </span>
                <span>
                    <span className="font-semibold text-slate-700">적용 기준</span> {meta.appliesTo}
                </span>
            </div>

            <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
            <ul className="list-disc pl-5 space-y-0.5">
                {meta.sources.map((s) => (
                    <li key={s.url}>
                        <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline"
                        >
                            {s.label}
                        </a>
                    </li>
                ))}
            </ul>
            <p className="mt-2 text-slate-400">
                계산 결과는 참고용이며 세무 자문이 아닙니다.{' '}
                {meta.confirmationGuidance ?? '실제 신고 세액은 국세청 홈택스 또는 세무 전문가를 통해 확인하세요.'}
            </p>
        </div>
    );
}
