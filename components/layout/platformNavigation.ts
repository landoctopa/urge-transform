import {
  CalendarDays,
  House,
  Network,
  PanelsTopLeft,
  UserRound,
  Users,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface PlatformNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const PLATFORM_NAV_ITEMS: PlatformNavItem[] = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: House,
    exact: true,
  },
  {
    label: 'Program',
    href: '/program',
    icon: PanelsTopLeft,
  },
  {
    label: 'Community',
    href: '/community',
    icon: Users,
  },
  {
    label: 'Network',
    href: '/network',
    icon: Network,
  },
  {
    label: 'Events',
    href: '/events',
    icon: CalendarDays,
  },
];

export const PLATFORM_ACCOUNT_ITEMS: PlatformNavItem[] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
  },
];