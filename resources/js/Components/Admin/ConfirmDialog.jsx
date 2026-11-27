import { useEffect, useRef } from "react";

// Modal de confirmação. Fecha com Esc e com o botão Cancelar. O foco vai para o botão Cancelar,
// para que uma tecla Enter acidental não confirme a exclusão.
export default function ConfirmDialog({
    aberto,
    titulo,
    mensagem,
    textoConfirmar = "Confirmar",
    perigo = false,
    onConfirmar,
    onCancelar,
}) {
    const cancelarRef = useRef(null);

    useEffect(() => {
        if (!aberto) return;

        cancelarRef.current?.focus();

        const aoPressionarEsc = (e) => {
            if (e.key === "Escape") onCancelar();
        };

        window.addEventListener("keydown", aoPressionarEsc);
        return () => window.removeEventListener("keydown", aoPressionarEsc);
    }, [aberto, onCancelar]);

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={onCancelar}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirmar-titulo"
                aria-describedby="confirmar-mensagem"
                className="w-full max-w-md bg-dark-900 border border-white/[0.1] rounded-2xl p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="confirmar-titulo" className="font-archivo font-black text-xl mb-2">{titulo}</h2>
                <p id="confirmar-mensagem" className="text-dark-300 text-sm mb-6">{mensagem}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        ref={cancelarRef}
                        type="button"
                        onClick={onCancelar}
                        className="px-5 py-2.5 rounded-lg font-bold text-sm bg-dark-800 text-dark-50 border border-white/[0.07] hover:border-accent transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-opacity hover:opacity-90 ${perigo ? "bg-red-500 text-white" : "bg-accent text-dark-950"}`}
                    >
                        {textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}
