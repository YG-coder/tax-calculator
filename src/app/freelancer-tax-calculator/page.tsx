// src/app/freelancer-tax-calculator/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) {
  return n.toLocaleString('ko-KR')
}

function parseNum(v: string) {
  return Number(v.replace(/[^0-9]/g, '')) || 0
}

function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

export default function FreelancerTaxCalculatorPage() {
  const [amount, setAmount] = useState('')

  const parsed = parseNum(amount)
  const hasValue = parsed > 0

  const incomeTax = Math.floor(parsed * 0.03)
  const localTax = Math.floor(parsed * 0.003)
  const totalTax = incomeTax + localTax
  const net = parsed - totalTax

  const yearlyIncome = parsed * 12
  const yearlyTax = totalTax * 12
  const yearlyNet = net * 12

  return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">프리랜서 3.3% 계산기</h1>
        <p className="text-slate-500 mb-6">
          프리랜서·개인 용역 원천징수 3.3%와 실제 입금액을 계산합니다.
        </p>

        <div className="calc-card p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800">계약 금액 입력</h2>

          <div>
            <label className="calc-label">
              세전 수입 금액 <span className="text-red-400">*</span>
            </label>

            <div className="relative">
              <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(formatInput(e.target.value))}
                  placeholder="예: 3,000,000"
                  className="calc-input pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
              원
            </span>
            </div>

            <p className="calc-hint">
              계약서 또는 지급명세서에 적힌 세전 금액을 입력하세요.
            </p>
          </div>
        </div>

        {hasValue ? (
            <div className="mt-6 space-y-4 animate-slide-up">
              <div
                  className="rounded-2xl p-6 text-white"
                  style={{
                    background:
                        'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  }}
              >
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                  예상 실수령액
                </p>
                <p className="text-4xl font-black tabular-nums">
                  {fmt(net)}
                  <span className="text-2xl font-bold ml-1">원</span>
                </p>
                <p className="mt-2 text-sm text-blue-100">
                  원천징수 {fmt(totalTax)}원 공제 후 입금 예상액
                </p>
              </div>

              <div className="calc-card p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">
                  계산 내역
                </h3>

                <ul className="space-y-2.5">
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">세전 수입</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                  {fmt(parsed)} 원
                </span>
                  </li>

                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">소득세 3%</span>
                    <span className="font-bold text-blue-600 tabular-nums">
                  −{fmt(incomeTax)} 원
                </span>
                  </li>

                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">지방소득세 0.3%</span>
                    <span className="font-bold text-slate-600 tabular-nums">
                  −{fmt(localTax)} 원
                </span>
                  </li>

                  <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-800">실수령액</span>
                    <span className="font-bold text-emerald-600 tabular-nums">
                  {fmt(net)} 원
                </span>
                  </li>
                </ul>
              </div>

              <div className="calc-card p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">
                  같은 금액을 매월 받을 경우
                </h3>

                <ul className="space-y-2.5">
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">연간 세전 수입</span>
                    <span className="font-bold text-slate-800">
                  {fmt(yearlyIncome)} 원
                </span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span className="text-slate-600">연간 원천징수액</span>
                    <span className="font-bold text-blue-600">
                  {fmt(yearlyTax)} 원
                </span>
                  </li>
                  <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-800">연간 실수령액</span>
                    <span className="font-bold text-emerald-600">
                  {fmt(yearlyNet)} 원
                </span>
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-400 text-center">
                3.3%는 최종 세금이 아니라 미리 납부하는 원천징수입니다.
                실제 종합소득세 신고 결과에 따라 환급 또는 추가 납부가 발생할 수 있습니다.
              </p>
            </div>
        ) : (
            <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
              금액을 입력하면 계산됩니다.
            </div>
        )}

        <section className="mt-10 space-y-8 text-sm text-slate-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              프리랜서 3.3% 원천징수란?
            </h2>
            <p>
              프리랜서 3.3% 원천징수는 개인이 사업자나 회사로부터 용역 대금을 받을 때,
              지급하는 쪽에서 세금을 미리 떼고 나머지 금액을 입금하는 방식입니다.
              일반적으로 인적용역, 외주 작업, 강의료, 원고료, 디자인·개발·마케팅 용역,
              플랫폼 활동 수입 등에서 자주 적용됩니다.
            </p>
            <p className="mt-3">
              여기서 3.3%는 소득세 3%와 지방소득세 0.3%를 합친 금액입니다.
              예를 들어 계약금액이 100만 원이라면 소득세 3만 원,
              지방소득세 3천 원을 합쳐 총 3만 3천 원이 공제되고,
              실제 입금액은 96만 7천 원이 됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              계산 공식
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                <tr>
                  <th className="w-36 bg-slate-50 px-4 py-3 text-left text-slate-700">
                    소득세
                  </th>
                  <td className="px-4 py-3">세전 금액 × 3%</td>
                </tr>
                <tr>
                  <th className="bg-slate-50 px-4 py-3 text-left text-slate-700">
                    지방소득세
                  </th>
                  <td className="px-4 py-3">세전 금액 × 0.3%</td>
                </tr>
                <tr>
                  <th className="bg-slate-50 px-4 py-3 text-left text-slate-700">
                    총 공제액
                  </th>
                  <td className="px-4 py-3">세전 금액 × 3.3%</td>
                </tr>
                <tr>
                  <th className="bg-slate-50 px-4 py-3 text-left text-slate-700">
                    실수령액
                  </th>
                  <td className="px-4 py-3">세전 금액 − 원천징수액</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              실제 예시: 월 300만 원 프리랜서라면?
            </h2>
            <p>
              프리랜서가 매월 300만 원의 용역 대금을 받는다고 가정하면,
              매월 원천징수되는 금액은 99,000원입니다.
              이 중 소득세는 90,000원이고 지방소득세는 9,000원입니다.
              따라서 실제 입금액은 2,901,000원이 됩니다.
            </p>
            <p className="mt-3">
              이를 1년 기준으로 보면 세전 수입은 36,000,000원,
              원천징수액은 1,188,000원, 단순 실수령액은 34,812,000원입니다.
              다만 이 금액이 최종 세금은 아닙니다. 5월 종합소득세 신고 때
              필요경비, 소득공제, 세액공제 등이 반영되면 이미 낸 세금 일부를
              돌려받을 수도 있고, 반대로 추가 납부가 발생할 수도 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              3.3%를 떼면 세금 신고가 끝나는 걸까?
            </h2>
            <p>
              아닙니다. 3.3% 원천징수는 세금을 미리 낸 것에 가깝습니다.
              프리랜서 소득은 보통 다음 해 5월 종합소득세 신고 대상이 됩니다.
              이때 1년 동안 벌어들인 소득과 비용을 정리하고,
              실제 부담해야 할 세금을 다시 계산합니다.
            </p>
            <p className="mt-3">
              예를 들어 원천징수로 이미 100만 원을 냈는데,
              종합소득세 신고 결과 실제 세금이 70만 원이라면 차액을 환급받을 수 있습니다.
              반대로 실제 세금이 150만 원이라면 이미 낸 100만 원을 제외한
              50만 원을 추가로 납부해야 합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              환급 가능성을 높이려면 무엇을 챙겨야 하나요?
            </h2>
            <p>
              프리랜서는 실제 업무와 관련된 비용을 잘 정리하는 것이 중요합니다.
              노트북, 소프트웨어 구독료, 사무용품, 통신비, 교육비, 외주비,
              업무용 교통비 등은 상황에 따라 필요경비로 검토될 수 있습니다.
              단, 개인적 지출과 사업 관련 지출은 구분되어야 합니다.
            </p>
            <p className="mt-3">
              특히 카드 사용 내역, 현금영수증, 세금계산서, 계좌이체 내역 등
              지출을 증명할 수 있는 자료를 남겨두는 것이 좋습니다.
              경비 처리는 업종, 소득 규모, 사업자등록 여부에 따라 달라질 수 있으므로
              큰 금액이 있거나 판단이 애매한 경우에는 세무 전문가와 확인하는 것이 안전합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              프리랜서와 개인사업자는 어떻게 다를까?
            </h2>
            <p>
              프리랜서가 반드시 개인사업자등록을 해야 하는 것은 아닙니다.
              일시적이거나 규모가 작은 용역 수입은 3.3% 원천징수 방식으로 처리되는 경우가 많습니다.
              하지만 지속적으로 매출이 발생하고, 거래처가 늘어나거나,
              비용 처리가 많아지는 경우에는 개인사업자등록을 검토할 수 있습니다.
            </p>
            <p className="mt-3">
              개인사업자가 되면 세금계산서 발행, 부가세 신고, 장부 작성 등
              관리해야 할 항목이 늘어납니다. 대신 사업 관련 비용을 체계적으로 관리할 수 있고,
              거래처와의 신뢰 측면에서 유리한 경우도 있습니다.
              본인의 소득 규모와 거래 형태를 기준으로 판단하는 것이 좋습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              자주 헷갈리는 부분
            </h2>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-800 mb-2">
                  Q. 3.3%를 떼면 4대보험도 가입된 건가요?
                </h3>
                <p>
                  아닙니다. 3.3% 원천징수는 소득세와 지방소득세를 미리 납부하는 것이며,
                  국민연금, 건강보험, 고용보험, 산재보험과는 별개의 문제입니다.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-800 mb-2">
                  Q. 프리랜서도 종합소득세 신고를 해야 하나요?
                </h3>
                <p>
                  일반적으로 프리랜서 사업소득이 있다면 다음 해 5월 종합소득세 신고 대상이 됩니다.
                  단순히 3.3%를 공제받았다고 해서 신고 의무가 사라지는 것은 아닙니다.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-slate-800 mb-2">
                  Q. 환급은 무조건 받을 수 있나요?
                </h3>
                <p>
                  아닙니다. 환급 여부는 이미 낸 원천징수액, 실제 소득, 필요경비,
                  각종 공제 항목에 따라 달라집니다. 소득이 높거나 경비가 적으면
                  추가 납부가 발생할 수도 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              함께 보면 좋은 계산기
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                    href="/income-tax-calculator"
                    className="font-semibold text-blue-700 hover:underline"
                >
                  종합소득세 계산기
                </Link>
                <span className="text-slate-500">
                {' '}
                  — 5월 신고 때 예상 세액을 확인할 수 있습니다.
              </span>
              </li>
              <li>
                <Link
                    href="/vat-calculator"
                    className="font-semibold text-blue-700 hover:underline"
                >
                  부가세 계산기
                </Link>
                <span className="text-slate-500">
                {' '}
                  — 사업자 거래 시 공급가액과 부가세를 구분할 수 있습니다.
              </span>
              </li>
              <li>
                <Link
                    href="/withholding-calculator"
                    className="font-semibold text-blue-700 hover:underline"
                >
                  원천징수세액 계산기
                </Link>
                <span className="text-slate-500">
                {' '}
                  — 급여 원천징수와 프리랜서 원천징수 차이를 비교할 수 있습니다.
              </span>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-5 text-xs text-slate-500 leading-relaxed">
            <p>
              참고 기준: 프리랜서 3.3% 계산은 일반적인 사업소득 원천징수 구조인
              소득세 3%와 지방소득세 0.3%를 기준으로 단순 계산합니다.
            </p>
            <p className="mt-2">
              본 계산기는 참고용 도구이며, 실제 세금 신고 결과는 개인의 소득,
              필요경비, 공제 항목, 신고 유형, 법령 변경 등에 따라 달라질 수 있습니다.
              정확한 신고는 국세청 홈택스 또는 세무 전문가를 통해 확인하세요.
            </p>
          </div>
        </section>

        <RelatedCalculators current="freelancer-tax-calculator" />
      </main>
  )
}