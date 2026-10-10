import type { CarTaxSuccess, TaxPeriod } from "./tax/rules/car-tax";

export const CAR_TAX_PERIOD_OPTIONS: { value: TaxPeriod; label: string }[] = [
  { value: "year", label: "연간" },
  { value: "first", label: "제1기분 (1~6월)" },
  { value: "second", label: "제2기분 (7~12월)" },
];

export function carTaxResultTitle(
  result: Pick<CarTaxSuccess, "year" | "period" | "prepay">,
): string {
  const scopeLabel = result.prepay?.payableScope === "secondHalf"
    ? "제2기분 연납"
    : CAR_TAX_PERIOD_OPTIONS.find((option) => option.value === result.period)!.label;
  return `${result.year}년 ${scopeLabel} 예상 납부액`;
}
