import type { NextConfig } from 'next';

const securityHeaders = [
    {
        // AdSense와 Next.js가 실제 배포 환경에서 요구하는 출처를 먼저 관찰한다.
        // 충분한 보고 기간 없이 강제 CSP를 켜면 광고·하이드레이션이 중단될 수 있으므로
        // 현재는 Report-Only로 배포하고 위반 내역 확인 후 강제 정책으로 전환한다.
        key: 'Content-Security-Policy-Report-Only',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com",
            "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            'upgrade-insecure-requests',
        ].join('; '),
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
];

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;
