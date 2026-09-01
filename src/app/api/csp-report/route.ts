// src/app/api/csp-report/route.ts
//
// CSP 위반 리포트 수집 엔드포인트.
//
// Report-Only 정책만 걸어두면 위반이 방문자 브라우저 콘솔에만 남고 어디에도 모이지 않는다.
// 강제(enforce) 정책으로 전환하려면 "무엇이 차단될 뻔했는지"를 먼저 알아야 하므로,
// 브라우저가 보내는 리포트를 서버 로그로 남긴다.
//
// 브라우저는 두 가지 형식을 보낸다.
//   · report-uri  → Content-Type: application/csp-report,      { "csp-report": {...} }
//   · report-to   → Content-Type: application/reports+json,     [ { "type": "csp-violation", "body": {...} }, ... ]
//
// 개인정보는 남기지 않는다. IP·User-Agent·쿠키를 읽지 않고, 리포트에서 필요한 필드만 골라 기록한다.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
/** 정적 생성 대상이 아니다. 요청마다 실행한다. */
export const dynamic = 'force-dynamic';

/** 본문 크기 상한 (바이트). 이보다 크면 읽지 않고 버린다. */
const MAX_BODY_BYTES = 64 * 1024;

/** 로그 한 줄에 남길 필드. 나머지는 버린다. */
type ViolationLog = {
    documentUri?: string;
    violatedDirective?: string;
    effectiveDirective?: string;
    blockedUri?: string;
    disposition?: string;
    statusCode?: number;
    sourceFile?: string;
    lineNumber?: number;
};

function pick(raw: unknown): ViolationLog | null {
    if (typeof raw !== 'object' || raw === null) return null;
    const r = raw as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, 500) : undefined);
    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);

    const out: ViolationLog = {
        // report-uri 는 kebab-case, report-to(Reporting API)는 camelCase 를 쓴다.
        documentUri: str(r['document-uri'] ?? r.documentURL ?? r.documentUri),
        violatedDirective: str(r['violated-directive'] ?? r.violatedDirective),
        effectiveDirective: str(r['effective-directive'] ?? r.effectiveDirective),
        blockedUri: str(r['blocked-uri'] ?? r.blockedURL ?? r.blockedUri),
        disposition: str(r.disposition),
        statusCode: num(r['status-code'] ?? r.statusCode),
        sourceFile: str(r['source-file'] ?? r.sourceFile),
        lineNumber: num(r['line-number'] ?? r.lineNumber),
    };

    // 아무 필드도 못 건졌으면 리포트가 아니다.
    return Object.values(out).some((v) => v !== undefined) ? out : null;
}

export async function POST(request: Request): Promise<NextResponse> {
    const declared = Number(request.headers.get('content-length') ?? '0');
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
        return new NextResponse(null, { status: 413 });
    }

    let text: string;
    try {
        text = await request.text();
    } catch {
        return new NextResponse(null, { status: 204 });
    }
    if (text.length === 0 || text.length > MAX_BODY_BYTES) {
        return new NextResponse(null, { status: 204 });
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        return new NextResponse(null, { status: 204 });
    }

    const reports: ViolationLog[] = [];
    if (Array.isArray(parsed)) {
        // Reporting API 형식
        for (const entry of parsed.slice(0, 20)) {
            if (typeof entry === 'object' && entry !== null) {
                const e = entry as Record<string, unknown>;
                const hit = pick(e.body ?? e);
                if (hit) reports.push(hit);
            }
        }
    } else if (typeof parsed === 'object' && parsed !== null) {
        const p = parsed as Record<string, unknown>;
        const hit = pick(p['csp-report'] ?? p);
        if (hit) reports.push(hit);
    }

    for (const r of reports) {
        // 배포 플랫폼 로그에서 "[csp]" 로 검색해 모은다.
        console.warn('[csp]', JSON.stringify(r));
    }

    // 브라우저는 응답 본문을 쓰지 않는다. 204로 가볍게 끝낸다.
    return new NextResponse(null, { status: 204 });
}

/** 그 밖의 메서드는 받지 않는다. */
export async function GET(): Promise<NextResponse> {
    return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
