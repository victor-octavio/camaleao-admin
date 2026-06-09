'use server'

import { addCustomer, updateCustomerTagsStore } from '@/lib/store'
import { revalidatePath } from 'next/cache'
import type { Customer } from '@/types'

export async function createCustomer(formData: FormData): Promise<Customer> {
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? JSON.parse(tagsRaw) as string[] : []

  const customer = await addCustomer({
    name:         formData.get('name') as string,
    phone:        (formData.get('phone') as string) || '',
    birthday:     (formData.get('birthday') as string) || '',
    tags,
    member_since: new Date().getFullYear(),
  })

  revalidatePath('/brecho/compradoras')
  revalidatePath('/brecho/nova-venda')

  return customer
}

export async function updateCustomerTags(id: string, tags: string[]) {
  await updateCustomerTagsStore(id, tags)
  revalidatePath('/brecho/compradoras')
}
