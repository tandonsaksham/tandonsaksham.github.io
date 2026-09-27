//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 10, "How a campaign runs". The red dot of the section tag hops down onto the
// timeline and rolls along it as you scroll, drawing the line behind it; each week's node lights up
// with a ripple and its card swings down from the line like a hanging tag. Measure is in vermilion.
// Each card carries a small line icon of its step (a listening speech bubble, a casting lens, a
// clapperboard, a megaphone, a gauge) that draws itself as the card lands and replays on hover.
//@@ BODY

type StepIcon = "listen" | "cast" | "create" | "amplify" | "measure" | "none"

type Step = { week: string; title: string; body: string; icon?: StepIcon }

const STEP_ICONS: StepIcon[] = ["listen", "cast", "create", "amplify", "measure"]

type ProcessProps = {
    tag: string
    headline: string
    note: string
    steps: Step[]
    style?: React.CSSProperties
}

/** The step's line icon. Base state is the finished drawing; the entrance only plays once the card is lit. */
function StepGlyph(p: { kind: StepIcon }) {
    const k = (n: number) => cssVars({ "--k": n })
    if (p.kind === "listen")
        return (
            <svg className="wmpr-ico" viewBox="0 0 64 64" aria-hidden="true">
                <path className="d" pathLength={1} d="M18 12 H46 A10 10 0 0 1 56 22 V34 A10 10 0 0 1 46 44 H27 L17 52 V44 H18 A10 10 0 0 1 8 34 V22 A10 10 0 0 1 18 12 Z" />
                {[7, 13, 18, 11, 6].map((h, i) => (
                    <path key={i} className="a bar gr" style={k(i)} d={"M" + (20 + i * 6) + " " + (28 - h / 2) + " V" + (28 + h / 2)} />
                ))}
            </svg>
        )
    if (p.kind === "cast")
        return (
            <svg className="wmpr-ico" viewBox="0 0 64 64" aria-hidden="true">
                <path className="d" pathLength={1} style={k(1)} d="M21.5 25 a5.5 5.5 0 1 0 11 0 a5.5 5.5 0 1 0 -11 0" />
                <path className="d" pathLength={1} style={k(2)} d="M18.5 40.5 C 18.5 33.5, 35.5 33.5, 35.5 40.5" />
                <g className="sc">
                    <path className="d" pathLength={1} d="M13 31 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0" />
                    <path className="d" pathLength={1} style={k(3)} d="M37.2 41.2 L48 52" strokeWidth={3} />
                </g>
                <g className="pp" style={k(8)}>
                    <circle className="af" cx="46" cy="16" r="7" />
                    <path d="M42.8 16.2 L45.2 18.6 L49.4 13.8" stroke="#0F0F0F" strokeWidth={1.8} />
                </g>
            </svg>
        )
    if (p.kind === "create")
        return (
            <svg className="wmpr-ico" viewBox="0 0 64 64" aria-hidden="true">
                <path className="d" pathLength={1} d="M13 28 H51 A3 3 0 0 1 54 31 V51 A3 3 0 0 1 51 54 H13 A3 3 0 0 1 10 51 V31 A3 3 0 0 1 13 28 Z" />
                <path className="a pp" style={k(5)} d="M28 35.5 L38.5 41 L28 46.5 Z" />
                <g className="arm">
                    <path d="M12 17 H52 A2 2 0 0 1 54 19 V23 A2 2 0 0 1 52 25 H12 A2 2 0 0 1 10 23 V19 A2 2 0 0 1 12 17 Z" />
                    <path className="a" d="M19 17 L15 25 M29 17 L25 25 M39 17 L35 25 M49 17 L45 25" />
                </g>
            </svg>
        )
    if (p.kind === "amplify")
        return (
            <svg className="wmpr-ico" viewBox="0 0 64 64" aria-hidden="true">
                <path className="d" pathLength={1} d="M10 27 H20 L38 16 V48 L20 37 H10 Z" />
                <path className="d" pathLength={1} style={k(3)} d="M16 37 L19.5 47" />
                <path className="a wv" style={k(0)} d="M44 26 Q48 32 44 38" />
                <path className="a wv" style={k(1)} d="M49 21 Q55 32 49 43" />
                <path className="a wv" style={k(2)} d="M54 16 Q62 32 54 48" />
            </svg>
        )
    if (p.kind === "measure")
        return (
            <svg className="wmpr-ico" viewBox="0 0 64 64" aria-hidden="true">
                <path className="d" pathLength={1} d="M10 46 A22 22 0 0 1 54 46" />
                <path className="fi" d="M12.5 46 H15.5 M15.1 36.3 L17.7 37.8 M22.3 29.1 L23.8 31.7 M32 26.5 V29.5 M41.7 29.1 L40.2 31.7 M48.9 36.3 L46.3 37.8 M51.5 46 H48.5" />
                <path className="d" pathLength={1} style={k(2)} d="M8 54 H56" opacity={0.4} />
                <path className="ndl" d="M32 46 V29" strokeWidth={2} />
                <circle className="af pp" style={k(3)} cx="32" cy="46" r="3.4" />
            </svg>
        )
    return null
}

const PROCESS_CSS = `
.wmpr-tag{display:block}
.wmpr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:clamp(22px,2.6cqw,36px)}
.wmpr-h{font-weight:780;font-size:clamp(40px,6.2cqw,98px);line-height:.96;letter-spacing:-.045em}
.wmpr-note{color:var(--red);max-width:9.5em;font-size:clamp(21px,2.1cqw,31px);margin-bottom:.3em}
.wmpr-track{--vt:0;position:relative;margin-top:clamp(44px,5.4cqw,80px)}
.wmpr-rail{position:absolute;left:calc(-50vw + 50%);right:calc(-50vw + 50%);top:6px;height:1.5px;background:var(--line)}
.wmpr-fill{position:absolute;z-index:3;display:block;width:1.5px;height:1.5px;background:var(--ink);transform-origin:0 0;pointer-events:none}
.wmpr-cols{position:relative;z-index:2;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(8px,1cqw,14px)}
.wmpr-col{position:relative;display:flex;flex-direction:column;align-items:stretch}
.wmpr-node{position:relative;z-index:4;align-self:center;width:13px;height:13px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink);margin-bottom:18px}
.wmpr-node i{position:absolute;inset:-1.5px;border-radius:50%;background:var(--ink);transform:scale(0)}
.wmpr-node::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1.5px solid var(--ink);opacity:0;pointer-events:none}
.wmpr-col:last-child .wmpr-node,.wmpr-col:last-child .wmpr-node::after{border-color:var(--red)}
.wmpr-col:last-child .wmpr-node i{background:var(--red)}
.wmpr-week{align-self:stretch;text-align:center;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;padding:6px 8px;border-radius:99px;background:var(--cream2);margin-bottom:10px;white-space:nowrap;opacity:0}
.wmpr-col:last-child .wmpr-week{background:var(--red);color:var(--ink)}
.wmpr-card{display:flex;flex-direction:column;justify-content:space-between;min-height:clamp(200px,17cqw,250px);padding:clamp(16px,1.6cqw,22px);border-radius:16px;background:var(--ink);color:var(--cream);opacity:0;transform-origin:50% 0;transition:transform .7s var(--ease)}
.wmpr-col:last-child .wmpr-card{background:var(--red);color:var(--ink)}
.wmpr-card h3{font-weight:760;font-size:clamp(20px,1.9cqw,27px);letter-spacing:-.025em}
.wmpr-card p{font-size:13.5px;line-height:1.45;color:rgba(242,238,229,.66)}
.wmpr-col:last-child .wmpr-card p{color:rgba(15,15,15,.78)}
.wmpr-ico{display:block;flex:none;width:clamp(56px,5.2cqw,76px);height:auto;margin:14px 0 16px -4px;overflow:visible;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;--acc:var(--red)}
.wmpr-col:last-child .wmpr-ico{--acc:var(--cream)}
.wmpr-ico .a{stroke:var(--acc)}
.wmpr-ico .af{fill:var(--acc);stroke:none}
.wmpr-ico .bar{stroke-width:2.6}
.wmpr-ico .gr,.wmpr-ico .pp{transform-box:fill-box;transform-origin:50% 50%}
.wmpr-ico .arm{transform-box:view-box;transform-origin:10px 25px}
.wmpr-ico .ndl{transform-box:view-box;transform-origin:32px 46px;transform:rotate(50deg)}
.wmpr-col.on .wmpr-ico .d{stroke-dasharray:1;animation:pi-draw 1s var(--ease) backwards;animation-delay:calc(.75s + var(--k,0) * .14s)}
.wmpr-col.on .wmpr-ico .fi{animation:pi-fade .7s var(--ease) 1.05s backwards}
.wmpr-col.on .wmpr-ico .gr{animation:pi-grow .5s var(--ease) calc(.95s + var(--k,0) * .07s) backwards,pi-talk .9s ease-in-out calc(1.55s + var(--k,0) * .13s) 3}
.wmpr-col.on .wmpr-ico .pp{animation:pi-pop .6s cubic-bezier(.34,1.56,.64,1) backwards;animation-delay:calc(.95s + var(--k,0) * .14s)}
.wmpr-col.on .wmpr-ico .sc{animation:pi-scan 1.5s var(--ease-io) 1s backwards}
.wmpr-col.on .wmpr-ico .arm{animation:pi-clap 1.5s linear .75s backwards}
.wmpr-col.on .wmpr-ico .wv{animation:pi-wave .8s var(--ease) backwards;animation-delay:calc(1.15s + var(--k,0) * .16s)}
.wmpr-col.on .wmpr-ico .ndl{animation:pi-sweep 1.7s linear .95s backwards}
@keyframes pi-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes pi-fade{from{opacity:0}}
@keyframes pi-grow{from{transform:scaleY(0)}}
@keyframes pi-talk{0%,100%{transform:none}50%{transform:scaleY(.3)}}
@keyframes pi-pop{from{transform:scale(0)}}
@keyframes pi-scan{0%{transform:translate(-7px,3px)}45%{transform:translate(6px,-2px)}100%{transform:none}}
@keyframes pi-clap{0%{opacity:0;transform:rotate(-30deg)}22%{opacity:1}22%,42%{transform:rotate(-30deg);animation-timing-function:cubic-bezier(.6,0,.9,.4)}58%{transform:rotate(2deg);animation-timing-function:ease-out}70%{transform:rotate(-5deg);animation-timing-function:ease-in}80%,100%{transform:none}}
@keyframes pi-wave{from{opacity:0;transform:translateX(-5px)}}
@keyframes pi-sweep{0%{transform:rotate(-88deg);animation-timing-function:cubic-bezier(.3,0,.3,1)}55%{transform:rotate(66deg);animation-timing-function:ease-in-out}72%{transform:rotate(38deg);animation-timing-function:ease-in-out}86%{transform:rotate(55deg);animation-timing-function:ease-in-out}100%{transform:rotate(50deg)}}
.wmpr-col.on .wmpr-node i{transform:none;animation:wmpr-pop .7s cubic-bezier(.34,1.56,.64,1) backwards}
.wmpr-col.on .wmpr-node::after{animation:wmpr-ring .9s var(--ease) backwards}
.wmpr-col.end .wmpr-node::after{animation:wmpr-ring 1.1s var(--ease) .15s 2 backwards}
.wmpr-col.on .wmpr-week{opacity:1;animation:wmpr-pill .55s var(--ease) backwards}
.wmpr-col.on .wmpr-card{opacity:1;animation:wmpr-drop 1.3s linear .06s backwards}
.wmpr-col.on .wmpr-card:hover{transform:translateY(-6px)}
.wmpr-ball{position:absolute;left:0;top:0;z-index:6;display:block;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--red);box-shadow:0 0 0 5px rgba(233,67,27,.14),0 8px 18px -4px rgba(233,67,27,.55);pointer-events:none}
.wmpr.hop .wm-chrome .wm-dots i:last-child{background:transparent;box-shadow:inset 0 0 0 1.5px var(--red)}
.wmpr.done .wm-chrome .wm-dots i:last-child{animation:wmpr-pop .6s cubic-bezier(.34,1.56,.64,1) .35s backwards}
.wmpr.still *{animation:none!important}
@keyframes wmpr-pop{from{transform:scale(0)}}
@keyframes wmpr-ring{from{transform:scale(.3);opacity:.9}to{transform:scale(1.5);opacity:0}}
@keyframes wmpr-pill{from{opacity:0;transform:translateY(-12px)}}
@keyframes wmpr-drop{0%{opacity:0;transform:perspective(1000px) rotateX(-84deg);animation-timing-function:cubic-bezier(.3,0,.6,1)}40%{opacity:1;transform:perspective(1000px) rotateX(15deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}62%{transform:perspective(1000px) rotateX(-6deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}82%{transform:perspective(1000px) rotateX(2deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}100%{opacity:1;transform:perspective(1000px) rotateX(0)}}
@keyframes wmpr-slide{from{opacity:0;transform:translateX(-22px)}}
@container (max-width:860px){
.wmpr-head{flex-direction:column;align-items:flex-start}
.wmpr-track{--vt:1;padding-left:40px}
.wmpr-rail{left:6px;right:auto;top:0;bottom:0;width:1.5px;height:auto}
.wmpr-cols{grid-template-columns:1fr;gap:22px}
.wmpr-node{position:absolute;left:-40px;top:6px;margin:0}
.wmpr-week{align-self:flex-start;padding:6px 14px}
.wmpr-card{position:relative;min-height:0;gap:22px}
.wmpr-card h3{padding-right:58px}
.wmpr-ico{position:absolute;right:16px;top:14px;width:46px;margin:0}
.wmpr-col.on .wmpr-card,.wmpr-col.on .wmpr-week{animation:wmpr-slide .8s var(--ease) backwards}
.wmpr-col.on .wmpr-card{animation-delay:.08s}
}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMProcess(props: ProcessProps) {
    const {
        tag = "How we work",
        headline = "How a campaign runs",
        note = "brief to receipts in about [__] weeks",
        steps = [
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed.", icon: "listen" },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud.", icon: "cast" },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it.", icon: "create" },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting.", icon: "amplify" },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why.", icon: "measure" },
        ],
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const n = Math.max(1, steps.length)
    const t = useBallTrack(n, still)
    const L = t.lay
    // Hovering a lit card replays its icon.
    const [runs, setRuns] = React.useState<number[]>([])
    const replay = (i: number) => {
        if (!fine || still || i >= t.lit) return
        setRuns((r) => {
            const next = r.slice()
            next[i] = (next[i] || 0) + 1
            return next
        })
    }

    return (
        <Section theme="cream" className={"wmpr" + (still ? " still" : "") + (t.stage >= 1 && t.stage < 3 ? " hop" : "") + (t.stage === 3 && !still ? " done" : "")} css={PROCESS_CSS} style={style} label={headline}>
            <div className="wm-wrap" ref={t.wrapRef}>
                <div className="wmpr-tag" ref={t.chromeRef}>
                    <Chrome label={tag} />
                </div>
                <div className="wmpr-head">
                    <Words as="h2" className="wmpr-h" text={headline} stagger={0.06} />
                    <Script className="wmpr-note" delay={0.6} rotate={-5}>
                        {fill(note)}
                    </Script>
                </div>
                <div className="wmpr-track" ref={t.trackRef}>
                    <span className="wmpr-rail" aria-hidden="true" />
                    <ol className="wmpr-cols">
                        {steps.map((s, i) => (
                            <li className={"wmpr-col" + (i < t.lit ? " on" : "") + (i === n - 1 && t.stage === 3 && !still ? " end" : "")} key={i}>
                                <span className="wmpr-node" data-node="" aria-hidden="true">
                                    <i />
                                </span>
                                <span className="wmpr-week">{s.week}</span>
                                <div className="wmpr-card" onPointerEnter={() => replay(i)}>
                                    <h3>{s.title}</h3>
                                    <StepGlyph key={runs[i] || 0} kind={s.icon || STEP_ICONS[i] || "none"} />
                                    <p>{s.body}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                {L ? (
                    <motion.span
                        className="wmpr-fill"
                        aria-hidden="true"
                        style={L.v ? { left: L.s.x - 0.75, top: L.s.y, height: L.len, scaleY: t.along } : { left: L.s.x, top: L.s.y - 0.75, width: L.len, scaleX: t.along }}
                    />
                ) : null}
                {!still ? <motion.span className="wmpr-ball" aria-hidden="true" style={{ x: t.x, y: t.y, scaleX: t.sx, scaleY: t.sy, opacity: t.o }} /> : null}
            </div>
        </Section>
    )
}

addPropertyControls(WMProcess, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "How we work" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "How a campaign runs" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "brief to receipts in about [__] weeks" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: {
            type: ControlType.Object,
            controls: {
                week: { type: ControlType.String, title: "Week" },
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["listen", "cast", "create", "amplify", "measure", "none"],
                    optionTitles: ["Listen (speech bubble)", "Cast (lens)", "Create (clapperboard)", "Amplify (megaphone)", "Measure (gauge)", "None"],
                },
            },
        },
        defaultValue: [
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed.", icon: "listen" },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud.", icon: "cast" },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it.", icon: "create" },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting.", icon: "amplify" },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why.", icon: "measure" },
        ],
    },
})
