// Envia o clique em um botão de WhatsApp como evento do GA4.
// `origem` diz de qual local veio o clique (header, hero, contato, flutuante, card_carro, detalhe_carro).
// `acao` é opcional e diferencia botões dentro do mesmo local (ex: test_drive, informacoes).
// transport_type "beacon" faz o envio sobreviver quando o link abre em nova aba.
export function rastrearWhatsapp(origem, acao) {
    if (typeof window.gtag !== "function") return;

    const params = { origem, transport_type: "beacon" };
    if (acao) params.acao = acao;

    window.gtag("event", "whatsapp_clique", params);
}
