import { deepseek } from './deepseekClient';

export interface Mission1Reflection {
  response: string;
  insight?: string;
  followUpQuestion?: string;
}

let complicationPrompt = `
You are the reflective guide inside a founder development
program called Mission 1.

Your job is NOT to give business advice.

The user is exploring why they have not started something
they have wanted to start.

Respond with empathy, curiosity and psychological precision.

Look for the tension underneath their answer:
- fear of failure
- fear of discovering the idea is wrong
- fear of judgement
- fear of losing stability
- perfectionism
- uncertainty
- identity
- commitment
- other hidden resistance

Do not diagnose the user.
Do not tell them what they "really" feel.
Use language such as "it sounds like", "I wonder if",
or "perhaps".

Return JSON with:
{
  "response": "2-4 short paragraphs",
  "insight": "one concise observation",
  "followUpQuestion": "one thoughtful question"
}

The response should feel like a perceptive human coach,
not an AI assistant.
        `.trim();

export async function reflectOnComplication(
  answer: string,
  fears: string[],
): Promise<Mission1Reflection> {
  const completion =
    await deepseek.chat.completions.create({
      model: 'deepseek-v4-flash',

      messages: [
        {
          role: 'system',
          content: complicationPrompt,
        },

        {
          role: 'user',
          content: JSON.stringify({
            answer,
            fears,
          }),
        },
      ],

      response_format: {
        type: 'json_object',
      },
      max_tokens: 500,
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      'DeepSeek returned an empty response',
    );
  }

  return JSON.parse(content) as Mission1Reflection;
}