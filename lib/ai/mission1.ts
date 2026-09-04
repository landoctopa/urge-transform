import type OpenAI from 'openai';

import { deepseek } from './deepseekClient';

export interface Mission1Reflection {
  reflection: string;
}

function extractJson(
  content: string,
): Mission1Reflection {
  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error(
      'DeepSeek returned empty content',
    );
  }

  /*
   * First try the response exactly as returned.
   */
  try {
    return JSON.parse(
      trimmed,
    ) as Mission1Reflection;
  } catch {
    // Continue below.
  }

  /*
   * DeepSeek can occasionally wrap JSON in
   * markdown fences despite the requested format.
   */
  const withoutFence =
    trimmed
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

  try {
    return JSON.parse(
      withoutFence,
    ) as Mission1Reflection;
  } catch {
    // Continue below.
  }

  /*
   * Last attempt: locate the JSON object.
   */
  const start =
    withoutFence.indexOf('{');

  const end =
    withoutFence.lastIndexOf('}');

  if (
    start !== -1 &&
    end > start
  ) {
    const candidate =
      withoutFence.slice(
        start,
        end + 1,
      );

    try {
      return JSON.parse(
        candidate,
      ) as Mission1Reflection;
    } catch {
      // Fall through.
    }
  }

  throw new Error(
    `DeepSeek returned invalid JSON: ${trimmed.slice(
      0,
      500,
    )}`,
  );
}

export async function reflectOnComplication(
  answer: string,
): Promise<Mission1Reflection> {
  const completion =
    await deepseek.chat.completions.create({
      model: 'deepseek-v4-flash',

      messages: [
        {
          role: 'system',
          content: `
You are a thoughtful guide in a founder
development program.

The user has answered:

"Why haven't you started?"

Your job is NOT to solve their problem.

Your job is to help them notice what might
be underneath their answer.

Reflect their answer with empathy and
curiosity.

Look for possible:
- fear
- uncertainty
- perfectionism
- lack of confidence
- competing priorities
- ambiguity
- fear of failure
- fear of judgement
- fear of committing to the wrong thing

Do not assume that any of these are present.

Do not diagnose the user.

Do not give business advice.

Do not tell them what they should do.

Instead, offer a short reflection that helps
them look at their own answer differently.

The response should sound like a thoughtful
human coach, not an AI assistant.

Return ONLY valid JSON in this exact shape:

{
  "reflection": "A short reflection of 2-4 paragraphs."
}
          `.trim(),
        },

        {
          role: 'user',
          content: answer,
        },
      ],

      response_format: {
        type: 'json_object',
      },

      /*
       * Keep this deliberately modest.
       *
       * We are asking for a short reflection,
       * not a long reasoning process.
       */
      max_tokens: 350,
    });

  const content =
    completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error(
      'DeepSeek returned no message content',
    );
  }

  return extractJson(content);
}