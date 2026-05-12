import { TrendingUp, ShoppingBag, Users, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatNumber } from '@/components/ui/stat-number'

const evolucaoMensal = [
  { mes: 'Janeiro', vendas: 98, bruto: 6240, taxas: 180, liquido: 6060, novas: 8 },
  { mes: 'Fevereiro', vendas: 87, bruto: 5810, taxas: 162, liquido: 5648, novas: 5 },
  { mes: 'Março', vendas: 112, bruto: 7320, taxas: 201, liquido: 7119, novas: 12 },
  { mes: 'Abril', vendas: 103, bruto: 6950, taxas: 198, liquido: 6752, novas: 9 },
  { mes: 'Maio', vendas: 47, bruto: 3180, taxas: 89, liquido: 3091, novas: 4 },
]

const pagamentos = [
  { forma: 'PIX', valor: 1840, pct: 58, color: '#5C8A6E' },
  { forma: 'Crédito', valor: 820, pct: 26, color: '#D87560' },
  { forma: 'Débito', valor: 340, pct: 11, color: '#4B3A9B' },
  { forma: 'Dinheiro', valor: 180, pct: 5, color: '#E89E5C' },
]

const topCompradoras = [
  { nome: 'Beyoncé Santos', valor: 485, compras: 8 },
  { nome: 'Maira Fernandes', valor: 410, compras: 7 },
  { nome: 'Alberta Costa', valor: 340, compras: 5 },
  { nome: 'Shakira Oliveira', valor: 280, compras: 6 },
]

export default function RelatoriosPage() {
  return (
    <div className="px-14 py-10 max-w-[1200px]">
      <header className="mb-9">
        <div className="text-xs text-muted font-body tracking-[2px] uppercase mb-2">
          Relatórios · 2026
        </div>
        <h1 className="font-display text-[40px] text-ink font-semibold tracking-[-1px] m-0">
          Visão consolidada
        </h1>
        <p className="font-body text-muted text-sm mt-2 max-w-[480px]">
          Acompanhe o impacto do Instituto Camaleão por área e período.
        </p>
      </header>

      {/* KPIs do Instituto */}
      <section className="mb-10">
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Instituto · resumo anual
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="text-accent mb-3">
              <ShoppingBag size={20} />
            </div>
            <StatNumber
              value="R$ 48.200"
              label="Receita brechó · 2026"
              accentClass="text-accent"
            />
          </Card>
          <Card>
            <div className="text-purple mb-3">
              <Users size={20} />
            </div>
            <StatNumber value="142" label="Compradoras ativas" />
          </Card>
          <Card>
            <div className="text-coral mb-3">
              <TrendingUp size={20} />
            </div>
            <StatNumber value="634" label="Vendas realizadas" />
          </Card>
          <Card>
            <div className="text-emerald mb-3">
              <Calendar size={20} />
            </div>
            <StatNumber
              value="R$ 4.017"
              label="Média mensal"
              accentClass="text-emerald"
            />
          </Card>
        </div>
      </section>

      {/* Brechó por mês */}
      <section className="mb-8">
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Brechó · evolução mensal
        </h2>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-body">
              <thead>
                <tr className="bg-bg">
                  {[
                    'Mês',
                    'Vendas',
                    'Receita bruta',
                    'Taxas',
                    'Receita líquida',
                    'Novas compradoras',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3.5 text-[11px] text-muted tracking-[1.5px] uppercase font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {evolucaoMensal.map((r, i) => (
                  <tr
                    key={r.mes}
                    className={
                      i < evolucaoMensal.length - 1 ? 'border-b border-rule' : ''
                    }
                  >
                    <td className="px-6 py-4 font-body text-sm text-ink font-medium">
                      {r.mes}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-ink">
                      {r.vendas}
                    </td>
                    <td className="px-6 py-4 font-display text-sm text-ink">
                      R$ {r.bruto.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-display text-sm text-coral">
                      R$ {r.taxas}
                    </td>
                    <td className="px-6 py-4 font-display text-sm text-emerald font-medium">
                      R$ {r.liquido.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-ink">
                      +{r.novas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Breakdown */}
      <section>
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Formas de pagamento · maio
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <h4 className="font-body text-[11px] text-muted tracking-[1.5px] uppercase mb-5 m-0">
              Distribuição por canal
            </h4>
            <div className="flex flex-col gap-4">
              {pagamentos.map((f) => (
                <div key={f.forma}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-body text-sm text-ink">{f.forma}</span>
                    <span className="font-display text-sm text-ink">
                      R$ {f.valor.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="h-1.5 bg-rule rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="font-body text-[11px] text-muted tracking-[1.5px] uppercase mb-4 m-0">
              Top compradoras · maio
            </h4>
            <div className="flex flex-col gap-3">
              {topCompradoras.map((c, i) => (
                <div key={c.nome} className="flex items-center gap-3">
                  <span className="font-display text-[13px] text-muted w-5 shrink-0 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-body text-sm text-ink">{c.nome}</span>
                    <span className="font-body text-xs text-muted ml-2">
                      {c.compras} compras
                    </span>
                  </div>
                  <span className="font-display text-sm text-ink">
                    R$ {c.valor}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
