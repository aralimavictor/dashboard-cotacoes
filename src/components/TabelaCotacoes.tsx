import type { Cotacao } from '../types/cotacao'

interface Props {
    cotacoes: Cotacao[]
}

export function TabelaCotacoes({ cotacoes }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-4">🗂️ Últimos registros</h2>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-400 border-b">
                        <th className="pb-2">Moeda</th>
                        <th className="pb-2">Valor (R$)</th>
                        <th className="pb-2">Variação</th>
                        <th className="pb-2">Horário</th>
                    </tr>
                </thead>
                <tbody>
                    {cotacoes.map(c => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-2 font-semibold">{c.moeda}</td>
                            <td className="py-2">{c.valor.toFixed(2)}</td>
                            <td className={`py-2 font-semibold ${c.variacao >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {c.variacao >= 0 ? '+' : ''}{c.variacao.toFixed(2)}%
                            </td>
                            <td className="py-2 text-gray-400">
                                {new Date(c.criado_em).toLocaleString('pt-BR')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}