'use server';
/**
 * @fileOverview Flow for categorizing a financial transaction using AI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransactionInputSchema = z.object({
  description: z.string().describe('The description of the financial transaction.'),
});
export type TransactionInput = z.infer<typeof TransactionInputSchema>;

const TransactionCategoryOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The most likely category for the transaction. Examples: Salary, Rent, Groceries, Utilities, Software, Client Payment, Marketing, Travel, Meals & Entertainment.'
    ),
});
export type TransactionCategoryOutput = z.infer<
  typeof TransactionCategoryOutputSchema
>;

export async function categorizeTransaction(input: TransactionInput): Promise<TransactionCategoryOutput> {
  return categorizeTransactionFlow(input);
}

const categorizePrompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: { schema: TransactionInputSchema },
  output: { schema: TransactionCategoryOutputSchema },
  prompt: `Based on the transaction description, provide the most suitable category.
  
Description: {{{description}}}`,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: TransactionInputSchema,
    outputSchema: TransactionCategoryOutputSchema,
  },
  async (input) => {
    const { output } = await categorizePrompt(input);
    return output!;
  }
);
