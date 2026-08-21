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

## Produção (backend `git-gateway`, sem `local_backend`)

**Histórico:** a primeira versão desse setup usava o backend `github`
(login "Login with GitHub" via OAuth, com a Netlify só como intermediária
pra trocar o code por token). Funcionava, mas exigia que todo mundo que
fosse editar conteúdo tivesse conta no GitHub. Trocamos pro backend
`git-gateway`, que usa o **Netlify Identity** — login por e-mail/senha ou
Google, sem precisar de GitHub.

Como funciona:

1. `admin/index.html` carrega o script do Netlify Identity Widget
   (`identity.netlify.com/v1/netlify-identity-widget.js`).
2. Usuário loga (e-mail/senha que ele mesmo define, ou "Sign in with
   Google") direto na tela do Decap — sem redirecionar pra lugar nenhum.
3. O Netlify Identity autentica a pessoa e emite um token.
4. O **Git Gateway** (serviço da Netlify) usa esse token pra autorizar
   chamadas à API do GitHub em nome do site — ele guarda um token de
   acesso ao repo internamente, ninguém precisa ter permissão direta no
   GitHub.

Ou seja: quem edita não precisa de conta no GitHub — só precisa ser
convidada pelo Netlify Identity.

### Cadastro: somente convite

Configurado como **Invite only** (não é cadastro aberto — ninguém cria
conta sozinho). Passo a passo (uma vez só):

1. **Netlify → Project configuration → Identity → Enable Identity.**
2. **Identity → Registration → Invite only** (confirmar que não está em
   "Open").
3. **Identity → Registration → External providers → Enable Google**
   (permite logar com conta Google além de e-mail/senha).
4. **Identity → Services → Git Gateway → Enable Git Gateway** — autentica
   com o GitHub e gera o token que o Git Gateway usa por trás.
5. **Identity → Invite users** → digita o e-mail de quem vai editar. A
   pessoa recebe um e-mail, clica, define senha (ou entra com Google) e
   já cai logada no fluxo — só falta abrir `/admin/`.

### Pegadinha herdada do setup antigo (não se aplica mais)

O backend `github` antigo tinha um problema de 404 quando `/admin/` era
aberto fora do domínio `.netlify.app` (a Netlify não reconhecia o
`site_id`). O `git-gateway` **não tem esse problema** — a autenticação
acontece toda via Netlify Identity, sem depender de qual domínio está
servindo a página. `/admin/` funciona igual no Firebase Hosting, na
Netlify ou em qualquer outro domínio.

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

### Firebase não é mais chamado em runtime

A Fase 4 da migração já saiu do papel: o app lê o conteúdo de
`content/plantapedia/*.md` (via `src/data/plantapedia.generated.json`,
gerado em build) em vez de consultar o RTDB, e o admin antigo
(Auth/Storage) foi removido. O pacote `firebase` nem está mais nas
dependências do projeto — então o site funciona igual em qualquer domínio
(Firebase Hosting, Netlify, etc.), sem nenhuma restrição de referrer de
API key entrando no caminho.
