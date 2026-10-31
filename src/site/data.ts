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
    resumo: 'Portal usado pelo time comercial pra cuidar da carteira de clientes, do pipeline, dos pedidos e da meta do mês.',
    texto: [
      'Antes o vendedor consultava o ERP e mantinha as próprias planilhas. No portal ele abre a ficha do cliente e encontra pedidos, ligações, reclamações e oportunidades juntos, e a coordenação acompanha a meta sem precisar pedir relatório pra ninguém.',
      'O sistema original está em produção há mais de um ano e tem perto de 2.000 commits. Como o código não é meu pra mostrar, montei esta versão de demonstração com empresa e dados inventados.',
    ],
    pontos: [
      'Painel com meta do mês, funil de vendas e atividade do time ao vivo',
      'Pipeline em kanban com arrastar e soltar e valor ponderado por etapa',
      'Ficha do cliente com histórico, nota de saúde e resumo feito por IA',
      'Pedidos com detalhe dos itens, filtros e exportação para Excel',
      'Busca rápida com Ctrl K de qualquer tela',
      'Modo claro e escuro',
    ],
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
    resumo: 'Portal de RH com cadastro de pessoas, vagas, treinamentos, pesquisa de clima e reserva de salas.',
    texto: [
      'Foi feito pra um grupo com mais de uma empresa, onde o RH controlava quase tudo por e-mail e planilha. Hoje o cadastro das pessoas, o processo seletivo, o prazo das avaliações de experiência, os treinamentos, a pesquisa de clima e a agenda das salas ficam no mesmo sistema.',
      'Assim como o CRM, é uma versão de demonstração com dados inventados.',
    ],
    pontos: [
      'Avaliação de experiência com prazo de 45 e 90 dias e pedido ao gestor',
      'Processo seletivo por vaga em kanban, com nota e etapas do candidato',
      'Perfil do colaborador com PDI e histórico',
      'Treinamentos com andamento e lembrete pros pendentes',
      'Pesquisa de clima com eNPS e comparação com o ano anterior',
      'Agenda das salas com reserva em um clique, modo claro e escuro',
    ],
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
    resumo: 'Robô que fiz pra organizar meu próprio dinheiro. Ele lê os lançamentos, separa por categoria e me avisa quando algum gasto passa do que eu planejei.',
    texto: [
      'Roda num servidor Linux na nuvem, com tarefas agendadas e um banco SQLite.',
      'Ainda estou mexendo nele. O próximo passo é conseguir conversar com ele pelo Telegram.',
    ],
    pontos: ['Rotinas agendadas em VPS Linux', 'Banco com migrations (Alembic)', 'Orçamento por categoria com alertas', 'Integração com Telegram (em andamento)'],
    stack: ['Python', 'SQLite', 'Linux', 'Telegram'],
    status: 'em andamento',
  },
]

export const servicos = [
  { titulo: 'Integrações', texto: 'Ligar ERP com loja virtual, gateway de pagamento, WhatsApp ou e-mail. Também faço importação de planilha pra dentro do sistema.' },
  { titulo: 'Sistemas sob medida', texto: 'Painel, CRM ou portal interno, desde o desenho das telas até deixar rodando no servidor.' },
  { titulo: 'Bots e IA', texto: 'Bot de atendimento no WhatsApp ou Telegram, transcrição de ligação e leitura de documentos com IA.' },
  { titulo: 'Automação e dados', texto: 'Coleta de dados de sites públicos e relatório em Excel ou PDF gerado automaticamente.' },
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
  ['Conversa primeiro', 'Quero entender como o trabalho é feito hoje, quais planilhas e sistemas entram nisso e quem aprova cada etapa.'],
  ['Desenho antes do código', 'Te mostro as telas ou o fluxo da integração e só começo a programar depois que você aprovar.'],
  ['Entrega em partes', 'Divido o projeto em fases com prazo e valor combinados. Você já usa a primeira parte enquanto eu faço a próxima.'],
]

export const GITHUB = 'https://github.com/samuelsilvacode'
