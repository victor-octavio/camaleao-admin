'use client'

import { useTransition } from 'react'
import { Check, Filter } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { conferirVenda } from '@/actions/vendas'
import type { Venda } from '@/types'

interface FinanceiroTableProps {
  vendas: Venda[]
}

export function FinanceiroTable({ vendas }: FinanceiroTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleConferir(id: string) {
    startTransition(() => conferirVenda(id))
  }

  const totalBruto = vendas.reduce((s, v) => s + v.valor, 0)
  const totalLiquido = vendas.reduce((s, v) => s + (v.liquido ?? v.valor), 0)
  const taxas = totalBruto - totalLiquido

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-paper border border-rule rounded-[16px] p-6">
          <div className="text-[13px] text-muted font-body mb-2 tracking-wide">
            Valor bruto · mês
          </div>
          <div className="font-display text-[38px] font-bold tracking-[-1.2px] leading-none text-ink">
            R$ {totalBruto.toFixed(2)}
          </div>
        </div>
        <div className="rounded-[16px] p-6" style={{ backgroundColor: '#DCEBE0' }}>
          <div className="text-[13px] text-muted font-body mb-2 tracking-wide">
            Valor líquido recebido
          </div>
          <div className="font-display text-[38px] font-bold tracking-[-1.2px] leading-none text-emerald">
            R$ {totalLiquido.toFixed(2)}
          </div>
        </div>
        <div className="bg-paper border border-rule rounded-[16px] p-6">
          <div className="text-[13px] text-muted font-body mb-2 tracking-wide">
            Taxas / descontos
          </div>
          <div className="font-display text-[38px] font-bold tracking-[-1.2px] leading-none text-coral">
            R$ {taxas.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-paper border border-rule rounded-[16px] overflow-hidden">
        <div className="px-6 py-5 border-b border-rule flex justify-between items-center">
          <h3 className="font-display text-xl text-ink font-medium m-0">
            Vendas para conciliar
          </h3>
          <div className="flex gap-2">
            <button className="chip bg-bg">
              <Filter size={11} /> Filtros
            </button>
            <button className="chip bg-bg">Exportar</button>
          </div>
        </div>
        <table className="w-full border-collapse font-body">
          <thead>
            <tr className="bg-bg">
              {['Data', 'Compradora', 'Bruto', 'Líquido', 'Banco', 'Status'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3.5 text-[11px] text-muted tracking-[1.5px] uppercase font-medium"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {vendas.map((v, i) => (
              <tr
                key={v.id}
                className={i < vendas.length - 1 ? 'border-b border-rule' : ''}
              >
                <td className="px-6 py-4 font-mono text-xs text-muted">
                  {new Date(v.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-ink">
                  {v.compradora_nome}
                </td>
                <td className="px-6 py-4 text-sm text-ink font-display">
                  R$ {v.valor.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm font-display font-medium text-emerald">
                  R$ {(v.liquido ?? v.valor).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Tag>{v.banco ?? v.pagamento}</Tag>
                </td>
                <td className="px-6 py-4">
                  {v.conferido ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald font-medium">
                      <Check size={13} /> Conferido
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConferir(v.id)}
                      disabled={isPending}
                      className="chip bg-accent-soft text-accent-deep border-accent-soft font-medium disabled:opacity-50"
                    >
                      Conferir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
