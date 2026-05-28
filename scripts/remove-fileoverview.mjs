#!/usr/bin/env node
/**
 * @file scripts/remove-fileoverview.mjs
 *
 * @overview
 * 레거시 `@fileOverview` JSDoc 블록만 안전하게 제거합니다.
 * `@overview`/`@call-flow` 체계로 마이그레이션 후 1회성 정리용.
 *
 * @audience
 * - **개발자**: enrich 스크립트 실행 전후 레거시 주석 cleanup
 * - **AI 에이전트**: `@fileOverview`가 `@overview`로 잘못 인식되는 문제 방지
 *
 * @usage
 * ```bash
 * cd studio
 * node scripts/remove-fileoverview.mjs
 * ```
 *
 * @behavior
 * - `src/**/*.ts(x)` 순회
 * - `/** @fileOverview ... */` 블록만 regex 제거 (import/code 미접촉)
 *
 * @outputs stdout — `removed legacy <path>`, `Done: N files`
 *
 * @see scripts/enrich-file-headers.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

let n = 0;
for (const abs of walk(SRC)) {
  let c = fs.readFileSync(abs, 'utf8');
  const before = c;
  c = c.replace(/\n\/\*\*\s*\n \* @fileOverview[\s\S]*?\*\/\n/g, '\n');
  c = c.replace(/^\/\*\*\s*\n \* @fileOverview[\s\S]*?\*\/\n/g, '');
  if (c !== before) {
    fs.writeFileSync(abs, c);
    n++;
    console.log('removed legacy', path.relative(SRC, abs));
  }
}
console.log(`Done: ${n} files`);
