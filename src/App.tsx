import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Cotacao } from './types/cotacao'
import { CotacaoCard } from './components/CotacaoCard'
import { GraficoHistorico } from './components/GraficoHistorico'
import { TabelaCotacoes } from './components/TabelaCotacoes'

export default function App() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([])
  const [loading, setLoading] = useState(true)

  async function buscarCotacoes() {
    const { data } = await supabase
      .from('cotacoes')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(50)

    console.log('data:', data)
    console.log('error:', Error)

    if (data) setCotacoes(data)
    setLoading(false)
  }

  useEffect(() => {
    buscarCotacoes()

    const intervalo = setInterval(buscarCotacoes, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const ultimasCotacoes = ['USD', 'EUR', 'BTC', 'ETH'].map(moeda =>
    cotacoes.find(c => c.moeda === moeda)
  ).filter(Boolean) as Cotacao[]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        💰 Dashboard de Cotações
      </h1>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ultimasCotacoes.map(c => (
              <CotacaoCard key={c.moeda} cotacao={c} />
            ))}
          </div>
          <GraficoHistorico cotacoes={[...cotacoes].reverse()} />
          <TabelaCotacoes cotacoes={cotacoes} />
        </div>
      )}
    </div>
  )
}