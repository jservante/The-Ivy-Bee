# The Ivy Bee — Facebook Ads

50 ready-to-run Facebook ad variations for **The Ivy Bee**, a premium botanical
hair care range (Shampoo & Restore, Conditioner, and Hair Treatment) bottled in
recyclable amber glass.

- **Target audience:** Women aged 28–60
- **Goal:** Entice them to try a new premium product
- **Angles:** 10 campaign themes × 5 ads = 50 distinct ads

## What's in here

| File | What it is |
|------|------------|
| `data/ads.json` | The single source of truth — every ad's copy and metadata. |
| `facebook-ads.csv` | All 50 ads as a spreadsheet, easy to paste into Ads Manager or a sheet. |
| `index.html` | A visual gallery that previews all 50 ads in Facebook-style cards. |
| `scripts/build.js` | Regenerates the CSV and HTML from `ads.json`. |

Each ad includes the four fields Facebook asks for:

- **Primary text** — the main body copy
- **Headline** — the bold line under the image
- **Description** — the supporting line
- **Call to action** — the button (Shop Now / Learn More / Get Offer)

## Campaign themes

1. **Damage Repair & Restore** — rebuild strength, fix split ends, first-wash results
2. **Clean & Natural Ingredients** — sulphate/paraben/silicone-free, botanical
3. **Luxury Self-Care Ritual** — turn wash day into a treat
4. **Age Confidence (28–60)** — hair that changes with hormones, colour and time
5. **Social Proof & Reviews** — testimonial and "everyone's switching" angles
6. **Brand & Founder Story** — why The Ivy Bee exists
7. **New Launch & Intro Offer** — just launched, try the trio, first-order offer
8. **Sustainability & Eco** — recyclable amber glass, cruelty-free
9. **Scent & Sensory** — the fragrance and the experience
10. **Salon Quality & Value** — salon results at home, smart price

## Usage

```bash
npm run build      # regenerate facebook-ads.csv and index.html from data/ads.json
```

Open `index.html` in any browser to preview the ads. To tweak copy, edit
`data/ads.json` and re-run the build — the CSV and gallery stay in sync.

## Notes for launch

- **Pair each ad with imagery.** The gallery uses a placeholder; in Ads Manager,
  use the supplied product mockups (amber-glass trio, lifestyle shots).
- **Headlines** are kept short (~40 characters) to avoid truncation.
- **Claims** are deliberately soft ("helps", "feels", "visibly") — review against
  your local advertising standards before going live, and avoid hard medical or
  guaranteed-results claims.
- **Audience setup:** Women, ages 28–60. Consider splitting into 28–42 and
  43–60 ad sets so you can match the age-specific angles in campaign #4.
