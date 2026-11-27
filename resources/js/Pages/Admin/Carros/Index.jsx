import { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import ConfirmDialog from "../../../Components/Admin/ConfirmDialog";

const SITUACOES = {
    disponivel: "Disponível",
    em_reparo: "Em reparo",
    reservado: "Reservado",
    vendido: "Vendido",
};

const ORIGENS = {
    compra_particular: "Compra de particular",
    fornecedor: "Fornecedor",
    troca: "Troca",
    consignado: "Consignado",
};

const CORES_SITUACAO = {
    disponivel: "bg-accent text-dark-950",
    em_reparo: "bg-orange-500/20 text-orange-300",
    reservado: "bg-blue-500/20 text-blue-300",
    vendido: "bg-dark-700 text-dark-300",
};

const POR_PAGINA = 20;

const moeda = (valor) => Number(valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const somar = (lista, campo) => lista.reduce((soma, c) => soma + Number(c[campo] ?? 0), 0);

const selectCls = "w-full px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg text-dark-50 focus:outline-none focus:border-accent transition-colors";

// Ações com área de toque de pelo menos 44px.
const acaoCls = "inline-flex items-center justify-center min-h-[44px] px-3 font-semibold text-sm transition-opacity hover:opacity-70";

// Lê o filtro da URL. Assim, ao voltar de uma ficha, a lista continua como estava.
const lerParametro = (nome, padrao) => new URLSearchParams(window.location.search).get(nome) ?? padrao;

export default function Index({ carros, podeFinanceiro }) {
    const [search, setSearch]                         = useState(() => lerParametro("busca", ""));
    const [sortBy, setSortBy]                         = useState(() => lerParametro("ordem", "recent"));
    const [situacaoFiltro, setSituacaoFiltro]         = useState(() => lerParametro("situacao", "todas"));
    const [origemFiltro, setOrigemFiltro]             = useState(() => lerParametro("origem", "todas"));
    const [visibilidadeFiltro, setVisibilidadeFiltro] = useState(() => lerParametro("visibilidade", "todos"));
    const [pagina, setPagina]                         = useState(() => Number(lerParametro("pagina", "1")) || 1);
    const [paraDeletar, setParaDeletar]               = useState(null);

    // Mantém os filtros na URL, sem recarregar a página.
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("busca", search);
        if (sortBy !== "recent") params.set("ordem", sortBy);
        if (situacaoFiltro !== "todas") params.set("situacao", situacaoFiltro);
        if (origemFiltro !== "todas") params.set("origem", origemFiltro);
        if (visibilidadeFiltro !== "todos") params.set("visibilidade", visibilidadeFiltro);
        if (pagina > 1) params.set("pagina", String(pagina));

        const query = params.toString();
        window.history.replaceState({}, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    }, [search, sortBy, situacaoFiltro, origemFiltro, visibilidadeFiltro, pagina]);

    // Qualquer mudança de filtro volta para a primeira página.
    useEffect(() => { setPagina(1); }, [search, situacaoFiltro, origemFiltro, visibilidadeFiltro, sortBy]);

    const filtered = carros.filter(c =>
        (c.modelo.toLowerCase().includes(search.toLowerCase()) ||
         c.marca.toLowerCase().includes(search.toLowerCase())) &&
        (situacaoFiltro === "todas" || c.situacao === situacaoFiltro) &&
        (origemFiltro === "todas" || c.origem === origemFiltro) &&
        (visibilidadeFiltro === "todos" || (visibilidadeFiltro === "ativos" ? c.ativo : !c.ativo))
    );

    const sorted = useMemo(() => [...filtered].sort((a, b) => {
        if (sortBy === "preco-asc")  return a.preco - b.preco;
        if (sortBy === "preco-desc") return b.preco - a.preco;
        return b.id - a.id;
    }), [filtered, sortBy]);

    const totalPaginas = Math.max(1, Math.ceil(sorted.length / POR_PAGINA));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const visiveis = sorted.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

    const confirmarDelete = () => {
        router.delete(`/admin/carros/${paraDeletar.id}`, { onFinish: () => setParaDeletar(null) });
    };

    const reais = carros.filter(c => !c.teste);
    const ativos = reais.filter(c => c.ativo).length;
    const ocultos = reais.length - ativos;
    const testes = carros.length - reais.length;

    // Resumo do estoque: carros reais que ainda não foram vendidos.
    const emEstoque = reais.filter(c => c.situacao !== "vendido");
    const vendidos = reais.filter(c => c.situacao === "vendido" && c.margem !== null && c.margem !== undefined);

    const colunas = [
        { titulo: "Veículo", classe: "sticky left-0 z-10 bg-dark-900 min-w-[180px]" },
        { titulo: "Ano" },
        { titulo: "KM", classe: "hidden md:table-cell" },
        { titulo: "Preço" },
        ...(podeFinanceiro ? [{ titulo: "Compra" }, { titulo: "Custos" }, { titulo: "Investido" }, { titulo: "Margem" }] : []),
        { titulo: "Situação" },
        { titulo: "Origem", classe: "hidden lg:table-cell" },
        { titulo: "Combustível", classe: "hidden lg:table-cell" },
        { titulo: "Ações", classe: "sticky right-0 z-10 bg-dark-900 text-center shadow-[-12px_0_12px_-8px_rgba(0,0,0,0.7)]" },
    ];

    return (
        <AdminLayout>
            <Head title="Gerenciar Carros" />

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-archivo font-black text-4xl mb-1">Gerenciar Carros</h1>
                    <p className="text-dark-300 text-sm">
                        {reais.length} veículos no estoque · {ativos} visíveis no site · {ocultos} ocultos
                        {testes > 0 && ` · ${testes} de teste (fora dos totais)`}
                    </p>
                </div>
                <Link
                    href="/admin/carros/create"
                    className="inline-block bg-accent text-dark-950 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity text-center whitespace-nowrap"
                >
                    + Adicionar Carro
                </Link>
            </div>

            {/* Resumo financeiro (só admin) */}
            {podeFinanceiro && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 min-w-0">
                        <p className="text-xs font-bold uppercase text-dark-400 mb-2">Investido em estoque</p>
                        <p className="font-archivo font-black text-xl sm:text-2xl break-words">{moeda(somar(emEstoque, "total_investido"))}</p>
                        <p className="text-xs text-dark-400 mt-1">Compra + reforma + custos extras</p>
                    </div>
                    <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 min-w-0">
                        <p className="text-xs font-bold uppercase text-dark-400 mb-2">Preço anunciado em estoque</p>
                        <p className="font-archivo font-black text-xl sm:text-2xl break-words">{moeda(somar(emEstoque, "preco"))}</p>
                        <p className="text-xs text-dark-400 mt-1">{emEstoque.length} veículos não vendidos</p>
                    </div>
                    <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 min-w-0">
                        <p className="text-xs font-bold uppercase text-dark-400 mb-2">Custos extras (todos)</p>
                        <p className="font-archivo font-black text-xl sm:text-2xl break-words">{moeda(somar(reais, "custos_total"))}</p>
                        <p className="text-xs text-dark-400 mt-1">Soma de todos os lançamentos</p>
                    </div>
                    <div className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 min-w-0">
                        <p className="text-xs font-bold uppercase text-dark-400 mb-2">Margem dos vendidos</p>
                        <p className="font-archivo font-black text-xl sm:text-2xl break-words">{moeda(somar(vendidos, "margem"))}</p>
                        <p className="text-xs text-dark-400 mt-1">
                            Estimativa: preço anunciado menos investido ({vendidos.length} {vendidos.length === 1 ? "veículo" : "veículos"})
                        </p>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
                <div>
                    <label htmlFor="filtro-busca" className="block text-xs font-bold uppercase text-dark-400 mb-2">Buscar</label>
                    <input
                        id="filtro-busca"
                        type="text"
                        placeholder="Marca ou modelo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 bg-dark-900 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-400 focus:outline-none focus:border-accent transition-colors"
                    />
                </div>

                <div>
                    <label htmlFor="filtro-visibilidade" className="block text-xs font-bold uppercase text-dark-400 mb-2">Visibilidade no site</label>
                    <select id="filtro-visibilidade" value={visibilidadeFiltro} onChange={(e) => setVisibilidadeFiltro(e.target.value)} className={selectCls}>
                        <option value="todos">Todos ({reais.length})</option>
                        <option value="ativos">Visíveis ({ativos})</option>
                        <option value="ocultos">Ocultos ({ocultos})</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="filtro-situacao" className="block text-xs font-bold uppercase text-dark-400 mb-2">Situação</label>
                    <select id="filtro-situacao" value={situacaoFiltro} onChange={(e) => setSituacaoFiltro(e.target.value)} className={selectCls}>
                        <option value="todas">Todas</option>
                        {Object.entries(SITUACOES).map(([valor, rotulo]) => (
                            <option key={valor} value={valor}>{rotulo}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="filtro-origem" className="block text-xs font-bold uppercase text-dark-400 mb-2">Origem</label>
                    <select id="filtro-origem" value={origemFiltro} onChange={(e) => setOrigemFiltro(e.target.value)} className={selectCls}>
                        <option value="todas">Todas</option>
                        {Object.entries(ORIGENS).map(([valor, rotulo]) => (
                            <option key={valor} value={valor}>{rotulo}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="filtro-ordem" className="block text-xs font-bold uppercase text-dark-400 mb-2">Ordenar por</label>
                    <select id="filtro-ordem" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectCls}>
                        <option value="recent">Mais Recentes</option>
                        <option value="preco-asc">Preço: Menor → Maior</option>
                        <option value="preco-desc">Preço: Maior → Menor</option>
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-dark-900 border border-white/[0.07] rounded-2xl overflow-hidden">
                {sorted.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <caption className="sr-only">Lista de carros cadastrados</caption>
                                <thead>
                                    <tr className="border-b border-white/[0.06] bg-dark-800">
                                        {colunas.map((col) => (
                                            <th
                                                key={col.titulo}
                                                scope="col"
                                                className={`px-6 py-4 text-xs font-bold uppercase text-dark-400 whitespace-nowrap text-left ${col.classe ?? ""}`}
                                            >
                                                {col.titulo}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visiveis.map(carro => (
                                        <tr key={carro.id} className="group border-b border-white/[0.06] hover:bg-dark-800 transition-colors">
                                            <td className="sticky left-0 z-10 bg-dark-900 group-hover:bg-dark-800 px-6 py-4 min-w-[180px]">
                                                <Link href={`/admin/carros/${carro.id}`} className="block hover:text-accent transition-colors">
                                                    <div className="font-semibold">
                                                        {carro.marca}
                                                        {carro.teste && <span className="ml-2 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-dark-700 text-dark-300">Teste</span>}
                                                    </div>
                                                    <div className="text-xs text-dark-400">{carro.modelo}</div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{carro.ano}</td>
                                            <td className="hidden md:table-cell px-6 py-4 text-sm whitespace-nowrap">{Number(carro.km).toLocaleString("pt-BR")} km</td>
                                            <td className="px-6 py-4 font-bold text-accent whitespace-nowrap">{moeda(carro.preco)}</td>

                                            {podeFinanceiro && (
                                                <>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{carro.preco_compra !== null ? moeda(carro.preco_compra) : "—"}</td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{moeda(carro.custos_total)}</td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap">{moeda(carro.total_investido)}</td>
                                                    <td className={`px-6 py-4 text-sm font-bold whitespace-nowrap ${carro.margem === null ? "text-dark-400" : carro.margem >= 0 ? "text-green-400" : "text-red-400"}`}>
                                                        {carro.margem === null ? "—" : moeda(carro.margem)}
                                                    </td>
                                                </>
                                            )}

                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${CORES_SITUACAO[carro.situacao] ?? ""}`}>
                                                    {SITUACOES[carro.situacao] ?? carro.situacao}
                                                </span>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-sm whitespace-nowrap">{ORIGENS[carro.origem] ?? "—"}</td>
                                            <td className="hidden lg:table-cell px-6 py-4 capitalize text-sm">{carro.combustivel}</td>
                                            <td className="sticky right-0 z-10 bg-dark-900 group-hover:bg-dark-800 px-2 py-2 shadow-[-12px_0_12px_-8px_rgba(0,0,0,0.7)]">
                                                <div className="flex justify-center">
                                                    <Link href={`/admin/carros/${carro.id}`} className={`${acaoCls} text-dark-100`}>
                                                        Ver
                                                    </Link>
                                                    <Link href={`/admin/carros/${carro.id}/edit`} className={`${acaoCls} text-accent`}>
                                                        Editar
                                                    </Link>
                                                    <button type="button" onClick={() => setParaDeletar(carro)} className={`${acaoCls} text-red-400`}>
                                                        Deletar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPaginas > 1 && (
                            <nav aria-label="Paginação" className="flex items-center justify-between gap-4 px-6 py-4 border-t border-white/[0.06]">
                                <p className="text-sm text-dark-400">
                                    Página {paginaAtual} de {totalPaginas} · {sorted.length} carros
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1}
                                        className="min-h-[44px] px-4 rounded-lg border border-white/[0.07] font-semibold text-sm disabled:opacity-40 hover:border-accent transition-colors"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas}
                                        className="min-h-[44px] px-4 rounded-lg border border-white/[0.07] font-semibold text-sm disabled:opacity-40 hover:border-accent transition-colors"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="py-16 text-center text-dark-400">
                        <p className="text-lg mb-2">Nenhum carro encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros ou adicione um novo veículo</p>
                    </div>
                )}
            </div>

            <ConfirmDialog
                aberto={!!paraDeletar}
                titulo="Deletar carro?"
                mensagem={paraDeletar ? `${paraDeletar.marca} ${paraDeletar.modelo} (${paraDeletar.placa}) será removido, junto com as fotos e os custos extras. Não dá para desfazer.` : ""}
                textoConfirmar="Deletar"
                perigo
                onConfirmar={confirmarDelete}
                onCancelar={() => setParaDeletar(null)}
            />
        </AdminLayout>
    );
}
