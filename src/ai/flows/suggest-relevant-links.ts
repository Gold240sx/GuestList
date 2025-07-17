'use server';

/**
 * @fileOverview An AI agent that suggests relevant links and networking actions based on user profile information.
 *
 * - suggestRelevantLinks - A function that generates link suggestions for a user.
 * - SuggestRelevantLinksInput - The input type for the suggestRelevantLinks function.
 * - SuggestRelevantLinksOutput - The return type for the suggestRelevantLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantLinksInputSchema = z.object({
  profileInformation: z
    .string()
    .describe('The user profile information including work history, skills, and interests.'),
});
export type SuggestRelevantLinksInput = z.infer<typeof SuggestRelevantLinksInputSchema>;

const SuggestRelevantLinksOutputSchema = z.object({
  linkSuggestions: z
    .array(z.string())
    .describe('An array of suggested relevant links for the user.'),
  networkingActions: z
    .array(z.string())
    .describe('An array of suggested networking actions for the user.'),
});
export type SuggestRelevantLinksOutput = z.infer<typeof SuggestRelevantLinksOutputSchema>;

export async function suggestRelevantLinks(input: SuggestRelevantLinksInput): Promise<SuggestRelevantLinksOutput> {
  return suggestRelevantLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantLinksPrompt',
  input: {schema: SuggestRelevantLinksInputSchema},
  output: {schema: SuggestRelevantLinksOutputSchema},
  prompt: `You are an expert in online networking and link optimization.

  Based on the user's profile information, suggest relevant links and networking actions that can help them expand their online presence.

  Profile Information: {{{profileInformation}}}
  `,
});

const suggestRelevantLinksFlow = ai.defineFlow(
  {
    name: 'suggestRelevantLinksFlow',
    inputSchema: SuggestRelevantLinksInputSchema,
    outputSchema: SuggestRelevantLinksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
