// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 9, "One roof, six capabilities." — a living bento. The cards are dealt onto
// the table, each one draws a small animated diagram of what the capability does (and replays it
// on hover), tilts toward the cursor under a soft spotlight, and the vermilion "Let's talk" card
// carries a spinning badge.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useSpring } from "framer-motion"

/* ───────────────────────── WORLD MEDIA · DESIGN SYSTEM ─────────────────────────
   Shared tokens and motion primitives. Framer code components must each be a
   single self-contained file, so every section carries its own copy of this.
   The copy lives in @layer wm-base, so a section's own rules always beat it no
   matter how many later copies the page holds. Reveals animate opacity and the
   translate property only; transform and transition stay free for section styles.
   Palette, type and devices are taken from the World Media pitch deck:
   ink #0F0F0F · cream #F2EEE5 · vermilion #E9431B · stone #8C887C
   Bricolage Grotesque (display + text) · Caveat (handwritten notes) · DM Mono (labels)
   ─────────────────────────────────────────────────────────────────────────────── */

type Theme = "ink" | "cream" | "red"

type Tone = "stone" | "red" | "mut" | "fg" | "ink" | "cream"

type Part = { t: string; c?: Tone }

const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Caveat:wght@400..700&family=DM+Mono:wght@300;400;500&display=swap"

const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties

const BASE_CSS = `
@layer wm-base{
.wm-sec{--ink:#0F0F0F;--ink2:#181816;--ink3:#1F1E1B;--cream:#F2EEE5;--cream2:#E6E1D6;--paper:#FAF8F3;--red:#E9431B;--stone:#8C887C;
--ease:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.7,0,.2,1);
position:relative;width:100%;container-type:inline-size;overflow:hidden;overflow:clip;
font-family:"Bricolage Grotesque","Helvetica Neue",Helvetica,Arial,sans-serif;font-optical-sizing:auto;font-weight:400;
-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
background:var(--bg);color:var(--fg)}
.wm-sec[data-wm-theme="ink"]{--bg:var(--ink);--fg:var(--cream);--mut:rgba(242,238,229,.6);--line:rgba(242,238,229,.14);--line2:rgba(242,238,229,.3);--surf:var(--ink2);--ph:var(--ink3);--chip:rgba(242,238,229,.08)}
.wm-sec[data-wm-theme="cream"]{--bg:var(--cream);--fg:var(--ink);--mut:rgba(15,15,15,.6);--line:rgba(15,15,15,.14);--line2:rgba(15,15,15,.55);--surf:var(--paper);--ph:var(--cream2);--chip:var(--paper)}
.wm-sec[data-wm-theme="red"]{--bg:var(--red);--fg:var(--ink);--mut:rgba(15,15,15,.72);--line:rgba(15,15,15,.28);--line2:rgba(15,15,15,.6);--surf:rgba(15,15,15,.08);--ph:rgba(15,15,15,.1);--chip:rgba(15,15,15,.08)}
.wm-sec *,.wm-sec *::before,.wm-sec *::after{box-sizing:border-box}
.wm-sec :where(h1,h2,h3,h4,p,ul,ol,li,figure,blockquote){margin:0;padding:0;list-style:none}
.wm-sec a{color:inherit;text-decoration:none}
.wm-sec ::selection{background:var(--red);color:var(--ink)}
.wm-wrap{position:relative;width:100%;max-width:1400px;margin:0 auto;padding:clamp(72px,8cqw,118px) clamp(20px,5.2cqw,80px) clamp(64px,7cqw,104px)}
.wm-mono{font-family:"DM Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:400;font-size:12px;letter-spacing:.02em;line-height:1.45}
.wm-cap{text-transform:uppercase;letter-spacing:.08em}
.wm-script{font-family:"Caveat","Bradley Hand","Segoe Print",cursive;font-weight:500;line-height:1.05;letter-spacing:.004em;font-size:clamp(20px,2.05cqw,30px);text-wrap:balance}
.wm-red{color:var(--red)}.wm-mut{color:var(--mut)}.wm-stone{color:var(--stone)}.wm-fg{color:var(--fg)}.wm-ink{color:var(--ink)}.wm-cream{color:var(--cream)}
.wm-mega{font-weight:800;font-size:clamp(76px,15.8cqw,248px);line-height:.86;letter-spacing:-.052em}
.wm-h1{font-weight:760;font-size:clamp(42px,6.6cqw,104px);line-height:.95;letter-spacing:-.04em}
.wm-h2{font-weight:740;font-size:clamp(34px,4.7cqw,70px);line-height:.98;letter-spacing:-.035em}
.wm-h3{font-weight:720;font-size:clamp(21px,1.95cqw,28px);line-height:1.08;letter-spacing:-.022em}
.wm-body{font-size:clamp(15.5px,1.28cqw,18px);line-height:1.55;letter-spacing:-.006em}
.wm-small{font-size:14.5px;line-height:1.5;letter-spacing:-.004em}
.wm-top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.wm-chrome{display:inline-flex;align-items:center;gap:9px}
.wm-dots{display:inline-flex;gap:5px}
.wm-dots i{width:9px;height:9px;border-radius:50%;background:var(--fg);display:block;transform:scale(0);transition:transform .7s var(--ease);transition-delay:var(--d,0s)}
.wm-dots i:last-child{background:var(--red)}
.wm-sec[data-wm-theme="red"] .wm-dots i:last-child{background:var(--cream)}
.wm-pill{display:inline-flex;align-items:center;height:24px;padding:0 11px;border:1.3px solid currentColor;border-radius:99px;font-size:12px;font-weight:500;letter-spacing:-.004em;white-space:nowrap}
.wm-chrome .wm-pill{opacity:0;transform:translateX(-10px);transition:opacity .7s var(--ease) .22s,transform .9s var(--ease) .22s}
.wm-chrome.wm-in .wm-dots i{transform:scale(1)}
.wm-chrome.wm-in .wm-pill{opacity:1;transform:none}
.wm-rv{text-wrap:balance}
.wm-rv .wm-w{display:inline-block;overflow:hidden;vertical-align:top;padding:.1em .05em .18em;margin:-.1em -.05em -.18em}
.wm-rv .wm-w>span{display:inline-block;transform:translate3d(0,112%,0) rotate(3deg);transform-origin:0 100%;transition:transform 1.1s var(--ease);transition-delay:var(--d,0s)}
.wm-rv.wm-in .wm-w>span{transform:none}
.wm-rise,.wm-fade,.wm-stag>*{opacity:0}
.wm-rise.wm-in{animation:wm-up 1.2s var(--ease) var(--d,0s) both}
.wm-fade.wm-in{animation:wm-fade 1.2s var(--ease) var(--d,0s) both}
.wm-stag.wm-in>*{animation:wm-up 1.2s var(--ease) calc(var(--d0,0s) + var(--i,0) * var(--st,.09s)) both}
.wm-rise.wm-in.wm-now,.wm-fade.wm-in.wm-now,.wm-stag.wm-in.wm-now>*{animation:none;opacity:1}
.wm-note{display:inline-block}
.wm-write{display:inline-block;padding:.12em .3em .22em .1em;margin:-.12em -.3em -.22em -.1em;clip-path:inset(0 100% 0 0);transition:clip-path 1.35s cubic-bezier(.5,0,.25,1);transition-delay:var(--d,0s)}
.wm-note.wm-in>.wm-write{clip-path:inset(0 0 0 0)}
.wm-draw{transform:scaleX(0);transform-origin:0 50%;transition:transform 1.4s var(--ease);transition-delay:var(--d,0s)}
.wm-draw.wm-in{transform:none}
.wm-hr{height:1px;background:var(--line);width:100%}
.wm-hr.s{background:var(--line2)}
.wm-svg{overflow:visible}
.wm-svg path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.05s cubic-bezier(.55,0,.2,1);transition-delay:var(--d,0s)}
.wm-svg path.h{transition-duration:.4s;transition-delay:calc(var(--d,0s) + .9s)}
.wm-svg.wm-in path{stroke-dashoffset:0}
.wm-mark{position:relative;display:inline-block;color:var(--ink);padding:.035em .2em .08em .12em;margin-left:-.12em;line-height:.9}
.wm-mark>b{position:absolute;inset:0;background:var(--cream);transform:scaleX(0);transform-origin:0 50%;transition:transform 1s var(--ease-io);transition-delay:var(--d,0s)}
.wm-mark>span{position:relative;display:inline-block;clip-path:inset(-10% 100% -10% 0);transition:clip-path 1s var(--ease-io);transition-delay:calc(var(--d,0s) + .38s)}
.wm-mark.wm-in>b{transform:none}
.wm-mark.wm-in>span{clip-path:inset(-10% -6% -10% 0)}
.wm-blank{white-space:nowrap}
.wm-blank .c{animation:wmblink 1.2s steps(1,end) infinite}
.wm-ph{position:relative;background:var(--ph);border-radius:14px;overflow:hidden}
.wm-card{position:relative;background:var(--surf);border-radius:16px}
.wm-link{position:relative;display:inline-flex;align-items:center;gap:.4em;cursor:pointer}
.wm-arrowline{display:inline-block;height:.62em;width:1.9em;flex:none;transition:width .6s var(--ease)}
.wm-link:hover .wm-arrowline,.wm-link:focus-visible .wm-arrowline{width:2.5em}
.wm-sec :focus-visible{outline:2px solid var(--red);outline-offset:4px;border-radius:6px}
@media (prefers-reduced-motion:reduce){
.wm-sec *{transition:none!important;animation:none!important}
.wm-rv .wm-w>span,.wm-draw,.wm-mark>b,.wm-dots i,.wm-chrome .wm-pill{transform:none!important;opacity:1!important}
.wm-rise,.wm-fade,.wm-stag>*{opacity:1!important;translate:none!important}
.wm-write,.wm-mark>span{clip-path:none!important}.wm-svg path{stroke-dashoffset:0!important}}
}
@keyframes wm-up{from{opacity:0;translate:0 32px}to{opacity:1;translate:none}}
@keyframes wm-fade{from{opacity:0}to{opacity:1}}
@keyframes wmblink{0%,48%{opacity:1}52%,100%{opacity:.16}}
`

const NOJS_CSS = `.wm-rv .wm-w>span,.wm-draw,.wm-mark>b,.wm-dots i,.wm-chrome .wm-pill{transform:none!important;opacity:1!important}.wm-rise,.wm-fade,.wm-stag>*{opacity:1!important;translate:none!important;animation:none!important}.wm-write,.wm-mark>span{clip-path:none!important}.wm-svg path{stroke-dashoffset:0!important}`

function useStill(): boolean {
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    return isStatic || !!reduce
}

function useIn<T extends Element>(amount = 0.35): [React.RefObject<T>, string] {
    const ref = React.useRef<T>(null)
    const isStatic = useIsStaticRenderer()
    const seen = useInView(ref as React.RefObject<Element>, { once: true, amount })
    return [ref, isStatic ? " wm-in wm-now" : seen ? " wm-in" : ""]
}

function Base() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            <style>{BASE_CSS}</style>
            <noscript dangerouslySetInnerHTML={{ __html: "<style>" + NOJS_CSS + "</style>" }} />
        </>
    )
}

type SectionProps = {
    theme: Theme
    id?: string
    className?: string
    style?: React.CSSProperties
    css?: string
    label?: string
    children?: React.ReactNode
}

function Section(p: SectionProps) {
    const id = (p.id || "").replace(/^#/, "").trim()
    return (
        <section
            id={id || undefined}
            data-wm-theme={p.theme}
            aria-label={p.label}
            className={"wm-sec " + (p.className || "")}
            style={p.style}
        >
            <Base />
            {p.css ? <style>{p.css}</style> : null}
            {p.children}
        </section>
    )
}

/** Renders the deck's fill-in blanks — "[__]M" — with a blinking caret. */
function fill(text: string): React.ReactNode {
    if (!text || text.indexOf("[__]") === -1) return text
    const bits = text.split("[__]")
    const out: React.ReactNode[] = []
    bits.forEach((b, k) => {
        if (b) out.push(<React.Fragment key={"t" + k}>{b}</React.Fragment>)
        if (k < bits.length - 1)
            out.push(
                <span className="wm-blank" key={"b" + k}>
                    [<span className="c">__</span>]
                </span>
            )
    })
    return out
}

type WordsProps = {
    text?: string
    parts?: Part[]
    as?: any
    className?: string
    style?: React.CSSProperties
    delay?: number
    stagger?: number
    amount?: number
}

/** Word-by-word masked rise. "\n" in the text forces a line break. */
function Words(p: WordsProps) {
    const Tag = p.as || "span"
    const parts: Part[] = p.parts && p.parts.length ? p.parts : [{ t: p.text || "" }]
    const [ref, inCls] = useIn<HTMLElement>(p.amount ?? 0.3)
    const delay = p.delay ?? 0
    const stagger = p.stagger ?? 0.055
    let i = 0
    const full = parts.map((x) => x.t).join("").replace(/\n/g, " ")
    return (
        <Tag ref={ref} className={"wm-rv " + (p.className || "") + inCls} style={p.style} aria-label={full}>
            {parts.map((part, pi) =>
                part.t.split(/(\s+)/).map((w, wi) => {
                    if (!w) return null
                    if (/^\s+$/.test(w))
                        return w.indexOf("\n") > -1 ? (
                            <React.Fragment key={pi + "-" + wi}>
                                {" "}
                                <br />
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={pi + "-" + wi}> </React.Fragment>
                        )
                    const d = delay + i++ * stagger
                    return (
                        <span className="wm-w" aria-hidden="true" key={pi + "-" + wi}>
                            <span className={part.c ? "wm-" + part.c : undefined} style={cssVars({ "--d": d.toFixed(3) + "s" })}>
                                {fill(w)}
                            </span>
                        </span>
                    )
                })
            )}
        </Tag>
    )
}

/** Crisp long arrow used in links — grows on hover. */
function LineArrow(p: { style?: React.CSSProperties }) {
    return (
        <svg className="wm-arrowline" viewBox="0 0 60 16" preserveAspectRatio="xMaxYMid meet" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={p.style} aria-hidden="true">
            <path d="M1 8 H58" />
            <path d="M51 1.5 L58 8 L51 14.5" />
        </svg>
    )
}

/** ●●● + pill — the section tag used on every slide of the deck. */
function Chrome(p: { label: string; className?: string; style?: React.CSSProperties }) {
    const [ref, inCls] = useIn<HTMLDivElement>(0.8)
    return (
        <div ref={ref} className={"wm-chrome " + (p.className || "") + inCls} style={p.style}>
            <span className="wm-dots" aria-hidden="true">
                <i style={cssVars({ "--d": "0s" })} />
                <i style={cssVars({ "--d": ".08s" })} />
                <i style={cssVars({ "--d": ".16s" })} />
            </span>
            <span className="wm-pill">{p.label}</span>
        </div>
    )
}

/** True on devices with a mouse or trackpad, where hover and cursor effects make sense. */
function useFinePointer(): boolean {
    const [fine, setFine] = React.useState(false)
    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        const sync = () => setFine(mq.matches)
        sync()
        if (mq.addEventListener) mq.addEventListener("change", sync)
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", sync)
        }
    }, [])
    return fine
}

type ServiceVisual = "strategy" | "casting" | "studio" | "ops" | "amplify" | "insights" | "none"

type Service = { title: string; body: string; visual?: ServiceVisual }

type ServicesProps = {
    tag: string
    headline: string
    items: Service[]
    talkLabel: string
    talkHref: string
    style?: React.CSSProperties
}

const SERVICES_CSS = `
.wms-h{margin-top:clamp(22px,2.6cqw,36px);font-weight:760;font-size:clamp(34px,4.3cqw,64px);line-height:1;letter-spacing:-.038em}
.wms-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px);margin-top:clamp(32px,3.8cqw,56px)}
.wms-card{position:relative;display:flex;flex-direction:column;gap:12px;min-height:clamp(300px,25cqw,360px);padding:clamp(18px,1.8cqw,26px);border-radius:18px;background:var(--cream);color:var(--ink);overflow:hidden;isolation:isolate;opacity:0;transition:filter .5s var(--ease),background-color .5s}
.wms-card.on{opacity:1;animation:wms-deal 1.2s cubic-bezier(.2,.9,.25,1.04) backwards;animation-delay:calc(var(--c,0) * 90ms)}
.wms-card.now{opacity:1}
@keyframes wms-deal{0%{opacity:0;translate:0 120px;rotate:var(--rot,0deg);scale:.86}40%{opacity:1}}
.wms-card::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(340px circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.58),rgba(255,255,255,0) 62%);opacity:0;transition:opacity .45s}
.wms-card:hover::after{opacity:1}
.wms-grid:has(.wms-card:hover) .wms-card:not(:hover){filter:brightness(.74) saturate(.9)}
.wms-card.w{grid-column:span 2;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);grid-template-rows:auto 1fr;column-gap:clamp(18px,2.2cqw,36px)}
.wms-card.w .wms-l{grid-column:1;grid-row:1}
.wms-card.w .wms-txt{grid-column:1;grid-row:2;align-self:end}
.wms-card.w .wms-viz{grid-column:2;grid-row:1 / span 2}
.wms-l{font-family:"DM Mono",ui-monospace,monospace;font-size:13px;letter-spacing:.06em;transition:color .4s}
.wms-card:hover .wms-l{color:var(--red)}
.wms-viz{position:relative;flex:1;display:flex;align-items:center;justify-content:center;min-height:118px;color:var(--ink)}
.wms-viz svg{display:block;width:100%;height:auto;max-height:170px;overflow:visible}
.wms-t{font-weight:760;font-size:clamp(17px,1.6cqw,23px);letter-spacing:-.005em;text-transform:uppercase;line-height:1.05}
.wms-b{margin-top:8px;color:rgba(15,15,15,.62);font-size:14.5px;line-height:1.45;max-width:26em}
.wms .wms-talk{background:var(--red);align-items:flex-start;justify-content:space-between;cursor:pointer}
.wms-talk::after{background:radial-gradient(300px circle at var(--mx,50%) var(--my,0%),rgba(255,214,190,.55),rgba(255,214,190,0) 62%)}
.wms-talk .wms-l{color:var(--ink)!important}
.wms-go{display:inline-flex;align-items:center;gap:.35em;font-weight:760;font-size:clamp(24px,2.3cqw,34px);letter-spacing:-.03em}
.wms-talk:hover{background-color:#F0512A}
.wms-badge{position:absolute;right:clamp(14px,1.5cqw,22px);top:clamp(14px,1.5cqw,22px);width:clamp(76px,6.6cqw,98px);aspect-ratio:1;color:var(--ink)}
.wms-spin{position:absolute;inset:0;animation:wms-spin 22s linear infinite}
.wms-spin svg{display:block;width:100%;height:100%;overflow:visible;animation:wms-spin 5s linear infinite;animation-play-state:paused}
.wms-talk:hover .wms-spin svg{animation-play-state:running}
.wms-badge-t{font-family:"DM Mono",ui-monospace,monospace;font-size:9.6px;letter-spacing:.14em;fill:currentColor}
.wms-badge-a{position:absolute;left:50%;top:50%;width:34%;height:34%;margin:-17% 0 0 -17%;transition:transform .6s var(--ease)}
.wms-talk:hover .wms-badge-a{transform:rotate(45deg)}
@keyframes wms-spin{to{transform:rotate(360deg)}}
.v-mono{font-family:"DM Mono",ui-monospace,monospace;font-size:9px;letter-spacing:.02em;fill:currentColor}
.v-row{font-size:10px}
.v-tiny{font-size:7px;letter-spacing:.08em}
.v-dim{fill:#8C887C}
.v-pop,.v-grow,.v-tick,.v-ping,.v-bar,.v-phone,.v-rise{transform-box:fill-box}
.v-pop,.v-tick,.v-ping{transform-origin:50% 50%}
.v-grow{transform-origin:50% 100%}
.v-bar{transform-origin:0 50%}
.v-phone{transform-origin:50% 100%;transition:transform .7s cubic-bezier(.34,1.56,.64,1)}
.wms-card:hover .v-phone{transform:translateY(-4px) rotate(var(--rot,0deg))}
.v-pulse{stroke-dasharray:.07 1.3;stroke-dashoffset:.07;opacity:0}
.v-scan{opacity:0}
.v-rec{animation:wv-blink 1.1s steps(1,end) infinite}
.v-ping{animation:wv-ping 2.2s ease-out infinite}
.wms-card.on .v-in{animation:wv-in .7s var(--ease) backwards;animation-delay:calc(.35s + var(--k,0) * .09s)}
.wms-card.on .v-draw{stroke-dasharray:1;animation:wv-draw 1.1s var(--ease) backwards;animation-delay:calc(.55s + var(--k,0) * .12s)}
.wms-card.on .v-pop{animation:wv-pop .75s cubic-bezier(.34,1.56,.64,1) backwards;animation-delay:calc(.45s + var(--k,0) * .12s)}
.wms-card.on .v-fade{animation:wv-fade .8s var(--ease) backwards;animation-delay:calc(.6s + var(--k,0) * .12s)}
.wms-card.on .v-grow{animation:wv-grow .95s cubic-bezier(.34,1.35,.64,1) backwards;animation-delay:calc(.4s + var(--k,0) * .07s)}
.wms-card.on .v-rise{animation:wv-rise .9s var(--ease) backwards;animation-delay:calc(.35s + var(--k,0) * .12s)}
.wms-card.on .v-bar{animation:wv-bar 2.6s linear backwards;animation-delay:calc(.9s + var(--k,0) * .35s)}
.wms-card.on .v-tick{animation:wv-pop .55s cubic-bezier(.34,1.56,.64,1) backwards;animation-delay:var(--t,.5s)}
.wms-card.on .v-scan{animation:wv-scan 1.7s cubic-bezier(.45,0,.3,1) .45s backwards}
.wms-card.on .v-pulse{animation:wv-pulse 1.5s cubic-bezier(.5,0,.3,1) backwards;animation-delay:calc(1.35s + var(--k,0) * .2s)}
.wms-card.on:hover .v-pulse{animation-iteration-count:infinite}
.wms-card.on .v-head{animation:wv-head 3.4s linear 1s infinite}
@keyframes wv-in{from{opacity:0;transform:translateX(-12px)}}
@keyframes wv-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes wv-pop{from{transform:scale(0)}}
@keyframes wv-fade{from{opacity:0}}
@keyframes wv-grow{from{transform:scaleY(0)}}
@keyframes wv-rise{from{opacity:0;transform:translateY(16px)}}
@keyframes wv-bar{from{transform:scaleX(0)}}
@keyframes wv-scan{0%{opacity:0;transform:translateX(0)}8%,90%{opacity:1}100%{opacity:0;transform:translateX(252px)}}
@keyframes wv-pulse{0%{stroke-dashoffset:.07;opacity:1}85%{opacity:1}100%{stroke-dashoffset:-1;opacity:0}}
@keyframes wv-head{from{transform:translateX(0)}to{transform:translateX(214px)}}
@keyframes wv-blink{50%{opacity:.15}}
@keyframes wv-ping{from{transform:scale(1);opacity:.8}to{transform:scale(3.2);opacity:0}}
@media (prefers-reduced-motion:reduce){.wms-card{opacity:1}}
@container (max-width:900px){.wms-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.wms-card.on{animation-delay:0s}}
@container (max-width:560px){.wms-grid{grid-template-columns:1fr}.wms-card{min-height:0}.wms-card.w{grid-column:auto;display:flex}.wms-viz{min-height:130px}.wms .wms-talk{min-height:200px}}
`

function VizStrategy() {
    const rows = [
        { t: "creators", y: 20 },
        { t: "platforms", y: 60 },
        { t: "story", y: 100 },
    ]
    const curve = (y: number) => "M78 " + y + " C 128 " + y + ", 150 60, 196 60"
    return (
        <svg viewBox="0 0 256 120" fill="none" aria-hidden="true">
            {rows.map((r, k) => (
                <path key={"c" + k} className="v-draw" style={cssVars({ "--k": k })} d={curve(r.y)} pathLength={1} stroke="currentColor" strokeWidth="1.2" />
            ))}
            {rows.map((r, k) => (
                <path key={"p" + k} className="v-pulse" style={cssVars({ "--k": k })} d={curve(r.y)} pathLength={1} stroke="#E9431B" strokeWidth="2.6" strokeLinecap="round" />
            ))}
            {rows.map((r, k) => (
                <g key={"t" + k} className="v-in" style={cssVars({ "--k": k })}>
                    <rect x="1" y={r.y - 11} width="77" height="22" rx="11" fill="#F2EEE5" stroke="currentColor" strokeWidth="1.2" />
                    <text x="39.5" y={r.y + 3.3} textAnchor="middle" className="v-mono">
                        {r.t}
                    </text>
                </g>
            ))}
            <g className="v-pop" style={cssVars({ "--k": 3 })}>
                <circle cx="222" cy="60" r="26" stroke="#B9B3A6" strokeWidth="1" />
                <circle cx="222" cy="60" r="16" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="222" cy="60" r="6.5" fill="#E9431B" />
            </g>
            <text x="222" y="106" textAnchor="middle" className="v-mono v-dim v-fade" style={cssVars({ "--k": 5 })}>
                one goal
            </text>
        </svg>
    )
}

function VizCasting() {
    const base = 94
    const people = [
        { x: 20, r: 7 },
        { x: 60, r: 10 },
        { x: 108, r: 14 },
        { x: 162, r: 19 },
        { x: 224, r: 25 },
    ]
    return (
        <svg viewBox="0 0 256 120" fill="none" aria-hidden="true">
            <path d={"M2 " + base + "H254"} stroke="#B9B3A6" strokeWidth="1" strokeDasharray="2 4" />
            {people.map((p, k) => (
                <circle key={k} className="v-pop" style={cssVars({ "--k": k * 0.6 })} cx={p.x} cy={base - p.r} r={p.r} fill="#E4DED2" stroke="currentColor" strokeWidth="1.2" />
            ))}
            <path className="v-scan" d={"M1 18V" + (base + 4)} stroke="#E9431B" strokeWidth="1.4" />
            {people.map((p, k) => {
                const bx = p.x + p.r * 0.72
                const by = base - p.r - p.r * 0.72
                return (
                    <g key={"v" + k} className="v-tick" style={cssVars({ "--t": (0.45 + (1.7 * bx) / 252).toFixed(2) + "s" })}>
                        <circle cx={bx} cy={by} r="6" fill="#E9431B" />
                        <path d={"M" + (bx - 2.6) + " " + by + "l1.8 1.9 3.4-3.7"} stroke="#F2EEE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                )
            })}
            <text x="20" y="113" textAnchor="middle" className="v-mono v-dim">
                nano
            </text>
            <text x="224" y="113" textAnchor="middle" className="v-mono v-dim">
                celebrity
            </text>
        </svg>
    )
}

function VizStudio() {
    const phones = [
        { x: 24, rot: -7 },
        { x: 111, rot: 0 },
        { x: 198, rot: 7 },
    ]
    const clips: [number, number, string][] = [
        [24, 40, "#0F0F0F"],
        [68, 24, "#B9B3A6"],
        [96, 54, "#E9431B"],
        [154, 34, "#0F0F0F"],
        [192, 64, "#B9B3A6"],
    ]
    return (
        <svg viewBox="0 0 280 134" fill="none" aria-hidden="true">
            {phones.map((p, k) => (
                <g key={k} className="v-phone" style={cssVars({ "--rot": p.rot + "deg" })}>
                    <g className="v-rise" style={cssVars({ "--k": k })}>
                        <rect x={p.x} y="2" width="58" height="104" rx="11" fill="#E4DED2" stroke={k === 1 ? "#E9431B" : "currentColor"} strokeWidth={k === 1 ? 1.8 : 1.2} />
                        <rect x={p.x + 8} y="93" width="42" height="3" rx="1.5" fill="rgba(15,15,15,.14)" />
                        <rect className="v-bar" style={cssVars({ "--k": k })} x={p.x + 8} y="93" width="42" height="3" rx="1.5" fill={k === 1 ? "#E9431B" : "#0F0F0F"} />
                        {k === 1 ? (
                            <g>
                                <circle className="v-rec" cx={p.x + 12} cy="14" r="3" fill="#E9431B" />
                                <text x={p.x + 18.5} y="16.5" className="v-mono v-tiny">
                                    REC
                                </text>
                            </g>
                        ) : (
                            <path d={"M" + (p.x + 25) + " 47l10 7-10 7z"} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                        )}
                    </g>
                </g>
            ))}
            <g className="v-fade" style={cssVars({ "--k": 3 })}>
                {clips.map(([x, w, c], k) => (
                    <rect key={k} x={x} y="119" width={w} height="8" rx="2.5" fill={c} />
                ))}
            </g>
            <g className="v-head">
                <path d="M24 114v17" stroke="#E9431B" strokeWidth="1.4" />
                <path d="M20.5 112.5h7l-3.5 3.8z" fill="#E9431B" />
            </g>
        </svg>
    )
}

function VizOps() {
    const rows = [
        ["Contracts", "signed"],
        ["Timelines", "locked"],
        ["Approvals", "done"],
        ["Payouts", "paid"],
    ]
    return (
        <svg viewBox="0 0 256 120" fill="none" aria-hidden="true">
            {rows.map(([a, b], k) => {
                const y = 16 + k * 29
                return (
                    <g key={k}>
                        {k > 0 ? <path d={"M0 " + (y - 14.5) + "H256"} stroke="rgba(15,15,15,.1)" strokeWidth="1" /> : null}
                        <rect x="1" y={y - 7} width="14" height="14" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
                        <path className="v-draw" style={cssVars({ "--k": k * 2.4 })} d={"M4.5 " + y + "l3 3.2 5.2-6.4"} pathLength={1} stroke="#E9431B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="26" y={y + 3.6} className="v-mono v-row">
                            {a}
                        </text>
                        <text x="255" y={y + 3.4} textAnchor="end" className="v-mono v-dim v-fade" style={cssVars({ "--k": 1 + k * 2.4 })}>
                            {b}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

function VizAmplify() {
    const bars = [22, 34, 27, 41, 30, 80, 36, 46]
    return (
        <svg viewBox="0 0 256 120" fill="none" aria-hidden="true">
            <path d="M0 108H256" stroke="rgba(15,15,15,.18)" strokeWidth="1" />
            {bars.map((v, k) => (
                <rect key={k} className="v-grow" style={cssVars({ "--k": k === 5 ? 9 : k })} x={8 + k * 31} y={108 - v} width="18" height={v} rx="3" fill={k === 5 ? "#E9431B" : "#C9C3B6"} />
            ))}
            <path className="v-draw" style={cssVars({ "--k": 8 })} d="M172 23 C 170.5 16, 172.5 10, 175 4" pathLength={1} stroke="#E9431B" strokeWidth="1.6" strokeLinecap="round" />
            <path className="v-draw" style={cssVars({ "--k": 9 })} d="M169.5 9.5 L175 4 L180 10" pathLength={1} stroke="#E9431B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="186" y="13" className="v-mono v-fade" style={cssVars({ "--k": 8 })}>
                boosted
            </text>
        </svg>
    )
}

function VizInsights(p: { id: string }) {
    const line = "M2 90 L34 82 L66 86 L98 66 L130 71 L162 48 L194 54 L226 31 L250 24"
    return (
        <svg viewBox="0 0 256 120" fill="none" aria-hidden="true">
            <defs>
                <linearGradient id={p.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E9431B" stopOpacity=".22" />
                    <stop offset="1" stopColor="#E9431B" stopOpacity="0" />
                </linearGradient>
            </defs>
            {[36, 64, 92].map((y, k) => (
                <path key={k} d={"M0 " + y + "H256"} stroke="rgba(15,15,15,.1)" strokeDasharray="2 4" />
            ))}
            <path className="v-fade" style={cssVars({ "--k": 6 })} d={line + " L250 108 L2 108 Z"} fill={"url(#" + p.id + ")"} />
            <path className="v-draw" style={cssVars({ "--k": 0 })} d={line} pathLength={1} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
            <circle className="v-ping" cx="250" cy="24" r="4.5" stroke="#E9431B" strokeWidth="1.2" />
            <circle className="v-pop" style={cssVars({ "--k": 7 })} cx="250" cy="24" r="4.5" fill="#E9431B" />
            <circle className="v-rec" cx="204" cy="8" r="2.6" fill="#E9431B" />
            <text x="210" y="10.6" className="v-mono v-tiny">
                LIVE
            </text>
        </svg>
    )
}

const VISUALS: ServiceVisual[] = ["strategy", "casting", "studio", "ops", "amplify", "insights"]

function Viz(p: { kind: ServiceVisual; id: string }) {
    if (p.kind === "strategy") return <VizStrategy />
    if (p.kind === "casting") return <VizCasting />
    if (p.kind === "studio") return <VizStudio />
    if (p.kind === "ops") return <VizOps />
    if (p.kind === "amplify") return <VizAmplify />
    if (p.kind === "insights") return <VizInsights id={p.id} />
    return null
}

/** One bento card: dealt in when it enters view, tilts toward the cursor, lights up under it,
    and replays its diagram each time the pointer arrives. */
function Card(p: {
    className: string
    col: number
    rot: number
    still: boolean
    fine: boolean
    href?: string
    cursor?: string
    render: (run: number) => React.ReactNode
}) {
    const ref = React.useRef<HTMLElement>(null)
    const seen = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.25 })
    const [run, setRun] = React.useState(0)
    const rx = useSpring(0, { stiffness: 200, damping: 20 })
    const ry = useSpring(0, { stiffness: 200, damping: 20 })
    const lift = useSpring(0, { stiffness: 260, damping: 22 })
    const live = p.fine && !p.still
    const onMove = (e: React.PointerEvent<HTMLElement>) => {
        if (!live) return
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        rx.set((0.5 - py) * 7)
        ry.set((px - 0.5) * 9)
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%")
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%")
    }
    const onEnter = () => {
        if (!live) return
        lift.set(-6)
        setRun((n) => n + 1)
    }
    const onLeave = () => {
        rx.set(0)
        ry.set(0)
        lift.set(0)
    }
    const Tag: any = p.href ? motion.a : motion.article
    return (
        <Tag
            ref={ref}
            className={p.className + (p.still ? " now" : seen ? " on" : "")}
            href={p.href}
            data-cursor={p.cursor}
            style={{ rotateX: rx, rotateY: ry, y: lift, transformPerspective: 1000, ...cssVars({ "--rot": p.rot + "deg", "--c": p.col }) }}
            onPointerMove={onMove}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
        >
            {p.render(run)}
        </Tag>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMServices(props: ServicesProps) {
    const {
        tag = "Services",
        headline = "One roof, six capabilities.",
        items = [
            { title: "Strategy", body: "Creators, platforms and story, mapped to one business goal.", visual: "strategy" },
            { title: "Casting", body: "Nano to celebrity. Vetted for real audiences over follower counts.", visual: "casting" },
            { title: "Content Studio", body: "Scripts, shoots and edits for Reels, Shorts and YouTube. We brief creators like collaborators and protect their voice.", visual: "studio" },
            { title: "Campaign Ops", body: "Contracts, timelines, approvals, payouts. Handled end to end.", visual: "ops" },
            { title: "Amplification", body: "Whitelisting and creator-led ads that make great posts perform.", visual: "amplify" },
            { title: "Insights", body: "Live dashboards and post-campaign reads on what moved, and why.", visual: "insights" },
        ],
        talkLabel = "Let's talk",
        talkHref = "#lets-talk",
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "")
    const letters = "abcdefghijklmnopqrstuvwxyz"
    const tilt = [-5, 3, -2, 4, -3, 5, -4, 2]
    const cols = [0, 1, 2, 0, 1, 2, 3, 0]
    const cards: React.ReactNode[] = []
    let n = 0
    items.forEach((it, i) => {
        if (i === 5) {
            const k = n++
            cards.push(
                <Card
                    key="talk"
                    className="wms-card wms-talk wm-link"
                    col={cols[k] ?? 0}
                    rot={tilt[k % tilt.length]}
                    still={still}
                    fine={fine}
                    href={talkHref}
                    cursor="Talk"
                    render={() => (
                        <>
                            <span className="wms-l">( → )</span>
                            <span className="wms-badge" aria-hidden="true">
                                <span className="wms-spin">
                                    <svg viewBox="0 0 100 100">
                                        <defs>
                                            <path id={uid + "ring"} d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
                                        </defs>
                                        <text className="wms-badge-t">
                                            <textPath href={"#" + uid + "ring"} textLength="230" lengthAdjust="spacing">
                                                LET'S TALK · SAY HI · LET'S TALK · SAY HI ·
                                            </textPath>
                                        </text>
                                    </svg>
                                </span>
                                <svg className="wms-badge-a" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <b className="wms-go">
                                {talkLabel}
                                <LineArrow />
                            </b>
                        </>
                    )}
                />
            )
        }
        const k = n++
        const kind: ServiceVisual = it.visual || VISUALS[i] || "none"
        cards.push(
            <Card
                key={i}
                className={"wms-card" + (i === 2 ? " w" : "")}
                col={cols[k] ?? 0}
                rot={tilt[k % tilt.length]}
                still={still}
                fine={fine}
                render={(run) => (
                    <>
                        <span className="wms-l">( {letters[i] || "·"} )</span>
                        {kind !== "none" ? (
                            <div className="wms-viz" key={run}>
                                <Viz kind={kind} id={uid + "g" + i} />
                            </div>
                        ) : null}
                        <div className="wms-txt">
                            <h3 className="wms-t">{it.title}</h3>
                            <p className="wms-b">{it.body}</p>
                        </div>
                    </>
                )}
            />
        )
    })

    return (
        <Section theme="ink" className="wms" css={SERVICES_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <Words as="h2" className="wms-h" text={headline} stagger={0.05} />
                <div className="wms-grid">{cards}</div>
            </div>
        </Section>
    )
}

addPropertyControls(WMServices, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Services" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "One roof, six capabilities." },
    items: {
        type: ControlType.Array,
        title: "Services",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                visual: {
                    type: ControlType.Enum,
                    title: "Diagram",
                    options: ["strategy", "casting", "studio", "ops", "amplify", "insights", "none"],
                    optionTitles: ["Strategy map", "Casting scan", "Studio phones", "Ops checklist", "Boost chart", "Live chart", "None"],
                },
            },
        },
        defaultValue: [
            { title: "Strategy", body: "Creators, platforms and story, mapped to one business goal.", visual: "strategy" },
            { title: "Casting", body: "Nano to celebrity. Vetted for real audiences over follower counts.", visual: "casting" },
            { title: "Content Studio", body: "Scripts, shoots and edits for Reels, Shorts and YouTube. We brief creators like collaborators and protect their voice.", visual: "studio" },
            { title: "Campaign Ops", body: "Contracts, timelines, approvals, payouts. Handled end to end.", visual: "ops" },
            { title: "Amplification", body: "Whitelisting and creator-led ads that make great posts perform.", visual: "amplify" },
            { title: "Insights", body: "Live dashboards and post-campaign reads on what moved, and why.", visual: "insights" },
        ],
    },
    talkLabel: { type: ControlType.String, title: "Talk card", defaultValue: "Let's talk" },
    talkHref: { type: ControlType.String, title: "Talk link", defaultValue: "#lets-talk" },
})
