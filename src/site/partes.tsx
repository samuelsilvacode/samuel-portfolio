import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Volume2, VolumeX } from 'lucide-react'
import { alternarSom, somLigado, tocar } from './som'

// Mostra uma rota da própria demo rodando, reduzida, dentro de uma janela de navegador
export function JanelaAoVivo({ rota, endereco, className = '' }: { rota: string; endereco: string; className?: string }) {
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
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#0b1020] ${className}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="mx-auto truncate rounded bg-white/5 px-3 py-0.5 font-code text-[10px] text-white/40">{endereco}</span>
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

// Cartão de vidro com um brilho que segue o mouse
export function Vidro({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`)
        ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors hover:border-blue-400/30 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(380px_circle_at_var(--mx)_var(--my),rgba(59,130,246,0.14),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  )
}

const LINKS = [
  ['inicio', 'Início'],
  ['sobre', 'Sobre'],
  ['projetos', 'Projetos'],
  ['contato', 'Contato'],
]

// Barra de navegação em pílula; marca a seção que está na tela
export function Navegacao({ naHome = true }: { naHome?: boolean }) {
  const [atual, setAtual] = useState('inicio')
  const [som, setSom] = useState(somLigado())
  useEffect(() => {
    if (!naHome) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAtual(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [naHome])
  return (
    <nav className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#070b18]/70 p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {LINKS.map(([id, nome]) =>
        naHome ? (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault()
              tocar('clique')
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
            }}
            onMouseEnter={() => tocar('hover')}
            className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors sm:px-4 ${atual === id ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white'}`}
          >
            {nome}
          </a>
        ) : (
          <Link key={id} to={id === 'inicio' ? '/' : `/?s=${id}`} className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white/55 hover:text-white sm:px-4">
            {nome}
          </Link>
        ),
      )}
      <span className="mx-1 h-4 w-px bg-white/10" />
      <button
        onClick={() => setSom(alternarSom())}
        aria-label={som ? 'Desligar sons' : 'Ligar sons'}
        title={som ? 'Desligar sons' : 'Ligar sons'}
        className="grid h-8 w-8 place-items-center rounded-full text-white/55 hover:bg-white/10 hover:text-white"
      >
        {som ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>
    </nav>
  )
}

export function Rodape() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-7 font-code text-[11.5px] text-white/35">
        <span>
          <span className="text-blue-400">ss</span> · samuel silva
        </span>
        <span>feito com React, TypeScript e física caseira · {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}

export function Icone({ path, hex, tam = 22 }: { path: string; hex: string; tam?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={tam} height={tam} fill={`#${hex}`} aria-hidden>
      <path d={path} />
    </svg>
  )
}
