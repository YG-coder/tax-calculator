// src/components/CalculatorDirectory.tsx
'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { AUDIENCE_GROUPS, calculatorHref, type Audience, type Calculator } from '@/lib/calculators'
import { filterCalculators } from '@/lib/calculator-search'

/** 초기 HTML에는 전체 계산기 링크를 렌더링하고, 검색과 상황 필터는 클라이언트에서 적용한다. */
export default function CalculatorDirectory({ calculators }: { calculators: Calculator[] }) {
    const [query, setQuery] = useState('')
    const [audience, setAudience] = useState<Audience | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const inputId = useId()
    const statusId = useId()
    const selectedGroup = AUDIENCE_GROUPS.find((group) => group.key === audience)
    const matches = filterCalculators(calculators, query, audience)
    const hasFilter = query.trim() !== '' || audience !== null
    const options = [
        { key: null, label: '전체', count: calculators.length },
        ...AUDIENCE_GROUPS.map((group) => ({
            key: group.key,
            label: group.label,
            count: calculators.filter((calc) => (calc.audiences as readonly Audience[]).includes(group.key)).length,
        })),
    ]

    function resetFilters() {
        setQuery('')
        setAudience(null)
        inputRef.current?.focus()
    }

    return (
        <div>
            <div role="group" aria-label="계산할 상황 선택" className="mb-3 flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option.key ?? 'all'}
                        type="button"
                        aria-pressed={audience === option.key}
                        onClick={() => setAudience(option.key)}
                        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${audience === option.key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'}`}
                    >
                        {option.label}
                        <span aria-hidden="true" className="text-xs opacity-75">{option.count}</span>
                    </button>
                ))}
            </div>
            {selectedGroup && (
                <p className="mb-3 text-sm text-slate-600">{selectedGroup.hint}</p>
            )}
            <div className="mb-4">
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-slate-700">
                    계산기 이름 또는 상황으로 검색
                </label>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={selectedGroup ? `${selectedGroup.label} 계산기에서 검색 (예: 세목 이름)` : '예: 양도세, 종부세, 부가세, 직장인'}
                    aria-describedby={statusId}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder-slate-400 transition-colors hover:border-slate-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-1.5 flex min-h-[44px] items-center justify-between gap-2">
                    <p id={statusId} role="status" aria-live="polite" aria-atomic="true" className="text-xs text-slate-500">
                        {hasFilter ? `검색 결과 ${matches.length}개` : `계산기 ${calculators.length}개`}
                        {selectedGroup && ` · ${selectedGroup.label}`}
                    </p>
                    {hasFilter && (
                        <button type="button" onClick={resetFilters}
                            className="min-h-[44px] shrink-0 rounded-lg px-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                            검색 초기화
                        </button>
                    )}
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-700">찾는 계산기가 없습니다</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {selectedGroup ? '다른 상황을 선택하거나 검색을 초기화해 전체 계산기를 확인하세요.' : '검색어를 짧게 바꿔보세요. 양도세·종부세 같은 약칭으로도 찾을 수 있습니다.'}
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {matches.map((calc) => (
                        <li key={calc.slug}>
                            <Link
                                href={calculatorHref(calc.slug)}
                                className="flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                                <span aria-hidden="true" className="shrink-0 text-lg">
                                    {calc.emoji}
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-semibold text-slate-800">{calc.title}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{calc.description}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
