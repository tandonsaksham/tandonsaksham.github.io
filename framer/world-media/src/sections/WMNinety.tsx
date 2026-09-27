//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 23, "Your first 90 days with us" — Listen & plan, Pilot, Scale (the last
// in ink), a progress line that fills across the three phases, and "…then we go again, bigger."
//@@ BODY

type Phase = { days: string; title: string; body: string }

type NinetyProps = {
    tag: string
    headline: string
    phases: Phase[]
    note: string
    pageLabel: string
    style?: React.CSSProperties
}

const NINETY_CSS = `
.wmn9-h{margin-top:clamp(22px,2.6cqw,36px);font-weight:780;font-size:clamp(38px,5.4cqw,84px);line-height:.98;letter-spacing:-.045em}
.wmn9-bar{position:relative;height:3px;border-radius:3px;background:var(--line);margin-top:clamp(32px,3.8cqw,56px);overflow:hidden}
.wmn9-bar span{position:absolute;inset:0;background:linear-gradient(90deg,var(--ink) 0 66.6%,var(--red) 66.6% 100%);transform-origin:0 50%}
.wmn9-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px);margin-top:clamp(14px,1.6cqw,20px)}
.wmn9-panel{border-radius:16px;background:var(--cream2);padding:clamp(20px,2cqw,28px);min-height:clamp(180px,14cqw,220px);display:flex;flex-direction:column;gap:10px;transition:transform .7s var(--ease)}
.wmn9-panel:hover{transform:translateY(-6px)}
.wmn9-panel.dark{background:var(--ink);color:var(--cream)}
.wmn9-d{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:rgba(15,15,15,.55);text-transform:uppercase}
.wmn9-panel.dark .wmn9-d{color:var(--red)}
.wmn9-panel h3{font-weight:760;font-size:clamp(24px,2.4cqw,34px);letter-spacing:-.03em;line-height:1.02}
.wmn9-panel p{font-size:14.5px;line-height:1.5;color:rgba(15,15,15,.64);max-width:24em}
.wmn9-panel.dark p{color:rgba(242,238,229,.66)}
.wmn9-note{display:inline-block;margin-top:clamp(22px,2.6cqw,36px);color:var(--red);font-size:clamp(22px,2.2cqw,32px)}
@container (max-width:860px){.wmn9-grid{grid-template-columns:1fr}.wmn9-panel{min-height:0}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMNinety(props: NinetyProps) {
    const {
        tag = "Where you come in",
        headline = "Your first 90 days with us",
        phases = [
            { days: "Day 0–30", title: "Listen & plan", body: "We audit your category, audience and past creator work. You get a strategy and a creator shortlist." },
            { days: "Day 30–60", title: "Pilot", body: "A focused first wave with [__] creators, tracked live so we learn fast." },
            { days: "Day 60–90", title: "Scale", body: "Double down on what worked, add paid amplification and report the impact." },
        ],
        note = "…then we go again, bigger.",
        pageLabel = "05 — What's next",
        style,
    } = props

    const still = useStill()
    const barRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: barRef, offset: ["start 90%", "start 40%"] })

    return (
        <Section theme="cream" className="wmn9" css={NINETY_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <Words as="h2" className="wmn9-h" text={headline} stagger={0.05} />
                <div className="wmn9-bar" ref={barRef} aria-hidden="true">
                    {still ? <span /> : <motion.span style={{ scaleX: scrollYProgress }} />}
                </div>
                <Stagger className="wmn9-grid" step={0.12}>
                    {phases.map((p, i) => (
                        <article className={"wmn9-panel" + (i === phases.length - 1 ? " dark" : "")} key={i}>
                            <span className="wmn9-d">{p.days}</span>
                            <h3>{p.title}</h3>
                            <p>{fill(p.body)}</p>
                        </article>
                    ))}
                </Stagger>
                <Script className="wmn9-note" delay={0.3} rotate={-2}>
                    {note}
                </Script>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMNinety, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Where you come in" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Your first 90 days with us" },
    phases: {
        type: ControlType.Array,
        title: "Phases",
        maxCount: 3,
        control: {
            type: ControlType.Object,
            controls: {
                days: { type: ControlType.String, title: "Days" },
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { days: "Day 0–30", title: "Listen & plan", body: "We audit your category, audience and past creator work. You get a strategy and a creator shortlist." },
            { days: "Day 30–60", title: "Pilot", body: "A focused first wave with [__] creators, tracked live so we learn fast." },
            { days: "Day 60–90", title: "Scale", body: "Double down on what worked, add paid amplification and report the impact." },
        ],
    },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "…then we go again, bigger." },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "05 — What's next" },
})
