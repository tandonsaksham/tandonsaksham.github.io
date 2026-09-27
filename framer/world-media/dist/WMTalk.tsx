// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 24, the vermilion close — "Let's make noise →" in giant ink type with a
// hand-drawn arrow and "your brand, our next case file", then the contact brief: a short
// intro and the contact details beside a paper form (name, company, email, what you want to
// build, budget, message → "Send It Over"). Paste a form endpoint (Formspree, Getform, a
// webhook…) into "Form endpoint" to receive entries; left empty, the form opens a pre-filled
// email to the address in "Send to" instead.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion"

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

type Contact = { label: string; value: string; href: string }

type TalkProps = {
    anchor: string
    tag: string
    line1: string
    line2: string
    note: string
    href: string
    title: string
    intro: string
    contacts: Contact[]
    feed: string
    endpoint: string
    sendTo: string
    builds: string[]
    budgets: string[]
    button: string
    promise: string
    thanks: string
    style?: React.CSSProperties
}

type SendState = "idle" | "sending" | "sent" | "mail" | "error"

const TALK_CSS = `
.wmt .wm-wrap{padding-top:clamp(80px,9cqw,140px);padding-bottom:clamp(56px,6cqw,90px)}
.wmt :focus-visible{outline-color:var(--ink)}
.wmt .wmtf :focus-visible{outline-color:var(--red)}
.wmt-big{display:block;margin-top:clamp(28px,3.6cqw,56px);font-weight:800;font-size:clamp(78px,13.4cqw,214px);line-height:.86;letter-spacing:-.058em;color:var(--ink)}
.wmt-l2{display:flex;align-items:center;gap:clamp(18px,2.6cqw,44px);flex-wrap:wrap}
.wmt-arrow{width:clamp(110px,15cqw,240px);height:auto;color:var(--ink);transition:transform .8s var(--ease)}
.wmt-big:hover .wmt-arrow,.wmt-big:focus-visible .wmt-arrow{transform:translateX(18px)}
.wmt-note{color:var(--cream);font-size:clamp(22px,2.4cqw,36px);max-width:12em;line-height:1.1;text-wrap:balance}
.wmt-grid{position:relative;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);grid-template-rows:auto 1fr;column-gap:clamp(36px,5cqw,96px);row-gap:0;align-items:start;margin-top:clamp(52px,6cqw,96px);padding-top:clamp(28px,3cqw,44px)}
.wmt-intro{grid-column:1;grid-row:1}
.wmt-formcol{grid-column:2;grid-row:1 / span 2}
.wmt-reach{grid-column:1;grid-row:2}
.wmt-rule{position:absolute;left:0;right:0;top:0}
.wmt-h{font-weight:780;font-size:clamp(30px,3.2cqw,48px);line-height:1;letter-spacing:-.04em;color:var(--ink);max-width:11em;text-wrap:balance}
.wmt-sub{margin-top:clamp(12px,1.3cqw,18px);max-width:25em;color:rgba(15,15,15,.78)}
.wmt-rows{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:clamp(20px,2cqw,28px) 20px;margin-top:clamp(28px,3.4cqw,48px)}
.wmt-c{min-width:0}
.wmt-c .wm-mono{display:block;text-transform:uppercase;letter-spacing:.1em;font-size:11.5px;color:rgba(15,15,15,.7)}
.wmt-c a,.wmt-c span.v{display:inline-block;max-width:100%;margin-top:8px;font-weight:700;font-size:clamp(15px,1.3cqw,18px);letter-spacing:-.01em;overflow-wrap:anywhere;background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .6s var(--ease)}
.wmt-c a:hover{background-size:100% 1.5px}
.wmt-feed{margin-top:clamp(26px,3cqw,40px);max-width:17em;color:var(--cream);font-size:clamp(21px,2cqw,28px);line-height:1.12}
.wmtf{position:relative;display:flex;flex-direction:column;padding:clamp(22px,2.6cqw,40px);border-radius:clamp(20px,2cqw,28px);background:var(--paper);color:var(--ink);box-shadow:0 44px 90px -56px rgba(70,14,0,.7)}
.wmtf-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:clamp(20px,2.2cqw,30px);padding-bottom:14px;border-bottom:1px dashed rgba(15,15,15,.18);font-family:"DM Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:rgba(15,15,15,.6)}
.wmtf-top b{font-weight:400;color:var(--red)}
.wmtf form{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,2cqw,28px) clamp(16px,1.8cqw,28px)}
.wmtf-f{position:relative;display:flex;flex-direction:column;gap:6px;min-width:0}
.wmtf-f.w{grid-column:1/-1}
.wmtf-l{font-family:"DM Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:rgba(15,15,15,.62)}
.wmtf-l b{font-weight:400;color:var(--red)}
.wmtf-l small{font-size:inherit;letter-spacing:.04em;text-transform:none;color:rgba(15,15,15,.42)}
.wmtf-box{position:relative}
.wmtf-in{display:block;width:100%;margin:0;padding:8px 0 10px;border:0;border-radius:0;background:transparent;color:var(--ink);font:inherit;font-size:clamp(17px,1.4cqw,19px);font-weight:560;letter-spacing:-.012em;outline:none;box-shadow:inset 0 -1px 0 rgba(15,15,15,.24);-webkit-appearance:none;appearance:none;transition:box-shadow .3s}
.wmtf-in::placeholder{color:rgba(15,15,15,.33);font-weight:450}
textarea.wmtf-in{min-height:92px;resize:vertical;line-height:1.45;field-sizing:content}
.wmtf-line{position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--red);transform:scaleX(0);transform-origin:0 50%;transition:transform .6s var(--ease);pointer-events:none}
.wmtf-box:focus-within .wmtf-line{transform:none}
.wmtf-f[data-err] .wmtf-in{box-shadow:inset 0 -1px 0 var(--red)}
.wmtf-err{position:absolute;right:0;top:-5px;font-family:"Caveat","Bradley Hand",cursive;font-weight:600;font-size:19px;line-height:1;color:var(--red);rotate:-3deg;animation:wmtf-in .45s var(--ease) both}
@keyframes wmtf-in{from{opacity:0;translate:0 6px}}
.wmtf-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.wmtf-chip{position:relative;display:inline-flex;cursor:pointer;-webkit-tap-highlight-color:transparent}
.wmtf-chip input{position:absolute;top:0;left:0;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}
.wmtf-chip span{display:inline-flex;align-items:center;height:36px;padding:0 14px;border:1px solid rgba(15,15,15,.2);border-radius:99px;font-size:14px;font-weight:560;letter-spacing:-.01em;white-space:nowrap;
transition:background-color .35s var(--ease),color .35s var(--ease),border-color .35s,scale .35s var(--ease)}
.wmtf-chip svg{width:0;height:10px;flex:none;overflow:visible;transition:width .45s var(--ease),margin .45s var(--ease)}
.wmtf-chip svg path{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .45s var(--ease) .1s}
.wmtf-chip:hover span{border-color:rgba(15,15,15,.55)}
.wmtf-chip:active span{scale:.96}
.wmtf-chip input:checked+span{background:var(--ink);border-color:var(--ink);color:var(--cream)}
.wmtf-chip input:checked+span svg{width:11px;margin-right:7px}
.wmtf-chip input:checked+span svg path{stroke-dashoffset:0}
.wmtf-chip input:focus-visible+span{outline:2px solid var(--red);outline-offset:2px}
.wmtf-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}
.wmtf-foot{grid-column:1/-1;display:flex;align-items:center;flex-wrap:wrap;gap:14px 22px;margin-top:4px}
.wmtf-btn{display:inline-flex;align-items:center;gap:12px;height:56px;padding:0 24px 0 28px;border:0;border-radius:99px;background:var(--ink);color:var(--cream);font:inherit;font-weight:650;font-size:16.5px;letter-spacing:-.012em;cursor:pointer;transition:background-color .35s,opacity .3s}
.wmtf-btn:hover{background:#262522}
.wmtf-btn .wm-arrowline{width:1.7em;height:.72em}
.wmtf-btn:hover .wm-arrowline{width:2.3em}
.wmtf-btn[data-busy] .wm-arrowline{animation:wmtf-fly .9s var(--ease-io) infinite}
@keyframes wmtf-fly{0%{translate:0;opacity:1}55%{translate:14px;opacity:0}56%{translate:-10px;opacity:0}100%{translate:0;opacity:1}}
.wmtf-promise{font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.02em;color:rgba(15,15,15,.58)}
.wmtf-msg{grid-column:1/-1;margin:0;padding:12px 14px;border-radius:12px;background:rgba(233,67,27,.1);font-size:14.5px;line-height:1.45}
.wmtf-msg a{font-weight:650;text-decoration:underline;text-underline-offset:3px}
.wmtf-done{flex:1;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:14px;padding:clamp(12px,3cqw,48px) 0}
.wmtf-tick{width:64px;height:64px;color:var(--red)}
.wmtf-tick path{stroke-dasharray:1;stroke-dashoffset:1;animation:wmtf-draw 1s var(--ease) .15s forwards}
.wmtf-tick path+path{animation-delay:.55s}
@keyframes wmtf-draw{to{stroke-dashoffset:0}}
.wmtf-done h3{font-weight:780;font-size:clamp(28px,3cqw,44px);line-height:1;letter-spacing:-.04em}
.wmtf-done p{max-width:26em;color:rgba(15,15,15,.72)}
.wmtf-again{margin-top:6px;padding:0;border:0;background:none;color:var(--ink);font:inherit;font-weight:650;font-size:15px;text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.wmt.still .wmtf-tick path,.wmt.still .wmtf-err{animation:none;stroke-dashoffset:0}
@container (max-width:1000px){.wmt-grid{grid-template-columns:1fr;grid-template-rows:none;row-gap:clamp(28px,4cqw,40px)}.wmt-intro,.wmt-formcol,.wmt-reach{grid-column:1;grid-row:auto}.wmt-rows{margin-top:0}.wmt-rows{grid-template-columns:repeat(4,auto);justify-content:space-between}}
@container (max-width:760px){.wmt-rows{grid-template-columns:1fr 1fr;justify-content:stretch}.wmt-c.long{grid-column:1/-1}}
@container (max-width:560px){.wmtf form{grid-template-columns:1fr}.wmtf{margin:0 calc(-1 * clamp(4px,1.2cqw,10px))}.wmtf-btn{flex:1 1 auto;justify-content:center}.wmtf-chip span{height:34px;padding:0 12px;font-size:13.5px}}
`

/** Tick for a chosen chip. */
function ChipTick() {
    return (
        <svg viewBox="0 0 11 10" fill="none" aria-hidden="true">
            <path d="M1.5 5.4 4.2 8l5.3-6.2" pathLength={1} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

type FieldProps = {
    id: string
    name: string
    label: string
    need?: boolean
    wide?: boolean
    err?: string
    type?: string
    auto?: string
    hint?: string
    area?: boolean
}

function Field(p: FieldProps) {
    const errId = p.id + "-e"
    const common = {
        id: p.id,
        name: p.name,
        className: "wmtf-in",
        placeholder: p.hint,
        "aria-required": p.need || undefined,
        "aria-invalid": p.err ? true : undefined,
        "aria-describedby": p.err ? errId : undefined,
    }
    return (
        <div className={"wmtf-f" + (p.wide ? " w" : "")} data-err={p.err ? "1" : undefined}>
            <label className="wmtf-l" htmlFor={p.id}>
                {p.label}
                {p.need ? <b> *</b> : <small> (optional)</small>}
            </label>
            <div className="wmtf-box">
                {p.area ? <textarea {...common} rows={3} /> : <input {...common} type={p.type || "text"} autoComplete={p.auto} />}
                <span className="wmtf-line" aria-hidden="true" />
            </div>
            {p.err ? (
                <span className="wmtf-err" id={errId}>
                    {p.err}
                </span>
            ) : null}
        </div>
    )
}

function Chips(p: { id: string; name: string; label: string; items: string[]; multi: boolean }) {
    return (
        <div className="wmtf-f w" role="group" aria-labelledby={p.id}>
            <span className="wmtf-l" id={p.id}>
                {p.label}
                {p.multi ? <small> (pick any)</small> : <small> (optional)</small>}
            </span>
            <div className="wmtf-chips">
                {p.items.map((it, i) => (
                    <label className="wmtf-chip" key={i}>
                        <input type={p.multi ? "checkbox" : "radio"} name={p.name} value={it} />
                        <span>
                            <ChipTick />
                            {it}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

const text = (fd: FormData, k: string) => String(fd.get(k) || "").trim()

function BriefForm(p: TalkProps & { still: boolean }) {
    const uid = React.useId().replace(/:/g, "")
    const reduce = useReducedMotion()
    const [state, setState] = React.useState<SendState>("idle")
    const [errs, setErrs] = React.useState<Record<string, string>>({})
    const [who, setWho] = React.useState("")
    const card = React.useRef<HTMLDivElement>(null)
    const id = (k: string) => "wmtf" + uid + k

    const clear = (e: React.FormEvent<HTMLFormElement>) => {
        const n = (e.target as HTMLInputElement).name
        if (n && errs[n]) setErrs((o) => {
            const c = { ...o }
            delete c[n]
            return c
        })
    }

    // Keep the card's height while the form fades out, then ease it down to fit the thank-you note.
    const hold = () => {
        const el = card.current
        if (!el) return
        const h = el.offsetHeight
        el.style.transition = "none"
        el.style.minHeight = h + "px"
        window.setTimeout(() => {
            el.style.transition = reduce || p.still ? "none" : "min-height .9s cubic-bezier(.16,1,.3,1)"
            el.style.minHeight = Math.min(h, 440) + "px"
        }, 480)
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (state === "sending") return
        const form = e.currentTarget
        const fd = new FormData(form)
        const name = text(fd, "name")
        const email = text(fd, "email")
        const message = text(fd, "message")
        const bad: Record<string, string> = {}
        if (!name) bad.name = "we'll need this"
        if (!email) bad.email = "we'll need this"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.email = "that doesn't look right"
        if (!message) bad.message = "a line or two, please"
        setErrs(bad)
        const first = Object.keys(bad)[0]
        if (first) {
            const el = form.querySelector<HTMLElement>('[name="' + first + '"]')
            if (el) el.focus()
            return
        }
        setWho(name.split(/\s+/)[0])
        // Bots fill the hidden field; they get a thank-you and nothing is sent.
        if (text(fd, "_gotcha")) {
            hold()
            setState("sent")
            return
        }
        const company = text(fd, "company")
        const builds = fd.getAll("build").map(String).join(", ")
        const budget = text(fd, "budget")
        const subject = "New brief from " + name + (company ? " (" + company + ")" : "")
        const endpoint = (p.endpoint || "").trim()
        if (!endpoint) {
            const lines = [
                "Name: " + name,
                company ? "Company: " + company : "",
                "Email: " + email,
                builds ? "Looking to build: " + builds : "",
                budget ? "Budget: " + budget : "",
                "",
                message,
            ].filter((l, i) => l || i === 5)
            window.location.href = "mailto:" + p.sendTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"))
            hold()
            setState("mail")
            return
        }
        setState("sending")
        try {
            const out = new FormData()
            out.append("name", name)
            out.append("company", company)
            out.append("email", email)
            out.append("looking_to_build", builds)
            out.append("budget", budget)
            out.append("message", message)
            out.append("_subject", subject)
            out.append("_replyto", email)
            const r = await fetch(endpoint, { method: "POST", body: out, headers: { Accept: "application/json" } })
            if (!r.ok) throw new Error("status " + r.status)
            form.reset()
            hold()
            setState("sent")
        } catch (err) {
            setState("error")
        }
    }

    const again = () => {
        if (card.current) {
            card.current.style.transition = ""
            card.current.style.minHeight = ""
        }
        setErrs({})
        setState("idle")
    }

    const done = state === "sent" || state === "mail"
    const fade = reduce || p.still ? { opacity: 1 } : { opacity: 0, y: 14 }

    return (
        <div className="wmtf" ref={card} id={p.anchor ? p.anchor + "-form" : undefined}>
            <div className="wmtf-top" aria-hidden="true">
                <span>New brief</span>
                <span>
                    <b>*</b> needed
                </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
                {done ? (
                    <motion.div key="done" className="wmtf-done" role="status" initial={fade} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                        <svg className="wmtf-tick" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                            <path d="M32 5C15 4 5 17 6 32c1 16 14 27 28 26 15-1 25-13 24-28C57 17 47 6 30 7" pathLength={1} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            <path d="M20 33l9 9 17-20" pathLength={1} stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3>{state === "mail" ? "Your email's ready" + (who ? ", " + who : "") + "." : "Got it" + (who ? ", " + who : "") + "."}</h3>
                        <p className="wm-body">{state === "mail" ? "Your email app should have opened with the brief filled in. Hit send there and it lands straight with us." : p.thanks}</p>
                        <button type="button" className="wmtf-again" onClick={again}>
                            {state === "mail" ? "Back to the form" : "Send another brief"}
                        </button>
                    </motion.div>
                ) : (
                    <motion.form key="form" noValidate onSubmit={onSubmit} onChange={clear} initial={fade} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                        <Field id={id("n")} name="name" label="Name" need auto="name" hint="Your name" err={errs.name} />
                        <Field id={id("c")} name="company" label="Company" auto="organization" hint="Brand or company" />
                        <Field id={id("e")} name="email" label="Email" need wide type="email" auto="email" hint="you@brand.com" err={errs.email} />
                        {p.builds.length ? <Chips id={id("b")} name="build" label="What are you looking to build?" items={p.builds} multi /> : null}
                        {p.budgets.length ? <Chips id={id("g")} name="budget" label="Budget range" items={p.budgets} multi={false} /> : null}
                        <Field id={id("m")} name="message" label="Message" need wide area hint="The product, the audience, the dream outcome…" err={errs.message} />
                        <div className="wmtf-hp" aria-hidden="true">
                            <label>
                                Leave this empty
                                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
                            </label>
                        </div>
                        {state === "error" ? (
                            <p className="wmtf-msg" role="alert">
                                That didn't go through. Try once more, or write to <a href={"mailto:" + p.sendTo}>{p.sendTo}</a>.
                            </p>
                        ) : null}
                        <div className="wmtf-foot">
                            <button type="submit" className="wmtf-btn" data-busy={state === "sending" ? "1" : undefined} aria-disabled={state === "sending" || undefined}>
                                {state === "sending" ? "Sending…" : p.button}
                                <LineArrow />
                            </button>
                            <span className="wmtf-promise">{p.promise}</span>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMTalk(props: TalkProps) {
    const {
        anchor = "lets-talk",
        tag = "Let's talk",
        line1 = "Let's make",
        line2 = "noise",
        note = "your brand, our next case file",
        href = "#lets-talk-form",
        title = "Got a brand worth talking about?",
        intro = "Tell us what you're building. We'll tell you who should be saying it — and get back to you within a day.",
        contacts = [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
        ],
        feed = "a website updates once a quarter. our feed doesn't.",
        endpoint = "",
        sendTo = "social@worldmedia.co.in",
        builds = ["Influencer marketing", "Celebrity marketing", "Talent management", "Creative strategy", "Video production", "Performance marketing", "Content writing"],
        budgets = ["Under ₹5L", "₹5–15L", "₹15–50L", "₹50L+", "Not sure yet"],
        button = "Send It Over",
        promise = "We'll get back to you within a day",
        thanks = "Your brief is with the team. Expect a reply within a day — usually with a first idea or two already in it.",
        style,
    } = props
    const still = useStill()

    return (
        <Section theme="red" id={anchor} className={"wmt" + (still ? " still" : "")} css={TALK_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <a className="wmt-big" href={href} data-cursor="Say hi" aria-label={line1 + " " + line2}>
                    <Words text={line1} stagger={0.08} style={{ display: "block" }} />
                    <span className="wmt-l2">
                        <Words text={line2} delay={0.2} />
                        <Arrow kind="long" className="wmt-arrow" delay={0.7} stroke={5} />
                        <Script className="wmt-note" delay={1.2} rotate={-6}>
                            {note}
                        </Script>
                    </span>
                </a>
                <div className="wmt-grid">
                    <Rule strong className="wmt-rule" />
                    <div className="wmt-intro">
                        <Words as="h2" className="wmt-h" text={title} stagger={0.04} />
                        <Rise as="p" className="wmt-sub wm-body" delay={0.2}>
                            {intro}
                        </Rise>
                    </div>
                    <Rise className="wmt-formcol" delay={0.15}>
                        <BriefForm {...props} anchor={anchor} endpoint={endpoint} sendTo={sendTo} builds={builds} budgets={budgets} button={button} promise={promise} thanks={thanks} still={still} />
                    </Rise>
                    <div className="wmt-reach">
                        <Stagger className="wmt-rows" step={0.08} delay={0.25}>
                            {contacts.map((c, i) => (
                                <div className={"wmt-c" + ((c.value || "").length > 17 ? " long" : "")} key={i}>
                                    <span className="wm-mono">{c.label}</span>
                                    {c.href ? (
                                        <a href={c.href} target={c.href.indexOf("http") === 0 ? "_blank" : undefined} rel="noreferrer">
                                            {c.value}
                                        </a>
                                    ) : (
                                        <span className="v">{c.value}</span>
                                    )}
                                </div>
                            ))}
                        </Stagger>
                        {feed ? (
                            <Script as="p" className="wmt-feed" delay={0.6} rotate={-3}>
                                {feed}
                            </Script>
                        ) : null}
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMTalk, {
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "lets-talk" },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Let's talk" },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: "Let's make" },
    line2: { type: ControlType.String, title: "Line 2", defaultValue: "noise" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "your brand, our next case file" },
    href: { type: ControlType.String, title: "Headline link", defaultValue: "#lets-talk-form" },
    title: { type: ControlType.String, title: "Form title", defaultValue: "Got a brand worth talking about?" },
    intro: {
        type: ControlType.String,
        title: "Form intro",
        displayTextArea: true,
        defaultValue: "Tell us what you're building. We'll tell you who should be saying it — and get back to you within a day.",
    },
    contacts: {
        type: ControlType.Array,
        title: "Contacts",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
        ],
    },
    feed: { type: ControlType.String, title: "Handwritten 2", defaultValue: "a website updates once a quarter. our feed doesn't." },
    endpoint: {
        type: ControlType.String,
        title: "Form endpoint",
        defaultValue: "",
        placeholder: "https://formspree.io/f/…",
        description: "Where entries are sent (Formspree, Getform, a webhook). Empty = opens a pre-filled email instead.",
    },
    sendTo: { type: ControlType.String, title: "Send to", defaultValue: "social@worldmedia.co.in" },
    builds: {
        type: ControlType.Array,
        title: "Build options",
        control: { type: ControlType.String },
        defaultValue: ["Influencer marketing", "Celebrity marketing", "Talent management", "Creative strategy", "Video production", "Performance marketing", "Content writing"],
    },
    budgets: {
        type: ControlType.Array,
        title: "Budget options",
        control: { type: ControlType.String },
        defaultValue: ["Under ₹5L", "₹5–15L", "₹15–50L", "₹50L+", "Not sure yet"],
    },
    button: { type: ControlType.String, title: "Button", defaultValue: "Send It Over" },
    promise: { type: ControlType.String, title: "Reply promise", defaultValue: "We'll get back to you within a day" },
    thanks: {
        type: ControlType.String,
        title: "Thank-you text",
        displayTextArea: true,
        defaultValue: "Your brief is with the team. Expect a reply within a day — usually with a first idea or two already in it.",
    },
})
