# Voxel Vandal Website

Public marketing website for Voxel Vandal, built with Next.js, TypeScript, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
```

The site is statically exported to `out/` for deployment to Cloudflare Pages.

## Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `20` or newer

Connect the existing domain from the Cloudflare Pages project's **Custom domains** settings.

## Contact form

The project inquiry form is connected to Formspree. To replace the default endpoint for another environment, add this optional build-time variable in Cloudflare Pages:

```text
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form-id
```

Trigger a new deployment after adding or changing the value.

## Image optimization

The original concept PNGs are retained as source files. The website serves optimized WebP copies. Regenerate them after replacing a source image with:

```bash
node scripts/optimize-images.cjs
```
