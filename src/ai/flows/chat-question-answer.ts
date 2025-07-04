'use server';

/**
 * @fileOverview An AI agent that answers questions about chat data within a selected date range.
 *
 * - answerChatQuestion - A function that answers user questions about chat data.
 * - ChatQuestionAnswerInput - The input type for the answerChatQuestion function.
 * - ChatQuestionAnswerOutput - The return type for the answerChatQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatQuestionAnswerInputSchema = z.object({
  question: z.string().describe('The question to be answered about the chat data.'),
  chatData: z.string().describe('The chat data as a single string.'),
  startDate: z.string().describe('The start date of the selected range (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date of the selected range (YYYY-MM-DD).'),
});
export type ChatQuestionAnswerInput = z.infer<typeof ChatQuestionAnswerInputSchema>;

const ChatQuestionAnswerOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the chat data within the selected date range.'),
});
export type ChatQuestionAnswerOutput = z.infer<typeof ChatQuestionAnswerOutputSchema>;

export async function answerChatQuestion(input: ChatQuestionAnswerInput): Promise<ChatQuestionAnswerOutput> {
  return answerChatQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatQuestionAnswerPrompt',
  input: {schema: ChatQuestionAnswerInputSchema},
  output: {schema: ChatQuestionAnswerOutputSchema},
  prompt: `You are an AI assistant that answers questions about chat data.

  You will be provided with chat data, a start date, an end date, and a question.
  Your task is to answer the question based on the chat data within the specified date range.

  Chat Data: {{{chatData}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}
  Question: {{{question}}}

  Answer:`,
});

const answerChatQuestionFlow = ai.defineFlow(
  {
    name: 'answerChatQuestionFlow',
    inputSchema: ChatQuestionAnswerInputSchema,
    outputSchema: ChatQuestionAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
