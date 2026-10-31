import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  Command,
  Download,
  FileText,
  Flame,
  KanbanSquare,
  LayoutGrid,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Package,
  Phone,
  Plus,
  Receipt,
  Search,
  Sparkles,
  Sun,
  Target,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { brl, dataBR, exportCsv } from '../ui'
import {
  atividadesIniciais,
  clientePorId,
  clientes,
  colunas,
  corColuna,
  diasSemComprar,
  gerarAtividade,
  itensPedido,
  linhaDoTempo,
  metaVendedor,
  notificacoes,
  oportunidades as opsIniciais,
  pedidos,
  probabilidade,
  resumoIA,
  saude,
  serieDiaria,
  vendasMes,
  vendedores,
  type Atividade,
  type Coluna,
  type Evento,
  type Oportunidade,
  type Pedido,
} from './data'
import { Avatar, Barra, Botao, Campo, Card, CrmProvider, Escolha, Gaveta, Mini, Modal, Pill, Segmentado, brlK, useCrm, useEsc, useFora } from './kit'

// ---------- estado compartilhado ----------
type Dados = { ops: Oportunidade[]; setOps: React.Dispatch<React.SetStateAction<Oportunidade[]>>; novaOp: () => void; abrirBusca: () => void }
const DadosCtx = createContext<Dados>(null!)
const useDados = () => useContext(DadosCtx)

const tomCliente = { Ativo: 'verde', 'Em risco': 'amarelo', Inativo: 'vermelho' } as const
const tomPedido = { Faturado: 'verde', 'Em separação': 'azul', 'Aguardando liberação': 'amarelo', Cancelado: 'vermelho' } as const

export default function CrmApp() {
  return (
    <CrmProvider>
      <Estrutura>
        <Routes>
          <Route index element={<Painel />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/:id" element={<Ficha />} />
          <Route path="pedidos" element={<Pedidos />} />
        </Routes>
      </Estrutura>
    </CrmProvider>
  )
}

// ---------- estrutura (lateral + topo) ----------
function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#7c6cff] to-[#4f3fe0] shadow-[0_6px_16px_-6px_rgba(99,87,245,0.9)]">
        <svg width="15" height="15" viewBox="0 0 20 20" aria-hidden>
          <path d="M3 4h14L10 17z" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="leading-tight">
        <div className="text-[14px] font-semibold tracking-[-0.01em]">vértice</div>
        <div className="text-[11px] text-c-fraco">Distribuidora Vértice</div>
      </div>
    </div>
  )
}

function Estrutura({ children }: { children: ReactNode }) {
  const [ops, setOps] = useState(opsIniciais)
  const [menu, setMenu] = useState(false)
  const [busca, setBusca] = useState(false)
  const [nova, setNova] = useState(false)
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
        setBusca((b) => !b)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const abertas = ops.filter((o) => o.coluna !== 'Fechado').length
  const emRisco = clientes.filter((c) => c.status !== 'Ativo').length
  const nav: { to: string; label: string; icon: LucideIcon; end?: boolean; conta?: number; alerta?: boolean }[] = [
    { to: '/crm', label: 'Painel', icon: LayoutGrid, end: true },
    { to: '/crm/pipeline', label: 'Pipeline', icon: KanbanSquare, conta: abertas },
    { to: '/crm/clientes', label: 'Clientes', icon: Building2, conta: emRisco, alerta: true },
    { to: '/crm/pedidos', label: 'Pedidos', icon: Receipt },
  ]
  const mes = vendasMes[vendasMes.length - 1]
  const pctMeta = Math.round((mes.realizado / mes.meta) * 100)

  const lateral = (
    <div className="flex h-full flex-col border-r border-c-borda bg-c-lateral">
      <div className="flex h-16 items-center px-4">
        <Logo />
      </div>
      <button onClick={() => setBusca(true)} className="mx-3 mb-3 flex h-9 items-center gap-2 rounded-lg border border-c-borda bg-c-card px-3 text-[13px] text-c-fraco hover:text-c-sub">
        <Search size={14} /> Buscar
        <kbd className="ml-auto rounded border border-c-borda px-1.5 text-[10.5px] font-medium">Ctrl K</kbd>
      </button>
      <nav className="flex-1 space-y-0.5 px-3">
        <p className="px-2 pb-1.5 pt-2 text-[11px] font-medium text-c-fraco">Comercial</p>
        {nav.map((n) => (
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
        <p className="px-2 pb-1.5 pt-5 text-[11px] font-medium text-c-fraco">Visões salvas</p>
        {[
          ['Clientes em risco', '/crm/clientes?f=Em risco', 'bg-amber-500'],
          ['Negócios quentes', '/crm/pipeline', 'bg-rose-500'],
          ['Pedidos travados', '/crm/pedidos?f=Aguardando liberação', 'bg-sky-500'],
        ].map(([t, to, cor]) => (
          <Link key={t} to={to} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-c-sub hover:bg-c-hover hover:text-c-texto">
            <span className={`h-2 w-2 rounded-full ${cor}`} />
            {t}
          </Link>
        ))}
      </nav>
      <div className="m-3 rounded-xl border border-c-borda bg-c-card p-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-medium">Meta de outubro</span>
          <span className="font-semibold tabular-nums text-emerald-600 [.escuro_&]:text-emerald-400">{pctMeta}%</span>
        </div>
        <div className="mt-2">
          <Barra pct={pctMeta} cor="linear-gradient(90deg,#7c6cff,#22c55e)" />
        </div>
        <p className="mt-2 text-[11.5px] text-c-fraco">{brlK(mes.realizado)} de {brlK(mes.meta)}</p>
      </div>
      <div className="flex items-center gap-2.5 border-t border-c-borda px-4 py-3">
        <Avatar nome="Ana Ribeiro" tam={32} />
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">Ana Ribeiro</div>
          <div className="truncate text-[11.5px] text-c-fraco">Coordenadora comercial</div>
        </div>
        <button onClick={alternar} title={escuro ? 'Modo claro' : 'Modo escuro'} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-c-sub hover:bg-c-hover">
          {escuro ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  )

  return (
    <DadosCtx.Provider value={{ ops, setOps, novaOp: () => setNova(true), abrirBusca: () => setBusca(true) }}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">{lateral}</aside>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} />
          <aside className="relative h-full w-64 animate-[entra_0.2s_ease-out]">{lateral}</aside>
        </div>
      )}
      <div className="lg:pl-60">
        <Topo abrirMenu={() => setMenu(true)} />
        <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 md:px-8">{children}</main>
      </div>
      <Busca aberta={busca} fechar={() => setBusca(false)} />
      <NovaOportunidade aberta={nova} fechar={() => setNova(false)} />
    </DadosCtx.Provider>
  )
}

const NOMES_ROTA: Record<string, string> = { '': 'Painel', pipeline: 'Pipeline', clientes: 'Clientes', pedidos: 'Pedidos' }

function Topo({ abrirMenu }: { abrirMenu: () => void }) {
  const { pathname } = useLocation()
  const partes = pathname.replace(/^\/crm\/?/, '').split('/')
  const { novaOp, abrirBusca } = useDados()
  const [sino, setSino] = useState(false)
  const [lidas, setLidas] = useState(false)
  const fechar = useCallback(() => setSino(false), [])
  const ref = useFora<HTMLDivElement>(sino, fechar)
  const naoLidas = lidas ? 0 : notificacoes.filter((n) => !n.lida).length
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-c-borda bg-c-bg/80 px-4 backdrop-blur-xl md:px-8">
      <button className="-ml-1 grid h-9 w-9 place-items-center rounded-lg hover:bg-c-hover lg:hidden" onClick={abrirMenu} aria-label="Menu">
        <Menu size={18} />
      </button>
      <div className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
        <span className="hidden text-c-fraco sm:inline">Comercial</span>
        <ChevronRight size={14} className="hidden text-c-fraco sm:inline" />
        <span className="truncate font-medium">{NOMES_ROTA[partes[0]] ?? 'Painel'}</span>
        {partes[1] && (
          <>
            <ChevronRight size={14} className="text-c-fraco" />
            <span className="truncate text-c-sub">{clientePorId(Number(partes[1]))?.nome}</span>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={abrirBusca} className="grid h-9 w-9 place-items-center rounded-lg text-c-sub hover:bg-c-hover lg:hidden" aria-label="Buscar">
          <Search size={17} />
        </button>
        <div ref={ref} className="relative">
          <button onClick={() => setSino(!sino)} className="relative grid h-9 w-9 place-items-center rounded-lg text-c-sub hover:bg-c-hover" aria-label="Notificações">
            <Bell size={17} />
            {naoLidas > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-c-bg" />}
          </button>
          {sino && (
            <div className="absolute right-0 top-11 w-[340px] overflow-hidden rounded-2xl border border-c-borda bg-c-card shadow-2xl animate-[surgeBaixo_0.18s_ease-out]">
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
        <Botao primario onClick={novaOp}>
          <Plus size={15} /> <span className="hidden sm:inline">Nova oportunidade</span>
        </Botao>
        <Link to="/" className="hidden whitespace-nowrap rounded-lg px-2 text-[12px] text-c-fraco hover:text-c-texto xl:block">
          ← portfólio
        </Link>
      </div>
    </header>
  )
}

// ---------- busca rápida (Ctrl K) ----------
function Busca({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
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
  const itens = useMemo(() => {
    const t = q.toLowerCase()
    const paginas = [
      { grupo: 'Páginas', titulo: 'Painel', sub: 'Visão do mês', to: '/crm', icone: LayoutGrid },
      { grupo: 'Páginas', titulo: 'Pipeline', sub: 'Oportunidades por etapa', to: '/crm/pipeline', icone: KanbanSquare },
      { grupo: 'Páginas', titulo: 'Clientes', sub: 'Carteira completa', to: '/crm/clientes', icone: Building2 },
      { grupo: 'Páginas', titulo: 'Pedidos', sub: 'Últimos 90 dias', to: '/crm/pedidos', icone: Receipt },
    ]
    const cli = clientes.map((c) => ({ grupo: 'Clientes', titulo: c.nome, sub: `${c.cidade} · ${c.vendedor}`, to: `/crm/clientes/${c.id}`, icone: Building2 }))
    const ped = pedidos.slice(0, 40).map((p) => ({ grupo: 'Pedidos', titulo: `Pedido ${p.numero}`, sub: `${clientePorId(p.clienteId).nome} · ${brl(p.valor)}`, to: `/crm/pedidos?n=${p.numero}`, icone: FileText }))
    return [...paginas, ...cli, ...ped].filter((i) => !t || (i.titulo + i.sub).toLowerCase().includes(t)).slice(0, 9)
  }, [q])
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
            placeholder="Buscar cliente, pedido ou página…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-c-fraco"
          />
          <kbd className="rounded border border-c-borda px-1.5 text-[11px] text-c-fraco">Esc</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!itens.length && <p className="px-3 py-8 text-center text-[13px] text-c-fraco">Nada encontrado para “{q}”.</p>}
          {itens.map((i, k) => (
            <div key={i.to + k}>
              {(k === 0 || itens[k - 1].grupo !== i.grupo) && <p className="px-3 pb-1 pt-2 text-[11px] font-medium text-c-fraco">{i.grupo}</p>}
              <button
                onMouseEnter={() => setSel(k)}
                onClick={() => escolher(i.to)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${sel === k ? 'bg-c-hover' : ''}`}
              >
                {i.grupo === 'Clientes' ? <Avatar nome={i.titulo} tam={26} quadrado /> : <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-c-hover text-c-sub"><i.icone size={14} /></span>}
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

// ---------- nova oportunidade ----------
function NovaOportunidade({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
  const { setOps } = useDados()
  const { avisar } = useCrm()
  const ir = useNavigate()
  const [cliente, setCliente] = useState(clientes[0].nome)
  const [titulo, setTitulo] = useState('')
  const [valor, setValor] = useState('')
  const [etapa, setEtapa] = useState<Coluna>('Prospecção')
  const salvar = () => {
    const c = clientes.find((x) => x.nome === cliente)!
    const v = Number(valor.replace(/\D/g, '')) || 25000
    setOps((l) => [...l, { id: Date.now(), clienteId: c.id, titulo: titulo || 'Nova oportunidade', valor: v, coluna: etapa, vendedor: c.vendedor, dias: 0 }])
    avisar(`Oportunidade criada em ${etapa}`)
    fechar()
    setTitulo('')
    setValor('')
    ir('/crm/pipeline')
  }
  return (
    <Modal
      aberto={aberta}
      fechar={fechar}
      titulo="Nova oportunidade"
      rodape={
        <>
          <Botao onClick={fechar}>Cancelar</Botao>
          <Botao primario onClick={salvar}>
            Criar oportunidade
          </Botao>
        </>
      }
    >
      <div className="space-y-4 text-[13px]">
        <label className="block">
          <span className="mb-1.5 block font-medium">Cliente</span>
          <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none focus:border-c-acento/60">
            {clientes.map((c) => (
              <option key={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-medium">O que está sendo negociado</span>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Luvas nitrílicas · contrato anual" className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none placeholder:text-c-fraco focus:border-c-acento/60" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">Valor (R$)</span>
            <input value={valor} onChange={(e) => setValor(e.target.value)} inputMode="numeric" placeholder="25.000" className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 tabular-nums outline-none placeholder:text-c-fraco focus:border-c-acento/60" />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-medium">Etapa</span>
            <select value={etapa} onChange={(e) => setEtapa(e.target.value as Coluna)} className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none focus:border-c-acento/60">
              {colunas.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </Modal>
  )
}

// ---------- painel ----------
function Delta({ v }: { v: number }) {
  const up = v >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold tabular-nums ${up ? 'bg-emerald-500/10 text-emerald-600 [.escuro_&]:text-emerald-400' : 'bg-rose-500/10 text-rose-600 [.escuro_&]:text-rose-400'}`}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(v)}%
    </span>
  )
}

function Kpi({ titulo, valor, delta, serie, cor, icone: I, nota }: { titulo: string; valor: string; delta: number; serie: { v: number }[]; cor: string; icone: LucideIcon; nota: string }) {
  return (
    <Card className="overflow-hidden" semPad>
      <div className="px-5 pb-0 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-c-sub">{titulo}</span>
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${cor}1a`, color: cor }}>
            <I size={16} />
          </span>
        </div>
        <div className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] tabular-nums">{valor}</div>
        <div className="mt-1 flex items-center gap-2 text-[12px] text-c-fraco">
          <Delta v={delta} /> {nota}
        </div>
      </div>
      <div className="mt-2 h-12">
        <Mini dados={serie} cor={cor} id={`k-${titulo.replace(/\W/g, '')}`} />
      </div>
    </Card>
  )
}

function Anel({ pct, tam = 150 }: { pct: number; tam?: number }) {
  const r = tam / 2 - 12
  const c = 2 * Math.PI * r
  const [p, setP] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setP(pct), 100)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <svg width={tam} height={tam} viewBox={`0 0 ${tam} ${tam}`} className="-rotate-90">
      <defs>
        <linearGradient id="anel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#7c6cff" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="rgb(var(--c-hover))" strokeWidth="12" />
      <circle
        cx={tam / 2}
        cy={tam / 2}
        r={r}
        fill="none"
        stroke="url(#anel)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(p, 100) / 100)}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)' }}
      />
    </svg>
  )
}

function Dica({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-c-borda bg-c-card px-3 py-2 text-[12px] shadow-xl">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-c-sub">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-medium tabular-nums text-c-texto">{brl(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

const ICONE_EVENTO: Record<string, LucideIcon> = { Pedido: Package, Ligação: Phone, 'E-mail': Mail, WhatsApp: MessageCircle, Reclamação: TriangleAlert, Amostra: Package, Reunião: Users, Pipeline: KanbanSquare }
const COR_EVENTO: Record<string, string> = { Pedido: '#22c55e', Ligação: '#0ea5e9', 'E-mail': '#6357f5', WhatsApp: '#10b981', Reclamação: '#ef4444', Amostra: '#f59e0b', Reunião: '#ec4899', Pipeline: '#8b5cf6' }

function Painel() {
  const { cores } = useCrm()
  const { ops } = useDados()
  const [periodo, setPeriodo] = useState<'6 meses' | '12 meses'>('12 meses')
  const mes = vendasMes[vendasMes.length - 1]
  const ant = vendasMes[vendasMes.length - 2]
  const variacao = Math.round((mes.realizado / ant.realizado - 1) * 100)
  const pct = Math.round((mes.realizado / mes.meta) * 100)
  const aberto = ops.filter((o) => o.coluna !== 'Fechado')
  const ponderado = aberto.reduce((s, o) => s + o.valor * (probabilidade[o.coluna] / 100), 0)
  const ticket = Math.round(pedidos.filter((p) => p.status !== 'Cancelado').reduce((s, p) => s + p.valor, 0) / pedidos.length)
  const dados = periodo === '6 meses' ? vendasMes.slice(-6) : vendasMes

  const ranking = vendedores
    .map((v) => {
      const peds = pedidos.filter((p) => p.vendedor === v && p.status !== 'Cancelado')
      const total = peds.reduce((s, p) => s + p.valor, 0)
      return { nome: v, total, qtd: peds.length, pct: Math.round((total / metaVendedor[v]) * 100) }
    })
    .sort((a, b) => b.total - a.total)

  // funil acumulado: quantas oportunidades chegaram pelo menos até cada etapa
  const funil = colunas.map((c, i) => {
    const l = ops.filter((o) => colunas.indexOf(o.coluna) >= i)
    return { etapa: c, qtd: l.length, valor: l.reduce((s, o) => s + o.valor, 0) }
  })
  const maxFunil = funil[0].qtd || 1

  const [tarefas, setTarefas] = useState(() =>
    clientes
      .filter((c) => c.status !== 'Ativo')
      .sort((a, b) => a.ultimaCompra.getTime() - b.ultimaCompra.getTime())
      .slice(0, 5)
      .map((c) => ({ c, feita: false })),
  )
  const { avisar } = useCrm()

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-c-fraco">Quinta-feira, 29 de outubro</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.03em]">Bom dia, Ana</h1>
          <p className="mt-1 text-[14px] text-c-sub">
            O time está em <b className="font-semibold text-emerald-600 [.escuro_&]:text-emerald-400">{pct}% da meta</b> e você tem {tarefas.filter((t) => !t.feita).length} clientes pra ligar hoje.
          </p>
        </div>
        <Escolha valor="Todos" onChange={() => {}} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi titulo="Faturado no mês" valor={brlK(mes.realizado)} delta={variacao} nota="vs. setembro" serie={serieDiaria(3, 40)} cor="#6357f5" icone={Receipt} />
        <Kpi titulo="Pipeline ponderado" valor={brlK(ponderado)} delta={12} nota={`${aberto.length} em aberto`} serie={serieDiaria(8, 30, 0.03)} cor="#0ea5e9" icone={KanbanSquare} />
        <Kpi titulo="Ticket médio" valor={brlK(ticket)} delta={4} nota="por pedido" serie={serieDiaria(11, 20, 0.015)} cor="#10b981" icone={Target} />
        <Kpi titulo="Clientes em risco" valor={String(clientes.filter((c) => c.status !== 'Ativo').length)} delta={-8} nota="sem comprar há 45+ dias" serie={serieDiaria(21, 12, -0.01)} cor="#f59e0b" icone={Flame} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card titulo="Faturamento x meta" extra={<Segmentado valor={periodo} opcoes={['6 meses', '12 meses'] as const} onChange={setPeriodo} />}>
          <div className="mb-2 flex gap-5 text-[12px] text-c-sub">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: cores.acento }} /> Realizado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 border-t-2 border-dashed" style={{ borderColor: cores.meta }} /> Meta
            </span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={dados} margin={{ left: -8, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="fat" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={cores.acento} stopOpacity={0.28} />
                    <stop offset="1" stopColor={cores.acento} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={cores.grade} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11.5, fill: cores.eixo }} axisLine={false} tickLine={false} dy={6} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11.5, fill: cores.eixo }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<Dica />} cursor={{ stroke: cores.borda }} />
                <Area dataKey="meta" name="Meta" stroke={cores.meta} strokeDasharray="5 5" fill="none" strokeWidth={1.5} isAnimationActive={false} />
                <Area dataKey="realizado" name="Realizado" stroke={cores.acento} strokeWidth={2.2} fill="url(#fat)" activeDot={{ r: 4, strokeWidth: 0 }} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card titulo="Meta do mês" extra="outubro">
          <div className="relative mx-auto grid w-fit place-items-center">
            <Anel pct={pct} />
            <div className="absolute text-center">
              <div className="text-[30px] font-semibold tracking-[-0.03em] tabular-nums">{pct}%</div>
              <div className="text-[11.5px] text-c-fraco">batida</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-c-hover px-2 py-2.5">
              <div className="text-[11.5px] text-c-fraco">Realizado</div>
              <div className="text-[14px] font-semibold tabular-nums">{brlK(mes.realizado)}</div>
            </div>
            <div className="rounded-xl bg-c-hover px-2 py-2.5">
              <div className="text-[11.5px] text-c-fraco">Meta</div>
              <div className="text-[14px] font-semibold tabular-nums">{brlK(mes.meta)}</div>
            </div>
          </div>
          <p className="mt-3 text-center text-[12px] text-c-sub">Passou {brlK(mes.realizado - mes.meta)} da meta com 2 dias úteis sobrando.</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card titulo="Ranking do time" extra="90 dias">
          <ul className="space-y-3.5">
            {ranking.map((r, i) => (
              <li key={r.nome} className="flex items-center gap-3">
                <span className="w-4 text-[12px] font-semibold tabular-nums text-c-fraco">{i + 1}</span>
                <Avatar nome={r.nome} tam={30} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-medium">{r.nome}</span>
                    <span className="text-[12.5px] font-semibold tabular-nums">{brlK(r.total)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Barra pct={r.pct} cor={r.pct >= 100 ? '#22c55e' : undefined} />
                    <span className="w-9 text-right text-[11px] tabular-nums text-c-fraco">{r.pct}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Funil de vendas" extra={<Link to="/crm/pipeline" className="font-medium text-c-acento hover:underline">abrir pipeline</Link>}>
          <div className="space-y-2.5">
            {funil.map((f, i) => (
              <div key={f.etapa}>
                <div className="mb-1 flex justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2 w-2 rounded-full" style={{ background: corColuna[f.etapa] }} />
                    {f.etapa}
                  </span>
                  <span className="tabular-nums text-c-sub">
                    {f.qtd} · {brlK(f.valor)}
                  </span>
                </div>
                <div className="h-7 overflow-hidden rounded-lg bg-c-hover">
                  <div
                    className="flex h-full items-center justify-end rounded-lg pr-2 text-[11px] font-semibold text-white transition-[width] duration-700"
                    style={{ width: `${Math.max(10, (f.qtd / maxFunil) * 100)}%`, background: corColuna[f.etapa] }}
                  >
                    {i > 0 && funil[i - 1].qtd ? `${Math.round((f.qtd / funil[i - 1].qtd) * 100)}%` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-c-fraco">% = quantas passaram da etapa anterior para esta</p>
        </Card>

        <Feed />
      </div>

      <Card className="mt-4" titulo="Ligar esta semana" extra={<Link to="/crm/clientes?f=Em risco" className="font-medium text-c-acento hover:underline">ver todos em risco</Link>} semPad>
        <ul className="divide-y divide-c-borda">
          {tarefas.map(({ c, feita }, i) => (
            <li key={c.id} className={`flex items-center gap-3 px-5 py-3 transition ${feita ? 'opacity-50' : ''}`}>
              <button
                onClick={() => {
                  setTarefas((l) => l.map((t, k) => (k === i ? { ...t, feita: !t.feita } : t)))
                  if (!feita) avisar(`Ligação para ${c.nome} registrada`)
                }}
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${feita ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-c-borda hover:border-c-acento'}`}
                aria-label="Concluir"
              >
                {feita && <Check size={13} strokeWidth={3} />}
              </button>
              <Avatar nome={c.nome} tam={32} quadrado />
              <Link to={`/crm/clientes/${c.id}`} className="min-w-0 flex-1">
                <span className={`block truncate text-[13.5px] font-medium hover:underline ${feita ? 'line-through' : ''}`}>{c.nome}</span>
                <span className="block truncate text-[12px] text-c-fraco">
                  {c.contato} · {diasSemComprar(c)} dias sem comprar
                </span>
              </Link>
              <span className="hidden text-[12.5px] tabular-nums text-c-sub md:block">{brlK(c.compras12m)} / 12m</span>
              <Pill tom={tomCliente[c.status]}>{c.status}</Pill>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

// Atividade do time "ao vivo": entra um item novo de tempos em tempos
function Feed() {
  const [itens, setItens] = useState<(Atividade & { novo?: boolean })[]>(atividadesIniciais)
  useEffect(() => {
    let n = 100
    const t = setInterval(() => {
      n += 1
      setItens((l) => [{ ...gerarAtividade(n, 0), novo: true }, ...l.map((a) => ({ ...a, novo: false, minutos: a.minutos + 1 }))].slice(0, 7))
    }, 7000)
    return () => clearInterval(t)
  }, [])
  return (
    <Card
      titulo={
        <span className="flex items-center gap-2">
          Atividade do time
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </span>
      }
      extra="ao vivo"
      semPad
    >
      <ul className="px-2 pb-2">
        {itens.map((a) => {
          const I = ICONE_EVENTO[a.tipo] ?? CircleDot
          return (
            <li key={a.id} className={`flex gap-3 rounded-xl px-3 py-2.5 ${a.novo ? 'animate-[brilhoNovo_2.5s_ease-out]' : ''}`}>
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ background: `${COR_EVENTO[a.tipo]}1a`, color: COR_EVENTO[a.tipo] }}>
                <I size={14} />
              </span>
              <div className="min-w-0 text-[12.5px] leading-snug">
                <span className="font-semibold">{a.quem.split(' ')[0]}</span> <span className="text-c-sub">{a.acao}</span>{' '}
                <Link to={`/crm/clientes/${a.clienteId}`} className="font-medium hover:underline">
                  {a.alvo}
                </Link>
                <div className="mt-0.5 text-[11.5px] text-c-fraco">{a.minutos === 0 ? 'agora' : `há ${a.minutos} min`}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

// ---------- pipeline ----------
function Pipeline() {
  const { ops, setOps } = useDados()
  const { avisar } = useCrm()
  const [vend, setVend] = useState('Todos')
  const [q, setQ] = useState('')
  const [modo, setModo] = useState<'Quadro' | 'Lista'>('Quadro')
  const [arrastando, setArrastando] = useState<number | null>(null)
  const [sobre, setSobre] = useState<Coluna | null>(null)
  const [aberta, setAberta] = useState<number | null>(null)
  const visiveis = ops.filter((o) => (vend === 'Todos' || o.vendedor === vend) && (clientePorId(o.clienteId).nome + o.titulo).toLowerCase().includes(q.toLowerCase()))
  const mover = (id: number, col: Coluna) => {
    const o = ops.find((x) => x.id === id)
    if (!o || o.coluna === col) return
    setOps((l) => l.map((x) => (x.id === id ? { ...x, coluna: col, dias: 0 } : x)))
    avisar(col === 'Fechado' ? `Negócio fechado: ${brl(o.valor)} com ${clientePorId(o.clienteId).nome}` : `Movida para ${col}`, col === 'Fechado' ? 'ok' : 'info')
  }
  const total = visiveis.filter((o) => o.coluna !== 'Fechado').reduce((s, o) => s + o.valor, 0)
  const ponderado = visiveis.filter((o) => o.coluna !== 'Fechado').reduce((s, o) => s + o.valor * (probabilidade[o.coluna] / 100), 0)
  const op = ops.find((o) => o.id === aberta)

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Pipeline</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">
            {brlK(total)} em aberto · <span className="font-medium text-c-texto">{brlK(ponderado)}</span> ponderado pela probabilidade de cada etapa
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Campo valor={q} onChange={setQ} placeholder="Filtrar…" icone={<Search size={14} />} className="w-44" />
          <Escolha valor={vend} onChange={setVend} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />
          <Segmentado valor={modo} opcoes={['Quadro', 'Lista'] as const} onChange={setModo} />
        </div>
      </div>

      {modo === 'Quadro' ? (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
          {colunas.map((col) => {
            const itens = visiveis.filter((o) => o.coluna === col)
            return (
              <div
                key={col}
                onDragOver={(e) => {
                  e.preventDefault()
                  setSobre(col)
                }}
                onDragLeave={() => setSobre((s) => (s === col ? null : s))}
                onDrop={() => {
                  if (arrastando != null) mover(arrastando, col)
                  setArrastando(null)
                  setSobre(null)
                }}
                className={`flex min-w-[228px] flex-1 flex-col rounded-2xl border p-2 transition ${sobre === col ? 'border-c-acento/50 bg-c-acento/[0.06]' : 'border-transparent bg-c-hover/60'}`}
              >
                <div className="flex items-center justify-between px-2 pb-2.5 pt-1.5">
                  <span className="flex items-center gap-2 text-[13px] font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: corColuna[col] }} />
                    {col}
                    <span className="rounded-md bg-c-card px-1.5 text-[11px] font-semibold tabular-nums text-c-sub ring-1 ring-c-borda">{itens.length}</span>
                  </span>
                  <span className="text-[12px] font-medium tabular-nums text-c-sub">{brlK(itens.reduce((s, o) => s + o.valor, 0))}</span>
                </div>
                <div className="min-h-[140px] space-y-2">
                  {itens.map((o) => {
                    const c = clientePorId(o.clienteId)
                    const parada = o.dias > 20 && col !== 'Fechado'
                    return (
                      <div
                        key={o.id}
                        draggable
                        onDragStart={() => setArrastando(o.id)}
                        onDragEnd={() => {
                          setArrastando(null)
                          setSobre(null)
                        }}
                        onClick={() => setAberta(o.id)}
                        className={`group cursor-grab rounded-xl border border-c-borda bg-c-card p-3 shadow-[0_1px_2px_rgba(16,16,40,0.05)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_-10px_rgba(16,16,40,0.25)] active:cursor-grabbing ${arrastando === o.id ? 'rotate-[1.5deg] opacity-50' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <Avatar nome={c.nome} tam={28} quadrado />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold leading-tight">{c.nome}</p>
                            <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-c-sub">{o.titulo}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[13.5px] font-semibold tabular-nums">{brl(o.valor)}</span>
                          <span className="rounded-md bg-c-hover px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-c-sub">{probabilidade[col]}%</span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-c-borda pt-2.5 text-[11.5px]">
                          <span className="flex items-center gap-1.5 text-c-sub">
                            <Avatar nome={o.vendedor} tam={18} />
                            {o.vendedor.split(' ')[0]}
                          </span>
                          {parada ? (
                            <span className="flex items-center gap-1 font-medium text-amber-600 [.escuro_&]:text-amber-400">
                              <TriangleAlert size={12} /> parada há {o.dias}d
                            </span>
                          ) : (
                            <span className="text-c-fraco">{o.dias === 0 ? 'hoje' : `${o.dias}d na etapa`}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {!itens.length && <div className="grid h-24 place-items-center rounded-xl border border-dashed border-c-borda text-[12px] text-c-fraco">Arraste uma oportunidade pra cá</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card semPad className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead>
                <tr className="border-b border-c-borda text-left text-[12px] text-c-fraco">
                  {['Cliente', 'Oportunidade', 'Etapa', 'Vendedor', 'Valor', 'Prob.'].map((h, i) => (
                    <th key={h} className={`px-5 pb-3 font-medium ${i >= 4 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visiveis.map((o) => (
                  <tr key={o.id} onClick={() => setAberta(o.id)} className="cursor-pointer border-b border-c-borda last:border-0 hover:bg-c-hover">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2.5 font-medium">
                        <Avatar nome={clientePorId(o.clienteId).nome} tam={26} quadrado />
                        {clientePorId(o.clienteId).nome}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-c-sub">{o.titulo}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: corColuna[o.coluna] }} />
                        {o.coluna}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-c-sub">{o.vendedor}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">{brl(o.valor)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-c-sub">{probabilidade[o.coluna]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Gaveta
        aberta={!!op}
        fechar={() => setAberta(null)}
        titulo={op ? clientePorId(op.clienteId).nome : ''}
        sub={op?.titulo}
        rodape={
          op && (
            <>
              <Link to={`/crm/clientes/${op.clienteId}`}>
                <Botao>Abrir ficha do cliente</Botao>
              </Link>
              {op.coluna !== 'Fechado' && (
                <Botao primario onClick={() => mover(op.id, 'Fechado')}>
                  <Check size={15} /> Marcar como ganha
                </Botao>
              )}
            </>
          )
        }
      >
        {op && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {[
                ['Valor', brl(op.valor)],
                ['Probabilidade', `${probabilidade[op.coluna]}%`],
                ['Ponderado', brl(Math.round(op.valor * (probabilidade[op.coluna] / 100)))],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-c-hover px-3 py-2.5">
                  <div className="text-[11.5px] text-c-fraco">{k}</div>
                  <div className="mt-0.5 text-[14px] font-semibold tabular-nums">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2.5 text-[12.5px] font-medium text-c-sub">Etapa · clique pra mover</p>
              <div className="flex gap-1">
                {colunas.map((c, i) => {
                  const atingida = colunas.indexOf(op.coluna) >= i
                  return (
                    <button key={c} onClick={() => mover(op.id, c)} className="group flex-1 text-left">
                      <div className="h-1.5 rounded-full transition" style={{ background: atingida ? corColuna[op.coluna] : 'rgb(var(--c-hover))' }} />
                      <span className={`mt-1.5 block truncate text-[11px] ${op.coluna === c ? 'font-semibold' : 'text-c-fraco group-hover:text-c-sub'}`}>{c}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-3 text-[13px]">
              {[
                ['Responsável', <span className="flex items-center gap-2"><Avatar nome={op.vendedor} tam={20} />{op.vendedor}</span>],
                ['Contato', clientePorId(op.clienteId).contato],
                ['Cidade', clientePorId(op.clienteId).cidade],
                ['Tempo na etapa', op.dias === 0 ? 'entrou hoje' : `${op.dias} dias`],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-4">
                  <span className="text-c-fraco">{k}</span>
                  <span className="text-right font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-[12.5px] font-medium text-c-sub">Últimos contatos</p>
              <LinhaTempo eventos={linhaDoTempo(clientePorId(op.clienteId)).slice(0, 4)} compacta />
            </div>
          </div>
        )}
      </Gaveta>
    </>
  )
}

// ---------- clientes ----------
function corSaude(s: number) {
  return s >= 65 ? '#22c55e' : s >= 40 ? '#f59e0b' : '#ef4444'
}

function Clientes() {
  const { search } = useLocation()
  const inicial = new URLSearchParams(search).get('f') ?? 'Todos'
  const [q, setQ] = useState('')
  const [st, setSt] = useState(inicial)
  const [ordem, setOrdem] = useState('Compras 12m')
  const [modo, setModo] = useState<'Tabela' | 'Cartões'>('Tabela')
  useEffect(() => setSt(inicial), [inicial])
  const filtros = ['Todos', 'Ativo', 'Em risco', 'Inativo']
  const lista = clientes
    .filter((c) => (st === 'Todos' || c.status === st) && (c.nome + c.cidade + c.vendedor).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (ordem === 'Compras 12m' ? b.compras12m - a.compras12m : ordem === 'Saúde' ? saude(a) - saude(b) : a.nome.localeCompare(b.nome)))
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Clientes</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">Carteira com a nota de saúde de cada conta: quanto compra do potencial e há quanto tempo não compra.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Campo valor={q} onChange={setQ} placeholder="Cliente, cidade ou vendedor" icone={<Search size={14} />} className="w-60" />
          <Escolha valor={ordem} onChange={setOrdem} opcoes={['Compras 12m', 'Saúde', 'Nome']} rotulo="Ordenar" />
          <Segmentado valor={modo} opcoes={['Tabela', 'Cartões'] as const} onChange={setModo} />
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => {
          const n = f === 'Todos' ? clientes.length : clientes.filter((c) => c.status === f).length
          return (
            <button
              key={f}
              onClick={() => setSt(f)}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${st === f ? 'border-c-texto bg-c-texto text-c-bg' : 'border-c-borda bg-c-card text-c-sub hover:text-c-texto'}`}
            >
              {f}
              <span className={`tabular-nums ${st === f ? 'opacity-70' : 'text-c-fraco'}`}>{n}</span>
            </button>
          )
        })}
      </div>

      {modo === 'Tabela' ? (
        <Card semPad className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-[13px]">
              <thead>
                <tr className="border-b border-c-borda text-left text-[12px] text-c-fraco">
                  <th className="px-5 pb-3 font-medium">Cliente</th>
                  <th className="px-5 pb-3 font-medium">Vendedor</th>
                  <th className="px-5 pb-3 text-right font-medium">Compras 12m</th>
                  <th className="w-44 px-5 pb-3 font-medium">Saúde</th>
                  <th className="px-5 pb-3 font-medium">Última compra</th>
                  <th className="px-5 pb-3 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => {
                  const s = saude(c)
                  return (
                    <tr key={c.id} className="group border-b border-c-borda last:border-0 hover:bg-c-hover">
                      <td className="px-5 py-3">
                        <Link to={`/crm/clientes/${c.id}`} className="flex items-center gap-3">
                          <Avatar nome={c.nome} tam={34} quadrado />
                          <span>
                            <span className="block font-medium group-hover:underline">{c.nome}</span>
                            <span className="block text-[12px] text-c-fraco">
                              {c.tipo} · {c.cidade}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2 text-c-sub">
                          <Avatar nome={c.vendedor} tam={22} />
                          {c.vendedor}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium tabular-nums">{brl(c.compras12m)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Barra pct={s} cor={corSaude(s)} />
                          <span className="w-6 text-right text-[12px] font-semibold tabular-nums" style={{ color: corSaude(s) }}>
                            {s}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-c-sub">
                        {dataBR(c.ultimaCompra)}
                        <span className="block text-[11.5px] text-c-fraco">há {diasSemComprar(c)} dias</span>
                      </td>
                      <td className="px-5 py-3">
                        <Pill tom={tomCliente[c.status]}>{c.status}</Pill>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-c-borda px-5 py-3 text-[12px] text-c-fraco">
            {lista.length} de {clientes.length} clientes
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {lista.map((c) => {
            const s = saude(c)
            return (
              <Link key={c.id} to={`/crm/clientes/${c.id}`} className="group rounded-2xl border border-c-borda bg-c-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-14px_rgba(16,16,40,0.3)]">
                <div className="flex items-start justify-between">
                  <Avatar nome={c.nome} tam={42} quadrado />
                  <Pill tom={tomCliente[c.status]}>{c.status}</Pill>
                </div>
                <p className="mt-3 truncate text-[14px] font-semibold group-hover:underline">{c.nome}</p>
                <p className="text-[12px] text-c-fraco">
                  {c.tipo} · {c.cidade}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[11.5px] text-c-fraco">Compras 12m</p>
                    <p className="text-[15px] font-semibold tabular-nums">{brlK(c.compras12m)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11.5px] text-c-fraco">Saúde</p>
                    <p className="text-[15px] font-semibold tabular-nums" style={{ color: corSaude(s) }}>
                      {s}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <Barra pct={s} cor={corSaude(s)} />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

// ---------- ficha do cliente ----------
function LinhaTempo({ eventos, compacta }: { eventos: Evento[]; compacta?: boolean }) {
  return (
    <ol className="relative">
      {eventos.map((e, i) => {
        const I = ICONE_EVENTO[e.tipo] ?? CircleDot
        return (
          <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
            {i < eventos.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-c-borda" />}
            <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-c-card" style={{ background: `${COR_EVENTO[e.tipo]}1f`, color: COR_EVENTO[e.tipo] }}>
              <I size={14} />
            </span>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-x-2 text-[12px]">
                <span className="font-semibold">{e.tipo}</span>
                <span className="text-c-fraco">{dataBR(e.data)}</span>
              </div>
              <p className={`mt-0.5 text-c-sub ${compacta ? 'text-[12.5px]' : 'text-[13.5px]'}`}>{e.texto}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// Texto que aparece como se estivesse sendo escrito
function Escrevendo({ texto, chave }: { texto: string; chave: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const t = setInterval(() => setN((v) => (v >= texto.length ? (clearInterval(t), v) : v + 3)), 16)
    return () => clearInterval(t)
  }, [texto, chave])
  return (
    <p className="text-[13.5px] leading-relaxed">
      {texto.slice(0, n)}
      {n < texto.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-c-acento align-middle" />}
    </p>
  )
}

function Ficha() {
  const { id } = useParams()
  const c = clientePorId(Number(id))
  const { ops } = useDados()
  const { avisar, cores } = useCrm()
  const eventos = useMemo(() => linhaDoTempo(c), [c])
  const [aba, setAba] = useState<'Linha do tempo' | 'Pedidos' | 'Oportunidades'>('Linha do tempo')
  const [gerado, setGerado] = useState(0)
  if (!c) return null
  const peds = pedidos.filter((p) => p.clienteId === c.id)
  const opsC = ops.filter((o) => o.clienteId === c.id)
  const s = saude(c)
  const compras = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'].map((m, i) => ({ mes: m, valor: Math.round((c.compras12m / 12) * (0.5 + ((c.id * (i + 3)) % 7) / 7)) }))

  return (
    <>
      <Link to="/crm/clientes" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-c-sub hover:text-c-texto">
        <ArrowLeft size={14} /> Clientes
      </Link>

      <Card className="overflow-hidden" semPad>
        <div className="h-20 bg-gradient-to-r from-[#6357f5]/25 via-[#0ea5e9]/15 to-transparent" />
        <div className="-mt-9 flex flex-wrap items-end justify-between gap-4 px-6 pb-5">
          <div className="flex items-end gap-4">
            <span className="rounded-2xl ring-4 ring-c-card">
              <Avatar nome={c.nome} tam={72} quadrado />
            </span>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[22px] font-semibold tracking-[-0.02em]">{c.nome}</h1>
                <Pill tom={tomCliente[c.status]}>{c.status}</Pill>
              </div>
              <p className="mt-0.5 text-[13px] text-c-sub">
                {c.tipo} · {c.cidade} · {c.contato}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Botao onClick={() => avisar(`Conversa aberta com ${c.contato.split(' ')[0]} no WhatsApp`, 'info')}>
              <MessageCircle size={15} /> WhatsApp
            </Botao>
            <Botao onClick={() => avisar('Rascunho de e-mail criado', 'info')}>
              <Mail size={15} /> E-mail
            </Botao>
            <Botao primario onClick={() => avisar('Pedido em rascunho criado')}>
              <Plus size={15} /> Novo pedido
            </Botao>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Potencial anual', brlK(c.potencial), ''],
          ['Comprado em 12 meses', brlK(c.compras12m), `${Math.round((c.compras12m / c.potencial) * 100)}% do potencial`],
          ['Última compra', dataBR(c.ultimaCompra), `há ${diasSemComprar(c)} dias`],
          ['Responsável', c.vendedor, 'carteira própria'],
        ].map(([k, v, n]) => (
          <Card key={k} semPad>
            <div className="px-5 pb-4 pt-1">
              <p className="text-[12.5px] text-c-fraco">{k}</p>
              <p className="mt-1 truncate text-[19px] font-semibold tracking-[-0.02em] tabular-nums">{v}</p>
              {n && <p className="mt-0.5 text-[12px] text-c-sub">{n}</p>}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card semPad>
          <div className="flex gap-1 border-b border-c-borda px-3">
            {(['Linha do tempo', 'Pedidos', 'Oportunidades'] as const).map((a) => (
              <button key={a} onClick={() => setAba(a)} className={`relative px-3 pb-3 pt-1 text-[13px] font-medium transition ${aba === a ? 'text-c-texto' : 'text-c-fraco hover:text-c-sub'}`}>
                {a}
                {a === 'Pedidos' && <span className="ml-1.5 text-c-fraco">{peds.length}</span>}
                {a === 'Oportunidades' && <span className="ml-1.5 text-c-fraco">{opsC.length}</span>}
                {aba === a && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-c-acento" />}
              </button>
            ))}
          </div>
          <div className="p-5">
            {aba === 'Linha do tempo' && <LinhaTempo eventos={eventos} />}
            {aba === 'Pedidos' &&
              (peds.length ? (
                <ul className="divide-y divide-c-borda">
                  {peds.map((p) => (
                    <li key={p.numero} className="flex items-center justify-between gap-3 py-3 text-[13px]">
                      <span className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-c-hover text-c-sub">
                          <Receipt size={15} />
                        </span>
                        <span>
                          <span className="block font-medium">Pedido {p.numero}</span>
                          <span className="block text-[12px] text-c-fraco">
                            {dataBR(p.data)} · {p.itens} itens
                          </span>
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <Pill tom={tomPedido[p.status]}>{p.status}</Pill>
                        <span className="w-24 text-right font-semibold tabular-nums">{brl(p.valor)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-[13px] text-c-fraco">Nenhum pedido nos últimos 90 dias.</p>
              ))}
            {aba === 'Oportunidades' &&
              (opsC.length ? (
                <ul className="divide-y divide-c-borda">
                  {opsC.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-[13px]">
                      <span>
                        <span className="block font-medium">{o.titulo}</span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-c-fraco">
                          <span className="h-2 w-2 rounded-full" style={{ background: corColuna[o.coluna] }} />
                          {o.coluna} · {probabilidade[o.coluna]}%
                        </span>
                      </span>
                      <span className="font-semibold tabular-nums">{brl(o.valor)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-[13px] text-c-fraco">Nenhuma oportunidade aberta.</p>
              ))}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#6357f5] via-[#7c6cff] to-[#0ea5e9] p-px">
            <div className="rounded-[15px] bg-c-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-semibold">
                  <Sparkles size={16} className="text-c-acento" /> Resumo com IA
                </span>
                <button onClick={() => setGerado((g) => g + 1)} className="text-[12px] font-medium text-c-acento hover:underline">
                  gerar de novo
                </button>
              </div>
              <div className="mt-3">
                <Escrevendo texto={resumoIA(c, eventos)} chave={gerado} />
              </div>
              <p className="mt-3 text-[11.5px] text-c-fraco">Montado a partir de pedidos, ligações, e-mails e WhatsApp do cliente.</p>
            </div>
          </div>

          <Card titulo="Saúde da conta" extra={<span className="font-semibold tabular-nums" style={{ color: corSaude(s) }}>{s}/100</span>}>
            <Barra pct={s} cor={corSaude(s)} />
            <p className="mt-2.5 text-[12.5px] text-c-sub">
              {s >= 65 ? 'Conta saudável, comprando com frequência.' : s >= 40 ? 'Atenção: compras abaixo do potencial ou intervalo longo.' : 'Risco alto de perder o cliente.'}
            </p>
          </Card>

          <Card titulo="Compras por mês" extra="6 meses">
            <div className="h-36">
              <ResponsiveContainer>
                <BarChart data={compras} margin={{ left: -20, right: 0, top: 4 }}>
                  <CartesianGrid stroke={cores.grade} vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: cores.eixo }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: cores.eixo }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Dica />} cursor={{ fill: 'rgb(var(--c-hover))' }} />
                  <Bar dataKey="valor" name="Comprado" fill={cores.acento} radius={[6, 6, 0, 0]} barSize={22} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

// ---------- pedidos ----------
const ETAPAS_PEDIDO = ['Emitido', 'Liberado', 'Em separação', 'Faturado'] as const
function etapaPedido(p: Pedido) {
  return p.status === 'Faturado' ? 3 : p.status === 'Em separação' ? 2 : p.status === 'Aguardando liberação' ? 0 : -1
}

function Pedidos() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const [q, setQ] = useState(params.get('n') ?? '')
  const [st, setSt] = useState(params.get('f') ?? 'Todos')
  const [vend, setVend] = useState('Todos')
  const [aberto, setAberto] = useState<Pedido | null>(null)
  const { avisar } = useCrm()
  useEffect(() => {
    const p = new URLSearchParams(search)
    setQ(p.get('n') ?? '')
    setSt(p.get('f') ?? 'Todos')
  }, [search])
  const filtros = ['Todos', 'Faturado', 'Em separação', 'Aguardando liberação', 'Cancelado']
  const lista = pedidos.filter(
    (p) => (st === 'Todos' || p.status === st) && (vend === 'Todos' || p.vendedor === vend) && (String(p.numero) + clientePorId(p.clienteId).nome).toLowerCase().includes(q.toLowerCase()),
  )
  const total = lista.filter((p) => p.status !== 'Cancelado').reduce((s, p) => s + p.valor, 0)
  const exportar = () => {
    exportCsv(
      'pedidos.csv',
      lista.map((p) => ({ Pedido: p.numero, Data: dataBR(p.data), Cliente: clientePorId(p.clienteId).nome, Vendedor: p.vendedor, Itens: p.itens, Valor: p.valor, Status: p.status })),
    )
    avisar(`${lista.length} pedidos exportados para Excel`)
  }
  const itens = aberto ? itensPedido(aberto) : []
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Pedidos</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">
            {lista.length} pedidos · <span className="font-medium text-c-texto">{brl(total)}</span> sem cancelados
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Campo valor={q} onChange={setQ} placeholder="Nº do pedido ou cliente" icone={<Search size={14} />} className="w-56" />
          <Escolha valor={vend} onChange={setVend} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />
          <Botao onClick={exportar}>
            <Download size={15} /> Exportar Excel
          </Botao>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f}
            onClick={() => setSt(f)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition ${st === f ? 'border-c-texto bg-c-texto text-c-bg' : 'border-c-borda bg-c-card text-c-sub hover:text-c-texto'}`}
          >
            {f}
            <span className={`tabular-nums ${st === f ? 'opacity-70' : 'text-c-fraco'}`}>{f === 'Todos' ? pedidos.length : pedidos.filter((p) => p.status === f).length}</span>
          </button>
        ))}
      </div>
      <Card semPad className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-[13px]">
            <thead>
              <tr className="border-b border-c-borda text-left text-[12px] text-c-fraco">
                <th className="px-5 pb-3 font-medium">Pedido</th>
                <th className="px-5 pb-3 font-medium">Cliente</th>
                <th className="px-5 pb-3 font-medium">Vendedor</th>
                <th className="px-5 pb-3 text-right font-medium">Itens</th>
                <th className="px-5 pb-3 text-right font-medium">Valor</th>
                <th className="px-5 pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.numero} onClick={() => setAberto(p)} className="cursor-pointer border-b border-c-borda last:border-0 hover:bg-c-hover">
                  <td className="px-5 py-3">
                    <span className="block font-medium tabular-nums">#{p.numero}</span>
                    <span className="block text-[12px] text-c-fraco">{dataBR(p.data)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2.5 font-medium">
                      <Avatar nome={clientePorId(p.clienteId).nome} tam={26} quadrado />
                      {clientePorId(p.clienteId).nome}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-c-sub">{p.vendedor}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-c-sub">{p.itens}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">{brl(p.valor)}</td>
                  <td className="px-5 py-3">
                    <Pill tom={tomPedido[p.status]}>{p.status}</Pill>
                  </td>
                </tr>
              ))}
              {!lista.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-c-fraco">
                    Nenhum pedido com esses filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Gaveta
        aberta={!!aberto}
        fechar={() => setAberto(null)}
        titulo={aberto ? `Pedido #${aberto.numero}` : ''}
        sub={aberto && `${clientePorId(aberto.clienteId).nome} · ${dataBR(aberto.data)}`}
        rodape={
          aberto && (
            <>
              <Botao onClick={() => avisar('PDF do pedido gerado', 'info')}>
                <FileText size={15} /> PDF
              </Botao>
              {aberto.status === 'Aguardando liberação' && (
                <Botao primario onClick={() => (avisar(`Pedido ${aberto.numero} enviado para liberação de crédito`), setAberto(null))}>
                  Pedir liberação
                </Botao>
              )}
            </>
          )
        }
      >
        {aberto && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Pill tom={tomPedido[aberto.status]}>{aberto.status}</Pill>
              <span className="flex items-center gap-2 text-[13px] text-c-sub">
                <Avatar nome={aberto.vendedor} tam={20} /> {aberto.vendedor}
              </span>
            </div>
            {aberto.status !== 'Cancelado' && (
              <div className="flex gap-1">
                {ETAPAS_PEDIDO.map((e, i) => {
                  const ok = etapaPedido(aberto) >= i
                  return (
                    <div key={e} className="flex-1">
                      <div className={`h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-c-hover'}`} />
                      <span className={`mt-1.5 block text-[11px] ${ok ? 'font-medium' : 'text-c-fraco'}`}>{e}</span>
                    </div>
                  )
                })}
              </div>
            )}
            <div>
              <p className="mb-2 text-[12.5px] font-medium text-c-sub">Itens</p>
              <ul className="divide-y divide-c-borda rounded-xl border border-c-borda">
                {itens.map((it) => (
                  <li key={it.nome} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[13px]">
                    <span>
                      <span className="block font-medium">{it.nome}</span>
                      <span className="block text-[12px] text-c-fraco">
                        {it.qtd} × {it.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </span>
                    <span className="font-medium tabular-nums">{(it.qtd * it.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-c-hover px-4 py-3">
              <span className="text-[13px] text-c-sub">Total do pedido</span>
              <span className="text-[18px] font-semibold tabular-nums">{itens.reduce((t, it) => t + it.qtd * it.preco, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        )}
      </Gaveta>
    </>
  )
}

