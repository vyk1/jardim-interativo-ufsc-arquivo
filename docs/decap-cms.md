# Decap CMS — como funciona o login

O admin fica em `/admin/` (arquivos em [`public/admin/`](../public/admin/)). Como ele
autentica depende de qual backend está ativo no [`config.yml`](../public/admin/config.yml).

## Ambiente local (o que está configurado hoje)

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

Quando o site for publicado sem o `local_backend`, o Decap usa o backend
declarado (`backend.name: github` no config.yml, apontando pro repo
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

### O OAuth provider: Netlify (gratuito, sem hospedar o site lá)

O Decap **não inclui** o servidor do passo 5 — decidimos usar o provedor
gratuito da Netlify pra essa etapa, sem migrar a hospedagem pra lá (o site
continua no Firebase Hosting). O `config.yml` já está apontando pra isso
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
2. **Netlify → criar um projeto ligado ao mesmo repo**, só pra ter acesso
   às configurações de OAuth (o deploy desse projeto Netlify não é usado
   pra nada — pode até falhar, sem problema):
   `app.netlify.com` → Add new project → Import an existing project →
   GitHub → `vyk1/jardim-interativo-ufsc-arquivo`.
3. No projeto criado: **Project configuration → Access & security →
   OAuth → Authentication Providers → Install provider → GitHub**, cola
   o Client ID e o Client Secret do passo 1, salva.

Depois disso, abrir `/admin/` na URL de produção (não localhost — lá quem
manda é o `local_backend`) mostra o botão "Login with GitHub" funcionando
de verdade. Quem consegue salvar depois de logado é quem tiver permissão
de escrita (collaborator) no repositório GitHub.
