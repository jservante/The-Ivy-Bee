/**
 * Product-hero ad layout: real product photo up top, branded forest panel
 * below with strapline, wordmark and CTA. Renders one per product colourway.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 1080, H = 1350;
const SERIF = "Playfair Display, Georgia, serif";
const SANS = "Jost, Helvetica, Arial, sans-serif";
const C = { forest: "#143528", cream: "#f3e7c6", gold: "#c9a24a", goldlt: "#e2bd63", ink: "#15201a" };
const ROOT = path.resolve(__dirname, "..");

function bee(cx, cy, s, color) {
  return `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="${color}" stroke-linecap="round">
    <circle r="40" stroke-width="3"/><circle r="33" stroke-width="1.4"/>
    <ellipse cx="-11" cy="-6" rx="12" ry="6.5" stroke-width="1.6" transform="rotate(-26 -11 -6)"/>
    <ellipse cx="11" cy="-6" rx="12" ry="6.5" stroke-width="1.6" transform="rotate(26 11 -6)"/>
    <ellipse cx="0" cy="4" rx="6.5" ry="12" stroke-width="1.8"/><circle cx="0" cy="-10" r="3.4" stroke-width="1.6"/>
    <line x1="-6" y1="2" x2="6" y2="2" stroke-width="1.2"/><line x1="-5" y1="8" x2="5" y2="8" stroke-width="1.2"/></g>`;
}

function stars(cx, y, color) {
  const star = (x) => `<path transform="translate(${x} ${y})" d="M0 -13 L3.8 -4 L13 -4 L5.6 2 L8.5 12 L0 6 L-8.5 12 L-5.6 2 L-13 -4 L-3.8 -4 Z" fill="${color}"/>`;
  let s = "";
  for (let i = 0; i < 5; i++) s += star(cx - 96 + i * 48);
  return s;
}

function productHero(imgFile, opts = {}) {
  const l1 = opts.l1 || "Your best hair days";
  const l2 = opts.l2 || "start here.";
  const photoH = 720;
  const data = fs.readFileSync(imgFile).toString("base64");
  const href = "data:image/png;base64," + data;
  const P = photoH; // panel top
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${C.forest}"/>
  <clipPath id="ph"><rect x="0" y="0" width="${W}" height="${photoH}"/></clipPath>
  <image href="${href}" x="0" y="-100" width="${W}" height="${W}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ph)"/>
  <rect x="0" y="${photoH}" width="${W}" height="6" fill="${C.gold}"/>
  ${stars(540, P + 62, C.goldlt)}
  <text x="540" y="${P + 100}" text-anchor="middle" font-family="${SANS}" font-size="22" letter-spacing="3" fill="${C.goldlt}">LOVED BY CUSTOMERS LIKE YOU</text>
  <text x="540" y="${P + 182}" text-anchor="middle" font-family="${SERIF}" font-size="62" fill="${C.cream}">${esc(l1)}</text>
  <text x="540" y="${P + 252}" text-anchor="middle" font-family="${SERIF}" font-size="62" fill="${C.cream}">${esc(l2)}</text>
  <text x="540" y="${P + 320}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="36" fill="${C.gold}">Drawn from nature, made for your hair.</text>
  <rect x="350" y="${P + 366}" width="380" height="78" rx="39" fill="${C.gold}"/>
  <text x="540" y="${P + 417}" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="28" letter-spacing="3" fill="${C.ink}">TREAT YOUR HAIR</text>
  <text x="540" y="${P + 530}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="38" fill="${C.gold}">The Ivy Bee</text>
  ${bee(540, P + 582, 0.62, C.gold)}
</svg>`;
}

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

module.exports = { productHero };

if (require.main === module) {
  const out = path.join(ROOT, "iconic");
  fs.mkdirSync(out, { recursive: true });
  (async () => {
    for (const [name, file] of [["6-product-amber", "assets/product-amber.png"], ["7-product-green", "assets/product-green.png"]]) {
      const svg = productHero(path.join(ROOT, file));
      fs.writeFileSync(path.join(out, name + ".svg"), svg);
      await sharp(Buffer.from(svg)).png().toFile(path.join(out, name + ".png"));
      console.log("rendered", name);
    }
  })();
}
