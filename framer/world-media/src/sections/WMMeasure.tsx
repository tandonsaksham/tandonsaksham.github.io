//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 11, "Three questions every report answers" — Awareness, Engagement and
// Business panels (the last in ink) with metric chips that pop in, and the handwritten
// "no vanity metrics without context".
//@@ BODY

type Question = { label: string; question: string; chips: string }

type MeasureProps = {
    tag: string
    headline: string
    questions: Question[]
    note: string
    footnote: string
    style?: React.CSSProperties
}

const MEASURE_CSS = `
.wmm-h{margin-top:clamp(22px,2.6cqw,36px);font-weight:760;font-size:clamp(32px,4.1cqw,62px);line-height:1;letter-spacing:-.038em}
.wmm-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px);margin-top:clamp(32px,3.8cqw,56px)}
.wmm-panel{border-radius:16px;padding:clamp(20px,2cqw,28px);background:var(--cream2);min-height:clamp(210px,17cqw,260px);display:flex;flex-direction:column;gap:14px}
.wmm-panel.dark{background:var(--ink);color:var(--cream)}
.wmm-l{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;color:rgba(15,15,15,.55)}
.wmm-panel.dark .wmm-l{color:var(--red)}
.wmm-q{font-weight:760;font-size:clamp(22px,2.15cqw,31px);line-height:1.05;letter-spacing:-.028em;max-width:11em}
.wmm-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:auto}
.wmm-chip{display:inline-flex;align-items:center;height:30px;padding:0 12px;border-radius:99px;background:var(--paper);color:var(--ink);font-size:13px;font-weight:500;white-space:nowrap;transition:transform .5s var(--ease),background .4s,color .4s}
.wmm-chip:hover{transform:translateY(-3px);background:var(--ink);color:var(--cream)}
.wmm-panel.dark .wmm-chip{background:rgba(242,238,229,.1);color:var(--cream)}
.wmm-panel.dark .wmm-chip:hover{background:var(--red);color:var(--ink)}
.wmm-chips.wm-stag.wm-in:not(.wm-now)>*{animation-name:wmm-pop}
@keyframes wmm-pop{from{opacity:0;translate:0 12px;scale:.86}to{opacity:1;translate:none;scale:none}}
.wmm-foot{display:flex;align-items:baseline;gap:clamp(16px,2.4cqw,36px);flex-wrap:wrap;padding-top:clamp(18px,2cqw,26px);margin-top:clamp(28px,3.4cqw,48px);position:relative}
.wmm-foot>.wm-hr{position:absolute;left:0;right:0;top:0}
.wmm-note{color:var(--red);font-size:clamp(21px,2cqw,29px)}
.wmm-fn{color:var(--mut);font-size:14.5px}
@container (max-width:860px){.wmm-grid{grid-template-columns:1fr}.wmm-panel{min-height:0}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMMeasure(props: MeasureProps) {
    const {
        tag = "How we measure",
        headline = "Three questions every report answers",
        questions = [
            { label: "01 — Awareness", question: "Did people see it?", chips: "Reach, Impressions, Views, Frequency, Audience match" },
            { label: "02 — Engagement", question: "Did they care?", chips: "Engagement rate, Saves, Shares, Comment sentiment, Watch time" },
            { label: "03 — Business", question: "Did it move the business?", chips: "Clicks & CTR, Promo-code sales, Cost per result, ROAS, Search lift" },
        ],
        note = "no vanity metrics without context",
        footnote = "Live dashboard while the campaign runs. Full impact report within [__] days of wrap.",
        style,
    } = props

    return (
        <Section theme="cream" className="wmm" css={MEASURE_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <Words as="h2" className="wmm-h" text={headline} stagger={0.045} />
                <Stagger className="wmm-grid" step={0.12}>
                    {questions.map((q, i) => (
                        <article className={"wmm-panel" + (i === questions.length - 1 ? " dark" : "")} key={i}>
                            <span className="wmm-l">{q.label}</span>
                            <h3 className="wmm-q">{q.question}</h3>
                            <Stagger className="wmm-chips" step={0.05} delay={0.35 + i * 0.12} amount={0.6}>
                                {(q.chips || "")
                                    .split(",")
                                    .map((c) => c.trim())
                                    .filter(Boolean)
                                    .map((c, k) => (
                                        <span className="wmm-chip" key={k}>
                                            {c}
                                        </span>
                                    ))}
                            </Stagger>
                        </article>
                    ))}
                </Stagger>
                <div className="wmm-foot">
                    <Rule strong />
                    <Script className="wmm-note" delay={0.3} rotate={-2}>
                        {note}
                    </Script>
                    <Rise as="p" className="wmm-fn" delay={0.5}>
                        {fill(footnote)}
                    </Rise>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMMeasure, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "How we measure" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Three questions every report answers" },
    questions: {
        type: ControlType.Array,
        title: "Questions",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                question: { type: ControlType.String, title: "Question" },
                chips: { type: ControlType.String, title: "Metrics (comma separated)", displayTextArea: true },
            },
        },
        defaultValue: [
            { label: "01 — Awareness", question: "Did people see it?", chips: "Reach, Impressions, Views, Frequency, Audience match" },
            { label: "02 — Engagement", question: "Did they care?", chips: "Engagement rate, Saves, Shares, Comment sentiment, Watch time" },
            { label: "03 — Business", question: "Did it move the business?", chips: "Clicks & CTR, Promo-code sales, Cost per result, ROAS, Search lift" },
        ],
    },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "no vanity metrics without context" },
    footnote: {
        type: ControlType.String,
        title: "Footnote",
        displayTextArea: true,
        defaultValue: "Live dashboard while the campaign runs. Full impact report within [__] days of wrap.",
    },
})
