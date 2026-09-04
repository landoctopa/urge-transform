import { NextResponse } from 'next/server';

import { deepseek } from '@/lib/ai/deepseekClient';

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const programProgress =
      body.progress ?? {};

    const nodeData =
      programProgress.nodes ?? {};

    /*
     * Pull only the information relevant to
     * Mission 1's synthesis.
     *
     * We deliberately don't send the entire
     * progress object to the model.
     */
    const context = {
      situation:
        nodeData['m1-situation']?.payload,

      complication:
        nodeData['m1-q1-complication']?.payload,

      motivation:
        nodeData['m1-q1-motivation']?.payload,

      future:
        nodeData['m1-q1-future']?.payload,

      quitCondition:
        nodeData['m1-q1-quit']?.payload,
    };

    const completion =
      await deepseek.chat.completions.create({
        model: 'deepseek-v4-flash',

        messages: [
          {
            role: 'system',
            content: `
You are the synthesis guide for Mission 1
of a founder development program.

The user has explored:
1. Their current situation.
2. Why they have not started.
3. What has brought them back.
4. The future they want.
5. What might make them quit.

Your task is to identify the emerging pattern.

This is NOT a business plan.

Do not evaluate whether their idea is good.

Do not give generic startup advice.

Do not diagnose psychological conditions.

Look for the human tension between:
- where they are
- what they want
- what motivates them
- what they fear
- what keeps them from acting

The synthesis should feel personal and specific
to the user's answers.

Avoid simply repeating their words.

Be willing to name a difficult tension,
but frame interpretations carefully.

Return JSON:

{
  "situation": "2-3 sentences",
  "motivation": "2-3 sentences",
  "tension": "2-3 sentences",
  "pattern": "2-4 sentences that name the central pattern",
  "commitmentQuestion": "one powerful question that asks what they are willing to do next"
}
            `.trim(),
          },

          {
            role: 'user',
            content: JSON.stringify(
              context,
              null,
              2,
            ),
          },
        ],

        response_format: {
          type: 'json_object',
        },
        max_tokens: 800,
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
      '[MISSION1 SYNTHESIS AI]',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Unable to generate synthesis.',
      },
      { status: 500 },
    );
  }
}