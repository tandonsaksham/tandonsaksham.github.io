// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 6, "What we believe", written as the answer to the problem slide.
// "Attention is rented." stays grey and gets a vermilion price sticker slapped on it; the rest
// of the manifesto fills in word by word as you scroll, and "earned." is underlined in pen as
// it fills. Each belief card strikes through the problem it fixes (cast by follower count, then
// Cast for trust) and carries a small line icon that draws itself: a community with a
// heartbeat and a double check, a story pinned so it sticks, a rupee measured on a ruler.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValue } from "framer-motion"

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

const PEN_CSS = `
.wm-pen{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;mix-blend-mode:multiply}
.wm-pen path{fill:none;stroke:var(--red);stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1}
.wm-pen:not(.live) path{stroke-dashoffset:1;transition:stroke-dashoffset 1.25s cubic-bezier(.55,0,.25,1);transition-delay:var(--d,0s)}
.wm-pen.on path{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){.wm-pen path{stroke-dashoffset:0!important}}
`

/** Catmull-Rom through the points, as a smooth SVG path. */
function smoothPath(pts: number[][]): string {
    const f = (v: number) => v.toFixed(1)
    let d = "M" + f(pts[0][0]) + " " + f(pts[0][1])
    for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i - 1] || pts[i]
        const b = pts[i]
        const c = pts[i + 1]
        const e = pts[i + 2] || c
        d += " C" + [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6, c[0], c[1]].map(f).join(" ")
    }
    return d
}

/** A quick pen loop around a w×h box: a little more than one turn, tightening as it closes. */
function penLoop(w: number, h: number): string {
    const cx = w / 2
    const cy = h / 2 + h * 0.03
    const rx = w / 2 + Math.max(9, h * 0.15)
    const ry = h / 2 + Math.max(6, h * 0.1)
    const pts: number[][] = []
    for (let i = 0; i <= 48; i++) {
        const t = i / 48
        const a = Math.PI * 1.1 + Math.PI * 2.16 * t
        const k = 1 + 0.03 * Math.sin(t * Math.PI * 3 + 0.8) - 0.07 * t
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k * (1 - 0.1 * t)])
    }
    return smoothPath(pts)
}

/** A fast underline along the foot of a w×h box that flicks back on itself at the end. It stays
    inside the box's own line so it never runs into the line below. */
function penUnder(w: number, h: number): string {
    const y = h * 0.88
    const pts: number[][] = []
    for (let i = 0; i <= 20; i++) {
        const t = i / 20
        pts.push([-6 + (w + 12) * t, y + Math.sin(t * Math.PI * 2.1) * Math.max(1.4, h * 0.02) + t * h * 0.03])
    }
    for (let i = 1; i <= 10; i++) {
        const t = i / 10
        pts.push([w + 6 - w * 0.7 * t, y + h * 0.075 + Math.sin(t * Math.PI) * h * 0.015 - t * h * 0.02])
    }
    return smoothPath(pts)
}

/** Hand-drawn vermilion pen mark in or around its parent, which must be an inline-block phrase.
    "loop" circles it, "under" underlines it. The path is built in the parent's own pixels so
    the stroke stays even at any size. It draws on when `on` is set, or tracks `draw` (0 to 1). */
function PenMark(p: { kind: "loop" | "under"; on?: boolean; draw?: any; delay?: number }) {
    const ref = React.useRef<SVGSVGElement>(null)
    const [box, setBox] = React.useState<number[] | null>(null)
    const zero = useMotionValue(0)
    const offset = useTransform(p.draw || zero, [0, 1], [1, 0])
    React.useEffect(() => {
        const host = ref.current ? (ref.current.parentElement as HTMLElement | null) : null
        if (!host) return
        const m = () => setBox([host.offsetWidth, host.offsetHeight])
        m()
        const ro = new ResizeObserver(m)
        ro.observe(host)
        return () => ro.disconnect()
    }, [])
    const d = box ? (p.kind === "loop" ? penLoop(box[0], box[1]) : penUnder(box[0], box[1])) : ""
    return (
        <svg
            ref={ref}
            className={"wm-pen" + (p.draw ? " live" : p.on ? " on" : "")}
            width={box ? box[0] : 1}
            height={box ? box[1] : 1}
            viewBox={box ? "0 0 " + box[0] + " " + box[1] : "0 0 1 1"}
            aria-hidden="true"
        >
            {d ? p.draw ? <motion.path d={d} pathLength={1} style={{ strokeDashoffset: offset }} /> : <path d={d} pathLength={1} style={cssVars({ "--d": (p.delay || 0) + "s" })} /> : null}
        </svg>
    )
}

type BeliefIcon = "trust" | "stick" | "rupee" | "none"

type Belief = { title: string; body: string; was?: string; icon?: BeliefIcon }

type BeliefProps = {
    tag: string
    note: string
    rented: string
    sticker: string
    earned: string
    underline: string
    cards: Belief[]
    style?: React.CSSProperties
}

const BELIEF_ICONS: BeliefIcon[] = ["trust", "stick", "rupee"]

const BELIEF_CSS = `
.wmb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.wmb-note{color:var(--red);font-size:clamp(20px,2.1cqw,31px);margin-top:4px}
.wmb-m{margin-top:clamp(40px,4.4cqw,68px);font-weight:760;font-size:clamp(34px,4.75cqw,72px);line-height:1.02;letter-spacing:-.038em;max-width:19em}
.wmb-hook,.wmb-ul{position:relative;display:inline-block}
.wmb-stk{position:absolute;right:-.08em;bottom:82%;display:block;padding:.6em 1em .55em;border-radius:99px;background:var(--red);color:var(--ink);font-family:"DM Mono",ui-monospace,monospace;font-weight:500;
font-size:max(11px,.17em);letter-spacing:.02em;line-height:1;white-space:nowrap;rotate:-8deg;opacity:0;box-shadow:0 12px 20px -14px rgba(15,15,15,.7)}
.wmb-m.wm-in .wmb-stk{opacity:1;animation:wmb-slap .75s cubic-bezier(.2,1.45,.4,1) .5s backwards}
.wmb-m.wm-now .wmb-stk{animation:none}
.wmb-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4cqw,20px);margin-top:clamp(48px,6cqw,96px)}
.wmb-card{position:relative;display:flex;flex-direction:column;background:var(--surf);border-radius:18px;padding:clamp(22px,2.2cqw,32px);min-height:clamp(270px,22cqw,330px);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.wmb-card:hover{transform:translateY(-6px);box-shadow:0 22px 40px -24px rgba(15,15,15,.35)}
.wmb-head{display:flex;flex-direction:row-reverse;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:auto;padding-bottom:28px}
.wmb-num{font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;color:var(--red)}
.wmb-was{font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;letter-spacing:.01em;color:var(--stone);margin-bottom:9px}
.wmb-was span{position:relative;display:inline-block}
.wmb-was span::after{content:"";position:absolute;left:-4px;right:-4px;top:54%;height:1.6px;border-radius:2px;background:var(--red);transform:scaleX(0) rotate(-2.5deg);transform-origin:0 50%;
transition:transform .8s var(--ease-io);transition-delay:calc(1s + var(--i,0) * .15s)}
.wmb-cards.wm-in .wmb-was span::after{transform:scaleX(1) rotate(-2.5deg)}
.wmb-card h3{margin-bottom:10px}
.wmb-card .wm-small{color:var(--mut)}
.wmb-ico{display:block;flex:none;width:clamp(64px,6cqw,88px);height:auto;margin:-6px 0 0 -8px;overflow:visible;fill:none;stroke:var(--ink);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.wmb-ico .a{stroke:var(--red)}
.wmb-ico .af{fill:var(--red);stroke:none}
.wmb-ico .hb{transform-box:fill-box;transform-origin:50% 60%}
.wmb-ico .pin{transform-box:fill-box;transform-origin:50% 100%}
.wmb-ico .card{transform-box:view-box;transform-origin:28px 15px}
.wmb-ico .mk{transform-box:fill-box}
.wmb-cards.wm-in .wmb-ico .d{stroke-dasharray:1;animation:bi-draw 1s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + var(--k,0) * .12s)}
.wmb-cards.wm-in .wmb-ico .fi{animation:bi-fade .7s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + var(--k,0) * .12s)}
.wmb-cards.wm-in .wmb-ico .hb{animation:bi-beat 1.4s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .45s)}
.wmb-cards.wm-in .wmb-ico .pin{animation:bi-pin .9s linear backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .55s)}
.wmb-cards.wm-in .wmb-ico .card{animation:bi-wob 1s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .92s)}
.wmb-cards.wm-in .wmb-ico .mk{animation:bi-slide 1.5s var(--ease-io) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .75s)}
.wmb-cards.wm-now .wmb-ico *{animation:none!important}
@keyframes wmb-slap{0%{opacity:0;transform:scale(1.9) translateY(-18px)}55%{opacity:1}100%{opacity:1;transform:none}}
@keyframes bi-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes bi-fade{from{opacity:0}}
@keyframes bi-beat{0%{transform:scale(0)}24%{transform:scale(1.28)}38%{transform:scale(.9)}52%{transform:scale(1.16)}70%,100%{transform:none}}
@keyframes bi-pin{0%{opacity:0;transform:translateY(-16px)}40%{opacity:1;transform:none;animation-timing-function:ease-out}55%{transform:translateY(-4px);animation-timing-function:ease-in}70%,100%{transform:none}}
@keyframes bi-wob{0%{transform:none}25%{transform:rotate(-7deg)}50%{transform:rotate(4deg)}75%{transform:rotate(-2deg)}100%{transform:none}}
@keyframes bi-slide{from{transform:translateX(-32px)}}
@container (max-width:820px){.wmb-cards{grid-template-columns:1fr}.wmb-top{flex-direction:column}.wmb-card{min-height:0}.wmb-head{padding-bottom:30px}}
`

function ScrubWord(p: { progress: any; from: number; to: number; still: boolean; children: React.ReactNode }) {
    const opacity = useTransform(p.progress, [p.from, p.to], [0.14, 1])
    if (p.still) return <span>{p.children}</span>
    return <motion.span style={{ opacity }}>{p.children}</motion.span>
}

/** The belief's line icon. Its finished drawing is the resting state; the entrance plays once the cards are in. */
function BeliefGlyph(p: { kind: BeliefIcon; replay: boolean }) {
    const k = (n: number) => cssVars({ "--k": n })
    const style = p.replay ? cssVars({ "--b": "0s", "--i": 0 }) : undefined
    if (p.kind === "trust")
        return (
            <svg className="wmb-ico" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <path className="d" pathLength={1} style={k(1)} d="M10.5 28 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
                <path className="d" pathLength={1} style={k(1)} d="M7 40 C 7 34.5, 22 34.5, 22 40" />
                <path className="d" pathLength={1} style={k(2)} d="M37.5 28 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
                <path className="d" pathLength={1} style={k(2)} d="M34 40 C 34 34.5, 49 34.5, 49 40" />
                <path className="d" pathLength={1} d="M23 25 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" />
                <path className="d" pathLength={1} d="M18.5 40 C 18.5 32, 37.5 32, 37.5 40" />
                <path className="af hb" d="M28 17 C 22.6 13.4, 23.8 8.6, 26.7 9.3 C 27.4 9.5, 27.8 10.1, 28 10.6 C 28.2 10.1, 28.6 9.5, 29.3 9.3 C 32.2 8.6, 33.4 13.4, 28 17 Z" />
                <path className="a d" pathLength={1} style={k(5)} d="M17.5 47 l3.4 3.4 6.8-7.2" />
                <path className="a d" pathLength={1} style={k(6)} d="M25 47 l3.4 3.4 6.8-7.2" />
            </svg>
        )
    if (p.kind === "stick")
        return (
            <svg className="wmb-ico" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <g className="card">
                    <path className="d" pathLength={1} d="M18 14 H38 A4 4 0 0 1 42 18 V46 A4 4 0 0 1 38 50 H18 A4 4 0 0 1 14 46 V18 A4 4 0 0 1 18 14 Z" />
                    <path className="d" pathLength={1} style={k(2)} d="M20 21 H36 V33 H20 Z" />
                    <path className="a d" pathLength={1} style={k(3)} d="M25.5 24 L31 27 L25.5 30 Z" />
                    <path className="d" pathLength={1} style={k(4)} d="M20 39 H36 M20 44 H30" />
                </g>
                <g className="pin">
                    <path d="M28 12 V19" strokeWidth={1.6} />
                    <circle className="af" cx="28" cy="8.5" r="4.4" />
                </g>
            </svg>
        )
    if (p.kind === "rupee")
        return (
            <svg className="wmb-ico" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <path className="a d" pathLength={1} style={k(1)} d="M19 9 H37" strokeWidth={2} />
                <path className="a d" pathLength={1} style={k(2)} d="M19 15 H37" strokeWidth={2} />
                <path className="a d" pathLength={1} style={k(3)} d="M23 9 C 33 9, 33 21, 23 21 H19.5 L34 34" strokeWidth={2} />
                <path className="d" pathLength={1} d="M7.5 40 H48.5 A1.5 1.5 0 0 1 50 41.5 V48.5 A1.5 1.5 0 0 1 48.5 50 H7.5 A1.5 1.5 0 0 1 6 48.5 V41.5 A1.5 1.5 0 0 1 7.5 40 Z" />
                <path className="fi" style={k(2)} d="M10 40 V44 M14 40 V43 M18 40 V43 M22 40 V43 M26 40 V45 M30 40 V43 M34 40 V43 M38 40 V43 M42 40 V43 M46 40 V44" />
                <path className="af mk" d="M42.5 33.5 H49.5 L46 38 Z" />
            </svg>
        )
    return null
}

function BeliefCard(p: { c: Belief; i: number; still: boolean; fine: boolean; style?: React.CSSProperties }) {
    const [run, setRun] = React.useState(0)
    const kind: BeliefIcon = p.c.icon || BELIEF_ICONS[p.i] || "none"
    const replay = () => {
        if (p.fine && !p.still) setRun((r) => r + 1)
    }
    return (
        <article className="wmb-card" style={p.style} onPointerEnter={replay}>
            <div className="wmb-head">
                <span className="wmb-num">{String(p.i + 1).padStart(2, "0")}</span>
                {kind !== "none" ? <BeliefGlyph key={run} kind={kind} replay={run > 0} /> : null}
            </div>
            {p.c.was ? (
                <p className="wmb-was">
                    <span>{p.c.was}</span>
                </p>
            ) : null}
            <h3 className="wm-h3">{p.c.title}</h3>
            <p className="wm-small">{p.c.body}</p>
        </article>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMBelief(props: BeliefProps) {
    const {
        tag = "What we believe",
        note = "our answer to all of that",
        rented = "Attention is rented.",
        sticker = "₹ per post",
        earned = "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
        underline = "earned.",
        cards = [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice.", was: "Cast by follower count", icon: "trust" },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember.", was: "One post, then silence", icon: "stick" },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read.", was: "Reports full of vanity", icon: "rupee" },
        ],
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const [mRef, mIn] = useIn<HTMLParagraphElement>(0.3)
    const { scrollYProgress } = useScroll({ target: mRef, offset: ["start 85%", "end 50%"] })
    const [slap, setSlap] = React.useState(0)
    const heads = rented.split(/\s+/).filter(Boolean)
    const words = earned.split(/\s+/).filter(Boolean)
    const n = Math.max(1, words.length)
    const ul = underline ? words.indexOf(underline) : -1
    const ulDraw = useTransform(scrollYProgress, [Math.max(0, ul) / n, Math.min(1, (Math.max(0, ul) + 1.8) / n)], [0, 1])

    return (
        <Section theme="cream" className="wmb" css={PEN_CSS + BELIEF_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <div className="wmb-top">
                    <Chrome label={tag} />
                    <Script className="wmb-note" delay={0.5} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <p ref={mRef} className={"wmb-m" + mIn} aria-label={rented + " " + earned}>
                    <span aria-hidden="true">
                        {heads.map((w, i) => (
                            <React.Fragment key={"r" + i}>
                                {i === heads.length - 1 && sticker ? (
                                    <span className="wmb-hook" onPointerEnter={() => fine && !still && setSlap((s) => s + 1)}>
                                        <span className="wm-stone">{w}</span>
                                        <span className="wmb-stk" key={slap}>
                                            {sticker}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="wm-stone">{w}</span>
                                )}{" "}
                            </React.Fragment>
                        ))}
                        {words.map((w, i) => (
                            <React.Fragment key={i}>
                                {i === ul ? (
                                    <span className="wmb-ul">
                                        <ScrubWord progress={scrollYProgress} from={i / n} to={(i + 1) / n} still={still}>
                                            {w}
                                        </ScrubWord>
                                        <PenMark kind="under" draw={still ? undefined : ulDraw} on={still} />
                                    </span>
                                ) : (
                                    <ScrubWord progress={scrollYProgress} from={i / n} to={(i + 1) / n} still={still}>
                                        {w}
                                    </ScrubWord>
                                )}
                                {i < words.length - 1 ? " " : null}
                            </React.Fragment>
                        ))}
                    </span>
                </p>
                <Stagger className={"wmb-cards" + (still ? " wm-now" : "")} step={0.1}>
                    {cards.map((c, i) => (
                        <BeliefCard key={i} c={c} i={i} still={still} fine={fine} />
                    ))}
                </Stagger>
            </div>
        </Section>
    )
}

addPropertyControls(WMBelief, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "What we believe" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "our answer to all of that" },
    rented: { type: ControlType.String, title: "Grey part", defaultValue: "Attention is rented." },
    sticker: { type: ControlType.String, title: "Sticker", defaultValue: "₹ per post" },
    earned: {
        type: ControlType.String,
        title: "Manifesto",
        displayTextArea: true,
        defaultValue: "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
    },
    underline: { type: ControlType.String, title: "Pen underline", defaultValue: "earned." },
    cards: {
        type: ControlType.Array,
        title: "Beliefs",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                was: { type: ControlType.String, title: "Replaces" },
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["trust", "stick", "rupee", "none"],
                    optionTitles: ["Community + double check", "Pinned story", "Rupee on a ruler", "None"],
                },
            },
        },
        defaultValue: [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice.", was: "Cast by follower count", icon: "trust" },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember.", was: "One post, then silence", icon: "stick" },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read.", was: "Reports full of vanity", icon: "rupee" },
        ],
    },
})
