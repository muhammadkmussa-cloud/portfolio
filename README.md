# Muhammad Mussa — Portfolio

Static personal portfolio for **Muhammad Mussa**, a software developer based in Kilifi, Kenya.

## Structure

```
portfolio/
├── index.html          # the whole page
├── styles.css          # design system + layout
├── script.js           # mobile nav + year
├── vercel.json         # clean URLs, security + cache headers
├── robots.txt
├── sitemap.xml
└── assets/
    ├── logo.png            # original logo (transparent PNG)
    ├── logo-512.png        # logo used in the header
    ├── favicon.png         # 64x64 favicon
    ├── apple-touch-icon.png
    ├── og-image.html       # source for the social share image
    ├── og-image.png        # 1200x630 social share image
    └── img/                # service photographs (Pexels, free commercial use)
```

No build step, no dependencies — pure HTML/CSS/JS.

## Images
Service images are stored in `assets/img/` and sourced from **Pexels** (https://www.pexels.com), which are free to use for commercial projects without attribution. They are displayed in greyscale and colourise on hover to match the black/white/blue palette. Replace any image by overwriting the file with the same name, or update the `src` in `index.html`.

## Design
- Plain palette: black, white and blue only. No gradients, no glow, no rounded corners.
- Sharp rectangular buttons and hairline borders.
- IBM Plex Sans + IBM Plex Mono.

## Before you deploy — edit these

1. **Domain placeholders.** Replace `https://muhammadmussa.vercel.app` in `index.html`, `robots.txt` and `sitemap.xml` with your real Vercel URL.
2. **Project descriptions** in “Selected work” — confirm wording for Halaal Charitable Trust, Reaching Out Initiative and Charity People is accurate.

## Deploy to Vercel

### CLI
```bash
cd portfolio
npx vercel login
npx vercel --prod
```
No framework, no build command, output directory = `.`.

### Dashboard
1. Push this folder to a GitHub repo.
2. vercel.com → Add New → Project → Import the repo.
3. Framework preset: **Other**. Build command: none. Output directory: `portfolio` (or root).

## Local preview
```bash
cd portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

## Contact
- WhatsApp / phone: 0708 095 949 (+254 708 095 949)
- Email: muhammadkmussa@gmail.com
- GitHub: https://github.com/muhammadkmussa-cloud
