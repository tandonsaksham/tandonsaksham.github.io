//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 4, "The problem" — the two-tone headline (stone lead-in, ink payoff),
// the handwritten "sound familiar?" and the three numbered failures.
//@@ BODY

type ProblemItem = { title: string; body: string }

type ProblemProps = {
    tag: string
    lead: string
    rest: string
    note: string
    items: ProblemItem[]
    pageLabel: string
    style?: React.CSSProperties
}

const PROBLEM_CSS = `
.wmp-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(40px,6cqw,110px);align-items:start;margin-top:clamp(36px,4.4cqw,64px)}
.wmp-h{font-weight:760;font-size:clamp(36px,4.9cqw,74px);line-height:1;letter-spacing:-.038em}
.wmp-note{display:inline-block;margin-top:clamp(20px,2.6cqw,36px);color:var(--red);font-size:clamp(22px,2.3cqw,34px)}
.wmp-list{display:flex;flex-direction:column}
.wmp-row{display:grid;grid-template-columns:48px 1fr;gap:10px;padding:clamp(20px,2.2cqw,30px) 0 clamp(22px,2.4cqw,32px);position:relative}
.wmp-row>.wm-hr{position:absolute;left:0;right:0;top:0}
.wmp-n{font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;color:var(--red);padding-top:.5em}
.wmp-t{margin-bottom:8px}
.wmp-b{color:var(--mut);max-width:30em}
@container (max-width:820px){.wmp-grid{grid-template-columns:1fr}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMProblem(props: ProblemProps) {
    const {
        tag = "The problem",
        lead = "Yet most influencer marketing",
        rest = "still buys followers and hopes for the best.",
        note = "sound familiar?",
        items = [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust." },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week." },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed." },
        ],
        pageLabel = "01 — The shift",
        style,
    } = props

    return (
        <Section theme="cream" className="wmp" css={PROBLEM_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmp-grid">
                    <div>
                        <Words as="h2" className="wmp-h" parts={[{ t: lead + " ", c: "stone" }, { t: rest }]} stagger={0.045} />
                        <Script className="wmp-note" delay={0.9} rotate={-5}>
                            {note}
                        </Script>
                    </div>
                    <div className="wmp-list">
                        {items.map((it, i) => (
                            <div className="wmp-row" key={i}>
                                <Rule strong delay={0.1 + i * 0.12} />
                                <Rise className="wmp-n" delay={0.2 + i * 0.12}>
                                    {String(i + 1).padStart(2, "0")}
                                </Rise>
                                <Rise delay={0.28 + i * 0.12}>
                                    <h3 className="wmp-t wm-h3">{it.title}</h3>
                                    <p className="wmp-b wm-body">{it.body}</p>
                                </Rise>
                            </div>
                        ))}
                        <Rule strong delay={0.1 + items.length * 0.12} />
                    </div>
                </div>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMProblem, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "The problem" },
    lead: { type: ControlType.String, title: "Lead (grey)", defaultValue: "Yet most influencer marketing" },
    rest: { type: ControlType.String, title: "Rest", displayTextArea: true, defaultValue: "still buys followers and hopes for the best." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "sound familiar?" },
    items: {
        type: ControlType.Array,
        title: "Problems",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { title: "Cast by follower count", body: "Big numbers, wrong audience. Reach that never turns into trust." },
            { title: "One post, then silence", body: "A single sponsored post with no story behind it, forgotten by next week." },
            { title: "Reports full of vanity", body: "Likes and impressions, with no line back to what the business needed." },
        ],
    },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "01 — The shift" },
})
