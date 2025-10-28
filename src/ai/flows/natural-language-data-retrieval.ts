'use server';
/**
 * @fileOverview A natural language data retrieval AI agent.
 *
 * - naturalLanguageDataRetrieval - A function that handles the data retrieval process.
 * - NaturalLanguageDataRetrievalInput - The input type for the naturalLanguageDataRetrieval function.
 * - NaturalLanguageDataRetrievalOutput - The return type for the naturalLanguageDataRetrieval function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageDataRetrievalInputSchema = z.object({
  query: z.string().describe('The natural language query from the user.'),
});
export type NaturalLanguageDataRetrievalInput = z.infer<typeof NaturalLanguageDataRetrievalInputSchema>;

const NaturalLanguageDataRetrievalOutputSchema = z.object({
  ui_language: z.enum(['en', 'bn']),
  intent: z.enum(['data_retrieval', 'dashboard_config', 'alert_management']),
  confidence: z.number(),
  entities: z.object({
    business_unit: z.union([
      z.string().nullable(),
      z.enum([
        'Setu Filling Station',
        'Setu CNG Refilling Station',
        'Setu LPG Station',
        'Huq Bricks',
        'Setu Feed Mills',
        'Setu Tech',
        'Hotel Midway',
        'Video Tara Pharmacy',
        'Hridoy Tara Pharmacy',
      ]),
      z.array(z.string()),
    ]).nullable(),
    metric: z.union([
      z.string().nullable(),
      z.string(), // one_of_metrics_above - not fully enforced in schema
      z.array(z.string()),
    ]).nullable(),
    timeframe: z
      .union([
        z.null(),
        z.object({
          type: z.literal('absolute'),
          start: z.string(), // YYYY-MM-DD
          end: z.string(), // YYYY-MM-DD
        }),
        z.object({
          type: z.literal('relative'),
          period: z.enum([
            'past_7d',
            'past_30d',
            'this_week',
            'last_week',
            'today',
            'yesterday',
            'this_month',
            'last_month',
          ]),
        }),
      ])
      .nullable(),
    compare_to:
      z.union([
        z.null(),
        z.object({
          type: z.literal('relative'),
          period: z.enum([
            'last_week',
            'last_month',
            'same_day_last_week',
            'same_day_last_year',
          ]),
        }),
      ])
        .nullable(),
    granularity: z.enum(['hour', 'day', 'week', 'month']).nullable(),
    visualization: z.enum(['line', 'bar', 'area', 'table', 'kpi']).nullable(),
  }),
  actions: z.array(
    z.object({
      type: z.enum(['fetch_data', 'configure_dashboard', 'create_alert']),
      params: z.record(z.any()),
    })
  ),
  followups: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).optional(),
    })
  ),
  notes: z.string(),
});
export type NaturalLanguageDataRetrievalOutput = z.infer<typeof NaturalLanguageDataRetrievalOutputSchema>;

export async function naturalLanguageDataRetrieval(input: NaturalLanguageDataRetrievalInput): Promise<NaturalLanguageDataRetrievalOutput> {
  return naturalLanguageDataRetrievalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'naturalLanguageDataRetrievalPrompt',
  input: {schema: NaturalLanguageDataRetrievalInputSchema},
  output: {schema: NaturalLanguageDataRetrievalOutputSchema},
  prompt: `You are the Core Intent Layer for “The Intelligent Command Center,” a natural-language driven executive dashboard for a diversified conglomerate (Shetue Group). Your job is to:
1) Classify each user utterance into one of three intents:
   - \