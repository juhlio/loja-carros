import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

export default function Create() {
    const [form, setForm] = useState({
        marca: "", modelo: "", ano: new Date().getFullYear(),
        preco: "", cor: "", combustivel: "gasolina",
        km: 0, descricao: "", placa: "", destaque: false,
    });
    const [imagens, setImagens] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files || []);
        setImagens(files);
        setImagePreviews(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v));
        imagens.forEach(f => data.append("imagens[]", f));
        router.post("/admin/carros", data, {
            forceFormData: true,
            onError: (errs) => setErrors(errs),
            onSuccess: () => setErrors({}),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Adicionar Carro" />
            <div className="max-w-2xl">
                <div className="mb-8">
                    <a href="/admin/carros" className="text-xs font-bold uppercase text-dark-400 hover:text-accent transition-colors">
                        &larr; Voltar
                    </a>
                    <h1 className="font-archivo font-black text-3xl mt-3">Adicionar Novo Carro</h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 space-y-6">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Marca *</label>
                            <input type="text" name="marca" value={form.marca} onChange={set} required className={inputCls} placeholder="Ex: Toyota" />
                        </div>
                        <div>
                            <label className={labelCls}>Modelo *</label>
                            <input type="text" name="modelo" value={form.modelo} onChange={set} required className={inputCls} placeholder="Ex: Corolla" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Ano *</label>
                            <input type="number" name="ano" value={form.ano} onChange={set} required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Preco (R$) *</label>
                            <input type="number" name="preco" value={form.preco} onChange={set} step="0.01" required className={inputCls} placeholder="Ex: 95000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Cor *</label>
                            <input type="text" name="cor" value={form.cor} onChange={set} required className={inputCls} placeholder="Ex: Prata" />
                        </div>
                        <div>
                            <label className={labelCls}>Combustivel *</label>
                            <select name="combustivel" value={form.combustivel} onChange={set} className={inputCls}>
                                <option value="gasolina">Gasolina</option>
                                <option value="diesel">Diesel</option>
                                <option value="eletrico">Eletrico</option>
                                <option value="hibrido">Hibrido</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>KM *</label>
                            <input type="number" name="km" value={form.km} onChange={set} required className={inputCls} placeholder="Ex: 5000" />
                        </div>
                        <div>
                            <label className={labelCls}>Placa *</label>
                            <input type="text" name="placa" value={form.placa} onChange={set} required className={`${inputCls} uppercase`} placeholder="Ex: ABC1D23" />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Descricao</label>
                        <textarea name="descricao" value={form.descricao} onChange={set} rows="4" className={inputCls} placeholder="Descreva o estado do veiculo, opcionais, historico..." />
                    </div>

                    <div>
                        <label className={labelCls}>Imagens do Carro</label>
                        <div className="border-2 border-dashed border-white/[0.07] rounded-lg hover:border-accent transition-colors">
                            <input type="file" id="imagens-input" name="imagens" multiple accept="image/*" onChange={handleImages} className="hidden" />
                            <label htmlFor="imagens-input" className="cursor-pointer flex flex-col items-center justify-center p-8">
                                <svg className="w-10 h-10 text-dark-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-dark-100 font-semibold">Clique para selecionar imagens</p>
                                <p className="text-dark-400 text-sm mt-1">JPG, PNG (max 20MB cada)</p>
                            </label>
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {imagePreviews.map((preview, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden border border-white/[0.07] aspect-square">
                                        <img src={preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/[0.06] pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="destaque"
                                checked={!!form.destaque}
                                onChange={(e) => setForm(prev => ({ ...prev, destaque: e.target.checked }))}
                                className="w-4 h-4 accent-[#ffed00]"
                            />
                            <span className="text-sm font-semibold">Carro em destaque (aparece na home)</span>
                        </label>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-1">
                            {Object.values(errors).map((msg, i) => (
                                <p key={i} className="text-sm text-red-400">{msg}</p>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button type="submit" disabled={loading} className="flex-1 bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? "Salvando..." : "Salvar Carro"}
                        </button>
                        <a href="/admin/carros" className="flex-1 text-center bg-dark-800 text-dark-50 font-bold py-3 rounded-lg border border-white/[0.07] hover:border-accent transition-colors">
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
