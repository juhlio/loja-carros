// Envia o clique em um botão de WhatsApp como evento do GA4.
// `origem` diz de qual botão veio o clique (ex: "cabecalho", "card_carro").
export function rastrearWhatsapp(origem) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "whatsapp_clique", { origem });
}
