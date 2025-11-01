'use server';
/**
 * @fileOverview An AI flow for generating tax optimization insights.
 *
 * - generateTaxInsight - A function that provides tax-saving suggestions.
 * - GenerateTaxInsightInput - The input type for the flow.
 * - GenerateTaxInsightOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTaxInsightInputSchema = z.object({
  financialData: z.string().describe('A JSON string representing the user\'s financial data for a period.'),
  country: z.string().describe('The user\'s country of residence for tax purposes (e.g., "USA", "Germany").'),
});
export type GenerateTaxInsightInput = z.infer<typeof GenerateTaxInsightInputSchema>;

const GenerateTaxInsightOutputSchema = z.object({
  insights: z.array(z.object({
    title: z.string().describe('A short title for the tax insight.'),
    description: z.string().describe('A detailed explanation of the potential tax-saving opportunity.'),
    estimatedSavings: z.number().describe('An estimated potential savings amount.'),
  })),
});
export type GenerateTaxInsightOutput = z.infer<typeof GenerateTaxInsightOutputSchema>;

export async function generateTaxInsight(input: GenerateTaxInsightInput): Promise<GenerateTaxInsightOutput> {
  return generateTaxInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaxInsightPrompt',
  input: { schema: GenerateTaxInsightInputSchema },
  output: { schema: GenerateTaxInsightOutputSchema },
  prompt: `You are an expert tax advisor. Analyze the following financial data for a user in {{{country}}} and provide actionable tax-saving insights.

  Financial Data (JSON):
  {{{financialData}}}

  Identify potential deductions, credits, or investment strategies that could lower their tax burden. For each insight, provide a title, a clear description, and an estimated savings amount.`,
});

const generateTaxInsightFlow = ai.defineFlow(
  {
    name: 'generateTaxInsightFlow',
    inputSchema: GenerateTaxInsightInputSchema,
    outputSchema: GenerateTaxInsightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
