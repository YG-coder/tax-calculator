'use client'

// src/components/SiteNav.tsx
// 헤더 네비. 데스크톱 링크는 기존과 동일, 모바일은 햄버거 토글 메뉴 추가.
// (기존 layout.tsx에는 모바일 메뉴가 없어 md 미만에서 네비가 사라지는 버그가 있었음)

import { useState } from 'react'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/vat-calculator', label: '부가세' },
  { href: '/income-tax-calculator', label: '종합소득세' },
  { href: '/freelancer-tax-calculator', label: '프리랜서 3.3%' },
  { href: '/withholding-calculator', label: '원천징수' },
  { href: '/guide', label: '가이드' },
]

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

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <HeaderLogo />

        {/* 데스크톱 링크 (기존과 동일) */}
        <div className="hidden md:flex gap-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm px-2 py-1">
              {item.label}
            </Link>
          ))}
        </div>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-700 hover:bg-slate-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-4xl mx-auto px-4 py-1 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-slate-700 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
