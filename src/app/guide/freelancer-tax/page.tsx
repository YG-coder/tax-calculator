// src/app/guide/freelancer-tax/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '프리랜서 종합소득세 신고 완벽 가이드 (2026)',
  description:
    '프리랜서 3.3% 원천징수부터 5월 종합소득세 신고까지 단계별로 정리한 무료 가이드. 환급받는 법, 경비 처리, 자주 하는 실수, 신고 유형 선택 기준을 다룹니다.',
  alternates: { canonical: '/guide/freelancer-tax' },
}

export default function FreelancerTaxGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">프리랜서</span>
          <span className="text-xs text-slate-400">약 8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          프리랜서 종합소득세 신고 완벽 가이드
        </h1>
        <p className="text-slate-500">
          3.3% 원천징수부터 5월 종합소득세 신고까지, 프리랜서가 꼭 알아야 할 절차와 절세 팁을
          단계별로 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">왜 프리랜서는 5월에 신고를 해야 할까?</h2>
          <p>
            프리랜서, 외주 디자이너, 개발자, 강사, 작가, 모델 등 인적용역을 제공하는 개인이
            대금을 받을 때 사업자는 <strong>3.3%</strong>(소득세 3% + 지방소득세 0.3%)를 미리 떼고
            지급합니다. 많은 분들이 이걸 「내가 낼 세금이 다 정산된 것」으로 오해하지만,
            실제로는 <strong>임시 선납</strong>에 가깝습니다.
          </p>
          <p>
            진짜 세금은 1년치 수입과 경비를 합산해 누진세율(6~45%)을 적용한 「종합소득세」입니다.
            매년 5월에 이 종합소득세를 신고·납부하며, 이때 1년 동안 미리 낸 3.3%는
            <strong> 「기납부세액」으로 차감</strong>되어 환급 또는 추가 납부가 결정됩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 3.3%는 「선납」, 5월 종합소득세 신고가 「확정」.
              많은 프리랜서가 환급을 받는 이유는 누진세율 6% 구간이 1,400만 원까지 적용되기 때문입니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 대상 — 나도 해야 하나요?</h2>
          <p>다음 중 하나라도 해당되면 5월에 종합소득세를 신고해야 합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>전년도에 사업소득(3.3% 원천징수 포함)을 한 번이라도 받은 경우</li>
            <li>두 곳 이상에서 근로소득을 받았는데 연말정산을 한 번만 한 경우</li>
            <li>근로소득 + 부업 소득(프리랜서·임대·기타)이 있는 경우</li>
            <li>금융소득(이자·배당)이 연 2,000만 원을 초과한 경우</li>
            <li>기타소득이 연 300만 원을 초과한 경우(필요경비 차감 후)</li>
          </ul>
          <p className="mt-3">
            연 수입이 적더라도 환급이 발생하는 경우가 많으므로 <strong>3.3%를 한 번이라도 떼였다면
            신고하는 것이 유리</strong>합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 절차 — 단계별로</h2>

          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">1단계. 1년치 수입 확인</p>
              <p>
                홈택스 → 「My홈택스」 → 「지급명세서 등 제출내역」에서 본인이 받은 사업소득
                지급명세서를 조회합니다. 매년 3월 이후 전년도 자료가 자동 집계됩니다.
                여기에 표시되지 않는 수입(사업자등록증 없는 개인 간 거래 등)도 본인이 추가
                입력해야 합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">2단계. 신고 유형 결정</p>
              <p className="mb-2">
                업종 코드와 매출 규모에 따라 적용 가능한 신고 유형이 정해집니다.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>단순경비율:</strong> 직전 연도 수입이 적은 신규·소규모 사업자. 정해진 비율을 경비로 인정.</li>
                <li><strong>기준경비율:</strong> 단순경비율 대상이 아닌 일정 규모 사업자. 일부 항목만 실제 증빙으로 추가 인정.</li>
                <li><strong>간편장부:</strong> 일정 규모 이하. 간단한 장부로 실제 경비 처리.</li>
                <li><strong>복식부기:</strong> 일정 규모 이상 의무. 정식 회계장부 작성.</li>
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                실제 경비가 추정 경비율보다 크다면 장부 작성이 유리하고, 반대면 경비율 적용이 유리합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">3단계. 경비·공제 정리</p>
              <p>아래 항목을 미리 정리해두면 신고가 훨씬 빠릅니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>업무용 통신비·교통비·도서구입비·소프트웨어 구독료 영수증</li>
                <li>사업용 신용카드 연 사용내역 (홈택스 자동 조회 가능)</li>
                <li>노란우산공제 납입내역, 연금저축·IRP 납입증명서</li>
                <li>국민연금·건강보험 납부 내역</li>
                <li>기부금영수증, 의료비, 자녀 교육비 영수증</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">4단계. 홈택스에서 신고</p>
              <p>
                홈택스 → 「세금신고」 → 「종합소득세 신고」 → 본인 신고 유형 선택 후 진행합니다.
                일정 요건의 단순경비율 적용자는 <strong>「모두채움 신고서」</strong>를 통해 자동 계산된
                내용을 확인만 하고 제출할 수 있어 매우 간편합니다.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">5단계. 납부 또는 환급 수령</p>
              <p>
                추가 납부가 발생하면 5월 31일까지 납부, 환급이 발생하면 신고 시 입력한 계좌로 1~2개월
                내에 자동 입금됩니다. 추가 세액이 1,000만 원을 초과하면 분납(2개월) 신청이 가능합니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">환급받는 핵심 — 어떻게 하면 더 받나요?</h2>
          <p>
            환급액은 결국 「내가 낸 3.3% − 실제 종합소득세」입니다. 실제 세액을 줄이는 만큼
            환급이 늘어나는 구조이며, 다음 항목을 챙기면 합법적으로 세액을 줄일 수 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>업무 관련 경비 빠짐없이 처리:</strong> 노트북, 모니터, 소프트웨어 구독, 통신비, 사무용품, 회의비, 출장비, 도서구입비 등.</li>
            <li><strong>노란우산공제:</strong> 사업소득에서 직접 차감(연 최대 500만 원). 폐업 시 일시금 수령 가능.</li>
            <li><strong>연금저축 + IRP:</strong> 합산 연 900만 원까지 세액공제(공제율 13.2~16.5%).</li>
            <li><strong>건강보험·국민연금:</strong> 본인이 낸 보험료는 소득공제 항목.</li>
            <li><strong>기부금:</strong> 종교·정치·법정 기부금 별도 공제율 적용.</li>
            <li><strong>인적공제:</strong> 부양가족이 있다면 1인당 150만 원 추가 공제.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 하는 실수 7가지</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li><strong>3.3%로 끝났다고 착각하기</strong> — 5월 신고 의무가 별도로 있습니다.</li>
            <li><strong>현금 거래 누락하기</strong> — 사업자가 신고하지 않아 홈택스에 안 잡혀도 본인이 추가 입력해야 합니다.</li>
            <li><strong>경비 영수증을 1년 내내 안 모으기</strong> — 5월에 한 번에 모으려면 너무 늦습니다. 매월 정리하세요.</li>
            <li><strong>가족 카드를 사업용으로 사용</strong> — 본인 명의 카드여야 사업용 매입으로 인정 가능.</li>
            <li><strong>접대비와 회의비 혼동</strong> — 접대비는 한도 제한이 강하고, 회의비는 비교적 자유롭습니다.</li>
            <li><strong>건강보험 지역가입자 변동 무시</strong> — 신고 결과가 다음 해 보험료에 반영되어 갑자기 인상될 수 있습니다.</li>
            <li><strong>환급 계좌 잘못 입력</strong> — 본인 명의가 아닌 계좌나 잘못 입력한 계좌는 환급 지연 또는 반려됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">언제 세무사를 써야 하나요?</h2>
          <p>다음 중 하나라도 해당되면 세무사 상담을 권장합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>연 수입 7,500만 원 이상 (복식부기 의무 가능)</li>
            <li>두 가지 이상의 사업을 동시에 운영</li>
            <li>해외 거래·외화 수입이 포함된 경우</li>
            <li>장부 작성을 처음 시작하는 경우</li>
            <li>세무조사 경험이 있거나 통보를 받은 경우</li>
          </ul>
          <p className="mt-2">
            세무사 수수료(연 30만~100만 원 수준)는 사업 경비로 처리 가능하며, 정확한 신고로
            가산세나 추징을 피할 수 있다면 충분히 가성비 있는 선택입니다.
          </p>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/freelancer-tax-calculator" className="text-blue-700 hover:underline font-semibold">
                → 프리랜서 3.3% 계산기
              </Link>
              <span className="text-slate-500"> · 계약금액에서 실수령액을 즉시 확인</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">
                → 종합소득세 계산기
              </Link>
              <span className="text-slate-500"> · 연 수입과 경비로 예상 세액 계산</span>
            </li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제55조 (세율), 제129조 (원천징수세율)</li>
            <li>국세청 「프리랜서 종합소득세 신고 안내」</li>
            <li>국세청 홈택스 (www.hometax.go.kr)</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며, 개인 사정에 따라 적용이 달라질 수 있습니다.
            중요한 의사결정 시에는 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
