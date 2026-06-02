'use client'

import { useState, useTransition } from 'react'
import { Plus, X, Check, Search, Smartphone, Banknote, CreditCard } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { NovaCompradoraModal } from '@/components/brecho/nova-compradora-modal'
import { registrarVenda } from '@/actions/vendas'
import type { Compradora } from '@/types'

interface NovaVendaFormProps {
  compradoras: Compradora[]
}

const formasPagamento = [
  { id: 'pix',      label: 'PIX',      icon: Smartphone, color: '#5C8A6E' },
  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote,   color: '#E89E5C' },
  { id: 'debito',   label: 'Débito',   icon: CreditCard, color: '#4B3A9B' },
  { id: 'credito',  label: 'Crédito',  icon: CreditCard, color: '#D87560' },
]

export function NovaVendaForm({ compradoras: inicial }: NovaVendaFormProps) {
  const [listaCompradoras, setListaCompradoras] = useState<Compradora[]>(inicial)
  const [pagamento, setPagamento] = useState('pix')
  const [pecas, setPecas] = useState([{ categoria: '', valor: '' }])
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().split('T')[0])
  const [busca, setBusca] = useState('')
  const [compradoraSelecionada, setCompradoraSelecionada] = useState<Compradora | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const total = pecas.reduce((s, p) => s + (parseFloat(p.valor) || 0), 0)

  const compFiltered = listaCompradoras.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.tel.includes(busca)
  )

  function selecionarCompradora(c: Compradora) {
    setCompradoraSelecionada(c)
    setBusca('')
    setShowDropdown(false)
  }

  function limparCompradora() {
    setCompradoraSelecionada(null)
    setBusca('')
    setShowDropdown(false)
  }

  function handleNovaCompradoraCriada(nova: Compradora) {
    setListaCompradoras((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    selecionarCompradora(nova)
    setShowModal(false)
  }

  function handleSubmit() {
    const fd = new FormData()
    if (compradoraSelecionada) {
      fd.set('compradora_id', compradoraSelecionada.id)
      fd.set('compradora_nome', compradoraSelecionada.nome)
    } else {
      fd.set('compradora_nome', 'Cliente avulso')
    }
    fd.set('pecas', JSON.stringify(pecas.map((p) => ({ ...p, valor: parseFloat(p.valor) || 0 }))))
    fd.set('pagamento', pagamento)
    fd.set('data_venda', dataVenda)

    startTransition(async () => {
      await registrarVenda(fd)
    })
  }

  return (
    <>
      {showModal && (
        <NovaCompradoraModal
          onClose={() => setShowModal(false)}
          onCreated={handleNovaCompradoraCriada}
        />
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        {/* Formulário */}
        <div className="flex flex-col gap-5">

          {/* Compradora */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-3">
              Compradora <span className="text-accent">*</span>
            </label>

            {compradoraSelecionada ? (
              <div className="flex items-center gap-3 bg-accent-soft/30 rounded-[10px] px-4 py-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E89E5C, #D87560)' }}
                >
                  {compradoraSelecionada.nome[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body text-sm font-medium text-ink truncate">
                    {compradoraSelecionada.nome}
                  </div>
                  <div className="font-body text-xs text-muted">{compradoraSelecionada.tel}</div>
                </div>
                <button onClick={limparCompradora} className="text-muted hover:text-ink transition-colors shrink-0">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3.5 top-3.5 text-muted pointer-events-none" />
                <input
                  value={busca}
                  onChange={(e) => { setBusca(e.target.value); setShowDropdown(true) }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Buscar por nome ou telefone..."
                  className="input-base pl-10"
                />
                {showDropdown && busca && (
                  <div className="absolute z-10 w-full mt-1 bg-paper border border-rule rounded-[10px] overflow-hidden shadow-sm">
                    {compFiltered.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        onMouseDown={() => selecionarCompradora(c)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-accent-soft/30 transition-colors border-b border-rule last:border-0"
                      >
                        <span className="font-body text-sm text-ink font-medium">{c.nome}</span>
                        <div className="flex gap-1">
                          {c.etiquetas.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
                        </div>
                      </button>
                    ))}
                    {compFiltered.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted font-body italic">
                        Nenhuma compradora encontrada
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="chip bg-accent-soft text-accent-deep border-accent-soft"
              >
                <Plus size={11} /> Cadastrar nova
              </button>
              <button
                type="button"
                onClick={() => { limparCompradora(); setBusca('') }}
                className="chip"
              >
                Cliente avulso
              </button>
            </div>
          </div>

          {/* Data */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-3">
              Data da venda
            </label>
            <input
              type="date"
              value={dataVenda}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDataVenda(e.target.value)}
              className="input-base"
            />
            {dataVenda !== new Date().toISOString().split('T')[0] && (
              <p className="text-[12px] text-muted font-body mt-2">
                Registrando com data retroativa
              </p>
            )}
          </div>

          {/* Peças */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[11px] font-body text-muted tracking-[1px] uppercase">
                Peças <span className="text-accent">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPecas([...pecas, { categoria: '', valor: '' }])}
                className="chip bg-bg text-ink border-rule"
              >
                <Plus size={11} /> Adicionar peça
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {pecas.map((p, i) => (
                <div key={i} className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 130px 32px' }}>
                  <input
                    placeholder="Categoria (saia, blusa, vestido...)"
                    value={p.categoria}
                    onChange={(e) => {
                      const nv = [...pecas]; nv[i].categoria = e.target.value; setPecas(nv)
                    }}
                    className="input-base"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted text-[13px] font-body pointer-events-none">
                      R$
                    </span>
                    <input
                      placeholder="0,00"
                      value={p.valor}
                      onChange={(e) => {
                        const nv = [...pecas]; nv[i].valor = e.target.value; setPecas(nv)
                      }}
                      className="input-base pl-8"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPecas(pecas.filter((_, idx) => idx !== i))}
                    className="border border-rule rounded-[8px] bg-paper flex items-center justify-center cursor-pointer hover:bg-bg transition-colors"
                  >
                    <X size={14} className="text-muted" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-3">
              Forma de pagamento <span className="text-accent">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {formasPagamento.map(({ id, label, icon: Icon, color }) => {
                const active = pagamento === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPagamento(id)}
                    className="p-4 rounded-[12px] flex flex-col items-center gap-2 cursor-pointer transition-all font-body"
                    style={
                      active
                        ? { border: `2px solid ${color}`, backgroundColor: `${color}15` }
                        : { border: '1px solid #EEE4D5', backgroundColor: '#FFFFFF' }
                    }
                  >
                    <Icon size={20} color={active ? color : '#7A6E8A'} strokeWidth={1.5} />
                    <span className={`text-[13px] ${active ? 'text-ink font-medium' : 'text-muted'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>

            {pagamento === 'credito' && (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
                    Banco / maquininha
                  </label>
                  <select name="banco" className="input-base">
                    <option>SICREDI</option>
                    <option>PagSeguro</option>
                    <option>Stone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
                    Parcelas
                  </label>
                  <select name="parcelas" className="input-base">
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}x</option>)}
                  </select>
                </div>
              </div>
            )}

            {pagamento === 'pix' && (
              <div className="mt-4">
                <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
                  Banco
                </label>
                <select name="banco" className="input-base">
                  <option>PIX TON</option>
                  <option>PIX SICREDI</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Resumo sticky */}
        <div className="md:sticky md:top-6 md:self-start">
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <div className="text-[11px] text-muted tracking-[2px] uppercase font-body mb-4">
              Resumo
            </div>
            <div className="flex flex-col gap-2.5 mb-5">
              {pecas.filter((p) => p.valor).map((p, i) => (
                <div key={i} className="flex justify-between text-[13px] font-body text-ink">
                  <span className="text-muted">{p.categoria || 'Peça'}</span>
                  <span>R$ {parseFloat(p.valor || '0').toFixed(2)}</span>
                </div>
              ))}
              {pecas.filter((p) => p.valor).length === 0 && (
                <div className="text-[13px] font-body text-muted italic">
                  Nenhuma peça adicionada
                </div>
              )}
            </div>
            <div className="border-t border-rule pt-4 mb-6">
              <div className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-1.5">
                Total
              </div>
              <div className="font-display text-[44px] font-bold tracking-[-1.8px] leading-none text-accent-deep">
                R$ {total.toFixed(2)}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || total === 0}
              className="w-full bg-accent text-white border-none py-3.5 rounded-[10px] cursor-pointer font-body text-sm font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 4px 14px rgba(232,158,92,0.35)' }}
            >
              <Check size={16} />
              {isPending ? 'Registrando...' : 'Registrar venda'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
