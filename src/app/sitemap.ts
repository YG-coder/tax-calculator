import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taxsim.kr'

    const routes = [
        '',
        '/vat-calculator',
        '/income-tax-calculator',
        '/withholding-calculator',
        '/severance-calculator',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }))
}