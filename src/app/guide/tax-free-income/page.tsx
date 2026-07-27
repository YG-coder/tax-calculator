// src/app/guide/tax-free-income/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const title = '근로소득 비과세 판정 방법｜항목별 적용 조건과 자주 틀리는 사례'
const description =
  '내 급여의 비과세 여부를 어떻게 판정하는지 2026년 국세청 기준으로 정리했습니다. 비과세·소득공제·세액공제·감면의 차이, 식대·차량보조금·보육수당 등 항목별 적용 조건, 자주 틀리는 사례와 FAQ까지 확인하세요.'
const path = '/guide/tax-free-income'
const url = `https://taxsim.kr${path}`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  keywords: [
    '근로소득 비과세 판정',
    '비과세 적용 조건',
    '식대 비과세 조건',
    '자가운전보조금 요건',
    '출산보육수당 비과세',
    '비과세 소득공제 차이',
  ],
  openGraph: {
    title: `${title} | 세금계산기`,
    description,
    url,
    siteName: '세금계산기',
    locale: 'ko_KR',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | 세금계산기`,
    description,
  },
}

const FAQ = [
  {
    q: '비과세와 소득공제는 뭐가 다른가요?',
    a: '비과세는 처음부터 과세대상 소득(총급여)에서 빠지는 금액이고, 소득공제는 과세표준을 계산하는 단계에서 차감하는 금액입니다. 비과세분은 총급여 자체에 잡히지 않으므로 근로소득공제·각종 공제 계산의 기준 금액도 함께 낮아집니다.',
  },
  {
    q: '중소기업 취업자 소득세 감면은 비과세인가요?',
    a: '아닙니다. 중소기업 취업자 소득세 감면은 산출된 근로소득세의 일부(연령·업종에 따라 70%~90%)를 감면하는 별도 제도입니다. 비과세 급여가 아니므로 비과세 항목과 섞어 계산하면 안 됩니다.',
  },
  {
    q: '식대 20만원과 자가운전보조금 20만원을 동시에 비과세로 받을 수 있나요?',
    a: '요건을 각각 충족하면 항목별로 동시에 적용됩니다. 식대(현물 식사 미제공), 자가운전보조금(본인 차량·업무용·여비 미수령) 요건을 모두 갖추면 각 월 20만원씩 비과세됩니다.',
  },
  {
    q: '맞벌이 부부가 같은 자녀로 각각 보육수당을 받으면 둘 다 비과세인가요?',
    a: '국세청 안내에 따르면 6세 이하 자녀 보육수당은 소득자별로 비과세가 적용되어, 맞벌이 부부가 동일한 자녀를 기준으로 각자 회사에서 받더라도 각각 자녀 1인당 월 20만원까지 비과세받을 수 있습니다.',
  },
  {
    q: '비과세 한도를 초과해서 받으면 어떻게 되나요?',
    a: '전액이 과세되는 것이 아니라 한도 초과분만 과세됩니다. 예를 들어 식대를 월 25만원 받으면 20만원은 비과세, 초과 5만원만 과세 대상 급여로 합산됩니다.',
  },
  {
    q: '배우자 명의 차량도 자가운전보조금 비과세가 되나요?',
    a: '자가운전보조금 비과세는 원칙적으로 본인 소유 또는 본인 명의로 임차한 차량을 업무에 사용하는 경우가 대상입니다. 배우자 등 타인 명의 차량은 일반적으로 인정되지 않으며, 별도의 실제 여비를 받으면 비과세가 배제될 수 있습니다. 구체적 인정 여부는 회사 규정·증빙과 함께 확인하세요.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '세금계산기', item: 'https://taxsim.kr' },
    { '@type': 'ListItem', position: 2, name: '세금 가이드', item: 'https://taxsim.kr/guide' },
    { '@type': 'ListItem', position: 3, name: '근로소득 비과세 판정 방법', item: url },
  ],
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '근로소득 비과세 판정 방법',
  description,
  inLanguage: 'ko-KR',
  mainEntityOfPage: url,
  author: { '@type': 'Organization', name: 'Incomelab' },
  publisher: {
    '@type': 'Organization',
    name: 'Incomelab',
    logo: { '@type': 'ImageObject', url: 'https://taxsim.kr/og-image.png' },
  },
}

export default function TaxFreeIncomeGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">근로소득</span>
          <span className="text-xs text-slate-400">약 8분 읽기 · 2026년 기준</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          근로소득 비과세 판정 방법
        </h1>
        <p className="text-slate-500">
          내 급여의 각 항목이 비과세가 되는지 <strong>어떻게 판정하는지</strong>를 국세청 기준으로 정리했습니다.
          비과세와 소득공제·세액공제·감면의 차이, 항목별 적용 조건, 자주 틀리는 사례까지 한 번에 확인하세요.
        </p>
        <p className="mt-3 text-xs text-slate-500 rounded-lg bg-slate-50 px-3 py-2">
          👉 항목별 <strong>한도만 빠르게</strong> 확인하려면 <Link href="/guide/non-taxable-allowance" className="text-blue-600 hover:underline">비과세 수당 종류와 한도</Link> 페이지를,
          <strong>내 사례가 비과세인지 판정</strong>하려면 이 가이드를 참고하세요.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        {/* 1. 비과세란 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">1. 근로소득 비과세란</h2>
          <p>
            비과세 근로소득은 회사에서 받는 돈이지만 <strong>일정한 법정 요건을 충족하면 근로소득세 계산 대상에서
            제외되는 금액</strong>입니다. 비과세분은 애초에 총급여에 포함되지 않으므로, 원천징수세액과 연말정산
            세액이 함께 줄어듭니다. 국민연금·건강보험·고용보험의 보수월액 산정에서도 대체로 제외됩니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 비과세는 「항목」과 「한도」, 그리고 「요건」이 함께 정해져 있습니다. 금액을 받았다고
              무조건 비과세가 아니라, 항목별 요건(식사 제공 여부, 차량 명의, 자녀 연령, 직종 등)을 충족해야 합니다.
            </p>
          </div>
        </section>

        {/* 2. 비과세와 소득공제/세액공제/감면 차이 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">2. 비과세 · 소득공제 · 세액공제 · 감면의 차이</h2>
          <p>
            네 가지는 세금을 줄인다는 점은 같지만 <strong>적용되는 계산 단계가 다릅니다</strong>. 이를 섞으면 계산이
            틀어지므로 구분이 중요합니다.
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs border-collapse min-w-[420px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">구분</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">적용 단계</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">예시</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['비과세', '처음부터 과세대상 소득(총급여)에서 제외', '식대, 자가운전보조금, 보육수당'],
                  ['소득공제', '과세표준 계산 단계에서 차감', '근로소득공제, 인적공제, 신용카드'],
                  ['세액공제', '산출된 세금에서 직접 차감', '근로소득세액공제, 자녀세액공제'],
                  ['소득세 감면', '산출세액의 일정 비율을 감면', '중소기업 취업자 소득세 감면'],
                ].map(([k, v, e]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 font-bold text-blue-600">{k}</td>
                    <td className="px-3 py-2 text-slate-600">{v}</td>
                    <td className="px-3 py-2 text-slate-500">{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            특히 <strong>중소기업 취업자 소득세 감면</strong>은 비과세 급여가 아니라 산출세액을 감면하는 별도 제도입니다.
            비과세 항목과 섞어서 계산하지 않도록 주의하세요.
          </p>
        </section>

        {/* 3~5. 종류·조건·한도 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">3. 주요 비과세 종류와 적용 조건·한도</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[520px]">
              <thead><tr className="bg-slate-50">
                <th className="px-3 py-2 text-left font-semibold text-slate-600">항목</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">한도</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">주요 조건</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">계산기</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['식대', '월 20만원', '현물 식사 제공 미수령', '지원'],
                  ['자가운전보조금', '월 20만원', '차량 명의·업무 사용·여비 미수령', '지원'],
                  ['출산·보육수당', '자녀 1인당 월 20만원', '6세 이하 자녀 보육', '지원'],
                  ['연구보조비', '월 20만원', '대상 기관·직종(교원·연구원 등)', '지원'],
                  ['국외근로소득', '월 100만 / 500만원', '국외 근무지·업종', '조건부'],
                  ['생산직 초과근로수당', '연 240만원', '직종·월정액급여·직전연도 총급여', '조건부'],
                  ['학자금', '요건 충족액', '업무 관련 교육·회사 지급', '안내'],
                  ['출장비·숙직료', '실비 범위', '회사 규정·실제 업무 관련성', '안내'],
                ].map(([k, v, c, s]) => (
                  <tr key={k} className="bg-white">
                    <td className="px-3 py-2 text-slate-600">{k}</td>
                    <td className="px-3 py-2 font-bold text-blue-600">{v}</td>
                    <td className="px-3 py-2 text-slate-500">{c}</td>
                    <td className="px-3 py-2 text-slate-500">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-800 mt-5 mb-2">4. 항목별 적용 조건 자세히</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>식대:</strong> 회사가 구내식당 등 현물 식사를 제공하면 그 식사는 비과세지만, 현물 식사를 받으면서 별도 식대까지 받으면 그 식대는 과세될 수 있습니다. 현물 미제공 시 월 20만원까지 비과세.</li>
            <li><strong>자가운전보조금:</strong> 세법상 비과세 대상이 되는 본인 소유 또는 본인 명의 임차 차량을 업무에 사용하고, 실제 여비를 따로 받지 않을 때 월 20만원까지 비과세됩니다.</li>
            <li><strong>출산·보육수당:</strong> 6세 이하 자녀 보육과 관련한 수당으로, 2026년부터 <strong>자녀 1인당</strong> 월 20만원까지 비과세됩니다(예: 자녀 2명이면 월 40만원). 사용자가 지급하는 출산지원금은 출생 후 2년 이내·2회 이내 지급분에 한해 별도로 전액 비과세됩니다.</li>
            <li><strong>연구보조비·연구활동비:</strong> 교원·연구원 등 대상 직종·기관 요건을 갖춘 경우 월 20만원까지 비과세됩니다.</li>
            <li><strong>국외근로소득:</strong> 일반 국외근무는 월 100만원, 원양어업·외항선박 선원과 해외건설현장 등은 월 500만원까지 비과세됩니다. 출장·연수 목적 출국 기간의 급여는 국외근로소득으로 보지 않습니다.</li>
            <li><strong>생산직 초과근로수당:</strong> 공장·광산 등 생산 및 그 관련직 근로자로서 <strong>월정액급여 210만원 이하</strong>이고 <strong>직전 과세기간 총급여 3,000만원 이하</strong>인 경우, 연장·야간·휴일근로수당을 연 240만원 한도로 비과세합니다. 단순 금액만으로 판단하기 어려워 요건 입력이 필요합니다.</li>
          </ul>
        </section>

        {/* 6. 자주 틀리는 사례 */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">6. 자주 틀리는 사례</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <p className="font-semibold text-slate-800 mb-1">사례 1. 감면을 비과세로 착각</p>
              <p>중소기업 취업자 소득세 감면은 비과세가 아니라 세액 감면입니다. 총급여에서 빼는 방식으로 계산하면 안 됩니다.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <p className="font-semibold text-slate-800 mb-1">사례 2. 현물 식사 + 식대 동시 수령</p>
              <p>구내식당을 이용(현물 제공)하면서 식대까지 현금으로 받으면 그 식대는 과세될 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <p className="font-semibold text-slate-800 mb-1">사례 3. 생산직인데 월정액급여 초과</p>
              <p>생산직이라도 월정액급여가 210만원을 넘거나 직전연도 총급여가 3,000만원을 넘으면 초과근로수당 비과세가 배제됩니다.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <p className="font-semibold text-slate-800 mb-1">사례 4. 국외근로 한도 혼동</p>
              <p>해외건설현장 등은 월 500만원이지만 일반 국외근무는 월 100만원까지만 비과세입니다. 업종·근무지에 따라 한도가 다릅니다.</p>
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">7. 자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-800 mb-1">Q. {f.q}</p>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. 계산기 CTA */}
        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">내 비과세 금액 계산하기</h2>
          <p className="mb-3 text-sm text-slate-600">
            급여명세서 항목을 입력하면 항목별 비과세 인정액과 월·연 과세대상 급여를 바로 확인할 수 있습니다.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tax-free-income-calculator" className="text-blue-700 hover:underline font-semibold">→ 근로소득 비과세 계산기</Link>
              <span className="text-slate-500"> · 항목별 요건 확인 후 비과세 금액 산출</span>
            </li>
            <li>
              <Link href="/withholding-calculator" className="text-blue-700 hover:underline font-semibold">→ 원천징수세액 계산기</Link>
              <span className="text-slate-500"> · 월 급여 기준 예상 원천징수 확인</span>
            </li>
            <li>
              <Link href="/income-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 종합소득세 계산기</Link>
              <span className="text-slate-500"> · 합산 소득 예상 세액</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/non-taxable-allowance" className="text-blue-700 hover:underline font-semibold">→ 비과세 수당 종류와 한도</Link></li>
            <li><Link href="/guide/withholding-year-end" className="text-blue-700 hover:underline font-semibold">→ 원천징수와 연말정산은 어떻게 연결되나</Link></li>
            <li><Link href="/guide/income-tax-may" className="text-blue-700 hover:underline font-semibold">→ 5월 종합소득세 신고 가이드</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>소득세법 제12조(비과세소득) — 국가법령정보센터</li>
            <li>소득세법 시행령 제12조·제16조·제17조·제17조의2 — 국가법령정보센터</li>
            <li>국세청 「비과세 근로소득」 안내 (홈택스)</li>
          </ul>
          <p className="mt-3">
            본 가이드는 국세청 공식 자료를 바탕으로 정리한 참고용 정보입니다. 비과세 한도·요건은 개정될 수 있고
            항목별로 다르므로, 실제 적용은 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
