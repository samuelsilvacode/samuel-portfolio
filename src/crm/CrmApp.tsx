import { useMemo, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Building2, Download, FileSpreadsheet, KanbanSquare, LayoutGrid, Package, Truck } from 'lucide-react'
import { Botao, Busca, Etiqueta, Indicadores, Painel, Select, Shell, Status, Tabela, Td, Titulo, brl, dataBR, exportCsv, type Tema } from '../ui'
import { clientePorId, clientes, colunas, linhaDoTempo, oportunidades as opsIniciais, pedidos, resumoIA, vendasMes, vendedores, type Coluna } from './data'

const PETROLEO = '#12454f'
const tema: Tema = { fundo: 'bg-[#12454f]', ativo: 'bg-white/10', texto: 'text-[#12454f]', destaque: '#c2410c' }

const nav = [
  { to: '/crm', label: 'Painel', icon: LayoutGrid, end: true, grupo: 'Comercial' },
  { to: '/crm/pipeline', label: 'Pipeline', icon: KanbanSquare, grupo: 'Comercial' },
  { to: '/crm/clientes', label: 'Clientes', icon: Building2, grupo: 'Comercial' },
  { to: '/crm/pedidos', label: 'Pedidos', icon: FileSpreadsheet, grupo: 'Operação' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2 text-white">
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
        <path d="M2 3h16L10 18z" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
      <span className="text-[15px] font-semibold lowercase tracking-tight">vértice</span>
      <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">vendas</span>
    </div>
  )
}

export default function CrmApp() {
  return (
    <Shell marca={<Logo />} empresa="Distribuidora Vértice" tema={tema} nav={nav} usuario="Ana Ribeiro" cargo="Coordenadora comercial">
      <Routes>
        <Route index element={<PainelComercial />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<Ficha />} />
        <Route path="pedidos" element={<Pedidos />} />
      </Routes>
    </Shell>
  )
}

const tomCliente = { Ativo: 'verde', 'Em risco': 'amarelo', Inativo: 'vermelho' } as const
const tomPedido = { Faturado: 'verde', 'Em separação': 'azul', 'Aguardando liberação': 'amarelo', Cancelado: 'vermelho' } as const
const mil = (v: number) => `${Math.round(v / 1000)} mil`
const eixo = { fontSize: 11, fill: '#78716c' }

function PainelComercial() {
  const mes = vendasMes[vendasMes.length - 1]
  const ant = vendasMes[vendasMes.length - 2]
  const variacao = Math.round((mes.realizado / ant.realizado - 1) * 100)
  const ranking = vendedores
    .map((v) => {
      const peds = pedidos.filter((p) => p.vendedor === v && p.status !== 'Cancelado')
      return { nome: v, total: peds.reduce((s, p) => s + p.valor, 0), qtd: peds.length }
    })
    .sort((a, b) => b.total - a.total)
  const ligar = clientes.filter((c) => c.status !== 'Ativo').sort((a, b) => a.ultimaCompra.getTime() - b.ultimaCompra.getTime()).slice(0, 6)
  const aberto = opsIniciais.filter((o) => o.coluna !== 'Fechado')
  return (
    <>
      <Titulo titulo="Painel comercial" sub="Outubro/2026 · todas as filiais" acoes={<Select valor="Todos" onChange={() => {}} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />} />
      <Indicadores
        itens={[
          { label: 'Faturado no mês', valor: brl(mes.realizado), nota: `${variacao >= 0 ? '+' : ''}${variacao}% sobre setembro`, ruim: variacao < 0 },
          { label: 'Meta do mês', valor: `${Math.round((mes.realizado / mes.meta) * 100)}%`, nota: `meta ${brl(mes.meta)}` },
          { label: 'Pipeline aberto', valor: brl(aberto.reduce((s, o) => s + o.valor, 0)), nota: `${aberto.length} oportunidades` },
          { label: 'Clientes sem comprar', valor: String(clientes.filter((c) => c.status !== 'Ativo').length), nota: 'há mais de 45 dias', ruim: true },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Painel titulo="Faturamento x meta" extra="últimos 12 meses">
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={vendasMes} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="mes" tick={eixo} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={mil} tick={eixo} axisLine={false} tickLine={false} width={58} />
                <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ fontSize: 12, borderRadius: 2 }} />
                <Line dataKey="meta" name="Meta" stroke="#a8a29e" strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                <Line dataKey="realizado" name="Realizado" stroke={PETROLEO} strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Painel>
        <Painel titulo="Ligar esta semana" extra={<Link to="/crm/clientes" className="underline">ver carteira</Link>} semPad>
          <ul className="divide-y divide-stone-100">
            {ligar.map((c) => (
              <li key={c.id}>
                <Link to={`/crm/clientes/${c.id}`} className="flex items-center justify-between px-3 py-2 hover:bg-stone-50">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-stone-900">{c.nome}</div>
                    <div className="text-[12px] text-stone-500">{c.vendedor.split(' ')[0]} · última compra {dataBR(c.ultimaCompra)}</div>
                  </div>
                  <Status tom={tomCliente[c.status]}>{c.status}</Status>
                </Link>
              </li>
            ))}
          </ul>
        </Painel>
        <Painel titulo="Ranking de vendedores" extra="90 dias, sem cancelados" semPad className="xl:col-span-2">
          <div className="grid md:grid-cols-[1fr_1fr]">
            <div className="h-52 p-3">
              <ResponsiveContainer>
                <BarChart data={ranking.map((r) => ({ ...r, nome: r.nome.split(' ')[0] }))} layout="vertical" margin={{ left: 4 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="nome" tick={eixo} axisLine={false} tickLine={false} width={50} />
                  <Tooltip formatter={(v: number) => brl(v)} contentStyle={{ fontSize: 12, borderRadius: 2 }} cursor={{ fill: '#f5f5f4' }} />
                  <Bar dataKey="total" name="Vendido" fill={PETROLEO} barSize={14} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <table className="w-full text-[13px] md:border-l md:border-stone-200">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-stone-500">
                  <th className="px-3 py-2 font-semibold">Vendedor</th>
                  <th className="px-3 py-2 text-right font-semibold">Pedidos</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr key={r.nome} className="border-t border-stone-100">
                    <td className="px-3 py-1.5">
                      <span className="mr-2 font-mono text-stone-400">{i + 1}</span>
                      {r.nome}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums">{r.qtd}</td>
                    <td className="px-3 py-1.5 text-right font-mono tabular-nums">{brl(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Painel>
      </div>
    </>
  )
}

function Pipeline() {
  const [ops, setOps] = useState(opsIniciais)
  const [vend, setVend] = useState('Todos')
  const [arrastando, setArrastando] = useState<number | null>(null)
  const visiveis = ops.filter((o) => vend === 'Todos' || o.vendedor === vend)
  const mover = (col: Coluna) => {
    if (arrastando == null) return
    setOps((l) => l.map((o) => (o.id === arrastando ? { ...o, coluna: col, dias: 0 } : o)))
    setArrastando(null)
  }
  return (
    <>
      <Titulo titulo="Pipeline de vendas" sub="Arraste a oportunidade para mudar de etapa" acoes={<Select valor={vend} onChange={setVend} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />} />
      <div className="flex gap-3 overflow-x-auto pb-4">
        {colunas.map((col) => {
          const itens = visiveis.filter((o) => o.coluna === col)
          return (
            <div key={col} onDragOver={(e) => e.preventDefault()} onDrop={() => mover(col)} className="flex w-64 shrink-0 flex-col border border-stone-300 bg-stone-100">
              <div className="border-b border-stone-300 bg-white px-3 py-2">
                <div className="flex justify-between text-[12px] font-semibold uppercase tracking-wide text-stone-600">
                  {col}
                  <span className="font-mono font-normal text-stone-400">{itens.length}</span>
                </div>
                <div className="font-mono text-[13px] tabular-nums text-stone-900">{brl(itens.reduce((s, o) => s + o.valor, 0))}</div>
              </div>
              <div className="min-h-[120px] space-y-2 p-2">
                {itens.map((o) => (
                  <div
                    key={o.id}
                    draggable
                    onDragStart={() => setArrastando(o.id)}
                    className={`cursor-grab border border-stone-300 bg-white p-2.5 active:cursor-grabbing ${arrastando === o.id ? 'opacity-40' : ''} ${o.dias > 20 && col !== 'Fechado' ? 'border-l-[3px] border-l-amber-500' : ''}`}
                  >
                    <Link to={`/crm/clientes/${o.clienteId}`} className="text-[13px] font-medium leading-snug text-stone-900 hover:underline">
                      {clientePorId(o.clienteId).nome}
                    </Link>
                    <div className="mt-0.5 text-[12px] text-stone-500">{o.titulo}</div>
                    <div className="mt-2 flex items-center justify-between text-[12px]">
                      <span className="font-mono font-medium tabular-nums">{brl(o.valor)}</span>
                      <span className="text-stone-400">{o.dias > 20 && col !== 'Fechado' ? `parada há ${o.dias}d` : o.vendedor.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function Clientes() {
  const [q, setQ] = useState('')
  const [st, setSt] = useState('Todos')
  const lista = clientes.filter((c) => (st === 'Todos' || c.status === st) && (c.nome + c.cidade + c.vendedor).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <Titulo titulo="Carteira de clientes" acoes={<><Busca valor={q} onChange={setQ} placeholder="Cliente, cidade ou vendedor" /><Select valor={st} onChange={setSt} opcoes={['Todos', 'Ativo', 'Em risco', 'Inativo']} rotulo="Situação" /></>} />
      <Tabela cols={['Cliente', 'Cidade', 'Vendedor', ['Compras 12m', 'dir'], ['% do potencial', 'dir'], 'Última compra', 'Situação']} rodape={`${lista.length} de ${clientes.length} clientes`}>
        {lista.map((c) => (
          <tr key={c.id}>
            <Td>
              <Link to={`/crm/clientes/${c.id}`} className="font-medium text-stone-900 hover:underline">
                {c.nome}
              </Link>{' '}
              <Etiqueta>{c.tipo}</Etiqueta>
            </Td>
            <Td>{c.cidade}</Td>
            <Td>{c.vendedor}</Td>
            <Td dir>{brl(c.compras12m)}</Td>
            <Td dir>{Math.round((c.compras12m / c.potencial) * 100)}%</Td>
            <Td>{dataBR(c.ultimaCompra)}</Td>
            <Td>
              <Status tom={tomCliente[c.status]}>{c.status}</Status>
            </Td>
          </tr>
        ))}
      </Tabela>
    </>
  )
}

function Ficha() {
  const { id } = useParams()
  const c = clientePorId(Number(id))
  const eventos = useMemo(() => linhaDoTempo(c), [c])
  const [aba, setAba] = useState<'historico' | 'pedidos' | 'oportunidades'>('historico')
  const peds = pedidos.filter((p) => p.clienteId === c.id)
  const ops = opsIniciais.filter((o) => o.clienteId === c.id)
  return (
    <>
      <div className="mb-1 text-[12px] text-stone-500">
        <Link to="/crm/clientes" className="hover:underline">
          Clientes
        </Link>{' '}
        / ficha
      </div>
      <Titulo titulo={c.nome} sub={`${c.tipo} · ${c.cidade} · contato: ${c.contato}`} acoes={<Status tom={tomCliente[c.status]}>{c.status}</Status>} />
      <Indicadores
        itens={[
          { label: 'Potencial anual', valor: brl(c.potencial) },
          { label: 'Comprado em 12 meses', valor: brl(c.compras12m), nota: `${Math.round((c.compras12m / c.potencial) * 100)}% do potencial` },
          { label: 'Última compra', valor: dataBR(c.ultimaCompra) },
          { label: 'Vendedor', valor: c.vendedor.split(' ')[0], nota: c.vendedor },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="border border-stone-300 bg-white">
          <div className="flex border-b border-stone-300 text-[13px]">
            {(
              [
                ['historico', 'Linha do tempo'],
                ['pedidos', `Pedidos (${peds.length})`],
                ['oportunidades', `Oportunidades (${ops.length})`],
              ] as const
            ).map(([k, l]) => (
              <button key={k} onClick={() => setAba(k)} className={`border-r border-stone-200 px-4 py-2 ${aba === k ? 'bg-white font-medium text-stone-900 shadow-[inset_0_-2px_0_#12454f]' : 'bg-stone-50 text-stone-500 hover:text-stone-800'}`}>
                {l}
              </button>
            ))}
          </div>
          {aba === 'historico' && (
            <table className="w-full text-[13px]">
              <tbody>
                {eventos.map((e, i) => (
                  <tr key={i} className="border-b border-stone-100 align-top">
                    <td className="w-24 whitespace-nowrap px-3 py-2 font-mono text-[12px] text-stone-400">{dataBR(e.data)}</td>
                    <td className="w-28 px-3 py-2">
                      <Etiqueta>{e.tipo}</Etiqueta>
                    </td>
                    <td className="px-3 py-2 text-stone-700">{e.texto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {aba === 'pedidos' && (
            <table className="w-full text-[13px]">
              <tbody>
                {peds.map((p) => (
                  <tr key={p.numero} className="border-b border-stone-100">
                    <td className="px-3 py-2 font-mono">{p.numero}</td>
                    <td className="px-3 py-2 text-stone-500">{dataBR(p.data)}</td>
                    <td className="px-3 py-2">
                      <Status tom={tomPedido[p.status]}>{p.status}</Status>
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{brl(p.valor)}</td>
                  </tr>
                ))}
                {!peds.length && (
                  <tr>
                    <td className="px-3 py-4 text-stone-500">Nenhum pedido nos últimos 90 dias.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {aba === 'oportunidades' && (
            <table className="w-full text-[13px]">
              <tbody>
                {ops.map((o) => (
                  <tr key={o.id} className="border-b border-stone-100">
                    <td className="px-3 py-2">{o.titulo}</td>
                    <td className="px-3 py-2 text-stone-500">{o.coluna}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{brl(o.valor)}</td>
                  </tr>
                ))}
                {!ops.length && (
                  <tr>
                    <td className="px-3 py-4 text-stone-500">Nenhuma oportunidade aberta.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="space-y-4">
          <Painel titulo="Resumo do histórico">
            <p className="text-[13px] leading-relaxed text-stone-700">{resumoIA(c, eventos)}</p>
            <p className="mt-2 text-[11px] text-stone-400">Montado a partir de pedidos, ligações, e-mails e WhatsApp do cliente.</p>
          </Painel>
          <Painel titulo="Ações rápidas" semPad>
            <div className="divide-y divide-stone-100 text-[13px]">
              {[
                [Package, 'Novo pedido'],
                [Truck, 'Consultar entregas'],
                [FileSpreadsheet, 'Tabela de preços do cliente'],
              ].map(([Ic, t]) => {
                const I = Ic as typeof Package
                return (
                  <button key={t as string} className="flex w-full items-center gap-2 px-3 py-2 text-left text-stone-700 hover:bg-stone-50">
                    <I size={14} className="text-stone-400" /> {t as string}
                  </button>
                )
              })}
            </div>
          </Painel>
        </div>
      </div>
    </>
  )
}

function Pedidos() {
  const [q, setQ] = useState('')
  const [st, setSt] = useState('Todos')
  const [vend, setVend] = useState('Todos')
  const lista = pedidos.filter(
    (p) => (st === 'Todos' || p.status === st) && (vend === 'Todos' || p.vendedor === vend) && (String(p.numero) + clientePorId(p.clienteId).nome).toLowerCase().includes(q.toLowerCase()),
  )
  const total = lista.filter((p) => p.status !== 'Cancelado').reduce((s, p) => s + p.valor, 0)
  const exportar = () =>
    exportCsv(
      'pedidos.csv',
      lista.map((p) => ({ Pedido: p.numero, Data: dataBR(p.data), Cliente: clientePorId(p.clienteId).nome, Vendedor: p.vendedor, Itens: p.itens, Valor: p.valor, Status: p.status })),
    )
  return (
    <>
      <Titulo
        titulo="Pedidos"
        acoes={
          <>
            <Busca valor={q} onChange={setQ} placeholder="Nº do pedido ou cliente" />
            <Select valor={st} onChange={setSt} opcoes={['Todos', 'Faturado', 'Em separação', 'Aguardando liberação', 'Cancelado']} rotulo="Status" />
            <Select valor={vend} onChange={setVend} opcoes={['Todos', ...vendedores]} rotulo="Vendedor" />
            <Botao onClick={exportar}>
              <Download size={14} /> Excel
            </Botao>
          </>
        }
      />
      <Tabela cols={['Pedido', 'Emissão', 'Cliente', 'Vendedor', ['Itens', 'dir'], ['Valor', 'dir'], 'Status']} rodape={`${lista.length} pedidos · ${brl(total)} sem cancelados`}>
        {lista.map((p) => (
          <tr key={p.numero}>
            <Td className="font-mono">{p.numero}</Td>
            <Td className="text-stone-500">{dataBR(p.data)}</Td>
            <Td>
              <Link to={`/crm/clientes/${p.clienteId}`} className="hover:underline">
                {clientePorId(p.clienteId).nome}
              </Link>
            </Td>
            <Td>{p.vendedor}</Td>
            <Td dir>{p.itens}</Td>
            <Td dir>{brl(p.valor)}</Td>
            <Td>
              <Status tom={tomPedido[p.status]}>{p.status}</Status>
            </Td>
          </tr>
        ))}
      </Tabela>
    </>
  )
}
