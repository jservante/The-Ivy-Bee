/**
 * Rolls the product-hero format across all 50 ads from data/ads.json.
 * Each ad gets a customer-first two-line headline; product photo alternates
 * amber / green by id for A/B testing. Outputs hero/ad-NN.{svg,png} + gallery.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { productHero } = require("./product-hero");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ads.json"), "utf8"));
const outDir = path.join(ROOT, "hero");
fs.mkdirSync(outDir, { recursive: true });

// Customer-first, two-line headlines (no em dashes), tied to each ad's angle.
const HEAD = {
  1: ["Bring tired hair", "back to life."],
  2: ["Stronger hair,", "in one treatment."],
  3: ["Soft, healthy hair", "you can feel."],
  4: ["Fuller hair,", "from the root."],
  5: ["Feel the difference", "on day one."],
  6: ["Everything good,", "nothing nasty."],
  7: ["Ingredients you", "can trust."],
  8: ["Let nature", "love your hair."],
  9: ["Gentle enough", "for every day."],
  10: ["Clean beauty,", "for your hair."],
  11: ["Ten minutes", "just for you."],
  12: ["A little luxury,", "every day."],
  13: ["Hair too good", "to hide."],
  14: ["A quiet moment", "just for you."],
  15: ["Your at-home", "spa day."],
  16: ["Care that keeps", "up with you."],
  17: ["Feel like", "yourself again."],
  18: ["Love the hair", "you're in."],
  19: ["Fuller, healthier", "hair awaits."],
  20: ["Gorgeous hair,", "at any age."],
  21: ["Find your", "forever shampoo."],
  22: ["Hair you'll", "rave about."],
  23: ["The hair care", "everyone wants."],
  24: ["Your hair's new", "holy grail."],
  25: ["Hair that", "turns heads."],
  26: ["Hair care that", "feels like a treat."],
  27: ["The hair care", "you deserve."],
  28: ["Bring out your", "healthiest hair."],
  29: ["Premium hair care,", "made for you."],
  30: ["Feel what real", "care can do."],
  31: ["Your hair upgrade", "is finally here."],
  32: ["Your complete", "hair ritual."],
  33: ["Start your hair", "journey for less."],
  34: ["Meet your new", "favourite shampoo."],
  35: ["Get yours", "before it's gone."],
  36: ["Beautiful hair,", "kinder planet."],
  37: ["Luxury you can", "feel good about."],
  38: ["Too beautiful", "to throw away."],
  39: ["Kind to hair,", "kind to nature."],
  40: ["Upgrade your", "whole shelf."],
  41: ["Hair that smells", "incredible."],
  42: ["Your new", "signature scent."],
  43: ["A treat for", "your senses."],
  44: ["Wash away", "the day."],
  45: ["A scent you'll", "fall for."],
  46: ["Salon results,", "at home."],
  47: ["Premium hair,", "smart price."],
  48: ["Luxury that", "lasts and lasts."],
  49: ["Salon softness,", "on repeat."],
  50: ["An upgrade you'll", "feel every day."],
};

const AMBER = path.join(ROOT, "assets", "product-amber.png");
const GREEN = path.join(ROOT, "assets", "product-green.png");

(async () => {
  const cards = [];
  for (const ad of data.ads) {
    const [l1, l2] = HEAD[ad.id] || ["Your best hair days", "start here."];
    const img = ad.id % 2 === 1 ? AMBER : GREEN; // odd = amber, even = green
    const svg = productHero(img, { l1, l2 });
    const stem = `ad-${String(ad.id).padStart(2, "0")}`;
    fs.writeFileSync(path.join(outDir, stem + ".svg"), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, stem + ".png"));
    const tone = ad.id % 2 === 1 ? "amber" : "green";
    cards.push(`<figure><img src="${stem}.png" alt="${l1} ${l2}"/><figcaption>#${ad.id} · ${ad.campaign} · <em>${tone}</em><br><span>${l1} ${l2}</span></figcaption></figure>`);
  }
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Ivy Bee - Product Ads</title><style>
body{margin:0;font-family:Segoe UI,Arial,sans-serif;background:#10261d;color:#f3e7c6}
header{padding:36px 20px;text-align:center}h1{margin:0;font-size:2rem;letter-spacing:1px}
p{opacity:.85}main{max-width:1240px;margin:0 auto;padding:20px 16px 70px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
figure{margin:0;background:#0c1f17;border-radius:12px;overflow:hidden;border:1px solid #244;}
img{width:100%;display:block}figcaption{padding:10px 12px;font-size:.82rem;color:#e2bd63}figcaption span{color:#cfc3a0}figcaption em{color:#c9a24a;font-style:normal}
</style></head><body><header><h1>The Ivy Bee - Product Ads</h1>
<p>${data.ads.length} ads · product-hero format · amber / green alternating for A/B testing</p></header>
<main>${cards.join("\n")}</main></body></html>`;
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`Built ${data.ads.length} product-hero ads -> hero/`);
})();
