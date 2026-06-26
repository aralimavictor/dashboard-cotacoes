import { useEffect, useState } from 'react'

interface Noticia {
  title: string
  description: string
  url: string
  source: { name: string }
  publishedAt: string
}

export function AbaNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    async function buscarNoticias() {
      try {
        const key = import.meta.env.VITE_GNEWS_API_KEY
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=finanças+economia+cripto&lang=pt&country=br&max=10&apikey=${key}`
        )
        const data = await res.json()
        setNoticias(data.articles ?? [])
      } catch {
        setErro(true)
      } finally {
        setLoading(false)
      }
    }

    buscarNoticias()
  }, [])

  if (loading) return <p className="text-gray-500">Carregando notícias...</p>
  if (erro) return <p className="text-red-500">Erro ao carregar notícias.</p>

  return (
    <div className="flex flex-col gap-4">
      {noticias.map((n, i) => (
        <a
          key={i}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl shadow p-4 md:p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-500 font-semibold">{n.source.name}</span>
            <span className="text-xs text-gray-400">
              {new Date(n.publishedAt).toLocaleString('pt-BR')}
            </span>
          </div>
          <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">{n.title}</h3>
          <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{n.description}</p>
        </a>
      ))}
    </div>
  )
}