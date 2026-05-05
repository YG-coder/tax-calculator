/* src/app/layout.tsx */
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://taxsim.kr'),

    title: {
        default: '세금 계산기 | 부가세·소득세·양도세·증여세·상속세',
        template: '%s | 세금 계산기',
    },

    description:
        '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 무료로 제공합니다. 2026년 세율 기준.',

    applicationName: '세금계산기',

    keywords: [
        '세금계산기',
        '부가세 계산기',
        '종합소득세 계산기',
        '프리랜서 3.3%',
        '양도소득세 계산기',
        '증여세 계산기',
        '상속세 계산기',
        '원천징수세액 계산기',
        '소득세 계산기',
        '2026년 세금',
        '세금 환급',
        'taxsim',
    ],

    authors: [{ name: 'Incomelab' }],
    creator: 'Incomelab',
    publisher: 'Incomelab',

    alternates: {
        canonical: '/',
    },

    verification: {
        other: {
            'naver-site-verification': '0444aa9bcf56047cc159d6bfb14999f757aef63c',
        },
    },

    // ✅ 아이콘 (현재 파일 구조 기준)
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },

    // ✅ OG (카카오/네이버/구글)
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: 'https://taxsim.kr',
        siteName: '세금계산기',
        title: '세금 계산기 | 부가세·소득세·양도세·증여세·상속세',
        description:
            '부가세, 종합소득세, 프리랜서 3.3%, 양도소득세, 증여세, 상속세, 원천징수세액 계산기를 무료로 제공합니다.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: '세금계산기',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: '세금 계산기',
        description: '세금 계산기를 무료로 제공합니다.',
        images: ['/og-image.png'],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    },

    // ✅ manifest 유지
    manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
    themeColor: '#2563eb',
    width: 'device-width',
    initialScale: 1,
}

// 네비
const NAV_ITEMS = [
    { href: '/vat-calculator', label: '부가세' },
    { href: '/income-tax-calculator', label: '종합소득세' },
    { href: '/freelancer-tax-calculator', label: '프리랜서 3.3%' },
    { href: '/withholding-calculator', label: '원천징수' },
    { href: '/guide', label: '가이드' },
]

// 로고
function HeaderLogo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white font-black">
        税
      </span>
            <span className="font-black text-slate-900 text-sm">
        세금<span className="text-blue-600">계산기</span>
      </span>
        </Link>
    )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <head>
            <meta name="format-detection" content="telephone=no" />

            {/* AdSense */}
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6405509957088169"
                crossOrigin="anonymous"
            />
        </head>

        <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen">
        {/* 네비 */}
        <nav className="sticky top-0 z-50 h-14 border-b bg-white">
            <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
                <HeaderLogo />
                <div className="hidden md:flex gap-2">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm">
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>

        {children}

        {/* 푸터 */}
        <footer className="mt-auto border-t bg-white">
            <div className="max-w-4xl mx-auto px-4 py-6 text-xs text-slate-500">
                <p>
                    본 사이트는 세무 자문을 제공하지 않으며, 계산 결과는 참고용입니다.
                    정확한 신고는 국세청 또는 전문가를 통해 확인하세요.
                </p>
                <p className="mt-2 text-slate-400">
                    © {new Date().getFullYear()} taxsim.kr · Incomelab
                </p>
            </div>
        </footer>
        </body>
        </html>
    )
}