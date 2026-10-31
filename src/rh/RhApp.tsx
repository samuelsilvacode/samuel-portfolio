import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Briefcase,
  CalendarCheck,
  CalendarRange,
  Cake,
  Check,
  Clock,
  GraduationCap,
  Home,
  LayoutGrid,
  Mail,
  MapPin,
  MessageSquareText,
  Moon,
  Plane,
  Plus,
  Search,
  Send,
  Smile,
  Star,
  Sun,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { dataBR } from '../ui'
import { Avatar, Barra, Botao, Campo, Card, CrmProvider, Escolha, Gaveta, Mini, Modal, Pill, Segmentado, useCrm } from '../kit'
import { Busca, Sino, type ItemBusca } from '../casca'
import {
  admissoesMes,
  candidatos as candIniciais,
  climaPerguntas,
  colaboradores,
  comentariosClima,
  corDepto,
  corEtapa,
  departamentos,
  diasAberta,
  empresas,
  enps,
  etapas,
  horarios,
  notificacoesRh,
  reservasIniciais,
  salas,
  sentimento,
  serieRh,
  tempoDeCasa,
  treinamentos,
  vagas as vagasIniciais,
  type Candidato,
  type Colaborador,
  type Etapa,
  type Reserva,
  type Vaga,
} from './data'

const HOJE = new Date(2026, 9, 29)
const diasDesde = (d: Date) => Math.round((HOJE.getTime() - d.getTime()) / 86400000)
const tomSituacao = { Ativo: 'verde', Férias: 'azul', Afastado: 'vermelho', Experiência: 'amarelo' } as const

export default function RhApp() {
  return (
    <CrmProvider variante="rh">
      <Estrutura>
        <Routes>
          <Route index element={<Inicio />} />
          <Route path="pessoas" element={<Pessoas />} />
          <Route path="vagas" element={<Vagas />} />
          <Route path="treinamentos" element={<Treinamentos />} />
          <Route path="clima" element={<Clima />} />
          <Route path="salas" element={<Salas />} />
        </Routes>
      </Estrutura>
    </CrmProvider>
  )
}

// ---------- estrutura (menu no topo, diferente do CRM) ----------
function Logo() {
  return (
    <Link to="/rh" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d9773f] shadow-[0_6px_16px_-8px_rgba(217,119,63,0.9)]">
        <svg width="18" height="12" viewBox="0 0 20 14" aria-hidden>
          <path d="M3 12a7 7 0 0 1 14 0" fill="none" stroke="#fff7ed" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M1 13h18" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="titulo-serif text-[21px] leading-none">horizonte</span>
    </Link>
  )
}

function buscar(t: string): ItemBusca[] {
  const paginas: ItemBusca[] = [
    { grupo: 'Páginas', titulo: 'Início', sub: 'Resumo do dia', to: '/rh', icone: Home },
    { grupo: 'Páginas', titulo: 'Colaboradores', sub: `${colaboradores.length} pessoas`, to: '/rh/pessoas', icone: Users },
    { grupo: 'Páginas', titulo: 'Processo seletivo', sub: 'Vagas e candidatos', to: '/rh/vagas', icone: Briefcase },
    { grupo: 'Páginas', titulo: 'Treinamentos e PDI', sub: 'Plano 2026', to: '/rh/treinamentos', icone: GraduationCap },
    { grupo: 'Páginas', titulo: 'Pesquisa de clima', sub: 'Resultado 2026', to: '/rh/clima', icone: MessageSquareText },
    { grupo: 'Páginas', titulo: 'Reserva de salas', sub: 'Agenda da semana', to: '/rh/salas', icone: CalendarRange },
  ]
  const pessoas: ItemBusca[] = colaboradores.map((c) => ({ grupo: 'Colaboradores', titulo: c.nome, sub: `${c.cargo} · ${c.departamento}`, to: `/rh/pessoas?p=${c.id}`, avatar: true }))
  const vg: ItemBusca[] = vagasIniciais.map((v) => ({ grupo: 'Vagas', titulo: v.titulo, sub: `${v.empresa} · ${v.modelo}`, to: `/rh/vagas?v=${v.id}`, icone: Briefcase }))
  return [...paginas, ...vg, ...pessoas].filter((i) => !t || (i.titulo + i.sub).toLowerCase().includes(t))
}

const MENU: { to: string; label: string; icon: LucideIcon; end?: boolean; conta?: number }[] = [
  { to: '/rh', label: 'Início', icon: Home, end: true },
  { to: '/rh/pessoas', label: 'Colaboradores', icon: Users, conta: colaboradores.length },
  { to: '/rh/vagas', label: 'Processo seletivo', icon: Briefcase, conta: vagasIniciais.length },
  { to: '/rh/treinamentos', label: 'Treinamentos e PDI', icon: GraduationCap },
  { to: '/rh/clima', label: 'Pesquisa de clima', icon: MessageSquareText },
  { to: '/rh/salas', label: 'Reserva de salas', icon: CalendarRange },
]

function Estrutura({ children }: { children: ReactNode }) {
  const [convite, setConvite] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const { escuro, alternar } = useCrm()
  const { pathname } = useLocation()
  useEffect(() => {
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
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-c-borda bg-c-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 md:px-8">
          <Logo />
          <span className="ml-2 hidden rounded-full border border-c-borda px-2.5 py-0.5 text-[11.5px] text-c-sub md:inline">Grupo Horizonte</span>
          <button onClick={() => setBuscando(true)} className="ml-auto hidden h-9 w-64 items-center gap-2 rounded-full bg-c-hover px-4 text-[13px] text-c-fraco hover:text-c-sub md:flex">
            <Search size={14} /> Buscar pessoa, vaga…
            <kbd className="ml-auto text-[10.5px] font-medium">Ctrl K</kbd>
          </button>
          <button onClick={() => setBuscando(true)} className="ml-auto grid h-9 w-9 place-items-center rounded-full text-c-sub hover:bg-c-hover md:hidden" aria-label="Buscar">
            <Search size={17} />
          </button>
          <Sino notificacoes={notificacoesRh} />
          <button onClick={alternar} title={escuro ? 'Modo claro' : 'Modo escuro'} className="grid h-9 w-9 place-items-center rounded-full text-c-sub hover:bg-c-hover">
            {escuro ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Botao primario className="!rounded-full" onClick={() => setConvite(true)}>
            <UserPlus size={15} /> <span className="hidden sm:inline">Nova admissão</span>
          </Botao>
          <span className="hidden items-center gap-2 border-l border-c-borda pl-3 lg:flex">
            <Avatar nome="Renata Lopes" tam={32} />
            <span className="leading-tight">
              <span className="block text-[13px] font-medium">Renata Lopes</span>
              <span className="block text-[11.5px] text-c-fraco">Business Partner</span>
            </span>
          </span>
        </div>
        <nav className="mx-auto flex max-w-[1240px] gap-1 overflow-x-auto px-4 md:px-8">
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              className={({ isActive }) =>
                `relative flex shrink-0 items-center gap-2 px-3 pb-3 pt-1 text-[13.5px] font-medium transition ${isActive ? 'text-c-texto after:absolute after:inset-x-3 after:-bottom-px after:h-[2.5px] after:rounded-full after:bg-c-acento' : 'text-c-sub hover:text-c-texto'}`
              }
            >
              <m.icon size={15} />
              {m.label}
              {m.conta != null && <span className="rounded-full bg-c-hover px-1.5 text-[11px] font-semibold tabular-nums text-c-sub">{m.conta}</span>}
            </NavLink>
          ))}
          <Link to="/" className="ml-auto hidden shrink-0 items-center px-3 pb-3 pt-1 text-[12px] text-c-fraco hover:text-c-texto lg:flex">
            ← portfólio
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-[1240px] px-4 pb-14 pt-8 md:px-8">{children}</main>
      <Busca aberta={buscando} fechar={() => setBuscando(false)} busca={buscar} />
      <NovaAdmissao aberta={convite} fechar={() => setConvite(false)} />
    </>
  )
}

function NovaAdmissao({ aberta, fechar }: { aberta: boolean; fechar: () => void }) {
  const { avisar } = useCrm()
  const [nome, setNome] = useState('')
  const [dep, setDep] = useState(departamentos[0])
  const enviar = () => {
    avisar(`Link de pré-admissão enviado para ${nome || 'o novo colaborador'}`)
    setNome('')
    fechar()
  }
  return (
    <Modal
      aberto={aberta}
      fechar={fechar}
      titulo="Nova admissão"
      rodape={
        <>
          <Botao onClick={fechar}>Cancelar</Botao>
          <Botao primario onClick={enviar}>
            <Send size={14} /> Enviar link de pré-admissão
          </Botao>
        </>
      }
    >
      <div className="space-y-4 text-[13px]">
        <p className="text-c-sub">O colaborador recebe um link pra enviar os documentos e preencher os próprios dados, e o RH confere depois.</p>
        <label className="block">
          <span className="mb-1.5 block font-medium">Nome</span>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none placeholder:text-c-fraco focus:border-c-acento/60" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">Departamento</span>
            <select value={dep} onChange={(e) => setDep(e.target.value)} className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none focus:border-c-acento/60">
              {departamentos.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block font-medium">Início</span>
            <input type="date" defaultValue="2026-11-16" className="h-10 w-full rounded-lg border border-c-borda bg-c-card px-3 outline-none focus:border-c-acento/60" />
          </label>
        </div>
      </div>
    </Modal>
  )
}

// ---------- peças ----------
function Kpi({ titulo, valor, nota, serie, cor, icone: I, tom = 'cinza' }: { titulo: string; valor: string; nota: ReactNode; serie: { v: number }[]; cor: string; icone: LucideIcon; tom?: string }) {
  return (
    <Card className="overflow-hidden" semPad>
      <div className="px-5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-c-sub">{titulo}</span>
          <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${cor}1a`, color: cor }}>
            <I size={16} />
          </span>
        </div>
        <div className="titulo-serif mt-1.5 text-[30px] tabular-nums">{valor}</div>
        <div className="mt-1">
          <Pill tom={tom} ponto={false}>
            {nota}
          </Pill>
        </div>
      </div>
      <div className="mt-2 h-12">
        <Mini dados={serie} cor={cor} id={`rk-${titulo.replace(/\W/g, '')}`} />
      </div>
    </Card>
  )
}

function Dica({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string; payload?: { fill?: string } }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-c-borda bg-c-card px-3 py-2 text-[12px] shadow-xl">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-c-sub">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
          {p.name}: <span className="font-medium tabular-nums text-c-texto">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

function Estrelas({ nota }: { nota: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={nota.toFixed(1)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= Math.round(nota) ? 'fill-amber-400 text-amber-400' : 'text-c-borda'} />
      ))}
      <span className="ml-1 text-[11.5px] font-medium tabular-nums text-c-sub">{nota.toFixed(1)}</span>
    </span>
  )
}

// ---------- início ----------
function Inicio() {
  const { cores, avisar } = useCrm()
  const experiencia = colaboradores.filter((c) => c.situacao === 'Experiência').sort((a, b) => a.admissao.getTime() - b.admissao.getTime())
  const aniversariantes = colaboradores.filter((c) => c.aniversario.endsWith('/11')).sort((a, b) => a.aniversario.localeCompare(b.aniversario))
  const fora = colaboradores.filter((c) => c.situacao === 'Férias' || c.situacao === 'Afastado')
  const porDepto = departamentos.map((d) => ({ name: d, value: colaboradores.filter((c) => c.departamento === d).length, fill: corDepto[d] })).sort((a, b) => b.value - a.value)
  const [avaliados, setAvaliados] = useState<number[]>([])
  const [parabens, setParabens] = useState<number[]>([])
  const vencendo = experiencia.filter((c) => diasDesde(c.admissao) > 75).length

  return (
    <>
      <div className="mb-6">
        <p className="text-[13px] text-c-fraco">Quinta-feira, 29 de outubro</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.03em]">Bom dia, Renata</h1>
        <p className="mt-1 text-[14px] text-c-sub">
          {vencendo ? (
            <>
              <b className="font-semibold text-amber-600 [.escuro_&]:text-amber-400">
                {vencendo} {vencendo === 1 ? 'avaliação de experiência vence' : 'avaliações de experiência vencem'}
              </b>{' '}
              nos próximos 15 dias.
            </>
          ) : (
            'Nenhuma avaliação de experiência vencendo.'
          )}{' '}
          {aniversariantes.length} aniversariantes em novembro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi titulo="Headcount" valor={String(colaboradores.length)} nota={`${empresas.length} empresas`} serie={serieRh(2, 36, 0.02)} cor="#2f6b4f" icone={Users} />
        <Kpi titulo="Em experiência" valor={String(experiencia.length)} nota={`${vencendo} vencendo em 15 dias`} serie={serieRh(5, 4, 0.1)} cor="#d9773f" icone={Clock} tom="amarelo" />
        <Kpi titulo="Vagas abertas" valor={String(vagasIniciais.length)} nota={`${candIniciais.length} candidatos`} serie={serieRh(9, 3, 0.08)} cor="#b08a3e" icone={Briefcase} tom="amarelo" />
        <Kpi titulo="eNPS 2026" valor={String(enps.promotores - enps.detratores)} nota="+6 vs. 2025" serie={serieRh(13, 30, 0.03)} cor="#5b8c6e" icone={Smile} tom="verde" />
      </div>

      <div className="mt-4 grid items-start gap-4 xl:grid-cols-[1fr_360px]">
        <Card titulo="Avaliação de experiência" extra="45 e 90 dias" semPad>
          <ul className="divide-y divide-c-borda">
            {experiencia.map((c) => {
              const d = diasDesde(c.admissao)
              const feito = avaliados.includes(c.id)
              const urgente = d > 75
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <Avatar nome={c.nome} tam={36} />
                  <div className="min-w-[160px] flex-1">
                    <p className="text-[13.5px] font-medium">{c.nome}</p>
                    <p className="text-[12px] text-c-fraco">
                      {c.cargo} · gestor {c.gestor.split(' ')[0]}
                    </p>
                  </div>
                  <div className="w-full sm:w-44">
                    <div className="mb-1 flex justify-between text-[11.5px]">
                      <span className="text-c-fraco">dia {d} de 90</span>
                      <span className={`font-medium ${urgente ? 'text-rose-600 [.escuro_&]:text-rose-400' : d > 40 ? 'text-amber-600 [.escuro_&]:text-amber-400' : 'text-c-sub'}`}>
                        {d < 45 ? `45 dias em ${45 - d}d` : `90 dias em ${Math.max(0, 90 - d)}d`}
                      </span>
                    </div>
                    <Barra pct={(d / 90) * 100} cor={urgente ? '#ef4444' : d > 40 ? '#f59e0b' : undefined} />
                  </div>
                  <Botao
                    className={`h-8 ${feito ? '!border-emerald-500/40 !text-emerald-600' : ''}`}
                    onClick={() => {
                      if (feito) return
                      setAvaliados((l) => [...l, c.id])
                      avisar(`Formulário de avaliação enviado para ${c.gestor}`)
                    }}
                  >
                    {feito ? (
                      <>
                        <Check size={14} /> Enviado
                      </>
                    ) : (
                      'Pedir avaliação'
                    )}
                  </Botao>
                </li>
              )
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card titulo={<span className="flex items-center gap-2"><Cake size={16} className="text-pink-500" /> Aniversariantes de novembro</span>} semPad>
            <ul className="px-2 pb-2">
              {aniversariantes.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-c-hover">
                  <Avatar nome={c.nome} tam={30} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.nome}</p>
                    <p className="text-[11.5px] text-c-fraco">{c.aniversario} · {c.departamento}</p>
                  </div>
                  <button
                    onClick={() => {
                      setParabens((l) => [...l, c.id])
                      avisar(`Cartão de parabéns agendado para ${c.nome.split(' ')[0]}`)
                    }}
                    disabled={parabens.includes(c.id)}
                    className="rounded-lg px-2 py-1 text-[12px] font-medium text-c-acento hover:bg-c-acento/10 disabled:text-c-fraco"
                  >
                    {parabens.includes(c.id) ? 'agendado' : 'parabenizar'}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card titulo={<span className="flex items-center gap-2"><Plane size={16} className="text-sky-500" /> Fora hoje</span>} semPad>
            <ul className="px-2 pb-2">
              {fora.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl px-3 py-2">
                  <Avatar nome={c.nome} tam={30} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{c.nome}</span>
                  <Pill tom={tomSituacao[c.situacao]}>{c.situacao}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card titulo="Admissões e desligamentos" extra="últimos 6 meses">
          <div className="mb-2 flex gap-5 text-[12px] text-c-sub">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: cores.acento }} /> Admissões
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: cores.meta }} /> Desligamentos
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={admissoesMes} barGap={4} margin={{ left: -20, top: 6 }}>
                <CartesianGrid stroke={cores.grade} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11.5, fill: cores.eixo }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11.5, fill: cores.eixo }} axisLine={false} tickLine={false} />
                <Tooltip content={<Dica />} cursor={{ fill: 'rgb(var(--c-hover))' }} />
                <Bar dataKey="admissoes" name="Admissões" fill={cores.acento} radius={[6, 6, 0, 0]} barSize={18} isAnimationActive={false} />
                <Bar dataKey="desligamentos" name="Desligamentos" fill={cores.meta} radius={[6, 6, 0, 0]} barSize={18} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card titulo="Pessoas por departamento">
          <div className="flex items-center gap-4">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={porDepto} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none" isAnimationActive={false}>
                    {porDepto.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<Dica />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-[22px] font-semibold tabular-nums">{colaboradores.length}</div>
                  <div className="text-[11px] text-c-fraco">pessoas</div>
                </div>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-1.5 text-[12.5px]">
              {porDepto.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.fill }} />
                  <span className="truncate text-c-sub">{d.name}</span>
                  <span className="ml-auto font-medium tabular-nums">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  )
}

// ---------- colaboradores ----------
function Pessoas() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const [q, setQ] = useState('')
  const [st, setSt] = useState(params.get('f') ?? 'Todos')
  const [emp, setEmp] = useState('Todas')
  const [dep, setDep] = useState('Todos')
  const [modo, setModo] = useState<'Tabela' | 'Cartões'>('Tabela')
  const [aberto, setAberto] = useState<Colaborador | null>(() => colaboradores.find((c) => c.id === Number(params.get('p'))) ?? null)
  const [pid, setPid] = useState(params.get('p'))
  if (params.get('p') !== pid) {
    setPid(params.get('p'))
    setAberto(colaboradores.find((c) => c.id === Number(params.get('p'))) ?? null)
  }
  const { avisar } = useCrm()
  const filtros = ['Todos', 'Ativo', 'Experiência', 'Férias', 'Afastado']
  const lista = colaboradores.filter(
    (c) => (st === 'Todos' || c.situacao === st) && (emp === 'Todas' || c.empresa === emp) && (dep === 'Todos' || c.departamento === dep) && (c.nome + c.cargo).toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Colaboradores</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">Pessoas das {empresas.length} empresas do grupo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Campo valor={q} onChange={setQ} placeholder="Nome ou cargo" icone={<Search size={14} />} className="w-52" />
          <Escolha valor={emp} onChange={setEmp} opcoes={['Todas', ...empresas]} rotulo="Empresa" />
          <Escolha valor={dep} onChange={setDep} opcoes={['Todos', ...departamentos]} rotulo="Depto." />
          <Segmentado valor={modo} opcoes={['Tabela', 'Cartões'] as const} onChange={setModo} />
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
            <span className={`tabular-nums ${st === f ? 'opacity-70' : 'text-c-fraco'}`}>{f === 'Todos' ? colaboradores.length : colaboradores.filter((c) => c.situacao === f).length}</span>
          </button>
        ))}
      </div>

      {modo === 'Tabela' ? (
        <Card semPad className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-[13px]">
              <thead>
                <tr className="border-b border-c-borda text-left text-[12px] text-c-fraco">
                  <th className="px-5 pb-3 font-medium">Nome</th>
                  <th className="px-5 pb-3 font-medium">Departamento</th>
                  <th className="px-5 pb-3 font-medium">Empresa</th>
                  <th className="px-5 pb-3 font-medium">Tempo de casa</th>
                  <th className="px-5 pb-3 font-medium">Avaliação</th>
                  <th className="px-5 pb-3 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => (
                  <tr key={c.id} onClick={() => setAberto(c)} className="cursor-pointer border-b border-c-borda last:border-0 hover:bg-c-hover">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3">
                        <Avatar nome={c.nome} tam={34} />
                        <span>
                          <span className="block font-medium">{c.nome}</span>
                          <span className="block text-[12px] text-c-fraco">{c.cargo}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 text-c-sub">
                        <span className="h-2 w-2 rounded-full" style={{ background: corDepto[c.departamento] }} />
                        {c.departamento}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-c-sub">{c.empresa.replace('Horizonte ', '')}</td>
                    <td className="px-5 py-3 text-c-sub">{tempoDeCasa(c)}</td>
                    <td className="px-5 py-3">
                      <Estrelas nota={c.desempenho} />
                    </td>
                    <td className="px-5 py-3">
                      <Pill tom={tomSituacao[c.situacao]}>{c.situacao}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-c-borda px-5 py-3 text-[12px] text-c-fraco">{lista.length} colaboradores</div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lista.map((c) => (
            <button key={c.id} onClick={() => setAberto(c)} className="overflow-hidden rounded-2xl border border-c-borda bg-c-card text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-14px_rgba(16,16,40,0.3)]">
              <div className="h-14" style={{ background: `linear-gradient(120deg, ${corDepto[c.departamento]}33, transparent)` }} />
              <div className="-mt-7 px-5 pb-5">
                <span className="inline-block rounded-full ring-4 ring-c-card">
                  <Avatar nome={c.nome} tam={52} />
                </span>
                <p className="mt-2 truncate text-[14px] font-semibold">{c.nome}</p>
                <p className="truncate text-[12px] text-c-fraco">{c.cargo}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Pill tom={tomSituacao[c.situacao]}>{c.situacao}</Pill>
                  <Estrelas nota={c.desempenho} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Gaveta
        aberta={!!aberto}
        fechar={() => setAberto(null)}
        titulo={aberto?.nome}
        sub={aberto && `${aberto.cargo} · matrícula ${1000 + aberto.id}`}
        rodape={
          aberto && (
            <>
              <Botao onClick={() => avisar('Mensagem aberta no Teams', 'info')}>
                <Mail size={14} /> Mensagem
              </Botao>
              <Botao primario onClick={() => (avisar(`1:1 com ${aberto.nome.split(' ')[0]} agendado para segunda às 10h`), setAberto(null))}>
                <CalendarCheck size={14} /> Agendar 1:1
              </Botao>
            </>
          )
        }
      >
        {aberto && <Perfil c={aberto} />}
      </Gaveta>
    </>
  )
}

function Perfil({ c }: { c: Colaborador }) {
  const metas = ['Concluir Excel intermediário', 'Conduzir 2 reuniões com clientes-chave', 'Certificação em LGPD', 'Assumir a escala da equipe', 'Mentoria com o coordenador', 'Curso de negociação']
  const meta = metas[c.id % metas.length]
  const prog = [80, 45, 100, 20, 60, 10][c.id % 6]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar nome={c.nome} tam={64} />
        <div>
          <Pill tom={tomSituacao[c.situacao]}>{c.situacao}</Pill>
          <div className="mt-2">
            <Estrelas nota={c.desempenho} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['Departamento', c.departamento],
          ['Empresa', c.empresa],
          ['Admissão', dataBR(c.admissao)],
          ['Tempo de casa', tempoDeCasa(c)],
          ['Gestor', c.gestor],
          ['Aniversário', c.aniversario],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-c-hover px-3 py-2.5">
            <div className="text-[11.5px] text-c-fraco">{k}</div>
            <div className="mt-0.5 truncate text-[13px] font-medium">{v}</div>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-[12.5px] font-medium text-c-sub">PDI · ciclo 2026/27</p>
        <div className="rounded-xl border border-c-borda p-4">
          <p className="text-[13px] font-medium">{meta}</p>
          <div className="mt-2.5 flex items-center gap-3">
            <Barra pct={prog} cor={prog === 100 ? '#22c55e' : undefined} />
            <span className="text-[12px] font-semibold tabular-nums">{prog}%</span>
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[12.5px] font-medium text-c-sub">Histórico</p>
        <ol className="space-y-3 border-l border-c-borda pl-4 text-[13px]">
          <li className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-c-acento ring-4 ring-c-card" />
            <span className="font-medium">Avaliação de desempenho</span> <span className="text-c-fraco">· nota {c.desempenho.toFixed(1)} · set/2026</span>
          </li>
          <li className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-c-borda ring-4 ring-c-card" />
            <span className="font-medium">Treinamento LGPD</span> <span className="text-c-fraco">· concluído · ago/2026</span>
          </li>
          <li className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-c-borda ring-4 ring-c-card" />
            <span className="font-medium">Admissão como {c.cargo}</span> <span className="text-c-fraco">· {dataBR(c.admissao)}</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

// ---------- processo seletivo ----------
function Vagas() {
  const { search } = useLocation()
  const { avisar } = useCrm()
  const [cands, setCands] = useState(candIniciais)
  const [vagas] = useState<Vaga[]>(vagasIniciais)
  const pedida = Number(new URLSearchParams(search).get('v'))
  const [vagaId, setVagaId] = useState(() => pedida || [...vagasIniciais].sort((a, b) => b.candidatos - a.candidatos)[0].id)
  const [arrastando, setArrastando] = useState<number | null>(null)
  const [sobre, setSobre] = useState<Etapa | null>(null)
  const [aberto, setAberto] = useState<number | null>(null)
  const vaga = vagas.find((v) => v.id === vagaId)!
  const mover = (id: number, etapa: Etapa) => {
    const c = cands.find((x) => x.id === id)
    if (!c || c.etapa === etapa) return
    setCands((l) => l.map((x) => (x.id === id ? { ...x, etapa } : x)))
    avisar(etapa === 'Contratado' ? `${c.nome} contratado! Link de pré-admissão enviado.` : `${c.nome.split(' ')[0]} foi para ${etapa}`, etapa === 'Contratado' ? 'ok' : 'info')
  }
  const cand = cands.find((c) => c.id === aberto)

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Processo seletivo</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">Escolha a vaga e arraste o candidato pra próxima etapa.</p>
        </div>
        <Botao onClick={() => avisar('Vaga publicada no site de carreiras e no LinkedIn')}>
          <Plus size={15} /> Nova vaga
        </Botao>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {vagas.map((v) => {
          const n = cands.filter((c) => c.vagaId === v.id).length
          const ativa = v.id === vagaId
          return (
            <button
              key={v.id}
              onClick={() => setVagaId(v.id)}
              className={`rounded-2xl border p-4 text-left transition ${ativa ? 'border-c-acento/60 bg-c-acento/[0.06] ring-2 ring-c-acento/15' : 'border-c-borda bg-c-card hover:border-c-acento/30'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-semibold leading-snug">{v.titulo}</p>
                <span className="rounded-md bg-c-hover px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-c-sub">{n}</span>
              </div>
              <p className="mt-1 text-[12px] text-c-fraco">{v.empresa}</p>
              <div className="mt-3 flex items-center gap-2 text-[11.5px] text-c-sub">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {v.modelo}
                </span>
                <span>·</span>
                <span>aberta há {diasAberta(v)} dias</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
        {etapas.map((et) => {
          const itens = cands.filter((c) => c.vagaId === vaga.id && c.etapa === et)
          return (
            <div
              key={et}
              onDragOver={(e) => {
                e.preventDefault()
                setSobre(et)
              }}
              onDragLeave={() => setSobre((s) => (s === et ? null : s))}
              onDrop={() => {
                if (arrastando != null) mover(arrastando, et)
                setArrastando(null)
                setSobre(null)
              }}
              className={`flex min-w-[210px] flex-1 flex-col rounded-2xl border p-2 transition ${sobre === et ? 'border-c-acento/50 bg-c-acento/[0.06]' : 'border-transparent bg-c-hover/60'}`}
            >
              <div className="flex items-center gap-2 px-2 pb-2.5 pt-1.5 text-[13px] font-semibold">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: corEtapa[et] }} />
                {et}
                <span className="rounded-md bg-c-card px-1.5 text-[11px] font-semibold tabular-nums text-c-sub ring-1 ring-c-borda">{itens.length}</span>
              </div>
              <div className="min-h-[120px] space-y-2">
                {itens.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => setArrastando(c.id)}
                    onDragEnd={() => {
                      setArrastando(null)
                      setSobre(null)
                    }}
                    onClick={() => setAberto(c.id)}
                    className={`cursor-grab rounded-xl border border-c-borda bg-c-card p-3 shadow-[0_1px_2px_rgba(16,16,40,0.05)] transition hover:-translate-y-px hover:shadow-[0_8px_24px_-10px_rgba(16,16,40,0.25)] active:cursor-grabbing ${arrastando === c.id ? 'rotate-[1.5deg] opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar nome={c.nome} tam={30} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold">{c.nome}</p>
                        <p className="text-[11.5px] text-c-fraco">{c.origem}</p>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <Estrelas nota={c.nota} />
                    </div>
                  </div>
                ))}
                {!itens.length && <div className="grid h-20 place-items-center rounded-xl border border-dashed border-c-borda text-[12px] text-c-fraco">Arraste pra cá</div>}
              </div>
            </div>
          )
        })}
      </div>

      <Gaveta
        aberta={!!cand}
        fechar={() => setAberto(null)}
        titulo={cand?.nome}
        sub={cand && `Candidato a ${vagas.find((v) => v.id === cand.vagaId)?.titulo}`}
        rodape={
          cand && (
            <>
              <Botao onClick={() => (avisar(`Entrevista com ${cand.nome.split(' ')[0]} marcada para terça às 14h`), setAberto(null))}>
                <CalendarCheck size={14} /> Agendar entrevista
              </Botao>
              {cand.etapa !== 'Contratado' && (
                <Botao primario onClick={() => mover(cand.id, etapas[etapas.indexOf(cand.etapa) + 1])}>
                  Avançar etapa
                </Botao>
              )}
            </>
          )
        }
      >
        {cand && <PerfilCandidato c={cand} mover={mover} />}
      </Gaveta>
    </>
  )
}

function PerfilCandidato({ c, mover }: { c: Candidato; mover: (id: number, e: Etapa) => void }) {
  const criterios = useMemo(() => {
    const base = c.nota
    return [
      ['Experiência na área', Math.min(5, base + 0.3)],
      ['Comunicação', Math.max(2.5, base - 0.4)],
      ['Fit com o time', Math.min(5, base + 0.1)],
      ['Conhecimento técnico', Math.max(2.5, base - 0.2)],
    ] as const
  }, [c.nota])
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar nome={c.nome} tam={60} />
        <div>
          <Pill tom="roxo">{c.origem}</Pill>
          <div className="mt-2">
            <Estrelas nota={c.nota} />
          </div>
        </div>
      </div>
      <div>
        <p className="mb-2.5 text-[12.5px] font-medium text-c-sub">Etapa · clique pra mover</p>
        <div className="flex gap-1">
          {etapas.map((e, i) => {
            const ok = etapas.indexOf(c.etapa) >= i
            return (
              <button key={e} onClick={() => mover(c.id, e)} className="group flex-1 text-left">
                <div className="h-1.5 rounded-full" style={{ background: ok ? corEtapa[c.etapa] : 'rgb(var(--c-hover))' }} />
                <span className={`mt-1.5 block truncate text-[11px] ${c.etapa === e ? 'font-semibold' : 'text-c-fraco group-hover:text-c-sub'}`}>{e}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <p className="mb-3 text-[12.5px] font-medium text-c-sub">Avaliação das entrevistas</p>
        <div className="space-y-3">
          {criterios.map(([k, v]) => (
            <div key={k}>
              <div className="mb-1 flex justify-between text-[12.5px]">
                <span>{k}</span>
                <span className="font-medium tabular-nums">{v.toFixed(1)}</span>
              </div>
              <Barra pct={(v / 5) * 100} />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-c-hover p-4 text-[13px] text-c-sub">
        <p className="mb-1 font-medium text-c-texto">Anotação do RH</p>
        Boa comunicação e experiência parecida com a vaga. Pediu retorno até sexta e tem outra proposta em andamento.
      </div>
    </div>
  )
}

// ---------- treinamentos ----------
const tomTipo = { Obrigatório: 'vermelho', Desenvolvimento: 'roxo', Integração: 'azul' } as const

function Treinamentos() {
  const { avisar } = useCrm()
  const [lembrados, setLembrados] = useState<number[]>([])
  const pdis = colaboradores.slice(0, 6).map((c, i) => ({
    c,
    meta: ['Concluir Excel intermediário', 'Conduzir 2 reuniões com clientes-chave', 'Certificação em LGPD', 'Assumir a escala da equipe', 'Mentoria com o coordenador', 'Curso de negociação'][i],
    prazo: ['12/2026', '01/2027', '11/2026', '03/2027', '02/2027', '12/2026'][i],
    progresso: [80, 45, 100, 20, 60, 10][i],
  }))
  const horas = treinamentos.reduce((s, t) => s + t.carga * t.concluidos, 0)
  const geral = Math.round((treinamentos.reduce((s, t) => s + t.concluidos, 0) / treinamentos.reduce((s, t) => s + t.inscritos, 0)) * 100)
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Treinamentos e PDI</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">
            Plano 2026 · <b className="font-medium text-c-texto">{geral}%</b> concluído · {horas.toLocaleString('pt-BR')} horas de treinamento no ano
          </p>
        </div>
        <Botao onClick={() => avisar('Relatório de treinamentos exportado')}>Exportar relatório</Botao>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {treinamentos.map((t) => {
          const pct = Math.round((t.concluidos / t.inscritos) * 100)
          const faltam = Math.round((t.prazo.getTime() - HOJE.getTime()) / 86400000)
          const pend = t.inscritos - t.concluidos
          return (
            <Card key={t.id} semPad>
              <div className="px-5 pb-5 pt-1">
                <div className="flex items-center justify-between">
                  <Pill tom={tomTipo[t.tipo]}>{t.tipo}</Pill>
                  <span className={`text-[12px] ${faltam <= 7 ? 'font-medium text-rose-600 [.escuro_&]:text-rose-400' : 'text-c-fraco'}`}>termina em {faltam} dias</span>
                </div>
                <p className="mt-3 text-[15px] font-semibold">{t.nome}</p>
                <p className="text-[12px] text-c-fraco">{t.carga}h de carga horária</p>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-[24px] font-semibold tracking-[-0.03em] tabular-nums">{pct}%</span>
                  <span className="text-[12px] text-c-sub">
                    {t.concluidos} de {t.inscritos} concluíram
                  </span>
                </div>
                <div className="mt-2">
                  <Barra pct={pct} cor={pct === 100 ? '#22c55e' : undefined} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-c-borda pt-3">
                  <div className="flex -space-x-2">
                    {colaboradores.slice(t.id * 3, t.id * 3 + 4).map((c) => (
                      <span key={c.id} className="rounded-full ring-2 ring-c-card">
                        <Avatar nome={c.nome} tam={24} />
                      </span>
                    ))}
                    {t.inscritos > 4 && <span className="grid h-6 w-6 place-items-center rounded-full bg-c-hover text-[10px] font-semibold text-c-sub ring-2 ring-c-card">+{t.inscritos - 4}</span>}
                  </div>
                  {pend > 0 && (
                    <button
                      disabled={lembrados.includes(t.id)}
                      onClick={() => {
                        setLembrados((l) => [...l, t.id])
                        avisar(`Lembrete enviado para ${pend} pessoas`)
                      }}
                      className="text-[12px] font-medium text-c-acento hover:underline disabled:text-c-fraco disabled:no-underline"
                    >
                      {lembrados.includes(t.id) ? 'lembrete enviado' : `lembrar ${pend} pendentes`}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="mt-4" titulo="PDI · ciclo 2026/27" extra="plano de desenvolvimento individual" semPad>
        <ul className="divide-y divide-c-borda">
          {pdis.map((p) => (
            <li key={p.c.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
              <Avatar nome={p.c.nome} tam={34} />
              <div className="min-w-[170px] flex-1">
                <p className="text-[13.5px] font-medium">{p.c.nome}</p>
                <p className="text-[12px] text-c-fraco">{p.c.cargo}</p>
              </div>
              <div className="min-w-[200px] flex-[1.4] text-[13px]">{p.meta}</div>
              <span className="w-16 text-[12px] tabular-nums text-c-fraco">{p.prazo}</span>
              <div className="flex w-40 items-center gap-2.5">
                <Barra pct={p.progresso} cor={p.progresso === 100 ? '#22c55e' : undefined} />
                <span className="w-9 text-right text-[12px] font-semibold tabular-nums">{p.progresso}%</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

// ---------- clima ----------
function MeioAnel({ valor }: { valor: number }) {
  // eNPS vai de -100 a 100; o arco mostra onde o valor cai
  const p = (valor + 100) / 200
  const r = 80
  const c = Math.PI * r
  return (
    <svg viewBox="0 0 200 112" className="w-full max-w-[240px]">
      <defs>
        <linearGradient id="enps" x1="0" x2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="rgb(var(--c-hover))" strokeWidth="16" strokeLinecap="round" />
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="url(#enps)" strokeWidth="16" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      <text x="100" y="92" textAnchor="middle" className="fill-current text-[34px] font-semibold" style={{ fontFamily: 'Inter' }}>
        {valor}
      </text>
    </svg>
  )
}

function Clima() {
  const { cores } = useCrm()
  const total = enps.promotores + enps.neutros + enps.detratores
  const valor = enps.promotores - enps.detratores
  const radar = climaPerguntas.map((p) => ({ tema: p.tema, nota: p.nota, ano: Math.max(2.5, p.nota - 0.3 + ((p.tema.length % 3) - 1) * 0.15) }))
  const ordenado = [...climaPerguntas].sort((a, b) => a.nota - b.nota)
  const tomSent = { positivo: 'verde', neutro: 'cinza', negativo: 'vermelho' } as const
  return (
    <>
      <div className="mb-5">
        <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Pesquisa de clima 2026</h1>
        <p className="mt-1 text-[13.5px] text-c-sub">Respostas anônimas · 87% de participação · encerrada em 15/10</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <Card titulo="eNPS" extra="2025: 37">
          <div className="flex justify-center">
            <MeioAnel valor={valor} />
          </div>
          <p className="text-center text-[12.5px] font-medium text-emerald-600 [.escuro_&]:text-emerald-400">Zona de qualidade (entre 30 e 50)</p>
          <div className="mt-5 flex h-2.5 overflow-hidden rounded-full">
            <div className="bg-emerald-500" style={{ width: `${(enps.promotores / total) * 100}%` }} />
            <div className="bg-c-borda" style={{ width: `${(enps.neutros / total) * 100}%` }} />
            <div className="bg-rose-500" style={{ width: `${(enps.detratores / total) * 100}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 text-center text-[12px]">
            {(
              [
                ['Promotores', enps.promotores, 'text-emerald-600 [.escuro_&]:text-emerald-400'],
                ['Neutros', enps.neutros, 'text-c-sub'],
                ['Detratores', enps.detratores, 'text-rose-600 [.escuro_&]:text-rose-400'],
              ] as const
            ).map(([l, v, c]) => (
              <div key={l}>
                <div className={`text-[17px] font-semibold tabular-nums ${c}`}>{v}%</div>
                <div className="text-c-fraco">{l}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card titulo="Média por tema" extra={<span className="flex items-center gap-3"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: cores.acento }} />2026</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: cores.meta }} />2025</span></span>}>
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_260px]">
            <div className="h-72">
              <ResponsiveContainer>
                <RadarChart data={radar} outerRadius="78%">
                  <PolarGrid stroke={cores.grade} />
                  <PolarAngleAxis dataKey="tema" tick={{ fontSize: 11.5, fill: cores.eixo }} />
                  <PolarRadiusAxis domain={[2, 5]} tick={false} axisLine={false} />
                  <Radar name="2025" dataKey="ano" stroke={cores.meta} fill={cores.meta} fillOpacity={0.15} isAnimationActive={false} />
                  <Radar name="2026" dataKey="nota" stroke={cores.acento} fill={cores.acento} fillOpacity={0.25} strokeWidth={2} isAnimationActive={false} />
                  <Tooltip content={<Dica />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5">
              {ordenado.map((p) => (
                <li key={p.tema}>
                  <div className="mb-1 flex justify-between text-[12.5px]">
                    <span className="flex items-center gap-1.5">
                      {p.tema}
                      {p.nota < 3.5 && <Pill tom="amarelo" ponto={false}>plano de ação</Pill>}
                    </span>
                    <span className="font-semibold tabular-nums">{p.nota.toFixed(1)}</span>
                  </div>
                  <Barra pct={(p.nota / 5) * 100} cor={p.nota < 3.5 ? '#f59e0b' : undefined} />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className="mt-4" titulo="O que as pessoas disseram" extra={`${comentariosClima.length} de 112 comentários`}>
        <div className="grid gap-3 md:grid-cols-2">
          {comentariosClima.map((c, i) => (
            <div key={i} className="rounded-xl border border-c-borda p-4">
              <div className="flex items-center gap-2">
                <Pill tom="cinza" ponto={false}>
                  {c.tema}
                </Pill>
                <Pill tom={tomSent[sentimento[c.tema] ?? 'neutro']}>{sentimento[c.tema] ?? 'neutro'}</Pill>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed">“{c.texto}”</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

// ---------- salas ----------
const diasSemana = [
  ['seg', '02/11'],
  ['ter', '03/11'],
  ['qua', '04/11'],
  ['qui', '05/11'],
  ['sex', '06/11'],
]
const COR_ASSUNTO: Record<string, string> = {
  'Reunião comercial': '#4f7a8c',
  Entrevista: '#d9773f',
  '1:1': '#b5546b',
  Treinamento: '#b08a3e',
  'Alinhamento semanal': '#5b8c6e',
  'Visita de fornecedor': '#8a6a9c',
  Reunião: '#2f6b4f',
}

function Salas() {
  const { avisar } = useCrm()
  const [sala, setSala] = useState(salas[0])
  const [reservas, setReservas] = useState<Reserva[]>(reservasIniciais)
  const [visao, setVisao] = useState<'Semana' | 'Lista'>('Semana')
  const achar = (dia: number, hora: string) => reservas.find((r) => r.sala === sala && r.dia === dia && r.hora === hora)
  const alternar = (dia: number, hora: string) => {
    const r = achar(dia, hora)
    if (r) {
      if (r.quem === 'Renata') {
        setReservas((l) => l.filter((x) => x !== r))
        avisar('Reserva cancelada', 'info')
      }
      return
    }
    setReservas((l) => [...l, { sala, dia, hora, quem: 'Renata', assunto: 'Reunião' }])
    avisar(`${sala.split(' (')[0]} reservada · ${diasSemana[dia][0]} às ${hora}`)
  }
  const daSala = reservas.filter((r) => r.sala === sala)
  const ocupacao = Math.round((daSala.length / (horarios.length * 5)) * 100)
  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.03em]">Reserva de salas</h1>
          <p className="mt-1 text-[13.5px] text-c-sub">Clique num horário livre pra reservar. Clique na sua reserva pra cancelar.</p>
        </div>
        <Segmentado valor={visao} opcoes={['Semana', 'Lista'] as const} onChange={setVisao} />
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {salas.map((s) => {
          const n = reservas.filter((r) => r.sala === s).length
          const ativa = s === sala
          return (
            <button key={s} onClick={() => setSala(s)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${ativa ? 'border-c-acento/60 bg-c-acento/[0.06] ring-2 ring-c-acento/15' : 'border-c-borda bg-c-card hover:border-c-acento/30'}`}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-c-hover text-c-sub">
                <LayoutGrid size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">{s.split(' (')[0]}</span>
                <span className="block text-[12px] text-c-fraco">
                  {s.match(/\((.*)\)/)?.[1]} · {n} reservas na semana
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {visao === 'Semana' ? (
        <Card semPad className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pb-3">
            <span className="text-[13px] font-medium">2 a 6 de novembro</span>
            <span className="text-[12px] text-c-fraco">{ocupacao}% ocupada</span>
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-[760px] grid-cols-[64px_repeat(5,1fr)] border-t border-c-borda">
              <div />
              {diasSemana.map(([d, n]) => (
                <div key={d} className="border-l border-c-borda px-3 py-2.5 text-[12px]">
                  <span className="font-semibold uppercase text-c-sub">{d}</span> <span className="text-c-fraco">{n}</span>
                </div>
              ))}
              {horarios.map((h) => (
                <div key={h} className="contents">
                  <div className="border-t border-c-borda px-3 py-2 text-[11.5px] tabular-nums text-c-fraco">{h}</div>
                  {diasSemana.map((_, dia) => {
                    const r = achar(dia, h)
                    const minha = r?.quem === 'Renata'
                    const cor = r ? COR_ASSUNTO[r.assunto] ?? '#64748b' : ''
                    return (
                      <div key={dia} className="h-14 border-l border-t border-c-borda p-1">
                        <button
                          onClick={() => alternar(dia, h)}
                          className={`h-full w-full rounded-lg px-2 text-left text-[11.5px] transition ${!r ? 'text-transparent hover:bg-c-acento/[0.07] hover:text-c-acento' : minha ? 'text-white shadow-sm' : 'cursor-default'}`}
                          style={r ? (minha ? { background: cor } : { background: `${cor}1c`, color: cor, borderLeft: `3px solid ${cor}` }) : undefined}
                        >
                          {r ? (
                            <>
                              <span className="block truncate font-semibold">{r.assunto}</span>
                              <span className="block truncate opacity-80">{minha ? 'você' : r.quem}</span>
                            </>
                          ) : (
                            '+ reservar'
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card semPad>
          <ul className="divide-y divide-c-borda">
            {daSala
              .slice()
              .sort((a, b) => a.dia - b.dia || a.hora.localeCompare(b.hora))
              .map((r, i) => (
                <li key={i} className="flex items-center gap-4 px-5 py-3 text-[13px]">
                  <span className="w-20 text-c-sub">
                    <span className="font-semibold uppercase">{diasSemana[r.dia][0]}</span> {diasSemana[r.dia][1]}
                  </span>
                  <span className="w-12 tabular-nums text-c-fraco">{r.hora}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: COR_ASSUNTO[r.assunto] ?? '#64748b' }} />
                  <span className="flex-1 font-medium">{r.assunto}</span>
                  <span className="flex items-center gap-2 text-c-sub">
                    <Avatar nome={r.quem} tam={22} />
                    {r.quem === 'Renata' ? 'você' : r.quem}
                  </span>
                </li>
              ))}
          </ul>
        </Card>
      )}
    </>
  )
}

