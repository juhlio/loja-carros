import { Link, Head, usePage } from "@inertiajs/react";
import Layout from "../Layouts/Layout";
import CarCard from "../Components/CarCard";
import { formatPhoneBR } from "../lib/phone";

export default function Welcome({ destaques = [] }) {
    const destaqueHero = destaques[0];
    const { siteCfg } = usePage().props;
    const endereco = siteCfg?.endereco ?? "";
    const endereco2 = siteCfg?.endereco_2 ?? "";
    const enderecos = [
        { titulo: siteCfg?.endereco_titulo || "Loja 1", endereco },
        { titulo: siteCfg?.endereco_2_titulo || "Loja 2", endereco: endereco2 },
    ].filter(e => e.endereco);
    const telefone = siteCfg?.telefone ?? "";
    const whatsapp = siteCfg?.whatsapp ?? "";
    const telefoneContato = telefone || whatsapp;
    const email    = siteCfg?.email ?? "";
    const anosMercado    = siteCfg?.anos_mercado ?? "12";
    const carrosVendidos = siteCfg?.carros_vendidos ?? "+500";
    const avaliacaoGoogle = siteCfg?.avaliacao_google ?? "4,9";
    const nomeLoja = siteCfg?.nome_loja || "Loja de Carros";
    const sobreTitulo = siteCfg?.sobre_titulo || "Quem somos";
    const sobreTexto = siteCfg?.sobre_texto ||
        `Com mais de ${anosMercado} anos no mercado de veículos, a ${nomeLoja} é sinônimo de confiança, qualidade e atendimento excepcional. Cada carro que oferecemos é cuidadosamente selecionado e passa por uma revisão completa.\n\nNossa missão é simples: conectar você com o carro dos seus sonhos da forma mais transparente e segura possível. Não há enrolação, apenas profissionalismo e comprometimento com sua satisfação.`;

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
                                href={whatsapp ? `https://wa.me/${whatsapp}` : "#contato"}
                                target={whatsapp ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="border border-white/[0.18] text-dark-50 font-bold px-7 py-4 rounded-full text-base hover:border-accent hover:text-accent transition-colors"
                            >
                                Falar no WhatsApp
                            </a>
                        </div>

                        <div className="flex gap-10">
                            {[
                                { value: carrosVendidos, label: "carros vendidos" },
                                { value: `${anosMercado} anos`, label: "no mercado" },
                                { value: `${avaliacaoGoogle}★`, label: "avaliação Google" },
                            ].map(({ value, label }) => (
                                <div key={label}>
                                    <div className="font-archivo font-black text-3xl">{value}</div>
                                    <div className="text-xs text-dark-300 font-semibold mt-1">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {destaqueHero ? (
                        <Link
                            href={destaqueHero.url}
                            className="group relative block bg-stripe rounded-3xl border border-white/[0.08] aspect-video overflow-hidden animate-floatIn"
                            style={{ animationDelay: "0.2s" }}
                        >
                            {destaqueHero.imagens?.length > 0 ? (
                                <img
                                    src={`/storage/${destaqueHero.imagens[0]}`}
                                    alt={`${destaqueHero.marca} ${destaqueHero.modelo}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="font-mono text-xs text-dark-400">[ foto do carro em destaque ]</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <span className="inline-block w-fit bg-accent text-dark-950 text-xs font-black uppercase px-2.5 py-1 rounded mb-2">
                                    Destaque
                                </span>
                                <h3 className="font-archivo font-black text-2xl text-dark-50">
                                    {destaqueHero.marca} {destaqueHero.modelo}
                                </h3>
                                <p className="text-dark-200 text-sm mt-1">
                                    {destaqueHero.ano} • {Number(destaqueHero.km).toLocaleString("pt-BR")} KM • {destaqueHero.combustivel}
                                </p>
                                <p className="font-archivo font-black text-xl text-accent mt-2">
                                    R$ {parseFloat(destaqueHero.preco).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <div
                            className="bg-stripe rounded-3xl border border-white/[0.08] aspect-video flex items-center justify-center overflow-hidden animate-floatIn"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <span className="font-mono text-xs text-dark-400">[ foto do carro em destaque ]</span>
                        </div>
                    )}
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
                    <div className="text-xs font-bold tracking-widest uppercase text-accent-soft mb-3">Destaques do estoque</div>
                    <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] leading-tight">Carros em destaque</h2>
                </div>

                {destaques.length === 0 ? (
                    <div className="text-center py-16 text-dark-400">
                        <p className="text-lg">Nenhum carro em destaque no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destaques.map((carro) => (
                            <CarCard key={carro.id} carro={carro} badge={carro.destaque ? "Destaque" : "Disponível"} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link href="/catalogo" className="inline-block bg-accent text-dark-950 font-bold px-7 py-4 rounded-full text-base hover:opacity-90 transition-opacity">
                        Ver todos os carros
                    </Link>
                </div>
            </section>

            {/* About */}
            <section id="sobre" className="bg-dark-900 border-t border-b border-white/[0.06] px-[6vw] py-[8vw]">
                <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] mb-8 leading-tight">{sobreTitulo}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sobreTexto.split(/\n{2,}/).map((paragrafo, i) => (
                        <p key={i} className="text-dark-100 leading-relaxed text-lg">
                            {paragrafo}
                        </p>
                    ))}
                </div>
            </section>

            {/* Localizacao */}
            <section id="local" className="px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent-soft mb-3">Venha nos visitar</div>
                    <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] leading-tight">Onde estamos</h2>
                </div>

                {enderecos.length === 0 ? (
                    <div className="rounded-2xl border border-white/[0.07] bg-surface aspect-video flex items-center justify-center">
                        <span className="font-mono text-xs text-dark-400">[ nenhum endereço cadastrado ]</span>
                    </div>
                ) : (
                    <div className={`grid grid-cols-1 ${enderecos.length > 1 ? "lg:grid-cols-2" : ""} gap-8`}>
                        {enderecos.map(({ titulo, endereco: end }, i) => (
                            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2 rounded-2xl overflow-hidden border border-white/[0.07] aspect-video bg-surface">
                                    <iframe
                                        title={`Mapa ${titulo}`}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(end)}&output=embed`}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 flex flex-col justify-center gap-4">
                                    <div>
                                        <div className="text-xs font-bold uppercase text-dark-400 mb-2">{titulo}</div>
                                        <p className="text-base font-semibold">{end}</p>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps?q=${encodeURIComponent(end)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block text-center bg-accent text-dark-950 font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
                                    >
                                        Ver no Google Maps
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Contato */}
            <section id="contato" className="bg-dark-900 border-t border-white/[0.06] px-[6vw] py-[8vw]">
                <div className="mb-12">
                    <div className="text-xs font-bold tracking-widest uppercase text-accent-soft mb-3">Fale com a gente</div>
                    <h2 className="font-archivo font-black text-[clamp(30px,3.6vw,50px)] leading-tight">Contato</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {telefoneContato && (
                            <a href={`tel:${telefoneContato.replace(/\D/g, "")}`} className="bg-dark-950 border border-white/[0.07] rounded-2xl p-6 hover:border-accent/50 transition-colors">
                                <div className="text-xs font-bold uppercase text-dark-400 mb-2">Telefone</div>
                                <div className="text-lg font-semibold">{formatPhoneBR(telefoneContato)}</div>
                            </a>
                        )}
                        {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-dark-950 border border-white/[0.07] rounded-2xl p-6 hover:border-accent/50 transition-colors"
                            >
                                <div className="text-xs font-bold uppercase text-dark-400 mb-2">WhatsApp</div>
                                <div className="text-lg font-semibold">{formatPhoneBR(whatsapp)}</div>
                            </a>
                        )}
                        {email && (
                            <a href={`mailto:${email}`} className="bg-dark-950 border border-white/[0.07] rounded-2xl p-6 hover:border-accent/50 transition-colors sm:col-span-2">
                                <div className="text-xs font-bold uppercase text-dark-400 mb-2">Email</div>
                                <div className="text-lg font-semibold break-all">{email}</div>
                            </a>
                        )}
                        {!telefoneContato && !whatsapp && !email && (
                            <p className="text-dark-300 sm:col-span-2">Nenhuma informação de contato cadastrada ainda.</p>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-dark-950 to-dark-800 border border-white/[0.07] rounded-2xl p-8">
                        <h3 className="font-archivo font-black text-2xl mb-3">Pronto para conversar?</h3>
                        <p className="text-dark-300 mb-6">
                            Chame a gente no WhatsApp e tire suas duvidas sobre qualquer carro do nosso estoque.
                        </p>
                        <a
                            href={whatsapp ? `https://wa.me/${whatsapp}` : "#"}
                            target={whatsapp ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="inline-block bg-accent text-dark-950 font-bold px-7 py-4 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Falar no WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
