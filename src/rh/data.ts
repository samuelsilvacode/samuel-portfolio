import { pick, rng } from '../ui'

const r = rng(7)

export const empresas = ['Horizonte Logística', 'Horizonte Saúde', 'Horizonte Tech']
export const departamentos = ['Comercial', 'Financeiro', 'Logística', 'TI', 'RH', 'Atendimento', 'Compras']
const cargosPor: Record<string, string[]> = {
  Comercial: ['Executivo de Vendas', 'Coordenador Comercial', 'Assistente Comercial'],
  Financeiro: ['Analista Financeiro', 'Assistente Financeiro', 'Gerente Financeiro'],
  Logística: ['Conferente', 'Auxiliar de Expedição', 'Supervisor de Logística'],
  TI: ['Desenvolvedor', 'Analista de Suporte', 'Coordenador de TI'],
  RH: ['Analista de RH', 'Assistente de DP', 'Business Partner'],
  Atendimento: ['Atendente SAC', 'Supervisor de Atendimento'],
  Compras: ['Comprador', 'Analista de Compras'],
}
const nomes = ['Lucas', 'Mariana', 'Pedro', 'Beatriz', 'Rafael', 'Camila', 'Thiago', 'Larissa', 'Gabriel', 'Fernanda', 'Mateus', 'Júlia', 'André', 'Letícia', 'Vinícius', 'Bianca', 'Felipe', 'Isabela', 'Caio', 'Natália', 'Eduardo', 'Paula', 'Henrique', 'Sofia']
const sobrenomes = ['Oliveira', 'Santos', 'Lima', 'Souza', 'Ferreira', 'Rocha', 'Martins', 'Araújo', 'Barbosa', 'Cardoso', 'Teixeira', 'Moreira']

const hoje = new Date(2026, 9, 29)
const diasAtras = (d: number) => new Date(hoje.getTime() - d * 86400000)

export type Colaborador = {
  id: number
  nome: string
  empresa: string
  departamento: string
  cargo: string
  admissao: Date
  situacao: 'Ativo' | 'Férias' | 'Afastado' | 'Experiência'
  gestor: string
  desempenho: number
  aniversario: string
}

export const colaboradores: Colaborador[] = Array.from({ length: 42 }, (_, i): Colaborador => {
  const dep = pick(r, departamentos)
  const dias = i % 9 === 0 ? 20 + Math.floor(r() * 70) : 90 + Math.floor(r() * 2300)
  const s = r()
  return {
    id: i + 1,
    nome: `${nomes[i % nomes.length]} ${pick(r, sobrenomes)}`,
    empresa: pick(r, empresas),
    departamento: dep,
    cargo: pick(r, cargosPor[dep]),
    admissao: diasAtras(dias),
    situacao: dias < 90 ? 'Experiência' : s < 0.08 ? 'Férias' : s < 0.12 ? 'Afastado' : 'Ativo',
    gestor: pick(r, ['Renata Lopes', 'Marcelo Dias', 'Cláudia Reis', 'Sérgio Nunes']),
    desempenho: Math.round((2.6 + r() * 2.4) * 10) / 10,
    aniversario: `${String(1 + Math.floor(r() * 28)).padStart(2, '0')}/${String(1 + Math.floor(r() * 12)).padStart(2, '0')}`,
  }
})

export const etapas = ['Triagem', 'Entrevista RH', 'Entrevista gestor', 'Proposta', 'Contratado'] as const
export type Etapa = (typeof etapas)[number]

export type Vaga = { id: number; titulo: string; departamento: string; empresa: string; abertura: Date; modelo: 'Presencial' | 'Híbrido' | 'Remoto'; candidatos: number }
export const vagas: Vaga[] = [
  { id: 1, titulo: 'Executivo de Vendas', departamento: 'Comercial', empresa: 'Horizonte Saúde', abertura: diasAtras(12), modelo: 'Híbrido', candidatos: 0 },
  { id: 2, titulo: 'Analista Financeiro Pleno', departamento: 'Financeiro', empresa: 'Horizonte Logística', abertura: diasAtras(25), modelo: 'Presencial', candidatos: 0 },
  { id: 3, titulo: 'Desenvolvedor Full Stack', departamento: 'TI', empresa: 'Horizonte Tech', abertura: diasAtras(6), modelo: 'Remoto', candidatos: 0 },
  { id: 4, titulo: 'Conferente', departamento: 'Logística', empresa: 'Horizonte Logística', abertura: diasAtras(3), modelo: 'Presencial', candidatos: 0 },
]

export type Candidato = { id: number; nome: string; vagaId: number; etapa: Etapa; origem: string; nota: number }
export const candidatos: Candidato[] = Array.from({ length: 22 }, (_, i) => {
  const v = pick(r, vagas)
  v.candidatos++
  return {
    id: i + 1,
    nome: `${pick(r, nomes)} ${pick(r, sobrenomes)}`,
    vagaId: v.id,
    etapa: etapas[Math.min(4, Math.floor(r() * r() * 6))],
    origem: pick(r, ['LinkedIn', 'Indicação', 'Site de carreiras', 'Banco de talentos']),
    nota: Math.round((3 + r() * 2) * 10) / 10,
  }
})

export type Treinamento = { id: number; nome: string; tipo: 'Obrigatório' | 'Desenvolvimento' | 'Integração'; carga: number; inscritos: number; concluidos: number; prazo: Date }
export const treinamentos: Treinamento[] = [
  { id: 1, nome: 'Integração de novos colaboradores', tipo: 'Integração', carga: 4, inscritos: 9, concluidos: 7, prazo: diasAtras(-10) },
  { id: 2, nome: 'Boas práticas de armazenagem', tipo: 'Obrigatório', carga: 8, inscritos: 14, concluidos: 9, prazo: diasAtras(-20) },
  { id: 3, nome: 'LGPD no dia a dia', tipo: 'Obrigatório', carga: 2, inscritos: 42, concluidos: 31, prazo: diasAtras(-5) },
  { id: 4, nome: 'Negociação consultiva', tipo: 'Desenvolvimento', carga: 12, inscritos: 8, concluidos: 3, prazo: diasAtras(-40) },
  { id: 5, nome: 'Excel intermediário', tipo: 'Desenvolvimento', carga: 10, inscritos: 15, concluidos: 12, prazo: diasAtras(-30) },
  { id: 6, nome: 'Liderança para coordenadores', tipo: 'Desenvolvimento', carga: 16, inscritos: 6, concluidos: 1, prazo: diasAtras(-60) },
]

export const climaPerguntas = [
  { tema: 'Liderança', nota: 4.2 },
  { tema: 'Comunicação', nota: 3.6 },
  { tema: 'Reconhecimento', nota: 3.3 },
  { tema: 'Ambiente', nota: 4.4 },
  { tema: 'Desenvolvimento', nota: 3.8 },
  { tema: 'Remuneração', nota: 3.1 },
  { tema: 'Orgulho', nota: 4.5 },
]

export const enps = { promotores: 58, neutros: 27, detratores: 15 }

export const comentariosClima = [
  { tema: 'Reconhecimento', texto: 'Seria bom ter um retorno mais frequente do gestor sobre o trabalho.' },
  { tema: 'Ambiente', texto: 'O time é muito unido, gosto de trabalhar aqui.' },
  { tema: 'Remuneração', texto: 'Os benefícios poderiam ser revistos, principalmente o vale-alimentação.' },
  { tema: 'Comunicação', texto: 'Às vezes ficamos sabendo das mudanças pelos corredores.' },
]

export const salas = ['Sala Ipê (8 lugares)', 'Sala Jatobá (4 lugares)', 'Auditório (40 lugares)']
export const horarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export type Reserva = { sala: string; dia: number; hora: string; quem: string; assunto: string }
export const reservasIniciais: Reserva[] = Array.from({ length: 16 }, () => ({
  sala: pick(r, salas),
  dia: Math.floor(r() * 5),
  hora: pick(r, horarios),
  quem: `${pick(r, nomes)} ${pick(r, sobrenomes)}`.split(' ')[0],
  assunto: pick(r, ['Reunião comercial', 'Entrevista', '1:1', 'Treinamento', 'Alinhamento semanal', 'Visita de fornecedor']),
}))

export const admissoesMes = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'].map((m) => ({ mes: m, admissoes: 2 + Math.floor(r() * 6), desligamentos: Math.floor(r() * 4) }))
