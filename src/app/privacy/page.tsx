import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How Voxel Vandal collects, uses, protects, and manages information submitted through this website.",
  path: "/privacy/",
});

const sections = [
  {
    title: "Information we collect",
    content: (
      <>
        <p>
          When you submit a project inquiry, we may collect your name, company,
          email address, phone number, project type, estimated quantity, and the
          details you choose to share about your project.
        </p>
        <p>
          We do not intentionally collect payment information, account
          passwords, or sensitive personal information through this website.
        </p>
      </>
    ),
  },
  {
    title: "How we use your information",
    content: (
      <>
        <p>
          We use submitted information to review your request, respond to you,
          clarify project requirements, prepare estimates or quotes, and manage
          our business relationship with you.
        </p>
        <p>
          We do not sell or rent personal information. We will not use your
          contact details for unrelated marketing without your consent.
        </p>
      </>
    ),
  },
  {
    title: "Form processing",
    content: (
      <p>
        Our inquiry form is processed by Formspree, a third-party form service.
        Information submitted through the form is transmitted to and processed
        by Formspree so it can be delivered to Voxel Vandal. Formspree manages
        that information under its own privacy and security practices.
      </p>
    ),
  },
  {
    title: "Cookies and analytics",
    content: (
      <p>
        This website does not currently use advertising cookies or third-party
        analytics trackers. If that changes, this policy will be updated to
        explain what is collected and why.
      </p>
    ),
  },
  {
    title: "Retention and protection",
    content: (
      <>
        <p>
          We retain inquiry information only as long as reasonably needed to
          respond, provide services, maintain appropriate business records, or
          meet legal obligations. Information that is no longer required is
          deleted or securely disposed of when practical.
        </p>
        <p>
          We use reasonable administrative and technical measures to protect
          the information in our care. No online transmission or storage method
          can be guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    title: "Access, correction, and questions",
    content: (
      <p>
        You may ask about the personal information we hold about you, request a
        correction, or ask us to delete information that we no longer need.
        Contact us at{" "}
        <a
          href="mailto:info@voxelvandal.com"
          className="text-brand transition hover:text-brand-bright"
        >
          info@voxelvandal.com
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="relative overflow-hidden pt-36 pb-18 sm:pt-44 lg:pt-48 lg:pb-22">
        <div className="grid-surface absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-brand/7 blur-[120px]" />
        <div className="site-container relative">
          <div className="max-w-4xl">
            <p className="eyebrow">Your information</p>
            <h1 className="display-title mt-7">
              Privacy,
              <span className="block text-brand">without the fine-print fog.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">
              This policy explains what Voxel Vandal collects through this
              website and how that information is handled.
            </p>
            <p className="mt-5 text-xs tracking-[0.12em] text-zinc-500 uppercase">
              Effective July 22, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="pb-22 lg:pb-30">
        <div className="site-container grid gap-10 lg:grid-cols-[0.34fr_1fr] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="dark-card p-6">
              <p className="eyebrow">Voxel Vandal</p>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Based in Calgary, serving Calgary and the surrounding area.
              </p>
              <a
                href="mailto:info@voxelvandal.com"
                className="mt-4 inline-flex text-sm font-semibold text-brand transition hover:text-brand-bright"
              >
                info@voxelvandal.com
              </a>
            </div>
          </aside>

          <div className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/9 bg-white/[0.025]">
            {sections.map((section) => (
              <section key={section.title} className="p-7 sm:p-9 lg:p-11">
                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-white sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-zinc-400">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#0c100d] py-12">
        <div className="site-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Have a question about a project instead?
          </p>
          <Link href="/contact" className="button-secondary">
            Contact Voxel Vandal <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
