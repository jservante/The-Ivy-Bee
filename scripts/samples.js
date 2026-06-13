// Renders a few retro-template samples for sign-off into samples/.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { posterSVG, COLORWAYS } = require("./retro-template");

const ROOT = path.resolve(__dirname, "..");
const outDir = path.join(ROOT, "samples");
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  // A square stand-in "photo" (re-using a product render) to demo a filled slot.
  let imageHref = null;
  const src = path.join(ROOT, "creatives", "ad-01.png");
  if (fs.existsSync(src)) {
    const buf = await sharp(src).extract({ left: 130, top: 250, width: 820, height: 820 }).resize(900, 900).jpeg({ quality: 82 }).toBuffer();
    imageHref = "data:image/jpeg;base64," + buf.toString("base64");
  }

  const samples = [
    { name: "sample-1-green-empty", cw: COLORWAYS.green, headTop: "TIME TO", headBig: "SHINE", banner: "THE IVY BEE", badge: "TRY IT" },
    { name: "sample-2-terracotta-empty", cw: COLORWAYS.terracotta, headTop: "LOVE YOUR", headBig: "HAIR", banner: "BOTANICAL HAIRCARE", badge: "NEW" },
    { name: "sample-3-forest-empty", cw: COLORWAYS.forest, headTop: "GO ON,", headBig: "TREAT", banner: "THE IVY BEE", badge: "LUXE" },
    { name: "sample-4-green-filled", cw: COLORWAYS.green, headTop: "TIME TO", headBig: "SHINE", banner: "THE IVY BEE", badge: "TRY IT", imageHref },
  ];

  for (const s of samples) {
    const svg = posterSVG(s);
    fs.writeFileSync(path.join(outDir, s.name + ".svg"), svg);
    await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, s.name + ".png"));
    console.log("rendered", s.name);
  }
})();
