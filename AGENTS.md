# AGENTS.md — Comin Multimarcas (loja-carros)

Instruções para agentes (humanos ou IA) que trabalham neste projeto.

## O que é

Site e painel de uma loja de seminovos em Chapecó, SC (Comin Multimarcas). Público: clientes brasileiros. Toda a interface é em português do Brasil.

- Produção: https://cominmultimarcas.com.br
- Repositório: github.com/juhlio/loja-carros, branch principal `main`.

## Stack

- **Backend:** Laravel 12 (PHP), com Inertia.js (`inertiajs/inertia-laravel` 3.x).
- **Frontend:** React 19 + `@inertiajs/react` 3.x, Vite 7, Tailwind CSS 4.
- **Banco:** MySQL 8 (no Docker). Em produção, o banco é `loja_carros`.
- **SSR:** container `loja-carros-ssr` roda `bootstrap/ssr/ssr.js` para renderizar as páginas Inertia no servidor.
- **Infra:** Docker Compose. Em produção, Nginx do host faz proxy para `localhost:8081`.

## Estrutura que importa

- `app/Http/Controllers/Site/` — páginas públicas (catálogo, detalhe do carro, home).
- `app/Http/Controllers/Admin/` — painel: `CarroController`, `AdminController` (usuários e perfil), `SettingsController` (configurações da loja).
- `routes/web.php` — rotas públicas e do admin. O admin usa o middleware `admin`; usuários e configurações exigem `role.admin`.
- `resources/js/Pages/Site/` e `resources/js/Pages/` — páginas React.
- `resources/js/Pages/Admin/` — telas do painel.
- `resources/js/Components/` — componentes reutilizáveis (`CarCard`, `FloatingWhatsApp` etc.).
- `resources/js/lib/` — helpers (`text.js`, `image.js`, `phone.js`, `analytics.js`).
- `resources/views/app.blade.php` — template raiz: meta tags, SEO, Google Analytics.
- `config/services.php` — integrações (Google Analytics via `GA_MEASUREMENT_ID`).
- `public/marcas/` — logos das marcas de carro, em SVG branco.

## Como rodar localmente

```bash
docker compose up -d --build
docker exec loja-carros-app php artisan migrate --force
```

- Site local: http://localhost (porta 80, nginx).
- MySQL local: porta do host `3307` (`localhost:3307`), mapeada para `3306` do container.
- Build do frontend: dentro do container SSR, porque `public/build` pertence ao root (gerado pelo Docker):

```bash
docker exec loja-carros-ssr sh -c 'cd /app && npm run build'
```

- Para ver mudanças no front, rode o build acima. Não basta salvar o arquivo.
- Depois de mudar `.env` ou config: `docker exec loja-carros-app php artisan config:clear`.

## Testes

- Existe só a suíte de exemplo do Laravel (`tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php`). Não há cobertura real.
- Rodar: `docker exec loja-carros-app php artisan test`.
- Se adicionar um teste de fluxo, use banco de teste, nunca o banco de produção.

## Como publicar (deploy)

Produção é `/opt/loja-carros` no VPS `72.60.251.247`. O fluxo que usamos:

1. Criar branch a partir da `main` (ex: `feat/...`, `fix/...`, `chore/...`).
2. Commit com mensagem em português no padrão Conventional Commits (`feat:`, `fix:`, `chore:`). Terminar com a linha `Co-Authored-By` quando a IA tiver escrito o código.
3. Push da branch, merge na `main` com `--no-ff` e push da `main`.
4. No servidor:
   - Guardar alterações locais do `docker-compose.yml` com `git stash push -- docker-compose.yml`. O servidor tem alterações de restart nesse arquivo que não são commitadas, e não devem ser perdidas.
   - `git pull --ff-only origin main`
   - `git stash pop`
   - Build dentro do container SSR: `docker exec loja-carros-ssr sh -c "cd /app && npm run build"`
   - `docker restart loja-carros-ssr`, porque o SSR carrega o bundle só na inicialização.
   - `docker exec loja-carros-app php artisan view:clear` (e `config:clear` se mudou config).
5. Conferir: `curl https://cominmultimarcas.com.br/catalogo` deve responder 200.

Regras:
- **Não fazer push direto na `main`** sem combinar antes. Use branch.
- **Não tocar no banco de produção** sem autorização explícita. Leituras pontuais com `artisan tinker` são aceitáveis.
- **Não alterar o `.env` de produção** sem autorização explícita. Quando autorizado, o `.env` do servidor não vai para o git.
- Não commitar `.env`, `.claude/settings.local.json` nem `public/build`.

## Rastreamento (Google Analytics 4)

- ID de medição: definido em `GA_MEASUREMENT_ID` (`.env`). A tag só é renderizada se a variável estiver preenchida.
- Evento de conversão de contato: `whatsapp_clique`, enviado por `rastrearWhatsapp(origem, acao?)` em `resources/js/lib/analytics.js`.
- Origens válidas: `header`, `hero`, `contato`, `flutuante`, `card_carro`, `detalhe_carro`. Para `detalhe_carro`, o parâmetro `acao` identifica o botão.
- Não criar nem marcar conversões no GA4 sem combinar antes.
- Não há banner de consentimento. Decisão pendente, ver `DECISIONS.md`.

## Convenções de código

- Comentários em português, curtos e explicando o porquê, como os já existentes.
- Nomes de variáveis e funções em português quando fizerem parte do domínio (`carro`, `marca`, `preco`, `origem`). Mantenha o padrão dos arquivos vizinhos.
- Estilo do front: Tailwind com as cores de `tailwind.config.js` (`accent`, `dark-*`). Não introduzir cores fora da paleta.
- Não mudar o visual nem o comportamento de navegação dos botões sem pedido explícito.
- Links de WhatsApp: `https://wa.me/{whatsapp}`, com `target="_blank"` e `rel="noopener noreferrer"`. O número vem de `siteCfg.whatsapp` (configurações da loja).

## Logos das marcas

- Arquivos em `public/marcas/{slug}.svg`. O slug é o nome da marca em minúsculas, sem acento e sem espaço ou hífen (`volkswagen`, `rollsroyce`, `astonmartin`).
- Os SVGs são do Simple Icons (licença CC0), convertidos para `fill="#ffffff"`.
- Se a marca não tiver arquivo, o botão mostra o nome em texto. Isso é o comportamento esperado.

## Segurança e cuidados

- Não expor senhas, tokens ou IDs internos em código ou em documentação.
- O domínio de produção é `cominmultimarcas.com.br`. Não usar outros domínios em código sem combinar.
- Evitar alterações que afetem todas as páginas sem testar no navegador ou com `curl` no ambiente local.
