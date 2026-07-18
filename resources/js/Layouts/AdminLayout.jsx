import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-dark-950 text-dark-50 font-manrope min-h-screen">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-dark-950/80 backdrop-blur-[12px]">
                <div className="px-[6vw] py-4 flex items-center justify-between">
                    <Link href="/admin/carros" className="flex items-center gap-3">
                        <span className="text-accent font-bold text-2xl">🚗</span>
                        <div>
                            <div className="font-bold text-sm">PAINEL ADMIN</div>
                            <div className="text-xs text-dark-400">Loja de Carros</div>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/admin/carros" className="font-semibold text-sm hover:text-accent transition-colors">
                            Carros
                        </Link>
                        <Link href="/" className="font-semibold text-sm hover:text-accent transition-colors">
                            Ver Site
                        </Link>
                        <a href="/logout" className="font-semibold text-sm text-dark-300 hover:text-accent transition-colors">
                            Sair
                        </a>
                    </nav>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-accent text-2xl leading-none"
                        aria-label="Menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden border-t border-white/[0.06] px-[6vw] py-4 space-y-3">
                        <Link href="/admin/carros" className="block font-semibold text-sm hover:text-accent transition-colors">Carros</Link>
                        <Link href="/" className="block font-semibold text-sm hover:text-accent transition-colors">Ver Site</Link>
                        <a href="/logout" className="block font-semibold text-sm text-dark-300 hover:text-accent transition-colors">Sair</a>
                    </div>
                )}
            </header>

            <main className="px-[6vw] py-8">
                {children}
            </main>
        </div>
    );
}
