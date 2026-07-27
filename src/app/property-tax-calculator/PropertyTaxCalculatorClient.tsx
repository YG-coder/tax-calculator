"use client";

// app/property-tax-calculator/PropertyTaxCalculatorClient.tsx
// ⚠️ Tailwind 클래스는 중립값. 기존 계산기(CapitalGainsTaxClient 등)의 카드/버튼/입력
//    컨벤션에 맞춰 스타일만 교체할 것. 계산 로직은 calc.ts에 격리돼 있음.

import { useMemo, useState } from "react";
import { calcPropertyTax, TAX_YEAR } from "./calc";

const won = (n: number) => Math.round(n).toLocaleString("ko-KR") + "원";

const eokMan = (amount: number) => {
  if (!amount) return "";
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  return [eok ? `${eok}억` : "", man ? `${man.toLocaleString("ko-KR")}만` : ""]
    .filter(Boolean)
    .join(" ");
};

const parseNum = (s: string) => {
  const n = Number(s.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default function PropertyTaxCalculatorClient() {
  const [publishedPrice, setPublishedPrice] = useState<number>(0);
  const [isSingleHome, setIsSingleHome] = useState<boolean>(true);
  const [ownershipPct, setOwnershipPct] = useState<number>(100);
  const [applyUrbanArea, setApplyUrbanArea] = useState<boolean>(true);

  const [useCeiling, setUseCeiling] = useState<boolean>(false);
  const [prevBase, setPrevBase] = useState<number>(0);
  const [prevUrban, setPrevUrban] = useState<number>(0);

  const ownershipValid = ownershipPct > 0 && ownershipPct <= 100;

  const result = useMemo(() => {
    if (publishedPrice <= 0 || !ownershipValid) return null;
    return calcPropertyTax({
      publishedPrice,
      isSingleHome,
      ownershipRatio: ownershipPct / 100,
      applyUrbanArea,
      // ★ 빈 입력(0)은 null로 전달 — 0을 유효 전년세액으로 처리해 세액이 0원으로 눌리는 버그 방지.
      //   본세·도시지역분을 각각 독립 판정.
      prevYearBaseTax: useCeiling && prevBase > 0 ? prevBase : null,
      prevYearUrbanTax:
        useCeiling && applyUrbanArea && prevUrban > 0 ? prevUrban : null,
    });
  }, [publishedPrice, isSingleHome, ownershipPct, ownershipValid, applyUrbanArea, useCeiling, prevBase, prevUrban]);

  const ceilingStatus = result
    ? !result.ceilingChecked
      ? "미적용"
      : result.ceilingApplied
      ? `상한 적용됨 (${Math.round(result.ceilingRate * 100)}%)`
      : "검토됨 · 상한 미도달"
    : "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* ── 입력 ── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-5">
        <h2 className="text-lg font-semibold">기본 정보</h2>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">주택 공시가격</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              inputMode="numeric"
              value={publishedPrice ? publishedPrice.toLocaleString("ko-KR") : ""}
              onChange={(e) => setPublishedPrice(parseNum(e.target.value))}
              placeholder="예) 500000000 (5억원)"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
            />
            <span className="shrink-0 text-sm text-gray-500">원</span>
          </div>
          {publishedPrice > 0 && (
            <span className="mt-1 block text-xs text-gray-500">{eokMan(publishedPrice)}</span>
          )}
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">1세대 1주택 여부</span>
          <button
            type="button"
            onClick={() => setIsSingleHome((v) => !v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              isSingleHome ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {isSingleHome ? "1세대 1주택" : "그 외(다주택 등)"}
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">소유지분율</span>
          <div className="mt-1 flex items-center gap-2">
            <input
              inputMode="numeric"
              value={ownershipPct || ""}
              onChange={(e) => setOwnershipPct(Math.min(parseNum(e.target.value), 100))}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-right"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          {!ownershipValid && (
            <span className="mt-1 block text-xs text-red-500">
              소유지분율은 1% 이상 100% 이하로 입력하세요.
            </span>
          )}
        </label>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">도시지역분 적용</span>
          <button
            type="button"
            onClick={() => setApplyUrbanArea((v) => !v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              applyUrbanArea ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {applyUrbanArea ? "적용" : "미적용"}
          </button>
        </div>

        {/* ── 선택: 세부담상한 ── */}
        <div className="rounded-xl bg-gray-50 p-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={useCeiling} onChange={(e) => setUseCeiling(e.target.checked)} />
            <span className="text-sm font-medium text-gray-700">세부담상한 적용 (전년도 세액 입력)</span>
          </label>

          {useCeiling && (
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="text-xs text-gray-600">전년도 재산세 본세</span>
                <input
                  inputMode="numeric"
                  value={prevBase ? prevBase.toLocaleString("ko-KR") : ""}
                  onChange={(e) => setPrevBase(parseNum(e.target.value))}
                  placeholder="원"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
                />
              </label>
              {applyUrbanArea && (
                <label className="block">
                  <span className="text-xs text-gray-600">전년도 도시지역분</span>
                  <input
                    inputMode="numeric"
                    value={prevUrban ? prevUrban.toLocaleString("ko-KR") : ""}
                    onChange={(e) => setPrevUrban(parseNum(e.target.value))}
                    placeholder="원"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-right"
                  />
                </label>
              )}
              <p className="text-xs text-gray-500">
                입력하지 않은 항목은 세부담상한을 적용하지 않습니다. 본세와 도시지역분은 각각
                전년도 상당액을 기준으로 독립적으로 상한이 적용됩니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── 결과 ── */}
      {!result && (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          공시가격을 입력하면 예상 재산세가 계산됩니다.
        </div>
      )}

      {result && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold">계산 결과</h2>

          <dl className="divide-y divide-gray-100">
            <Row label="주택 전체 과세표준" value={won(result.taxBase)} />
            <Row label="재산세 본세" value={won(result.baseTax)} />
            {applyUrbanArea && <Row label="도시지역분" value={won(result.urbanTax)} />}
            <Row label="지방교육세" value={won(result.eduTax)} />
            <Row label="연간 예상 세액" value={won(result.annualTotal)} strong />
            <Row label={`${TAX_YEAR}년 7월 예상 납부액`} value={won(result.july)} strong />
            <Row
              label={`${TAX_YEAR}년 9월 예상 납부액`}
              value={result.lumpSumEligible ? "0원 (7월 일괄 예상)" : won(result.sept)}
              strong
            />
          </dl>

          {/* 계산 상세 */}
          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-700">계산 상세</p>
            <p>적용 공정시장가액비율: {(result.fmvRatio * 100).toFixed(0)}%</p>
            <p>적용 세율: {result.rateType}</p>
            <p>세부담상한: {ceilingStatus}</p>
            <p>소유지분율: {Math.round(result.ownershipRatio * 100)}%</p>
            {result.ownershipRatio < 1 && (
              <p className="text-gray-500">
                과세표준은 주택 전체 기준이며, 세액에는 소유지분율{" "}
                {Math.round(result.ownershipRatio * 100)}%가 반영되었습니다.
              </p>
            )}
            <p>7월 일괄부과 가능: {result.lumpSumEligible ? "예 (예상)" : "아니오"}</p>
          </div>

          {/* 안내 문구 */}
          <div className="space-y-2 text-xs leading-relaxed text-gray-500">
            {result.lumpSumEligible && (
              <p>
                연간 주택분 재산세가 20만 원 이하인 경우 지방자치단체 조례에 따라 7월에 한꺼번에
                부과될 수 있습니다. 실제 고지 방식은 관할 지방자치단체에서 확인하세요.
              </p>
            )}
            <p>
              실제 부과 세액은 직전연도 과세표준을 기준으로 적용되는 과세표준상한제와 지방자치단체의
              부과 자료에 따라 달라질 수 있습니다.
            </p>
            <p>
              본 계산기는 주택분 재산세만 산정하며 참고용입니다. 정확한 세액은 관할 지방자치단체
              고지서를 기준으로 합니다.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className={`text-sm ${strong ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </dt>
      <dd className={`text-sm tabular-nums ${strong ? "font-semibold text-gray-900" : "text-gray-800"}`}>
        {value}
      </dd>
    </div>
  );
}
