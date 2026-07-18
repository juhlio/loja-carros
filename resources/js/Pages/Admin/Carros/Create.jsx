import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

export default function Create() {
    const [form, setForm] = useState({
        marca: "", modelo: "", ano: new Date().getFullYear(),
        preco: "", cor: "", combustivel: "gasolina",
        km: 0, descricao: "", placa: "",
    });
    const [loading, setLoading] = useState(false);

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post("/admin/carros", form, { onFinish: () => setLoading(false) });
    };

    return (
        <AdminLayout>
            <Head title="Adicionar Carro" />

            <div className="max-w-2xl">
                <div className="mb-8">
                    <a href="/admin/carros" className="text-xs font-bold uppercase text-dark-400 hover:text-accent transition-colors">
                        ← Voltar
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
                            <label className={labelCls}>Preço (R$) *</label>
                            <input type="number" name="preco" value={form.preco} onChange={set} step="0.01" required className={inputCls} placeholder="Ex: 95000" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Cor *</label>
                            <input type="text" name="cor" value={form.cor} onChange={set} required className={inputCls} placeholder="Ex: Prata" />
                        </div>
                        <div>
                            <label className={labelCls}>Combustível *</label>
                            <select name="combustivel" value={form.combustivel} onChange={set} className={inputCls}>
                                <option value="gasolina">Gasolina</option>
                                <option value="diesel">Diesel</option>
                                <option value="eletrico">Elétrico</option>
                                <option value="hibrido">Híbrido</option>
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
                        <label className={labelCls}>Descrição</label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={set}
                            rows="5"
                            className={inputCls}
                            placeholder="Descreva o estado do veículo, opcionais, histórico..."
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? "Salvando..." : "Salvar Carro"}
                        </button>
                        <a
                            href="/admin/carros"
                            className="flex-1 text-center bg-dark-800 text-dark-50 font-bold py-3 rounded-lg border border-white/[0.07] hover:border-accent transition-colors"
                        >
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
