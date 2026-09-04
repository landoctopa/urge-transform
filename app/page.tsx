
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Program Development
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Program
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Development environment for testing the program journey,
            missions, quests, nodes, components, and progress flow.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/program/mission/mission-1"
            className="group rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-500">
                  Mission 1
                </p>

                <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  Start With Yourself
                </h2>

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Test the complete Mission 1 journey, including
                  mission nodes, quests, transitions, and progress.
                </p>
              </div>

              <span className="text-xl text-zinc-400 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
