// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Projects, navigated the way another.gr/projects does it. Each project is a full
// screen of its own colour that slides up over the one before; its name runs across the
// screen in huge type behind a centred picture, with the services and year underneath.
// Which projects to show will be agreed with the client, so the four here are placeholders
// with sample photos: add a picture or a video to each one in the Projects list.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion"

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

/** Sample photos and the globe video, kept in the site's GitHub repo and served by jsDelivr, pinned to one commit. */
const SAMPLE = "https://cdn.jsdelivr.net/gh/tandonsaksham/tandonsaksham.github.io@16cfefc4bae4bbd2c69898b7d689135c895bf250/framer/world-media-v2/placeholders/"

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

type Project = {
    name: string
    services: string
    year: string
    hue: "red" | "lime" | "sky" | "lilac" | "ink"
    image?: { src?: string; srcSet?: string; alt?: string }
    video?: string
}

type ProjectsProps = {
    title: string
    intro: string
    projects: Project[]
    samples: boolean
    style?: React.CSSProperties
}

const PROJ_CSS = `
.w2p{--bgc:var(--ink)}
.w2p-intro{position:relative;min-height:88vh;min-height:88svh;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(76px,7cqw,110px) var(--gut) clamp(28px,3cqw,48px);isolation:isolate}
.w2p-orb{position:absolute;z-index:-1;border-radius:50%;filter:blur(70px);opacity:.55;animation:w2pOrb 16s ease-in-out infinite alternate}
@keyframes w2pOrb{to{translate:6% -8%;scale:1.15}}
.w2p-intro .w2-lbl{color:var(--mut)}
.w2p-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.w2p-blurb{max-width:30ch;font-size:clamp(16px,1.45cqw,22px);line-height:1.25;letter-spacing:-.02em;color:var(--mut)}
.w2p-blurb b{font-weight:500;color:var(--paper)}
.w2p-count{font-size:clamp(16px,1.45cqw,22px);color:var(--mut)}
.w2p-stack{position:relative}
.w2p-panel{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:var(--pbg);color:var(--pfg);isolation:isolate}
.w2p-panel[data-hue="red"]{--pbg:var(--red);--pfg:var(--ink);--pcard:#D9431D}
.w2p-panel[data-hue="lime"]{--pbg:var(--lime);--pfg:var(--ink);--pcard:#C2EA22}
.w2p-panel[data-hue="sky"]{--pbg:var(--sky);--pfg:var(--ink);--pcard:#6CCBF6}
.w2p-panel[data-hue="lilac"]{--pbg:var(--lilac);--pfg:var(--ink);--pcard:#B7A0FB}
.w2p-panel[data-hue="ink"]{--pbg:#1E1C1A;--pfg:var(--paper);--pcard:#2E2B27}
.w2p-blur{position:absolute;inset:-8%;z-index:-2;background-size:cover;background-position:center;filter:blur(38px);opacity:.6;scale:1.1;mix-blend-mode:luminosity}
.w2p-grain{position:absolute;inset:0;z-index:-1;opacity:.14;mix-blend-mode:multiply;pointer-events:none;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
.w2p-grid{position:absolute;inset:0;z-index:-1;display:grid;grid-template-columns:1fr 1fr 1fr;pointer-events:none}
.w2p-grid i{border-right:1px solid currentColor;opacity:.12}
.w2p-grid i:last-child{border:0}
.w2p-in{position:absolute;inset:0}
.w2p-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;padding:clamp(76px,6.4cqw,96px) var(--gut) 0;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.w2p-mq{position:absolute;left:0;right:0;top:50%;translate:0 -52%;overflow:hidden;white-space:nowrap;pointer-events:none}
.w2p-mq-t{display:inline-flex;animation:w2pMq var(--dur,26s) linear infinite;animation-direction:var(--dir,normal)}
.w2p-panel:not(.live) .w2p-mq-t{animation-play-state:paused}
.w2p-mq-t span{padding-right:.35em;font-size:clamp(64px,11.6cqw,190px);line-height:1;letter-spacing:-.05em;text-transform:uppercase;font-weight:600}
@keyframes w2pMq{to{translate:-50% 0}}
.w2p-card{position:absolute;left:50%;top:50%;width:clamp(260px,44cqw,760px);aspect-ratio:16/10;translate:-50% -54%;border-radius:clamp(10px,1cqw,16px);overflow:hidden;
background:var(--pcard);box-shadow:0 40px 80px -40px rgba(22,21,20,.55)}
.w2p-card img,.w2p-card video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2p-ph{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:space-between;padding:16px 18px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;
background:repeating-linear-gradient(135deg,transparent 0 22px,rgba(255,255,255,.07) 22px 23px)}
.w2p-ph b{font-weight:500;opacity:.7}
.w2p-meta{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:0 var(--gut) clamp(26px,3.2cqw,46px);font-size:12px;letter-spacing:.04em;text-transform:uppercase;line-height:1.5}
.w2p-meta span:nth-child(2){padding-left:4px}
.w2p-meta span:last-child{text-align:right}
.w2p-veil{position:absolute;inset:0;background:#000;pointer-events:none}
@container (max-width:760px){
.w2p-card{width:calc(100% - 2 * var(--gut));aspect-ratio:4/3;translate:-50% -50%}
.w2p-mq{top:27%}
.w2p-mq-t span{font-size:clamp(58px,19cqw,120px)}
.w2p-meta{grid-template-columns:1fr 1fr;row-gap:4px}
.w2p-meta span:nth-child(2){grid-column:1/-1;order:3;padding:0}
.w2p-grid{grid-template-columns:1fr 1fr}.w2p-grid i:nth-child(3){display:none}}
@media (prefers-reduced-motion:reduce){.w2p-mq-t{animation:none}.w2p-orb{animation:none}}
`

type Pic = { src?: string; srcSet?: string; alt?: string; sample?: boolean }

function Panel(p: { item: Project; img?: Pic; index: number; total: number; nextRef?: React.RefObject<HTMLElement>; selfRef: React.RefObject<HTMLElement>; still: boolean }) {
    const { item, index, img } = p
    const [live, setLive] = React.useState(false)
    // The panels' refs live in the parent, so measure after layout rather than during it.
    const { scrollYProgress: enter } = useScroll({ target: p.selfRef, offset: ["start end", "start start"], layoutEffect: false })
    const { scrollYProgress: cover } = useScroll({ target: p.nextRef || p.selfRef, offset: ["start end", "start start"], layoutEffect: false })
    const cardScale = useTransform(enter, [0, 1], [0.78, 1])
    const cardY = useTransform(enter, [0, 1], [90, 0])
    const innerScale = useTransform(cover, [0, 1], [1, p.nextRef ? 0.9 : 1])
    const veil = useTransform(cover, [0, 1], [0, p.nextRef ? 0.45 : 0])
    const vref = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
        const el = p.selfRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const io = new IntersectionObserver(([e]) => {
            setLive(e.isIntersecting)
            const v = vref.current
            if (v) {
                if (e.isIntersecting && !p.still) v.play().catch(() => {})
                else v.pause()
            }
        })
        io.observe(el)
        return () => io.disconnect()
    }, [p.still])

    const nm = item.name || "Project"
    const pad = (n: number) => String(n).padStart(2, "0")
    const reps = [0, 1, 2, 3]
    const dur = Math.max(18, nm.length * 2.4)
    return (
        <article
            ref={p.selfRef as React.RefObject<HTMLElement>}
            className={"w2p-panel" + (live ? " live" : "")}
            data-hue={item.hue || "red"}
            aria-label={nm + (item.year ? ", " + item.year : "")}
            style={{ zIndex: index + 1 }}
        >
            {img && img.src ? <div className="w2p-blur" style={{ backgroundImage: "url(" + img.src + ")" }} /> : null}
            <div className="w2p-grain" />
            <motion.div className="w2p-in" style={p.still ? undefined : { scale: innerScale }}>
                <div className="w2p-grid" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
                <div className="w2p-top">
                    <span>({pad(index + 1)})</span>
                    <span>
                        {pad(index + 1)} / {pad(p.total)}
                    </span>
                </div>
                <div className="w2p-mq" aria-hidden="true">
                    <div className="w2p-mq-t" style={cssVars({ "--dur": dur + "s", "--dir": index % 2 ? "reverse" : "normal" })}>
                        {reps.map((k) => (
                            <span key={k}>{nm}</span>
                        ))}
                        {reps.map((k) => (
                            <span key={"b" + k}>{nm}</span>
                        ))}
                    </div>
                </div>
                <motion.div className="w2p-card" style={p.still ? undefined : { scale: cardScale, y: cardY }}>
                    {item.video ? (
                        <video ref={vref} src={item.video} muted loop playsInline preload="metadata" poster={img && img.src} />
                    ) : img && img.src ? (
                        <img src={img.src} srcSet={img.srcSet} alt={img.sample ? "" : img.alt || nm} loading="lazy" width={1600} height={1000} />
                    ) : (
                        <div className="w2p-ph">
                            <b>{nm}</b>
                            <b>Picture or film</b>
                        </div>
                    )}
                </motion.div>
                <div className="w2p-meta">
                    <span>{nm}</span>
                    <span>{item.services}</span>
                    <span>{item.year}</span>
                </div>
            </motion.div>
            {p.still ? null : <motion.div className="w2p-veil" style={{ opacity: veil }} aria-hidden="true" />}
        </article>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Projects(props: ProjectsProps) {
    const {
        title = "Projects.",
        intro = "A few of the stories we’ve told. *The rest are better over a call.*",
        projects = [
            { name: "Brand One", services: "Influencer marketing · Video production", year: "2026", hue: "red" as const },
            { name: "Brand Two", services: "Celebrity marketing · Content", year: "2025", hue: "lime" as const },
            { name: "Brand Three", services: "Creator-led ads · Live reporting", year: "2025", hue: "sky" as const },
            { name: "Brand Four", services: "Talent management · Content writing", year: "2024", hue: "lilac" as const },
        ],
        samples = true,
        style,
    } = props
    const still = useStill()
    const refs = React.useMemo(() => projects.map(() => React.createRef<HTMLElement>()), [projects.length])
    const pad = (n: number) => String(n).padStart(2, "0")
    const parts = String(intro).split(/\*([^*]+)\*/)

    return (
        <Section tone="ink" id="projects" className="w2p" css={PROJ_CSS} label="Projects" style={style}>
            <div className="w2p-intro">
                <span className="w2p-orb" style={{ width: "46vw", height: "46vw", left: "-12vw", top: "-14vw", background: "var(--red)" }} aria-hidden="true" />
                <span className="w2p-orb" style={{ width: "34vw", height: "34vw", right: "-8vw", bottom: "-10vw", background: "var(--lilac)", animationDelay: "-6s" }} aria-hidden="true" />
                <Label name="Projects" index={3} />
                <div className="w2p-head">
                    <Words as="h2" className="w2-mega" text={title} stagger={0.08} />
                    <Reveal className="w2-rise" delay={0.3}>
                        <p className="w2p-blurb">
                            {parts.map((t, i) => (i % 2 ? <b key={i}>{t}</b> : <React.Fragment key={i}>{t}</React.Fragment>))}
                        </p>
                        <p className="w2p-count">({pad(projects.length)})</p>
                    </Reveal>
                </div>
            </div>
            <div className="w2p-stack">
                {projects.map((item, i) => (
                    <Panel
                        key={i}
                        item={item}
                        img={item.image && item.image.src ? item.image : samples && i < 4 ? { src: SAMPLE + "project-" + (i + 1) + ".jpg", sample: true } : undefined}
                        index={i}
                        total={projects.length}
                        selfRef={refs[i]}
                        nextRef={refs[i + 1]}
                        still={still}
                    />
                ))}
            </div>
        </Section>
    )
}

addPropertyControls(W2Projects, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Projects." },
    intro: {
        type: ControlType.String,
        title: "Intro",
        defaultValue: "A few of the stories we’ve told. *The rest are better over a call.*",
        displayTextArea: true,
        description: "Words between *stars* are set brighter.",
    },
    projects: {
        type: ControlType.Array,
        title: "Projects",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name" },
                services: { type: ControlType.String, title: "Services" },
                year: { type: ControlType.String, title: "Year" },
                hue: {
                    type: ControlType.Enum,
                    title: "Colour",
                    options: ["red", "lime", "sky", "lilac", "ink"],
                    optionTitles: ["Red", "Lime", "Sky", "Lilac", "Ink"],
                },
                image: { type: ControlType.ResponsiveImage, title: "Picture" },
                video: { type: ControlType.File, title: "Film", allowedFileTypes: ["mp4", "webm", "mov"] },
            },
        },
        defaultValue: [
            { name: "Brand One", services: "Influencer marketing · Video production", year: "2026", hue: "red" },
            { name: "Brand Two", services: "Celebrity marketing · Content", year: "2025", hue: "lime" },
            { name: "Brand Three", services: "Creator-led ads · Live reporting", year: "2025", hue: "sky" },
            { name: "Brand Four", services: "Talent management · Content writing", year: "2024", hue: "lilac" },
        ],
    },
    samples: {
        type: ControlType.Boolean,
        title: "Sample photos",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Give the first four projects a sample photo until you add your own.",
    },
})
