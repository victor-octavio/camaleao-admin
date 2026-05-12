import { FinanceiroTable } from '@/components/brecho/financeiro-table'
import { getAllVendas } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default function FinanceiroPage() {
  const vendas = getAllVendas()

  return (
    <div className="px-4 py-6 md:px-14 md:py-10 max-w-[1300px]">
      <header className="mb-9">
        <div className="text-xs text-muted font-body tracking-[2px] uppercase mb-2">
          Financeiro · maio de 2026
        </div>
        <h1 className="font-display text-[28px] md:text-[40px] text-ink font-semibold tracking-[-1px] m-0 leading-[1.1]">
          Conferência de{' '}
          <span className="text-emerald">valores recebidos</span>
        </h1>
      </header>
      <FinanceiroTable vendas={vendas} />
    </div>
  )
}
