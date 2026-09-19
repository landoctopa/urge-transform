import { UserHydrator } from '@/components/auth/UserHydrator';
import { PlatformShell } from '@/components/layout/PlatformShell';
import { requireCurrentUser } from '@/lib/auth/currentUser';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await requireCurrentUser();

  return (
    <UserHydrator profile={currentUser.profile}>
      <PlatformShell>
        {children}
      </PlatformShell>
    </UserHydrator>
  );
}