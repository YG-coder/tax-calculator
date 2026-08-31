"use client";

import { useMemo, useState } from "react";
import {
  CAR_TAX_YEAR,
  LAST_VERIFIED_PREPAY_YEAR,
  MAX_CC,
  MAX_LOAD_KG,
  PREPAY_TIMING_LABELS,
  isPrepayTimingSupported,
  VAN_CLASS_LABELS,
  calculateCarTax,
  parseIntegerInput,
  type CarTaxInput,
  type PrepayTiming,
  type SpecialClass,
  type TaxPeriod,
  type Usage,
  type VanClass,
  type VehicleType,
} from "@/lib/tax/rules/car-tax";

const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;

const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: "passenger", label: "승용자동차 (배기량 과세)" },
  { value: "otherPassenger", label: "전기·수소 등 배기량 없는 승용자동차" },
  { value: "van", label: "승합자동차" },
  { value: "truck", label: "화물자동차" },
  { value: "special", label: "특수자동차" },
];

const PERIOD_OPTIONS: { value: TaxPeriod; label: string }[] = [
  { value: "year", label: "연간" },
  { value: "first", label: "제1기분 (1~6월)" },
  { value: "second", label: "제2기분 (7~12월)" },
];

const PREPAY_OPTIONS: PrepayTiming[] = ["none", "jan", "mar", "jun", "sep"];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";
const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";

export default function CarTaxClient() {
  const [usage, setUsage] = useState<Usage>("nonBusiness");
  const [vehicleType, setVehicleType] = useState<VehicleType>("passenger");
  const [ccText, setCcText] = useState("1998");
  const [vanClass, setVanClass] = useState<VanClass>("smallRegularBus");
  const [loadText, setLoadText] = useState("1000");
  const [specialClass, setSpecialClass] = useState<SpecialClass>("small");
  const [registeredAt, setRegisteredAt] = useState("2020-03-01");
  const [period, setPeriod] = useState<TaxPeriod>("year");
  const [prepay, setPrepay] = useState<PrepayTiming>("none");
  const [prorateKind, setProrateKind] = useState<"none" | "newRegistration" | "deregistration">("none");
  const [prorateDate, setProrateDate] = useState("");
  const [alreadyPaidText, setAlreadyPaidText] = useState("");
  const [assumeLatestPrepayRate, setAssumeLatestPrepayRate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const needsCc = vehicleType === "passenger";
  const needsLoad = vehicleType === "truck";
  const needsVanClass = vehicleType === "van";
  const needsSpecialClass = vehicleType === "special";
  const showAlreadyPaid = prorateKind === "deregistration";
  const showAssumption = prepay !== "none" && CAR_TAX_YEAR > LAST_VERIFIED_PREPAY_YEAR;

  const ccParsed = useMemo(() => (needsCc ? parseIntegerInput(ccText, MAX_CC) : null), [ccText, needsCc]);
  const loadParsed = useMemo(() => (needsLoad ? parseIntegerInput(loadText, MAX_LOAD_KG) : null), [loadText, needsLoad]);
  const paidParsed = useMemo(
    () => (showAlreadyPaid && alreadyPaidText.trim() !== "" ? parseIntegerInput(alreadyPaidText, 100_000_000) : null),
    [alreadyPaidText, showAlreadyPaid],
  );

  const ccError = submitted && ccParsed && !ccParsed.ok ? ccParsed.reason : null;
  const loadError = submitted && loadParsed && !loadParsed.ok ? loadParsed.reason : null;
  const paidError = submitted && paidParsed && !paidParsed.ok ? paidParsed.reason : null;

  const input: CarTaxInput = {
    year: CAR_TAX_YEAR,
    usage,
    vehicleType,
    displacementCc: ccParsed && ccParsed.ok ? ccParsed.value : null,
    loadCapacityKg: loadParsed && loadParsed.ok ? loadParsed.value : null,
    vanClass: needsVanClass ? vanClass : null,
    specialClass: needsSpecialClass ? specialClass : null,
    firstRegistrationDate: registeredAt || null,
    period,
    prepay,
    prorate: prorateKind === "none" ? null : { kind: prorateKind, date: prorateDate },
    alreadyPaid: showAlreadyPaid && paidParsed && paidParsed.ok ? paidParsed.value : null,
    assumeLatestPrepayRate,
  };

  const blocked = Boolean(ccError || loadError || paidError);
  const result = submitted && !blocked ? calculateCarTax(input) : null;

  return (
    <div className="space-y-8">
      <form
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <fieldset className="space-y-5">
          <legend className="sr-only">자동차세 계산 조건</legend>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-800">차량 용도</span>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="차량 용도">
              {([
                { value: "nonBusiness", label: "비영업용" },
                { value: "business", label: "영업용" },
              ] as { value: Usage; label: string }[]).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={usage === option.value}
                  onClick={() => setUsage(option.value)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    usage === option.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              영업용은 여객·화물자동차 운수사업 면허(등록)를 받아 일반의 수요에 제공하는 차량입니다.
            </p>
          </div>

          <div>
            <label htmlFor="vehicle-type" className="mb-2 block text-sm font-semibold text-slate-800">
              차량 종류
            </label>
            <select
              id="vehicle-type"
              value={vehicleType}
              onChange={(event) => setVehicleType(event.target.value as VehicleType)}
              className={selectClass}
            >
              {VEHICLE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {needsCc && (
            <div>
              <label htmlFor="cc" className="mb-2 block text-sm font-semibold text-slate-800">
                배기량 (cc)
              </label>
              <input
                id="cc"
                inputMode="numeric"
                value={ccText}
                onChange={(event) => setCcText(event.target.value)}
                aria-invalid={ccError ? true : undefined}
                aria-describedby={ccError ? "cc-error" : "cc-help"}
                className={inputClass}
              />
              {ccError ? (
                <p id="cc-error" role="alert" className="mt-1.5 text-xs text-red-600">
                  {ccError}
                </p>
              ) : (
                <p id="cc-help" className="mt-1.5 text-xs text-slate-500">
                  자동차등록증에 기재된 배기량을 그대로 입력하세요. (최대 {MAX_CC.toLocaleString("ko-KR")}cc)
                </p>
              )}
            </div>
          )}

          {needsLoad && (
            <div>
              <label htmlFor="load" className="mb-2 block text-sm font-semibold text-slate-800">
                적재정량 (kg)
              </label>
              <input
                id="load"
                inputMode="numeric"
                value={loadText}
                onChange={(event) => setLoadText(event.target.value)}
                aria-invalid={loadError ? true : undefined}
                aria-describedby={loadError ? "load-error" : "load-help"}
                className={inputClass}
              />
              {loadError ? (
                <p id="load-error" role="alert" className="mt-1.5 text-xs text-red-600">
                  {loadError}
                </p>
              ) : (
                <p id="load-help" className="mt-1.5 text-xs text-slate-500">
                  적재정량 1만kg 이하만 지원합니다.
                </p>
              )}
            </div>
          )}

          {needsVanClass && (
            <div>
              <label htmlFor="van-class" className="mb-2 block text-sm font-semibold text-slate-800">
                승합자동차 종류
              </label>
              <select
                id="van-class"
                value={vanClass}
                onChange={(event) => setVanClass(event.target.value as VanClass)}
                className={selectClass}
              >
                {(Object.keys(VAN_CLASS_LABELS) as VanClass[]).map((key) => (
                  <option key={key} value={key}>
                    {VAN_CLASS_LABELS[key]}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                대형·소형 구분은 자동차등록증과 「지방세법 시행령」 제123조의 종류 구분을 따릅니다.
              </p>
            </div>
          )}

          {needsSpecialClass && (
            <div>
              <label htmlFor="special-class" className="mb-2 block text-sm font-semibold text-slate-800">
                특수자동차 규모
              </label>
              <select
                id="special-class"
                value={specialClass}
                onChange={(event) => setSpecialClass(event.target.value as SpecialClass)}
                className={selectClass}
              >
                <option value="large">대형특수자동차</option>
                <option value="small">소형특수자동차</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="registered-at" className="mb-2 block text-sm font-semibold text-slate-800">
              최초 등록일
            </label>
            <input
              id="registered-at"
              type="date"
              value={registeredAt}
              min="1950-01-01"
              max={`${CAR_TAX_YEAR}-12-31`}
              onChange={(event) => setRegisteredAt(event.target.value)}
              aria-describedby="registered-help"
              className={inputClass}
            />
            <p id="registered-help" className="mt-1.5 text-xs text-slate-500">
              차령 경감은 비영업용 승용자동차(배기량 과세)에만 적용됩니다. 제작연도에 등록되지 않은 차량은 제작연도
              말일이 기산일입니다.
            </p>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-800">과세 기간</span>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="과세 기간">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={period === option.value}
                  onClick={() => setPeriod(option.value)}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition sm:text-sm ${
                    period === option.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="prepay" className="mb-2 block text-sm font-semibold text-slate-800">
              연납(선납) 신청 시기
            </label>
            <select
              id="prepay"
              value={prepay}
              onChange={(event) => setPrepay(event.target.value as PrepayTiming)}
              aria-describedby="prepay-help"
              className={selectClass}
            >
              {PREPAY_OPTIONS.map((value) => {
                const supported = isPrepayTimingSupported(value);
                return (
                  <option key={value} value={value} disabled={!supported}>
                    {PREPAY_TIMING_LABELS[value]}
                    {supported ? "" : " — 공식 고지 방식 확인 중"}
                  </option>
                );
              })}
            </select>
            <p id="prepay-help" className="mt-1.5 text-xs text-slate-500">
              공제액은 고정 할인율이 아니라 납부기한 다음 날부터 12월 31일까지의 실제 일수로 계산합니다.
            </p>
            <p className="mt-1.5 text-xs text-amber-700">
              6월·9월 연납은 공식 고지 방식 확인 중이라 선택할 수 없습니다. 「지방세법 시행령」 제125조 제3항이 6월분을
              ‘제2기분에 해당하는 세액’으로 규정하는데, 이 계산기의 일수 비례 방식과 일치하는지 확인되지 않았습니다.
              해당 시기의 연납액은 위택스 고지 내용을 확인해 주세요.
            </p>
            {showAssumption && (
              <div className="mt-3 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                <input
                  id="assume-rate"
                  type="checkbox"
                  checked={assumeLatestPrepayRate}
                  onChange={(event) => setAssumeLatestPrepayRate(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-orange-300"
                />
                <label htmlFor="assume-rate" className="text-xs leading-relaxed text-orange-900">
                  {CAR_TAX_YEAR}년 연납 공제 이자율은 확인되지 않았습니다. {LAST_VERIFIED_PREPAY_YEAR}년 기준(100분의
                  5)을 가정하고 계산합니다.
                </label>
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-xl bg-slate-50 p-4">
            <label htmlFor="prorate-kind" className="block text-sm font-semibold text-slate-800">
              일할계산 (선택)
            </label>
            <select
              id="prorate-kind"
              value={prorateKind}
              onChange={(event) => setProrateKind(event.target.value as typeof prorateKind)}
              aria-describedby="prorate-help"
              className={selectClass}
            >
              <option value="none">해당 없음 (연간 보유)</option>
              <option value="newRegistration">{CAR_TAX_YEAR}년 중 신규등록</option>
              <option value="deregistration">{CAR_TAX_YEAR}년 중 말소등록</option>
            </select>
            {prorateKind !== "none" && (
              <input
                type="date"
                value={prorateDate}
                min={`${CAR_TAX_YEAR}-01-01`}
                max={`${CAR_TAX_YEAR}-12-31`}
                onChange={(event) => setProrateDate(event.target.value)}
                aria-label={prorateKind === "newRegistration" ? "신규등록일" : "말소등록일"}
                className={inputClass}
              />
            )}
            {showAlreadyPaid && (
              <div>
                <label htmlFor="already-paid" className="mb-1.5 block text-xs font-medium text-slate-700">
                  연간 기납부액 (자동차세 + 지방교육세, 선택)
                </label>
                <input
                  id="already-paid"
                  inputMode="numeric"
                  value={alreadyPaidText}
                  placeholder="예: 390000"
                  onChange={(event) => setAlreadyPaidText(event.target.value)}
                  aria-invalid={paidError ? true : undefined}
                  aria-describedby={paidError ? "already-paid-error" : "already-paid-help"}
                  className={inputClass}
                />
                {paidError ? (
                  <p id="already-paid-error" role="alert" className="mt-1.5 text-xs text-red-600">
                    {paidError}
                  </p>
                ) : (
                  <p id="already-paid-help" className="mt-1.5 text-xs text-slate-500">
                    환급 산정은 연간 기준입니다. 해당 연도에 실제로 납부한 총액을 입력하세요. 비워두면 환급 예상액을
                    계산하지 않습니다.
                  </p>
                )}
              </div>
            )}
            <p id="prorate-help" className="text-xs text-slate-500">
              매매·증여에 따른 승계취득(양도·양수)은 지원하지 않습니다. 일할계산과 연납은 함께 계산하지 않습니다.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            자동차세 계산하기
          </button>
        </fieldset>
      </form>

      <div aria-live="polite">
        {submitted && blocked && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">입력값을 확인해 주세요</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {[ccError, loadError, paidError].filter(Boolean).map((message) => (
                <li key={message as string}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {result && !result.ok && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">계산할 수 없습니다</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {result.errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {result && result.ok && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-900 p-6 text-center text-white">
              <p className="text-sm text-slate-300">
                {result.year}년 {PERIOD_OPTIONS.find((o) => o.value === result.period)?.label} 예상 납부액
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight">{won(result.finalPayable)}</p>
              {result.prepay && (
                <p className="mt-2 text-sm text-slate-300">
                  연납 공제 {won(result.prepay.totalDeduction)} 반영 (공제 전 {won(result.subtotal)})
                </p>
              )}
              {result.status === "verificationRequired" && (
                <p className="mt-2 inline-block rounded-full bg-orange-400/20 px-3 py-1 text-xs font-medium text-orange-200">
                  검증 필요 — 확정되지 않은 계산 포함
                </p>
              )}
            </div>

            <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-slate-600">자동차세 본세</dt>
                <dd className="text-sm font-semibold text-slate-900">{won(result.carTax)}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-slate-600">지방교육세</dt>
                <dd className="text-sm font-semibold text-slate-900">{won(result.educationTax)}</dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-slate-600">
                  차령 경감액
                  {result.ageDiscountRate > 0 && (
                    <span className="ml-1.5 text-xs text-slate-500">
                      (경감률 {(result.ageDiscountRate * 100).toFixed(0)}%)
                    </span>
                  )}
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {result.ageReduction > 0 ? `−${won(result.ageReduction)}` : "해당 없음"}
                </dd>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <dt className="text-sm text-slate-600">
                  연납 공제액
                  {result.prepay && (
                    <span className="ml-1.5 text-xs text-slate-500">
                      ({result.prepay.deductiblePeriod.days}일 / 365일 × {(result.prepay.interestRate * 100).toFixed(0)}%)
                    </span>
                  )}
                </dt>
                <dd className="text-sm font-semibold text-slate-900">
                  {result.prepay ? `−${won(result.prepay.totalDeduction)}` : "해당 없음"}
                </dd>
              </div>
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5">
                <dt className="text-sm font-semibold text-slate-800">최종 납부액</dt>
                <dd className="text-base font-bold text-slate-900">{won(result.finalPayable)}</dd>
              </div>
            </dl>

            {result.proration && (
              <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                <div className="px-5 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    일할계산 · {result.proration.kind === "newRegistration" ? "신규등록" : "말소등록"}{" "}
                    {result.proration.date}
                  </p>
                  {result.refund && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      환급 산정은 과세기간 선택과 무관하게 연간 기준입니다.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <dt className="text-sm text-slate-600">연간세액 (차령 경감 후, 일할 전)</dt>
                  <dd className="text-sm text-slate-900">{won(result.proration.annualTax)}</dd>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <dt className="text-sm text-slate-600">연간 일할계산 후 부담액</dt>
                  <dd className="text-sm text-slate-900">{won(result.proration.annualProratedTax)}</dd>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <dt className="text-sm text-slate-600">선택한 기분 세액 (일할 전)</dt>
                  <dd className="text-sm text-slate-900">{won(result.proration.periodTax)}</dd>
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                  <dt className="text-sm text-slate-600">선택한 기분 일할 후 부담액</dt>
                  <dd className="text-sm text-slate-900">{won(result.proration.periodProratedTax)}</dd>
                </div>
                {result.refund && (
                  <>
                    <div className="flex items-center justify-between px-5 py-3">
                      <dt className="text-sm text-slate-600">연간 기납부액</dt>
                      <dd className="text-sm text-slate-900">{won(result.refund.alreadyPaid)}</dd>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 px-5 py-3">
                      <dt className="text-sm font-semibold text-slate-800">
                        {result.refund.estimatedRefund < 0 ? "추가 납부 예상액" : "환급 예상액"}
                      </dt>
                      <dd className="text-base font-bold text-slate-900">
                        {won(Math.abs(result.refund.estimatedRefund))}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-800">계산 과정</h3>
              <ol className="mt-3 space-y-3">
                {result.steps.map((step) => (
                  <li key={step.label} className="text-sm">
                    <p className="font-medium text-slate-800">{step.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{step.expression}</p>
                    <p className="mt-0.5 font-semibold text-slate-900">{step.value}</p>
                  </li>
                ))}
              </ol>
            </div>

            {result.halves.length > 1 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <caption className="sr-only">기분별 세액 내역</caption>
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 text-left font-medium">
                        구분
                      </th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">
                        차령
                      </th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">
                        자동차세
                      </th>
                      <th scope="col" className="px-4 py-2.5 text-right font-medium">
                        지방교육세
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.halves.map((half) => (
                      <tr key={half.half}>
                        <th scope="row" className="px-4 py-2.5 text-left font-normal text-slate-700">
                          제{half.half}기분
                        </th>
                        <td className="px-4 py-2.5 text-right text-slate-600">
                          {half.vehicleAge === null ? "—" : `${half.vehicleAge}년`}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-900">{won(half.carTax)}</td>
                        <td className="px-4 py-2.5 text-right text-slate-900">{won(half.educationTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.status === "verificationRequired" && (
              <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">
                <p className="text-sm font-semibold text-orange-900">검증 필요</p>
                <p className="mt-1 text-xs text-orange-800">
                  아래 사유로 근거를 확정하지 못한 계산이 결과에 포함되어 있습니다. 이 금액은 참고용으로만 사용하고
                  위택스 고지 내용과 대조하세요.
                </p>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-orange-900">
                  {result.verificationNotes.map((note) => (
                    <li key={note}>· {note}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.notes.length > 0 && (
              <ul className="space-y-1.5 rounded-2xl bg-slate-50 p-5 text-xs leading-relaxed text-slate-600">
                {result.notes.map((note) => (
                  <li key={note}>· {note}</li>
                ))}
              </ul>
            )}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-relaxed text-amber-900">
              실제 고지액은 최초 등록일, 과세기준일(6월 1일·12월 1일) 현재의 소유 관계, 이전·말소등록에 따른 일할계산,
              지방자치단체의 탄력세율 조례, 감면 적용 여부에 따라 달라질 수 있습니다. 납부할 정확한 금액은 위택스 또는
              관할 시·군·구청 고지서에서 확인하세요.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
