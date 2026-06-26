import type { Cotacao } from '../types/cotacao'

interface Props {
  cotacao: Cotacao
  max: number
  min: number
}

const moedaEmoji: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  BTC: '₿',
  ETH: 'Ξ',
}

export function CotacaoCard({ cotacao, max, min }: Props) {
  const subiu = cotacao.variacao >= 0

  return (
    <div className="bg-white rounded-2xl shadow p-4 md:p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm md:text-lg font-bold text-gray-700">
          {moedaEmoji[cotacao.moeda] ?? '💱'} {cotacao.moeda}
        </span>
        <span className={`text-xs md:text-sm font-semibold ${subiu ? 'text-green-500' : 'text-red-500'}`}>
          {subiu ? '▲' : '▼'} {Math.abs(cotacao.variacao).toFixed(2)}%
        </span>
      </div>

      <span className="text-xl md:text-3xl font-bold text-gray-900">
        R$ {cotacao.valor.toFixed(2)}
      </span>

      <div className="flex justify-between text-xs mt-1">
        <span className="text-green-500 font-semibold">▲ R$ {max.toFixed(2)}</span>
        <span className="text-red-500 font-semibold">▼ R$ {min.toFixed(2)}</span>
      </div>

      <span className="text-xs text-gray-400">
        {new Date(cotacao.criado_em).toLocaleString('pt-BR')}
      </span>
    </div>
  )
}