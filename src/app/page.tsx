import { createPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Custom 3D Printing Calgary",
  description:
    "Calgary custom 3D printing for businesses, including part design, supplied-file printing, short-run production, and Smart QR displays.",
  path: "/",
});

const services = [
  {
    number: "01",
    title: "Custom part design",
    description:
      "Bring us an idea, sketch, or rough concept. We can help shape it into a practical, print-ready part.",
  },
  {
    number: "02",
    title: "Print-ready file production",
    description:
      "Already have an STL, 3MF, or STEP file? We produce clean, dependable prints without forcing you into large quantities.",
  },
  {
    number: "03",
    title: "B2B & short runs",
    description:
      "Prototypes, branded pieces, fixtures, replacement parts, and repeatable small-batch production for business.",
  },
];

const process = [
  ["Share", "Send the idea, file, dimensions, quantity, and what the part needs to do."],
  ["Refine", "We review design, material, finish, timing, and any changes needed for a reliable print."],
  ["Make", "Once approved, we produce your project and keep communication clear through delivery."],
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:min-h-[850px] lg:pt-48 lg:pb-28">
        <div className="grid-surface absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="absolute top-16 right-[-15rem] h-[38rem] w-[38rem] rounded-full bg-brand/8 blur-[120px]" />
        <div className="site-container relative">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_15px_rgba(53,184,74,.8)]" />
                <span className="text-[0.68rem] font-semibold tracking-[0.17em] text-zinc-300 uppercase">Ideas, armed with technology</span>
              </div>
              <h1 className="display-title">
                Custom 3D printing,
                <span className="block text-brand">built around your idea.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl sm:leading-9">
                Based in Calgary and serving the surrounding area, Voxel Vandal turns concepts, supplied files, and things that don’t exist yet into something real using design, 3D printing, and connected technology.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="button-primary justify-center sm:justify-start">
                  Start a project <span aria-hidden="true">↗</span>
                </Link>
                <Link href="/smart-qr" className="button-secondary justify-center sm:justify-start">
                  Explore Smart QR <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-white/9 pt-6 text-xs text-zinc-300">
                <p>Custom design</p>
                <p>Supplied files</p>
                <p>Small-batch runs</p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-10 bg-brand/8 blur-[100px]" />
              <div className="dark-card relative overflow-hidden p-4 sm:p-5">
                <div className="grid-surface absolute inset-0 opacity-35" />
                <div className="relative flex items-center justify-between">
                  <p className="eyebrow">Customer project</p>
                  <span className="rounded-full border border-brand/20 bg-brand/8 px-3 py-1 text-[9px] font-semibold tracking-wider text-brand uppercase">Concept → printed</span>
                </div>
                <div className="relative mt-4 grid min-h-[390px] grid-cols-[1.45fr_0.75fr] gap-3 sm:min-h-[470px]">
                  <figure className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151a16]">
                    <Image
                      src="/images/customer-projects/unreal-bike-park-printed-qr-display.webp"
                      alt="Finished custom 3D-printed QR display for Unreal Indoor Bike Park"
                      fill
                      priority
                      sizes="(max-width: 991px) 65vw, 32vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 rounded-md border border-white/15 bg-black/60 px-2.5 py-1.5 text-[8px] font-semibold tracking-[0.13em] text-white/80 uppercase backdrop-blur">
                      03 · Finished unit
                    </figcaption>
                  </figure>
                  <div className="grid gap-3">
                    <figure className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151a16]">
                      <Image
                        src="/images/customer-projects/unreal-bike-park-concept-base.webp"
                        alt="3D model concept for the custom Unreal Indoor Bike Park display"
                        fill
                        sizes="(max-width: 991px) 35vw, 16vw"
                        className="object-contain p-2"
                      />
                      <figcaption className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[7px] font-semibold tracking-wider text-white/65 uppercase backdrop-blur">
                        01 · Form
                      </figcaption>
                    </figure>
                    <figure className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151a16]">
                      <Image
                        src="/images/customer-projects/unreal-bike-park-concept-graphics.webp"
                        alt="Digital branding and QR panel layout for Unreal Indoor Bike Park"
                        fill
                        sizes="(max-width: 991px) 35vw, 16vw"
                        className="object-contain p-2"
                      />
                      <figcaption className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[7px] font-semibold tracking-wider text-white/65 uppercase backdrop-blur">
                        02 · Graphics
                      </figcaption>
                    </figure>
                  </div>
                </div>
                <div className="relative mt-4 flex items-end justify-between border-t border-white/8 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Unreal Indoor Bike Park</p>
                    <p className="mt-1 text-[10px] text-zinc-500">Custom multi-part branded QR display</p>
                  </div>
                  <span className="text-xs text-brand">Made real ↗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.018] py-22 lg:py-28" id="services">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="eyebrow">What we make</p>
              <h2 className="section-title mt-4">Flexible production for uncommon needs.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-zinc-400 lg:justify-self-end">
              Whether you need help developing a part or simply need a dependable print partner, the process starts with understanding how the finished piece needs to work.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.number} className="dark-card group p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:bg-brand/[0.035]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-brand">{service.number}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-500 transition group-hover:border-brand/25 group-hover:text-brand">↗</span>
                </div>
                <h3 className="mt-16 text-xl font-semibold tracking-tight text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{service.description}</p>
              </article>
            ))}
          </div>
          <Link href="/3d-printing" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-bright">
            Explore 3D printing services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#0c100d] py-16 lg:py-20" id="project-work">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">Customer project · Unreal Indoor Bike Park</p>
              <h2 className="section-title mt-4">A custom 3D-printed QR display, from concept to finished unit.</h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-8 text-zinc-400">
                This project combined dimensional branding, a custom display base, multi-colour fabrication, and a scannable QR touchpoint into one finished piece built around the customer’s identity.
              </p>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                It’s the kind of work Voxel Vandal is made for: start with the idea, develop the individual parts, and produce something that doesn’t come from a catalogue.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-brand/6 blur-[120px]" />
        <div className="site-container relative grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Flagship product · In development</p>
            <h2 className="section-title mt-4">One permanent code. Full control over where it leads.</h2>
            <p className="mt-6 text-base leading-8 text-zinc-400">
              Smart QR Displays are reusable, branded physical displays with a destination you can update. Real estate professionals can move from a listing page to an open-house form—or prepare the display for the next property—without reprinting the QR code.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Reuse displays across listings and campaigns",
                "Update destinations through the planned management app",
                "Customize the physical display for your brand",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-[10px] text-brand">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/smart-qr" className="button-primary mt-9">
              Discover Smart QR <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-10 rounded-full bg-brand/12 blur-[100px]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111612] shadow-2xl shadow-black/45">
              <Image
                src="/images/concept/smart-qr-premium-real-estate-display-concept.webp"
                alt="Premium Smart QR real estate display concept"
                width={1122}
                height={1402}
                priority
                sizes="(max-width: 991px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/8" />
              <span className="absolute right-4 bottom-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[9px] font-semibold tracking-[0.14em] text-white/75 uppercase backdrop-blur-md">
                Concept rendering
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0c100d] py-22 lg:py-28">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">A straightforward process</p>
            <h2 className="section-title mt-4">Less friction between idea and finished part.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-3">
            {process.map(([title, description], index) => (
              <div key={title} className="bg-[#0c100d] p-7 lg:p-9">
                <span className="font-mono text-xs text-brand">0{index + 1}</span>
                <h3 className="mt-12 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand/20 bg-brand px-7 py-12 text-[#061008] sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full border-[60px] border-black/5" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">Have something in mind?</p>
                <h2 className="mt-4 text-4xl leading-tight font-semibold tracking-[-0.045em] sm:text-5xl">Let’s turn the idea into something useful.</h2>
              </div>
              <Link href="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#071008] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">
                Start a project <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
