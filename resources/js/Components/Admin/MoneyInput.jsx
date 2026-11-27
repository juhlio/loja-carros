import { digitosParaNumero, numeroParaMoeda } from "../../lib/mascaras";

// Campo de valor em reais. Digite só os números: "50000" aparece como 500,00 e o valor é guardado como número.
export default function MoneyInput({ name, value, onChange, className = "", required = false, placeholder = "0,00" }) {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-sm pointer-events-none">R$</span>
            <input
                type="text"
                inputMode="numeric"
                name={name}
                value={numeroParaMoeda(value)}
                onChange={(e) => onChange(digitosParaNumero(e.target.value))}
                placeholder={placeholder}
                required={required}
                className={`${className} pl-11`}
            />
        </div>
    );
}
