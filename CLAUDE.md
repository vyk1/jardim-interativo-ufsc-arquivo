# Projeto: Migração Firebase (RTDB + Storage) → Decap CMS

## Contexto

Este é um projeto React antigo, originalmente construído sobre o tier gratuito
(Spark) do Firebase. O tier expirou e as URLs de imagens hospedadas no
Firebase Storage estão inacessíveis publicamente. Tanto o **Realtime Database
(RTDB)** quanto o **Storage** ainda estão acessíveis via Console do Firebase
(login autenticado), então a migração pode ser feita com segurança antes de
desativar qualquer coisa.

O objetivo final é **desacoplar o projeto do Firebase** e passar a usar
**Decap CMS** (antigo Netlify CMS, mesma base de código, MIT license,
git-based) como painel administrativo, com conteúdo e mídia versionados
dentro do próprio repositório.

Decap CMS não exige nenhum framework específico — funciona com qualquer stack
desde que o conteúdo final seja lido de arquivos (Markdown/YAML/JSON) no
build, não de uma API/banco em runtime. Este projeto é React (confirmar
Vite vs. Create React App ao iniciar — ver "Perguntas antes de começar").

## Objetivo desta tarefa

1. Extrair todo o conteúdo do RTDB e todas as imagens do Storage.
2. Converter os registros do RTDB em arquivos de conteúdo (Markdown com
   frontmatter, ou YAML/JSON — definir conforme o schema real).
3. Reorganizar as imagens dentro do repositório, com paths relativos
   substituindo as URLs quebradas do Firebase Storage.
4. Configurar o Decap CMS (`admin/config.yml` + `admin/index.html`) apontando
   para essas collections e para a pasta de mídia local.
5. Validar que o site builda e renderiza 100% a partir dos arquivos locais,
   sem nenhuma chamada ao Firebase.
6. Só então: desativar/depreciar o uso do RTDB e do Storage no código.

**Não apagar nada no Console do Firebase.** A extração é read-only; a
desativação é só no lado do código do projeto.

## Perguntas para fazer ANTES de começar a codar

Se as respostas não estiverem nos arquivos do repo, pergunte à Vyk antes de
prosseguir:

- [ ] Vite ou Create React App? (`vite.config.*` vs `react-scripts` no
      `package.json` resolve isso)
- [ ] Qual é o schema típico de um nó do RTDB? (ex: `posts/{id}`,
      `items/{id}` — quais campos existem: título, corpo, data, referência de
      imagem, etc.)
- [ ] O site hoje é renderizado client-side puro (fetch do RTDB direto no
      componente) ou já tem alguma camada de build/SSG?
- [ ] Existe mais de um "tipo" de conteúdo no RTDB (ex: posts + páginas +
      configurações), ou é uma coleção só?
- [ ] Onde o repositório está hospedado (GitHub/GitLab/Bitbucket)? Decap
      precisa de um backend OAuth apontando pra lá.
- [ ] Onde o site é deployado hoje (se ainda é deployado)?

## Plano de execução

### Fase 1 — Extração (read-only, sem risco)

- Exportar o RTDB inteiro via Console (Realtime Database → ⋮ → Export JSON).
  Salvar como `migration/rtdb-export.json` (não commitar no repo final —
  ver `.gitignore` abaixo).
- Baixar o Storage inteiro:
  ```bash
  gsutil -m cp -r gs://<bucket-name> ./migration/storage-backup
  ```
  Se `gsutil` não estiver disponível, usar o Firebase Admin SDK (Node) como
  alternativa.

### Fase 2 — Script de conversão

Escrever um script (Node, já que o projeto é JS) que:

1. Lê `migration/rtdb-export.json`.
2. Para cada registro, gera um arquivo de conteúdo com frontmatter
   (formato exato a definir conforme o schema real do RTDB).
3. Nos campos que hoje contêm URL do Firebase Storage
   (`https://firebasestorage.googleapis.com/...`), substitui pelo path
   relativo do arquivo já baixado localmente (ex:
   `/images/uploads/nome-do-arquivo.jpg`), casando pelo nome/hash do
   arquivo em `storage-backup/`.
4. Loga qualquer referência de imagem que não encontrar correspondência
   local, para revisão manual — não falhar silenciosamente.

Saída esperada:
- `content/<collection>/<slug>.md` — um arquivo por item
- `public/images/uploads/` (ou path equivalente) — imagens organizadas

### Fase 3 — Configuração do Decap CMS

- Criar `public/admin/index.html` (boilerplate padrão do Decap, carregado
  via CDN ou `decap-cms-app` como módulo npm).
- Criar `public/admin/config.yml` com:
  - `backend`: apontando para o provedor Git do repo (GitHub/GitLab), **não**
    para Netlify Identity, a menos que a Vyk confirme que quer usar Netlify
    como host.
  - `media_folder` e `public_folder` apontando para a pasta de imagens
    definida na Fase 2.
  - Uma collection por tipo de conteúdo identificado na Fase 2, com os
    campos mapeados a partir do schema real do RTDB.
- Testar localmente com `npx decap-server` antes de conectar qualquer auth
  de produção.

### Fase 4 — Adaptar o React para consumir conteúdo estático

- Substituir as chamadas ao RTDB (`firebase/database`, `onValue`, etc.) por
  leitura dos arquivos de conteúdo — abordagem depende do bundler:
  - Vite: `import.meta.glob` para carregar os Markdown/JSON em build time.
  - CRA: pode exigir um passo de pré-build que gera um JSON consolidado a
    partir de `content/`, importado estaticamente.
- Remover imports e configuração do Firebase Storage/RTDB do código de
  runtime (manter apenas se algo além de conteúdo ainda depender do
  Firebase — confirmar com a Vyk).

### Fase 5 — Validação e limpeza

- Build completo do projeto sem nenhuma variável de ambiente do Firebase
  configurada — deve funcionar 100%.
- Conferir visualmente uma amostra de itens migrados (texto + imagem)
  contra o que existia antes.
- Só depois disso, remover dependências do `package.json`
  (`firebase`) se não forem mais usadas em nenhum lugar.

## Notas técnicas

- Se o volume de imagens for grande (>50–100MB no total), considerar Git
  LFS para a pasta de mídia em vez de commit direto — evita inchar o
  histórico do repositório.
- `migration/` (dump bruto do RTDB e backup do Storage) deve entrar no
  `.gitignore` — é material de trabalho, não conteúdo final do site.
- Preferência da Vyk: documentação e explicações em português; código e
  nomes de variáveis em inglês, como é padrão no projeto.

## Fora de escopo (não fazer sem confirmação explícita)

- Desativar Storage/RTDB no Console do Firebase.
- Trocar o framework do projeto (permanece React).
- Decidir entre self-host do backend Git do Decap vs. Netlify — perguntar
  antes.
