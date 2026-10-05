// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the footer. A thank-you for reading this far, the name set huge with a small
// spinning globe for the "o", the menu again, and the small print.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion } from "framer-motion"

/* ───────────────────────── WORLD MEDIA · ONE-PAGE SYSTEM ─────────────────────────
   Shared tokens and helpers for the single-page World Media site. Framer code components
   must each be one self-contained file, so every section carries its own copy of what it
   uses. The rules live in @layer w2-base, so a section's own CSS always wins, and every
   class starts with w2- so this page never collides with the first site's components.
   Reveals animate opacity and the translate property only; transform stays free.
   Colours follow the deck: white first, black second, one orange-red accent.
   white #FFFFFF · grey #F3F3F3 · black #0A0A0A · orange-red #EA5628
   Inter Tight (text and big type) · Instrument Serif italic (the odd word, for warmth)
   ─────────────────────────────────────────────────────────────────────────────── */

type Tone = "paper" | "ink"

const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap"

const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties

const BASE_CSS = `
@layer w2-base{
.w2{--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#0A0A0A;--ink2:#1C1C1C;--red:#EA5628;
--ease:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.7,0,.2,1);--r:clamp(18px,2.1cqw,30px);--m:clamp(8px,.9cqw,14px);--gut:clamp(18px,3.4cqw,52px);
position:relative;box-sizing:border-box;width:100%;container-type:inline-size;overflow:hidden;overflow:clip;
font-family:"Inter Tight","Helvetica Neue",Helvetica,Arial,sans-serif;font-weight:500;letter-spacing:-.012em;
-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
background:var(--bg);color:var(--fg)}
.w2[data-tone="paper"]{--bg:var(--paper);--fg:var(--ink);--mut:rgba(10,10,10,.62);--line:rgba(10,10,10,.12);--line2:rgba(10,10,10,.38)}
.w2[data-tone="ink"]{--bg:var(--ink);--fg:var(--paper);--mut:rgba(255,255,255,.58);--line:rgba(255,255,255,.16);--line2:rgba(255,255,255,.4)}
.w2 *,.w2 *::before,.w2 *::after{box-sizing:border-box}
.w2 :where(h1,h2,h3,h4,p,ul,ol,li,figure,blockquote){margin:0;padding:0;list-style:none}
.w2 :where(a){color:inherit;text-decoration:none}
.w2 :where(button){font:inherit;color:inherit;margin:0}
.w2 :where(a,button){touch-action:manipulation}
.w2 :where(.w2-mega,.w2-h1,.w2-h2,.w2-big,.w2-h3){text-wrap:balance}
.w2 ::selection{background:var(--red);color:var(--ink)}
.w2 :focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:10px}
.w2-it{font-family:"Instrument Serif",Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;letter-spacing:-.012em}
.w2-mega{font-size:clamp(62px,14.4cqw,232px);line-height:.88;letter-spacing:-.058em;font-weight:500}
.w2-h1{font-size:clamp(46px,8.2cqw,136px);line-height:.92;letter-spacing:-.05em;font-weight:500}
.w2-h2{font-size:clamp(34px,5cqw,80px);line-height:.98;letter-spacing:-.045em;font-weight:500}
.w2-big{font-size:clamp(26px,3.3cqw,54px);line-height:1.1;letter-spacing:-.035em;font-weight:500}
.w2-h3{font-size:clamp(21px,1.9cqw,28px);line-height:1.1;letter-spacing:-.03em;font-weight:500}
.w2-body{font-size:clamp(15px,1.12cqw,17px);line-height:1.5;letter-spacing:-.006em;font-weight:400}
.w2-small{font-size:13.5px;line-height:1.45;letter-spacing:-.004em;font-weight:400}
.w2-cap{font-size:12px;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;font-weight:500}
.w2-mut{color:var(--mut)}
.w2-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.w2-card{position:relative;border-radius:var(--r);overflow:hidden}
.w2-pill{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.5em;height:38px;padding:0 17px;border:0;border-radius:99px;
font-size:14px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;cursor:pointer;background:var(--pc);color:var(--pt);text-decoration:none;
-webkit-tap-highlight-color:transparent;transition:translate .45s var(--ease),background-color .4s,color .4s}
.w2-pill[data-hue="red"]{--pc:var(--red);--pt:var(--ink)}
.w2-pill[data-hue="ink"]{--pc:var(--ink);--pt:var(--paper)}
.w2-pill[data-hue="paper"],.w2-pill[data-hue="lime"],.w2-pill[data-hue="sky"],.w2-pill[data-hue="lilac"]{--pc:var(--paper);--pt:var(--ink);box-shadow:inset 0 0 0 1px var(--line2)}
.w2-roll{position:relative;display:inline-flex;overflow:hidden;line-height:1.2}
.w2-roll>span{display:block;transition:translate .5s var(--ease)}
.w2-roll>span+span{position:absolute;left:0;top:0;translate:0 105%}
a:hover>.w2-roll>span,button:hover>.w2-roll>span,a:focus-visible>.w2-roll>span,button:focus-visible>.w2-roll>span{translate:0 -105%}
a:hover>.w2-roll>span+span,button:hover>.w2-roll>span+span,a:focus-visible>.w2-roll>span+span,button:focus-visible>.w2-roll>span+span{translate:0 0}
.w2-lbl{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:12px;letter-spacing:.01em;font-weight:500}
.w2-lbl i{flex:1;height:1px;background:currentColor;opacity:.22}
.w2-w{display:inline-block;overflow:hidden;vertical-align:top;padding:.08em .06em .16em;margin:-.08em -.06em -.16em}
.w2-w>span{display:inline-block;translate:0 108%;transition:translate 1.05s var(--ease);transition-delay:var(--d,0s)}
.w2-in .w2-w>span,.w2-w.w2-in>span{translate:0 0}
.w2-rise{opacity:0;translate:0 30px;transition:opacity 1s var(--ease),translate 1.1s var(--ease);transition-delay:var(--d,0s)}
.w2-rise.w2-in,.w2-in>.w2-rise{opacity:1;translate:0 0}
.w2-fade{opacity:0;transition:opacity 1.1s var(--ease);transition-delay:var(--d,0s)}
.w2-fade.w2-in,.w2-in>.w2-fade{opacity:1}
.w2-media{position:relative;display:inline-block;vertical-align:-.06em;height:.78em;width:var(--mw,1.7em);margin:0 .1em}
.w2-media>i{position:absolute;inset:0;border-radius:99px;overflow:hidden;background:var(--mc,var(--paper2));
clip-path:inset(0 50% 0 50% round 99px);transition:clip-path 1.2s var(--ease-io);transition-delay:var(--d,0s)}
.w2-media.w2-in>i,.w2-in .w2-media>i{clip-path:inset(0 0 0 0 round 99px)}
.w2-media img,.w2-media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2-media b{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.42) 48%,transparent 66%) 0 0/250% 100%;animation:w2shine 4.8s var(--ease-io) infinite;animation-delay:var(--d,0s)}
.w2-globe{display:block;overflow:visible}
.w2-globe .m{transform-box:fill-box;transform-origin:50% 50%;animation:w2mer var(--gs,9s) linear infinite;animation-delay:var(--gd,0s)}
@media (prefers-reduced-motion:reduce){
.w2 *{transition:none!important;animation:none!important}
.w2-w>span,.w2-rise,.w2-fade{translate:none!important;opacity:1!important}
.w2-media>i{clip-path:none!important}}
}
@keyframes w2mer{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes w2shine{0%{background-position:120% 0}60%,100%{background-position:-60% 0}}
`

const NOJS_CSS = `.w2-w>span,.w2-rise,.w2-fade{translate:none!important;opacity:1!important}.w2-media>i{clip-path:none!important}.w2i{display:none!important}`

const noSub = () => () => {}

/**
 * True on Framer's canvas and for visitors who prefer reduced motion. The reduced-motion half
 * only applies once the page has hydrated, so the first client render matches the server HTML;
 * until then the prefers-reduced-motion CSS keeps everything still.
 */
function useStill(): boolean {
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const client = React.useSyncExternalStore(noSub, () => true, () => false)
    return isStatic || (client && !!reduce)
}

function Base() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            {/* Raw CSS: as text, React's server render would escape the quotes and break it before hydration. */}
            <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
            <noscript dangerouslySetInnerHTML={{ __html: "<style>" + NOJS_CSS + "</style>" }} />
        </>
    )
}

/** A section shell: tone, anchor id and the section's own CSS. */
function Section(p: { tone?: Tone; id?: string; className?: string; css?: string; label?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
    return (
        <section className={"w2 " + (p.className || "")} data-tone={p.tone || "paper"} id={p.id || undefined} aria-label={p.label} style={p.style}>
            <Base />
            {p.css ? <style dangerouslySetInnerHTML={{ __html: p.css }} /> : null}
            {p.children}
        </section>
    )
}

/** Adds w2-in once the element is in view (or straight away when still). */
function useReveal<T extends Element>(amount = 0.25): [React.RefObject<T>, string] {
    const ref = React.useRef<T>(null)
    const still = useStill()
    const seen = useInView(ref, { once: true, amount })
    return [ref, still || seen ? " w2-in" : ""]
}

/** Reveal wrapper: any element that fades and rises in when it reaches the viewport. */
function Reveal(p: { as?: any; className?: string; delay?: number; amount?: number; style?: React.CSSProperties; children?: React.ReactNode; id?: string }) {
    const [ref, on] = useReveal<HTMLElement>(p.amount ?? 0.2)
    const Tag = p.as || "div"
    return (
        <Tag ref={ref} id={p.id} className={(p.className || "w2-rise") + on} style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}>
            {p.children}
        </Tag>
    )
}

/** "(Services) ——— 02 / 05", the running section count. */
function Label(p: { name: string; index: number; total?: number; className?: string; style?: React.CSSProperties }) {
    const pad = (n: number) => String(n).padStart(2, "0")
    return (
        <div className={"w2-lbl " + (p.className || "")} style={p.style}>
            <span>({p.name})</span>
            <i aria-hidden="true" />
            <span>
                {pad(p.index)} / {pad(p.total || 5)}
            </span>
        </div>
    )
}

/** Hover label that rolls up to a fresh copy of itself. */
function Roll(p: { children: string }) {
    return (
        <span className="w2-roll">
            <span>{p.children}</span>
            <span aria-hidden="true">{p.children}</span>
        </span>
    )
}

/** An image or video set inline in big type, opening from the middle. Empty = a colour pill with a slow shine. */
function Media(p: { src?: string; video?: string; hue?: string; width?: string; alt?: string; delay?: number }) {
    const [ref, on] = useReveal<HTMLSpanElement>(0.5)
    const still = useStill()
    return (
        <span
            ref={ref}
            className={"w2-media" + on}
            aria-hidden={p.alt ? undefined : true}
            style={cssVars({ "--mw": p.width || "1.7em", "--mc": "var(--" + (p.hue || "paper2") + ")", "--d": (p.delay || 0) + "s" })}
        >
            <i>{p.video ? <video src={p.video} autoPlay={!still} muted loop playsInline /> : p.src ? <img src={p.src} alt={p.alt || ""} loading="lazy" width={320} height={150} /> : <b />}</i>
        </span>
    )
}

/** A small wireframe globe; the meridians turn like a spinning planet. */
function Globe(p: { size?: number; color?: string; speed?: number; width?: number; className?: string }) {
    const s = p.speed || 9
    const sw = p.width || 1.6
    return (
        <svg className={"w2-globe " + (p.className || "")} width={p.size || 24} height={p.size || 24} viewBox="0 0 40 40" fill="none" stroke={p.color || "currentColor"} strokeWidth={sw} aria-hidden="true">
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="17" ry="6.2" strokeOpacity=".55" />
            <path d="M3.6 14h32.8M3.6 26h32.8" strokeOpacity=".4" />
            {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} className="m" cx="20" cy="20" rx="17" ry="17" style={cssVars({ "--gs": s + "s", "--gd": (-s * k) / 4 + "s" })} />
            ))}
        </svg>
    )
}

type FootLink = { label: string; href: string }

type FooterProps = {
    thanks: string
    name: string
    links: FootLink[]
    copyright: string
    note: string
    style?: React.CSSProperties
}

const FOOT_CSS = `
.w2f-wrap{padding:clamp(28px,3cqw,48px) var(--gut) clamp(20px,2cqw,30px)}
.w2f-top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.w2f-thanks{font-size:clamp(18px,1.8cqw,28px);letter-spacing:-.03em;max-width:28ch}
.w2f-up.w2-pill svg{transition:translate .5s var(--ease)}
.w2f-up.w2-pill:hover svg{translate:0 -3px}
.w2f-name{display:flex;align-items:center;justify-content:center;margin:clamp(30px,4cqw,70px) 0 clamp(18px,2cqw,30px);font-size:clamp(64px,16.6cqw,268px);line-height:.86;letter-spacing:-.065em;white-space:nowrap}
.w2f-name .w2-w{padding-bottom:.12em}
.w2f-o{display:inline-flex;align-items:center;justify-content:center;width:.62em;height:.62em;margin:0 .02em;translate:0 .05em;color:var(--red)}
.w2f-o .w2-globe{width:100%;height:100%}
.w2f-dot{color:var(--red)}
.w2f-bot{display:flex;align-items:center;justify-content:space-between;gap:16px 28px;flex-wrap:wrap;padding-top:18px;border-top:1px solid var(--line);font-size:13px;color:var(--mut)}
.w2f-links{display:flex;flex-wrap:wrap;gap:6px 18px}
.w2f-links a{color:var(--paper);transition:color .3s}
.w2f-links a:hover{color:var(--red)}
.w2f-note{font-size:18px;color:var(--paper)}
@container (max-width:640px){.w2f-bot{flex-direction:column;align-items:flex-start}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Footer(props: FooterProps) {
    const {
        thanks = "Thanks for making it all the way down here.",
        name = "world media",
        links = [
            { label: "Services", href: "#services" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Join us", href: "#join" },
        ],
        copyright = "© 2026 World Media · Delhi, India",
        note = "psst… this site is our portfolio too",
        style,
    } = props
    const [ref, on] = useReveal<HTMLParagraphElement>(0.4)
    const toTop = (e: React.MouseEvent) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
    const pick = (href: string) => {
        if (href === "#join") window.dispatchEvent(new CustomEvent("w2:form", { detail: "creator" }))
        else if (href === "#contact") window.dispatchEvent(new CustomEvent("w2:form", { detail: "brand" }))
    }
    // The first "o" of the name becomes a turning globe.
    const chars = Array.from(name)
    const oAt = chars.findIndex((c) => c.toLowerCase() === "o")
    return (
        <Section tone="ink" className="w2f" css={FOOT_CSS} label="Footer" style={style}>
            <footer className="w2f-wrap">
                <div className="w2f-top">
                    <Reveal as="p" className="w2f-thanks w2-rise">
                        {thanks}
                    </Reveal>
                    <a className="w2-pill w2f-up" data-hue="paper" href="#top" onClick={toTop}>
                        <Roll>Back to the top</Roll>
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 13V1.5M1.5 6L6 1.5 10.5 6" />
                        </svg>
                    </a>
                </div>
                <p ref={ref} className={"w2f-name" + on} translate="no">
                    <span className="w2-sr">{name}.</span>
                    {chars.map((c, i) =>
                        i === oAt ? (
                            <span key={i} className="w2-w" aria-hidden="true">
                                <span style={cssVars({ "--d": (i * 0.04).toFixed(2) + "s" })}>
                                    <span className="w2f-o">
                                        <Globe size={100} speed={7} width={2.4} />
                                    </span>
                                </span>
                            </span>
                        ) : (
                            <span key={i} className="w2-w" aria-hidden="true">
                                <span style={cssVars({ "--d": (i * 0.04).toFixed(2) + "s" })}>{c === " " ? "\u00a0" : c}</span>
                            </span>
                        )
                    )}
                    <span className="w2-w" aria-hidden="true">
                        <span className="w2f-dot" style={cssVars({ "--d": (chars.length * 0.04).toFixed(2) + "s" })}>
                            .
                        </span>
                    </span>
                </p>
                <div className="w2f-bot">
                    <span>{copyright}</span>
                    <nav className="w2f-links" aria-label="Footer">
                        {links.map((l, i) => (
                            <a key={i} href={l.href} onClick={() => pick(l.href)}>
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <span className="w2f-note w2-it">{note}</span>
                </div>
            </footer>
        </Section>
    )
}

addPropertyControls(W2Footer, {
    thanks: { type: ControlType.String, title: "Thank-you", defaultValue: "Thanks for making it all the way down here." },
    name: { type: ControlType.String, title: "Name", defaultValue: "world media" },
    links: {
        type: ControlType.Array,
        title: "Links",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { label: "Services", href: "#services" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Join us", href: "#join" },
        ],
    },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: "© 2026 World Media · Delhi, India" },
    note: { type: ControlType.String, title: "Note", defaultValue: "psst… this site is our portfolio too" },
})
