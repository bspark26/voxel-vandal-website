import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { siteUrl } from "@/lib/metadata";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Custom 3D Printing for Business | Voxel Vandal",
    template: "%s | Voxel Vandal",
  },
  description:
    "Calgary custom 3D printing, part design, short-run production, and Smart QR displays for modern businesses.",
  applicationName: "Voxel Vandal",
  category: "Custom manufacturing",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Voxel Vandal",
      url: siteUrl,
      logo: `${siteUrl}/images/logo/voxelvandal-logo.png`,
      description:
        "Custom 3D printing, part design, short-run production, and connected physical products for businesses in Calgary and the surrounding area.",
      email: "info@voxelvandal.com",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Calgary and surrounding area, Alberta, Canada",
      },
      knowsAbout: [
        "Custom 3D printing",
        "3D part design",
        "Short-run production",
        "Branded physical products",
        "QR code displays",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Voxel Vandal",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-CA",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#090c0a] text-white antialiased`}>
        <Providers>
          <div className="isolate min-h-screen overflow-hidden">
            <Header />
            {children}
            <Footer />
          </div>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

