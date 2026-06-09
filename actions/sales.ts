'use server'

import { redirect } from 'next/navigation'
import { addSale, confirmSale } from '@/lib/store'
import { revalidatePath } from 'next/cache'

export async function registerSale(formData: FormData) {
  const itemsRaw = formData.get('items') as string
  const items = JSON.parse(itemsRaw) as { category: string; amount: number }[]
  const total = items.reduce((s, p) => s + p.amount, 0)

  addSale({
    customer_id: (formData.get('customer_id') as string) || null,
    customer_name: (formData.get('customer_name') as string) || 'Cliente avulso',
    category: items.map((p) => p.category).filter(Boolean).join(', '),
    amount: total,
    payment_method: formData.get('payment_method') as string,
    bank: (formData.get('bank') as string) || undefined,
    installments: formData.get('installments') ? Number(formData.get('installments')) : undefined,
    sold_at: (formData.get('sold_at') as string) || undefined,
    confirmed: false,
  })

  redirect('/brecho')
}

export async function markSaleConfirmed(id: string) {
  confirmSale(id)
  revalidatePath('/brecho/financeiro')
}
