import { createPageMetadata } from "@/lib/metadata";
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
          <div className="dark-card relative min-h-[390px] overflow-hidden p-8">
            <div className="grid-surface absolute inset-0 opacity-55" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(53,184,74,.14),transparent_58%)]" />
            <div className="relative grid h-full min-h-[325px] place-items-center">
              <div className="absolute h-64 w-64 rotate-45 rounded-[3.5rem] border border-white/8" />
              <div className="absolute h-48 w-48 rotate-45 rounded-[2.5rem] border border-brand/25" />
              <div className="relative flex h-40 w-40 rotate-[22deg] items-center justify-center rounded-[2.2rem] border border-white/15 bg-[#171d18] shadow-2xl shadow-black/60">
                <div className="h-20 w-20 rounded-2xl border-[12px] border-brand shadow-[0_0_40px_rgba(53,184,74,.16)]" />
              </div>
              <div className="absolute top-0 left-0 text-[9px] tracking-[0.18em] text-zinc-500 uppercase">Custom geometry</div>
              <div className="absolute right-0 bottom-0 text-[9px] tracking-[0.18em] text-brand uppercase">Ready to produce</div>
            </div>
          </div>
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
