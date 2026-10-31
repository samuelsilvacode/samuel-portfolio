import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Code2 } from 'lucide-react'
import { CeuEstrelado, Surge } from './efeitos'
import { JanelaAoVivo, Navegacao, Rodape, Vidro } from './partes'
import { projetos } from './data'
import { TerminalBot } from '../Home'

export default function ProjetoPagina() {
  const { slug } = useParams()
  const p = projetos.find((x) => x.slug === slug)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])
  if (!p) return <Navigate to="/" replace />
  const i = projetos.indexOf(p)
  const proximo = projetos[(i + 1) % projetos.length]

  return (
    <div className="min-h-screen overflow-x-hidden font-display text-[#e6e9f2] selection:bg-blue-500 selection:text-white">
      <CeuEstrelado />
      <Navegacao naHome={false} />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28">
        <div className="flex items-center gap-3 text-[13px]">
          <Link to="/?s=projetos" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-white/70 hover:border-white/30 hover:text-white">
            <ArrowLeft size={14} /> Voltar
          </Link>
          <span className="text-white/30">Projetos</span>
          <span className="text-white/30">›</span>
          <span className="text-white/70">{p.nome}</span>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
          <Surge>
            <p className="font-code text-[11px] uppercase tracking-[0.25em] text-blue-400">{p.tipo}</p>
            <h1 className="mt-3 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white md:text-[54px]">{p.nome}</h1>
            {p.texto.map((t) => (
              <p key={t} className="mt-5 text-[15.5px] leading-relaxed text-white/60">
                {t}
              </p>
            ))}
            <h2 className="mt-9 flex items-center gap-2 text-[15px] font-semibold text-white">
              <Code2 size={16} className="text-blue-400" /> Tecnologias
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-code text-[12px] text-white/75">
                  {s}
                </span>
              ))}
            </div>
            {p.demo && (
              <Link to={p.demo} className="mt-9 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[14px] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.8)] hover:bg-blue-500">
                Abrir a demo ao vivo <ArrowUpRight size={16} />
              </Link>
            )}
          </Surge>

          <Surge atraso={120} className="space-y-4">
            {p.telas ? p.telas.map((t) => <JanelaAoVivo key={t.rota} rota={t.rota} endereco={t.end} />) : <TerminalBot grande />}
          </Surge>
        </div>

        <Surge>
          <Vidro className="mt-14 p-7">
            <h2 className="text-[18px] font-semibold text-white">O que tem no sistema</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.pontos.map((x) => (
                <li key={x} className="flex gap-3 text-[14.5px] text-white/65">
                  <Check size={17} className="mt-0.5 shrink-0 text-blue-400" />
                  {x}
                </li>
              ))}
            </ul>
          </Vidro>
        </Surge>

        <Link to={`/projeto/${proximo.slug}`} className="group mt-8 flex items-center justify-between rounded-2xl border border-white/10 px-6 py-5 transition hover:border-blue-400/30">
          <span className="font-code text-[11px] uppercase tracking-[0.2em] text-white/40">próximo projeto</span>
          <span className="text-[17px] font-semibold text-white">
            {proximo.nome} <span className="inline-block transition group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </main>
      <Rodape />
    </div>
  )
}
