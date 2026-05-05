// src/app/freelancer-tax-calculator/FreelancerTaxClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

export default function FreelancerTaxClient() {
  const [amount, setAmount] = useState('')

  const parsed   = parseNum(amount)
  const hasValue = parsed > 0

  const incomeTax = Math.floor(parsed * 0.03)
  const localTax  = Math.floor(parsed * 0.003)
  const totalTax  = incomeTax + localTax
  const net       = parsed - totalTax

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">프리랜서 3.3% 계산기</h1>
      <p className="text-slate-500 mb-6">원천징수 3.3% · 소득세 3% + 지방소득세 0.3%</p>

      <div className="calc-card p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800">계약 금액 입력</h2>
        <div>
          <label className="calc-label">수입 금액 <span className="text-red-400">*</span></label>
          <div className="relative">
            <input type="text" inputMode="numeric" value={amount}
              onChange={(e) => setAmount(formatInput(e.target.value))}
              placeholder="예: 1,000,000" className="calc-input pr-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">계약금액(세전)을 입력하세요</p>
        </div>
      </div>

      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">실수령액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(net)}<span className="text-2xl font-bold ml-1">원</span></p>
            <p className="mt-2 text-sm text-blue-100">원천징수 {fmt(totalTax)}원 공제 후</p>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">공제 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm"><span className="text-slate-600">계약금액</span><span className="font-bold text-slate-800 tabular-nums">{fmt(parsed)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">소득세 (3%)</span><span className="font-bold text-blue-600 tabular-nums">−{fmt(incomeTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-600">지방소득세 (0.3%)</span><span className="font-bold text-slate-600 tabular-nums">−{fmt(localTax)} 원</span></li>
              <li className="flex justify-between text-sm"><span className="text-slate-500">합계 원천징수 (3.3%)</span><span className="text-slate-500 tabular-nums">−{fmt(totalTax)} 원</span></li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">실수령액</span>
                <span className="font-bold text-emerald-600 tabular-nums">{fmt(net)} 원</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 text-center">
            3.3%는 선납 원천징수입니다. 종합소득세 신고 시 실제 세액에 따라 환급 또는 추가 납부가 발생할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          금액을 입력하면 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">프리랜서 3.3% 원천징수란?</h2>
          <p>
            한국에서 프리랜서, 작가, 강사, 디자이너, 개발자, 모델 등 인적용역을 제공하는
            개인이 사업자로부터 대금을 받을 때, 사업자는 대금에서 <strong>소득세 3%</strong>와
            <strong>지방소득세 0.3%</strong>를 합한 <strong>총 3.3%</strong>를 미리 떼고 나머지
            금액만 지급합니다. 이를 「사업소득 원천징수」라고 부르며, 일상적으로
            <strong> "프리랜서 3.3%"</strong>로 통칭됩니다.
          </p>
          <p className="mt-2">
            중요한 점은 3.3%가 <strong>최종 세금이 아닌 선납</strong>이라는 사실입니다.
            연말에 자신의 실제 소득과 경비를 합산해 종합소득세를 다시 계산하기 때문에,
            이 3.3%는 미리 낸 세금으로 처리되어 다음 해 5월 종합소득세 신고 시
            <strong> 환급 또는 추가 납부</strong>가 결정됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">언제 사용하나요?</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>프리랜서 계약 협상 시:</strong> "세전 100만 원" 계약이면 실수령은 96만 7천 원입니다. 협상 시 세전/세후를 명확히 해야 합니다.</li>
            <li><strong>월 수입 정산 시:</strong> 통장 입금액에서 거꾸로 세전 금액을 추정할 때.</li>
            <li><strong>5월 종합소득세 신고 준비:</strong> 1년치 원천징수 합산액을 미리 파악해 환급/추납 규모를 가늠.</li>
            <li><strong>견적서·청구서 작성:</strong> 클라이언트가 "3.3% 떼고 입금"한다는 조건일 때.</li>
            <li><strong>강사·교육비·강연료 계산:</strong> 강의료 100만 원 받기로 했는데 96만 7천 원 들어왔다면 정상입니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">계산 방법</h2>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>소득세 = 수입금액 × <strong>3%</strong></li>
              <li>지방소득세 = 수입금액 × <strong>0.3%</strong> (소득세의 10%)</li>
              <li>총 원천징수 = 수입금액 × <strong>3.3%</strong></li>
              <li>실수령액 = 수입금액 − 총 원천징수</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            계산 시 소득세는 원 단위로 절사(버림) 처리하는 것이 일반적이며, 사업자별로
            처리 방식에 미세한 차이가 있을 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. 외주 디자인 100만 원 계약</p>
            <ul className="space-y-1 text-slate-600">
              <li>소득세 = 1,000,000 × 3% = <strong>30,000원</strong></li>
              <li>지방소득세 = 1,000,000 × 0.3% = <strong>3,000원</strong></li>
              <li>총 원천징수 = <strong>33,000원</strong></li>
              <li>실수령액 = <strong>967,000원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 월 300만 원 정기 외주 (1년 누적)</p>
            <ul className="space-y-1 text-slate-600">
              <li>월 실수령 = 3,000,000 − 99,000 = <strong>2,901,000원</strong></li>
              <li>연 수입 = <strong>3,600만 원</strong></li>
              <li>연 원천징수 누적 = <strong>1,188,000원</strong></li>
              <li className="text-xs text-slate-500 mt-1">→ 5월 종소세 신고 시 경비 처리에 따라 환급 가능</li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 강연료 50만 원 1회</p>
            <ul className="space-y-1 text-slate-600">
              <li>소득세 = <strong>15,000원</strong></li>
              <li>지방소득세 = <strong>1,500원</strong></li>
              <li>실수령 = <strong>483,500원</strong></li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>3.3%가 최종 세금이라고 생각하기:</strong> 5월 종합소득세 신고 의무가 별도로 있습니다. 무시하면 가산세 부과.</li>
            <li><strong>원천징수영수증 미수령:</strong> 1년치 원천징수 내역은 종소세 신고 시 필수입니다. 발주처에 요청하거나 홈택스 「지급명세서 등 제출내역」에서 확인하세요.</li>
            <li><strong>경비 영수증 미보관:</strong> 통신비·교통비·노트북·소프트웨어 구입비 등 사업 관련 지출은 경비 처리 가능. 영수증·카드 내역을 모아두세요.</li>
            <li><strong>3.3% vs 8.8% 혼동:</strong> 일반 프리랜서는 3.3%, 강사·기타소득자는 경우에 따라 8.8% 또는 22% 등 다른 세율이 적용될 수 있습니다.</li>
            <li><strong>건강보험 지역가입자 전환 미리 파악 못함:</strong> 직장인 → 프리랜서 전환 시 지역가입자로 자동 전환되어 보험료가 크게 변할 수 있습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">절세 팁 (참고용)</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>사업용 신용카드 1장 분리:</strong> 업무용 지출만 모아 경비 증빙을 깔끔하게.</li>
            <li><strong>홈오피스 비용 처리:</strong> 임차료·통신비·전기료의 일부를 사업 관련 비율만큼 경비 인정.</li>
            <li><strong>노란우산공제 가입:</strong> 사업소득에서 직접 차감(연 최대 500만 원). 폐업 시 일시금 수령.</li>
            <li><strong>연금저축·IRP:</strong> 세액공제 연 최대 900만 원(IRP 합산). 환급 효과 큼.</li>
            <li><strong>홈택스 모두채움 신고서 활용:</strong> 단순경비율 적용 가능 사업자는 신고가 매우 간편.</li>
            <li><strong>장부 작성 검토:</strong> 실제 경비가 추정 경비율보다 크다면 간편장부·복식부기가 유리.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기</h2>
          <p>
            3.3% 원천징수는 <strong>발주처(지급자)가 매월 또는 분기별로 국세청에 납부</strong>합니다.
            프리랜서 본인은 별도 처리할 일이 없습니다. 다만 <strong>매년 5월 1일~31일</strong>에
            전년도 1년치 사업소득을 합산해 종합소득세 신고를 직접 해야 합니다. 이때 이미
            낸 3.3% 원천징수액은 「기납부세액」으로 차감되어 환급 또는 추가 납부가 결정됩니다.
          </p>
          <p className="mt-2">
            5월 신고를 안 하면 무신고가산세(20%)와 납부지연가산세가 붙으므로 반드시
            기한 내에 신고해야 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 3.3%는 환급받을 수 있나요?</p>
              <p>
                네, 가능합니다. 5월 종합소득세 신고 시 실제 소득에 경비를 차감한 과세표준에
                누진세율(6~45%)을 적용해 산출한 세액이 이미 낸 3.3%보다 적으면 차액을 환급받습니다.
                대다수 프리랜서는 환급 대상이지만, 연 수입이 일정 수준 이상(통상 5,000만 원 이상)이면
                추가 납부가 발생할 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부업·아르바이트로 소액만 받아도 신고해야 하나요?</p>
              <p>
                연 사업소득이 있다면 원칙적으로 신고 대상입니다. 다만 근로소득과 합산해 일정 기준
                이하라면 신고 의무가 면제될 수 있습니다. 연 100만~300만 원 수준의 소액이라도 환급이
                발생할 수 있으므로 신고하는 것이 유리한 경우가 많습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 직장인이 부업으로 프리랜서 일을 하면?</p>
              <p>
                근로소득(연말정산 완료) + 사업소득(3.3% 원천징수)을 합산해 5월 종합소득세 신고를
                해야 합니다. 회사 연말정산만으로는 끝나지 않습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 사업자등록을 해야 하나요?</p>
              <p>
                사업자등록 없이 3.3% 원천징수만 받아도 합법입니다. 다만 매출이 일정 규모를 넘거나
                매입세액 공제·세금계산서 발행이 필요하면 사업자등록을 검토하세요. 일반과세자/간이과세자
                전환 시점은 매출 규모·업종·고객 구조에 따라 달라집니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 강의료·강연료도 3.3%인가요?</p>
              <p>
                일시적·우발적 강연이라면 「기타소득」으로 분류되어 8.8%가 원천징수되는 경우가 많습니다.
                반복적·전문적 강의라면 「사업소득」으로 보아 3.3%가 적용됩니다. 사업자가 어느 코드로
                신고했는지 원천징수영수증으로 확인할 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 1년치 원천징수 내역은 어디서 확인하나요?</p>
              <p>
                홈택스 → 「지급명세서 등 제출내역」 메뉴에서 본인이 받은 사업소득 지급명세서를 조회할 수
                있습니다. 사업자가 제대로 신고했다면 모든 내역이 자동으로 집계됩니다. 매년 3월 이후
                전년도 자료가 조회 가능합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 4대보험은 어떻게 되나요?</p>
              <p>
                3.3% 원천징수만 받는 프리랜서는 직장가입자가 아닙니다. 건강보험·국민연금은 지역가입자로
                별도 부담해야 하며, 고용보험·산재보험은 가입 의무가 없습니다(특고 직종 일부는 예외).
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 일반 사업소득 원천징수 3.3% 기준 도구입니다. 기타소득(8.8%·22%),
            인적용역 외 소득은 다른 세율이 적용되며, 5월 종합소득세 신고 시 실제 세액은
            본 계산 결과와 다를 수 있습니다. 정확한 신고는 국세청 홈택스 또는 세무사를 통해
            확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제129조 (원천징수세율) — 사업소득 3%</li>
            <li>지방세법 — 지방소득세 10% 부가</li>
            <li>국세청 「프리랜서 종합소득세 신고 안내」</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="freelancer-tax-calculator" />
    </main>
  )
}
