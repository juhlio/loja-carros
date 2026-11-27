import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import AnaliseCarro from "../../../Components/Admin/AnaliseCarro";
import CustosExtrasFields from "../../../Components/Admin/CustosExtrasFields";

const SITUACOES = { disponivel: "Disponível", em_reparo: "Em reparo", reservado: "Reservado", vendido: "Vendido" };
const ORIGENS = { compra_particular: "Compra de particular", fornecedor: "Fornecedor", troca: "Troca", consignado: "Consignado" };
const IPVA = { pago: "Pago", pendente: "Pendente", isento: "Isento" };

const moeda = (valor) => (valor === null || valor === undefined || valor === "")
    ? "—"
    : Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const data = (valor) => {
    if (!valor) return "—";
    const [ano, mes, dia] = valor.split("-");
    return `${dia}/${mes}/${ano}`;
};

const texto = (valor) => (valor === null || valor === undefined || valor === "" ? "—" : valor);

function Campo({ rotulo, valor }) {
    return (
        <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-dark-400 mb-1">{rotulo}</p>
            <p className="font-semibold break-words">{valor}</p>
        </div>
    );
}

function Secao({ id, titulo, descricao, children, className = "" }) {
    return (
        <section id={id} className={`bg-dark-900 border border-white/[0.07] rounded-2xl p-6 sm:p-8 space-y-6 scroll-mt-28 ${className}`}>
            <div>
                <h2 className="font-archivo font-black text-xl">{titulo}</h2>
                {descricao && <p className="text-dark-400 text-sm mt-1">{descricao}</p>}
            </div>
            {children}
        </section>
    );
}

export default function Show({ carro, podeFinanceiro, custos = [], categoriasCustos = {}, analise = null }) {
    const imagens = carro.imagens ?? [];

    const trocarSituacao = (situacao) => {
        router.patch(`/admin/carros/${carro.id}/situacao`, { situacao }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title={`${carro.marca} ${carro.modelo}`} />

            <div className="max-w-6xl space-y-8">
                {/* Cabeçalho com ações */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div className="min-w-0">
                        <Link href="/admin/carros" className="text-xs font-bold uppercase text-dark-400 hover:text-accent transition-colors">
                            &larr; Carros
                        </Link>
                        <h1 className="font-archivo font-black text-3xl mt-3 break-words">
                            <span className="text-accent">{carro.marca} {carro.modelo}</span> {carro.ano}
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-accent/20 text-accent">{SITUACOES[carro.situacao] ?? carro.situacao}</span>
                            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${carro.ativo ? "bg-green-500/20 text-green-300" : "bg-dark-700 text-dark-200"}`}>
                                {carro.ativo ? "Visível no site" : "Oculto do site"}
                            </span>
                            {carro.destaque && <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-dark-700 text-dark-100">Destaque</span>}
                            {carro.teste && <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-dark-700 text-dark-200">Registro de teste</span>}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <label className="flex flex-col text-xs font-bold uppercase text-dark-400 gap-2">
                            Trocar situação
                            <select
                                value={carro.situacao}
                                onChange={(e) => trocarSituacao(e.target.value)}
                                className="min-h-[44px] px-4 py-2 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 normal-case text-sm font-semibold focus:outline-none focus:border-accent"
                            >
                                {Object.entries(SITUACOES).map(([valor, rotulo]) => (
                                    <option key={valor} value={valor}>{rotulo}</option>
                                ))}
                            </select>
                        </label>
                        {carro.ativo && (
                            <a
                                href={carro.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] inline-flex items-center justify-center px-5 rounded-lg border border-white/[0.07] font-bold text-sm hover:border-accent hover:text-accent transition-colors"
                            >
                                Ver no site
                            </a>
                        )}
                        <Link
                            href={`/admin/carros/${carro.id}/edit`}
                            className="min-h-[44px] inline-flex items-center justify-center bg-accent text-dark-950 font-bold px-6 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            Editar informações
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna principal */}
                    <div className="lg:col-span-2 space-y-8 min-w-0">
                        {imagens.length > 0 && (
                            <section aria-label="Fotos do veículo" className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {imagens.map((img, i) => (
                                    <div key={i} className="rounded-lg overflow-hidden border border-white/[0.07] aspect-[4/3]">
                                        <img src={`/storage/${img}`} alt={`Foto ${i + 1} de ${carro.marca} ${carro.modelo}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </section>
                        )}

                        <Secao id="dados" titulo="Dados do veículo">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <Campo rotulo="Marca" valor={carro.marca} />
                                <Campo rotulo="Modelo" valor={carro.modelo} />
                                <Campo rotulo="Ano" valor={carro.ano} />
                                <Campo rotulo="Cor" valor={carro.cor} />
                                <Campo rotulo="Combustível" valor={carro.combustivel} />
                                <Campo rotulo="Quilometragem" valor={`${Number(carro.km).toLocaleString("pt-BR")} km`} />
                                <Campo rotulo="Placa" valor={carro.placa} />
                                <Campo rotulo="Preço anunciado" valor={moeda(carro.preco)} />
                            </div>
                            {carro.descricao && (
                                <div>
                                    <p className="text-xs font-bold uppercase text-dark-400 mb-1">Descrição</p>
                                    <p className="text-dark-200 whitespace-pre-line">{carro.descricao}</p>
                                </div>
                            )}
                        </Secao>

                        <Secao id="internos" titulo="Dados internos" descricao="Não aparecem no site.">
                            {podeFinanceiro && (
                                <div className="space-y-3">
                                    <h3 className="font-archivo font-black text-base">Financeiro</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <Campo rotulo="Preço de compra" valor={moeda(carro.preco_compra)} />
                                        <Campo rotulo="Custo de reforma" valor={moeda(carro.custo_reforma)} />
                                        <Campo rotulo="Preço mínimo" valor={moeda(carro.preco_minimo)} />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <h3 className="font-archivo font-black text-base">Tabela FIPE</h3>
                                {carro.fipe_codigo ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <Campo rotulo="Valor FIPE" valor={moeda(carro.fipe_valor)} />
                                        <Campo rotulo="Referência" valor={texto(carro.fipe_referencia)} />
                                        <Campo rotulo="Código FIPE" valor={carro.fipe_codigo} />
                                        <Campo
                                            rotulo="Preço vs FIPE"
                                            valor={carro.preco && carro.fipe_valor
                                                ? `${((Number(carro.preco) - Number(carro.fipe_valor)) / Number(carro.fipe_valor) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
                                                : "—"}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-dark-400 text-sm">Nenhum valor FIPE salvo. Use "Buscar na FIPE" na edição.</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-archivo font-black text-base">Documentação</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <Campo rotulo="RENAVAM" valor={texto(carro.renavam)} />
                                    <Campo rotulo="Chassi" valor={texto(carro.chassi)} />
                                    <Campo rotulo="IPVA" valor={IPVA[carro.ipva_situacao] ?? "—"} />
                                    <Campo rotulo="Licenciamento" valor={texto(carro.licenciamento_ano)} />
                                    <Campo rotulo="Multas" valor={carro.multas ? "Sim" : "Não"} />
                                    <Campo rotulo="Gravame" valor={carro.gravame ? "Sim" : "Não"} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-archivo font-black text-base">Origem</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <Campo rotulo="Tipo" valor={ORIGENS[carro.origem] ?? "—"} />
                                    <Campo rotulo="Fornecedor" valor={texto(carro.fornecedor)} />
                                    <Campo rotulo="Data de entrada" valor={data(carro.data_entrada)} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-archivo font-black text-base">Situação</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <Campo rotulo="Situação" valor={SITUACOES[carro.situacao] ?? "—"} />
                                    <Campo rotulo="Local no estoque" valor={texto(carro.local_estoque)} />
                                    <Campo rotulo="Data da venda" valor={data(carro.data_venda)} />
                                    <Campo rotulo="Comprador" valor={texto(carro.comprador)} />
                                </div>
                            </div>

                            {carro.observacoes && (
                                <div>
                                    <p className="text-xs font-bold uppercase text-dark-400 mb-1">Observações</p>
                                    <p className="text-dark-200 whitespace-pre-line">{carro.observacoes}</p>
                                </div>
                            )}
                        </Secao>
                    </div>

                    {/* Coluna lateral: análise e custos (só admin) */}
                    {podeFinanceiro && (
                        <aside className="space-y-8 min-w-0">
                            {analise && <AnaliseCarro analise={analise} />}

                            <Secao id="custos" titulo="Custos extras" descricao="Troca de óleo, pneus, funilaria e outros gastos.">
                                <CustosExtrasFields carroId={carro.id} custos={custos} categorias={categoriasCustos} />
                            </Secao>
                        </aside>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
