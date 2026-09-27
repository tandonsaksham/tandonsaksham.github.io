//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the site navigation. "world media." wordmark (vermilion full stop, as on every
// slide), the chapter index and a vermilion "Let's talk" pill. It adapts to the ink / cream /
// vermilion section underneath, hides on scroll down, and opens a full-screen menu on phones.
// Place the instance at the top of the page, width 100%. On the live site the bar pins itself
// to the top of the window, so the layer itself needs no Fixed or Sticky setting.
// The chapters live in one place only: a folder-tab index at the top centre. It stays out of
// sight at the top of the page and drops in once the reader reaches the first chapter. Every
// chapter you reach files in as a small numbered tab; the front tab shows the chapter, the
// section you're reading and how far through it you are, and opens the full chapter list. It
// sits inside the bar while the bar is showing and hangs from the top edge once the bar slides
// away. On phones the same index is a tab rising from the bottom edge with a growing stack of
// chapter chips.
//@@ BODY

type NavLink = { label: string; href: string }

type NavProps = {
    links: NavLink[]
    ctaLabel: string
    ctaHref: string
    email: string
    phone: string
    note: string
    index: boolean
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
.wmn-cta{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 18px 0 20px;border-radius:99px;background:var(--red);color:var(--ink);font-weight:600;font-size:14.5px;letter-spacing:-.01em;white-space:nowrap;transition:background .35s}
.wmn[data-t="red"] .wmn-cta{background:var(--ink);color:var(--cream)}
.wmn-cta .wm-arrowline{width:1.35em;height:.7em}
.wmn-cta:hover .wm-arrowline{width:1.8em}
.wmn-burger{display:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--nline);background:transparent;color:inherit;cursor:pointer;position:relative}
.wmn-burger i{position:absolute;left:13px;right:13px;height:1.5px;background:currentColor;transition:transform .45s var(--ease),top .45s var(--ease)}
.wmn-burger i:nth-child(1){top:17px}.wmn-burger i:nth-child(2){top:25px}
@container (max-width:980px){.wmn-burger{display:block}.wmn-right .wmn-cta{display:none}}
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
.wmn-ft{position:absolute;left:0;right:0;top:0;display:flex;justify-content:center;pointer-events:none}
.wmn-ft-in{position:relative;display:flex;align-items:flex-start;pointer-events:auto;--r:12px}
.wmn-ft[data-dock="top"] .wmn-ft-in{--r:0 0 14px 14px}
.wmn-ft[data-t="ink"],.wmn-ft[data-t="red"],.wmn-bt[data-t="ink"]{--tb0:#2B2A26;--tb1:#1E1D1B;--tl:rgba(242,238,229,.14);--tf:var(--cream);--tm:rgba(242,238,229,.56)}
.wmn-ft[data-t="cream"],.wmn-bt[data-t="cream"]{--tb0:#FFFDF9;--tb1:#EBE7DD;--tl:rgba(15,15,15,.13);--tf:var(--ink);--tm:rgba(15,15,15,.52)}
.wmn-ft-w{position:relative;flex:none;display:flex;overflow-x:clip}
.wmn-ft-tab{position:relative;display:flex;align-items:center;height:36px;padding:0 12px;border:1px solid var(--tl);border-radius:var(--r);background:var(--tb1);color:var(--tf);
font:inherit;white-space:nowrap;cursor:pointer;box-shadow:0 12px 24px -18px rgba(0,0,0,.6);-webkit-tap-highlight-color:transparent;
transition:border-radius .6s var(--ease),background-color .5s var(--ease),color .5s var(--ease),border-color .5s var(--ease)}
.wmn-ft[data-dock="top"] .wmn-ft-tab{border-top-color:transparent}
.wmn-ft-tab em{font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.02em;color:var(--tm);transition:color .4s}
.wmn-ft-tab b{display:block;max-width:0;overflow:hidden;font-weight:650;font-size:13px;letter-spacing:-.01em;transition:max-width .55s var(--ease)}
.wmn-ft-tab b span{display:block;padding-left:8px}
.wmn-ft-tab:hover b,.wmn-ft-tab:focus-visible b{max-width:190px}
.wmn-ft-tab:hover em,.wmn-ft-tab:focus-visible em{color:var(--red)}
.wmn-ft-tab.cur{z-index:6;padding:0 12px 0 14px;background:var(--tb0)}
.wmn-ft-tab.cur em{color:var(--red)}
.wmn-ft-tab.cur b{max-width:none;min-width:84px;text-align:left}
.wmn-ft-x{display:flex;align-items:center}
.wmn-ft-sub{display:flex;align-items:center;gap:8px;padding-left:12px;font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;color:var(--tm)}
.wmn-ft-sub::before{content:"";flex:none;width:14px;height:1px;background:currentColor;opacity:.7}
.wmn-ft-sub span{display:block;width:16ch;overflow:hidden;text-overflow:ellipsis;text-align:left}
.wmn-ft-pct{min-width:calc(10px + 4ch);padding-left:10px;text-align:right;font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;color:var(--tm)}
.wmn-ft-car,.wmn-bt-car{display:block;width:10px;height:10px;flex:none;color:var(--tm);transition:transform .5s var(--ease)}
.wmn-ft-car{margin-left:10px}
.wmn-ft-tab[aria-expanded="true"] .wmn-ft-car{transform:rotate(180deg)}
.wmn-bt-car{transform:rotate(180deg)}
.wmn-bt-tab[aria-expanded="true"] .wmn-bt-car{transform:none}
.wmn-ft-line,.wmn-bt-line{position:absolute;height:2px;border-radius:2px;background:var(--tl);overflow:hidden}
.wmn-ft-line{left:14px;right:12px;bottom:5px}
.wmn-ft-line i,.wmn-bt-line i{display:block;height:100%;background:var(--red);transform-origin:0 50%}
.wmn-ft-panel,.wmn-bt-sheet{position:absolute;left:50%;padding:8px;border-radius:20px;border:1px solid var(--tl);background:var(--tb0);color:var(--tf);box-shadow:0 28px 56px -24px rgba(0,0,0,.6)}
.wmn-ft-panel{top:calc(100% + 14px);width:344px;margin-left:-172px;transform-origin:50% 0}
.wmn-ft-panel p,.wmn-bt-sheet p{padding:10px 12px 6px;font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--tm)}
.wmn-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:13px;font-weight:600;font-size:15.5px;letter-spacing:-.015em;-webkit-tap-highlight-color:transparent;transition:background-color .3s,opacity .3s}
.wmn-row em{flex:none;font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:11px;font-weight:400;color:var(--tm)}
.wmn-row span{display:flex;flex-direction:column;min-width:0}
.wmn-row small{font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;font-weight:400;letter-spacing:0;color:var(--tm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wmn-row .wmn-tick,.wmn-row .wmn-row-pct{margin-left:auto;flex:none;color:var(--tm)}
.wmn-row .wmn-row-pct{font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px}
.wmn-row.up{opacity:.52}
.wmn-row.cur,.wmn-row:hover{background:var(--tb1);opacity:1}
.wmn-row.cur em{color:var(--red)}
.wmn-row.go{margin-top:6px;background:var(--red);color:var(--ink)}
.wmn-row.go em{color:var(--ink)}
.wmn-row.go .wm-arrowline{margin-left:auto;width:1.6em;height:.7em}
@container (max-width:1120px){.wmn-ft-sub{display:none}}
@container (max-width:860px){.wmn-ft-pct{display:none}}
.wmn-bt.wm-sec{position:fixed;left:50%;bottom:0;z-index:2147481000;width:max-content;max-width:calc(100% - 20px);translate:-50% 0;background:transparent;overflow:visible;container-type:normal;
pointer-events:none;transform:translateY(calc(100% + 24px));transition:transform .6s var(--ease)}
.wmn-bt.on{transform:none}
.wmn-bt-tab{pointer-events:auto;position:relative;display:flex;align-items:center;gap:11px;width:100%;min-width:240px;padding:13px 18px calc(12px + env(safe-area-inset-bottom,0px)) 10px;border:1px solid var(--tl);border-bottom:0;
border-radius:20px 20px 0 0;background:var(--tb0);color:var(--tf);box-shadow:0 -16px 34px -22px rgba(0,0,0,.55);font:inherit;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;
transition:background-color .5s var(--ease),color .5s var(--ease),border-color .5s var(--ease)}
.wmn-bt-line{left:20px;right:20px;top:6px}
.wmn-bt-car{margin-left:auto}
.wmn-chips{display:flex;flex:none}
.wmn-chips i{display:flex;align-items:center;justify-content:flex-start;width:34px;height:34px;margin-left:-13px;padding-left:6px;border-radius:50%;background:var(--tb1);box-shadow:0 0 0 2px var(--tb0);
font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:10px;letter-spacing:-.02em;color:var(--tf);transition:background-color .5s,color .5s,box-shadow .5s,padding .4s var(--ease)}
.wmn-chips i:first-child{margin-left:0}
.wmn-chips i.cur{justify-content:center;padding-left:0;font-size:10.5px;background:var(--red);color:var(--ink)}
.wmn-pl{display:flex;flex-direction:column;min-width:0;line-height:1.22}
.wmn-pl b{font-size:14px;font-weight:650;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wmn-pl small{font-family:"DM Mono",ui-monospace,monospace;font-size:10.5px;color:var(--tm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wmn-bt-sheet{bottom:calc(100% + 10px);width:min(344px,calc(100vw - 20px));translate:-50% 0;pointer-events:auto;transform-origin:50% 100%}
.wmn-tick{display:block;width:12px;height:12px;flex:none}
.wmn-scrim{position:fixed;inset:0;z-index:2147480990;display:block;width:100%;height:100%;margin:0;padding:0;border:0;background:transparent;cursor:default}
@media (max-width:760px){.wmn-ft{display:none}}
@media (min-width:761px){.wmn-bt.wm-sec,.wmn-scrim{display:none}}
`

const pad2 = (i: number) => String(i + 1).padStart(2, "0")

/** Small check mark for chapters already read. */
function Tick() {
    return (
        <svg className="wmn-tick" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.4 6.3 5 8.8l4.6-5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** Small chevron on the index tabs. */
function Caret(p: { className: string }) {
    return (
        <svg className={p.className} viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 3.7 5 6.5l3-2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/** The section tag ("How we work") of a section, used as the sub-line of the index. Chapter openers have none. */
function sectionName(s: Element): string {
    if (s.classList.contains("wmc")) return ""
    const pill = s.querySelector(".wm-chrome .wm-pill")
    return ((pill && pill.textContent) || s.getAttribute("aria-label") || "").trim()
}

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
        index = true,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const reduce = useReducedMotion()
    const [theme, setTheme] = React.useState<Theme>("ink")
    const [atTop, setAtTop] = React.useState(true)
    const [hidden, setHidden] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(-1)
    const [mounted, setMounted] = React.useState(false)
    const [tabTheme, setTabTheme] = React.useState<Theme>("ink")
    const [dockTheme, setDockTheme] = React.useState<Theme>("ink")
    const [section, setSection] = React.useState("")
    const [atEnd, setAtEnd] = React.useState(false)
    const [sheet, setSheet] = React.useState(false)
    const [folder, setFolder] = React.useState(false)
    const [typing, setTyping] = React.useState(false)
    const ftRef = React.useRef<HTMLDivElement>(null)
    const curRef = React.useRef<HTMLButtonElement>(null)
    const progress = useMotionValue(0)
    const percent = useTransform(progress, (v) => Math.round(v * 100) + "%")
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
        const st = { t: "ink" as Theme, top: true, hid: false, act: -1, tt: "ink" as Theme, dt: "ink" as Theme, sec: "", end: false }
        const themeOf = (el: Element) => (el.getAttribute("data-wm-theme") as Theme) || "ink"
        const probe = () => {
            raf = 0
            const y = window.scrollY
            const vh = window.innerHeight
            const line = vh * 0.45
            const top = y < 24
            let hid = st.hid
            if (!openRef.current) {
                if (y > last + 6 && y > 200) hid = true
                else if (y < last - 6 || top) hid = false
            }
            last = y
            // Chapters reached: every chapter whose opener has crossed the reading line.
            const tops: number[] = []
            let act = -1
            linksRef.current.forEach((l, i) => {
                const id = (l.href || "").split("#")[1]
                const el = id ? document.getElementById(id) : null
                tops[i] = el ? el.getBoundingClientRect().top : NaN
                if (el && tops[i] < line) act = i
            })
            // Colour of what sits under the bar, under the folder tabs and under the phone tab.
            const stripMid = hid ? 18 : 44
            const low = vh - 36
            let t = st.t
            let tt = st.tt
            let dt = st.dt
            let sec = ""
            let gt = false
            let gtt = false
            let gdt = false
            const secs = document.querySelectorAll("section[data-wm-theme]")
            for (let i = 0; i < secs.length; i++) {
                const r = secs[i].getBoundingClientRect()
                if (!gt && r.top <= 44 && r.bottom > 44) {
                    t = themeOf(secs[i])
                    gt = true
                }
                if (!gtt && r.top <= stripMid && r.bottom > stripMid) {
                    tt = themeOf(secs[i])
                    gtt = true
                }
                if (!gdt && r.top <= low && r.bottom > low) {
                    dt = themeOf(secs[i])
                    gdt = true
                }
                if (act >= 0 && r.top <= line && r.bottom > line) sec = sectionName(secs[i])
            }
            // How far through the current chapter the reading line is.
            if (act >= 0) {
                let next = NaN
                for (let j = act + 1; j < tops.length; j++)
                    if (!isNaN(tops[j])) {
                        next = tops[j]
                        break
                    }
                if (isNaN(next)) next = document.documentElement.scrollHeight - y - (vh - line)
                progress.set(Math.max(0, Math.min(1, (line - tops[act]) / Math.max(1, next - tops[act]))))
            }
            const end = y + vh >= document.documentElement.scrollHeight - 90
            if (t !== st.t || top !== st.top || hid !== st.hid || act !== st.act || tt !== st.tt || dt !== st.dt || sec !== st.sec || end !== st.end) {
                st.t = t
                st.top = top
                st.hid = hid
                st.act = act
                st.tt = tt
                st.dt = dt
                st.sec = sec
                st.end = end
                React.startTransition(() => {
                    setTheme(t)
                    setAtTop(top)
                    setHidden(hid)
                    setActive(act)
                    setTabTheme(tt)
                    setDockTheme(dt)
                    setSection(sec)
                    setAtEnd(end)
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
    const toggleSheet = React.useCallback(() => React.startTransition(() => setSheet((s) => !s)), [])
    const closeSheet = React.useCallback(() => React.startTransition(() => setSheet(false)), [])

    const allLinks = links.concat([{ label: ctaLabel, href: ctaHref }])

    // Scroll index: the chapters reached so far, newest last. Nothing shows before the first chapter.
    const reached = index && !isStatic && active >= 0 ? links.slice(0, active + 1) : []
    const current = reached.length ? reached[reached.length - 1] : null
    const on = current !== null
    const dockOn = on && !atEnd && !open && !typing
    const sub = section || "Intro"

    // The phone tab steps aside while someone is typing into a form, so it never covers a field.
    React.useEffect(() => {
        if (isStatic || typeof document === "undefined") return
        const field = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input,textarea,select,[contenteditable]")
        const onIn = (e: FocusEvent) => {
            if (field(e.target)) React.startTransition(() => setTyping(true))
        }
        const onOut = (e: FocusEvent) => {
            if (!field(e.relatedTarget)) React.startTransition(() => setTyping(false))
        }
        document.addEventListener("focusin", onIn)
        document.addEventListener("focusout", onOut)
        return () => {
            document.removeEventListener("focusin", onIn)
            document.removeEventListener("focusout", onOut)
        }
    }, [isStatic])

    React.useEffect(() => {
        if (!dockOn) React.startTransition(() => setSheet(false))
    }, [dockOn])

    React.useEffect(() => {
        if (open || !on) React.startTransition(() => setFolder(false))
    }, [open, on])

    React.useEffect(() => {
        if (!sheet || typeof window === "undefined") return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") React.startTransition(() => setSheet(false))
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [sheet])

    // The folder panel closes on a click elsewhere, on Escape, or once the reader scrolls on.
    React.useEffect(() => {
        if (!folder || typeof window === "undefined") return
        const y0 = window.scrollY
        const shut = () => React.startTransition(() => setFolder(false))
        const onDown = (e: PointerEvent) => {
            const el = ftRef.current
            if (el && e.target instanceof Node && el.contains(e.target)) return
            shut()
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return
            shut()
            if (curRef.current) curRef.current.focus()
        }
        const onScroll = () => {
            if (Math.abs(window.scrollY - y0) > 160) shut()
        }
        document.addEventListener("pointerdown", onDown)
        window.addEventListener("keydown", onKey)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            document.removeEventListener("pointerdown", onDown)
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("scroll", onScroll)
        }
    }, [folder])

    const toggleFolder = React.useCallback(() => React.startTransition(() => setFolder((f) => !f)), [])
    const closeFolder = React.useCallback(() => React.startTransition(() => setFolder(false)), [])

    const ease = [0.16, 1, 0.3, 1] as const
    const docked = hidden && !open
    const past = reached.slice(0, -1)

    // Every chapter, ticked once read, with the one you're in highlighted — shared by the folder panel and the phone sheet.
    const rows = (onPick: () => void) => (
        <>
            {links.map((l, i) => (
                <a
                    key={l.href || "r" + i}
                    href={l.href}
                    className={"wmn-row" + (i === active ? " cur" : i > active ? " up" : "")}
                    aria-current={i === active ? "location" : undefined}
                    onClick={onPick}
                >
                    <em>{pad2(i)}</em>
                    <span>
                        {l.label}
                        {i === active && section ? <small>{section}</small> : null}
                    </span>
                    {i < active ? <Tick /> : i === active && on ? <motion.span className="wmn-row-pct">{percent}</motion.span> : null}
                </a>
            ))}
            <a href={ctaHref} className="wmn-row go" onClick={onPick}>
                <em>{pad2(links.length)}</em>
                <span>{ctaLabel}</span>
                <LineArrow />
            </a>
        </>
    )

    // Hidden at the top of the page; drops in from the top edge (or rises into the bar) with the first chapter.
    const strip = (
        <AnimatePresence initial={false}>
            {current ? (
                <motion.div
                    key="ft"
                    className="wmn-ft"
                    data-t={tabTheme}
                    data-dock={docked ? "top" : "bar"}
                    initial={{ y: docked ? -44 : 12, opacity: 0 }}
                    animate={{ y: docked ? 0 : 26, opacity: 1 }}
                    exit={{ y: docked ? -44 : 12, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.7, ease, opacity: { duration: reduce ? 0 : 0.35 } }}
                >
                    <div className="wmn-ft-in" ref={ftRef}>
                        <AnimatePresence initial={false}>
                            {past.map((l, i) => (
                                <motion.div
                                    key={l.href || "t" + i}
                                    className="wmn-ft-w"
                                    style={{ zIndex: i + 1 }}
                                    initial={{ width: 0, marginRight: 0, opacity: 0 }}
                                    animate={{ width: "auto", marginRight: -7, opacity: 1 }}
                                    exit={{ width: 0, marginRight: 0, opacity: 0 }}
                                    transition={{ duration: reduce ? 0 : 0.6, ease }}
                                >
                                    <a className="wmn-ft-tab" href={l.href} aria-label={"Chapter " + pad2(i) + ", " + l.label}>
                                        <em>{pad2(i)}</em>
                                        <b>
                                            <span>{l.label}</span>
                                        </b>
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <button
                            ref={curRef}
                            type="button"
                            className="wmn-ft-tab cur"
                            onClick={toggleFolder}
                            aria-expanded={folder}
                            aria-label={"Chapter " + pad2(active) + ", " + current.label + ", " + sub + ". Show all chapters"}
                        >
                            <em>{pad2(active)}</em>
                            <b>
                                <span>{current.label}</span>
                            </b>
                            <span className="wmn-ft-x" aria-hidden="true">
                                <span className="wmn-ft-sub">
                                    <span>{sub}</span>
                                </span>
                                <motion.span className="wmn-ft-pct">{percent}</motion.span>
                            </span>
                            <Caret className="wmn-ft-car" />
                            <span className="wmn-ft-line" aria-hidden="true">
                                <motion.i style={{ scaleX: progress }} />
                            </span>
                        </button>
                        <AnimatePresence>
                            {folder ? (
                                <motion.nav
                                    className="wmn-ft-panel"
                                    aria-label="Chapters"
                                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                    transition={{ duration: reduce ? 0 : 0.35, ease }}
                                >
                                    <p>Chapters</p>
                                    {rows(closeFolder)}
                                </motion.nav>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )

    const tab = (
        <div className={"wm-sec wmn-bt" + (dockOn ? " on" : "")} data-t={dockTheme === "ink" ? "cream" : "ink"} aria-hidden={!dockOn}>
            <AnimatePresence>
                {sheet && dockOn ? (
                    <motion.nav
                        className="wmn-bt-sheet"
                        aria-label="Chapters"
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: reduce ? 0 : 0.35, ease }}
                    >
                        <p>Chapters</p>
                        {rows(closeSheet)}
                    </motion.nav>
                ) : null}
            </AnimatePresence>
            <button
                type="button"
                className="wmn-bt-tab"
                onClick={toggleSheet}
                aria-expanded={sheet}
                tabIndex={dockOn ? 0 : -1}
                aria-label={current ? "Chapter " + pad2(active) + ", " + current.label + ", " + sub + ". Show all chapters" : "Chapters"}
            >
                <span className="wmn-bt-line" aria-hidden="true">
                    <motion.i style={{ scaleX: progress }} />
                </span>
                <span className="wmn-chips" aria-hidden="true">
                    <AnimatePresence initial={false}>
                        {reached.map((l, i) => (
                            <motion.i
                                key={l.href || "p" + i}
                                className={i === active ? "cur" : undefined}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 28 }}
                            >
                                {pad2(i)}
                            </motion.i>
                        ))}
                    </AnimatePresence>
                </span>
                <span className="wmn-pl" aria-hidden="true">
                    <b>{current ? current.label : ""}</b>
                    <small>{sub}</small>
                </span>
                <Caret className="wmn-bt-car" />
            </button>
        </div>
    )

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
            {strip}
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
            {live && index ? createPortal(tab, document.body) : null}
            {live && sheet && dockOn ? createPortal(<button type="button" className="wmn-scrim" aria-label="Close chapter list" onClick={closeSheet} />, document.body) : null}
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
    index: { type: ControlType.Boolean, title: "Scroll index", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
})
