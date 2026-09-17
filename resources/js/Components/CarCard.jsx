import { Link, usePage } from "@inertiajs/react";
import { titleCaseVeiculo, tituloModelo, formatPreco, formatCombustivel } from "../lib/text";

export default function CarCard({ carro, badge, showCor = false, priority = false }) {
    const { siteCfg } = usePage().props;
    const whatsapp = siteCfg?.whatsapp ?? "";
    const marca = titleCaseVeiculo(carro.marca);
    const modelo = tituloModelo(carro.marca, carro.modelo);
    const mensagem = `Olá! Tenho interesse no ${marca} ${modelo} ${carro.ano} (R$ ${formatPreco(carro.preco)}). Podem me passar mais detalhes?`;
    const linkWhatsapp = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}` : null;

    return (
        <article className="group relative bg-surface border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-accent/50 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1">
            <Link href={carro.url} className="flex flex-col flex-1">
                <div className="bg-stripe aspect-video relative flex items-center justify-center overflow-hidden">
                    {carro.imagens && carro.imagens.length > 0 ? (
                        <img
                            src={`/storage/${carro.imagens[0]}`}
                            alt={`${marca} ${modelo}`}
                            loading={priority ? "eager" : "lazy"}
                            {...(priority ? { fetchPriority: "high" } : {})}
                            width={1200}
                            height={675}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="font-mono text-xs text-dark-400">[ {modelo} ]</span>
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
                            <h3 className="font-archivo font-black text-xl">{marca} {modelo}</h3>
                            <span className="text-xs text-dark-300 font-semibold">{carro.ano}</span>
                        </div>
                        <div className="text-sm text-dark-300 mt-1">
                            {Number(carro.km).toLocaleString("pt-BR")} KM • {formatCombustivel(carro.combustivel)}
                        </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-3 mt-auto flex items-center justify-between gap-2">
                        <div className="font-archivo font-black text-2xl text-accent">
                            R$ {formatPreco(carro.preco)}
                        </div>
                        <div className="flex items-center gap-2">
                            {showCor && (
                                <span className="text-xs text-dark-300 border border-white/[0.10] px-2.5 py-1 rounded-full">{titleCaseVeiculo(carro.cor)}</span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-dark-100 group-hover:text-accent transition-colors">
                                Ver detalhes
                                <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {linkWhatsapp && (
                <a
                    href={linkWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    aria-label={`Falar no WhatsApp sobre o ${marca} ${modelo}`}
                    className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] text-white shadow-md hover:scale-110 transition-transform"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.996.586 3.85 1.594 5.415L2 22l4.688-1.55A9.943 9.943 0 0 0 12.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2zm0 18.19a8.15 8.15 0 0 1-4.166-1.14l-.299-.177-3.11 1.03 1.045-3.03-.194-.31a8.15 8.15 0 0 1-1.257-4.36c0-4.518 3.677-8.194 8.194-8.194 4.518 0 8.194 3.676 8.194 8.194 0 4.517-3.676 8.194-8.194 8.194z" fillRule="evenodd" clipRule="evenodd"/>
                    </svg>
                </a>
            )}
        </article>
    );
}
