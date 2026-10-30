import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Briefcase, CalendarRange, GraduationCap, Home, MessageSquareText, Users } from 'lucide-react'
import { Busca, Etiqueta, Indicadores, Painel, Select, Shell, Status, Tabela, Td, Titulo, dataBR, type Tema } from '../ui'
import {
  admissoesMes, candidatos as candIniciais, climaPerguntas, colaboradores, comentariosClima, departamentos, empresas, enps, etapas, horarios, reservasIniciais, salas, treinamentos, vagas,
  type Etapa, type Reserva,
} from './data'

const VINHO = '#6b2737'
const tema: Tema = { fundo: 'bg-[#3d1820]', ativo: 'bg-white/10', texto: 'text-[#6b2737]', destaque: VINHO }

const nav = [
  { to: '/rh', label: 'Início', icon: Home, end: true },
  { to: '/rh/pessoas', label: 'Colaboradores', icon: Users, grupo: 'Pessoas' },
  { to: '/rh/vagas', label: 'Processo seletivo', icon: Briefcase, grupo: 'Pessoas' },
  { to: '/rh/treinamentos', label: 'Treinamentos e PDI', icon: GraduationCap, grupo: 'Desenvolvimento' },
  { to: '/rh/clima', label: 'Pesquisa de clima', icon: MessageSquareText, grupo: 'Desenvolvimento' },
  { to: '/rh/salas', label: 'Reserva de salas', icon: CalendarRange, grupo: 'Serviços' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2 text-white">
      <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
        <path d="M1 13a9 9 0 0 1 18 0" fill="none" stroke="#f4a3a8" strokeWidth="2.2" />
        <path d="M0 13h20" stroke="#f4a3a8" strokeWidth="1.5" />
      </svg>
      <span className="text-[15px] font-semibold lowercase tracking-tight">horizonte</span>
      <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">rh</span>
    </div>
  )
}

export default function RhApp() {
  return (
    <Shell marca={<Logo />} empresa="Grupo Horizonte" tema={tema} nav={nav} usuario="Renata Lopes" cargo="Business Partner de RH">
      <Routes>
        <Route index element={<Inicio />} />
        <Route path="pessoas" element={<Pessoas />} />
        <Route path="vagas" element={<Vagas />} />
        <Route path="treinamentos" element={<Treinamentos />} />
        <Route path="clima" element={<Clima />} />
        <Route path="salas" element={<Salas />} />
      </Routes>
    </Shell>
  )
}

const tomSituacao = { Ativo: 'verde', Férias: 'azul', Afastado: 'vermelho', Experiência: 'amarelo' } as const
const eixo = { fontSize: 11, fill: '#78716c' }
const HOJE = new Date(2026, 9, 29)
const diasDesde = (d: Date) => Math.round((HOJE.getTime() - d.getTime()) / 86400000)

function Inicio() {
  const experiencia = colaboradores.filter((c) => c.situacao === 'Experiência').sort((a, b) => a.admissao.getTime() - b.admissao.getTime())
  const aniversariantes = colaboradores.filter((c) => c.aniversario.endsWith('/11')).sort((a, b) => a.aniversario.localeCompare(b.aniversario))
  const ferias = colaboradores.filter((c) => c.situacao === 'Férias' || c.situacao === 'Afastado')
  return (
    <>
      <Titulo titulo="Início" sub="Quinta-feira, 29 de outubro de 2026" />
      <Indicadores
        itens={[
          { label: 'Headcount', valor: String(colaboradores.length), nota: `${empresas.length} empresas` },
          { label: 'Em experiência', valor: String(experiencia.length), nota: `${experiencia.filter((c) => diasDesde(c.admissao) > 75).length} vencendo em 15 dias`, ruim: true },
          { label: 'Vagas abertas', valor: String(vagas.length), nota: `${candIniciais.length} candidatos` },
          { label: 'eNPS 2026', valor: String(enps.promotores - enps.detratores), nota: 'zona de qualidade' },
        ]}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Painel titulo="Avaliação de experiência" extra="45 e 90 dias" semPad>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-stone-200 text-left text-[11px] uppercase tracking-wide text-stone-500">
                <th className="px-3 py-2 font-semibold">Colaborador</th>
                <th className="px-3 py-2 font-semibold">Gestor</th>
                <th className="px-3 py-2 font-semibold">Admissão</th>
                <th className="px-3 py-2 text-right font-semibold">Dias</th>
                <th className="px-3 py-2 font-semibold">Próxima etapa</th>
              </tr>
            </thead>
            <tbody>
              {experiencia.map((c) => {
                const d = diasDesde(c.admissao)
                return (
                  <tr key={c.id} className="border-b border-stone-100">
                    <td className="px-3 py-2">
                      <div className="font-medium text-stone-900">{c.nome}</div>
                      <div className="text-[12px] text-stone-500">{c.cargo}</div>
                    </td>
                    <td className="px-3 py-2">{c.gestor}</td>
                    <td className="px-3 py-2 text-stone-500">{dataBR(c.admissao)}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{d}</td>
                    <td className="px-3 py-2">
                      <Status tom={d > 75 ? 'vermelho' : d > 40 ? 'amarelo' : 'cinza'}>{d < 45 ? `45 dias em ${45 - d}d` : `90 dias em ${Math.max(0, 90 - d)}d`}</Status>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Painel>
        <div className="space-y-4">
          <Painel titulo="Aniversariantes de novembro" semPad>
            <ul className="divide-y divide-stone-100 text-[13px]">
              {aniversariantes.map((c) => (
                <li key={c.id} className="flex justify-between px-3 py-1.5">
                  <span>{c.nome}</span>
                  <span className="font-mono text-stone-500">{c.aniversario}</span>
                </li>
              ))}
            </ul>
          </Painel>
          <Painel titulo="Fora hoje" semPad>
            <ul className="divide-y divide-stone-100 text-[13px]">
              {ferias.map((c) => (
                <li key={c.id} className="flex justify-between px-3 py-1.5">
                  <span>{c.nome}</span>
                  <Status tom={tomSituacao[c.situacao]}>{c.situacao}</Status>
                </li>
              ))}
            </ul>
          </Painel>
        </div>
        <Painel titulo="Admissões e desligamentos" extra="últimos 6 meses" className="xl:col-span-2">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={admissoesMes} barGap={2}>
                <CartesianGrid stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="mes" tick={eixo} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={eixo} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 2 }} cursor={{ fill: '#f5f5f4' }} />
                <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="admissoes" name="Admissões" fill={VINHO} barSize={16} isAnimationActive={false} />
                <Bar dataKey="desligamentos" name="Desligamentos" fill="#d6d3d1" barSize={16} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Painel>
      </div>
    </>
  )
}

function Pessoas() {
  const [q, setQ] = useState('')
  const [emp, setEmp] = useState('Todas')
  const [dep, setDep] = useState('Todos')
  const lista = colaboradores.filter((c) => (emp === 'Todas' || c.empresa === emp) && (dep === 'Todos' || c.departamento === dep) && (c.nome + c.cargo).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <Titulo
        titulo="Colaboradores"
        acoes={
          <>
            <Busca valor={q} onChange={setQ} placeholder="Nome ou cargo" />
            <Select valor={emp} onChange={setEmp} opcoes={['Todas', ...empresas]} rotulo="Empresa" />
            <Select valor={dep} onChange={setDep} opcoes={['Todos', ...departamentos]} rotulo="Depto." />
          </>
        }
      />
      <Tabela cols={['Mat.', 'Nome', 'Cargo', 'Departamento', 'Empresa', 'Admissão', 'Gestor', ['Aval.', 'dir'], 'Situação']} rodape={`${lista.length} colaboradores`}>
        {lista.map((c) => (
          <tr key={c.id}>
            <Td className="font-mono text-stone-400">{String(1000 + c.id)}</Td>
            <Td className="font-medium text-stone-900">{c.nome}</Td>
            <Td>{c.cargo}</Td>
            <Td>{c.departamento}</Td>
            <Td className="text-stone-500">{c.empresa.replace('Horizonte ', '')}</Td>
            <Td className="text-stone-500">{dataBR(c.admissao)}</Td>
            <Td>{c.gestor}</Td>
            <Td dir>{c.desempenho.toFixed(1)}</Td>
            <Td>
              <Status tom={tomSituacao[c.situacao]}>{c.situacao}</Status>
            </Td>
          </tr>
        ))}
      </Tabela>
    </>
  )
}

function Vagas() {
  const [cands, setCands] = useState(candIniciais)
  const [vagaId, setVagaId] = useState(() => [...vagas].sort((a, b) => b.candidatos - a.candidatos)[0].id)
  const [arrastando, setArrastando] = useState<number | null>(null)
  const vaga = vagas.find((v) => v.id === vagaId)!
  const mover = (etapa: Etapa) => {
    if (arrastando == null) return
    setCands((l) => l.map((c) => (c.id === arrastando ? { ...c, etapa } : c)))
    setArrastando(null)
  }
  return (
    <>
      <Titulo titulo="Processo seletivo" sub="Arraste o candidato para a próxima etapa" />
      <div className="mb-4 flex flex-wrap border border-stone-300 bg-white text-[13px]">
        {vagas.map((v) => (
          <button key={v.id} onClick={() => setVagaId(v.id)} className={`border-r border-stone-200 px-4 py-2 text-left ${v.id === vagaId ? 'bg-white shadow-[inset_0_-2px_0_#6b2737]' : 'bg-stone-50 text-stone-500 hover:text-stone-800'}`}>
            <div className={v.id === vagaId ? 'font-medium text-stone-900' : ''}>{v.titulo}</div>
            <div className="text-[11px] text-stone-400">
              {v.empresa.replace('Horizonte ', '')} · {v.modelo} · {cands.filter((c) => c.vagaId === v.id).length} cand.
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {etapas.map((et) => {
          const itens = cands.filter((c) => c.vagaId === vaga.id && c.etapa === et)
          return (
            <div key={et} onDragOver={(e) => e.preventDefault()} onDrop={() => mover(et)} className="flex w-56 shrink-0 flex-col border border-stone-300 bg-stone-100">
              <div className="flex justify-between border-b border-stone-300 bg-white px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-stone-600">
                {et}
                <span className="font-mono font-normal text-stone-400">{itens.length}</span>
              </div>
              <div className="min-h-[90px] space-y-2 p-2">
                {itens.map((c) => (
                  <div key={c.id} draggable onDragStart={() => setArrastando(c.id)} className={`cursor-grab border border-stone-300 bg-white p-2.5 ${arrastando === c.id ? 'opacity-40' : ''}`}>
                    <div className="text-[13px] font-medium text-stone-900">{c.nome}</div>
                    <div className="mt-1 flex items-center justify-between text-[12px] text-stone-500">
                      <span>{c.origem}</span>
                      <span className="font-mono">{c.nota.toFixed(1)}</span>
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

function Treinamentos() {
  const pdis = colaboradores.slice(0, 6).map((c, i) => ({
    c,
    meta: ['Concluir Excel intermediário', 'Conduzir 2 reuniões com clientes-chave', 'Certificação em LGPD', 'Assumir a escala da equipe', 'Mentoria com o coordenador', 'Curso de negociação'][i],
    prazo: ['12/2026', '01/2027', '11/2026', '03/2027', '02/2027', '12/2026'][i],
    progresso: [80, 45, 100, 20, 60, 10][i],
  }))
  const barra = (pct: number) => (
    <div className="flex items-center justify-end gap-2">
      <div className="h-1.5 w-20 bg-stone-200">
        <div className="h-1.5" style={{ width: `${pct}%`, background: pct === 100 ? '#15803d' : VINHO }} />
      </div>
      <span className="w-9 text-right font-mono text-[12px] tabular-nums">{pct}%</span>
    </div>
  )
  return (
    <>
      <Titulo titulo="Treinamentos e PDI" sub="Plano anual de treinamentos 2026" />
      <Tabela cols={['Treinamento', 'Tipo', ['Carga', 'dir'], 'Prazo', ['Concluídos', 'dir'], ['Andamento', 'dir']]}>
        {treinamentos.map((t) => (
          <tr key={t.id}>
            <Td className="font-medium text-stone-900">{t.nome}</Td>
            <Td>
              <Etiqueta>{t.tipo}</Etiqueta>
            </Td>
            <Td dir>{t.carga}h</Td>
            <Td className="text-stone-500">{dataBR(t.prazo)}</Td>
            <Td dir>
              {t.concluidos}/{t.inscritos}
            </Td>
            <Td>{barra(Math.round((t.concluidos / t.inscritos) * 100))}</Td>
          </tr>
        ))}
      </Tabela>
      <h2 className="mb-2 mt-6 text-[12px] font-semibold uppercase tracking-wide text-stone-600">PDI · ciclo 2026/27</h2>
      <Tabela cols={['Colaborador', 'Cargo', 'Meta', 'Prazo', ['Progresso', 'dir']]}>
        {pdis.map((p) => (
          <tr key={p.c.id}>
            <Td className="font-medium text-stone-900">{p.c.nome}</Td>
            <Td className="text-stone-500">{p.c.cargo}</Td>
            <Td>{p.meta}</Td>
            <Td className="font-mono text-stone-500">{p.prazo}</Td>
            <Td>{barra(p.progresso)}</Td>
          </tr>
        ))}
      </Tabela>
    </>
  )
}

function Clima() {
  const total = enps.promotores + enps.neutros + enps.detratores
  const ordenado = [...climaPerguntas].sort((a, b) => b.nota - a.nota)
  return (
    <>
      <Titulo titulo="Pesquisa de clima 2026" sub="Respostas anônimas · 87% de participação · encerrada em 15/10" />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Painel titulo="Média por tema" extra="escala de 1 a 5">
          <table className="w-full text-[13px]">
            <tbody>
              {ordenado.map((p) => (
                <tr key={p.tema}>
                  <td className="w-36 py-1.5 pr-3">{p.tema}</td>
                  <td className="py-1.5">
                    <div className="h-4 bg-stone-100">
                      <div className="h-4" style={{ width: `${(p.nota / 5) * 100}%`, background: p.nota < 3.5 ? '#d97706' : VINHO }} />
                    </div>
                  </td>
                  <td className="w-12 py-1.5 text-right font-mono tabular-nums">{p.nota.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12px] text-stone-500">Temas abaixo de 3,5 entram no plano de ação do próximo trimestre.</p>
        </Painel>
        <Painel titulo="eNPS">
          <div className="font-mono text-[40px] font-medium leading-none" style={{ color: VINHO }}>
            {enps.promotores - enps.detratores}
          </div>
          <div className="mt-1 text-[12px] text-stone-500">2025: 37</div>
          <div className="mt-4 flex h-2.5">
            <div className="bg-green-700" style={{ width: `${(enps.promotores / total) * 100}%` }} />
            <div className="bg-stone-300" style={{ width: `${(enps.neutros / total) * 100}%` }} />
            <div className="bg-red-700" style={{ width: `${(enps.detratores / total) * 100}%` }} />
          </div>
          <table className="mt-3 w-full text-[12px]">
            <tbody>
              {(
                [
                  ['Promotores', enps.promotores],
                  ['Neutros', enps.neutros],
                  ['Detratores', enps.detratores],
                ] as const
              ).map(([l, v]) => (
                <tr key={l}>
                  <td className="py-0.5 text-stone-600">{l}</td>
                  <td className="py-0.5 text-right font-mono">{v}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Painel>
        <Painel titulo="Comentários" extra={`${comentariosClima.length} de 112`} semPad className="xl:col-span-2">
          <table className="w-full text-[13px]">
            <tbody>
              {comentariosClima.map((c, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="w-36 px-3 py-2">
                    <Etiqueta>{c.tema}</Etiqueta>
                  </td>
                  <td className="px-3 py-2 text-stone-700">{c.texto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Painel>
      </div>
    </>
  )
}

const diasSemana = ['seg 02/11', 'ter 03/11', 'qua 04/11', 'qui 05/11', 'sex 06/11']

function Salas() {
  const [sala, setSala] = useState(salas[0])
  const [reservas, setReservas] = useState<Reserva[]>(reservasIniciais)
  const achar = (dia: number, hora: string) => reservas.find((r) => r.sala === sala && r.dia === dia && r.hora === hora)
  const alternar = (dia: number, hora: string) => {
    const r = achar(dia, hora)
    if (r) {
      if (r.quem === 'Renata') setReservas((l) => l.filter((x) => x !== r))
      return
    }
    setReservas((l) => [...l, { sala, dia, hora, quem: 'Renata', assunto: 'Reunião' }])
  }
  return (
    <>
      <Titulo titulo="Reserva de salas" sub="Clique num horário livre para reservar. Clique na sua reserva para cancelar." acoes={<Select valor={sala} onChange={setSala} opcoes={salas} rotulo="Sala" />} />
      <div className="overflow-x-auto border border-stone-300 bg-white">
        <table className="w-full min-w-[720px] table-fixed text-[12px]">
          <thead>
            <tr className="border-b border-stone-300 bg-stone-100 text-[11px] uppercase tracking-wide text-stone-500">
              <th className="w-16 px-2 py-2" />
              {diasSemana.map((d) => (
                <th key={d} className="border-l border-stone-200 px-2 py-2 text-left font-semibold">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horarios.map((h) => (
              <tr key={h} className="border-b border-stone-100">
                <td className="px-2 py-1 font-mono text-stone-400">{h}</td>
                {diasSemana.map((_, dia) => {
                  const r = achar(dia, h)
                  const minha = r?.quem === 'Renata'
                  return (
                    <td key={dia} className="h-11 border-l border-stone-200 p-0">
                      <button
                        onClick={() => alternar(dia, h)}
                        className={`h-full w-full px-2 text-left ${!r ? 'text-transparent hover:bg-stone-50 hover:text-stone-400' : minha ? 'text-white' : 'cursor-default bg-stone-100 text-stone-600'}`}
                        style={minha ? { background: VINHO } : undefined}
                      >
                        {r ? (
                          <>
                            <div className="truncate font-medium">{r.assunto}</div>
                            <div className="truncate opacity-75">{r.quem}</div>
                          </>
                        ) : (
                          '+ reservar'
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
