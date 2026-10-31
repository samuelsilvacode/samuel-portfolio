import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Github, MessageCircle, Sparkles } from 'lucide-react'
import { Carregando, CeuEstrelado, Contador, Decodifica, Digitando, Surge } from './site/efeitos'
import { Icone, JanelaAoVivo, Navegacao, Rodape, Vidro } from './site/partes'
import Cracha from './site/Cracha'
import { GITHUB, etapas, numeros, projetos, servicos, tecnologias, type Projeto } from './site/data'
import { tocar } from './site/som'

const BASE = import.meta.env.BASE_URL
const FOTO_CRACHA = `${BASE}samuel-cracha.webp`
const FOTO = `${BASE}samuel-recorte.webp`
const FRASES = ['Desenvolvedor full stack', 'Integrações e automações', 'React + Spring Boot', 'Bots com IA']

// a tela de carregamento só aparece na primeira visita da sessão
let jaCarregou = false

export default function Home() {
  const [pronto, setPronto] = useState(jaCarregou)
  const [params] = useSearchParams()
  const terminou = useCallback(() => {
    jaCarregou = true
    setPronto(true)
  }, [])
  const [imagens] = useState([FOTO_CRACHA, FOTO])

  useEffect(() => {
    const s = params.get('s')
    if (pronto && s) setTimeout(() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [pronto, params])

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent font-display text-[#e6e9f2] selection:bg-blue-500 selection:text-white">
      <CeuEstrelado />
      {!pronto && <Carregando imagens={imagens} aoTerminar={terminou} />}
      <Navegacao />

      <Inicio pronto={pronto} />
      <Sobre />
      <Projetos />
      <Contato />
      <Rodape />
    </div>
  )
}

function Inicio({ pronto }: { pronto: boolean }) {
  return (
    <section id="inicio" className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-4 px-5 pt-20 lg:grid-cols-[1.05fr_1fr] lg:pt-0">
      <div className={`order-2 transition-all duration-1000 lg:order-1 ${pronto ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 font-code text-[11px] text-blue-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          disponível para freelas
        </p>
        <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-[-0.04em] sm:text-[60px] lg:text-[72px]">
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Olá, eu sou</span>
          <br />
          Samuel Silva
        </h1>
        <p className="mt-4 h-7 font-code text-[16px] text-blue-200/90 sm:text-[18px]">
          <Digitando frases={FRASES} />
        </p>
        <p className="mt-6 max-w-[480px] text-[15.5px] leading-relaxed text-white/55">
          Trabalho como desenvolvedor full stack há cerca de um ano, quase sempre com Java, Spring Boot e React. Já fiz portal de vendas, sistema de RH, integração de ERP com loja virtual e WhatsApp, e alguns robôs que geram relatório sozinhos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projetos"
            onClick={(e) => {
              e.preventDefault()
              tocar('clique')
              document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[14px] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.8)] transition hover:bg-blue-500"
          >
            Ver projetos <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault()
              tocar('clique')
              document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 text-[14px] font-medium text-white/85 transition hover:border-white/35"
          >
            Falar comigo <MessageCircle size={15} />
          </a>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <span className="font-code text-[10.5px] font-bold uppercase tracking-[0.25em] text-white/35">me encontre</span>
          <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white">
            <Github size={16} />
          </a>
        </div>
      </div>

      <div className="order-1 h-[440px] sm:h-[520px] lg:order-2 lg:h-[100svh]">
        <Cracha foto={FOTO_CRACHA} ativo={pronto} />
      </div>
    </section>
  )
}

function Titulo({ sobre, texto }: { sobre: string; texto: string }) {
  return (
    <div className="text-center">
      <p className="font-code text-[11px] uppercase tracking-[0.3em] text-blue-400">{sobre}</p>
      <h2 className="mt-3 text-[38px] font-bold tracking-[-0.03em] text-white md:text-[52px]">
        <Decodifica texto={texto} />
      </h2>
    </div>
  )
}

function Sobre() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-5 py-28">
      <Titulo sobre="// sobre" texto="Sobre mim" />

      <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Surge>
          <div className="relative mx-auto aspect-[4/5] max-w-[400px]">
            <div className="absolute inset-x-6 bottom-0 top-16 rounded-[36px] bg-gradient-to-b from-blue-600/40 via-blue-900/30 to-transparent" />
            <div className="absolute left-1/2 top-[22%] h-[62%] w-[82%] -translate-x-1/2 rounded-full bg-blue-500/30 blur-[70px]" />
            <div className="absolute inset-x-6 bottom-0 top-16 rounded-[36px] border border-white/10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <img src={FOTO} alt="Samuel Silva" className="relative z-10 mx-auto h-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
            <span className="absolute left-0 top-[30%] z-20 rounded-lg border border-white/10 bg-[#0a1124]/80 px-3 py-1.5 font-code text-[11px] text-blue-200 backdrop-blur animate-[flutua_5s_ease-in-out_infinite]">
              {'@SpringBootApplication'}
            </span>
            <span className="absolute right-0 top-[52%] z-20 rounded-lg border border-white/10 bg-[#0a1124]/80 px-3 py-1.5 font-code text-[11px] text-sky-200 backdrop-blur animate-[flutua_6s_ease-in-out_infinite_1s]">
              {'<App />'}
            </span>
            <span className="absolute bottom-[14%] left-2 z-20 rounded-lg border border-white/10 bg-[#0a1124]/80 px-3 py-1.5 font-code text-[11px] text-emerald-200 backdrop-blur animate-[flutua_7s_ease-in-out_infinite_0.5s]">
              {'git push origin main'}
            </span>
          </div>
        </Surge>

        <div>
          <Surge>
            <h3 className="text-[30px] font-bold leading-tight tracking-tight md:text-[38px]">
              Full stack, mas o que eu
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">mais faço é integração.</span>
            </h3>
          </Surge>
          <Surge atraso={100}>
            <p className="mt-6 text-[15.5px] leading-relaxed text-white/60">
              No dia a dia uso <b className="font-semibold text-white">Java com Spring Boot</b> no back-end e <b className="font-semibold text-white">React com TypeScript</b> no front. Boa parte do meu trabalho é fazer sistemas diferentes trocarem dados entre si, como ERP, loja virtual, WhatsApp, e-mail e as planilhas que sempre aparecem no meio.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/60">
              Antes de começar, prefiro conversar com quem vai usar o sistema e ver como o trabalho é feito hoje. Isso evita muito retrabalho depois.
            </p>
          </Surge>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {numeros.map((n, i) => (
              <Surge key={n.rotulo} atraso={150 + i * 100}>
                <Vidro className="p-4">
                  <p className="text-[24px] font-bold text-white md:text-[30px]">
                    <Contador valor={n.valor} sufixo={n.sufixo} />
                  </p>
                  <p className="mt-1 font-code text-[10.5px] uppercase leading-snug tracking-wider text-white/40">{n.rotulo}</p>
                </Vidro>
              </Surge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {servicos.map((s, i) => (
          <Surge key={s.titulo} atraso={i * 90}>
            <Vidro className="h-full p-6">
              <span className="font-code text-[11px] text-blue-400">0{i + 1}</span>
              <h4 className="mt-3 text-[18px] font-semibold text-white">{s.titulo}</h4>
              <p className="mt-2 text-[14px] leading-relaxed text-white/50">{s.texto}</p>
            </Vidro>
          </Surge>
        ))}
      </div>
    </section>
  )
}

const ABAS = ['Projetos', 'Tecnologias', 'Como trabalho'] as const

function Projetos() {
  const [aba, setAba] = useState<(typeof ABAS)[number]>('Projetos')
  return (
    <section id="projetos" className="mx-auto max-w-6xl px-5 py-28">
      <Titulo sobre="// projetos" texto="Portfólio" />

      <div className="mx-auto mt-10 flex w-fit flex-wrap justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {ABAS.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAba(a)
              tocar('clique')
            }}
            className={`rounded-xl px-4 py-2 text-[13px] font-medium transition ${aba === a ? 'bg-blue-600 text-white shadow-[0_6px_20px_-6px_rgba(37,99,235,0.9)]' : 'text-white/55 hover:text-white'}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div key={aba} className="mt-12 animate-[entra_0.5s_ease-out]">
        {aba === 'Projetos' && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projetos.map((p, i) => (
              <Surge key={p.slug} atraso={i * 100}>
                <CartaoProjeto p={p} />
              </Surge>
            ))}
          </div>
        )}
        {aba === 'Tecnologias' && (
          <div className="grid gap-5 md:grid-cols-2">
            {tecnologias.map((g) => (
              <Vidro key={g.grupo} className="p-6">
                <p className="font-code text-[11px] uppercase tracking-[0.2em] text-white/40">{g.grupo}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-6">
                  {g.itens.map((t) => (
                    <div key={t.title} className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3 transition hover:-translate-y-0.5 hover:border-white/20">
                      <Icone path={t.path} hex={t.hex} />
                      <span className="text-center text-[11px] leading-tight text-white/60">{t.title === 'OpenJDK' ? 'Java' : t.title}</span>
                    </div>
                  ))}
                </div>
              </Vidro>
            ))}
          </div>
        )}
        {aba === 'Como trabalho' && (
          <div className="grid gap-5 md:grid-cols-3">
            {etapas.map(([t, d], i) => (
              <Vidro key={t} className="p-7">
                <span className="font-display text-[48px] font-extrabold leading-none text-blue-500/30">0{i + 1}</span>
                <h4 className="mt-4 text-[19px] font-semibold text-white">{t}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/55">{d}</p>
              </Vidro>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CartaoProjeto({ p }: { p: Projeto }) {
  return (
    <Vidro className="flex h-full flex-col p-3">
      {p.telas ? (
        <JanelaAoVivo rota={p.telas[0].rota} endereco={p.telas[0].end} />
      ) : (
        <TerminalBot />
      )}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-code text-[10.5px] uppercase tracking-wider text-blue-300/80">{p.tipo}</span>
          {p.status && <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 font-code text-[10px] text-amber-200">{p.status}</span>}
        </div>
        <h3 className="mt-2 text-[19px] font-semibold text-white">{p.nome}</h3>
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-white/50">{p.resumo}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-white/[0.05] px-2 py-0.5 font-code text-[10.5px] text-white/55">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <Link to={`/projeto/${p.slug}`} onClick={() => tocar('clique')} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3.5 text-[12.5px] font-medium text-white/80 transition hover:border-white/30 hover:text-white">
            Detalhes <ArrowRight size={14} />
          </Link>
          {p.demo && (
            <Link to={p.demo} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600/90 px-3.5 text-[12.5px] font-semibold text-white transition hover:bg-blue-500">
              Abrir demo <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </Vidro>
  )
}

export function TerminalBot({ grande = false }: { grande?: boolean }) {
  const linhas = [
    ['$', 'python -m guia rodar --mes atual', 'text-white/80'],
    ['›', 'lendo 47 lançamentos novos...', 'text-white/45'],
    ['›', 'mercado ........ R$ 612,40  (76% do teto)', 'text-white/60'],
    ['›', 'transporte ..... R$ 238,00  (59% do teto)', 'text-white/60'],
    ['!', 'lazer passou do planejado em R$ 84,10', 'text-amber-300'],
    ['✓', 'resumo salvo · próximo envio às 08:00', 'text-emerald-300'],
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
      <div className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="mx-auto font-code text-[10px] text-white/40">vps · guia-financeiro</span>
      </div>
      <div className={`space-y-1.5 p-4 font-code ${grande ? 'text-[13px]' : 'text-[10.5px]'}`} style={{ minHeight: grande ? 260 : 176 }}>
        {linhas.map(([s, t, c], i) => (
          <p key={i} className={`${c} animate-[entra_0.4s_ease-out_both]`} style={{ animationDelay: `${i * 350}ms` }}>
            <span className="mr-2 text-blue-400">{s}</span>
            {t}
          </p>
        ))}
        <p className="text-white/70">
          <span className="mr-2 text-blue-400">$</span>
          <span className="inline-block h-3 w-1.5 animate-pulse bg-white/70 align-middle" />
        </p>
      </div>
    </div>
  )
}

function Contato() {
  return (
    <section id="contato" className="mx-auto max-w-6xl px-5 py-28">
      <Surge>
        <Vidro className="px-6 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[90px]" />
          <Sparkles className="mx-auto text-blue-300" size={22} />
          <h2 className="mx-auto mt-5 max-w-3xl text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-white md:text-[50px]">
            Precisa de algo{' '}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">parecido?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/55">
            Pode ser um sistema novo, uma integração, um bot ou a automação de alguma tarefa repetitiva. Me chama pela plataforma onde você me achou e explica o que precisa, que eu respondo por lá.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-[14px] font-medium text-white/85 transition hover:border-white/35">
              <Github size={16} /> github.com/samuelsilvacode
            </a>
          </div>
        </Vidro>
      </Surge>
    </section>
  )
}
