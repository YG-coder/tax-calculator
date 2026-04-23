/** @path src/app/layout.tsx */
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://taxsim.kr"),

    title: {
        default: "세금계산기 | 부가세·종합소득세·원천징수 계산",
        template: "%s | 세금계산기",
    },

    description:
        "부가세 계산기, 종합소득세 계산기, 원천징수 계산기, 퇴직금 계산기를 무료로 제공합니다. 복잡한 세금을 간편하게 계산하세요.",

    keywords: [
        "세금계산기",
        "부가세 계산기",
        "종합소득세 계산기",
        "원천징수 계산기",
        "퇴직금 계산기",
    ],

    openGraph: {
        title: "세금계산기 | 무료 세금 계산 서비스",
        description:
            "부가세, 종합소득세, 원천징수, 퇴직금 계산기를 한 번에 제공",
        url: "https://taxsim.kr",
        siteName: "세금계산기",
        locale: "ko_KR",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "세금계산기 | 무료 세금 계산 서비스",
        description:
            "부가세, 종합소득세, 원천징수, 퇴직금 계산기를 한 번에 제공",
    },

    verification: {
        google: "QVVkIsXBCgu9EREkYU9Yhk2Zd-UsdqPIfNnIa-m1_8E",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body className="bg-slate-50 text-slate-900 antialiased">

        <nav className="sticky top-0 z-50 h-16 border-b bg-white/80 backdrop-blur-md flex items-center px-6">
            <div className="container mx-auto flex items-center">
                <Link
                    href="/"
                    className="font-black text-xl tracking-tighter hover:opacity-80 transition-opacity"
                >
                    taxsim.kr
                </Link>
            </div>
        </nav>

        {children}

        <footer className="bg-white border-t py-10 mt-20">
            <div className="container mx-auto px-4 text-center text-slate-400 text-sm space-y-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link href="/privacy" className="hover:text-slate-600">
                        개인정보처리방침
                    </Link>
                    <Link href="/terms" className="hover:text-slate-600">
                        이용안내
                    </Link>
                    <Link href="/contact" className="hover:text-slate-600">
                        문의
                    </Link>
                </div>

                <p className="text-xs leading-relaxed max-w-xl mx-auto">
                    © 2026 taxsim.kr. 본 사이트는 부가세 계산기, 종합소득세 계산기,
                    원천징수 계산기, 퇴직금 계산기를 제공하며 모든 계산 결과는 참고용으로
                    실제 세금과 차이가 있을 수 있습니다.
                </p>
            </div>
        </footer>

        </body>
        </html>
    );
}