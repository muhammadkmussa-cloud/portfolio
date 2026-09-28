# Muhammad Mussa — Portfolio

Personal software developer portfolio, deployed at https://muhammadmussa.vercel.app.

## Site structure

- `index.html`: editorial homepage with selected work and clients.
- `work.html`, `about.html`, `contact.html`: project gallery, biography and enquiry pages.
- `services.html`: the full original service catalogue, organised into 16 sections.
- `somahub.html`, `khamis-computers.html`, `halaal-charitable-trust.html`: factual project overviews.
- `404.html`: missing-page experience.
- `styles.css`: baseline styles for retained service and contact content.
- `premium.css`: sand/navy/amber editorial design and responsive motion styles.
- `fidelity.css`: measured reference proportions, heavier display type, mosaic, asymmetric work layout and footer refinements.
- `motion.js`: page transitions, reveals, motion preferences, video visibility and accessible menu focus.
- `script.js`: mobile navigation, section highlighting, contact drafts, clipboard feedback and year.
- `assets/`: existing logo, favicon, social preview and photographs.
- `scripts/preview.py`: local server supporting Vercel-style clean URLs.
- `tests/`: dependency-free checks for site links and contact behavior.

No framework, package installation or build step is required. Python 3 runs the preview and structural checks; Node.js runs the interaction tests. Google Fonts supplies IBM Plex Sans and IBM Plex Mono, with system fallbacks.

## Local preview

```sh
python3 scripts/preview.py --port 8093
```

Open http://127.0.0.1:8093. The preview server binds only to localhost. It also resolves clean routes such as `/somahub` to their HTML files. Internal page links explicitly include `.html`, so VS Code Live Server on port 5500 and other basic static servers work too. On localhost, each page load gives CSS and JavaScript a fresh URL so navigating between pages fetches the current files. Production uses stable URLs with revalidation headers. With those servers, open `/work.html`, `/about.html`, and `/contact.html`; extensionless URLs require clean-URL support. Production canonical URLs remain extensionless.

## Checks

```sh
python3 tests/check_site.py
node --test tests/*.test.cjs
node --check script.js
```

Also verify the homepage and secondary pages in a browser at phone, tablet and desktop widths, including keyboard navigation and reduced-motion settings.

## Content and design

The interface uses warm sand, navy and amber with oversized editorial typography, original project artwork and two 12-second workflow films in `assets/films/`. Films are illustrated concepts, not recordings of the applications. The hero and About page use the approved portrait; the original navigation logo remains in place. See `docs/NEXT-STEPS.md` for remaining assets and project links. Motion includes a persistent pause control and reduced-motion alternatives. The project artwork is illustrative; it is not an application screenshot. Project overviews use only the descriptions already present in the original portfolio and do not claim performance metrics or unverified implementation details.

When real screenshots and approved project details become available, replace the illustrations and expand the overviews with implementation decisions and results. Do not publish private customer data in screenshots. Testimonials, portraits and résumé links have not been fabricated.

The original PNG social preview remains in use. Its HTML source is `assets/og-image.html`. When replacing an image, use a new filename or update its URL if a visitor may have an older copy cached. Site files use revalidation headers on Vercel.

## Contact behavior

The form validates name and message, then opens a prepared WhatsApp message or a `mailto:` draft. It does not send or store enquiries. Users review and send in the selected app. Clipboard copying includes success and failure feedback. Without JavaScript, the direct email link and navigation remain available, and the form is hidden.

## Deployment

Vercel serves the repository root as a static site. No build command is needed. `vercel.json` enables clean URLs and response headers; `404.html` supplies the error page. The sitemap includes the homepage, services and three project overviews.

Review and approve production deployment separately. No deployment is performed by the local preview or tests.
