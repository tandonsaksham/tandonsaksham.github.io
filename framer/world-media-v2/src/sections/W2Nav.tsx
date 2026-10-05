//@@ INSTRUCTIONS
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
//@@ BODY

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
