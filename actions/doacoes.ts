'use server'

import { redirect } from 'next/navigation'
import { addDoacao } from '@/lib/store'
import { revalidatePath } from 'next/cache'

export async function registrarDoacao(formData: FormData) {
  const data_doacao = (formData.get('data_doacao') as string) || new Date().toISOString().split('T')[0]

  addDoacao({
    data_doacao: new Date(data_doacao).toISOString(),
    doador_nome: (formData.get('doador_nome') as string) || '',
    doador_tel: (formData.get('doador_tel') as string) || '',
    valor: parseFloat((formData.get('valor') as string) || '0'),
    origem: (formData.get('origem') as string) || 'PIX',
    frequencia: (formData.get('frequencia') as 'mensal' | 'pontual') || 'pontual',
    observacoes: (formData.get('observacoes') as string) || undefined,
  })

  revalidatePath('/doacoes/dinheiro')
  redirect('/doacoes/dinheiro')
}
