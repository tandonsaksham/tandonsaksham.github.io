// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: "Hello! We are world media." in very big type, with small pictures set right
// into the words (blank colour pills until photos are added), a quick way to get in touch,
// and a bright card with the three things World Media believes.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion } from "framer-motion"

/* ───────────────────────── WORLD MEDIA · ONE-PAGE SYSTEM ─────────────────────────
   Shared tokens and helpers for the single-page World Media site. Framer code components
   must each be one self-contained file, so every section carries its own copy of what it
   uses. The rules live in @layer w2-base, so a section's own CSS always wins, and every
   class starts with w2- so this page never collides with the first site's components.
   Reveals animate opacity and the translate property only; transform stays free.
   paper #FFF8F1 · ink #161514 · red #F2522A · lime #D9FF3F · sky #8BDCFF · lilac #C9B6FF
   Inter Tight (text and big type) · Instrument Serif italic (the odd word, for warmth)
   ─────────────────────────────────────────────────────────────────────────────── */

type Tone = "paper" | "ink"

const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap"

const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties

const BASE_CSS = `
@layer w2-base{
.w2{--paper:#FFF8F1;--paper2:#F5ECE2;--ink:#161514;--ink2:#24221F;--red:#F2522A;--lime:#D9FF3F;--sky:#8BDCFF;--lilac:#C9B6FF;
--ease:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.7,0,.2,1);--r:clamp(18px,2.1cqw,30px);--m:clamp(8px,.9cqw,14px);--gut:clamp(18px,3.4cqw,52px);
position:relative;box-sizing:border-box;width:100%;container-type:inline-size;overflow:hidden;overflow:clip;
font-family:"Inter Tight","Helvetica Neue",Helvetica,Arial,sans-serif;font-weight:500;letter-spacing:-.012em;
-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
background:var(--bg);color:var(--fg)}
.w2[data-tone="paper"]{--bg:var(--paper);--fg:var(--ink);--mut:rgba(22,21,20,.64);--line:rgba(22,21,20,.14);--line2:rgba(22,21,20,.42)}
.w2[data-tone="ink"]{--bg:var(--ink);--fg:var(--paper);--mut:rgba(255,248,241,.56);--line:rgba(255,248,241,.16);--line2:rgba(255,248,241,.42)}
.w2 *,.w2 *::before,.w2 *::after{box-sizing:border-box}
.w2 :where(h1,h2,h3,h4,p,ul,ol,li,figure,blockquote){margin:0;padding:0;list-style:none}
.w2 :where(a){color:inherit;text-decoration:none}
.w2 :where(button){font:inherit;color:inherit;margin:0}
.w2 :where(a,button){touch-action:manipulation}
.w2 :where(.w2-mega,.w2-h1,.w2-h2,.w2-big,.w2-h3){text-wrap:balance}
.w2 ::selection{background:var(--lime);color:var(--ink)}
.w2 :focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:10px}
.w2-it{font-family:"Instrument Serif",Georgia,"Times New Roman",serif;font-style:italic;font-weight:400;letter-spacing:-.012em}
.w2-mega{font-size:clamp(62px,14.4cqw,232px);line-height:.88;letter-spacing:-.058em;font-weight:500}
.w2-h1{font-size:clamp(46px,8.2cqw,136px);line-height:.92;letter-spacing:-.05em;font-weight:500}
.w2-h2{font-size:clamp(34px,5cqw,80px);line-height:.98;letter-spacing:-.045em;font-weight:500}
.w2-big{font-size:clamp(26px,3.3cqw,54px);line-height:1.1;letter-spacing:-.035em;font-weight:500}
.w2-h3{font-size:clamp(21px,1.9cqw,28px);line-height:1.1;letter-spacing:-.03em;font-weight:500}
.w2-body{font-size:clamp(15px,1.12cqw,17px);line-height:1.5;letter-spacing:-.006em;font-weight:400}
.w2-small{font-size:13.5px;line-height:1.45;letter-spacing:-.004em;font-weight:400}
.w2-cap{font-size:12px;line-height:1.3;letter-spacing:.06em;text-transform:uppercase;font-weight:500}
.w2-mut{color:var(--mut)}
.w2-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.w2-card{position:relative;border-radius:var(--r);overflow:hidden}
.w2-pill{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.5em;height:38px;padding:0 17px;border:0;border-radius:99px;
font-size:14px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;cursor:pointer;background:var(--pc);color:var(--pt);text-decoration:none;
-webkit-tap-highlight-color:transparent;transition:translate .45s var(--ease),background-color .4s,color .4s}
.w2-pill[data-hue="red"]{--pc:var(--red);--pt:var(--ink)}
.w2-pill[data-hue="lime"]{--pc:var(--lime);--pt:var(--ink)}
.w2-pill[data-hue="sky"]{--pc:var(--sky);--pt:var(--ink)}
.w2-pill[data-hue="lilac"]{--pc:var(--lilac);--pt:var(--ink)}
.w2-pill[data-hue="ink"]{--pc:var(--ink);--pt:var(--paper)}
.w2-pill[data-hue="paper"]{--pc:var(--paper);--pt:var(--ink)}
.w2-roll{position:relative;display:inline-flex;overflow:hidden;line-height:1.2}
.w2-roll>span{display:block;transition:translate .5s var(--ease)}
.w2-roll>span+span{position:absolute;left:0;top:0;translate:0 105%}
a:hover>.w2-roll>span,button:hover>.w2-roll>span,a:focus-visible>.w2-roll>span,button:focus-visible>.w2-roll>span{translate:0 -105%}
a:hover>.w2-roll>span+span,button:hover>.w2-roll>span+span,a:focus-visible>.w2-roll>span+span,button:focus-visible>.w2-roll>span+span{translate:0 0}
.w2-lbl{display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:12px;letter-spacing:.01em;font-weight:500}
.w2-lbl i{flex:1;height:1px;background:currentColor;opacity:.22}
.w2-w{display:inline-block;overflow:hidden;vertical-align:top;padding:.08em .06em .16em;margin:-.08em -.06em -.16em}
.w2-w>span{display:inline-block;translate:0 108%;transition:translate 1.05s var(--ease);transition-delay:var(--d,0s)}
.w2-in .w2-w>span,.w2-w.w2-in>span{translate:0 0}
.w2-rise{opacity:0;translate:0 30px;transition:opacity 1s var(--ease),translate 1.1s var(--ease);transition-delay:var(--d,0s)}
.w2-rise.w2-in,.w2-in>.w2-rise{opacity:1;translate:0 0}
.w2-fade{opacity:0;transition:opacity 1.1s var(--ease);transition-delay:var(--d,0s)}
.w2-fade.w2-in,.w2-in>.w2-fade{opacity:1}
.w2-media{position:relative;display:inline-block;vertical-align:-.06em;height:.78em;width:var(--mw,1.7em);margin:0 .1em}
.w2-media>i{position:absolute;inset:0;border-radius:99px;overflow:hidden;background:var(--mc,var(--sky));
clip-path:inset(0 50% 0 50% round 99px);transition:clip-path 1.2s var(--ease-io);transition-delay:var(--d,0s)}
.w2-media.w2-in>i,.w2-in .w2-media>i{clip-path:inset(0 0 0 0 round 99px)}
.w2-media img,.w2-media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2-media b{position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.42) 48%,transparent 66%) 0 0/250% 100%;animation:w2shine 4.8s var(--ease-io) infinite;animation-delay:var(--d,0s)}
.w2-globe{display:block;overflow:visible}
.w2-globe .m{transform-box:fill-box;transform-origin:50% 50%;animation:w2mer var(--gs,9s) linear infinite;animation-delay:var(--gd,0s)}
@media (prefers-reduced-motion:reduce){
.w2 *{transition:none!important;animation:none!important}
.w2-w>span,.w2-rise,.w2-fade{translate:none!important;opacity:1!important}
.w2-media>i{clip-path:none!important}}
}
@keyframes w2mer{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes w2shine{0%{background-position:120% 0}60%,100%{background-position:-60% 0}}
`

const NOJS_CSS = `.w2-w>span,.w2-rise,.w2-fade{translate:none!important;opacity:1!important}.w2-media>i{clip-path:none!important}`

function useStill(): boolean {
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    return isStatic || !!reduce
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

/** A section shell: tone, anchor id and the section's own CSS. */
function Section(p: { tone?: Tone; id?: string; className?: string; css?: string; label?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
    return (
        <section className={"w2 " + (p.className || "")} data-tone={p.tone || "paper"} id={p.id || undefined} aria-label={p.label} style={p.style}>
            <Base />
            {p.css ? <style>{p.css}</style> : null}
            {p.children}
        </section>
    )
}

/** Adds w2-in once the element is in view (or straight away when still). */
function useReveal<T extends Element>(amount = 0.25): [React.RefObject<T>, string] {
    const ref = React.useRef<T>(null)
    const still = useStill()
    const seen = useInView(ref, { once: true, amount })
    return [ref, still || seen ? " w2-in" : ""]
}

/** Reveal wrapper: any element that fades and rises in when it reaches the viewport. */
function Reveal(p: { as?: any; className?: string; delay?: number; amount?: number; style?: React.CSSProperties; children?: React.ReactNode; id?: string }) {
    const [ref, on] = useReveal<HTMLElement>(p.amount ?? 0.2)
    const Tag = p.as || "div"
    return (
        <Tag ref={ref} id={p.id} className={(p.className || "w2-rise") + on} style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}>
            {p.children}
        </Tag>
    )
}

/** Splits "plain *italic* plain" into words; *starred* words set in the serif italic. */
function parseWords(text: string): { t: string; it: boolean }[] {
    const out: { t: string; it: boolean }[] = []
    String(text || "")
        .split(/(\*[^*]+\*)/)
        .forEach((seg) => {
            if (!seg) return
            const it = seg.length > 2 && seg[0] === "*" && seg[seg.length - 1] === "*"
            const body = it ? seg.slice(1, -1) : seg
            body.split(/(\s+)/).forEach((w) => {
                if (w && !/^\s+$/.test(w)) out.push({ t: w, it })
            })
        })
    return out
}

/** Headline whose words rise out of a mask one after another. Use \n for a line break. */
function Words(p: { text: string; as?: any; className?: string; delay?: number; stagger?: number; style?: React.CSSProperties; id?: string }) {
    const [ref, on] = useReveal<HTMLElement>(0.3)
    const Tag = p.as || "h2"
    const st = p.stagger ?? 0.05
    let i = 0
    const lines = String(p.text || "").split("\n")
    return (
        <Tag ref={ref} id={p.id} className={(p.className || "") + on} style={p.style}>
            {lines.map((line, li) => (
                <React.Fragment key={li}>
                    {li ? <br /> : null}
                    {parseWords(line).map((w, wi, arr) => {
                        const d = (p.delay || 0) + i++ * st
                        return (
                            <React.Fragment key={wi}>
                                <span className={"w2-w" + (w.it ? " w2-it" : "")}>
                                    <span style={cssVars({ "--d": d.toFixed(3) + "s" })}>{w.t}</span>
                                </span>
                                {wi < arr.length - 1 ? " " : null}
                            </React.Fragment>
                        )
                    })}
                </React.Fragment>
            ))}
        </Tag>
    )
}

/** "(Services) ——— 02 / 05", the running section count. */
function Label(p: { name: string; index: number; total?: number; className?: string; style?: React.CSSProperties }) {
    const pad = (n: number) => String(n).padStart(2, "0")
    return (
        <div className={"w2-lbl " + (p.className || "")} style={p.style}>
            <span>({p.name})</span>
            <i aria-hidden="true" />
            <span>
                {pad(p.index)} / {pad(p.total || 5)}
            </span>
        </div>
    )
}

/** Hover label that rolls up to a fresh copy of itself. */
function Roll(p: { children: string }) {
    return (
        <span className="w2-roll">
            <span>{p.children}</span>
            <span aria-hidden="true">{p.children}</span>
        </span>
    )
}

/** An image or video set inline in big type, opening from the middle. Empty = a colour pill with a slow shine. */
function Media(p: { src?: string; video?: string; hue?: string; width?: string; alt?: string; delay?: number }) {
    const [ref, on] = useReveal<HTMLSpanElement>(0.5)
    const still = useStill()
    return (
        <span
            ref={ref}
            className={"w2-media" + on}
            aria-hidden={p.alt ? undefined : true}
            style={cssVars({ "--mw": p.width || "1.7em", "--mc": "var(--" + (p.hue || "sky") + ")", "--d": (p.delay || 0) + "s" })}
        >
            <i>{p.video ? <video src={p.video} autoPlay={!still} muted loop playsInline /> : p.src ? <img src={p.src} alt={p.alt || ""} loading="lazy" width={320} height={150} /> : <b />}</i>
        </span>
    )
}

type Img = { src?: string; srcSet?: string; alt?: string }

type Belief = { text: string; note?: string }

type HelloProps = {
    hello: string
    weAre: string
    name: string
    side: string
    ask: string
    cta: string
    ctaHref: string
    title: string
    beliefs: Belief[]
    photo1?: Img
    photo2?: Img
    photo3?: Img
    style?: React.CSSProperties
}

const HELLO_CSS = `
.w2he-wrap{padding:clamp(72px,8cqw,128px) var(--gut) var(--m)}
.w2he-rows{display:flex;flex-direction:column}
.w2he-row{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:clamp(4px,.6cqw,10px) 0 clamp(10px,1.2cqw,18px)}
.w2he-row::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--line);transform-origin:0 50%;scale:0 1;transition:scale 1.4s var(--ease);transition-delay:var(--d,0s)}
.w2he-row.w2-in::before{scale:1 1}
.w2he-row .w2-mega{white-space:nowrap}
.w2he-hi{color:var(--red)}
.w2he-side{max-width:23ch;padding-bottom:.6em;font-size:clamp(16px,1.5cqw,24px);line-height:1.18;letter-spacing:-.025em}
.w2he-ask{display:flex;gap:var(--m);margin-top:clamp(28px,3.2cqw,52px)}
.w2he-q{flex:1;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:62px;padding:0 26px;border:1px solid var(--line2);border-radius:99px;font-size:clamp(13px,1.05cqw,16px);letter-spacing:.02em;text-transform:uppercase}
.w2he-plus{display:inline-flex;gap:10px;color:var(--red);font-size:22px;line-height:1}
.w2he-plus span{animation:w2heP 2.4s var(--ease) infinite;animation-delay:calc(var(--i) * .18s)}
@keyframes w2heP{0%,60%,100%{translate:0 0;opacity:1}30%{translate:6px 0;opacity:.35}}
.w2he-go.w2-pill{height:auto;min-height:62px;padding:0 34px;font-size:clamp(14px,1.1cqw,17px);letter-spacing:.02em;text-transform:uppercase}
.w2he-card{margin-top:var(--m);padding:clamp(28px,3.4cqw,56px) clamp(22px,3cqw,48px) clamp(20px,2cqw,30px);background:var(--red);color:var(--ink);border-radius:var(--r)}
.w2he-card .w2-h1{max-width:12ch}
.w2he-list{margin-top:clamp(34px,5cqw,90px)}
.w2he-b{position:relative;display:flex;align-items:baseline;gap:clamp(12px,1.6cqw,24px);padding:clamp(14px,1.5cqw,22px) 0;border-top:1px solid rgba(22,21,20,.28)}
.w2he-b em{font-style:normal;font-size:12px;opacity:.7;min-width:3ch}
.w2he-b p{font-size:clamp(24px,3cqw,48px);line-height:1.05;letter-spacing:-.035em}
.w2he-b small{font-size:13px;opacity:.75;letter-spacing:0}
.w2he-card .w2-lbl{margin-top:clamp(24px,3cqw,44px)}
@container (max-width:820px){.w2he-row{flex-direction:column;align-items:flex-start;gap:8px}.w2he-side{padding-bottom:0}.w2he-ask{flex-direction:column}.w2he-q{min-height:56px;padding:0 20px}.w2he-go.w2-pill{min-height:56px}}
@container (max-width:520px){.w2he-row .w2-mega{white-space:normal}.w2he-q{font-size:12px}.w2he-plus{display:none}}
`

function Row(p: { children: React.ReactNode; delay?: number; className?: string }) {
    const [ref, on] = useReveal<HTMLDivElement>(0.4)
    return (
        <div ref={ref} className={"w2he-row " + (p.className || "") + on} style={cssVars({ "--d": (p.delay || 0) + "s" })}>
            {p.children}
        </div>
    )
}

/** Big words with a picture pill tucked in; the pill opens once the words have risen. */
function BigLine(p: { text: string; photo?: Img; hue: string; width?: string; className?: string; before?: boolean; delay?: number }) {
    const [ref, on] = useReveal<HTMLParagraphElement>(0.4)
    const words = parseWords(p.text)
    const pill = <Media src={p.photo && p.photo.src} alt={p.photo && p.photo.alt} hue={p.hue} width={p.width} delay={(p.delay || 0) + 0.35} />
    return (
        <p ref={ref} className={"w2-mega " + (p.className || "") + on}>
            {p.before ? pill : null}
            {words.map((w, i) => (
                <React.Fragment key={i}>
                    {i || p.before ? " " : null}
                    <span className={"w2-w" + (w.it ? " w2-it" : "")}>
                        <span style={cssVars({ "--d": ((p.delay || 0) + i * 0.07).toFixed(3) + "s" })}>{w.t}</span>
                    </span>
                </React.Fragment>
            ))}
            {p.before ? null : <> {pill}</>}
        </p>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Hello(props: HelloProps) {
    const {
        hello = "Hello!",
        weAre = "We are",
        name = "world media.",
        side = "A creator-first media agency from India. We work wherever your audience scrolls.",
        ask = "Want to talk about your brand right away?",
        cta = "Let’s talk",
        ctaHref = "#contact",
        title = "We believe in three things:",
        beliefs = [
            { text: "People skip ads, not people.", note: "" },
            { text: "Trust beats reach.", note: "(every single time)" },
            { text: "If it didn’t move the numbers, it didn’t work.", note: "" },
        ],
        photo1,
        photo2,
        photo3,
        style,
    } = props

    const go = () => {
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("w2:form", { detail: "brand" }))
    }

    return (
        <Section tone="paper" id="hello" className="w2he" css={HELLO_CSS} label="Hello" style={style}>
            <div className="w2he-wrap">
                <div className="w2he-rows">
                    <Row>
                        <BigLine text={hello} className="w2he-hi" photo={photo1} hue="sky" width="1.9em" />
                    </Row>
                    <Row delay={0.1}>
                        <BigLine text={weAre} photo={photo2} hue="lime" width="1.3em" delay={0.08} />
                        <Reveal as="p" className="w2he-side w2-rise" delay={0.45}>
                            {side}
                        </Reveal>
                    </Row>
                    <Row delay={0.2}>
                        <BigLine text={name} photo={photo3} hue="lilac" width="1.15em" before delay={0.14} />
                    </Row>
                </div>
                <Reveal className="w2he-ask w2-rise" amount={0.5}>
                    <a className="w2he-q" href={ctaHref} onClick={go}>
                        <span>{ask}</span>
                        <span className="w2he-plus" aria-hidden="true">
                            {[0, 1, 2].map((i) => (
                                <span key={i} style={cssVars({ "--i": i })}>
                                    +
                                </span>
                            ))}
                        </span>
                    </a>
                    <a className="w2-pill w2he-go" data-hue="red" href={ctaHref} onClick={go}>
                        <Roll>{cta}</Roll>
                    </a>
                </Reveal>
                <div className="w2he-card">
                    <Words as="h2" className="w2-h1" text={title} stagger={0.06} />
                    <ol className="w2he-list">
                        {beliefs.map((b, i) => (
                            <Reveal as="li" key={i} className="w2he-b w2-rise" delay={i * 0.12} amount={0.6}>
                                <em>({String(i + 1).padStart(2, "0")})</em>
                                <p>
                                    {b.text} {b.note ? <small>{b.note}</small> : null}
                                </p>
                            </Reveal>
                        ))}
                    </ol>
                    <Label name="Hello" index={1} />
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2Hello, {
    hello: { type: ControlType.String, title: "Line 1", defaultValue: "Hello!" },
    weAre: { type: ControlType.String, title: "Line 2", defaultValue: "We are" },
    name: { type: ControlType.String, title: "Line 3", defaultValue: "world media." },
    side: { type: ControlType.String, title: "Side note", defaultValue: "A creator-first media agency from India. We work wherever your audience scrolls.", displayTextArea: true },
    photo1: { type: ControlType.ResponsiveImage, title: "Photo 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Photo 2" },
    photo3: { type: ControlType.ResponsiveImage, title: "Photo 3" },
    ask: { type: ControlType.String, title: "Question", defaultValue: "Want to talk about your brand right away?" },
    cta: { type: ControlType.String, title: "Button", defaultValue: "Let’s talk" },
    ctaHref: { type: ControlType.String, title: "Button link", defaultValue: "#contact" },
    title: { type: ControlType.String, title: "Card title", defaultValue: "We believe in three things:" },
    beliefs: {
        type: ControlType.Array,
        title: "Beliefs",
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Belief" },
                note: { type: ControlType.String, title: "Aside" },
            },
        },
        defaultValue: [
            { text: "People skip ads, not people.", note: "" },
            { text: "Trust beats reach.", note: "(every single time)" },
            { text: "If it didn’t move the numbers, it didn’t work.", note: "" },
        ],
    },
})
