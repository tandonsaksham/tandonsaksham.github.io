// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slides 14 and 16, "Case file — the story". Variant "panel" (CF-001) has the
// brief / idea / move rows beside a blank image panel with a taped note; variant "creators"
// (CF-002) shows three blank phone frames for the creators, the middle one in vermilion.

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
.wm-wrap{position:relative;width:100%;max-width:1400px;margin:0 auto;padding:clamp(72px,8cqw,118px) clamp(20px,5.2cqw,80px) clamp(40px,4.4cqw,60px)}
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
.wm-foot{display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-top:clamp(56px,6.4cqw,96px)}
.wm-foot b{font-weight:800;font-size:13.5px;letter-spacing:-.03em;color:var(--fg)}
.wm-foot b i{font-style:normal;color:var(--red)}
.wm-sec[data-wm-theme="red"] .wm-foot b i{color:var(--cream)}
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

/** Scroll-linked drift for depth. Returns a MotionValue for `y`. */
function useDrift(ref: React.RefObject<HTMLElement>, distance: number) {
    const still = useStill()
    const { scrollYProgress } = useScroll({ target: ref as React.RefObject<HTMLElement>, offset: ["start end", "end start"] })
    return useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [distance, -distance])
}

/** Slide footer from the deck: "world media." left, page label right. */
function PageLabel(p: { text: string }) {
    if (!p.text) return null
    return (
        <Fade className="wm-foot" delay={0.15} aria-hidden="true">
            <b>
                world media<i>.</i>
            </b>
            <span className="wm-mono wm-mut">{p.text}</span>
        </Fade>
    )
}

type StoryRow = { label: string; text: string }
type Creator = { handle: string; stat: string }

type CaseStoryProps = {
    variant: "panel" | "creators"
    anchor: string
    tag: string
    meta: string
    title: string
    hook: string
    rowsPanel: StoryRow[]
    rowsCreators: StoryRow[]
    noteLines: string
    creators: Creator[]
    pageLabel: string
    style?: React.CSSProperties
}

const STORY_CSS = `
.wmst-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(32px,5cqw,90px);align-items:start;margin-top:clamp(28px,3.4cqw,48px)}
.wmst-meta{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:var(--red);text-transform:uppercase}
.wmst-h{margin-top:14px;font-weight:780;font-size:clamp(38px,5cqw,76px);line-height:.98;letter-spacing:-.042em}
.wmst-hook{display:inline-block;margin-top:clamp(12px,1.4cqw,20px);color:var(--red);font-size:clamp(21px,2.1cqw,31px)}
.wmst-rows{margin-top:clamp(24px,3cqw,40px)}
.wmst-row{position:relative;display:grid;grid-template-columns:clamp(96px,10cqw,130px) 1fr;gap:16px;padding:16px 0}
.wmst-row>.wm-hr{position:absolute;left:0;right:0;bottom:0}
.wmst-row:last-child>.wm-hr{display:none}
.wmst-l{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:var(--mut);padding-top:3px;text-transform:uppercase}
.wmst.stack .wmst-row{grid-template-columns:1fr;gap:6px;padding:10px 0}
.wmst.stack .wmst-row>.wm-hr{display:none}
.wmst-panelwrap{position:relative}
.wmst-panel{aspect-ratio:1/1.02;border-radius:16px}
.wmst-panel-in{clip-path:inset(100% 0 0 0);transition:clip-path 1.3s var(--ease-io) .15s}
.wmst-panel-in.wm-in{clip-path:inset(0 0 0 0)}
.wmst-note{position:absolute;left:clamp(-18px,-1.2cqw,-8px);bottom:clamp(40px,5cqw,80px);background:var(--cream);color:var(--ink);padding:22px 26px 18px;border-radius:3px;box-shadow:0 30px 50px -28px rgba(0,0,0,.75);
transform:rotate(-4deg);transition:transform .9s cubic-bezier(.34,1.56,.64,1)}
.wmst-note:hover{transform:rotate(1deg) translateY(-4px)}
.wmst-note .wm-script{display:block;font-size:clamp(20px,1.9cqw,26px);line-height:1.18}
.wmst-tape{position:absolute;left:50%;top:-11px;width:70px;height:22px;margin-left:-35px;background:rgba(200,190,168,.82);transform:rotate(3deg)}
.wmst-notein{opacity:0;transform:translateY(40px) rotate(-14deg);transition:opacity .8s var(--ease),transform 1.2s cubic-bezier(.34,1.56,.64,1);transition-delay:.7s}
.wmst-notein.wm-in{opacity:1;transform:none}
.wmst-phones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.3cqw,18px);align-items:start}
.wmst-phone .wm-ph{aspect-ratio:9/16.5;border-radius:clamp(16px,1.8cqw,26px);background:var(--ink2);border:1px solid var(--line)}
.wmst-phone.mid .wm-ph{border:2px solid var(--red)}
.wmst-phone b{display:block;margin-top:12px;font-size:13.5px;font-weight:650;letter-spacing:-.01em}
.wmst-phone figcaption>span{display:block;font-size:12.5px;color:var(--mut);margin-top:2px}
@container (max-width:860px){.wmst-grid{grid-template-columns:1fr}.wmst-note{left:12px}}
@container (max-width:560px){.wmst-phone b{font-size:12px;overflow-wrap:anywhere}.wmst-phone figcaption>span{font-size:11.5px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMCaseStory(props: CaseStoryProps) {
    const variant = props.variant || "panel"
    const isPanel = variant === "panel"
    const {
        anchor = isPanel ? "case-001" : "case-002",
        tag = isPanel ? "Case file 001 — the story" : "Case file 002 — the story",
        meta = isPanel ? "[Brand] × World Media · [Category] · [Year]" : "[Brand] × World Media · [Year]",
        title = "[Campaign name]",
        hook = "the one where [one-line hook]",
        rowsPanel = [
            { label: "The brief", text: "[What the brand needed: the business problem in one or two lines.]" },
            { label: "The idea", text: "[The creative insight that made creators want to post it.]" },
            { label: "Our move", text: "[Who we cast, which platforms, and what made the execution different.]" },
        ],
        rowsCreators = [
            { label: "The brief", text: "[What the brand needed, in two lines.]" },
            { label: "The idea", text: "[The format or trend we built around, and why these three creators.]" },
        ],
        noteLines = "[__] creators\n[__] cities\n[__] days live",
        creators = [
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
        ],
        pageLabel = "04 — What we've done",
        style,
    } = props

    const rows = isPanel ? rowsPanel : rowsCreators
    const phonesRef = React.useRef<HTMLDivElement>(null)
    const up = useDrift(phonesRef, 22)
    const down = useDrift(phonesRef, -34)
    const [panelRef, panelIn] = useIn<HTMLDivElement>(0.25)
    const [noteRef, noteIn] = useIn<HTMLDivElement>(0.3)

    return (
        <Section theme="ink" id={anchor} className={"wmst" + (isPanel ? "" : " stack")} css={STORY_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmst-grid" ref={phonesRef}>
                    <div>
                        <Fade className="wmst-meta" delay={0.1}>
                            {meta}
                        </Fade>
                        <Words as="h2" className="wmst-h" text={title} delay={0.15} />
                        <Script className="wmst-hook" delay={0.6} rotate={-2}>
                            {hook}
                        </Script>
                        <Stagger className="wmst-rows" step={0.1} delay={0.3}>
                            {rows.map((r, i) => (
                                <div className="wmst-row" key={i}>
                                    <span className="wmst-l">{r.label}</span>
                                    <p className="wm-body">{fill(r.text)}</p>
                                    <div className="wm-hr" />
                                </div>
                            ))}
                        </Stagger>
                    </div>

                    {isPanel ? (
                        <div className="wmst-panelwrap" ref={panelRef}>
                            <div className={"wmst-panel-in" + panelIn}>
                                <div className="wm-ph wmst-panel" aria-hidden="true" />
                            </div>
                            <div ref={noteRef} className={"wmst-notein" + noteIn} style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, pointerEvents: "none" }}>
                                <div className="wmst-note" style={{ pointerEvents: "auto" }}>
                                    <span className="wmst-tape" aria-hidden="true" />
                                    {noteLines.split("\n").map((l, i) => (
                                        <span className="wm-script" key={i}>
                                            {fill(l)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="wmst-phones">
                            {creators.slice(0, 3).map((c, i) => (
                                <motion.figure className={"wmst-phone" + (i === 1 ? " mid" : "")} key={i} style={{ y: i === 1 ? down : up, marginTop: i === 1 ? "clamp(20px,3cqw,44px)" : 0 }}>
                                    <Rise delay={0.15 + i * 0.12}>
                                        <div className="wm-ph" aria-hidden="true" />
                                        <figcaption>
                                            <b>{c.handle}</b>
                                            <span>{fill(c.stat)}</span>
                                        </figcaption>
                                    </Rise>
                                </motion.figure>
                            ))}
                        </div>
                    )}
                </div>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMCaseStory, {
    variant: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["panel", "creators"],
        optionTitles: ["Image panel", "Three creators"],
        defaultValue: "panel",
        displaySegmentedControl: true,
    },
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "case-001" },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Case file 001 — the story" },
    meta: { type: ControlType.String, title: "Meta", defaultValue: "[Brand] × World Media · [Category] · [Year]" },
    title: { type: ControlType.String, title: "Campaign", defaultValue: "[Campaign name]" },
    hook: { type: ControlType.String, title: "Handwritten hook", defaultValue: "the one where [one-line hook]" },
    rowsPanel: {
        type: ControlType.Array,
        title: "Story rows",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
            },
        },
        defaultValue: [
            { label: "The brief", text: "[What the brand needed: the business problem in one or two lines.]" },
            { label: "The idea", text: "[The creative insight that made creators want to post it.]" },
            { label: "Our move", text: "[Who we cast, which platforms, and what made the execution different.]" },
        ],
        hidden: (p: any) => p.variant === "creators",
    },
    rowsCreators: {
        type: ControlType.Array,
        title: "Story rows",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
            },
        },
        defaultValue: [
            { label: "The brief", text: "[What the brand needed, in two lines.]" },
            { label: "The idea", text: "[The format or trend we built around, and why these three creators.]" },
        ],
        hidden: (p: any) => p.variant !== "creators",
    },
    noteLines: {
        type: ControlType.String,
        title: "Note (one per line)",
        displayTextArea: true,
        defaultValue: "[__] creators\n[__] cities\n[__] days live",
        hidden: (p: any) => p.variant === "creators",
    },
    creators: {
        type: ControlType.Array,
        title: "Creators",
        maxCount: 3,
        control: {
            type: ControlType.Object,
            controls: {
                handle: { type: ControlType.String, title: "Handle" },
                stat: { type: ControlType.String, title: "Stat" },
            },
        },
        defaultValue: [
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
        ],
        hidden: (p: any) => p.variant !== "creators",
    },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "04 — What we've done" },
})
