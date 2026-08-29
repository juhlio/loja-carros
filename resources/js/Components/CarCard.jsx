import { Link } from "@inertiajs/react";

export default function CarCard({ carro, badge, showCor = false }) {
    return (
        <Link href={carro.url} className="group block">
            <article className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-accent/50 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1">
                <div className="bg-stripe aspect-video relative flex items-center justify-center overflow-hidden">
                    {carro.imagens && carro.imagens.length > 0 ? (
                        <img
                            src={`/storage/${carro.imagens[0]}`}
                            alt={`${carro.marca} ${carro.modelo}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="font-mono text-xs text-dark-400">[ {carro.modelo} ]</span>
                    )}
                    {badge && (
                        <span className="absolute top-3 left-3 bg-accent text-dark-950 text-xs font-black uppercase px-2.5 py-1 rounded">
                            {badge}
                        </span>
                    )}
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                        <div className="flex justify-between items-baseline gap-2">
                            <h3 className="font-archivo font-black text-xl">{carro.marca} {carro.modelo}</h3>
                            <span className="text-xs text-dark-300 font-semibold">{carro.ano}</span>
                        </div>
                        <div className="text-sm text-dark-300 mt-1">
                            {Number(carro.km).toLocaleString("pt-BR")} KM • {carro.combustivel}
                        </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-3 mt-auto flex items-center justify-between gap-2">
                        <div className="font-archivo font-black text-2xl text-accent">
                            R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                        </div>
                        <div className="flex items-center gap-2">
                            {showCor && (
                                <span className="text-xs text-dark-300 border border-white/[0.10] px-2.5 py-1 rounded-full">{carro.cor}</span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-dark-100 group-hover:text-accent transition-colors">
                                Ver detalhes
                                <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
