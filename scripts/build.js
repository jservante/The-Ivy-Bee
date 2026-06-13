#!/usr/bin/env node
/**
 * Build script for The Ivy Bee Facebook ad set.
 *
 * Reads data/ads.json (the single source of truth) and generates:
 *   - facebook-ads.csv     -> bulk-import friendly spreadsheet of all 50 ads
 *   - creatives/ad-NN.svg  -> one branded ad graphic per ad (1080x1350)
 *   - index.html           -> visual gallery rendering every creative + copy
 *
 * Run with: npm run build  (or: node scripts/build.js)
 */

const fs = require("fs");
const path = require("path");
const { creativeSVG } = require("./creative");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ads.json"), "utf8"));
const { brand, product, audience, ads } = data;

/* ---------- CSV ---------- */

function csvCell(value) {
  const s = String(value == null ? "" : value);
  return '"' + s.replace(/"/g, '""') + '"';
}

const csvHeader = [
  "Ad ID",
  "Campaign",
  "Angle",
  "Primary Text",
  "Headline",
  "Description",
  "Call To Action",
  "Audience",
  "Creative File",
];

const csvRows = ads.map((ad) =>
  [
    ad.id,
    ad.campaign,
    ad.angle,
    ad.primary,
    ad.headline,
    ad.description,
    ad.cta,
    audience,
    `creatives/ad-${String(ad.id).padStart(2, "0")}.svg`,
  ]
    .map(csvCell)
    .join(",")
);

const csv = [csvHeader.map(csvCell).join(","), ...csvRows].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(ROOT, "facebook-ads.csv"), csv, "utf8");

/* ---------- Creative SVG files ---------- */

const creativeDir = path.join(ROOT, "creatives");
fs.mkdirSync(creativeDir, { recursive: true });

const creatives = new Map();
for (const ad of ads) {
  const svg = creativeSVG(ad);
  creatives.set(ad.id, svg);
  const file = path.join(creativeDir, `ad-${String(ad.id).padStart(2, "0")}.svg`);
  fs.writeFileSync(file, svg, "utf8");
}

/* ---------- HTML gallery ---------- */

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Group ads by campaign, preserving first-seen order.
const campaigns = [];
const byCampaign = new Map();
for (const ad of ads) {
  if (!byCampaign.has(ad.campaign)) {
    byCampaign.set(ad.campaign, []);
    campaigns.push(ad.campaign);
  }
  byCampaign.get(ad.campaign).push(ad);
}

function adCard(ad) {
  return `        <article class="ad">
          <div class="ad__creative">${creatives.get(ad.id)}</div>
          <div class="ad__body">
            <span class="ad__id">Ad #${ad.id} &middot; ${esc(ad.angle)} &middot; ${esc(ad.cta)}</span>
            <p class="ad__label">Primary text (sits above the image in feed):</p>
            <p class="ad__primary">${esc(ad.primary)}</p>
          </div>
        </article>`;
}

const sections = campaigns
  .map((name) => {
    const cards = byCampaign.get(name).map(adCard).join("\n");
    return `      <section class="campaign">
        <h2 class="campaign__title">${esc(name)} <span>(${byCampaign.get(name).length} ads)</span></h2>
        <div class="grid">
${cards}
        </div>
      </section>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(brand)} — Facebook Ads (${ads.length})</title>
  <style>
    :root {
      --green: #1c4332;
      --green-soft: #2d5a45;
      --gold: #c19a3b;
      --gold-soft: #d9b45f;
      --cream: #f7f3ea;
      --ink: #2a2a26;
      --line: #e4ddcd;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", Helvetica, Arial, sans-serif;
      color: var(--ink);
      background: var(--cream);
      line-height: 1.5;
    }
    header.page { background: var(--green); color: #fff; padding: 48px 24px 40px; text-align: center; }
    header.page h1 { margin: 0 0 8px; font-size: 2.4rem; font-weight: 600; letter-spacing: 0.5px; }
    header.page h1 .bee { color: var(--gold-soft); }
    header.page p { margin: 4px auto; max-width: 680px; opacity: 0.9; }
    header.page .tags { margin-top: 16px; }
    header.page .tag { display: inline-block; border: 1px solid var(--gold-soft); color: var(--gold-soft); border-radius: 999px; padding: 4px 14px; margin: 4px; font-size: 0.85rem; }
    main { max-width: 1240px; margin: 0 auto; padding: 32px 20px 80px; }
    .campaign { margin-top: 44px; }
    .campaign__title { font-size: 1.35rem; color: var(--green); border-bottom: 2px solid var(--gold); padding-bottom: 8px; margin-bottom: 22px; }
    .campaign__title span { color: var(--gold); font-size: 0.9rem; font-weight: 400; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .ad { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 3px 14px rgba(28, 67, 50, 0.08); }
    .ad__creative { line-height: 0; background: #fff; }
    .ad__creative svg { width: 100%; height: auto; display: block; }
    .ad__body { padding: 16px 16px 18px; display: flex; flex-direction: column; gap: 6px; }
    .ad__id { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.6px; color: var(--gold); font-weight: 700; }
    .ad__label { margin: 6px 0 0; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; color: #9a9486; }
    .ad__primary { margin: 0; font-size: 0.92rem; }
    footer.page { text-align: center; padding: 30px; color: #8a8576; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header class="page">
    <h1>The Ivy <span class="bee">Bee</span></h1>
    <p>${esc(ads.length)} Facebook ad creatives &middot; ${esc(product)}</p>
    <div class="tags">
      <span class="tag">Target: ${esc(audience)}</span>
      <span class="tag">${esc(campaigns.length)} campaign angles</span>
      <span class="tag">Each image is 1080&times;1350 (4:5 feed)</span>
    </div>
  </header>
  <main>
${sections}
  </main>
  <footer class="page">
    Generated from <code>data/ads.json</code> &middot; The Ivy Bee — premium botanical hair care.
  </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf8");

console.log(`Built ${ads.length} ads across ${campaigns.length} campaigns.`);
console.log(` - facebook-ads.csv`);
console.log(` - creatives/ (${ads.length} SVG files)`);
console.log(` - index.html`);

/* ---------- Optional PNG export (for direct Facebook upload) ---------- */
// Facebook Ads Manager accepts PNG/JPG, not SVG. If "sharp" is installed
// (npm install sharp), we also export 1080x1350 PNGs. Otherwise we skip it.
(async () => {
  let sharp;
  try {
    sharp = require("sharp");
  } catch (e) {
    console.log(` - PNG export skipped (run "npm install sharp" to enable)`);
    return;
  }
  for (const ad of ads) {
    const name = `ad-${String(ad.id).padStart(2, "0")}`;
    await sharp(Buffer.from(creatives.get(ad.id)), { density: 96 })
      .resize(1080, 1350)
      .png()
      .toFile(path.join(creativeDir, `${name}.png`));
  }
  console.log(` - creatives/ (${ads.length} PNG files)`);
})();
