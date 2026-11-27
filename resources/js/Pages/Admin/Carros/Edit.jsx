import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import DadosInternosFields from "../../../Components/Admin/DadosInternosFields";
import FipePicker from "../../../Components/Admin/FipePicker";
import CustosExtrasFields from "../../../Components/Admin/CustosExtrasFields";
import MoneyInput from "../../../Components/Admin/MoneyInput";
import { maskPlaca, placaValida } from "../../../lib/mascaras";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

const SECOES = [
    { id: "dados", rotulo: "Dados do veículo" },
    { id: "fotos", rotulo: "Fotos" },
    { id: "fipe", rotulo: "Tabela FIPE" },
    { id: "internos", rotulo: "Dados internos" },
    { id: "custos", rotulo: "Custos extras", somenteAdmin: true },
];

export default function Edit({ carro, podeFinanceiro, custos = [], categoriasCustos = {} }) {
    const [form, setForm] = useState(carro);
    const [novasImagens, setNovasImagens] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const setPlaca = (e) => {
        setForm(prev => ({ ...prev, placa: maskPlaca(e.target.value) }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files || []);
        setNovasImagens(files);
        setImagePreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!placaValida(form.placa)) {
            setErrors({ placa: "Placa inválida. Use o padrão ABC1D23 (Mercosul) ou ABC1234 (antiga)." });
            document.getElementById("dados")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("_method", "PUT");
        Object.entries(form).forEach(([k, v]) => {
            if (k !== "imagens") data.append(k, v ?? "");
        });
        if (novasImagens.length > 0) {
            novasImagens.forEach(f => data.append("imagens[]", f));
        }
        router.post(`/admin/carros/${carro.id}`, data, {
            forceFormData: true,
            onError: (errs) => setErrors(errs),
            onSuccess: () => setErrors({}),
            onFinish: () => setLoading(false),
        });
    };

    const secoesVisiveis = SECOES.filter(s => !s.somenteAdmin || podeFinanceiro);

    return (
        <AdminLayout>
            <Head title={`Editar ${carro.marca} ${carro.modelo}`} />
            <div className="max-w-4xl">
                <div className="mb-6">
                    <Link href={`/admin/carros/${carro.id}`} className="text-xs font-bold uppercase text-dark-400 hover:text-accent transition-colors">
                        &larr; Voltar para a ficha
                    </Link>
                    <h1 className="font-archivo font-black text-3xl mt-3">
                        Editar <span className="text-accent">{carro.marca} {carro.modelo}</span>
                    </h1>
                </div>

                {/* Navegação entre seções */}
                <nav aria-label="Seções do formulário" className="sticky top-[72px] z-30 -mx-2 px-2 py-3 mb-6 bg-dark-950/90 backdrop-blur-[12px] overflow-x-auto">
                    <ul className="flex gap-2 whitespace-nowrap">
                        {secoesVisiveis.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`} className="inline-flex items-center min-h-[44px] px-4 rounded-full border border-white/[0.07] text-sm font-semibold hover:border-accent hover:text-accent transition-colors">
                                    {s.rotulo}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <form id="form-carro" onSubmit={handleSubmit} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-8">

                    <div id="dados" className="space-y-6 scroll-mt-28">
                        <h2 className="font-archivo font-black text-xl">Dados do veículo</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="marca" className={labelCls}>Marca *</label>
                                <input id="marca" type="text" name="marca" value={form.marca} onChange={set} required className={inputCls} />
                            </div>
                            <div>
                                <label htmlFor="modelo" className={labelCls}>Modelo *</label>
                                <input id="modelo" type="text" name="modelo" value={form.modelo} onChange={set} required className={inputCls} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ano" className={labelCls}>Ano *</label>
                                <input id="ano" type="number" name="ano" value={form.ano} onChange={set} required className={inputCls} />
                            </div>
                            <div>
                                <label htmlFor="preco" className={labelCls}>Preço anunciado *</label>
                                <MoneyInput
                                    name="preco"
                                    value={form.preco}
                                    onChange={(preco) => setForm(prev => ({ ...prev, preco }))}
                                    required
                                    className={inputCls}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cor" className={labelCls}>Cor *</label>
                                <input id="cor" type="text" name="cor" value={form.cor} onChange={set} required className={inputCls} />
                            </div>
                            <div>
                                <label htmlFor="combustivel" className={labelCls}>Combustível *</label>
                                <select id="combustivel" name="combustivel" value={form.combustivel} onChange={set} className={inputCls}>
                                    <option value="gasolina">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="eletrico">Elétrico</option>
                                    <option value="hibrido">Híbrido</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="km" className={labelCls}>KM *</label>
                                <input id="km" type="number" name="km" value={form.km} onChange={set} required className={inputCls} />
                            </div>
                            <div>
                                <label htmlFor="placa" className={labelCls}>Placa *</label>
                                <input
                                    id="placa"
                                    type="text"
                                    name="placa"
                                    value={form.placa}
                                    onChange={setPlaca}
                                    required
                                    placeholder="ABC1D23"
                                    aria-invalid={!!errors.placa}
                                    aria-describedby={errors.placa ? "placa-erro" : undefined}
                                    className={`${inputCls} uppercase ${errors.placa ? "border-red-500" : ""}`}
                                />
                                {errors.placa && <p id="placa-erro" className="mt-1 text-sm text-red-400">{errors.placa}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="descricao" className={labelCls}>Descrição</label>
                            <textarea id="descricao" name="descricao" value={form.descricao ?? ""} onChange={set} rows="4" className={inputCls} />
                        </div>

                        <div className="border-t border-white/[0.06] pt-6 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                                <input
                                    type="checkbox"
                                    name="ativo"
                                    checked={!!form.ativo}
                                    onChange={(e) => setForm(prev => ({ ...prev, ativo: e.target.checked }))}
                                    className="w-5 h-5 accent-[#ffed00]"
                                />
                                <span className="text-sm font-semibold">Carro ativo (visível no site)</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                                <input
                                    type="checkbox"
                                    name="destaque"
                                    checked={!!form.destaque}
                                    onChange={(e) => setForm(prev => ({ ...prev, destaque: e.target.checked }))}
                                    className="w-5 h-5 accent-[#ffed00]"
                                />
                                <span className="text-sm font-semibold">Carro em destaque (aparece na home)</span>
                            </label>
                        </div>
                    </div>

                    <div id="fotos" className="space-y-4 scroll-mt-28">
                        <h2 className="font-archivo font-black text-xl">Fotos</h2>
                        {carro.imagens && carro.imagens.length > 0 && imagePreviews.length === 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {carro.imagens.map((img, i) => (
                                    <div key={i} className="rounded-lg overflow-hidden border border-white/[0.07] aspect-square">
                                        <img src={`/storage/${img}`} alt={`Foto ${i + 1} de ${carro.marca} ${carro.modelo}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="border-2 border-dashed border-white/[0.07] rounded-lg hover:border-accent transition-colors">
                            <input type="file" id="imagens-input" name="imagens" multiple accept="image/*" onChange={handleImages} className="sr-only" />
                            <label htmlFor="imagens-input" className="cursor-pointer flex flex-col items-center justify-center p-6">
                                <svg className="w-8 h-8 text-dark-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-dark-300 text-sm font-semibold">
                                    {carro.imagens && carro.imagens.length > 0 ? "Substituir imagens" : "Adicionar imagens"}
                                </p>
                                <p className="text-dark-500 text-xs mt-1">JPG, PNG (máx. 20 MB cada)</p>
                            </label>
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {imagePreviews.map((preview, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden border border-accent aspect-square">
                                        <img src={preview} alt={`Nova foto ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <FipePicker form={form} setForm={setForm} />

                    <DadosInternosFields form={form} setForm={setForm} podeFinanceiro={podeFinanceiro} />

                    {Object.keys(errors).length > 0 && (
                        <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-1">
                            {Object.values(errors).map((msg, i) => (
                                <p key={i} className="text-sm text-red-400">{msg}</p>
                            ))}
                        </div>
                    )}

                    {/* Barra de salvar fixa no rodapé do formulário */}
                    <div className="sticky bottom-0 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-4 bg-dark-900/95 backdrop-blur-[12px] border-t border-white/[0.06] flex gap-4">
                        <button type="submit" disabled={loading} className="flex-1 bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]">
                            {loading ? "Salvando..." : "Atualizar carro"}
                        </button>
                        <Link href={`/admin/carros/${carro.id}`} className="flex-1 text-center bg-dark-800 text-dark-50 font-bold py-3 rounded-lg border border-white/[0.07] hover:border-accent transition-colors min-h-[44px] flex items-center justify-center">
                            Cancelar
                        </Link>
                    </div>
                </form>

                {podeFinanceiro && (
                    <section id="custos" className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6 mt-8 scroll-mt-28">
                        <div>
                            <h2 className="font-archivo font-black text-xl">Custos extras</h2>
                            <p className="text-dark-400 text-sm mt-1">Troca de óleo, pneus, funilaria e outros gastos com o carro. Não aparecem no site. Cada lançamento é salvo na hora, sem precisar salvar o carro.</p>
                        </div>
                        <CustosExtrasFields carroId={carro.id} custos={custos} categorias={categoriasCustos} />
                    </section>
                )}
            </div>
        </AdminLayout>
    );
}
