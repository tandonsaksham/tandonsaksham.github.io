// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 4, "The problem". The two-tone headline rises in, then each of the three
// failures comes with a small animated exhibit: a big follower count whose crowd turns out to
// be mostly hollow, one post that spikes and flatlines, and a report of vanity numbers that
// gets "so what?" stamped on it. Hover a row to replay its exhibit. Kept compact: rows beside
// the headline on desktop, three cards in a row on tablets, a swipeable card strip on phones.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useTransform, useMotionValue, animate } from "framer-motion"

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

const SWIPE_CSS = `
.wm-swipe-ui{display:none}
@container (max-width:640px){
.wm-sec .wm-swipe{--gut:clamp(20px,5.2cqw,80px);position:relative;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;grid-template-columns:none!important;gap:12px!important;
overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gut);
margin-left:calc(-1 * var(--gut))!important;margin-right:calc(-1 * var(--gut))!important;padding:6px var(--gut) 16px!important;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.wm-sec .wm-swipe::-webkit-scrollbar{display:none}
.wm-sec .wm-swipe>*{flex:0 0 var(--card,84%)!important;max-width:360px;min-width:0;grid-column:auto!important;grid-row:auto!important;scroll-snap-align:start;scale:calc(.94 + .06 * var(--sf,1))}
.wm-sec .wm-swipe.nudge{animation:wm-nudge 1.3s var(--ease) .2s 1 both}
.wm-swipe-ui{display:flex;align-items:center;gap:12px;margin-top:2px}
.wm-swipe-ui[data-off="1"]{display:none}
.wm-swipe-n{flex:none;font-family:"DM Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.04em;color:var(--mut)}
.wm-swipe-n b{font-weight:400;color:var(--fg)}
.wm-swipe-bar{position:relative;flex:1;height:2px;border-radius:2px;background:var(--line);overflow:hidden}
.wm-swipe-bar i{position:absolute;left:0;top:0;bottom:0;width:calc(var(--sw,.3) * 100%);border-radius:2px;background:var(--red);translate:calc(var(--sx,0) * (1 / var(--sw,.3) - 1) * 100%) 0}
.wm-swipe-hint{flex:none;font-size:19px!important;color:var(--red);transition:opacity .5s var(--ease),translate .5s var(--ease)}
.wm-swipe-ui[data-moved="1"] .wm-swipe-hint{opacity:0;translate:10px 0}
.wm-sec .wm-swipe>:not([data-front]) .wm-replay,.wm-sec .wm-swipe>:not([data-front]) .wm-replay *{animation-name:none!important}
.wm-sec .wm-swipe .wm-rise.wm-in{animation-delay:.05s!important}
.wm-sec .wm-swipe .wm-stag.wm-in>*{animation-delay:calc(.08s + var(--i,0) * .04s)!important}
}
@keyframes wm-nudge{0%,100%{translate:0}38%{translate:-44px}70%{translate:5px}}
@media (prefers-reduced-motion:reduce){.wm-sec .wm-swipe.nudge{animation:none}.wm-sec .wm-swipe>*{scale:none}}
`

/** Counter, progress line and hint for the swipe list just before it (a list with the wm-swipe class).
    On narrow screens that list becomes a snap-scrolling strip with the next card peeking in; the card in
    front sits full size and the others step back a touch, and anything inside a card marked wm-replay
    plays its animation again each time that card comes to the front. The first time the strip comes
    into view it nudges sideways once to show it can be swiped. On wide screens this renders nothing visible. */
function SwipeUI(p: { hint?: string }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const still = useStill()
    const [pos, setPos] = React.useState([1, 1])
    React.useEffect(() => {
        const ui = ref.current
        const track = ui ? (ui.previousElementSibling as HTMLElement | null) : null
        if (!ui || !track) return
        let raf = 0
        const update = () => {
            raf = 0
            const kids = (Array.from(track.children) as HTMLElement[]).sort((a, b) => a.offsetLeft - b.offsetLeft)
            const max = track.scrollWidth - track.clientWidth
            if (max <= 2 || !kids.length) {
                ui.setAttribute("data-off", "1")
                kids.forEach((k) => {
                    k.style.removeProperty("--sf")
                    k.removeAttribute("data-front")
                })
                return
            }
            ui.setAttribute("data-off", "")
            const sl = track.scrollLeft
            const pad = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0
            let cur = 0
            let best = 1e9
            kids.forEach((k, i) => {
                const d = Math.abs(k.offsetLeft - pad - sl)
                if (d < best) {
                    best = d
                    cur = i
                }
                if (!still) k.style.setProperty("--sf", Math.max(0, 1 - d / Math.max(1, k.offsetWidth)).toFixed(3))
            })
            if (sl >= max - 2) cur = kids.length - 1
            kids.forEach((k, i) => {
                if (i === cur) k.setAttribute("data-front", "")
                else k.removeAttribute("data-front")
            })
            ui.style.setProperty("--sx", (sl / max).toFixed(4))
            ui.style.setProperty("--sw", (track.clientWidth / track.scrollWidth).toFixed(4))
            setPos((o) => (o[0] === cur + 1 && o[1] === kids.length ? o : [cur + 1, kids.length]))
        }
        const onScroll = () => {
            if (track.scrollLeft > 8) ui.setAttribute("data-moved", "1")
            if (!raf) raf = requestAnimationFrame(update)
        }
        const ro = new ResizeObserver(onScroll)
        ro.observe(track)
        track.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        let io: IntersectionObserver | null = null
        if (!still && typeof IntersectionObserver !== "undefined") {
            io = new IntersectionObserver(
                (es) => {
                    if (!es[0].isIntersecting || ui.getAttribute("data-off") === "1") return
                    track.classList.add("nudge")
                    track.addEventListener("animationend", () => track.classList.remove("nudge"), { once: true })
                    if (io) io.disconnect()
                },
                { threshold: 0.6 }
            )
            io.observe(track)
        }
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            if (io) io.disconnect()
            track.removeEventListener("scroll", onScroll)
        }
    }, [still])
    const two = (n: number) => String(n).padStart(2, "0")
    return (
        <div ref={ref} className="wm-swipe-ui" data-off="1" aria-hidden="true">
            <span className="wm-swipe-n">
                <b>{two(pos[0])}</b> / {two(pos[1])}
            </span>
            <span className="wm-swipe-bar">
                <i />
            </span>
            {p.hint ? <span className="wm-swipe-hint wm-script">{p.hint}</span> : null}
        </div>
    )
}

type ProblemVisual = "crowd" | "spike" | "vanity" | "none"

type ProblemItem = { title: string; body: string; visual?: ProblemVisual }

type ProblemProps = {
    tag: string
    lead: string
    rest: string
    note: string
    items: ProblemItem[]
    style?: React.CSSProperties
}

const PROBLEM_VISUALS: ProblemVisual[] = ["crowd", "spike", "vanity"]

const PROBLEM_CSS = `
.wmp .wm-wrap{padding-top:clamp(64px,6.6cqw,100px);padding-bottom:clamp(56px,5.6cqw,88px)}
.wmp-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(40px,5cqw,92px);align-items:start;margin-top:clamp(26px,3cqw,44px)}
.wmp-h{font-weight:760;font-size:clamp(34px,4.45cqw,66px);line-height:1.04;letter-spacing:-.038em}
.wmp-note{display:inline-block;margin-top:clamp(18px,2.2cqw,32px);color:var(--red);font-size:clamp(22px,2.3cqw,34px)}
.wmp-list{display:flex;flex-direction:column}
.wmp-row{position:relative;display:grid;grid-template-columns:36px minmax(0,1fr) clamp(128px,12cqw,172px);column-gap:clamp(12px,1.5cqw,24px);align-items:center;padding:clamp(16px,1.6cqw,23px) 0 clamp(17px,1.7cqw,24px)}
.wmp-row>.wm-hr{position:absolute;left:0;right:0;top:0}
.wmp-n{align-self:start;font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;color:var(--red);padding-top:.5em}
.wmp-txt{align-self:start}
.wmp-t{margin-bottom:6px;font-size:clamp(19px,1.75cqw,25px)}
.wmp-b{color:var(--mut);max-width:30em}
.wmp-x{position:relative;color:var(--ink);opacity:0;transform:translateY(14px);transition:opacity .8s var(--ease) .2s,transform 1s var(--ease) .2s}
.wmp-row.on .wmp-x,.wmp-row.now .wmp-x{opacity:1;transform:none}
.wmp-x svg{display:block;width:100%;height:auto;overflow:visible}
.px-m{font-family:"DM Mono",ui-monospace,monospace;font-size:8.5px;letter-spacing:.07em;fill:#8C887C}
.px-v{font-family:"DM Mono",ui-monospace,monospace;font-size:10px;fill:currentColor}
.px-big{font-family:"DM Mono",ui-monospace,monospace;font-size:16px;letter-spacing:-.03em;fill:currentColor}
.px-red{fill:#E9431B}
.px-c{font-family:"Caveat","Bradley Hand",cursive;font-weight:600;font-size:20px;fill:#E9431B}
.px-dot{fill:currentColor;fill-opacity:0;stroke:#B9B3A6;stroke-width:1}
.px-dot.real{fill:#E9431B;fill-opacity:1;stroke:none}
.px-dot,.px-pop,.px-stamp{transform-box:fill-box;transform-origin:50% 50%}
.px-bar{transform-box:fill-box;transform-origin:0 50%}
.px-base{fill:none;stroke:#B9B3A6;stroke-width:1;stroke-dasharray:2 4}
.px-line{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1}
.px-card{fill:#FAF8F3;stroke:currentColor;stroke-width:1.2}
.px-ring{fill:none;stroke:#E9431B;stroke-width:2;stroke-linecap:round;stroke-dasharray:1}
.wmp-row.on .px-dot{animation:px-ghost 2.7s var(--ease) backwards;animation-delay:calc(.3s + var(--c,0) * .045s)}
.wmp-row.on .px-dot.real{animation-name:px-real}
.wmp-row.on .px-fade{animation:px-fade .8s var(--ease) backwards;animation-delay:var(--t,1.8s)}
.wmp-row.on .px-line{animation:px-draw 1.8s cubic-bezier(.45,0,.3,1) .35s backwards}
.wmp-row.on .px-pop{animation:px-pop .6s cubic-bezier(.34,1.56,.64,1) backwards;animation-delay:var(--t,.8s)}
.wmp-row.on .px-bar{animation:px-bar 1s var(--ease) backwards;animation-delay:calc(.45s + var(--k,0) * .15s)}
.wmp-row.on .px-stamp{animation:px-stamp .55s cubic-bezier(.2,1.4,.4,1) 1.5s backwards}
.wmp-row.on .px-ring{animation:px-draw .75s var(--ease) 1.6s backwards}
.wmp.still .wmp-x *{animation:none!important}
@keyframes px-ghost{0%{transform:scale(0);fill-opacity:1;stroke-opacity:0}14%{transform:scale(1);fill-opacity:1;stroke-opacity:0}52%{fill-opacity:1;stroke-opacity:0}72%,100%{fill-opacity:0;stroke-opacity:1}}
@keyframes px-real{0%{transform:scale(0);fill:#0F0F0F}14%,52%{transform:scale(1);fill:#0F0F0F}64%{transform:scale(1.5)}78%,100%{transform:scale(1);fill:#E9431B}}
@keyframes px-fade{from{opacity:0}}
@keyframes px-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes px-pop{from{transform:scale(0)}}
@keyframes px-bar{from{transform:scaleX(0)}}
@keyframes px-stamp{0%{opacity:0;transform:scale(1.9) rotate(-12deg)}100%{opacity:1;transform:none}}
@container (max-width:1100px){
.wmp-grid{grid-template-columns:1fr;gap:clamp(26px,3.4cqw,40px)}
.wmp-head{display:flex;flex-wrap:wrap;align-items:flex-end;column-gap:28px}
.wmp-h{max-width:17em}
.wmp-note{margin-top:10px;padding-bottom:.2em}
.wmp-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.6cqw,16px)}
.wmp-end,.wmp-row>.wm-hr{display:none}
.wmp-row{grid-template-columns:auto minmax(0,1fr);grid-template-areas:"x x" "n t";align-content:start;column-gap:10px;row-gap:14px;padding:16px 18px 20px;border:1px solid var(--line);border-radius:18px;background:var(--paper)}
.wmp-x{grid-area:x;width:100%;max-width:236px;padding:4px 0 10px;border-bottom:1px dashed var(--line)}
.wmp-n{grid-area:n;padding-top:.45em}
.wmp-txt{grid-area:t}
.wmp-t{font-size:clamp(18px,2.1cqw,21px)}
.wmp-b{font-size:15px;line-height:1.5}
}
`

/** Rolls a follower count up from zero once the exhibit is live. */
function Count(p: { to: number; on: boolean; still: boolean; x: number; y: number; className: string; anchor?: "start" | "middle" | "end" }) {
    const v = useMotionValue(p.still ? p.to : 0)
    const text = useTransform(v, (n) => n.toFixed(1) + "M")
    React.useEffect(() => {
        if (p.still) {
            v.set(p.to)
            return
        }
        if (!p.on) return
        v.set(0)
        const c = animate(v, p.to, { duration: 1.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] })
        return () => c.stop()
    }, [p.on, p.still, p.to, v])
    return (
        <motion.text x={p.x} y={p.y} textAnchor={p.anchor} className={p.className}>
            {text}
        </motion.text>
    )
}

/** Cast by follower count: a big crowd that turns out to be mostly hollow. */
function Crowd(p: { on: boolean; still: boolean }) {
    const real = [5, 18, 31, 40]
    const dots: React.ReactNode[] = []
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 12; c++) {
            const i = r * 12 + c
            dots.push(<circle key={i} className={"px-dot" + (real.indexOf(i) > -1 ? " real" : "")} style={cssVars({ "--c": c + r * 0.5 })} cx={12 + c * 16} cy={40 + r * 15} r={3.6} />)
        }
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <text x="0" y="13" className="px-m">
                FOLLOWERS
            </text>
            <Count to={1.2} on={p.on} still={p.still} x={200} y={16} className="px-big" anchor="end" />
            {dots}
            <circle cx="4" cy="110" r="3.2" className="px-red px-fade" style={cssVars({ "--t": "1.95s" })} />
            <text x="12" y="113" className="px-m px-fade" style={cssVars({ "--t": "1.95s" })}>
                REAL AUDIENCE
            </text>
        </svg>
    )
}

/** One post, then silence: a single spike, then a flat line. */
function Spike() {
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <path className="px-base" d="M0 98 H200" />
            <path className="px-line" pathLength={1} d="M0 94 L38 93 L50 91 L60 24 L69 90 L84 93 L200 94" />
            <circle className="px-red px-pop" style={cssVars({ "--t": "1.1s" })} cx="60" cy="24" r="4.6" />
            <text className="px-m px-fade" style={cssVars({ "--t": "1.15s" })} x="60" y="11" textAnchor="middle">
                1 POST
            </text>
            <text className="px-m" x="60" y="114" textAnchor="middle">
                DAY 1
            </text>
            <text className="px-m" x="200" y="114" textAnchor="end">
                DAY 30
            </text>
            <text className="px-c px-fade" style={cssVars({ "--t": "2.05s" })} x="198" y="83" textAnchor="end">
                …silence
            </text>
        </svg>
    )
}

/** Reports full of vanity: big numbers, then a "so what?" stamp. */
function Vanity() {
    const rows: [string, string, number][] = [
        ["LIKES", "48.2K", 62],
        ["VIEWS", "1.2M", 98],
        ["REACH", "910K", 80],
    ]
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <rect className="px-card" x="1" y="4" width="136" height="110" rx="9" />
            <text className="px-m" x="13" y="22">
                CAMPAIGN REPORT
            </text>
            <path d="M13 29 H125" stroke="#E4DED2" />
            {rows.map(([k, v, w], i) => (
                <g key={i}>
                    <text className="px-m" x="13" y={48 + i * 24}>
                        {k}
                    </text>
                    <text className="px-v" x="125" y={48 + i * 24} textAnchor="end">
                        {v}
                    </text>
                    <rect className="px-bar" style={cssVars({ "--k": i })} x="13" y={53 + i * 24} width={w} height="3" rx="1.5" fill="#C9C3B6" />
                </g>
            ))}
            <g className="px-stamp">
                <path className="px-ring" pathLength={1} d="M146 58 C 158 40, 204 44, 203 70 C 202 94, 150 100, 132 84 C 120 72, 132 58, 154 53" />
                <rect x="131" y="55" width="70" height="30" rx="15" fill="#F2EEE5" opacity=".86" transform="rotate(-10 166 70)" />
                <text className="px-c" x="166" y="76" textAnchor="middle" transform="rotate(-10 166 70)">
                    so what?
                </text>
            </g>
        </svg>
    )
}

function ProblemRow(p: { i: number; item: ProblemItem; still: boolean; fine: boolean }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const seen = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.45 })
    const [run, setRun] = React.useState(0)
    const kind: ProblemVisual = p.item.visual || PROBLEM_VISUALS[p.i] || "none"
    const on = !p.still && seen
    const replay = () => {
        if (on && p.fine) setRun((r) => r + 1)
    }
    return (
        <div ref={ref} className={"wmp-row" + (p.still ? " now" : on ? " on" : "")} onPointerEnter={replay}>
            <Rule strong delay={0.1 + p.i * 0.12} />
            <Rise className="wmp-n" delay={0.2 + p.i * 0.12}>
                {String(p.i + 1).padStart(2, "0")}
            </Rise>
            <Rise className="wmp-txt" delay={0.28 + p.i * 0.12}>
                <h3 className="wmp-t wm-h3">{p.item.title}</h3>
                <p className="wmp-b wm-body">{p.item.body}</p>
            </Rise>
            {kind !== "none" ? (
                <div className="wmp-x wm-replay" aria-hidden="true" key={run}>
                    {kind === "crowd" ? <Crowd on={on} still={p.still} /> : kind === "spike" ? <Spike /> : <Vanity />}
                </div>
            ) : null}
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMProblem(props: ProblemProps) {
    const {
        tag = "The problem",
        lead = "Yet most influencer marketing",
        rest = "still buys followers and hopes for the best.",
        note = "sound familiar?",
        items = [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust.", visual: "crowd" },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week.", visual: "spike" },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed.", visual: "vanity" },
        ],
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()

    return (
        <Section theme="cream" className={"wmp" + (still ? " still" : "")} css={PROBLEM_CSS + SWIPE_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmp-grid">
                    <div className="wmp-head">
                        <Words as="h2" className="wmp-h" parts={[{ t: lead + " ", c: "stone" }, { t: rest }]} stagger={0.045} />
                        <Script className="wmp-note" delay={1.2} rotate={-5}>
                            {note}
                        </Script>
                    </div>
                    <div>
                        <div className="wmp-list wm-swipe">
                            {items.map((it, i) => (
                                <ProblemRow key={i} i={i} item={it} still={still} fine={fine} />
                            ))}
                        </div>
                        <SwipeUI hint="swipe" />
                        <Rule strong delay={0.1 + items.length * 0.12} className="wmp-end" />
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMProblem, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "The problem" },
    lead: { type: ControlType.String, title: "Lead (grey)", defaultValue: "Yet most influencer marketing" },
    rest: { type: ControlType.String, title: "Rest", displayTextArea: true, defaultValue: "still buys followers and hopes for the best." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "sound familiar?" },
    items: {
        type: ControlType.Array,
        title: "Problems",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                visual: {
                    type: ControlType.Enum,
                    title: "Exhibit",
                    options: ["crowd", "spike", "vanity", "none"],
                    optionTitles: ["Hollow crowd", "Spike then silence", "Vanity report", "None"],
                },
            },
        },
        defaultValue: [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust.", visual: "crowd" },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week.", visual: "spike" },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed.", visual: "vanity" },
        ],
    },
})
