# MEMORIES.md — Memórias do projeto

Fatos do projeto que não estão no código nem no git, mas que ajudam a trabalhar aqui. Para instruções de trabalho, veja [AGENTS.md](AGENTS.md). Para decisões e o porquê delas, veja [DECISIONS.md](DECISIONS.md).

## Servidor de produção

- VPS `72.60.251.247`, compartilhado com outros projetos do dono (essencial-bot, emailReport, rest-leads-essencial, evolution-api e outros). Não mexer em containers que não são do loja-carros.
- Acesso SSH por chave; o usuário é `root`.
- Projeto em `/opt/loja-carros`, clone de `github.com/juhlio/loja-carros`.
- Containers do projeto: `loja-carros-app`, `loja-carros-ssr`, `loja-carros-nginx` (porta 8081 no host), `loja-carros-mysql`.
- Nginx do host faz proxy para `localhost:8081`, com HTTPS via Let's Encrypt (certbot, renovação automática).
- Uptime Kuma monitora o VPS em `http://72.60.251.247:8083`. Ao subir um serviço novo nesse VPS, criar um monitor para ele.

## Servidor: estado que não deve ser perdido

- O `docker-compose.yml` de `/opt/loja-carros` tem alterações não commitadas (políticas `restart: unless-stopped` nos serviços `app`, `mysql` e `nginx`). Qualquer `git pull` precisa de `git stash` antes e `git stash pop` depois.
- O `public/build` é de propriedade do root (gerado pelo container). O build tem que ser feito dentro do container SSR.

## Ambiente local

- O Docker Compose local expõe o MySQL na porta do host `3307`. Antes a porta era `3306`, mas havia conflito com outro MySQL na máquina.
- Em produção, o `docker-compose.prod.yml` remove a exposição da porta do MySQL e do container app.
- O `public/build` local também é de propriedade do root quando gerado pelo container. Se o build falhar com `EACCES`, use o container SSR.
- Localmente, o banco tem poucos carros de teste (ex: Ferrari, BYD, Toyota). Não usar esse banco para avaliar a lista de marcas.

## Dados de produção

- Marcas cadastradas no banco de produção (consulta de out/2026): CHEVROLET, CITROEN, DUCATI, FIAT, FORD, HONDA, HYUNDAI, JEEP, KIA, MITSUBISHI, NISSAN, PEUGEOT, RENAULT, TOYOTA, VOLKSWAGEN e BMW.
- BYD não tem logo em `public/marcas/`. Enquanto não houver arquivo, o botão mostra o nome em texto.
- A lista de marcas do catálogo vem dos próprios carros (`carros.marca`). Não existe tabela de marcas.

## Google Analytics

- Propriedade GA4 "Comin Multimarcas", conta "Comin Multimarcas", fluxo Web "Site principal" (`https://cominmultimarcas.com.br`).
- ID de medição: `G-T1X7C7MFW3`. Está no `.env` de produção e no `.env` local, como `GA_MEASUREMENT_ID`.
- Search Console vinculado ao fluxo.
- Retenção de dados: 14 meses.
- O evento `whatsapp_clique` foi criado no código, mas ainda não foi confirmado no Realtime depois da correção de `transport_type: beacon` e dos nomes de origem.
- Os nomes de origem antigos (`cabecalho`, `inicio_hero`, `inicio_contato`, `detalhe_test_drive`) foram substituídos por `header`, `hero`, `contato` e `detalhe_carro`. Eventos antigos no GA4 não correspondem mais.
- Pendências no GA4: excluir tráfego interno (precisa do IP da rede e da loja) e marcar `whatsapp_clique` como conversão só depois de confirmar que o evento chega.

## Ferramentas e permissões

- O `.claude/settings.local.json` tem permissão para `ssh -o BatchMode=yes root@72.60.251.247 *`. Esse arquivo é pessoal e está no `.gitignore`.
- O classificador de ações bloqueou comandos de deploy e a criação do arquivo de permissões quando eram feitos sem autorização explícita nesta conversa. Se isso acontecer de novo, pedir ao dono para liberar a ação antes de tentar outro caminho.

## Contatos e canais

- WhatsApp da loja: número em `siteCfg.whatsapp` (configurações do painel). Os links usam `https://wa.me/{numero}`.
- Telefone da loja: em `siteCfg.telefone`.
- Cidade de atuação: Chapecó, SC.
