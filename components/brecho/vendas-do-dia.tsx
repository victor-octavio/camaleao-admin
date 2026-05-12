import { Tag } from '@/components/ui/tag'
import type { Venda } from '@/types'

interface VendasDoDiaProps {
  vendas: Venda[]
}

export function VendasDoDia({ vendas }: VendasDoDiaProps) {
  return (
    <div className="bg-paper border border-rule rounded-[16px] overflow-hidden">
      <div className="px-6 py-5 border-b border-rule flex justify-between items-center">
        <h3 className="font-display text-xl text-ink font-medium m-0">
          Vendas do dia
        </h3>
        <span className="text-xs text-muted font-body">
          {vendas.length} registros
        </span>
      </div>
      <div>
        {vendas.map((v, i) => (
          <div
            key={v.id}
            className={`grid items-center gap-4 px-6 py-4 ${
              i < vendas.length - 1 ? 'border-b border-rule' : ''
            }`}
            style={{ gridTemplateColumns: '60px 1fr auto auto' }}
          >
            <div className="font-mono text-xs text-muted">{v.hora}</div>
            <div>
              <div className="font-body text-sm text-ink font-medium">
                {v.compradora_nome}
              </div>
              <div className="font-body text-xs text-muted mt-0.5">
                {v.categoria}
              </div>
            </div>
            <Tag>{v.pagamento}</Tag>
            <div className="font-display text-[17px] text-ink font-medium">
              R$ {v.valor}
            </div>
          </div>
        ))}
        {vendas.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-muted font-body">
            Nenhuma venda registrada hoje.
          </div>
        )}
      </div>
    </div>
  )
}
