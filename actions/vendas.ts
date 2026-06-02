'use server'

import { redirect } from 'next/navigation'
import { addVenda, marcarConferido } from '@/lib/store'
import { revalidatePath } from 'next/cache'

export async function registrarVenda(formData: FormData) {
  const pecasRaw = formData.get('pecas') as string
  const pecas = JSON.parse(pecasRaw) as { categoria: string; valor: number }[]
  const total = pecas.reduce((s, p) => s + p.valor, 0)

  addVenda({
    compradora_id: (formData.get('compradora_id') as string) || null,
    compradora_nome: (formData.get('compradora_nome') as string) || 'Cliente avulso',
    categoria: pecas.map((p) => p.categoria).filter(Boolean).join(', '),
    valor: total,
    pagamento: formData.get('pagamento') as string,
    banco: (formData.get('banco') as string) || undefined,
    parcelas: formData.get('parcelas') ? Number(formData.get('parcelas')) : undefined,
    data_venda: (formData.get('data_venda') as string) || undefined,
    conferido: false,
  })

  redirect('/brecho')
}

export async function conferirVenda(id: string) {
  marcarConferido(id)
  revalidatePath('/brecho/financeiro')
}
