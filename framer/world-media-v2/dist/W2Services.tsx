// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Services. A black "What we do" band, three columns (creators, content, growth)
// that read as one story from first idea to proof, and a light grey line to close.

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

/** Splits "plain *italic* plain" into words; *starred* words set in the serif italic. */
function parseWords(text: string): { t: string; it: boolean }[] {
    const out: { t: string; it: boolean }[] = []
    String(text || "")
        .split(/(\*[^*]+\*)/)
        .forEach((seg) => {
            if (!seg) return
            const it = seg.length > 2 && seg[0] === "*" && seg[seg.length - 1] === "*"
            const body = it ? seg.slice(1, -1) : seg
            body.split(/(\s+)/).forEach((w) => {
                if (w && !/^\s+$/.test(w)) out.push({ t: w, it })
            })
        })
    return out
}

/** Headline whose words rise out of a mask one after another. Use \n for a line break. */
function Words(p: { text: string; as?: any; className?: string; delay?: number; stagger?: number; style?: React.CSSProperties; id?: string }) {
    const [ref, on] = useReveal<HTMLElement>(0.3)
    const Tag = p.as || "h2"
    const st = p.stagger ?? 0.05
    let i = 0
    const lines = String(p.text || "").split("\n")
    return (
        <Tag ref={ref} id={p.id} className={(p.className || "") + on} style={p.style}>
            {lines.map((line, li) => (
                <React.Fragment key={li}>
                    {li ? <br /> : null}
                    {parseWords(line).map((w, wi, arr) => {
                        const d = (p.delay || 0) + i++ * st
                        return (
                            <React.Fragment key={wi}>
                                <span className={"w2-w" + (w.it ? " w2-it" : "")}>
                                    <span style={cssVars({ "--d": d.toFixed(3) + "s" })}>{w.t}</span>
                                </span>
                                {wi < arr.length - 1 ? " " : null}
                            </React.Fragment>
                        )
                    })}
                </React.Fragment>
            ))}
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

type Service = { title: string; lead: string; items: string; shape: "circle" | "square" | "triangle" }

type ServicesProps = {
    first: boolean
    banner: string
    services: Service[]
    closing: string
    style?: React.CSSProperties
}

const SERV_CSS = `
.w2s-wrap{padding:clamp(48px,6cqw,96px) var(--gut) var(--m)}
.w2s-first .w2s-wrap{padding-top:clamp(72px,8cqw,128px)}
.w2s-band{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:clamp(66px,6.4cqw,104px);padding:0 clamp(22px,2.6cqw,40px);border-radius:99px;background:var(--ink);color:var(--paper)}
.w2s-band :is(h1,h2){font-size:clamp(30px,3.6cqw,58px);line-height:1;letter-spacing:-.045em;text-align:center}
.w2s-chev{display:flex;gap:clamp(6px,.7cqw,12px)}
.w2s-chev svg{width:clamp(14px,1.3cqw,20px);height:auto;animation:w2sC 2.2s var(--ease) infinite;animation-delay:calc(var(--i) * .14s)}
@keyframes w2sC{0%,55%,100%{translate:0 0}25%{translate:0 5px}}
.w2s-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--m);margin-top:var(--m)}
.w2s-col{position:relative;display:flex;flex-direction:column;min-height:clamp(380px,33cqw,520px);padding:clamp(22px,2.2cqw,34px);border:1px solid var(--line2);border-radius:var(--r);transition:background-color .5s var(--ease),border-color .5s}
.w2s-col:hover{background:var(--paper2);border-color:var(--ink)}
.w2s-col h3{font-size:clamp(20px,1.7cqw,26px);letter-spacing:-.02em;text-transform:uppercase}
.w2s-lead{margin-top:12px;max-width:30ch;color:var(--mut);font-size:clamp(14.5px,1.05cqw,16px);line-height:1.45;font-weight:400}
.w2s-items{margin-top:auto;padding-top:28px}
.w2s-items li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid var(--line);font-size:clamp(15px,1.12cqw,17px);letter-spacing:-.015em;transition:padding .45s var(--ease)}
.w2s-items li span{opacity:0;translate:-6px 0;transition:opacity .35s,translate .45s var(--ease);color:var(--mut)}
.w2s-col:hover .w2s-items li:hover{padding-left:8px}
.w2s-col .w2s-items li:hover span{opacity:1;translate:0 0}
.w2s-shape{margin-top:26px;width:clamp(34px,3cqw,46px);height:clamp(34px,3cqw,46px);transition:rotate .9s var(--ease),scale .6s var(--ease)}
.w2s-col:hover .w2s-shape{rotate:90deg;scale:1.12}
.w2s-close{position:relative;display:flex;align-items:center;gap:clamp(16px,2cqw,32px);margin-top:var(--m);min-height:clamp(66px,6.4cqw,104px);padding:0 clamp(22px,2.6cqw,40px);border-radius:99px;background:var(--paper2);color:var(--ink)}
.w2s-close i{flex:1;height:1px;background:currentColor;opacity:.4;transform-origin:var(--o) 50%;scale:0 1;transition:scale 1.4s var(--ease) .2s}
.w2s-close.w2-in i{scale:1 1}
.w2s-close p{font-size:clamp(15px,1.5cqw,24px);letter-spacing:.01em;text-transform:uppercase;text-align:center}
.w2s-wrap>.w2-lbl{margin-top:clamp(18px,2cqw,28px);color:var(--mut)}
@container (max-width:900px){.w2s-grid{grid-template-columns:1fr}.w2s-col{min-height:0}.w2s-items{margin-top:8px}}
@container (max-width:560px){.w2s-chev{display:none}.w2s-band{justify-content:center}.w2s-close{border-radius:26px;padding:18px 20px}.w2s-close i{display:none}}
`

function Shape(p: { kind: Service["shape"]; color: string }) {
    return (
        <svg className="w2s-shape" viewBox="0 0 40 40" aria-hidden="true">
            {p.kind === "circle" ? <circle cx="20" cy="20" r="18" fill={p.color} /> : null}
            {p.kind === "square" ? <rect x="3" y="3" width="34" height="34" rx="3" fill={p.color} /> : null}
            {p.kind === "triangle" ? <path d="M6 3.5 L36 20 L6 36.5 Z" fill={p.color} /> : null}
        </svg>
    )
}

function Chevrons() {
    return (
        <span className="w2s-chev" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <svg key={i} viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={cssVars({ "--i": i })}>
                    <path d="M2 2l8 8 8-8" />
                </svg>
            ))}
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Services(props: ServicesProps) {
    const {
        banner = "What we do",
        services = [
            {
                title: "Creators",
                lead: "First, we find the voices your audience already trusts, and make the match.",
                items: "Influencer marketing, Celebrity marketing, Talent management, Casting from nano to celebrity",
                shape: "circle" as const,
            },
            {
                title: "Content",
                lead: "Then we make things people actually want to watch, and protect the creator’s voice while we’re at it.",
                items: "Creative strategy, Video production, Content writing, Brand storytelling",
                shape: "square" as const,
            },
            {
                title: "Growth",
                lead: "Finally, we make it travel, and show you, in plain numbers, what it did for the business.",
                items: "Performance marketing, Creator-led ads, Campaign ops, Live reporting",
                shape: "triangle" as const,
            },
        ],
        closing = "Local voices. Worldwide noise.",
        first = false,
        style,
    } = props
    const [closeRef, closeOn] = useReveal<HTMLDivElement>(0.6)
    const colors = ["var(--red)", "var(--ink)", "var(--ink)"]

    return (
        <Section tone="paper" id="services" className={"w2s" + (first ? " w2s-first" : "")} css={SERV_CSS} label="Services" style={style}>
            <div className="w2s-wrap">
                <Reveal className="w2s-band w2-rise" amount={0.6}>
                    <Chevrons />
                    <Words as={first ? "h1" : "h2"} text={banner} stagger={0.08} />
                    <Chevrons />
                </Reveal>
                <div className="w2s-grid">
                    {services.map((s, i) => (
                        <Reveal key={i} className="w2s-col w2-rise" delay={i * 0.12} amount={0.25}>
                            <h3>{s.title}</h3>
                            <p className="w2s-lead">{s.lead}</p>
                            <ul className="w2s-items">
                                {String(s.items || "")
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                                    .map((t, k) => (
                                        <li key={k}>
                                            {t}
                                            <span aria-hidden="true">→</span>
                                        </li>
                                    ))}
                            </ul>
                            <Shape kind={s.shape || "circle"} color={colors[i % colors.length]} />
                        </Reveal>
                    ))}
                </div>
                <div ref={closeRef} className={"w2s-close" + closeOn}>
                    <i aria-hidden="true" style={cssVars({ "--o": "100%" })} />
                    <p>{closing}</p>
                    <i aria-hidden="true" style={cssVars({ "--o": "0%" })} />
                </div>
                <Label name="Services" index={2} />
            </div>
        </Section>
    )
}

addPropertyControls(W2Services, {
    banner: { type: ControlType.String, title: "Band", defaultValue: "What we do" },
    services: {
        type: ControlType.Array,
        title: "Columns",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                lead: { type: ControlType.String, title: "Lead", displayTextArea: true },
                items: { type: ControlType.String, title: "Items (comma separated)", displayTextArea: true },
                shape: {
                    type: ControlType.Enum,
                    title: "Shape",
                    options: ["circle", "square", "triangle"],
                    optionTitles: ["Circle", "Square", "Triangle"],
                },
            },
        },
        defaultValue: [
            {
                title: "Creators",
                lead: "First, we find the voices your audience already trusts, and make the match.",
                items: "Influencer marketing, Celebrity marketing, Talent management, Casting from nano to celebrity",
                shape: "circle",
            },
            {
                title: "Content",
                lead: "Then we make things people actually want to watch, and protect the creator’s voice while we’re at it.",
                items: "Creative strategy, Video production, Content writing, Brand storytelling",
                shape: "square",
            },
            {
                title: "Growth",
                lead: "Finally, we make it travel, and show you, in plain numbers, what it did for the business.",
                items: "Performance marketing, Creator-led ads, Campaign ops, Live reporting",
                shape: "triangle",
            },
        ],
    },
    closing: { type: ControlType.String, title: "Closing line", defaultValue: "Local voices. Worldwide noise." },
    first: {
        type: ControlType.Boolean,
        title: "Opens the page",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        description: "When Services is the first thing on a page: room for the menu, and the band becomes the page's main heading.",
    },
})
