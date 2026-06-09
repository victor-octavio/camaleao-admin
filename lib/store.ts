import { createClient } from '@/lib/supabase/server'
import type { Customer, Sale, DonationCash } from '@/types'

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('customers_view')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return (data ?? []) as Customer[]
}

export async function getTodaySales(): Promise<Sale[]> {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('sales_view')
    .select('*')
    .gte('sold_at', today.toISOString())
    .order('sold_at')

  if (error) throw new Error(error.message)
  return (data ?? []) as Sale[]
}

export async function getAllSales(): Promise<Sale[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sales_view')
    .select('*')
    .order('sold_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Sale[]
}

export async function addCustomer(
  data: Omit<Customer, 'id' | 'purchase_count' | 'total_spent' | 'last_purchase_at' | 'created_at'>
): Promise<Customer> {
  const supabase = await createClient()

  // Cria supporter primeiro
  const { data: supporter, error: supporterError } = await supabase
    .from('supporters')
    .insert({ name: data.name, phone: data.phone, birthday: data.birthday })
    .select('id')
    .single()

  if (supporterError) throw new Error(supporterError.message)

  // Cria customer vinculado ao supporter
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({ supporter_id: supporter.id, member_since: data.member_since })
    .select('id')
    .single()

  if (customerError) throw new Error(customerError.message)

  // Vincula tags
  if (data.tags.length > 0) {
    const { data: tagRows, error: tagsLookupError } = await supabase
      .from('tags')
      .select('id, name')
      .in('name', data.tags)

    if (tagsLookupError) throw new Error(tagsLookupError.message)

    const tagLinks = (tagRows ?? []).map((t) => ({
      customer_id: customer.id,
      tag_id: t.id,
    }))

    if (tagLinks.length > 0) {
      const { error: tagError } = await supabase.from('customer_tags').insert(tagLinks)
      if (tagError) throw new Error(tagError.message)
    }
  }

  // Retorna via view para ter o objeto flat completo
  const { data: full, error: viewError } = await supabase
    .from('customers_view')
    .select('*')
    .eq('id', customer.id)
    .single()

  if (viewError) throw new Error(viewError.message)
  return full as Customer
}

export async function addSale(
  data: Omit<Sale, 'id' | 'created_at' | 'time' | 'category' | 'amount'> & {
    sold_at?: string
    items: { category_name: string; amount: number }[]
    payment_method_id?: string
    bank_id?: string
  }
): Promise<string> {
  const supabase = await createClient()

  const { data: result, error } = await supabase.rpc('register_sale', {
    p_customer_id:       data.customer_id ?? null,
    p_customer_name:     data.customer_name,
    p_payment_method_id: data.payment_method_id ?? null,
    p_bank_id:           data.bank_id ?? null,
    p_installments:      data.installments ?? null,
    p_net_amount:        data.net_amount ?? null,
    p_registered_by:     null,
    p_sold_at:           data.sold_at ?? new Date().toISOString(),
    p_items:             data.items,
  })

  if (error) throw new Error(error.message)
  return result as string
}

export async function confirmSale(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sales')
    .update({ confirmed: true })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function updateCustomerTagsStore(id: string, tags: string[]): Promise<void> {
  const supabase = await createClient()

  // Busca IDs das tags pelo nome
  const { data: tagRows, error: lookupError } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', tags)

  if (lookupError) throw new Error(lookupError.message)

  // Substitui todas as tags do customer
  const { error: deleteError } = await supabase
    .from('customer_tags')
    .delete()
    .eq('customer_id', id)

  if (deleteError) throw new Error(deleteError.message)

  if (tagRows && tagRows.length > 0) {
    const { error: insertError } = await supabase
      .from('customer_tags')
      .insert(tagRows.map((t) => ({ customer_id: id, tag_id: t.id })))

    if (insertError) throw new Error(insertError.message)
  }
}

export async function getDonations(): Promise<DonationCash[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('donations_cash_view')
    .select('*')
    .order('donated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as DonationCash[]
}

export async function addDonation(
  data: Omit<DonationCash, 'id' | 'created_at'>
): Promise<DonationCash> {
  const supabase = await createClient()

  // Resolve origin_id pelo nome
  const { data: origin, error: originError } = await supabase
    .from('cash_origins')
    .select('id')
    .eq('name', data.origin)
    .single()

  if (originError) throw new Error(originError.message)

  const { data: inserted, error } = await supabase
    .from('donations_cash')
    .insert({
      donor_name:  data.donor_name,
      donor_phone: data.donor_phone,
      amount:      data.amount,
      origin_id:   origin.id,
      frequency:   data.frequency,
      donated_at:  data.donated_at,
      notes:       data.notes ?? null,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  const { data: full, error: viewError } = await supabase
    .from('donations_cash_view')
    .select('*')
    .eq('id', inserted.id)
    .single()

  if (viewError) throw new Error(viewError.message)
  return full as DonationCash
}
