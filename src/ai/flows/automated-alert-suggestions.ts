'use server';

/**
 * @fileOverview A flow for suggesting optimal alert thresholds based on historical data and preferences.
 *
 * - suggestAlertThreshold - A function that suggests alert thresholds.
 * - SuggestAlertThresholdInput - The input type for the suggestAlertThreshold function.
 * - SuggestAlertThresholdOutput - The return type for the suggestAlertThreshold function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlertThresholdInputSchema = z.object({
  businessUnit: z
    .string()
    .describe("The business unit for which to suggest alert thresholds."),
  metric: z.string().describe('The metric for which to suggest alert thresholds.'),
  historicalData: z.string().describe(
    'Historical data for the metric, as a JSON string.  Include time series data points.'
  ),
  userPreferences: z
    .string()
    .optional()
    .describe(
      'User preferences for alerts, as a JSON string.  This is optional and may influence suggestions.'
    ),
});
export type SuggestAlertThresholdInput = z.infer<typeof SuggestAlertThresholdInputSchema>;

const SuggestAlertThresholdOutputSchema = z.object({
  threshold: z.number().describe('The suggested alert threshold value.'),
  rationale: z
    .string()
    .describe(
      'The rationale for the suggested threshold, including factors considered.'
    ),
  operator: z.string().describe("The operator to use for the alert condition, e.g., '<', '>."),
  severity: z.string().describe('The suggested severity level for the alert.'),
});

export type SuggestAlertThresholdOutput = z.infer<typeof SuggestAlertThresholdOutputSchema>;

export async function suggestAlertThreshold(
  input: SuggestAlertThresholdInput
): Promise<SuggestAlertThresholdOutput> {
  return suggestAlertThresholdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlertThresholdPrompt',
  input: {schema: SuggestAlertThresholdInputSchema},
  output: {schema: SuggestAlertThresholdOutputSchema},
  prompt: `You are an AI assistant that suggests optimal alert thresholds based on historical data and user preferences.

  Analyze the historical data and user preferences (if provided) to determine an appropriate threshold for the given metric.
  Provide a rationale for the suggested threshold, including the factors you considered. Suggest the appropriate operator.
  Suggest the appropriate severity.

  Business Unit: {{{businessUnit}}}
  Metric: {{{metric}}}
  Historical Data: {{{historicalData}}}
  User Preferences: {{{userPreferences}}}

  Output in JSON format.`,
});

const suggestAlertThresholdFlow = ai.defineFlow(
  {
    name: 'suggestAlertThresholdFlow',
    inputSchema: SuggestAlertThresholdInputSchema,
    outputSchema: SuggestAlertThresholdOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
