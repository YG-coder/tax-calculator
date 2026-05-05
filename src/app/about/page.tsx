// src/app/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '사이트 소개 | 세금계산기',
  description:
    'taxsim.kr는 부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 무료로 제공하는 온라인 세금 계산 서비스입니다. 운영자 소개, 정보 출처, 업데이트 정책을 안내합니다.',
  alternates: { canonical: '/about' },
}

const CALC_LIST = [
  { href: '/vat-calculator',               label: '부가세 계산기',          desc: '공급가액·부가세·합계 자동 계산. 포함/별도 선택 지원.' },
  { href: '/income-tax-calculator',        label: '종합소득세 계산기',        desc: '연 소득 기준 예상 소득세·지방소득세 간이 계산.' },
  { href: '/freelancer-tax-calculator',    label: '프리랜서 3.3% 계산기',    desc: '원천징수 3.3%(소득세 3% + 지방소득세 0.3%) 및 실수령액 계산.' },
  { href: '/capital-gains-tax-calculator', label: '양도소득세 계산기',        desc: '취득가액·양도가액 기준 예상 양도차익·세액 간이 계산.' },
  { href: '/gift-tax-calculator',          label: '증여세 계산기',            desc: '증여금액·공제 기준 누진세율 적용 예상 증여세 계산.' },
  { href: '/inheritance-tax-calculator',   label: '상속세 계산기',            desc: '상속재산·공제 기준 예상 상속세 간이 계산.' },
  { href: '/withholding-calculator',       label: '원천징수세액 계산기',      desc: '월 급여·부양가족·자녀 수 기준 예상 원천징수세액 계산.' },
]

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">사이트 소개</h1>
      <p className="text-center text-sm text-slate-500 mb-8">
        taxsim.kr · 무료 세금 계산기 서비스
      </p>

      <div className="calc-card p-8 space-y-8 text-sm leading-7 text-slate-600">

        {/* 서비스 소개 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">taxsim.kr 소개</h2>
          <p>
            taxsim.kr는 부가세, 종합소득세, 프리랜서 원천징수, 양도소득세, 증여세, 상속세,
            원천징수세액 등 실생활에서 자주 접하는 세금 계산을 누구나 쉽게 확인할 수 있도록
            돕기 위해 만들어진 무료 온라인 세금 계산 서비스입니다.
            회원가입이나 로그인 없이 누구나 자유롭게 이용할 수 있으며, 입력한 금액 정보는
            서버에 저장되지 않고 사용자의 브라우저에서만 처리됩니다.
          </p>
          <p className="mt-2">
            모든 계산기는 직관적인 인터페이스로 설계되어 있어 별도의 세무 지식 없이도
            누구나 즉시 결과를 확인할 수 있도록 구성했습니다.
          </p>
        </section>

        {/* 운영자 소개 — E-E-A-T 핵심 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">운영자 소개</h2>
          <p>
            taxsim.kr는 <strong className="text-slate-800">Incomelab</strong>에서
            운영하는 개인 재무·세금 도구 프로젝트입니다.
            Incomelab은 한국 직장인, 프리랜서, 개인사업자가 자주 마주치는 급여·세금 계산
            문제를 단순하고 정확하게 해결하는 웹 도구를 만드는 것을 목표로 합니다.
          </p>
          <p className="mt-2">
            운영자는 다년간 개인사업자·프리랜서로 활동하며 매년 부가세·종합소득세를 직접
            신고해 온 실무 경험을 바탕으로, 일반 사용자가 가장 헷갈리는 항목을 우선적으로
            반영하여 계산기를 설계했습니다. 동일한 운영자가 만든
            {' '}<Link href="https://연봉계산기.kr" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:underline">연봉계산기.kr</Link>{' '}
            과 함께 한국 세금·급여 계산 도구 라인업을 구성하고 있습니다.
          </p>
        </section>

        {/* 사이트를 만든 이유 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">왜 이 사이트를 만들었나요?</h2>
          <p>
            한국의 세금 제도는 항목별로 세율, 공제, 신고 시기가 다르고 매년 일부 기준이
            개정되기 때문에 일반 사용자가 정확한 세액을 가늠하기 어렵습니다. 기존 계산기들은
            UI가 복잡하거나 광고가 과도하거나, 입력값을 외부 서버로 전송하는 등 사용성과
            신뢰성에서 아쉬운 부분이 있었습니다.
          </p>
          <p className="mt-2">
            taxsim.kr는 이러한 문제를 해결하기 위해 <strong>① 모든 계산을 사용자
            브라우저 내부에서만 처리</strong>하고, <strong>② 광고를 최소한으로
            유지</strong>하며, <strong>③ 매년 세법 개정 사항을 반영</strong>하는 것을
            기본 원칙으로 운영합니다. 사용자가 신고 전 빠르게 예상 세액을 가늠하거나,
            견적·계약 단계에서 세금을 확인할 때 가장 먼저 떠오르는 도구가 되는 것을
            목표로 합니다.
          </p>
        </section>

        {/* 정보 출처 — E-E-A-T 핵심 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">정보 출처 및 근거</h2>
          <p>
            본 사이트의 모든 계산기는 다음 공식 자료를 기준으로 작성되었습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>국세청 홈택스 (<a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.hometax.go.kr</a>) — 신고·납부 기준</li>
            <li>국세법령정보시스템 (<a href="https://taxlaw.nts.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">taxlaw.nts.go.kr</a>) — 세법 본문 및 시행령</li>
            <li>소득세법 제55조 — 종합소득세 누진세율</li>
            <li>소득세법 시행령 제189조 — 간이세액표(원천징수)</li>
            <li>부가가치세법 제30조 — 일반과세자 세율(10%)</li>
            <li>상속세 및 증여세법 제26조·제56조 — 누진세율</li>
            <li>국세청 고시 「근로소득 간이세액표」 — 매년 갱신본 반영</li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            세율과 공제 기준은 매년 일부 개정될 수 있으며, 본 사이트는 개정 사항을 확인 후
            업데이트하지만 시점에 따라 최신 고시와 차이가 있을 수 있습니다.
            중요한 의사결정 시에는 반드시 국세청 또는 세무 전문가의 확인을 거치시기 바랍니다.
          </p>
        </section>

        {/* 업데이트 정책 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">업데이트 정책</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>현재 적용 기준: <strong>2026년 귀속 세율</strong></li>
            <li>주요 개정(세율·공제) 발생 시: 1~4주 이내 반영</li>
            <li>국세청 간이세액표: 매년 2월 갱신본 반영</li>
            <li>최근 점검일: 2026년 4월</li>
          </ul>
          <p className="mt-2">
            세법은 매년 개정되며, 특히 종합소득세·양도소득세·상속세는 공제 항목이 빈번히
            변경됩니다. 본 사이트는 변경 사항을 반영하지만, 시기에 따라 일부 누락이 있을 수
            있으므로 최종 신고 시에는 반드시 국세청 자료를 함께 확인하세요.
          </p>
        </section>

        {/* 제공 계산기 목록 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-3">제공 계산기 (7종)</h2>
          <ul className="space-y-3">
            {CALC_LIST.map(({ href, label, desc }) => (
              <li key={href} className="flex gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-[7px]" />
                <span>
                  <Link href={href} className="font-semibold text-blue-600 hover:underline">
                    {label}
                  </Link>
                  <span className="text-slate-500"> — {desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 가이드 안내 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">세금 가이드</h2>
          <p>
            계산기뿐 아니라 신고 시기, 절세 팁, 자주 하는 실수 등을 정리한
            <Link href="/guide" className="text-blue-600 hover:underline mx-1">세금 가이드</Link>
            도 함께 운영하고 있습니다. 프리랜서 종합소득세 신고법, 부가세 신고 체크리스트,
            5월 종소세 신고 가이드 등이 포함되어 있습니다.
          </p>
        </section>

        {/* 면책 — 강화 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">면책 안내</h2>
          <p>
            <strong className="text-slate-800">
              본 사이트는 실제 세무 신고를 대체하지 않으며 참고용 계산 도구입니다.
            </strong>
            {' '}본 사이트는 세무 자문(tax advisory)을 제공하지 않으며, 모든 계산 결과는
            일반적인 기준을 단순화하여 제공하는 추정치입니다.
          </p>
          <p className="mt-2">
            실제 세금은 개인의 소득 구조, 공제 항목, 부양가족 수, 사업 형태, 거주 요건,
            법령 개정 등에 따라 달라질 수 있으며, 본 계산기로 산출된 금액과 실제 신고
            세액 사이에 차이가 발생할 수 있습니다.
          </p>
          <p className="mt-2">
            중요한 의사결정이나 실제 세금 신고 시에는 반드시 국세청 홈택스 또는 세무사·
            회계사 등 전문가의 안내를 함께 참고하시기 바랍니다. 본 사이트의 계산 결과를
            근거로 한 의사결정의 결과에 대해서는 책임을 지지 않습니다.
          </p>
        </section>

        {/* 문의 */}
        <section className="border-t pt-4">
          <h2 className="text-base font-bold text-slate-800 mb-2">문의</h2>
          <p>
            계산 오류 신고, 기능 제안, 광고 문의 등은
            <Link href="/contact" className="text-blue-600 hover:underline mx-1">문의 페이지</Link>
            또는 이메일(<span className="font-medium text-slate-800">support@taxsim.kr</span>)
            로 연락 부탁드립니다.
          </p>
        </section>

      </div>
    </main>
  )
}
