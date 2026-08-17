#!/usr/bin/env node
/**
 * Lê content/plantapedia/*.md (frontmatter gerenciado pelo Decap CMS) e gera
 * src/data/plantapedia.generated.json, importado estaticamente pelo app —
 * substitui as leituras em runtime no Firebase RTDB. Roda antes de
 * `npm start`/`npm run build` (ver "prestart"/"prebuild" no package.json).
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'plantapedia');
const OUT_PATH = path.join(ROOT, 'src', 'data', 'plantapedia.generated.json');

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`frontmatter não encontrado em ${file}`);
  }
  return yaml.safeLoad(match[1]) || {};
}

function main() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));

  const plants = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const data = parseFrontmatter(raw, file);
    return { slug, ...data };
  });

  plants.sort((a, b) => (a.popularName || '').localeCompare(b.popularName || '', 'pt-BR'));

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(plants, null, 2) + '\n');
  console.log(`OK: ${plants.length} plantas em ${path.relative(ROOT, OUT_PATH)}`);
}

main();
