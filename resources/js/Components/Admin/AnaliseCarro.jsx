import { BarrasHorizontais, Colunas, Indicador, moeda, numero } from "./Graficos";

// Painel de análise de um carro específico. Só é exibido para admin e super_admin.
export default function AnaliseCarro({ analise }) {
    const { kpis, composicao, porMes } = analise;

    const percentual = kpis.margem_percentual === null
        ? "Sem preço de compra"
        : `${kpis.margem_percentual.toLocaleString("pt-BR")}% sobre o investido`;

    return (
        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 space-y-6 mb-8">
            <div>
                <h2 className="font-archivo font-black text-xl">Análise deste veículo</h2>
                <p className="text-dark-400 text-sm mt-1">Dados internos. Não aparecem no site.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Indicador titulo="Investido" valor={moeda(kpis.investido)} detalhe="Compra + reforma + custos extras" />
                <Indicador
                    titulo="Margem estimada"
                    valor={kpis.margem === null ? "—" : moeda(kpis.margem)}
                    detalhe={percentual}
                    destaque={kpis.margem !== null && kpis.margem >= 0}
                />
                <Indicador titulo="Preço anunciado" valor={moeda(kpis.preco_anunciado)} />
                <Indicador
                    titulo="Tempo em estoque"
                    valor={kpis.dias_em_estoque === null ? "—" : `${numero(kpis.dias_em_estoque)} dias`}
                    detalhe="Desde a data de entrada"
                />
            </div>

            <BarrasHorizontais
                titulo="Composição do investimento"
                descricao={`${numero(kpis.qtd_custos)} custo${kpis.qtd_custos === 1 ? "" : "s"} extra${kpis.qtd_custos === 1 ? "" : "s"} lançado${kpis.qtd_custos === 1 ? "" : "s"}.`}
                itens={composicao}
                vazio="Preencha o preço de compra ou lance custos extras para ver a composição."
            />

            {porMes.length > 0 && (
                <Colunas
                    titulo="Custos extras por mês"
                    descricao="Pela data de cada lançamento."
                    itens={porMes}
                />
            )}
        </div>
    );
}
