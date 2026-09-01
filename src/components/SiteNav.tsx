'use client'

// src/components/SiteNav.tsx
//
// 상단 내비게이션. 구역 세 개(계산기 · 세금 일정 · 가이드)만 둔다.
//
// 계산기를 몇 개 골라 내비에 박아 두면 계산기가 늘 때마다 목록이 어긋나고
// 특정 세목만 우대하는 것처럼 보인다. 그래서 "계산기"는 홈의 전체 목록 구역으로 보내고,
// 데스크톱에서는 상황별 분류를 드롭다운으로 펼쳐 한 번에 갈 수 있게 한다.
// 분류와 계산기 목록은 모두 계산기 레지스트리에서 파생한다.

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AUDIENCE_GROUPS, calculatorHref, calculatorsFor } from '@/lib/calculators'
import { NAV_ITEMS, ariaCurrent, navState, type NavItem } from '@/lib/navigation'

function HeaderLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white"
      >
        税
      </span>
      <span className="text-sm font-black text-slate-900">
        세금<span className="text-blue-600">계산기</span>
      </span>
    </Link>
  )
}

/** 현재 메뉴 강조 색. page/section 모두 같은 강조를 쓴다. */
function linkClass(state: 'page' | 'section' | null, extra = ''): string {
  const base =
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
  const tone = state
    ? 'bg-blue-50 text-blue-700 font-semibold'
    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-700'
  return `${base} ${tone} ${extra}`.trim()
}

export default function SiteNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuWrapRef = useRef<HTMLDivElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)

  const closeAll = () => {
    setMobileOpen(false)
    setMenuOpen(false)
  }

  // 다른 경로로 이동하면 열려 있던 메뉴를 닫는다.
  // 효과가 아니라 렌더 중에 상태를 맞춘다. 메뉴가 열린 채로 한 번 그려졌다가 닫히는 깜빡임이 없다.
  // (해시만 바뀌는 이동은 pathname 이 그대로라 각 링크의 onClick 이 닫는다)
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMobileOpen(false)
    setMenuOpen(false)
  }

  // Esc 로 닫기. 드롭다운을 닫을 때는 열었던 버튼으로 초점을 되돌린다.
  useEffect(() => {
    if (!mobileOpen && !menuOpen) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (menuOpen) menuButtonRef.current?.focus()
      closeAll()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, menuOpen])

  // 드롭다운 바깥을 누르거나 초점이 빠져나가면 닫는다.
  useEffect(() => {
    if (!menuOpen) return
    function onOutside(event: Event) {
      const target = event.target as Node | null
      if (target && menuWrapRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [menuOpen])

  const stateOf = (item: NavItem) => navState(item, pathname)

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <HeaderLogo onNavigate={closeAll} />

        {/* 데스크톱 */}
        <div className="hidden items-center gap-1 md:flex">
          <div ref={menuWrapRef} className="relative flex items-center">
            <Link
              href={NAV_ITEMS[0].href}
              onClick={closeAll}
              aria-current={ariaCurrent(stateOf(NAV_ITEMS[0]))}
              className={linkClass(stateOf(NAV_ITEMS[0]), 'pr-1.5')}
            >
              {NAV_ITEMS[0].label}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="calculator-menu"
              aria-label={menuOpen ? '상황별 계산기 닫기' : '상황별 계산기 열기'}
              className="flex h-9 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={menuOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              id="calculator-menu"
              hidden={!menuOpen}
              className="absolute right-0 top-full z-50 mt-1 max-h-[calc(100vh-4.5rem)] w-[28rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
            >
              <p className="mb-3 text-xs font-semibold text-slate-500">상황별로 찾기</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {AUDIENCE_GROUPS.map((group) => (
                  <div key={group.key}>
                    <p className="mb-1 text-xs font-bold text-slate-800">{group.label}</p>
                    <ul className="space-y-0.5">
                      {calculatorsFor(group.key).map((calc) => (
                        <li key={calc.slug}>
                          <Link
                            href={calculatorHref(calc.slug)}
                            onClick={closeAll}
                            aria-current={pathname === calculatorHref(calc.slug) ? 'page' : undefined}
                            className={`block rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                              pathname === calculatorHref(calc.slug)
                                ? 'bg-blue-50 font-semibold text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-700'
                            }`}
                          >
                            {calc.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link
                href={NAV_ITEMS[0].href}
                onClick={closeAll}
                className="mt-3 block border-t border-slate-100 pt-3 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                모든 계산기 보기 →
              </Link>
            </div>
          </div>

          {NAV_ITEMS.slice(1).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeAll}
              aria-current={ariaCurrent(stateOf(item))}
              className={linkClass(stateOf(item))}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
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

      {/* 모바일 드롭다운 — 계산기를 나열하지 않고 "계산기 찾기" 하나로 보낸다 */}
      <div id="mobile-menu" hidden={!mobileOpen} className="border-t bg-white md:hidden">
        <div className="mx-auto flex max-w-4xl flex-col px-4 py-2">
          {NAV_ITEMS.map((item) => {
            const state = stateOf(item)
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeAll}
                aria-current={ariaCurrent(state)}
                className={`flex min-h-[44px] items-center rounded-lg px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  state ? 'font-semibold text-blue-700' : 'text-slate-700 hover:text-blue-700'
                }`}
              >
                {item.key === 'calculators' ? '계산기 찾기' : item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
