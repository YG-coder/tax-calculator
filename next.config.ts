import type { NextConfig } from 'next';

/**
 * CSP 정책 본문.
 *
 * `upgrade-insecure-requests` 는 Report-Only 정책에서 브라우저가 무시하고
 * "directive is ignored when delivered in a report-only policy" 경고만 남긴다.
 * 그래서 강제(enforce) 모드일 때만 붙인다.
 */
/** CSP 위반 리포트 수집 경로. src/app/api/csp-report/route.ts 가 받는다. */
const CSP_REPORT_PATH = '/api/csp-report';

/**
 * Reporting API(`report-to`)는 절대 URL을 요구한다.
 * 배포 도메인이 바뀌면 `SITE_URL` 환경변수로 덮어쓴다.
 */
const SITE_ORIGIN = process.env.SITE_URL ?? 'https://taxsim.kr';

function contentSecurityPolicy(enforce: boolean): string {
    const directives = [
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
    ];
    if (enforce) directives.push('upgrade-insecure-requests');

    // 위반 내역을 실제로 모아야 enforce 전환 근거가 생긴다.
    // report-uri 는 구형·현행 브라우저가, report-to 는 Reporting API 지원 브라우저가 쓴다.
    directives.push(`report-uri ${CSP_REPORT_PATH}`);
    directives.push('report-to csp-endpoint');

    return directives.join('; ');
}

/**
 * 강제 CSP 전환 스위치.
 *
 * 기본값은 Report-Only 이고, 배포 환경 변수 `CSP_ENFORCE=1` 을 켜면 강제 정책으로 바뀐다.
 * 코드 수정 없이 되돌릴 수 있게 환경 변수로 뺐다.
 *
 * ⚠ 전환 전 확인할 것: `report-uri` / `report-to` 로 모인 위반 내역을 먼저 확인한다.
 *   배포 플랫폼 로그에서 "[csp]" 로 검색하면 나온다.
 *   AdSense 가 실제로 쓰는 출처 중 정책에 빠진 것이 없는지 며칠 관찰한 뒤 켜는 것이 안전하다.
 */
const CSP_ENFORCE = process.env.CSP_ENFORCE === '1';

const securityHeaders = [
    {
        key: CSP_ENFORCE ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
        value: contentSecurityPolicy(CSP_ENFORCE),
    },
    {
        // CSP 의 `report-to csp-endpoint` 가 가리키는 실제 목적지.
        key: 'Reporting-Endpoints',
        value: `csp-endpoint="${SITE_ORIGIN}${CSP_REPORT_PATH}"`,
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
