import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// Mostra uma rota da própria demo rodando, reduzida, dentro de uma janela de navegador
function JanelaAoVivo({ rota, endereco, className = '' }: { rota: string; endereco: string; className?: string }) {
  const caixa = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0.4)
  const LARGURA = 1440
  const ALTURA = 900
  useEffect(() => {
    const el = caixa.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setEscala(e.contentRect.width / LARGURA))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={`overflow-hidden rounded-lg border border-white/10 bg-[#1c1a17] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto truncate rounded bg-white/5 px-3 py-0.5 font-mono text-[10px] text-white/40">{endereco}</span>
      </div>
      <div ref={caixa} className="relative w-full overflow-hidden bg-white" style={{ height: ALTURA * escala }}>
        <iframe
          src={`${import.meta.env.BASE_URL}#${rota}`}
          title={endereco}
          loading="lazy"
          tabIndex={-1}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: LARGURA, height: ALTURA, transform: `scale(${escala})` }}
        />
      </div>
    </div>
  )
}

const projetos = [
  {
    n: '01',
    to: '/crm',
    nome: 'Portal de vendas e CRM',
    linha: 'O sistema que o time comercial abre de manhã e fecha no fim do dia.',
    texto:
      'Antes era planilha e consulta direto no ERP. Agora o vendedor abre a ficha do cliente e vê pedidos, ligações, reclamações e oportunidades num lugar só, e a coordenação acompanha meta e pipeline em tempo real.',
    pontos: ['Painel do mês com meta x realizado e ranking', 'Pipeline em kanban com arrastar e soltar', 'Ficha 360° com linha do tempo e resumo do histórico', 'Pedidos com filtros e exportação para Excel'],
    stack: ['React', 'TypeScript', 'Spring Boot', 'SQL Server', 'ERP Sankhya', 'WhatsApp'],
    telas: [
      { rota: '/crm', end: 'vertice.app/painel' },
      { rota: '/crm/pipeline', end: 'vertice.app/pipeline' },
    ],
  },
  {
    n: '02',
    to: '/rh',
    nome: 'Central de RH',
    linha: 'Tudo que o RH fazia por e-mail e planilha, num portal só.',
    texto:
      'Feito para um grupo com mais de uma empresa: cadastro de pessoas, processo seletivo, avaliação de experiência com alerta de prazo, treinamentos e PDI, pesquisa de clima e até a agenda das salas de reunião.',
    pontos: ['Avaliação de experiência com contagem de dias', 'Processo seletivo por vaga em kanban', 'Pesquisa de clima com eNPS', 'Reserva de salas com clique'],
    stack: ['React', 'TypeScript', 'Next.js', 'Spring Boot', 'PostgreSQL'],
    telas: [
      { rota: '/rh', end: 'horizonte.app/inicio' },
      { rota: '/rh/vagas', end: 'horizonte.app/vagas' },
    ],
  },
]

const etapas = [
  ['Entendo o problema', 'Antes de escrever código, converso com quem vai usar e mapeio o processo de hoje: planilhas, sistemas, quem aprova o quê.'],
  ['Mostro antes de construir', 'Protótipo das telas ou desenho do fluxo da integração. Você aprova o caminho antes de pagar por ele.'],
  ['Entrego por etapas', 'Cada fase tem escopo, prazo e valor fechados. Você usa o sistema de verdade desde a primeira entrega.'],
]

const stack = [
  ['Back-end', 'Java · Spring Boot · Node.js · Python'],
  ['Front-end', 'React · TypeScript · Next.js · Tailwind'],
  ['Dados', 'SQL Server · PostgreSQL · Excel/PDF · scraping'],
  ['Integrações', 'ERP · e-commerce · gateways · WhatsApp · Outlook · IA'],
  ['Infra', 'Linux · Docker · rotinas agendadas · backup'],
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#12110f] text-[#ece8e1] selection:bg-amber-400 selection:text-black">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-mono text-[13px] tracking-tight">samuel silva</span>
        <nav className="flex gap-6 text-[13px] text-white/60">
          <a href="#projetos" className="hover:text-white">
            projetos
          </a>
          <a href="#como" className="hidden hover:text-white sm:inline">
            como trabalho
          </a>
          <a href="#contato" className="hover:text-white">
            contato
          </a>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_1.1fr] lg:pt-16">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-amber-400">Desenvolvedor full stack</p>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
            Sistemas que o time
            <br />
            usa <span className="text-amber-400">de verdade.</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/60">
            Há um ano e meio eu tiro empresas das planilhas: portal de vendas, CRM, RH, integração de ERP com loja virtual e WhatsApp, automações e relatórios que antes alguém montava na mão.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projetos" className="inline-flex h-11 items-center bg-amber-400 px-5 text-[14px] font-semibold text-black hover:bg-amber-300">
              Ver projetos
            </a>
            <Link to="/crm" className="inline-flex h-11 items-center gap-1.5 border border-white/20 px-5 text-[14px] font-medium hover:border-white/50">
              Abrir uma demo <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="relative md:pb-10">
          <JanelaAoVivo rota="/crm" endereco="vertice.app/painel" />
          <JanelaAoVivo rota="/rh" endereco="horizonte.app/inicio" className="absolute -bottom-0 -left-6 hidden w-[52%] md:block" />
        </div>
      </section>

      <div className="border-y border-white/10 bg-[#171613]">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-10 gap-y-2 px-5 py-4 font-mono text-[12px] text-white/50">
          {['Java', 'Spring Boot', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL Server', 'PostgreSQL', 'Docker', 'Linux'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <section id="projetos" className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/40">Projetos</h2>
        <div className="mt-10 space-y-28">
          {projetos.map((p, i) => (
            <article key={p.to} className={`grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="lg:sticky lg:top-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[13px]" style={{ color: i ? '#f4a3a8' : '#5fb3c2' }}>
                    {p.n}
                  </span>
                  <h3 className="text-[28px] font-semibold tracking-tight">{p.nome}</h3>
                </div>
                <p className="mt-3 text-[17px] text-white/80">{p.linha}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-white/55">{p.texto}</p>
                <ul className="mt-6 space-y-2 border-l border-white/15 pl-4 text-[14px] text-white/70">
                  {p.pontos.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="border border-white/15 px-2 py-0.5 font-mono text-[11px] text-white/60">
                      {s}
                    </span>
                  ))}
                </div>
                <Link to={p.to} className="mt-8 inline-flex h-10 items-center gap-1.5 bg-white px-4 text-[14px] font-semibold text-black hover:bg-amber-300">
                  Testar a demo <ArrowUpRight size={16} />
                </Link>
                <p className="mt-3 text-[12px] text-white/35">Empresa e dados fictícios. Pode clicar em tudo.</p>
              </div>
              <div className="space-y-5">
                {p.telas.map((t) => (
                  <Link key={t.rota} to={t.rota} className="block transition hover:-translate-y-1">
                    <JanelaAoVivo rota={t.rota} endereco={t.end} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como" className="border-t border-white/10 bg-[#171613]">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/40">Como eu trabalho</h2>
          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
            {etapas.map(([t, d], i) => (
              <div key={t} className="bg-[#171613] p-6 md:p-8">
                <div className="font-mono text-[40px] font-medium text-amber-400/90">{i + 1}</div>
                <div className="mt-4 text-[18px] font-semibold">{t}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/55">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <p className="text-[22px] font-medium leading-snug tracking-tight">
              Integração boa é a que ninguém percebe. <span className="text-white/45">Por isso eu cuido do que costuma dar errado: falha de comunicação, registro duplicado e falta de log.</span>
            </p>
            <dl className="divide-y divide-white/10 border-y border-white/10">
              {stack.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3 text-[14px]">
                  <dt className="text-white/40">{k}</dt>
                  <dd className="font-mono text-[13px] text-white/80">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="contato" className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="max-w-3xl text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]">
          Tem uma planilha que virou sistema na marra? <span className="text-amber-400">Vamos conversar.</span>
        </h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/55">
          Sistema sob medida, integração entre sistemas, bot de WhatsApp ou Telegram, automação de rotina. Me chama pela plataforma onde você me encontrou e me conta o problema.
        </p>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl justify-between px-5 py-6 font-mono text-[12px] text-white/35">
          <span>samuel silva</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
