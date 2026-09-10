"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

import { DiscoveryFlow } from "@/components/discovery/DiscoveryFlow";

export function HomeExperience() {
  const discoveryRef = useRef<HTMLElement>(null);
  const [showDiscovery, setShowDiscovery] = useState(false);

  function enterDiscovery() {
    setShowDiscovery(true);

    requestAnimationFrame(() => {
      discoveryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ------------------------------------------------------------ */}
      {/* NAVIGATION                                                    */}
      {/* ------------------------------------------------------------ */}

      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="text-lg font-semibold tracking-[-0.04em]">
            urge<span className="text-primary">.</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
            <a
              href="#why"
              className="transition-colors hover:text-foreground"
            >
              Why
            </a>

            <a
              href="#how"
              className="transition-colors hover:text-foreground"
            >
              How
            </a>

            <button
              type="button"
              onClick={enterDiscovery}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              Explore
            </button>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------ */}
      {/* HERO                                                          */}
      {/* ------------------------------------------------------------ */}

      <section className="relative flex min-h-screen items-center px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-8 text-xs font-medium uppercase tracking-[0.28em] text-primary">
              A different way to build
            </p>

            <h1 className="text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              You don't need
              <br />
              to have it
              <br />
              <span className="text-primary">figured out.</span>
            </h1>

            <div className="mt-12 max-w-xl">
              <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                You just need to start seeing what's possible.
              </p>

              <button
                type="button"
                onClick={enterDiscovery}
                className="group mt-10 inline-flex items-center gap-3 border-b border-foreground pb-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                See what could be possible
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground">
            <ArrowDown className="size-5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* MYTH                                                          */}
      {/* ------------------------------------------------------------ */}

      <section
        id="why"
        className="border-t border-border/60 px-6 py-32 sm:py-44"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                The story we've been told
              </p>
            </div>

            <div className="max-w-4xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">
                Somewhere along the way, we made starting a business seem
                extraordinary.
              </h2>

              <div className="mt-14 space-y-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                <p>You need money.</p>
                <p>You need connections.</p>
                <p>You need a great idea.</p>
                <p>You need experience.</p>
                <p>You need to know what you're doing.</p>
              </div>

              <p className="mt-14 text-3xl font-medium tracking-tight sm:text-4xl">
                Or so we've been told.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* HISTORY / REFRAME                                              */}
      {/* ------------------------------------------------------------ */}

      <section className="bg-foreground px-6 py-32 text-background sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Look closer
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              People have been building businesses forever.
            </h2>

            <p className="mt-12 max-w-2xl text-lg leading-relaxed text-background/60 sm:text-xl">
              Long before venture capital. Long before business schools. Long
              before startup culture.
            </p>

            <div className="mt-20 grid gap-px overflow-hidden border border-background/10 bg-background/10 sm:grid-cols-5">
              {[
                "A shop.",
                "A trade.",
                "A service.",
                "A craft.",
                "An idea.",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-foreground px-6 py-8 text-lg font-medium"
                >
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-20 text-3xl font-medium tracking-tight sm:text-5xl">
              Someone saw something people needed
              <br />
              and figured out how to make it work.
            </p>

            <p className="mt-10 text-xl font-medium text-primary sm:text-2xl">
              That's entrepreneurship too.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* SCALE                                                          */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Not every business needs to be a unicorn
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              There isn't one right size.
            </h2>
          </div>

          <div className="mt-24 grid gap-0 border-y border-border/60 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Independence",
                text: "A business that gives you more control over your life.",
              },
              {
                title: "Craft",
                text: "Something built around what you know unusually well.",
              },
              {
                title: "Community",
                text: "A small company solving a problem close to home.",
              },
              {
                title: "Ambition",
                text: "Something that grows as far as you want to take it.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={[
                  "px-0 py-10 sm:px-8 lg:py-14",
                  index > 0
                    ? "border-t border-border/60 sm:border-l lg:border-t-0"
                    : "",
                ].join(" ")}
              >
                <p className="text-sm font-medium text-primary">
                  0{index + 1}
                </p>

                <h3 className="mt-6 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-20 max-w-3xl text-2xl font-medium leading-tight tracking-tight sm:text-4xl">
            The point isn't to make it bigger than it needs to be.
            <br />
            <span className="text-muted-foreground">
              The point is to make it yours.
            </span>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* POSSIBILITY                                                    */}
      {/* ------------------------------------------------------------ */}

      <section className="border-t border-border/60 px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Start with what you already have
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              Think about what you already know.
            </h2>

            <div className="mt-20 grid gap-12 text-2xl font-medium tracking-tight sm:grid-cols-2 sm:text-3xl">
              {[
                "The industry you've spent years inside.",
                "The problems you've learned to work around.",
                "The things people keep asking you for.",
                "The things you notice that others don't.",
                "The things you keep thinking could be done better.",
                "The ideas you've dismissed because they didn't look big enough.",
              ].map((item) => (
                <p key={item} className="max-w-lg">
                  {item}
                </p>
              ))}
            </div>

            <div className="mt-24 border-l-2 border-primary pl-6">
              <p className="text-3xl font-semibold tracking-tight sm:text-5xl">
                What if that's enough to start?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* TWO PEOPLE                                                     */}
      {/* ------------------------------------------------------------ */}

      <section className="bg-muted/30 px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px overflow-hidden border border-border/60 bg-border/60 lg:grid-cols-2">
            <article className="bg-background p-8 sm:p-14 lg:p-20">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                Maybe you're just getting started
              </p>

              <h2 className="mt-8 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                You have energy, curiosity and years ahead of you.
              </h2>

              <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Maybe you have too many possibilities. Maybe you don't know
                which ones deserve your time.
              </p>

              <p className="mt-12 text-xl font-medium">
                You don't need to pick the perfect career.
              </p>

              <p className="mt-3 text-xl text-primary">
                You need to discover what is worth building.
              </p>
            </article>

            <article className="bg-foreground p-8 text-background sm:p-14 lg:p-20">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
                Maybe you've already built a career
              </p>

              <h2 className="mt-8 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                You've become good at something.
              </h2>

              <p className="mt-8 max-w-lg text-lg leading-relaxed text-background/60">
                Maybe even very good. But the next promotion doesn't excite
                you like it used to.
              </p>

              <p className="mt-12 text-xl font-medium">
                You know there is another chapter.
              </p>

              <p className="mt-3 text-xl text-primary">
                You just haven't found it yet.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* CORE IDEA                                                      */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-40 sm:py-56">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              The part we don't talk about
            </p>

            <h2 className="mt-10 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
              Maybe the hardest part isn't building a business.
            </h2>

            <p className="mt-16 text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-primary sm:text-7xl">
              Maybe it's believing you could build one.
            </p>

            <div className="mt-20 max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              <p>
                Once you start moving, you can learn. You can test. You can
                adapt.
              </p>

              <p>
                You can ask for help. You can find people. You can figure
                things out.
              </p>
            </div>

            <p className="mt-16 text-3xl font-semibold tracking-tight sm:text-5xl">
              You just have to begin.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* URGE                                                           */}
      {/* ------------------------------------------------------------ */}

      <section className="bg-foreground px-6 py-32 text-background sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Why Urge exists
            </p>

            <h2 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
              More people should have the chance to build.
            </h2>

            <div className="mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-background/60 sm:text-xl">
              <p>
                Not because everyone needs to become an entrepreneur.
              </p>

              <p>
                Because everyone should have the opportunity to discover what
                they could create.
              </p>
            </div>

            <p className="mt-16 text-3xl font-medium tracking-tight sm:text-5xl">
              You don't need to know what to build before you begin.
            </p>

            <p className="mt-8 text-2xl font-medium text-primary sm:text-3xl">
              We'll help you find out.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* THE PEOPLE                                                     */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-32 sm:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                You won't do it alone
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Urge is more than a program.
              </h2>

              <div className="mt-14 grid gap-px border border-border/60 bg-border/60 sm:grid-cols-2">
                {[
                  {
                    title: "The path",
                    text: "A practical sequence that helps you move instead of getting lost in theory.",
                  },
                  {
                    title: "The people",
                    text: "Others building alongside you, plus people who have been through it before.",
                  },
                  {
                    title: "The team",
                    text: "People around you when you don't know what to do next.",
                  },
                  {
                    title: "The network",
                    text: "Experts, collaborators and useful connections when you need them.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-background p-8 sm:p-10"
                  >
                    <h3 className="text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-14 text-2xl font-medium tracking-tight sm:text-3xl">
                A place to think.
                <br />
                A place to try.
                <br />
                A place to keep going.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* THE PATH                                                       */}
      {/* ------------------------------------------------------------ */}

      <section
        id="how"
        className="border-y border-border/60 bg-muted/30 px-6 py-32 sm:py-44"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
            The path
          </p>

          <h2 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
            From "I wonder..."
            <br />
            to "I'm building."
          </h2>

          <div className="mt-24 grid gap-0 border-y border-border/60 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                text: "Find something worth pursuing.",
              },
              {
                number: "02",
                title: "Build",
                text: "Make the idea real.",
              },
              {
                number: "03",
                title: "Grow",
                text: "See where it can go.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={[
                  "py-12 md:px-10 md:py-16",
                  index > 0
                    ? "border-t border-border/60 md:border-l md:border-t-0"
                    : "",
                ].join(" ")}
              >
                <p className="text-sm font-medium text-primary">
                  {item.number}
                </p>

                <h3 className="mt-6 text-3xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-4 text-lg text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Not a course to complete. A journey to take.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* INVITATION                                                     */}
      {/* ------------------------------------------------------------ */}

      <section className="px-6 py-40 sm:py-56">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
              Your turn
            </p>

            <h2 className="mt-10 text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              What could
              <br />
              <span className="text-primary">you build?</span>
            </h2>

            <p className="mt-12 max-w-xl text-xl leading-relaxed text-muted-foreground sm:text-2xl">
              Let's find out.
            </p>

            <button
              type="button"
              onClick={enterDiscovery}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Explore what's possible
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* DISCOVERY                                                      */}
      {/* ------------------------------------------------------------ */}

      {showDiscovery && (
        <section
          ref={discoveryRef}
          className="border-t border-border/60 bg-foreground px-6 py-24 text-background sm:py-36"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-16">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                Let's make it personal
              </p>

              <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                You don't have to know the answer yet.
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/60">
                Tell us a little about where you are. We'll help you see what
                Urge could look like for you.
              </p>
            </div>

            <DiscoveryFlow />
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------ */}

      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-lg font-semibold tracking-[-0.04em]">
            urge<span className="text-primary">.</span>
          </p>

          <p className="text-xs text-muted-foreground">
            Build something worth building.
          </p>
        </div>
      </footer>
    </main>
  );
}