'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CustomersList } from '@/components/shop/customers-list'
import { CustomerProfile } from '@/components/shop/customer-profile'
import { NewCustomerModal } from '@/components/shop/new-customer-modal'
import type { Customer } from '@/types'

interface DbTag { id: string; name: string; color: string; bg_color: string }

interface CustomersPageClientProps {
  customers: Customer[]
  tags: DbTag[]
}

export function CustomersPageClient({ customers: initial, tags }: CustomersPageClientProps) {
  const [list, setList] = useState<Customer[]>(initial)
  const [selected, setSelected] = useState<Customer>(initial[0])
  const [showModal, setShowModal] = useState(false)

  function handleCustomerCreated(customer: Customer) {
    setList((prev) => [...prev, customer].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
    setSelected(customer)
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <NewCustomerModal
          tags={tags}
          onClose={() => setShowModal(false)}
          onCreated={handleCustomerCreated}
        />
      )}

      <header className="mb-6 md:mb-9 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="font-display text-[28px] md:text-[40px] text-ink font-semibold tracking-[-1px] m-0">
            Compradoras
          </h1>
          <p className="font-body text-muted text-sm mt-2 m-0">
            {list.length} pessoas cadastradas · histórico, etiquetas e perfis
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-dark self-start md:self-auto">
          <Plus size={14} /> Nova compradora
        </button>
      </header>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1fr_1.2fr]">
        <CustomersList customers={list} selected={selected} onSelect={setSelected} />
        <CustomerProfile customer={selected} />
      </div>
    </>
  )
}
