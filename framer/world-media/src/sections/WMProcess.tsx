//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 10, "How a campaign runs" — the timeline draws itself as you scroll and
// each week's node lights up when the line reaches it; five step cards, Measure in vermilion.
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
.wmpr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:clamp(22px,2.6cqw,36px)}
.wmpr-h{font-weight:780;font-size:clamp(40px,6.2cqw,98px);line-height:.96;letter-spacing:-.045em}
.wmpr-note{color:var(--red);max-width:9.5em;font-size:clamp(21px,2.1cqw,31px);margin-bottom:.3em}
.wmpr-track{position:relative;margin-top:clamp(40px,5cqw,72px)}
.wmpr-rail{position:absolute;left:calc(-50vw + 50%);right:calc(-50vw + 50%);top:6px;height:1.5px;background:var(--line)}
.wmpr-fill{position:absolute;left:0;right:0;top:6px;height:1.5px;background:var(--ink);transform-origin:0 50%}
.wmpr-cols{position:relative;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(8px,1cqw,14px)}
.wmpr-col{display:flex;flex-direction:column;align-items:stretch}
.wmpr-node{align-self:center;width:13px;height:13px;border-radius:50%;background:var(--cream);border:1.5px solid var(--ink);margin-bottom:18px;position:relative}
.wmpr-node i{position:absolute;inset:-1.5px;border-radius:50%;background:var(--ink)}
.wmpr-col:last-child .wmpr-node{border-color:var(--red)}
.wmpr-col:last-child .wmpr-node i{background:var(--red)}
.wmpr-week{align-self:stretch;text-align:center;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;padding:6px 8px;border-radius:99px;background:var(--cream2);margin-bottom:10px;white-space:nowrap}
.wmpr-col:last-child .wmpr-week{background:var(--red);color:var(--ink)}
.wmpr-card{display:flex;flex-direction:column;justify-content:space-between;min-height:clamp(200px,17cqw,250px);padding:clamp(16px,1.6cqw,22px);border-radius:16px;background:var(--ink);color:var(--cream);transition:transform .7s var(--ease)}
.wmpr-card:hover{transform:translateY(-6px)}
.wmpr-col:last-child .wmpr-card{background:var(--red);color:var(--ink)}
.wmpr-card h3{font-weight:760;font-size:clamp(20px,1.9cqw,27px);letter-spacing:-.025em}
.wmpr-card p{font-size:13.5px;line-height:1.45;color:rgba(242,238,229,.66)}
.wmpr-col:last-child .wmpr-card p{color:rgba(15,15,15,.78)}
@container (max-width:860px){.wmpr-head{flex-direction:column;align-items:flex-start}.wmpr-rail,.wmpr-fill,.wmpr-node{display:none}
.wmpr-cols{grid-template-columns:1fr 1fr}.wmpr-week{align-self:flex-start}}
@container (max-width:480px){.wmpr-cols{grid-template-columns:1fr}.wmpr-card{min-height:0;gap:28px}}
`

function Node(p: { progress: any; at: number; still: boolean }) {
    const s = useTransform(p.progress, [p.at - 0.06, p.at], [0, 1])
    return (
        <span className="wmpr-node" aria-hidden="true">
            {p.still ? <i /> : <motion.i style={{ scale: s }} />}
        </span>
    )
}

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
    const trackRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 88%", "end 62%"] })
    const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
    const n = Math.max(1, steps.length)

    return (
        <Section theme="cream" className="wmpr" css={PROCESS_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmpr-head">
                    <Words as="h2" className="wmpr-h" text={headline} stagger={0.06} />
                    <Script className="wmpr-note" delay={0.6} rotate={-5}>
                        {fillBlank(note)}
                    </Script>
                </div>
                <div className="wmpr-track" ref={trackRef}>
                    <span className="wmpr-rail" aria-hidden="true" />
                    {still ? <span className="wmpr-fill" aria-hidden="true" /> : <motion.span className="wmpr-fill" aria-hidden="true" style={{ scaleX: fill }} />}
                    <Stagger as="ol" className="wmpr-cols" step={0.09}>
                        {steps.map((s, i) => (
                            <li className="wmpr-col" key={i}>
                                <Node progress={scrollYProgress} at={(i + 0.5) / n} still={still} />
                                <span className="wmpr-week">{s.week}</span>
                                <div className="wmpr-card">
                                    <h3>{s.title}</h3>
                                    <p>{s.body}</p>
                                </div>
                            </li>
                        ))}
                    </Stagger>
                </div>
            </div>
        </Section>
    )
}

function fillBlank(t: string) {
    return fill(t)
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
