'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';

import {
  UserRound,
} from 'lucide-react';

import {
  $userProfileStore,
} from '@/lib/auth/stores';

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
  console.log('avatarUrl', avatarUrl);

  const username = profile?.username ?? 'Profile';

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link
          href="/home"
          className="text-xl font-semibold tracking-tight"
        >
          urge
        </Link>
      </div>

      {/* Main navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1 p-4"
      >
        {PLATFORM_NAV_ITEMS.map(
          ({
            label,
            href,
            icon: Icon,
            exact,
          }) => {
            const active =
              isActivePath(
                pathname,
                href,
                exact,
              );

            return (
              <Link
                key={href}
                href={href}
                aria-current={
                  active
                    ? 'page'
                    : undefined
                }
                className={[
                  'flex h-11 items-center gap-3 rounded-md px-3 text-base transition-colors',
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
      <div className="border-t border-border p-4">
        <nav
          aria-label="Account navigation"
          className="space-y-1"
        >
          {PLATFORM_ACCOUNT_ITEMS.map(
            ({
              label,
              href,
            }) => {
              const active =
                isActivePath(
                  pathname,
                  href,
                );

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    active
                      ? 'page'
                      : undefined
                  }
                  className={[
                    'flex h-11 items-center gap-3 rounded-md px-3 text-base transition-colors',
                    active
                      ? 'bg-muted font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  ].join(' ')}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={username}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                      onLoad={() => {
                        console.log('Avatar loaded:', avatarUrl);
                      }}
                      onError={() => {
                        console.error('Avatar failed:', avatarUrl);
                      }}
                    />
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}

                  <span className="min-w-0 truncate">
                    {username} — AVATAR TEST
                  </span>
                </Link>
              );
            },
          )}
        </nav>
      </div>
    </aside>
  );
}