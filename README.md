# The Ivy Bee — Facebook Ads

50 ready-to-run Facebook ad variations for **The Ivy Bee**, a premium botanical
hair care range (Shampoo & Restore, Conditioner, and Hair Treatment) bottled in
recyclable amber glass.

- **Target audience:** Women aged 28-60
- **Goal:** Entice them to try a new premium product
- **Angles:** 10 campaign themes x 5 ads = 50 distinct ads
- **Each ad ships with its own designed graphic** (1080x1350, the 4:5 feed format).

## What's in here

| File / folder | What it is |
|---------------|------------|
| `data/ads.json` | The single source of truth: every ad's copy and metadata. |
| `creatives/ad-NN.png` | The finished ad image for each ad, ready to upload to Facebook. |
| `creatives/ad-NN.svg` | The same graphic in vector form (edit or scale without quality loss). |
| `facebook-ads.csv` | All 50 ads as a spreadsheet, easy to paste into Ads Manager. |
| `index.html` | A visual gallery rendering every creative next to its copy. |
| `scripts/creative.js` | Draws the branded ad graphic (bottles, emblem, botanicals, copy). |
| `scripts/build.js` | Regenerates the CSV, the creatives and the gallery from `ads.json`. |

Each ad includes the fields Facebook asks for:

- **Primary text** — the body copy that sits above the image in feed
- **Headline** — the bold line baked into the creative
- **Description** — the supporting line
- **Call to action** — the button (Shop Now / Learn More / Get Offer)

## Viewing the ads

- **On your phone:** browse `creatives/` on GitHub — it previews the `.png` files
  inline, no download needed.
- **Full gallery:** open `index.html` in any browser to see all 50 creatives
  laid out with their copy.

## Campaign themes

1. **Damage Repair & Restore** — rebuild strength, fix split ends, first-wash results
2. **Clean & Natural Ingredients** — sulphate / paraben / silicone-free, botanical
3. **Luxury Self-Care Ritual** — turn wash day into a treat
4. **Age Confidence (28-60)** — hair that changes with hormones, colour and time
5. **Social Proof & Reviews** — testimonial and "everyone's switching" angles
6. **Brand & Founder Story** — why The Ivy Bee exists
7. **New Launch & Intro Offer** — just launched, try the trio, first-order offer
8. **Sustainability & Eco** — recyclable amber glass, cruelty-free
9. **Scent & Sensory** — the fragrance and the experience
10. **Salon Quality & Value** — salon results at home, smart price

Each theme has its own colour treatment so the angles look visually distinct.

## Regenerating everything

```bash
npm install        # installs sharp (optional, for PNG export)
npm run build      # rebuilds creatives, facebook-ads.csv and index.html
```

Edit copy in `data/ads.json` and re-run the build; the CSV, graphics and gallery
all stay in sync. PNG export is optional — if `sharp` isn't installed the build
still produces the SVGs and gallery, just skips the PNGs.

## Notes for launch

- **The graphics are template creatives**, not retouched product photography.
  For your highest-performing ads, consider swapping in real lifestyle photos of
  the amber-glass trio; the copy and layout still apply.
- **Headlines** are kept short so they don't truncate.
- **Claims** are deliberately soft ("helps", "feels", "visibly"). Please review
  against your local advertising standards (e.g. the ASA in the UK) before going
  live, and avoid hard medical or guaranteed-results claims.
- **Audience setup:** Women, ages 28-60. Consider splitting into 28-42 and 43-60
  ad sets so you can match the age-specific angles in campaign #4.
