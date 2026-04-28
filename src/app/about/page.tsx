// src/app/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '사이트 소개 | 세금계산기',
  description:
    'taxsim.kr는 부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 무료로 제공하는 온라인 세금 계산 서비스입니다.',
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
      <h1 className="text-3xl font-bold mb-8 text-center">사이트 소개</h1>

      <div className="calc-card p-8 space-y-8 text-sm leading-7 text-slate-600">

        {/* 서비스 소개 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">taxsim.kr 소개</h2>
          <p>
            taxsim.kr는 복잡한 세금 계산을 쉽고 빠르게 확인할 수 있도록 돕기 위해 만들어진
            온라인 세금 계산 서비스입니다. 개인, 프리랜서, 개인사업자 등
            누구나 별도의 회원가입 없이 무료로 이용할 수 있습니다.
          </p>
          <p className="mt-2">
            부가세, 종합소득세, 프리랜서 원천징수, 양도소득세, 증여세, 상속세,
            원천징수세액 등 실생활에서 자주 접하는 세금 계산을 중심으로 구성되어 있으며,
            복잡한 공식 없이 직관적으로 결과를 확인할 수 있도록 설계되었습니다.
          </p>
        </section>

        {/* 운영 목적 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">운영 목적</h2>
          <p>
            세금은 많은 사람들이 어려워하는 영역 중 하나입니다.
            taxsim.kr는 이러한 복잡한 세금 계산을 단순화하여
            누구나 쉽게 이해하고 활용할 수 있도록 돕는 것을 목표로 합니다.
          </p>
          <p className="mt-2">
            단순히 숫자를 계산하는 것을 넘어,
            사용자가 실제 상황에서 참고할 수 있는 기준 정보를 함께 제공합니다.
            모든 계산 결과는 참고용이며, 실제 신고 시에는 홈택스 또는 세무 전문가를 통해 확인하세요.
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
          <p className="mt-3 text-slate-500">
            모든 계산기는 입력값 기반으로 즉시 결과를 확인할 수 있으며,
            로그인 없이 자유롭게 이용할 수 있습니다.
          </p>
        </section>

        {/* 이용 안내 */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-2">이용 안내</h2>
          <p>
            본 사이트의 계산 결과는 일반적인 기준을 바탕으로 제공되는 참고용 정보입니다.
            실제 세금은 개인의 상황, 공제 항목, 법령 변경 등에 따라 달라질 수 있습니다.
          </p>
          <p className="mt-2">
            중요한 의사결정이나 세금 신고 시에는
            국세청 홈택스 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>

        {/* 면책 */}
        <section className="border-t pt-4 text-xs text-slate-400 leading-relaxed">
          본 사이트는 세금 계산 정보를 제공하는 참고용 서비스이며 법적 책임을 지지 않습니다.<br />
          정확한 세금은 국세청 또는 세무 전문가를 통해 확인하시기 바랍니다.
        </section>

      </div>
    </main>
  )
}
