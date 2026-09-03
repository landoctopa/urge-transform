import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getMission } from '@/lib/program/getMission';

interface MissionPageProps {
  params: Promise<{
    missionId: string;
  }>;
}

export default async function MissionPage({
  params,
}: MissionPageProps) {
  const { missionId } = await params;

  const mission = getMission(missionId);

  if (!mission) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-5">
          <p className="text-sm font-medium text-muted-foreground">
            Mission {mission.sequence}
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            {mission.title}
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            {mission.description}
          </p>

          {mission.bigQuestion && (
            <blockquote className="max-w-2xl border-l-2 pl-6 text-xl italic">
              {mission.bigQuestion}
            </blockquote>
          )}
        </header>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold">
            Your quests
          </h2>

          <div className="grid gap-4">
            {mission.quests?.map((quest) => (
              <Link
                key={quest.key}
                href={`/program/mission/${mission.key}/quest/${quest.key}`}
                className="rounded-xl border p-6 transition-colors hover:bg-muted"
              >
                <p className="text-sm text-muted-foreground">
                  Quest {quest.sequence}
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {quest.title}
                </h3>

                {quest.description && (
                  <p className="mt-2 text-muted-foreground">
                    {quest.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}