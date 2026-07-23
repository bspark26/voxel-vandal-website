import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Custom 3D Printing in Calgary",
  description:
    "Custom part design, supplied-file printing, prototypes, and short-run 3D printing for businesses in Calgary and the surrounding area.",
  path: "/3d-printing/",
});

const capabilities = [
  ["Design from an idea", "Start with a sketch, photo, existing part, measurements, or a description of what you want to create."],
  ["Print your file", "Send an STL, 3MF, or STEP file and we will review it for printability, intended use, material, and finish."],
  ["Prototype & refine", "Test fit, function, and form before committing to a repeatable design or a larger production run."],
  ["Short-run production", "Produce useful quantities of specialized parts without the tooling commitment of traditional manufacturing."],
  ["Branded products", "Create custom displays, fixtures, promotional objects, and physical brand touchpoints."],
  ["Replacement solutions", "Develop practical replacements for unavailable, discontinued, or application-specific components."],
];

export default function PrintingPage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-36 pb-22 sm:pt-44 lg:pt-52 lg:pb-30">
        <div className="grid-surface absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-brand/7 blur-[120px]" />
        <div className="site-container relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="eyebrow">Custom 3D printing</p>
            <h1 className="display-title mt-7">
              Your idea.
              <span className="block text-brand">Made physical.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              Custom-designed parts, supplied-file printing, prototypes, and short production runs in Calgary and the surrounding area—with a process built around what the finished piece needs to accomplish.
            </p>
            <Link href="/contact?project=3d-printing" className="button-primary mt-9">
              Request a project review <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure className="dark-card relative min-h-[440px] overflow-hidden sm:min-h-[520px]">
            <Image
              src="/images/customer-projects/custom-jersey-logo-3d-printing.webp"
              alt="3D printer producing a custom circular jersey logo"
              fill
              priority
              sizes="(max-width: 991px) 100vw, 46vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/30" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
              <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-white/80 uppercase backdrop-blur-md">
                Actual project
              </span>
              <span className="rounded-full border border-brand/25 bg-black/45 px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-brand uppercase backdrop-blur-md">
                In production
              </span>
            </div>
            <figcaption className="absolute right-0 bottom-0 left-0 p-6 sm:p-8">
              <p className="text-lg font-semibold text-white">Custom jersey logo</p>
              <p className="mt-1 text-xs text-zinc-300">A real print in progress inside the Voxel Vandal workshop.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0c100d] py-22 lg:py-28">
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="eyebrow">Capabilities</p>
            <h2 className="section-title mt-4">A flexible path from file or idea to finished part.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([title, text], index) => (
              <article key={title} className="bg-[#0c100d] p-7 transition hover:bg-brand/[0.025] lg:p-8">
                <span className="font-mono text-xs text-brand">0{index + 1}</span>
                <h3 className="mt-10 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-22 lg:py-30">
        <div className="site-container grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">To get started</p>
            <h2 className="section-title mt-4">The useful details come first.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">You do not need a finished technical brief. Share what you know and we can identify what is still needed.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["The goal", "What should the part look like or do?"],
              ["Dimensions", "Overall size and any critical fit points"],
              ["Environment", "Heat, moisture, impact, UV, or load"],
              ["Quantity", "One prototype, a batch, or repeat orders"],
              ["Files", "STL, 3MF, STEP, other CAD files, drawings, or reference photos"],
              ["Timeline", "When the finished project is needed"],
            ].map(([title, text]) => (
              <div key={title} className="dark-card p-5">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="site-container">
          <div className="rounded-[1.75rem] border border-brand/20 bg-brand px-7 py-12 text-[#061008] sm:px-12 lg:px-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">Start with what you have</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">An idea, a file, or a part that needs improving.</h2>
              </div>
              <Link href="/contact?project=3d-printing" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#071008] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">
                Tell us about it <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
