# Decap CMS — login e hospedagem no Netlify

O admin fica em `/admin/` (arquivos em [`public/admin/`](../public/admin/)). Como ele
autentica depende de qual backend está ativo no [`config.yml`](../public/admin/config.yml).

## Ambiente local

`config.yml` tem `local_backend: true`. Com o proxy rodando:

```bash
npx decap-server   # sobe em localhost:8081
npm start          # ou o container docker (docker compose up -d)
```

o admin em `/admin/` detecta o `local_backend` e conversa **direto com o proxy
local**, que lê e escreve os arquivos de `content/` no seu disco. Não existe
tela de login nesse modo — é por isso que abrir `/admin/` local não pede
usuário/senha nem OAuth.

Importante: nesse modo as mudanças ficam só no seu working directory, como
qualquer edição manual de arquivo. Você ainda precisa `git add` / `commit` /
`push` normalmente (ou deixar o Decap fazer isso quando o backend real de
produção estiver configurado — ver abaixo).

## Produção (backend `github`, sem `local_backend`)

Quando o site for acessado numa URL de produção (não localhost), o Decap usa
o backend declarado (`backend.name: github` no config.yml, apontando pro repo
`vyk1/jardim-interativo-ufsc-arquivo`). Aí sim aparece a tela **"Login with
GitHub"**, e o fluxo é OAuth:

1. Usuário clica em "Login with GitHub" no `/admin/`.
2. Decap redireciona pro GitHub (`github.com/login/oauth/authorize`).
3. Usuário autoriza o app OAuth.
4. GitHub redireciona de volta com um `code` de uso único.
5. **Algum servidor intermediário troca esse `code` por um access token** —
   isso é o "OAuth provider" / `base_url` do backend. Sem essa peça, o botão
   de login não funciona.
6. O token fica salvo no navegador (localStorage) e o Decap passa a chamar a
   API do GitHub diretamente para ler/escrever arquivos e criar commits.

Quem consegue de fato salvar mudanças depois de logado é quem tiver
permissão de escrita (collaborator) no repositório GitHub — o OAuth só
autentica a pessoa, a permissão de verdade é a do GitHub.

### O OAuth provider: Netlify (gratuito)

O Decap **não inclui** o servidor do passo 5 — usamos o provedor gratuito da
Netlify pra essa etapa. O `config.yml` já está apontando pra isso
(`backend.base_url: https://api.netlify.com`, valor padrão do backend
`github` do Decap).

Passo a passo pra habilitar (feito uma vez só):

1. **GitHub → criar um OAuth App**: `github.com` → avatar → Settings →
   Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: qualquer uma (ex: a URL do Firebase Hosting) — não é
     validada de verdade.
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
     — precisa ser exatamente essa.
   - Depois de criar, copiar o **Client ID** e gerar/copiar um **Client
     Secret** (só aparece uma vez).
2. **Netlify → criar um projeto ligado ao mesmo repo**:
   `app.netlify.com` → Add new project → Import an existing project →
   GitHub → `vyk1/jardim-interativo-ufsc-arquivo`. Esse mesmo projeto Netlify
   também é o que faz o deploy experimental — ver seção abaixo.
3. No projeto criado: **Project configuration → Access & security →
   OAuth → Authentication Providers → Install provider → GitHub**, cola
   o Client ID e o Client Secret do passo 1, salva.

Depois disso, abrir `/admin/` na URL de produção (Firebase Hosting ou
Netlify — não localhost, lá quem manda é o `local_backend`) mostra o botão
"Login with GitHub" funcionando de verdade.

### Pegadinha: 404 em `api.netlify.com/auth` fora do domínio da Netlify

O `site_id` que o Decap manda pra Netlify na hora do login é, por padrão, o
**hostname atual da página** — funciona liso quando o `/admin/` é aberto no
próprio domínio `.netlify.app`, mas dá 404 quando é aberto em qualquer outro
domínio (Firebase Hosting, por exemplo), porque a Netlify não reconhece esse
domínio como dono do provider OAuth configurado.

Fix: fixar o `site_domain` no `config.yml` com o domínio real do projeto
Netlify (`jardim-interativo.netlify.app`) — assim o `site_id` enviado é
sempre o mesmo, não importa de onde o `/admin/` foi aberto.

## Hospedagem paralela no Netlify (experimento)

Decisão: **Firebase Hosting continua sendo a produção real.** O projeto
Netlify criado acima (só pra habilitar o OAuth) também está configurado pra
fazer deploy de verdade do site, como experimento em paralelo — sem
substituir o Firebase Hosting nem apontar domínio final pra lá.

O que controla esse deploy é o [`netlify.toml`](../netlify.toml) na raiz do
repo:

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "12"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- `NODE_VERSION = "12"` porque o projeto é CRA antigo (`react-scripts 3.0.1`,
  `engines.node: 12` no `package.json`) — validado rodando `npm run build`
  dentro do container Docker (`node:12-bullseye`) antes de confiar no build
  da Netlify.
- O bloco `[[redirects]]` é o equivalente ao rewrite `"**" -> "/index.html"`
  que já existe no `firebase.json`, necessário porque o app usa
  `react-router-dom` com `BrowserRouter` (rotas client-side) — sem isso,
  recarregar a página numa rota que não seja `/` dá 404 na Netlify.

Como funciona na prática: todo push pro `master` do
`vyk1/jardim-interativo-ufsc-arquivo` dispara um novo build/deploy
automático no projeto Netlify (comportamento padrão de projeto importado do
GitHub). A URL do deploy fica visível no dashboard do projeto
(`app.netlify.com`), formato tipo `nome-aleatorio.netlify.app`.

### Cuidado: Firebase ainda é chamado em runtime

Até a Fase 4 da migração (trocar as leituras do RTDB por leitura estática
dos arquivos de `content/`) sair do papel, o app ainda faz chamadas reais ao
Firebase (Auth/RTDB/Storage) direto do navegador — em qualquer domínio onde
estiver rodando, incluindo o do Netlify.

Isso importa porque a API key do Firebase está restrita por referrer HTTP só
aos domínios `jardim-interativo.web.app` e `jardim-interativo.firebaseapp.com`
(ver decisão de segurança tomada à parte). Ou seja: **o site rodando no
domínio do Netlify vai ter as chamadas ao Firebase bloqueadas** até essa
restrição ser ajustada pra incluir o domínio `*.netlify.app` gerado. Se for
testar o experimento Netlify e algo que depende de Firebase não funcionar,
é esperado — é só adicionar o domínio à lista de referrers permitidos na
API key.
