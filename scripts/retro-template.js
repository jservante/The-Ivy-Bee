/**
 * Retro pop-art poster TEMPLATE for The Ivy Bee.
 *
 * Produces a bold, attention-grabbing poster frame (halftone field, speed
 * lines, big condensed headline, sunburst image slot, banner + starburst
 * badge) with a clearly marked slot for a real photo or AI-generated artwork.
 *
 * posterSVG(opts):
 *   cw        - colourway object (field/cream/ink/gold/pop/head)
 *   headTop   - small upper headline word(s)
 *   headBig   - the giant hero word (kept short, e.g. SHINE / HAIR / TREAT)
 *   banner    - bottom banner text
 *   badge     - short starburst badge text (optional)
 *   imageHref - data URI of an image to drop into the slot (optional)
 */

const W = 1080, H = 1350;

const COLORWAYS = {
  green: { field: "#1f5a45", cream: "#f3e7c6", ink: "#16382a", gold: "#e2bd63", pop: "#d8573a", head: "#f3e7c6" },
  forest: { field: "#143528", cream: "#f3e7c6", ink: "#0c2018", gold: "#e2bd63", pop: "#e0a24a", head: "#e2bd63" },
  terracotta: { field: "#c1462a", cream: "#f4e7c6", ink: "#22303a", gold: "#e7b94e", pop: "#22303a", head: "#f4e7c6" },
};

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function bigFont(word) {
  return Math.min(300, Math.floor(940 / (Math.max(1, word.length) * 0.6)));
}

// n-point starburst badge.
function starburst(cx, cy, rOuter, rInner, points, fill, stroke) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
}

function sparkle(x, y, s, fill) {
  return `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5 Z" fill="${fill}"/>`;
}

function posterSVG(opts) {
  const cw = opts.cw || COLORWAYS.green;
  const cx = W / 2;
  const slotCx = 540, slotCy = 842, slotR = 320;
  const bf = bigFont(opts.headBig);

  // image slot content: dropped artwork, or a labelled placeholder.
  let slot;
  if (opts.imageHref) {
    slot = `
    <clipPath id="slotClip"><circle cx="${slotCx}" cy="${slotCy}" r="${slotR}"/></clipPath>
    <image href="${opts.imageHref}" x="${slotCx - slotR}" y="${slotCy - slotR}" width="${slotR * 2}" height="${slotR * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#slotClip)"/>
    <circle cx="${slotCx}" cy="${slotCy}" r="${slotR}" fill="none" stroke="${cw.ink}" stroke-width="7"/>`;
  } else {
    slot = `
    <circle cx="${slotCx}" cy="${slotCy}" r="${slotR}" fill="${cw.cream}" stroke="${cw.ink}" stroke-width="7"/>
    <circle cx="${slotCx}" cy="${slotCy}" r="${slotR - 22}" fill="none" stroke="${cw.gold}" stroke-width="4" stroke-dasharray="14 12"/>
    <g transform="translate(${slotCx} ${slotCy - 70})" fill="none" stroke="${cw.ink}" stroke-width="6" stroke-linejoin="round">
      <rect x="-58" y="-44" width="116" height="84" rx="10"/><circle cx="0" cy="-2" r="22"/><circle cx="0" cy="-2" r="9" fill="${cw.ink}"/><circle cx="38" cy="-30" r="5" fill="${cw.ink}" stroke="none"/>
    </g>
    <text x="${slotCx}" y="${slotCy + 26}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="40" fill="${cw.ink}">ADD YOUR PHOTO</text>
    <text x="${slotCx}" y="${slotCy + 72}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="40" fill="${cw.ink}">OR AI ARTWORK</text>
    <text x="${slotCx}" y="${slotCy + 116}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" letter-spacing="2" fill="${cw.ink}" opacity="0.7">1080 &#215; 1080, CENTRED</text>`;
  }

  const badge = opts.badge ? `
    <g transform="rotate(-12 905 1120)">
      ${starburst(905, 1120, 92, 64, 12, cw.pop, cw.ink)}
      <text x="905" y="1132" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="34" fill="${cw.cream}">${esc(opts.badge)}</text>
    </g>` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <pattern id="ht" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="5" fill="${cw.gold}" opacity="0.30"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="${cw.cream}"/>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="${cw.field}"/>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" fill="url(#ht)"/>

  <g stroke="${cw.cream}" stroke-width="10" stroke-linecap="round"><line x1="60" y1="140" x2="300" y2="140"/><line x1="60" y1="175" x2="272" y2="175"/><line x1="60" y1="210" x2="244" y2="210"/></g>
  <!-- bee emblem (top-right) -->
  <g transform="translate(952 130)" fill="none" stroke="${cw.cream}">
    <circle r="40" stroke-width="3"/><circle r="33" stroke-width="1.4"/>
    <g><ellipse cx="-10" cy="-5" rx="11" ry="6" stroke-width="1.4" transform="rotate(-26 -10 -5)"/><ellipse cx="10" cy="-5" rx="11" ry="6" stroke-width="1.4" transform="rotate(26 10 -5)"/><ellipse cx="0" cy="3" rx="6" ry="11" stroke-width="1.6"/><circle cx="0" cy="-9" r="3.2" stroke-width="1.4"/><line x1="-6" y1="1" x2="6" y2="1" stroke-width="1.1"/><line x1="-5" y1="7" x2="5" y2="7" stroke-width="1.1"/></g>
  </g>

  <text x="${cx}" y="218" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="80" letter-spacing="4" fill="${cw.head}">${esc(opts.headTop)}</text>
  <text x="${cx}" y="478" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${bf}" letter-spacing="-4" fill="${cw.head}">${esc(opts.headBig)}</text>

  ${sparkle(245, 600, 1.6, cw.cream)}${sparkle(845, 640, 2.0, cw.gold)}${sparkle(840, 1040, 1.5, cw.cream)}${sparkle(235, 1050, 1.8, cw.gold)}
  ${slot}
  ${badge}

  <rect x="26" y="1208" width="${W - 52}" height="116" fill="${cw.cream}"/>
  <g fill="${cw.pop}"><path d="M70 1266 l 40 -22 l 0 44 Z"/><path d="M120 1266 l 40 -22 l 0 44 Z"/><path d="M170 1266 l 40 -22 l 0 44 Z"/></g>
  <text x="240" y="1288" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="56" letter-spacing="2" fill="${cw.ink}">${esc(opts.banner)}</text>
</svg>`;
}

module.exports = { posterSVG, COLORWAYS };
