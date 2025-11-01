'use server';
/**
 * @fileOverview An AI flow for categorizing financial transactions.
 *
 * - categorizeTransaction - A function that suggests a category for a transaction.
 * - CategorizeTransactionInput - The input type for the flow.
 * - CategorizeTransactionOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  description: z.string().describe('The description of the financial transaction.'),
  amount: z.number().describe('The amount of the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z.string().describe('The suggested category for the transaction (e.g., "Utilities", "Groceries", "Salary").'),
  confidence: z.number().describe('The confidence score of the suggestion, from 0 to 1.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: { schema: CategorizeTransactionInputSchema },
  output: { schema: CategorizeTransactionOutputSchema },
  prompt: `You are an expert financial assistant. Based on the transaction description and amount, categorize it into a common financial category.

  Transaction Description: {{{description}}}
  Amount: {{{amount}}}
  
  Provide a likely category and a confidence score.`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
