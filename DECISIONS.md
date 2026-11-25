# DECISIONS.md — Decisões do projeto

Registro das decisões tomadas no projeto, com o motivo. Cada decisão tem contexto, escolha e consequências. Quando uma decisão for revertida, adicione uma nova entrada que a substitui, em vez de apagar a antiga.

## Índice

1. [Trabalho em branch, sem push direto na `main`](#1-trabalho-em-branch-sem-push-direto-na-main)
2. [Porta 3307 para o MySQL local](#2-porta-3307-para-o-mysql-local)
3. [Logos das marcas em SVG branco, do Simple Icons](#3-logos-das-marcas-em-svg-branco-do-simple-icons)
4. [Fallback para texto quando não há logo](#4-fallback-para-texto-quando-não-há-logo)
5. [ID do GA4 em variável de ambiente](#5-id-do-ga4-em-variável-de-ambiente)
6. [Evento de clique no WhatsApp via helper único](#6-evento-de-clique-no-whatsapp-via-helper-único)
7. [Envio do evento com `transport_type: beacon`](#7-envio-do-evento-com-transport_type-beacon)
8. [Origens padronizadas para o evento](#8-origens-padronizadas-para-o-evento)
9. [Build do frontend dentro do container](#9-build-do-frontend-dentro-do-container)
10. [Preservar as alterações locais do `docker-compose.yml` no servidor](#10-preservar-as-alterações-locais-do-docker-composeyml-no-servidor)
11. [Banner de consentimento adiado](#11-banner-de-consentimento-adiado)
12. [Permissões pessoais fora do git](#12-permissões-pessoais-fora-do-git)
13. [Documentação para agentes em `AGENTS.md`, com `CLAUDE.md` importando](#13-documentação-para-agentes-em-agentsmd-com-claudemd-importando)

---

## 1. Trabalho em branch, sem push direto na `main`

- **Data:** out/2026.
- **Contexto:** a `main` é a branch de produção, e o deploy é feito a partir dela no servidor.
- **Decisão:** cada mudança vai para uma branch (`chore/...`, `feat/...`, `fix/...`), que é mergeada na `main` com `--no-ff` depois do push.
- **Motivo:** deixa o histórico legível e facilita reverter uma mudança inteira.
- **Consequência:** o merge na `main` é um passo explícito, feito quando o dono pede.

## 2. Porta 3307 para o MySQL local

- **Data:** out/2026.
- **Contexto:** a máquina já tinha um MySQL rodando na porta 3306, o que impedia o container de subir.
- **Decisão:** o `docker-compose.yml` mapeia `3307:3306`.
- **Motivo:** evita conflito com o MySQL do host.
- **Consequência:** quem conecta de fora do Docker usa `localhost:3307`. Dentro do Docker, o app continua usando `mysql:3306`.

## 3. Logos das marcas em SVG branco, do Simple Icons

- **Data:** out/2026.
- **Contexto:** o catálogo mostrava o nome das marcas em texto. O projeto não tinha logos.
- **Decisão:** usar os ícones monocromáticos do Simple Icons (licença CC0), convertidos para branco, em `public/marcas/{slug}.svg`.
- **Motivo:** o pacote tem estilo visual uniforme e licença livre. O branco combina com o tema escuro do site, e a uniformidade atende ao pedido de padrão estético.
- **Consequência:** os logos não têm as cores originais das marcas. Marcas que o Simple Icons não tem (Mercedes, Land Rover, Jaguar, Lexus, BYD, CAOA, Chery) ficam com texto até receberem um SVG.

## 4. Fallback para texto quando não há logo

- **Data:** out/2026.
- **Contexto:** nem toda marca cadastrada tem logo. Não podemos deixar um botão vazio.
- **Decisão:** o componente `BotaoMarca` tenta carregar o SVG e, se der erro, mostra o nome em texto.
- **Motivo:** a página continua funcionando sem arquivos extras, e o logo entra só quando o arquivo existir.
- **Consequência:** o SVG precisa ter exatamente o slug gerado por `slugMarca`. O slug só tem letras e números, então "Aston Martin" vira `astonmartin`.

## 5. ID do GA4 em variável de ambiente

- **Data:** nov/2026.
- **Contexto:** o site precisava de Google Analytics, mas o ID não deve ficar fixo no código.
- **Decisão:** `GA_MEASUREMENT_ID` no `.env`, lido por `config/services.php`. A tag só é renderizada se a variável estiver preenchida, no `app.blade.php`.
- **Motivo:** permite trocar o ID sem novo commit e deixar o ambiente local sem a tag.
- **Consequência:** a variável precisa ser adicionada manualmente em todo ambiente novo. Depois de mudar, rodar `config:clear`.

## 6. Evento de clique no WhatsApp via helper único

- **Data:** nov/2026.
- **Contexto:** os botões de WhatsApp estão em vários componentes, e cada um precisava registrar o clique.
- **Decisão:** um helper único, `rastrearWhatsapp(origem, acao?)` em `resources/js/lib/analytics.js`, chamado no `onClick` de cada botão.
- **Motivo:** evita repetir a lógica e deixa a verificação de `window.gtag` em um lugar só.
- **Consequência:** qualquer novo botão de WhatsApp deve chamar esse helper, com uma origem da lista. Os botões de `CarCard` e `FloatingWhatsApp` também seguem essa regra.

## 7. Envio do evento com `transport_type: beacon`

- **Data:** nov/2026.
- **Contexto:** o link do WhatsApp abre em nova aba (`target="_blank"`). Em testes, alguns cliques não apareceram no Realtime do GA4. A causa exata não foi confirmada.
- **Decisão:** enviar o evento com `transport_type: 'beacon'`, que usa `navigator.sendBeacon` e sobrevive à navegação.
- **Motivo:** é a forma mais segura de registrar um evento que acontece junto com a abertura de uma nova aba.
- **Consequência:** a eficácia não foi confirmada em produção. A verificação é feita no Realtime com 5 cliques, um por origem.

## 8. Origens padronizadas para o evento

- **Data:** nov/2026.
- **Contexto:** as origens iniciais (`cabecalho`, `inicio_hero`, `inicio_contato`, `detalhe_test_drive`) tinham nomes inconsistentes.
- **Decisão:** usar `header`, `hero`, `contato`, `flutuante`, `card_carro` e `detalhe_carro`. Para os três botões da página de detalhe, o parâmetro `acao` (`test_drive`, `informacoes`, `test_drive_final`) identifica o botão.
- **Motivo:** nomes curtos e consistentes, e uma origem por local, como foi pedido.
- **Consequência:** eventos antigos no GA4 com os nomes antigos não se misturam com os novos.

## 9. Build do frontend dentro do container

- **Data:** out/2026.
- **Contexto:** `public/build` foi gerado pelo Docker e pertence ao root. O build no host falhava com `EACCES` ao limpar a pasta.
- **Decisão:** rodar `npm run build` dentro do container `loja-carros-ssr`, tanto local quanto no servidor.
- **Motivo:** o container tem permissão para escrever nos arquivos gerados. Não precisamos de `sudo` nem de `chown`.
- **Consequência:** o SSR precisa ser reiniciado depois de um build novo, porque o bundle é carregado só na inicialização.

## 10. Preservar as alterações locais do `docker-compose.yml` no servidor

- **Data:** out/2026.
- **Contexto:** o `docker-compose.yml` de produção tem políticas de restart que não estão commitadas. Um `git pull` falharia ou as sobrescreveria.
- **Decisão:** antes do `git pull`, guardar o arquivo com `git stash push -- docker-compose.yml`, e restaurar depois com `git stash pop`.
- **Motivo:** mantém as políticas de restart sem commitar ajustes que são do servidor.
- **Consequência:** se o `stash pop` falhar, as alterações ficam no stash e precisam ser restauradas à mão.

## 11. Banner de consentimento adiado

- **Data:** nov/2026.
- **Contexto:** o GA4 está ativo para todos os visitantes, sem consentimento. Pela LGPD, pode ser necessário um aviso de cookies.
- **Decisão:** não implementar banner nem Consent Mode por enquanto. O dono vai decidir.
- **Motivo:** a decisão depende de avaliação jurídica e de escolha do dono sobre o nível de conformidade.
- **Consequência:** a pendência está registrada. Antes de implementar, é preciso definir o texto do aviso e o comportamento de bloqueio.

## 12. Permissões pessoais fora do git

- **Data:** nov/2026.
- **Contexto:** o `.claude/settings.local.json` tem permissão de SSH para o servidor, que é específica da máquina do dono.
- **Decisão:** adicionar `.claude/settings.local.json` ao `.gitignore`.
- **Motivo:** permissões pessoais não devem ir para o repositório.
- **Consequência:** outros colaboradores precisam criar o próprio arquivo, se precisarem do mesmo acesso.

## 13. Documentação para agentes em `AGENTS.md`, com `CLAUDE.md` importando

- **Data:** nov/2026.
- **Contexto:** as instruções do projeto estavam espalhadas na conversa e na memória pessoal do dono.
- **Decisão:** `AGENTS.md` é a fonte de instruções. `CLAUDE.md` contém apenas `@AGENTS.md`. `MEMORIES.md` guarda fatos de operação. `DECISIONS.md` guarda decisões e motivos.
- **Motivo:** um arquivo só de instruções funciona para qualquer agente, e o `CLAUDE.md` evita duplicação.
- **Consequência:** ao mudar uma instrução, editar `AGENTS.md`. Não copiar o conteúdo para o `CLAUDE.md`.
