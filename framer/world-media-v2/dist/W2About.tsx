// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: About. Why World Media exists, in one big paragraph that fills in word by word
// as you read down (with two small pictures set into the text), then how a campaign runs in
// five steps, and a progress bar that marks where you are on the page.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"

/* ───────────────────────── WORLD MEDIA · ONE-PAGE SYSTEM ─────────────────────────
   Shared tokens and helpers for the single-page World Media site. Framer code components
   must each be one self-contained file, so every section carries its own copy of what it
   uses. The rules live in @layer w2-base, so a section's own CSS always wins, and every
   class starts with w2- so this page never collides with the first site's components.
   Reveals animate opacity and the translate property only; transform stays free.
   Colours follow the deck: white first, black second, one orange-red accent.
   white #FFFFFF · grey #F3F3F3 · black #0A0A0A · orange-red #EA5628
   Inter Tight (text and big type) · Instrument Serif italic (the odd word, for warmth)
   ─────────────────────────────────────────────────────────────────────────────── */

type Tone = "paper" | "ink"

const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&display=swap"

/** Sample photos and the globe video, kept in the site's GitHub repo and served by jsDelivr, pinned to one commit. */
const SAMPLE = "https://cdn.jsdelivr.net/gh/tandonsaksham/tandonsaksham.github.io@16cfefc4bae4bbd2c69898b7d689135c895bf250/framer/world-media-v2/placeholders/"

const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties

const BASE_CSS = `
@layer w2-base{
.w2{--paper:#FFFFFF;--paper2:#F3F3F3;--ink:#0A0A0A;--ink2:#1C1C1C;--red:#EA5628;
--ease:cubic-bezier(.16,1,.3,1);--ease-io:cubic-bezier(.7,0,.2,1);--r:clamp(18px,2.1cqw,30px);--m:clamp(8px,.9cqw,14px);--gut:clamp(18px,3.4cqw,52px);
position:relative;box-sizing:border-box;width:100%;container-type:inline-size;overflow:hidden;overflow:clip;
font-family:"Inter Tight","Helvetica Neue",Helvetica,Arial,sans-serif;font-weight:500;letter-spacing:-.012em;
-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
background:var(--bg);color:var(--fg)}
.w2[data-tone="paper"]{--bg:var(--paper);--fg:var(--ink);--mut:rgba(10,10,10,.62);--line:rgba(10,10,10,.12);--line2:rgba(10,10,10,.38)}
.w2[data-tone="ink"]{--bg:var(--ink);--fg:var(--paper);--mut:rgba(255,255,255,.58);--line:rgba(255,255,255,.16);--line2:rgba(255,255,255,.4)}
.w2 *,.w2 *::before,.w2 *::after{box-sizing:border-box}
.w2 :where(h1,h2,h3,h4,p,ul,ol,li,figure,blockquote){margin:0;padding:0;list-style:none}
.w2 :where(a){color:inherit;text-decoration:none}
.w2 :where(button){font:inherit;color:inherit;margin:0}
.w2 :where(a,button){touch-action:manipulation}
.w2 :where(.w2-mega,.w2-h1,.w2-h2,.w2-big,.w2-h3){text-wrap:balance}
.w2 ::selection{background:var(--red);color:var(--ink)}
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
.w2-pill[data-hue="ink"]{--pc:var(--ink);--pt:var(--paper)}
.w2-pill[data-hue="paper"],.w2-pill[data-hue="lime"],.w2-pill[data-hue="sky"],.w2-pill[data-hue="lilac"]{--pc:var(--paper);--pt:var(--ink);box-shadow:inset 0 0 0 1px var(--line2)}
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
.w2-media>i{position:absolute;inset:0;border-radius:99px;overflow:hidden;background:var(--mc,var(--paper2));
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

const NOJS_CSS = `.w2-w>span,.w2-rise,.w2-fade{translate:none!important;opacity:1!important}.w2-media>i{clip-path:none!important}.w2i{display:none!important}`

const noSub = () => () => {}

/**
 * True on Framer's canvas and for visitors who prefer reduced motion. The reduced-motion half
 * only applies once the page has hydrated, so the first client render matches the server HTML;
 * until then the prefers-reduced-motion CSS keeps everything still.
 */
function useStill(): boolean {
    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const client = React.useSyncExternalStore(noSub, () => true, () => false)
    return isStatic || (client && !!reduce)
}

function Base() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            {/* Raw CSS: as text, React's server render would escape the quotes and break it before hydration. */}
            <style dangerouslySetInnerHTML={{ __html: BASE_CSS }} />
            <noscript dangerouslySetInnerHTML={{ __html: "<style>" + NOJS_CSS + "</style>" }} />
        </>
    )
}

/** A section shell: tone, anchor id and the section's own CSS. */
function Section(p: { tone?: Tone; id?: string; className?: string; css?: string; label?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
    return (
        <section className={"w2 " + (p.className || "")} data-tone={p.tone || "paper"} id={p.id || undefined} aria-label={p.label} style={p.style}>
            <Base />
            {p.css ? <style dangerouslySetInnerHTML={{ __html: p.css }} /> : null}
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

/** An image or video set inline in big type, opening from the middle. Empty = a colour pill with a slow shine. */
function Media(p: { src?: string; video?: string; hue?: string; width?: string; alt?: string; delay?: number }) {
    const [ref, on] = useReveal<HTMLSpanElement>(0.5)
    const still = useStill()
    return (
        <span
            ref={ref}
            className={"w2-media" + on}
            aria-hidden={p.alt ? undefined : true}
            style={cssVars({ "--mw": p.width || "1.7em", "--mc": "var(--" + (p.hue || "paper2") + ")", "--d": (p.delay || 0) + "s" })}
        >
            <i>{p.video ? <video src={p.video} autoPlay={!still} muted loop playsInline /> : p.src ? <img src={p.src} alt={p.alt || ""} loading="lazy" width={320} height={150} /> : <b />}</i>
        </span>
    )
}

type Step = { title: string; body: string }

type AboutProps = {
    text: string
    steps: Step[]
    stepsTitle: string
    photo1?: { src?: string; srcSet?: string; alt?: string }
    photo2?: { src?: string; srcSet?: string; alt?: string }
    samples: boolean
    style?: React.CSSProperties
}

const ABOUT_CSS = `
.w2a-wrap{padding:clamp(72px,8cqw,128px) var(--gut) var(--m)}
.w2a-wrap>.w2-lbl{color:var(--mut)}
.w2a-text{margin-top:clamp(34px,4.4cqw,72px);max-width:22em;font-size:clamp(28px,3.5cqw,58px);line-height:1.12;letter-spacing:-.04em}
.w2a-text .tw{opacity:clamp(.18,calc(var(--p,0) - var(--i)),1);transition:opacity .25s linear}
.w2a-text .w2-it{font-size:1.06em}
.w2a-text .w2-media{height:.8em;vertical-align:-.08em}
.w2a-steps{margin-top:clamp(56px,7cqw,120px)}
.w2a-steps h3{font-size:clamp(20px,1.7cqw,26px);letter-spacing:-.02em;text-transform:uppercase}
.w2a-row{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--m);margin-top:clamp(18px,2cqw,28px)}
.w2a-step{position:relative;display:flex;flex-direction:column;gap:10px;min-height:clamp(190px,17cqw,250px);padding:clamp(18px,1.7cqw,26px);border-radius:var(--r);background:var(--paper2);
transition:background-color .5s var(--ease),translate .5s var(--ease)}
.w2a-step:hover{background:var(--red);translate:0 -4px}
.w2a-step em{font-style:normal;font-size:12px;color:var(--mut)}
.w2a-step b{margin-top:auto;font-size:clamp(22px,2cqw,30px);font-weight:500;letter-spacing:-.035em}
.w2a-step p{font-size:14.5px;line-height:1.42;font-weight:400;color:rgba(10,10,10,.72)}
.w2a-bar{display:flex;align-items:center;gap:18px;margin-top:var(--m);height:58px;padding:0 24px;border:1px solid var(--line2);border-radius:99px;font-size:12px}
.w2a-track{position:relative;flex:1;height:4px;border-radius:4px;background:var(--line);overflow:hidden}
.w2a-fill{position:absolute;inset:0;background:var(--red);border-radius:4px;transform-origin:0 50%}
@container (max-width:1000px){.w2a-row{grid-template-columns:repeat(2,1fr)}.w2a-step:last-child{grid-column:1/-1}}
@container (max-width:560px){.w2a-row{grid-template-columns:1fr}.w2a-step{min-height:0}.w2a-step b{margin-top:6px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2About(props: AboutProps) {
    const {
        text = "We started World Media to fix one thing: brands renting attention instead of earning trust. [1] So we treat creators as partners, cast for trust over reach, and prove every campaign in numbers *your business actually cares about.* [2]",
        stepsTitle = "How a campaign runs",
        steps = [
            { title: "Listen", body: "We start with your business goal and your audience’s feed." },
            { title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { title: "Amplify", body: "The best posts get paid reach, whitelisting and cross-posting." },
            { title: "Measure", body: "A live dashboard, then a straight read on what worked." },
        ],
        photo1,
        photo2,
        samples = true,
        style,
    } = props
    const still = useStill()
    const pref = React.useRef<HTMLParagraphElement>(null)
    const sref = React.useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: pref, offset: ["start 0.82", "end 0.42"] })
    const { scrollYProgress: whole } = useScroll({ target: sref, offset: ["start end", "end end"] })
    const fill = useTransform(whole, [0, 1], [0.04, 1])

    // Split into words and picture slots: [1] and [2] mark where the pictures go.
    const tokens: { t: string; it: boolean; media?: number }[] = []
    String(text || "")
        .split(/(\[\d\])/)
        .forEach((seg) => {
            const m = /^\[(\d)\]$/.exec(seg)
            if (m) tokens.push({ t: "", it: false, media: +m[1] })
            else parseWords(seg).forEach((w) => tokens.push(w))
        })
    const count = tokens.filter((t) => !t.media).length

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const el = pref.current
        if (el) el.style.setProperty("--p", (v * (count + 2)).toFixed(2))
    })
    React.useEffect(() => {
        const el = pref.current
        if (el) el.style.setProperty("--p", still ? String(count + 2) : (scrollYProgress.get() * (count + 2)).toFixed(2))
    }, [still, count])

    let wi = 0
    // An empty slot shows a sample photo, unless samples are switched off.
    const photos = [photo1, photo2].map((ph, i) => (ph && ph.src ? ph : samples ? { src: SAMPLE + "about-" + (i + 1) + ".jpg", alt: "" } : undefined))
    const hues = ["paper2", "paper2"]
    return (
        <Section tone="paper" id="about" className="w2a" css={ABOUT_CSS} label="About" style={style}>
            <div className="w2a-wrap" ref={sref as React.RefObject<HTMLDivElement>}>
                <Label name="About" index={4} />
                <h2 className="w2-sr">About World Media</h2>
                <p ref={pref} className="w2a-text">
                    {tokens.map((tk, i) => {
                        if (tk.media) {
                            const ph = photos[tk.media - 1]
                            return (
                                <React.Fragment key={i}>
                                    {" "}
                                    <Media src={ph && ph.src} alt={ph && ph.alt} hue={hues[(tk.media - 1) % 2]} width="1.5em" />
                                </React.Fragment>
                            )
                        }
                        const idx = wi++
                        return (
                            <React.Fragment key={i}>
                                {i ? " " : null}
                                <span className={"tw" + (tk.it ? " w2-it" : "")} style={cssVars({ "--i": idx })}>
                                    {tk.t}
                                </span>
                            </React.Fragment>
                        )
                    })}
                </p>
                <div className="w2a-steps">
                    <Reveal as="h3" className="w2-rise">
                        {stepsTitle}
                    </Reveal>
                    <ol className="w2a-row">
                        {steps.map((s, i) => (
                            <Reveal as="li" key={i} className="w2a-step w2-rise" delay={i * 0.08}>
                                <em>({String(i + 1).padStart(2, "0")})</em>
                                <b>{s.title}</b>
                                <p>{s.body}</p>
                            </Reveal>
                        ))}
                    </ol>
                </div>
                <div className="w2a-bar">
                    <span>(About)</span>
                    <span className="w2a-track" aria-hidden="true">
                        <motion.span className="w2a-fill" style={still ? undefined : { scaleX: fill }} />
                    </span>
                    <span>04 / 05</span>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2About, {
    text: {
        type: ControlType.String,
        title: "Paragraph",
        displayTextArea: true,
        defaultValue:
            "We started World Media to fix one thing: brands renting attention instead of earning trust. [1] So we treat creators as partners, cast for trust over reach, and prove every campaign in numbers *your business actually cares about.* [2]",
        description: "[1] and [2] mark the two pictures. Words between *stars* are set in italic.",
    },
    photo1: { type: ControlType.ResponsiveImage, title: "Picture 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Picture 2" },
    samples: {
        type: ControlType.Boolean,
        title: "Sample photos",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Fill empty picture slots until you add your own.",
    },
    stepsTitle: { type: ControlType.String, title: "Steps title", defaultValue: "How a campaign runs" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { title: "Listen", body: "We start with your business goal and your audience’s feed." },
            { title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { title: "Amplify", body: "The best posts get paid reach, whitelisting and cross-posting." },
            { title: "Measure", body: "A live dashboard, then a straight read on what worked." },
        ],
    },
})
