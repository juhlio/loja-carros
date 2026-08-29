import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { adminAtual, flash, siteCfg } = usePage().props;
    const nomeLoja = siteCfg?.nome_loja || "Loja de Carros";
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-dark-950 text-dark-50 font-manrope min-h-screen">
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-dark-950/80 backdrop-blur-[12px]">
                <div className="px-[6vw] py-4 flex items-center justify-between">
                    <Link href="/admin/carros" className="flex items-center gap-3">
                        <span className="font-bold text-xl text-accent font-archivo">LC</span>
                        <div>
                            <div className="font-bold text-sm">PAINEL ADMIN</div>
                            <div className="text-xs text-dark-400">{nomeLoja}</div>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/admin/carros" className="font-semibold text-sm hover:text-accent transition-colors">
                            Carros
                        </Link>
                        {adminAtual?.role !== "vendedor" && (
                            <Link href="/admin/usuarios" className="font-semibold text-sm hover:text-accent transition-colors">
                                Usuarios
                            </Link>
                        )}
                        {adminAtual?.role === "super_admin" && (
                            <Link href="/admin/configuracoes" className="font-semibold text-sm hover:text-accent transition-colors">
                                Configuracoes
                            </Link>
                        )}
                        <Link href="/" className="font-semibold text-sm text-dark-300 hover:text-accent transition-colors">
                            Ver Site
                        </Link>

                        <div className="relative group">
                            <button className="flex items-center gap-2 font-semibold text-sm hover:text-accent transition-colors">
                                <span className="w-7 h-7 rounded-full bg-accent text-dark-950 flex items-center justify-center text-xs font-black">
                                    {adminAtual?.nome?.[0]?.toUpperCase() ?? "A"}
                                </span>
                                <span>{adminAtual?.nome ?? "Admin"}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-white/[0.07] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <Link href="/admin/perfil" className="block px-4 py-3 text-sm hover:bg-dark-700 rounded-t-xl font-semibold">
                                    Meu Perfil
                                </Link>
                                <a href="/logout" className="block px-4 py-3 text-sm hover:bg-dark-700 rounded-b-xl text-red-400 font-semibold">
                                    Sair
                                </a>
                            </div>
                        </div>
                    </nav>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-accent text-2xl leading-none"
                        aria-label="Menu"
                    >
                        {menuOpen ? "x" : "="}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden border-t border-white/[0.06] px-[6vw] py-4 space-y-3">
                        <Link href="/admin/carros" className="block font-semibold text-sm hover:text-accent transition-colors">Carros</Link>
                        {adminAtual?.role !== "vendedor" && (
                            <Link href="/admin/usuarios" className="block font-semibold text-sm hover:text-accent transition-colors">Usuarios</Link>
                        )}
                        {adminAtual?.role === "super_admin" && (
                            <Link href="/admin/configuracoes" className="block font-semibold text-sm hover:text-accent transition-colors">Configuracoes</Link>
                        )}
                        <Link href="/admin/perfil" className="block font-semibold text-sm hover:text-accent transition-colors">Meu Perfil</Link>
                        <Link href="/" className="block font-semibold text-sm text-dark-300 hover:text-accent transition-colors">Ver Site</Link>
                        <a href="/logout" className="block font-semibold text-sm text-red-400 hover:opacity-70 transition-opacity">Sair</a>
                    </div>
                )}
            </header>

            <main className="px-[6vw] py-8">
                {flash?.message && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm font-semibold">
                        {flash.message}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
