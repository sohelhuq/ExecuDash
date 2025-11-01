'use server';
/**
 * @fileOverview Flow for generating a tax optimization insight.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FinancialDataInputSchema = z.object({
  totalIncome: z.number().describe('Total income over a period.'),
  totalExpenses: z.number().describe('Total expenses over a period.'),
  expenseCategories: z.record(z.number()).describe('A map of expense categories to their total amounts.'),
});
export type FinancialDataInput = z.infer<typeof FinancialDataInputSchema>;

const TaxInsightOutputSchema = z.object({
  insight: z
    .string()
    .describe('A brief, actionable tax optimization suggestion for a small to medium business in Bangladesh.'),
});
export type TaxInsightOutput = z.infer<typeof TaxInsightOutputSchema>;

export async function generateTaxInsight(input: FinancialDataInput): Promise<TaxInsightOutput> {
  return generateTaxInsightFlow(input);
}

const insightPrompt = ai.definePrompt({
  name: 'generateTaxInsightPrompt',
  input: { schema: FinancialDataInputSchema },
  output: { schema: TaxInsightOutputSchema },
  prompt: `You are an expert financial advisor for businesses in Bangladesh.
Analyze the following financial data and provide one actionable tax-saving insight.
The insight should be relevant to the local tax laws of Bangladesh.

Financial Summary:
- Total Income: {{{totalIncome}}} BDT
- Total Expenses: {{{totalExpenses}}} BDT

Top Expense Categories:
{{#each expenseCategories}}
- {{@key}}: {{this}} BDT
{{/each}}
`,
});

const generateTaxInsightFlow = ai.defineFlow(
  {
    name: 'generateTaxInsightFlow',
    inputSchema: FinancialDataInputSchema,
    outputSchema: TaxInsightOutputSchema,
  },
  async (input) => {
    const { output } = await insightPrompt(input);
    return output!;
  }
);
