import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { BarrasHorizontais, Indicador, moeda, numero } from "../../../Components/Admin/Graficos";

const cardCls = "bg-dark-900 border border-white/[0.07] rounded-2xl p-6";

const acaoCls = "bg-dark-900 border border-white/[0.07] rounded-xl px-5 py-4 font-semibold text-sm hover:border-accent hover:text-accent transition-colors text-center";

export default function Index({ podeFinanceiro, estoque, porSituacao, financeiro, alertas, recentes }) {
    const { adminAtual } = usePage().props;
    const dataTexto = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const hoje = dataTexto.charAt(0).toUpperCase() + dataTexto.slice(1);

    return (
        <AdminLayout>
            <Head title="Painel" />

            <div className="space-y-8">
                {/* Cabeçalho */}
                <div>
                    <h1 className="font-archivo font-black text-4xl mb-1">Olá, {adminAtual?.nome?.split(" ")[0] ?? "admin"}</h1>
                    <p className="text-dark-300 text-sm">{hoje}</p>
                </div>

                {/* Ações rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/carros/create" className={acaoCls}>+ Adicionar carro</Link>
                    <Link href="/admin/carros" className={acaoCls}>Ver estoque</Link>
                    {podeFinanceiro && <Link href="/admin/analise" className={acaoCls}>Análise do estoque</Link>}
                    {adminAtual?.role === "super_admin" && <Link href="/admin/configuracoes" className={acaoCls}>Configurações da loja</Link>}
                </div>

                {/* Estoque */}
                <div>
                    <h2 className="font-archivo font-black text-lg mb-4">Estoque</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        <Indicador titulo="Cadastrados" valor={numero(estoque.total)} />
                        <Indicador titulo="Visíveis no site" valor={numero(estoque.ativos)} detalhe={`${numero(estoque.ocultos)} ocultos`} />
                        <Indicador titulo="Em estoque" valor={numero(estoque.em_estoque)} detalhe="Não vendidos" />
                        <Indicador titulo="Reservados" valor={numero(estoque.reservados)} />
                        <Indicador titulo="Em reparo" valor={numero(estoque.em_reparo)} />
                        <Indicador titulo="Vendidos" valor={numero(estoque.vendidos)} />
                    </div>
                </div>

                {/* Financeiro (admin) */}
                {podeFinanceiro && financeiro && (
                    <div>
                        <h2 className="font-archivo font-black text-lg mb-4">Financeiro</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            <Indicador titulo="Investido em estoque" valor={moeda(financeiro.investido)} detalhe="Compra + reforma + custos extras" />
                            <Indicador titulo="Preço anunciado em estoque" valor={moeda(financeiro.preco_estoque)} />
                            <Indicador titulo="Custos extras no mês" valor={moeda(financeiro.custos_mes)} />
                            <Indicador titulo="Custos extras (total)" valor={moeda(financeiro.custos_total)} />
                            <Indicador
                                titulo="Margem média (vendidos)"
                                valor={financeiro.margem_media === null ? "—" : moeda(financeiro.margem_media)}
                                destaque={financeiro.margem_media !== null && financeiro.margem_media >= 0}
                            />
                        </div>
                    </div>
                )}

                {/* Situação e últimos cadastros */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <BarrasHorizontais
                        titulo="Situação do estoque"
                        descricao="Quantos veículos estão em cada etapa."
                        formatar={numero}
                        itens={porSituacao}
                        vazio="Nenhum carro cadastrado."
                    />

                    <div className={cardCls}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-archivo font-black text-lg">Últimos cadastrados</h2>
                            <Link href="/admin/carros" className="text-accent text-sm font-semibold hover:opacity-70">Ver todos</Link>
                        </div>
                        {recentes.length === 0 ? (
                            <p className="text-dark-400 text-sm py-8 text-center">Nenhum carro cadastrado ainda.</p>
                        ) : (
                            <ul className="divide-y divide-white/[0.06]">
                                {recentes.map((c) => (
                                    <li key={c.url} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{c.nome}</p>
                                            <p className="text-xs text-dark-400">{c.detalhe}</p>
                                        </div>
                                        <Link href={c.url} className="inline-flex items-center min-h-[44px] text-accent text-sm font-semibold hover:opacity-70 whitespace-nowrap">Ver ficha</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Alertas */}
                <div>
                    <h2 className="font-archivo font-black text-lg mb-4">Pontos de atenção</h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {alertas.map((alerta) => (
                            <div key={alerta.titulo} className={cardCls}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-archivo font-black text-base">{alerta.titulo}</h3>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${alerta.quantidade > 0 ? "bg-orange-500/20 text-orange-300" : "bg-dark-700 text-dark-300"}`}>
                                        {numero(alerta.quantidade)}
                                    </span>
                                </div>
                                {alerta.itens.length === 0 ? (
                                    <p className="text-dark-400 text-sm">Nada a fazer aqui.</p>
                                ) : (
                                    <ul className="divide-y divide-white/[0.06]">
                                        {alerta.itens.map((item) => (
                                            <li key={item.url} className="py-2.5 flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold truncate">{item.nome}</p>
                                                    {item.detalhe && <p className="text-xs text-dark-400">{item.detalhe}</p>}
                                                </div>
                                                <Link href={item.url} className="inline-flex items-center min-h-[44px] text-accent text-xs font-semibold hover:opacity-70 whitespace-nowrap">Abrir</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {alerta.quantidade > alerta.itens.length && (
                                    <Link href="/admin/carros" className="inline-flex items-center min-h-[44px] text-sm text-accent font-semibold hover:opacity-70 mt-2">
                                        Ver os {numero(alerta.quantidade)} no estoque &rarr;
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
