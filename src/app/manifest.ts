import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voxel Vandal",
    short_name: "Voxel Vandal",
    description:
      "Custom 3D printing, part design, short-run production, and Smart QR displays.",
    start_url: "/",
    display: "standalone",
    background_color: "#090c0a",
    theme_color: "#090c0a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
