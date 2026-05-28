// @file src/ai/genkit.ts
/**
 * @overview Genkit 싱글톤 인스턴스 — Google AI 플러그인·Gemini 2.5 Flash 기본 모델.
 *
 * @call-flow
 * 1. genkit({ plugins: [googleAI()], model }) — ai export
 * 2. ai/flows/* — ai.defineFlow / ai.generate 등에서 import
 *
 * @see src/ai/flows/ai-reality-check-fact-bomb.ts, src/ai/dev.ts
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/** 앱 전역 Genkit 인스턴스 (Gemini 2.5 Flash). */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
