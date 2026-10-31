import { pick, rng } from '../ui'

const r = rng(42)

export const vendedores = ['Ana Ribeiro', 'Bruno Costa', 'Carla Mendes', 'Diego Alves', 'Elisa Prado']
const cidades = ['São Paulo/SP', 'Campinas/SP', 'Belo Horizonte/MG', 'Curitiba/PR', 'Goiânia/GO', 'Recife/PE', 'Salvador/BA', 'Porto Alegre/RS', 'Ribeirão Preto/SP', 'Londrina/PR']
const tipos = ['Hospital', 'Clínica', 'Laboratório', 'Distribuidor', 'Farmácia']
const nomesBase = ['Santa Luzia', 'Vida Plena', 'São Lucas', 'Bem Estar', 'Nova Esperança', 'Central', 'Primavera', 'Horizonte', 'Boa Saúde', 'Integrar', 'Mais Vida', 'Santa Clara', 'Alvorada', 'Bela Vista', 'Monte Sinai', 'Unimédica', 'Medcenter', 'Pró-Saúde', 'Saúde Total', 'Vitalis']

export type Cliente = {
  id: number
  nome: string
  tipo: string
  cidade: string
  vendedor: string
  potencial: number
  compras12m: number
  ultimaCompra: Date
  status: 'Ativo' | 'Em risco' | 'Inativo'
  contato: string
}

const hoje = new Date(2026, 9, 29)
const diasAtras = (d: number) => new Date(hoje.getTime() - d * 86400000)

export const clientes: Cliente[] = nomesBase.map((n, i) => {
  const tipo = pick(r, tipos)
  const dias = Math.floor(Math.pow(r(), 1.3) * 140)
  const potencial = Math.round((80 + r() * 900) * 1000)
  return {
    id: i + 1,
    nome: `${tipo === 'Distribuidor' ? 'Distribuidora' : tipo} ${n}`,
    tipo,
    cidade: pick(r, cidades),
    vendedor: pick(r, vendedores),
    potencial,
    compras12m: Math.round(potencial * (0.2 + r() * 0.7)),
    ultimaCompra: diasAtras(dias),
    status: dias > 95 ? 'Inativo' : dias > 45 ? 'Em risco' : 'Ativo',
    contato: pick(r, ['Marcos', 'Patrícia', 'Renata', 'Fernando', 'Juliana', 'Rodrigo', 'Aline', 'Gustavo']) + ' (Compras)',
  }
})

export const colunas = ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Fechado'] as const
export type Coluna = (typeof colunas)[number]

export type Oportunidade = { id: number; clienteId: number; titulo: string; valor: number; coluna: Coluna; vendedor: string; dias: number }

const produtosOp = ['Luvas nitrílicas', 'Seringas descartáveis', 'Cateteres', 'Kit curativo', 'Máscaras N95', 'Equipos de soro', 'Fios de sutura', 'Aventais descartáveis']

export const oportunidades: Oportunidade[] = Array.from({ length: 18 }, (_, i) => {
  const c = pick(r, clientes)
  return {
    id: i + 1,
    clienteId: c.id,
    titulo: `${pick(r, produtosOp)} · contrato ${pick(r, ['trimestral', 'semestral', 'anual', 'spot'])}`,
    valor: Math.round((15 + r() * 220) * 1000),
    coluna: colunas[Math.floor(r() * colunas.length)],
    vendedor: c.vendedor,
    dias: Math.floor(r() * 30),
  }
})

export type Pedido = { numero: number; clienteId: number; data: Date; valor: number; itens: number; status: 'Faturado' | 'Em separação' | 'Aguardando liberação' | 'Cancelado'; vendedor: string }

export const pedidos: Pedido[] = Array.from({ length: 60 }, (_, i): Pedido => {
  const c = pick(r, clientes)
  const st = r()
  return {
    numero: 48210 + i * 3,
    clienteId: c.id,
    data: diasAtras(Math.floor(r() * 90)),
    valor: Math.round((2 + r() * 60) * 1000),
    itens: 1 + Math.floor(r() * 8),
    status: st < 0.62 ? 'Faturado' : st < 0.8 ? 'Em separação' : st < 0.94 ? 'Aguardando liberação' : 'Cancelado',
    vendedor: c.vendedor,
  }
}).sort((a, b) => b.data.getTime() - a.data.getTime())

export const vendasMes = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'].map((m, i) => ({
  mes: m,
  realizado: Math.round(820 + i * 38 + r() * 160) * 1000,
  meta: (900 + i * 35) * 1000,
}))
// Outubro fecha acima da meta para a demo contar uma história de crescimento
vendasMes[11].realizado = Math.round(vendasMes[11].meta * 1.07)

export type Evento = { data: Date; tipo: 'Pedido' | 'Ligação' | 'E-mail' | 'WhatsApp' | 'Reclamação' | 'Amostra' | 'Reunião'; texto: string }

export function linhaDoTempo(c: Cliente): Evento[] {
  const rr = rng(c.id * 97)
  const modelos: [Evento['tipo'], string][] = [
    ['Pedido', 'Pedido faturado com {n} itens'],
    ['Ligação', 'Ligação de follow-up com {c}: pediu nova tabela de preços'],
    ['E-mail', 'Enviada proposta comercial para o trimestre'],
    ['WhatsApp', '{c} perguntou sobre prazo de entrega do último pedido'],
    ['Reclamação', 'Reclamação de avaria em 2 caixas; reposição enviada'],
    ['Amostra', 'Amostras de luvas nitrílicas entregues para teste'],
    ['Reunião', 'Reunião com a diretoria de compras sobre contrato anual'],
  ]
  return Array.from({ length: 9 }, () => {
    const [tipo, t] = pick(rr, modelos)
    return { data: diasAtras(Math.floor(rr() * 120)), tipo, texto: t.replace('{n}', String(2 + Math.floor(rr() * 12))).replace('{c}', c.contato.split(' ')[0]) }
  }).sort((a, b) => b.data.getTime() - a.data.getTime())
}

export function resumoIA(c: Cliente, eventos: Evento[]) {
  const reclam = eventos.filter((e) => e.tipo === 'Reclamação').length
  const pedidosN = eventos.filter((e) => e.tipo === 'Pedido').length
  const uso = Math.round((c.compras12m / c.potencial) * 100)
  const partes = [
    `${c.nome} comprou ${uso}% do potencial estimado nos últimos 12 meses.`,
    pedidosN ? `Teve ${pedidosN} pedido(s) recente(s) na linha do tempo.` : 'Não há pedidos recentes registrados.',
    reclam ? `Atenção: ${reclam} reclamação(ões) no período; vale confirmar se foram resolvidas antes da próxima proposta.` : 'Sem reclamações abertas.',
    c.status === 'Ativo'
      ? 'Sugestão: oferecer contrato anual para garantir volume.'
      : c.status === 'Em risco'
        ? 'Sugestão: ligar esta semana; o cliente está há mais de 45 dias sem comprar.'
        : 'Sugestão: campanha de reativação com condição especial.',
  ]
  return partes.join(' ')
}

export const clientePorId = (id: number) => clientes.find((c) => c.id === id)!

// ---- extras da versão nova ----

export const probabilidade: Record<Coluna, number> = { Prospecção: 10, Qualificação: 25, Proposta: 50, Negociação: 75, Fechado: 100 }

export const corColuna: Record<Coluna, string> = {
  Prospecção: '#94a3b8',
  Qualificação: '#38bdf8',
  Proposta: '#a78bfa',
  Negociação: '#f59e0b',
  Fechado: '#22c55e',
}

// Nota de saúde do cliente (0 a 100): quanto comprou do potencial e há quanto tempo não compra
export function saude(c: Cliente) {
  const uso = c.compras12m / c.potencial
  const dias = (hoje.getTime() - c.ultimaCompra.getTime()) / 86400000
  const teto = c.status === 'Ativo' ? 98 : c.status === 'Em risco' ? 60 : 35
  return Math.max(5, Math.min(teto, Math.round(uso * 70 + Math.max(0, 40 - dias * 0.4))))
}

export const diasSemComprar = (c: Cliente) => Math.round((hoje.getTime() - c.ultimaCompra.getTime()) / 86400000)

// meta de 90 dias de cada vendedor: um quarto do potencial anual da carteira dele
export const metaVendedor: Record<string, number> = Object.fromEntries(
  vendedores.map((v) => [v, Math.max(100000, Math.round(clientes.filter((c) => c.vendedor === v).reduce((s, c) => s + c.potencial, 0) * 0.25 / 10000) * 10000)]),
)

// Série diária do mês para os mini gráficos dos indicadores
export const serieDiaria = (seed: number, base: number, tendencia = 0.02) => {
  const rr = rng(seed)
  let v = base
  return Array.from({ length: 22 }, (_, i) => {
    v = v * (1 + tendencia * (rr() - 0.35))
    return { d: i + 1, v: Math.round(v) }
  })
}

const catalogo: [string, number][] = [
  ['Luva nitrílica M (cx 100)', 38.9],
  ['Seringa 10 ml (cx 100)', 62.5],
  ['Cateter IV 22G (cx 50)', 119.0],
  ['Máscara N95 (cx 20)', 74.0],
  ['Equipo macrogotas (un)', 4.8],
  ['Fio de sutura nylon 3-0 (cx 24)', 96.0],
  ['Avental descartável (pct 10)', 29.9],
  ['Kit curativo estéril (un)', 7.5],
]

export function itensPedido(p: Pedido) {
  const rr = rng(p.numero)
  const usados = new Set<number>()
  // distribui o valor do pedido entre os itens, pra soma bater com o total
  const pesos = Array.from({ length: p.itens }, () => 0.3 + rr())
  const soma = pesos.reduce((a, b) => a + b, 0)
  return pesos.map((w) => {
    let k = Math.floor(rr() * catalogo.length)
    while (usados.has(k)) k = (k + 1) % catalogo.length
    usados.add(k)
    const [nome, preco] = catalogo[k]
    return { nome, preco, qtd: Math.max(1, Math.round((p.valor * w) / soma / preco)) }
  })
}

export type Atividade = { id: number; quem: string; acao: string; alvo: string; clienteId: number; minutos: number; tipo: Evento['tipo'] | 'Pipeline' }

const acoes: [Atividade['tipo'], string][] = [
  ['Pedido', 'emitiu um pedido para'],
  ['Ligação', 'ligou para'],
  ['WhatsApp', 'respondeu no WhatsApp'],
  ['E-mail', 'enviou proposta para'],
  ['Pipeline', 'levou para negociação a conta de'],
  ['Reunião', 'agendou reunião com'],
  ['Amostra', 'enviou amostras para'],
]

export function gerarAtividade(seed: number, minutos: number): Atividade {
  // semente espalhada: com números pequenos o gerador devolve quase sempre o mesmo primeiro valor
  const rr = rng(((seed * 2654435761) % 2147483646) + 1)
  const c = pick(rr, clientes)
  const [tipo, acao] = pick(rr, acoes)
  return { id: seed, quem: c.vendedor, acao, alvo: c.nome, clienteId: c.id, minutos, tipo }
}

export const atividadesIniciais = Array.from({ length: 7 }, (_, i) => gerarAtividade(i + 1, [2, 9, 17, 34, 52, 75, 110][i]))

export const notificacoes = [
  { id: 1, titulo: 'Pedido aguardando liberação', texto: 'Hospital São Lucas · pedido 48231 passou do limite de crédito', tempo: 'há 12 min', lida: false },
  { id: 2, titulo: 'Meta batida', texto: 'O time passou de 100% da meta de outubro', tempo: 'há 1 h', lida: false },
  { id: 3, titulo: 'Oportunidade parada', texto: '3 oportunidades sem movimento há mais de 20 dias', tempo: 'há 3 h', lida: false },
  { id: 4, titulo: 'Cliente reativado', texto: 'Clínica Alvorada voltou a comprar depois de 98 dias', tempo: 'ontem', lida: true },
]
