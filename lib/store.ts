import type { Customer, Sale, DonationCash } from '@/types'

// Node module cache — state persists between requests (resets on server restart)

const _customers: Customer[] = [
  {
    id: '1',
    name: 'Beyoncé Santos',
    phone: '(51) 99555-5555',
    tags: ['paciente', 'brechó'],
    birthday: '12/03',
    member_since: 2024,
    purchase_count: 8,
    total_spent: 485,
    last_purchase_at: '06/05/2026',
  },
  {
    id: '2',
    name: 'Shakira Oliveira',
    phone: '(51) 96666-6666',
    tags: ['familiar'],
    birthday: '02/09',
    member_since: 2023,
    purchase_count: 6,
    total_spent: 280,
    last_purchase_at: '28/04/2026',
  },
  {
    id: '3',
    name: 'Alberta Costa',
    phone: '(51) 92222-2222',
    tags: ['voluntária', 'brechó'],
    birthday: '24/07',
    member_since: 2022,
    purchase_count: 5,
    total_spent: 340,
    last_purchase_at: '02/05/2026',
  },
  {
    id: '4',
    name: 'Maira Fernandes',
    phone: '(51) 93333-3333',
    tags: ['paciente', 'tampinha'],
    birthday: '15/11',
    member_since: 2025,
    purchase_count: 7,
    total_spent: 410,
    last_purchase_at: '10/05/2026',
  },
]

const now = new Date().toISOString()

const _sales: Sale[] = [
  {
    id: 'v01',
    time: '09:42',
    customer_id: '4',
    customer_name: 'Maira Fernandes',
    category: '3 peças (blusas)',
    amount: 45,
    net_amount: 45,
    payment_method: 'pix',
    bank: 'PIX TON',
    confirmed: true,
    created_at: now,
  },
  {
    id: 'v02',
    time: '10:15',
    customer_id: '1',
    customer_name: 'Beyoncé Santos',
    category: 'vestido + saia',
    amount: 90,
    net_amount: 88.41,
    payment_method: 'credito',
    bank: 'SICREDI',
    installments: 2,
    confirmed: false,
    created_at: now,
  },
  {
    id: 'v03',
    time: '11:30',
    customer_id: null,
    customer_name: 'Cliente avulso',
    category: '1 jaqueta',
    amount: 35,
    net_amount: 35,
    payment_method: 'dinheiro',
    confirmed: true,
    created_at: now,
  },
  {
    id: 'v04',
    time: '14:08',
    customer_id: '3',
    customer_name: 'Alberta Costa',
    category: '5 peças',
    amount: 70,
    net_amount: 68.7,
    payment_method: 'debito',
    bank: 'SICREDI',
    confirmed: false,
    created_at: now,
  },
]

let _nextId = 100

function nextId(): string {
  return String(++_nextId)
}

function calcNetAmount(amount: number, payment_method: string): number {
  if (payment_method === 'credito') return parseFloat((amount * 0.98).toFixed(2))
  if (payment_method === 'debito') return parseFloat((amount * 0.982).toFixed(2))
  return amount
}

export function getCustomers(): Customer[] {
  return [..._customers].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export function getTodaySales(): Sale[] {
  const today = new Date().toDateString()
  return _sales
    .filter((v) => new Date(v.created_at).toDateString() === today)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export function getAllSales(): Sale[] {
  return [..._sales].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function addCustomer(
  data: Omit<Customer, 'id' | 'purchase_count' | 'total_spent' | 'last_purchase_at'>
): Customer {
  const customer: Customer = {
    ...data,
    id: nextId(),
    purchase_count: 0,
    total_spent: 0,
    last_purchase_at: '',
  }
  _customers.push(customer)
  return customer
}

export function addSale(
  data: Omit<Sale, 'id' | 'created_at' | 'net_amount' | 'time'> & { sold_at?: string }
): Sale {
  const date = data.sold_at ? new Date(data.sold_at) : new Date()
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const { sold_at: _, ...rest } = data
  const sale: Sale = {
    ...rest,
    id: `v${nextId()}`,
    time,
    net_amount: calcNetAmount(data.amount, data.payment_method),
    created_at: date.toISOString(),
  }
  _sales.push(sale)

  if (data.customer_id) {
    const customer = _customers.find((c) => c.id === data.customer_id)
    if (customer) {
      customer.purchase_count += 1
      customer.total_spent += data.amount
      customer.last_purchase_at = new Date().toLocaleDateString('pt-BR')
    }
  }

  return sale
}

export function confirmSale(id: string): void {
  const sale = _sales.find((v) => v.id === id)
  if (sale) sale.confirmed = true
}

export function updateCustomerTagsStore(id: string, tags: string[]): void {
  const customer = _customers.find((c) => c.id === id)
  if (customer) customer.tags = tags
}

// ────────────────────────────────────────────────────────────
// Cash donations
// ────────────────────────────────────────────────────────────

const _donations: DonationCash[] = [
  {
    id: 'd01',
    donated_at: '2026-05-05T00:00:00.000Z',
    donor_name: 'Cláudia Mendes',
    donor_phone: '(51) 98111-2233',
    amount: 100,
    origin: 'PIX',
    frequency: 'monthly',
    notes: 'Doa todo mês desde jan/2025',
    created_at: '2026-05-05T00:00:00.000Z',
  },
  {
    id: 'd02',
    donated_at: '2026-05-12T00:00:00.000Z',
    donor_name: 'Roberto Faria',
    donor_phone: '(51) 97555-8844',
    amount: 250,
    origin: 'Dinheiro',
    frequency: 'one_time',
    created_at: '2026-05-12T00:00:00.000Z',
  },
  {
    id: 'd03',
    donated_at: '2026-05-20T00:00:00.000Z',
    donor_name: 'Beatriz Teixeira',
    donor_phone: '(51) 99444-7766',
    amount: 50,
    origin: 'PIX',
    frequency: 'monthly',
    created_at: '2026-05-20T00:00:00.000Z',
  },
]

export function getDonations(): DonationCash[] {
  return [..._donations].sort(
    (a, b) => new Date(b.donated_at).getTime() - new Date(a.donated_at).getTime()
  )
}

export function addDonation(
  data: Omit<DonationCash, 'id' | 'created_at'>
): DonationCash {
  const donation: DonationCash = {
    ...data,
    id: `d${nextId()}`,
    created_at: new Date().toISOString(),
  }
  _donations.push(donation)
  return donation
}
