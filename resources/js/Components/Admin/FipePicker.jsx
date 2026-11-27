import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const moeda = (valor) => Number(valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const hojeIso = () => new Date().toISOString().slice(0, 10);

const btnSecundario = "bg-dark-800 text-dark-50 font-bold px-5 py-2.5 rounded-lg border border-white/[0.07] hover:border-accent transition-colors disabled:opacity-50 min-h-[44px]";

// Busca o valor na tabela FIPE com marca, modelo, ano e combustível do formulário.
// O usuário escolhe a versão certa entre as opções. Nada é salvo até o carro ser salvo.
export default function FipePicker({ form, setForm }) {
    const [buscando, setBuscando] = useState(false);
    const [candidatos, setCandidatos] = useState(null);
    const [erro, setErro] = useState("");
    const [confirmarRemover, setConfirmarRemover] = useState(false);

    const podeBuscar = form.marca && form.modelo && form.ano;

    const buscar = async () => {
        setBuscando(true);
        setErro("");
        setCandidatos(null);

        const params = new URLSearchParams({
            marca: form.marca,
            modelo: form.modelo,
            ano: form.ano,
            combustivel: form.combustivel ?? "",
        });

        try {
            const resposta = await fetch(`/admin/fipe/buscar?${params}`, {
                headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(dados.erro ?? "Não foi possível consultar a FIPE.");
            } else if (!dados.candidatos.length) {
                setErro("Nenhuma versão encontrada para esse modelo e ano. Confira o nome do modelo ou preencha o valor à mão.");
            } else {
                setCandidatos(dados.candidatos);
            }
        } catch (e) {
            setErro("Não foi possível consultar a FIPE. Tente novamente.");
        } finally {
            setBuscando(false);
        }
    };

    const escolher = (c) => {
        setForm((prev) => ({
            ...prev,
            fipe_codigo: c.codigo_fipe,
            fipe_valor: c.valor,
            fipe_referencia: c.referencia,
            fipe_consultado_em: hojeIso(),
        }));
        setCandidatos(null);
    };

    const remover = () => {
        setForm((prev) => ({
            ...prev,
            fipe_codigo: "",
            fipe_valor: "",
            fipe_referencia: "",
            fipe_consultado_em: "",
        }));
        setConfirmarRemover(false);
    };

    const preco = Number(form.preco);
    const valorFipe = Number(form.fipe_valor);
    const diferenca = form.fipe_valor && preco ? ((preco - valorFipe) / valorFipe) * 100 : null;

    return (
        <div id="fipe" className="border-t border-white/[0.06] pt-6 space-y-4 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="font-archivo font-black text-base">Tabela FIPE</h3>
                    <p className="text-dark-400 text-sm mt-1">Valor de referência de mercado. Não aparece no site.</p>
                </div>
                <button type="button" onClick={buscar} disabled={!podeBuscar || buscando} className={btnSecundario}>
                    {buscando ? "Buscando..." : "Buscar na FIPE"}
                </button>
            </div>

            {!podeBuscar && <p className="text-xs text-dark-400">Preencha marca, modelo e ano para buscar.</p>}

            {form.fipe_codigo && (
                <div className="bg-dark-800 border border-white/[0.07] rounded-lg p-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-dark-400">Valor FIPE salvo</p>
                        <p className="font-archivo font-black text-xl text-accent">{moeda(form.fipe_valor)}</p>
                        <p className="text-xs text-dark-400 mt-1">
                            Código {form.fipe_codigo} · referência {form.fipe_referencia}
                        </p>
                        {diferenca !== null && (
                            <p className={`text-xs font-bold mt-1 ${diferenca <= 0 ? "text-green-400" : "text-orange-300"}`}>
                                Preço anunciado {diferenca <= 0 ? "abaixo" : "acima"} da FIPE em {Math.abs(diferenca).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setConfirmarRemover(true)}
                        className="min-h-[44px] px-2 text-xs font-bold uppercase text-dark-400 hover:text-red-400 transition-colors"
                    >
                        Remover
                    </button>
                </div>
            )}

            {erro && (
                <div role="alert" className="flex gap-3 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <span aria-hidden="true" className="text-orange-300 font-black text-lg leading-none">!</span>
                    <p className="text-sm text-orange-200">{erro}</p>
                </div>
            )}

            {candidatos && (
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-dark-400">Escolha a versão</p>
                    <ul className="divide-y divide-white/[0.06] border border-white/[0.07] rounded-lg">
                        {candidatos.map((c) => (
                            <li key={c.codigo_fipe} className="flex items-center justify-between gap-4 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{c.nome}</p>
                                    <p className="text-xs text-dark-400">{c.ano} · {c.combustivel} · {c.referencia}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold whitespace-nowrap">{moeda(c.valor)}</span>
                                    <button type="button" onClick={() => escolher(c)} className="text-accent text-sm font-bold hover:opacity-70 min-h-[44px] px-2">
                                        Usar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button type="button" onClick={() => setCandidatos(null)} className="text-xs text-dark-400 hover:text-accent min-h-[44px]">
                        Cancelar busca
                    </button>
                </div>
            )}

            <ConfirmDialog
                aberto={confirmarRemover}
                titulo="Remover valor FIPE?"
                mensagem="O valor de referência será apagado deste carro. Você pode buscar de novo depois."
                textoConfirmar="Remover"
                perigo
                onConfirmar={remover}
                onCancelar={() => setConfirmarRemover(false)}
            />
        </div>
    );
}
