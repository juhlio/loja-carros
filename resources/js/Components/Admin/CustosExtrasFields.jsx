import { useState } from "react";
import { router } from "@inertiajs/react";
import MoneyInput from "./MoneyInput";
import ConfirmDialog from "./ConfirmDialog";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

const formatarMoeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
};

const hojeIso = () => new Date().toISOString().slice(0, 10);

const novoVazio = () => ({ descricao: "", categoria: "manutencao", valor: "", data: hojeIso() });

// Lista de custos extras do carro, com botão para adicionar. Cada lançamento é salvo na hora.
export default function CustosExtrasFields({ carroId, custos, categorias }) {
    const [aberto, setAberto] = useState(false);
    const [novo, setNovo] = useState(novoVazio());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [paraRemover, setParaRemover] = useState(null);

    const set = (e) => {
        const { name, value } = e.target;
        setNovo(prev => ({ ...prev, [name]: value }));
    };

    const adicionar = () => {
        setLoading(true);
        router.post(`/admin/carros/${carroId}/custos`, novo, {
            preserveScroll: true,
            onSuccess: () => {
                setNovo(novoVazio());
                setErrors({});
                setAberto(false);
            },
            onError: (errs) => setErrors(errs),
            onFinish: () => setLoading(false),
        });
    };

    const confirmarRemocao = () => {
        router.delete(`/admin/carros/${carroId}/custos/${paraRemover.id}`, {
            preserveScroll: true,
            onFinish: () => setParaRemover(null),
        });
    };

    const total = custos.reduce((soma, c) => soma + Number(c.valor), 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-dark-400 whitespace-nowrap">Total de custos extras</p>
                    <p className="font-archivo font-black text-2xl whitespace-nowrap">{formatarMoeda(total)}</p>
                </div>
                <button
                    type="button"
                    onClick={() => setAberto(v => !v)}
                    aria-expanded={aberto}
                    className="bg-dark-800 text-accent border border-accent font-bold px-5 py-2.5 rounded-lg hover:bg-accent hover:text-dark-950 transition-colors whitespace-nowrap min-h-[44px] self-start sm:self-auto"
                >
                    {aberto ? "Fechar" : "+ Adicionar custo"}
                </button>
            </div>

            {aberto && (
                <div className="bg-dark-800 border border-white/[0.07] rounded-xl p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="custo-descricao" className={labelCls}>Descrição *</label>
                            <input id="custo-descricao" type="text" name="descricao" value={novo.descricao} onChange={set} placeholder="Ex: Troca de óleo e filtro" className={inputCls} />
                            {errors.descricao && <p className="mt-1 text-sm text-red-400">{errors.descricao}</p>}
                        </div>
                        <div>
                            <label htmlFor="custo-categoria" className={labelCls}>Categoria *</label>
                            <select id="custo-categoria" name="categoria" value={novo.categoria} onChange={set} className={inputCls}>
                                {Object.entries(categorias).map(([valor, rotulo]) => (
                                    <option key={valor} value={valor}>{rotulo}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="custo-valor" className={labelCls}>Valor *</label>
                            <MoneyInput
                                name="valor"
                                value={novo.valor}
                                onChange={(valor) => setNovo(prev => ({ ...prev, valor }))}
                                className={inputCls}
                            />
                            {errors.valor && <p className="mt-1 text-sm text-red-400">{errors.valor}</p>}
                        </div>
                        <div>
                            <label htmlFor="custo-data" className={labelCls}>Data *</label>
                            <input id="custo-data" type="date" name="data" value={novo.data} onChange={set} className={inputCls} />
                            {errors.data && <p className="mt-1 text-sm text-red-400">{errors.data}</p>}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={adicionar}
                        disabled={loading || !novo.descricao || !novo.valor}
                        className="w-full bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar custo"}
                    </button>
                </div>
            )}

            {custos.length > 0 ? (
                <ul className="divide-y divide-white/[0.06] border border-white/[0.07] rounded-lg">
                    {custos.map((c) => (
                        <li key={c.id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 gap-y-1 px-4 py-3">
                            <span className="text-xs text-dark-400 whitespace-nowrap sm:w-20">{formatarData(c.data)}</span>
                            <div className="min-w-0 sm:order-none order-first">
                                <p className="font-semibold break-words">{c.descricao}</p>
                                <p className="text-xs text-dark-400">{categorias[c.categoria] ?? c.categoria}</p>
                            </div>
                            <span className="font-bold text-right whitespace-nowrap">{formatarMoeda(c.valor)}</span>
                            <button
                                type="button"
                                onClick={() => setParaRemover(c)}
                                aria-label={`Remover ${c.descricao}`}
                                className="justify-self-end min-h-[44px] px-2 text-xs font-bold uppercase text-dark-400 hover:text-red-400 transition-colors"
                            >
                                Remover
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-dark-400 text-sm">Nenhum custo extra registrado.</p>
            )}

            <ConfirmDialog
                aberto={!!paraRemover}
                titulo="Remover custo?"
                mensagem={paraRemover ? `"${paraRemover.descricao}" de ${formatarMoeda(paraRemover.valor)} será removido do total do carro.` : ""}
                textoConfirmar="Remover"
                perigo
                onConfirmar={confirmarRemocao}
                onCancelar={() => setParaRemover(null)}
            />
        </div>
    );
}
