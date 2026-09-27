//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the site navigation. "world media." wordmark (vermilion full stop, as on every
// slide), chapter links, a vermilion "Let's talk" pill. It adapts to the ink / cream /
// vermilion section underneath, hides on scroll down, and opens a full-screen menu on phones.
// Place the instance at the top of the page, width 100%. On the live site the bar pins itself
// to the top of the window, so the layer itself needs no Fixed or Sticky setting.
//@@ BODY

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
