/**
 * Product-hero ad layout: real product photo up top, branded forest panel
 * below with strapline, wordmark and CTA. Renders one per product colourway.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 1080, H = 1350;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";
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

function productHero(imgFile) {
  const photoH = 838;
  const data = fs.readFileSync(imgFile).toString("base64");
  const href = "data:image/png;base64," + data;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${C.forest}"/>
  <clipPath id="ph"><rect x="0" y="0" width="${W}" height="${photoH}"/></clipPath>
  <image href="${href}" x="0" y="0" width="${W}" height="${W}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ph)"/>
  <rect x="0" y="${photoH}" width="${W}" height="6" fill="${C.gold}"/>
  ${bee(540, photoH + 78, 0.78, C.goldlt)}
  <text x="540" y="${photoH + 178}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="52" fill="${C.cream}">Drawn from nature,</text>
  <text x="540" y="${photoH + 240}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="52" fill="${C.cream}">made for your hair.</text>
  <rect x="370" y="${photoH + 300}" width="340" height="76" rx="38" fill="${C.gold}"/>
  <text x="540" y="${photoH + 349}" text-anchor="middle" font-family="${SANS}" font-weight="bold" font-size="28" letter-spacing="3" fill="${C.ink}">SHOP THE RITUAL</text>
  <text x="540" y="${photoH + 440}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="40" fill="${C.gold}">The Ivy Bee</text>
</svg>`;
}

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
