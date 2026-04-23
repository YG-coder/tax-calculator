import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taxsim.kr'

    const appDir = path.join(process.cwd(), 'src/app')

    const pages = fs.readdirSync(appDir)
        .filter((file) => {
            return (
                file !== 'api' &&
                file !== 'layout.tsx' &&
                file !== 'page.tsx' &&
                file !== 'globals.css' &&
                file !== 'not-found.tsx' &&
                !file.startsWith('_')
            )
        })

    const routes = pages.map((page) => ({
        url: `${baseUrl}/${page}`,
        lastModified: new Date(),
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...routes,
    ]
}