import { requireCurrentUser } from '@/lib/auth';
import { UserHydrator } from '@/components/auth/UserHydrator';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await requireCurrentUser();

  return (
    <UserHydrator profile={currentUser.profile}>
      {children}
    </UserHydrator>
  );
}