import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

export default function Index({ carros }) {
    const [search, setSearch]   = useState("");
    const [sortBy, setSortBy]   = useState("recent");

    const filtered = carros.filter(c =>
        c.modelo.toLowerCase().includes(search.toLowerCase()) ||
        c.marca.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "preco-asc")  return a.preco - b.preco;
        if (sortBy === "preco-desc") return b.preco - a.preco;
        return b.id - a.id;
    });

    const handleDelete = (id) => {
        if (!confirm("Tem certeza que deseja deletar este carro?")) return;
        router.delete(`/admin/carros/${id}`);
    };

    const ativos = carros.filter(c => c.ativo).length;

    return (
        <AdminLayout>
            <Head title="Gerenciar Carros" />

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-archivo font-black text-4xl mb-1">Gerenciar Carros</h1>
                    <p className="text-dark-300 text-sm">
                        {carros.length} veículos no estoque · {ativos} ativos
                    </p>
                </div>
                <Link
                    href="/admin/carros/create"
                    className="inline-block bg-accent text-dark-950 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-center whitespace-nowrap"
                >
                    + Adicionar Carro
                </Link>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                    <label className="block text-xs font-bold uppercase text-dark-400 mb-2">Buscar</label>
                    <input
                        type="text"
                        placeholder="Marca ou modelo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:border-accent transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-dark-400 mb-2">Ordenar por</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg text-dark-50 focus:outline-none focus:border-accent transition-colors"
                    >
                        <option value="recent">Mais Recentes</option>
                        <option value="preco-asc">Preço: Menor → Maior</option>
                        <option value="preco-desc">Preço: Maior → Menor</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-dark-400 mb-2">Status</label>
                    <div className="px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg flex items-center justify-between">
                        <span className="text-sm text-dark-300">Ativos</span>
                        <span className="bg-accent text-dark-950 font-black text-xs px-2.5 py-1 rounded-full">{ativos}</span>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                {sorted.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-dark-800">
                                    {["Veículo", "Ano", "KM", "Preço", "Combustível", "Ações"].map((h, i) => (
                                        <th
                                            key={h}
                                            className={`px-6 py-4 text-xs font-bold uppercase text-dark-400 ${i === 5 ? "text-center" : "text-left"}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map(carro => (
                                    <tr key={carro.id} className="border-b border-white/[0.06] hover:bg-dark-800 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{carro.marca}</div>
                                            <div className="text-xs text-dark-400">{carro.modelo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{carro.ano}</td>
                                        <td className="px-6 py-4 text-sm">{Number(carro.km).toLocaleString("pt-BR")} km</td>
                                        <td className="px-6 py-4 font-bold text-accent">
                                            R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 capitalize text-sm">{carro.combustivel}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3 justify-center">
                                                <Link
                                                    href={`/admin/carros/${carro.id}/edit`}
                                                    className="text-accent hover:opacity-70 transition-opacity font-semibold text-sm"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(carro.id)}
                                                    className="text-red-400 hover:opacity-70 transition-opacity font-semibold text-sm"
                                                >
                                                    Deletar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center text-dark-400">
                        <p className="text-lg mb-2">Nenhum carro encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros ou adicione um novo veículo</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
