import { useState } from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Layouts/Layout";
import CarCard from "../../Components/CarCard";

export default function Catalogo({ carros = [] }) {
    const [filtro, setFiltro] = useState("todos");

    const marcas = [...new Set(carros.map(c => c.marca))];
    const filteredCarros = filtro === "todos" ? carros : carros.filter(c => c.marca === filtro);

    return (
        <Layout>
            <Head title="Catálogo de Carros" />

            <section className="px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent-soft mb-3">Estoque completo</div>
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
                            <CarCard key={carro.id} carro={carro} showCor />
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}
