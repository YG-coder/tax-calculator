// src/app/guide/vat-filing/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '부가세 신고 체크리스트 (개인사업자, 2026)',
  description:
    '1월·7월 부가세 신고 시즌, 빠뜨리면 안 되는 매출·매입 자료와 신고 절차, 자주 하는 실수, 가산세 위험까지 한눈에 정리한 실무 체크리스트.',
  alternates: { canonical: '/guide/vat-filing' },
}

export default function VatFilingGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">부가세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          부가세 신고 체크리스트 (개인사업자)
        </h1>
        <p className="text-slate-500">
          1월·7월 부가세 신고 시즌, 빠뜨리면 안 되는 자료와 신고 절차를 한눈에 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">먼저, 본인의 사업자 유형 확인</h2>
          <p>
            부가세 신고 방법은 사업자 유형에 따라 크게 달라집니다. 본인이 어디에 속하는지부터
            확인하세요.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>일반과세자:</strong> 연 매출 1억 4백만 원 이상. 10% 세율 적용. 매입세액 공제 가능.</li>
            <li><strong>간이과세자:</strong> 연 매출 1억 4백만 원 미만. 업종별 부가가치율 × 10% 적용. 세금계산서 발행 제한.</li>
            <li><strong>면세사업자:</strong> 부가세 의무 없음. 다만 매출처별 「사업장현황신고」(2월) 의무 있음.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            ※ 매출 기준은 매년 일부 조정되므로 국세청 최신 고시를 확인하세요.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">부가세 신고 일정</h2>
          <div className="rounded-xl border border-slate-100 overflow-hidden mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">구분</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">신고 기간</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">대상 매출</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr><td className="px-4 py-2">일반 1기 확정</td><td className="px-4 py-2">7/1 ~ 7/25</td><td className="px-4 py-2">1/1 ~ 6/30</td></tr>
                <tr><td className="px-4 py-2">일반 2기 확정</td><td className="px-4 py-2">1/1 ~ 1/25</td><td className="px-4 py-2">7/1 ~ 12/31</td></tr>
                <tr><td className="px-4 py-2">간이과세자</td><td className="px-4 py-2">1/1 ~ 1/25</td><td className="px-4 py-2">전년 1/1 ~ 12/31</td></tr>
                <tr><td className="px-4 py-2">법인 분기별</td><td className="px-4 py-2">분기 종료 후 25일</td><td className="px-4 py-2">해당 분기</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            법인사업자는 분기마다 신고하므로 연 4회, 개인 일반과세자는 연 2회, 간이과세자는 연 1회 신고합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">매출 자료 체크리스트</h2>
          <p>아래 항목을 모두 확인하면 매출 누락을 방지할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>전자세금계산서 발행 내역 (홈택스 자동 조회)</li>
            <li>현금영수증 발급 내역 (가맹점 등록 사업자)</li>
            <li>신용카드·체크카드 매출 (카드사 가맹점 매출 자료)</li>
            <li>오픈마켓·배달앱 정산 내역 (네이버, 쿠팡, 배민, 요기요 등)</li>
            <li>계좌이체로 받은 매출 — <strong>홈택스에 안 잡힙니다.</strong> 본인이 직접 합산해야 합니다.</li>
            <li>해외 결제 플랫폼 매출 (페이팔, 스트라이프 등)</li>
            <li>면세 매출이 있다면 별도 표기</li>
          </ul>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 mt-3">
            <p className="text-sm text-slate-700">
              ⚠️ <strong>가장 흔한 실수:</strong> 계좌이체 매출 누락. 카드·세금계산서·현금영수증은 자동
              집계되지만, 「클라이언트가 그냥 통장으로 보낸 돈」은 본인이 챙겨야 합니다. 누락 시
              과소신고가산세가 부과됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">매입 자료 체크리스트 (공제용)</h2>
          <p>매입세액 공제를 받으려면 다음 자료가 필요합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>받은 전자세금계산서 (홈택스 자동 조회)</li>
            <li>사업용 신용카드 매입 내역 (홈택스 등록 후 자동 조회)</li>
            <li>현금영수증 (지출증빙용으로 발급받은 것)</li>
            <li>수입세금계산서 (수입품 통관 시)</li>
            <li>의제매입세액 적용 항목 (음식점업 등 농수산물 매입)</li>
          </ul>
          <p className="mt-3 font-semibold text-slate-800">매입세액 공제 불가 항목 (실수 빈번)</p>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-600">
            <li>접대비 — 거래처 식사·선물 등</li>
            <li>비영업용 소형승용차 관련 비용 — 1,000cc 초과 자동차 구입·유지비</li>
            <li>사업자 본인의 개인적 지출</li>
            <li>면세 재화·용역 매입분</li>
            <li>간이과세자에게서 매입한 일부 거래</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 절차 — 홈택스에서</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>홈택스 로그인 → 「세금신고」 → 「부가가치세 신고」</li>
            <li>「일반과세자 정기신고」 또는 「간이과세자 정기신고」 선택</li>
            <li>매출자료 확인 (자동 집계 + 누락분 수동 입력)</li>
            <li>매입자료 확인 (자동 집계 + 종이세금계산서·기타 수동 입력)</li>
            <li>경감·공제세액 입력 (전자세금계산서 발급세액공제, 신용카드매출 세액공제 등)</li>
            <li>가산세 항목 확인 (해당 시)</li>
            <li>납부할 세액 확정 → 신고서 제출 → 납부 (또는 환급 신청)</li>
          </ol>
          <p className="mt-3">
            신고서 제출 후 「접수증」을 반드시 저장해두세요. 추후 분쟁이 생겼을 때 증거 자료로
            활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">놓치기 쉬운 공제·감면</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>전자세금계산서 발급 세액공제:</strong> 직전 연도 사업장별 공급가액 합계 3억 원 미만 사업자가 적시 발급 시 건당 200원, 연 한도 100만 원.</li>
            <li><strong>신용카드 매출전표 발행 세액공제:</strong> 일반음식점 등 일정 업종이 신용카드·현금영수증 매출에 대해 1.3% 공제(연 한도 있음).</li>
            <li><strong>의제매입세액 공제:</strong> 음식점업·제조업 등이 면세 농수산물을 원재료로 매입한 경우 일정 비율 공제.</li>
            <li><strong>일반택시 운수사업자 부가가치세 경감:</strong> 해당 업종 한정.</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            이런 공제 항목은 자동으로 적용되지 않는 경우가 많아, 직접 체크해서 입력해야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">가산세 — 절대 피해야 할 5가지</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li><strong>무신고가산세 20%:</strong> 신고 자체를 안 한 경우. 부정 무신고는 40%.</li>
            <li><strong>과소신고가산세 10%:</strong> 매출을 적게 신고한 경우. 부정 과소는 40%.</li>
            <li><strong>납부지연가산세 (연 약 8%대, 일할 계산):</strong> 신고는 했으나 납부 안 한 경우.</li>
            <li><strong>세금계산서 미발급가산세:</strong> 의무 사업자가 세금계산서를 발급하지 않은 경우 공급가액의 2%.</li>
            <li><strong>매입처별세금계산서합계표 미제출 가산세:</strong> 합계표 미제출 또는 부실기재 시 공급가액의 0.5%.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">신고 후 해야 할 일</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>납부 영수증·접수증 보관 (5년)</li>
            <li>세금계산서·신용카드 매출전표·영수증 원본 보관 (5년)</li>
            <li>다음 신고를 위한 매출·매입 정리 시작 (월 단위 정리 권장)</li>
            <li>환급이 발생했다면 입금 계좌·예상 일정 확인 (보통 1~2개월 내 입금)</li>
            <li>예정고지서 수령 (대상자 한정)</li>
          </ul>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/vat-calculator" className="text-blue-700 hover:underline font-semibold">
                → 부가세 계산기
              </Link>
              <span className="text-slate-500"> · 공급가액·부가세·합계 자동 계산</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">
                → 종합소득세 계산기
              </Link>
              <span className="text-slate-500"> · 사업소득에 대한 종합소득세 미리 확인</span>
            </li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>부가가치세법 제30조 (세율), 제48조~제49조 (예정·확정신고)</li>
            <li>국세청 「부가가치세 신고 안내」</li>
            <li>국세청 홈택스 (www.hometax.go.kr)</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 업종·매출 규모·거래 형태에 따라 적용이 달라질 수 있습니다.
            중요한 의사결정 시에는 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
