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

      <header className="mb-9 flex justify-between items-end">
        <div>
          <h1 className="font-display text-[40px] text-ink font-semibold tracking-[-1px] m-0">
            Compradoras
          </h1>
          <p className="font-body text-muted text-sm mt-2 m-0">
            {lista.length} pessoas cadastradas · histórico, etiquetas e perfis
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-dark">
          <Plus size={14} /> Nova compradora
        </button>
      </header>

      <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1.2fr' }}>
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
