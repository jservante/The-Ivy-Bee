/**
 * Generates a branded Facebook ad creative for The Ivy Bee as an SVG string.
 *
 * Canvas is 1080 x 1350 (Facebook / Instagram 4:5 feed format). Each creative
 * draws the amber-glass bottle trio, the bee + ivy emblem, botanical sprigs,
 * and lays the ad's headline, description and CTA into a branded colour band.
 * The colour treatment changes per campaign so the 10 angles look distinct.
 */

const W = 1080;
const H = 1350;

// One colour treatment per campaign.
const THEMES = {
  "Damage Repair & Restore": { bg: "#f4ede0", bg2: "#e7d8bd", band: "#1c4332", bandText: "#ffffff", sub: "#d9c7a0", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#c9b485" },
  "Clean & Natural Ingredients": { bg: "#e8efe2", bg2: "#d3e0c8", band: "#2d5a45", bandText: "#ffffff", sub: "#cfe0c5", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#a7c197" },
  "Luxury Self-Care Ritual": { bg: "#1c4332", bg2: "#143528", band: "#10271d", bandText: "#f7f3ea", sub: "#d9b45f", accent: "#e0c074", cta: "#e0c074", ctaText: "#10271d", leaf: "#2f5a45" },
  "Age Confidence (28-60)": { bg: "#f1e7d6", bg2: "#e6d3b4", band: "#1c4332", bandText: "#ffffff", sub: "#d9c7a0", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#cdb888" },
  "Social Proof & Reviews": { bg: "#f5eee1", bg2: "#ecdcc0", band: "#c19a3b", bandText: "#1c2f23", sub: "#3f5d4c", accent: "#1c4332", cta: "#1c4332", ctaText: "#ffffff", leaf: "#cbb583" },
  "Brand & Founder Story": { bg: "#234a39", bg2: "#19372a", band: "#10271d", bandText: "#f7f3ea", sub: "#d9b45f", accent: "#e0c074", cta: "#e0c074", ctaText: "#10271d", leaf: "#356049" },
  "New Launch & Intro Offer": { bg: "#f6efe0", bg2: "#eddfbf", band: "#1c4332", bandText: "#ffffff", sub: "#d9c7a0", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#d2c094" },
  "Sustainability & Eco": { bg: "#e4ecde", bg2: "#cfddc4", band: "#2d5a45", bandText: "#ffffff", sub: "#cfe0c5", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#a3bd92" },
  "Scent & Sensory": { bg: "#f3e7dc", bg2: "#ecd6c4", band: "#1c4332", bandText: "#ffffff", sub: "#e7c9b0", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#d6c0a6" },
  "Salon Quality & Value": { bg: "#f4ede0", bg2: "#e7d8bd", band: "#1c4332", bandText: "#ffffff", sub: "#d9c7a0", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#1c4332", leaf: "#c9b485" },
};

const DEFAULT_THEME = THEMES["Damage Repair & Restore"];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Wrap text to a max number of characters per line (word-aware).
function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + " " + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// A single ivy-style leaf.
function leaf(x, y, scale, rot, fill, opacity) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" opacity="${opacity}">
    <path d="M0 0 C 22 -14 40 -10 52 -34 C 30 -30 22 -42 0 -40 C -22 -42 -30 -30 -52 -34 C -40 -10 -22 -14 0 0 Z" fill="${fill}"/>
    <path d="M0 0 L0 -38" stroke="${fill}" stroke-width="2" opacity="0.5" transform="scale(1.1)"/>
  </g>`;
}

// The bee + ivy emblem inside a ring (echoes the brand logo).
function emblem(cx, cy, r, ring, bee) {
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring}" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="none" stroke="${ring}" stroke-width="1"/>
    <g transform="translate(${cx} ${cy})">
      <ellipse cx="-13" cy="-6" rx="15" ry="9" fill="${bee}" opacity="0.45" transform="rotate(-28 -13 -6)"/>
      <ellipse cx="13" cy="-6" rx="15" ry="9" fill="${bee}" opacity="0.45" transform="rotate(28 13 -6)"/>
      <ellipse cx="0" cy="3" rx="9" ry="16" fill="${bee}"/>
      <line x1="-9" y1="-1" x2="9" y2="-1" stroke="${ring}" stroke-width="1.4" opacity="0.6"/>
      <line x1="-8" y1="6" x2="8" y2="6" stroke="${ring}" stroke-width="1.4" opacity="0.6"/>
      <line x1="-3" y1="-15" x2="-7" y2="-23" stroke="${bee}" stroke-width="1.6"/>
      <line x1="3" y1="-15" x2="7" y2="-23" stroke="${bee}" stroke-width="1.6"/>
    </g>
  </g>`;
}

// A single amber pump bottle with a cream label.
function bottle(cx, topY, label) {
  const bw = 150;
  const by = 850; // bottom of bottle
  const left = cx - bw / 2;
  const neckW = 34;
  const capW = 56;
  const labelTop = by - 196;
  const labelH = 150;
  return `<g>
    <!-- pump -->
    <rect x="${cx - 9}" y="${topY - 96}" width="18" height="60" fill="#b9bdbf"/>
    <rect x="${cx - capW / 2}" y="${topY - 40}" width="${capW}" height="46" rx="6" fill="#c7cbcd"/>
    <rect x="${cx - capW / 2}" y="${topY - 40}" width="${capW}" height="46" rx="6" fill="url(#metal)"/>
    <rect x="${cx + 4}" y="${topY - 92}" width="58" height="16" rx="6" fill="#b9bdbf"/>
    <rect x="${cx + 52}" y="${topY - 86}" width="12" height="22" rx="4" fill="#a9adaf"/>
    <!-- neck -->
    <rect x="${cx - neckW / 2}" y="${topY - 12}" width="${neckW}" height="22" fill="#9c5d22" opacity="0.85"/>
    <!-- body -->
    <rect x="${left}" y="${topY}" width="${bw}" height="${by - topY}" rx="20" fill="url(#amber)"/>
    <rect x="${left + 10}" y="${topY + 12}" width="26" height="${by - topY - 30}" rx="13" fill="#ffffff" opacity="0.18"/>
    <!-- label -->
    <rect x="${cx - 60}" y="${labelTop}" width="120" height="${labelH}" rx="8" fill="#f3ecdb"/>
    <text x="${cx}" y="${labelTop + 30}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#c19a3b">&#10042;</text>
    <text x="${cx}" y="${labelTop + 62}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#1c4332">The Ivy Bee</text>
    <line x1="${cx - 34}" y1="${labelTop + 76}" x2="${cx + 34}" y2="${labelTop + 76}" stroke="#c19a3b" stroke-width="1"/>
    <text x="${cx}" y="${labelTop + 98}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="2" fill="#6f6a5d">${esc(label)}</text>
    <text x="${cx}" y="${labelTop + 122}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8.5" letter-spacing="1.5" fill="#9a9486">BOTANICAL HAIR CARE</text>
  </g>`;
}

function creativeSVG(ad) {
  const t = THEMES[ad.campaign] || DEFAULT_THEME;

  // Bottom band copy.
  const headLines = wrap(ad.headline, 22);
  const headFont = headLines.length >= 3 ? 50 : 60;
  const headLH = headFont + 8;
  const descLines = wrap(ad.description, 40);

  const bandTop = 905;
  const bandCenterX = W / 2;
  // Lay out website / divider / headline / description / cta within the band.
  const webY = bandTop + 66;
  const dividerY = webY + 22;
  const headStart = webY + 84;
  const headTspans = headLines
    .map((ln, i) => `<tspan x="${bandCenterX}" dy="${i === 0 ? 0 : headLH}">${esc(ln)}</tspan>`)
    .join("");
  const headBlockBottom = headStart + (headLines.length - 1) * headLH;
  const descY = headBlockBottom + 54;
  const descTspans = descLines
    .map((ln, i) => `<tspan x="${bandCenterX}" dy="${i === 0 ? 0 : 30}">${esc(ln)}</tspan>`)
    .join("");
  const ctaY = descY + (descLines.length - 1) * 30 + 42;
  const ctaW = Math.max(220, ad.cta.length * 18 + 70);
  const ctaH = 64;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(ad.headline)}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bg}"/>
      <stop offset="1" stop-color="${t.bg2}"/>
    </linearGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cf923f"/>
      <stop offset="0.5" stop-color="#a8631f"/>
      <stop offset="1" stop-color="#854d18"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#d8dcde"/>
      <stop offset="0.5" stop-color="#aeb2b4"/>
      <stop offset="1" stop-color="#cfd3d5"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <ellipse cx="${W / 2}" cy="470" rx="520" ry="430" fill="url(#glow)"/>

  <!-- botanical sprigs -->
  ${leaf(120, 250, 1.7, -35, t.leaf, 0.7)}
  ${leaf(170, 320, 1.3, 20, t.leaf, 0.55)}
  ${leaf(965, 300, 1.7, 145, t.leaf, 0.7)}
  ${leaf(915, 360, 1.3, 200, t.leaf, 0.55)}
  ${leaf(150, 800, 1.5, -120, t.leaf, 0.5)}
  ${leaf(940, 800, 1.5, 120, t.leaf, 0.5)}

  <!-- emblem + wordmark -->
  ${emblem(W / 2, 175, 70, t.accent, t.accent)}
  <text x="${W / 2}" y="305" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="${t.band === "#10271d" ? "#f7f3ea" : "#1c4332"}">The Ivy Bee</text>
  <text x="${W / 2}" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="${t.accent}">PREMIUM BOTANICAL HAIR CARE</text>

  <!-- shelf shadow -->
  <ellipse cx="${W / 2}" cy="858" rx="320" ry="26" fill="#000000" opacity="0.10"/>

  <!-- bottle trio: shampoo (tall), conditioner, treatment -->
  ${bottle(388, 508, "SHAMPOO")}
  ${bottle(692, 508, "TREATMENT")}
  ${bottle(540, 468, "CONDITIONER")}

  <!-- copy band -->
  <rect x="0" y="${bandTop}" width="${W}" height="${H - bandTop}" fill="${t.band}"/>
  <text x="${bandCenterX}" y="${webY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="4" fill="${t.sub}">THEIVYBEE.COM</text>
  <line x1="${bandCenterX - 34}" y1="${dividerY}" x2="${bandCenterX + 34}" y2="${dividerY}" stroke="${t.accent}" stroke-width="2"/>
  <text x="${bandCenterX}" y="${headStart}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${headFont}" font-weight="bold" fill="${t.bandText}">${headTspans}</text>
  <text x="${bandCenterX}" y="${descY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="${t.sub}">${descTspans}</text>
  <g>
    <rect x="${bandCenterX - ctaW / 2}" y="${ctaY}" width="${ctaW}" height="${ctaH}" rx="${ctaH / 2}" fill="${t.cta}"/>
    <text x="${bandCenterX}" y="${ctaY + ctaH / 2 + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="bold" letter-spacing="1" fill="${t.ctaText}">${esc(ad.cta)}</text>
  </g>
</svg>`;
}

module.exports = { creativeSVG, THEMES };
