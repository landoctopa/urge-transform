export default function EventsPage() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Events
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Go where
            <br />
            things happen.
          </h1>

          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            Sessions, conversations and opportunities to meet
            people in the Urge community.
          </p>

          <div className="mt-12 space-y-5">
            {[
              {
                day: '24',
                month: 'SEP',
                title: 'Founder Standup',
                description:
                  'Share what you are working on and what you learned this week.',
              },
              {
                day: '28',
                month: 'SEP',
                title: 'Ask Customers',
                description:
                  'A practical session on talking to people before building.',
              },
              {
                day: '03',
                month: 'OCT',
                title: 'Urge Community Meetup',
                description:
                  'Meet other members and exchange ideas, problems and lessons.',
              },
            ].map((event) => (
              <article
                key={event.title}
                className="flex flex-col gap-6 rounded-2xl border border-border p-6 sm:flex-row sm:items-start"
              >
                <div className="shrink-0 text-center">
                  <p className="text-3xl font-bold">
                    {event.day}
                  </p>

                  <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground">
                    {event.month}
                  </p>
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {event.title}
                  </h2>

                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {event.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-border px-5 py-3 text-base font-medium"
                >
                  View event
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}