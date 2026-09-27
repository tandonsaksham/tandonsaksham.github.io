// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the site footer. Chapter links, contact, back to top, and the "world media."
// wordmark set at full width with its vermilion full stop, rising letter by letter.

import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"

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

type BoxProps = {
    as?: any
    className?: string
    style?: React.CSSProperties
    delay?: number
    amount?: number
    children?: React.ReactNode
    [k: string]: any
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

type FooterLink = { label: string; href: string }

type FooterProps = {
    links: FooterLink[]
    email: string
    phone: string
    social: string
    socialHref: string
    note: string
    copyright: string
    style?: React.CSSProperties
}

const FOOTER_CSS = `
.wmf .wm-wrap{padding-top:clamp(64px,7cqw,104px);padding-bottom:0}
.wmf-cols{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:clamp(24px,3cqw,48px);align-items:start}
.wmf-t{display:block;margin-bottom:14px;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
.wmf-list{display:flex;flex-direction:column;gap:6px}
.wmf-list a{display:inline-flex;align-items:baseline;gap:10px;font-size:15.5px;font-weight:500;letter-spacing:-.01em;width:max-content;transition:color .3s}
.wmf-list a em{font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:11px;color:var(--red)}
.wmf-list a:hover{color:var(--red)}
.wmf-top{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;border:1px solid var(--line2);color:var(--cream);transition:background .4s,color .4s,border-color .4s}
.wmf-top:hover{background:var(--red);border-color:var(--red);color:var(--ink)}
.wmf-mark{display:block;margin-top:clamp(56px,7cqw,110px);font-weight:800;font-size:calc((min(100cqw,1400px) - 2 * clamp(20px,5.2cqw,80px)) * .1904);font-variation-settings:"opsz" 96;line-height:.8;letter-spacing:-.05em;white-space:nowrap;overflow:hidden;padding:.06em 0 .03em}
.wmf-mark .l{display:inline-block;transform:translate3d(0,100%,0);transition:transform 1.2s var(--ease);transition-delay:calc(var(--k) * .045s)}
.wmf-mark.wm-in .l{transform:none}
.wmf-mark .l.dot{color:var(--red);letter-spacing:0}
.wmf-bottom{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:18px 0 28px;border-top:1px solid var(--line)}
.wmf-note{color:var(--red);font-size:clamp(19px,1.7cqw,24px)}
@container (max-width:820px){.wmf-cols{grid-template-columns:1fr 1fr}.wmf-topcol{grid-column:1/-1}}
@container (max-width:640px){.wmf .wm-wrap{padding-top:52px}.wmf-cols{row-gap:30px}.wmf-mark{margin-top:44px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMFooter(props: FooterProps) {
    const {
        links = [
            { label: "The shift", href: "#the-shift" },
            { label: "Who we are", href: "#who-we-are" },
            { label: "What we do", href: "#what-we-do" },
            { label: "The work", href: "#the-work" },
            { label: "What's next", href: "#whats-next" },
            { label: "Let's talk", href: "#lets-talk" },
        ],
        email = "social@worldmedia.co.in",
        phone = "+91 8800 040 301",
        social = "@[worldmedia]",
        socialHref = "",
        note = "psst… this is our portfolio too",
        copyright = "© 2026 World Media · Delhi, India",
        style,
    } = props

    const [markRef, markIn] = useIn<HTMLSpanElement>(0.3)
    const word = "world media"

    return (
        <Section theme="ink" className="wmf" css={FOOTER_CSS} style={style} label="Footer">
            <footer className="wm-wrap">
                <Stagger className="wmf-cols" step={0.08}>
                    <nav aria-label="Chapters">
                        <span className="wmf-t">Chapters</span>
                        <div className="wmf-list">
                            {links.map((l, i) => (
                                <a key={i} href={l.href}>
                                    <em>{String(i + 1).padStart(2, "0")}</em>
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                    <div>
                        <span className="wmf-t">Say hello</span>
                        <div className="wmf-list">
                            <a href={"mailto:" + email}>{email}</a>
                            <a href={"tel:" + phone.replace(/[^+\d]/g, "")}>{phone}</a>
                        </div>
                    </div>
                    <div>
                        <span className="wmf-t">Follow</span>
                        <div className="wmf-list">
                            {socialHref ? (
                                <a href={socialHref} target="_blank" rel="noreferrer">
                                    {social}
                                </a>
                            ) : (
                                <span style={{ fontSize: 15.5, fontWeight: 500 }}>{social}</span>
                            )}
                        </div>
                    </div>
                    <div className="wmf-topcol">
                        <a className="wmf-top" href="#top" aria-label="Back to top">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20V4M5 11l7-7 7 7" />
                            </svg>
                        </a>
                    </div>
                </Stagger>
                <span ref={markRef} className={"wmf-mark" + markIn} aria-label="world media.">
                    {Array.from(word).map((ch, k) => (
                        <span className="l" key={k} style={cssVars({ "--k": k })} aria-hidden="true">
                            {ch === " " ? String.fromCharCode(160) : ch}
                        </span>
                    ))}
                    <span className="l dot" style={cssVars({ "--k": word.length })} aria-hidden="true">
                        .
                    </span>
                </span>
                <div className="wmf-bottom">
                    <span className="wm-mono wm-mut">{copyright}</span>
                    <Script className="wmf-note" delay={0.3} rotate={-2}>
                        {note}
                    </Script>
                </div>
            </footer>
        </Section>
    )
}

addPropertyControls(WMFooter, {
    links: {
        type: ControlType.Array,
        title: "Chapters",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { label: "The shift", href: "#the-shift" },
            { label: "Who we are", href: "#who-we-are" },
            { label: "What we do", href: "#what-we-do" },
            { label: "The work", href: "#the-work" },
            { label: "What's next", href: "#whats-next" },
            { label: "Let's talk", href: "#lets-talk" },
        ],
    },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 8800 040 301" },
    social: { type: ControlType.String, title: "Instagram", defaultValue: "@[worldmedia]" },
    socialHref: { type: ControlType.String, title: "Instagram link", defaultValue: "" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "psst… this is our portfolio too" },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: "© 2026 World Media · Delhi, India" },
})
