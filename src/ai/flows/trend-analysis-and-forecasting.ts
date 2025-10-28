'use server';
/**
 * @fileOverview Trend analysis and forecasting AI agent.
 *
 * - analyzeTrendsAndForecast - A function that handles the trend analysis and forecasting process.
 * - TrendAnalysisAndForecastingInput - The input type for the analyzeTrendsAndForecast function.
 * - TrendAnalysisAndForecastingOutput - The return type for the analyzeTrendsAndForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendAnalysisAndForecastingInputSchema = z.object({
  businessUnit: z
    .string()
    .describe(
      'The business unit to analyze trends and forecast performance for.'
    ),
  metric: z.string().describe('The metric to analyze and forecast.'),
  timeframe: z
    .string()
    .optional()
    .describe(
      'The timeframe for which to analyze trends. Defaults to the past year if not provided.'
    ),
});
export type TrendAnalysisAndForecastingInput = z.infer<
  typeof TrendAnalysisAndForecastingInputSchema
>;

const TrendAnalysisAndForecastingOutputSchema = z.object({
  trendAnalysis: z
    .string()
    .describe('Analysis of historical trends for the specified metric.'),
  forecast: z
    .string()
    .describe('Forecasted future performance for the specified metric.'),
  suggestedActions: z
    .string()
    .optional()
    .describe(
      'Suggested actions based on the trend analysis and forecast, to optimize business strategies.'
    ),
});
export type TrendAnalysisAndForecastingOutput = z.infer<
  typeof TrendAnalysisAndForecastingOutputSchema
>;

export async function analyzeTrendsAndForecast(
  input: TrendAnalysisAndForecastingInput
): Promise<TrendAnalysisAndForecastingOutput> {
  return trendAnalysisAndForecastingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trendAnalysisAndForecastingPrompt',
  input: {schema: TrendAnalysisAndForecastingInputSchema},
  output: {schema: TrendAnalysisAndForecastingOutputSchema},
  prompt: `You are an AI assistant designed to analyze historical data, identify trends, and forecast future performance for a given business unit and metric.

Analyze historical trends for {{metric}} in {{businessUnit}} based on available data, considering a timeframe of {{timeframe}} (default past year).

Based on the analysis, forecast future performance for the specified metric.

Suggest optimal actions based on predicted results. Provide context and reasoning for these suggestions.

Output:
Trend Analysis: [trendAnalysis]
Forecast: [forecast]
Suggested Actions: [suggestedActions]
`,
});

const trendAnalysisAndForecastingFlow = ai.defineFlow(
  {
    name: 'trendAnalysisAndForecastingFlow',
    inputSchema: TrendAnalysisAndForecastingInputSchema,
    outputSchema: TrendAnalysisAndForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
