import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, Command, Menu, Moon, Search, Sun, type LucideIcon } from 'lucide-react'
import { Avatar, useCrm, useEsc, useFora } from './kit'

// Estrutura comum das demos (CRM e RH): menu lateral, topo, busca Ctrl K e notificações

export type ItemNav = { to: string; label: string; icon: LucideIcon; end?: boolean; conta?: number; alerta?: boolean; grupo: string }
export type ItemBusca = { grupo: string; titulo: string; sub: string; to: string; icone?: LucideIcon; avatar?: boolean; quadrado?: boolean }
export type Notificacao = { id: number; titulo: string; texto: string; tempo: string; lida: boolean }

type Props = {
  logo: ReactNode
  nav: ItemNav[]
  atalhos?: { titulo: string; to: string; cor: string }[]
  cartao?: ReactNode
  usuario: string
  cargo: string
  acao?: ReactNode
  secao: string
  trilha: (partes: string[]) => string[]
  busca: (q: string) => ItemBusca[]
  notificacoes: Notificacao[]
  children: ReactNode
}

export default function Casca({ logo, nav, atalhos, cartao, usuario, cargo, acao, secao, trilha, busca, notificacoes, children }: Props) {
  const [menu, setMenu] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const { escuro, alternar } = useCrm()
  const { pathname } = useLocation()
  useEffect(() => {
    setMenu(false)
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setBuscando((b) => !b)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const grupos = [...new Set(nav.map((n) => n.grupo))]
  const lateral = (
    <div className="flex h-full flex-col border-r border-c-borda bg-c-lateral">
      <div className="flex h-16 items-center px-4">{logo}</div>
      <button onClick={() => setBuscando(true)} className="mx-3 mb-3 flex h-9 items-center gap-2 rounded-lg border border-c-borda bg-c-card px-3 text-[13px] text-c-fraco hover:text-c-sub">
        <Search size={14} /> Buscar
        <kbd className="ml-auto rounded border border-c-borda px-1.5 text-[10.5px] font-medium">Ctrl K</kbd>
      </button>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {grupos.map((g) => (
          <div key={g}>
            <p className="px-2 pb-1.5 pt-3 text-[11px] font-medium text-c-fraco first:pt-2">{g}</p>
            {nav
              .filter((n) => n.grupo === g)
              .map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition ${isActive ? 'bg-c-card text-c-texto shadow-[0_1px_3px_rgba(16,16,40,0.08)] ring-1 ring-c-borda' : 'text-c-sub hover:bg-c-hover hover:text-c-texto'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <n.icon size={16} strokeWidth={1.9} className={isActive ? 'text-c-acento' : ''} />
                      {n.label}
                      {n.conta != null && (
                        <span className={`ml-auto rounded-md px-1.5 text-[11px] font-semibold tabular-nums ${n.alerta ? 'bg-amber-500/15 text-amber-600 [.escuro_&]:text-amber-300' : 'bg-c-hover text-c-sub'}`}>{n.conta}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
          </div>
        ))}
        {atalhos && (
          <>
            <p className="px-2 pb-1.5 pt-5 text-[11px] font-medium text-c-fraco">Visões salvas</p>
            {atalhos.map((a) => (
              <Link key={a.titulo} to={a.to} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-c-sub hover:bg-c-hover hover:text-c-texto">
                <span className={`h-2 w-2 rounded-full ${a.cor}`} />
                {a.titulo}
              </Link>
            ))}
          </>
        )}
      </nav>
      {cartao && <div className="m-3 rounded-xl border border-c-borda bg-c-card p-3">{cartao}</div>}
      <div className="flex items-center gap-2.5 border-t border-c-borda px-4 py-3">
        <Avatar nome={usuario} tam={32} />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">{usuario}</div>
          <div className="truncate text-[11.5px] text-c-fraco">{cargo}</div>
        </div>
        <button onClick={alternar} title={escuro ? 'Modo claro' : 'Modo escuro'} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-c-sub hover:bg-c-hover">
          {escuro ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">{lateral}</aside>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} />
          <aside className="relative h-full w-64 animate-[entra_0.2s_ease-out]">{lateral}</aside>
        </div>
      )}
      <div className="lg:pl-60">
        <Topo abrirMenu={() => setMenu(true)} abrirBusca={() => setBuscando(true)} acao={acao} secao={secao} trilha={trilha} notificacoes={notificacoes} />
        <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 md:px-8">{children}</main>
      </div>
      <Busca aberta={buscando} fechar={() => setBuscando(false)} busca={busca} />
    </>
  )
}

function Topo({ abrirMenu, abrirBusca, acao, secao, trilha, notificacoes }: { abrirMenu: () => void; abrirBusca: () => void; acao?: ReactNode; secao: string; trilha: Props['trilha']; notificacoes: Notificacao[] }) {
  const { pathname } = useLocation()
  const partes = pathname.split('/').filter(Boolean).slice(1)
  const migalhas = trilha(partes)
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-c-borda bg-c-bg/80 px-4 backdrop-blur-xl md:px-8">
      <button className="-ml-1 grid h-9 w-9 place-items-center rounded-lg hover:bg-c-hover lg:hidden" onClick={abrirMenu} aria-label="Menu">
        <Menu size={18} />
      </button>
      <div className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
        <span className="hidden text-c-fraco sm:inline">{secao}</span>
        {migalhas.map((m, i) => (
          <span key={i} className="flex min-w-0 items-center gap-1.5">
            <ChevronRight size={14} className={`text-c-fraco ${i === 0 ? 'hidden sm:inline' : ''}`} />
            <span className={`truncate ${i === migalhas.length - 1 ? 'font-medium' : 'text-c-sub'}`}>{m}</span>
          </span>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={abrirBusca} className="grid h-9 w-9 place-items-center rounded-lg text-c-sub hover:bg-c-hover lg:hidden" aria-label="Buscar">
          <Search size={17} />
        </button>
        <Sino notificacoes={notificacoes} />
        {acao}
        <Link to="/" className="hidden whitespace-nowrap rounded-lg px-2 text-[12px] text-c-fraco hover:text-c-texto xl:block">
          ← portfólio
        </Link>
      </div>
    </header>
  )
}

export function Sino({ notificacoes }: { notificacoes: Notificacao[] }) {
  const [sino, setSino] = useState(false)
  const [lidas, setLidas] = useState(false)
  const fechar = useCallback(() => setSino(false), [])
  const ref = useFora<HTMLDivElement>(sino, fechar)
  const naoLidas = lidas ? 0 : notificacoes.filter((n) => !n.lida).length
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setSino(!sino)} className="relative grid h-9 w-9 place-items-center rounded-lg text-c-sub hover:bg-c-hover" aria-label="Notificações">
        <Bell size={17} />
        {naoLidas > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-c-bg" />}
      </button>
      {sino && (
        <div className="absolute right-0 top-11 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-c-borda bg-c-card shadow-2xl animate-[surgeBaixo_0.18s_ease-out]">
          <div className="flex items-center justify-between border-b border-c-borda px-4 py-3">
            <span className="text-[14px] font-semibold">Notificações</span>
            <button onClick={() => setLidas(true)} className="text-[12px] font-medium text-c-acento hover:underline">
              Marcar como lidas
            </button>
          </div>
          {notificacoes.map((n) => (
            <div key={n.id} className="flex gap-3 border-b border-c-borda px-4 py-3 last:border-0 hover:bg-c-hover">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${!n.lida && !lidas ? 'bg-c-acento' : 'bg-transparent'}`} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium">{n.titulo}</p>
                <p className="text-[12.5px] text-c-sub">{n.texto}</p>
                <p className="mt-0.5 text-[11.5px] text-c-fraco">{n.tempo}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Busca({ aberta, fechar, busca }: { aberta: boolean; fechar: () => void; busca: Props['busca'] }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const ir = useNavigate()
  useEsc(aberta, fechar)
  useEffect(() => {
    if (aberta) {
      setQ('')
      setSel(0)
    }
  }, [aberta])
  const itens = useMemo(() => busca(q.toLowerCase()).slice(0, 9), [q, busca])
  if (!aberta) return null
  const escolher = (to: string) => {
    fechar()
    ir(to)
  }
  return (
    <div className="fixed inset-0 z-[75] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={fechar} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-c-borda bg-c-card shadow-2xl animate-[surgeBaixo_0.18s_ease-out]">
        <div className="flex items-center gap-3 border-b border-c-borda px-4">
          <Search size={17} className="text-c-fraco" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSel(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSel((s) => Math.min(itens.length - 1, s + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSel((s) => Math.max(0, s - 1))
              } else if (e.key === 'Enter' && itens[sel]) escolher(itens[sel].to)
            }}
            placeholder="Buscar…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-c-fraco"
          />
          <kbd className="rounded border border-c-borda px-1.5 text-[11px] text-c-fraco">Esc</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!itens.length && <p className="px-3 py-8 text-center text-[13px] text-c-fraco">Nada encontrado para “{q}”.</p>}
          {itens.map((i, k) => (
            <div key={i.to + k}>
              {(k === 0 || itens[k - 1].grupo !== i.grupo) && <p className="px-3 pb-1 pt-2 text-[11px] font-medium text-c-fraco">{i.grupo}</p>}
              <button onMouseEnter={() => setSel(k)} onClick={() => escolher(i.to)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${sel === k ? 'bg-c-hover' : ''}`}>
                {i.avatar ? (
                  <Avatar nome={i.titulo} tam={26} quadrado={i.quadrado} />
                ) : (
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-c-hover text-c-sub">{i.icone && <i.icone size={14} />}</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium">{i.titulo}</span>
                  <span className="block truncate text-[12px] text-c-fraco">{i.sub}</span>
                </span>
                {sel === k && <span className="text-[11px] text-c-fraco">Enter ↵</span>}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 border-t border-c-borda px-4 py-2.5 text-[11.5px] text-c-fraco">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span className="ml-auto flex items-center gap-1">
            <Command size={12} /> Ctrl K abre de qualquer tela
          </span>
        </div>
      </div>
    </div>
  )
}
