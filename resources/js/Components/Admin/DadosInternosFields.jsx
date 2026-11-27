import MoneyInput from "./MoneyInput";

const inputCls = "w-full px-4 py-3 bg-dark-800 border border-white/[0.07] rounded-lg text-dark-50 placeholder-dark-500 focus:outline-none focus:border-accent transition-colors";
const labelCls = "block text-xs font-bold uppercase text-dark-400 mb-2";
const secaoCls = "border-t border-white/[0.06] pt-6 space-y-6";
const tituloCls = "font-archivo font-black text-lg";

// Campos que só aparecem no painel. Não vão para o site.
// `podeFinanceiro` controla a seção de valores de compra e de venda mínima.
export default function DadosInternosFields({ form, setForm, podeFinanceiro }) {
    const set = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const setBool = (name) => (e) => {
        setForm(prev => ({ ...prev, [name]: e.target.checked }));
    };

    const setMoney = (name) => (valor) => {
        setForm(prev => ({ ...prev, [name]: valor }));
    };

    return (
        <div id="internos" className="space-y-8 scroll-mt-28">
            <div>
                <h2 className="font-archivo font-black text-xl">Dados internos</h2>
                <p className="text-dark-400 text-sm mt-1">Estas informações não aparecem no site.</p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer min-h-[44px] bg-dark-800 border border-white/[0.07] rounded-lg p-4">
                <input type="checkbox" name="teste" checked={!!form.teste} onChange={setBool("teste")} className="w-5 h-5 mt-0.5 accent-[#ffed00]" />
                <span>
                    <span className="block text-sm font-semibold">Registro de teste</span>
                    <span className="block text-xs text-dark-400 mt-1">Marque para não contar este carro nos totais, gráficos e análises.</span>
                </span>
            </label>

            {podeFinanceiro && (
                <div className={secaoCls}>
                    <h3 className={tituloCls}>Financeiro</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="preco_compra" className={labelCls}>Preço de compra</label>
                            <MoneyInput name="preco_compra" value={form.preco_compra ?? ""} onChange={setMoney("preco_compra")} className={inputCls} />
                        </div>
                        <div>
                            <label htmlFor="custo_reforma" className={labelCls}>Custo de reforma</label>
                            <MoneyInput name="custo_reforma" value={form.custo_reforma ?? ""} onChange={setMoney("custo_reforma")} className={inputCls} />
                        </div>
                        <div>
                            <label htmlFor="preco_minimo" className={labelCls}>Preço mínimo</label>
                            <MoneyInput name="preco_minimo" value={form.preco_minimo ?? ""} onChange={setMoney("preco_minimo")} className={inputCls} />
                        </div>
                    </div>
                </div>
            )}

            <div className={secaoCls}>
                <h3 className={tituloCls}>Documentação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="renavam" className={labelCls}>RENAVAM</label>
                        <input id="renavam" type="text" name="renavam" value={form.renavam ?? ""} onChange={set} maxLength={20} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="chassi" className={labelCls}>Chassi</label>
                        <input id="chassi" type="text" name="chassi" value={form.chassi ?? ""} onChange={set} maxLength={30} className={`${inputCls} uppercase`} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ipva_situacao" className={labelCls}>Situação do IPVA</label>
                        <select id="ipva_situacao" name="ipva_situacao" value={form.ipva_situacao ?? ""} onChange={set} className={inputCls}>
                            <option value="">Não informado</option>
                            <option value="pago">Pago</option>
                            <option value="pendente">Pendente</option>
                            <option value="isento">Isento</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="licenciamento_ano" className={labelCls}>Licenciamento (ano)</label>
                        <input id="licenciamento_ano" type="number" name="licenciamento_ano" value={form.licenciamento_ano ?? ""} onChange={set} min="1900" max="2100" className={inputCls} />
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                        <input type="checkbox" name="multas" checked={!!form.multas} onChange={setBool("multas")} className="w-5 h-5 accent-[#ffed00]" />
                        <span className="text-sm font-semibold">Possui multas</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                        <input type="checkbox" name="gravame" checked={!!form.gravame} onChange={setBool("gravame")} className="w-5 h-5 accent-[#ffed00]" />
                        <span className="text-sm font-semibold">Possui gravame</span>
                    </label>
                </div>
            </div>

            <div className={secaoCls}>
                <h3 className={tituloCls}>Origem</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="origem" className={labelCls}>Tipo de origem</label>
                        <select id="origem" name="origem" value={form.origem ?? ""} onChange={set} className={inputCls}>
                            <option value="">Não informado</option>
                            <option value="compra_particular">Compra de particular</option>
                            <option value="fornecedor">Fornecedor</option>
                            <option value="troca">Troca</option>
                            <option value="consignado">Consignado</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fornecedor" className={labelCls}>Fornecedor</label>
                        <input id="fornecedor" type="text" name="fornecedor" value={form.fornecedor ?? ""} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="data_entrada" className={labelCls}>Data de entrada</label>
                        <input id="data_entrada" type="date" name="data_entrada" value={form.data_entrada ?? ""} onChange={set} className={inputCls} />
                    </div>
                </div>
            </div>

            <div className={secaoCls}>
                <h3 className={tituloCls}>Situação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="situacao" className={labelCls}>Situação *</label>
                        <select id="situacao" name="situacao" value={form.situacao ?? "disponivel"} onChange={set} required className={inputCls}>
                            <option value="disponivel">Disponível</option>
                            <option value="em_reparo">Em reparo</option>
                            <option value="reservado">Reservado</option>
                            <option value="vendido">Vendido</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="local_estoque" className={labelCls}>Local no estoque</label>
                        <input id="local_estoque" type="text" name="local_estoque" value={form.local_estoque ?? ""} onChange={set} className={inputCls} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="data_venda" className={labelCls}>Data da venda</label>
                        <input id="data_venda" type="date" name="data_venda" value={form.data_venda ?? ""} onChange={set} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="comprador" className={labelCls}>Comprador</label>
                        <input id="comprador" type="text" name="comprador" value={form.comprador ?? ""} onChange={set} className={inputCls} />
                    </div>
                </div>
            </div>

            <div className={secaoCls}>
                <h3 className={tituloCls}>Observações</h3>
                <textarea id="observacoes" name="observacoes" value={form.observacoes ?? ""} onChange={set} rows="4" className={inputCls} placeholder="Anotações internas, histórico de revisões, vistoria..." />
            </div>
        </div>
    );
}
