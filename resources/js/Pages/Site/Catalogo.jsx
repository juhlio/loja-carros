import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../Layouts/Layout";

export default function Catalogo({ carros = [] }) {
    const [filtro, setFiltro] = useState("todos");

    const marcas = [...new Set(carros.map(c => c.marca))];
    const filteredCarros = filtro === "todos" ? carros : carros.filter(c => c.marca === filtro);

    return (
        <Layout>
            <Head title="Catálogo de Carros" />

            <section className="px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Estoque completo</div>
                    <h1 className="font-archivo font-black text-[clamp(40px,5.2vw,74px)] leading-tight">Nossos carros</h1>
                </div>

                {/* Filtros */}
                <div className="flex gap-3 mb-12 flex-wrap">
                    {["todos", ...marcas].map(item => (
                        <button
                            key={item}
                            onClick={() => setFiltro(item)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors capitalize ${
                                filtro === item
                                    ? "bg-accent text-dark-950"
                                    : "bg-dark-900 text-dark-50 border border-white/[0.12] hover:border-accent hover:text-accent"
                            }`}
                        >
                            {item === "todos" ? "Todos" : item}
                        </button>
                    ))}
                </div>

                {filteredCarros.length === 0 ? (
                    <div className="text-center py-24 text-dark-400">
                        <p className="text-lg">Nenhum carro disponível no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCarros.map(carro => (
                            <Link key={carro.id} href={`/carro/${carro.id}`} className="group">
                                <article className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col hover:border-accent/50 transition-colors">
                                    <div className="bg-stripe aspect-video relative flex items-center justify-center group-hover:opacity-80 transition-opacity">
                                        <span className="font-mono text-xs text-dark-400">[ {carro.modelo} ]</span>
                                    </div>
                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <div>
                                            <div className="flex justify-between items-baseline gap-2">
                                                <h3 className="font-archivo font-black text-xl">{carro.marca} {carro.modelo}</h3>
                                                <span className="text-xs text-dark-300 font-semibold">{carro.ano}</span>
                                            </div>
                                            <div className="text-sm text-dark-300 mt-1">
                                                {Number(carro.km).toLocaleString("pt-BR")} KM • {carro.combustivel}
                                            </div>
                                        </div>
                                        <div className="border-t border-white/[0.06] pt-3 mt-auto flex items-center justify-between">
                                            <div className="font-archivo font-black text-2xl text-accent">
                                                R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                                            </div>
                                            <span className="text-xs text-dark-300 border border-white/[0.10] px-2.5 py-1 rounded-full">{carro.cor}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}
