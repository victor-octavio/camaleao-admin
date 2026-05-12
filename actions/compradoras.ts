'use server'

import { addCompradora, atualizarEtiquetasStore } from '@/lib/store'
import { revalidatePath } from 'next/cache'
import type { Compradora } from '@/types'

export async function cadastrarCompradora(formData: FormData): Promise<Compradora> {
  const etiquetasRaw = formData.get('etiquetas') as string
  const etiquetas = etiquetasRaw ? JSON.parse(etiquetasRaw) as string[] : []

  const nova = addCompradora({
    nome: formData.get('nome') as string,
    tel: (formData.get('tel') as string) || '',
    aniversario: (formData.get('aniversario') as string) || '',
    etiquetas,
    desde: new Date().getFullYear(),
  })

  revalidatePath('/brecho/compradoras')
  revalidatePath('/brecho/nova-venda')

  return nova
}

export async function atualizarEtiquetas(id: string, etiquetas: string[]) {
  atualizarEtiquetasStore(id, etiquetas)
  revalidatePath('/brecho/compradoras')
}
