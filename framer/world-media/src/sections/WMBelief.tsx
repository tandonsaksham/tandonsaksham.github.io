//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 6, "What we believe". "Attention is rented." stays grey; the rest of the
// manifesto fills in word by word as you scroll. Three belief cards with the deck's dots.
//@@ BODY

type Belief = { title: string; body: string }

type BeliefProps = {
    tag: string
    note: string
    rented: string
    earned: string
    cards: Belief[]
    pageLabel: string
    style?: React.CSSProperties
}

const BELIEF_CSS = `
.wmb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.wmb-note{color:var(--red);font-size:clamp(20px,2.1cqw,31px);margin-top:4px}
.wmb-m{margin-top:clamp(28px,3.4cqw,52px);font-weight:760;font-size:clamp(34px,4.75cqw,72px);line-height:1.02;letter-spacing:-.038em;max-width:19em}
.wmb-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4cqw,20px);margin-top:clamp(48px,6cqw,96px)}
.wmb-card{position:relative;background:var(--surf);border-radius:16px;padding:clamp(22px,2.2cqw,32px);min-height:clamp(150px,13cqw,200px);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.wmb-card:hover{transform:translateY(-6px);box-shadow:0 22px 40px -24px rgba(15,15,15,.35)}
.wmb-card h3{padding-right:28px;margin-bottom:10px}
.wmb-card p{color:var(--mut)}
.wmb-dot{position:absolute;right:clamp(20px,2.1cqw,30px);top:clamp(24px,2.3cqw,34px);width:10px;height:10px;border-radius:50%;background:var(--ink);transition:transform .6s var(--ease)}
.wmb-card:last-child .wmb-dot{background:var(--red)}
.wmb-card:hover .wmb-dot{transform:scale(1.5)}
@container (max-width:820px){.wmb-cards{grid-template-columns:1fr}.wmb-top{flex-direction:column}}
`

function ScrubWord(p: { progress: any; from: number; to: number; stone: boolean; still: boolean; children: React.ReactNode }) {
    const opacity = useTransform(p.progress, [p.from, p.to], [0.14, 1])
    if (p.stone) return <span className="wm-stone">{p.children}</span>
    if (p.still) return <span>{p.children}</span>
    return <motion.span style={{ opacity }}>{p.children}</motion.span>
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMBelief(props: BeliefProps) {
    const {
        tag = "What we believe",
        note = "our answer to all of that",
        rented = "Attention is rented.",
        earned = "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
        cards = [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice." },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember." },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read." },
        ],
        pageLabel = "02 — Who we are",
        style,
    } = props

    const still = useStill()
    const mRef = React.useRef<HTMLParagraphElement>(null)
    const { scrollYProgress } = useScroll({ target: mRef, offset: ["start 85%", "end 50%"] })
    const words = earned.split(/\s+/).filter(Boolean)
    const n = Math.max(1, words.length)

    return (
        <Section theme="cream" className="wmb" css={BELIEF_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <div className="wmb-top">
                    <Chrome label={tag} />
                    <Script className="wmb-note" delay={0.5} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <p ref={mRef} className="wmb-m" aria-label={rented + " " + earned}>
                    <span aria-hidden="true">
                        <ScrubWord progress={scrollYProgress} from={0} to={0} stone still={still}>
                            {rented}
                        </ScrubWord>{" "}
                        {words.map((w, i) => (
                            <React.Fragment key={i}>
                                <ScrubWord progress={scrollYProgress} from={i / n} to={(i + 1) / n} stone={false} still={still}>
                                    {w}
                                </ScrubWord>
                                {i < words.length - 1 ? " " : null}
                            </React.Fragment>
                        ))}
                    </span>
                </p>
                <Stagger className="wmb-cards" step={0.1}>
                    {cards.map((c, i) => (
                        <article className="wmb-card" key={i}>
                            <span className="wmb-dot" aria-hidden="true" />
                            <h3 className="wm-h3">{c.title}</h3>
                            <p className="wm-small">{c.body}</p>
                        </article>
                    ))}
                </Stagger>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMBelief, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "What we believe" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "our answer to all of that" },
    rented: { type: ControlType.String, title: "Grey part", defaultValue: "Attention is rented." },
    earned: {
        type: ControlType.String,
        title: "Manifesto",
        displayTextArea: true,
        defaultValue: "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
    },
    cards: {
        type: ControlType.Array,
        title: "Beliefs",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice." },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember." },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read." },
        ],
    },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "02 — Who we are" },
})
