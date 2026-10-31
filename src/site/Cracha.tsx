import { useEffect, useRef } from 'react'
import { tocar } from './som'

type P = { x: number; y: number; px: number; py: number }

const ELOS = 14
const GRAVIDADE = 0.55
const ATRITO = 0.975

// Crachá pendurado num cordão. O cordão é uma corda simulada (Verlet); o cartão é um segmento rígido
// com duas pontas (topo e base), então balança e gira sozinho. Dá pra agarrar e arremessar.
export default function Cracha({ foto, ativo }: { foto: string; ativo: boolean }) {
  const caixa = useRef<HTMLDivElement>(null)
  const cartao = useRef<HTMLDivElement>(null)
  const corda = useRef<SVGPathElement>(null)
  const cordaTexto = useRef<SVGPathElement>(null)
  const dica = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ativo) return
    const el = caixa.current!
    let W = el.clientWidth
    let H = el.clientHeight
    const tam = () => {
      const cw = Math.min(250, W * 0.62)
      return { cw, ch: cw * 1.42, elo: (H * 0.36) / ELOS }
    }
    let { cw, ch, elo } = tam()
    const ancora = () => ({ x: W * 0.5, y: -8 })

    // começa esticado para a direita, assim ele cai balançando quando a página abre
    const a0 = ancora()
    const pts: P[] = []
    for (let i = 0; i <= ELOS; i++) {
      const x = a0.x + i * elo * 0.9
      const y = a0.y + i * elo * 0.35
      pts.push({ x, y, px: x, py: y })
    }
    const topo = pts[ELOS]
    const base: P = { x: topo.x + ch * 0.7, y: topo.y + ch * 0.7, px: topo.x + ch * 0.7, py: topo.y + ch * 0.7 }

    let giro = 0 // rotação em Y (graus)
    let giroV = 0
    const pega = { ativa: false, x: 0, y: 0, t: 0.3 }
    let raf = 0
    let ultimoSom = 0

    const passo = () => {
      // integra
      const todos = [...pts.slice(1), base]
      for (const p of todos) {
        // limita a velocidade pra um arremesso forte não jogar o crachá pra fora da tela
        const vx = Math.max(-28, Math.min(28, (p.x - p.px) * ATRITO))
        const vy = Math.max(-28, Math.min(28, (p.y - p.py) * ATRITO))
        p.px = p.x
        p.py = p.y
        p.x += vx
        p.y += vy + GRAVIDADE * (p === base ? 1.6 : 1)
      }
      // a mão puxa o ponto agarrado do cartão (entre topo e base), dividindo o puxão entre as pontas
      if (pega.ativa) {
        const gx = topo.x + (base.x - topo.x) * pega.t
        const gy = topo.y + (base.y - topo.y) * pega.t
        const dx = (pega.x - gx) * 0.5
        const dy = (pega.y - gy) * 0.5
        topo.x += dx * (1 - pega.t) * 2
        topo.y += dy * (1 - pega.t) * 2
        base.x += dx * pega.t * 2
        base.y += dy * pega.t * 2
      }
      const a = ancora()
      for (let k = 0; k < 14; k++) {
        pts[0].x = a.x
        pts[0].y = a.y
        for (let i = 0; i < ELOS; i++) restringe(pts[i], pts[i + 1], elo, i === 0 ? 0 : 0.5)
        restringe(topo, base, ch, 0.6)
      }
      pts[0].x = pts[0].px = a.x
      pts[0].y = pts[0].py = a.y

      // inclinação 3D leve vinda do movimento lateral; volta logo de frente pra foto ficar sempre visível
      const vx = ((topo.x - topo.px) + (base.x - base.px)) / 2
      giroV += vx * 0.06
      giroV += -giro * 0.03
      giroV *= 0.86
      giro = Math.max(-35, Math.min(35, giro + giroV))

      const vel = Math.hypot(base.x - base.px, base.y - base.py)
      if (!pega.ativa && vel > 9 && performance.now() - ultimoSom > 500) {
        ultimoSom = performance.now()
        tocar('hover')
      }
      desenha()
      raf = requestAnimationFrame(passo)
    }

    const desenha = () => {
      const ang = Math.atan2(base.y - topo.y, base.x - topo.x) - Math.PI / 2
      cartao.current!.style.transform = `translate3d(${topo.x - cw / 2}px, ${topo.y}px, 0) rotate(${ang}rad) rotateY(${giro}deg)`
      cartao.current!.style.width = `${cw}px`
      cartao.current!.style.height = `${ch}px`
      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2
        const my = (pts[i].y + pts[i + 1].y) / 2
        d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`
      }
      d += ` L ${topo.x} ${topo.y}`
      corda.current!.setAttribute('d', d)
      cordaTexto.current!.setAttribute('d', d)
    }

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const abaixa = (e: PointerEvent) => {
      const m = local(e)
      // posição relativa ao longo do cartão (0 = topo, 1 = base)
      const ax = base.x - topo.x
      const ay = base.y - topo.y
      const t = ((m.x - topo.x) * ax + (m.y - topo.y) * ay) / (ax * ax + ay * ay)
      pega.t = Math.max(0.05, Math.min(0.95, t))
      pega.x = m.x
      pega.y = m.y
      pega.ativa = true
      cartao.current!.setPointerCapture(e.pointerId)
      cartao.current!.style.cursor = 'grabbing'
      if (dica.current) dica.current.style.opacity = '0'
      tocar('clique')
    }
    const move = (e: PointerEvent) => {
      if (!pega.ativa) return
      const m = local(e)
      pega.x = m.x
      pega.y = m.y
    }
    const solta = () => {
      if (!pega.ativa) return
      pega.ativa = false
      cartao.current!.style.cursor = 'grab'
      tocar('solta')
    }
    const c = cartao.current!
    c.addEventListener('pointerdown', abaixa)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', solta)
    c.addEventListener('pointercancel', solta)

    const ro = new ResizeObserver(() => {
      W = el.clientWidth
      H = el.clientHeight
      ;({ cw, ch, elo } = tam())
    })
    ro.observe(el)

    // só simula quando o crachá está na tela
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(passo)
    })
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      c.removeEventListener('pointerdown', abaixa)
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerup', solta)
      c.removeEventListener('pointercancel', solta)
    }
  }, [ativo])

  return (
    <div ref={caixa} className="relative h-full w-full select-none [perspective:1200px]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="fita" x1="0" x2="1">
            <stop offset="0" stopColor="#1e3a8a" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path ref={corda} fill="none" stroke="url(#fita)" strokeWidth="16" strokeLinecap="round" />
        <path ref={cordaTexto} id="caminho-fita" fill="none" stroke="none" />
        <text className="fill-white/80 font-code" fontSize="8.5" fontWeight="700" letterSpacing="2" dy="3">
          <textPath href="#caminho-fita">SAMUEL SILVA • FULL STACK • SAMUEL SILVA • FULL STACK • SAMUEL SILVA •</textPath>
        </text>
      </svg>

      <div
        ref={cartao}
        className="absolute left-0 top-0 cursor-grab touch-none [transform-origin:50%_0] [transform-style:preserve-3d] will-change-transform"
        style={{ width: 250, height: 355 }}
      >
        {/* presilha */}
        <div className="absolute -top-5 left-1/2 h-7 w-5 -translate-x-1/2 rounded-sm border-2 border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-500 shadow" style={{ transform: 'translateX(-50%) translateZ(1px)' }} />

        {/* frente */}
        <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-white/15 bg-[#0a0f1f] shadow-[0_30px_80px_-10px_rgba(37,99,235,0.45)] [backface-visibility:hidden]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:18px_18px]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-4">
              <span className="font-code text-[9px] font-bold tracking-[0.25em] text-blue-300">DEV · PASS</span>
              <span className="mx-auto mt-0.5 h-1.5 w-10 rounded-full bg-black/60 ring-1 ring-white/10" />
              <span className="font-code text-[9px] text-white/40">2026</span>
            </div>
            <div className="relative mx-4 mt-3 flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-blue-600 via-blue-800 to-[#0b1330]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(125,211,252,0.45),transparent_60%)]" />
              <span className="absolute left-2 top-1 font-display text-[44px] font-extrabold leading-none text-white/10">DEV</span>
              <img src={foto} alt="Samuel Silva" draggable={false} className="pointer-events-none absolute bottom-0 left-1/2 h-[96%] -translate-x-1/2 object-contain object-bottom" />
            </div>
            <div className="px-4 pb-4 pt-3">
              <p className="font-display text-[19px] font-bold leading-tight text-white">Samuel Silva</p>
              <p className="mt-0.5 font-code text-[9.5px] font-bold uppercase tracking-[0.18em] text-blue-300">Desenvolvedor full stack</p>
              <div className="mt-2.5 flex items-end justify-between">
                <span className="font-code text-[8.5px] leading-tight text-white/45">
                  React · Spring Boot
                  <br />
                  Integrações · IA
                </span>
                <span className="flex h-6 items-end gap-[1.5px]" aria-hidden>
                  {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3].map((l, i) => (
                    <span key={i} className="block bg-white/70" style={{ width: l, height: i % 3 ? '100%' : '80%' }} />
                  ))}
                </span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.10)_45%,transparent_60%)]" />
        </div>

        {/* verso */}
        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[18px] border border-white/15 bg-gradient-to-br from-blue-700 via-[#0d1a45] to-[#060a18] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="absolute top-4 h-1.5 w-10 rounded-full bg-black/60 ring-1 ring-white/10" />
          <span className="font-display text-[86px] font-extrabold leading-none tracking-tighter text-white">ss</span>
          <span className="mt-2 font-code text-[10px] uppercase tracking-[0.35em] text-blue-200/80">portfólio</span>
          <span className="absolute bottom-5 font-code text-[9px] text-white/40">{'<sistemas que o time usa />'}</span>
        </div>
      </div>

      <div ref={dica} className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-code text-[11px] text-white/35 transition-opacity duration-500">
        arraste o crachá
      </div>
    </div>
  )
}

function restringe(a: P, b: P, comp: number, pesoA: number) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy) || 0.0001
  const dif = (d - comp) / d
  a.x += dx * dif * pesoA
  a.y += dy * dif * pesoA
  b.x -= dx * dif * (1 - pesoA)
  b.y -= dy * dif * (1 - pesoA)
}
