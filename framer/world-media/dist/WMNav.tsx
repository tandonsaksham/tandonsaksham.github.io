// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the site navigation. "world media." wordmark (vermilion full stop, as on every
// slide), chapter links, a vermilion "Let's talk" pill. It adapts to the ink / cream /
// vermilion section underneath, hides on scroll down, and opens a full-screen menu on phones.
// Place the instance at the top of the page, width 100%. On the live site the bar pins itself
// to the top of the window, so the layer itself needs no Fixed or Sticky setting.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useReducedMotion, useSpring } from "framer-motion"

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

/** Crisp long arrow used in links — grows on hover. */
function LineArrow(p: { style?: React.CSSProperties }) {
    return (
        <svg className="wm-arrowline" viewBox="0 0 60 16" preserveAspectRatio="xMaxYMid meet" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={p.style} aria-hidden="true">
            <path d="M1 8 H58" />
            <path d="M51 1.5 L58 8 L51 14.5" />
        </svg>
    )
}

/** Gentle magnetic pull toward the pointer for primary buttons. */
function Magnetic(p: { children?: React.ReactNode; strength?: number; className?: string; style?: React.CSSProperties }) {
    const ref = React.useRef<HTMLSpanElement>(null)
    const still = useStill()
    const x = useSpring(0, { stiffness: 240, damping: 18, mass: 0.5 })
    const y = useSpring(0, { stiffness: 240, damping: 18, mass: 0.5 })
    const k = p.strength ?? 0.28
    const onMove = React.useCallback(
        (e: React.MouseEvent) => {
            const el = ref.current
            if (still || !el) return
            const r = el.getBoundingClientRect()
            x.set((e.clientX - (r.left + r.width / 2)) * k)
            y.set((e.clientY - (r.top + r.height / 2)) * k)
        },
        [still, k, x, y]
    )
    const onLeave = React.useCallback(() => {
        x.set(0)
        y.set(0)
    }, [x, y])
    return (
        <motion.span ref={ref} className={p.className} style={{ display: "inline-flex", x, y, ...p.style }} onMouseMove={onMove} onMouseLeave={onLeave}>
            {p.children}
        </motion.span>
    )
}

type NavLink = { label: string; href: string }

type NavProps = {
    links: NavLink[]
    ctaLabel: string
    ctaHref: string
    email: string
    phone: string
    note: string
    style?: React.CSSProperties
}

const NAV_CSS = `
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
.wmn-fixed{position:fixed;top:0;left:0;right:0;z-index:2147482000}
.wmn.wm-sec{background:transparent;overflow:visible;z-index:50}
.wmn-bar{position:relative;margin:0 auto;max-width:1400px;padding:14px clamp(14px,3.4cqw,52px) 0}
.wmn-inner{display:flex;align-items:center;justify-content:space-between;gap:20px;height:60px;padding:0 10px 0 22px;border-radius:99px;
border:1px solid transparent;transition:background .5s var(--ease),border-color .5s var(--ease),color .5s var(--ease),backdrop-filter .5s var(--ease);color:var(--nfg)}
.wmn[data-top="0"] .wmn-inner{background:var(--nbg);border-color:var(--nline);-webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3)}
.wmn[data-t="ink"]{--nfg:var(--cream);--nbg:rgba(15,15,15,.72);--nline:rgba(242,238,229,.1);--nmut:rgba(242,238,229,.55)}
.wmn[data-t="cream"]{--nfg:var(--ink);--nbg:rgba(242,238,229,.8);--nline:rgba(15,15,15,.1);--nmut:rgba(15,15,15,.5)}
.wmn[data-t="red"]{--nfg:var(--ink);--nbg:rgba(233,67,27,.86);--nline:rgba(15,15,15,.14);--nmut:rgba(15,15,15,.6)}
.wmn-mark{font-weight:800;font-size:20px;letter-spacing:-.035em;white-space:nowrap}
.wmn-mark b{color:var(--red);font-weight:800}
.wmn[data-t="red"] .wmn-mark b{color:var(--cream)}
.wmn-links{display:flex;align-items:center;gap:clamp(14px,2.1cqw,30px)}
.wmn-a{position:relative;display:inline-flex;align-items:baseline;gap:6px;font-size:14.5px;font-weight:500;letter-spacing:-.01em;padding:6px 0;white-space:nowrap}
.wmn-a em{font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;color:var(--nmut);transition:color .3s}
.wmn-a::after{content:"";position:absolute;left:0;right:0;bottom:1px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:100% 50%;transition:transform .55s var(--ease)}
.wmn-a:hover::after,.wmn-a[aria-current="true"]::after{transform:scaleX(1);transform-origin:0 50%}
.wmn-a[aria-current="true"] em,.wmn-a:hover em{color:var(--red)}
.wmn[data-t="red"] .wmn-a[aria-current="true"] em{color:var(--cream)}
.wmn-cta{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 18px 0 20px;border-radius:99px;background:var(--red);color:var(--ink);font-weight:600;font-size:14.5px;letter-spacing:-.01em;white-space:nowrap;transition:background .35s}
.wmn[data-t="red"] .wmn-cta{background:var(--ink);color:var(--cream)}
.wmn-cta .wm-arrowline{width:1.35em;height:.7em}
.wmn-cta:hover .wm-arrowline{width:1.8em}
.wmn-burger{display:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--nline);background:transparent;color:inherit;cursor:pointer;position:relative}
.wmn-burger i{position:absolute;left:13px;right:13px;height:1.5px;background:currentColor;transition:transform .45s var(--ease),top .45s var(--ease)}
.wmn-burger i:nth-child(1){top:17px}.wmn-burger i:nth-child(2){top:25px}
@container (max-width:980px){.wmn-links{display:none}.wmn-burger{display:block}.wmn-right .wmn-cta{display:none}}
.wmn-menu.wm-sec{position:fixed;inset:0;z-index:2147483000;width:100%;height:100%;overflow:auto;background:var(--ink);color:var(--cream);
clip-path:inset(0 0 100% 0);visibility:hidden;transition:clip-path .9s var(--ease-io),visibility 0s linear .9s}
.wmn-menu.wm-sec.open{clip-path:inset(0 0 0 0);visibility:visible;transition:clip-path .9s var(--ease-io),visibility 0s}
.wmn-mwrap{min-height:100%;display:flex;flex-direction:column;padding:24px 22px 32px}
.wmn-mtop{display:flex;justify-content:space-between;align-items:center;height:52px}
.wmn-close{width:44px;height:44px;border-radius:50%;border:1px solid rgba(242,238,229,.2);background:transparent;color:var(--cream);cursor:pointer;position:relative}
.wmn-close i{position:absolute;left:12px;right:12px;top:21px;height:1.5px;background:currentColor}
.wmn-close i:nth-child(1){transform:rotate(45deg)}.wmn-close i:nth-child(2){transform:rotate(-45deg)}
.wmn-mlist{flex:1;display:flex;flex-direction:column;justify-content:center;gap:4px;padding:28px 0}
.wmn-mlist a{display:flex;align-items:baseline;gap:14px;font-weight:800;font-size:clamp(40px,11.5cqw,84px);line-height:1.02;letter-spacing:-.045em;overflow:hidden}
.wmn-mlist a span{display:inline-block;transform:translateY(105%);transition:transform .9s var(--ease)}
.wmn-mlist a em{font-style:normal;font-family:"DM Mono",monospace;font-size:13px;font-weight:400;letter-spacing:0;color:var(--red);transform:translateY(105%);transition:transform .9s var(--ease)}
.wmn-menu.open .wmn-mlist a span,.wmn-menu.open .wmn-mlist a em{transform:none;transition-delay:calc(.25s + var(--i) * .06s)}
.wmn-mfoot{display:flex;flex-direction:column;gap:10px;opacity:0;transition:opacity .6s}
.wmn-menu.open .wmn-mfoot{opacity:1;transition-delay:.7s}
.wmn-mfoot a{font-size:17px;font-weight:600}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMNav(props: NavProps) {
    const {
        links = [
            { label: "The shift", href: "#the-shift" },
            { label: "Who we are", href: "#who-we-are" },
            { label: "What we do", href: "#what-we-do" },
            { label: "The work", href: "#the-work" },
            { label: "What's next", href: "#whats-next" },
        ],
        ctaLabel = "Let's talk",
        ctaHref = "#lets-talk",
        email = "social@worldmedia.co.in",
        phone = "+91 8800 040 301",
        note = "psst… this is our portfolio too",
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const [theme, setTheme] = React.useState<Theme>("ink")
    const [atTop, setAtTop] = React.useState(true)
    const [hidden, setHidden] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(-1)
    const [mounted, setMounted] = React.useState(false)
    const openRef = React.useRef(false)
    openRef.current = open
    const linksRef = React.useRef(links)
    linksRef.current = links

    React.useEffect(() => {
        React.startTransition(() => setMounted(true))
    }, [])

    React.useEffect(() => {
        if (isStatic || typeof window === "undefined") return
        let last = window.scrollY
        let raf = 0
        const st = { t: "ink" as Theme, top: true, hid: false, act: -1 }
        const probe = () => {
            raf = 0
            const y = window.scrollY
            const secs = document.querySelectorAll("section[data-wm-theme]")
            let t: Theme = st.t
            for (let i = 0; i < secs.length; i++) {
                const r = secs[i].getBoundingClientRect()
                if (r.top <= 44 && r.bottom > 44) {
                    t = (secs[i].getAttribute("data-wm-theme") as Theme) || "ink"
                    break
                }
            }
            let act = -1
            const line = window.innerHeight * 0.45
            linksRef.current.forEach((l, i) => {
                const id = (l.href || "").split("#")[1]
                const el = id ? document.getElementById(id) : null
                if (el && el.getBoundingClientRect().top < line) act = i
            })
            const top = y < 24
            let hid = st.hid
            if (!openRef.current) {
                if (y > last + 6 && y > 200) hid = true
                else if (y < last - 6 || top) hid = false
            }
            last = y
            if (t !== st.t || top !== st.top || hid !== st.hid || act !== st.act) {
                st.t = t
                st.top = top
                st.hid = hid
                st.act = act
                React.startTransition(() => {
                    setTheme(t)
                    setAtTop(top)
                    setHidden(hid)
                    setActive(act)
                })
            }
        }
        const onScroll = () => {
            if (!raf) raf = window.requestAnimationFrame(probe)
        }
        probe()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            if (raf) window.cancelAnimationFrame(raf)
        }
    }, [isStatic])

    React.useEffect(() => {
        if (typeof document === "undefined") return
        const html = document.documentElement
        const prev = html.style.overflow
        if (open) html.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") React.startTransition(() => setOpen(false))
        }
        window.addEventListener("keydown", onKey)
        return () => {
            html.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [open])

    const toggle = React.useCallback(() => React.startTransition(() => setOpen((o) => !o)), [])
    const close = React.useCallback(() => React.startTransition(() => setOpen(false)), [])

    const allLinks = links.concat([{ label: ctaLabel, href: ctaHref }])

    const menu = (
        <div className={"wm-sec wmn-menu" + (open ? " open" : "")} data-wm-theme="ink" role="dialog" aria-modal="true" aria-hidden={!open} aria-label="Menu">
            <div className="wmn-mwrap">
                <div className="wmn-mtop">
                    <span className="wmn-mark">
                        world media<b>.</b>
                    </span>
                    <button type="button" className="wmn-close" onClick={close} aria-label="Close menu" tabIndex={open ? 0 : -1}>
                        <i />
                        <i />
                    </button>
                </div>
                <nav className="wmn-mlist" aria-label="Chapters">
                    {allLinks.map((l, i) => (
                        <a key={i} href={l.href} onClick={close} style={cssVars({ "--i": i })} tabIndex={open ? 0 : -1}>
                            <em>{String(i + 1).padStart(2, "0")}</em>
                            <span>{l.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="wmn-mfoot">
                    <a href={"mailto:" + email} tabIndex={open ? 0 : -1}>
                        {email}
                    </a>
                    <a href={"tel:" + phone.replace(/[^+\d]/g, "")} tabIndex={open ? 0 : -1}>
                        {phone}
                    </a>
                    <span className="wm-script wm-red" style={{ fontSize: 24, marginTop: 8, transform: "rotate(-3deg)", display: "inline-block" }}>
                        {note}
                    </span>
                </div>
            </div>
        </div>
    )

    const bar = (
        <div className="wm-sec wmn" data-t={theme} data-top={atTop && !open ? "1" : "0"}>
            <motion.div
                initial={isStatic ? false : { opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: hidden && !open ? -110 : 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                <header className="wmn-bar">
                    <div className="wmn-inner">
                        <a href="#top" className="wmn-mark" aria-label="World Media — back to top">
                            world media<b>.</b>
                        </a>
                        <nav className="wmn-links" aria-label="Chapters">
                            {links.map((l, i) => (
                                <a key={i} className="wmn-a" href={l.href} aria-current={active === i ? "true" : undefined}>
                                    <em>{String(i + 1).padStart(2, "0")}</em>
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                        <div className="wmn-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Magnetic strength={0.22}>
                                <a className="wmn-cta wm-link" href={ctaHref}>
                                    {ctaLabel}
                                    <LineArrow />
                                </a>
                            </Magnetic>
                            <button type="button" className="wmn-burger" onClick={toggle} aria-label="Open menu" aria-expanded={open}>
                                <i />
                                <i />
                            </button>
                        </div>
                    </div>
                </header>
            </motion.div>
        </div>
    )

    const live = mounted && !isStatic && typeof document !== "undefined"

    return (
        <div style={{ ...style, position: "relative" }}>
            <Base />
            <style>{NAV_CSS}</style>
            {isStatic ? bar : null}
            {live ? createPortal(<div className="wmn-fixed">{bar}</div>, document.body) : null}
            {live ? createPortal(menu, document.body) : null}
        </div>
    )
}

addPropertyControls(WMNav, {
    links: {
        type: ControlType.Array,
        title: "Links",
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
        ],
    },
    ctaLabel: { type: ControlType.String, title: "Button", defaultValue: "Let's talk" },
    ctaHref: { type: ControlType.String, title: "Button link", defaultValue: "#lets-talk" },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 8800 040 301" },
    note: { type: ControlType.String, title: "Menu note", defaultValue: "psst… this is our portfolio too" },
})
