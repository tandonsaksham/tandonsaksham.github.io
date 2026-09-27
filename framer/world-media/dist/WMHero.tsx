// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 1 — "World Media." as kinetic type. The letters inflate from hairline to heavy
// on load, thin out wherever the cursor passes, can be grabbed and flung (they spring home), and
// part ways as you scroll. A live Delhi clock, film grain and a scroll-reactive ticker of the six
// capabilities along the bottom edge keep the first screen moving.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame, useVelocity } from "framer-motion"

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

const ARROWS: Record<string, { vb: string; body: string; head: string }> = {
    curl: { vb: "0 0 120 96", body: "M100 6 C 110 36, 94 70, 28 80", head: "M44 67 L 26 80.5 L 46 90" },
    hook: { vb: "0 0 96 84", body: "M12 4 C 1 32, 7 60, 70 64", head: "M55 51 L 72 64 L 55 77" },
    long: { vb: "0 0 240 40", body: "M4 20 C 70 18, 150 22, 226 20", head: "M206 6 L 230 20 L 206 34" },
    down: { vb: "0 0 60 110", body: "M30 4 C 26 40, 36 70, 30 98", head: "M16 84 L 30 100 L 44 84" },
    swoop: { vb: "0 0 150 80", body: "M6 64 C 40 10, 100 6, 138 40", head: "M118 34 L 140 42 L 132 20" },
}

type ArrowProps = { kind?: string; className?: string; style?: React.CSSProperties; delay?: number; stroke?: number }

/** Hand-drawn arrow, stroked on when it scrolls into view. */
function Arrow(p: ArrowProps) {
    const a = ARROWS[p.kind || "curl"] || ARROWS.curl
    const [ref, inCls] = useIn<SVGSVGElement>(0.5)
    return (
        <svg
            ref={ref}
            className={"wm-svg " + (p.className || "") + inCls}
            viewBox={a.vb}
            fill="none"
            stroke="currentColor"
            strokeWidth={p.stroke ?? 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}
            aria-hidden="true"
        >
            <path d={a.body} pathLength={1} />
            <path className="h" d={a.head} pathLength={1} />
        </svg>
    )
}

/** The deck's cream label block behind a word — wipes on, then the word slides in. */
function Mark(p: { children?: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
    const [ref, inCls] = useIn<HTMLSpanElement>(0.4)
    return (
        <span ref={ref} className={"wm-mark " + (p.className || "") + inCls} style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}>
            <b aria-hidden="true" />
            <span>{p.children}</span>
        </span>
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

type HeroProps = {
    location: string
    clock: boolean
    timeZone: string
    zone: string
    line1: string
    line2: string
    note: string
    hint: string
    intro: string
    ticker: string
    style?: React.CSSProperties
}

const HERO_CSS = `
.wmh-in{position:relative;display:flex;flex-direction:column;min-height:min(100svh,1000px)}
.wmh .wm-wrap{z-index:2;flex:1;display:flex;flex-direction:column;padding-top:clamp(104px,9.4cqw,136px);padding-bottom:clamp(18px,2cqw,30px)}
.wmh-fx{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.wmh-spot{position:absolute;left:0;top:0;width:1100px;height:1100px;margin:-550px 0 0 -550px;border-radius:50%;background:radial-gradient(closest-side,rgba(242,238,229,.08),rgba(242,238,229,.05) 30%,rgba(242,238,229,.022) 60%,rgba(242,238,229,.006) 85%,transparent);opacity:0;transition:opacity .9s var(--ease)}
.wmh.hot .wmh-spot{opacity:1}
.wmh-top{display:flex;justify-content:flex-end;align-items:center;gap:16px}
.wmh-loc{gap:9px;height:28px;padding:0 13px}
.wmh-live{position:relative;display:block;width:6px;height:6px;border-radius:50%;background:var(--red);flex:none}
.wmh-live::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:1px solid var(--red);opacity:0;animation:wmh-ping 2.4s var(--ease) infinite}
@keyframes wmh-ping{0%{transform:scale(.4);opacity:.9}70%,100%{transform:scale(1.7);opacity:0}}
.wmh-time{font-family:"DM Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.04em;opacity:.7;padding-left:9px;border-left:1px solid var(--line2)}
.wmh-stage{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(20px,2.6cqw,40px) 0 clamp(16px,2cqw,32px)}
.wmh-title{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start;font-size:clamp(76px,min(15.8cqw,24svh),248px);-webkit-user-select:none;user-select:none}
.wmh-row{position:relative;display:block}
.wmh-l1{display:inline-block;overflow:hidden;padding:.08em .06em .02em;margin:-.08em -.06em -.02em;white-space:nowrap}
.wmh-c{display:inline-block;transform:translate3d(0,110%,0);transition:transform 1.25s var(--ease);transition-delay:var(--d)}
.wmh-cm{display:inline-block}
.wmh-title.wm-in .wmh-c{transform:none}
.wmh-g{position:relative;display:inline-block;font-variation-settings:"wght" 200;transition:font-variation-settings 1.9s var(--ease) calc(var(--d) + .1s)}
.wmh-title.wm-in .wmh-g{font-variation-settings:"wght" 800}
.wmh-title.wm-now .wmh-g,.wmh-title.live .wmh-g{transition:none}
.wmh-title.live .wmh-l1{overflow:visible}
.wmh-title.live .wm-mark>span{clip-path:none}
.wmh-title.grab .wmh-g{cursor:grab}
.wmh-title.wave .wmh-g{animation:wmh-wave 7s var(--ease-io) infinite;animation-delay:calc(1.4s + var(--i) * .11s)}
@keyframes wmh-wave{0%,55%,100%{font-variation-settings:"wght" 800}68%{font-variation-settings:"wght" 330}82%{font-variation-settings:"wght" 800}}
.wmh-title .wm-mark{margin-top:.06em;padding-right:.9em}
.wmh-noteanchor{position:absolute;left:2.95em;top:-.02em;width:0;height:0}
.wmh-note{position:absolute;left:.12em;top:.06em;white-space:nowrap;font-size:clamp(18px,1.95cqw,30px);color:var(--red)}
.wmh-arrow{position:absolute;left:.62em;top:.5em;width:.55em;height:.44em;color:var(--red)}
.wmh-hint{position:absolute;left:calc(100% + clamp(14px,1.8cqw,28px));bottom:.16em;transition:opacity .6s var(--ease),transform .6s var(--ease)}
.wmh-hint.gone{opacity:0;transform:translateY(8px)}
.wmh-hint .wm-script{font-size:clamp(17px,1.6cqw,24px);color:var(--stone);white-space:nowrap}
.wmh-bottom{display:flex;align-items:flex-end}
.wmh-intro{max-width:34em;font-size:clamp(16px,1.45cqw,20px);line-height:1.5;color:var(--mut)}
.wmh-ticker{position:relative;z-index:2;flex:none;overflow:hidden;border-top:1px solid var(--line);padding:clamp(14px,1.6cqw,24px) 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.wmh-track{display:flex;width:max-content;will-change:transform}
.wmh-set{display:flex;flex:none}
.wmh-item{display:inline-flex;align-items:center;gap:clamp(18px,2.2cqw,34px);padding-right:clamp(18px,2.2cqw,34px);font-weight:700;font-size:clamp(22px,2.5cqw,38px);letter-spacing:-.035em;line-height:1.1;white-space:nowrap;color:var(--cream)}
.wmh-item:nth-child(3n+2){color:var(--stone)}
.wmh-item i{display:block;width:.22em;height:.22em;border-radius:50%;background:var(--red);flex:none}
@container (max-width:760px){
.wmh-in{min-height:0}
.wmh-stage{padding:56px 0 44px}
.wmh-title{font-size:clamp(76px,25.5cqw,196px)}
.wmh-title .wm-mark{padding-right:.3em}
.wmh-noteanchor{position:relative;left:auto;top:auto;width:auto;height:auto;display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding-left:6px}
.wmh-note{position:relative;left:0;top:0;margin-top:16px;font-size:clamp(20px,5.6cqw,28px);transform:rotate(-3deg)!important}
.wmh-arrow{position:relative;left:0;top:0;flex:none;width:40px;height:32px;transform:scaleY(-1)}
.wmh-hint{display:none}
}
@media (prefers-reduced-motion:reduce){.wmh-c{transform:none!important}.wmh-g{font-variation-settings:"wght" 800!important}}
`

const wrapTo = (min: number, max: number, v: number) => {
    const r = max - min
    return ((((v - min) % r) + r) % r) + min
}

/** The six capabilities on a loop. It drifts on its own, races and leans with scroll speed,
    and reverses when you scroll back up. */
function Ticker(p: { items: string[]; still: boolean }) {
    const box = React.useRef<HTMLDivElement>(null)
    const first = React.useRef<HTMLDivElement>(null)
    const on = useInView(box, { amount: 0 })
    const { scrollY } = useScroll()
    const speed = useVelocity(scrollY)
    const vel = useSpring(speed, { damping: 50, stiffness: 400 })
    const skew = useTransform(vel, [-2600, 0, 2600], p.still ? [0, 0, 0] : [7, 0, -7])
    const x = useMotionValue(0)
    const base = React.useRef(0)
    const dir = React.useRef(-1)
    const width = React.useRef(1)
    React.useEffect(() => {
        const el = first.current
        if (!el) return
        const m = () => {
            width.current = Math.max(1, el.getBoundingClientRect().width)
        }
        m()
        const ro = new ResizeObserver(m)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    useAnimationFrame((_t, delta) => {
        if (p.still || !on) return
        const v = vel.get()
        if (v > 8) dir.current = -1
        else if (v < -8) dir.current = 1
        const pace = 56 * (1 + Math.min(7, Math.abs(v) / 300))
        base.current += (dir.current * pace * Math.min(delta, 64)) / 1000
        x.set(wrapTo(-width.current, 0, base.current))
    })
    const set = (k: number) => (
        <div className="wmh-set" ref={k === 0 ? first : undefined} key={k}>
            {[0, 1].map((r) =>
                p.items.map((t, i) => (
                    <span className="wmh-item" key={r + "-" + i}>
                        {t}
                        <i />
                    </span>
                ))
            )}
        </div>
    )
    return (
        <div className="wmh-ticker" ref={box} aria-hidden="true">
            <motion.div className="wmh-track" style={{ x, skewX: skew }}>
                {set(0)}
                {set(1)}
            </motion.div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMHero(props: HeroProps) {
    const {
        location = "Delhi, India",
        clock = true,
        timeZone = "Asia/Kolkata",
        zone = "IST",
        line1 = "World",
        line2 = "Media.",
        note = "psst… this is our portfolio too",
        hint = "go on, grab a letter",
        intro = "Culture moves through people. We put brands right where the conversation is happening.",
        ticker = "Strategy, Casting, Content Studio, Campaign Ops, Amplification, Insights",
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const still = useStill()
    const fine = useFinePointer()
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const [titleRef, titleIn] = useIn<HTMLHeadingElement>(0.2)
    const glyphs = React.useRef<(HTMLSpanElement | null)[]>([])
    const [live, setLive] = React.useState(false)
    const [hot, setHot] = React.useState(false)
    const [grabbed, setGrabbed] = React.useState(false)
    const [time, setTime] = React.useState("")

    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] })
    const x1 = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "-12%"])
    const x2 = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "9%"])
    const lift = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, -50])
    const noteY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, -150])
    const fade = useTransform(scrollYProgress, [0, 0.5], still ? [1, 1] : [1, 0])
    const spotX = useSpring(0, { stiffness: 110, damping: 24 })
    const spotY = useSpring(0, { stiffness: 110, damping: 24 })

    // Once the letters have landed, hand them over to the cursor.
    React.useEffect(() => {
        if (still || !titleIn || titleIn.indexOf("wm-now") > -1) return
        const t = setTimeout(() => setLive(true), 2300)
        return () => clearTimeout(t)
    }, [still, titleIn])

    // Local time in the location pill. Rendered after mount so the published page never mismatches.
    React.useEffect(() => {
        if (!clock || isStatic) return
        let fmt: Intl.DateTimeFormat
        try {
            fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timeZone || undefined })
        } catch (e) {
            return
        }
        const tick = () => setTime(fmt.format(new Date()))
        tick()
        const id = setInterval(tick, 10000)
        return () => clearInterval(id)
    }, [clock, timeZone, isStatic])

    // Cursor: nearby letters lose weight and a soft light follows. Scroll: every letter thins as the hero leaves.
    React.useEffect(() => {
        const wrap = wrapRef.current
        const sec = wrap ? (wrap.closest("section") as HTMLElement | null) : null
        if (!sec || still || !fine || !live) return
        const els = glyphs.current.filter((el): el is HTMLSpanElement => !!el)
        if (!els.length) return
        const cur = els.map(() => 800)
        let pts: { x: number; y: number }[] = []
        let reach = 260
        let cx = -9999
        let cy = -9999
        let raf = 0
        let stale = true
        const measure = () => {
            pts = els.map((el) => {
                const r = el.getBoundingClientRect()
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
            })
            reach = (parseFloat(getComputedStyle(els[0]).fontSize) || 220) * 1.05
            stale = false
        }
        const frame = () => {
            raf = 0
            if (stale) measure()
            const dip = Math.max(0, Math.min(1, scrollYProgress.get())) * 470
            let busy = false
            for (let i = 0; i < els.length; i++) {
                const d = Math.hypot(cx - pts[i].x, cy - pts[i].y)
                const f = Math.max(0, 1 - d / reach)
                const goal = Math.max(200, 800 - 540 * f * f * (3 - 2 * f) - dip)
                const next = cur[i] + (goal - cur[i]) * 0.15
                cur[i] = Math.abs(goal - next) < 0.4 ? goal : next
                if (cur[i] !== goal) busy = true
                els[i].style.fontVariationSettings = '"wght" ' + cur[i].toFixed(1)
            }
            if (busy) raf = requestAnimationFrame(frame)
        }
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(frame)
        }
        const place = (e: PointerEvent) => {
            const r = sec.getBoundingClientRect()
            cx = e.clientX
            cy = e.clientY
            spotX.set(e.clientX - r.left)
            spotY.set(e.clientY - r.top)
        }
        const onMove = (e: PointerEvent) => {
            place(e)
            kick()
        }
        const onEnter = (e: PointerEvent) => {
            const r = sec.getBoundingClientRect()
            spotX.jump(e.clientX - r.left)
            spotY.jump(e.clientY - r.top)
            setHot(true)
            onMove(e)
        }
        const onLeave = () => {
            cx = -9999
            cy = -9999
            setHot(false)
            kick()
        }
        const onScroll = () => {
            stale = true
            kick()
        }
        const unScroll = scrollYProgress.on("change", onScroll)
        const ro = new ResizeObserver(onScroll)
        ro.observe(sec)
        window.addEventListener("scroll", onScroll, { passive: true })
        sec.addEventListener("pointermove", onMove)
        sec.addEventListener("pointerenter", onEnter)
        sec.addEventListener("pointerleave", onLeave)
        kick()
        return () => {
            cancelAnimationFrame(raf)
            unScroll()
            ro.disconnect()
            window.removeEventListener("scroll", onScroll)
            sec.removeEventListener("pointermove", onMove)
            sec.removeEventListener("pointerenter", onEnter)
            sec.removeEventListener("pointerleave", onLeave)
            els.forEach((el) => (el.style.fontVariationSettings = ""))
        }
    }, [still, fine, live, scrollYProgress, spotX, spotY])

    const grab = live && fine && !still
    const items = ticker
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    let gi = 0
    const glyph = (ch: string, key: string, d: number, rise: boolean) => {
        const i = gi++
        return (
            <span className={rise ? "wmh-c" : "wmh-cm"} key={key} style={cssVars({ "--d": d.toFixed(3) + "s" })}>
                <motion.span
                    className="wmh-g"
                    ref={(el: HTMLSpanElement | null) => {
                        glyphs.current[i] = el
                    }}
                    style={cssVars({ "--i": i })}
                    drag={grab}
                    dragSnapToOrigin
                    dragElastic={0.4}
                    dragTransition={{ bounceStiffness: 420, bounceDamping: 13 }}
                    whileDrag={{ scale: 1.14, rotate: i % 2 ? 7 : -7, zIndex: 5, color: "#E9431B" }}
                    onDragStart={() => setGrabbed(true)}
                >
                    {ch === " " ? String.fromCharCode(160) : ch}
                </motion.span>
            </span>
        )
    }

    return (
        <Section theme="ink" className={"wmh" + (hot ? " hot" : "")} css={HERO_CSS} style={style} label={line1 + " " + line2}>
            <div className="wmh-fx" aria-hidden="true">
                {!still ? <motion.div className="wmh-spot" style={{ x: spotX, y: spotY }} /> : null}
            </div>
            <Grain still={still} amount={0.075} />
            <div className="wmh-in">
            <div className="wm-wrap" ref={wrapRef}>
                <div className="wmh-top">
                    <Fade delay={0.25}>
                        <span className="wm-pill wmh-loc">
                            <i className="wmh-live" aria-hidden="true" />
                            {location}
                            {time ? <span className="wmh-time">{time + " " + zone}</span> : null}
                        </span>
                    </Fade>
                </div>

                <div className="wmh-stage">
                    <motion.h1
                        ref={titleRef}
                        className={"wmh-title wm-mega" + titleIn + (live ? " live" : "") + (grab ? " grab" : "") + (live && !fine && !still ? " wave" : "")}
                        style={{ y: lift }}
                        aria-label={line1 + " " + line2}
                    >
                        <motion.span className="wmh-row" style={{ x: x1 }}>
                            <span className="wmh-l1" aria-hidden="true">
                                {Array.from(line1).map((ch, i) => glyph(ch, "a" + i, 0.2 + i * 0.055, true))}
                            </span>
                        </motion.span>
                        <motion.span className="wmh-row" style={{ x: x2 }} aria-hidden="true">
                            <Mark delay={0.62}>{Array.from(line2).map((ch, i) => glyph(ch, "b" + i, 0.62 + i * 0.04, false))}</Mark>
                            {hint && grab ? (
                                <span className={"wmh-hint" + (grabbed ? " gone" : "")}>
                                    <Script delay={0.3} rotate={-4}>
                                        {hint}
                                    </Script>
                                </span>
                            ) : null}
                        </motion.span>
                        <motion.span className="wmh-noteanchor" style={{ y: noteY }} aria-hidden="true">
                            <Arrow kind="curl" className="wmh-arrow" delay={1.95} stroke={3.2} />
                            <Script className="wmh-note" delay={1.35} rotate={-6}>
                                {note}
                            </Script>
                        </motion.span>
                    </motion.h1>
                </div>

                <motion.div className="wmh-bottom" style={{ opacity: fade }}>
                    <Rise as="p" className="wmh-intro" delay={1.15}>
                        {intro}
                    </Rise>
                </motion.div>
            </div>
            <Ticker items={items} still={still} />
            </div>
        </Section>
    )
}

addPropertyControls(WMHero, {
    location: { type: ControlType.String, title: "Location", defaultValue: "Delhi, India" },
    clock: { type: ControlType.Boolean, title: "Live clock", defaultValue: true },
    timeZone: { type: ControlType.String, title: "Time zone", defaultValue: "Asia/Kolkata", hidden: (p: any) => !p.clock },
    zone: { type: ControlType.String, title: "Zone label", defaultValue: "IST", hidden: (p: any) => !p.clock },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: "World" },
    line2: { type: ControlType.String, title: "Line 2 (block)", defaultValue: "Media." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "psst… this is our portfolio too" },
    hint: { type: ControlType.String, title: "Grab hint", defaultValue: "go on, grab a letter" },
    intro: {
        type: ControlType.String,
        title: "Intro",
        displayTextArea: true,
        defaultValue: "Culture moves through people. We put brands right where the conversation is happening.",
    },
    ticker: {
        type: ControlType.String,
        title: "Ticker (comma separated)",
        displayTextArea: true,
        defaultValue: "Strategy, Casting, Content Studio, Campaign Ops, Amplification, Insights",
    },
})
