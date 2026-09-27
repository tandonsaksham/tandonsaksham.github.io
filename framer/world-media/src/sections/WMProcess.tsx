//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 10, "How a campaign runs". The red dot of the section tag hops down onto the
// timeline and rolls along it as you scroll, drawing the line behind it; each week's node lights up
// with a ripple and its card swings down from the line like a hanging tag. Measure is in vermilion.
//@@ BODY

type Step = { week: string; title: string; body: string }

type ProcessProps = {
    tag: string
    headline: string
    note: string
    steps: Step[]
    style?: React.CSSProperties
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
.wmpr-card{min-height:0;gap:22px}
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
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed." },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting." },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why." },
        ],
        style,
    } = props

    const still = useStill()
    const n = Math.max(1, steps.length)
    const t = useBallTrack(n, still)
    const L = t.lay

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
                                <div className="wmpr-card">
                                    <h3>{s.title}</h3>
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
            },
        },
        defaultValue: [
            { week: "01 · Week 1", title: "Listen", body: "We start with your business goal and your audience's feed." },
            { week: "02 · Week 1–2", title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { week: "03 · Week 2–4", title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { week: "04 · Week 3–6", title: "Amplify", body: "Top posts get paid boost, whitelisting and cross-posting." },
            { week: "05 · Week 6+", title: "Measure", body: "Live dashboard, then a full read of what worked and why." },
        ],
    },
})
