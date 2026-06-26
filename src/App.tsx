import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Cotacao } from './types/cotacao'
import { CotacaoCard } from './components/CotacaoCard'
import { GraficoHistorico } from './components/GraficoHistorico'
import { TabelaCotacoes } from './components/TabelaCotacoes'
import { AbaNoticias } from './components/AbaNoticias'

type Aba = 'cotacoes' | 'noticias'

export default function App() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([])
  const [loading, setLoading] = useState(true)
  const [aba, setAba] = useState<Aba>('cotacoes')

  async function buscarCotacoes() {
    const { data } = await supabase
      .from('cotacoes')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(50)

    if (data) setCotacoes(data)
    setLoading(false)
  }

  useEffect(() => {
    buscarCotacoes()

    const channel = supabase
      .channel('cotacoes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cotacoes' },
        () => buscarCotacoes()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  function getMaxMin(moeda: string) {
    const hoje = new Date().toDateString()
    const registrosDia = cotacoes.filter(c =>
      c.moeda === moeda &&
      new Date(c.criado_em).toDateString() === hoje
    )

    if (registrosDia.length === 0) return { max: 0, min: 0 }

    const valores = registrosDia.map(c => c.valor)
    return {
      max: Math.max(...valores),
      min: Math.min(...valores),
    }
  }

  const ultimasCotacoes = ['USD', 'EUR', 'BTC', 'ETH'].map(moeda =>
    cotacoes.find(c => c.moeda === moeda)
  ).filter(Boolean) as Cotacao[]

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
        💰 Dashboard de Cotações
      </h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAba('cotacoes')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${aba === 'cotacoes'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
        >
          📈 Cotações
        </button>
        <button
          onClick={() => setAba('noticias')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${aba === 'noticias'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
        >
          📰 Notícias
        </button>
      </div>

      {aba === 'cotacoes' && (
        loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {ultimasCotacoes.map(c => {
                const { max, min } = getMaxMin(c.moeda)
                return (
                  <CotacaoCard key={c.moeda} cotacao={c} max={max} min={min} />
                )
              })}
            </div>
            <GraficoHistorico cotacoes={[...cotacoes].reverse()} />
            <TabelaCotacoes cotacoes={cotacoes} />
          </div>
        )
      )}

      {aba === 'noticias' && <AbaNoticias />}
    </div>
  )
}