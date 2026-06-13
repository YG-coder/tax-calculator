// src/app/guide/family-loan/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '부모 자식 간 차용증 쓰는 법 — 증여 추정 피하기 (2026)',
  description:
    '가족 간 금전거래가 증여로 추정되지 않으려면 차용증을 어떻게 써야 할까요? 적정이자율 4.6%, 연 이자 차액 1천만원 기준, 차용증 필수 항목과 증빙을 정리했습니다.',
  alternates: { canonical: '/guide/family-loan' },
}

export default function FamilyLoanGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">증여세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          부모 자식 간 차용증 쓰는 법
        </h1>
        <p className="text-slate-500">
          가족끼리 빌려준 돈도 증빙이 없으면 증여로 추정될 수 있습니다. 증여세를 피하려면 차용증을 어떻게
          쓰고 무엇을 남겨야 하는지 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">가족 간 거래는 「증여 추정」이 기본</h2>
          <p>
            세법은 직계존비속 등 가족 간 금전거래를 원칙적으로 <strong>증여로 추정</strong>합니다. 「빌려준
            것」이라고 주장해도 그것을 입증할 책임은 납세자에게 있습니다. 즉 <strong>차용증·이자 지급·상환
            내역 같은 증빙이 없으면 증여세가 부과</strong>될 수 있습니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 실제 「대여」임을 보여주는 3종 세트 — ① 차용증, ② 정기적 이자 지급,
              ③ 원금 상환 내역 — 을 갖춰야 증여 추정에서 벗어날 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">적정이자율과 「1,000만 원」 기준</h2>
          <p>
            세법상 특수관계인 간 금전 대여의 적정이자율은 <strong>연 4.6%</strong>(당좌대출이자율)입니다.
            무이자나 저리로 빌려주면 「적정이자 − 실제이자」 차액만큼 이익을 본 것으로 보지만,
            그 차액이 <strong>연 1,000만 원 미만이면 증여로 보지 않습니다.</strong>
          </p>
          <p className="mt-2">
            계산해 보면 약 <strong>2억 1,700만 원까지는 무이자로 빌려줘도</strong> 연 이자 차액이
            1,000만 원에 못 미쳐 증여세 대상이 아닙니다(2.17억 × 4.6% ≈ 998만 원). 그 이상을 무이자로
            빌려주면 초과분의 이자 상당액이 증여로 잡힐 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">차용증에 꼭 들어갈 항목</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>채권자·채무자 인적사항 (이름, 주민번호 또는 생년월일)</li>
            <li>대여 금액</li>
            <li>이자율 (무이자라면 무이자임을 명시)</li>
            <li>변제기(상환 기한)와 변제 방법 (분할/일시)</li>
            <li>작성일자, 양 당사자 서명·날인</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            작성일을 객관적으로 증명하려면 <strong>우체국 내용증명</strong>이나 <strong>공증</strong>,
            또는 작성 후 본인 이메일로 보내 타임스탬프를 남기는 방법이 활용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">차용증보다 중요한 건 「실제 이행」</h2>
          <p>
            차용증만 써두고 이자도, 상환도 없으면 형식만 갖춘 것으로 보아 증여로 판단될 수 있습니다.
            <strong> 약정한 이자를 정기적으로 계좌이체로 지급</strong>하고, <strong>원금도 실제로 상환</strong>하는
            기록이 통장에 남아야 「진짜 대여」로 인정받기 쉽습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 전세보증금 2억 무이자 대여</p>
            <p>
              2.17억 이하 무이자라 연 이자 차액이 1,000만 원 미만 → 증여세 대상 아님. 단, 차용증과 상환
              계획은 남겨두는 것이 안전합니다.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 5억 무이자 대여</p>
            <p>
              적정이자(5억 × 4.6% = 2,300만) − 실제이자(0) = 2,300만 ≥ 1,000만 → 차액이 증여로 잡힐 수
              있음. 일정 이자를 실제 지급해 차액을 1,000만 미만으로 낮추는 방법을 검토.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 차용증은 있으나 이자·상환 전혀 없음</p>
            <p>
              형식만 있고 이행이 없으면 증여로 재해석될 위험. 정기 이자 지급·원금 상환 기록을 통장에
              남기는 것이 핵심.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 차용증을 공증까지 받아야 하나요?</p>
              <p>법적 의무는 아니지만, 작성일과 진정성을 객관적으로 입증하는 데 도움이 됩니다. 내용증명도 활용됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 무이자로 빌려줘도 정말 괜찮나요?</p>
              <p>약 2.17억 이하 무이자라면 연 이자 차액이 1,000만 원 미만이라 증여세 대상이 아닙니다. 그 이상이면 일부 이자 지급을 검토하세요.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 이자를 주면 부모가 세금을 내나요?</p>
              <p>받은 이자는 부모의 이자소득(비영업대금 이익)으로 과세될 수 있습니다. 거래 구조 설계 시 함께 고려해야 합니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 나중에 갚지 않으면 어떻게 되나요?</p>
              <p>상환하지 않으면 그 시점에 증여로 전환된 것으로 보아 증여세가 부과될 수 있습니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/gift-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 증여세 계산기</Link>
              <span className="text-slate-500"> · 증여로 잡힐 경우 예상 세액 확인</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/gift-split" className="text-blue-700 hover:underline font-semibold">→ 증여세 절세, 10년 단위 분할 증여</Link></li>
            <li><Link href="/guide/inheritance-vs-gift" className="text-blue-700 hover:underline font-semibold">→ 상속세 vs 증여세, 뭐가 더 유리할까</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>상속세 및 증여세법 제45조 (재산 취득자금 등의 증여 추정), 제41조의4 (금전 무상대출 등에 따른 이익의 증여)</li>
            <li>국세청 「증여세 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인 사정에 따라 적용이 달라질 수 있습니다. 거래 구조 설계 시
            국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
