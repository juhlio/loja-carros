import { Link, Head } from "@inertiajs/react";
import Layout from "../Layouts/Layout";

export default function Welcome() {
    return (
        <Layout>
            <Head title="O carro certo, sem enrolação" />

            {/* Hero */}
            <section className="relative px-[6vw] py-[9vw] overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{ backgroundImage: "radial-gradient(120% 90% at 80% 10%, oklch(0.85 0.17 96 / 0.35) 0%, transparent 55%)" }}
                />

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-[5vw] items-center">
                    <div className="animate-floatIn">
                        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent mb-6">
                            <span className="w-[26px] h-px bg-accent" />
                            Seminovos • 0km • Premium
                        </div>

                        <h1 className="font-archivo font-black text-[clamp(40px,5.2vw,74px)] leading-[0.98] tracking-tight">
                            O carro certo,<br />
                            <span className="text-accent">sem enrolação.</span>
                        </h1>

                        <p className="text-lg text-dark-100 leading-relaxed max-w-md mt-6 mb-8">
                            Estoque selecionado, procedência garantida e atendimento direto com quem entende. Encontre seu próximo carro com a confiança que você merece.
                        </p>

                        <div className="flex gap-4 flex-wrap mb-12">
                            <Link href="/catalogo" className="bg-accent text-dark-950 font-bold px-7 py-4 rounded-full text-base hover:opacity-90 transition-opacity">
                                Ver estoque
                            </Link>
                            <a
                                href="https://wa.me/5548999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-white/[0.18] text-dark-50 font-bold px-7 py-4 rounded-full text-base hover:border-accent hover:text-accent transition-colors"
                            >
                                Falar no WhatsApp
                            </a>
                        </div>

                        <div className="flex gap-10">
                            {[
                                { value: "+500",   label: "carros vendidos" },
                                { value: "12 anos", label: "no mercado" },
                                { value: "4,9★",   label: "avaliação Google" },
                            ].map(({ value, label }) => (
                                <div key={label}>
                                    <div className="font-archivo font-black text-3xl">{value}</div>
                                    <div className="text-xs text-dark-300 font-semibold mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="bg-stripe rounded-3xl border border-white/[0.08] aspect-video flex items-center justify-center animate-floatIn"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <span className="font-mono text-xs text-dark-400">[ foto do carro em destaque ]</span>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <div className="flex flex-wrap justify-center gap-12 px-[6vw] py-7 border-y border-white/[0.06] text-dark-300 text-xs font-bold uppercase tracking-wider">
                {["Procedência garantida", "Financiamento facilitado", "Aceitamos seu usado na troca", "Revisão completa"].map(item => (
                    <span key={item}>{item}</span>
                ))}
            </div>

            {/* Catalog Preview */}
            <section id="catalogo" className="px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent mb-3">Destaques do estoque</div>
                    <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] leading-tight">Carros em destaque</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { modelo: "Corolla XEI", marca: "Toyota",  ano: 2023, preco: "R$ 95.000", tipo: "Automático • Gasolina" },
                        { modelo: "HRV EXL",     marca: "Honda",   ano: 2022, preco: "R$ 115.000", tipo: "Automático • Flex" },
                        { modelo: "Pulse Drive", marca: "Fiat",    ano: 2024, preco: "R$ 88.000", tipo: "Automático • Flex" },
                        { modelo: "Compass",     marca: "Jeep",    ano: 2023, preco: "R$ 175.000", tipo: "Automático • Diesel" },
                        { modelo: "Nivus",       marca: "VW",      ano: 2024, preco: "R$ 102.000", tipo: "Automático • Flex" },
                        { modelo: "Creta",       marca: "Hyundai", ano: 2023, preco: "R$ 128.000", tipo: "Automático • Flex" },
                    ].map((carro, i) => (
                        <Link key={i} href="/catalogo" className="group">
                            <article className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col hover:border-accent/50 transition-colors">
                                <div className="bg-stripe aspect-video relative flex items-center justify-center group-hover:opacity-80 transition-opacity">
                                    <span className="font-mono text-xs text-dark-400">[ foto carro ]</span>
                                    <span className="absolute top-3 left-3 bg-accent text-dark-950 text-xs font-black uppercase px-2.5 py-1 rounded">
                                        {i === 0 ? "Destaque" : "Disponível"}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <div>
                                        <div className="flex justify-between items-baseline gap-2">
                                            <h3 className="font-archivo font-black text-xl">{carro.marca} {carro.modelo}</h3>
                                            <span className="text-xs text-dark-300 font-semibold">{carro.ano}</span>
                                        </div>
                                        <div className="text-sm text-dark-300 mt-1">{carro.tipo}</div>
                                    </div>
                                    <div className="border-t border-white/[0.06] pt-3 mt-auto">
                                        <div className="font-archivo font-black text-2xl text-accent">{carro.preco}</div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/catalogo" className="inline-block bg-accent text-dark-950 font-bold px-7 py-4 rounded-full text-base hover:opacity-90 transition-opacity">
                        Ver todos os carros
                    </Link>
                </div>
            </section>

            {/* About */}
            <section id="sobre" className="bg-dark-900 border-t border-b border-white/[0.06] px-[6vw] py-[8vw]">
                <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] mb-8 leading-tight">Quem somos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <p className="text-dark-100 leading-relaxed text-lg">
                        Com mais de 12 anos no mercado de veículos, a Loja de Carros é sinônimo de confiança, qualidade e atendimento excepcional. Cada carro que oferecemos é cuidadosamente selecionado e passa por uma revisão completa.
                    </p>
                    <p className="text-dark-100 leading-relaxed text-lg">
                        Nossa missão é simples: conectar você com o carro dos seus sonhos da forma mais transparente e segura possível. Não há enrolação, apenas profissionalismo e comprometimento com sua satisfação.
                    </p>
                </div>
            </section>
        </Layout>
    );
}
