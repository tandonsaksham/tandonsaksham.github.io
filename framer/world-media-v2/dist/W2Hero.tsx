// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the landing. First a loading screen: a big wireframe globe spinning with three
// coloured satellites, a bar and a counter that run to 100 while the page and the video load.
// Then the globe video in a rounded frame, with the World Media name set over it, one line
// about World Media and the time in Delhi. Until the real video is added in the Video field,
// a sample plays: NASA's spinning Earth, sitting exactly where the loading globe was.

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

type HeroProps = {
    video: string
    poster?: { src?: string; srcSet?: string; alt?: string }
    samples: boolean
    nameOver: boolean
    wordmark: string
    statement: string
    location: string
    timeZone: string
    zone: string
    intro: boolean
    introNote: string
    style?: React.CSSProperties
}

/* The loading globe and the sample video globe share one geometry, so the wireframe fades
   straight into the real Earth: card = screen minus the margin, video box = the smaller of
   76% of the card height and 88% of its width, centred 48% down the card. The NASA globe
   fills 88.2% of its square frame; the loader's planet fills 200/260 of its SVG. */
const HERO_CSS = `
@property --w2p{syntax:"<number>";inherits:true;initial-value:0}
@property --w2n{syntax:"<integer>";inherits:true;initial-value:0}
.w2h{padding:var(--m);height:100vh;height:100svh;min-height:560px}
.w2h-card{position:relative;height:100%;border-radius:var(--r);overflow:hidden;background:#0C0C0B;isolation:isolate}
.w2h-card.smp{background:#000}
.w2h-stage{position:absolute;inset:0;scale:1.08;transition:scale 2.4s var(--ease)}
.w2h.on .w2h-stage,.w2h.ld .w2h-stage{scale:1}
.w2h-stage video,.w2h-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2h-stage .w2h-smp{inset:auto;left:50%;top:48%;width:auto;height:min(76%,calc(.88 * (100cqw - 2 * var(--m))));aspect-ratio:1;translate:-50% -50%;object-fit:contain}
.w2h-glow{position:absolute;inset:0;background:radial-gradient(60% 55% at 50% 46%,rgba(139,220,255,.16),rgba(201,182,255,.06) 45%,transparent 70%)}
.w2h-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
.w2h-mark{position:absolute;left:0;right:0;top:50%;translate:0 -54%;text-align:center;color:var(--paper);mix-blend-mode:difference;pointer-events:none;
font-size:clamp(54px,12.4cqw,210px);line-height:.9;letter-spacing:-.06em;font-weight:500;white-space:nowrap}
.w2h-mark .l{display:inline-block;opacity:0;translate:0 .5em;filter:blur(8px);transition:opacity .9s var(--ease),translate 1.1s var(--ease),filter .9s var(--ease);transition-delay:var(--d)}
.w2h.on .w2h-mark .l{opacity:1;translate:0 0;filter:none}
.w2h-mark .dot{color:var(--red)}
.w2h-shade{position:absolute;inset:auto 0 0 0;height:46%;background:linear-gradient(to top,rgba(12,12,11,.72),transparent);pointer-events:none}
.w2h-ui{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:clamp(18px,2.4cqw,36px);color:var(--paper)}
.w2h-say{max-width:24ch;font-size:clamp(19px,1.9cqw,30px);line-height:1.12;letter-spacing:-.03em}
.w2h-say .w2-it{font-size:1.08em}
.w2h-meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right}
.w2h-where{display:flex;align-items:center;gap:8px;font-size:13px;letter-spacing:.01em;opacity:0;transition:opacity 1s var(--ease) .9s}
.w2h.on .w2h-where{opacity:1}
.w2h-where i{width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 4px rgba(217,255,63,.18)}
.w2h-where b{font-weight:500;font-variant-numeric:tabular-nums;color:rgba(255,248,241,.6)}
.w2h-snd{pointer-events:auto}
.w2h-btns{display:flex;gap:6px}
.w2h-pause.w2-pill{width:38px;padding:0}
.w2h-hint{position:absolute;top:18px;left:50%;translate:-50% 0;padding:6px 12px;border-radius:99px;background:rgba(255,248,241,.12);color:var(--paper);font-size:12px;letter-spacing:.02em;white-space:nowrap}
@container (max-width:640px){.w2h-ui{flex-direction:column;align-items:flex-start}.w2h-meta{align-items:flex-start;text-align:left}.w2h-mark{top:44%}}
.w2i.w2{position:fixed;inset:0 0 auto 0;height:100vh;height:100svh;z-index:2147483400;background:var(--ink);color:var(--paper);overflow:hidden;
animation:w2iLoad 7s cubic-bezier(.1,.6,.2,1) both,w2iBail .6s 9s both;transition:background-color 1.1s var(--ease-io)}
.w2i.js{animation:none}
.w2i.out{background-color:transparent;pointer-events:none}
@keyframes w2iLoad{from{--w2p:0;--w2n:0}to{--w2p:.94;--w2n:94}}
@keyframes w2iBail{to{opacity:0;visibility:hidden}}
.w2i-top{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(18px,2.4cqw,36px) var(--gut);font-size:13px;letter-spacing:.01em;color:rgba(255,248,241,.6)}
.w2i-name{font-size:clamp(17px,1.5cqw,22px);letter-spacing:-.04em;color:var(--paper)}
.w2i-name span{opacity:clamp(.16,calc((var(--w2p) * var(--n) * 1.12 - var(--i)) * .8),1)}
.w2i-globe{position:absolute;left:50%;--H:calc(max(100svh,560px) - 2 * var(--m));top:calc(var(--m) + .48 * var(--H));
width:calc(min(.76 * var(--H),.88 * (100cqw - 2 * var(--m))) * 1.1471);aspect-ratio:1;translate:-50% -50%;
transition:opacity 1.1s var(--ease-io) .05s,scale 1.6s var(--ease)}
.w2i-globe svg{display:block;width:100%;height:100%;overflow:visible}
.w2i-glow{fill:url(#w2iGl)}
.w2i-disc{fill:url(#w2iG)}
.w2i-rim{fill:none;stroke:rgba(255,248,241,.86);stroke-width:1.4px;vector-effect:non-scaling-stroke}
.w2i-lat{fill:none;stroke:rgba(255,248,241,.42);stroke-width:2.2px;stroke-linecap:round;stroke-dasharray:0 8px;vector-effect:non-scaling-stroke}
.w2i-m{fill:none;stroke:var(--lime);stroke-width:2.6px;stroke-linecap:round;stroke-dasharray:0 9px;vector-effect:non-scaling-stroke;
transform-box:fill-box;transform-origin:50% 50%;animation:w2iMer 8s linear infinite;animation-delay:var(--gd)}
.w2i-orb{fill:none;stroke:rgba(255,248,241,.12);stroke-width:1px;vector-effect:non-scaling-stroke}
.w2i-orb.f{stroke:rgba(255,248,241,.3)}
.w2i-sx{animation:w2iSx var(--t) infinite;animation-delay:var(--lag)}
.w2i-sy{animation:w2iSy var(--t) infinite;animation-delay:var(--lag)}
@keyframes w2iSx{0%,100%{translate:var(--a) 0;animation-timing-function:cubic-bezier(.37,0,.63,1)}50%{translate:calc(var(--a) * -1) 0;animation-timing-function:cubic-bezier(.37,0,.63,1)}}
@keyframes w2iSy{0%,100%{translate:0 var(--a);animation-timing-function:cubic-bezier(.37,0,.63,1)}50%{translate:0 calc(var(--a) * -1);animation-timing-function:cubic-bezier(.37,0,.63,1)}}
@keyframes w2iMer{0%{transform:scaleX(1);animation-timing-function:cubic-bezier(.12,0,.39,0)}25%{transform:scaleX(0);animation-timing-function:cubic-bezier(.61,1,.88,1)}
50%{transform:scaleX(-1);animation-timing-function:cubic-bezier(.12,0,.39,0)}75%{transform:scaleX(0);animation-timing-function:cubic-bezier(.61,1,.88,1)}100%{transform:scaleX(1)}}
.w2i-foot{position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(18px,2.4cqw,36px)}
.w2i-row{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:clamp(12px,1.3cqw,18px)}
.w2i-note{padding-bottom:.4em;font-size:13px;letter-spacing:.01em;color:rgba(255,248,241,.6)}
.w2i-num{font-size:clamp(64px,8.6cqw,144px);line-height:.78;letter-spacing:-.02em;white-space:nowrap}
.w2i-num::before{counter-reset:w2n var(--w2n);content:counter(w2n)}
.w2i-pc{display:inline-block;margin-left:.06em;font-size:.34em;vertical-align:top;letter-spacing:0}
.w2i-bar{position:relative;height:6px}
.w2i-bar::before{content:"";position:absolute;inset:0;border-radius:99px;background:rgba(255,248,241,.12)}
.w2i-fill{position:absolute;inset:0;border-radius:99px;background:linear-gradient(90deg,var(--red),var(--lime) 38%,var(--sky) 70%,var(--lilac));
clip-path:inset(0 calc(100% - var(--w2p) * 100%) 0 0 round 99px)}
.w2i-head{position:absolute;top:50%;left:calc(var(--w2p) * 100%);width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--paper);
box-shadow:0 0 0 5px rgba(255,248,241,.14),0 0 24px rgba(255,248,241,.6)}
.w2i-top,.w2i-foot{transition:opacity .5s var(--ease),translate .7s var(--ease)}
.w2i.out .w2i-top{opacity:0;translate:0 -14px}
.w2i.out .w2i-foot{opacity:0;translate:0 18px}
.w2i.out .w2i-globe{opacity:0;scale:1.04}
html:has(.w2i:not(.out)) .w2n-fixed{opacity:0;translate:0 -16px;visibility:hidden}
.w2n-fixed{transition:opacity .8s cubic-bezier(.16,1,.3,1) .45s,translate 1s cubic-bezier(.16,1,.3,1) .45s,visibility 0s linear .45s}
@media (prefers-reduced-motion:reduce){.w2i{display:none}}
`

/** Live time at the studio, e.g. "10:42". */
function useClock(timeZone: string): string {
    const [now, setNow] = React.useState("")
    React.useEffect(() => {
        let fmt: Intl.DateTimeFormat
        try {
            fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone })
        } catch {
            fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
        }
        const tick = () => React.startTransition(() => setNow(fmt.format(new Date())))
        tick()
        const id = window.setInterval(tick, 15000)
        return () => window.clearInterval(id)
    }, [timeZone])
    return now
}

/** Placeholder for the globe video: a dotted planet turning, with three pieces of content in orbit. */
function DotGlobe(p: { still: boolean; paused: boolean }) {
    const ref = React.useRef<HTMLCanvasElement>(null)
    const pausedRef = React.useRef(p.paused)
    const kick = React.useRef<() => void>(() => {})
    pausedRef.current = p.paused
    React.useEffect(() => {
        if (!p.paused) kick.current()
    }, [p.paused])
    React.useEffect(() => {
        const cv = ref.current
        if (!cv) return
        const ctx = cv.getContext("2d")
        if (!ctx) return
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        let W = 0
        let H = 0
        let pts: number[][] = []
        const build = () => {
            const r = cv.getBoundingClientRect()
            W = Math.max(1, Math.round(r.width))
            H = Math.max(1, Math.round(r.height))
            cv.width = W * dpr
            cv.height = H * dpr
            const n = W < 640 ? 640 : 1100
            pts = []
            const ga = Math.PI * (3 - Math.sqrt(5))
            for (let i = 0; i < n; i++) {
                const y = 1 - (i / (n - 1)) * 2
                const rr = Math.sqrt(1 - y * y)
                const t = ga * i
                pts.push([Math.cos(t) * rr, y, Math.sin(t) * rr, i % 11 === 0 ? 1 : 0])
            }
        }
        const tilt = 0.36
        const ct = Math.cos(tilt)
        const st = Math.sin(tilt)
        const orbits = [
            { inc: 0.5, rot: 0.3, rad: 1.38, speed: 0.42, ph: 0, col: "#F2522A" },
            { inc: -0.72, rot: -0.5, rad: 1.56, speed: 0.3, ph: 2.1, col: "#D9FF3F" },
            { inc: 1.15, rot: 1.2, rad: 1.24, speed: 0.55, ph: 4.2, col: "#8BDCFF" },
        ]
        const draw = (time: number) => {
            const a = time * 0.00012
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, W, H)
            const R = Math.min(W, H) * (W < 640 ? 0.36 : 0.33)
            const cx = W / 2
            const cy = H * 0.47
            const ca = Math.cos(a)
            const sa = Math.sin(a)
            // Orbit paths and satellites, split into the half behind the planet and the half in front.
            const sats: { x: number; y: number; z: number; col: string }[] = []
            const ring = (o: (typeof orbits)[0], front: boolean) => {
                ctx.beginPath()
                let moved = false
                for (let k = 0; k <= 96; k++) {
                    const u = (k / 96) * Math.PI * 2
                    const x0 = Math.cos(u) * o.rad
                    const z0 = Math.sin(u) * o.rad
                    const y1 = -z0 * Math.sin(o.inc)
                    const z1 = z0 * Math.cos(o.inc)
                    const x2 = x0 * Math.cos(o.rot) - y1 * Math.sin(o.rot)
                    const y2 = x0 * Math.sin(o.rot) + y1 * Math.cos(o.rot)
                    const y3 = y2 * ct - z1 * st
                    const z3 = y2 * st + z1 * ct
                    if (z3 > 0 === front) {
                        if (!moved) ctx.moveTo(cx + x2 * R, cy + y3 * R)
                        else ctx.lineTo(cx + x2 * R, cy + y3 * R)
                        moved = true
                    } else moved = false
                }
                ctx.strokeStyle = front ? "rgba(255,248,241,.22)" : "rgba(255,248,241,.08)"
                ctx.lineWidth = 1
                ctx.stroke()
            }
            orbits.forEach((o) => {
                const u = time * 0.001 * o.speed + o.ph
                const x0 = Math.cos(u) * o.rad
                const z0 = Math.sin(u) * o.rad
                const y1 = -z0 * Math.sin(o.inc)
                const z1 = z0 * Math.cos(o.inc)
                const x2 = x0 * Math.cos(o.rot) - y1 * Math.sin(o.rot)
                const y2 = x0 * Math.sin(o.rot) + y1 * Math.cos(o.rot)
                sats.push({ x: cx + x2 * R, y: cy + (y2 * ct - z1 * st) * R, z: y2 * st + z1 * ct, col: o.col })
            })
            const sat = (s: (typeof sats)[0]) => {
                const r = (W < 640 ? 5 : 7) * (0.8 + 0.25 * s.z)
                ctx.beginPath()
                ctx.fillStyle = s.col
                ctx.globalAlpha = s.z > 0 ? 1 : 0.35
                ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
                ctx.fill()
                ctx.globalAlpha = 1
            }
            orbits.forEach((o) => ring(o, false))
            sats.filter((s) => s.z <= 0).forEach(sat)
            for (let i = 0; i < pts.length; i++) {
                const q = pts[i]
                const x1 = q[0] * ca + q[2] * sa
                const z1 = -q[0] * sa + q[2] * ca
                const y2 = q[1] * ct - z1 * st
                const z2 = q[1] * st + z1 * ct
                const front = z2 > 0
                const d = (z2 + 1) / 2
                ctx.globalAlpha = front ? 0.42 + d * 0.58 : 0.06 + d * 0.18
                ctx.fillStyle = q[3] && front ? "#D9FF3F" : "#FFF8F1"
                const s = (0.9 + d * 1.9) * (W < 640 ? 0.85 : 1)
                ctx.fillRect(cx + x1 * R - s / 2, cy + y2 * R - s / 2, s, s)
            }
            ctx.globalAlpha = 1
            orbits.forEach((o) => ring(o, true))
            sats.filter((s) => s.z > 0).forEach(sat)
        }
        build()
        let raf = 0
        let vis = true
        let clock = 9000
        let last = 0
        const loop = (t: number) => {
            clock += last ? Math.min(50, t - last) : 0
            last = t
            draw(clock)
            raf = vis && !pausedRef.current ? requestAnimationFrame(loop) : 0
            if (!raf) last = 0
        }
        kick.current = () => {
            if (!raf && vis && !p.still) raf = requestAnimationFrame(loop)
        }
        const io = new IntersectionObserver(([e]) => {
            vis = e.isIntersecting
            if (vis) kick.current()
        })
        io.observe(cv)
        const ro = new ResizeObserver(() => {
            build()
            draw(clock)
        })
        ro.observe(cv)
        if (p.still) draw(clock)
        else if (!pausedRef.current) raf = requestAnimationFrame(loop)
        else draw(clock)
        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
            ro.disconnect()
        }
    }, [p.still])
    return <canvas ref={ref} className="w2h-cv" aria-hidden="true" />
}

/** Three satellites on tilted orbits around the loading globe. */
const ORBITS = [
    { rx: 126, ry: 30, rot: -16, dur: 7, r: 5.5, col: "#F2522A", cw: true, off: 0 },
    { rx: 118, ry: 44, rot: 28, dur: 10, r: 4.6, col: "#8BDCFF", cw: false, off: 0.4 },
    { rx: 112, ry: 20, rot: 66, dur: 5.5, r: 4, col: "#C9B6FF", cw: true, off: 0.75 },
]

/** The spinning wireframe planet: dotted meridians turn, satellites slip behind it and back. */
function LoaderGlobe() {
    const lats = [-70, -45, -20, 0, 20, 45, 70]
    return (
        <svg viewBox="-130 -130 260 260" aria-hidden="true">
            <defs>
                <radialGradient id="w2iG" cx="36%" cy="30%" r="80%">
                    <stop offset="0" stopColor="#2B2926" />
                    <stop offset="1" stopColor="#0D0C0B" />
                </radialGradient>
                <radialGradient id="w2iGl">
                    <stop offset=".6" stopColor="#8BDCFF" stopOpacity=".16" />
                    <stop offset="1" stopColor="#8BDCFF" stopOpacity="0" />
                </radialGradient>
                {ORBITS.map((o, i) => (
                    <mask key={i} id={"w2iM" + i} maskUnits="userSpaceOnUse" x="-130" y="-130" width="260" height="260">
                        <rect x="-130" y="-130" width="260" height="260" fill="#fff" />
                        <path d="M-100 0A100 100 0 0 1 100 0Z" fill="#000" transform={"rotate(" + o.rot + ")"} />
                    </mask>
                ))}
            </defs>
            <circle className="w2i-glow" r="130" />
            {ORBITS.map((o, i) => (
                <ellipse key={i} className="w2i-orb" rx={o.rx} ry={o.ry} transform={"rotate(" + o.rot + ")"} />
            ))}
            <circle className="w2i-disc" r="100" />
            {lats.map((d) => {
                const y = -100 * Math.sin((d * Math.PI) / 180)
                const x = 100 * Math.cos((d * Math.PI) / 180)
                return <path key={d} className="w2i-lat" d={"M" + (-x).toFixed(1) + " " + y.toFixed(1) + "H" + x.toFixed(1)} />
            })}
            {[0, 1, 2, 3, 4, 5].map((k) => (
                <ellipse key={k} className="w2i-m" rx="100" ry="100" style={cssVars({ "--gd": (-k * 8) / 12 + "s" })} />
            ))}
            <circle className="w2i-rim" r="100" />
            {ORBITS.map((o, i) => (
                <path key={i} className="w2i-orb f" d={"M" + -o.rx + " 0A" + o.rx + " " + o.ry + " 0 0 0 " + o.rx + " 0"} transform={"rotate(" + o.rot + ")"} />
            ))}
            {ORBITS.map((o, i) => {
                // Two nested sine-eased moves trace the ellipse: across by rx, and a quarter turn later, down by ry.
                const lag = o.off * o.dur
                return (
                    <g key={i} mask={"url(#w2iM" + i + ")"}>
                        <g transform={"rotate(" + o.rot + ")"}>
                            <g className="w2i-sx" style={cssVars({ "--a": o.rx + "px", "--t": o.dur + "s", "--lag": -lag + "s" })}>
                                <g className="w2i-sy" style={cssVars({ "--a": o.ry + "px", "--t": o.dur + "s", "--lag": -(lag + (o.cw ? 0.75 : 0.25) * o.dur) + "s" })}>
                                    <circle r={o.r} fill={o.col} />
                                </g>
                            </g>
                        </g>
                    </g>
                )
            })}
        </svg>
    )
}

/**
 * The loading screen. It is part of the page's HTML, so it covers the page from the very first
 * paint; CSS runs the globe and moves the bar towards 94 until the script takes over, waits for
 * the fonts, the page and the video, then runs the count to 100 and fades into the hero.
 */
function Loader(p: { name: string; note: string; video: React.RefObject<HTMLVideoElement>; onReveal: () => void; onGone: () => void }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const letters = Array.from(p.name)
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        const html = document.documentElement
        const css = typeof el.getAnimations === "function" ? el.getAnimations().find((a) => (a as CSSAnimation).animationName === "w2iLoad") : undefined
        const shown = css && typeof css.currentTime === "number" ? css.currentTime : 0
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        // Reduced motion, or a script so late the CSS fail-safe has already hidden the screen.
        if (reduce || shown > 8800) {
            p.onReveal()
            p.onGone()
            return
        }
        const start = performance.now() - shown
        let seen = false
        try {
            seen = window.sessionStorage.getItem("w2-intro") === "1"
            window.sessionStorage.setItem("w2-intro", "1")
        } catch {}
        const MIN = seen ? 1000 : 2000
        const MAX = 6000
        const prev = html.style.overflow
        html.style.overflow = "hidden"
        let alive = true
        let raf = 0
        const timers: number[] = []
        const after = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, Math.max(0, ms))))
        const since = () => performance.now() - start

        const leave = () => {
            el.classList.add("out")
            html.style.overflow = prev
            if (!window.location.hash && window.scrollY > 0) window.scrollTo(0, 0)
            p.onReveal()
            timers.push(window.setTimeout(p.onGone, 1300))
        }
        const finish = () => {
            const cs = getComputedStyle(el)
            const from = Math.min(1, parseFloat(cs.getPropertyValue("--w2p")) || 0)
            el.style.setProperty("--w2p", String(from))
            el.style.setProperty("--w2n", String(Math.round(from * 100)))
            el.classList.add("js")
            const t0 = performance.now()
            const dur = 650
            const step = (now: number) => {
                const k = Math.min(1, (now - t0) / dur)
                const v = from + (1 - from) * (1 - Math.pow(1 - k, 3))
                el.style.setProperty("--w2p", v.toFixed(4))
                el.style.setProperty("--w2n", String(Math.round(v * 100)))
                if (k < 1) raf = requestAnimationFrame(step)
                else timers.push(window.setTimeout(leave, 180))
            }
            raf = requestAnimationFrame(step)
        }

        const waits: Promise<unknown>[] = []
        const fonts = (document as any).fonts
        if (fonts && fonts.ready) waits.push(fonts.ready)
        if (document.readyState !== "complete") waits.push(new Promise((r) => window.addEventListener("load", r, { once: true })))
        const v = p.video.current
        if (v && v.readyState < 2 && !v.error) {
            waits.push(
                Promise.race([
                    new Promise((r) => {
                        v.addEventListener("loadeddata", r, { once: true })
                        v.addEventListener("error", r, { once: true })
                    }),
                    after(3500),
                ])
            )
        }
        Promise.race([Promise.all(waits), after(MAX - since())])
            .then(() => after(MIN - since()))
            .then(() => {
                if (alive) finish()
            })
        return () => {
            alive = false
            cancelAnimationFrame(raf)
            timers.forEach((t) => window.clearTimeout(t))
            html.style.overflow = prev
        }
    }, [])
    return (
        <div ref={ref} className="w2 w2i" data-tone="ink" aria-hidden="true">
            <div className="w2i-top">
                <span className="w2i-name" translate="no" style={cssVars({ "--n": letters.length })}>
                    {letters.map((c, i) => (
                        <span key={i} style={cssVars({ "--i": i })}>
                            {c === " " ? " " : c}
                        </span>
                    ))}
                </span>
                <span>(Loading)</span>
            </div>
            <div className="w2i-globe">
                <LoaderGlobe />
            </div>
            <div className="w2i-foot">
                <div className="w2i-row">
                    <span className="w2i-note">{p.note}</span>
                    <span className="w2i-num w2-it">
                        <span className="w2i-pc">%</span>
                    </span>
                </div>
                <div className="w2i-bar">
                    <i className="w2i-fill" />
                    <b className="w2i-head" />
                </div>
            </div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Hero(props: HeroProps) {
    const {
        video = "",
        poster,
        samples = true,
        nameOver = true,
        wordmark = "world media",
        statement = "A creator-first media agency. We put brands *where the conversation is.*",
        location = "Delhi, India",
        timeZone = "Asia/Kolkata",
        zone = "IST",
        intro = true,
        introNote = "Spinning up the globe…",
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const still = useStill()
    const time = useClock(timeZone)
    const withLoader = intro && !isStatic
    const [loader, setLoader] = React.useState(withLoader)
    const [on, setOn] = React.useState(false)
    const [muted, setMuted] = React.useState(true)
    const [paused, setPaused] = React.useState(false)
    const [failed, setFailed] = React.useState(false)
    const vref = React.useRef<HTMLVideoElement>(null)

    // Your own video wins; otherwise the sample globe, unless samples are switched off.
    const sample = !video && samples
    const src = failed ? "" : video || (sample ? SAMPLE + "globe-loop.mp4" : "")
    const posterSrc = (poster && poster.src) || (sample ? SAMPLE + "globe-poster.jpg" : undefined)
    const showName = !src || nameOver

    React.useEffect(() => {
        if (!withLoader) React.startTransition(() => setOn(true))
        // A video that failed before the page woke up still falls back to the dotted globe.
        const v = vref.current
        if (v && v.error) setFailed(true)
    }, [])

    // The server HTML always asks the video to autoplay; respect reduced motion once known.
    React.useEffect(() => {
        const v = vref.current
        if (v && still) v.pause()
    }, [still, src])

    const reveal = React.useCallback(() => React.startTransition(() => setOn(true)), [])
    const gone = React.useCallback(() => React.startTransition(() => setLoader(false)), [])

    const toggleSound = () => {
        const v = vref.current
        if (!v) return
        v.muted = !v.muted
        if (!v.muted) v.play().catch(() => {})
        setMuted(v.muted)
    }

    // Anything that moves on its own for long gets a pause button.
    const togglePause = () => {
        const v = vref.current
        const next = !paused
        if (v) {
            if (next) v.pause()
            else v.play().catch(() => {})
        }
        setPaused(next)
    }

    const letters = Array.from(wordmark)
    const ready = still || on

    return (
        <>
            <Section tone="ink" id="top" className={"w2h" + (ready ? " on" : "") + (withLoader ? " ld" : "")} css={HERO_CSS} label="World Media" style={style}>
                <div className={"w2h-card" + (src && sample ? " smp" : "")}>
                    <div className="w2h-stage">
                        {src ? (
                            <video
                                ref={vref}
                                className={sample ? "w2h-smp" : undefined}
                                src={sample ? undefined : src}
                                poster={posterSrc}
                                autoPlay={!still}
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-label="World Media globe animation"
                                // React passes a <source> error on to the video, and a skipped MP4 is not a failure.
                                onError={sample ? undefined : () => setFailed(true)}
                            >
                                {sample ? <source src={SAMPLE + "globe-loop.mp4"} type={'video/mp4; codecs="avc1.640028"'} /> : null}
                                {sample ? <source src={SAMPLE + "globe-loop.webm"} type={'video/webm; codecs="vp9"'} onError={() => setFailed(true)} /> : null}
                            </video>
                        ) : (
                            <>
                                <div className="w2h-glow" />
                                <DotGlobe still={still} paused={paused} />
                            </>
                        )}
                        {showName ? (
                            <div className="w2h-mark" aria-hidden="true" translate="no">
                                {letters.map((c, i) => (
                                    <span key={i} className="l" style={cssVars({ "--d": (0.25 + i * 0.045).toFixed(3) + "s" })}>
                                        {c === " " ? " " : c}
                                    </span>
                                ))}
                                <span className="l dot" style={cssVars({ "--d": (0.3 + letters.length * 0.045).toFixed(3) + "s" })}>
                                    .
                                </span>
                            </div>
                        ) : null}
                        {isStatic && !video ? <div className="w2h-hint">{src ? "Sample video: add yours in the Video field" : "Video placeholder: add the globe video in the Video field"}</div> : null}
                    </div>
                    <div className="w2h-shade" />
                    <div className="w2h-ui">
                        {ready ? (
                            <Words as="h1" className="w2h-say" text={statement} delay={0.5} stagger={0.045} />
                        ) : (
                            <h1 className="w2h-say" style={{ opacity: 0 }}>
                                {statement.replace(/\*/g, "")}
                            </h1>
                        )}
                        <div className="w2h-meta">
                            <div className="w2h-btns">
                                {still ? null : (
                                    <button type="button" className="w2-pill w2h-snd w2h-pause" data-hue="paper" onClick={togglePause} aria-pressed={paused} aria-label={paused ? "Play the animation" : "Pause the animation"}>
                                        {paused ? (
                                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                                <path d="M2.5 1.5v9l8-4.5z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                                <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                                {video && !failed ? (
                                    <button type="button" className="w2-pill w2h-snd" data-hue="paper" onClick={toggleSound} aria-pressed={!muted}>
                                        <Roll>{muted ? "Sound on" : "Sound off"}</Roll>
                                    </button>
                                ) : null}
                            </div>
                            <div className="w2h-where">
                                <i aria-hidden="true" />
                                <span>{location}</span>
                                {time ? (
                                    <b>
                                        {time} {zone}
                                    </b>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            {withLoader && loader ? <Loader name={wordmark} note={introNote} video={vref} onReveal={reveal} onGone={gone} /> : null}
        </>
    )
}

addPropertyControls(W2Hero, {
    video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "webm", "mov"] },
    poster: { type: ControlType.ResponsiveImage, title: "Poster" },
    samples: {
        type: ControlType.Boolean,
        title: "Sample video",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "NASA’s spinning Earth plays until you add your own video.",
    },
    nameOver: {
        type: ControlType.Boolean,
        title: "Name on video",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Turn off if your video already shows the name.",
    },
    wordmark: { type: ControlType.String, title: "Name", defaultValue: "world media" },
    statement: {
        type: ControlType.String,
        title: "Line",
        defaultValue: "A creator-first media agency. We put brands *where the conversation is.*",
        displayTextArea: true,
        description: "Words between *stars* are set in italic.",
    },
    location: { type: ControlType.String, title: "Location", defaultValue: "Delhi, India" },
    timeZone: { type: ControlType.String, title: "Time zone", defaultValue: "Asia/Kolkata" },
    zone: { type: ControlType.String, title: "Zone label", defaultValue: "IST" },
    intro: { type: ControlType.Boolean, title: "Loading screen", defaultValue: true, enabledTitle: "Show", disabledTitle: "Skip" },
    introNote: { type: ControlType.String, title: "Loading note", defaultValue: "Spinning up the globe…" },
})
