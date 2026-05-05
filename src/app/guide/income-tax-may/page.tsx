// src/app/guide/income-tax-may/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '5월 종합소득세 신고 가이드 (2026)',
  description:
    '5월 종합소득세 신고의 전체 흐름을 정리한 무료 가이드. 신고 대상 확인, 모두채움 신고서, 분납 신청, 자주 하는 실수, 세무사 활용까지 한 번에.',
  alternates: { canonical: '/guide/income-tax-may' },
}

export default function IncomeTaxMayGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">종합소득세</span>
          <span className="text-xs text-slate-400">약 9분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          5월 종합소득세 신고 가이드
        </h1>
        <p className="text-slate-500">
          대상자 확인부터 모두채움 신고서, 분납 신청, 자주 하는 실수까지 5월 종합소득세 신고의 전체 흐름.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">5월에는 무슨 일이 일어나나요?</h2>
          <p>
            매년 5월 1일부터 5월 31일까지는 한국에서 가장 큰 세금 신고 시즌입니다. 이 한 달 동안
            전년도(1월~12월)에 발생한 모든 「종합소득」을 합산해 신고·납부해야 합니다.
            성실신고확인대상자는 6월 30일까지 1개월 연장됩니다.
          </p>
          <p>
            종합소득세는 <strong>여러 종류의 소득을 한 번에 합산</strong>하는 세금입니다.
            구체적으로는 사업소득, 인적용역소득(프리랜서), 부동산임대소득, 금융소득(이자·배당),
            근로소득, 연금소득, 기타소득이 모두 합산 대상입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">나도 신고 대상인가요?</h2>
          <p>다음 중 하나라도 해당되면 5월에 신고해야 합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>전년도에 사업소득(개인사업자·프리랜서 3.3%)이 있었던 경우</li>
            <li>두 군데 이상에서 근로소득을 받았으나 한 곳에서만 연말정산을 한 경우</li>
            <li>근로소득 외에 부업·임대·기타 소득이 있는 경우</li>
            <li>금융소득(이자+배당)이 연 2,000만 원을 초과한 경우</li>
            <li>기타소득 합계가 필요경비 차감 후 연 300만 원을 초과한 경우</li>
            <li>국민연금 외 사적연금 수령액이 연 1,500만 원을 초과한 경우</li>
          </ul>
          <p className="mt-3">
            <strong>근로소득만 있고 한 회사에서 연말정산을 끝낸 직장인</strong>은 별도 신고 의무가 없습니다.
            다만 의료비·기부금 등 연말정산에서 누락한 항목이 있다면 5월에 추가 신고로 환급받을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 유형 — 본인은 어디에 해당?</h2>
          <p>국세청은 사업자별 매출 규모와 업종에 따라 신고 유형을 자동 분류해 안내합니다.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>모두채움 신고서 대상자:</strong> 단순경비율 적용이 가능한 소규모 사업자에게
              국세청이 미리 채워둔 신고서를 제공합니다. 내용을 확인하고 제출 버튼만 누르면
              끝나는 가장 간편한 신고 방식입니다.
            </li>
            <li>
              <strong>단순경비율 신고:</strong> 모두채움이 아니지만 단순경비율 적용 가능한
              사업자. 직접 신고하되 정해진 경비율을 자동 적용받습니다.
            </li>
            <li>
              <strong>기준경비율 신고:</strong> 단순경비율 대상이 아닌 일정 규모 사업자.
              일부 항목만 실제 증빙으로 추가 인정받습니다.
            </li>
            <li>
              <strong>간편장부 대상자:</strong> 일정 규모 이하. 간단한 장부로 실제 경비를 처리.
            </li>
            <li>
              <strong>복식부기 의무자:</strong> 일정 규모 이상. 정식 회계장부 작성 의무.
              미작성 시 무기장가산세 20% 부과.
            </li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            홈택스 로그인 후 「My홈택스」에서 본인의 신고 안내문을 확인할 수 있습니다.
            본인 유형이 무엇인지 먼저 확인하는 것이 가장 중요합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 전 준비물 체크리스트</h2>
          <p>다음 자료를 미리 정리해두면 신고가 훨씬 빨라집니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>전년도 1년치 사업소득 지급명세서 (홈택스 자동 조회)</li>
            <li>근로소득 원천징수영수증 (회사에서 발급)</li>
            <li>금융기관 이자·배당 자료 (홈택스 자동 조회)</li>
            <li>사업용 신용카드 사용내역 (홈택스 등록 후 자동 조회)</li>
            <li>현금영수증·세금계산서 영수증</li>
            <li>국민연금·건강보험 납부 내역</li>
            <li>노란우산공제·연금저축·IRP 납입증명서</li>
            <li>기부금·의료비·교육비 영수증 (자녀 포함)</li>
            <li>주민등록등본 (인적공제 확인용)</li>
            <li>환급 받을 본인 명의 계좌</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">홈택스에서 신고하는 방법</h2>
          <ol className="list-decimal pl-5 space-y-3 mt-2">
            <li>
              <strong>홈택스 로그인:</strong> 공동인증서·금융인증서·간편인증(카카오·네이버 등) 중 하나로 로그인.
            </li>
            <li>
              <strong>「세금신고」 → 「종합소득세 신고」</strong> 메뉴 진입.
            </li>
            <li>
              <strong>본인 신고 유형 선택:</strong> 모두채움, 단순경비율, 기준경비율, 간편장부, 복식부기 중 안내받은 유형 선택.
            </li>
            <li>
              <strong>소득 정보 확인:</strong> 자동 집계된 사업소득·근로소득·금융소득 등을 확인. 누락분이 있다면 추가 입력.
            </li>
            <li>
              <strong>경비·공제 입력:</strong> 인적공제, 연금보험료공제, 특별소득공제, 세액공제(자녀·연금저축·기부금·월세 등) 입력.
            </li>
            <li>
              <strong>세액 확정:</strong> 자동 계산된 결정세액에서 기납부세액(원천징수분)을 차감해 환급/추납 결정.
            </li>
            <li>
              <strong>분납 또는 일시납 선택:</strong> 추가 납부 세액이 1,000만 원을 초과하면 분납(2개월) 신청 가능.
            </li>
            <li>
              <strong>신고서 제출 후 접수증 보관:</strong> 추후 분쟁·재신고를 위해 반드시 저장.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">놓치면 손해 — 주요 공제 항목</h2>
          <div className="space-y-3 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">인적공제</p>
              <p>본인·배우자·부양가족 1인당 150만 원 기본공제. 경로(70세 이상) 추가 100만 원, 장애인 추가 200만 원.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">연금저축·IRP 세액공제</p>
              <p>연금저축 600만 원 + IRP 추가 300만 원 = 합산 900만 원 한도. 공제율 13.2% 또는 16.5%(소득 기준).</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">노란우산공제 (사업소득자 한정)</p>
              <p>사업소득에서 직접 차감 (연 200만~500만 원 한도, 소득별 차등). 환급 효과 매우 큼.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">기부금 세액공제</p>
              <p>법정기부금·종교단체기부금·정치자금기부금 등 종류별 한도와 공제율 다름. 1천만 원 이하 15%, 초과분 30%.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">월세 세액공제 (근로소득자 한정)</p>
              <p>총급여 8천만 원 이하·무주택 세대주가 일정 요건의 주택을 임차한 경우 월세액의 15~17% 공제.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">자녀세액공제</p>
              <p>자녀 1명 25만 원, 2명 55만 원, 3명 이상 추가 1인당 40만 원. 출산·입양 시 추가 공제.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 하는 실수 8가지</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li><strong>5월 31일을 넘김</strong> — 무신고가산세 20% + 납부지연가산세 부과.</li>
            <li><strong>현금 매출 누락</strong> — 홈택스에 안 잡혀도 본인이 추가해야 함.</li>
            <li><strong>두 군데 근로소득 합산 안 함</strong> — 회사 1곳 연말정산만으로 끝났다고 착각.</li>
            <li><strong>경비 영수증 미보관</strong> — 카드 내역만으로 부족할 수 있음.</li>
            <li><strong>환급 계좌를 본인 명의가 아닌 가족 계좌로 입력</strong> — 환급 지연·반려.</li>
            <li><strong>분납 가능한데 일시납으로 처리</strong> — 1,000만 원 초과분은 2개월 분납 가능.</li>
            <li><strong>건강보험 인상 충격 미고려</strong> — 신고 결과는 다음 해 11월 이후 보험료에 반영됨.</li>
            <li><strong>세무사 비용 경비 처리 안 함</strong> — 사업 관련 비용으로 인정 가능.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">분납 — 부담을 줄이는 방법</h2>
          <p>
            추가 납부할 세액이 1,000만 원을 초과하면 일부를 2개월 이내에 분할 납부할 수 있습니다.
            구체적으로:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>1,000만 원 초과 ~ 2,000만 원 이하: 1,000만 원 초과분 분납 가능</li>
            <li>2,000만 원 초과: 세액의 50% 이내에서 분납 가능</li>
          </ul>
          <p className="mt-2">
            분납 신청은 신고서 제출 시 함께 체크하면 자동 적용됩니다. 별도 신청 절차는
            없으며, 분납기한(통상 7월 31일)까지 나머지를 납부하면 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">언제 세무사를 써야 할까?</h2>
          <p>다음 중 하나라도 해당되면 세무사 상담을 권장합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>복식부기 의무자에 해당하는 경우</li>
            <li>여러 종류의 소득(사업+임대+금융 등)이 복합된 경우</li>
            <li>해외 거래·외화 수입이 있는 경우</li>
            <li>세무조사 통보를 받은 경우</li>
            <li>처음으로 종합소득세 신고를 하는데 매출이 큰 경우</li>
          </ul>
          <p className="mt-2">
            소규모 사업자나 단순경비율 대상자는 홈택스 모두채움 신고서로 충분히 직접 처리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 후 확인할 것</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>접수증·신고서 사본 5년간 보관</li>
            <li>환급 발생 시 1~2개월 내 입금 확인</li>
            <li>다음 해 건강보험료 변동 예측</li>
            <li>중간예납세액 고지서 (11월) 수령 가능성 인지</li>
            <li>다음 해를 위해 매월 매출·경비 정리 시작</li>
          </ul>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">
                → 종합소득세 계산기
              </Link>
              <span className="text-slate-500"> · 연 소득과 경비로 예상 세액 확인</span>
            </li>
            <li>
              <Link href="/freelancer-tax-calculator" className="text-blue-700 hover:underline font-semibold">
                → 프리랜서 3.3% 계산기
              </Link>
              <span className="text-slate-500"> · 1년치 원천징수액 가늠</span>
            </li>
            <li>
              <Link href="/withholding-calculator" className="text-blue-700 hover:underline font-semibold">
                → 원천징수세액 계산기
              </Link>
              <span className="text-slate-500"> · 월 급여 기준 원천징수 확인</span>
            </li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제55조 (세율), 제70조 (확정신고)</li>
            <li>국세청 「종합소득세 신고 안내」</li>
            <li>국세청 홈택스 (www.hometax.go.kr)</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인의 소득 구조·공제 항목·법령 개정 등에 따라 적용이
            달라질 수 있습니다. 중요한 의사결정 시에는 국세청 또는 세무 전문가의 안내를 함께
            참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
