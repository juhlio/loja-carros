import { useEffect, useRef, useState } from "react";

// Embed do Google Maps sem chave de API. Se o iframe não sinalizar
// carregamento dentro do prazo (bloqueio de adblocker, rede lenta, etc.),
// mostra um fallback com link direto em vez de deixar o spinner infinito.
export default function MapaEmbed({ titulo, endereco }) {
    const [falhou, setFalhou] = useState(false);
    const carregadoRef = useRef(false);

    useEffect(() => {
        carregadoRef.current = false;
        setFalhou(false);
        const timer = setTimeout(() => {
            if (!carregadoRef.current) setFalhou(true);
        }, 8000);
        return () => clearTimeout(timer);
    }, [endereco]);

    const linkMaps = `https://www.google.com/maps?q=${encodeURIComponent(endereco)}`;

    if (falhou) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                <span className="text-sm text-dark-300">Não foi possível carregar o mapa aqui.</span>
                <a
                    href={linkMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-accent text-dark-950 font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                    Ver no Google Maps
                </a>
            </div>
        );
    }

    return (
        <iframe
            title={`Mapa ${titulo}`}
            src={`${linkMaps}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => { carregadoRef.current = true; }}
        />
    );
}
