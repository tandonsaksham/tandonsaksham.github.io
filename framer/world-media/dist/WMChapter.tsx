// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the chapter opener used five times (01 The shift … 05 What's next). The giant
// vermilion numeral is cut into eleven slices that fly in from alternating sides and lock
// together over a faint outline of itself. The cursor smears the slices sideways like wet paint
// and they spring back; scrolling sends a ripple through them. The spaced label blurs into focus,
// the stack of short lines marks the chapter's position, and the long rule divides headline from body.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"

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

type BoxProps = {
    as?: any
    className?: string
    style?: React.CSSProperties
    delay?: number
    amount?: number
    children?: React.ReactNode
    [k: string]: any
}

function Rise(p: BoxProps) {
    const { as, className, style, delay, amount, children, ...rest } = p
    const Tag = as || "div"
    const [ref, inCls] = useIn<HTMLElement>(amount ?? 0.25)
    return (
        <Tag ref={ref} className={"wm-rise " + (className || "") + inCls} style={{ ...cssVars({ "--d": (delay || 0) + "s" }), ...style }} {...rest}>
            {children}
        </Tag>
    )
}

function Rule(p: { className?: string; style?: React.CSSProperties; delay?: number; strong?: boolean }) {
    const [ref, inCls] = useIn<HTMLDivElement>(0.5)
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={"wm-hr wm-draw" + (p.strong ? " s " : " ") + (p.className || "") + inCls}
            style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}
        />
    )
}

/** Scroll-linked drift for depth. Returns a MotionValue for `y`. */
function useDrift(ref: React.RefObject<HTMLElement>, distance: number) {
    const still = useStill()
    const { scrollYProgress } = useScroll({ target: ref as React.RefObject<HTMLElement>, offset: ["start end", "end start"] })
    return useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [distance, -distance])
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

const GRAIN_CSS = `
.wm-grain{position:absolute;inset:-6%;z-index:3;pointer-events:none;opacity:var(--gr,.07);mix-blend-mode:overlay;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
animation:wm-grain .9s steps(5) infinite}
.wm-grain.still{animation:none}
@keyframes wm-grain{0%{transform:translate3d(0,0,0)}20%{transform:translate3d(-3%,2%,0)}40%{transform:translate3d(2%,-3%,0)}60%{transform:translate3d(-2%,-2%,0)}80%{transform:translate3d(3%,3%,0)}100%{transform:translate3d(0,0,0)}}
@media (prefers-reduced-motion:reduce){.wm-grain{animation:none}}
`

/** Film grain for ink sections: a quiet texture that keeps flat colour from feeling digital. */
function Grain(p: { still?: boolean; amount?: number }) {
    return (
        <div aria-hidden="true" className={"wm-grain" + (p.still ? " still" : "")} style={cssVars({ "--gr": p.amount ?? 0.07 })}>
            <style>{GRAIN_CSS}</style>
        </div>
    )
}

type ChapterProps = {
    number: string
    label: string
    headline: string
    body: string
    total: number
    anchor: string
    style?: React.CSSProperties
}

const SLICES = 11

const CHAPTER_CSS = `
.wmc.wm-sec{background:radial-gradient(60% 55% at 70% 52%,rgba(242,238,229,.05),rgba(242,238,229,.018) 55%,transparent 88%),var(--ink)}
.wmc .wm-wrap{padding-top:clamp(88px,9cqw,136px);padding-bottom:clamp(88px,9cqw,136px)}
.wmc-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4cqw,64px);align-items:stretch}
.wmc-rule{position:absolute;left:0;right:0;top:50%;z-index:0}
.wmc-num{position:relative;z-index:1;display:flex;align-items:center;min-height:clamp(150px,24cqw,380px);padding-left:clamp(56px,7cqw,112px)}
.wmc-lines{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:clamp(6px,.7cqw,10px);width:clamp(40px,5cqw,76px)}
.wmc-lines i{display:block;height:1px;width:78%;background:var(--line2);transform:scaleX(0);transform-origin:0 50%;transition:transform 1s var(--ease);transition-delay:calc(var(--k) * .07s + .1s)}
.wmc-lines i.on{height:2px;width:100%;background:var(--red)}
.wmc-lines.wm-in i{transform:none}
.wmc-drift{position:relative;z-index:0}
.wmc-obj{position:relative;display:block;font-weight:800;font-size:clamp(150px,24cqw,380px);line-height:.78;letter-spacing:-.06em;color:var(--red);--sh:calc(.9em / 11)}
.wmc-size{display:block;visibility:hidden;white-space:nowrap;padding:.08em .03em .04em}
.wmc-ghost{position:absolute;left:0;top:0;white-space:nowrap;padding:.08em .03em .04em;color:transparent;-webkit-text-stroke:1.5px rgba(233,67,27,.45);opacity:0;transform:translate3d(.07em,.07em,0);transition:opacity 1.2s var(--ease) .95s,transform 1.8s var(--ease) .95s}
.wmc-obj.wm-in .wmc-ghost{opacity:1;transform:translate3d(.035em,.035em,0)}
.wmc-slice{position:absolute;left:-.25em;right:-.25em;top:calc(var(--k) * var(--sh));height:calc(var(--sh) + 1px);overflow:hidden;will-change:transform}
.wmc-sl{position:absolute;left:.25em;top:calc(var(--k) * var(--sh) * -1);white-space:nowrap;padding:.08em .03em .04em;transform:translate3d(calc(var(--dir) * 140%),0,0);transition:transform 1.35s cubic-bezier(.16,1,.3,1);transition-delay:calc(60ms + var(--k) * 55ms)}
.wmc-obj.wm-in .wmc-sl{transform:none}
.wmc-obj.wm-now .wmc-sl,.wmc-obj.wm-now .wmc-ghost{transition:none}
.wmc-label{position:absolute;left:clamp(80px,10cqw,160px);top:50%;transform:translateY(-50%);z-index:2;white-space:nowrap;font-weight:300;font-size:clamp(14px,1.55cqw,23px);text-transform:uppercase;letter-spacing:.34em;color:var(--cream);pointer-events:none}
.wmc-label>span{display:inline-block;opacity:0;filter:blur(10px);transform:translate3d(0,.45em,0);transition:opacity .9s var(--ease),filter 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:calc(.8s + var(--k) * 45ms)}
.wmc-label.wm-in>span{opacity:1;filter:blur(0);transform:none}
.wmc-label.wm-now>span{transition:none}
.wmc-text{position:relative;z-index:1;display:grid;grid-template-rows:1fr 1fr}
.wmc-h{align-self:end;padding-bottom:clamp(28px,3.4cqw,52px);font-weight:760;font-size:clamp(30px,3.7cqw,58px);line-height:1;letter-spacing:-.035em;max-width:14em}
.wmc-b{align-self:start;padding-top:clamp(20px,2.2cqw,32px);max-width:34em;color:var(--mut)}
@container (max-width:760px){
.wmc-grid{grid-template-columns:1fr;gap:28px}
.wmc-rule{top:clamp(75px,24cqw,190px)}
.wmc-num{min-height:0;padding-left:clamp(48px,14cqw,72px)}
.wmc-obj{font-size:clamp(130px,40cqw,300px)}
.wmc-label{left:clamp(64px,20cqw,110px)}
.wmc-text{grid-template-rows:auto auto}
.wmc-h{padding-bottom:16px}.wmc-b{padding-top:0}
}
@container (max-width:560px){.wmc-h br{display:none}}
@media (prefers-reduced-motion:reduce){.wmc-sl,.wmc-lines i{transform:none!important}.wmc-ghost{opacity:1!important}.wmc-label>span{opacity:1!important;filter:none!important;transform:none!important}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMChapter(props: ChapterProps) {
    const {
        number = "01",
        label = "The shift",
        headline = "People tune out ads.\nThey listen to people.",
        body = "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
        total = 5,
        anchor = "the-shift",
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const pos = Math.max(1, Math.min(total, parseInt(number, 10) || 1))
    const numRef = React.useRef<HTMLDivElement>(null)
    const drift = useDrift(numRef, 28)
    const [linesRef, linesIn] = useIn<HTMLDivElement>(0.5)
    const [objRef, objIn] = useIn<HTMLDivElement>(0.35)
    const [labelRef, labelIn] = useIn<HTMLSpanElement>(0.5)
    const slices = React.useRef<(HTMLDivElement | null)[]>([])

    // Wet-paint slices: the cursor's sideways speed pushes nearby slices, scroll speed sends a ripple
    // down them, and each slice springs back on its own.
    React.useEffect(() => {
        const obj = objRef.current
        const sec = obj ? (obj.closest("section") as HTMLElement | null) : null
        if (!obj || !sec || still) return
        const off = new Float32Array(SLICES)
        const vel = new Float32Array(SLICES)
        let raf = 0
        let last = 0
        let lx: number | null = null
        const run = (now: number) => {
            const dt = Math.min(0.034, (now - last) / 1000 || 0.016)
            last = now
            let busy = false
            for (let i = 0; i < SLICES; i++) {
                vel[i] += (-190 * off[i] - 13 * vel[i]) * dt
                off[i] = Math.max(-140, Math.min(140, off[i] + vel[i] * dt))
                if (Math.abs(off[i]) > 0.2 || Math.abs(vel[i]) > 2) busy = true
                else {
                    off[i] = 0
                    vel[i] = 0
                }
                const el = slices.current[i]
                if (el) el.style.transform = off[i] ? "translate3d(" + off[i].toFixed(2) + "px,0,0)" : ""
            }
            raf = busy ? requestAnimationFrame(run) : 0
        }
        const kick = () => {
            if (!raf) {
                last = performance.now()
                raf = requestAnimationFrame(run)
            }
        }
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const dx = lx === null ? 0 : e.clientX - lx
            lx = e.clientX
            const r = obj.getBoundingClientRect()
            if (!dx || e.clientY < r.top - 60 || e.clientY > r.bottom + 60) return
            const y = e.clientY - r.top
            const h = r.height / SLICES
            const sig = r.height * 0.13
            const push = Math.max(-40, Math.min(40, dx)) * 9
            for (let i = 0; i < SLICES; i++) {
                const d = y - (i + 0.5) * h
                vel[i] += push * Math.exp(-(d * d) / (2 * sig * sig))
            }
            kick()
        }
        const onLeave = () => {
            lx = null
        }
        let sy = window.scrollY
        const onScroll = () => {
            const ny = window.scrollY
            const dy = Math.max(-80, Math.min(80, ny - sy))
            sy = ny
            const r = obj.getBoundingClientRect()
            if (!dy || r.bottom < 0 || r.top > window.innerHeight) return
            for (let i = 0; i < SLICES; i++) vel[i] += Math.sin(i * 0.9 + ny * 0.01) * dy * 5
            kick()
        }
        if (fine) {
            sec.addEventListener("pointermove", onMove)
            sec.addEventListener("pointerleave", onLeave)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            cancelAnimationFrame(raf)
            sec.removeEventListener("pointermove", onMove)
            sec.removeEventListener("pointerleave", onLeave)
            window.removeEventListener("scroll", onScroll)
            slices.current.forEach((el) => {
                if (el) el.style.transform = ""
            })
        }
    }, [still, fine])

    return (
        <Section theme="ink" id={anchor} className="wmc" css={CHAPTER_CSS} style={style} label={"Chapter " + number + " — " + label}>
            <Grain still={still} amount={0.06} />
            <div className="wm-wrap">
                <div className="wmc-grid">
                    <Rule className="wmc-rule" delay={0.35} />
                    <div ref={numRef} className="wmc-num">
                        <div ref={linesRef} className={"wmc-lines" + linesIn} aria-hidden="true">
                            {Array.from({ length: total }).map((_, k) => (
                                <i key={k} className={k + 1 === pos ? "on" : undefined} style={cssVars({ "--k": k })} />
                            ))}
                        </div>
                        <motion.div className="wmc-drift" style={{ y: drift }}>
                            <div ref={objRef} className={"wmc-obj" + objIn} aria-hidden="true">
                                <span className="wmc-ghost">{number}</span>
                                <span className="wmc-size">{number}</span>
                                {Array.from({ length: SLICES }).map((_, k) => (
                                    <div
                                        className="wmc-slice"
                                        key={k}
                                        ref={(el) => {
                                            slices.current[k] = el
                                        }}
                                        style={cssVars({ "--k": k, "--dir": k % 2 ? 1 : -1 })}
                                    >
                                        <span className="wmc-sl">{number}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <span ref={labelRef} className={"wmc-label" + labelIn} aria-hidden="true">
                            {Array.from(label).map((ch, k) => (
                                <span key={k} style={cssVars({ "--k": k })}>
                                    {ch === " " ? String.fromCharCode(160) : ch}
                                </span>
                            ))}
                        </span>
                    </div>
                    <div className="wmc-text">
                        <Words as="h2" className="wmc-h" text={headline} delay={0.3} stagger={0.05} />
                        <Rise as="p" className="wmc-b wm-body" delay={0.55}>
                            {body}
                        </Rise>
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMChapter, {
    number: { type: ControlType.String, title: "Number", defaultValue: "01" },
    label: { type: ControlType.String, title: "Label", defaultValue: "The shift" },
    headline: {
        type: ControlType.String,
        title: "Headline",
        displayTextArea: true,
        defaultValue: "People tune out ads.\nThey listen to people.",
    },
    body: {
        type: ControlType.String,
        title: "Body",
        displayTextArea: true,
        defaultValue:
            "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
    },
    total: { type: ControlType.Number, title: "Chapters", defaultValue: 5, min: 1, max: 9, step: 1 },
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "the-shift" },
})
