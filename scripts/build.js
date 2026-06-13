#!/usr/bin/env node
/**
 * Build script for The Ivy Bee Facebook ad set.
 *
 * Reads data/ads.json (the single source of truth) and generates:
 *   - facebook-ads.csv  -> bulk-import friendly spreadsheet of all 50 ads
 *   - index.html        -> visual gallery to preview every ad
 *
 * Run with: npm run build  (or: node scripts/build.js)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ads.json"), "utf8"));
const { brand, product, audience, ads } = data;

/* ---------- CSV ---------- */

// Escape a value for CSV (wrap in quotes, double any internal quotes).
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
  ]
    .map(csvCell)
    .join(",")
);

const csv = [csvHeader.map(csvCell).join(","), ...csvRows].join("\r\n") + "\r\n";
fs.writeFileSync(path.join(ROOT, "facebook-ads.csv"), csv, "utf8");

/* ---------- HTML gallery ---------- */

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Group ads by campaign, preserving order of first appearance.
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
          <div class="ad__img" aria-hidden="true">
            <span class="ad__logo">The Ivy Bee</span>
          </div>
          <div class="ad__body">
            <span class="ad__id">Ad #${ad.id} · ${esc(ad.angle)}</span>
            <p class="ad__primary">${esc(ad.primary)}</p>
            <div class="ad__meta">
              <span class="ad__brandline">theivybee.com</span>
              <h3 class="ad__headline">${esc(ad.headline)}</h3>
              <p class="ad__desc">${esc(ad.description)}</p>
            </div>
            <button class="ad__cta" type="button">${esc(ad.cta)}</button>
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
    header.page {
      background: var(--green);
      color: #fff;
      padding: 48px 24px 40px;
      text-align: center;
    }
    header.page h1 {
      margin: 0 0 8px;
      font-size: 2.4rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    header.page h1 .bee { color: var(--gold-soft); }
    header.page p { margin: 4px auto; max-width: 640px; opacity: 0.9; }
    header.page .tags { margin-top: 16px; }
    header.page .tag {
      display: inline-block;
      border: 1px solid var(--gold-soft);
      color: var(--gold-soft);
      border-radius: 999px;
      padding: 4px 14px;
      margin: 4px;
      font-size: 0.85rem;
    }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 20px 80px; }
    .campaign { margin-top: 40px; }
    .campaign__title {
      font-size: 1.35rem;
      color: var(--green);
      border-bottom: 2px solid var(--gold);
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .campaign__title span { color: var(--gold); font-size: 0.9rem; font-weight: 400; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px;
    }
    .ad {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 10px rgba(28, 67, 50, 0.06);
    }
    .ad__img {
      height: 150px;
      background: linear-gradient(135deg, var(--cream), #efe7d4);
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid var(--line);
    }
    .ad__logo {
      font-size: 1.4rem;
      color: var(--green);
      letter-spacing: 1px;
      font-weight: 600;
    }
    .ad__logo::before {
      content: "✺";
      color: var(--gold);
      display: block;
      font-size: 1.6rem;
      text-align: center;
      margin-bottom: 2px;
    }
    .ad__body { padding: 16px 16px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
    .ad__id { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.6px; color: var(--gold); font-weight: 700; }
    .ad__primary { margin: 0; font-size: 0.92rem; }
    .ad__meta { background: var(--cream); border-radius: 8px; padding: 12px; margin-top: auto; }
    .ad__brandline { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.8px; color: #8a8576; }
    .ad__headline { margin: 4px 0 2px; font-size: 1rem; color: var(--green); }
    .ad__desc { margin: 0; font-size: 0.85rem; color: #6f6a5d; }
    .ad__cta {
      align-self: flex-start;
      background: var(--green);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 9px 18px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }
    .ad__cta:hover { background: var(--green-soft); }
    footer.page { text-align: center; padding: 30px; color: #8a8576; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header class="page">
    <h1>The Ivy <span class="bee">Bee</span></h1>
    <p>${esc(ads.length)} Facebook ad variations · ${esc(product)}</p>
    <div class="tags">
      <span class="tag">Target: ${esc(audience)}</span>
      <span class="tag">${esc(campaigns.length)} campaign angles</span>
      <span class="tag">Preview only — pair with product imagery</span>
    </div>
  </header>
  <main>
${sections}
  </main>
  <footer class="page">
    Generated from <code>data/ads.json</code> · The Ivy Bee — premium botanical hair care.
  </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf8");

console.log(`Built ${ads.length} ads across ${campaigns.length} campaigns.`);
console.log(" - facebook-ads.csv");
console.log(" - index.html");
