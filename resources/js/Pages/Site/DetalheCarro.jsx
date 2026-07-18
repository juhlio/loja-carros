import { Head, Link } from "@inertiajs/react";
import Layout from "../../Layouts/Layout";

export default function DetalheCarro({ carro }) {
    return (
        <Layout>
            <Head title={`${carro.marca} ${carro.modelo} ${carro.ano}`} />

            {/* Breadcrumb */}
            <div className="px-[6vw] py-6 border-b border-white/[0.06]">
                <Link href="/catalogo" className="text-accent hover:opacity-80 transition-opacity font-semibold">
                    ← Voltar ao Catálogo
                </Link>
            </div>

            {/* Hero */}
            <section className="px-[6vw] py-[8vw]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Imagem + Galeria */}
                    <div className="lg:col-span-2">
                        <div className="bg-stripe rounded-2xl aspect-video flex items-center justify-center mb-6 border border-white/[0.07]">
                            <span className="font-mono text-sm text-dark-400">
                                [ foto do {carro.marca} {carro.modelo} ]
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div
                                    key={i}
                                    className="bg-stripe rounded-lg aspect-square flex items-center justify-center border border-white/[0.07] cursor-pointer hover:border-accent transition-colors"
                                >
                                    <span className="font-mono text-xs text-dark-400">Foto {i}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-6">
                        {/* Card de preço e CTA */}
                        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <div className="mb-6">
                                <div className="text-xs font-bold tracking-widest uppercase text-dark-300 mb-2">{carro.ano}</div>
                                <h1 className="font-archivo font-black text-3xl">{carro.marca}</h1>
                                <h2 className="font-archivo font-black text-3xl text-accent mb-3">{carro.modelo}</h2>
                                <p className="text-dark-300 text-sm">
                                    {Number(carro.km).toLocaleString("pt-BR")} KM • {carro.combustivel} • {carro.cor}
                                </p>
                            </div>

                            <div className="border-t border-white/[0.06] pt-6 mb-6">
                                <div className="text-sm text-dark-300 mb-1">Preço</div>
                                <div className="font-archivo font-black text-4xl text-accent">
                                    R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://wa.me/5548999999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center bg-accent text-dark-950 font-bold py-4 rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Agendar Test Drive
                                </a>
                                <button className="w-full bg-dark-800 text-accent font-bold py-4 rounded-lg border border-accent hover:bg-accent hover:text-dark-950 transition-colors">
                                    Solicitar Informações
                                </button>
                            </div>
                        </div>

                        {/* Especificações */}
                        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <h3 className="font-archivo font-black text-lg mb-4">Informações</h3>
                            <dl className="space-y-0">
                                {[
                                    { label: "Marca",         value: carro.marca },
                                    { label: "Modelo",        value: carro.modelo },
                                    { label: "Ano",           value: carro.ano },
                                    { label: "Cor",           value: carro.cor },
                                    { label: "Combustível",   value: carro.combustivel },
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

            {/* Descrição */}
            {carro.descricao && (
                <section className="px-[6vw] pb-[4vw] border-t border-white/[0.06] pt-[4vw]">
                    <h2 className="font-archivo font-black text-2xl mb-6">Sobre este carro</h2>
                    <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8 max-w-3xl">
                        <p className="text-dark-100 text-lg leading-relaxed">{carro.descricao}</p>
                    </div>
                </section>
            )}

            {/* Diferenciais */}
            <section className="px-[6vw] py-[8vw] border-t border-white/[0.06]">
                <h2 className="font-archivo font-black text-2xl mb-10">Por que escolher este carro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: "✓",  title: "Procedência",   desc: "Histórico completo e documentação em dia" },
                        { icon: "🔧", title: "Revisado",      desc: "Completa inspeção e manutenção realizada" },
                        { icon: "🛡️", title: "Garantia",      desc: "Proteção total contra defeitos ocultos" },
                        { icon: "💰", title: "Financiamento", desc: "Opções de pagamento facilitadas" },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                            <div className="text-3xl mb-3">{icon}</div>
                            <h3 className="font-archivo font-black mb-2">{title}</h3>
                            <p className="text-dark-300 text-sm">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="px-[6vw] pb-[8vw]">
                <div className="bg-gradient-to-br from-dark-900 to-dark-800 border border-white/[0.07] rounded-3xl p-12 text-center">
                    <h2 className="font-archivo font-black text-3xl mb-4">
                        Pronto para dar um <span className="text-accent">test drive</span>?
                    </h2>
                    <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
                        Entre em contato conosco para agendar uma apresentação do {carro.marca} {carro.modelo}.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <a
                            href="https://wa.me/5548999999999"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent text-dark-950 font-bold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Agendar Test Drive
                        </a>
                        <Link
                            href="/catalogo"
                            className="border border-accent text-accent font-bold px-8 py-4 rounded-lg hover:bg-accent hover:text-dark-950 transition-colors"
                        >
                            Ver outros carros
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
