#!/usr/bin/env node
/**
 * @file scripts/add-file-headers.mjs
 * @overview src/ 하위 .ts/.tsx 파일에 // @file 주석이 없으면 자동 추가.
 * @usage node scripts/add-file-headers.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');

const SKIP_FULL_OVERVIEW = /[\\/]components[\\/]ui[\\/]/;

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function hasFileTag(content) {
  return /^\/\/ @file/m.test(content) || /^\/\* @file/m.test(content);
}

function relPath(abs) {
  return 'src/' + path.relative(SRC, abs).replace(/\\/g, '/');
}

function insertHeader(content, rel, isUi) {
  const fileLine = `// @file ${rel}\n`;
  const uiNote = isUi
    ? '/** @overview shadcn/ui 프리미티브 — 비즈니스 로직 없음. */\n'
    : '';

  const m = content.match(/^((?:'use (?:client|server)'|"use (?:client|server)");?\s*\n)/);
  if (m) {
    return m[1] + fileLine + uiNote + content.slice(m[1].length);
  }
  return fileLine + uiNote + content;
}

let updated = 0;
for (const abs of walk(SRC)) {
  let content = fs.readFileSync(abs, 'utf8');
  if (hasFileTag(content)) continue;
  const rel = relPath(abs);
  const isUi = SKIP_FULL_OVERVIEW.test(abs);
  content = insertHeader(content, rel, isUi);
  fs.writeFileSync(abs, content, 'utf8');
  updated++;
  console.log('+', rel);
}
console.log(`\nDone: ${updated} files updated.`);
