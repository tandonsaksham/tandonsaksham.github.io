//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the top menu. On the left, a small spinning globe (World Media) that takes you
// back to the top; on the right, colourful pills for Services, Projects, About, Contact and
// Join us. Contact opens the form as a brand, Join us as a creator. On phones the pills fold
// into a Menu pill with a full-screen sheet. Place it at the top of the page, width 100%;
// on the live site it pins itself to the top of the window.
//@@ BODY

type NavLink = { label: string; href: string; hue: Hue }

type NavProps = {
    links: NavLink[]
    email: string
    phone: string
    note: string
    style?: React.CSSProperties
}

const NAV_CSS = `
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
html{scroll-padding-top:84px}
.w2n-skip{position:absolute;left:12px;top:-60px;z-index:3;pointer-events:auto;transition:top .3s var(--ease)}
.w2n-skip:focus-visible{top:12px}
.w2n-fixed{position:fixed;top:0;left:0;right:0;z-index:2147482000;pointer-events:none}
.w2n.w2{background:transparent;overflow:visible}
.w2n-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(10px,1.1cqw,16px) clamp(10px,1.1cqw,16px) 0}
.w2n-globe{pointer-events:auto;position:relative;display:grid;place-items:center;width:46px;height:46px;border-radius:13px;background:var(--ink);color:var(--lime);
box-shadow:inset 0 0 0 1px rgba(255,248,241,.14);cursor:pointer;border:0;padding:0;transition:scale .5s var(--ease)}
.w2n-globe:hover{scale:1.06}
.w2n-globe:hover .w2-globe .m{animation-duration:2.6s}
.w2n-pills{pointer-events:auto;display:flex;align-items:center;gap:6px}
.w2n-pills .w2-pill{box-shadow:0 6px 18px -10px rgba(22,21,20,.45)}
.w2n .w2-pill[data-hue="ink"]{box-shadow:inset 0 0 0 1px rgba(255,248,241,.22),0 6px 18px -10px rgba(22,21,20,.45)}
.w2n-pills .w2-pill:hover{translate:0 -2px}
.w2n-pills .w2-pill[aria-current="true"]::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;margin-right:2px}
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
        links = [
            { label: "Services", href: "#services", hue: "red" as Hue },
            { label: "Projects", href: "#projects", hue: "lime" as Hue },
            { label: "About", href: "#about", hue: "sky" as Hue },
            { label: "Contact", href: "#contact", hue: "ink" as Hue },
            { label: "Join us", href: "#join", hue: "lilac" as Hue },
        ],
        email = "social@worldmedia.co.in",
        phone = "+91 8800 040 301",
        note = "psst… this site is our portfolio too",
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const [mounted, setMounted] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState("")
    const menuBtn = React.useRef<HTMLButtonElement>(null)
    const closeBtn = React.useRef<HTMLButtonElement>(null)
    const wasOpen = React.useRef(false)
    const linksRef = React.useRef(links)
    linksRef.current = links

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

    // The pill of the section under the middle of the screen gets a dot.
    React.useEffect(() => {
        if (isStatic || typeof window === "undefined") return
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
        // Move focus into the sheet when it opens, and back to the Menu button when it closes.
        if (open) window.setTimeout(() => closeBtn.current && closeBtn.current.focus(), 60)
        else if (wasOpen.current && menuBtn.current) menuBtn.current.focus()
        wasOpen.current = open
        return () => {
            html.style.overflow = prev
            window.removeEventListener("keydown", onKey)
        }
    }, [open])

    // Contact and Join us share one form; tell it which side to show.
    const pick = React.useCallback((href: string) => {
        if (typeof window === "undefined") return
        if (href === "#join") window.dispatchEvent(new CustomEvent("w2:form", { detail: "creator" }))
        else if (href === "#contact") window.dispatchEvent(new CustomEvent("w2:form", { detail: "brand" }))
    }, [])

    const toTop = React.useCallback((e: React.MouseEvent) => {
        if (typeof window === "undefined") return
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
        setOpen(false)
    }, [])

    const globe = (
        <a href="#top" className="w2n-globe" onClick={toTop} aria-label="World Media, back to the top">
            <Globe size={28} speed={9} width={1.7} />
        </a>
    )

    const bar = (
        <div className="w2 w2n" data-tone="paper">
            <Base />
            <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
            <a className="w2-pill w2n-skip" data-hue="paper" href="#hello">
                Skip to content
            </a>
            <header className="w2n-bar">
                {globe}
                <nav className="w2n-pills" aria-label="Main">
                    {links.map((l, i) => (
                        <a
                            key={i}
                            className="w2-pill"
                            data-hue={l.hue}
                            href={l.href}
                            aria-current={active === l.href ? "true" : undefined}
                            onClick={() => pick(l.href)}
                        >
                            <Roll>{l.label}</Roll>
                        </a>
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
                    <a href="#top" className="w2n-globe" onClick={toTop} aria-label="World Media, back to the top" tabIndex={open ? 0 : -1}>
                        <Globe size={28} speed={9} width={1.7} />
                    </a>
                    <button ref={closeBtn} type="button" className="w2-pill" data-hue="ink" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                        Close
                    </button>
                </div>
                <nav className="w2n-list" aria-label="Main">
                    {links.map((l, i) => (
                        <a
                            key={i}
                            className="w2-pill"
                            data-hue={l.hue}
                            href={l.href}
                            style={cssVars({ "--i": i })}
                            tabIndex={open ? 0 : -1}
                            onClick={() => {
                                pick(l.href)
                                setOpen(false)
                            }}
                        >
                            {l.label}
                        </a>
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
            {isStatic ? bar : null}
            {live && host ? createPortal(<div className="w2n-fixed">{bar}</div>, host) : null}
            {live ? createPortal(sheet, document.body) : null}
        </div>
    )
}

addPropertyControls(W2Nav, {
    links: {
        type: ControlType.Array,
        title: "Menu",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
                hue: {
                    type: ControlType.Enum,
                    title: "Colour",
                    options: ["red", "lime", "sky", "lilac", "ink", "paper"],
                    optionTitles: ["Red", "Lime", "Sky", "Lilac", "Ink", "Paper"],
                },
            },
        },
        defaultValue: [
            { label: "Services", href: "#services", hue: "red" },
            { label: "Projects", href: "#projects", hue: "lime" },
            { label: "About", href: "#about", hue: "sky" },
            { label: "Contact", href: "#contact", hue: "ink" },
            { label: "Join us", href: "#join", hue: "lilac" },
        ],
    },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 8800 040 301" },
    note: { type: ControlType.String, title: "Menu note", defaultValue: "psst… this site is our portfolio too" },
})
