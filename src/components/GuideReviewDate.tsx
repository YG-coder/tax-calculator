import { GUIDE_LAST_MODIFIED, type GuideSlug } from '@/lib/content-registry'

type GuideReviewDateProps = {
  slug: GuideSlug
  className?: string
}

function displayDate(date: string): string {
  return date.replaceAll('-', '.')
}

/** 가이드 레지스트리에 기록된 실제 최근 검토일을 표시한다. */
export default function GuideReviewDate({ slug, className = 'text-xs text-slate-400' }: GuideReviewDateProps) {
  const date = GUIDE_LAST_MODIFIED[slug]

  return (
    <time dateTime={date} className={className}>
      최근 검토 {displayDate(date)}
    </time>
  )
}
