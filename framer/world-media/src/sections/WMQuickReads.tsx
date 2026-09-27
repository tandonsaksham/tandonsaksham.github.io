//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 18, "The quick reads" — three short case cards (CF-003 to CF-005) with a
// coloured top edge and two metrics each, plus "each one has a full file, just ask".
// On phones the cards become a swipeable strip.
//@@ BODY

type QuickRead = { code: string; title: string; line: string; m1: string; v1: string; m2: string; v2: string }

type QuickReadsProps = {
    anchor: string
    tag: string
    headline: string
    note: string
    reads: QuickRead[]
    style?: React.CSSProperties
}

const QUICK_CSS = `
.wmq-head{display:flex;align-items:baseline;gap:clamp(18px,3cqw,48px);flex-wrap:wrap;margin-top:clamp(22px,2.6cqw,36px)}
.wmq-h{font-weight:780;font-size:clamp(36px,4.6cqw,68px);line-height:1;letter-spacing:-.04em}
.wmq-note{color:var(--red);font-size:clamp(21px,2.1cqw,31px)}
.wmq-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4cqw,20px);margin-top:clamp(32px,3.8cqw,56px)}
.wmq-card{position:relative;background:var(--paper);border-radius:16px;padding:clamp(20px,2cqw,28px);border-top:3px solid var(--ink);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.wmq-card:last-child{border-top-color:var(--red)}
.wmq-card:hover{transform:translateY(-6px);box-shadow:0 22px 40px -24px rgba(15,15,15,.35)}
.wmq-code{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;color:var(--red)}
.wmq-t{margin-top:10px}
.wmq-line{margin-top:8px;color:var(--mut);font-size:14px;line-height:1.45}
.wmq-rows{margin-top:clamp(18px,2cqw,26px);border-top:1px solid var(--line)}
.wmq-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 0 0}
.wmq-row>span{font-size:13.5px;color:var(--mut)}
.wmq-row b{font-weight:800;font-size:clamp(22px,2cqw,28px);letter-spacing:-.04em}
@container (max-width:860px){.wmq-row b{font-size:22px}}
@container (max-width:640px){.wmq-grid{margin-top:26px}.wmq-card:hover{transform:none;box-shadow:none}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMQuickReads(props: QuickReadsProps) {
    const {
        anchor = "quick-reads",
        tag = "More from the files",
        headline = "The quick reads",
        note = "each one has a full file, just ask",
        reads = [
            { code: "CF-003 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "Views", v1: "[__]M", m2: "Engagement", v2: "[__]%" },
            { code: "CF-004 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "UGC posts", v1: "[__]K", m2: "Reach", v2: "[__]M" },
            { code: "CF-005 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "ROAS", v1: "[__]x", m2: "Sales", v2: "₹[__]L" },
        ],
        style,
    } = props

    return (
        <Section theme="cream" id={anchor} className="wmq" css={QUICK_CSS + SWIPE_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmq-head">
                    <Words as="h2" className="wmq-h" text={headline} />
                    <Script className="wmq-note" delay={0.5} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <Stagger className="wmq-grid wm-swipe" step={0.1}>
                    {reads.map((r, i) => (
                        <article className="wmq-card" key={i}>
                            <span className="wmq-code">{r.code}</span>
                            <h3 className="wmq-t wm-h3">{r.title}</h3>
                            <p className="wmq-line">{r.line}</p>
                            <div className="wmq-rows">
                                <div className="wmq-row">
                                    <span>{r.m1}</span>
                                    <b>{fill(r.v1)}</b>
                                </div>
                                <div className="wmq-row">
                                    <span>{r.m2}</span>
                                    <b>{fill(r.v2)}</b>
                                </div>
                            </div>
                        </article>
                    ))}
                </Stagger>
                <SwipeUI hint="swipe" />
            </div>
        </Section>
    )
}

addPropertyControls(WMQuickReads, {
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "quick-reads" },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "More from the files" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "The quick reads" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "each one has a full file, just ask" },
    reads: {
        type: ControlType.Array,
        title: "Cases",
        control: {
            type: ControlType.Object,
            controls: {
                code: { type: ControlType.String, title: "Code" },
                title: { type: ControlType.String, title: "Campaign" },
                line: { type: ControlType.String, title: "One line", displayTextArea: true },
                m1: { type: ControlType.String, title: "Metric 1" },
                v1: { type: ControlType.String, title: "Value 1" },
                m2: { type: ControlType.String, title: "Metric 2" },
                v2: { type: ControlType.String, title: "Value 2" },
            },
        },
        defaultValue: [
            { code: "CF-003 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "Views", v1: "[__]M", m2: "Engagement", v2: "[__]%" },
            { code: "CF-004 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "UGC posts", v1: "[__]K", m2: "Reach", v2: "[__]M" },
            { code: "CF-005 · [Brand]", title: "[Campaign name]", line: "[One line: the idea and who we cast.]", m1: "ROAS", v1: "[__]x", m2: "Sales", v2: "₹[__]L" },
        ],
    },
})
