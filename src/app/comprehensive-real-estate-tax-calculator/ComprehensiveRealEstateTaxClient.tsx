// src/app/comprehensive-real-estate-tax-calculator/ComprehensiveRealEstateTaxClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'
import ResultActions from '@/components/ResultActions'
import SourceNote from '@/components/SourceNote'
import {
    BASIC_DEDUCTION_GENERAL,
    BASIC_DEDUCTION_ONE_HOUSE,
    CRET_TAX_YEAR,
    calculateComprehensiveRealEstateTax,
    type CretInput,
    type CretResult,
    type OwnershipType,
} from '@/lib/tax/rules/comprehensive-real-estate'
import { amountError, amountValue, formatAmount } from '@/lib/utils/amount'

const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`

const selectClass =
    'block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 transition-colors hover:border-slate-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'

function intError(text: string, max: number, label: string): string | null {
    const raw = text.trim()
    if (raw === '') return null
    if (!/^\d+$/.test(raw)) return `${label}을(를) 숫자로 입력해 주세요`
    if (Number(raw) > max) return `${label}은(는) ${max} 이하로 입력해 주세요`
    return null
}

function Toggle({
    id, label, hint, checked, onChange,
}: { id: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <label htmlFor={id} className="text-sm leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-800">{label}</span>
                {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
            </label>
        </div>
    )
}

export default function ComprehensiveRealEstateTaxClient() {
    const [publishedPrice, setPublishedPrice] = useState('')
    const [ownershipType, setOwnershipType] = useState<OwnershipType>('sole')
    const [ownershipPercent, setOwnershipPercent] = useState('50')
    const [applyJointSpecial, setApplyJointSpecial] = useState(false)
    const [isOneHouse, setIsOneHouse] = useState(true)
    const [houseCount, setHouseCount] = useState('1')
    const [age, setAge] = useState('')
    const [holdingYears, setHoldingYears] = useState('')
    const [propertyTaxPaid, setPropertyTaxPaid] = useState('')
    const [prevYearTotalTax, setPrevYearTotalTax] = useState('')
    const assumeLatestRules = false

    const isJoint = ownershipType === 'spouseJoint'

    const ownershipError = (() => {
        const raw = ownershipPercent.trim()
        if (raw === '') return '지분율을 입력해 주세요'
        if (!/^\d+(\.\d+)?$/.test(raw)) return '지분율을 숫자로 입력해 주세요'
        const v = Number(raw)
        if (v <= 0 || v > 100) return '지분율은 0 초과 100 이하로 입력해 주세요'
        return null
    })()

    const ageError = intError(age, 130, '나이')
    const holdingError = intError(holdingYears, 130, '보유기간')
    const houseCountError = (() => {
        const raw = houseCount.trim()
        if (raw === '') return '주택 수를 입력해 주세요'
        if (!/^\d+$/.test(raw) || Number(raw) < 1) return '주택 수는 1 이상의 정수로 입력해 주세요'
        if (Number(raw) > 100) return '주택 수는 100 이하로 입력해 주세요'
        return null
    })()

    const ready =
        amountValue(publishedPrice) > 0 &&
        amountError(publishedPrice) === null &&
        amountError(propertyTaxPaid) === null &&
        amountError(prevYearTotalTax) === null &&
        ageError === null &&
        holdingError === null &&
        houseCountError === null &&
        (!isJoint || ownershipError === null)

    function buildResult(): CretResult | null {
        if (!ready) return null
        const input: CretInput = {
            year: CRET_TAX_YEAR,
            publishedPriceTotal: amountValue(publishedPrice),
            ownershipType,
            ownershipRatio: isJoint ? Number(ownershipPercent) / 100 : 1,
            applyJointOneHouseSpecial: isJoint && applyJointSpecial,
            isOneHouseOneHousehold: !isJoint && isOneHouse,
            houseCount: Number(houseCount),
            age: age.trim() === '' ? null : Number(age),
            holdingYears: holdingYears.trim() === '' ? null : Number(holdingYears),
            propertyTaxPaid: propertyTaxPaid.trim() === '' ? null : amountValue(propertyTaxPaid),
            prevYearTotalTax: prevYearTotalTax.trim() === '' ? null : amountValue(prevYearTotalTax),
            assumeLatestRules,
        }
        return calculateComprehensiveRealEstateTax(input)
    }

    const result = buildResult()

    /** 공동명의에서 특례 신청 여부를 비교하기 위한 반대편 계산 */
    function buildComparison(): { withoutSpecial: number; withSpecial: number } | null {
        if (!ready || !isJoint || Number(houseCount) !== 1) return null
        const common: CretInput = {
            year: CRET_TAX_YEAR,
            publishedPriceTotal: amountValue(publishedPrice),
            ownershipType: 'spouseJoint',
            ownershipRatio: Number(ownershipPercent) / 100,
            houseCount: 1,
            age: age.trim() === '' ? null : Number(age),
            holdingYears: holdingYears.trim() === '' ? null : Number(holdingYears),
            propertyTaxPaid: propertyTaxPaid.trim() === '' ? null : amountValue(propertyTaxPaid),
            prevYearTotalTax: prevYearTotalTax.trim() === '' ? null : amountValue(prevYearTotalTax),
        }
        const a = calculateComprehensiveRealEstateTax({ ...common, applyJointOneHouseSpecial: false })
        const b = calculateComprehensiveRealEstateTax({ ...common, applyJointOneHouseSpecial: true })
        if (!a.ok || !b.ok) return null
        return { withoutSpecial: a.totalPayable, withSpecial: b.totalPayable }
    }

    const comparison = buildComparison()

    const summaryLines = result?.ok
        ? [
              { label: '과세연도', value: `${result.year}년` },
              { label: '판정', value: result.treatedAsOneHouse ? '1세대 1주택자' : '일반 소유자' },
              ...result.steps.map((s) => ({ label: s.label, value: s.value, note: s.expression })),
          ]
        : []

    return (
        <>
            <div className="calc-card space-y-5 p-6">
                <h2 className="text-base font-bold text-slate-800">보유 주택 정보</h2>

                <div>
                    <label htmlFor="publishedPrice" className="calc-label">
                        주택 공시가격 합계 <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9,]*"
                            id="publishedPrice"
                            value={formatAmount(publishedPrice)}
                            onChange={(e) => setPublishedPrice(e.target.value)}
                            aria-invalid={amountError(publishedPrice) !== null}
                            aria-describedby={amountError(publishedPrice) ? 'publishedPrice-error' : 'publishedPrice-hint'}
                            placeholder="예: 1,500,000,000"
                            className="calc-input pr-8"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">원</span>
                    </div>
                    {amountError(publishedPrice) && (
                        <p id="publishedPrice-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                            {amountError(publishedPrice)}
                        </p>
                    )}
                    <p id="publishedPrice-hint" className="calc-hint">
                        공동명의 주택도 <strong>지분을 나누기 전 주택 전체</strong> 공시가격을 입력하세요. 시가가 아니라
                        부동산공시가격알리미의 공시가격입니다.
                    </p>
                </div>

                <div>
                    <label htmlFor="ownershipType" className="calc-label">소유 형태</label>
                    <select
                        id="ownershipType"
                        value={ownershipType}
                        onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
                        className={selectClass}
                    >
                        <option value="sole">단독 소유</option>
                        <option value="spouseJoint">배우자와 공동명의 1주택</option>
                    </select>
                </div>

                {isJoint ? (
                    <>
                        <div>
                            <label htmlFor="ownershipPercent" className="calc-label">본인 지분율</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    id="ownershipPercent"
                                    value={ownershipPercent}
                                    onChange={(e) => setOwnershipPercent(e.target.value)}
                                    aria-invalid={ownershipError !== null}
                                    aria-describedby={ownershipError ? 'ownershipPercent-error' : undefined}
                                    className="calc-input pr-8"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
                            </div>
                            {ownershipError && (
                                <p id="ownershipPercent-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                                    {ownershipError}
                                </p>
                            )}
                        </div>
                        <Toggle
                            id="applyJointSpecial"
                            label="공동명의 1주택자 특례를 신청했다"
                            hint="신청하면 한 사람이 주택 전체에 대해 12억원 공제와 고령자·장기보유 세액공제를 받습니다. 신청기간은 9월 16일 ~ 9월 30일입니다. (법 제10조의2)"
                            checked={applyJointSpecial}
                            onChange={setApplyJointSpecial}
                        />
                    </>
                ) : (
                    <Toggle
                        id="isOneHouse"
                        label="1세대 1주택자다"
                        hint="공제 12억원과 고령자·장기보유 세액공제 적용 여부를 결정합니다. (법 제8조 제1항 제1호)"
                        checked={isOneHouse}
                        onChange={setIsOneHouse}
                    />
                )}

                <div>
                    <label htmlFor="houseCount" className="calc-label">납세의무자가 소유한 주택 수</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="houseCount"
                        value={houseCount}
                        onChange={(e) => setHouseCount(e.target.value)}
                        aria-invalid={houseCountError !== null}
                        aria-describedby={houseCountError ? 'houseCount-error' : 'houseCount-hint'}
                        className="calc-input"
                    />
                    {houseCountError && (
                        <p id="houseCount-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                            {houseCountError}
                        </p>
                    )}
                    <p id="houseCount-hint" className="calc-hint">
                        3주택 이상이면 과세표준 12억원 초과 구간부터 더 높은 세율이 적용됩니다. (법 제9조 제1항 제2호)
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="age" className="calc-label">과세기준일 현재 만 나이</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                id="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                aria-invalid={ageError !== null}
                                aria-describedby={ageError ? 'age-error' : 'age-hint'}
                                placeholder="예: 65"
                                className="calc-input pr-8"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">세</span>
                        </div>
                        {ageError && (
                            <p id="age-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{ageError}</p>
                        )}
                        <p id="age-hint" className="calc-hint">60세 이상부터 세액공제 (선택)</p>
                    </div>
                    <div>
                        <label htmlFor="holdingYears" className="calc-label">과세기준일 현재 보유기간</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                id="holdingYears"
                                value={holdingYears}
                                onChange={(e) => setHoldingYears(e.target.value)}
                                aria-invalid={holdingError !== null}
                                aria-describedby={holdingError ? 'holdingYears-error' : 'holdingYears-hint'}
                                placeholder="예: 12"
                                className="calc-input pr-8"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">년</span>
                        </div>
                        {holdingError && (
                            <p id="holdingYears-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">{holdingError}</p>
                        )}
                        <p id="holdingYears-hint" className="calc-hint">5년 이상부터 세액공제 (선택)</p>
                    </div>
                </div>

                <details className="rounded-xl border border-slate-200 bg-white p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                        더 정확하게 계산하기 (선택 입력)
                    </summary>
                    <div className="mt-4 space-y-4">
                        {[
                            {
                                id: 'propertyTaxPaid',
                                label: '올해 부과된 주택분 재산세 본세',
                                value: propertyTaxPaid,
                                set: setPropertyTaxPaid,
                                hint: '미입력 시 「지방세법」 세율로 추정합니다. 조례 가감조정 세율이나 재산세 세부담 상한이 적용됐다면 실제 고지액을 입력하세요.',
                            },
                            {
                                id: 'prevYearTotalTax',
                                label: '직전년도 총세액상당액 (재산세 + 종부세)',
                                value: prevYearTotalTax,
                                set: setPrevYearTotalTax,
                                hint: '입력하면 세부담 상한 150%를 검토합니다. 미입력 시 상한을 적용하지 않습니다. (법 제10조)',
                            },
                        ].map(({ id, label, value, set, hint }) => (
                            <div key={id}>
                                <label htmlFor={id} className="calc-label">{label}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9,]*"
                                        id={id}
                                        value={formatAmount(value)}
                                        onChange={(e) => set(e.target.value)}
                                        aria-invalid={amountError(value) !== null}
                                        aria-describedby={amountError(value) ? `${id}-error` : `${id}-hint`}
                                        placeholder="예: 1,200,000"
                                        className="calc-input pr-8"
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">원</span>
                                </div>
                                {amountError(value) && (
                                    <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-semibold text-red-600">
                                        {amountError(value)}
                                    </p>
                                )}
                                <p id={`${id}-hint`} className="calc-hint">{hint}</p>
                            </div>
                        ))}
                    </div>
                </details>
            </div>

            {result === null ? (
                <div className="mt-6 flex h-36 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
                    주택 공시가격 합계를 입력하면 계산됩니다
                </div>
            ) : !result.ok ? (
                <div className="calc-card mt-6 border-red-100 bg-red-50 p-5" role="alert">
                    <p className="mb-2 text-sm font-bold text-red-700">계산할 수 없습니다</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                        {result.errors.map((e) => <li key={e}>{e}</li>)}
                    </ul>
                </div>
            ) : (
                <div className="animate-slide-up mt-6 space-y-4" aria-live="polite">
                    <div className="rounded-2xl bg-slate-900 p-6 text-center text-white">
                        <p className="text-sm text-slate-300">{result.year}년 최종 예상 납부액 (농어촌특별세 포함)</p>
                        <p className="mt-2 text-4xl font-bold tracking-tight">{won(result.totalPayable)}</p>
                        <p className="mt-2 text-sm text-slate-300">
                            {result.treatedAsOneHouse ? '1세대 1주택자' : '일반 소유자'} · 과세표준 {won(result.taxBase)}
                        </p>
                        {result.status === 'verificationRequired' && (
                            <p className="mt-2 inline-block rounded-full bg-orange-400/20 px-3 py-1 text-xs font-medium text-orange-200">
                                검증 필요 — 확정되지 않은 계산 포함
                            </p>
                        )}
                    </div>

                    <div className="calc-card p-5">
                        <h3 className="mb-4 text-sm font-bold text-slate-700">계산 과정</h3>
                        <ol className="space-y-3">
                            {result.steps.map((s) => (
                                <li key={s.label} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                                        <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-900">{s.value}</span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.expression}</p>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">종합부동산세</dt>
                            <dd className="text-sm font-semibold text-slate-900">{won(result.comprehensiveTax)}</dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">농어촌특별세 (20%)</dt>
                            <dd className="text-sm font-semibold text-slate-900">{won(result.ruralTax)}</dd>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5">
                            <dt className="text-sm font-semibold text-slate-800">최종 예상 납부액</dt>
                            <dd className="text-base font-bold text-slate-900">{won(result.totalPayable)}</dd>
                        </div>
                    </dl>

                    {comparison && (
                        <div className="calc-card p-5">
                            <h3 className="mb-2 text-sm font-bold text-slate-700">공동명의 1주택자 특례 비교</h3>
                            <p className="mb-3 text-xs text-slate-500">
                                특례를 신청하지 않으면 부부가 각각 9억원씩 공제받고, 신청하면 한 사람이 12억원 공제와
                                세액공제를 받습니다. 아래는 <strong>세대 전체 부담액</strong> 기준 비교입니다.
                            </p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-slate-600">특례 미신청 (부부 각자 과세 합계)</span>
                                    <span className="font-bold tabular-nums text-slate-800">
                                        {won(comparison.withoutSpecial * 2)}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-slate-600">특례 신청 (1세대 1주택자로 계산)</span>
                                    <span className="font-bold tabular-nums text-slate-800">{won(comparison.withSpecial)}</span>
                                </li>
                            </ul>
                            <p className="mt-3 text-xs text-slate-500">
                                지분이 정확히 절반일 때의 단순 비교입니다. 지분이 다르면 배우자 몫을 따로 계산해 더하세요.
                            </p>
                        </div>
                    )}

                    {result.verificationNotes.length > 0 && (
                        <div className="calc-card border-orange-100 bg-orange-50 p-5">
                            <p className="mb-2 text-sm font-bold text-orange-800">확인이 필요한 항목</p>
                            <ul className="list-disc space-y-1 pl-5 text-sm text-orange-800">
                                {result.verificationNotes.map((n) => <li key={n}>{n}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="calc-card p-5">
                        <p className="mb-2 text-sm font-bold text-slate-700">계산 안내</p>
                        <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
                            {result.notes.map((n) => <li key={n}>{n}</li>)}
                        </ul>
                    </div>

                    <div className="calc-card p-5">
                        <p className="mb-2 text-sm font-bold text-slate-700">이 계산기가 지원하지 않는 범위</p>
                        <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
                            {result.unsupported.map((n) => <li key={n}>{n}</li>)}
                        </ul>
                        <p className="mt-3 text-xs text-slate-500">
                            실제 고지 세액은 국세청 홈택스 또는 관할 세무서를 통해 확인하세요.
                        </p>
                    </div>

                    <ResultActions
                        title={`종합부동산세 예상액 — ${result.year}년 주택분`}
                        lines={summaryLines}
                        footer={[
                            `공제금액 기준: 1세대 1주택자 ${won(BASIC_DEDUCTION_ONE_HOUSE)} / 그 밖 ${won(BASIC_DEDUCTION_GENERAL)}`,
                            '근거: 종합부동산세법 제8조·제9조·제10조·제10조의2·제16조, 같은 법 시행령 제2조의4·제4조의3, 농어촌특별세법 제5조',
                            '이 결과는 참고용이며 세무 자문이 아닙니다. 실제 고지 세액은 국세청 홈택스에서 확인하세요.',
                            'taxsim.kr 종합부동산세 계산기',
                        ]}
                    />
                </div>
            )}

            <SourceNote calculator="comprehensive-real-estate-tax-calculator" />
            <RelatedCalculators current="comprehensive-real-estate-tax-calculator" />
        </>
    )
}
