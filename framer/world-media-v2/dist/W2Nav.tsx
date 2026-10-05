// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the top menu. On the left, a small spinning globe (World Media) that takes you
// back to the top; on the right, colourful pills for Services, Projects, About, Contact and
// Join us. Contact opens the form as a brand, Join us as a creator. On phones the pills fold
// into a Menu pill with a full-screen sheet. Place it at the top of the page, width 100%;
// on the live site it pins itself to the top of the window. In the separate-pages version
// (Links go to: Separate pages) the pills open the Services, Projects, About and Contact pages
// and the globe goes back to the landing page.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, Link, useIsStaticRenderer } from "framer"
import { motion, useInView, useReducedMotion } from "framer-motion"

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

type Hue = "paper" | "ink" | "red"

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

/** Adds w2-in once the element is in view (or straight away when still). */
function useReveal<T extends Element>(amount = 0.25): [React.RefObject<T>, string] {
    const ref = React.useRef<T>(null)
    const still = useStill()
    const seen = useInView(ref, { once: true, amount })
    return [ref, still || seen ? " w2-in" : ""]
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
            style={cssVars({ "--mw": p.width || "1.7em", "--mc": "var(--" + (p.hue || "paper2") + ")", "--d": (p.delay || 0) + "s" })}
        >
            <i>{p.video ? <video src={p.video} autoPlay={!still} muted loop playsInline /> : p.src ? <img src={p.src} alt={p.alt || ""} loading="lazy" width={320} height={150} /> : <b />}</i>
        </span>
    )
}

/** A small wireframe globe; the meridians turn like a spinning planet. */
function Globe(p: { size?: number; color?: string; speed?: number; width?: number; className?: string }) {
    const s = p.speed || 9
    const sw = p.width || 1.6
    return (
        <svg className={"w2-globe " + (p.className || "")} width={p.size || 24} height={p.size || 24} viewBox="0 0 40 40" fill="none" stroke={p.color || "currentColor"} strokeWidth={sw} aria-hidden="true">
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="17" ry="6.2" strokeOpacity=".55" />
            <path d="M3.6 14h32.8M3.6 26h32.8" strokeOpacity=".4" />
            {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} className="m" cx="20" cy="20" rx="17" ry="17" style={cssVars({ "--gs": s + "s", "--gd": (-s * k) / 4 + "s" })} />
            ))}
        </svg>
    )
}

/**
 * The separate-pages version. Each page is named by its Framer page ID (from the project's list of pages),
 * so a link still finds its page when the page's address changes, as when the landing becomes the home page.
 */
const PAGE_IDS: Record<string, string> = {
    landing: "IL130MR8X",
    services: "LZJ9l6m1b",
    projects: "zQKzoYWRy",
    about: "K2GkWebhw",
    contact: "Wsobihx9y",
}

/** Where the globe goes in the separate-pages version. */
const HOME = "./landing"

/** The menu of the separate-pages version. The menu and the footer share it, so every page shows the same links. */
const PAGE_LINKS: { label: string; href: string; hue: Hue }[] = [
    { label: "Services", href: "./services", hue: "paper" },
    { label: "Projects", href: "./projects", hue: "paper" },
    { label: "About", href: "./about", hue: "paper" },
    { label: "Contact", href: "./contact", hue: "ink" },
    { label: "Join us", href: "./contact#join", hue: "red" },
]

/** The page an address points at, as its last segment: "./contact#join" and "/contact" both give "contact". */
function pageOf(href: string): string {
    const s = href.split("#")[0].replace(/\/+$/, "").split("/").pop() || ""
    return s === "." ? "" : s
}

/** One of the site's pages, as Framer's Link wants it: "./contact#join" gives the Contact page and "join". Other addresses give nothing. */
function pageTarget(href: string): { webPageId: string; hash?: string } | undefined {
    if (/^([a-z][\w+.-]*:|\/\/)/i.test(href)) return undefined
    const id = PAGE_IDS[pageOf(href)]
    if (!id) return undefined
    const hash = href.split("#")[1]
    return hash ? { webPageId: id, hash } : { webPageId: id }
}

type PageAProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { "data-framer-page-link-current"?: boolean }

/** The link itself. Framer's Link hands it the page's address, the click that goes there, and whether it is the page you are on. */
const PageA = React.forwardRef<HTMLAnchorElement, PageAProps>(function PageA(p, ref) {
    return <a ref={ref} {...p} aria-current={p["data-framer-page-link-current"] ? "page" : p["aria-current"]} />
})

/**
 * A link to one of the site's pages goes through Framer's Link, which moves between pages the way Framer's
 * own links do, in Preview and on the live site. Any other address stays a plain link.
 */
function PageLink(p: PageAProps & { href: string }) {
    const to = pageTarget(p.href)
    if (!to) return <a {...p} />
    return (
        <Link href={to}>
            <PageA {...p} />
        </Link>
    )
}

/**
 * Contact and Join us share one form, and a link to it says which side to open. A form on this page
 * hears it at once; a form on the next page finds the note when it opens. #join in the address, as in
 * a link from outside the site, opens the Creator side too.
 */
function pickSide(href: string) {
    if (typeof window === "undefined") return
    const hash = href.split("#")[1] || ""
    const side = hash === "join" ? "creator" : hash === "contact" || (!hash && pageOf(href) === "contact") ? "brand" : ""
    ;(window as any).__w2side = side
    if (side) window.dispatchEvent(new CustomEvent("w2:form", { detail: side }))
}

type NavLink = { label: string; href: string; hue: Hue }

type NavProps = {
    mode: "sections" | "pages"
    links: NavLink[]
    email: string
    phone: string
    note: string
    style?: React.CSSProperties
}

/** One long page glides to its sections. Between pages it would glide each new page up from the old scroll position, so it is left out. */
const SMOOTH_CSS = `
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}`

/** Room for the menu when the page jumps to a section. It sits outside the floating bar, so it is in place from the first paint. */
const PAD_CSS = `html{scroll-padding-top:84px}`

const NAV_CSS = `
.w2n-skip{position:absolute;left:12px;top:-60px;z-index:3;pointer-events:auto;transition:top .3s var(--ease)}
.w2n-skip:focus-visible{top:12px}
section.w2[tabindex="-1"]:focus{outline:none}
.w2n-fixed{position:fixed;top:0;left:0;right:0;z-index:2147482000;pointer-events:none}
.w2n.w2{background:transparent;overflow:visible}
.w2n-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(10px,1.1cqw,16px) clamp(10px,1.1cqw,16px) 0}
.w2n-globe{pointer-events:auto;position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:13px;background:var(--ink);color:var(--red);
box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);cursor:pointer;border:0;padding:0;transition:scale .5s var(--ease)}
.w2n-globe:hover{scale:1.06}
.w2n-globe:hover .w2-globe .m{animation-duration:2.6s}
.w2n-pills{pointer-events:auto;display:flex;align-items:center;gap:6px}
.w2n-pills .w2-pill{box-shadow:0 6px 18px -10px rgba(0,0,0,.45)}
.w2n-pills .w2-pill:is([data-hue="paper"],[data-hue="lime"],[data-hue="sky"],[data-hue="lilac"]){box-shadow:inset 0 0 0 1px rgba(10,10,10,.12),0 6px 18px -10px rgba(0,0,0,.45)}
.w2n .w2-pill[data-hue="ink"]{box-shadow:inset 0 0 0 1px rgba(255,255,255,.22),0 6px 18px -10px rgba(0,0,0,.45)}
.w2n-pills .w2-pill:hover{translate:0 -2px}
.w2n-pills .w2-pill[aria-current]::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;margin-right:2px}
.w2n-menu{display:none}
@container (max-width:760px){.w2n-pills{display:none}.w2n-menu{display:inline-flex;pointer-events:auto}}
.w2n-sheet.w2{position:fixed;inset:0;z-index:2147483000;height:100%;overflow:auto;overscroll-behavior:contain;background:var(--paper);color:var(--ink);
clip-path:inset(0 0 100% 0 round 0 0 28px 28px);visibility:hidden;transition:clip-path .8s var(--ease-io),visibility 0s linear .8s}
.w2n-sheet.w2.open{clip-path:inset(0 0 0 0 round 0);visibility:visible;transition:clip-path .8s var(--ease-io),visibility 0s}
.w2n-swrap{min-height:100%;display:flex;flex-direction:column;gap:28px;padding:12px 12px 28px}
.w2n-stop{display:flex;align-items:center;justify-content:space-between}
.w2n-list{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:10px}
.w2n-list .w2-pill{height:auto;padding:.16em .5em .2em;font-size:clamp(40px,13cqw,72px);letter-spacing:-.045em;translate:0 24px;opacity:0;transition:translate .8s var(--ease),opacity .5s}
.w2n-sheet.open .w2n-list .w2-pill{translate:0 0;opacity:1;transition-delay:calc(.2s + var(--i) * .06s)}
.w2n-foot{display:flex;flex-direction:column;gap:6px;font-size:16px}
.w2n-foot .w2-it{font-size:22px;color:var(--red);margin-top:6px}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Nav(props: NavProps) {
    const {
        mode = "sections",
        links = [
            { label: "Services", href: "#services", hue: "paper" as Hue },
            { label: "Projects", href: "#projects", hue: "paper" as Hue },
            { label: "About", href: "#about", hue: "paper" as Hue },
            { label: "Contact", href: "#contact", hue: "ink" as Hue },
            { label: "Join us", href: "#join", hue: "red" as Hue },
        ],
        email = "social@worldmedia.co.in",
        phone = "+91 8800 040 301",
        note = "psst… this site is our portfolio too",
        style,
    } = props

    const pages = mode === "pages"
    const items = pages ? PAGE_LINKS : links
    const isStatic = useIsStaticRenderer()
    const [mounted, setMounted] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState("")
    const menuBtn = React.useRef<HTMLButtonElement>(null)
    const closeBtn = React.useRef<HTMLButtonElement>(null)
    const wasOpen = React.useRef(false)
    const linksRef = React.useRef(items)
    linksRef.current = items

    // The bar lives at the very start of the page, so Tab reaches the skip link and menu first.
    const [host, setHost] = React.useState<HTMLElement | null>(null)
    React.useEffect(() => {
        if (isStatic || typeof document === "undefined") return
        const el = document.createElement("div")
        el.className = "w2n-host"
        document.body.prepend(el)
        React.startTransition(() => {
            setHost(el)
            setMounted(true)
        })
        return () => {
            el.remove()
        }
    }, [isStatic])

    // On one long page, the pill of the section under the middle of the screen gets a dot. On separate
    // pages, Framer's Link marks the pill of the page you are on.
    React.useEffect(() => {
        if (isStatic || pages || typeof window === "undefined") return
        let raf = 0
        const probe = () => {
            raf = 0
            const mid = window.innerHeight * 0.5
            let cur = ""
            linksRef.current.forEach((l) => {
                const id = (l.href || "").split("#")[1]
                const el = id ? document.getElementById(id) : null
                if (!el) return
                const r = el.getBoundingClientRect()
                if (r.top <= mid && r.bottom > mid) cur = l.href
            })
            React.startTransition(() => setActive(cur))
        }
        const on = () => {
            if (!raf) raf = window.requestAnimationFrame(probe)
        }
        probe()
        window.addEventListener("scroll", on, { passive: true })
        window.addEventListener("resize", on)
        return () => {
            window.removeEventListener("scroll", on)
            window.removeEventListener("resize", on)
            if (raf) window.cancelAnimationFrame(raf)
        }
    }, [isStatic, pages])

    React.useEffect(() => {
        if (typeof document === "undefined") return
        const html = document.documentElement
        const prev = html.style.overflow
        if (open) html.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") React.startTransition(() => setOpen(false))
        }
        window.addEventListener("keydown", onKey)
        // Move focus into the sheet when it opens, and back to the Menu button when it closes.
        if (open) window.setTimeout(() => closeBtn.current && closeBtn.current.focus(), 60)
        else if (wasOpen.current && menuBtn.current) menuBtn.current.focus()
        wasOpen.current = open
        return () => {
            html.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [open])

    // The globe goes back to the top; on separate pages, Framer's Link takes it to the landing page.
    const toTop = React.useCallback(
        (e: React.MouseEvent) => {
            if (typeof window === "undefined") return
            setOpen(false)
            if (pages) return
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
        },
        [pages]
    )

    // On separate pages, skip to the page's first section, whichever it is.
    const skip = React.useCallback((e: React.MouseEvent) => {
        const first = document.querySelector<HTMLElement>("section.w2")
        if (!first) return
        e.preventDefault()
        first.tabIndex = -1
        first.focus({ preventScroll: true })
        first.scrollIntoView()
    }, [])

    const home = pages ? HOME : "#top"
    const homeLabel = pages ? "World Media, home" : "World Media, back to the top"

    const globe = (
        <PageLink href={home} className="w2n-globe" onClick={toTop} aria-label={homeLabel}>
            <Globe size={28} speed={9} width={1.7} />
        </PageLink>
    )

    const bar = (
        <div className="w2 w2n" data-tone="paper">
            <Base />
            <style dangerouslySetInnerHTML={{ __html: pages ? NAV_CSS : SMOOTH_CSS + NAV_CSS }} />
            <a className="w2-pill w2n-skip" data-hue="paper" href={pages ? "#top" : "#hello"} onClick={pages ? skip : undefined}>
                Skip to content
            </a>
            <header className="w2n-bar">
                {globe}
                <nav className="w2n-pills" aria-label="Main">
                    {items.map((l, i) => (
                        <PageLink key={i} className="w2-pill" data-hue={l.hue} href={l.href} aria-current={active === l.href ? "true" : undefined} onClick={() => pickSide(l.href)}>
                            <Roll>{l.label}</Roll>
                        </PageLink>
                    ))}
                </nav>
                <button ref={menuBtn} type="button" className="w2-pill w2n-menu" data-hue="ink" onClick={() => setOpen(true)} aria-expanded={open} aria-label="Open menu">
                    <Roll>Menu</Roll>
                </button>
            </header>
        </div>
    )

    const sheet = (
        <div className={"w2 w2n-sheet" + (open ? " open" : "")} data-tone="paper" role="dialog" aria-modal="true" aria-hidden={!open} aria-label="Menu">
            <Base />
            <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
            <div className="w2n-swrap">
                <div className="w2n-stop">
                    <PageLink href={home} className="w2n-globe" onClick={toTop} aria-label={homeLabel} tabIndex={open ? 0 : -1}>
                        <Globe size={28} speed={9} width={1.7} />
                    </PageLink>
                    <button ref={closeBtn} type="button" className="w2-pill" data-hue="ink" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                        Close
                    </button>
                </div>
                <nav className="w2n-list" aria-label="Main">
                    {items.map((l, i) => (
                        <PageLink
                            key={i}
                            className="w2-pill"
                            data-hue={l.hue}
                            href={l.href}
                            style={cssVars({ "--i": i })}
                            tabIndex={open ? 0 : -1}
                            onClick={() => {
                                pickSide(l.href)
                                setOpen(false)
                            }}
                        >
                            {l.label}
                        </PageLink>
                    ))}
                </nav>
                <div className="w2n-foot">
                    <a href={"mailto:" + email} tabIndex={open ? 0 : -1}>
                        {email}
                    </a>
                    <a href={"tel:" + phone.replace(/[^+\d]/g, "")} tabIndex={open ? 0 : -1}>
                        {phone}
                    </a>
                    <span className="w2-it">{note}</span>
                </div>
            </div>
        </div>
    )

    const live = mounted && !isStatic && typeof document !== "undefined"

    return (
        <div style={{ ...style, position: "relative" }}>
            <style dangerouslySetInnerHTML={{ __html: PAD_CSS }} />
            {isStatic ? bar : null}
            {live && host ? createPortal(<div className="w2n-fixed">{bar}</div>, host) : null}
            {live ? createPortal(sheet, document.body) : null}
        </div>
    )
}

addPropertyControls(W2Nav, {
    mode: {
        type: ControlType.Enum,
        title: "Links go to",
        options: ["sections", "pages"],
        optionTitles: ["Sections on this page", "Separate pages"],
        defaultValue: "sections",
        description: "Separate pages: the Services, Projects, About and Contact pages, with the same menu on every page.",
    },
    links: {
        type: ControlType.Array,
        title: "Menu",
        hidden: (p: Partial<NavProps>) => p.mode === "pages",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
                hue: {
                    type: ControlType.Enum,
                    title: "Colour",
                    options: ["paper", "ink", "red"],
                    optionTitles: ["White", "Black", "Orange-red"],
                },
            },
        },
        defaultValue: [
            { label: "Services", href: "#services", hue: "paper" },
            { label: "Projects", href: "#projects", hue: "paper" },
            { label: "About", href: "#about", hue: "paper" },
            { label: "Contact", href: "#contact", hue: "ink" },
            { label: "Join us", href: "#join", hue: "red" },
        ],
    },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 8800 040 301" },
    note: { type: ControlType.String, title: "Menu note", defaultValue: "psst… this site is our portfolio too" },
})
