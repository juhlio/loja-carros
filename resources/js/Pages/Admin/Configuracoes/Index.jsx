import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";

function Section({ title, children }) {
    return (
        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-8">
            <h2 className="font-archivo font-black text-xl mb-6">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

export default function Configuracoes({ settings }) {
    const { flash } = usePage().props;
    const [form, setForm] = useState(settings);
    const [logoPreview, setLogoPreview] = useState(
        settings.logo ? `/storage/${settings.logo}` : null
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoPreview(URL.createObjectURL(file));
        setForm(prev => ({ ...prev, _logo_file: file }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        // Campos de texto - pular logo (string) e _logo_file (File)
        const skip = new Set(["logo", "_logo_file"]);
        Object.entries(form).forEach(([k, v]) => {
            if (!skip.has(k) && v !== null && v !== undefined) {
                data.append(k, v);
            }
        });
        // Anexa arquivo de logo apenas se o usuario selecionou um novo
        if (form._logo_file instanceof File) {
            data.append("logo", form._logo_file);
        }
        router.post("/admin/configuracoes", data, {
            forceFormData: true,
            onError: (errs) => setErrors(errs),
            onSuccess: () => setErrors({}),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Configuracoes do Site" />
            <div className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="font-archivo font-black text-4xl mb-1">Configuracoes</h1>
                    <p className="text-dark-300 text-sm">Personalize informacoes e aparencia da loja</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <Section title="Identidade da Loja">
                        <div>
                            <label className={labelCls}>Logo</label>
                            <div className="flex gap-6 items-start">
                                <div className="w-24 h-24 flex-shrink-0 bg-dark-800 rounded-xl border-2 border-dashed border-white/[0.07] overflow-hidden flex items-center justify-center">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-dark-500 text-xs text-center px-2">Sem logo</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogo}
                                        className="w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 file:bg-accent file:text-dark-950 file:border-0 file:rounded file:px-3 file:py-1 file:font-bold cursor-pointer text-sm"
                                    />
                                    <p className="text-xs text-dark-500 mt-2">PNG, JPG (max 20MB)</p>
                                    {errors.logo && (
                                        <p className="text-xs text-red-500 mt-1">{errors.logo}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Nome da Loja *</label>
                            <input type="text" name="nome_loja" value={form.nome_loja} onChange={set} required className={inputCls} placeholder="Ex: Loja de Carros Premium" />
                        </div>
                        <div>
                            <label className={labelCls}>Descricao Breve</label>
                            <input type="text" name="descricao" value={form.descricao ?? ""} onChange={set} className={inputCls} placeholder="Sua melhor escolha em veiculos" />
                        </div>
                    </Section>

                    <Section title="Contato">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Telefone</label>
                                <input type="text" name="telefone" value={form.telefone ?? ""} onChange={set} className={inputCls} placeholder="(48) 99999-9999" />
                            </div>
                            <div>
                                <label className={labelCls}>WhatsApp</label>
                                <input type="text" name="whatsapp" value={form.whatsapp ?? ""} onChange={set} className={inputCls} placeholder="5548999999999" />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Email</label>
                            <input type="email" name="email" value={form.email ?? ""} onChange={set} className={inputCls} placeholder="contato@loja.com" />
                        </div>
                        <div>
                            <label className={labelCls}>Endereco (loja 1)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <input type="text" name="endereco_titulo" value={form.endereco_titulo ?? ""} onChange={set} className={inputCls} placeholder="Titulo, ex: Loja Centro" />
                                <div className="sm:col-span-2">
                                    <input type="text" name="endereco" value={form.endereco ?? ""} onChange={set} className={inputCls} placeholder="Rua Exemplo, 123 - Chapeco, SC" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Endereco (loja 2)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <input type="text" name="endereco_2_titulo" value={form.endereco_2_titulo ?? ""} onChange={set} className={inputCls} placeholder="Titulo, ex: Loja Bairro" />
                                <div className="sm:col-span-2">
                                    <input type="text" name="endereco_2" value={form.endereco_2 ?? ""} onChange={set} className={inputCls} placeholder="Av. Exemplo, 456 - Chapeco, SC" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Secao Sobre">
                        <div>
                            <label className={labelCls}>Titulo</label>
                            <input type="text" name="sobre_titulo" value={form.sobre_titulo ?? ""} onChange={set} className={inputCls} placeholder="Quem somos" />
                        </div>
                        <div>
                            <label className={labelCls}>Texto</label>
                            <textarea name="sobre_texto" value={form.sobre_texto ?? ""} onChange={set} rows="5" className={inputCls} placeholder="Descreva sua loja..." />
                        </div>
                    </Section>

                    <Section title="Estatisticas da Home">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className={labelCls}>Carros Vendidos</label>
                                <input type="text" name="carros_vendidos" value={form.carros_vendidos ?? ""} onChange={set} className={inputCls} placeholder="+500" />
                            </div>
                            <div>
                                <label className={labelCls}>Anos no Mercado</label>
                                <input type="text" name="anos_mercado" value={form.anos_mercado ?? ""} onChange={set} className={inputCls} placeholder="12" />
                            </div>
                            <div>
                                <label className={labelCls}>Avaliacao Google</label>
                                <input type="text" name="avaliacao_google" value={form.avaliacao_google ?? ""} onChange={set} className={inputCls} placeholder="4,9" />
                            </div>
                        </div>
                    </Section>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-dark-950 font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar Configuracoes"}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
