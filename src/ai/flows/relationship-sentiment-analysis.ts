// Implemented the Genkit flow for relationship sentiment analysis based on chat data.

'use server';

/**
 * @fileOverview Analyzes chat sentiment to determine relationship strength and visualizes it.
 *
 * - analyzeRelationshipSentiment - A function that analyzes chat sentiment.
 * - RelationshipSentimentInput - The input type for the analyzeRelationshipSentiment function.
 * - RelationshipSentimentOutput - The return type for the analyzeRelationshipSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelationshipSentimentInputSchema = z.object({
  chatData: z.string().describe('The chat data as a string.'),
  startDate: z.string().describe('The start date for sentiment analysis (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for sentiment analysis (YYYY-MM-DD).'),
});
export type RelationshipSentimentInput = z.infer<typeof RelationshipSentimentInputSchema>;

const RelationshipSentimentOutputSchema = z.object({
  rating: z.number().describe('The relationship rating out of 33.'),
  balloons: z.number().describe('The number of heart-shaped balloons to display (0-33).'),
  label: z.string().describe('A descriptive label for the relationship strength.'),
});
export type RelationshipSentimentOutput = z.infer<typeof RelationshipSentimentOutputSchema>;

export async function analyzeRelationshipSentiment(
  input: RelationshipSentimentInput
): Promise<RelationshipSentimentOutput> {
  return analyzeRelationshipSentimentFlow(input);
}

const analyzeRelationshipSentimentPrompt = ai.definePrompt({
  name: 'analyzeRelationshipSentimentPrompt',
  input: {schema: RelationshipSentimentInputSchema},
  output: {schema: RelationshipSentimentOutputSchema},
  prompt: `You are an AI that analyzes chat data between two people to determine the strength of their relationship based on sentiment analysis.  Provide the rating out of 33.

  Here's the criteria for the rating:
  - new bond( 0-5)
  - common friend (6-10)
  - good friend (11-15)
  - best friends (16-20)
  - GF-BF (21-26)
  - strong lover (27-30)
  - beyond husband-wife (31-32)
  - you guys are GOD (33)

  Given the following chat data between {{{startDate}}} and {{{endDate}}}, analyze the sentiment to determine the relationship strength. Return the rating (0-33), the number of balloons which is the same as rating and label indicating relationship strength.

  Chat Data:
  {{{chatData}}}

  Ensure that the outputted JSON can be parsed by Typescript.
  {
    "rating": number,
    "balloons": number,
    "label": string
  }`,
});

const analyzeRelationshipSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeRelationshipSentimentFlow',
    inputSchema: RelationshipSentimentInputSchema,
    outputSchema: RelationshipSentimentOutputSchema,
  },
  async input => {
    const {output} = await analyzeRelationshipSentimentPrompt(input);
    return output!;
  }
);
