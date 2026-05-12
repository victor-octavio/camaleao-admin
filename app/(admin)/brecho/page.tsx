import { Plus, Sparkles, Cake } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { StatNumber } from '@/components/ui/stat-number'
import { VendasDoDia } from '@/components/brecho/vendas-do-dia'
import { getVendasHoje } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default function BrechoDashboard() {
  const vendas = getVendasHoje()
  const totalDia = vendas.reduce((s, v) => s + v.valor, 0)

  const now = new Date()
  const hora = now.getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="px-14 py-10 max-w-[1200px]">
      {/* Header editorial */}
      <header className="mb-12 flex justify-between items-end">
        <div>
          <div className="text-xs text-muted font-body tracking-[2px] uppercase mb-2">
            {now.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
          <h1 className="font-display text-[48px] text-ink font-semibold tracking-[-1.5px] m-0 leading-[1.05]">
            {saudacao},{' '}
            <span className="text-accent-deep">Ana</span>.
          </h1>
          <p className="font-body text-muted text-[15px] mt-3 max-w-[480px]">
            Cada peça que sai daqui vira atendimento, escuta e cuidado. Obrigada
            por estar aqui hoje.
          </p>
        </div>
        <Link href="/brecho/nova-venda" className="btn-primary">
          <Plus size={16} /> Registrar venda
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <Card>
          <StatNumber
            value={`R$ ${totalDia.toFixed(2)}`}
            label="Vendas hoje"
            accentClass="text-accent"
            trend="+18% vs ontem"
          />
        </Card>
        <Card>
          <StatNumber value={String(vendas.length)} label="Atendimentos hoje" />
        </Card>
        <Card>
          <StatNumber value="R$ 1.842" label="Esta semana" />
        </Card>
        <Card>
          <StatNumber value="R$ 6.730" label="Mês de maio" accentClass="text-emerald" />
        </Card>
      </div>

      {/* Duas colunas */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <VendasDoDia vendas={vendas} />

        <div className="flex flex-col gap-4">
          {/* Card insight */}
          <div
            className="rounded-[16px] p-6"
            style={{
              background: 'linear-gradient(135deg, #E89E5C 0%, #D87560 100%)',
              color: '#FFFFFF',
            }}
          >
            <Sparkles size={20} className="mb-3" />
            <div className="font-display text-[22px] leading-tight font-semibold mb-2 tracking-[-0.3px]">
              Beyoncé voltou pela 8ª vez.
            </div>
            <div className="font-body text-[13px] opacity-95 leading-relaxed">
              Que tal mandar um agradecimento personalizado? Já são R$ 485 em
              apoio desde 2024.
            </div>
            <Link
              href="/brecho/compradoras"
              className="inline-block mt-4 px-3.5 py-2 rounded-[8px] text-xs font-body font-medium text-white no-underline"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              Ver compradora →
            </Link>
          </div>

          {/* Aniversariantes */}
          <Card>
            <div className="flex items-center gap-2 mb-3.5">
              <Cake size={16} className="text-coral" />
              <h4 className="m-0 font-body text-[11px] text-muted tracking-[1.5px] uppercase">
                Aniversariantes do mês
              </h4>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { nome: 'Beyoncé Santos', dia: '12/03' },
                { nome: 'Roberta Lima', dia: '18/05' },
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="font-body text-sm text-ink">{p.nome}</span>
                  <span className="font-mono text-xs text-muted">{p.dia}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
