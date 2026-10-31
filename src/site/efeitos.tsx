import { useEffect, useRef, useState, type ReactNode } from 'react'

// Céu estrelado em canvas: estrelas que piscam, leve paralaxe com o mouse e uma estrela cadente de vez em quando
export function CeuEstrelado() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, dpr = 1, raf = 0
    let estrelas: { x: number; y: number; z: number; f: number }[] = []
    const cadentes: { x: number; y: number; vx: number; vy: number; vida: number }[] = []
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    const montar = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round((w * h) / 4200)
      estrelas = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() ** 2, f: Math.random() * Math.PI * 2 }))
    }
    const mover = (e: PointerEvent) => {
      mouse.tx = (e.clientX / w - 0.5) * 2
      mouse.ty = (e.clientY / h - 0.5) * 2
    }

    const quadro = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04
      ctx.clearRect(0, 0, w, h)
      for (const s of estrelas) {
        const px = s.x - mouse.x * 18 * s.z
        const py = s.y - mouse.y * 18 * s.z - (window.scrollY * 0.04 * s.z) % h
        const y = ((py % h) + h) % h
        const brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 900 + s.f)) * (0.3 + s.z * 0.7)
        ctx.fillStyle = `rgba(200,215,255,${brilho})`
        const r = 0.4 + s.z * 1.1
        ctx.fillRect(px, y, r, r)
      }
      if (!reduzir && Math.random() < 0.006 && cadentes.length < 2) {
        cadentes.push({ x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, vx: -(6 + Math.random() * 4), vy: 3 + Math.random() * 2, vida: 1 })
      }
      for (let i = cadentes.length - 1; i >= 0; i--) {
        const c = cadentes[i]
        c.x += c.vx
        c.y += c.vy
        c.vida -= 0.012
        const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 14, c.y - c.vy * 14)
        g.addColorStop(0, `rgba(190,220,255,${c.vida})`)
        g.addColorStop(1, 'rgba(190,220,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(c.x, c.y)
        ctx.lineTo(c.x - c.vx * 14, c.y - c.vy * 14)
        ctx.stroke()
        if (c.vida <= 0) cadentes.splice(i, 1)
      }
      raf = requestAnimationFrame(quadro)
    }
    montar()
    raf = requestAnimationFrame(quadro)
    window.addEventListener('resize', montar)
    window.addEventListener('pointermove', mover)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', montar)
      window.removeEventListener('pointermove', mover)
    }
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#04060d]">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_20%,rgba(37,99,235,0.22),transparent_70%),radial-gradient(50%_40%_at_10%_90%,rgba(14,165,233,0.12),transparent_70%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

// Tela de carregamento com porcentagem; espera as imagens e as fontes
export function Carregando({ imagens, aoTerminar }: { imagens: string[]; aoTerminar: () => void }) {
  const [pct, setPct] = useState(0)
  const [saindo, setSaindo] = useState(false)
  useEffect(() => {
    let real = 0
    let mostrado = 0
    let raf = 0
    const total = imagens.length + 1
    const um = () => (real += 1 / total)
    imagens.forEach((src) => {
      const i = new Image()
      i.onload = i.onerror = um
      i.src = src
    })
    document.fonts.ready.then(um)
    const inicio = performance.now()
    const passo = (t: number) => {
      // nunca passa da carga real e leva no mínimo ~1,4 s pra animação não piscar
      // anda pelo relógio (não por quadro), limitado pela carga real; depois de 6 s segue mesmo se algo travar
      const p = Math.min(1, (t - inicio) / 1600)
      mostrado = t - inicio > 6000 ? 1 : Math.min(real > 0.99 ? 1 : real, 1 - (1 - p) ** 2)
      const v = Math.round(mostrado * 100)
      setPct(v)
      if (v >= 100) {
        setSaindo(true)
        setTimeout(aoTerminar, 650)
        return
      }
      raf = requestAnimationFrame(passo)
    }
    raf = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(raf)
  }, [imagens, aoTerminar])
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#04060d] transition-all duration-700 ${saindo ? 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]' : 'opacity-100 [clip-path:inset(0_0_0_0)]'}`}>
      <div className="flex items-start font-display font-bold tabular-nums text-white">
        <span className="text-[88px] leading-none tracking-tighter md:text-[120px]">{pct}</span>
        <span className="mt-3 text-3xl text-blue-500">%</span>
      </div>
      <div className="mt-6 h-px w-56 bg-white/10">
        <div className="h-px bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 font-code text-[11px] uppercase tracking-[0.3em] text-white/40">compilando o portfólio</p>
    </div>
  )
}

const SIMBOLOS = '!<>-_\\/[]{}=+*^?#01'

// Texto que "decodifica" letra por letra quando aparece na tela
export function Decodifica({ texto, className = '' }: { texto: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [saida, setSaida] = useState(texto)
  useEffect(() => {
    const el = ref.current!
    let raf = 0
    const rodar = () => {
      const inicio = performance.now()
      const dur = 900
      const passo = (t: number) => {
        const p = Math.min(1, (t - inicio) / dur)
        const fixas = Math.floor(p * texto.length)
        setSaida(
          texto
            .split('')
            .map((c, i) => (i < fixas || c === ' ' ? c : SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)]))
            .join(''),
        )
        if (p < 1) raf = requestAnimationFrame(passo)
      }
      raf = requestAnimationFrame(passo)
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        rodar()
        io.disconnect()
      }
    }, { threshold: 0.6 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [texto])
  return (
    <span ref={ref} aria-label={texto} className={className}>
      <span aria-hidden>{saida}</span>
    </span>
  )
}

// Aparece subindo quando entra na tela
export function Surge({ children, atraso = 0, className = '' }: { children: ReactNode; atraso?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisivel(true)
        io.disconnect()
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${atraso}ms` }}
      className={`transition-all duration-700 ease-out ${visivel ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-8 opacity-0 blur-[2px]'} ${className}`}
    >
      {children}
    </div>
  )
}

// Digita e apaga uma lista de frases
export function Digitando({ frases }: { frases: string[] }) {
  const [txt, setTxt] = useState('')
  useEffect(() => {
    let i = 0, n = 0, apagando = false, t = 0
    const tick = () => {
      const f = frases[i]
      n += apagando ? -1 : 1
      setTxt(f.slice(0, n))
      let espera = apagando ? 35 : 70
      if (!apagando && n === f.length) {
        apagando = true
        espera = 1800
      } else if (apagando && n === 0) {
        apagando = false
        i = (i + 1) % frases.length
        espera = 400
      }
      t = window.setTimeout(tick, espera)
    }
    t = window.setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [frases])
  return (
    <span>
      {txt}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-blue-400 align-middle" style={{ height: '1em' }} />
    </span>
  )
}

// Conta até o número quando aparece
export function Contador({ valor, sufixo = '' }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const inicio = performance.now()
      const passo = (t: number) => {
        const p = Math.min(1, (t - inicio) / 1600)
        setV(Math.round(valor * (1 - (1 - p) ** 3)))
        if (p < 1) raf = requestAnimationFrame(passo)
      }
      raf = requestAnimationFrame(passo)
    }, { threshold: 0.5 })
    io.observe(ref.current!)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [valor])
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString('pt-BR')}
      {sufixo}
    </span>
  )
}
