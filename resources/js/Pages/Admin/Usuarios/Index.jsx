import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const roleLabel = { super_admin: "Super Admin", admin: "Admin", vendedor: "Vendedor" };
const roleColor = { super_admin: "bg-red-500/20 text-red-400", admin: "bg-blue-500/20 text-blue-400", vendedor: "bg-green-500/20 text-green-400" };

export default function Index({ usuarios }) {
    const { adminAtual, flash } = usePage().props;
    const [search, setSearch] = useState("");

    const filtered = usuarios.filter(u =>
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (usuario) => {
        if (usuario.id === adminAtual.id) return;
        if (!confirm(`Deletar ${usuario.nome}?`)) return;
        router.delete(`/admin/usuarios/${usuario.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Usuários" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-archivo font-black text-4xl mb-1">Usuários</h1>
                    <p className="text-dark-300 text-sm">{usuarios.length} cadastrados</p>
                </div>
                {adminAtual?.role !== "vendedor" && (
                    <Link href="/admin/usuarios/create" className="inline-block bg-accent text-dark-950 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition text-center whitespace-nowrap">
                        + Novo Usuário
                    </Link>
                )}
            </div>

            {flash?.message && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm font-semibold">
                    {flash.message}
                </div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:border-accent transition-colors"
                />
            </div>

            <div className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                {filtered.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-dark-800">
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-dark-400">Usuário</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-dark-400">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-dark-400">Função</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase text-dark-400">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase text-dark-400">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr key={u.id} className="border-b border-white/[0.06] hover:bg-dark-800/50 transition-colors last:border-0">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{u.nome}</div>
                                            {u.id === adminAtual?.id && <div className="text-xs text-accent mt-0.5">(você)</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-dark-200">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleColor[u.role]}`}>
                                                {roleLabel[u.role]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold ${u.ativo ? "text-green-400" : "text-red-400"}`}>
                                                {u.ativo ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 justify-center">
                                                <Link href={`/admin/usuarios/${u.id}/edit`} className="text-xs font-bold text-accent hover:opacity-70 transition-opacity">
                                                    Editar
                                                </Link>
                                                {u.id !== adminAtual?.id && adminAtual?.role === "super_admin" && (
                                                    <button onClick={() => handleDelete(u)} className="text-xs font-bold text-red-400 hover:opacity-70 transition-opacity">
                                                        Deletar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center text-dark-400">Nenhum usuário encontrado</div>
                )}
            </div>
        </AdminLayout>
    );
}
