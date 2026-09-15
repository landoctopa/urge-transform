import { redirect } from 'next/navigation';

import { getCurrentProfile } from '@/lib/auth/profile';
import { ProfileCompletionForm } from '@/components/auth/ProfileCompletionForm';

interface ProfileCompletePageProps {
  searchParams: Promise<{
    intent?: string;
  }>;
}

export default async function ProfileCompletePage({
  searchParams,
}: ProfileCompletePageProps) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect('/register');
  }

  const params = await searchParams;

  const intent =
    params.intent === 'join' || params.intent === 'trial'
      ? params.intent
      : null;

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