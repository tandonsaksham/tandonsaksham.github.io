// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 10, "How a campaign runs". The red dot of the section tag hops down onto the
// timeline and rolls along it as you scroll, drawing the line behind it; each week's node lights up
// with a ripple and its card swings down from the line like a hanging tag. Measure is in vermilion.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useMotionValue, animate } from "framer-motion"

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

type BallGeo = { v: boolean; dot: { x: number; y: number } | null; s: { x: number; y: number }; len: number; at: number[] }

/** Timeline choreography for "How a campaign runs" and "The road ahead". The red dot of the section
    tag hops down onto the rail, then rolls along it as you scroll; each step lights up and drops in as
    the dot passes, and at the last step the dot settles into place. Progress only ever moves forward.
    The rail runs across on wide layouts and down the left edge when the track stacks (--vt: 1). */
function useBallTrack(count: number, still: boolean) {
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const chromeRef = React.useRef<HTMLDivElement>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)
    const geo = React.useRef<BallGeo | null>(null)
    const phase = React.useRef(still ? 3 : 0)
    const goal = React.useRef(0)
    const litRef = React.useRef(still ? count : 0)
    const [lay, setLay] = React.useState<BallGeo | null>(null)
    const [lit, setLit] = React.useState(still ? count : 0)
    const [stage, setStage] = React.useState(still ? 3 : 0)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useMotionValue(0.64)
    const sy = useMotionValue(0.64)
    const o = useMotionValue(0)
    const along = useMotionValue(still ? 1 : 0)

    React.useEffect(() => {
        if (!still) return
        phase.current = 3
        litRef.current = count
        setStage(3)
        setLit(count)
        along.set(1)
    }, [still, count, along])

    React.useEffect(() => {
        const wrap = wrapRef.current
        const track = trackRef.current
        if (!wrap || !track) return
        let raf = 0
        const spring = { type: "spring" as const, stiffness: 70, damping: 17, mass: 1 }
        const pointAt = (t: number) => {
            const g = geo.current as BallGeo
            return g.v ? { x: g.s.x, y: g.s.y + g.len * t } : { x: g.s.x + g.len * t, y: g.s.y }
        }
        const measure = () => {
            const wr = wrap.getBoundingClientRect()
            const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-node]"))
            if (!nodes.length) return
            const pts = nodes.map((el) => {
                const r = el.getBoundingClientRect()
                return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top }
            })
            const v = getComputedStyle(track).getPropertyValue("--vt").trim() === "1"
            const tr = track.getBoundingClientRect()
            const dotEl = chromeRef.current ? chromeRef.current.querySelector<HTMLElement>(".wm-dots i:last-child") : null
            const dr = dotEl ? dotEl.getBoundingClientRect() : null
            const s = v ? { x: pts[0].x, y: tr.top - wr.top } : { x: tr.left - wr.left, y: pts[0].y }
            const last = pts[pts.length - 1]
            const len = Math.max(1, v ? last.y - s.y : last.x - s.x)
            geo.current = {
                v,
                dot: dr ? { x: dr.left + dr.width / 2 - wr.left, y: dr.top + dr.height / 2 - wr.top } : null,
                s,
                len,
                at: pts.map((p) => (v ? p.y - s.y : p.x - s.x) / len),
            }
            setLay(geo.current)
            if (phase.current >= 2) {
                const p = pointAt(phase.current === 3 ? 1 : along.get())
                x.set(p.x)
                y.set(p.y)
            }
        }
        const follow = () => {
            if (phase.current !== 2 || !geo.current) return
            const p = pointAt(goal.current)
            animate(x, p.x, spring)
            animate(y, p.y, spring)
        }
        const land = () => {
            phase.current = 2
            setStage(2)
            follow()
        }
        const hop = () => {
            const g = geo.current
            if (!g) return
            phase.current = 1
            setStage(1)
            const top = wrap.getBoundingClientRect().top
            const d = g.dot
            const L = pointAt(0)
            o.set(1)
            if (!d || top + d.y < 0 || top + d.y > window.innerHeight) {
                x.set(L.x)
                y.set(L.y)
                sx.set(1)
                sy.set(1)
                land()
                return
            }
            x.set(d.x)
            y.set(d.y)
            const T = 0.82
            const peak = d.y - Math.min(64, Math.max(30, (L.y - d.y) * 0.2))
            animate(sx, 1, { duration: T * 0.5 })
            animate(sy, 1, { duration: T * 0.5 })
            animate(x, [d.x, d.x - 12, L.x], { duration: T, times: [0, 0.34, 1], ease: ["easeOut", "easeInOut"] })
            animate(y, [d.y, peak, L.y], { duration: T, times: [0, 0.34, 1], ease: ["easeOut", "easeIn"] }).then(() => {
                animate(sx, [1.55, 0.88, 1.04, 1], { duration: 0.5, times: [0, 0.32, 0.68, 1] })
                animate(sy, [0.52, 1.16, 0.97, 1], { duration: 0.5, times: [0, 0.32, 0.68, 1] })
                land()
            })
        }
        const read = () => {
            raf = 0
            const g = geo.current
            if (!g || phase.current === 3) return
            const vh = window.innerHeight
            const wr = wrap.getBoundingClientRect()
            const tr = track.getBoundingClientRect()
            // Across: the dot finishes as the whole track comes into view. Down: it rides a line 80% down the screen.
            let p = g.v ? (vh * 0.8 - (wr.top + g.s.y)) / g.len : (vh - tr.top) / (vh * 0.08 + tr.height)
            p = Math.max(0, Math.min(1, p))
            // Near the very end of a page there may be no room left to scroll, so finish the run there.
            if (tr.top < vh && window.scrollY + vh >= document.documentElement.scrollHeight - 4) p = 1
            if (phase.current === 0 && tr.top < vh * 0.98) hop()
            if (p > goal.current) {
                goal.current = p
                follow()
            }
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(read)
        }
        const watch = () => {
            const g = geo.current
            if (!g || phase.current !== 2) return
            const t = Math.max(0, Math.min(1, g.v ? (y.get() - g.s.y) / g.len : (x.get() - g.s.x) / g.len))
            along.set(t)
            const n = g.at.filter((a) => t >= a - 0.003).length
            if (n !== litRef.current) {
                litRef.current = n
                setLit(n)
            }
            if (t >= 0.997) {
                phase.current = 3
                setStage(3)
                along.set(1)
                animate(sx, 0, { duration: 0.35, delay: 0.1 })
                animate(sy, 0, { duration: 0.35, delay: 0.1 })
            }
        }
        measure()
        const ro = new ResizeObserver(() => {
            measure()
            onScroll()
        })
        ro.observe(wrap)
        if (still) return () => ro.disconnect()
        const ux = x.on("change", watch)
        const uy = y.on("change", watch)
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        onScroll()
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            ux()
            uy()
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [still, x, y, sx, sy, o, along])

    return { wrapRef, chromeRef, trackRef, lay, lit, stage, x, y, sx, sy, o, along }
}

type Step = { week: string; title: string; body: string }

type ProcessProps = {
    tag: string
    headline: string
    note: string
    steps: Step[]
    style?: React.CSSProperties
}

const PROCESS_CSS = `
.wmpr-tag{display:block}
.wmpr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:clamp(22px,2.6cqw,36px)}
.wmpr-h{font-weight:780;font-size:clamp(40px,6.2cqw,98px);line-height:.96;letter-spacing:-.045em}
.wmpr-note{color:var(--red);max-width:9.5em;font-size:clamp(21px,2.1cqw,31px);margin-bottom:.3em}
.wmpr-track{--vt:0;position:relative;margin-top:clamp(44px,5.4cqw,80px)}
.wmpr-rail{position:absolute;left:calc(-50vw + 50%);right:calc(-50vw + 50%);top:6px;height:1.5px;background:var(--line)}
.wmpr-fill{position:absolute;z-index:3;display:block;width:1.5px;height:1.5px;background:var(--ink);transform-origin:0 0;pointer-events:none}
.wmpr-cols{position:relative;z-index:2;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(8px,1cqw,14px)}
.wmpr-col{position:relative;display:flex;flex-direction:column;align-items:stretch}
.wmpr-node{position:relative;z-index:4;align-self:center;width:13px;height:13px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink);margin-bottom:18px}
.wmpr-node i{position:absolute;inset:-1.5px;border-radius:50%;background:var(--ink);transform:scale(0)}
.wmpr-node::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1.5px solid var(--ink);opacity:0;pointer-events:none}
.wmpr-col:last-child .wmpr-node,.wmpr-col:last-child .wmpr-node::after{border-color:var(--red)}
.wmpr-col:last-child .wmpr-node i{background:var(--red)}
.wmpr-week{align-self:stretch;text-align:center;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;padding:6px 8px;border-radius:99px;background:var(--cream2);margin-bottom:10px;white-space:nowrap;opacity:0}
.wmpr-col:last-child .wmpr-week{background:var(--red);color:var(--ink)}
.wmpr-card{display:flex;flex-direction:column;justify-content:space-between;min-height:clamp(200px,17cqw,250px);padding:clamp(16px,1.6cqw,22px);border-radius:16px;background:var(--ink);color:var(--cream);opacity:0;transform-origin:50% 0;transition:transform .7s var(--ease)}
.wmpr-col:last-child .wmpr-card{background:var(--red);color:var(--ink)}
.wmpr-card h3{font-weight:760;font-size:clamp(20px,1.9cqw,27px);letter-spacing:-.025em}
.wmpr-card p{font-size:13.5px;line-height:1.45;color:rgba(242,238,229,.66)}
.wmpr-col:last-child .wmpr-card p{color:rgba(15,15,15,.78)}
.wmpr-col.on .wmpr-node i{transform:none;animation:wmpr-pop .7s cubic-bezier(.34,1.56,.64,1) backwards}
.wmpr-col.on .wmpr-node::after{animation:wmpr-ring .9s var(--ease) backwards}
.wmpr-col.end .wmpr-node::after{animation:wmpr-ring 1.1s var(--ease) .15s 2 backwards}
.wmpr-col.on .wmpr-week{opacity:1;animation:wmpr-pill .55s var(--ease) backwards}
.wmpr-col.on .wmpr-card{opacity:1;animation:wmpr-drop 1.3s linear .06s backwards}
.wmpr-col.on .wmpr-card:hover{transform:translateY(-6px)}
.wmpr-ball{position:absolute;left:0;top:0;z-index:6;display:block;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--red);box-shadow:0 0 0 5px rgba(233,67,27,.14),0 8px 18px -4px rgba(233,67,27,.55);pointer-events:none}
.wmpr.hop .wm-chrome .wm-dots i:last-child{background:transparent;box-shadow:inset 0 0 0 1.5px var(--red)}
.wmpr.done .wm-chrome .wm-dots i:last-child{animation:wmpr-pop .6s cubic-bezier(.34,1.56,.64,1) .35s backwards}
.wmpr.still *{animation:none!important}
@keyframes wmpr-pop{from{transform:scale(0)}}
@keyframes wmpr-ring{from{transform:scale(.3);opacity:.9}to{transform:scale(1.5);opacity:0}}
@keyframes wmpr-pill{from{opacity:0;transform:translateY(-12px)}}
@keyframes wmpr-drop{0%{opacity:0;transform:perspective(1000px) rotateX(-84deg);animation-timing-function:cubic-bezier(.3,0,.6,1)}40%{opacity:1;transform:perspective(1000px) rotateX(15deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}62%{transform:perspective(1000px) rotateX(-6deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}82%{transform:perspective(1000px) rotateX(2deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}100%{opacity:1;transform:perspective(1000px) rotateX(0)}}
@keyframes wmpr-slide{from{opacity:0;transform:translateX(-22px)}}
@container (max-width:860px){
.wmpr-head{flex-direction:column;align-items:flex-start}
.wmpr-track{--vt:1;padding-left:40px}
.wmpr-rail{left:6px;right:auto;top:0;bottom:0;width:1.5px;height:auto}
.wmpr-cols{grid-template-columns:1fr;gap:22px}
.wmpr-node{position:absolute;left:-40px;top:6px;margin:0}
.wmpr-week{align-self:flex-start;padding:6px 14px}
.wmpr-card{min-height:0;gap:22px}
.wmpr-col.on .wmpr-card,.wmpr-col.on .wmpr-week{animation:wmpr-slide .8s var(--ease) backwards}
.wmpr-col.on .wmpr-card{animation-delay:.08s}
}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMProcess(props: ProcessProps) {
    const {
        tag = "How we work",
        headline = "How a campaign runs",
        note = "brief to receipts in about [__] weeks",
        steps = [
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed." },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting." },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why." },
        ],
        style,
    } = props

    const still = useStill()
    const n = Math.max(1, steps.length)
    const t = useBallTrack(n, still)
    const L = t.lay

    return (
        <Section theme="cream" className={"wmpr" + (still ? " still" : "") + (t.stage >= 1 && t.stage < 3 ? " hop" : "") + (t.stage === 3 && !still ? " done" : "")} css={PROCESS_CSS} style={style} label={headline}>
            <div className="wm-wrap" ref={t.wrapRef}>
                <div className="wmpr-tag" ref={t.chromeRef}>
                    <Chrome label={tag} />
                </div>
                <div className="wmpr-head">
                    <Words as="h2" className="wmpr-h" text={headline} stagger={0.06} />
                    <Script className="wmpr-note" delay={0.6} rotate={-5}>
                        {fill(note)}
                    </Script>
                </div>
                <div className="wmpr-track" ref={t.trackRef}>
                    <span className="wmpr-rail" aria-hidden="true" />
                    <ol className="wmpr-cols">
                        {steps.map((s, i) => (
                            <li className={"wmpr-col" + (i < t.lit ? " on" : "") + (i === n - 1 && t.stage === 3 && !still ? " end" : "")} key={i}>
                                <span className="wmpr-node" data-node="" aria-hidden="true">
                                    <i />
                                </span>
                                <span className="wmpr-week">{s.week}</span>
                                <div className="wmpr-card">
                                    <h3>{s.title}</h3>
                                    <p>{s.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                {L ? (
                    <motion.span
                        className="wmpr-fill"
                        aria-hidden="true"
                        style={L.v ? { left: L.s.x - 0.75, top: L.s.y, height: L.len, scaleY: t.along } : { left: L.s.x, top: L.s.y - 0.75, width: L.len, scaleX: t.along }}
                    />
                ) : null}
                {!still ? <motion.span className="wmpr-ball" aria-hidden="true" style={{ x: t.x, y: t.y, scaleX: t.sx, scaleY: t.sy, opacity: t.o }} /> : null}
            </div>
        </Section>
    )
}

addPropertyControls(WMProcess, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "How we work" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "How a campaign runs" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "brief to receipts in about [__] weeks" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: {
            type: ControlType.Object,
            controls: {
                week: { type: ControlType.String, title: "Week" },
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed." },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting." },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why." },
        ],
    },
})
