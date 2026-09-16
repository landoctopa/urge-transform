import Link from 'next/link';

interface ProfileCompleteSuccessPageProps {
  searchParams: Promise<{
    intent?: string;
  }>;
}

export default async function ProfileCompleteSuccessPage({
  searchParams,
}: ProfileCompleteSuccessPageProps) {
  const params = await searchParams;

  const intent =
    params.intent === 'join'
      ? 'join'
      : 'trial';

  const continueHref =
    intent === 'join'
      ? '/checkout?intent=join'
      : '/program/welcome?intent=trial';

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          You&apos;re ready
        </p>

        <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
          Your profile is set up.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
          {intent === 'join'
            ? 'Your account is ready. The next step is to complete your Urge membership.'
            : 'Your account is ready. The next step is to start your Urge experience.'}
        </p>

        <div className="mt-10">
          <Link
            href={continueHref}
            className="inline-flex h-12 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}