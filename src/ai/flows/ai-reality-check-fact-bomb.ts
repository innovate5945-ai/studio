'use server';
/**
 * @fileOverview A Genkit flow that provides an 'AI Reality-Check' report
 * based on trade logs, offering a data-driven critique of trading psychology
 * and identifying bad habits.
 *
 * - aiRealityCheckFactBomb - The main function to trigger the AI reality-check.
 * - AIRealityCheckInput - The input type for the aiRealityCheckFactBomb function.
 * - AIRealityCheckOutput - The return type for the aiRealityCheckFactBomb function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIRealityCheckInputSchema = z.object({
  tradeLogs: z
    .string()
    .describe(
      'The raw trade log data, which can be in various formats like CSV, JSON, or plain text.'
    ),
});
export type AIRealityCheckInput = z.infer<typeof AIRealityCheckInputSchema>;

const AIRealityCheckOutputSchema = z.object({
  critiqueSummary: z
    .string()
    .describe(
      "A concise, data-driven summary of the trader's psychology and habits inferred from the trade logs."
    ),
  badHabitsIdentified: z
    .array(z.string())
    .describe('A list of specific bad trading habits detected.'),
  dataDrivenInsights: z
    .array(
      z.object({
        metric: z.string().describe('The name of the metric (e.g., win rate, average loss).'),
        value: z.string().describe('The calculated value of the metric (e.g., 45%, $500).'),
        insight: z
          .string()
          .describe('A brief insight derived from this metric, related to trading behavior.'),
      })
    )
    .describe('Key metrics and insights based on the analyzed trade log data.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations for improving trading discipline and habits.'),
});
export type AIRealityCheckOutput = z.infer<typeof AIRealityCheckOutputSchema>;

export async function aiRealityCheckFactBomb(
  input: AIRealityCheckInput
): Promise<AIRealityCheckOutput> {
  return aiRealityCheckFlow(input);
}

const aiRealityCheckPrompt = ai.definePrompt({
  name: 'aiRealityCheckPrompt',
  input: { schema: AIRealityCheckInputSchema },
  output: { schema: AIRealityCheckOutputSchema },
  prompt: `You are an expert trading psychologist and data analyst specializing in identifying and critiquing poor trading habits and psychological biases from raw trade logs.

Analyze the provided trade logs to identify patterns related to trading psychology, discipline, risk management, and decision-making.

Your task is to provide a brutal, data-driven critique, identify specific bad habits, highlight key metrics, and offer actionable recommendations.

Trade Logs:
{{{tradeLogs}}}

Critique Summary:
Bad Habits Identified:
Data-Driven Insights:
Recommendations:`,
});

const aiRealityCheckFlow = ai.defineFlow(
  {
    name: 'aiRealityCheckFlow',
    inputSchema: AIRealityCheckInputSchema,
    outputSchema: AIRealityCheckOutputSchema,
  },
  async (input) => {
    const { output } = await aiRealityCheckPrompt(input);
    if (!output) {
      throw new Error('Failed to generate AI Reality-Check report.');
    }
    return output;
  }
);
