import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

export default function Perfil() {
    const { adminAtual, flash, errors } = usePage().props;
    const [form, setForm] = useState({
        nome:             adminAtual?.nome ?? "",
        email:            adminAtual?.email ?? "",
        senha_atual:      "",
        nova_senha:       "",
        nova_senha_confirmation: "",
    });
    const [loading, setLoading] = useState(false);

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.put("/admin/perfil", form, { onFinish: () => setLoading(false) });
    };

    const roleLabel = { super_admin: "Super Admin", admin: "Admin", vendedor: "Vendedor" };

    return (
        <AdminLayout>
            <Head title="Meu Perfil" />
            <div className="max-w-2xl">
                <div className="mb-8">
                    <h1 className="font-archivo font-black text-3xl">Meu Perfil</h1>
                    <p className="text-dark-400 text-sm mt-1">{roleLabel[adminAtual?.role]}</p>
                </div>

                {flash?.message && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm font-semibold">
                        {flash.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 space-y-6">
                    <div>
                        <label className={labelCls}>Nome *</label>
                        <input type="text" name="nome" value={form.nome} onChange={set} required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Email *</label>
                        <input type="email" name="email" value={form.email} onChange={set} required className={inputCls} />
                    </div>

                    <div className="border-t border-white/[0.06] pt-6">
                        <h3 className="font-bold text-sm mb-4 text-dark-300 uppercase tracking-wide">Alterar Senha</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>Senha Atual</label>
                                <input type="password" name="senha_atual" value={form.senha_atual} onChange={set} className={inputCls} placeholder="Digite a senha atual" />
                                {errors?.senha_atual && <p className="mt-1 text-sm text-red-400">{errors.senha_atual}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Nova Senha</label>
                                <input type="password" name="nova_senha" value={form.nova_senha} onChange={set} className={inputCls} placeholder="min. 6 caracteres" />
                            </div>
                            <div>
                                <label className={labelCls}>Confirmar Nova Senha</label>
                                <input type="password" name="nova_senha_confirmation" value={form.nova_senha_confirmation} onChange={set} className={inputCls} placeholder="Repita a nova senha" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
