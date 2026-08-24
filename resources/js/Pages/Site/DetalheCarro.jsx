import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../Layouts/Layout";

export default function DetalheCarro({ carro }) {
    const [imagemAtual, setImagemAtual] = useState(
        carro.imagens && carro.imagens.length > 0 ? carro.imagens[0] : null
    );

    return (
        <Layout>
            <Head title={`${carro.marca} ${carro.modelo} ${carro.ano}`} />

            <div className="px-[6vw] py-6 border-b border-white/[0.06]">
                <Link href="/catalogo" className="text-accent hover:opacity-80 transition-opacity font-semibold">
                    &larr; Voltar ao Catalogo
                </Link>
            </div>

            <section className="px-[6vw] py-[8vw]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <div className="rounded-2xl aspect-video flex items-center justify-center mb-6 border border-white/[0.07] overflow-hidden bg-dark-900">
                            {imagemAtual ? (
                                <img src={`/storage/${imagemAtual}`} alt={`${carro.marca} ${carro.modelo}`} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-mono text-sm text-dark-400">[ foto do {carro.marca} {carro.modelo} ]</span>
                            )}
                        </div>

                        {carro.imagens && carro.imagens.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {carro.imagens.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImagemAtual(img)}
                                        className={`rounded-lg overflow-hidden border-2 transition-colors ${
                                            imagemAtual === img ? "border-accent" : "border-white/[0.07] hover:border-accent"
                                        }`}
                                    >
                                        <img src={`/storage/${img}`} alt={`thumb-${i}`} className="w-full h-20 object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <div className="mb-6">
                                <div className="text-xs font-bold tracking-widest uppercase text-dark-300 mb-2">{carro.ano}</div>
                                <h1 className="font-archivo font-black text-3xl">{carro.marca}</h1>
                                <h2 className="font-archivo font-black text-3xl text-accent mb-3">{carro.modelo}</h2>
                                <p className="text-dark-300 text-sm">
                                    {Number(carro.km).toLocaleString("pt-BR")} KM &bull; {carro.combustivel} &bull; {carro.cor}
                                </p>
                            </div>

                            <div className="border-t border-white/[0.06] pt-6 mb-6">
                                <div className="text-sm text-dark-300 mb-1">Preco</div>
                                <div className="font-archivo font-black text-4xl text-accent">
                                    R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://wa.me/5549991698515"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center bg-accent text-dark-950 font-bold py-4 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Agendar Test Drive
                                </a>
                                <button className="w-full bg-dark-800 text-accent font-bold py-4 rounded-lg border border-accent hover:bg-accent hover:text-dark-950 transition-colors">
                                    Solicitar Informacoes
                                </button>
                            </div>
                        </div>

                        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <h3 className="font-archivo font-black text-lg mb-4">Informacoes</h3>
                            <dl className="space-y-0">
                                {[
                                    { label: "Marca",         value: carro.marca },
                                    { label: "Modelo",        value: carro.modelo },
                                    { label: "Ano",           value: carro.ano },
                                    { label: "Cor",           value: carro.cor },
                                    { label: "Combustivel",   value: carro.combustivel },
                                    { label: "Quilometragem", value: `${Number(carro.km).toLocaleString("pt-BR")} KM` },
                                    { label: "Placa",         value: carro.placa, mono: true },
                                ].map(({ label, value, mono }, idx, arr) => (
                                    <div key={label}>
                                        <div className="flex justify-between py-3">
                                            <dt className="text-dark-300 text-sm">{label}</dt>
                                            <dd className={`font-semibold text-sm capitalize ${mono ? "font-mono" : ""}`}>{value}</dd>
                                        </div>
                                        {idx < arr.length - 1 && <div className="border-b border-white/[0.06]" />}
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            {carro.descricao && (
                <section className="px-[6vw] pb-[4vw] border-t border-white/[0.06] pt-[4vw]">
                    <h2 className="font-archivo font-black text-2xl mb-6">Sobre este carro</h2>
                    <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 max-w-3xl">
                        <p className="text-dark-100 text-lg leading-relaxed">{carro.descricao}</p>
                    </div>
                </section>
            )}

            <section className="px-[6vw] py-[8vw] border-t border-white/[0.06]">
                <h2 className="font-archivo font-black text-2xl mb-10">Por que escolher este carro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: "check", title: "Procedencia",   desc: "Historico completo e documentacao em dia" },
                        { icon: "tool",  title: "Revisado",      desc: "Completa inspecao e manutencao realizada" },
                        { icon: "shield",title: "Garantia",      desc: "Protecao total contra defeitos ocultos" },
                        { icon: "money", title: "Financiamento", desc: "Opcoes de pagamento facilitadas" },
                    ].map(({ title, desc }) => (
                        <div key={title} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-3">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                            </div>
                            <h3 className="font-archivo font-black mb-2">{title}</h3>
                            <p className="text-dark-300 text-sm">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-[6vw] pb-[8vw]">
                <div className="bg-gradient-to-br from-dark-900 to-dark-800 border border-white/[0.07] rounded-3xl p-12 text-center">
                    <h2 className="font-archivo font-black text-3xl mb-4">
                        Pronto para dar um <span className="text-accent">test drive</span>?
                    </h2>
                    <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
                        Entre em contato conosco para agendar uma apresentacao do {carro.marca} {carro.modelo}.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a
                            href="https://wa.me/5549991698515"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent text-dark-950 font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Agendar Test Drive
                        </a>
                        <Link href="/catalogo" className="border border-accent text-accent font-bold px-8 py-4 rounded-lg hover:bg-accent hover:text-dark-950 transition-colors">
                            Ver outros carros
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
