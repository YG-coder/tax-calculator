/* src/app/layout.tsx */
import type { Metadata } from 'next'
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
    alternates: {
        canonical: '/',
    },
    verification: {
        other: {
            'naver-site-verification': '0444aa9bcf56047cc159d6bfb14999f757aef63c',
        },
    },
}

const NAV_ITEMS = [
  { href: '/vat-calculator', label: '부가세' },
  { href: '/income-tax-calculator', label: '종합소득세' },
  { href: '/freelancer-tax-calculator', label: '프리랜서 3.3%' },
  { href: '/withholding-calculator', label: '원천징수' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="ko">
      <head>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6405509957088169"
            crossOrigin="anonymous"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">

      {/* 네비바 */}
      <nav className="sticky top-0 z-50 h-14 border-b bg-white/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-bold select-none">
                税
              </span>
            <span className="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-blue-600 transition-colors">
                세금계산기<span className="text-blue-500">.kr</span>
              </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
            ))}
          </div>
        </div>
      </nav>

      {children}

      {/* 푸터 */}
      <footer className="mt-auto border-t bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Link href="/vat-calculator"             className="text-xs text-slate-500 hover:text-blue-600 transition-colors">부가세 계산기</Link>
            <Link href="/income-tax-calculator"      className="text-xs text-slate-500 hover:text-blue-600 transition-colors">종합소득세 계산기</Link>
            <Link href="/freelancer-tax-calculator"  className="text-xs text-slate-500 hover:text-blue-600 transition-colors">프리랜서 3.3% 계산기</Link>
            <Link href="/capital-gains-tax-calculator" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">양도소득세 계산기</Link>
            <Link href="/gift-tax-calculator"        className="text-xs text-slate-500 hover:text-blue-600 transition-colors">증여세 계산기</Link>
            <Link href="/inheritance-tax-calculator" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">상속세 계산기</Link>
            <Link href="/withholding-calculator"     className="text-xs text-slate-500 hover:text-blue-600 transition-colors">원천징수세액 계산기</Link>
          </div>
          <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} taxsim.kr</p>
            <div className="flex gap-4 text-xs text-slate-500">
              <Link href="/about"   className="hover:text-blue-600 transition-colors">소개</Link>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">개인정보처리방침</Link>
              <Link href="/terms"   className="hover:text-blue-600 transition-colors">이용안내</Link>
              <Link href="/contact" className="hover:text-blue-600 transition-colors">문의</Link>
            </div>
          </div>
        </div>
      </footer>

      </body>
      </html>
  )
}
