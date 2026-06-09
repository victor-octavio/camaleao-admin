'use server'

import { redirect } from 'next/navigation'
import { addSale, confirmSale } from '@/lib/store'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function calcNetAmount(amount: number, paymentMethod: string): number {
  if (paymentMethod === 'credit') return parseFloat((amount * 0.98).toFixed(2))
  if (paymentMethod === 'debit')  return parseFloat((amount * 0.982).toFixed(2))
  return amount
}

export async function registerSale(formData: FormData) {
  const supabase = await createClient()
  const itemsRaw = formData.get('items') as string
  const items = JSON.parse(itemsRaw) as { category: string; amount: number }[]
  const total = items.reduce((s, p) => s + p.amount, 0)
  const paymentMethodName = formData.get('payment_method') as string
  const bankName = (formData.get('bank') as string) || null

  // Resolve FKs de payment_method e bank pelo nome
  const [{ data: pm }, { data: bank }] = await Promise.all([
    supabase.from('payment_methods').select('id').eq('name', paymentMethodName).single(),
    bankName
      ? supabase.from('banks').select('id').eq('name', bankName).single()
      : Promise.resolve({ data: null }),
  ])

  await addSale({
    customer_id:        (formData.get('customer_id') as string) || null,
    customer_name:      (formData.get('customer_name') as string) || 'Cliente avulso',
    payment_method:     paymentMethodName,
    confirmed:          false,
    payment_method_id:  pm?.id ?? undefined,
    bank_id:            (bank as { id: string } | null)?.id ?? undefined,
    installments:       formData.get('installments') ? Number(formData.get('installments')) : undefined,
    net_amount:         calcNetAmount(total, paymentMethodName),
    sold_at:            (formData.get('sold_at') as string) || undefined,
    items:              items.map((p) => ({ category_name: p.category, amount: p.amount })),
  })

  redirect('/brecho')
}

export async function markSaleConfirmed(id: string) {
  await confirmSale(id)
  revalidatePath('/brecho/financeiro')
}
