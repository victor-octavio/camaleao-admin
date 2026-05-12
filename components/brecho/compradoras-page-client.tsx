'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CompradoresList } from '@/components/brecho/compradoras-list'
import { CompradoraPerfil } from '@/components/brecho/compradora-perfil'
import { NovaCompradoraModal } from '@/components/brecho/nova-compradora-modal'
import type { Compradora } from '@/types'

interface CompradoresPageClientProps {
  compradoras: Compradora[]
}

export function CompradoresPageClient({ compradoras: inicial }: CompradoresPageClientProps) {
  const [lista, setLista] = useState<Compradora[]>(inicial)
  const [selected, setSelected] = useState<Compradora>(inicial[0])
  const [showModal, setShowModal] = useState(false)

  function handleNovaCompradoraCriada(nova: Compradora) {
    setLista((prev) => [...prev, nova].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    setSelected(nova)
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <NovaCompradoraModal
          onClose={() => setShowModal(false)}
          onCreated={handleNovaCompradoraCriada}
        />
      )}

      <header className="mb-6 md:mb-9 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="font-display text-[28px] md:text-[40px] text-ink font-semibold tracking-[-1px] m-0">
            Compradoras
          </h1>
          <p className="font-body text-muted text-sm mt-2 m-0">
            {lista.length} pessoas cadastradas · histórico, etiquetas e perfis
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-dark self-start md:self-auto">
          <Plus size={14} /> Nova compradora
        </button>
      </header>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[1fr_1.2fr]">
        <CompradoresList
          compradoras={lista}
          selected={selected}
          onSelect={setSelected}
        />
        <CompradoraPerfil compradora={selected} />
      </div>
    </>
  )
}
