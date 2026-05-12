'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg">
      {open && (
        <div
          className="fixed inset-0 bg-ink/20 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center h-14 px-4 bg-paper border-b border-rule shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 text-muted hover:text-ink transition-colors"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
