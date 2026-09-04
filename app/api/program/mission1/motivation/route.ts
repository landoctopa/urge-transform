import { NextResponse } from 'next/server';

import { deepseek } from '@/lib/ai/deepseekClient';

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const answer =
      typeof body.answer === 'string'
        ? body.answer.trim()
        : '';

    if (answer.length < 10) {
      return NextResponse.json(
        {
          error:
            'A meaningful answer is required.',
        },
        { status: 400 },
      );
    }

    const completion =
      await deepseek.chat.completions.create({
        model: 'deepseek-v4-flash',

        messages: [
          {
            role: 'system',
            content: `
You are a reflective guide inside a founder
development program.

The user has just explored why they have not
started something they want to build.

They are now exploring a different question:

"What has made you give this another shot?"

Your job is to help them discover the motivation
underneath their first answer.

Do NOT give business advice.

Do NOT praise them excessively.

Do NOT tell them what their motivation "really is".

Instead:
- notice meaningful themes
- distinguish surface motivations from deeper ones
- gently challenge vague answers
- identify tensions where useful
- invite the user to examine what matters

Possible themes include:
- autonomy
- financial independence
- creative expression
- proving something to themselves
- solving a meaningful problem
- identity
- curiosity
- unfinished ambition
- desire for impact
- desire to escape current circumstances
- fear of regret

Be careful not to assume any of these.

The response should feel like an intelligent,
empathetic human coach.

Return JSON:

{
  "response": "2-4 short paragraphs",
  "insight": "one concise observation",
  "followUpQuestion": "one question that helps uncover a deeper motivation"
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
        max_tokens: 500,
      });

    const content =
      completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        'DeepSeek returned an empty response',
      );
    }

    return NextResponse.json(
      JSON.parse(content),
    );
  } catch (error) {
    console.error(
      '[MISSION1 MOTIVATION AI]',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to generate reflection.',
      },
      { status: 500 },
    );
  }
}