import { Phone, Cake, Heart, ChevronRight, Edit3, Plus } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import type { Compradora } from '@/types'

interface CompradoiraPerfilProps {
  compradora: Compradora
}

const historicoMock = [
  { data: '06/05/2026', cat: '3 peças (blusas)', val: 45 },
  { data: '22/04/2026', cat: '1 vestido', val: 60 },
  { data: '10/04/2026', cat: '2 calças', val: 35 },
]

export function CompradoraPerfil({ compradora }: CompradoiraPerfilProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-paper border border-rule rounded-[16px] overflow-hidden">
        {/* Header do perfil */}
        <div className="px-7 pt-7 pb-5 border-b border-rule">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4 items-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-display text-[22px] font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #E89E5C, #D87560)' }}
              >
                {compradora.nome[0]}
              </div>
              <div>
                <h2 className="font-display text-[26px] text-ink font-semibold tracking-[-0.5px] m-0 mb-1">
                  {compradora.nome}
                </h2>
                <div className="flex gap-3.5 text-xs text-muted font-body">
                  <span className="flex items-center gap-1">
                    <Phone size={11} /> {compradora.tel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cake size={11} /> {compradora.aniversario}
                  </span>
                </div>
              </div>
            </div>
            <button className="chip bg-bg">
              <Edit3 size={11} /> Editar
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {compradora.etiquetas.map((et) => (
              <Tag key={et}>{et}</Tag>
            ))}
            <button className="chip bg-transparent border-dashed text-muted">
              <Plus size={10} /> etiqueta
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-rule">
          <div className="px-6 py-5 border-r border-rule">
            <div className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-1">
              Apoiadora desde
            </div>
            <div className="font-display text-[22px] text-ink font-medium">
              {compradora.desde}
            </div>
          </div>
          <div className="px-6 py-5 border-r border-rule">
            <div className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-1">
              Compras
            </div>
            <div className="font-display text-[22px] text-ink font-medium">
              {compradora.totalCompras}
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-1">
              Total apoiado
            </div>
            <div className="font-display text-[22px] text-accent font-medium">
              R$ {compradora.valorTotal}
            </div>
          </div>
        </div>

        {/* Histórico */}
        <div className="p-6">
          <h4 className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-3.5">
            Histórico de compras
          </h4>
          {historicoMock.map((h, i) => (
            <div
              key={i}
              className={`flex justify-between items-center py-3 ${
                i < historicoMock.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <div>
                <div className="font-body text-[13px] text-ink">{h.cat}</div>
                <div className="font-mono text-[11px] text-muted mt-0.5">
                  {h.data}
                </div>
              </div>
              <div className="font-display text-[16px] text-ink">
                R$ {h.val}
              </div>
            </div>
          ))}
          <button className="mt-4 w-full py-2.5 rounded-[8px] border border-rule bg-transparent cursor-pointer font-body text-[13px] text-ink hover:bg-bg transition-colors">
            Ver histórico completo →
          </button>
        </div>
      </div>

      {/* CTA agradecimento */}
      <div
        className="rounded-[16px] p-5"
        style={{ backgroundColor: '#DCEBE0', border: '1px solid rgba(92,138,110,0.2)' }}
      >
        <div className="flex gap-3.5 items-start">
          <Heart size={20} className="text-emerald mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="font-body text-sm text-emerald font-medium mb-1">
              Enviar agradecimento personalizado
            </div>
            <div className="font-body text-[13px] text-ink/70 leading-relaxed">
              Gerar mensagem com o impacto das compras desta apoiadora.
            </div>
          </div>
          <ChevronRight size={18} className="text-emerald shrink-0" />
        </div>
      </div>
    </div>
  )
}
