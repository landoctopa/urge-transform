'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

const MYTHS = [
  'You need money.',
  'You need connections.',
  'You need a great idea.',
  'You need experience.',
  'You need to know what you’re doing.',
];

const BUSINESS_FORMS = [
  {
    label: 'A shop.',
    detail: 'Something people can walk into.',
  },
  {
    label: 'A trade.',
    detail: 'Something you know how to do well.',
  },
  {
    label: 'A service.',
    detail: 'Something that makes someone’s life easier.',
  },
  {
    label: 'A craft.',
    detail: 'Something made with care and skill.',
  },
  {
    label: 'A product.',
    detail: 'Something useful enough to pay for.',
  },
  {
    label: 'An idea.',
    detail: 'Something that solves a problem differently.',
  },
];

const RAW_MATERIAL = [
  'The industry you’ve spent years inside.',
  'The problems you’ve learned to work around.',
  'The things people keep asking you for.',
  'The things you notice that others don’t.',
  'The things you keep thinking could be done better.',
  'The ideas you dismissed because they didn’t look big enough.',
];

export function UrgeHomepage() {
  const [mythIndex, setMythIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMythIndex((current) => {
        if (current >= MYTHS.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, 2600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* ------------------------------------------------------------ */}
      {/* NAVIGATION                                                     */}
      {/* ------------------------------------------------------------ */}

      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em]"
            aria-label="Urge home"
          >
            urge
          </Link>

          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 text-sm font-medium"
          >
            <span className="border-b border-foreground/30 pb-0.5 transition-colors group-hover:border-foreground">
              Find out what you could build
            </span>

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------ */}
      {/* 01 — INTERRUPT                                                */}
      {/* ------------------------------------------------------------ */}

      <section className="relative flex min-h-[100svh] items-center px-6 pt-24 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-12rem] top-[12rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.6461_0.194_41.12_/_0.10),transparent_68%)] blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              A different way to think about starting
            </p>

            <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
              You might already have what it takes to start.
            </h1>

            <div className="mt-12 flex max-w-2xl flex-col gap-8">
              <p className="text-lg leading-8 text-muted-foreground md:text-xl">
                You don’t need a perfect idea.
                You don’t need a business degree.
                And you certainly don’t need to look like
                the kind of founder the internet keeps showing you.
              </p>

              <Link
                href="/discover"
                className="group inline-flex w-fit items-center gap-4 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>See what you could build</span>

                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-[-4rem] left-0 hidden items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground lg:flex">
            <span className="h-px w-10 bg-foreground/20" />
            Keep going
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 02 — BREAK THE MYTH                                           */}
      {/* ------------------------------------------------------------ */}

      <section className="relative border-t border-foreground/10 px-6 py-32 lg:px-10 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
                The story we’ve been told
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-6xl lg:text-7xl">
                Starting a business has been made to look harder than it is.
              </h2>

              <div className="mt-20">
                <div className="relative min-h-[9rem] overflow-hidden">
                  {MYTHS.map((myth, index) => (
                    <p
                      key={myth}
                      aria-hidden={index !== mythIndex}
                      className={`absolute inset-0 text-5xl font-medium leading-none tracking-[-0.045em] transition-all duration-700 md:text-7xl lg:text-8xl ${
                        index === mythIndex
                          ? 'translate-y-0 opacity-100'
                          : index < mythIndex
                            ? '-translate-y-8 opacity-0'
                            : 'translate-y-8 opacity-0'
                      }`}
                    >
                      {myth}
                    </p>
                  ))}
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <div className="h-px w-12 bg-[oklch(0.6461_0.194_41.12)]" />

                  <p className="text-base text-muted-foreground">
                    Maybe.
                  </p>
                </div>
              </div>

              <p className="mt-20 max-w-xl text-lg leading-8 text-muted-foreground">
                The truth is less glamorous and much more useful:
                people have been building useful businesses with
                ordinary resources for a very long time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 03 — LOOK CLOSER                                              */}
      {/* ------------------------------------------------------------ */}

      <section className="bg-foreground px-6 py-32 text-background lg:px-10 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              Look closer
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-7xl lg:text-8xl">
              There has never been
              just one way to build.
            </h2>
          </div>

          <div className="mt-24 border-t border-background/20">
            {BUSINESS_FORMS.map((item, index) => (
              <div
                key={item.label}
                className="group grid gap-6 border-b border-background/20 py-8 transition-colors duration-500 hover:bg-background/[0.04] md:grid-cols-[5rem_1fr_1fr] md:items-center md:py-10"
              >
                <span className="text-xs font-medium tabular-nums text-background/40">
                  0{index + 1}
                </span>

                <h3 className="text-3xl font-medium tracking-[-0.035em] md:text-5xl">
                  {item.label}
                </h3>

                <p className="max-w-md text-base leading-7 text-background/55 transition-colors duration-500 group-hover:text-background/80 md:justify-self-end">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 max-w-3xl">
            <p className="text-2xl font-medium leading-tight tracking-[-0.025em] md:text-4xl">
              It doesn't have to become enormous
              to become meaningful.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 04 — NOT EVERY BUSINESS NEEDS TO BE A UNICORN                */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-32 lg:px-10 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-20 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
                Scale is not the point
              </p>

              <h2 className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-7xl">
                Build something
                that fits the life
                you actually want.
              </h2>
            </div>

            <div className="max-w-xl lg:pb-2">
              <p className="text-lg leading-8 text-muted-foreground md:text-xl">
                A business can support a family.
                Create independence.
                Solve a problem in your neighbourhood.
                Give you control over your time.
                Become a craft you spend twenty years getting better at.
              </p>

              <p className="mt-8 text-lg font-medium leading-8">
                It doesn't have to become a unicorn to be a success.
              </p>
            </div>
          </div>

          <div className="mt-24 grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 md:grid-cols-3">
            {[
              {
                title: 'Small',
                text: 'Built around the life you want.',
              },
              {
                title: 'Useful',
                text: 'Built around a problem worth solving.',
              },
              {
                title: 'Yours',
                text: 'Built around what you know and care about.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-background p-8 md:p-10"
              >
                <div className="mb-16 h-2 w-2 rounded-full bg-[oklch(0.6461_0.194_41.12)]" />

                <h3 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-xs leading-7 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 05 — START WITH WHAT YOU HAVE                                 */}
      {/* ------------------------------------------------------------ */}

      <section className="relative overflow-hidden bg-muted/35 px-6 py-32 lg:px-10 lg:py-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,oklch(0.6461_0.194_41.12_/_0.08),transparent_70%)] blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              Start with what you already have
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-7xl lg:text-8xl">
              Look at your life
              differently.
            </h2>
          </div>

          <div className="mt-24 grid gap-x-16 gap-y-0 border-t border-foreground/10 md:grid-cols-2">
            {RAW_MATERIAL.map((item, index) => (
              <div
                key={item}
                className="group border-b border-foreground/10 py-8 md:py-10"
              >
                <div className="flex gap-6">
                  <span className="pt-1 text-xs tabular-nums text-muted-foreground">
                    0{index + 1}
                  </span>

                  <p className="max-w-md text-2xl font-medium leading-tight tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex items-start gap-5">
            <span className="mt-3 h-10 w-px bg-[oklch(0.6461_0.194_41.12)]" />

            <p className="max-w-3xl text-3xl font-medium leading-tight tracking-[-0.035em] md:text-5xl">
              That's not starting from nothing.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 06 — THE PART WE DON'T TALK ABOUT                             */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-32 lg:px-10 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              The part we don't talk about
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[7rem]">
              Maybe the hardest part
              isn't building a business.
            </h2>

            <h3 className="mt-12 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.06em] text-[oklch(0.6461_0.194_41.12)] md:text-7xl lg:text-[7rem]">
              Maybe it's believing
              you could build one.
            </h3>
          </div>

          <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1fr]">
            <p className="max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              Once you start moving, you can learn.
              You can test. You can adapt.
              You can ask for help.
              You can find people.
              You can figure things out.
            </p>

            <p className="max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
              The biggest hurdle is often not the market,
              the money or the competition.
              It's the moment before you decide
              you're allowed to begin.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 07 — URGE                                                     */}
      {/* ------------------------------------------------------------ */}

      <section className="bg-foreground px-6 py-32 text-background lg:px-10 lg:py-48">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              You don't have to do it alone
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.055em] md:text-7xl lg:text-8xl">
              You start with what
              you have.
              <br />
              We help you figure out
              what to do with it.
            </h2>
          </div>

          <div className="mt-24 grid gap-px overflow-hidden rounded-3xl bg-background/15 md:grid-cols-2">
            {[
              {
                number: '01',
                title: 'A path',
                text: 'A structured program that turns uncertainty into the next useful action.',
              },
              {
                number: '02',
                title: 'People',
                text: 'A community of people building alongside you—not watching from the sidelines.',
              },
              {
                number: '03',
                title: 'Expertise',
                text: 'Access to people who can help when the problem is bigger than your current knowledge.',
              },
              {
                number: '04',
                title: 'Momentum',
                text: 'Standups, events, challenges and accountability that make it harder to quietly give up.',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-foreground p-8 md:p-12"
              >
                <span className="text-xs font-medium tracking-[0.2em] text-background/40">
                  {item.number}
                </span>

                <h3 className="mt-16 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                  {item.title}
                </h3>

                <p className="mt-5 max-w-md leading-7 text-background/55">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-4xl">
            <p className="text-3xl font-medium leading-tight tracking-[-0.035em] md:text-5xl">
              Urge isn't a course about starting a business.
            </p>

            <p className="mt-5 text-3xl font-medium leading-tight tracking-[-0.035em] text-[oklch(0.6461_0.194_41.12)] md:text-5xl">
              It's a place to start one.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* 08 — FINAL ACTIVATION                                         */}
      {/* ------------------------------------------------------------ */}

      <section className="relative flex min-h-[85svh] items-center px-6 py-32 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[oklch(0.6461_0.194_41.12)]">
              Start here
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-[7rem]">
              You don't need
              <br />
              the whole answer.
            </h2>

            <p className="mt-10 max-w-2xl text-xl leading-8 text-muted-foreground md:text-2xl">
              You just need to find out whether
              there is something worth starting
              with what you already have.
            </p>

            <Link
              href="/discover"
              className="group mt-12 inline-flex items-center gap-5 rounded-full bg-foreground px-8 py-5 text-base font-medium text-background transition-transform duration-300 hover:-translate-y-1"
            >
              <span>Find out what yours could be</span>

              <span
                aria-hidden="true"
                className="text-lg transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[35rem] w-[35rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,oklch(0.6461_0.194_41.12_/_0.09),transparent_68%)] blur-3xl"
        />
      </section>

      {/* ------------------------------------------------------------ */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------ */}

      <footer className="border-t border-foreground/10 px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-muted-foreground md:flex-row md:items-center">
          <span className="font-medium text-foreground">
            urge
          </span>

          <span>
            Start with what you already have.
          </span>
        </div>
      </footer>
    </main>
  );
}