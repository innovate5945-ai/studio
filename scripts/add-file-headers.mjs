#!/usr/bin/env node
/**
 * @file scripts/add-file-headers.mjs
 *
 * @overview
 * IronTrader `studio/src/` 전체를 재귀 탐색하여 `// @file` 주석이 없는
 * `.ts`/`.tsx` 파일에 파일 경로 태그를 자동 삽입합니다.
 * shadcn `components/ui/*`에는 최소 `@overview` 한 줄만 추가합니다.
 *
 * @audience
 * - **개발자**: 새 파일 추가 후 일괄 `@file` 태그 부착
 * - **AI 에이전트**: CODE_ANNOTATION_GUIDE 1단계 — 경로 SSOT 확보
 *
 * @usage
 * ```bash
 * cd studio
 * node scripts/add-file-headers.mjs
 * ```
 *
 * @behavior
 * 1. `src/` 하위 모든 `.ts`/`.tsx` 순회
 * 2. 이미 `// @file` 또는 `/* @file` 있으면 skip
 * 3. `'use client'|'use server'` 지시어 **다음 줄**에 `@file` 삽입
 * 4. `components/ui/*` → `@overview shadcn/ui 프리미티브` 한 줄 추가
 *
 * @outputs stdout — `+ src/...` (변경 파일), `Done: N files updated`
 *
 * @see docs/CODE_ANNOTATION_GUIDE.md, scripts/enrich-file-headers.mjs (2단계)
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
