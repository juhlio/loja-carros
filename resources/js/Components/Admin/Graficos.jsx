// Gráficos simples para as telas de análise. Barras em HTML/CSS, com rótulos diretos.
// Passar o mouse mostra o detalhe de cada barra. Valores negativos aparecem em vermelho.

export const moeda = (valor) => Number(valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const numero = (valor) => Number(valor ?? 0).toLocaleString("pt-BR");

// "1 veículo", "2 veículos". Evita o plural errado em contagens.
export const contar = (quantidade, singular, plural = `${singular}s`) =>
    `${numero(quantidade)} ${Number(quantidade) === 1 ? singular : plural}`;

const cardCls = "bg-dark-900 border border-white/[0.07] rounded-2xl p-6 min-w-0";

function Cabecalho({ titulo, descricao }) {
    return (
        <div className="mb-5">
            <h2 className="font-archivo font-black text-lg">{titulo}</h2>
            {descricao && <p className="text-dark-400 text-sm mt-1">{descricao}</p>}
        </div>
    );
}

export function BarrasHorizontais({ titulo, descricao, itens, formatar = moeda, vazio = "Sem dados para mostrar." }) {
    if (!itens.length) {
        return (
            <div className={cardCls}>
                <Cabecalho titulo={titulo} descricao={descricao} />
                <p className="text-dark-400 text-sm py-8 text-center">{vazio}</p>
            </div>
        );
    }

    const maior = Math.max(...itens.map((i) => Math.abs(i.value)), 1);

    return (
        <div className={cardCls}>
            <Cabecalho titulo={titulo} descricao={descricao} />
            <ul className="space-y-4">
                {itens.map((item) => {
                    const largura = (Math.abs(item.value) / maior) * 100;
                    const negativo = item.value < 0;

                    return (
                        <li key={item.label} className="group" title={item.detalhe ? `${item.label}: ${item.detalhe}` : item.label}>
                            <div className="flex items-baseline justify-between gap-4 mb-1.5">
                                <span className="text-sm font-semibold truncate">{item.label}</span>
                                <span className={`text-sm font-bold whitespace-nowrap ${negativo ? "text-red-400" : "text-dark-50"}`}>
                                    {formatar(item.value)}
                                </span>
                            </div>
                            <div className="h-3 bg-dark-800 rounded-full overflow-hidden" role="presentation">
                                <div
                                    className={`h-full rounded-full transition-all ${negativo ? "bg-red-500" : "bg-accent"}`}
                                    style={{ width: `${largura}%` }}
                                />
                            </div>
                            {item.detalhe && <p className="text-xs text-dark-400 mt-1">{item.detalhe}</p>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// Colunas verticais com eixo Y (0 até o maior valor) e linhas de grade.
export function Colunas({ titulo, descricao, itens, formatar = moeda }) {
    const maior = Math.max(...itens.map((i) => i.value), 1);
    const marcas = [1, 0.75, 0.5, 0.25, 0];

    return (
        <div className={cardCls}>
            <Cabecalho titulo={titulo} descricao={descricao} />
            <div className="flex gap-3">
                <div className="relative h-56 w-20 shrink-0 text-right">
                    {marcas.map((m) => (
                        <span
                            key={m}
                            className="absolute right-0 -translate-y-1/2 text-[10px] text-dark-400 whitespace-nowrap"
                            style={{ top: `${(1 - m) * 100}%` }}
                        >
                            {formatar(maior * m)}
                        </span>
                    ))}
                </div>

                <div className="relative flex-1 min-w-0">
                    {marcas.map((m) => (
                        <div
                            key={m}
                            className="absolute left-0 right-0 border-t border-white/[0.06]"
                            style={{ top: `${(1 - m) * 100}%` }}
                            aria-hidden="true"
                        />
                    ))}

                    <div className="relative flex items-end gap-2 h-56">
                        {itens.map((item) => {
                            const altura = (item.value / maior) * 100;

                            return (
                                <div
                                    key={item.label}
                                    className="flex-1 flex flex-col items-center justify-end h-full min-w-0"
                                    title={`${item.label}: ${formatar(item.value)}`}
                                >
                                    <div
                                        className="w-full bg-accent rounded-t-md min-h-[2px] transition-all"
                                        style={{ height: `${altura}%` }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-2 pl-[92px]">
                {itens.map((item) => (
                    <span key={item.label} className="flex-1 text-center text-[10px] uppercase text-dark-400 truncate">{item.label}</span>
                ))}
            </div>
        </div>
    );
}

export function Indicador({ titulo, valor, detalhe, destaque = false }) {
    return (
        <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 min-w-0">
            <p className="text-xs font-bold uppercase text-dark-400 mb-2">{titulo}</p>
            <p className={`font-archivo font-black text-xl 2xl:text-2xl whitespace-nowrap ${destaque ? "text-accent" : ""}`}>{valor}</p>
            {detalhe && <p className="text-xs text-dark-400 mt-1">{detalhe}</p>}
        </div>
    );
}
