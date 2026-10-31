import {
  siDocker,
  siGit,
  siJavascript,
  siLinux,
  siNextdotjs,
  siNodedotjs,
  siOpenai,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siTailwindcss,
  siTelegram,
  siTypescript,
  siVite,
  siWhatsapp,
  siApachemaven,
  siKotlin,
  siSqlite,
} from 'simple-icons'

export type Projeto = {
  slug: string
  nome: string
  tipo: string
  resumo: string
  texto: string[]
  pontos: string[]
  stack: string[]
  demo?: string
  telas?: { rota: string; end: string }[]
  status?: string
}

export const projetos: Projeto[] = [
  {
    slug: 'crm',
    nome: 'Portal de vendas e CRM',
    tipo: 'Sistema web',
    resumo: 'O sistema que o time comercial abre de manhã e fecha no fim do dia: carteira, pipeline, pedidos e metas num lugar só.',
    texto: [
      'Antes era planilha e consulta direto no ERP. Agora o vendedor abre a ficha do cliente e vê pedidos, ligações, reclamações e oportunidades num lugar só, e a coordenação acompanha meta e pipeline em tempo real.',
      'O sistema original roda em produção há mais de um ano, com cerca de 2.000 commits. Esta é uma versão de demonstração com empresa e dados fictícios, montada para mostrar as telas principais.',
    ],
    pontos: ['Painel do mês com meta x realizado e ranking', 'Pipeline em kanban com arrastar e soltar', 'Ficha 360° com linha do tempo do cliente', 'Pedidos com filtros e exportação para Excel'],
    stack: ['React', 'TypeScript', 'Spring Boot', 'SQL Server', 'ERP', 'WhatsApp'],
    demo: '/crm',
    telas: [
      { rota: '/crm', end: 'vertice.app/painel' },
      { rota: '/crm/pipeline', end: 'vertice.app/pipeline' },
    ],
  },
  {
    slug: 'rh',
    nome: 'Central de RH',
    tipo: 'Sistema web',
    resumo: 'Tudo que o RH fazia por e-mail e planilha virou um portal: pessoas, vagas, treinamentos, clima e salas.',
    texto: [
      'Feito para um grupo com mais de uma empresa: cadastro de pessoas, processo seletivo, avaliação de experiência com alerta de prazo, treinamentos e PDI, pesquisa de clima e a agenda das salas de reunião.',
      'Também é uma versão de demonstração, com dados fictícios, das telas que mais usam no dia a dia.',
    ],
    pontos: ['Avaliação de experiência com contagem de dias', 'Processo seletivo por vaga em kanban', 'Pesquisa de clima com eNPS', 'Reserva de salas com um clique'],
    stack: ['React', 'TypeScript', 'Next.js', 'Spring Boot', 'PostgreSQL'],
    demo: '/rh',
    telas: [
      { rota: '/rh', end: 'horizonte.app/inicio' },
      { rota: '/rh/vagas', end: 'horizonte.app/vagas' },
    ],
  },
  {
    slug: 'guia-financeiro',
    nome: 'Robô financeiro pessoal',
    tipo: 'Bot e automação',
    resumo: 'Um robô que organiza minhas finanças sozinho: lê lançamentos, separa por categoria e avisa quando o mês sai do planejado.',
    texto: [
      'Projeto pessoal que roda num servidor Linux na nuvem, com rotinas agendadas e banco SQLite versionado com migrations.',
      'Está em desenvolvimento: a próxima etapa é conversar com ele pelo Telegram.',
    ],
    pontos: ['Rotinas agendadas em VPS Linux', 'Banco com migrations (Alembic)', 'Orçamento por categoria com alertas', 'Integração com Telegram (em andamento)'],
    stack: ['Python', 'SQLite', 'Linux', 'Telegram'],
    status: 'em andamento',
  },
]

export const servicos = [
  { titulo: 'Integrações', texto: 'ERP com loja virtual, gateway de pagamento, WhatsApp, e-mail, planilha virando dado no sistema.' },
  { titulo: 'Sistemas sob medida', texto: 'Painéis, CRM, portais internos. Do protótipo das telas até o servidor no ar.' },
  { titulo: 'Bots e IA', texto: 'Atendimento no WhatsApp ou Telegram, transcrição de ligações, resumo e extração de dados com IA.' },
  { titulo: 'Automação e dados', texto: 'Coleta de dados públicos, relatórios em Excel e PDF que antes alguém montava na mão.' },
]

export const numeros = [
  { valor: 2000, sufixo: '+', rotulo: 'commits no CRM' },
  { valor: 10, sufixo: '+', rotulo: 'integrações entregues' },
  { valor: 18, sufixo: ' meses', rotulo: 'em produção' },
]

type Icone = { title: string; path: string; hex: string }
const claro = (i: Icone) => ({ ...i, hex: 'E5E7EB' })

export const tecnologias: { grupo: string; itens: Icone[] }[] = [
  { grupo: 'Back-end', itens: [claro(siOpenjdk), siSpringboot, siApachemaven, siNodedotjs, siPython, siKotlin] },
  { grupo: 'Front-end', itens: [siReact, siTypescript, siJavascript, claro(siNextdotjs), siTailwindcss, siVite] },
  { grupo: 'Dados e infra', itens: [siPostgresql, siSqlite, siDocker, siLinux, siGit] },
  { grupo: 'Integrações', itens: [siWhatsapp, siTelegram, claro(siOpenai)] },
]

export const etapas = [
  ['Entendo o problema', 'Antes de escrever código, converso com quem vai usar e mapeio o processo de hoje: planilhas, sistemas, quem aprova o quê.'],
  ['Mostro antes de construir', 'Protótipo das telas ou desenho do fluxo da integração. Você aprova o caminho antes de pagar por ele.'],
  ['Entrego por etapas', 'Cada fase tem escopo, prazo e valor fechados. Você usa o sistema de verdade desde a primeira entrega.'],
]

export const GITHUB = 'https://github.com/samuelsilvacode'
