import Image from "next/image";
import Link from "next/link";

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "3D Printing", href: "/3d-printing" },
  { label: "Smart QR", href: "/smart-qr" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#070907]">
      <div className="site-container py-14 lg:py-18">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.7fr_0.9fr]">
          <div className="max-w-md">
            <Link href="/" aria-label="Voxel Vandal home">
              <Image
                src="/images/logo/voxelvandal-logo.png"
                alt="Voxel Vandal"
                width={225}
                height={50}
                className="h-auto w-[205px]"
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              Custom 3D printing, part design, and smart physical products built for businesses that need something better than off the shelf.
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Based in Calgary, serving Calgary and the surrounding area.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-sm text-zinc-400 transition hover:text-white" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5">Build something useful</p>
            <p className="text-sm leading-7 text-zinc-400">
              Have a part, product, or Smart QR application in mind? Tell us what you are working on.
            </p>
            <a
              href="mailto:info@voxelvandal.com"
              className="mt-4 block text-sm text-zinc-400 transition hover:text-white"
            >
              info@voxelvandal.com
            </a>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              Start a conversation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/8 pt-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Voxel Vandal. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>Custom fabrication · Smart physical products</p>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
