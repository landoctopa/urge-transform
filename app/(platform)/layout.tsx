import { requireCurrentUser } from '@/lib/auth';
import { UserHydrator } from '@/components/auth/UserHydrator';

import { PlatformShell } from '@/components/platform/PlatformShell';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await requireCurrentUser();

  return (
    <UserHydrator
      profile={currentUser.profile}
    >
      <PlatformShell>
        {children}
      </PlatformShell>
    </UserHydrator>
  );
}