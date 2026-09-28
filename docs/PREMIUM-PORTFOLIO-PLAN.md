# Muhammad Mussa — Mees Verberne design adaptation

Prepared 28 September 2026. Planning only; no website implementation or deployment included.

## Objective

Recreate the reference's visual system and interaction character as closely as practical, using Muhammad's name, existing logo, work, contact details, and truthful professional background. The target is the sand/navy/amber editorial design, not the current white/cobalt design with a few new animations.

Reference pages inspected: [Index](https://meesverberne.com/), [Work](https://meesverberne.com/work/), [About](https://meesverberne.com/about/), [Contact](https://meesverberne.com/contact/), and [Mikki Sindhunata project](https://meesverberne.com/project/mikki-sindhunata/).

## Evidence and fidelity limits

Screenshots, rendered page structure, and computed styles were inspected. Desktop homepage/project layouts were checked at 1440px wide; homepage and expanded navigation were checked at 390px. Other pages were inspected at the browser's narrower default viewport. This is not yet a complete mobile audit of every page.

Verified:
- Background `#D7C6AD`; text `#22264B`; mobile menu link accent `#F7A026`.
- Headings use Doner Display; navigation/body samples use Doner Text. The desktop homepage title sample was 229.307px, weight 900, line-height 178.859px, approximately 0.78em.
- Large uppercase headings; two-line name; narrow role marquees with repeated separators; low-contrast rectangular background mosaic.
- Logo left, centered desktop navigation, socials right; compact floating pill navigation after scrolling.
- Two-column work gallery with large media, descriptor strips, numbered captions, italic emphasis, and attribution details.
- Separate project pages with oversized title, ruled metadata strip, large media, explanation, next-project link, and shared footer.
- Mobile hero uses a strongly cropped image beside text; full-screen navy menu with oversized amber links, sand active link, and amber close control.
- DOM contains pageCanvas, backgroundCanvas, and loadCanvas layers. This establishes canvas involvement, not the specific rendering engine or exact animation algorithm.
- Sample navigation colour transitions declare 0.3 seconds ease-out.

Not fully verified: exact initial-loader sequence, route-wipe geometry, easing curves for canvas effects, hover distortion, pointer tracking, complete scroll timelines, and mobile behaviour of every secondary page. In-session navigation clicks did not reliably complete, although direct page loads worked. Do not describe proposed effects below as measured replicas. A focused motion capture pass must settle these before final fidelity approval.

## Design specification

### Palette and surface

Use the measured sand, navy, and amber values throughout. Build the subtle rectangular mosaic from a small number of sand shades; keep text and images visually dominant. Use navy surfaces for the mobile menu and selected contrasting sections. Keep borders fine, corners mostly square, and controls compact. Rounded pills are for navigation and selected actions, not every content block.

Keep the existing logo asset unchanged. Give it sufficient clear space and contrast on sand; do not replace it with the reference's bird icon. Carry its geometry into a small decorative background motif if that works visually.

### Typography

Exact font matching requires appropriately licensed Doner Display and Doner Text webfonts. Record this as an asset dependency, not permission to copy hosted font files. Until those files are available, use a clearly labelled provisional heavy display face and existing body font; typography remains an unfinished fidelity item.

Set MUHAMMAD / MUSSA in two lines. Fit each line independently to the composition instead of applying Mees's font size unchanged: Muhammad has eight letters and Mussa five. Start with 0.8–0.9em line-height, then tune using the actual chosen font. Use live text and retain one accessible heading; do not rasterize the name. Large section words WORK, ABOUT, and CONNECT repeat the same display language.

Use compact labels, regular readable body text, and occasional italic emphasis in project names. A single original handwritten “Software Engineer” accent can echo the reference's contrast without reusing its signature. Match the hierarchy while keeping body text comfortably readable on phones.

### Layout

Replace the current 1160px content cap with a near-full-width editorial grid. Starting desktop gutters: approximately 2.5–4vw; phone gutters: 16–20px. These are implementation starting points, not extracted reference values. Use a 12-column desktop grid, two project columns, and intentionally uneven placements on the homepage. Avoid uniform feature-card rows and unnecessary enclosing panels.

## Page and content mapping

| Page | Proposed composition | Muhammad's content |
|---|---|---|
| Index `/` | Logo/nav/socials; huge name; role marquee; central visual with offset introduction; oversized WORK; selected projects; clients; CONNECT footer | Muhammad Mussa, Software Engineer, Kilifi; three existing featured projects; confirmed clients |
| Work `/work` | Huge WORK; two-column image gallery; compact project archive; shared footer | SomaHub, Khamis Computers, Halaal Charitable Trust first; remaining existing projects in archive |
| About `/about` | Oversized ABOUT / MUHAMMAD composition; image/copy overlap; bio; numbered services; tools/process | Existing Computer Science background and bio; four expertise groups; existing process |
| Contact `/contact` | Huge CONTACT; role strip; short invitation; contact column; underlined fields; amber action | Existing email, phone, Kilifi location, WhatsApp/email draft actions |
| Existing project URLs | Giant project name; descriptor strip; factual metadata; large media; concise case study; next project | Preserve `/somahub`, `/khamis-computers`, `/halaal-charitable-trust` |
| Services `/services` | Shared shell and typography; numbered service rows | Preserve all 16 existing services, linked from About and footer |
| 404 | Shared visual identity; concise message; clear return links | Existing missing-page behaviour |

Homepage sequence:
1. Header: original logo, INDEX / WORK / ABOUT / CONTACT, existing verified social link(s).
2. MUHAMMAD / MUSSA filling most of the opening width.
3. Marquee: SOFTWARE ENGINEER / WEB APPLICATIONS / BUSINESS SYSTEMS / AUTOMATION.
4. Visual composition with original hero artwork, “Software Engineer” accent, short introductory copy, and Kilifi location. Use a city label rather than inventing exact coordinates.
5. WORK heading, followed by SomaHub and Khamis Computers in offset image-led placements.
6. Brief editorial statement: “I build software around the way people work.”
7. Halaal Charitable Trust, followed by All projects. Three strong projects are enough; do not create filler to imitate the reference's project count.
8. Typographic client section using existing client names. Use client logos only when actual assets are available.
9. Shared role marquee and monumental CONNECT footer with email, phone, location, GitHub, and copyright.

Move the large expertise block, process, and FAQ out of the homepage's main visual sequence. Keep this information on About, Services, and Contact as appropriate. Preserve old `/#work`, `/#about`, `/#expertise`, and `/#contact` destinations with meaningful anchors or explicit navigation compatibility.

### Project detail template

Title → project descriptors → metadata row → dominant screenshot/demo → problem and users → Muhammad's contribution → two or three additional views → implementation decisions and supported outcomes → next project → CONNECT.

Use only known roles, technology, dates, and results. Unknown years can be omitted. Do not inherit the reference's award sections or experience claims. A private project gets an honest availability label rather than an invented live-demo button.

## Assets required

The repository has the logo, service-category photographs, social images, and illustrative project art. No actual application screenshots or personal portrait were identified in the asset inventory.

Priority assets:
1. A distinctive original hero visual. Preferred final option: a supplied portrait cutout. Provisional option: an original dimensional composition derived from Muhammad's existing logo, placed in the reference's image position. This choice changes the art direction and must be evaluated visually; it is not an exact substitute for the bird.
2. Three or more clean screenshots per featured project: overview, important workflow, and responsive/detail view. Capture available public interfaces; private applications need accessible source material with sensitive content removed.
3. Optional short, muted project recordings with static poster fallbacks.
4. Licensed font files and optional authentic client logos.

Prepare consistently cropped thumbnails and larger case-study images. Do not present the existing decorative illustrations as product screenshots. Real media and correct font metrics are the largest determinants of the final resemblance.

## Motion implementation plan

All timings below are proposed tuning ranges except the observed 300ms navigation colour change.

| Interaction | Proposed implementation | Initial tuning / fallback |
|---|---|---|
| First arrival | Brief sand mosaic reveal, then title lines and supporting elements enter in order | 600–900ms overall; never gate content indefinitely on media |
| Headline entrance | Clip-mask each line with upward transform; small stagger between lines | 550–800ms, 50–80ms stagger; static readable heading without JS |
| Page navigation | Shared sand/navy transition layer, outgoing page covered, incoming page revealed | 450–700ms total target; exact shape awaits motion capture; normal links always work |
| Background | Low-contrast tile field with restrained changes; preserve consistent palette between pages | One efficient decorative layer; static mosaic for reduced motion |
| Role strip | Seamless horizontal movement with small separators | 25–40s per cycle starting point; pause control and static reduced-motion version |
| Scrolled navigation | Header links settle into compact centered navy pill | 250–350ms; measured colour change 300ms ease-out |
| Section headings | Staggered line/word reveal on first viewport entry | 500–700ms; avoid repeated animation during ordinary scrolling |
| Project media hover | Subtle scale within clipped frame and clear title/arrow feedback | 350–500ms, approximately 1.025 scale; proposed until reference hover is verified |
| Project scroll | Gentle media offset or reveal only where visually useful | Small bounded travel; remove on touch/reduced motion if distracting |
| Mobile menu | Full-screen navy overlay, large amber links, active sand state, square close control | 400–550ms opening; keyboard focus contained and restored on close |
| Contact fields | Underline/label focus feedback; existing validation and draft feedback retained | 150–250ms; never show “sent” when only a draft opened |
| Next project/footer | Oversized heading entrance and next-project preview | Same motion vocabulary as gallery; no separate animation style |

Avoid using a loader to disguise slow image loading. Stop offscreen/background animation when the tab is hidden. Keep links and main content usable if animation initialization fails. Do not recreate all page text as canvas output: semantic HTML remains the content layer.

## Implementation order

1. **Reference and asset pass:** capture initial entry, page-to-page transitions, card hover, scroll, mobile menu, and footer at matching sizes. Record observed behaviour separately from chosen implementation values. Finalize fonts and hero/project media inventory.
2. **Static visual foundation:** implement palette, fonts, mosaic, header/footer, and desktop/phone hero. Match composition before introducing elaborate motion. Compare side by side at 1440, 1024, 768, and 390px.
3. **Page architecture:** create Work, About, and Contact; restyle existing project, services, and 404 pages; update navigation, titles, canonical URLs, sitemap, and legacy anchor behaviour.
4. **Project presentation:** add real media, gallery captions, metadata rows, case-study sections, next-project links, and truthful archive entries.
5. **Motion:** add a shared lifecycle for entrances, page changes, background, and menus. Retain ordinary navigation/history/focus behaviour. Use an animation library only if the verified motion warrants it; no framework migration is required by this static site.
6. **Responsive and accessible finish:** tune each name line, crop artwork per breakpoint, stack gallery/contact columns, ensure 44px interaction targets, readable body type, keyboard states, menu escape handling, and reduced-motion alternatives.
7. **Verification:** visual comparisons, navigation/contact regression checks, direct URL loads, back/forward behaviour, slow-media fallback, touch behaviour, no-JS access, and performance measurement. Review the finished local site before any production publication.

Expected files: substantial updates to `index.html`, `styles.css`, and `script.js`; new `work.html`, `about.html`, `contact.html`; revisions to three existing project pages, `services.html`, and `404.html`; new original/approved media; updated sitemap, README, and page/link checks. Keep existing contact-draft tests and add meaningful navigation/menu checks when implementing.

## Completion criteria

- At a glance, the site has the reference's typography scale, sand/navy/amber identity, mosaic texture, editorial spacing, and media-first work presentation.
- Muhammad's logo, name, verified work, and contact information are correct throughout.
- All routes and old useful destinations resolve; reload and browser history behave normally.
- Phone layout is deliberately composed and has no accidental horizontal overflow at 320–430px.
- Motion is consistent and validated against reference recordings; unknown effects are not labelled exact replicas.
- Content remains readable with reduced motion or failed JavaScript. Keyboard focus survives page and menu changes.
- No layout shifts from unsized media; measure performance with a target of LCP ≤2.5s, CLS ≤0.1, and responsive interactions. These are targets, not claimed results.
- Final review explicitly identifies any remaining differences caused by unavailable font, portrait, media, or unverified effects.

## Second reference measurement pass

Inspected the reference's rendered layout and stylesheet rules. Updated the homepage hero placement, paired first-project media, navy/amber clients section, split About title, compact Contact columns and staggered footer composition. Headline clipping now uses the observed 450ms entrance timing; project labels use delayed vertical fades. The first SomaHub panel is original illustrative artwork, paired with the labelled workflow concept video.

Verified desktop and 390px mobile compositions, static site checks for all nine pages, contact behavior tests, and JavaScript syntax. Fixed paused-motion headline visibility. Doner/Brittany typography, personal portrait, and the reference's custom canvas behavior remain differences; this pass does not establish pixel or animation parity.

## Background and interactive pixels

The fixed mosaic now uses 40px square cells (28px on phones), with its row count adapting to the viewport. `interactions.js` compresses the existing Work, Clients, About-name and Connect groups into a contiguous heading before they enter, then interpolates their horizontal positions with scrolling. Reverse scrolling reverses the separation. Font loading and viewport changes recalculate the compact positions.

Photos and video previews have pointer-transparent canvas overlays. Nearby blocks sample the underlying media and displace outward from the pointer; leaving restores the original. The effect does not intercept project links or native video controls. Touch-only devices, hidden tabs, reduced-motion settings and the pause control disable the pixel effect. Static images stop requesting frames once the pointer effect settles. These are original implementations of the requested interactions, not the reference's proprietary canvas code.

Browser checks: desktop 40px tiles, compact/intermediate/expanded heading positions, visible portrait pixel response, pause clearing overlays, mobile 28px tiles without horizontal overflow, and no observed browser console errors.

## Textured hover and inset Clients message

A further visual comparison showed that the reference retains image texture within its displaced squares. Replaced single-pixel colour sampling with full-resolution tile samples, pointer-movement impulses, per-tile easing and a decaying trail. Canvas rendering scales up to 2x device pixel density and stops after the disturbance settles. No beige fill is painted over the image. Verified visible displacement and automatic restoration in the browser with no console errors.

Added an original gratitude message between CLI and ENTS, framed with parentheses. Its reveal begins at 62% of the heading separation and completes at 92%; the desktop message is centred in the actual opening between the transformed groups. Phones put it below the heading. Verified mobile final opacity, clipping and horizontal overflow. Paused/reduced motion reveals the message without animation.
