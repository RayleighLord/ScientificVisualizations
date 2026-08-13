# AGENTS.md

## Project purpose

This is a standalone Vite and TypeScript index for interactive scientific resources. It must
remain a static, backend-free site that deploys safely at a GitHub Pages repository subpath.

## Catalog invariants

- Keep visualization data in the typed catalog in `src/catalog.ts`.
- Preserve the approved ten-card order and canonical destinations recorded in the catalog.
- Each complete card is a semantic same-tab link to its corresponding visualization.
- Cards contain a representative image, title, short description, and action only. Do not add
  topic subtitles or equations.
- Maintain a formal academic tone suitable for university students.
- Keep the site light-only. Do not add theme persistence, dark variables, or a theme toggle.
- Preserve visible keyboard focus, reduced-motion support, and layouts down to 320 px.

## Architecture and assets

- Keep page construction and the About disclosure in `src/app.ts`.
- Keep visual styling and responsive behavior in `src/styles/main.css`.
- Preserve Vite's relative `base: "./"` so the build works beneath `/ScientificVisualizations/`.
- Card previews live in `public/previews/` as optimized 960 × 540 WebP files. Keep the
  visualization itself visually dominant and exclude menus, control panels, and interface chrome.
- The header and footer use the local RayleighLord profile mark at `public/rayleighlord-logo.png`.
- Add future applications through `src/catalog.ts`; the grid uses three desktop columns.

## Development and verification

- Use Node.js `>=22.12 <25`.
- Install reproducibly with `npm ci` and start locally with
  `npm run dev -- --host 127.0.0.1 --port 4173`.
- Run `npm test` for catalog invariants and `npm run build` for strict TypeScript plus production build.
- Run `npm run test:browser` for link, image, layout, disclosure, motion, overflow, and browser-error checks.
- Store temporary browser-review artifacts under `output/playwright/`.
