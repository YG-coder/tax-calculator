/** @path src/app/layout.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://taxsim.kr"),
    title: {
        default: "세금 계산기 | 부가세·종합소득세·원천징수 계산",
        template: "%s | 세금 계산기",
    },
    description:
        "부가세 계산기, 종합소득세 계산기, 원천징수 계산기, 퇴직금 계산기, 프리랜서 3.3% 계산기, 4대보험 계산기를 무료로 제공합니다.",
    verification: {
        other: {
            "naver-site-verification": "0444aa9bcf56047cc159d6bfb14999f757aef63c",
        },
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <head>
            <script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6405509957088169"
                crossOrigin="anonymous"
            ></script>
        </head>

        <body className="bg-slate-50 text-slate-900 antialiased">

        {/* ✅ 네비바 */}
        <nav className="sticky top-0 z-50 h-14 border-b bg-white/80 backdrop-blur-md flex items-center px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between w-full">

                <Link href="/" className="flex items-center gap-2 font-black text-lg text-slate-900">
                    세금 계산기
                    <span className="text-xs font-medium text-slate-400">
        taxsim.kr
      </span>
                </Link>

                <div className="hidden md:flex gap-5 text-sm text-slate-600">
                    <Link href="/vat-calculator">부가세</Link>
                    <Link href="/income-tax-calculator">종합소득세</Link>
                    <Link href="/withholding-calculator">원천징수</Link>
                    <Link href="/insurance-calculator">4대보험</Link>
                </div>

            </div>
        </nav>

        {children}

        {/* ✅ 푸터 */}
        <footer className="bg-white border-t py-12 mt-20">
            <div className="container mx-auto px-4 text-center text-slate-500 text-sm space-y-6">

                {/* SEO 설명 */}
                <p className="max-w-xl mx-auto leading-relaxed">
                    세금 계산기는 부가세, 종합소득세, 원천징수, 4대보험 등
                    다양한 세금 계산을 간편하게 할 수 있도록 제공하는 무료 온라인 도구입니다.
                </p>

                {/* 링크 */}
                <div className="flex justify-center gap-6 flex-wrap">
                    <Link href="/about">사이트 소개</Link>
                    <Link href="/privacy">개인정보처리방침</Link>
                    <Link href="/terms">이용안내</Link>
                    <Link href="/contact">문의</Link>
                </div>

                {/* 카피 */}
                <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} 세금 계산기 (taxsim.kr). All rights reserved.
                </p>
            </div>
        </footer>

        </body>
        </html>
    );
}