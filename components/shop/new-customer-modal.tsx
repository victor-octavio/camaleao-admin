'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { X, Check } from 'lucide-react'
import { createCustomer } from '@/actions/customers'
import type { Customer } from '@/types'

const availableTags = ['paciente', 'familiar', 'voluntária', 'brechó', 'tampinha']

const tagStyles: Record<string, { bg: string; color: string; border: string }> = {
  paciente:   { bg: '#F8DCD2', color: '#D87560', border: '#D87560' },
  familiar:   { bg: '#E2DCF3', color: '#4B3A9B', border: '#4B3A9B' },
  voluntária: { bg: '#DCEBE0', color: '#5C8A6E', border: '#5C8A6E' },
  brechó:     { bg: '#FBE3CA', color: '#C97D3E', border: '#C97D3E' },
  tampinha:   { bg: '#FDE7E7', color: '#E25A8F', border: '#E25A8F' },
}

interface NewCustomerModalProps {
  onClose: () => void
  onCreated: (customer: Customer) => void
}

export function NewCustomerModal({ onClose, onCreated }: NewCustomerModalProps) {
  const [tags, setTags] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function toggleTag(tag: string) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('tags', JSON.stringify(tags))
    startTransition(async () => {
      const customer = await createCustomer(fd)
      onCreated(customer)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(31,22,56,0.4)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-paper rounded-[20px] w-full max-w-[440px] shadow-xl">
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-rule">
          <div>
            <h2 className="font-display text-[22px] text-ink font-semibold tracking-[-0.4px] m-0">
              Nova compradora
            </h2>
            <p className="font-body text-xs text-muted mt-1 m-0">
              Cadastre e já selecione para a venda atual.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:text-ink hover:bg-bg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
              Nome completo <span className="text-accent">*</span>
            </label>
            <input ref={nameRef} name="name" required placeholder="Ex.: Roberta Lima" className="input-base" />
          </div>
          <div>
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
              Telefone
            </label>
            <input name="phone" type="tel" placeholder="(51) 99999-9999" className="input-base" />
          </div>
          <div>
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-1.5">
              Aniversário
            </label>
            <input name="birthday" placeholder="dd/mm" maxLength={5} className="input-base" />
          </div>
          <div>
            <label className="block text-[11px] font-body text-muted tracking-[1px] uppercase mb-2">
              Etiquetas
            </label>
            <div className="flex gap-2 flex-wrap">
              {availableTags.map((tag) => {
                const active = tags.includes(tag)
                const s = tagStyles[tag]
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body cursor-pointer transition-all"
                    style={
                      active
                        ? { backgroundColor: s.bg, color: s.color, border: `1.5px solid ${s.border}` }
                        : { backgroundColor: '#FFFFFF', color: '#7A6E8A', border: '1px solid #EEE4D5' }
                    }
                  >
                    {active && <Check size={10} />}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[10px] border border-rule bg-transparent font-body text-sm text-muted cursor-pointer hover:text-ink hover:bg-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 btn-primary rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Salvando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
