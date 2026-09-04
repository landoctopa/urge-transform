import { NextResponse } from 'next/server';

import { reflectOnComplication } from '@/lib/ai/mission1';

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const answer =
      typeof body.answer === 'string'
        ? body.answer.trim()
        : '';

    if (answer.length < 3) {
      return NextResponse.json(
        {
          error:
            'Please provide an answer first.',
        },
        { status: 400 },
      );
    }

    const result =
      await reflectOnComplication(
        answer,
      );

    return NextResponse.json(
      result,
    );
  } catch (error) {
    console.error(
      '[MISSION1 AI]',
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to generate reflection.',
      },
      { status: 500 },
    );
  }
}