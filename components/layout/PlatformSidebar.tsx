'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';

import { UserRound } from 'lucide-react';

import { $userProfileStore } from '@/lib/auth/stores';

import {
  PLATFORM_ACCOUNT_ITEMS,
  PLATFORM_NAV_ITEMS,
} from './platformNavigation';

function isActivePath(
  pathname: string,
  href: string,
  exact?: boolean,
) {
  if (exact) {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function PlatformSidebar() {
  const pathname = usePathname();
  const { profile } = useStore($userProfileStore);

  const avatarUrl = profile?.avatar_url ?? null;
  const username = profile?.username ?? 'Profile';

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Link
          href="/home"
          className="text-2xl font-bold tracking-tight"
        >
          urge
        </Link>
      </div>

      {/* Main navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 overflow-y-auto p-4"
      >
        {PLATFORM_NAV_ITEMS.map(
          ({
            label,
            href,
            icon: Icon,
            exact,
          }) => {
            const active = isActivePath(
              pathname,
              href,
              exact,
            );

            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  active ? 'page' : undefined
                }
                className={[
                  'flex h-12 items-center gap-3 rounded-lg px-3 text-base transition-colors',
                  active
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{label}</span>
              </Link>
            );
          },
        )}
      </nav>

      {/* Account */}
      <div className="shrink-0 border-t border-border p-4">
        {PLATFORM_ACCOUNT_ITEMS.map(
          ({
            label,
            href,
          }) => {
            const active = isActivePath(
              pathname,
              href,
            );

            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  active ? 'page' : undefined
                }
                className={[
                  'flex h-12 items-center gap-3 rounded-lg px-3 text-base transition-colors',
                  active
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                ].join(' ')}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <UserRound className="h-5 w-5 shrink-0" />
                )}

                <span className="min-w-0 truncate">
                  {username}
                </span>
              </Link>
            );
          },
        )}
      </div>
    </aside>
  );
}