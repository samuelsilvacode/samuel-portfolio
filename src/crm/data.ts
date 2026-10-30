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
    itens: 1 + Math.floor(r() * 14),
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
