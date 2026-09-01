// src/components/ResultActions.tsx
'use client'

import { useState } from 'react'

export type SummaryLine = { label: string; value: string; note?: string }

interface Props {
    /** 복사·인쇄할 요약의 제목 */
    title: string
    /** 표시할 요약 줄 */
    lines: SummaryLine[]
    /** 요약 끝에 붙일 안내 (출처·면책 등) */
    footer?: string[]
}

/**
 * 계산 결과를 클립보드로 복사하거나 인쇄할 수 있게 하는 공통 버튼.
 *
 * · 복사: 서식 없는 텍스트로 만들어 메신저·메모에 그대로 붙여 넣을 수 있다.
 * · 인쇄: 브라우저 인쇄 대화상자를 연다. print 스타일은 globals.css 에 있다.
 */
export default function ResultActions({ title, lines, footer = [] }: Props) {
    const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')

    const text = [
        title,
        '─'.repeat(Math.min(40, title.length * 2)),
        ...lines.map((l) => `${l.label}: ${l.value}${l.note ? ` (${l.note})` : ''}`),
        ...(footer.length > 0 ? ['', ...footer] : []),
    ].join('\n')

    async function copy() {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
            } else {
                throw new Error('clipboard unavailable')
            }
            setCopied('done')
        } catch {
            setCopied('failed')
        }
        window.setTimeout(() => setCopied('idle'), 2500)
    }

    return (
        <div className="print:hidden">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                >
                    결과 복사
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
                >
                    인쇄 / PDF 저장
                </button>
            </div>
            <p role="status" aria-live="polite" className="mt-1.5 min-h-[1rem] text-xs text-slate-500">
                {copied === 'done' && '계산 결과를 클립보드에 복사했습니다.'}
                {copied === 'failed' && '복사에 실패했습니다. 결과를 직접 선택해 복사해 주세요.'}
            </p>
        </div>
    )
}
