// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { CALCULATORS } from '@/lib/calculators'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taxsim.kr'
  const now = new Date()

  const calculatorRoutes = CALCULATORS
    .filter((c) => c.enabled)
    .map((c) => ({
      url: `${baseUrl}/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))

  return [
    { url: baseUrl,              lastModified: now, changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: `${baseUrl}/about`,   lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.4 },
    { url: `${baseUrl}/terms`,   lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly'  as const, priority: 0.4 },
    ...calculatorRoutes,
  ]
}
