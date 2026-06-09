import { TrendingUp, ShoppingBag, Users, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { StatNumber } from '@/components/ui/stat-number'

const monthlyEvolution = [
  { month: 'Janeiro',   sales: 98,  gross: 6240, fees: 180, net: 6060, newCustomers: 8  },
  { month: 'Fevereiro', sales: 87,  gross: 5810, fees: 162, net: 5648, newCustomers: 5  },
  { month: 'Março',     sales: 112, gross: 7320, fees: 201, net: 7119, newCustomers: 12 },
  { month: 'Abril',     sales: 103, gross: 6950, fees: 198, net: 6752, newCustomers: 9  },
  { month: 'Maio',      sales: 47,  gross: 3180, fees: 89,  net: 3091, newCustomers: 4  },
]

const paymentBreakdown = [
  { method: 'PIX',      amount: 1840, pct: 58, color: '#5C8A6E' },
  { method: 'Crédito',  amount: 820,  pct: 26, color: '#D87560' },
  { method: 'Débito',   amount: 340,  pct: 11, color: '#4B3A9B' },
  { method: 'Dinheiro', amount: 180,  pct: 5,  color: '#E89E5C' },
]

const topCustomers = [
  { name: 'Beyoncé Santos',  amount: 485, purchases: 8 },
  { name: 'Maira Fernandes', amount: 410, purchases: 7 },
  { name: 'Alberta Costa',   amount: 340, purchases: 5 },
  { name: 'Shakira Oliveira',amount: 280, purchases: 6 },
]

export default function RelatoriosPage() {
  return (
    <div className="px-4 py-6 md:px-14 md:py-10 max-w-[1200px]">
      <header className="mb-9">
        <div className="text-xs text-muted font-body tracking-[2px] uppercase mb-2">
          Relatórios · 2026
        </div>
        <h1 className="font-display text-[28px] md:text-[40px] text-ink font-semibold tracking-[-1px] m-0">
          Visão consolidada
        </h1>
        <p className="font-body text-muted text-sm mt-2 max-w-[480px]">
          Acompanhe o impacto do Instituto Camaleão por área e período.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Instituto · resumo anual
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <div className="text-accent mb-3"><ShoppingBag size={20} /></div>
            <StatNumber value="R$ 48.200" label="Receita brechó · 2026" accentClass="text-accent" />
          </Card>
          <Card>
            <div className="text-purple mb-3"><Users size={20} /></div>
            <StatNumber value="142" label="Compradoras ativas" />
          </Card>
          <Card>
            <div className="text-coral mb-3"><TrendingUp size={20} /></div>
            <StatNumber value="634" label="Vendas realizadas" />
          </Card>
          <Card>
            <div className="text-emerald mb-3"><Calendar size={20} /></div>
            <StatNumber value="R$ 4.017" label="Média mensal" accentClass="text-emerald" />
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Brechó · evolução mensal
        </h2>
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-body">
              <thead>
                <tr className="bg-bg">
                  {['Mês', 'Vendas', 'Receita bruta', 'Taxas', 'Receita líquida', 'Novas compradoras'].map((h) => (
                    <th key={h} className="text-left px-6 py-3.5 text-[11px] text-muted tracking-[1.5px] uppercase font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyEvolution.map((r, i) => (
                  <tr key={r.month} className={i < monthlyEvolution.length - 1 ? 'border-b border-rule' : ''}>
                    <td className="px-6 py-4 font-body text-sm text-ink font-medium">{r.month}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink">{r.sales}</td>
                    <td className="px-6 py-4 font-display text-sm text-ink">R$ {r.gross.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 font-display text-sm text-coral">R$ {r.fees}</td>
                    <td className="px-6 py-4 font-display text-sm text-emerald font-medium">R$ {r.net.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 font-body text-sm text-ink">+{r.newCustomers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-body text-[11px] text-muted tracking-[2px] uppercase mb-4">
          Formas de pagamento · maio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h4 className="font-body text-[11px] text-muted tracking-[1.5px] uppercase mb-5 m-0">
              Distribuição por canal
            </h4>
            <div className="flex flex-col gap-4">
              {paymentBreakdown.map((f) => (
                <div key={f.method}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-body text-sm text-ink">{f.method}</span>
                    <span className="font-display text-sm text-ink">R$ {f.amount.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-1.5 bg-rule rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
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
              {topCustomers.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="font-display text-[13px] text-muted w-5 shrink-0 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <span className="font-body text-sm text-ink">{c.name}</span>
                    <span className="font-body text-xs text-muted ml-2">{c.purchases} compras</span>
                  </div>
                  <span className="font-display text-sm text-ink">R$ {c.amount}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
