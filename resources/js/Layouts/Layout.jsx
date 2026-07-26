import { Link, usePage } from "@inertiajs/react";

export default function Layout({ children }) {
    const { siteCfg } = usePage().props;
    const nomeLoja = siteCfg?.nome_loja ?? "Loja de Carros";
    const whatsapp = siteCfg?.whatsapp ?? "";
    const logo     = siteCfg?.logo;

    return (
        <div className="bg-dark-950 text-dark-50 font-manrope min-h-screen">
            <header className="sticky top-0 z-50 flex items-center justify-between px-[6vw] py-[18px] bg-dark-950/80 backdrop-blur-[12px] border-b border-white/[0.06]">
                <Link href="/" className="flex items-center gap-3">
                    {logo ? (
                        <img src={`/storage/${logo}`} alt={nomeLoja} className="h-12 md:h-20 w-auto object-contain" />
                    ) : (
                        <span className="text-accent font-archivo font-black text-lg tracking-tight">{nomeLoja.toUpperCase()}</span>
                    )}
                </Link>

                <nav className="hidden md:flex items-center gap-[34px] text-sm font-semibold">
                    <Link href="/catalogo" className="hover:text-accent transition-colors">Catalogo</Link>
                    <a href="/#sobre"   className="hover:text-accent transition-colors">Sobre</a>
                    <a href="/#local"   className="hover:text-accent transition-colors">Localizacao</a>
                    <a href="/#contato" className="hover:text-accent transition-colors">Contato</a>
                </nav>

                <a
                    href={whatsapp ? `https://wa.me/${whatsapp}` : "/#contato"}
                    target={whatsapp ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="bg-accent text-dark-950 font-bold px-5 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                    Fale conosco
                </a>
            </header>

            <main>{children}</main>

            <footer className="border-t border-white/[0.06] mt-24 py-12 px-[6vw] text-center text-dark-300 text-sm">
                <p>&copy; {new Date().getFullYear()} {nomeLoja}. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
