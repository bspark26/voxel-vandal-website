import type { Metadata } from "next";

export const siteUrl = "https://voxelvandal.com";

const socialImage = {
  url: "/images/customer-projects/unreal-bike-park-printed-qr-display.webp",
  width: 1086,
  height: 1448,
  alt: "Finished custom 3D-printed QR display made by Voxel Vandal",
};

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | Voxel Vandal`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: "Voxel Vandal",
      locale: "en_CA",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage.url],
    },
  };
}
