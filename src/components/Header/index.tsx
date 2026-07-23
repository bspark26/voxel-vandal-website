"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "3D Printing", href: "/3d-printing" },
  { label: "Smart QR", href: "/smart-qr" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/8 bg-[#090c0a]/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="site-container flex h-20 items-center justify-between lg:h-24">
        <Link href="/" className="relative z-10 flex items-center" aria-label="Voxel Vandal home">
          <Image
            src="/images/logo/voxelvandal-logo.png"
            alt="Voxel Vandal"
            width={225}
            height={50}
            priority
            className="h-auto w-[174px] sm:w-[205px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-brand" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="button-primary py-3 text-sm">
            Start a project
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <button
          type="button"
          className="relative z-10 grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-px w-5 bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-px w-5 bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-px w-5 bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/8 bg-[#090c0a] transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="site-container flex flex-col py-5" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b border-white/6 py-4 text-base font-medium ${
                pathname === link.href ? "text-brand" : "text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="button-primary mt-5 justify-center">
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
