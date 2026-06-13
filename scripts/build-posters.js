/**
 * Builds the 50 retro pop-art posters (Forest colourway) from data/ads.json.
 *
 * Each ad gets a short retro hook (top line + giant hero word) and a starburst
 * badge. The amber product render (assets/product-shot.jpg) is dropped into the
 * image slot as the fallback artwork; swap in a real photo or AI image per ad
 * by placing images/ad-NN.{jpg,png} and re-running.
 *
 * Outputs: posters/ad-NN.svg, posters/ad-NN.png, posters/index.html
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { posterSVG, COLORWAYS } = require("./retro-template");

const ROOT = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "ads.json"), "utf8"));
const outDir = path.join(ROOT, "posters");
const imgDir = path.join(ROOT, "images");
fs.mkdirSync(outDir, { recursive: true });

// Retro hook per ad id: [topLine, heroWord, badge]
const HOOKS = {
  1: ["TIME TO", "RESTORE", "TRY IT"], 2: ["END THE", "BREAKAGE", "TRY IT"], 3: ["THE 3-STEP", "RITUAL", "TRY IT"],
  4: ["STRONG FROM THE", "ROOTS", "TRY IT"], 5: ["FEEL IT FROM", "DAY ONE", "TRY IT"],
  6: ["CLEAN &", "PURE", "CLEAN"], 7: ["INGREDIENTS YOU CAN", "TRUST", "CLEAN"], 8: ["POWERED BY", "NATURE", "CLEAN"],
  9: ["GENTLE", "EVERY DAY", "CLEAN"], 10: ["CLEAN BEAUTY FOR YOUR", "HAIR", "CLEAN"],
  11: ["TIME FOR", "YOU", "LUXE"], 12: ["EVERYDAY", "LUXURY", "LUXE"], 13: ["TOO GOOD TO", "HIDE", "LUXE"],
  14: ["A MOMENT OF", "CALM", "LUXE"], 15: ["YOUR AT-HOME", "SPA", "LUXE"],
  16: ["CARE THAT", "KEEPS UP", "LOVED"], 17: ["FEEL LIKE", "YOU AGAIN", "LOVED"], 18: ["LOVE YOUR", "COLOUR", "LOVED"],
  19: ["FULLER,", "HEALTHIER", "LOVED"], 20: ["GORGEOUS AT", "ANY AGE", "LOVED"],
  21: ["YOUR FOREVER", "SHAMPOO", "5 STAR"], 22: ["RATED", "5 STARS", "5 STAR"], 23: ["BACK IN", "STOCK", "5 STAR"],
  24: ["GIVE IT A", "GO", "5 STAR"], 25: ["HAIR THAT GETS", "NOTICED", "5 STAR"],
  26: ["MADE WITH", "CARE", "EST."], 27: ["HAIR CARE,", "DONE RIGHT", "EST."], 28: ["THE STORY IN EVERY", "BOTTLE", "EST."],
  29: ["PREMIUM, FOR", "REAL WOMEN", "EST."], 30: ["CRAFTED", "PROPERLY", "EST."],
  31: ["JUST", "LAUNCHED", "NEW"], 32: ["THE COMPLETE", "RITUAL", "NEW"], 33: ["SAVE ON YOUR", "1ST ORDER", "NEW"],
  34: ["MEET THE", "HERO", "NEW"], 35: ["SELLING", "FAST", "NEW"],
  36: ["KIND TO THE", "PLANET", "ECO"], 37: ["LUXURY WITH A", "CONSCIENCE", "ECO"], 38: ["REFILL,", "REUSE", "ECO"],
  39: ["KIND TO", "NATURE", "ECO"], 40: ["UPGRADE YOUR", "SHELF", "ECO"],
  41: ["HAIR THAT SMELLS", "INCREDIBLE", "NEW"], 42: ["YOUR SIGNATURE", "SCENT", "NEW"], 43: ["A TREAT FOR THE", "SENSES", "NEW"],
  44: ["WASH AWAY THE", "DAY", "NEW"], 45: ["A SCENT TO", "LOVE", "NEW"],
  46: ["SALON RESULTS AT", "HOME", "SAVE"], 47: ["PREMIUM,", "SMART PRICE", "SAVE"], 48: ["LUXURY THAT", "LASTS", "SAVE"],
  49: ["SKIP THE", "SALON", "SAVE"], 50: ["WORTH", "EVERY PENNY", "SAVE"],
};

function imageHrefFor(id) {
  // Prefer a per-ad supplied image; otherwise fall back to the product shot.
  const stem = `ad-${String(id).padStart(2, "0")}`;
  for (const ext of ["jpg", "jpeg", "png"]) {
    const p = path.join(imgDir, `${stem}.${ext}`);
    if (fs.existsSync(p)) {
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      return `data:${mime};base64,` + fs.readFileSync(p).toString("base64");
    }
  }
  const fallback = path.join(ROOT, "assets", "product-shot.jpg");
  return "data:image/jpeg;base64," + fs.readFileSync(fallback).toString("base64");
}

(async () => {
  const cards = [];
  for (const ad of data.ads) {
    const [top, big, badge] = HOOKS[ad.id] || ["THE IVY BEE", ad.headline.split(" ").pop().toUpperCase(), "NEW"];
    const svg = posterSVG({
      cw: COLORWAYS.forest,
      headTop: top,
      headBig: big,
      banner: "THE IVY BEE",
      badge,
      imageHref: imageHrefFor(ad.id),
    });
    const stem = `ad-${String(ad.id).padStart(2, "0")}`;
    fs.writeFileSync(path.join(outDir, stem + ".svg"), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, stem + ".png"));
    cards.push(`<figure><img src="${stem}.png" alt="${ad.headline}"/><figcaption>#${ad.id} · ${ad.campaign}<br><span>${ad.headline}</span></figcaption></figure>`);
  }

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Ivy Bee - Retro Posters</title><style>
body{margin:0;font-family:Segoe UI,Arial,sans-serif;background:#14352a;color:#f3e7c6}
header{padding:36px 20px;text-align:center}h1{margin:0;font-size:2rem;letter-spacing:1px}
p{opacity:.85}main{max-width:1240px;margin:0 auto;padding:20px 16px 70px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
figure{margin:0;background:#0f2a20;border-radius:12px;overflow:hidden;border:1px solid #2c5443}
img{width:100%;display:block}figcaption{padding:10px 12px;font-size:.82rem;color:#e2bd63}figcaption span{color:#cfc3a0}
</style></head><body><header><h1>The Ivy Bee - Retro Posters</h1>
<p>${data.ads.length} ads · Forest colourway · product render in slot (drop your own photo/AI art in <code>images/ad-NN.jpg</code>)</p></header>
<main>${cards.join("\n")}</main></body></html>`;
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`Built ${data.ads.length} retro posters -> posters/`);
})();
