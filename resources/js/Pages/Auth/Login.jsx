import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

export default function Login() {
    const { errors } = usePage().props;
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post("/login", form, { onFinish: () => setLoading(false) });
    };

    const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";

    return (
        <div className="bg-dark-950 text-dark-50 font-manrope min-h-screen flex items-center justify-center px-4">
            <Head title="Login Admin" />
            <div className="w-full max-w-md">
                <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-dark-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="font-archivo font-black text-2xl">Painel Admin</h1>
                        <p className="text-dark-400 text-sm mt-1">Loja de Carros</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-dark-400 mb-2">Email</label>
                            <input type="email" name="email" value={form.email} onChange={set} required className={inputCls} placeholder="admin@loja.com" />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-dark-400 mb-2">Senha</label>
                            <input type="password" name="password" value={form.password} onChange={set} required className={inputCls} placeholder="••••••••" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-accent text-dark-950 font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                    <div className="mt-6 bg-dark-800 border border-white/[0.07] rounded-lg p-4 text-center">
                        <p className="text-xs text-dark-400 font-mono">admin@loja.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
