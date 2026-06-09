'use client'

import { useState, useTransition } from 'react'
import { Plus, X, Check, Search, Smartphone, Banknote, CreditCard } from 'lucide-react'
import { Tag } from '@/components/ui/tag'
import { NewCustomerModal } from '@/components/shop/new-customer-modal'
import { registerSale } from '@/actions/sales'
import type { Customer } from '@/types'

interface NewSaleFormProps {
  customers: Customer[]
}

const paymentMethods = [
  { id: 'pix',      label: 'PIX',      icon: Smartphone, color: '#5C8A6E' },
  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote,   color: '#E89E5C' },
  { id: 'debito',   label: 'Débito',   icon: CreditCard, color: '#4B3A9B' },
  { id: 'credito',  label: 'Crédito',  icon: CreditCard, color: '#D87560' },
]

export function NewSaleForm({ customers: initial }: NewSaleFormProps) {
  const [customerList, setCustomerList] = useState<Customer[]>(initial)
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [items, setItems] = useState([{ category: '', amount: '' }])
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0])
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  const total = items.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0)

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  function selectCustomer(c: Customer) {
    setSelectedCustomer(c)
    setSearch('')
    setShowDropdown(false)
  }

  function clearCustomer() {
    setSelectedCustomer(null)
    setSearch('')
    setShowDropdown(false)
  }

  function handleCustomerCreated(customer: Customer) {
    setCustomerList((prev) => [...prev, customer].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
    selectCustomer(customer)
    setShowModal(false)
  }

  function handleSubmit() {
    const fd = new FormData()
    if (selectedCustomer) {
      fd.set('customer_id', selectedCustomer.id)
      fd.set('customer_name', selectedCustomer.name)
    } else {
      fd.set('customer_name', 'Cliente avulso')
    }
    fd.set('items', JSON.stringify(items.map((p) => ({ ...p, amount: parseFloat(p.amount) || 0 }))))
    fd.set('payment_method', paymentMethod)
    fd.set('sold_at', saleDate)
    startTransition(async () => { await registerSale(fd) })
  }

  return (
    <>
      {showModal && (
        <NewCustomerModal
          onClose={() => setShowModal(false)}
          onCreated={handleCustomerCreated}
        />
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-5">

          {/* Compradora */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-3">
              Compradora <span className="text-accent">*</span>
            </label>

            {selectedCustomer ? (
              <div className="flex items-center gap-3 bg-accent-soft/30 rounded-[10px] px-4 py-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display text-sm font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E89E5C, #D87560)' }}
                >
                  {selectedCustomer.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body text-sm font-medium text-ink truncate">{selectedCustomer.name}</div>
                  <div className="font-body text-xs text-muted">{selectedCustomer.phone}</div>
                </div>
                <button onClick={clearCustomer} className="text-muted hover:text-ink transition-colors shrink-0">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3.5 top-3.5 text-muted pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  placeholder="Buscar por nome ou telefone..."
                  className="input-base pl-10"
                />
                {showDropdown && search && (
                  <div className="absolute z-10 w-full mt-1 bg-paper border border-rule rounded-[10px] overflow-hidden shadow-sm">
                    {filteredCustomers.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        onMouseDown={() => selectCustomer(c)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-accent-soft/30 transition-colors border-b border-rule last:border-0"
                      >
                        <span className="font-body text-sm text-ink font-medium">{c.name}</span>
                        <div className="flex gap-1">
                          {c.tags.slice(0, 2).map((t) => <Tag key={t}>{t}</Tag>)}
                        </div>
                      </button>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted font-body italic">
                        Nenhuma compradora encontrada
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button type="button" onClick={() => setShowModal(true)} className="chip bg-accent-soft text-accent-deep border-accent-soft">
                <Plus size={11} /> Cadastrar nova
              </button>
              <button type="button" onClick={() => { clearCustomer(); setSearch('') }} className="chip">
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
              value={saleDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSaleDate(e.target.value)}
              className="input-base"
            />
            {saleDate !== new Date().toISOString().split('T')[0] && (
              <p className="text-[12px] text-muted font-body mt-2">Registrando com data retroativa</p>
            )}
          </div>

          {/* Peças */}
          <div className="bg-paper border border-rule rounded-[16px] p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[11px] font-body text-muted tracking-[1px] uppercase">
                Peças <span className="text-accent">*</span>
              </label>
              <button type="button" onClick={() => setItems([...items, { category: '', amount: '' }])} className="chip bg-bg text-ink border-rule">
                <Plus size={11} /> Adicionar peça
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {items.map((p, i) => (
                <div key={i} className="grid gap-2.5" style={{ gridTemplateColumns: '1fr 130px 32px' }}>
                  <input
                    placeholder="Categoria (saia, blusa, vestido...)"
                    value={p.category}
                    onChange={(e) => { const nv = [...items]; nv[i].category = e.target.value; setItems(nv) }}
                    className="input-base"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted text-[13px] font-body pointer-events-none">R$</span>
                    <input
                      placeholder="0,00"
                      value={p.amount}
                      onChange={(e) => { const nv = [...items]; nv[i].amount = e.target.value; setItems(nv) }}
                      className="input-base pl-8"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, idx) => idx !== i))}
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
              {paymentMethods.map(({ id, label, icon: Icon, color }) => {
                const active = paymentMethod === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className="p-4 rounded-[12px] flex flex-col items-center gap-2 cursor-pointer transition-all font-body"
                    style={active ? { border: `2px solid ${color}`, backgroundColor: `${color}15` } : { border: '1px solid #EEE4D5', backgroundColor: '#FFFFFF' }}
                  >
                    <Icon size={20} color={active ? color : '#7A6E8A'} strokeWidth={1.5} />
                    <span className={`text-[13px] ${active ? 'text-ink font-medium' : 'text-muted'}`}>{label}</span>
                  </button>
                )
              })}
            </div>

            {paymentMethod === 'credito' && (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">Banco / maquininha</label>
                  <select name="bank" className="input-base">
                    <option>SICREDI</option>
                    <option>PagSeguro</option>
                    <option>Stone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">Parcelas</label>
                  <select name="installments" className="input-base">
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}x</option>)}
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'pix' && (
              <div className="mt-4">
                <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">Banco</label>
                <select name="bank" className="input-base">
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
            <div className="text-[11px] text-muted tracking-[2px] uppercase font-body mb-4">Resumo</div>
            <div className="flex flex-col gap-2.5 mb-5">
              {items.filter((p) => p.amount).map((p, i) => (
                <div key={i} className="flex justify-between text-[13px] font-body text-ink">
                  <span className="text-muted">{p.category || 'Peça'}</span>
                  <span>R$ {parseFloat(p.amount || '0').toFixed(2)}</span>
                </div>
              ))}
              {items.filter((p) => p.amount).length === 0 && (
                <div className="text-[13px] font-body text-muted italic">Nenhuma peça adicionada</div>
              )}
            </div>
            <div className="border-t border-rule pt-4 mb-6">
              <div className="text-[11px] text-muted tracking-[1.5px] uppercase font-body mb-1.5">Total</div>
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
