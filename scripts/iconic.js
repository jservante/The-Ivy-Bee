/**
 * Five "homage" ad concepts for The Ivy Bee, each piggy-backing off one of the
 * most iconic ad campaigns of all time. Typography / silhouette led (no
 * fiddly 3D product render).
 *
 *   1. Absolut Vodka      -> "ABSOLUT BOTANICAL"
 *   2. Apple Think Different -> "Think Botanical."
 *   3. Nike Just Do It    -> "Just Wash It."
 *   4. L'Oreal            -> "Because Your Hair's Worth It."
 *   5. VW Think Small     -> "Think small. Think botanical."
 */

const W = 1080, H = 1350;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const C = {
  green: "#1f5a45", forest: "#10261d", cream: "#f3e7c6", paper: "#f6f1e4",
  gold: "#c9a24a", goldlt: "#e2bd63", ink: "#15201a", black: "#0c0c0c", amber: "#b07a32",
};

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

// Brand straplines.
const STRAP_BRAND = "Drawn from nature, made for your hair.";
const STRAP_PROOF = "Nature, proven at the chair.";

// Monoline bee emblem centred at 0,0 (design radius ~40), scaled.
function bee(cx, cy, s, color, sw = 1) {
  return `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="${color}" stroke-linecap="round">
    <circle r="40" stroke-width="${3 * sw}"/><circle r="33" stroke-width="${1.4 * sw}"/>
    <ellipse cx="-11" cy="-6" rx="12" ry="6.5" stroke-width="${1.6 * sw}" transform="rotate(-26 -11 -6)"/>
    <ellipse cx="11" cy="-6" rx="12" ry="6.5" stroke-width="${1.6 * sw}" transform="rotate(26 11 -6)"/>
    <ellipse cx="0" cy="4" rx="6.5" ry="12" stroke-width="${1.8 * sw}"/>
    <circle cx="0" cy="-10" r="3.4" stroke-width="${1.6 * sw}"/>
    <line x1="-6" y1="2" x2="6" y2="2" stroke-width="${1.2 * sw}"/><line x1="-5" y1="8" x2="5" y2="8" stroke-width="${1.2 * sw}"/>
  </g>`;
}

function wordmark(cx, y, size, color, sub) {
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${size}" fill="${color}">The Ivy Bee</text>` +
    (sub ? `<text x="${cx}" y="${y + size * 0.62}" text-anchor="middle" font-family="${SANS}" font-size="${size * 0.3}" letter-spacing="${size * 0.12}" fill="${color}">${esc(sub)}</text>` : "");
}

// Clean, flat amber CAPPED bottle silhouette (no pump). baseY = bottom.
function flatBottle(cx, baseY, bodyH, label) {
  const bw = bodyH * 0.48;
  const bx = cx - bw / 2, bodyTop = baseY - bodyH;
  const shoulder = bodyH * 0.10;
  const neckW = bw * 0.34, neckH = bodyH * 0.06, neckTop = bodyTop - neckH;
  const capW = bw * 0.42, capH = bodyH * 0.065, capTop = neckTop - capH;
  const lw = bw * 0.88, lh = bodyH * 0.36, lx = cx - lw / 2, ly = baseY - bodyH * 0.56;
  const medY = bodyTop + bodyH * 0.13;
  // body with shouldered top
  const body = `M ${bx} ${baseY - bw * 0.10}
    L ${bx} ${bodyTop + shoulder}
    Q ${bx} ${bodyTop} ${bx + (bw - neckW) / 2} ${bodyTop + shoulder * 0.35}
    L ${cx - neckW / 2} ${bodyTop}
    L ${cx + neckW / 2} ${bodyTop}
    L ${bx + bw - (bw - neckW) / 2} ${bodyTop + shoulder * 0.35}
    Q ${bx + bw} ${bodyTop} ${bx + bw} ${bodyTop + shoulder}
    L ${bx + bw} ${baseY - bw * 0.10}
    Q ${bx + bw} ${baseY} ${bx + bw - bw * 0.10} ${baseY}
    L ${bx + bw * 0.10} ${baseY}
    Q ${bx} ${baseY} ${bx} ${baseY - bw * 0.10} Z`;
  return `<g>
    <defs>
      <linearGradient id="amb" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#7c5121"/><stop offset="0.20" stop-color="#c89150"/>
        <stop offset="0.5" stop-color="#a4732e"/><stop offset="1" stop-color="#6b441b"/>
      </linearGradient>
    </defs>
    <rect x="${cx - neckW / 2}" y="${bodyTop - neckH}" width="${neckW}" height="${neckH + 8}" fill="#8a5d27"/>
    <rect x="${cx - capW / 2}" y="${capTop}" width="${capW}" height="${capH + neckH * 0.5}" rx="${capH * 0.4}" fill="#5f3f18"/>
    <path d="${body}" fill="url(#amb)"/>
    <rect x="${bx + bw * 0.12}" y="${bodyTop + bodyH * 0.10}" width="${bw * 0.08}" height="${bodyH * 0.72}" rx="${bw * 0.04}" fill="#ffffff" opacity="0.15"/>
    <circle cx="${cx}" cy="${medY}" r="${bw * 0.16}" fill="none" stroke="${C.goldlt}" stroke-width="2"/>
    ${bee(cx, medY, bw * 0.0028, C.goldlt, 1)}
    <rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="8" fill="${C.cream}"/>
    <text x="${cx}" y="${ly + lh * 0.42}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${lh * 0.185}" fill="${C.green}">The Ivy Bee</text>
    <line x1="${cx - lw * 0.16}" y1="${ly + lh * 0.55}" x2="${cx + lw * 0.16}" y2="${ly + lh * 0.55}" stroke="${C.gold}" stroke-width="2"/>
    <text x="${cx}" y="${ly + lh * 0.76}" text-anchor="middle" font-family="${SANS}" font-size="${lh * 0.11}" letter-spacing="2" fill="#7a6a4a">${esc(label || "BOTANICAL")}</text>
  </g>`;
}

function frame(bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${bg}"/>`;
}

// CTA pill. Filled (fill set) or outlined.
function cta(cx, cy, w, label, { fill = "none", text = C.cream, outline = C.cream } = {}) {
  const h = 70;
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${outline}" stroke-width="2"/>
    <text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="26" letter-spacing="3" fill="${text}">${esc(label)}</text>`;
}

// 1. ABSOLUT --------------------------------------------------------------
function absolut() {
  return frame(C.green) +
    flatBottle(540, 880, 660, "BOTANICAL") +
    `<text x="540" y="1078" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="70" letter-spacing="6" fill="${C.cream}">ABSOLUTELY</text>
     <text x="540" y="1150" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="70" letter-spacing="6" fill="${C.cream}">BOTANICAL.</text>
     <text x="540" y="1216" text-anchor="middle" font-family="${SANS}" font-size="22" letter-spacing="3" fill="${C.goldlt}">${esc(STRAP_BRAND.toUpperCase())}</text>` +
    cta(540, 1290, 300, "SHOP NOW", { fill: C.gold, text: C.ink, outline: C.gold }) + `</svg>`;
}

// 2. APPLE THINK DIFFERENT ------------------------------------------------
function apple() {
  return frame(C.black) +
    bee(540, 360, 1.7, "#f3f0e8", 1.2) +
    `<text x="540" y="720" text-anchor="middle" font-family="${SERIF}" font-size="118" fill="#f3f0e8">Think</text>
     <text x="540" y="850" text-anchor="middle" font-family="${SERIF}" font-size="118" fill="#f3f0e8">Botanical.</text>` +
    `<text x="540" y="1158" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="40" fill="#b8b2a4">The Ivy Bee</text>
     <text x="540" y="1208" text-anchor="middle" font-family="${SANS}" font-size="22" letter-spacing="1" fill="#7c776c">${esc(STRAP_BRAND)}</text>` +
    cta(540, 1285, 280, "SHOP NOW", { outline: "#6f6a5f", text: "#e7e2d6" }) + `</svg>`;
}

// 3. NIKE JUST DO IT ------------------------------------------------------
function nike() {
  return frame(C.forest) +
    // bee as the "swoosh" hero
    bee(540, 470, 2.7, C.goldlt, 1.25) +
    `<text x="540" y="880" text-anchor="middle" font-family="${SANS}" font-weight="900" font-size="146" letter-spacing="-2" fill="${C.cream}">Simply</text>
     <text x="540" y="1026" text-anchor="middle" font-family="${SANS}" font-weight="900" font-size="146" letter-spacing="-2" fill="${C.cream}">Wash It.</text>
     <text x="540" y="1188" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="38" fill="${C.goldlt}">${esc(STRAP_PROOF)}</text>` +
    cta(540, 1268, 300, "SHOP NOW", { fill: C.gold, text: C.ink, outline: C.gold }) + `</svg>`;
}

// 4. L'OREAL BECAUSE YOU'RE WORTH IT --------------------------------------
function loreal() {
  const lines = ["Because", "Your Hair", "Deserves It."];
  let t = "";
  lines.forEach((l, i) => {
    t += `<text x="540" y="${540 + i * 142}" text-anchor="middle" font-family="${SERIF}" font-size="114" fill="${C.gold}">${l}</text>`;
  });
  return frame(C.forest) +
    bee(540, 250, 1.2, C.gold, 1.1) +
    `<line x1="390" y1="328" x2="690" y2="328" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>` +
    t +
    `<line x1="390" y1="1040" x2="690" y2="1040" stroke="${C.gold}" stroke-width="1.5" opacity="0.6"/>` +
    `<text x="540" y="1108" text-anchor="middle" font-family="${SANS}" font-size="24" letter-spacing="4" fill="${C.cream}">${esc(STRAP_PROOF.toUpperCase())}</text>` +
    wordmark(540, 1188, 44, C.gold) +
    cta(540, 1268, 300, "SHOP NOW", { fill: C.gold, text: C.ink, outline: C.gold }) + `</svg>`;
}

// 5. VW THINK SMALL -------------------------------------------------------
function vw() {
  const col1 = [
    "Our bottle won't turn heads",
    "on your bathroom shelf. It's",
    "just a bottle. What's inside is",
    "the point: botanical shampoo,",
    "conditioner and treatment that",
    "quietly get on with the job.",
  ];
  const col2 = [
    "Fewer harsh ingredients. More",
    "of the good stuff. And a price",
    "that doesn't pretend luxury",
    "has to cost the earth.",
    "Some shampoos shout.",
    "Ours just works.",
  ];
  const para = (lines, x) => lines.map((l, i) =>
    `<text x="${x}" y="${1050 + i * 38}" font-family="${SANS}" font-size="26" fill="#222">${esc(l)}</text>`).join("");
  return frame("#ffffff") +
    flatBottle(540, 450, 290, "BOTANICAL") +
    `<text x="120" y="880" font-family="${SANS}" font-weight="bold" font-size="84" fill="#111">Think small.</text>` +
    `<text x="122" y="930" font-family="${SERIF}" font-style="italic" font-size="32" fill="#444">${esc(STRAP_BRAND)}</text>` +
    para(col1, 120) + para(col2, 600) +
    `<text x="120" y="1318" font-family="${SERIF}" font-style="italic" font-size="34" fill="#111">The Ivy Bee.</text>` +
    cta(818, 1308, 280, "SHOP NOW", { outline: "#111", text: "#111" }) +
    bee(960, 858, 0.52, "#111", 1) + `</svg>`;
}

module.exports = { absolut, apple, nike, loreal, vw };

if (require.main === module) {
  const fs = require("fs");
  const path = require("path");
  const sharp = require("sharp");
  const out = path.resolve(__dirname, "..", "iconic");
  fs.mkdirSync(out, { recursive: true });
  const set = { "1-absolut": absolut(), "2-apple": apple(), "3-nike": nike(), "4-loreal": loreal(), "5-vw": vw() };
  (async () => {
    for (const [name, svg] of Object.entries(set)) {
      fs.writeFileSync(path.join(out, name + ".svg"), svg);
      await sharp(Buffer.from(svg)).png().toFile(path.join(out, name + ".png"));
      console.log("rendered", name);
    }
  })();
}
