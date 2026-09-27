//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 19, "The sum of it" — "Add up every file and you get this" (with "this"
// in grey) beside four totals, the last one in ink with a vermilion label.
//@@ BODY

type Total = { label: string; value: string }

type SumProps = {
    tag: string
    headline: string
    greyWord: string
    footnote: string
    totals: Total[]
    style?: React.CSSProperties
}

const SUM_CSS = `
.wmsu-grid{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:clamp(32px,5cqw,90px);align-items:stretch;margin-top:clamp(24px,3cqw,44px)}
.wmsu-left{display:flex;flex-direction:column;justify-content:space-between;gap:40px}
.wmsu-h{font-weight:800;font-size:clamp(46px,6.4cqw,100px);line-height:.92;letter-spacing:-.05em}
.wmsu-fn{color:var(--mut);max-width:22em}
.wmsu-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px)}
.wmsu-tile{border-radius:16px;background:var(--cream2);padding:clamp(14px,1.4cqw,20px);min-height:clamp(170px,15cqw,230px);display:flex;flex-direction:column;justify-content:space-between;transition:transform .7s var(--ease)}
.wmsu-tile:hover{transform:translateY(-5px)}
.wmsu-tile.dark{background:var(--ink);color:var(--cream)}
.wmsu-pill{align-self:flex-start;display:inline-flex;align-items:center;min-height:26px;padding:5px 11px;line-height:1.2;border-radius:13px;background:var(--paper);color:var(--ink);font-size:12.5px;font-weight:500}
.wmsu-tile.dark .wmsu-pill{background:var(--red);color:var(--ink)}
.wmsu-v{align-self:flex-end;font-weight:800;font-size:clamp(46px,5.6cqw,86px);letter-spacing:-.05em;line-height:.88}
@container (max-width:860px){.wmsu-grid{grid-template-columns:1fr}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMSum(props: SumProps) {
    const {
        tag = "The sum of it",
        headline = "Add up\nevery file\nand you\nget",
        greyWord = "this",
        footnote = "Across [__] years, [__] cities and every major platform. Figures as of [month 2026].",
        totals = [
            { label: "Campaigns delivered", value: "[__]+" },
            { label: "Creators in our network", value: "[__]K" },
            { label: "Views generated", value: "[__]M" },
            { label: "Brands we've partnered with", value: "[__]" },
        ],
        style,
    } = props

    return (
        <Section theme="cream" className="wmsu" css={SUM_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmsu-grid">
                    <div className="wmsu-left">
                        <Words as="h2" className="wmsu-h" parts={[{ t: headline + " " }, { t: greyWord, c: "stone" }]} stagger={0.06} />
                        <Rise as="p" className="wmsu-fn wm-body" delay={0.4}>
                            {fill(footnote)}
                        </Rise>
                    </div>
                    <Stagger className="wmsu-tiles" step={0.1}>
                        {totals.slice(0, 4).map((t, i) => (
                            <div className={"wmsu-tile" + (i === 3 ? " dark" : "")} key={i}>
                                <span className="wmsu-pill">{t.label}</span>
                                <span className="wmsu-v">{fill(t.value)}</span>
                            </div>
                        ))}
                    </Stagger>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMSum, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "The sum of it" },
    headline: { type: ControlType.String, title: "Headline", displayTextArea: true, defaultValue: "Add up\nevery file\nand you\nget" },
    greyWord: { type: ControlType.String, title: "Grey word", defaultValue: "this" },
    footnote: {
        type: ControlType.String,
        title: "Footnote",
        displayTextArea: true,
        defaultValue: "Across [__] years, [__] cities and every major platform. Figures as of [month 2026].",
    },
    totals: {
        type: ControlType.Array,
        title: "Totals",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
            },
        },
        defaultValue: [
            { label: "Campaigns delivered", value: "[__]+" },
            { label: "Creators in our network", value: "[__]K" },
            { label: "Views generated", value: "[__]M" },
            { label: "Brands we've partnered with", value: "[__]" },
        ],
    },
})
