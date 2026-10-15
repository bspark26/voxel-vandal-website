# Voxel Vandal Smart QR manufacturing prototype

This isolated Phase 1 prototype generates deterministic manufacturing assets for
a permanent Voxel Vandal Smart QR address.

It does **not** change or deploy with the production marketing website.

## Current production defaults

- Bambu Lab printer workflow using Bambu Studio
- 0.4 mm nozzle
- 0.2 mm layer height
- 90 mm standard square plate
- 2.4 mm white glue-in insert with a flat back
- 0.6 mm chamfered outer edge
- 2 mm raised black QR
- No decorative border
- Face-up orientation
- Four-module white quiet zone
- QR error correction level Q
- One layer-based colour change at Z=2.4 mm

## Generated files

- Scalable SVG manufacturing artwork
- High-resolution PNG scan-test preview
- One combined, colourless insert STL
- ZIP production package with Bambu Studio filament-change instructions

## Run locally

From this directory:

```shell
npm install
npm run dev
```

Open the local address printed by Vite.

## Validate

```shell
npm run typecheck
npm run validate
npm run build
```

The first downloaded STL must still be opened in Bambu Studio, sliced with the
white-to-black filament change at Z=2.4 mm, physically printed and scan-tested
before the production geometry is locked.
