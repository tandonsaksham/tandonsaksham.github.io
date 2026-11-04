import { chromium } from "playwright-core"
const OUT = process.argv[2]
const FONT = "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;500;600;700&family=Funnel+Sans:wght@400;500;600&display=swap"
const INK = "#0A0A0A", PAPER = "#F3F1EC", SIG = "#EA5628"
// The menu's globe, caught mid-turn: outline, equator, and two pairs of meridians.
const globe = (size, color, sw = 1.8) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" stroke="${color}" stroke-width="${sw}">
<circle cx="20" cy="20" r="17"/><ellipse cx="20" cy="20" rx="17" ry="6.2" stroke-opacity=".55"/>
<ellipse cx="20" cy="20" rx="12.75" ry="17"/><ellipse cx="20" cy="20" rx="4.25" ry="17"/></svg>`
const badge = (d, bg, fg, sw) => `<div style="width:${d}px;height:${d}px;border-radius:50%;background:${bg};display:grid;place-items:center">${globe(Math.round(d * 26 / 44), fg, sw)}</div>`
const word = (px, color = PAPER) => `<b style="font:600 ${px}px/1 'Funnel Display';letter-spacing:-.04em;color:${color};white-space:nowrap">world media<span style="color:${SIG}">.</span></b>`
const logo = (s) => `<div style="display:inline-flex;align-items:center;gap:${10 * s}px">${badge(44 * s, "#fff", INK, 1.8)}${word(21 * s)}</div>`
const jobs = [
  { name: "favicon-light-64.png", w: 64, h: 64, bg: "transparent", html: badge(64, INK, "#fff", 2.6) },
  { name: "favicon-dark-64.png", w: 64, h: 64, bg: "transparent", html: badge(64, "#fff", INK, 2.6) },
  { name: "apple-touch-icon-180.png", w: 180, h: 180, bg: INK, html: badge(124, "#fff", INK, 2.2) },
  { name: "logo-on-black.png", w: 2400, h: 900, bg: INK, html: logo(8) },
  { name: "logo-transparent.png", w: 2000, h: 440, bg: "transparent", html: logo(8) },
  { name: "social-preview-1200x630.png", w: 1200, h: 630, bg: INK, html: `
<div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 78% 55%,#181818 0%,${INK} 70%)"></div>
<div style="position:absolute;right:-140px;top:50%;translate:0 -50%;opacity:.22">${globe(620, PAPER, .6)}</div>
<div style="position:absolute;left:64px;top:56px">${logo(1.6)}</div>
<div style="position:absolute;left:64px;right:64px;bottom:64px">
<div style="font:700 92px/.9 'Funnel Display';letter-spacing:-.05em;color:${PAPER};text-transform:uppercase">A creative kind<br><span style="color:${SIG}">of world.</span></div>
<div style="margin-top:26px;font:400 28px/1.3 'Funnel Sans';color:rgba(243,241,236,.6)">Ideas, creators, production and everything in between.</div></div>` },
]
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
for (const j of jobs) {
  const p = await b.newPage({ viewport: { width: Math.max(j.w, 800), height: Math.max(j.h, 800) }, deviceScaleFactor: 1 })
  await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="${FONT}"><style>*{margin:0;box-sizing:border-box}html{background:transparent}body{width:${j.w}px;height:${j.h}px;background:${j.bg};overflow:hidden}body{position:relative;display:grid;place-items:center}</style></head><body>${j.html}</body></html>`, { waitUntil: "networkidle" })
  await p.evaluate(() => document.fonts.ready)
  const ok = await p.evaluate(() => document.fonts.check("600 20px 'Funnel Display'"))
  await p.screenshot({ path: OUT + "/" + j.name, omitBackground: j.bg === "transparent", clip: { x: 0, y: 0, width: j.w, height: j.h }, timeout: 60000 })
  console.log(j.name, ok ? "font ok" : "FONT MISSING")
  await p.close()
}
await b.close()
