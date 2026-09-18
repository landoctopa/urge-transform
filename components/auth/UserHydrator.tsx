'use client';

import { useEffect } from 'react';

import type { UserProfile } from '@/lib/auth/types';
import { setUserProfile } from '@/lib/auth/stores';

interface UserHydratorProps {
  profile: UserProfile | null;
  children: React.ReactNode;
}

export function UserHydrator({
  profile,
  children,
}: UserHydratorProps) {
  useEffect(() => {
    setUserProfile(profile);
  }, [profile]);

  return children;
}