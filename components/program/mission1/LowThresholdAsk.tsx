'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ProgramComponentProps } from '@/lib/program/componentRegistry';

export function LowThresholdAsk({
  progress,
  onComplete,
}: ProgramComponentProps) {
  

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
        <div>Low Threshold Ask</div>

    </div>
  );
}