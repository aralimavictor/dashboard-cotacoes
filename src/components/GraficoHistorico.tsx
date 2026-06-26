import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Cotacao } from '../types/cotacao'

interface Props {
    cotacoes: Cotacao[]
}

const CORES: Record<string, string> = {
    USD: '#3b82f6',
    EUR: '#8b5cf6',
    BTC: '#f59e0b',
    ETH: '#10b981',
}

export function GraficoHistorico({ cotacoes }: Props) {
    // Agrupa por horário
    const dadosAgrupados = cotacoes.reduce((acc, c) => {
        const hora = new Date(c.criado_em).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
        const existente = acc.find(d => d.hora === hora)
        if (existente) {
            existente[c.moeda] = c.valor
        } else {
            acc.push({ hora, [c.moeda]: c.valor })
        }
        return acc
    }, [] as Record<string, any>[])

    const moedas = [...new Set(cotacoes.map(c => c.moeda))]

    return (
        <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-4">📈 Histórico</h2>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dadosAgrupados}>
                    <XAxis dataKey="hora" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    {moedas.map(moeda => (
                        <Line
                            key={moeda}
                            type="monotone"
                            dataKey={moeda}
                            stroke={CORES[moeda] ?? '#6b7280'}
                            dot={false}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}