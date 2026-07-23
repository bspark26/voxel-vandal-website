import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Smart QR Displays for Real Estate",
  description:
    "Reusable, branded QR displays for real estate with destinations designed to be updated through the upcoming Voxel Vandal management platform.",
  path: "/smart-qr/",
});

const uses = [
  ["Property listings", "Send prospects directly to the current listing page, with the freedom to reuse the display later."],
  ["Open houses", "Switch the destination to registration, property details, or a follow-up form as the event changes."],
  ["Virtual tours", "Give buyers a fast path from a physical sign or display to an immersive property walkthrough."],
  ["Agent profiles", "Connect a reusable branded display to the right agent, team, or contact experience."],
  ["New developments", "Keep sales information current as availability, floor plans, and campaign pages evolve."],
  ["Property resources", "Link tenants, owners, or visitors to documents, guides, booking tools, and support information."],
];

export default function SmartQrPage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-34 pb-20 sm:pt-42 lg:pt-48 lg:pb-28">
        <div className="grid-surface absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute top-10 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand/8 blur-[130px]" />
        <div className="site-container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/7 px-4 py-2 text-[0.68rem] font-semibold tracking-[0.17em] text-brand uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Product in development
            </div>
            <h1 className="display-title mt-8">
              Weaponize the
              <span className="block text-brand">QR code.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl">
              QR codes already connect the physical and digital worlds. Smart QR puts that connection under your control—point it at a listing today, an open-house form tomorrow, and the next property after that without replacing the physical display.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact?project=smart-qr" className="button-primary justify-center">
                Discuss a Smart QR project <span aria-hidden="true">↗</span>
              </Link>
              <a href="#how-it-works" className="button-secondary justify-center">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="mt-16">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Concept ideas</p>
                <p className="mt-2 text-sm text-zinc-500">Three directions. No fixed catalogue.</p>
              </div>
              <p className="max-w-md text-xs leading-6 text-zinc-500 sm:text-right">
                Choose what catches your eye—or use it as the beginning of something entirely different.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  src: "/images/concept/smart-qr-real-estate-display-concept-wood.webp",
                  alt: "Wood-finish branded Smart QR display concept for a real estate property",
                },
                {
                  src: "/images/concept/smart-qr-premium-real-estate-display-concept.webp",
                  alt: "Premium black and gold Smart QR display concept for a real estate agency",
                },
                {
                  src: "/images/concept/smart-qr-house-shaped-display-concept.webp",
                  alt: "House-shaped custom Smart QR display concept for a real estate agent",
                },
              ].map((image) => (
                <div key={image.src} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#111612] shadow-2xl shadow-black/20">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.025]"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-zinc-500">Concept renderings shown for design exploration. Final construction and details may vary.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0c100d] py-22 lg:py-28" id="how-it-works">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="section-title mt-4">The code stays. The destination moves.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-zinc-400 lg:justify-self-end">
              Each display points to a Voxel Vandal-managed redirect. The management platform will let subscribed customers change where that redirect sends visitors while the QR printed on the display remains the same.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              ["01", "Place", "Use the display on a sign, desk, open-house table, brochure station, or property fixture."],
              ["02", "Connect", "Assign the destination that matters now—a listing, virtual tour, form, profile, or resource page."],
              ["03", "Update", "Change the destination later through the planned dashboard without producing a new QR display."],
            ].map(([number, title, text]) => (
              <article key={number} className="dark-card p-7 lg:p-8">
                <span className="font-mono text-xs text-brand">{number}</span>
                <div className="my-8 h-px bg-linear-to-r from-brand/50 to-transparent" />
                <h3 className="text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-22 lg:py-30">
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="eyebrow">Built around real estate</p>
            <h2 className="section-title mt-4">One product. A lot of useful moments.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
              Start with a single listing workflow or develop a consistent display system across a team, brokerage, or property portfolio.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
            {uses.map(([title, text], index) => (
              <article key={title} className="group bg-[#090c0a] p-7 transition hover:bg-brand/[0.025] lg:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-xs font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-zinc-700 transition group-hover:text-brand">↗</span>
                </div>
                <h3 className="mt-10 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.018] py-22 lg:py-28">
        <div className="site-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Made for your brand</p>
            <h2 className="section-title mt-4">Not just a QR code on a piece of paper.</h2>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              The physical display is part of the customer experience. Voxel Vandal can develop formats that suit your placement, visual identity, and quantity requirements.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Branding", "Logos, names, colors, and messaging"],
              ["Format", "Tabletop, mounted, sign-ready, or custom"],
              ["Finish", "Material and finish options matched to use"],
              ["Quantity", "Single displays through repeatable batches"],
            ].map(([title, text]) => (
              <div key={title} className="dark-card p-6">
                <span className="mb-8 block h-2 w-2 rounded-full bg-brand" />
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-22 lg:py-30">
        <div className="site-container">
          <div className="dark-card relative overflow-hidden p-7 sm:p-10 lg:p-14">
            <div className="grid-surface absolute inset-0 opacity-25" />
            <div className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full bg-brand/9 blur-[100px]" />
            <div className="relative grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="eyebrow">Platform roadmap</p>
                <h2 className="section-title mt-4">Physical displays, managed online.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
                  The upcoming subscription platform is planned to give customers a secure place to view their owned displays, change destinations, and eventually understand how the displays are being used.
                </p>
                <div className="mt-7 rounded-xl border border-brand/15 bg-brand/5 p-4 text-sm leading-6 text-zinc-300">
                  <strong className="text-brand">Simple pricing model:</strong> the fabricated display is purchased separately, with an additional monthly or annual subscription for online management.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0c100d] p-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <p className="text-xs font-semibold text-white">Management dashboard</p>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[9px] font-semibold text-brand">PLANNED</span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["127 Aspen Drive", "Listing page", "Active"],
                    ["Open House Display", "Registration", "Active"],
                    ["Agent Desk Sign", "Profile page", "Draft"],
                  ].map(([name, type, status]) => (
                    <div key={name} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-white/7 bg-white/[0.025] p-3">
                      <div>
                        <p className="text-[11px] font-medium text-zinc-200">{name}</p>
                        <p className="mt-1 text-[9px] text-zinc-500">{type}</p>
                      </div>
                      <span className={`self-center text-[9px] ${status === "Draft" ? "text-zinc-500" : "text-brand"}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="site-container">
          <div className="rounded-[1.75rem] border border-brand/20 bg-brand px-7 py-12 text-[#061008] sm:px-12 lg:px-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">Early conversations are open</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Have a real estate use case in mind?</h2>
                <p className="mt-5 max-w-2xl leading-7 text-[#0a2b10]/75">Tell us how you would use Smart QR. Early input will help shape the physical product and management experience.</p>
              </div>
              <Link href="/contact?project=smart-qr" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#071008] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">
                Discuss your use case <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
