// src/app/guide/gift-split/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '증여세 절세, 10년 단위 분할 증여 완벽 정리 (2026)',
  description:
    '증여재산공제가 10년마다 갱신되는 원리를 활용한 분할 증여 전략을 정리. 공제 한도, 동일인 합산, 혼인·출산 증여공제 특례까지 사례로 설명합니다.',
  alternates: { canonical: '/guide/gift-split' },
}

export default function GiftSplitGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700">증여세</span>
          <span className="text-xs text-slate-400">약 7분 읽기</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
          증여세 절세, 10년 단위 분할 증여 완벽 정리
        </h1>
        <p className="text-slate-500">
          증여세 절세의 핵심은 「공제 한도는 10년마다 새로 채워진다」는 점을 활용하는 것입니다. 분할 증여의
          원리와 주의할 함정을 정리했습니다.
        </p>
      </div>

      <article className="prose prose-slate max-w-none text-sm leading-7 text-slate-700 space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">왜 10년인가</h2>
          <p>
            증여세는 동일인에게서 받은 증여를 <strong>10년 단위로 합산</strong>해 과세합니다. 바꿔 말하면
            증여재산공제 한도(성인 자녀 5,000만 원 등)도 10년마다 새로 채워집니다. 그래서 한 번에 크게
            주기보다 <strong>긴 호흡으로 나누어 주면</strong> 공제를 반복 활용하고 누진세율 부담을 낮출 수
            있습니다.
          </p>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mt-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              💡 <strong>핵심:</strong> 증여공제는 10년마다 리셋. 일찍 시작해 나누어 줄수록 같은 금액이라도
              세금이 줄어듭니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">증여재산공제 한도 (10년 합산)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>배우자: <strong>6억 원</strong></li>
            <li>직계존·비속 (성인): <strong>5,000만 원</strong></li>
            <li>직계존·비속 (미성년 자녀): <strong>2,000만 원</strong></li>
            <li>기타 친족: <strong>1,000만 원</strong></li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            이 한도는 건별이 아니라 10년 누적 기준입니다. 같은 10년 안에서 이미 한도를 다 썼다면 추가 공제는 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">분할 증여의 효과</h2>
          <p>
            예를 들어 성인 자녀에게 30년에 걸쳐 나누어 주면 10년 단위로 공제 5,000만 원을 세 번 활용할 수
            있어, 단순 계산상 1억 5,000만 원을 무세(無稅)로 이전할 수 있습니다. 미성년기에 시작하면
            구간이 늘어나 효과가 더 커집니다. 부동산·주식처럼 가치가 오를 자산은 <strong>가치가 낮을 때
            일찍 증여</strong>하면 향후 상승분에 대한 세금까지 줄일 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">혼인·출산 증여공제 특례</h2>
          <p>
            직계존속이 자녀에게 <strong>혼인신고일 전후 2년 이내</strong> 또는 <strong>자녀 출생·입양일부터
            2년 이내</strong>에 증여하면, 일반 공제(5,000만 원)와 별도로 <strong>최대 1억 원</strong>을
            추가 공제받을 수 있습니다(혼인·출산 통합 한도 1억 원). 결혼·출산을 앞두고 있다면 이 특례를
            함께 활용하면 한 번에 더 큰 금액을 무세로 이전할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">실제 사례</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 1. 자녀가 미성년일 때 시작</p>
            <p>
              자녀 5세에 2,000만(미성년 공제), 15세에 2,000만, 성인(20대)에 5,000만, 30대에 다시 5,000만
              증여 → 각 10년 구간 공제를 활용해 누적 무세 이전 가능.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-3">
            <p className="font-semibold text-slate-800 mb-2">사례 2. 결혼 자녀에게 (혼인 특례)</p>
            <p>
              성인 자녀 공제 5,000만 + 혼인 증여공제 1억 = <strong>1억 5,000만 원까지 무세</strong> 이전 가능
              (혼인신고 전후 2년 내 증여).
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="font-semibold text-slate-800 mb-2">사례 3. 한 번에 3억 vs 나눠서 증여</p>
            <p>
              성인 자녀에게 한 번에 3억 → 과세표준 2.5억, 산출세액 4,000만 원. 같은 3억을 10년 간격으로
              나누면 구간별 공제·낮은 누진구간 활용으로 세 부담이 크게 줄어듭니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">분할 증여의 함정</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>10년 합산을 잊지 말 것:</strong> 같은 10년 안에 쪼개도 합산되어 효과가 없습니다. 구간을 넘겨야 의미가 있습니다.</li>
            <li><strong>동일인 범위 주의:</strong> 직계존속의 경우 그 배우자(예: 아버지+어머니)도 동일인으로 합산됩니다.</li>
            <li><strong>증여 시점 증빙:</strong> 자금 이체 내역, 증여계약서 등으로 증여 시점을 명확히 남겨야 합니다.</li>
            <li><strong>신고는 매번:</strong> 공제 한도 내라도 신고로 기록을 남기는 편이 안전합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-2">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 아버지와 어머니에게 따로 받으면 공제도 따로인가요?</p>
              <p>직계존속(부모)은 그 배우자를 포함해 동일인으로 합산합니다. 부모에게서 받은 증여는 합쳐서 5,000만 원 한도입니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 할아버지가 손주에게 직접 주면요?</p>
              <p>세대를 건너뛴 증여는 산출세액의 30%(미성년·20억 초과는 40%)가 할증됩니다. 공제는 별도 한도가 적용됩니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 혼인 증여공제는 양가에서 각각 받을 수 있나요?</p>
              <p>본인이 직계존속(부모)으로부터 받는 기준으로 통합 1억 원 한도입니다. 부부 각자 본인 부모에게서 받을 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="font-semibold text-slate-800 mb-1">Q. 부동산을 증여하면 어떤 점이 다른가요?</p>
              <p>증여 시점의 평가액으로 과세되고, 취득세 등 별도 비용이 발생합니다. 가치 상승 자산은 일찍 증여하는 게 유리할 수 있습니다.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 계산기</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/gift-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 증여세 계산기</Link>
              <span className="text-slate-500"> · 증여금액·공제 기준 예상 세액</span>
            </li>
            <li>
              <Link href="/inheritance-tax-calculator" className="text-blue-700 hover:underline font-semibold">→ 상속세 계산기</Link>
              <span className="text-slate-500"> · 상속재산 기준 예상 세액</span>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-100 bg-slate-50 p-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">관련 가이드</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/inheritance-vs-gift" className="text-blue-700 hover:underline font-semibold">→ 상속세 vs 증여세, 뭐가 더 유리할까</Link></li>
            <li><Link href="/guide/family-loan" className="text-blue-700 hover:underline font-semibold">→ 부모 자식 간 차용증 쓰는 법</Link></li>
          </ul>
        </section>

        <section className="border-t pt-4 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">참고 자료</p>
          <ul className="list-disc pl-5 space-y-0.5">
            <li>상속세 및 증여세법 제53조 (증여재산공제), 제53조의2 (혼인·출산 증여재산공제), 제47조 (증여세 과세가액)</li>
            <li>국세청 「증여세 안내」, 홈택스</li>
          </ul>
          <p className="mt-3">
            본 가이드는 일반적인 안내이며 개인 사정에 따라 적용이 달라질 수 있습니다. 절세는 합법적 범위
            내에서만 가능하며, 실제 적용은 국세청 또는 세무 전문가의 안내를 함께 참고하시기 바랍니다.
          </p>
        </section>
      </article>
    </main>
  )
}
