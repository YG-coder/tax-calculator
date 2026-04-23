/** @path src/app/layout.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://taxsim.kr"),
    title: {
        default: "세금계산기 | 부가세·종합소득세·원천징수 계산",
        template: "%s | 세금계산기",
    },
    description:
        "부가세 계산기, 종합소득세 계산기, 원천징수 계산기, 퇴직금 계산기, 프리랜서 3.3% 계산기, 4대보험 계산기를 무료로 제공합니다.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <head>
            {/* 애드센스 */}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6405509957088169"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
        </head>

        <body className="bg-slate-50 text-slate-900 antialiased">
        <nav className="sticky top-0 z-50 h-16 border-b bg-white/80 backdrop-blur-md flex items-center px-6">
            <div className="container mx-auto flex items-center">
                <Link href="/" className="font-black text-xl">
                    taxsim.kr
                </Link>
            </div>
        </nav>

        {children}

        <footer className="bg-white border-t py-10 mt-20">
            <div className="container mx-auto px-4 text-center text-slate-400 text-sm space-y-4">
                <div className="flex justify-center gap-4 flex-wrap">
                    <Link href="/about">사이트 소개</Link>
                    <Link href="/privacy">개인정보처리방침</Link>
                    <Link href="/terms">이용안내</Link>
                    <Link href="/contact">문의</Link>
                </div>
            </div>
        </footer>
        </body>
        </html>
    );
}