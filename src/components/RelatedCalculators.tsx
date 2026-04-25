// src/components/RelatedCalculators.tsx
import Link from 'next/link'

interface RelatedItem {
  href: string
  label: string
  emoji: string
}

interface Props {
  current?: string   // 현재 페이지 slug (자기 자신 제외용)
  items?: RelatedItem[]
}

const ALL_CALCS: RelatedItem[] = [
  { href: '/vat-calculator',              label: '부가세 계산기',        emoji: '🧾' },
  { href: '/income-tax-calculator',       label: '종합소득세 계산기',     emoji: '📊' },
  { href: '/freelancer-tax-calculator',   label: '프리랜서 3.3% 계산기', emoji: '💻' },
  { href: '/capital-gains-tax-calculator',label: '양도소득세 계산기',     emoji: '🏠' },
  { href: '/gift-tax-calculator',         label: '증여세 계산기',         emoji: '🎁' },
  { href: '/inheritance-tax-calculator',  label: '상속세 계산기',         emoji: '📋' },
  { href: '/withholding-calculator',      label: '원천징수세액 계산기',   emoji: '💰' },
]

export default function RelatedCalculators({ current, items }: Props) {
  const list = items
    ?? ALL_CALCS.filter((c) => !current || c.href !== `/${current}`)

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-slate-800 mb-3">다른 세금 계산기</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="calc-card p-4 flex items-center gap-3 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <span className="text-2xl flex-shrink-0">{item.emoji}</span>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
