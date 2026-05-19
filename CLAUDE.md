# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page Italian wedding save-the-date for **Giuseppe & Letizia** (23 May 2026, Tropea/Briatico, Calabria). Deployed on Vercel as project `peppelety`.

## Architecture

The entire site is a single self-contained file: **`index.html`** (~1200 lines). There is no build step, no package manager, no framework, no JS bundle — just HTML, an inline `<style>` block, and an inline `<script>` block at the bottom. To preview locally, open `index.html` directly in a browser or serve the directory with any static server (e.g. `python -m http.server`).

Page layout, top-to-bottom (each section is separated by an SVG `.wave` divider whose `fill` matches the next section's background):

1. `#hero` — full-viewport photo + names + date
2. `#countdown` — live JS countdown to `2026-05-23T11:00:00`
3. `#festeggiamenti` — ceremony + reception details, with the jellyfish animation overlay
4. `#regalo` — bank/IBAN block with copy-to-clipboard buttons
5. `#dedica` — guestbook form (FormSubmit, AJAX-submitted)
6. `#indirizzi` — bride/groom postal addresses
7. `footer`

### Things that span multiple parts of the file

- **Design tokens** are CSS custom properties on `:root` (`--cream`, `--sand`, `--sky`, `--blue`, `--navy`, `--gold`, `--text`, `--muted`). Use them — don't hardcode wedding colors.
- **Typography**: `Caveat` (cursive, display/headings) + `Nunito` (body), loaded from Google Fonts in `<head>`.
- **Wave dividers** between sections rely on the wrapper `<div class="wave" style="background:<COLOR-OF-PREVIOUS-SECTION>">` containing an SVG whose `<path fill="<COLOR-OF-NEXT-SECTION>">`. If you change a section background, update both the previous wave's wrapper background AND the next wave's path fill — otherwise you get a visible seam.
- **Jellyfish system** (Festeggiamenti section): five inline `<svg class="jelly">` elements, each with its own `--bp` (bell-pulse duration) and `--bpd` (delay) custom props. The IIFE at the bottom of `<script>` runs a `requestAnimationFrame` loop that bounces them inside `#festeggiamenti`'s box, plus dynamically appends 18 `<span class="bubble">` elements. Bubbles also rely on `--bd`, `--bdelay`, `--bx` custom props set inline. Keep `#festeggiamenti { position: relative; overflow: hidden; }` so jellies stay clipped to the section.
- **`.reveal` / `.in`**: `IntersectionObserver` adds the `in` class when a section scrolls into view (threshold 0.08). Any new section that should fade in needs `class="… reveal"`.

### Form submission

The dedica form posts to FormSubmit at:

```
https://formsubmit.co/giuseppe.battaglia231@outlook.it,letizia.prestiak17@gmail.com
```

Submission is intercepted by the inline script and sent via `fetch` with `Accept: application/json`; on success the form is hidden and `#dedica-ok` is shown. **Never edit these recipient emails or remove the hidden FormSubmit fields (`_subject`, `_captcha`, `_template`, `_honey`) without explicit confirmation from the user** — they're load-bearing for delivery and spam protection.

### External assets

Hero photo and reception photo are loaded from `https://skyblue-hippopotamus-167439.hostingersite.com/` (Hostinger). The ceremony photo is loaded from `turismocalabria.net`. There are no local image assets in the repo.

## Deployment

Vercel project is already linked (`.vercel/project.json` is gitignored but present locally — `projectName: peppelety`). Static deploy, no build command needed.

- Preview deploy: `/vercel:deploy`
- Production deploy: `/vercel:deploy prod`

The Vercel CLI is **not** installed globally on this machine; if a step needs `vercel env pull` / `vercel logs` / etc., ask the user to install it (`npm i -g vercel`) or use the `/vercel:*` skills which work via the platform integration.

## Editing conventions

- All copy is in **Italian** — match the existing tone (warm, informal, second-person plural "voi"). Don't translate to English.
- Prefer extending existing CSS classes and design tokens over introducing new ones; the file is intentionally one self-contained document.
- The mobile-first breakpoints in use are `@media (min-width: 640px)` and `@media (min-width: 768px)` — stick to those.
