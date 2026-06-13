// src/app/guide/business-registration/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '사업자등록 처음 하는 법 — 절차·서류·과세유형 (2026)',
  description:
    '처음 사업자등록을 하는 사람을 위한 단계별 가이드. 신청 기한(20일), 필요 서류, 간이·일반·면세 과세유형 선택, 업종코드, 등록 후 세금 의무까지 정리했습니다.',
  alternates: { canonical: '/guide/business-registration' },
}

export default function BusinessRegistrationGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">사업자</span>
          <span className="text-xs text-slate-400">약 8분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          사업자등록 처음 하는 법
        </h1>
        <p className="text-slate-500">
          신청 기한부터 과세유형 선택, 등록 후 생기는 세금 의무까지. 처음이라면 헷갈리는 순서를 단계별로
          정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">언제까지 등록해야 하나</h2>
          <p>
            사업자등록은 <strong>사업 개시일부터 20일 이내</strong>에 해야 합니다. 개시 전이라도 미리
            등록할 수 있고, 오히려 개업 준비 단계의 매입세액을 환급(일반과세자)받으려면 일찍 등록하는
            것이 유리합니다. 등록이 늦으면 미등록 가산세와 매입세액 불공제 불이익이 생길 수 있습니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 홈택스에서 비대면으로 신청 가능하며, 보통 2~3일 내 사업자등록증이
              발급됩니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">준비 서류</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>신분증 (본인 확인)</li>
            <li>임대차계약서 사본 — 사업장을 임차한 경우 (자가는 불필요)</li>
            <li>인·허가증 사본 — 음식점·학원 등 인허가 업종인 경우</li>
            <li>동업 계약서 — 공동사업자인 경우</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            온라인 판매·재택 프리랜서 등 별도 사업장이 없으면 자택 주소로 등록할 수도 있습니다(업종에 따라 제한).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">단계별 절차</h2>
          <div className="space-y-4 mt-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">1단계. 업종(업태·종목) 결정</p>
              <p>
                무슨 사업을 하는지에 따라 업종코드가 정해지고, 이 코드가 경비율·과세유형·세금에 영향을
                줍니다. 여러 사업을 겸하면 주업종 외에 부업종을 추가 등록합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">2단계. 과세유형 선택</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li><strong>일반과세자:</strong> 세금계산서 발급·매입세액 환급 필요, 매출 규모 큼.</li>
                <li><strong>간이과세자:</strong> 소비자 상대·소규모(예상 매출 1억 400만 미만), 세 부담 낮음.</li>
                <li><strong>면세사업자:</strong> 학원·병의원·농축수산물 등 부가세 면세 업종.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">3단계. 홈택스에서 신청</p>
              <p>
                홈택스 → 「국세증명·사업자등록·세금관련 신청」 → 「사업자등록 신청(개인)」에서 인적사항·
                사업장·업종·과세유형을 입력하고 서류를 첨부해 제출합니다. 세무서 방문 신청도 가능합니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">4단계. 사업자등록증 발급·후속 처리</p>
              <p>
                발급 후 사업용 계좌 등록, 사업용 신용카드 등록(홈택스), 필요 시 현금영수증 가맹점 가입을
                진행하면 이후 경비·매입 관리가 훨씬 쉬워집니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">등록 후 생기는 세금 의무</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>부가가치세:</strong> 일반과세자 연 2회(1·7월), 간이과세자 연 1회(1월). 면세사업자는 부가세 신고 없이 사업장현황신고(2월).</li>
            <li><strong>종합소득세:</strong> 매년 5월, 1년치 사업소득 신고.</li>
            <li><strong>원천징수·지급명세서:</strong> 직원·프리랜서에게 대가를 지급하면 원천징수 후 신고 의무.</li>
            <li><strong>4대보험:</strong> 직원을 고용하면 가입·신고 의무.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 온라인 쇼핑몰 창업 (예상 매출 5,000만)</p>
            <p>
              소비자 상대·소규모이므로 간이과세로 시작. 통신판매업 신고도 별도 필요. 자택 주소로 등록 가능.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 카페 개업 (인테리어 8,000만 투자)</p>
            <p>
              초기 매입세액 환급을 받으려면 개업 전 일반과세자로 등록하는 편이 유리. 식품위생 인허가증 필요.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 프리랜서 개발자 (거래처 세금계산서 요구)</p>
            <p>
              지속적으로 세금계산서를 발급해야 하므로 일반과세자 등록이 현실적. 자택 사업장 등록 가능.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 등록을 안 하고 사업하면 어떻게 되나요?</p>
              <p>미등록 가산세(공급가액의 1%)와 매입세액 불공제 등 불이익이 있습니다. 개시 후 20일 내 등록이 원칙입니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 직장인도 사업자등록을 할 수 있나요?</p>
              <p>가능합니다. 다만 회사 취업규칙상 겸업 제한이 있는지 확인하고, 소득은 합산해 5월에 종합소득세로 신고합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 등록 비용이 드나요?</p>
              <p>사업자등록 자체는 무료입니다. 인허가 업종은 별도 인허가 수수료가 발생할 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 과세유형을 잘못 골랐어요. 바꿀 수 있나요?</p>
              <p>매출 기준에 따라 다음 해 자동 전환되며, 일반↔간이 전환을 위한 별도 신고(간이과세 포기 등)도 가능합니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/vat-calculator" className="text-blue-700 hover:underline font-semibold">→ 부가세 계산기</Link>
              <span className="text-slate-500"> · 공급가액·부가세 계산</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 종합소득세 계산기</Link>
              <span className="text-slate-500"> · 사업소득 예상 세액</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/simplified-vs-general-vat" className="text-blue-700 hover:underline font-semibold">→ 간이과세자 vs 일반과세자 차이와 전환</Link></li>
            <li><Link href="/guide/vat-filing" className="text-blue-700 hover:underline font-semibold">→ 부가세 신고 체크리스트 (개인사업자)</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>부가가치세법 제8조 (사업자등록), 소득세법 제168조</li>
            <li>국세청 「사업자등록 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 실제 등록 및 세무 처리는
            국세청 홈택스 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
