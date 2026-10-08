// src/components/CalculatorDirectory.tsx
'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { AUDIENCE_GROUPS, calculatorHref, type Audience, type Calculator } from '@/lib/calculators'

/**
 * 홈의 전체 계산기 목록 + 이름 검색·상황별 선택.
 *
 * 클라이언트 컴포넌트지만 Next.js 가 초기 HTML에 전부 렌더링하므로
 * 검색어를 입력하기 전에는 모든 계산기 링크가 서버 렌더링된 HTML에 들어 있다.
 * 자바스크립트가 꺼져 있어도 목록은 그대로 보이고 링크도 모두 동작한다.
 * (검색 입력만 동작하지 않는다)
 */
export default function CalculatorDirectory({ calculators }: { calculators: Calculator[] }) {
    const [query, setQuery] = useState('')
    const inputId = useId()
    const statusId = useId()

    const needle = query.trim().toLowerCase()
    const audienceLabel = (c: Calculator) =>
        (c.audiences as readonly Audience[])
            .map((a) => AUDIENCE_GROUPS.find((g) => g.key === a)?.label ?? '')
            .join(' ')

    const matches = needle === ''
        ? calculators
        : calculators.filter((c) =>
              `${c.title} ${c.description} ${c.slug} ${audienceLabel(c)}`.toLowerCase().includes(needle),
          )

    return (
        <div>
            <div role="group" aria-label="계산할 상황 선택" className="mb-3 flex flex-wrap gap-2">
                {[{ label: '전체', query: '' }, ...AUDIENCE_GROUPS.map((group) => ({ label: group.label, query: group.label }))].map((option) => (
                    <button
                        key={option.label}
                        type="button"
                        aria-pressed={needle === option.query.toLowerCase()}
                        onClick={() => setQuery(option.query)}
                        className={`min-h-[40px] rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${needle === option.query.toLowerCase() ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'}`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            <div className="mb-4">
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
                    계산기 이름 또는 상황으로 검색
                </label>
                <input
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="계산기 이름이나 상황으로 검색 (예: 양도, 자동차, 직장인)"
                    aria-describedby={statusId}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-colors hover:border-slate-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p id={statusId} role="status" aria-live="polite" className="mt-1.5 text-xs text-slate-500">
                    {needle === ''
                        ? `계산기 ${calculators.length}개`
                        : `검색 결과 ${matches.length}개`}
                </p>
            </div>

            {matches.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                    찾는 계산기가 없습니다. 다른 낱말로 검색하거나 ‘전체’를 선택하세요.
                </p>
            ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {matches.map((calc) => (
                        <li key={calc.slug}>
                            <Link
                                href={calculatorHref(calc.slug)}
                                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <span aria-hidden="true" className="text-lg">
                                    {calc.emoji}
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-slate-800">{calc.title}</span>
                                    <span className="mt-0.5 block truncate text-xs text-slate-500">{calc.description}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
