import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { CheckCircle2, Info, X } from 'lucide-react'

// ---------- tema ----------
export type Cores = { acento: string; acentoSuave: string; grade: string; eixo: string; texto: string; card: string; borda: string; meta: string }
const CLARO: Cores = { acento: '#6357f5', acentoSuave: '#a5a0fb', grade: '#ececf2', eixo: '#9294a4', texto: '#12121c', card: '#ffffff', borda: '#e5e5ec', meta: '#c4c4d0' }
const ESCURO: Cores = { acento: '#8b80ff', acentoSuave: '#5b52c9', grade: '#26263a', eixo: '#6f7188', texto: '#ececf4', card: '#12121a', borda: '#262634', meta: '#4a4a62' }

type Ctx = { escuro: boolean; alternar: () => void; cores: Cores; avisar: (texto: string, tipo?: 'ok' | 'info') => void }
const TemaCtx = createContext<Ctx>(null!)
export const useCrm = () => useContext(TemaCtx)

type Aviso = { id: number; texto: string; tipo: 'ok' | 'info' }

export function CrmProvider({ children }: { children: ReactNode }) {
  const [escuro, setEscuro] = useState(() => {
    try {
      return localStorage.getItem('crm-escuro') === '1'
    } catch {
      return false
    }
  })
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const alternar = () =>
    setEscuro((e) => {
      try {
        localStorage.setItem('crm-escuro', e ? '0' : '1')
      } catch {
        /* sem storage, segue só na sessão */
      }
      return !e
    })
  const avisar = useCallback((texto: string, tipo: 'ok' | 'info' = 'ok') => {
    const id = Date.now() + Math.random()
    setAvisos((l) => [...l.slice(-2), { id, texto, tipo }])
    setTimeout(() => setAvisos((l) => l.filter((a) => a.id !== id)), 3200)
  }, [])
  return (
    <TemaCtx.Provider value={{ escuro, alternar, cores: escuro ? ESCURO : CLARO, avisar }}>
      <div className={`crm min-h-screen bg-c-bg text-c-texto antialiased ${escuro ? 'escuro' : ''}`}>
        {children}
        <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-2">
          {avisos.map((a) => (
            <div key={a.id} className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-c-borda bg-c-card px-4 py-3 text-[13px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] animate-[surgeBaixo_0.25s_ease-out]">
              {a.tipo === 'ok' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Info size={16} className="text-c-acento" />}
              {a.texto}
            </div>
          ))}
        </div>
      </div>
    </TemaCtx.Provider>
  )
}

// ---------- peças ----------
export function Card({ children, className = '', titulo, extra, semPad }: { children: ReactNode; className?: string; titulo?: ReactNode; extra?: ReactNode; semPad?: boolean }) {
  return (
    <section className={`rounded-2xl border border-c-borda bg-c-card shadow-[0_1px_2px_rgba(16,16,40,0.04)] ${className}`}>
      {titulo && (
        <div className="flex items-center justify-between gap-3 px-5 pt-4">
          <h2 className="text-[14px] font-semibold tracking-[-0.01em]">{titulo}</h2>
          {extra && <div className="text-[12.5px] text-c-sub">{extra}</div>}
        </div>
      )}
      <div className={semPad ? 'pt-3' : 'p-5 pt-4'}>{children}</div>
    </section>
  )
}

const CORES_AVATAR = ['#6357f5', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6']
export function Avatar({ nome, tam = 28, quadrado }: { nome: string; tam?: number; quadrado?: boolean }) {
  const ini = nome
    .replace(/^(Hospital|Clínica|Laboratório|Distribuidora|Farmácia) /, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
  const cor = CORES_AVATAR[[...nome].reduce((s, ch) => s + ch.charCodeAt(0), 0) % CORES_AVATAR.length]
  return (
    <span
      className={`inline-grid shrink-0 place-items-center font-semibold text-white ${quadrado ? 'rounded-lg' : 'rounded-full'}`}
      style={{ width: tam, height: tam, fontSize: tam * 0.38, background: `linear-gradient(135deg, ${cor}, ${cor}bb)` }}
    >
      {ini}
    </span>
  )
}

const PILLS: Record<string, string> = {
  verde: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 [.escuro_&]:text-emerald-400',
  amarelo: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 [.escuro_&]:text-amber-300',
  vermelho: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 [.escuro_&]:text-rose-400',
  azul: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 [.escuro_&]:text-sky-300',
  roxo: 'bg-c-acento/10 text-c-acento ring-c-acento/20',
  cinza: 'bg-c-hover text-c-sub ring-c-borda',
}
export function Pill({ children, tom = 'cinza', ponto = true }: { children: ReactNode; tom?: string; ponto?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset ${PILLS[tom] ?? PILLS.cinza}`}>
      {ponto && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function Botao({ children, onClick, primario, className = '', titulo }: { children: ReactNode; onClick?: () => void; primario?: boolean; className?: string; titulo?: string }) {
  return (
    <button
      onClick={onClick}
      title={titulo}
      className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-[13px] font-medium transition active:scale-[0.98] ${
        primario
          ? 'bg-c-acento text-white shadow-[0_4px_14px_-4px_rgb(var(--c-acento)/0.7)] hover:brightness-110'
          : 'border border-c-borda bg-c-card text-c-texto hover:bg-c-hover'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function Segmentado<T extends string>({ valor, opcoes, onChange }: { valor: T; opcoes: readonly T[] | T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-c-borda bg-c-hover p-0.5">
      {opcoes.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-md px-2.5 py-1 text-[12.5px] font-medium transition ${valor === o ? 'bg-c-card text-c-texto shadow-sm' : 'text-c-sub hover:text-c-texto'}`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function Campo({ valor, onChange, placeholder, icone, className = '' }: { valor: string; onChange: (v: string) => void; placeholder: string; icone?: ReactNode; className?: string }) {
  return (
    <label className={`flex h-9 items-center gap-2 rounded-lg border border-c-borda bg-c-card px-3 text-[13px] focus-within:border-c-acento/60 focus-within:ring-2 focus-within:ring-c-acento/15 ${className}`}>
      {icone && <span className="text-c-fraco">{icone}</span>}
      <input value={valor} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none placeholder:text-c-fraco" />
    </label>
  )
}

export function Escolha({ valor, onChange, opcoes, rotulo }: { valor: string; onChange: (v: string) => void; opcoes: string[]; rotulo?: string }) {
  return (
    <label className="inline-flex h-9 items-center gap-1 rounded-lg border border-c-borda bg-c-card pl-3 text-[13px]">
      {rotulo && <span className="text-c-fraco">{rotulo}</span>}
      <select value={valor} onChange={(e) => onChange(e.target.value)} className="h-full bg-transparent pr-2 font-medium outline-none [&>option]:bg-c-card">
        {opcoes.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export function Mini({ dados, cor, id }: { dados: { v: number }[]; cor: string; id: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={dados} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={cor} stopOpacity={0.35} />
            <stop offset="1" stopColor={cor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Area dataKey="v" stroke={cor} strokeWidth={1.6} fill={`url(#${id})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Barra({ pct, cor }: { pct: number; cor?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-c-hover">
      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, pct)}%`, background: cor ?? 'rgb(var(--c-acento))' }} />
    </div>
  )
}

// Painel que entra pela direita
export function Gaveta({ aberta, fechar, titulo, sub, children, rodape }: { aberta: boolean; fechar: () => void; titulo: ReactNode; sub?: ReactNode; children: ReactNode; rodape?: ReactNode }) {
  useEsc(aberta, fechar)
  if (!aberta) return null
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-[entra_0.2s_ease-out]" onClick={fechar} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col border-l border-c-borda bg-c-card shadow-2xl animate-[surgeDireita_0.28s_cubic-bezier(.2,.8,.2,1)]">
        <div className="flex items-start justify-between gap-3 border-b border-c-borda px-6 py-5">
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold tracking-[-0.01em]">{titulo}</div>
            {sub && <div className="mt-0.5 text-[13px] text-c-sub">{sub}</div>}
          </div>
          <button onClick={fechar} className="grid h-8 w-8 place-items-center rounded-lg text-c-sub hover:bg-c-hover" aria-label="Fechar">
            <X size={17} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {rodape && <div className="flex justify-end gap-2 border-t border-c-borda px-6 py-4">{rodape}</div>}
      </aside>
    </div>
  )
}

export function Modal({ aberto, fechar, titulo, children, rodape }: { aberto: boolean; fechar: () => void; titulo: string; children: ReactNode; rodape?: ReactNode }) {
  useEsc(aberto, fechar)
  if (!aberto) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={fechar} />
      <div className="relative w-full max-w-md rounded-2xl border border-c-borda bg-c-card shadow-2xl animate-[surgeBaixo_0.22s_ease-out]">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-[16px] font-semibold">{titulo}</h3>
          <button onClick={fechar} className="grid h-8 w-8 place-items-center rounded-lg text-c-sub hover:bg-c-hover" aria-label="Fechar">
            <X size={17} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {rodape && <div className="flex justify-end gap-2 border-t border-c-borda px-6 py-4">{rodape}</div>}
      </div>
    </div>
  )
}

export function useEsc(ativo: boolean, fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    if (!ativo) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && ref.current()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [ativo])
}

// Fecha ao clicar fora
export function useFora<T extends HTMLElement>(aberto: boolean, fechar: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!aberto) return
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && fechar()
    setTimeout(() => window.addEventListener('mousedown', h))
    return () => window.removeEventListener('mousedown', h)
  }, [aberto, fechar])
  return ref
}

export const brlK = (v: number) => (v >= 1e6 ? `R$ ${(v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi` : `R$ ${Math.round(v / 1000)} mil`)
