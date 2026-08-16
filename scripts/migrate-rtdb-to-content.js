#!/usr/bin/env node
/**
 * Converte migration/rtdb-export.json (collection "plantapedia") em
 * content/plantapedia/<slug>.md (frontmatter) para o Decap CMS.
 *
 * Imagens: procura correspondência em migration/storage-backup/ (ainda não
 * baixado, nesta rodada) e copia para public/images/uploads/. O que não
 * encontrar fica logado em migration/image-report.md, sem falhar o script.
 *
 * Uso: node scripts/migrate-rtdb-to-content.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RTDB_EXPORT = path.join(ROOT, 'migration', 'rtdb-export.json');
const STORAGE_BACKUP_DIR = path.join(ROOT, 'migration', 'storage-backup');
const CONTENT_DIR = path.join(ROOT, 'content', 'plantapedia');
const MEDIA_OUT_DIR = path.join(ROOT, 'public', 'images', 'uploads');
const REPORT_PATH = path.join(ROOT, 'migration', 'image-report.md');

// espelha src/data/HabCresc.jsx e src/data/MdTx.jsx
const HABIT_LOOKUP = { 1: 'Árvore', 2: 'Arbusto', 3: 'Herbácea', 4: 'Liana', 5: 'Trepadeira' };
const MDTX_LOOKUP = { 1: 'Medicinal', 2: 'Tóxica' };

const FIELD_ORDER = [
  'popularName',
  'scientificName',
  'description',
  'habit',
  'mdtx',
  'geoDistrib',
  'prepMode',
  'utilization',
  'observations',
  'effects',
  'activeIngredient',
  'regionForTreatment',
  'therapeuticDose',
  'regionForPoison',
  'toxicIngredient',
  'toxicDose',
  'possibleWounds',
  'references',
  'image',
  'carouselImgs',
];

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(str) {
  return stripAccents(String(str))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function decodeStorageUrl(url) {
  const m = url.match(/\/o\/([^?]+)\?/);
  if (!m) return null;
  return decodeURIComponent(m[1]);
}

function sniffExtension(filePath) {
  const buf = Buffer.alloc(12);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 12, 0);
  fs.closeSync(fd);
  if (buf[0] === 0xff && buf[1] === 0xd8) return '.jpg';
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (buf.slice(0, 3).toString('ascii') === 'GIF') return '.gif';
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return '.webp';
  return null;
}

// Map<slugKey, {name: string, full: string}[]> — várias entradas por chave quando
// nomes diferentes (ex: "Coerana" e "Coerana,") colapsam no mesmo slug.
function indexStorageBackup(dir) {
  const index = new Map();
  if (!fs.existsSync(dir)) return index;
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const ext = path.extname(entry.name);
        const base = ext ? entry.name.slice(0, -ext.length) : entry.name;
        const key = slugify(base);
        const list = index.get(key) || [];
        list.push({ name: base, full });
        index.set(key, list);
      }
    }
  }
  walk(dir);
  return index;
}

// garante que dois originais diferentes nunca produzam o mesmo path de destino
// (ex: "Coerana" e "Coerana," colidiriam em coerana.jpg sem isso)
function uniqueTargetName(targetBase, ext, orig, usedTargetNames) {
  let candidate = `${targetBase}${ext}`;
  let n = 2;
  while (usedTargetNames.has(candidate) && usedTargetNames.get(candidate) !== orig) {
    candidate = `${targetBase}-${n++}${ext}`;
  }
  usedTargetNames.set(candidate, orig);
  return candidate;
}

function resolveImage(url, storageIndex, usedTargetNames, reportRows, plantLabel) {
  const orig = decodeStorageUrl(url);
  if (!orig) {
    reportRows.push({ plant: plantLabel, orig: url, status: 'URL_FORMATO_INESPERADO', target: '' });
    return { path: null, ambiguous: false };
  }
  const ext = path.extname(orig);
  const base = ext ? orig.slice(0, -ext.length) : orig;
  const targetBase = slugify(base);
  const candidates = storageIndex.get(targetBase) || [];

  // várias entradas no storage-backup colapsam no mesmo slug: tenta achar a
  // que bate exatamente com o nome original (case-insensitive) antes de desistir
  let found = null;
  if (candidates.length === 1) {
    found = candidates[0].full;
  } else if (candidates.length > 1) {
    const exact = candidates.filter((c) => c.name.toLowerCase() === base.toLowerCase());
    if (exact.length === 1) found = exact[0].full;
  }

  if (found) {
    let finalExt = path.extname(found);
    if (!finalExt) finalExt = sniffExtension(found) || '.jpg';
    const targetName = uniqueTargetName(targetBase, finalExt, orig, usedTargetNames);
    fs.mkdirSync(MEDIA_OUT_DIR, { recursive: true });
    fs.copyFileSync(found, path.join(MEDIA_OUT_DIR, targetName));
    reportRows.push({ plant: plantLabel, orig, status: 'OK', target: `/images/uploads/${targetName}` });
    return { path: `/images/uploads/${targetName}`, ambiguous: false };
  }

  if (candidates.length > 1) {
    reportRows.push({
      plant: plantLabel,
      orig,
      status: 'AMBIGUO',
      target: candidates.map((c) => c.name).join(', '),
    });
    return { path: null, ambiguous: true };
  }

  const guessExt = ext || '.jpg';
  const targetName = uniqueTargetName(targetBase, guessExt, orig, usedTargetNames);
  const status = ext ? 'FALTANDO' : 'FALTANDO_SEM_EXTENSAO';
  reportRows.push({ plant: plantLabel, orig, status, target: `/images/uploads/${targetName}` });
  return { path: `/images/uploads/${targetName}`, ambiguous: !ext };
}

function yamlValue(v) {
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '\n' + v.map((item) => `  - ${JSON.stringify(String(item))}`).join('\n');
  }
  return JSON.stringify(String(v ?? ''));
}

function buildFrontmatter(fields, topComment) {
  const lines = ['---'];
  if (topComment) lines.push(`# ${topComment}`, '#');
  for (const key of FIELD_ORDER) {
    lines.push(`${key}: ${yamlValue(fields[key])}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function writeReport(rows) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  const ok = rows.filter((r) => r.status === 'OK');
  const missingNoExt = rows.filter((r) => r.status === 'FALTANDO_SEM_EXTENSAO');
  const missing = rows.filter((r) => r.status === 'FALTANDO');
  const ambiguous = rows.filter((r) => r.status === 'AMBIGUO');
  const bad = rows.filter((r) => r.status === 'URL_FORMATO_INESPERADO');

  const lines = [];
  lines.push('# Relatório de imagens — migração RTDB → Decap CMS', '');
  lines.push(`Gerado em ${new Date().toISOString()}`, '');
  lines.push(`- Total de referências de imagem: ${rows.length}`);
  lines.push(`- Resolvidas e copiadas para public/images/uploads/: ${ok.length}`);
  lines.push(`- Faltando em migration/storage-backup/: ${missing.length}`);
  lines.push(`- Faltando E sem extensão no nome original no Storage: ${missingNoExt.length}`);
  if (ambiguous.length) lines.push(`- Ambíguas (vários arquivos com o mesmo nome normalizado): ${ambiguous.length}`);
  if (bad.length) lines.push(`- URLs em formato inesperado: ${bad.length}`);
  lines.push('');

  if (ambiguous.length) {
    lines.push('## ⚠️ Ambíguas — mais de um arquivo em storage-backup/ bate com o mesmo nome', '');
    lines.push(
      'Não copiei nada para estas — escolha manualmente o arquivo certo e ajuste o ' +
        '`image`/`carouselImgs` no .md correspondente em content/plantapedia/.'
    );
    lines.push('');
    lines.push('| Planta | Referência original | Candidatos encontrados |');
    lines.push('|---|---|---|');
    for (const r of ambiguous) lines.push(`| ${r.plant} | \`${r.orig}\` | ${r.target} |`);
    lines.push('');
  }

  if (missingNoExt.length) {
    lines.push('## ⚠️ Sem extensão no Storage (atenção extra ao baixar)', '');
    lines.push(
      'Estes objetos foram salvos no Storage sem extensão no nome (ex: `Babosa_0`). ' +
        'Ao baixar (gsutil ou console), o arquivo local também virá sem extensão. ' +
        'Coloque-os em `migration/storage-backup/` com o nome original e rode o script de ' +
        'novo — ele detecta o tipo real pelos bytes do arquivo (jpg/png/gif/webp) e copia ' +
        'com a extensão correta.'
    );
    lines.push('');
    lines.push('| Planta | Nome original no Storage | Path de destino esperado |');
    lines.push('|---|---|---|');
    for (const r of missingNoExt) lines.push(`| ${r.plant} | \`${r.orig}\` | \`${r.target}\` |`);
    lines.push('');
  }

  if (missing.length) {
    lines.push('## Faltando em migration/storage-backup/', '');
    lines.push('| Planta | Nome original no Storage | Path de destino esperado |');
    lines.push('|---|---|---|');
    for (const r of missing) lines.push(`| ${r.plant} | \`${r.orig}\` | \`${r.target}\` |`);
    lines.push('');
  }

  if (bad.length) {
    lines.push('## URLs em formato inesperado (revisar manualmente)', '');
    for (const r of bad) lines.push(`- ${r.plant}: ${r.orig}`);
    lines.push('');
  }

  if (ok.length) {
    lines.push('## Resolvidas com sucesso', '');
    lines.push('| Planta | Nome original no Storage | Path final |');
    lines.push('|---|---|---|');
    for (const r of ok) lines.push(`| ${r.plant} | \`${r.orig}\` | \`${r.target}\` |`);
    lines.push('');
  }

  fs.writeFileSync(REPORT_PATH, lines.join('\n'));
}

function main() {
  if (!fs.existsSync(RTDB_EXPORT)) {
    console.error(`Export do RTDB não encontrado em ${RTDB_EXPORT}`);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(RTDB_EXPORT, 'utf8'));
  const plants = raw.plantapedia || {};
  // "teste" é coleção de dados fake usada em dev (ver DB_URL comentado em src/config.js) — ignorada.

  const storageIndex = indexStorageBackup(STORAGE_BACKUP_DIR);
  const reportRows = [];
  const usedSlugs = new Set();
  const usedTargetNames = new Map();

  fs.mkdirSync(CONTENT_DIR, { recursive: true });

  const entries = Object.entries(plants);
  for (const [rtdbKey, plant] of entries) {
    const label = plant.popularName || rtdbKey;
    const baseSlug = slugify(plant.popularName || rtdbKey) || slugify(rtdbKey);
    let finalSlug = baseSlug;
    let n = 2;
    while (usedSlugs.has(finalSlug)) finalSlug = `${baseSlug}-${n++}`;
    usedSlugs.add(finalSlug);

    let ambiguous = false;
    let imagePath = '';
    if (plant.image) {
      const r = resolveImage(plant.image, storageIndex, usedTargetNames, reportRows, label);
      imagePath = r.path || '';
      ambiguous = ambiguous || r.ambiguous;
    }
    const carouselPaths = [];
    for (const url of plant.carouselImgs || []) {
      const r = resolveImage(url, storageIndex, usedTargetNames, reportRows, label);
      if (r.path) carouselPaths.push(r.path);
      ambiguous = ambiguous || r.ambiguous;
    }

    const fields = {
      popularName: plant.popularName || '',
      scientificName: plant.scientificName || '',
      description: plant.description || '',
      habit: (plant.habit || []).map((id) => HABIT_LOOKUP[id]).filter(Boolean),
      mdtx: (plant.mdtx || []).map((id) => MDTX_LOOKUP[id]).filter(Boolean),
      geoDistrib: plant.geoDistrib || '',
      prepMode: plant.prepMode || '',
      utilization: plant.utilization || '',
      observations: plant.observations || '',
      effects: plant.effects || '',
      activeIngredient: plant.activeIngredient || '',
      regionForTreatment: plant.regionForTreatment || '',
      therapeuticDose: plant.therapeuticDose || '',
      regionForPoison: plant.regionForPoison || '',
      toxicIngredient: plant.toxicIngredient || '',
      toxicDose: plant.toxicDose || '',
      possibleWounds: plant.possibleWounds || '',
      references: plant.references || '',
      image: imagePath,
      carouselImgs: carouselPaths,
    };

    const topComment = ambiguous
      ? 'TODO(migração): imagem original sem extensão no Storage — ver migration/image-report.md antes de publicar'
      : null;

    fs.writeFileSync(path.join(CONTENT_DIR, `${finalSlug}.md`), buildFrontmatter(fields, topComment));
  }

  writeReport(reportRows);
  console.log(`OK: ${entries.length} arquivos gerados em ${path.relative(ROOT, CONTENT_DIR)}/`);
  console.log(`Relatório de imagens em ${path.relative(ROOT, REPORT_PATH)}`);
}

main();
