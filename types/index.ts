export interface Compradora {
  id: string
  nome: string
  tel: string
  etiquetas: string[]
  aniversario: string
  desde: number
  totalCompras: number
  valorTotal: number
  ultimaCompra: string
  created_at?: string
}

export interface Venda {
  id: string
  hora: string
  compradora_id: string | null
  compradora_nome: string
  categoria: string
  valor: number
  pagamento: string
  banco?: string
  parcelas?: number
  liquido?: number
  conferido: boolean
  created_at: string
}

export interface PecaVenda {
  categoria: string
  valor: number
}

export interface DoacaoDinheiro {
  id: string
  data_doacao: string
  doador_nome: string
  doador_tel: string
  valor: number
  origem: string
  frequencia: 'mensal' | 'pontual'
  observacoes?: string
  created_at: string
}
