import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "About Brook & Taylor",
  description:
    "Meet Brook and Taylor, the Calgary-based practical minds behind Voxel Vandal's custom 3D-printed products and technology-driven ideas.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pt-48 lg:pb-28">
        <div className="grid-surface absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute top-10 right-[-12rem] h-[34rem] w-[34rem] rounded-full bg-brand/8 blur-[120px]" />

        <div className="site-container relative">
          <div className="max-w-4xl">
            <p className="eyebrow">About Voxel Vandal</p>
            <h1 className="display-title mt-7">
              We build what
              <span className="block text-brand">we can’t find.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl sm:leading-9">
              We’re Brook and Taylor—the hands-on, practical thinkers behind
              Voxel Vandal. Based in Calgary, we believe that when the right
              product doesn’t exist, the answer is to create it.
            </p>
          </div>

          <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111612] shadow-2xl shadow-black/35 lg:mt-16">
            <Image
              src="/images/about/brook-taylor-waterfall.webp"
              alt="Brook and Taylor together at a waterfall in British Columbia"
              fill
              priority
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-white/80 uppercase backdrop-blur-md sm:bottom-7 sm:left-7">
              Brook + Taylor
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0c100d] py-22 lg:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Where it started</p>
            <h2 className="section-title mt-4">Different interests. The same instinct.</h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-zinc-400 sm:text-lg sm:leading-9">
            <p>
              That approach started in our own lives. Brook has designed
              custom parts for his mountain bikes that weren’t available from
              manufacturers, while Taylor has created accessories and baffles
              specifically for her aquariums.
            </p>
            <p>
              Different interests, same instinct: understand what’s needed,
              rethink what’s available, and make something that works.
            </p>
          </div>
        </div>
      </section>

      <section className="py-22 lg:py-30">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
          <figure className="relative aspect-[3/2] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111612]">
            <Image
              src="/images/about/brook-mountain-biking.webp"
              alt="Brook riding a mountain bike on a forest trail"
              fill
              sizes="(max-width: 991px) 100vw, 56vw"
              className="object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/8" />
          </figure>

          <div>
            <p className="eyebrow">Built on practical thinking</p>
            <h2 className="section-title mt-4">Useful beats complicated.</h2>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              We both come from the trades, so we naturally approach ideas
              with a practical eye. We care about how something will be used,
              how it should be built, and whether it will hold up outside of a
              concept rendering.
            </p>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Our combined experience spans mechanical work, electrical
              systems, business, real estate, fabrication, and software. That
              range lets us look at a project from more than one angle—and
              connect physical products with technology when the idea calls
              for it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.018] py-22 lg:py-28">
        <div className="site-container grid gap-5 lg:grid-cols-2">
          <article className="dark-card p-7 sm:p-9 lg:p-11">
            <p className="eyebrow">Bring what you have</p>
            <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Ideas don’t need to arrive fully formed.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              Some customers come to us with a finished file. Others have a
              rough sketch, an existing part that needs improving, or simply
              an idea they cannot find anywhere else.
            </p>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              That is where Voxel Vandal fits. We help shape the idea, work
              through the practical details, and turn it into something real.
            </p>
          </article>

          <article className="dark-card p-7 sm:p-9 lg:p-11">
            <p className="eyebrow">Outside the workshop</p>
            <h2 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Built by people who use what they make.
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              When we aren’t designing or building, we’re usually outside—mountain
              biking, hiking, paddleboarding, or travelling in our camper van.
            </p>
            <p className="mt-5 text-base leading-8 text-zinc-400">
              Those interests keep us close to people who use their equipment,
              notice what could work better, and aren’t satisfied with “that’s
              just how it comes.”
            </p>
          </article>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand/20 bg-brand px-7 py-12 text-[#061008] sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full border-[60px] border-black/5" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">
                  They don’t make it?
                </p>
                <h2 className="mt-4 text-4xl leading-tight font-semibold tracking-[-0.045em] sm:text-5xl">
                  Let’s change that.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#0a2810]/80">
                  Bring us the idea or the part you wish existed. We’ll help
                  determine what it can become.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#071008] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
              >
                Start a project <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
