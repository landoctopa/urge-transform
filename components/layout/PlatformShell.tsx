'use client';

import type { ReactNode } from 'react';

import { PlatformMobileNav } from './PlatformMobileNav';
import { PlatformSidebar } from './PlatformSidebar';

interface PlatformShellProps {
  children: ReactNode;
}

export function PlatformShell({
  children,
}: PlatformShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <PlatformSidebar />

        <div className="min-w-0 flex-1">
          <PlatformMobileNav />

          <main className="min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}