'use server'

import { redirect } from 'next/navigation'
import { addDonation } from '@/lib/store'
import { revalidatePath } from 'next/cache'

export async function registerDonation(formData: FormData) {
  const donated_at = (formData.get('donated_at') as string) || new Date().toISOString().split('T')[0]

  addDonation({
    donated_at: new Date(donated_at).toISOString(),
    donor_name: (formData.get('donor_name') as string) || '',
    donor_phone: (formData.get('donor_phone') as string) || '',
    amount: parseFloat((formData.get('amount') as string) || '0'),
    origin: (formData.get('origin') as string) || 'PIX',
    frequency: (formData.get('frequency') as 'monthly' | 'one_time') || 'one_time',
    notes: (formData.get('notes') as string) || undefined,
  })

  revalidatePath('/doacoes/dinheiro')
  redirect('/doacoes/dinheiro')
}
