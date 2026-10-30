import { useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Search, X, type LucideIcon } from 'lucide-react'

// Gerador determinístico para os dados de demonstração ficarem iguais a cada carga
export function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length)]

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const dataBR = (d: Date) => d.toLocaleDateString('pt-BR')

export function exportCsv(nome: string, linhas: Record<string, string | number>[]) {
  if (!linhas.length) return
  const cols = Object.keys(linhas[0])
  const csv = [cols.join(';'), ...linhas.map((l) => cols.map((c) => `"${String(l[c]).replace(/"/g, '""')}"`).join(';'))].join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  URL.revokeObjectURL(url)
}

export type Tema = { fundo: string; ativo: string; texto: string; destaque: string }

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; grupo?: string }

export function Shell({ marca, empresa, tema, nav, usuario, cargo, children }: { marca: ReactNode; empresa: string; tema: Tema; nav: NavItem[]; usuario: string; cargo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const { pathname } = useLocation()
  const atual = [...nav].sort((a, b) => b.to.length - a.to.length).find((n) => pathname.startsWith(n.to))
  const grupos = [...new Set(nav.map((n) => n.grupo ?? ''))]
  const lateral = (
    <div className={`flex h-full flex-col ${tema.fundo} text-[13px]`}>
      <div className="flex h-12 items-center border-b border-white/10 px-4">{marca}</div>
      <nav className="flex-1 overflow-y-auto py-2">
        {grupos.map((g) => (
          <div key={g} className="mb-2">
            {g && <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">{g}</div>}
            {nav
              .filter((n) => (n.grupo ?? '') === g)
              .map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setAberto(false)}
                  className={({ isActive }) => `flex items-center gap-2.5 border-l-2 px-4 py-[7px] ${isActive ? `${tema.ativo} border-white font-medium text-white` : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'}`}
                >
                  <n.icon size={15} strokeWidth={1.75} />
                  {n.label}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 px-4 py-3 text-white/80">
        <div className="font-medium text-white">{usuario}</div>
        <div className="text-[11px] text-white/50">{cargo}</div>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-[#f4f4f2]">
      <aside className="fixed inset-y-0 left-0 hidden w-52 lg:block">{lateral}</aside>
      {aberto && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setAberto(false)}>
          <aside className="h-full w-60" onClick={(e) => e.stopPropagation()}>
            {lateral}
          </aside>
        </div>
      )}
      <div className="lg:pl-52">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-stone-300 bg-white px-4">
          <button className="-ml-1 p-1 lg:hidden" onClick={() => setAberto(!aberto)} aria-label="Menu">
            {aberto ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="truncate text-[13px] text-stone-500">
            {empresa} <span className="mx-1 text-stone-300">/</span> <span className="text-stone-900">{atual?.label}</span>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded border border-stone-300 px-2 py-1 text-[12px] text-stone-400 md:flex">
            <Search size={13} /> Buscar
            <kbd className="ml-6 rounded border border-stone-200 px-1 font-mono text-[10px]">Ctrl K</kbd>
          </div>
          <Link to="/" className="ml-auto whitespace-nowrap text-[12px] text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline md:ml-2">
            demo · voltar ao portfólio
          </Link>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export function Titulo({ titulo, sub, acoes }: { titulo: string; sub?: string; acoes?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight text-stone-900">{titulo}</h1>
        {sub && <p className="mt-0.5 text-[13px] text-stone-500">{sub}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  )
}

export function Painel({ titulo, extra, children, className = '', semPad }: { titulo?: string; extra?: ReactNode; children: ReactNode; className?: string; semPad?: boolean }) {
  return (
    <section className={`border border-stone-300 bg-white ${className}`}>
      {titulo && (
        <div className="flex items-center justify-between border-b border-stone-200 px-3 py-2">
          <h2 className="text-[12px] font-semibold uppercase tracking-wide text-stone-600">{titulo}</h2>
          {extra && <div className="text-[12px] text-stone-500">{extra}</div>}
        </div>
      )}
      <div className={semPad ? '' : 'p-3'}>{children}</div>
    </section>
  )
}

// Faixa de indicadores no topo, colada, como em sistema de gestão
export function Indicadores({ itens }: { itens: { label: string; valor: string; nota?: string; ruim?: boolean }[] }) {
  return (
    <div className="mb-4 grid grid-cols-2 border border-stone-300 bg-white md:grid-cols-4">
      {itens.map((i, idx) => (
        <div key={i.label} className={`px-4 py-3 ${idx % 2 ? 'border-l' : ''} ${idx > 1 ? 'border-t md:border-t-0' : ''} ${idx === 2 ? 'md:border-l' : ''} border-stone-200`}>
          <div className="text-[11px] uppercase tracking-wide text-stone-500">{i.label}</div>
          <div className="mt-0.5 font-mono text-[22px] font-medium tabular-nums text-stone-900">{i.valor}</div>
          {i.nota && <div className={`text-[12px] ${i.ruim ? 'text-red-700' : 'text-stone-500'}`}>{i.nota}</div>}
        </div>
      ))}
    </div>
  )
}

const pontos: Record<string, string> = {
  verde: 'bg-green-600',
  amarelo: 'bg-amber-500',
  vermelho: 'bg-red-600',
  azul: 'bg-sky-600',
  cinza: 'bg-stone-400',
  roxo: 'bg-violet-600',
}

export function Status({ children, tom = 'cinza' }: { children: ReactNode; tom?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-stone-700">
      <span className={`h-1.5 w-1.5 rounded-full ${pontos[tom] ?? pontos.cinza}`} />
      {children}
    </span>
  )
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return <span className="rounded-sm border border-stone-300 bg-stone-50 px-1.5 py-px text-[11px] text-stone-600">{children}</span>
}

export function Botao({ children, onClick, primario, cor = 'bg-stone-900' }: { children: ReactNode; onClick?: () => void; primario?: boolean; cor?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-[13px] font-medium ${primario ? `${cor} text-white hover:opacity-90` : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50'}`}
    >
      {children}
    </button>
  )
}

export function Busca({ valor, onChange, placeholder }: { valor: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 w-full rounded-sm border border-stone-300 bg-white px-2.5 text-[13px] outline-none placeholder:text-stone-400 focus:border-stone-500 sm:w-60"
    />
  )
}

export function Select({ valor, onChange, opcoes, rotulo }: { valor: string; onChange: (v: string) => void; opcoes: string[]; rotulo?: string }) {
  return (
    <label className="inline-flex h-8 items-center gap-1 rounded-sm border border-stone-300 bg-white pl-2.5 text-[13px]">
      {rotulo && <span className="text-stone-400">{rotulo}:</span>}
      <select value={valor} onChange={(e) => onChange(e.target.value)} className="h-full bg-transparent pr-2 outline-none">
        {opcoes.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}

export function Tabela({ cols, children, rodape }: { cols: (string | [string, 'dir'])[]; children: ReactNode; rodape?: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-stone-300 bg-white">
      <table className="w-full min-w-[680px] text-[13px]">
        <thead>
          <tr className="border-b border-stone-300 bg-stone-100 text-left text-[11px] uppercase tracking-wide text-stone-500">
            {cols.map((c) => {
              const [nome, al] = Array.isArray(c) ? c : [c]
              return (
                <th key={nome} className={`px-3 py-2 font-semibold ${al === 'dir' ? 'text-right' : ''}`}>
                  {nome}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="[&>tr:nth-child(even)]:bg-stone-50/70 [&>tr]:border-b [&>tr]:border-stone-100 [&>tr:hover]:bg-amber-50/40">{children}</tbody>
      </table>
      {rodape && <div className="border-t border-stone-300 bg-stone-50 px-3 py-2 text-[12px] text-stone-500">{rodape}</div>}
    </div>
  )
}

export const Td = ({ children, className = '', dir }: { children: ReactNode; className?: string; dir?: boolean }) => (
  <td className={`px-3 py-2 ${dir ? 'text-right font-mono tabular-nums' : ''} ${className}`}>{children}</td>
)
