import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

export default function Edit({ usuario }) {
    const { adminAtual } = usePage().props;
    const [form, setForm] = useState({
        nome:     usuario.nome,
        email:    usuario.email,
        password: "",
        role:     usuario.role,
        ativo:    usuario.ativo,
    });
    const [loading, setLoading] = useState(false);

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.put(`/admin/usuarios/${usuario.id}`, form, { onFinish: () => setLoading(false) });
    };

    return (
        <AdminLayout>
            <Head title={`Editar ${usuario.nome}`} />
            <div className="max-w-2xl">
                <div className="mb-8">
                    <a href="/admin/usuarios" className="text-xs font-bold uppercase text-dark-400 hover:text-accent transition-colors">&larr; Voltar</a>
                    <h1 className="font-archivo font-black text-3xl mt-3">
                        Editar <span className="text-accent">{usuario.nome}</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 space-y-6">
                    <div>
                        <label className={labelCls}>Nome *</label>
                        <input type="text" name="nome" value={form.nome} onChange={set} required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Email *</label>
                        <input type="email" name="email" value={form.email} onChange={set} required className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Nova Senha <span className="text-dark-500 normal-case font-normal">(deixe vazio para manter)</span></label>
                        <input type="password" name="password" value={form.password} onChange={set} className={inputCls} placeholder="min. 6 caracteres" />
                    </div>
                    <div>
                        <label className={labelCls}>Funcao *</label>
                        <select name="role" value={form.role} onChange={set} className={inputCls}>
                            {adminAtual?.role === "super_admin" && (
                                <>
                                    <option value="super_admin">Super Admin</option>
                                    <option value="admin">Admin</option>
                                </>
                            )}
                            <option value="vendedor">Vendedor</option>
                        </select>
                    </div>
                    <div className="border-t border-white/[0.06] pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!form.ativo}
                                onChange={(e) => setForm(prev => ({ ...prev, ativo: e.target.checked }))}
                                className="w-4 h-4 accent-[#ffed00]"
                            />
                            <span className="text-sm font-semibold">Usuario ativo</span>
                        </label>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="submit" disabled={loading} className="flex-1 bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? "Salvando..." : "Salvar Alteracoes"}
                        </button>
                        <a href="/admin/usuarios" className="flex-1 text-center bg-dark-800 text-dark-50 font-bold py-3 rounded-lg border border-white/[0.07] hover:border-accent transition-colors">
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
