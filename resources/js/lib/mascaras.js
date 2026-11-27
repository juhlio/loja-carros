// Máscaras e validações dos formulários de carro.

// Placa no padrão Mercosul (ABC1D23) ou antigo (ABC1234). Aceita só letras e números.
export function maskPlaca(valor) {
    return String(valor ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

export function placaValida(valor) {
    const placa = maskPlaca(valor);
    return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa) || /^[A-Z]{3}[0-9]{4}$/.test(placa);
}

// Converte o que foi digitado em número: os dígitos são centavos ("123456" vira 1234.56).
export function digitosParaNumero(texto) {
    const digitos = String(texto ?? "").replace(/\D/g, "");

    return digitos ? Number(digitos) / 100 : "";
}

export function numeroParaMoeda(valor) {
    if (valor === "" || valor === null || valor === undefined) return "";

    return Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
