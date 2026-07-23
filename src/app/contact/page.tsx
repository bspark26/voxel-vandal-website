import ProjectInquiryForm from "@/components/ProjectInquiryForm";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Start a Project",
  description:
    "Contact Voxel Vandal in Calgary about custom 3D printing, part design, short-run production, or a Smart QR display project.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 lg:pt-48 lg:pb-24">
        <div className="grid-surface absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute top-24 right-0 h-96 w-96 rounded-full bg-brand/7 blur-[120px]" />
        <div className="site-container relative">
          <div className="max-w-3xl">
            <p className="eyebrow">Start a project</p>
            <h1 className="display-title mt-7">
              Bring us the
              <span className="block text-brand">starting point.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              A finished file is useful, but it is not required. Tell us what you are trying to make, improve, or put into the hands of your customers.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-22 lg:pb-30">
        <div className="site-container grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
          <aside className="dark-card h-fit p-7 lg:p-8">
            <p className="eyebrow">What happens next</p>
            <ol className="mt-8 space-y-7">
              {[
                ["01", "We review the request", "We look at the use, dimensions, quantity, timing, and any files you can provide."],
                ["02", "We clarify the details", "If anything is missing, we identify what is needed to price or develop the work properly."],
                ["03", "You get a clear next step", "That may be a quote, a design phase, a prototype, or a short discovery conversation."],
              ].map(([number, title, text]) => (
                <li key={number} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-mono text-xs text-brand">{number}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    <p className="mt-2 text-xs leading-6 text-zinc-500">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-9 border-t border-white/8 pt-6">
              <p className="text-sm font-semibold text-white">Calgary and surrounding area</p>
              <p className="text-xs leading-6 text-zinc-500">
                Have a question before submitting a project? Email us at{" "}
                <a
                  href="mailto:info@voxelvandal.com"
                  className="text-brand transition hover:text-brand-bright"
                >
                  info@voxelvandal.com
                </a>
                .
              </p>
              <p className="mt-4 text-xs leading-6 text-zinc-500">
                For Smart QR inquiries, include the intended placement, estimated quantity, and how you want visitors to use the display.
              </p>
            </div>
          </aside>

          <div className="dark-card p-6 sm:p-8 lg:p-10">
            <div className="mb-9">
              <p className="text-2xl font-semibold tracking-tight text-white">Project details</p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">Share what you know. Estimates and rough ideas are completely fine.</p>
            </div>
            <ProjectInquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
