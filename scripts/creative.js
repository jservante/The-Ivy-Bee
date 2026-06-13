/**
 * Generates a premium Facebook ad creative for The Ivy Bee as an SVG string.
 *
 * Canvas is 1080 x 1350 (Facebook / Instagram 4:5 feed format). The look is
 * editorial and high-end: a softly lit amber-glass bottle trio with cylindrical
 * shading, specular highlights, a chrome pump, contact shadows and surface
 * reflections, set on a muted background with a fine gold frame, refined serif
 * typography and a tracked-out wordmark. Each campaign gets its own treatment.
 */

const W = 1080;
const H = 1350;

// Palette per campaign. mode "light" = ivory/stone bg with deep-green type;
// mode "dark" = forest bg with ivory type and gold accents.
const THEMES = {
  "Damage Repair & Restore": { mode: "light", bg: "#f1e8d9", bg2: "#e3d3b8", head: "#1c4332", sub: "#857b67", accent: "#b48a3e", cta: "#1c4332", ctaText: "#f6f1e6" },
  "Clean & Natural Ingredients": { mode: "light", bg: "#e9efe2", bg2: "#d3e0c6", head: "#1f4533", sub: "#6f7b63", accent: "#b48a3e", cta: "#1f4533", ctaText: "#f6f1e6" },
  "Luxury Self-Care Ritual": { mode: "dark", bg: "#1c4332", bg2: "#122c20", head: "#f5edde", sub: "#d8c8a4", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#13301f" },
  "Age Confidence (28-60)": { mode: "light", bg: "#f0e6d4", bg2: "#e2d0af", head: "#1c4332", sub: "#897e69", accent: "#b48a3e", cta: "#1c4332", ctaText: "#f6f1e6" },
  "Social Proof & Reviews": { mode: "light", bg: "#f2ebdd", bg2: "#e6d6ba", head: "#1c4332", sub: "#857b67", accent: "#b48a3e", cta: "#b48a3e", ctaText: "#1c2f23" },
  "Brand & Founder Story": { mode: "dark", bg: "#234a39", bg2: "#163527", head: "#f5edde", sub: "#d8c8a4", accent: "#d9b45f", cta: "#d9b45f", ctaText: "#13301f" },
  "New Launch & Intro Offer": { mode: "light", bg: "#f4edda", bg2: "#ecdcba", head: "#1c4332", sub: "#857b67", accent: "#b48a3e", cta: "#1c4332", ctaText: "#f6f1e6" },
  "Sustainability & Eco": { mode: "light", bg: "#e6ede0", bg2: "#d0ddc4", head: "#1f4533", sub: "#6f7b63", accent: "#b48a3e", cta: "#1f4533", ctaText: "#f6f1e6" },
  "Scent & Sensory": { mode: "light", bg: "#f2e7dc", bg2: "#ecd6c4", head: "#1c4332", sub: "#8a7a6b", accent: "#b48a3e", cta: "#1c4332", ctaText: "#f6f1e6" },
  "Salon Quality & Value": { mode: "light", bg: "#f1e8d9", bg2: "#e3d3b8", head: "#1c4332", sub: "#857b67", accent: "#b48a3e", cta: "#1c4332", ctaText: "#f6f1e6" },
};
const DEFAULT_THEME = THEMES["Damage Repair & Restore"];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; }
    else cur = cur ? cur + " " + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

// Fine line-art ivy leaf (echoes the brand logo's botanical line work).
function leaf(x, y, scale, rot, color, opacity) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})" opacity="${opacity}" fill="none" stroke="${color}" stroke-width="1.4">
    <path d="M0 0 C 16 -6 24 -18 22 -40 C 10 -32 6 -40 0 -52 C -6 -40 -10 -32 -22 -40 C -24 -18 -16 -6 0 0 Z"/>
    <path d="M0 -2 L0 -46" opacity="0.7"/>
    <path d="M0 -16 L10 -26 M0 -16 L-10 -26 M0 -30 L7 -38 M0 -30 L-7 -38" opacity="0.55"/>
  </g>`;
}

// Line-art bee + double ring emblem.
function emblem(cx, cy, r, color) {
  return `<g fill="none" stroke="${color}">
    <circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 6}" stroke-width="1"/>
    <g transform="translate(${cx} ${cy})">
      <ellipse cx="-15" cy="-7" rx="16" ry="8.5" stroke-width="1.4" fill="${color}" fill-opacity="0.12" transform="rotate(-26 -15 -7)"/>
      <ellipse cx="15" cy="-7" rx="16" ry="8.5" stroke-width="1.4" fill="${color}" fill-opacity="0.12" transform="rotate(26 15 -7)"/>
      <ellipse cx="0" cy="4" rx="8.5" ry="16" stroke-width="1.6"/>
      <circle cx="0" cy="-13" r="4.5" stroke-width="1.4"/>
      <line x1="-8" y1="0" x2="8" y2="0" stroke-width="1.2"/>
      <line x1="-7" y1="8" x2="7" y2="8" stroke-width="1.2"/>
      <path d="M-2 -17 C -5 -24 -8 -25 -11 -27" stroke-width="1.2"/>
      <path d="M2 -17 C 5 -24 8 -25 11 -27" stroke-width="1.2"/>
    </g>
  </g>`;
}

// A realistic amber pump bottle with chrome dispenser, label, highlight,
// contact shadow and a faded surface reflection.
function bottle(cx, bw, topY, baseY, label) {
  const hw = bw / 2;
  const left = cx - hw;
  const right = cx + hw;
  const r = hw * 0.18; // corner radius
  const cornerB = hw * 0.22;
  const neckW = bw * 0.34;
  const collarY = topY - 26;

  // Glass body as a path: rounded top corners (shoulder), rounded bottom.
  const body = `M ${left} ${topY + r}
    Q ${left} ${topY} ${left + r} ${topY}
    L ${right - r} ${topY}
    Q ${right} ${topY} ${right} ${topY + r}
    L ${right} ${baseY - cornerB}
    Q ${right} ${baseY} ${right - cornerB} ${baseY}
    L ${left + cornerB} ${baseY}
    Q ${left} ${baseY} ${left} ${baseY - cornerB} Z`;

  const labelW = bw * 0.82;
  const labelH = (baseY - topY) * 0.46;
  const labelX = cx - labelW / 2;
  const labelY = baseY - labelH - (baseY - topY) * 0.13;

  // chrome pump pieces
  const stemW = bw * 0.16;
  const headW = bw * 0.30;
  const headY = collarY - 70;
  const spoutEndX = cx + bw * 0.40;

  return `<g>
    <!-- contact shadow -->
    <ellipse cx="${cx}" cy="${baseY + 6}" rx="${hw * 1.05}" ry="14" fill="#000000" opacity="0.20" filter="url(#soft)"/>

    <!-- surface reflection -->
    <g transform="translate(0 ${2 * baseY}) scale(1 -1)" opacity="0.30" mask="url(#reflMask)">
      <path d="${body}" fill="url(#amber)"/>
    </g>

    <!-- pump dispenser -->
    <g>
      <rect x="${cx - stemW / 2}" y="${headY}" width="${stemW}" height="${collarY - headY + 4}" fill="url(#chrome)"/>
      <path d="M ${cx + headW * 0.20} ${headY + 8} Q ${spoutEndX + 14} ${headY - 4} ${spoutEndX} ${headY + 30} L ${spoutEndX} ${headY + 42}"
            fill="none" stroke="url(#chrome)" stroke-width="17" stroke-linecap="round"/>
      <path d="M ${cx + headW * 0.20} ${headY + 5} Q ${spoutEndX + 13} ${headY - 7} ${spoutEndX - 2} ${headY + 26}"
            fill="none" stroke="#eef0f1" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <rect x="${spoutEndX - 9}" y="${headY + 36}" width="18" height="14" rx="3" fill="url(#chrome)"/>
      <rect x="${cx - headW / 2}" y="${headY - 12}" width="${headW}" height="26" rx="9" fill="url(#chrome)"/>
      <rect x="${cx - neckW / 2}" y="${collarY}" width="${neckW}" height="30" rx="5" fill="url(#chrome)"/>
      ${[0, 1, 2, 3, 4].map((i) => {
        const lx = cx - neckW / 2 + 6 + i * ((neckW - 12) / 4);
        return `<line x1="${lx}" y1="${collarY + 5}" x2="${lx}" y2="${collarY + 25}" stroke="#7f8487" stroke-width="1" opacity="0.5"/>`;
      }).join("")}
    </g>

    <!-- neck glass -->
    <rect x="${cx - neckW / 2 + 2}" y="${topY - 14}" width="${neckW - 4}" height="20" fill="#7a4715"/>

    <!-- glass body -->
    <path d="${body}" fill="url(#amber)"/>
    <path d="${body}" fill="none" stroke="#3f2208" stroke-opacity="0.25" stroke-width="1.5"/>
    <!-- top rim -->
    <ellipse cx="${cx}" cy="${topY + 3}" rx="${hw - 4}" ry="6" fill="#5e360f" opacity="0.55"/>
    <!-- specular highlight -->
    <rect x="${left + bw * 0.15}" y="${topY + 14}" width="${bw * 0.10}" height="${baseY - topY - 34}" rx="${bw * 0.05}" fill="#ffe9c4" opacity="0.55" filter="url(#soft)"/>
    <rect x="${left + bw * 0.17}" y="${topY + 20}" width="${bw * 0.035}" height="${baseY - topY - 60}" rx="3" fill="#fff6e6" opacity="0.8"/>
    <!-- right rim light -->
    <rect x="${right - bw * 0.085}" y="${topY + 22}" width="${bw * 0.03}" height="${baseY - topY - 70}" rx="3" fill="#ffdca0" opacity="0.35"/>

    <!-- label -->
    <rect x="${labelX}" y="${labelY + 3}" width="${labelW}" height="${labelH}" rx="7" fill="#000000" opacity="0.12" filter="url(#soft)"/>
    <rect x="${labelX}" y="${labelY}" width="${labelW}" height="${labelH}" rx="7" fill="url(#label)"/>
    <text x="${cx}" y="${labelY + labelH * 0.24}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${bw * 0.11}" fill="#b48a3e">&#10042;</text>
    <text x="${cx}" y="${labelY + labelH * 0.46}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${bw * 0.135}" fill="#1c4332">The Ivy Bee</text>
    <line x1="${cx - labelW * 0.22}" y1="${labelY + labelH * 0.54}" x2="${cx + labelW * 0.22}" y2="${labelY + labelH * 0.54}" stroke="#b48a3e" stroke-width="1"/>
    <text x="${cx}" y="${labelY + labelH * 0.70}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${bw * 0.073}" letter-spacing="${bw * 0.012}" fill="#6f6a5d">${esc(label)}</text>
    <text x="${cx}" y="${labelY + labelH * 0.85}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${bw * 0.05}" letter-spacing="${bw * 0.007}" fill="#9a9486">BOTANICAL HAIR CARE</text>
  </g>`;
}

function creativeSVG(ad) {
  const t = THEMES[ad.campaign] || DEFAULT_THEME;
  const dark = t.mode === "dark";

  // ---- bottom copy ----
  const headLines = wrap(ad.headline, 20);
  const headFont = headLines.length >= 3 ? 52 : 64;
  const headLH = headFont + 10;
  const descLines = wrap(ad.description, 42);

  const copyTop = 1012;
  const cx = W / 2;
  const ruleY = copyTop;
  const headStart = copyTop + 58;
  const headTspans = headLines.map((ln, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : headLH}">${esc(ln)}</tspan>`).join("");
  const headBottom = headStart + (headLines.length - 1) * headLH;
  const descY = headBottom + 48;
  const descTspans = descLines.map((ln, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : 32}">${esc(ln)}</tspan>`).join("");
  const ctaY = descY + (descLines.length - 1) * 32 + 40;
  const ctaW = Math.max(230, ad.cta.length * 19 + 76);
  const ctaH = 66;

  const wordColor = dark ? "#f5edde" : "#1c4332";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(ad.headline)}">
  <defs>
    <radialGradient id="bgGrad" cx="0.5" cy="0.40" r="0.75">
      <stop offset="0" stop-color="${t.bg}"/>
      <stop offset="1" stop-color="${t.bg2}"/>
    </radialGradient>
    <linearGradient id="amber" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4f2c0c"/>
      <stop offset="0.10" stop-color="#7c4716"/>
      <stop offset="0.26" stop-color="#d99a4e"/>
      <stop offset="0.40" stop-color="#b06e23"/>
      <stop offset="0.60" stop-color="#965d1c"/>
      <stop offset="0.82" stop-color="#6c3e12"/>
      <stop offset="1" stop-color="#43260a"/>
    </linearGradient>
    <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9aa0a3"/>
      <stop offset="0.22" stop-color="#eef1f2"/>
      <stop offset="0.45" stop-color="#b7bcbf"/>
      <stop offset="0.70" stop-color="#f3f5f6"/>
      <stop offset="1" stop-color="#8d9295"/>
    </linearGradient>
    <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f8f2e4"/>
      <stop offset="1" stop-color="#ece1cb"/>
    </linearGradient>
    <linearGradient id="reflFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#000000"/>
    </linearGradient>
    <mask id="reflMask"><rect x="0" y="${H * 0.6}" width="${W}" height="${H * 0.4}" fill="url(#reflFade)"/></mask>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    <radialGradient id="vign" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0.65" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="${dark ? 0.32 : 0.10}"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#vign)"/>

  <!-- fine frame -->
  <rect x="38" y="38" width="${W - 76}" height="${H - 76}" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.5"/>

  <!-- botanical line work -->
  ${leaf(150, 290, 1.6, -28, t.accent, 0.5)}
  ${leaf(196, 356, 1.2, 26, t.accent, 0.4)}
  ${leaf(930, 290, 1.6, 152, t.accent, 0.5)}
  ${leaf(884, 356, 1.2, 206, t.accent, 0.4)}

  <!-- emblem + wordmark -->
  ${emblem(cx, 168, 62, t.accent)}
  <text x="${cx}" y="292" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="56" fill="${wordColor}">The Ivy Bee</text>
  <text x="${cx}" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" letter-spacing="7" fill="${t.accent}">PREMIUM BOTANICAL HAIR CARE</text>

  <!-- surface line -->
  <rect x="120" y="892" width="${W - 240}" height="2" fill="${t.accent}" opacity="0.18"/>

  <!-- bottle trio (side bottles, then taller front bottle) -->
  ${bottle(388, 150, 540, 884, "SHAMPOO")}
  ${bottle(692, 150, 540, 884, "TREATMENT")}
  ${bottle(540, 168, 500, 884, "CONDITIONER")}

  <!-- copy -->
  <line x1="${cx - 36}" y1="${ruleY}" x2="${cx + 36}" y2="${ruleY}" stroke="${t.accent}" stroke-width="2"/>
  <text x="${cx}" y="${headStart}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${headFont}" fill="${t.head}">${headTspans}</text>
  <text x="${cx}" y="${descY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" letter-spacing="0.5" fill="${t.sub}">${descTspans}</text>
  <g>
    <rect x="${cx - ctaW / 2}" y="${ctaY}" width="${ctaW}" height="${ctaH}" rx="${ctaH / 2}" fill="${t.cta}"/>
    <text x="${cx}" y="${ctaY + ctaH / 2 + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="bold" letter-spacing="1.5" fill="${t.ctaText}">${esc(ad.cta)}</text>
  </g>
</svg>`;
}

module.exports = { creativeSVG, THEMES };
