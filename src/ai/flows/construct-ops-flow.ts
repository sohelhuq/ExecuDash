'use server';
/**
 * @fileOverview A flow for handling construction project estimations using AI.
 * This flow takes a project description and generates a cost estimate,
 * risk analysis, and a bilingual summary based on a predefined configuration.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import configData from '@/config/ConstructOps_GPT_config.json';

const ConstructOpsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe(
      'A detailed description of the construction project, including scope, size, and location.'
    ),
});
export type ConstructOpsInput = z.infer<typeof ConstructOpsInputSchema>;

const ConstructOpsOutputSchema = z.object({
  projectName: z.string().describe('A suitable name for the project.'),
  summaryBilingual: z.object({
    en: z.string().describe('A concise project summary in English.'),
    bn: z.string().describe('A concise project summary in Bengali.'),
  }),
  costEstimate: z.array(z.object({
    item: z.string().describe('The cost item (e.g., Bricks, Labor, Contingency).'),
    itemBn: z.string().describe('The cost item in Bengali.'),
    quantity: z.string().describe('Estimated quantity and unit.'),
    rate: z.string().describe('Rate per unit in BDT.'),
    total: z.string().describe('Total cost for the item in BDT.'),
  })).describe('A detailed breakdown of the estimated project costs.'),
  riskAssessment: z.object({
    level: z.enum(['Green', 'Yellow', 'Red']).describe('The overall risk level (traffic light indicator).'),
    analysis: z.string().describe('A brief analysis of the potential project risks.'),
  }),
});
export type ConstructOpsOutput = z.infer<typeof ConstructOpsOutputSchema>;

export async function estimateConstructionProject(
  input: ConstructOpsInput
): Promise<ConstructOpsOutput> {
  return constructOpsFlow(input);
}

const constructOpsPrompt = ai.definePrompt({
  name: 'constructOpsPrompt',
  input: { schema: ConstructOpsInputSchema },
  output: { schema: ConstructOpsOutputSchema },
  prompt: `You are an expert AI Quantity Surveyor for the Bangladesh construction market. Your task is to analyze a project description and generate a preliminary estimate and risk assessment.

Follow these instructions strictly:
1.  **Analyze the User's Query:**  
    Project Description: {{{projectDescription}}}

2.  **Use Configuration Context:** Adhere to the logic and default values defined in this configuration:
    \`\`\`json
    ${JSON.stringify(configData, null, 2)}
    \`\`\`

3.  **Generate Output:** Create a structured response according to the output schema.
    -   **Project Name:** Give the project a suitable name.
    -   **Bilingual Summary:** Provide a short summary in both English and Bengali.
    -   **Cost Estimate Table:** Create a cost breakdown. Include major materials (like bricks, cement, steel), labor, and a contingency as per the config. Use the config's wastage percentages. All values MUST be in BDT. The table should have columns for Item, Item (Bengali), Quantity, Rate, and Total.
    -   **Risk Assessment:** Assign a risk level ('Green', 'Yellow', or 'Red') and provide a brief justification.
`,
});

const constructOpsFlow = ai.defineFlow(
  {
    name: 'constructOpsFlow',
    inputSchema: ConstructOpsInputSchema,
    outputSchema: ConstructOpsOutputSchema,
  },
  async (input) => {
    const { output } = await constructOpsPrompt(input);
    return output!;
  }
);
