function titleCaseWord(word) {
    if (/\d/.test(word)) return word.toUpperCase();
    if (word.length <= 3) return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Normaliza nomes de veículo vindos em ALL CAPS (ou mistos) para uma
// capitalização consistente, preservando siglas curtas e códigos com números.
export function titleCaseVeiculo(str) {
    if (!str) return "";
    return str
        .split(" ")
        .map(part => part.split("-").map(titleCaseWord).join("-"))
        .join(" ");
}

const COMBUSTIVEL_LABELS = {
    gasolina: "Gasolina",
    diesel: "Diesel",
    eletrico: "Elétrico",
    hibrido: "Híbrido",
};

export function formatCombustivel(valor) {
    if (!valor) return "";
    return COMBUSTIVEL_LABELS[valor.toLowerCase()] ?? titleCaseVeiculo(valor);
}

export function formatPreco(preco, { comCentavos = false } = {}) {
    return Number(preco).toLocaleString("pt-BR", {
        minimumFractionDigits: comCentavos ? 2 : 0,
        maximumFractionDigits: comCentavos ? 2 : 0,
    });
}

// Normaliza descrições cadastradas inteiramente em CAPS LOCK para
// texto de leitura normal, capitalizando o início de cada frase.
export function formatDescricao(texto) {
    if (!texto) return "";
    const temMinuscula = /[a-zà-ÿ]/.test(texto);
    if (temMinuscula) return texto;

    const lower = texto.toLowerCase();
    return lower.replace(/(^\s*[a-zà-ÿ]|[.!?]\s+[a-zà-ÿ])/g, match => match.toUpperCase());
}

export function maskPlaca(placa) {
    if (!placa) return "";
    const clean = placa.toUpperCase();
    if (clean.length <= 3) return clean;
    return clean.slice(0, 3) + "•".repeat(clean.length - 3);
}
