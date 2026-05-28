// @file src/ai/dev.ts
/**
 * @overview Genkit dev CLI 진입점 — `npm run genkit:dev`로 로컬 flow 개발 서버 기동.
 *
 * @call-flow
 * 1. dotenv — .env 로드 (GOOGLE_GENAI_API_KEY 등)
 * 2. ai/flows/* side-effect import — flow 등록
 * 3. genkit start — Dev UI에서 flow 테스트
 *
 * @see src/ai/genkit.ts, src/ai/flows/ai-reality-check-fact-bomb.ts
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-reality-check-fact-bomb.ts';
