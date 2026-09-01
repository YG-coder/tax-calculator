// src/app/capital-gains-tax-calculator/CapitalGainsTaxClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RelatedCalculators from '@/components/RelatedCalculators'
import ResultActions from '@/components/ResultActions'
import SourceNote from '@/components/SourceNote'
import {
    CG_ASSET_LABELS,
    HEAVY_TAX_GRACE_LAST_DATE,
    HIGH_PRICE_HOUSE_THRESHOLD,
    LAST_VERIFIED_CG_YEAR,
    calculateCapitalGains,
    type CapitalGainsInput,
    type CapitalGainsResult,
    type CgAssetType,
    type HouseCount,
} from '@/lib/tax/rules/capital-gains'
import { amountError, amountValue, formatAmount } from '@/lib/utils/amount'

const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`

const ASSET_ORDER: CgAssetType[] = ['house', 'land', 'residencyRight', 'salesRight']

const HOUSE_COUNT_LABELS: Record<HouseCount, string> = {
    1: '1주택',
    2: '2주택',
    3: '3주택 이상',
}

const selectClass =
    'block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 transition-colors hover:border-slate-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'

function Toggle({
    id,
    label,
    hint,
    checked,
    onChange,
}: {
    id: string
    label: string
    hint?: string
    checked: boolean
    onChange: (v: boolean) => void
}) {
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

export default function CapitalGainsTaxClient() {
    const [assetType, setAssetType] = useState<CgAssetType>('house')
    const [transferPrice, setTransferPrice] = useState('')
    const [acquisitionPrice, setAcquisitionPrice] = useState('')
    const [expenses, setExpenses] = useState('')
    const [acquisitionDate, setAcquisitionDate] = useState('')
    const [transferDate, setTransferDate] = useState('')

    const [oneHouse, setOneHouse] = useState(false)
    const [adjustedAtAcquisition, setAdjustedAtAcquisition] = useState(false)
    const [residenceMonths, setResidenceMonths] = useState('')

    const [housesOwned, setHousesOwned] = useState<HouseCount>(1)
    const [adjustedAtTransfer, setAdjustedAtTransfer] = useState(false)
    const [heavyTaxExcluded, setHeavyTaxExcluded] = useState(false)

    const [basicDeductionUsed, setBasicDeductionUsed] = useState('')
    const [assumeLatestRules, setAssumeLatestRules] = useState(false)

    const isHouse = assetType === 'house'

    const amountFields = [
        { id: 'transferPrice', label: '양도가액', value: transferPrice, set: setTransferPrice, hint: '실제 매도 금액 (실지거래가액)', required: true },
        { id: 'acquisitionPrice', label: '취득가액', value: acquisitionPrice, set: setAcquisitionPrice, hint: '실제 매입 금액 (실지거래가액)', required: true },
        { id: 'expenses', label: '필요경비', value: expenses, set: setExpenses, hint: '취득세·중개수수료·자본적 지출 등 (선택)', required: false },
        { id: 'basicDeductionUsed', label: '올해 이미 사용한 기본공제', value: basicDeductionUsed, set: setBasicDeductionUsed, hint: '같은 과세기간에 다른 양도로 이미 공제받은 금액 (선택)', required: false },
    ]

    function residenceMonthsError(): string | null {
        const raw = residenceMonths.trim()
        if (raw === '') return null
        if (!/^\d+$/.test(raw)) return '개월 수를 숫자로 입력해 주세요'
        if (Number(raw) > 1200) return '1,200개월(100년) 이하로 입력해 주세요'
        return null
    }
    const monthsError = residenceMonthsError()

    const ready =
        amountValue(transferPrice) > 0 &&
        acquisitionPrice.trim() !== '' &&
        acquisitionDate !== '' &&
        transferDate !== '' &&
        amountFields.every((f) => amountError(f.value) === null) &&
        monthsError === null

    function buildResult(): CapitalGainsResult | null {
        if (!ready) return null
        const input: CapitalGainsInput = {
            assetType,
            transferPrice: amountValue(transferPrice),
            acquisitionPrice: amountValue(acquisitionPrice),
            expenses: amountValue(expenses),
            acquisitionDate,
            transferDate,
            oneHouseOneHousehold: isHouse && oneHouse,
            adjustedAreaAtAcquisition: isHouse && adjustedAtAcquisition,
            residenceMonths: residenceMonths.trim() === '' ? 0 : Number(residenceMonths),
            housesOwned: isHouse ? housesOwned : 1,
            adjustedAreaAtTransfer: isHouse && adjustedAtTransfer,
            heavyTaxExcluded,
            basicDeductionUsed: amountValue(basicDeductionUsed),
            assumeLatestRules,
        }
        return calculateCapitalGains(input)
    }

    const result: CapitalGainsResult | null = buildResult()

    const summaryLines = result?.ok
        ? [
              { label: '자산 구분', value: CG_ASSET_LABELS[assetType] },
              { label: '보유기간', value: `${result.holdingYears}년 (${result.holdingDays.toLocaleString('ko-KR')}일)` },
              ...result.steps.map((s) => ({ label: s.label, value: s.value, note: s.expression })),
          ]
        : []

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-2 text-3xl font-bold">양도소득세 계산기</h1>
            <p className="mb-6 text-slate-500">
                장기보유특별공제 · 1세대 1주택 비과세 · 단기 보유 세율 · 조정대상지역 다주택 중과까지 반영 · 참고용
            </p>

            <div className="calc-card space-y-5 p-6">
                <h2 className="text-base font-bold text-slate-800">양도 정보 입력</h2>

                <div>
                    <label htmlFor="assetType" className="calc-label">자산 구분</label>
                    <select
                        id="assetType"
                        value={assetType}
                        onChange={(e) => setAssetType(e.target.value as CgAssetType)}
                        className={selectClass}
                    >
                        {ASSET_ORDER.map((v) => (
                            <option key={v} value={v}>{CG_ASSET_LABELS[v]}</option>
                        ))}
                    </select>
                    <p className="calc-hint">주택·조합원입주권·분양권은 단기 보유 세율이 다릅니다.</p>
                </div>

                {amountFields.map(({ id, label, value, set, hint, required }) => (
                    <div key={id}>
                        <label htmlFor={id} className="calc-label">
                            {label} {required && <span className="text-red-400">*</span>}
                        </label>
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
                                placeholder="예: 500,000,000"
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="acquisitionDate" className="calc-label">취득일 <span className="text-red-400">*</span></label>
                        <input
                            type="date"
                            id="acquisitionDate"
                            value={acquisitionDate}
                            onChange={(e) => setAcquisitionDate(e.target.value)}
                            aria-describedby="acquisitionDate-hint"
                            className="calc-input"
                        />
                        <p id="acquisitionDate-hint" className="calc-hint">원칙적으로 대금 청산일 (「소득세법」 제98조)</p>
                    </div>
                    <div>
                        <label htmlFor="transferDate" className="calc-label">양도일 <span className="text-red-400">*</span></label>
                        <input
                            type="date"
                            id="transferDate"
                            value={transferDate}
                            onChange={(e) => setTransferDate(e.target.value)}
                            aria-describedby="transferDate-hint"
                            className="calc-input"
                        />
                        <p id="transferDate-hint" className="calc-hint">세율·공제표는 양도 연도 기준으로 적용됩니다</p>
                    </div>
                </div>

                {isHouse && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                        <h3 className="text-sm font-bold text-slate-800">주택 정보</h3>

                        <Toggle
                            id="oneHouse"
                            label="양도일 현재 1세대 1주택이다"
                            hint="비과세(12억 이하)와 장기보유특별공제 표 2(최대 80%) 판정에 사용합니다."
                            checked={oneHouse}
                            onChange={setOneHouse}
                        />

                        {oneHouse && (
                            <Toggle
                                id="adjustedAtAcquisition"
                                label="취득 당시 조정대상지역이었다"
                                hint="이 경우 보유 2년에 더해 거주 2년 이상이 있어야 비과세됩니다. (영 제154조 제1항)"
                                checked={adjustedAtAcquisition}
                                onChange={setAdjustedAtAcquisition}
                            />
                        )}

                        <div>
                            <label htmlFor="residenceMonths" className="calc-label">보유기간 중 거주기간</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    id="residenceMonths"
                                    value={residenceMonths}
                                    onChange={(e) => setResidenceMonths(e.target.value)}
                                    aria-invalid={monthsError !== null}
                                    aria-describedby={monthsError ? 'residenceMonths-error' : 'residenceMonths-hint'}
                                    placeholder="예: 24"
                                    className="calc-input pr-14"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">개월</span>
                            </div>
                            {monthsError && (
                                <p id="residenceMonths-error" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                                    {monthsError}
                                </p>
                            )}
                            <p id="residenceMonths-hint" className="calc-hint">
                                거주 2년(24개월) 이상이어야 장기보유특별공제 표 2가 적용됩니다.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="housesOwned" className="calc-label">양도일 현재 1세대 보유 주택 수</label>
                            <select
                                id="housesOwned"
                                value={housesOwned}
                                onChange={(e) => setHousesOwned(Number(e.target.value) as HouseCount)}
                                aria-describedby="housesOwned-hint"
                                className={selectClass}
                            >
                                {([1, 2, 3] as HouseCount[]).map((v) => (
                                    <option key={v} value={v}>{HOUSE_COUNT_LABELS[v]}</option>
                                ))}
                            </select>
                            <p id="housesOwned-hint" className="calc-hint">조합원입주권·분양권도 주택 수에 포함해 세어 주세요.</p>
                        </div>

                        {housesOwned > 1 && (
                            <>
                                <Toggle
                                    id="adjustedAtTransfer"
                                    label="양도하는 주택이 조정대상지역에 있다"
                                    hint="조정대상지역이 아니면 다주택이어도 중과되지 않습니다. (법 제104조 제7항)"
                                    checked={adjustedAtTransfer}
                                    onChange={setAdjustedAtTransfer}
                                />
                                {adjustedAtTransfer && (
                                    <Toggle
                                        id="heavyTaxExcluded"
                                        label="중과 배제 대상에 해당한다"
                                        hint={`장기임대주택·상속주택·기준시가 3억원 이하 지방 저가주택, ${HEAVY_TAX_GRACE_LAST_DATE}까지 매매계약을 체결한 주택의 경과조치 등. 해당 여부는 국세청에 확인하세요.`}
                                        checked={heavyTaxExcluded}
                                        onChange={setHeavyTaxExcluded}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}

                {transferDate !== '' && Number(transferDate.slice(0, 4)) > LAST_VERIFIED_CG_YEAR && (
                    <Toggle
                        id="assumeLatestRules"
                        label={`${LAST_VERIFIED_CG_YEAR}년 기준을 가정하고 계산한다`}
                        hint={`양도 연도가 ${LAST_VERIFIED_CG_YEAR}년 이후입니다. 이 계산기가 법령 원문으로 확인한 마지막 연도의 세율·공제표를 그대로 적용합니다.`}
                        checked={assumeLatestRules}
                        onChange={setAssumeLatestRules}
                    />
                )}
            </div>

            {result === null ? (
                <div className="mt-6 flex h-36 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
                    양도가액·취득가액과 취득일·양도일을 입력하면 계산됩니다
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
                    <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
                            예상 총 부담세액 (지방소득세 포함)
                        </p>
                        <p className="text-4xl font-black tabular-nums">
                            {result.totalTax.toLocaleString('ko-KR')}<span className="ml-1 text-2xl font-bold">원</span>
                        </p>
                        <p className="mt-2 text-sm text-blue-100">
                            보유 {result.holdingYears}년 · 양도차익 {won(result.grossGain)}
                            {result.exemption?.fullyExempt && ' · 1세대 1주택 비과세'}
                        </p>
                        {result.status === 'verificationRequired' && (
                            <p className="mt-2 inline-block rounded-full bg-orange-400/20 px-3 py-1 text-xs font-medium text-orange-100">
                                검증 필요 — 확정되지 않은 판단 포함
                            </p>
                        )}
                    </div>

                    {result.exemption?.fullyExempt && (
                        <div className="calc-card border-emerald-100 bg-emerald-50 p-5">
                            <p className="mb-1 text-base font-bold text-emerald-700">1세대 1주택 비과세</p>
                            <p className="text-sm text-emerald-700">
                                양도가액이 {won(HIGH_PRICE_HOUSE_THRESHOLD)} 이하이고 보유·거주 요건을 갖춰 양도소득세가 발생하지 않습니다.
                            </p>
                        </div>
                    )}

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
                            <dt className="text-sm text-slate-600">보유기간</dt>
                            <dd className="text-sm font-semibold text-slate-900">
                                {result.holdingYears}년 ({result.holdingDays.toLocaleString('ko-KR')}일)
                            </dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">적용 세율</dt>
                            <dd className="max-w-[60%] text-right text-sm font-semibold text-slate-900">{result.rate.label}</dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">양도소득세</dt>
                            <dd className="text-sm font-semibold text-slate-900">{won(result.incomeTax)}</dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">지방소득세 (10%)</dt>
                            <dd className="text-sm font-semibold text-slate-900">{won(result.localTax)}</dd>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5">
                            <dt className="text-sm font-semibold text-slate-800">총 부담세액</dt>
                            <dd className="text-base font-bold text-slate-900">{won(result.totalTax)}</dd>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5">
                            <dt className="text-sm text-slate-600">세후 남는 차익</dt>
                            <dd className="text-sm font-semibold text-slate-900">{won(result.netProceeds)}</dd>
                        </div>
                    </dl>

                    {result.rate.compared.length > 1 && (
                        <div className="calc-card p-5">
                            <h3 className="mb-2 text-sm font-bold text-slate-700">세율 경합 비교</h3>
                            <p className="mb-3 text-xs text-slate-500">
                                「소득세법」 제104조 제7항 후단에 따라 두 산출세액 중 큰 금액을 적용합니다.
                            </p>
                            <ul className="space-y-2">
                                {result.rate.compared.map((c) => (
                                    <li key={c.label} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{c.label}</span>
                                        <span className={`font-bold tabular-nums ${c.tax === result.incomeTax ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {won(c.tax)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.thresholds.length > 0 && (
                        <div className="calc-card p-5">
                            <h3 className="mb-2 text-sm font-bold text-slate-700">보유기간 요건 충족일</h3>
                            <p className="mb-3 text-xs text-slate-500">
                                보유기간은 취득일부터 양도일까지로 계산하며 초일을 산입합니다. (법 제95조 제4항)
                            </p>
                            <ul className="space-y-1.5">
                                {result.thresholds.map((t) => (
                                    <li key={t.years} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{t.years}년 충족일</span>
                                        <span className={`font-semibold tabular-nums ${t.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {t.date} {t.met ? '충족' : '미충족'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
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

                    {result.notes.length > 0 && (
                        <div className="calc-card p-5">
                            <p className="mb-2 text-sm font-bold text-slate-700">계산 안내</p>
                            <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
                                {result.notes.map((n) => <li key={n}>{n}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className="calc-card p-5">
                        <p className="mb-2 text-sm font-bold text-slate-700">이 계산기가 반영하지 않는 조건</p>
                        <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
                            {result.unsupported.map((n) => <li key={n}>{n}</li>)}
                        </ul>
                        <p className="mt-3 text-xs text-slate-500">
                            해당하는 조건이 있으면 국세청 홈택스 양도소득세 모의계산 또는 세무 전문가를 통해 확인하세요.
                        </p>
                    </div>

                    <ResultActions
                        title={`양도소득세 예상액 — ${CG_ASSET_LABELS[assetType]} (${result.year}년 양도)`}
                        lines={summaryLines}
                        footer={[
                            '근거: 소득세법 제89조·제95조·제103조·제104조, 같은 법 시행령 제154조·제156조·제159조의4·제160조·제167조의3',
                            '이 결과는 참고용이며 세무 자문이 아닙니다. 실제 신고 세액은 국세청 홈택스에서 확인하세요.',
                            'taxsim.kr 양도소득세 계산기',
                        ]}
                    />
                </div>
            )}

            <section className="mt-12 space-y-8 text-sm leading-relaxed text-slate-600">
                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">양도소득세 계산 구조</h2>
                    <p>
                        <strong>양도차익 = 양도가액 − 취득가액 − 필요경비</strong> 로 시작합니다. 여기서 장기보유특별공제를 빼면
                        양도소득금액이 되고, 연 250만원의 기본공제를 뺀 과세표준에 세율을 적용합니다. 양도소득세는 소득세의
                        한 종류이므로 <strong>산출세액의 10%가 지방소득세로 추가</strong>됩니다.
                    </p>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">보유기간별 세율 (「소득세법」 제104조 제1항)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[420px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">보유기간</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">주택·조합원입주권</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">분양권</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">그 밖의 토지·건물</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ['1년 미만', '70%', '70%', '50%'],
                                    ['1년 이상 2년 미만', '60%', '60%', '40%'],
                                    ['2년 이상', '기본세율 6~45%', '60%', '기본세율 6~45%'],
                                ].map(([period, house, sales, land]) => (
                                    <tr key={period} className="bg-white">
                                        <td className="px-3 py-2 text-slate-600">{period}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{house}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{sales}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{land}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">장기보유특별공제 (「소득세법」 제95조 제2항)</h2>
                    <p className="mb-3">
                        보유기간 3년 이상이면 양도차익의 일정 비율을 공제합니다. 일반 자산은 표 1(최대 30%), 양도일 현재
                        1세대 1주택이면서 보유기간 중 거주기간이 2년 이상이면 표 2(보유 최대 40% + 거주 최대 40% = 최대 80%)를
                        적용합니다.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[440px] border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">기간</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">표 1 (일반)</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">표 2 보유</th>
                                    <th className="px-3 py-2 text-right font-semibold text-slate-600">표 2 거주</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    ['2년 이상 3년 미만', '—', '—', '8%'],
                                    ['3년 이상', '6%', '12%', '12%'],
                                    ['5년 이상', '10%', '20%', '20%'],
                                    ['7년 이상', '14%', '28%', '28%'],
                                    ['10년 이상', '20%', '40%', '40%'],
                                    ['15년 이상', '30%', '40%', '40%'],
                                ].map(([period, t1, t2h, t2r]) => (
                                    <tr key={period} className="bg-white">
                                        <td className="px-3 py-2 text-slate-600">{period}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{t1}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{t2h}</td>
                                        <td className="px-3 py-2 text-right font-bold text-blue-600">{t2r}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        표 2의 거주기간 공제 8%(2년 이상 3년 미만)는 보유기간 3년 이상인 경우에만 적용됩니다.
                    </p>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">1세대 1주택 비과세</h2>
                    <ul className="list-disc space-y-1 pl-5">
                        <li>양도일 현재 1세대가 국내에 1주택을 보유하고 <strong>보유기간 2년 이상</strong> (영 제154조 제1항)</li>
                        <li>취득 당시 조정대상지역이었다면 <strong>보유 2년 + 거주 2년 이상</strong></li>
                        <li>양도가액(실지거래가액)이 <strong>12억원 이하</strong>면 전액 비과세 (법 제89조 제1항 제3호)</li>
                        <li>12억원을 초과하는 고가주택은 <strong>양도차익 × (양도가액 − 12억원) ÷ 양도가액</strong> 만 과세 (영 제160조)</li>
                    </ul>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">조정대상지역 다주택 중과</h2>
                    <p className="mb-2">
                        조정대상지역에 있는 주택을 1세대 2주택이면 기본세율 + 20%p, 3주택 이상이면 기본세율 + 30%p로 과세하고
                        <strong> 장기보유특별공제를 적용하지 않습니다</strong>. 보유기간이 2년 미만이면 중과세액과 단기 보유
                        세액 중 큰 금액을 적용합니다. (법 제104조 제7항)
                    </p>
                    <p>
                        보유기간 2년 이상 주택에 대한 중과 한시 배제는 <strong>{HEAVY_TAX_GRACE_LAST_DATE} 양도분까지</strong>였습니다
                        (영 제167조의3 제1항 제12호의2). 다만 그날까지 매매계약을 체결한 주택에는 경과조치가 있고,
                        장기임대주택·상속주택·기준시가 3억원 이하 지방 저가주택 등은 계속 중과에서 제외됩니다.
                    </p>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">신고 시기와 절차</h2>
                    <p>
                        부동산 등의 양도소득세는 <strong>양도일이 속하는 달의 말일부터 2개월 이내</strong>에 예정신고·납부합니다.
                        같은 해에 두 건 이상 양도했다면 다음 해 5월에 확정신고로 합산 정산합니다. 납부세액이 1,000만원을
                        초과하면 2개월 분납이 가능합니다.
                    </p>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-bold text-slate-800">자주 묻는 질문</h2>
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="mb-1 font-semibold text-slate-800">Q. 보유기간 2년은 언제 채워지나요?</p>
                            <p>
                                「소득세법」 제95조 제4항은 보유기간을 취득일부터 양도일까지로 정합니다. 초일을 산입하므로
                                2024년 1월 1일 취득한 주택은 2025년 12월 31일 양도부터 2년 요건을 충족합니다. 다만 취득·양도
                                시기는 원칙적으로 대금 청산일로 판단하므로(법 제98조), 하루 차이로 갈리는 경우에는 반드시
                                국세청에 확인하세요.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="mb-1 font-semibold text-slate-800">Q. 1세대 1주택인데 거주를 안 했으면 어떻게 되나요?</p>
                            <p>
                                취득 당시 비조정대상지역이었다면 보유 2년만으로 비과세됩니다. 다만 12억원을 넘는 고가주택의
                                장기보유특별공제는 거주 2년 이상이어야 표 2(최대 80%)가 적용되고, 그렇지 않으면 표 1(최대 30%)이
                                적용됩니다. (영 제159조의4)
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="mb-1 font-semibold text-slate-800">Q. 분양권도 장기보유특별공제를 받나요?</p>
                            <p>
                                받지 못합니다. 분양권은 보유기간과 무관하게 60%(1년 미만 70%)의 단일세율이 적용되고 장기보유
                                특별공제 대상이 아닙니다.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 p-4">
                            <p className="mb-1 font-semibold text-slate-800">Q. 일시적 2주택인데 중과되나요?</p>
                            <p>
                                이 계산기는 일시적 2주택·상속주택·동거봉양 등 1세대 1주택 특례(영 제155조)를 판정하지 않습니다.
                                해당하면 &lsquo;중과 배제 대상&rsquo;을 선택하거나 국세청 모의계산으로 확인하세요.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
                    <p className="mb-1 font-semibold text-slate-800">⚠️ 참고용 안내</p>
                    <p>
                        이 계산기는 장기보유특별공제, 1세대 1주택 비과세, 단기 보유 세율, 조정대상지역 다주택 중과를 반영하지만,
                        1세대 1주택 특례·감면·이월과세·비사업용 토지·미등기양도·주식 등은 반영하지 않습니다. 정확한 신고는
                        국세청 홈택스 또는 세무 전문가를 통해 확인하시기 바랍니다.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="mb-2 text-base font-bold text-slate-800">함께 보면 좋은 문서</h2>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link href="/guide/one-house-exemption" className="font-semibold text-blue-700 hover:underline">
                            1세대 1주택 양도세 비과세 요건 총정리 →
                        </Link>
                        <Link href="/guide/long-term-holding-deduction" className="font-semibold text-blue-700 hover:underline">
                            장기보유특별공제 완전 정리 →
                        </Link>
                        <Link href="/guide/capital-gains-expenses" className="font-semibold text-blue-700 hover:underline">
                            양도세 필요경비, 인정되는 것과 안 되는 것 →
                        </Link>
                        <Link href="/property-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            재산세 계산기 — 보유할 때의 세금 →
                        </Link>
                        <Link href="/comprehensive-real-estate-tax-calculator" className="font-semibold text-blue-700 hover:underline">
                            종합부동산세 계산기 →
                        </Link>
                        <Link href="/tax-calendar" className="font-semibold text-blue-700 hover:underline">
                            세금 납부 일정 달력 →
                        </Link>
                    </div>
                </div>

                <SourceNote calculator="capital-gains-tax-calculator" />
            </section>

            <RelatedCalculators current="capital-gains-tax-calculator" />
        </main>
    )
}
