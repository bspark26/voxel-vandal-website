const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");

const sourceDirectory = path.join(process.cwd(), "public", "images", "concept");
const images = [
  {
    source: "sample1.png",
    output: "smart-qr-real-estate-display-concept-wood.webp",
  },
  {
    source: "sample2.png",
    output: "smart-qr-premium-real-estate-display-concept.webp",
  },
  {
    source: "sample3.png",
    output: "smart-qr-house-shaped-display-concept.webp",
  },
];
const customerSourceDirectory = path.join(
  process.cwd(),
  "public",
  "images",
  "customer projects",
);
const customerOutputDirectory = path.join(
  process.cwd(),
  "public",
  "images",
  "customer-projects",
);
const aboutDirectory = path.join(process.cwd(), "public", "images", "about");

fs.mkdirSync(customerOutputDirectory, { recursive: true });

Promise.all(
  [
    ...images.map(({ source, output }) =>
      sharp(path.join(sourceDirectory, source))
        .webp({ quality: 84, effort: 6 })
        .toFile(path.join(sourceDirectory, output)),
    ),
    sharp(path.join(customerSourceDirectory, "unreal-base-render.png"))
      .webp({ quality: 84, effort: 6 })
      .toFile(
        path.join(
          customerOutputDirectory,
          "unreal-bike-park-concept-base.webp",
        ),
      ),
    sharp(path.join(customerSourceDirectory, "unreal-text-render.png"))
      .webp({ quality: 84, effort: 6 })
      .toFile(
        path.join(
          customerOutputDirectory,
          "unreal-bike-park-concept-graphics.webp",
        ),
      ),
    sharp(path.join(customerSourceDirectory, "unreal-printed.jpg"))
      .webp({ quality: 86, effort: 6 })
      .toFile(
        path.join(
          customerOutputDirectory,
          "unreal-bike-park-printed-qr-display.webp",
        ),
      ),
    sharp(path.join(aboutDirectory, "brook-taylor-waterfall.jpg"))
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(path.join(aboutDirectory, "brook-taylor-waterfall.webp")),
    sharp(path.join(aboutDirectory, "brook-biking.jpg"))
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(path.join(aboutDirectory, "brook-mountain-biking.webp")),
    sharp(
      path.join(
        process.cwd(),
        "public",
        "images",
        "logo",
        "voxelvandal-cube.png",
      ),
    )
      .resize(512, 512)
      .png({ compressionLevel: 9 })
      .toFile(path.join(process.cwd(), "src", "app", "icon.png")),
    sharp(
      path.join(
        process.cwd(),
        "public",
        "images",
        "logo",
        "voxelvandal-cube.png",
      ),
    )
      .resize(180, 180)
      .png({ compressionLevel: 9 })
      .toFile(path.join(process.cwd(), "src", "app", "apple-icon.png")),
  ],
).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
