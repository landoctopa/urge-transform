import { getCurrentProfile } from '@/lib/auth/profile';
import { requireCurrentUser } from '@/lib/auth/currentUser';

import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

interface ProfileCompletePageProps {
  searchParams: Promise<{
    intent?: string;
  }>;
}

export default async function ProfileCompletePage({
  searchParams,
}: ProfileCompletePageProps) {
  /*
   * Authentication is required, but a profile is NOT.
   *
   * This is the first place where a newly confirmed user
   * creates their user_profile row.
   */
  await requireCurrentUser();

  const profile =
    await getCurrentProfile();

  const params =
    await searchParams;

  const intent =
    params.intent === 'join' ||
    params.intent === 'trial'
      ? params.intent
      : 'trial';

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
        <ProfileCompletionForm
          profile={profile}
          intent={intent}
        />
      </div>
    </main>
  );
}