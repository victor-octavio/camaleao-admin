import type { Compradora, Venda, DoacaoDinheiro } from '@/types'

// Módulo cacheado pelo Node.js — estado persiste entre requests (reseta ao reiniciar o servidor)

const _compradoras: Compradora[] = [
  {
    id: '1',
    nome: 'Beyoncé Santos',
    tel: '(51) 99555-5555',
    etiquetas: ['paciente', 'brechó'],
    aniversario: '12/03',
    desde: 2024,
    totalCompras: 8,
    valorTotal: 485,
    ultimaCompra: '06/05/2026',
  },
  {
    id: '2',
    nome: 'Shakira Oliveira',
    tel: '(51) 96666-6666',
    etiquetas: ['familiar'],
    aniversario: '02/09',
    desde: 2023,
    totalCompras: 6,
    valorTotal: 280,
    ultimaCompra: '28/04/2026',
  },
  {
    id: '3',
    nome: 'Alberta Costa',
    tel: '(51) 92222-2222',
    etiquetas: ['voluntária', 'brechó'],
    aniversario: '24/07',
    desde: 2022,
    totalCompras: 5,
    valorTotal: 340,
    ultimaCompra: '02/05/2026',
  },
  {
    id: '4',
    nome: 'Maira Fernandes',
    tel: '(51) 93333-3333',
    etiquetas: ['paciente', 'tampinha'],
    aniversario: '15/11',
    desde: 2025,
    totalCompras: 7,
    valorTotal: 410,
    ultimaCompra: '10/05/2026',
  },
]

const hoje = new Date().toISOString()

const _vendas: Venda[] = [
  {
    id: 'v01',
    hora: '09:42',
    compradora_id: '4',
    compradora_nome: 'Maira Fernandes',
    categoria: '3 peças (blusas)',
    valor: 45,
    liquido: 45,
    pagamento: 'pix',
    banco: 'PIX TON',
    conferido: true,
    created_at: hoje,
  },
  {
    id: 'v02',
    hora: '10:15',
    compradora_id: '1',
    compradora_nome: 'Beyoncé Santos',
    categoria: 'vestido + saia',
    valor: 90,
    liquido: 88.41,
    pagamento: 'credito',
    banco: 'SICREDI',
    parcelas: 2,
    conferido: false,
    created_at: hoje,
  },
  {
    id: 'v03',
    hora: '11:30',
    compradora_id: null,
    compradora_nome: 'Cliente avulso',
    categoria: '1 jaqueta',
    valor: 35,
    liquido: 35,
    pagamento: 'dinheiro',
    conferido: true,
    created_at: hoje,
  },
  {
    id: 'v04',
    hora: '14:08',
    compradora_id: '3',
    compradora_nome: 'Alberta Costa',
    categoria: '5 peças',
    valor: 70,
    liquido: 68.7,
    pagamento: 'debito',
    banco: 'SICREDI',
    conferido: false,
    created_at: hoje,
  },
]

let _nextId = 100

function nextId(): string {
  return String(++_nextId)
}

// Calcula líquido estimado baseado na forma de pagamento
function calcularLiquido(valor: number, pagamento: string): number {
  if (pagamento === 'credito') return parseFloat((valor * 0.98).toFixed(2))
  if (pagamento === 'debito') return parseFloat((valor * 0.982).toFixed(2))
  return valor
}

export function getCompradoras(): Compradora[] {
  return [..._compradoras].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

export function getVendasHoje(): Venda[] {
  const today = new Date().toDateString()
  return _vendas
    .filter((v) => new Date(v.created_at).toDateString() === today)
    .sort((a, b) => a.hora.localeCompare(b.hora))
}

export function getAllVendas(): Venda[] {
  return [..._vendas].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function addCompradora(
  dados: Omit<Compradora, 'id' | 'totalCompras' | 'valorTotal' | 'ultimaCompra'>
): Compradora {
  const nova: Compradora = {
    ...dados,
    id: nextId(),
    totalCompras: 0,
    valorTotal: 0,
    ultimaCompra: '',
  }
  _compradoras.push(nova)
  return nova
}

export function addVenda(
  dados: Omit<Venda, 'id' | 'created_at' | 'liquido' | 'hora'> & { data_venda?: string }
): Venda {
  const agora = dados.data_venda ? new Date(dados.data_venda) : new Date()
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const { data_venda: _, ...rest } = dados
  const nova: Venda = {
    ...rest,
    id: `v${nextId()}`,
    hora,
    liquido: calcularLiquido(dados.valor, dados.pagamento),
    created_at: agora.toISOString(),
  }
  _vendas.push(nova)

  // Atualiza stats da compradora
  if (dados.compradora_id) {
    const comp = _compradoras.find((c) => c.id === dados.compradora_id)
    if (comp) {
      comp.totalCompras += 1
      comp.valorTotal += dados.valor
      comp.ultimaCompra = new Date().toLocaleDateString('pt-BR')
    }
  }

  return nova
}

export function marcarConferido(id: string): void {
  const venda = _vendas.find((v) => v.id === id)
  if (venda) venda.conferido = true
}

export function atualizarEtiquetasStore(id: string, etiquetas: string[]): void {
  const comp = _compradoras.find((c) => c.id === id)
  if (comp) comp.etiquetas = etiquetas
}

// ────────────────────────────────────────────────────────────
// Doações em dinheiro
// ────────────────────────────────────────────────────────────

const _doacoes: DoacaoDinheiro[] = [
  {
    id: 'd01',
    data_doacao: '2026-05-05T00:00:00.000Z',
    doador_nome: 'Cláudia Mendes',
    doador_tel: '(51) 98111-2233',
    valor: 100,
    origem: 'PIX',
    frequencia: 'mensal',
    observacoes: 'Doa todo mês desde jan/2025',
    created_at: '2026-05-05T00:00:00.000Z',
  },
  {
    id: 'd02',
    data_doacao: '2026-05-12T00:00:00.000Z',
    doador_nome: 'Roberto Faria',
    doador_tel: '(51) 97555-8844',
    valor: 250,
    origem: 'Dinheiro',
    frequencia: 'pontual',
    created_at: '2026-05-12T00:00:00.000Z',
  },
  {
    id: 'd03',
    data_doacao: '2026-05-20T00:00:00.000Z',
    doador_nome: 'Beatriz Teixeira',
    doador_tel: '(51) 99444-7766',
    valor: 50,
    origem: 'PIX',
    frequencia: 'mensal',
    created_at: '2026-05-20T00:00:00.000Z',
  },
]

export function getDoacoes(): DoacaoDinheiro[] {
  return [..._doacoes].sort(
    (a, b) => new Date(b.data_doacao).getTime() - new Date(a.data_doacao).getTime()
  )
}

export function addDoacao(
  dados: Omit<DoacaoDinheiro, 'id' | 'created_at'>
): DoacaoDinheiro {
  const nova: DoacaoDinheiro = {
    ...dados,
    id: `d${nextId()}`,
    created_at: new Date().toISOString(),
  }
  _doacoes.push(nova)
  return nova
}
