import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Layout from "../../Layouts/Layout";
import CarCard from "../../Components/CarCard";
import { titleCaseVeiculo } from "../../lib/text";

const ORDENACOES = [
    { value: "recentes", label: "Mais recentes" },
    { value: "menor-preco", label: "Menor preço" },
    { value: "maior-preco", label: "Maior preço" },
    { value: "mais-novo", label: "Ano mais novo" },
    { value: "menor-km", label: "Menor quilometragem" },
];

// Logo em public/marcas/{slug}.svg (ex: volkswagen.svg). Sem arquivo, mostra o nome.
function slugMarca(marca) {
    return marca
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function BotaoMarca({ marca, ativo, onClick }) {
    const [semLogo, setSemLogo] = useState(false);
    const nome = marca === "todos" ? "Todos" : titleCaseVeiculo(marca);
    const classe = `px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${
        ativo
            ? "bg-accent text-dark-950"
            : "bg-dark-900 text-dark-50 border border-white/[0.12] hover:border-accent hover:text-accent"
    }`;

    if (marca === "todos" || semLogo) {
        return <button onClick={onClick} className={classe}>{nome}</button>;
    }

    return (
        <button onClick={onClick} className={`${classe} flex items-center`} aria-label={nome} title={nome}>
            <img
                src={`/marcas/${slugMarca(marca)}.svg`}
                alt={nome}
                loading="lazy"
                onError={() => setSemLogo(true)}
                className="h-6 w-auto max-w-[96px] object-contain"
            />
        </button>
    );
}

export default function Catalogo({ carros = [] }) {
    const [filtro, setFiltro] = useState("todos");
    const [ordenacao, setOrdenacao] = useState("recentes");
    const [precoMin, setPrecoMin] = useState("");
    const [precoMax, setPrecoMax] = useState("");
    const { siteCfg } = usePage().props;
    const nomeLoja = siteCfg?.nome_loja || "Loja de Carros";

    const marcas = [...new Set(carros.map(c => c.marca))];

    const filteredCarros = carros
        .filter(c => filtro === "todos" || c.marca === filtro)
        .filter(c => precoMin === "" || Number(c.preco) >= Number(precoMin))
        .filter(c => precoMax === "" || Number(c.preco) <= Number(precoMax))
        .sort((a, b) => {
            switch (ordenacao) {
                case "menor-preco": return Number(a.preco) - Number(b.preco);
                case "maior-preco": return Number(b.preco) - Number(a.preco);
                case "mais-novo": return Number(b.ano) - Number(a.ano);
                case "menor-km": return Number(a.km) - Number(b.km);
                default: return 0;
            }
        });

    const temFiltroAtivo = filtro !== "todos" || precoMin !== "" || precoMax !== "" || ordenacao !== "recentes";

    function limparFiltros() {
        setFiltro("todos");
        setOrdenacao("recentes");
        setPrecoMin("");
        setPrecoMax("");
    }

    return (
        <Layout whatsappMessage="Olá! Estou dando uma olhada no catálogo e gostaria de ajuda para escolher um carro.">
            <Head title={`Catálogo de Seminovos — ${nomeLoja} | Chapecó, SC`} />

            <section className="px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent-soft mb-3">Estoque completo</div>
                    <h1 className="font-archivo font-black text-[clamp(40px,5.2vw,74px)] leading-tight mb-6">Seminovos e Usados em Chapecó, SC</h1>
                    <div className="max-w-2xl text-dark-200 leading-relaxed space-y-3">
                        <p>
                            Aqui você encontra o estoque completo de seminovos da {nomeLoja}, com procedência garantida e revisão completa em cada veículo antes de chegar até você. Filtre por marca ou faixa de preço para achar o carro certo mais rápido.
                        </p>
                        <p>
                            Atendimento direto pelo WhatsApp, financiamento facilitado e aceitamos seu usado na troca — sem enrolação, do jeito que a compra de um carro em Chapecó, SC deveria ser.
                        </p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {["todos", ...marcas].map(item => (
                        <BotaoMarca
                            key={item}
                            marca={item}
                            ativo={filtro === item}
                            onClick={() => setFiltro(item)}
                        />
                    ))}
                </div>

                <div className="flex gap-3 mb-12 flex-wrap items-center">
                    <label className="flex items-center gap-2 text-sm text-dark-300 font-semibold">
                        Ordenar por
                        <select
                            value={ordenacao}
                            onChange={e => setOrdenacao(e.target.value)}
                            className="bg-dark-900 border border-white/[0.12] rounded-full px-4 py-2 text-sm font-bold text-dark-50 focus:border-accent focus:outline-none"
                        >
                            {ORDENACOES.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-2 text-sm text-dark-300 font-semibold">
                        Preço de
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder="R$ mín."
                            value={precoMin}
                            onChange={e => setPrecoMin(e.target.value)}
                            className="w-28 bg-dark-900 border border-white/[0.12] rounded-full px-4 py-2 text-sm font-bold text-dark-50 focus:border-accent focus:outline-none"
                        />
                        até
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            placeholder="R$ máx."
                            value={precoMax}
                            onChange={e => setPrecoMax(e.target.value)}
                            className="w-28 bg-dark-900 border border-white/[0.12] rounded-full px-4 py-2 text-sm font-bold text-dark-50 focus:border-accent focus:outline-none"
                        />
                    </label>

                    {temFiltroAtivo && (
                        <button
                            onClick={limparFiltros}
                            className="text-sm font-bold text-dark-300 hover:text-accent transition-colors underline underline-offset-2"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>

                {filteredCarros.length === 0 ? (
                    <div className="text-center py-24 text-dark-400">
                        <p className="text-lg">Nenhum carro disponível no momento.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="sr-only">{filteredCarros.length} veículos em estoque</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCarros.map((carro, index) => (
                                <CarCard key={carro.id} carro={carro} showCor priority={index < 3} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </Layout>
    );
}
