//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 4, "The problem". The two-tone headline rises in, then a vermilion pen
// circles "buys followers" and underlines "hopes for the best." like an editor marking up a
// draft. Each of the three failures comes with a small animated exhibit: a big follower count
// whose crowd turns out to be mostly hollow, one post that spikes and flatlines, and a report
// of vanity numbers that gets "so what?" stamped on it. Hover a row to replay its exhibit.
//@@ BODY

type ProblemVisual = "crowd" | "spike" | "vanity" | "none"

type ProblemItem = { title: string; body: string; visual?: ProblemVisual }

type ProblemProps = {
    tag: string
    lead: string
    rest: string
    circle: string
    underline: string
    note: string
    items: ProblemItem[]
    style?: React.CSSProperties
}

const PROBLEM_VISUALS: ProblemVisual[] = ["crowd", "spike", "vanity"]

const PROBLEM_CSS = `
.wmp-grid{display:grid;grid-template-columns:minmax(0,1.14fr) minmax(0,1fr);gap:clamp(40px,5cqw,92px);align-items:start;margin-top:clamp(36px,4.4cqw,64px)}
.wmp-h{font-weight:760;font-size:clamp(34px,4.45cqw,66px);line-height:1.04;letter-spacing:-.038em}
.wmp-pen{position:relative;display:inline-block;white-space:nowrap}
.wmp-note{display:inline-block;margin-top:clamp(28px,3.2cqw,48px);color:var(--red);font-size:clamp(22px,2.3cqw,34px)}
.wmp-list{display:flex;flex-direction:column}
.wmp-row{position:relative;display:grid;grid-template-columns:36px minmax(0,1fr) clamp(128px,12cqw,172px);column-gap:clamp(12px,1.5cqw,24px);align-items:center;padding:clamp(20px,2.2cqw,30px) 0 clamp(22px,2.4cqw,32px)}
.wmp-row>.wm-hr{position:absolute;left:0;right:0;top:0}
.wmp-n{align-self:start;font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;color:var(--red);padding-top:.5em}
.wmp-txt{align-self:start}
.wmp-t{margin-bottom:8px;font-size:clamp(19px,1.75cqw,25px)}
.wmp-b{color:var(--mut);max-width:30em}
.wmp-x{position:relative;color:var(--ink);opacity:0;transform:translateY(14px);transition:opacity .8s var(--ease) .2s,transform 1s var(--ease) .2s}
.wmp-row.on .wmp-x,.wmp-row.now .wmp-x{opacity:1;transform:none}
.wmp-x svg{display:block;width:100%;height:auto;overflow:visible}
.px-m{font-family:"DM Mono",ui-monospace,monospace;font-size:8.5px;letter-spacing:.07em;fill:#8C887C}
.px-v{font-family:"DM Mono",ui-monospace,monospace;font-size:10px;fill:currentColor}
.px-big{font-family:"DM Mono",ui-monospace,monospace;font-size:16px;letter-spacing:-.03em;fill:currentColor}
.px-red{fill:#E9431B}
.px-c{font-family:"Caveat","Bradley Hand",cursive;font-weight:600;font-size:20px;fill:#E9431B}
.px-dot{fill:currentColor;fill-opacity:0;stroke:#B9B3A6;stroke-width:1}
.px-dot.real{fill:#E9431B;fill-opacity:1;stroke:none}
.px-dot,.px-pop,.px-stamp{transform-box:fill-box;transform-origin:50% 50%}
.px-bar{transform-box:fill-box;transform-origin:0 50%}
.px-base{fill:none;stroke:#B9B3A6;stroke-width:1;stroke-dasharray:2 4}
.px-line{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1}
.px-card{fill:#FAF8F3;stroke:currentColor;stroke-width:1.2}
.px-ring{fill:none;stroke:#E9431B;stroke-width:2;stroke-linecap:round;stroke-dasharray:1}
.wmp-row.on .px-dot{animation:px-ghost 2.7s var(--ease) backwards;animation-delay:calc(.3s + var(--c,0) * .045s)}
.wmp-row.on .px-dot.real{animation-name:px-real}
.wmp-row.on .px-fade{animation:px-fade .8s var(--ease) backwards;animation-delay:var(--t,1.8s)}
.wmp-row.on .px-line{animation:px-draw 1.8s cubic-bezier(.45,0,.3,1) .35s backwards}
.wmp-row.on .px-pop{animation:px-pop .6s cubic-bezier(.34,1.56,.64,1) backwards;animation-delay:var(--t,.8s)}
.wmp-row.on .px-bar{animation:px-bar 1s var(--ease) backwards;animation-delay:calc(.45s + var(--k,0) * .15s)}
.wmp-row.on .px-stamp{animation:px-stamp .55s cubic-bezier(.2,1.4,.4,1) 1.5s backwards}
.wmp-row.on .px-ring{animation:px-draw .75s var(--ease) 1.6s backwards}
.wmp.still .wmp-x *{animation:none!important}
@keyframes px-ghost{0%{transform:scale(0);fill-opacity:1;stroke-opacity:0}14%{transform:scale(1);fill-opacity:1;stroke-opacity:0}52%{fill-opacity:1;stroke-opacity:0}72%,100%{fill-opacity:0;stroke-opacity:1}}
@keyframes px-real{0%{transform:scale(0);fill:#0F0F0F}14%,52%{transform:scale(1);fill:#0F0F0F}64%{transform:scale(1.5)}78%,100%{transform:scale(1);fill:#E9431B}}
@keyframes px-fade{from{opacity:0}}
@keyframes px-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes px-pop{from{transform:scale(0)}}
@keyframes px-bar{from{transform:scaleX(0)}}
@keyframes px-stamp{0%{opacity:0;transform:scale(1.9) rotate(-12deg)}100%{opacity:1;transform:none}}
@container (max-width:1100px){.wmp-grid{grid-template-columns:1fr}.wmp-h{max-width:16em}}
@container (max-width:560px){.wmp-row{grid-template-columns:34px minmax(0,1fr)}.wmp-x{grid-column:2;max-width:250px;margin-top:20px}}
`

/** Rolls a follower count up from zero once the exhibit is live. */
function Count(p: { to: number; on: boolean; still: boolean; x: number; y: number; className: string; anchor?: "start" | "middle" | "end" }) {
    const v = useMotionValue(p.still ? p.to : 0)
    const text = useTransform(v, (n) => n.toFixed(1) + "M")
    React.useEffect(() => {
        if (p.still) {
            v.set(p.to)
            return
        }
        if (!p.on) return
        v.set(0)
        const c = animate(v, p.to, { duration: 1.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] })
        return () => c.stop()
    }, [p.on, p.still, p.to, v])
    return (
        <motion.text x={p.x} y={p.y} textAnchor={p.anchor} className={p.className}>
            {text}
        </motion.text>
    )
}

/** Cast by follower count: a big crowd that turns out to be mostly hollow. */
function Crowd(p: { on: boolean; still: boolean }) {
    const real = [5, 18, 31, 40]
    const dots: React.ReactNode[] = []
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 12; c++) {
            const i = r * 12 + c
            dots.push(<circle key={i} className={"px-dot" + (real.indexOf(i) > -1 ? " real" : "")} style={cssVars({ "--c": c + r * 0.5 })} cx={12 + c * 16} cy={40 + r * 15} r={3.6} />)
        }
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <text x="0" y="13" className="px-m">
                FOLLOWERS
            </text>
            <Count to={1.2} on={p.on} still={p.still} x={200} y={16} className="px-big" anchor="end" />
            {dots}
            <circle cx="4" cy="110" r="3.2" className="px-red px-fade" style={cssVars({ "--t": "1.95s" })} />
            <text x="12" y="113" className="px-m px-fade" style={cssVars({ "--t": "1.95s" })}>
                REAL AUDIENCE
            </text>
        </svg>
    )
}

/** One post, then silence: a single spike, then a flat line. */
function Spike() {
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <path className="px-base" d="M0 98 H200" />
            <path className="px-line" pathLength={1} d="M0 94 L38 93 L50 91 L60 24 L69 90 L84 93 L200 94" />
            <circle className="px-red px-pop" style={cssVars({ "--t": "1.1s" })} cx="60" cy="24" r="4.6" />
            <text className="px-m px-fade" style={cssVars({ "--t": "1.15s" })} x="60" y="11" textAnchor="middle">
                1 POST
            </text>
            <text className="px-m" x="60" y="114" textAnchor="middle">
                DAY 1
            </text>
            <text className="px-m" x="200" y="114" textAnchor="end">
                DAY 30
            </text>
            <text className="px-c px-fade" style={cssVars({ "--t": "2.05s" })} x="198" y="83" textAnchor="end">
                …silence
            </text>
        </svg>
    )
}

/** Reports full of vanity: big numbers, then a "so what?" stamp. */
function Vanity() {
    const rows: [string, string, number][] = [
        ["LIKES", "48.2K", 62],
        ["VIEWS", "1.2M", 98],
        ["REACH", "910K", 80],
    ]
    return (
        <svg viewBox="0 0 200 120" fill="none" aria-hidden="true">
            <rect className="px-card" x="1" y="4" width="136" height="110" rx="9" />
            <text className="px-m" x="13" y="22">
                CAMPAIGN REPORT
            </text>
            <path d="M13 29 H125" stroke="#E4DED2" />
            {rows.map(([k, v, w], i) => (
                <g key={i}>
                    <text className="px-m" x="13" y={48 + i * 24}>
                        {k}
                    </text>
                    <text className="px-v" x="125" y={48 + i * 24} textAnchor="end">
                        {v}
                    </text>
                    <rect className="px-bar" style={cssVars({ "--k": i })} x="13" y={53 + i * 24} width={w} height="3" rx="1.5" fill="#C9C3B6" />
                </g>
            ))}
            <g className="px-stamp">
                <path className="px-ring" pathLength={1} d="M146 58 C 158 40, 204 44, 203 70 C 202 94, 150 100, 132 84 C 120 72, 132 58, 154 53" />
                <rect x="131" y="55" width="70" height="30" rx="15" fill="#F2EEE5" opacity=".86" transform="rotate(-10 166 70)" />
                <text className="px-c" x="166" y="76" textAnchor="middle" transform="rotate(-10 166 70)">
                    so what?
                </text>
            </g>
        </svg>
    )
}

type PenSeg = { t: string; mark?: "loop" | "under" }

/** The two-tone headline with its pen marks. Each word rises in like the shared reveal. */
function PenHeadline(p: { lead: string; rest: string; circle: string; underline: string; still: boolean }) {
    const [ref, inCls] = useIn<HTMLHeadingElement>(0.3)
    const on = inCls.indexOf("wm-in") > -1
    const found = ([
        [p.circle, "loop"],
        [p.underline, "under"],
    ] as [string, "loop" | "under"][])
        .filter(([ph]) => ph && p.rest.indexOf(ph) > -1)
        .map(([ph, kind]) => ({ at: p.rest.indexOf(ph), ph, kind }))
        .sort((a, b) => a.at - b.at)
    const segs: PenSeg[] = []
    let pos = 0
    found.forEach((f) => {
        if (f.at < pos) return
        if (f.at > pos) segs.push({ t: p.rest.slice(pos, f.at) })
        segs.push({ t: f.ph, mark: f.kind })
        pos = f.at + f.ph.length
    })
    if (pos < p.rest.length) segs.push({ t: p.rest.slice(pos) })
    let n = 0
    const words = (t: string, key: string, tone?: string) =>
        t.split(/(\s+)/).map((w, i) => {
            if (!w) return null
            if (/^\s+$/.test(w)) return <React.Fragment key={key + i}> </React.Fragment>
            const d = n++ * 0.045
            return (
                <span className="wm-w" aria-hidden="true" key={key + i}>
                    <span className={tone} style={cssVars({ "--d": d.toFixed(3) + "s" })}>
                        {fill(w)}
                    </span>
                </span>
            )
        })
    return (
        <h2 ref={ref} className={"wm-rv wmp-h" + inCls} aria-label={p.lead + " " + p.rest}>
            {words(p.lead + " ", "l", "wm-stone")}
            {segs.map((s, i) =>
                s.mark ? (
                    <span className="wmp-pen" key={"s" + i}>
                        {words(s.t, "s" + i)}
                        <PenMark kind={s.mark} on={on || p.still} delay={p.still ? 0 : s.mark === "loop" ? 1.05 : 1.6} />
                    </span>
                ) : (
                    <React.Fragment key={"s" + i}>{words(s.t, "s" + i)}</React.Fragment>
                )
            )}
        </h2>
    )
}

function ProblemRow(p: { i: number; item: ProblemItem; still: boolean; fine: boolean }) {
    const ref = React.useRef<HTMLDivElement>(null)
    const seen = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.45 })
    const [run, setRun] = React.useState(0)
    const kind: ProblemVisual = p.item.visual || PROBLEM_VISUALS[p.i] || "none"
    const on = !p.still && seen
    const replay = () => {
        if (on && p.fine) setRun((r) => r + 1)
    }
    return (
        <div ref={ref} className={"wmp-row" + (p.still ? " now" : on ? " on" : "")} onPointerEnter={replay}>
            <Rule strong delay={0.1 + p.i * 0.12} />
            <Rise className="wmp-n" delay={0.2 + p.i * 0.12}>
                {String(p.i + 1).padStart(2, "0")}
            </Rise>
            <Rise className="wmp-txt" delay={0.28 + p.i * 0.12}>
                <h3 className="wmp-t wm-h3">{p.item.title}</h3>
                <p className="wmp-b wm-body">{p.item.body}</p>
            </Rise>
            {kind !== "none" ? (
                <div className="wmp-x" aria-hidden="true" key={run}>
                    {kind === "crowd" ? <Crowd on={on} still={p.still} /> : kind === "spike" ? <Spike /> : <Vanity />}
                </div>
            ) : null}
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMProblem(props: ProblemProps) {
    const {
        tag = "The problem",
        lead = "Yet most influencer marketing",
        rest = "still buys followers and hopes for the best.",
        circle = "buys followers",
        underline = "hopes for the best.",
        note = "sound familiar?",
        items = [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust.", visual: "crowd" },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week.", visual: "spike" },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed.", visual: "vanity" },
        ],
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()

    return (
        <Section theme="cream" className={"wmp" + (still ? " still" : "")} css={PEN_CSS + PROBLEM_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmp-grid">
                    <div>
                        <PenHeadline lead={lead} rest={rest} circle={circle} underline={underline} still={still} />
                        <Script className="wmp-note" delay={2.1} rotate={-5}>
                            {note}
                        </Script>
                    </div>
                    <div className="wmp-list">
                        {items.map((it, i) => (
                            <ProblemRow key={i} i={i} item={it} still={still} fine={fine} />
                        ))}
                        <Rule strong delay={0.1 + items.length * 0.12} />
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMProblem, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "The problem" },
    lead: { type: ControlType.String, title: "Lead (grey)", defaultValue: "Yet most influencer marketing" },
    rest: { type: ControlType.String, title: "Rest", displayTextArea: true, defaultValue: "still buys followers and hopes for the best." },
    circle: { type: ControlType.String, title: "Pen circle", defaultValue: "buys followers" },
    underline: { type: ControlType.String, title: "Pen underline", defaultValue: "hopes for the best." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "sound familiar?" },
    items: {
        type: ControlType.Array,
        title: "Problems",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                visual: {
                    type: ControlType.Enum,
                    title: "Exhibit",
                    options: ["crowd", "spike", "vanity", "none"],
                    optionTitles: ["Hollow crowd", "Spike then silence", "Vanity report", "None"],
                },
            },
        },
        defaultValue: [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust.", visual: "crowd" },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week.", visual: "spike" },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed.", visual: "vanity" },
        ],
    },
})
