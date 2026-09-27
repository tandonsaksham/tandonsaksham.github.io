// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the chapter opener used five times (01 The shift … 05 What's next). Giant
// vermilion numeral, spaced label across it, the stack of short lines whose vermilion line
// marks the chapter's position, and the long rule dividing headline from body.

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

type ChapterProps = {
    number: string
    label: string
    headline: string
    body: string
    total: number
    anchor: string
    style?: React.CSSProperties
}

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
.wmc-digits{display:flex;font-weight:800;font-size:clamp(150px,24cqw,380px);line-height:.78;letter-spacing:-.06em;color:var(--red)}
.wmc-d{display:inline-block;overflow:hidden;padding:.06em .02em .04em;margin:-.06em -.02em -.04em}
.wmc-d span{display:inline-block;transform:translate3d(0,105%,0);transition:transform 1.3s var(--ease);transition-delay:calc(var(--k) * .1s)}
.wmc-digits.wm-in .wmc-d span{transform:none}
.wmc-label{position:absolute;left:clamp(80px,10cqw,160px);top:50%;transform:translateY(-50%);z-index:2;white-space:nowrap;font-weight:300;font-size:clamp(14px,1.55cqw,23px);text-transform:uppercase;letter-spacing:.34em;color:var(--cream);
opacity:0;letter-spacing:.7em;transition:opacity 1.2s var(--ease) .5s,letter-spacing 1.6s var(--ease) .5s}
.wmc-label.wm-in{opacity:1;letter-spacing:.34em}
.wmc-text{position:relative;z-index:1;display:grid;grid-template-rows:1fr 1fr}
.wmc-h{align-self:end;padding-bottom:clamp(28px,3.4cqw,52px);font-weight:760;font-size:clamp(30px,3.7cqw,58px);line-height:1;letter-spacing:-.035em;max-width:14em}
.wmc-b{align-self:start;padding-top:clamp(20px,2.2cqw,32px);max-width:34em;color:var(--mut)}
@container (max-width:760px){
.wmc-grid{grid-template-columns:1fr;gap:28px}
.wmc-rule{top:clamp(75px,24cqw,190px)}
.wmc-num{min-height:0;padding-left:clamp(48px,14cqw,72px)}
.wmc-digits{font-size:clamp(130px,40cqw,300px)}
.wmc-label{left:clamp(64px,20cqw,110px)}
.wmc-text{grid-template-rows:auto auto}
.wmc-h{padding-bottom:16px}.wmc-b{padding-top:0}
}
@container (max-width:560px){.wmc-h br{display:none}}
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

    const pos = Math.max(1, Math.min(total, parseInt(number, 10) || 1))
    const numRef = React.useRef<HTMLDivElement>(null)
    const drift = useDrift(numRef, 28)
    const [linesRef, linesIn] = useIn<HTMLDivElement>(0.5)
    const [digitsRef, digitsIn] = useIn<HTMLDivElement>(0.4)
    const [labelRef, labelIn] = useIn<HTMLSpanElement>(0.5)
    const digits = Array.from(number)

    return (
        <Section theme="ink" id={anchor} className="wmc" css={CHAPTER_CSS} style={style} label={"Chapter " + number + " — " + label}>
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
                            <div ref={digitsRef} className={"wmc-digits" + digitsIn} aria-hidden="true">
                                {digits.map((d, k) => (
                                    <span className="wmc-d" key={k}>
                                        <span style={cssVars({ "--k": k })}>{d}</span>
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <span ref={labelRef} className={"wmc-label" + labelIn}>
                            {label}
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
