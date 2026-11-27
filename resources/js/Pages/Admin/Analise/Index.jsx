import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { BarrasHorizontais, Colunas, Indicador, contar, moeda, numero } from "../../../Components/Admin/Graficos";

const SITUACAO_CORES = {
    disponivel: "text-accent",
    em_reparo: "text-orange-300",
    reservado: "text-blue-300",
    vendido: "text-dark-300",
};

export default function Index({ kpis, porSituacao, porOrigem, porCategoria, porMes, margemPorCarro, tabela }) {
    const percentual = (parte, total) => (total ? `${Math.round((parte / total) * 100)}%` : "—");

    return (
        <AdminLayout>
            <Head title="Análise do estoque" />

            <div className="mb-8">
                <h1 className="font-archivo font-black text-4xl mb-1">Análise do estoque</h1>
                <p className="text-dark-300 text-sm">
                    Dados internos do painel. Não aparecem no site. Registros de teste ficam fora desta análise.{" "}
                    <Link href="/admin/carros" className="text-accent font-semibold hover:opacity-70">Voltar para os carros</Link>
                </p>
            </div>

            {kpis.em_estoque > kpis.em_estoque_com_compra && (
                <div role="status" className="mb-8 flex gap-3 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <span aria-hidden="true" className="text-orange-300 font-black text-lg leading-none">!</span>
                    <p className="text-sm text-orange-200">
                        {contar(kpis.em_estoque - kpis.em_estoque_com_compra, "carro em estoque sem preço de compra", "carros em estoque sem preço de compra")}.
                        Os totais de investido e margem usam só os {contar(kpis.em_estoque_com_compra, "carro", "carros")} com compra registrada.
                    </p>
                </div>
            )}

            {/* Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <Indicador titulo="Veículos cadastrados" valor={numero(kpis.total)} detalhe={`${numero(kpis.em_estoque)} em estoque · ${numero(kpis.vendidos)} vendidos`} />
                <Indicador titulo="Investido em estoque" valor={moeda(kpis.investido)} detalhe={`Compra + reforma + custos. Base: ${numero(kpis.em_estoque_com_compra)} de ${numero(kpis.em_estoque)} em estoque`} />
                <Indicador titulo="Preço anunciado em estoque" valor={moeda(kpis.preco_estoque)} detalhe="Soma dos preços dos veículos não vendidos" />
                <Indicador titulo="Custos extras (total)" valor={moeda(kpis.custos_total)} detalhe="Todos os lançamentos" />
                <Indicador
                    titulo="Lucro dos vendidos"
                    valor={moeda(kpis.lucro_vendidos)}
                    detalhe="Estimativa: preço anunciado menos investido"
                    destaque={kpis.lucro_vendidos >= 0}
                />
                <Indicador titulo="Margem média (vendidos)" valor={kpis.margem_media === null ? "—" : moeda(kpis.margem_media)} detalhe="Por veículo vendido com compra registrada" />
                <Indicador titulo="Tempo médio em estoque" valor={kpis.dias_medio === null ? "—" : `${numero(kpis.dias_medio)} dias`} detalhe="Veículos não vendidos com data de entrada" />
                <Indicador titulo="Vendidos" valor={percentual(kpis.vendidos, kpis.total)} detalhe="Percentual do total cadastrado" />
            </div>

            {/* Gráficos principais */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <BarrasHorizontais
                    titulo="Investido por situação"
                    descricao="Quanto está parado em cada etapa do estoque."
                    itens={porSituacao.map((s) => ({ label: s.label, value: s.investido, detalhe: contar(s.quantidade, "veículo") }))}
                />
                <BarrasHorizontais
                    titulo="Veículos por origem"
                    descricao="De onde vieram os carros cadastrados."
                    formatar={numero}
                    itens={porOrigem.map((o) => ({ label: o.label, value: o.quantidade }))}
                    vazio="Nenhum carro com origem informada."
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <BarrasHorizontais
                    titulo="Custos extras por categoria"
                    descricao="Onde o dinheiro de manutenção está indo."
                    itens={porCategoria}
                    vazio="Nenhum custo extra lançado ainda."
                />
                <Colunas
                    titulo="Custos extras por mês"
                    descricao="Últimos 12 meses, pela data de cada lançamento."
                    itens={porMes}
                />
            </div>

            <div className="mb-6">
                <BarrasHorizontais
                    titulo="Margem por veículo"
                    descricao="Preço anunciado menos total investido. Vermelho indica prejuízo estimado."
                    itens={margemPorCarro}
                    vazio="Cadastre o preço de compra dos carros para ver a margem."
                />
            </div>

            {/* Tabela detalhada */}
            <div className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-white/[0.06]">
                    <h2 className="font-archivo font-black text-lg">Detalhe por veículo</h2>
                    <p className="text-dark-400 text-sm mt-1">Ordenado pelo total investido.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-dark-800 border-b border-white/[0.06]">
                                {["Veículo", "Situação", "Preço", "Investido", "Custos", "Margem", "Dias em estoque"].map((h, i) => (
                                    <th key={h} className={`px-6 py-3 text-xs font-bold uppercase text-dark-400 whitespace-nowrap ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tabela.map((c) => (
                                <tr key={c.id} className="border-b border-white/[0.06] hover:bg-dark-800 transition-colors">
                                    <td className="px-6 py-3 font-semibold">{c.nome}</td>
                                    <td className={`px-6 py-3 text-right font-semibold ${SITUACAO_CORES[c.situacao] ?? ""}`}>{c.situacao_label}</td>
                                    <td className="px-6 py-3 text-right whitespace-nowrap">{moeda(c.preco)}</td>
                                    <td className="px-6 py-3 text-right whitespace-nowrap">{moeda(c.total_investido)}</td>
                                    <td className="px-6 py-3 text-right whitespace-nowrap">{moeda(c.custos_total)}</td>
                                    <td className={`px-6 py-3 text-right font-bold whitespace-nowrap ${c.margem === null ? "text-dark-400" : c.margem >= 0 ? "text-green-400" : "text-red-400"}`}>
                                        {c.margem === null ? "—" : moeda(c.margem)}
                                    </td>
                                    <td className="px-6 py-3 text-right">{c.dias_em_estoque === null ? "—" : numero(c.dias_em_estoque)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
