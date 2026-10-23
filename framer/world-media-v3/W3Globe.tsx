// World Media, the globe showcase. One component for a whole page: the landing and the five pages
// after it. The World Media globe is the site's main interaction: it is made of tiles (reels,
// photos and small icons of what World Media does), it turns on its own, you can drag it, and
// scrolling spins it. Each page peels off the left edge of the globe, rides the rotation to the
// front while the globe sinks back, then rolls back into its right edge as the next one comes round.
// Place it on its own page, width 100%. Videos and photos are placeholders until the real ones
// are added in the Globe media field.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

type Media = { src?: string; type?: "video" | "image" }

type Props = {
    media: string[]
    samples: boolean
    email: string
    phone: string
    style?: React.CSSProperties
}

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;500;600;700&family=Funnel+Sans:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"

/** Sample photos, kept in the site's GitHub repo and served by jsDelivr, pinned to one commit. */
const SAMPLE = "https://cdn.jsdelivr.net/gh/tandonsaksham/tandonsaksham.github.io@16cfefc4bae4bbd2c69898b7d689135c895bf250/framer/world-media-v2/placeholders/"
const PHOTOS = ["project-2", "hello-1", "about-1", "project-4", "hello-3", "project-1", "about-2", "hello-2", "project-3"]

const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (v: number) => {
    const x = clamp(v)
    return x * x * (3 - 2 * x)
}
const easeOut = (v: number) => 1 - Math.pow(1 - clamp(v), 3)
const easeIn = (v: number) => Math.pow(clamp(v), 3)
const easeInOut = (v: number) => {
    const x = clamp(v)
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/* ─────────────────────────────── Icons ─────────────────────────────── */

const ICONS: Record<string, string> = {
    play: "M8.5 5.8v12.4L18.6 12z",
    camera: "M3.5 8.5h3.2l1.8-2.8h7l1.8 2.8h3.2v10.5h-17z M12 16.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z",
    mic: "M12 3.5a3 3 0 0 0-3 3v5.5a3 3 0 0 0 6 0V6.5a3 3 0 0 0-3-3z M5.5 11.5a6.5 6.5 0 0 0 13 0 M12 18v2.5",
    heart: "M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6z",
    chat: "M4.5 5.5h15v10.5h-9.5l-5.5 4z",
    megaphone: "M3.5 10v4h3l7.5 4.5v-13L6.5 10z M17 9.2a4 4 0 0 1 0 5.6 M19.4 6.8a7.4 7.4 0 0 1 0 10.4",
    star: "M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z",
    chart: "M4.5 19.5h15 M7 16.5v-5 M12 16.5V7 M17 16.5v-8",
    film: "M4 5.5h16v13H4z M8 5.5v13 M16 5.5v13 M4 9.5h4 M4 14.5h4 M16 9.5h4 M16 14.5h4",
    hash: "M9.5 4L8 20 M16 4l-1.5 16 M4.5 9h15.5 M4 15h15.5",
    at: "M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z M15.5 12v1.3a2.3 2.3 0 0 0 4.6 0V12a8.1 8.1 0 1 0-3.2 6.5",
    pin: "M12 20.5s6.5-5.7 6.5-10.6A6.5 6.5 0 0 0 5.5 9.9c0 4.9 6.5 10.6 6.5 10.6z M12 12.3a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z",
    spark: "M12 3.5v4.5 M12 16v4.5 M3.5 12H8 M16 12h4.5 M6 6l3 3 M15 15l3 3 M6 18l3-3 M15 9l3-3",
    ring: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
    eye: "M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z",
    phone: "M7.5 3.5h9v17h-9z M10.5 17.5h3",
    arrow: "M5 12h14 M13 6l6 6-6 6",
}

function Icon(p: { name: string; size?: number; width?: number; className?: string }) {
    return (
        <svg className={p.className} width={p.size || 24} height={p.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.width || 1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICONS[p.name] || ICONS.spark} />
        </svg>
    )
}

/** The small spinning globe of the menu: the meridians turn like a planet. */
function MiniGlobe(p: { size?: number }) {
    return (
        <svg className="w3-mg" width={p.size || 26} height={p.size || 26} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="17" ry="6.2" strokeOpacity=".55" />
            {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} className="m" cx="20" cy="20" rx="17" ry="17" style={cssVars({ "--gd": -2.25 * k + "s" })} />
            ))}
        </svg>
    )
}

/* ─────────────────────────────── The globe ─────────────────────────────── */

type Tile = { lat: number; lon: number; w: number; h: number; kind: "photo" | "icon"; photo?: string; video?: boolean; icon?: string; tone?: string; label?: string; media?: Media }

/** Seven rings of tiles, 23° apart, so the globe reads round rather than faceted. */
const BANDS: [number, number][] = [
    [-69, 6],
    [-46, 11],
    [-23, 15],
    [0, 16],
    [23, 15],
    [46, 11],
    [69, 6],
]
const ICON_SET = ["play", "camera", "mic", "heart", "chat", "megaphone", "star", "chart", "film", "hash", "at", "pin", "ring", "eye", "spark", "phone"]
const LABELS: Record<string, string> = { play: "Reels", mic: "Podcast", heart: "1.2K", chat: "#collab", at: "@creator", hash: "Trending", ring: "Live ●", eye: "Views", film: "Shorts", megaphone: "Launch" }
const TONES = ["fog", "ink", "fog", "signal", "paper", "ink"]

function buildTiles(R: number, media: Media[]): Tile[] {
    const out: Tile[] = []
    let n = 0
    let ic = 0
    let ph = 0
    let md = 0
    BANDS.forEach(([lat, count], b) => {
        const ring = 2 * Math.PI * R * Math.cos((lat * Math.PI) / 180)
        const w = (ring / count) * 0.86
        const h = R * ((23 * Math.PI) / 180) * 0.86
        for (let i = 0; i < count; i++) {
            const lon = (360 / count) * i + (b % 2 ? 180 / count : 0)
            const isPhoto = n % 3 !== 1
            const t: Tile = { lat, lon, w, h, kind: isPhoto ? "photo" : "icon" }
            if (isPhoto) {
                if (md < media.length) t.media = media[md++]
                else t.photo = PHOTOS[ph++ % PHOTOS.length]
                t.video = n % 7 === 0
            } else {
                t.icon = ICON_SET[ic % ICON_SET.length]
                t.tone = TONES[ic % TONES.length]
                t.label = LABELS[t.icon]
                ic++
            }
            out.push(t)
            n++
        }
    })
    return out
}

function TileFace(p: { t: Tile; samples: boolean; still: boolean }) {
    const t = p.t
    if (t.kind === "icon") {
        return (
            <div className={"w3-f w3-ic"} data-tone={t.tone}>
                <Icon name={t.icon || "spark"} size={Math.max(14, Math.round(Math.min(t.w, t.h) * 0.3))} width={1.5} />
                {t.label && Math.min(t.w, t.h) > 70 ? <span>{t.label}</span> : null}
            </div>
        )
    }
    const m = t.media
    const src = m && m.src ? m.src : p.samples && t.photo ? SAMPLE + t.photo + ".jpg" : ""
    const isVideo = m && m.src ? m.type === "video" : false
    return (
        <div className="w3-f w3-ph">
            {src ? isVideo ? <video src={src} autoPlay={!p.still} muted loop playsInline preload="metadata" /> : <img src={src} alt="" decoding="async" draggable={false} /> : <b />}
            {t.video || isVideo ? (
                <i className="w3-badge">
                    <Icon name="play" size={10} width={2} />
                    0:15
                </i>
            ) : null}
        </div>
    )
}

/* ─────────────────────────────── The pages ─────────────────────────────── */

type PageDef = { id: string; nav: string; title: string; tone: "ink" | "paper" | "signal"; icon: string }

const PAGES: PageDef[] = [
    { id: "why", nav: "About", title: "The why", tone: "ink", icon: "chat" },
    { id: "receipts", nav: "Numbers", title: "The receipts", tone: "paper", icon: "chart" },
    { id: "services", nav: "Services", title: "What we do", tone: "signal", icon: "spark" },
    { id: "work", nav: "Projects", title: "The work", tone: "ink", icon: "play" },
    { id: "talk", nav: "Contact", title: "Let’s talk", tone: "paper", icon: "at" },
]

function Top(p: { n: number; title: string; aside: string }) {
    return (
        <div className="w3-top">
            <span className="w3-lab">
                {String(p.n).padStart(2, "0")} — {p.title}
            </span>
            <span className="w3-lab w3-aside">{p.aside}</span>
        </div>
    )
}

function PageWhy() {
    return (
        <>
            <Top n={1} title="The why" aside="(psst… this site is our portfolio too)" />
            <h2 className="w3-big w3-r" style={cssVars({ "--d": "0s" })}>
                We didn’t start an agency.
                <br />
                <em>We started a conversation.</em>
            </h2>
            <div className="w3-why">
                <p className="w3-lead w3-r" style={cssVars({ "--d": ".08s" })}>
                    The feed is where India finds what to buy, watch and believe, and the people in it are creators. We built World Media to bring brands into those conversations as guests worth inviting back.
                </p>
                <ul className="w3-beliefs">
                    {[
                        ["Cast for trust", "Picked for the community they’ve built, not the follower count."],
                        ["Stories that stick", "Series and moments people follow, share and remember."],
                        ["Measured to the rupee", "Every campaign ends with numbers your finance team will read."],
                    ].map(([h, t], i) => (
                        <li key={h} className="w3-r" style={cssVars({ "--d": 0.14 + i * 0.06 + "s" })}>
                            <b>{h}</b>
                            <span>{t}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

function PageReceipts() {
    const stats = [
        ["[00]M+", "Views on the reels we’ve made"],
        ["[000]+", "Campaigns delivered"],
        ["[00]+", "Creators in our network"],
    ]
    return (
        <>
            <Top n={2} title="The receipts" aside="(numbers don’t lie. we checked twice.)" />
            <h2 className="w3-big w3-r">
                Proof,
                <br />
                <em>not promises.</em>
            </h2>
            <div className="w3-stats">
                {stats.map(([n, l], i) => (
                    <div key={l} className="w3-stat w3-r" style={cssVars({ "--d": i * 0.07 + "s" })}>
                        <strong>{n}</strong>
                        <span>{l}</span>
                    </div>
                ))}
            </div>
            <div className="w3-brands">
                <p className="w3-mid w3-r" style={cssVars({ "--d": ".2s" })}>
                    Some of India’s favourite brands,
                    <br />
                    already in our orbit.
                </p>
                <div className="w3-logos">
                    {["Coca-Cola", "Tinder", "OPPO", "Maaza"].map((b, i) => (
                        <span key={b} className="w3-logo w3-r" style={cssVars({ "--d": 0.24 + i * 0.05 + "s" })}>
                            <i>logo</i>
                            {b}
                        </span>
                    ))}
                    <span className="w3-logo w3-more w3-r" style={cssVars({ "--d": ".44s" })}>
                        + more
                    </span>
                </div>
            </div>
        </>
    )
}

function PageServices() {
    const list = [
        ["megaphone", "Influencer Marketing", "The right creator for the right brief, cast for trust.", "Our core"],
        ["film", "Production", "Reels, shoots and ad films made by our in-house crew.", ""],
        ["camera", "Studio", "A space to shoot, record and create, on call.", ""],
        ["star", "Talent Management", "Brand deals, a team and room to grow for creators.", ""],
        ["heart", "Social Media", "Calendars, posting and community, handled monthly.", ""],
    ]
    return (
        <>
            <Top n={3} title="What we do" aside="(six, if you count replying fast)" />
            <div className="w3-svc">
                <h2 className="w3-big w3-r">
                    Five things.
                    <br />
                    Done properly.
                </h2>
                <ol>
                    {list.map(([ic, h, t, tag], i) => (
                        <li key={h} className="w3-r" style={cssVars({ "--d": 0.06 + i * 0.06 + "s" })}>
                            <span className="w3-svi">
                                <Icon name={ic} size={20} />
                            </span>
                            <b>
                                {h}
                                {tag ? <i>{tag}</i> : null}
                            </b>
                            <span>{t}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </>
    )
}

function PageWork(p: { samples: boolean }) {
    const reels = [
        ["project-1", "[Campaign name]", "[Brand]"],
        ["project-2", "[Campaign name]", "[Brand]"],
        ["hello-1", "[Original IP]", "World Media"],
        ["project-4", "[Campaign name]", "[Brand]"],
        ["hello-2", "[Original IP]", "World Media"],
    ]
    return (
        <>
            <Top n={4} title="The work" aside="(sound on. trust us.)" />
            <h2 className="w3-big w3-r">
                Reels people
                <br />
                <em>actually stopped for.</em>
            </h2>
            <div className="w3-reels">
                {reels.map(([ph, name, brand], i) => (
                    <figure key={i} className="w3-reel w3-r" style={cssVars({ "--d": 0.08 + i * 0.06 + "s" })}>
                        <div className="w3-rv">
                            {p.samples ? <img src={SAMPLE + ph + ".jpg"} alt="" loading="lazy" decoding="async" /> : null}
                            <span className="w3-play">
                                <Icon name="play" size={16} width={2} />
                            </span>
                            <span className="w3-views">
                                <Icon name="eye" size={13} />
                                [0.0]M views
                            </span>
                        </div>
                        <figcaption>
                            <b>{name}</b>
                            <span>{brand}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </>
    )
}

function PageTalk(p: { email: string; phone: string }) {
    const roles = ["Video Editor", "Influencer Marketing Executive", "Talent Manager", "Influencer Marketing Manager", "Social Media Executive"]
    return (
        <>
            <Top n={5} title="Let’s talk" aside="(a real person replies within a day)" />
            <div className="w3-talk">
                <h2 className="w3-big w3-r">
                    Got a brand
                    <br />
                    <em>worth talking about?</em>
                </h2>
                <div className="w3-cta w3-r" style={cssVars({ "--d": ".1s" })}>
                    <a className="w3-btn" data-tone="ink" href={"mailto:" + p.email + "?subject=New%20brief"}>
                        I’m a brand <Icon name="arrow" size={18} />
                    </a>
                    <a className="w3-btn" data-tone="line" href={"mailto:" + p.email + "?subject=Creator%20application"}>
                        I’m a creator <Icon name="arrow" size={18} />
                    </a>
                </div>
            </div>
            <div className="w3-info">
                <dl className="w3-r" style={cssVars({ "--d": ".16s" })}>
                    <div>
                        <dt>Write to us</dt>
                        <dd>
                            <a href={"mailto:" + p.email}>{p.email}</a>
                        </dd>
                    </div>
                    <div>
                        <dt>Call us</dt>
                        <dd>
                            <a href={"tel:" + p.phone.replace(/[^+\d]/g, "")}>{p.phone}</a>
                        </dd>
                    </div>
                    <div>
                        <dt>Find us</dt>
                        <dd>New Friends Colony, New Delhi</dd>
                    </div>
                    <div>
                        <dt>Instagram</dt>
                        <dd>
                            <a href="https://www.instagram.com/worldmedia.co.in" target="_blank" rel="noreferrer">
                                @worldmedia.co.in
                            </a>
                        </dd>
                    </div>
                </dl>
                <div className="w3-hire w3-r" style={cssVars({ "--d": ".22s" })}>
                    <span className="w3-lab">We’re hiring</span>
                    <div>
                        {roles.map((r) => (
                            <a key={r} href={"mailto:" + p.email + "?subject=" + encodeURIComponent("Application: " + r)}>
                                {r}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function PageBody(p: { id: string; samples: boolean; email: string; phone: string }) {
    if (p.id === "why") return <PageWhy />
    if (p.id === "receipts") return <PageReceipts />
    if (p.id === "services") return <PageServices />
    if (p.id === "work") return <PageWork samples={p.samples} />
    return <PageTalk email={p.email} phone={p.phone} />
}

/* ─────────────────────────────── Styles ─────────────────────────────── */

const CSS = `
.w3{--paper:#FFFFFF;--fog:#F3F2EF;--fog2:#E7E5E0;--ink:#0B0B0B;--ink2:#191919;--signal:#EA5628;--mute:rgba(11,11,11,.56);
--ease:cubic-bezier(.16,1,.3,1);--disp:"Funnel Display","Helvetica Neue",Arial,sans-serif;--sans:"Funnel Sans","Helvetica Neue",Arial,sans-serif;--mono:"Geist Mono",ui-monospace,Menlo,monospace;
position:relative;width:100%;background:var(--paper);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
.w3 *,.w3 *::before,.w3 *::after{box-sizing:border-box}
.w3 :where(h1,h2,p,ul,ol,li,dl,dd,figure){margin:0;padding:0;list-style:none}
.w3 :where(a){color:inherit;text-decoration:none}
.w3 :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.w3 :focus-visible{outline:2px solid var(--signal);outline-offset:3px;border-radius:8px}
.w3 ::selection{background:var(--signal);color:var(--ink)}
.w3-lab{font-family:var(--mono);font-size:11.5px;line-height:1.3;letter-spacing:.06em;text-transform:uppercase}

/* the stage: sticky while the track scrolls past */
.w3-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.w3-still .w3-stage{position:relative}
.w3-word{position:absolute;left:0;right:0;top:var(--gy);translate:0 -52%;text-align:center;font-family:var(--disp);font-weight:600;font-size:min(19vw,30vh);line-height:.8;letter-spacing:-.06em;color:var(--fog);white-space:nowrap;pointer-events:none}
.w3-word span{color:var(--fog2)}
.w3-3d{position:absolute;inset:0;perspective:var(--P);perspective-origin:50% var(--gy);transform-style:preserve-3d;pointer-events:none}
.w3-o{position:absolute;left:50%;top:var(--gy);width:0;height:0;transform-style:preserve-3d}
.w3-world,.w3-spin{position:absolute;left:0;top:0;transform-style:preserve-3d;will-change:transform}
.w3-world{cursor:grab}
.w3-core{position:absolute;left:calc(var(--R) * -.97);top:calc(var(--R) * -.97);width:calc(var(--R) * 1.94);height:calc(var(--R) * 1.94);border-radius:50%;
background:radial-gradient(circle at 38% 30%,#FFFFFF,#F1EFEB 46%,#DCD9D3 100%);box-shadow:0 70px 140px -70px rgba(11,11,11,.38)}
.w3-tile{position:absolute;transform-style:preserve-3d;pointer-events:auto}
.w3-f,.w3-bk{position:absolute;inset:0;border-radius:10px;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.w3-f{transition:translate .5s var(--ease)}
.w3-tile:hover .w3-f{translate:0 0 18px}
.w3-bk{transform:rotateY(180deg);background:rgba(11,11,11,.07)}
.w3-ph{background:var(--fog2)}
.w3-ph img,.w3-ph video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.w3-ph b{position:absolute;inset:0;background:linear-gradient(120deg,var(--fog2),var(--fog))}
.w3-badge{position:absolute;left:6px;bottom:6px;display:inline-flex;align-items:center;gap:3px;padding:3px 6px 3px 4px;border-radius:99px;background:rgba(11,11,11,.62);color:#fff;font:500 9px/1 var(--mono);font-style:normal;letter-spacing:.04em;backdrop-filter:blur(4px)}
.w3-ic{display:grid;place-items:center;align-content:center;gap:6px}
.w3-ic span{font:500 8.5px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;opacity:.8}
.w3-ic[data-tone="fog"]{background:var(--fog);color:var(--ink)}
.w3-ic[data-tone="paper"]{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1px rgba(11,11,11,.1)}
.w3-ic[data-tone="ink"]{background:var(--ink);color:#fff}
.w3-ic[data-tone="signal"]{background:var(--signal);color:var(--ink)}
.w3-orbit{position:absolute;left:calc(var(--R) * -1.3);top:calc(var(--R) * -1.3);width:calc(var(--R) * 2.6);height:calc(var(--R) * 2.6);border-radius:50%;border:1px solid rgba(11,11,11,.14);transform-style:preserve-3d}
.w3-orbit i{position:absolute;left:50%;top:-5px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:var(--signal);box-shadow:0 0 0 5px rgba(234,86,40,.18)}
.w3-veil{position:absolute;inset:0;background:var(--paper);opacity:0;pointer-events:none}
.w3-pages{z-index:1}

/* the pages */
.w3-pn{position:absolute;left:calc(var(--W) / -2);top:calc(var(--H) / -2);width:var(--W);height:var(--H);border-radius:28px;display:none;transform-origin:50% 50%;
backface-visibility:hidden;-webkit-backface-visibility:hidden;pointer-events:none;overflow:hidden;box-shadow:0 50px 100px -50px rgba(11,11,11,.45)}
.w3-pn.live{pointer-events:auto}
.w3-pn[data-tone="ink"]{background:var(--ink);color:#fff;--mute:rgba(255,255,255,.6);--hair:rgba(255,255,255,.16)}
.w3-pn[data-tone="paper"]{background:#fff;color:var(--ink);--hair:rgba(11,11,11,.12);box-shadow:inset 0 0 0 1px rgba(11,11,11,.08),0 50px 100px -50px rgba(11,11,11,.4)}
.w3-pn[data-tone="signal"]{background:var(--signal);color:var(--ink);--mute:rgba(11,11,11,.66);--hair:rgba(11,11,11,.2)}
.w3-cover{position:absolute;inset:0;display:grid;place-items:center}
.w3-pg{position:absolute;inset:0;container-type:inline-size;padding:clamp(20px,3.2cqw,46px);display:flex;flex-direction:column;justify-content:space-between;gap:clamp(14px,2.4cqw,32px)}
.w3-top{display:flex;justify-content:space-between;gap:16px;color:var(--mute)}
.w3-pn[data-tone="signal"] .w3-top{color:var(--ink)}
.w3-big{font-family:var(--disp);font-weight:500;font-size:clamp(34px,7.2cqw,108px);line-height:.92;letter-spacing:-.05em;text-wrap:balance}
.w3-big em{font-style:normal;color:var(--signal)}
.w3-pn[data-tone="signal"] .w3-big em{color:#fff}
.w3-mid{font-family:var(--disp);font-weight:500;font-size:clamp(20px,2.4cqw,34px);line-height:1.04;letter-spacing:-.035em}
.w3-lead{font-size:clamp(15px,1.45cqw,19px);line-height:1.45;color:var(--mute);max-width:46ch}
.w3-r{opacity:0;translate:0 26px;transition:opacity .9s var(--ease),translate 1s var(--ease);transition-delay:var(--d,0s)}
.w3-pn.on .w3-r,.w3-still .w3-r{opacity:1;translate:0 0}
.w3-why{display:grid;grid-template-columns:1fr 1.25fr;gap:clamp(20px,4cqw,64px);align-items:end}
.w3-beliefs{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,1.6cqw,22px)}
.w3-beliefs li{display:flex;flex-direction:column;gap:8px;padding-top:14px;border-top:1px solid var(--hair)}
.w3-beliefs b{font-family:var(--disp);font-weight:500;font-size:clamp(17px,1.7cqw,23px);letter-spacing:-.02em}
.w3-beliefs span{font-size:14px;line-height:1.4;color:var(--mute)}
.w3-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2cqw,28px)}
.w3-stat{display:flex;flex-direction:column;gap:10px;padding-top:16px;border-top:1px solid var(--hair)}
.w3-stat strong{font-family:var(--disp);font-weight:500;font-size:clamp(40px,6cqw,88px);line-height:.9;letter-spacing:-.055em}
.w3-stat span{font-size:14.5px;color:var(--mute)}
.w3-brands{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.w3-logos{display:flex;flex-wrap:wrap;gap:8px}
.w3-logo{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:128px;height:64px;padding:0 20px;border-radius:14px;background:var(--fog);font-family:var(--disp);font-weight:600;font-size:19px;letter-spacing:-.02em}
.w3-logo i{position:absolute;top:6px;right:8px;font:500 8.5px/1 var(--mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.w3-more{background:none;box-shadow:inset 0 0 0 1px var(--hair);color:var(--mute);font-weight:500}
.w3-svc{display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(20px,4cqw,64px);align-items:end;flex:1}
.w3-svc ol{display:flex;flex-direction:column}
.w3-svc li{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:16px;row-gap:2px;padding:clamp(10px,1.2cqw,16px) 0;border-top:1px solid var(--hair)}
.w3-svi{grid-row:span 2;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--signal)}
.w3-svc b{font-family:var(--disp);font-weight:500;font-size:clamp(19px,2cqw,27px);letter-spacing:-.03em;display:flex;align-items:center;gap:10px}
.w3-svc b i{font:500 9.5px/1 var(--mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:99px;background:var(--ink);color:#fff}
.w3-svc li>span:last-child{font-size:14.5px;color:var(--mute)}
.w3-reels{display:grid;grid-template-columns:repeat(5,1fr);gap:clamp(8px,1.2cqw,16px)}
.w3-reel{display:flex;flex-direction:column;gap:10px;min-width:0}
.w3-rv{position:relative;aspect-ratio:9/13;border-radius:16px;overflow:hidden;background:var(--ink2)}
.w3-rv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:scale .8s var(--ease)}
.w3-reel:hover .w3-rv img{scale:1.06}
.w3-play{position:absolute;left:50%;top:50%;translate:-50% -50%;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.92);color:var(--ink)}
.w3-views{position:absolute;left:8px;bottom:8px;display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:99px;background:rgba(11,11,11,.6);font:500 10.5px/1 var(--mono);letter-spacing:.03em;color:#fff;backdrop-filter:blur(6px)}
.w3-reel figcaption{display:flex;flex-direction:column;gap:2px;font-size:13.5px}
.w3-reel figcaption span{color:var(--mute)}
.w3-talk{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.w3-cta{display:flex;flex-direction:column;gap:8px;min-width:240px}
.w3-btn{display:flex;align-items:center;justify-content:space-between;gap:24px;height:58px;padding:0 22px 0 26px;border-radius:99px;font-family:var(--disp);font-weight:500;font-size:18px;letter-spacing:-.02em;transition:background-color .3s,color .3s}
.w3-btn[data-tone="ink"]{background:var(--ink);color:#fff}
.w3-btn[data-tone="ink"]:hover{background:var(--signal);color:var(--ink)}
.w3-btn[data-tone="line"]{box-shadow:inset 0 0 0 1.5px var(--ink)}
.w3-btn[data-tone="line"]:hover{background:var(--ink);color:#fff}
.w3-btn svg{transition:translate .4s var(--ease)}
.w3-btn:hover svg{translate:4px 0}
.w3-info{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(16px,3cqw,48px);align-items:end}
.w3-info dl{display:grid;grid-template-columns:repeat(4,auto);gap:16px 28px;justify-content:start}
.w3-info dt{font:500 11px/1.3 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-bottom:6px}
.w3-info dd{margin:0;font-size:15px}
.w3-info dd a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .4s var(--ease)}
.w3-info dd a:hover{background-size:100% 1px}
.w3-hire{display:flex;flex-direction:column;gap:10px;padding:16px 18px;border-radius:18px;background:var(--fog)}
.w3-hire .w3-lab{display:flex;align-items:center;gap:8px;color:var(--ink)}
.w3-hire .w3-lab::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--signal);box-shadow:0 0 0 4px rgba(234,86,40,.2)}
.w3-hire div{display:flex;flex-wrap:wrap;gap:6px}
.w3-hire a{padding:7px 11px;border-radius:99px;background:#fff;font-size:13px;box-shadow:inset 0 0 0 1px rgba(11,11,11,.1);transition:background-color .3s,color .3s}
.w3-hire a:hover{background:var(--ink);color:#fff}

/* the landing */
.w3-land{position:absolute;inset:0;pointer-events:none}
.w3-head{position:absolute;left:clamp(16px,2.6vw,40px);bottom:clamp(28px,5vh,56px);font-family:var(--disp);font-weight:500;font-size:clamp(40px,5.6vw,92px);line-height:.92;letter-spacing:-.05em}
.w3-head em{font-style:normal;color:var(--signal)}
.w3-side{position:absolute;right:clamp(16px,2.6vw,40px);bottom:clamp(28px,5vh,56px);display:flex;flex-direction:column;align-items:flex-end;gap:16px;max-width:300px;text-align:right;pointer-events:auto}
.w3-side p{font-size:15px;line-height:1.45;color:var(--mute)}
.w3-side div{display:flex;gap:6px}
.w3-pill{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:99px;font-weight:500;font-size:14.5px;transition:background-color .3s,color .3s}
.w3-pill[data-tone="ink"]{background:var(--ink);color:#fff}
.w3-pill[data-tone="ink"]:hover{background:var(--signal);color:var(--ink)}
.w3-pill[data-tone="line"]{box-shadow:inset 0 0 0 1px rgba(11,11,11,.25)}
.w3-pill[data-tone="line"]:hover{background:var(--ink);color:#fff}

/* the orbit index */
.w3-idx{position:absolute;right:clamp(12px,1.6vw,24px);top:50%;translate:0 -50%;display:flex;flex-direction:column;gap:4px;opacity:0;transition:opacity .5s}
.w3-idx.on{opacity:1}
.w3-idx button{display:flex;align-items:center;justify-content:flex-end;gap:10px;height:28px;color:var(--mute);pointer-events:auto}
.w3-idx button span{font:500 10.5px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;opacity:0;translate:6px 0;transition:opacity .3s,translate .3s var(--ease)}
.w3-idx button i{width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px currentColor;transition:background-color .3s,scale .3s}
.w3-idx button:hover span{opacity:1;translate:0 0}
.w3-idx button[aria-current]{color:var(--ink)}
.w3-idx button[aria-current] i{background:var(--signal);box-shadow:none;scale:1.3}

/* the menu */
.w3-nav{position:fixed;top:0;left:0;right:0;z-index:2147482000;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(12px,1.4vw,20px) clamp(16px,2.6vw,40px);pointer-events:none;font-family:var(--sans);color:var(--ink)}
.w3-still .w3-nav{position:absolute}
.w3-brand{display:inline-flex;align-items:center;gap:10px;padding:4px 16px 4px 4px;border-radius:99px;background:rgba(255,255,255,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px rgba(11,11,11,.08);pointer-events:auto;font-family:var(--disp);font-weight:600;font-size:21px;letter-spacing:-.04em}
.w3-brand .ic{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--signal)}
.w3-brand .ic svg.w3-prog{position:absolute;inset:-4px;width:52px;height:52px;rotate:-90deg}
.w3-brand b{font-weight:600}
.w3-brand b span{color:var(--signal)}
.w3-mg .m{transform-box:fill-box;transform-origin:50% 50%;animation:w3mer 9s linear infinite;animation-delay:var(--gd,0s)}
@keyframes w3mer{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
.w3-links{display:flex;align-items:center;gap:4px;padding:4px;border-radius:99px;background:rgba(255,255,255,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px rgba(11,11,11,.08);pointer-events:auto}
.w3-links button{height:38px;padding:0 15px;border-radius:99px;font-size:14px;font-weight:500;transition:background-color .3s,color .3s}
.w3-links button:hover{background:var(--fog)}
.w3-links button[aria-current]{background:var(--ink);color:#fff}
.w3-links button.cta{background:var(--signal);color:var(--ink)}
.w3-links button.cta:hover{background:var(--ink);color:#fff}
.w3-menu{display:none;pointer-events:auto}
.w3-sheet{position:fixed;top:72px;left:12px;right:12px;z-index:2147482001;display:flex;flex-direction:column;padding:8px;border-radius:22px;background:#fff;box-shadow:0 30px 80px -30px rgba(11,11,11,.45),inset 0 0 0 1px rgba(11,11,11,.06)}
.w3-sheet button{display:flex;justify-content:space-between;align-items:center;height:54px;padding:0 16px;border-radius:14px;font-family:var(--disp);font-weight:500;font-size:22px;letter-spacing:-.03em}
.w3-sheet button:hover{background:var(--fog)}
@media (max-width:820px){
.w3-links{display:none}.w3-menu{display:inline-flex}
.w3-head{left:16px;right:16px;bottom:92px;font-size:clamp(38px,11vw,64px)}
.w3-side{left:16px;right:16px;bottom:22px;align-items:stretch;text-align:left;max-width:none}
.w3-side p{display:none}.w3-side div>*{flex:1;justify-content:center}
.w3-idx button span{display:none}
}
@container (max-width:760px){
.w3-why,.w3-svc,.w3-info{grid-template-columns:1fr}
.w3-beliefs{grid-template-columns:1fr;gap:10px}.w3-beliefs li{padding-top:10px}.w3-beliefs span{font-size:13px}
.w3-stats{grid-template-columns:1fr;gap:6px}.w3-stat{flex-direction:row;align-items:baseline;gap:14px;padding-top:10px}.w3-stat strong{font-size:44px}
.w3-logo{min-width:0;height:48px;padding:0 14px;font-size:15px}
.w3-svi{width:34px;height:34px}.w3-svi svg{width:16px;height:16px}.w3-svc li{column-gap:12px;padding:8px 0}.w3-svc li>span:last-child{font-size:12.5px}
.w3-reels{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -20px;padding:0 20px;scroll-padding:0 20px;scrollbar-width:none}
.w3-reel{flex:0 0 46%;scroll-snap-align:start}
.w3-cta{width:100%}.w3-btn{height:50px;font-size:16px}
.w3-info dl{grid-template-columns:1fr 1fr;gap:10px 16px}.w3-info dd{font-size:13.5px}
.w3-aside{display:none}
}
.w3-flat{display:flex;flex-direction:column;gap:14px;padding:14px}
.w3-flatpn.w3-pn{position:relative;display:block;left:auto;top:auto;width:auto;height:auto;min-height:min(780px,92vh)}
.w3-flatpn .w3-pg{position:relative;min-height:inherit;opacity:1}
@media (prefers-reduced-motion:reduce){.w3 *{transition:none!important;animation:none!important}}
`

/* ─────────────────────────────── The component ─────────────────────────────── */

const N = PAGES.length
const LAND = 0.7 // screens of scroll spent on the landing
const SEG = 2.6 // screens of scroll for each page: rise out of the globe, hold, roll back in
const TOTAL = LAND + N * SEG - 0.2 * SEG

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W3Globe(props: Props) {
    const { media = [], samples = true, email = "social@worldmedia.co.in", phone = "+91 88000 40301", style } = props
    const isStatic = useIsStaticRenderer()
    const [reduce, setReduce] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [size, setSize] = React.useState({ w: 1440, h: 900 })

    const rootRef = React.useRef<HTMLDivElement>(null)
    const stageRef = React.useRef<HTMLDivElement>(null)
    const worldRef = React.useRef<HTMLDivElement>(null)
    const spinRef = React.useRef<HTMLDivElement>(null)
    const orbitRef = React.useRef<HTMLDivElement>(null)
    const veilRef = React.useRef<HTMLDivElement>(null)
    const landRef = React.useRef<HTMLDivElement>(null)
    const wordRef = React.useRef<HTMLDivElement>(null)
    const idxRef = React.useRef<HTMLDivElement>(null)
    const progRef = React.useRef<SVGCircleElement>(null)
    const panels = React.useRef<(HTMLDivElement | null)[]>([])
    const covers = React.useRef<(HTMLDivElement | null)[]>([])
    const bodies = React.useRef<(HTMLDivElement | null)[]>([])
    const navBtns = React.useRef<(HTMLButtonElement | null)[]>([])
    const idxBtns = React.useRef<(HTMLButtonElement | null)[]>([])

    const still = isStatic || reduce

    // Sizes: the globe's radius, the perspective, and the size of a page.
    React.useEffect(() => {
        if (isStatic) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const read = () => React.startTransition(() => setSize({ w: window.innerWidth, h: window.innerHeight }))
        const onMq = () => React.startTransition(() => setReduce(mq.matches))
        read()
        onMq()
        React.startTransition(() => setMounted(true))
        window.addEventListener("resize", read)
        mq.addEventListener("change", onMq)
        return () => {
            window.removeEventListener("resize", read)
            mq.removeEventListener("change", onMq)
        }
    }, [isStatic])

    const phoneW = size.w <= 820
    const R = Math.round(phoneW ? Math.min(size.w * 0.46, size.h * 0.29) : Math.min(size.h * 0.34, size.w * 0.27))
    const P = phoneW ? 1100 : 1700
    const gy = phoneW ? "38%" : "46%"
    const W = phoneW ? size.w - 20 : Math.min(1240, size.w - 2 * Math.max(56, size.w * 0.04))
    const navH = phoneW ? 68 : 84
    const H = phoneW ? Math.min(size.h - navH - 10, 720) : Math.min(800, size.h - navH - 14)
    // The globe's centre, and how far a page drops from it to sit just under the menu.
    const gyPx = size.h * (phoneW ? 0.38 : 0.46)
    const dy = Math.round(navH + (size.h - navH - H) / 2 + H / 2 - gyPx)

    const items: Media[] = React.useMemo(
        () => (media || []).filter(Boolean).map((src) => ({ src, type: /\.(mp4|webm|mov)(\?|$)/i.test(src) ? "video" : "image" })),
        [media]
    )
    const tiles = React.useMemo(() => buildTiles(R, items), [R, items])
    const front = tiles.find((t) => t.lat === 0) || tiles[0]

    // The motion: one loop reads the scroll and moves the globe, the pages and the menu.
    const state = React.useRef({ cur: 0, rot: 18, vel: 0, drag: false, px: 0, last: 0, onIdx: -2 })
    React.useEffect(() => {
        if (still || !mounted) return
        const root = rootRef.current
        if (!root) return
        const s = state.current
        let raf = 0
        let visible = true
        const vhPx = () => window.innerHeight
        const frame = (now: number) => {
            raf = 0
            const dt = s.last ? Math.min(64, now - s.last) : 16.7
            s.last = now
            const vh = vhPx()
            const rect = root.getBoundingClientRect()
            const target = clamp(-rect.top / vh, 0, TOTAL)
            s.cur += (target - s.cur) * (1 - Math.pow(0.87, dt / 16.7))
            if (Math.abs(target - s.cur) < 0.0005) s.cur = target
            const u = s.cur

            // Which page is on, and how far through it.
            let k = -1
            let t = 0
            if (u > LAND) {
                k = Math.min(N - 1, Math.floor((u - LAND) / SEG))
                t = (u - LAND - k * SEG) / SEG
            }
            let lift = 0
            let theta = 0
            let turn = 0
            if (k >= 0) {
                const enter = clamp(t / 0.32)
                const exit = k === N - 1 ? 0 : clamp((t - 0.68) / 0.32)
                theta = -78 * (1 - easeOut(enter)) + 78 * easeInOut(exit)
                lift = Math.min(smooth((enter - 0.26) / 0.74), 1 - smooth(exit / 0.72))
                turn = 0.5 * easeInOut(enter) + 0.5 * easeInOut(exit)
            }

            // The globe turns on its own, with a drag, and a fifth of a turn for every page.
            if (!s.drag) {
                s.rot += s.vel
                s.vel *= Math.pow(0.93, dt / 16.7)
            }
            s.rot += dt * 0.0045 * (1 - lift)
            const rot = s.rot + 72 * (Math.max(0, k) + turn) + (k < 0 ? u * 40 : 0)
            const recede = lift
            const worldZ = -900 * recede
            if (worldRef.current) worldRef.current.style.transform = `translateZ(${worldZ.toFixed(1)}px)`
            if (spinRef.current) spinRef.current.style.transform = `rotateX(-14deg) rotateY(${rot.toFixed(2)}deg)`
            if (orbitRef.current) orbitRef.current.style.transform = `rotateX(76deg) rotateY(-8deg) rotateZ(${(-rot * 1.6).toFixed(2)}deg)`
            if (veilRef.current) veilRef.current.style.opacity = (0.6 * recede).toFixed(3)

            // The landing steps back as soon as the globe starts to turn.
            const fade = smooth((u - 0.12) / 0.5)
            if (landRef.current) {
                landRef.current.style.opacity = (1 - fade).toFixed(3)
                landRef.current.style.transform = `translateY(${(fade * 30).toFixed(1)}px)`
                landRef.current.style.visibility = fade > 0.99 ? "hidden" : "visible"
            }
            if (wordRef.current) wordRef.current.style.opacity = (1 - Math.max(fade * 0.7, recede)).toFixed(3)

            // The page: it rides the globe's surface from the left edge to the front, lifts off
            // towards you while the globe sinks back, then rolls on into the right edge.
            panels.current.forEach((el, i) => {
                if (!el) return
                const on = i === k && (t > 0 || k === 0) && !(k < N - 1 && t >= 1)
                if (!on) {
                    if (el.style.display !== "none") el.style.display = "none"
                    el.classList.remove("on", "live")
                    return
                }
                el.style.display = "block"
                const l = easeInOut(lift)
                const r = R + (-worldZ - R) * l
                const sx = front.w / W + (1 - front.w / W) * l
                const sy = front.h / H + (1 - front.h / H) * l
                el.style.transform =
                    lift > 0.999 && Math.abs(theta) < 0.01
                        ? `translateY(${dy}px)`
                        : `translateY(${(dy * l).toFixed(1)}px) translateZ(${worldZ.toFixed(1)}px) rotateY(${theta.toFixed(2)}deg) translateZ(${r.toFixed(1)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})`
                el.style.borderRadius = `${(12 / Math.min(sx, sy)) * (1 - l) + 28 * l}px`
                const show = clamp((lift - 0.62) / 0.3)
                const c = covers.current[i]
                const b = bodies.current[i]
                if (c) c.style.opacity = (1 - show).toFixed(3)
                if (b) b.style.opacity = show.toFixed(3)
                el.classList.toggle("on", lift > 0.8)
                el.classList.toggle("live", lift > 0.92)
            })

            // The menu and the index follow the page in front.
            const cur = k >= 0 && lift > 0.5 ? k : -1
            if (cur !== s.onIdx) {
                s.onIdx = cur
                navBtns.current.forEach((b, i) => b && (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")))
                idxBtns.current.forEach((b, i) => b && (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")))
            }
            if (idxRef.current) idxRef.current.classList.toggle("on", u > LAND * 0.8)
            if (progRef.current) progRef.current.style.strokeDashoffset = (151 * (1 - u / TOTAL)).toFixed(1)

            if (visible || Math.abs(s.vel) > 0.01) raf = requestAnimationFrame(frame)
        }
        const kick = () => {
            if (!raf) {
                s.last = 0
                raf = requestAnimationFrame(frame)
            }
        }
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible) kick()
        })
        io.observe(root)
        kick()
        return () => {
            io.disconnect()
            if (raf) cancelAnimationFrame(raf)
        }
    }, [still, mounted, R, W, H, dy, front])

    // Drag the globe to spin it (sideways; up and down still scrolls the page).
    const onDown = (e: React.PointerEvent) => {
        if (still || (e.target as HTMLElement).closest(".w3-pn,.w3-side,a,button")) return
        const s = state.current
        s.drag = true
        s.px = e.clientX
        s.vel = 0
    }
    React.useEffect(() => {
        if (still) return
        const s = state.current
        const move = (e: PointerEvent) => {
            if (!s.drag) return
            const dx = e.clientX - s.px
            s.px = e.clientX
            s.rot += dx * 0.22
            s.vel = dx * 0.16
        }
        const up = () => {
            s.drag = false
        }
        window.addEventListener("pointermove", move, { passive: true })
        window.addEventListener("pointerup", up)
        window.addEventListener("pointercancel", up)
        return () => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            window.removeEventListener("pointercancel", up)
        }
    }, [still])

    // The menu sends the globe round to a page: to the middle of its hold.
    const go = React.useCallback(
        (i: number) => {
            React.startTransition(() => setOpen(false))
            const root = rootRef.current
            if (!root) return
            if (still) {
                const el = document.getElementById("w3-" + (i < 0 ? "top" : PAGES[i].id))
                if (el) el.scrollIntoView({ behavior: "smooth" })
                return
            }
            const top = root.getBoundingClientRect().top + window.scrollY
            const u = i < 0 ? 0 : LAND + i * SEG + 0.5 * SEG
            window.scrollTo({ top: top + u * window.innerHeight, behavior: "smooth" })
        },
        [still]
    )

    const navItems: [string, number][] = [
        ["About", 0],
        ["Services", 2],
        ["Projects", 3],
        ["Contact", 4],
    ]

    const nav = (
        <nav className="w3-nav" aria-label="Main">
            <button type="button" className="w3-brand" onClick={() => go(-1)} aria-label="World Media, back to the globe">
                <span className="ic">
                    <MiniGlobe size={26} />
                    <svg className="w3-prog" viewBox="0 0 52 52" aria-hidden="true">
                        <circle cx="26" cy="26" r="24" fill="none" stroke="#EA5628" strokeWidth="2" strokeDasharray="151" strokeDashoffset="151" ref={progRef} strokeLinecap="round" />
                    </svg>
                </span>
                <b>
                    world media<span>.</span>
                </b>
            </button>
            <div className="w3-links">
                {navItems.map(([l, i]) => (
                    <button key={l} type="button" ref={(el) => (navBtns.current[i] = el)} onClick={() => go(i)}>
                        {l}
                    </button>
                ))}
                <button type="button" onClick={() => go(4)}>
                    Join us
                </button>
                <button type="button" className="cta" onClick={() => go(4)}>
                    Let’s talk
                </button>
            </div>
            <button type="button" className="w3-menu w3-pill" data-tone="ink" onClick={() => setOpen(!open)} aria-expanded={open}>
                {open ? "Close" : "Menu"}
            </button>
        </nav>
    )
    const sheet = open ? (
        <div className="w3 w3-sheet" role="dialog" aria-label="Menu">
            {[...navItems, ["Join us", 4] as [string, number], ["Let’s talk", 4] as [string, number]].map(([l, i]) => (
                <button key={l} type="button" onClick={() => go(i)}>
                    {l}
                    <Icon name="arrow" size={20} />
                </button>
            ))}
        </div>
    ) : null

    const globe = (
        <div className="w3-3d">
            <div className="w3-o">
                <div className="w3-world" ref={worldRef}>
                    <div className="w3-core" />
                    <div className="w3-spin" ref={spinRef} style={{ transform: "rotateX(-14deg) rotateY(18deg)" }}>
                        {tiles.map((t, i) => (
                            <div
                                key={i}
                                className="w3-tile"
                                style={{ width: t.w, height: t.h, left: -t.w / 2, top: -t.h / 2, transform: `rotateY(${t.lon.toFixed(2)}deg) rotateX(${t.lat}deg) translateZ(${R}px)` }}
                            >
                                <TileFace t={t} samples={samples} still={still} />
                                <div className="w3-bk" />
                            </div>
                        ))}
                    </div>
                    <div className="w3-orbit" ref={orbitRef} style={{ transform: "rotateX(76deg) rotateY(-8deg)" }}>
                        <i />
                    </div>
                </div>
            </div>
        </div>
    )

    // The pages sit in a 3D layer of their own above the globe, with the same perspective, so a
    // page that has left the globe can never be cut by it.
    const pageLayer = still ? null : (
        <>
            <div className="w3-veil" ref={veilRef} />
            <div className="w3-3d w3-pages">
                <div className="w3-o">
                    {PAGES.map((pg, i) => (
                          <div key={pg.id} className="w3-pn" data-tone={pg.tone} ref={(el) => (panels.current[i] = el)} aria-label={pg.title} role="region">
                              <div className="w3-cover" ref={(el) => (covers.current[i] = el)}>
                                  <Icon name={pg.icon} size={Math.round(Math.min(W, H) * 0.22)} width={1.2} />
                              </div>
                              <div className="w3-pg" ref={(el) => (bodies.current[i] = el)} style={{ opacity: 0 }}>
                                  <PageBody id={pg.id} samples={samples} email={email} phone={phone} />
                              </div>
                          </div>
                      ))}
                </div>
            </div>
        </>
    )

    const vars = cssVars({ "--R": R + "px", "--P": P + "px", "--gy": gy, "--W": W + "px", "--H": H + "px" })

    return (
        <div ref={rootRef} className={"w3" + (still ? " w3-still" : "")} style={{ ...style, ...vars, height: still ? "auto" : `calc(${(TOTAL + 1) * 100}vh)` }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            <div className="w3-stage" ref={stageRef} id="w3-top" onPointerDown={onDown}>
                <div className="w3-word" ref={wordRef} aria-hidden="true">
                    world media<span>.</span>
                </div>
                {globe}
                {pageLayer}
                <div className="w3-land" ref={landRef}>
                    <h1 className="w3-head">
                        Culture moves
                        <br />
                        <em>through people.</em>
                    </h1>
                    <div className="w3-side">
                        <p>A creator-first media agency from New Delhi. We put brands where the conversation already is.</p>
                        <div>
                            <a className="w3-pill" data-tone="ink" href={"mailto:" + email + "?subject=New%20campaign"}>
                                Start a campaign
                            </a>
                            <a className="w3-pill" data-tone="line" href={"mailto:" + email + "?subject=Creator%20application"}>
                                I’m a creator
                            </a>
                        </div>
                    </div>
                </div>
                <div className="w3-idx" ref={idxRef}>
                    {PAGES.map((pg, i) => (
                        <button key={pg.id} type="button" ref={(el) => (idxBtns.current[i] = el)} onClick={() => go(i)} aria-label={"Go to " + pg.title}>
                            <span>
                                {String(i + 1).padStart(2, "0")} {pg.title}
                            </span>
                            <i />
                        </button>
                    ))}
                </div>
                {still ? nav : null}
            </div>
            {still ? (
                <div className="w3-flat">
                    {PAGES.map((pg) => (
                        <section key={pg.id} id={"w3-" + pg.id} className="w3-pn w3-flatpn" data-tone={pg.tone} aria-label={pg.title}>
                            <div className="w3-pg">
                                <PageBody id={pg.id} samples={samples} email={email} phone={phone} />
                            </div>
                        </section>
                    ))}
                </div>
            ) : null}
            {!still && mounted ? createPortal(<div className="w3">{nav}{sheet}</div>, document.body) : null}
        </div>
    )
}

addPropertyControls(W3Globe, {
    media: {
        type: ControlType.Array,
        title: "Globe media",
        control: { type: ControlType.File, allowedFileTypes: ["mp4", "webm", "mov", "jpg", "jpeg", "png", "webp"] },
        description: "Videos and photos for the globe's tiles, in order. Empty tiles show samples.",
    },
    samples: { type: ControlType.Boolean, title: "Sample photos", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 88000 40301" },
})
