'use server';
/**
 * @fileOverview Flow for generating a tax optimization insight.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

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

// Internal schema for the prompt, which requires an array
const PromptInputSchema = z.object({
    totalIncome: z.number(),
    totalExpenses: z.number(),
    expenses: z.array(z.object({
        category: z.string(),
        amount: z.number(),
    })),
});

export async function generateTaxInsight(input: FinancialDataInput): Promise<TaxInsightOutput> {
  return generateTaxInsightFlow(input);
}

const insightPrompt = ai.definePrompt({
  name: 'generateTaxInsightPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: TaxInsightOutputSchema },
  prompt: `You are an expert financial advisor for businesses in Bangladesh.
Analyze the following financial data and provide one actionable tax-saving insight.
The insight should be relevant to the local tax laws of Bangladesh.

Financial Summary:
- Total Income: {{{totalIncome}}} BDT
- Total Expenses: {{{totalExpenses}}} BDT

Top Expense Categories:
{{#each expenses}}
- {{this.category}}: {{this.amount}} BDT
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
    // Transform the input from an object to an array for the prompt
    const expensesArray = Object.entries(input.expenseCategories).map(([category, amount]) => ({
        category,
        amount
    }));

    const promptInput = {
        totalIncome: input.totalIncome,
        totalExpenses: input.totalExpenses,
        expenses: expensesArray,
    };

    const { output } = await insightPrompt(promptInput);

    if (!output) {
      throw new Error('The AI model did not return a valid output.');
    }
    return output;
  }
);
