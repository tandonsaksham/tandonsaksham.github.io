//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 22, "The road ahead" — a year-by-year timeline (2026 → 2030) that draws
// itself as you scroll, with four cream milestone cards; 2030 in vermilion.
//@@ BODY

type Milestone = { year: string; title: string; body: string }

type VisionProps = {
    tag: string
    headline: string
    note: string
    milestones: Milestone[]
    pageLabel: string
    style?: React.CSSProperties
}

const VISION_CSS = `
.wmv-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:clamp(22px,2.6cqw,36px)}
.wmv-h{font-weight:780;font-size:clamp(40px,6.2cqw,98px);line-height:.96;letter-spacing:-.045em}
.wmv-note{color:var(--red);font-size:clamp(21px,2.1cqw,31px);margin-bottom:.4em}
.wmv-track{position:relative;margin-top:clamp(40px,5cqw,72px)}
.wmv-rail{position:absolute;left:calc(-50vw + 50%);right:calc(-50vw + 50%);top:6px;height:1.5px;background:var(--line)}
.wmv-fill{position:absolute;left:0;right:0;top:6px;height:1.5px;background:var(--cream);transform-origin:0 50%}
.wmv-cols{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px)}
.wmv-col{display:flex;flex-direction:column}
.wmv-node{align-self:center;width:13px;height:13px;border-radius:50%;background:var(--ink);border:1.5px solid var(--cream);margin-bottom:18px;position:relative}
.wmv-node i{position:absolute;inset:-1.5px;border-radius:50%;background:var(--cream)}
.wmv-col:last-child .wmv-node{border-color:var(--red)}
.wmv-col:last-child .wmv-node i{background:var(--red)}
.wmv-year{text-align:center;font-family:"DM Mono",ui-monospace,monospace;font-size:12px;padding:6px 8px;border-radius:99px;background:rgba(242,238,229,.1);margin-bottom:10px}
.wmv-col:last-child .wmv-year{background:var(--red);color:var(--ink)}
.wmv-card{display:flex;flex-direction:column;justify-content:space-between;gap:24px;min-height:clamp(190px,16cqw,240px);padding:clamp(18px,1.8cqw,24px);border-radius:16px;background:var(--cream);color:var(--ink);transition:transform .7s var(--ease)}
.wmv-card:hover{transform:translateY(-6px)}
.wmv-card h3{font-weight:760;font-size:clamp(21px,2cqw,28px);line-height:1.05;letter-spacing:-.028em}
.wmv-card p{font-size:13.5px;line-height:1.45;color:rgba(15,15,15,.64)}
@container (max-width:860px){.wmv-head{flex-direction:column;align-items:flex-start}.wmv-rail,.wmv-fill,.wmv-node{display:none}.wmv-cols{grid-template-columns:1fr 1fr}.wmv-year{align-self:flex-start;padding:6px 14px}}
@container (max-width:480px){.wmv-cols{grid-template-columns:1fr}.wmv-card{min-height:0;gap:28px}}
`

function VNode(p: { progress: any; at: number; still: boolean }) {
    const s = useTransform(p.progress, [p.at - 0.07, p.at], [0, 1])
    return <span className="wmv-node" aria-hidden="true">{p.still ? <i /> : <motion.i style={{ scale: s }} />}</span>
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMVision(props: VisionProps) {
    const {
        tag = "Vision",
        headline = "The road ahead",
        note = "where world media is headed",
        milestones = [
            { year: "2026", title: "Creator Collective", body: "An in-house network of [__] vetted creators across metros and Tier 2–3 cities." },
            { year: "2027", title: "Regional first", body: "Campaigns in [__] Indian languages, made by creators from those places." },
            { year: "2028", title: "Creator IP", body: "Co-owned formats, series and products built with our creators." },
            { year: "2030", title: "Culture Lab", body: "Creators plus data in one studio, spotting trends before they peak." },
        ],
        pageLabel = "05 — What's next",
        style,
    } = props

    const still = useStill()
    const trackRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 88%", "end 62%"] })
    const n = Math.max(1, milestones.length)

    return (
        <Section theme="ink" className="wmv" css={VISION_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmv-head">
                    <Words as="h2" className="wmv-h" text={headline} stagger={0.06} />
                    <Script className="wmv-note" delay={0.6} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <div className="wmv-track" ref={trackRef}>
                    <span className="wmv-rail" aria-hidden="true" />
                    {still ? <span className="wmv-fill" aria-hidden="true" /> : <motion.span className="wmv-fill" aria-hidden="true" style={{ scaleX: scrollYProgress }} />}
                    <Stagger as="ol" className="wmv-cols" step={0.1}>
                        {milestones.map((m, i) => (
                            <li className="wmv-col" key={i}>
                                <VNode progress={scrollYProgress} at={(i + 0.5) / n} still={still} />
                                <span className="wmv-year">{m.year}</span>
                                <div className="wmv-card">
                                    <h3>{m.title}</h3>
                                    <p>{fill(m.body)}</p>
                                </div>
                            </li>
                        ))}
                    </Stagger>
                </div>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMVision, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Vision" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "The road ahead" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "where world media is headed" },
    milestones: {
        type: ControlType.Array,
        title: "Milestones",
        control: {
            type: ControlType.Object,
            controls: {
                year: { type: ControlType.String, title: "Year" },
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { year: "2026", title: "Creator Collective", body: "An in-house network of [__] vetted creators across metros and Tier 2–3 cities." },
            { year: "2027", title: "Regional first", body: "Campaigns in [__] Indian languages, made by creators from those places." },
            { year: "2028", title: "Creator IP", body: "Co-owned formats, series and products built with our creators." },
            { year: "2030", title: "Culture Lab", body: "Creators plus data in one studio, spotting trends before they peak." },
        ],
    },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "05 — What's next" },
})
