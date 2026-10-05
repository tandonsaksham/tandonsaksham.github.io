// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Contact and Join us, as the brief asks: one square card at the end with a
// switch between Brand and Creator, and the form changes with the choice. Brands send a
// brief; creators apply to join the roster. "Contact" in the menu opens the brand side,
// "Join us" the creator side. Entries go to the Form endpoint (e.g. Formspree) if one is set,
// otherwise they open a pre-filled email to the Send to address.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion"

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

/** Hover label that rolls up to a fresh copy of itself. */
function Roll(p: { children: string }) {
    return (
        <span className="w2-roll">
            <span>{p.children}</span>
            <span aria-hidden="true">{p.children}</span>
        </span>
    )
}

type Mode = "brand" | "creator"

type ContactItem = { label: string; value: string; href: string }

type ContactProps = {
    first: boolean
    title: string
    sub: string
    contacts: ContactItem[]
    endpoint: string
    sendTo: string
    brandTitle: string
    creatorTitle: string
    needs: string
    budgets: string
    platforms: string
    followers: string
    brandButton: string
    creatorButton: string
    brandThanks: string
    creatorThanks: string
    promise: string
    style?: React.CSSProperties
}

const CONTACT_CSS = `
.w2c-wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto);gap:clamp(28px,4cqw,72px);align-items:start;padding:clamp(72px,8cqw,128px) var(--gut) clamp(40px,4cqw,64px)}
.w2c-left{position:sticky;top:96px;display:flex;flex-direction:column;gap:clamp(22px,2.4cqw,34px);max-width:640px}
.w2c-left .w2-lbl{color:var(--mut)}
.w2c-left .w2-h2 .w2-it{color:var(--red)}
.w2c-sub{max-width:34ch;font-size:clamp(16px,1.3cqw,19px);line-height:1.4;font-weight:400;color:var(--mut)}
.w2c-reach{display:grid;grid-template-columns:1fr 1fr;gap:18px 24px;margin-top:6px}
.w2c-reach li{display:flex;flex-direction:column;gap:4px;padding-top:12px;border-top:1px solid var(--line);min-width:0}
.w2c-reach small{font-size:12px;color:var(--mut)}
.w2c-reach a,.w2c-reach span{font-size:clamp(15px,1.15cqw,17px);letter-spacing:-.015em;overflow-wrap:anywhere}
.w2c-reach a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.w2c-reach a:hover{background-size:100% 1px}
.w2c-card{--ac:var(--red);--acf:var(--ink);--dot:var(--red);position:relative;display:flex;flex-direction:column;width:min(620px,46cqw);aspect-ratio:1/1;padding:clamp(20px,2cqw,30px);border-radius:var(--r);background:#FFFFFF;
box-shadow:0 1px 0 rgba(0,0,0,.05),0 40px 80px -48px rgba(0,0,0,.35);border:1px solid rgba(0,0,0,.1);transition:box-shadow .6s}
/* A jump to #join, from the menu on any page, leaves the card just under the menu, even while it is still rising into
   place. The browser does not hold the view to the card, which moves as it rises. */
.w2c-card{overflow-anchor:none}
@media (prefers-reduced-motion:no-preference){.w2c-card.w2-rise:not(.w2-in){scroll-margin-top:30px}}
.w2c-card[data-mode="creator"]{--ac:var(--ink);--acf:var(--paper);--dot:var(--paper)}
.w2c-top{display:flex;align-items:center;justify-content:space-between;gap:14px}
.w2c-am{font-size:13px;color:var(--mut)}
.w2c-tog{position:relative;display:grid;grid-template-columns:1fr 1fr;padding:4px;border-radius:99px;background:var(--paper2);flex:none;width:230px}
.w2c-knob{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:99px;background:var(--ac);transition:translate .55s cubic-bezier(.3,1.4,.5,1),background-color .45s}
.w2c-card[data-mode="creator"] .w2c-knob{translate:100% 0}
.w2c-tog button{position:relative;z-index:1;height:38px;border:0;background:none;border-radius:99px;font-size:14.5px;font-weight:500;cursor:pointer;color:var(--ink);opacity:.55;transition:opacity .3s}
.w2c-tog button[aria-checked="true"]{opacity:1;color:var(--acf);transition:opacity .3s,color .3s .1s}
.w2c-h{margin:clamp(16px,1.6cqw,24px) 0 clamp(12px,1.2cqw,18px);font-size:clamp(24px,2.2cqw,34px);line-height:1.04;letter-spacing:-.04em}
.w2c-form{flex:1;display:flex;flex-direction:column;min-height:0}
.w2c-fields{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;align-content:start}
.w2c-f{display:flex;flex-direction:column;gap:4px;min-width:0}
.w2c-f.wide{grid-column:1/-1}
.w2c-f label,.w2c-lab{font-size:11.5px;letter-spacing:.03em;text-transform:uppercase;color:var(--mut)}
.w2c-f label i{font-style:normal;color:var(--red);margin-left:3px}
.w2c-f input,.w2c-f select,.w2c-f textarea{width:100%;border:0;border-bottom:1px solid rgba(10,10,10,.22);border-radius:0;background:transparent;padding:7px 0 8px;font:inherit;font-size:16px;font-weight:400;color:var(--ink);outline:none;transition:border-color .3s}
.w2c-f textarea{resize:none;min-height:64px;line-height:1.4}
.w2c-f select{appearance:none;-webkit-appearance:none;cursor:pointer;background-color:#FFFFFF;color:var(--ink);background:#FFFFFF url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%230A0A0A' stroke-width='1.6'><path d='M1 1.5l5 5 5-5'/></svg>") right 2px center no-repeat}
.w2c-f input::placeholder,.w2c-f textarea::placeholder{color:rgba(10,10,10,.4)}
.w2c-f input:focus,.w2c-f select:focus,.w2c-f textarea:focus{border-color:var(--ink)}
.w2c-f [aria-invalid="true"]{border-color:var(--red)}
.w2c-err{font-size:12px;color:#C2321A}
.w2c-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.w2c-chips button{height:30px;padding:0 12px;border-radius:99px;border:1px solid rgba(10,10,10,.2);background:transparent;font-size:13px;font-weight:500;cursor:pointer;transition:background-color .3s,border-color .3s}
.w2c-chips button[aria-pressed="true"]{background:var(--ac);color:var(--acf);border-color:transparent}
.w2c-chips button:hover{border-color:var(--ink)}
.w2c-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:auto;padding-top:16px}
.w2c-send.w2-pill{--pc:var(--ink);--pt:var(--paper);height:48px;padding:0 24px;font-size:15px}
.w2c-send .w2c-dot{width:9px;height:9px;border-radius:50%;background:var(--dot);transition:background-color .4s}
.w2c-send[disabled]{opacity:.6;cursor:progress}
.w2c-note{font-size:12px;color:var(--mut);text-align:right}
.w2c-done{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px}
.w2c-done .w2c-badge{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--ac);color:var(--acf)}
.w2c-done p{font-size:clamp(22px,2cqw,30px);line-height:1.12;letter-spacing:-.035em;max-width:20ch}
.w2c-done button{align-self:flex-start;border:0;background:none;padding:0;font-size:14px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;color:var(--mut)}
@container (max-width:1000px){.w2c-wrap{grid-template-columns:1fr}.w2c-left{position:relative;top:0}.w2c-card{width:100%;aspect-ratio:auto}}
@container (max-width:560px){.w2c-fields{grid-template-columns:1fr}.w2c-reach{grid-template-columns:1fr}.w2c-top{flex-direction:column;align-items:flex-start}.w2c-tog{width:100%}.w2c-foot{flex-direction:column;align-items:stretch}.w2c-note{text-align:left}}
`

const list = (s: string) =>
    String(s || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

function Field(p: { id: string; label: string; need?: boolean; error?: string; wide?: boolean; children: React.ReactNode }) {
    return (
        <div className={"w2c-f" + (p.wide ? " wide" : "")}>
            <label htmlFor={p.id}>
                {p.label}
                {p.need ? <i aria-hidden="true">*</i> : null}
            </label>
            {p.children}
            {p.error ? (
                <span className="w2c-err" id={p.id + "-e"} role="alert">
                    {p.error}
                </span>
            ) : null}
        </div>
    )
}

function Chips(p: { label: string; items: string[]; value: string[]; onChange: (v: string[]) => void; single?: boolean }) {
    return (
        <div className="w2c-f wide" role="group" aria-label={p.label}>
            <span className="w2c-lab">{p.label}</span>
            <div className="w2c-chips">
                {p.items.map((it) => {
                    const on = p.value.includes(it)
                    return (
                        <button
                            key={it}
                            type="button"
                            aria-pressed={on}
                            onClick={() => p.onChange(p.single ? (on ? [] : [it]) : on ? p.value.filter((v) => v !== it) : p.value.concat(it))}
                        >
                            {it}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Contact(props: ContactProps) {
    const {
        title = "Got a brand worth talking about? *Or a following worth backing?*",
        sub = "Pick your side, fill in the card, and a real person gets back to you within a day.",
        contacts = [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
        ],
        endpoint = "",
        sendTo = "social@worldmedia.co.in",
        brandTitle = "Tell us what you’re building.",
        creatorTitle = "Tell us what you make.",
        needs = "Influencer marketing, Celebrity marketing, Talent management, Creative strategy, Video production, Performance marketing, Content writing",
        budgets = "Under ₹5L, ₹5–15L, ₹15–50L, ₹50L+, Not sure yet",
        platforms = "Instagram, YouTube, Snapchat, X, LinkedIn, Other",
        followers = "Under 10K, 10K–100K, 100K–1M, 1M+",
        brandButton = "Send the brief",
        creatorButton = "Join the roster",
        brandThanks = "Got it. Your brief is with the team, and you’ll hear back within a day.",
        creatorThanks = "Welcome aboard (almost). We’ll look through your work and get back to you within a week.",
        promise = "* needed · we reply within a day",
        first = false,
        style,
    } = props

    const still = useStill()
    const [mode, setMode] = React.useState<Mode>("brand")
    const [sent, setSent] = React.useState<"" | "sent" | "mail">("")
    const [busy, setBusy] = React.useState(false)
    const [fail, setFail] = React.useState(false)
    const [errs, setErrs] = React.useState<Record<string, string>>({})
    const [picks, setPicks] = React.useState<Record<string, string[]>>({ needs: [], platforms: [] })
    const formRef = React.useRef<HTMLFormElement>(null)
    const uid = React.useId().replace(/:/g, "")
    const id = (k: string) => "w2c" + uid + k

    // The menu's Contact and Join us links pick the side: on this page at once, and from another page
    // through the note they leave. #join in the address picks it too.
    React.useEffect(() => {
        const w = window as any
        const pickMode = (m: Mode) =>
            React.startTransition(() => {
                setMode(m)
                setSent("")
                setErrs({})
            })
        const onEvent = (e: Event) => {
            const d = (e as CustomEvent).detail
            if (d !== "creator" && d !== "brand") return
            w.__w2side = ""
            pickMode(d)
        }
        const onHash = () => {
            if (window.location.hash === "#join") pickMode("creator")
            else if (window.location.hash === "#contact") pickMode("brand")
        }
        const note = w.__w2side
        w.__w2side = ""
        if (note === "creator" || note === "brand") pickMode(note)
        else onHash()
        window.addEventListener("w2:form", onEvent)
        window.addEventListener("hashchange", onHash)
        return () => {
            window.removeEventListener("w2:form", onEvent)
            window.removeEventListener("hashchange", onHash)
        }
    }, [])

    const choose = (m: Mode) => {
        setMode(m)
        setErrs({})
        setFail(false)
    }
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault()
            choose(mode === "brand" ? "creator" : "brand")
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const f = formRef.current
        if (!f) return
        const fd = new FormData(f)
        const v = (k: string) => String(fd.get(k) || "").trim()
        const er: Record<string, string> = {}
        if (!v("name")) er.name = "Tell us your name."
        if (mode === "brand") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) er.email = "That email doesn’t look right."
            if (!v("message")) er.message = "A line or two is plenty."
        } else {
            if (!v("handle")) er.handle = "Where can we see your work?"
            const c = v("reach")
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.replace(/\D/g, "").length < 8) er.reach = "An email or a WhatsApp number, please."
        }
        setErrs(er)
        const bad = Object.keys(er)
        if (bad.length) {
            const first = f.querySelector('[name="' + bad[0] + '"]') as HTMLElement | null
            if (first) first.focus()
            return
        }
        const fields: [string, string][] =
            mode === "brand"
                ? [
                      ["Name", v("name")],
                      ["Email", v("email")],
                      ["Company", v("company")],
                      ["Budget", v("budget")],
                      ["Looking for", (picks.needs || []).join(", ")],
                      ["Message", v("message")],
                  ]
                : [
                      ["Name", v("name")],
                      ["Handle", v("handle")],
                      ["Email or WhatsApp", v("reach")],
                      ["Followers", v("followers")],
                      ["Platforms", (picks.platforms || []).join(", ")],
                      ["About their content", v("message")],
                  ]
        const subject = mode === "brand" ? "New brief from " + v("name") + (v("company") ? " (" + v("company") + ")" : "") : "Creator application: " + v("handle")
        if (!endpoint) {
            const body = fields
                .filter(([, x]) => x)
                .map(([k, x]) => k + ": " + x)
                .join("\n")
            window.location.href = "mailto:" + sendTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
            setSent("mail")
            return
        }
        setBusy(true)
        setFail(false)
        try {
            const out = new FormData()
            out.append("form_type", mode)
            fields.forEach(([k, x]) => out.append(k, x))
            out.append("_subject", subject)
            if (mode === "brand") out.append("_replyto", v("email"))
            const r = await fetch(endpoint, { method: "POST", body: out, headers: { Accept: "application/json" } })
            if (!r.ok) throw new Error("status " + r.status)
            f.reset()
            setPicks({ needs: [], platforms: [] })
            setSent("sent")
        } catch {
            setFail(true)
        } finally {
            setBusy(false)
        }
    }

    const inv = (k: string) => (errs[k] ? { "aria-invalid": true as const, "aria-describedby": id(k) + "-e" } : {})
    const dur = still ? 0 : 0.32
    const dir = mode === "brand" ? -1 : 1

    const brand = (
        <div className="w2c-fields">
            <Field id={id("name")} label="Name" need error={errs.name}>
                <input id={id("name")} name="name" autoComplete="name" placeholder="Your name…" {...inv("name")} />
            </Field>
            <Field id={id("email")} label="Email" need error={errs.email}>
                <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} placeholder="you@brand.com" {...inv("email")} />
            </Field>
            <Field id={id("company")} label="Company">
                <input id={id("company")} name="company" autoComplete="organization" placeholder="Brand or company…" />
            </Field>
            <Field id={id("budget")} label="Budget">
                <select id={id("budget")} name="budget" defaultValue="">
                    <option value="" disabled>
                        Pick a range
                    </option>
                    {list(budgets).map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </Field>
            <Chips label="What are you looking for?" items={list(needs)} value={picks.needs || []} onChange={(x) => setPicks({ ...picks, needs: x })} />
            <Field id={id("message")} label="Message" need wide error={errs.message}>
                <textarea id={id("message")} name="message" rows={3} placeholder="The product, the audience, the dream outcome…" {...inv("message")} />
            </Field>
        </div>
    )

    const creator = (
        <div className="w2c-fields">
            <Field id={id("name")} label="Name" need error={errs.name}>
                <input id={id("name")} name="name" autoComplete="name" placeholder="Your name…" {...inv("name")} />
            </Field>
            <Field id={id("handle")} label="Handle or link" need error={errs.handle}>
                <input id={id("handle")} name="handle" placeholder="@yourhandle" autoCapitalize="none" autoComplete="off" spellCheck={false} {...inv("handle")} />
            </Field>
            <Field id={id("reach")} label="Email or WhatsApp" need error={errs.reach}>
                <input id={id("reach")} name="reach" placeholder="you@mail.com or +91 98…" autoComplete="off" spellCheck={false} {...inv("reach")} />
            </Field>
            <Field id={id("followers")} label="Followers">
                <select id={id("followers")} name="followers" defaultValue="">
                    <option value="" disabled>
                        Roughly
                    </option>
                    {list(followers).map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </Field>
            <Chips label="Where do you post?" items={list(platforms)} value={picks.platforms || []} onChange={(x) => setPicks({ ...picks, platforms: x })} />
            <Field id={id("message")} label="Your niche, your best work" wide>
                <textarea id={id("message")} name="message" rows={3} placeholder="What you make, who watches, a link to a post you’re proud of…" />
            </Field>
        </div>
    )

    const [cardRef, cardOn] = useReveal<HTMLDivElement>(0.15)
    return (
        <Section tone="paper" id="contact" className="w2c" css={CONTACT_CSS} label="Contact" style={style}>
            <div className="w2c-wrap">
                <div className="w2c-left">
                    <Label name="Contact" index={5} />
                    <Words as={first ? "h1" : "h2"} className="w2-h2" text={title} stagger={0.045} />
                    <Reveal as="p" className="w2c-sub w2-rise" delay={0.2}>
                        {sub}
                    </Reveal>
                    <Reveal as="ul" className="w2c-reach w2-rise" delay={0.3}>
                        {contacts.map((c, i) => (
                            <li key={i}>
                                <small>{c.label}</small>
                                {c.href ? (
                                    <a href={c.href} target={c.href.indexOf("http") === 0 ? "_blank" : undefined} rel="noreferrer">
                                        {c.value}
                                    </a>
                                ) : (
                                    <span>{c.value}</span>
                                )}
                            </li>
                        ))}
                    </Reveal>
                </div>
                <div ref={cardRef} id="join" className={"w2c-card w2-rise" + cardOn} data-mode={mode}>
                    <div className="w2c-top">
                        <span className="w2c-am" id={id("am")}>
                            I’m a
                        </span>
                        <div className="w2c-tog" role="radiogroup" aria-labelledby={id("am")} onKeyDown={onKey}>
                            <span className="w2c-knob" aria-hidden="true" />
                            <button type="button" role="radio" aria-checked={mode === "brand"} tabIndex={mode === "brand" ? 0 : -1} onClick={() => choose("brand")}>
                                Brand
                            </button>
                            <button type="button" role="radio" aria-checked={mode === "creator"} tabIndex={mode === "creator" ? 0 : -1} onClick={() => choose("creator")}>
                                Creator
                            </button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        {sent ? (
                            <motion.div
                                key={"done-" + mode}
                                className="w2c-done"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: dur }}
                                role="status"
                            >
                                <span className="w2c-badge" aria-hidden="true">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 13.5l4.6 4.6L20 8.6" />
                                    </svg>
                                </span>
                                <p>{sent === "mail" ? "Your email app should be open with everything filled in. Hit send and we’ll take it from there." : mode === "brand" ? brandThanks : creatorThanks}</p>
                                <button type="button" onClick={() => setSent("")}>
                                    Send another
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key={mode}
                                ref={formRef}
                                className="w2c-form"
                                noValidate
                                onSubmit={submit}
                                initial={{ opacity: 0, x: 24 * dir }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 * dir }}
                                transition={{ duration: dur }}
                            >
                                <h3 className="w2c-h">{mode === "brand" ? brandTitle : creatorTitle}</h3>
                                {mode === "brand" ? brand : creator}
                                <div className="w2c-foot">
                                    <button type="submit" className="w2-pill w2c-send" disabled={busy}>
                                        <span className="w2c-dot" aria-hidden="true" />
                                        <Roll>{busy ? "Sending…" : mode === "brand" ? brandButton : creatorButton}</Roll>
                                    </button>
                                    <span className="w2c-note">{fail ? "That didn’t go through. Try again, or write to " + sendTo : promise}</span>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2Contact, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Got a brand worth talking about? *Or a following worth backing?*",
        displayTextArea: true,
        description: "Words between *stars* are set in red italic.",
    },
    sub: { type: ControlType.String, title: "Intro", defaultValue: "Pick your side, fill in the card, and a real person gets back to you within a day.", displayTextArea: true },
    contacts: {
        type: ControlType.Array,
        title: "Contacts",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Text" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
        ],
    },
    endpoint: {
        type: ControlType.String,
        title: "Form endpoint",
        defaultValue: "",
        placeholder: "https://formspree.io/f/…",
        description: "Where entries are sent (Formspree, Getform, a webhook). Empty = opens a pre-filled email instead.",
    },
    sendTo: { type: ControlType.String, title: "Send to", defaultValue: "social@worldmedia.co.in" },
    brandTitle: { type: ControlType.String, title: "Brand title", defaultValue: "Tell us what you’re building." },
    needs: {
        type: ControlType.String,
        title: "Brand options",
        displayTextArea: true,
        defaultValue: "Influencer marketing, Celebrity marketing, Talent management, Creative strategy, Video production, Performance marketing, Content writing",
    },
    budgets: { type: ControlType.String, title: "Budgets", defaultValue: "Under ₹5L, ₹5–15L, ₹15–50L, ₹50L+, Not sure yet" },
    brandButton: { type: ControlType.String, title: "Brand button", defaultValue: "Send the brief" },
    brandThanks: { type: ControlType.String, title: "Brand thanks", displayTextArea: true, defaultValue: "Got it. Your brief is with the team, and you’ll hear back within a day." },
    creatorTitle: { type: ControlType.String, title: "Creator title", defaultValue: "Tell us what you make." },
    platforms: { type: ControlType.String, title: "Platforms", defaultValue: "Instagram, YouTube, Snapchat, X, LinkedIn, Other" },
    followers: { type: ControlType.String, title: "Follower ranges", defaultValue: "Under 10K, 10K–100K, 100K–1M, 1M+" },
    creatorButton: { type: ControlType.String, title: "Creator button", defaultValue: "Join the roster" },
    creatorThanks: {
        type: ControlType.String,
        title: "Creator thanks",
        displayTextArea: true,
        defaultValue: "Welcome aboard (almost). We’ll look through your work and get back to you within a week.",
    },
    promise: { type: ControlType.String, title: "Small print", defaultValue: "* needed · we reply within a day" },
    first: {
        type: ControlType.Boolean,
        title: "Opens the page",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        description: "When Contact is the first thing on a page, its title becomes the page's main heading.",
    },
})
