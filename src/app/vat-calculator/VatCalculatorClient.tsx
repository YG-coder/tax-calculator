// src/app/vat-calculator/VatCalculatorClient.tsx
'use client'

import { useState } from 'react'
import RelatedCalculators from '@/components/RelatedCalculators'

function fmt(n: number) { return n.toLocaleString('ko-KR') }
function parseNum(v: string) { return Number(v.replace(/[^0-9]/g, '')) || 0 }
function formatInput(v: string) {
  const n = v.replace(/[^0-9]/g, '')
  return n ? Number(n).toLocaleString('ko-KR') : ''
}

export default function VatCalculatorClient() {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'inclusive' | 'exclusive'>('inclusive')

  const parsed = parseNum(amount)
  const hasValue = parsed > 0

  const supply = mode === 'inclusive' ? Math.floor(parsed / 1.1) : parsed
  const vat    = mode === 'inclusive' ? parsed - supply : Math.floor(parsed * 0.1)
  const total  = mode === 'inclusive' ? parsed : supply + vat

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">부가세 계산기</h1>
      <p className="text-slate-500 mb-6">부가세 포함/별도 선택 · 공급가액·세액·합계 자동 계산</p>

      {/* 입력 카드 */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-800">금액 입력</h2>

        <div className="flex gap-2">
          {(['inclusive', 'exclusive'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                mode === m
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {m === 'inclusive' ? '부가세 포함' : '부가세 별도'}
            </button>
          ))}
        </div>

        <div>
          <label className="calc-label">
            {mode === 'inclusive' ? '부가세 포함 금액' : '공급가액 (부가세 제외)'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(formatInput(e.target.value))}
              placeholder="예: 1,100,000"
              className="calc-input pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="calc-hint">
            {mode === 'inclusive' ? '부가세가 포함된 총금액을 입력하세요' : '부가세를 제외한 순수 공급가액을 입력하세요'}
          </p>
        </div>
      </div>

      {/* 결과 */}
      {hasValue ? (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">총 금액</p>
            <p className="text-4xl font-black tabular-nums">{fmt(total)}<span className="text-2xl font-bold ml-1">원</span></p>
          </div>

          <div className="calc-card p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">계산 내역</h3>
            <ul className="space-y-2.5">
              <li className="flex justify-between text-sm">
                <span className="text-slate-600">공급가액</span>
                <span className="font-bold text-slate-800 tabular-nums">{fmt(supply)} 원</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-slate-600">부가세 (10%)</span>
                <span className="font-bold text-blue-600 tabular-nums">{fmt(vat)} 원</span>
              </li>
              <li className="flex justify-between text-sm pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-800">합계</span>
                <span className="font-bold text-slate-900 tabular-nums">{fmt(total)} 원</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400 text-center">
            일반과세자 기준 10% 세율 적용. 간이과세자·면세사업자는 실제와 다를 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="mt-6 h-36 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
          금액을 입력하면 자동 계산됩니다
        </div>
      )}

      {/* ============================================================ */}
      {/*                    SEO 본문 (확장 풀버전)                      */}
      {/* ============================================================ */}
      <section className="mt-12 space-y-8 text-sm text-slate-600 leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">부가세 계산기란?</h2>
          <p>
            부가세 계산기는 공급가액과 부가가치세(VAT)를 빠르게 계산하는 도구입니다.
            한국의 부가가치세는 재화나 용역이 거래될 때마다 부과되는 간접세로,
            일반과세자의 경우 공급가액의 10%가 적용됩니다. 사업자 간 거래에서 세금계산서를
            발행하거나, 견적서·계약서를 작성할 때 공급가액과 부가세를 명확히 구분해야
            하는 경우 본 계산기를 사용하면 즉시 결과를 확인할 수 있습니다.
          </p>
          <p className="mt-2">
            본 계산기는 두 가지 모드를 지원합니다. <strong>「부가세 포함」</strong> 모드는
            총금액에서 공급가액과 세액을 역산하는 방식이고, <strong>「부가세 별도」</strong>
            모드는 공급가액에 10%를 더해 합계를 산출하는 방식입니다. 거래 상황에 따라
            적절한 모드를 선택하면 됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">언제 사용하나요?</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>세금계산서 발행 시:</strong> 공급가액과 세액을 별도로 기재해야 하므로 두 값을 정확히 분리해야 합니다.</li>
            <li><strong>견적서·계약서 작성 시:</strong> 클라이언트가 "VAT 별도"로 요청했는지 "VAT 포함"으로 요청했는지에 따라 최종 청구금액이 달라집니다.</li>
            <li><strong>지출 증빙 정리 시:</strong> 카드매출전표나 현금영수증에서 공급가액과 부가세를 분리해 장부에 기록할 때 유용합니다.</li>
            <li><strong>매입세액 공제 검토:</strong> 매입한 재화·용역의 부가세 부담분을 미리 가늠해보고 싶을 때 사용합니다.</li>
            <li><strong>온라인 쇼핑몰 가격 책정:</strong> 부가세 포함 표시 가격에서 실제 공급가액이 얼마인지 확인할 때 사용합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">계산 공식</h2>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
            <p className="font-semibold text-slate-700">「부가세 포함」 → 역산</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>공급가액 = 총금액 ÷ 1.1</li>
              <li>부가세 = 총금액 − 공급가액</li>
            </ul>
            <p className="font-semibold text-slate-700 mt-3">「부가세 별도」 → 가산</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>부가세 = 공급가액 × 10%</li>
              <li>합계 = 공급가액 + 부가세</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">실전 계산 예시</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 1. VAT 포함 110만 원으로 세금계산서를 발행하는 경우</p>
            <ul className="space-y-1 text-slate-600">
              <li>공급가액 = 1,100,000 ÷ 1.1 = <strong>1,000,000원</strong></li>
              <li>부가세 = 1,100,000 − 1,000,000 = <strong>100,000원</strong></li>
              <li>세금계산서 기재: 공급가액 1,000,000원 / 세액 100,000원 / 합계 1,100,000원</li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">예시 2. 견적서 "VAT 별도 500만 원" 청구 시</p>
            <ul className="space-y-1 text-slate-600">
              <li>공급가액 = <strong>5,000,000원</strong></li>
              <li>부가세 = 5,000,000 × 10% = <strong>500,000원</strong></li>
              <li>최종 청구금액 = <strong>5,500,000원</strong></li>
            </ul>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">예시 3. 카페에서 받은 영수증 33,000원 (VAT 포함)</p>
            <ul className="space-y-1 text-slate-600">
              <li>공급가액 = 33,000 ÷ 1.1 = <strong>30,000원</strong></li>
              <li>부가세 = <strong>3,000원</strong></li>
              <li>법인카드 사용분이라면 매입세액 공제 검토 가능</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 하는 실수</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>"VAT 별도"인데 포함으로 계산:</strong> 견적서에 "VAT 별도"라고 적혀 있으면 표시된 금액에 10%를 추가로 더해야 합니다. 100만 원 → 실제 청구는 110만 원.</li>
            <li><strong>역산 시 ÷1.1 대신 ×0.9 사용:</strong> 110만 원의 90%는 99만 원이지 100만 원이 아닙니다. 반드시 1.1로 나눠야 정확합니다.</li>
            <li><strong>간이과세자에게 일반세율 적용:</strong> 간이과세자는 업종별 부가가치율(15~40%)을 곱한 후 10%를 적용하므로 실제 부담이 다릅니다.</li>
            <li><strong>면세 항목까지 포함해 계산:</strong> 도서, 신문, 미가공 식료품, 의료·교육 서비스 등은 부가세 면세 대상이라 10%가 붙지 않습니다.</li>
            <li><strong>현금영수증 미발행분 누락:</strong> 부가세 신고 시 매출 누락은 가산세 대상입니다. 모든 매출을 합산해 계산해야 합니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">신고 시기</h2>
          <p>
            부가가치세는 1년에 두 번 신고합니다. <strong>법인사업자</strong>는 1·4·7·10월에
            분기마다 신고하며(연 4회), <strong>개인사업자(일반과세자)</strong>는
            1월(전년 7~12월분)과 7월(당해 1~6월분) 두 차례 신고합니다.
            <strong>간이과세자</strong>는 다음 해 1월에 1년치를 한 번에 신고합니다.
          </p>
          <p className="mt-2">
            예정고지(예정신고) 기간을 놓치면 가산세가 부과되므로 일정을 미리 확인해두는
            것이 좋습니다. 신고와 납부는 국세청 홈택스에서 모두 처리할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">자주 묻는 질문 (FAQ)</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 간이과세자는 부가세를 어떻게 계산하나요?</p>
              <p>
                간이과세자는 「공급대가 × 업종별 부가가치율 × 10%」로 계산합니다.
                업종별 부가가치율은 15%(소매업·재생용 재료수집)부터 40%(부동산임대업·기타 서비스업)까지
                차등 적용되어 일반과세자보다 부담이 적습니다. 본 계산기는 일반과세자
                기준이므로 간이과세자는 별도 확인이 필요합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 면세사업자도 부가세를 내야 하나요?</p>
              <p>
                면세사업자는 부가세를 거래상대방에게 받지 않고, 본인도 납부하지 않습니다.
                대표적인 면세 업종은 학원·의료·농축수산물·도서출판 등입니다. 다만 매입 시
                부담한 부가세는 환급받을 수 없다는 점이 일반과세자와 다릅니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 프리랜서도 부가세 신고를 하나요?</p>
              <p>
                3.3% 원천징수만 받는 프리랜서는 사업자등록을 하지 않은 상태이므로 부가세
                신고 의무가 없습니다. 다만 연 매출이 일정 규모를 넘거나 사업이 안정화되면
                사업자등록을 통해 일반과세자 또는 간이과세자로 전환하는 것을 검토할 수
                있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 매입세액 공제는 무엇인가요?</p>
              <p>
                사업과 관련해 매입한 재화·용역의 부가세는 매출세액에서 차감해 납부할 수
                있습니다. 이를 매입세액 공제라고 하며, 사업용 신용카드·세금계산서·현금영수증
                등으로 증빙된 매입분만 공제 가능합니다. 접대비, 비영업용 차량 관련 비용,
                개인 용도 지출은 공제 대상이 아닙니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 영세율(0%)은 어떤 경우 적용되나요?</p>
              <p>
                재화의 수출, 외화 획득 용역 등은 영세율(0%)이 적용됩니다. 0%이지만 면세와
                달리 매입세액 공제는 가능하므로 수출기업은 매입 부가세를 환급받을 수
                있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 본 계산기 결과가 실제 신고 세액과 다를 수 있나요?</p>
              <p>
                네. 본 계산기는 일반과세자 10% 단일 세율 기준의 간이 도구입니다. 실제
                신고 시에는 매입세액 공제, 의제매입세액, 신용카드 매출 세액공제, 전자
                세금계산서 발급세액공제, 가산세 등이 종합적으로 반영되어 차이가 발생할 수
                있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">⚠️ 참고용 안내</p>
          <p>
            본 계산기는 일반과세자 기준 10% 세율을 적용한 간이 도구입니다.
            간이과세자, 면세사업자, 영세율, 매입세액 공제, 가산세 등은 반영되지 않습니다.
            실제 신고는 국세청 홈택스 또는 세무 전문가를 통해 확인하시기 바랍니다.
          </p>
        </div>

        <div className="text-xs text-slate-500 border-t pt-4">
          <p className="font-semibold text-slate-700 mb-1">근거 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>부가가치세법 제30조 (세율) — 국세법령정보시스템</li>
            <li>부가가치세법 시행령 — 일반과세자/간이과세자 구분</li>
            <li>국세청 홈택스 부가세 신고 안내</li>
          </ul>
        </div>
      </section>

      <RelatedCalculators current="vat-calculator" />
    </main>
  )
}
