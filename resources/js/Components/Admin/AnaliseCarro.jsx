import { BarrasHorizontais, moeda, numero } from "./Graficos";

// Painel de análise de um carro específico. Só é exibido para admin e super_admin.
// A margem real é a conta completa: preço anunciado, menos o investido, menos o custo de estoque.
export default function AnaliseCarro({ analise }) {
    const { kpis, composicao } = analise;

    const margemReal = kpis.margem_liquida ?? kpis.margem;
    const margemRealRotulo = kpis.margem_liquida !== null ? "Margem real" : "Margem estimada";
    const positiva = margemReal !== null && margemReal >= 0;

    const percentual = kpis.margem_percentual === null
        ? null
        : `${kpis.margem_percentual.toLocaleString("pt-BR")}% sobre o investido`;

    const secundarios = [
        { rotulo: "Investido", valor: moeda(kpis.investido), detalhe: "Compra + reforma + custos extras" },
        { rotulo: "Preço anunciado", valor: moeda(kpis.preco_anunciado) },
        { rotulo: "Custo de estoque", valor: kpis.custo_estoque === null ? "—" : moeda(kpis.custo_estoque), detalhe: kpis.custo_mensal === null ? "Precisa do valor FIPE" : `0,8% da FIPE ao mês · hoje ${moeda(kpis.custo_diario)}/dia` },
        { rotulo: "Tempo em estoque", valor: kpis.dias_em_estoque === null ? "—" : `${numero(kpis.dias_em_estoque)} dias` },
    ];

    return (
        <section className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-8 mb-8 scroll-mt-28">
            <div>
                <h2 className="font-archivo font-black text-xl">Análise deste veículo</h2>
                <p className="text-dark-400 text-sm mt-1">Dados internos. Não aparecem no site.</p>
            </div>

            {/* Margem real em destaque, com a conta por extenso */}
            <div className="bg-dark-800 border border-white/[0.07] rounded-xl p-6">
                <p className="text-xs font-bold uppercase text-dark-400 mb-2">{margemRealRotulo}</p>
                <p className={`font-archivo font-black text-3xl sm:text-4xl whitespace-nowrap ${margemReal === null ? "text-dark-400" : positiva ? "text-green-400" : "text-red-400"}`}>
                    {margemReal === null ? "—" : moeda(margemReal)}
                </p>
                {percentual && <p className="text-sm text-dark-400 mt-1">{percentual}</p>}
                <p className="text-xs text-dark-400 mt-4 leading-relaxed">
                    {kpis.margem === null
                        ? "Preencha o preço de compra para calcular a margem."
                        : `${moeda(kpis.preco_anunciado)} anunciado − ${moeda(kpis.investido)} investido = ${moeda(kpis.margem)} de margem estimada${kpis.custo_estoque !== null ? ` − ${moeda(kpis.custo_estoque)} de custo de estoque = ${moeda(kpis.margem_liquida)}` : ""}.`}
                </p>
            </div>

            {/* Indicadores de apoio, menores */}
            <dl className="grid grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
                {secundarios.map((s) => (
                    <div key={s.rotulo} className="min-w-0">
                        <dt className="text-xs font-bold uppercase text-dark-400 mb-1">{s.rotulo}</dt>
                        <dd className="font-archivo font-black text-lg whitespace-nowrap">{s.valor}</dd>
                        {s.detalhe && <dd className="text-xs text-dark-400 mt-0.5">{s.detalhe}</dd>}
                    </div>
                ))}
            </dl>

            <BarrasHorizontais
                titulo="De onde vem o investimento"
                descricao="Preço de compra, reforma e cada categoria de custo extra."
                itens={composicao}
                vazio="Preencha o preço de compra ou lance custos extras para ver a composição."
            />
        </section>
    );
}
