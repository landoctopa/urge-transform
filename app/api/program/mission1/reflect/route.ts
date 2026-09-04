import { NextResponse } from 'next/server';

import {
  reflectOnComplication,
} from '@/lib/ai/mission1';

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const answer =
      typeof body.answer === 'string'
        ? body.answer.trim()
        : '';

    const fears =
      Array.isArray(body.fears)
        ? body.fears.filter(
            (value: unknown): value is string =>
              typeof value === 'string',
          )
        : [];

    if (!answer && fears.length === 0) {
      return NextResponse.json(
        {
          error:
            'An answer or fear selection is required.',
        },
        { status: 400 },
      );
    }

    const result =
      await reflectOnComplication(
        answer,
        fears,
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      '[MISSION1 AI]',
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