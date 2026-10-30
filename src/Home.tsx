import { Link } from 'react-router-dom'

const projetos = [
  {
    to: '/crm',
    nome: 'Portal de vendas e CRM',
    ano: '2025 – hoje',
    texto:
      'Sistema que um time comercial usa o dia inteiro. Antes era tudo planilha e consulta direto no ERP; hoje o vendedor abre a ficha do cliente e vê pedidos, ligações, reclamações e oportunidades num lugar só.',
    ver: ['painel do mês com meta x realizado', 'pipeline em kanban (dá pra arrastar)', 'ficha do cliente com linha do tempo e resumo automático do histórico', 'pedidos com filtro e exportação pra Excel'],
    stack: 'React, TypeScript · em produção: Spring Boot, SQL Server, integração com ERP Sankhya e WhatsApp',
  },
  {
    to: '/rh',
    nome: 'Central de RH',
    ano: '2026',
    texto:
      'Portal de RH para um grupo com mais de uma empresa. Junta o que o RH fazia em e-mail e planilha: cadastro de pessoas, processo seletivo, treinamentos, pesquisa de clima e até reserva de sala.',
    ver: ['início com admissões, experiência vencendo e aniversariantes', 'processo seletivo por vaga (arraste os candidatos)', 'treinamentos e PDI', 'pesquisa de clima com eNPS', 'agenda de salas (clique pra reservar)'],
    stack: 'React, TypeScript · em produção: Next.js, Spring Boot, PostgreSQL',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-800">
      <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
        <p className="font-mono text-[12px] text-stone-400">samuel silva · desenvolvedor</p>
        <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight text-stone-900 md:text-[34px]">Oi, sou o Samuel.</h1>
        <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-stone-700">
          <p>
            Sou desenvolvedor full stack há um ano e meio. Faço sistema interno e integração: portal de vendas e CRM, central de RH, integração de ERP com loja virtual e
            WhatsApp, robô que busca dado em site do governo, relatório que antes alguém montava na mão toda segunda.
          </p>
          <p>
            No back-end uso Java com Spring Boot (e Node ou Python quando faz mais sentido). Na tela, React com TypeScript. Banco é SQL Server ou PostgreSQL, e coloco no ar em servidor Linux com Docker.
          </p>
          <p>Abaixo estão duas versões de demonstração de sistemas que fiz. A empresa e os dados são inventados, então pode clicar em tudo.</p>
        </div>

        <div className="mt-12 space-y-10">
          {projetos.map((p) => (
            <article key={p.to} className="border-t border-stone-300 pt-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[18px] font-semibold text-stone-900">{p.nome}</h2>
                <span className="shrink-0 font-mono text-[12px] text-stone-400">{p.ano}</span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-stone-700">{p.texto}</p>
              <p className="mt-3 text-[13px] font-medium text-stone-500">O que dá pra ver na demo:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[14px] text-stone-700">
                {p.ver.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-[12px] text-stone-500">{p.stack}</p>
              <Link to={p.to} className="mt-4 inline-block border-b-2 border-stone-900 pb-0.5 text-[14px] font-medium text-stone-900 hover:border-amber-600 hover:text-amber-700">
                Abrir a demo →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 border-t border-stone-300 pt-6 text-[14px] leading-relaxed text-stone-600">
          <p>
            Também já fiz integração com gateway de pagamento, plataformas de licitação, Outlook, Chatwoot e Blip, além de transcrição de ligações com IA. Se o seu projeto é tirar a empresa das planilhas,
            ligar um sistema no outro ou automatizar alguma rotina chata, me chama pela plataforma onde você me encontrou.
          </p>
        </div>
      </div>
    </div>
  )
}
