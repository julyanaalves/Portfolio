import { useEffect, useState } from 'react'

interface Profile {
  nome: string
  titulo: string
  resumo: string
  localizacao?: string
  contatos: { tipo: string; valor: string; url?: string }[]
  habilidades: string[]
  habilidades_subtopicos?: Record<string, string[]>
  experiencias: { cargo: string; empresa: string; periodo: string; descricao: string[] }[]
  formacao: { curso: string; instituicao: string; periodo: string }[]
  links?: { label: string; url: string }[]
  projetos?: {
    nome: string
    descricao: string
    tecnologias: string[]
    links?: { github?: string; demo?: string }
  }[]
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // Em dev, usamos /api via proxy; em produção (deploy) podemos servir um JSON estático.
    const isDeploy = import.meta.env.MODE === 'deploy'
    const url = isDeploy ? './profile.json' : '/api/profile'
    fetch(url)
      .then((r) => r.json())
      .then(setProfile)
      .catch(() => setProfile(null))
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-white grid place-items-center">
        <p className="text-lg opacity-80">Carregando…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* NAVBAR FIXA */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-background/70 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="#sobre" className="flex items-center gap-2 group">
            <img src="./jsa-logo.svg" alt="Logo JSA" className="h-7 w-auto" />
            <span className="sr-only">Ir para o topo</span>
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="#sobre" className="text-slate-300 hover:text-white">Sobre</a>
            <a href="#experiencia" className="text-slate-300 hover:text-white">Experiência</a>
            <a href="#projetos" className="text-slate-300 hover:text-white">Projetos</a>
            <a href="#contato" className="text-slate-300 hover:text-white">Contato</a>
          </div>
        </div>
      </nav>

      <header id="sobre" className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">{profile.nome}</h1>
        <p className="mt-1 text-primary font-medium">{profile.titulo}</p>
        <p className="text-slate-400 mt-1">{profile.localizacao || 'Recife-PE'}</p>
  <p className="mt-4 text-slate-300 text-justify">{profile.resumo}</p>

  <div id="contato" className="mt-6 flex flex-wrap gap-3">
          {profile.contatos.map((c, i) => (
            <a
              key={i}
              href={c.url || (c.tipo === 'Email' ? `mailto:${c.valor}` : c.tipo === 'Telefone' ? `tel:${c.valor}` : '#')}
              className="px-3 py-1.5 rounded-full bg-card/60 border border-white/10 hover:border-primary/50 transition"
              target={c.url ? '_blank' : undefined}
              rel={c.url ? 'noreferrer noopener' : undefined}
            >
              <span className="text-slate-300 mr-2">{c.tipo}:</span>
              <span className="text-white">{c.valor}</span>
            </a>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-12">
        <section id="experiencia">
          <h2 className="text-2xl font-semibold mb-4">Experiência</h2>
          <div className="grid gap-4">
            {profile.experiencias.map((exp, i) => (
              <article key={i} className="bg-card/60 border border-white/10 rounded-xl p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-semibold">{exp.cargo} • {exp.empresa}</h3>
                  <span className="text-sm text-slate-400">{exp.periodo}</span>
                </div>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-slate-300 text-justify">
                  {exp.descricao.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {profile.projetos && profile.projetos.length > 0 && (
          <section id="projetos">
            <h2 className="text-2xl font-semibold mb-4">Projetos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.projetos.map((p, i) => (
                <article key={i} className="bg-card/60 border border-white/10 rounded-xl p-5 flex flex-col">
                  <h3 className="text-lg font-semibold">{p.nome}</h3>
                  <p className="mt-2 text-slate-300 text-justify whitespace-pre-line">{p.descricao}</p>
                  {p.tecnologias?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tecnologias.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-full bg-card/60 border border-white/10 text-sm">{t}</span>
                      ))}
                    </div>
                  )}
                  {(p.links?.github || p.links?.demo) && (
                    <div className="mt-4 flex gap-3">
                      {p.links?.github && (
                        <a className="px-3 py-1.5 rounded-md bg-primary/80 hover:bg-primary transition text-white text-sm" href={p.links.github} target="_blank" rel="noreferrer noopener">
                          Repositório
                        </a>
                      )}
                      {p.links?.demo && (
                        <a className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition text-white text-sm" href={p.links.demo} target="_blank" rel="noreferrer noopener">
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-4">Habilidades</h2>
          {profile.habilidades_subtopicos ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {Object.entries(profile.habilidades_subtopicos).map(([categoria, itens]) => (
                <div key={categoria} className="bg-card/60 border border-white/10 rounded-xl p-4">
                  <h3 className="font-medium mb-2">{categoria}</h3>
                  <div className="flex flex-wrap gap-2">
                    {itens.map((h, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-background/70 border border-white/10 text-sm">{h}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.habilidades.map((h, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-card/60 border border-white/10">{h}</span>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Formação</h2>
          <div className="grid gap-3">
            {profile.formacao.map((f, i) => (
              <div key={i} className="bg-card/60 border border-white/10 rounded-xl p-4">
                <p className="font-medium">{f.curso}</p>
                <p className="text-slate-300">{f.instituicao}</p>
                <p className="text-sm text-slate-400">{f.periodo}</p>
              </div>
            ))}
          </div>
        </section>

  {/* Seção de contato removida, contatos exibidos apenas no topo */}

        {profile.links && profile.links.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Links</h2>
            <div className="flex flex-wrap gap-2">
              {profile.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer noopener" className="px-3 py-1.5 rounded-full bg-card/60 border border-white/10 hover:border-primary/50">
                  {l.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 text-center text-slate-400 border-t border-white/10">
        <p>© {new Date().getFullYear()} {profile.nome}. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
