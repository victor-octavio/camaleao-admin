'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, TrendingUp, LogOut } from 'lucide-react'

const topNav = [
  { href: '/brecho', label: 'Brechó', icon: ShoppingBag },
  { href: '/relatorios', label: 'Relatórios', icon: TrendingUp },
]

const brechoSub = [
  { href: '/brecho', label: 'Visão geral' },
  { href: '/brecho/nova-venda', label: 'Nova venda' },
  { href: '/brecho/compradoras', label: 'Compradoras' },
  { href: '/brecho/financeiro', label: 'Financeiro' },
]

export function Sidebar() {
  const pathname = usePathname()
  const inBrecho = pathname.startsWith('/brecho')

  return (
    <aside className="w-[240px] bg-paper border-r border-rule px-5 py-8 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="mb-12 flex justify-center">
        <Image
          src="/logo-camaleao.png"
          alt="Instituto Camaleão"
          width={120}
          height={45}
          className="object-contain"
          priority
        />
      </div>

      {/* Seção Instituto */}
      <nav className="flex-1">
        <div className="text-[10px] font-body text-muted tracking-[2px] uppercase mb-2 px-3">
          Instituto
        </div>
        <div className="flex flex-col gap-0.5">
          {topNav.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/brecho'
                ? pathname.startsWith('/brecho')
                : pathname.startsWith(href)
            return (
              <div key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] font-body text-sm no-underline transition-colors ${
                    active
                      ? 'bg-bg text-ink font-medium'
                      : 'text-muted hover:text-ink hover:bg-bg/60'
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2 : 1.5} />
                  {label}
                </Link>

                {/* Sub-nav do Brechó */}
                {href === '/brecho' && inBrecho && (
                  <div className="ml-8 mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-rule pl-3">
                    {brechoSub.map(({ href: subHref, label: subLabel }) => {
                      const subActive =
                        subHref === '/brecho'
                          ? pathname === '/brecho'
                          : pathname === subHref
                      return (
                        <Link
                          key={subHref}
                          href={subHref}
                          className={`text-[13px] font-body py-1.5 px-2 rounded-[6px] no-underline transition-colors ${
                            subActive
                              ? 'text-ink font-medium bg-bg'
                              : 'text-muted hover:text-ink'
                          }`}
                        >
                          {subLabel}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Usuário */}
      <div className="border-t border-rule pt-4 flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-full bg-accent-soft text-accent-deep flex items-center justify-center font-display text-sm font-semibold shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-body text-ink font-medium">Ana</div>
          <div className="text-[11px] font-body text-muted">voluntária · caixa</div>
        </div>
        <LogOut
          size={14}
          className="text-muted cursor-pointer hover:text-ink transition-colors"
        />
      </div>
    </aside>
  )
}
