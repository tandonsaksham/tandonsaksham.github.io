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
type Tone = "stone" | "red" | "mut" | "fg" | "ink" | "cream"
type Part = { t: string; c?: Tone }

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

type WordsProps = {
    text?: string
    parts?: Part[]
    as?: any
    className?: string
    style?: React.CSSProperties
    delay?: number
    stagger?: number
    amount?: number
}

/** Word-by-word masked rise. "\n" in the text forces a line break. */
function Words(p: WordsProps) {
    const Tag = p.as || "span"
    const parts: Part[] = p.parts && p.parts.length ? p.parts : [{ t: p.text || "" }]
    const [ref, inCls] = useIn<HTMLElement>(p.amount ?? 0.3)
    const delay = p.delay ?? 0
    const stagger = p.stagger ?? 0.055
    let i = 0
    const full = parts.map((x) => x.t).join("").replace(/\n/g, " ")
    return (
        <Tag ref={ref} className={"wm-rv " + (p.className || "") + inCls} style={p.style} aria-label={full}>
            {parts.map((part, pi) =>
                part.t.split(/(\s+)/).map((w, wi) => {
                    if (!w) return null
                    if (/^\s+$/.test(w))
                        return w.indexOf("\n") > -1 ? (
                            <React.Fragment key={pi + "-" + wi}>
                                {" "}
                                <br />
                            </React.Fragment>
                        ) : (
                            <React.Fragment key={pi + "-" + wi}> </React.Fragment>
                        )
                    const d = delay + i++ * stagger
                    return (
                        <span className="wm-w" aria-hidden="true" key={pi + "-" + wi}>
                            <span className={part.c ? "wm-" + part.c : undefined} style={cssVars({ "--d": d.toFixed(3) + "s" })}>
                                {fill(w)}
                            </span>
                        </span>
                    )
                })
            )}
        </Tag>
    )
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

function Rise(p: BoxProps) {
    const { as, className, style, delay, amount, children, ...rest } = p
    const Tag = as || "div"
    const [ref, inCls] = useIn<HTMLElement>(amount ?? 0.25)
    return (
        <Tag ref={ref} className={"wm-rise " + (className || "") + inCls} style={{ ...cssVars({ "--d": (delay || 0) + "s" }), ...style }} {...rest}>
            {children}
        </Tag>
    )
}

function Fade(p: BoxProps) {
    const { as, className, style, delay, amount, children, ...rest } = p
    const Tag = as || "div"
    const [ref, inCls] = useIn<HTMLElement>(amount ?? 0.25)
    return (
        <Tag ref={ref} className={"wm-fade " + (className || "") + inCls} style={{ ...cssVars({ "--d": (delay || 0) + "s" }), ...style }} {...rest}>
            {children}
        </Tag>
    )
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

const ARROWS: Record<string, { vb: string; body: string; head: string }> = {
    curl: { vb: "0 0 120 96", body: "M100 6 C 110 36, 94 70, 28 80", head: "M44 67 L 26 80.5 L 46 90" },
    hook: { vb: "0 0 96 84", body: "M12 4 C 1 32, 7 60, 70 64", head: "M55 51 L 72 64 L 55 77" },
    long: { vb: "0 0 240 40", body: "M4 20 C 70 18, 150 22, 226 20", head: "M206 6 L 230 20 L 206 34" },
    down: { vb: "0 0 60 110", body: "M30 4 C 26 40, 36 70, 30 98", head: "M16 84 L 30 100 L 44 84" },
    swoop: { vb: "0 0 150 80", body: "M6 64 C 40 10, 100 6, 138 40", head: "M118 34 L 140 42 L 132 20" },
}

type ArrowProps = { kind?: string; className?: string; style?: React.CSSProperties; delay?: number; stroke?: number }

/** Hand-drawn arrow, stroked on when it scrolls into view. */
function Arrow(p: ArrowProps) {
    const a = ARROWS[p.kind || "curl"] || ARROWS.curl
    const [ref, inCls] = useIn<SVGSVGElement>(0.5)
    return (
        <svg
            ref={ref}
            className={"wm-svg " + (p.className || "") + inCls}
            viewBox={a.vb}
            fill="none"
            stroke="currentColor"
            strokeWidth={p.stroke ?? 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}
            aria-hidden="true"
        >
            <path d={a.body} pathLength={1} />
            <path className="h" d={a.head} pathLength={1} />
        </svg>
    )
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

/** The deck's cream label block behind a word — wipes on, then the word slides in. */
function Mark(p: { children?: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
    const [ref, inCls] = useIn<HTMLSpanElement>(0.4)
    return (
        <span ref={ref} className={"wm-mark " + (p.className || "") + inCls} style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}>
            <b aria-hidden="true" />
            <span>{p.children}</span>
        </span>
    )
}

/** ●●● + pill — the section tag used on every slide of the deck. */
function Chrome(p: { label: string; className?: string; style?: React.CSSProperties }) {
    const [ref, inCls] = useIn<HTMLDivElement>(0.8)
    return (
        <div ref={ref} className={"wm-chrome " + (p.className || "") + inCls} style={p.style}>
            <span className="wm-dots" aria-hidden="true">
                <i style={cssVars({ "--d": "0s" })} />
                <i style={cssVars({ "--d": ".08s" })} />
                <i style={cssVars({ "--d": ".16s" })} />
            </span>
            <span className="wm-pill">{p.label}</span>
        </div>
    )
}

function Rule(p: { className?: string; style?: React.CSSProperties; delay?: number; strong?: boolean }) {
    const [ref, inCls] = useIn<HTMLDivElement>(0.5)
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={"wm-hr wm-draw" + (p.strong ? " s " : " ") + (p.className || "") + inCls}
            style={{ ...cssVars({ "--d": (p.delay || 0) + "s" }), ...p.style }}
        />
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

/** Scroll-linked drift for depth. Returns a MotionValue for `y`. */
function useDrift(ref: React.RefObject<HTMLElement>, distance: number) {
    const still = useStill()
    const { scrollYProgress } = useScroll({ target: ref as React.RefObject<HTMLElement>, offset: ["start end", "end start"] })
    return useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [distance, -distance])
}

const toneFor = (s: string): Tone | undefined => (s === "stone" || s === "red" || s === "mut" ? (s as Tone) : undefined)

/** True on devices with a mouse or trackpad, where hover and cursor effects make sense. */
function useFinePointer(): boolean {
    const [fine, setFine] = React.useState(false)
    React.useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        const sync = () => setFine(mq.matches)
        sync()
        if (mq.addEventListener) mq.addEventListener("change", sync)
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", sync)
        }
    }, [])
    return fine
}

const GRAIN_CSS = `
.wm-grain{position:absolute;inset:-6%;z-index:3;pointer-events:none;opacity:var(--gr,.07);mix-blend-mode:overlay;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
animation:wm-grain .9s steps(5) infinite}
.wm-grain.still{animation:none}
@keyframes wm-grain{0%{transform:translate3d(0,0,0)}20%{transform:translate3d(-3%,2%,0)}40%{transform:translate3d(2%,-3%,0)}60%{transform:translate3d(-2%,-2%,0)}80%{transform:translate3d(3%,3%,0)}100%{transform:translate3d(0,0,0)}}
@media (prefers-reduced-motion:reduce){.wm-grain{animation:none}}
`

/** Film grain for ink sections: a quiet texture that keeps flat colour from feeling digital. */
function Grain(p: { still?: boolean; amount?: number }) {
    return (
        <div aria-hidden="true" className={"wm-grain" + (p.still ? " still" : "")} style={cssVars({ "--gr": p.amount ?? 0.07 })}>
            <style>{GRAIN_CSS}</style>
        </div>
    )
}

type BallGeo = { v: boolean; dot: { x: number; y: number } | null; s: { x: number; y: number }; len: number; at: number[] }

/** Timeline choreography for "How a campaign runs" and "The road ahead". The red dot of the section
    tag hops down onto the rail, then rolls along it as you scroll; each step lights up and drops in as
    the dot passes, and at the last step the dot settles into place. Progress only ever moves forward.
    The rail runs across on wide layouts and down the left edge when the track stacks (--vt: 1). */
function useBallTrack(count: number, still: boolean) {
    const wrapRef = React.useRef<HTMLDivElement>(null)
    const chromeRef = React.useRef<HTMLDivElement>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)
    const geo = React.useRef<BallGeo | null>(null)
    const phase = React.useRef(still ? 3 : 0)
    const goal = React.useRef(0)
    const litRef = React.useRef(still ? count : 0)
    const [lay, setLay] = React.useState<BallGeo | null>(null)
    const [lit, setLit] = React.useState(still ? count : 0)
    const [stage, setStage] = React.useState(still ? 3 : 0)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const sx = useMotionValue(0.64)
    const sy = useMotionValue(0.64)
    const o = useMotionValue(0)
    const along = useMotionValue(still ? 1 : 0)

    React.useEffect(() => {
        if (!still) return
        phase.current = 3
        litRef.current = count
        setStage(3)
        setLit(count)
        along.set(1)
    }, [still, count, along])

    React.useEffect(() => {
        const wrap = wrapRef.current
        const track = trackRef.current
        if (!wrap || !track) return
        let raf = 0
        const spring = { type: "spring" as const, stiffness: 70, damping: 17, mass: 1 }
        const pointAt = (t: number) => {
            const g = geo.current as BallGeo
            return g.v ? { x: g.s.x, y: g.s.y + g.len * t } : { x: g.s.x + g.len * t, y: g.s.y }
        }
        const measure = () => {
            const wr = wrap.getBoundingClientRect()
            const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-node]"))
            if (!nodes.length) return
            const pts = nodes.map((el) => {
                const r = el.getBoundingClientRect()
                return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top }
            })
            const v = getComputedStyle(track).getPropertyValue("--vt").trim() === "1"
            const tr = track.getBoundingClientRect()
            const dotEl = chromeRef.current ? chromeRef.current.querySelector<HTMLElement>(".wm-dots i:last-child") : null
            const dr = dotEl ? dotEl.getBoundingClientRect() : null
            const s = v ? { x: pts[0].x, y: tr.top - wr.top } : { x: tr.left - wr.left, y: pts[0].y }
            const last = pts[pts.length - 1]
            const len = Math.max(1, v ? last.y - s.y : last.x - s.x)
            geo.current = {
                v,
                dot: dr ? { x: dr.left + dr.width / 2 - wr.left, y: dr.top + dr.height / 2 - wr.top } : null,
                s,
                len,
                at: pts.map((p) => (v ? p.y - s.y : p.x - s.x) / len),
            }
            setLay(geo.current)
            if (phase.current >= 2) {
                const p = pointAt(phase.current === 3 ? 1 : along.get())
                x.set(p.x)
                y.set(p.y)
            }
        }
        const follow = () => {
            if (phase.current !== 2 || !geo.current) return
            const p = pointAt(goal.current)
            animate(x, p.x, spring)
            animate(y, p.y, spring)
        }
        const land = () => {
            phase.current = 2
            setStage(2)
            follow()
        }
        const hop = () => {
            const g = geo.current
            if (!g) return
            phase.current = 1
            setStage(1)
            const top = wrap.getBoundingClientRect().top
            const d = g.dot
            const L = pointAt(0)
            o.set(1)
            if (!d || top + d.y < 0 || top + d.y > window.innerHeight) {
                x.set(L.x)
                y.set(L.y)
                sx.set(1)
                sy.set(1)
                land()
                return
            }
            x.set(d.x)
            y.set(d.y)
            const T = 0.82
            const peak = d.y - Math.min(64, Math.max(30, (L.y - d.y) * 0.2))
            animate(sx, 1, { duration: T * 0.5 })
            animate(sy, 1, { duration: T * 0.5 })
            animate(x, [d.x, d.x - 12, L.x], { duration: T, times: [0, 0.34, 1], ease: ["easeOut", "easeInOut"] })
            animate(y, [d.y, peak, L.y], { duration: T, times: [0, 0.34, 1], ease: ["easeOut", "easeIn"] }).then(() => {
                animate(sx, [1.55, 0.88, 1.04, 1], { duration: 0.5, times: [0, 0.32, 0.68, 1] })
                animate(sy, [0.52, 1.16, 0.97, 1], { duration: 0.5, times: [0, 0.32, 0.68, 1] })
                land()
            })
        }
        const read = () => {
            raf = 0
            const g = geo.current
            if (!g || phase.current === 3) return
            const vh = window.innerHeight
            const wr = wrap.getBoundingClientRect()
            const tr = track.getBoundingClientRect()
            // Across: the dot finishes as the whole track comes into view. Down: it rides a line 80% down the screen.
            let p = g.v ? (vh * 0.8 - (wr.top + g.s.y)) / g.len : (vh - tr.top) / (vh * 0.08 + tr.height)
            p = Math.max(0, Math.min(1, p))
            // Near the very end of a page there may be no room left to scroll, so finish the run there.
            if (tr.top < vh && window.scrollY + vh >= document.documentElement.scrollHeight - 4) p = 1
            if (phase.current === 0 && tr.top < vh * 0.98) hop()
            if (p > goal.current) {
                goal.current = p
                follow()
            }
        }
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(read)
        }
        const watch = () => {
            const g = geo.current
            if (!g || phase.current !== 2) return
            const t = Math.max(0, Math.min(1, g.v ? (y.get() - g.s.y) / g.len : (x.get() - g.s.x) / g.len))
            along.set(t)
            const n = g.at.filter((a) => t >= a - 0.003).length
            if (n !== litRef.current) {
                litRef.current = n
                setLit(n)
            }
            if (t >= 0.997) {
                phase.current = 3
                setStage(3)
                along.set(1)
                animate(sx, 0, { duration: 0.35, delay: 0.1 })
                animate(sy, 0, { duration: 0.35, delay: 0.1 })
            }
        }
        measure()
        const ro = new ResizeObserver(() => {
            measure()
            onScroll()
        })
        ro.observe(wrap)
        if (still) return () => ro.disconnect()
        const ux = x.on("change", watch)
        const uy = y.on("change", watch)
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        onScroll()
        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            ux()
            uy()
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [still, x, y, sx, sy, o, along])

    return { wrapRef, chromeRef, trackRef, lay, lit, stage, x, y, sx, sy, o, along }
}
