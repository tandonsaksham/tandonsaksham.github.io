// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slides 15 and 17, "the receipts". Variant "grid" (cream) — The receipts., the
// giant vermilion total and four stat tiles; variant "hero" (ink) — the giant lift figure
// and a row of four stats. The deck's "[__]" blanks open up like a form waiting to be filled.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"

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
@container (max-width:640px){.wm-wrap{padding-top:58px;padding-bottom:54px}}
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

type BoxProps = {
    as?: any
    className?: string
    style?: React.CSSProperties
    delay?: number
    amount?: number
    children?: React.ReactNode
    [k: string]: any
}

function Fade(p: BoxProps) {
    const { as, className, style, delay, amount, children, ...rest } = p
    const Tag = as || "div"
    const [ref, inCls] = useIn<HTMLElement>(amount ?? 0.25)
    return (
        <Tag ref={ref} className={"wm-fade " + (className || "") + inCls} style={{ ...cssVars({ "--d": (delay || 0) + "s" }), ...style }} {...rest}>
            {children}
        </Tag>
    )
}

/** Staggers its direct children in, one after another. */
function Stagger(p: BoxProps & { step?: number }) {
    const { as, className, style, delay, amount, children, step, ...rest } = p
    const Tag = as || "div"
    const [ref, inCls] = useIn<HTMLElement>(amount ?? 0.15)
    let n = 0
    const kids = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        const el = child as React.ReactElement<any>
        return React.cloneElement(el, { style: { ...(el.props.style || {}), ...cssVars({ "--i": n++ }) } })
    })
    return (
        <Tag
            ref={ref}
            className={"wm-stag " + (className || "") + inCls}
            style={{ ...cssVars({ "--d0": (delay || 0) + "s", "--st": (step ?? 0.09) + "s" }), ...style }}
            {...rest}
        >
            {kids}
        </Tag>
    )
}

type ScriptProps = {
    children?: React.ReactNode
    className?: string
    style?: React.CSSProperties
    delay?: number
    rotate?: number
    as?: any
}

/** Handwritten note that writes itself on from left to right.
    The observed outer element is never clipped; clipping it would hide it from IntersectionObserver. */
function Script(p: ScriptProps) {
    const Tag = p.as || "span"
    const [ref, inCls] = useIn<HTMLElement>(0.6)
    return (
        <Tag
            ref={ref}
            className={"wm-script wm-note " + (p.className || "") + inCls}
            style={{ transform: "rotate(" + (p.rotate ?? -3) + "deg)", ...p.style }}
        >
            <span className="wm-write" style={cssVars({ "--d": (p.delay || 0) + "s" })}>
                {p.children}
            </span>
        </Tag>
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

type Stat = { label: string; value: string }

type ReceiptsProps = {
    variant: "grid" | "hero"
    tag: string
    headline: string
    bigLabel: string
    bigValue: string
    note: string
    statsGrid: Stat[]
    statsHero: Stat[]
    changedLabel: string
    changedText: string
    style?: React.CSSProperties
}

const RECEIPTS_CSS = `
.wmr-big{display:inline-flex;align-items:baseline;font-weight:800;line-height:.8;letter-spacing:-.05em;color:var(--red);white-space:nowrap}
.wmr-blank{display:inline-block;position:relative;width:0;height:.62em;transition:width 1.4s var(--ease-io) .2s}
.wmr-blank::after{content:"";position:absolute;left:.06em;right:.06em;bottom:-.02em;height:.09em;background:currentColor;animation:wmblink 1.2s steps(1,end) infinite}
.wmr-bigin.wm-in .wmr-blank{width:var(--bw,1.1em)}
.wmrg-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,5cqw,90px);align-items:stretch;margin-top:clamp(24px,3cqw,44px)}
.wmrg-left{display:flex;flex-direction:column;justify-content:space-between;gap:40px}
.wmrg-h{font-weight:800;font-size:clamp(48px,7cqw,108px);line-height:.92;letter-spacing:-.05em}
.wmrg-total .wm-mono{display:block;margin-bottom:10px}
.wmrg-total .wmr-big{font-size:clamp(96px,13.5cqw,210px)}
.wmrg-note{display:inline-block;margin-top:14px;font-size:clamp(20px,1.9cqw,28px)}
.wmrg-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px)}
.wmrg-tile{position:relative;border-radius:16px;background:var(--cream2);padding:clamp(14px,1.4cqw,20px);min-height:clamp(140px,12.5cqw,190px);display:flex;flex-direction:column;justify-content:space-between}
.wmrg-pill{align-self:flex-start;display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:99px;background:var(--paper);font-size:12.5px;font-weight:500}
.wmrg-v{align-self:flex-end;font-weight:800;font-size:clamp(34px,4.1cqw,62px);letter-spacing:-.045em;line-height:.9}
.wmrg-changed{grid-column:1/-1;border-radius:16px;background:var(--ink);color:var(--cream);padding:clamp(18px,1.8cqw,26px)}
.wmrg-changed .wm-mono{color:var(--red);text-transform:uppercase;letter-spacing:.08em}
.wmrg-changed p{margin-top:10px;font-size:clamp(16px,1.4cqw,20px);line-height:1.4;max-width:30em}
.wmrh-row{display:flex;align-items:center;gap:clamp(24px,4cqw,64px);margin-top:clamp(24px,3cqw,44px);flex-wrap:wrap}
.wmrh-row .wmr-big{font-size:clamp(120px,19cqw,300px)}
.wmrh-side{max-width:22em}
.wmrh-side h3{font-weight:760;font-size:clamp(24px,2.5cqw,38px);line-height:1.08;letter-spacing:-.03em}
.wmrh-note{display:inline-block;margin-top:12px;color:var(--cream);opacity:.9}
.wmrh-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(48px,6cqw,96px)}
.wmrh-stat{padding:4px clamp(14px,1.6cqw,24px) 0;border-left:1px solid var(--line2)}
.wmrh-stat .wm-mono{color:var(--mut);text-transform:uppercase;letter-spacing:.08em;font-size:11.5px}
.wmrh-stat b{display:block;margin-top:10px;font-weight:800;font-size:clamp(30px,3.4cqw,50px);letter-spacing:-.045em;line-height:.95}
@container (max-width:860px){.wmrg-grid{grid-template-columns:1fr}.wmrh-stats{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:28px}}
@container (max-width:640px){.wmrg-grid{gap:26px}.wmrg-left{gap:22px}.wmrg-tile{min-height:120px}.wmrh-stats{margin-top:34px}}
`

/** Giant "[__]M" with brackets that open up and a blinking blank. */
function BigBlank(p: { value: string; delay?: number }) {
    const [ref, inCls] = useIn<HTMLSpanElement>(0.4)
    const parts = (p.value || "").split("[__]")
    if (parts.length < 2) return <span className="wmr-big">{p.value}</span>
    return (
        <span ref={ref} className={"wmr-big wmr-bigin" + inCls} aria-label={p.value.replace("[__]", "blank ")}>
            <span aria-hidden="true">{parts[0]}[</span>
            <span className="wmr-blank" aria-hidden="true" />
            <span aria-hidden="true">]{parts.slice(1).join("[__]")}</span>
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMReceipts(props: ReceiptsProps) {
    const variant = props.variant || "grid"
    const isGrid = variant === "grid"
    const {
        tag = isGrid ? "Case file 001 — the receipts" : "Case file 002 — the receipts",
        headline = isGrid ? "The receipts." : "lift in [the metric that mattered most]",
        bigLabel = "Total views",
        bigValue = isGrid ? "[__]M" : "[__]%",
        note = isGrid ? "numbers don't lie (we checked twice)" : "the number the CFO asked about first",
        statsGrid = [
            { label: "Reach", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Saves + shares", value: "[__]K" },
            { label: "Cost per view", value: "₹[__]" },
        ],
        statsHero = [
            { label: "Views", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Creators", value: "[__]" },
            { label: "Cost per engagement", value: "₹[__]" },
        ],
        changedLabel = "What changed for [brand]",
        changedText = "[The business outcome in one line: sell-out, app installs, search lift, store footfall.]",
        style,
    } = props

    const stats = isGrid ? statsGrid : statsHero

    if (isGrid) {
        return (
            <Section theme="cream" className="wmr" css={RECEIPTS_CSS} style={style} label={tag}>
                <div className="wm-wrap">
                    <Chrome label={tag} />
                    <div className="wmrg-grid">
                        <div className="wmrg-left">
                            <Words as="h2" className="wmrg-h" text={headline} />
                            <div className="wmrg-total">
                                <Fade className="wm-mono wm-cap wm-mut">{bigLabel}</Fade>
                                <BigBlank value={bigValue} />
                                <div>
                                    <Script className="wmrg-note" delay={1.1} rotate={-2}>
                                        {note}
                                    </Script>
                                </div>
                            </div>
                        </div>
                        <Stagger className="wmrg-tiles" step={0.09}>
                            {stats.slice(0, 4).map((s, i) => (
                                <div className="wmrg-tile" key={i}>
                                    <span className="wmrg-pill">{s.label}</span>
                                    <span className="wmrg-v">{fill(s.value)}</span>
                                </div>
                            ))}
                            <div className="wmrg-changed">
                                <span className="wm-mono">{changedLabel}</span>
                                <p>{fill(changedText)}</p>
                            </div>
                        </Stagger>
                    </div>
                </div>
            </Section>
        )
    }

    return (
        <Section theme="ink" className="wmr" css={RECEIPTS_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmrh-row">
                    <BigBlank value={bigValue} />
                    <div className="wmrh-side">
                        <Words as="h3" text={headline} delay={0.4} />
                        <Script className="wmrh-note" delay={1.1} rotate={-2}>
                            {note}
                        </Script>
                    </div>
                </div>
                <Stagger className="wmrh-stats" step={0.09}>
                    {stats.slice(0, 4).map((s, i) => (
                        <div className="wmrh-stat" key={i}>
                            <span className="wm-mono">{s.label}</span>
                            <b>{fill(s.value)}</b>
                        </div>
                    ))}
                </Stagger>
            </div>
        </Section>
    )
}

addPropertyControls(WMReceipts, {
    variant: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["grid", "hero"],
        optionTitles: ["Tiles (cream)", "Big number (ink)"],
        defaultValue: "grid",
        displaySegmentedControl: true,
    },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Case file 001 — the receipts" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "The receipts." },
    bigLabel: { type: ControlType.String, title: "Big label", defaultValue: "Total views", hidden: (p: any) => p.variant === "hero" },
    bigValue: { type: ControlType.String, title: "Big number", defaultValue: "[__]M" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "numbers don't lie (we checked twice)" },
    statsGrid: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
            },
        },
        defaultValue: [
            { label: "Reach", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Saves + shares", value: "[__]K" },
            { label: "Cost per view", value: "₹[__]" },
        ],
        hidden: (p: any) => p.variant === "hero",
    },
    statsHero: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
            },
        },
        defaultValue: [
            { label: "Views", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Creators", value: "[__]" },
            { label: "Cost per engagement", value: "₹[__]" },
        ],
        hidden: (p: any) => p.variant !== "hero",
    },
    changedLabel: { type: ControlType.String, title: "Outcome label", defaultValue: "What changed for [brand]", hidden: (p: any) => p.variant === "hero" },
    changedText: {
        type: ControlType.String,
        title: "Outcome",
        displayTextArea: true,
        defaultValue: "[The business outcome in one line: sell-out, app installs, search lift, store footfall.]",
        hidden: (p: any) => p.variant === "hero",
    },
})
