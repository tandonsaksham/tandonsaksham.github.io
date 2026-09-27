//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slides 15 and 17, "the receipts". Variant "grid" (cream) — The receipts., the
// giant vermilion total and four stat tiles; variant "hero" (ink) — the giant lift figure
// and a row of four stats. The deck's "[__]" blanks open up like a form waiting to be filled.
//@@ BODY

type Stat = { label: string; value: string }

type ReceiptsProps = {
    variant: "grid" | "hero"
    tag: string
    headline: string
    bigLabel: string
    bigValue: string
    note: string
    statsGrid: Stat[]
    statsHero: Stat[]
    changedLabel: string
    changedText: string
    style?: React.CSSProperties
}

const RECEIPTS_CSS = `
.wmr-big{display:inline-flex;align-items:baseline;font-weight:800;line-height:.8;letter-spacing:-.05em;color:var(--red);white-space:nowrap}
.wmr-blank{display:inline-block;position:relative;width:0;height:.62em;transition:width 1.4s var(--ease-io) .2s}
.wmr-blank::after{content:"";position:absolute;left:.06em;right:.06em;bottom:-.02em;height:.09em;background:currentColor;animation:wmblink 1.2s steps(1,end) infinite}
.wmr-bigin.wm-in .wmr-blank{width:var(--bw,1.1em)}
.wmrg-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,5cqw,90px);align-items:stretch;margin-top:clamp(24px,3cqw,44px)}
.wmrg-left{display:flex;flex-direction:column;justify-content:space-between;gap:40px}
.wmrg-h{font-weight:800;font-size:clamp(48px,7cqw,108px);line-height:.92;letter-spacing:-.05em}
.wmrg-total .wm-mono{display:block;margin-bottom:10px}
.wmrg-total .wmr-big{font-size:clamp(96px,13.5cqw,210px)}
.wmrg-note{display:inline-block;margin-top:14px;font-size:clamp(20px,1.9cqw,28px)}
.wmrg-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px)}
.wmrg-tile{position:relative;border-radius:16px;background:var(--cream2);padding:clamp(14px,1.4cqw,20px);min-height:clamp(140px,12.5cqw,190px);display:flex;flex-direction:column;justify-content:space-between}
.wmrg-pill{align-self:flex-start;display:inline-flex;align-items:center;height:26px;padding:0 11px;border-radius:99px;background:var(--paper);font-size:12.5px;font-weight:500}
.wmrg-v{align-self:flex-end;font-weight:800;font-size:clamp(34px,4.1cqw,62px);letter-spacing:-.045em;line-height:.9}
.wmrg-changed{grid-column:1/-1;border-radius:16px;background:var(--ink);color:var(--cream);padding:clamp(18px,1.8cqw,26px)}
.wmrg-changed .wm-mono{color:var(--red);text-transform:uppercase;letter-spacing:.08em}
.wmrg-changed p{margin-top:10px;font-size:clamp(16px,1.4cqw,20px);line-height:1.4;max-width:30em}
.wmrh-row{display:flex;align-items:center;gap:clamp(24px,4cqw,64px);margin-top:clamp(24px,3cqw,44px);flex-wrap:wrap}
.wmrh-row .wmr-big{font-size:clamp(120px,19cqw,300px)}
.wmrh-side{max-width:22em}
.wmrh-side h3{font-weight:760;font-size:clamp(24px,2.5cqw,38px);line-height:1.08;letter-spacing:-.03em}
.wmrh-note{display:inline-block;margin-top:12px;color:var(--cream);opacity:.9}
.wmrh-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(48px,6cqw,96px)}
.wmrh-stat{padding:4px clamp(14px,1.6cqw,24px) 0;border-left:1px solid var(--line2)}
.wmrh-stat .wm-mono{color:var(--mut);text-transform:uppercase;letter-spacing:.08em;font-size:11.5px}
.wmrh-stat b{display:block;margin-top:10px;font-weight:800;font-size:clamp(30px,3.4cqw,50px);letter-spacing:-.045em;line-height:.95}
@container (max-width:860px){.wmrg-grid{grid-template-columns:1fr}.wmrh-stats{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:28px}}
@container (max-width:640px){.wmrg-grid{gap:26px}.wmrg-left{gap:22px}.wmrg-tile{min-height:120px}.wmrh-stats{margin-top:34px}}
`

/** Giant "[__]M" with brackets that open up and a blinking blank. */
function BigBlank(p: { value: string; delay?: number }) {
    const [ref, inCls] = useIn<HTMLSpanElement>(0.4)
    const parts = (p.value || "").split("[__]")
    if (parts.length < 2) return <span className="wmr-big">{p.value}</span>
    return (
        <span ref={ref} className={"wmr-big wmr-bigin" + inCls} aria-label={p.value.replace("[__]", "blank ")}>
            <span aria-hidden="true">{parts[0]}[</span>
            <span className="wmr-blank" aria-hidden="true" />
            <span aria-hidden="true">]{parts.slice(1).join("[__]")}</span>
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMReceipts(props: ReceiptsProps) {
    const variant = props.variant || "grid"
    const isGrid = variant === "grid"
    const {
        tag = isGrid ? "Case file 001 — the receipts" : "Case file 002 — the receipts",
        headline = isGrid ? "The receipts." : "lift in [the metric that mattered most]",
        bigLabel = "Total views",
        bigValue = isGrid ? "[__]M" : "[__]%",
        note = isGrid ? "numbers don't lie (we checked twice)" : "the number the CFO asked about first",
        statsGrid = [
            { label: "Reach", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Saves + shares", value: "[__]K" },
            { label: "Cost per view", value: "₹[__]" },
        ],
        statsHero = [
            { label: "Views", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Creators", value: "[__]" },
            { label: "Cost per engagement", value: "₹[__]" },
        ],
        changedLabel = "What changed for [brand]",
        changedText = "[The business outcome in one line: sell-out, app installs, search lift, store footfall.]",
        style,
    } = props

    const stats = isGrid ? statsGrid : statsHero

    if (isGrid) {
        return (
            <Section theme="cream" className="wmr" css={RECEIPTS_CSS} style={style} label={tag}>
                <div className="wm-wrap">
                    <Chrome label={tag} />
                    <div className="wmrg-grid">
                        <div className="wmrg-left">
                            <Words as="h2" className="wmrg-h" text={headline} />
                            <div className="wmrg-total">
                                <Fade className="wm-mono wm-cap wm-mut">{bigLabel}</Fade>
                                <BigBlank value={bigValue} />
                                <div>
                                    <Script className="wmrg-note" delay={1.1} rotate={-2}>
                                        {note}
                                    </Script>
                                </div>
                            </div>
                        </div>
                        <Stagger className="wmrg-tiles" step={0.09}>
                            {stats.slice(0, 4).map((s, i) => (
                                <div className="wmrg-tile" key={i}>
                                    <span className="wmrg-pill">{s.label}</span>
                                    <span className="wmrg-v">{fill(s.value)}</span>
                                </div>
                            ))}
                            <div className="wmrg-changed">
                                <span className="wm-mono">{changedLabel}</span>
                                <p>{fill(changedText)}</p>
                            </div>
                        </Stagger>
                    </div>
                </div>
            </Section>
        )
    }

    return (
        <Section theme="ink" className="wmr" css={RECEIPTS_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmrh-row">
                    <BigBlank value={bigValue} />
                    <div className="wmrh-side">
                        <Words as="h3" text={headline} delay={0.4} />
                        <Script className="wmrh-note" delay={1.1} rotate={-2}>
                            {note}
                        </Script>
                    </div>
                </div>
                <Stagger className="wmrh-stats" step={0.09}>
                    {stats.slice(0, 4).map((s, i) => (
                        <div className="wmrh-stat" key={i}>
                            <span className="wm-mono">{s.label}</span>
                            <b>{fill(s.value)}</b>
                        </div>
                    ))}
                </Stagger>
            </div>
        </Section>
    )
}

addPropertyControls(WMReceipts, {
    variant: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["grid", "hero"],
        optionTitles: ["Tiles (cream)", "Big number (ink)"],
        defaultValue: "grid",
        displaySegmentedControl: true,
    },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Case file 001 — the receipts" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "The receipts." },
    bigLabel: { type: ControlType.String, title: "Big label", defaultValue: "Total views", hidden: (p: any) => p.variant === "hero" },
    bigValue: { type: ControlType.String, title: "Big number", defaultValue: "[__]M" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "numbers don't lie (we checked twice)" },
    statsGrid: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
            },
        },
        defaultValue: [
            { label: "Reach", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Saves + shares", value: "[__]K" },
            { label: "Cost per view", value: "₹[__]" },
        ],
        hidden: (p: any) => p.variant === "hero",
    },
    statsHero: {
        type: ControlType.Array,
        title: "Stats",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
            },
        },
        defaultValue: [
            { label: "Views", value: "[__]M" },
            { label: "Engagement rate", value: "[__]%" },
            { label: "Creators", value: "[__]" },
            { label: "Cost per engagement", value: "₹[__]" },
        ],
        hidden: (p: any) => p.variant !== "hero",
    },
    changedLabel: { type: ControlType.String, title: "Outcome label", defaultValue: "What changed for [brand]", hidden: (p: any) => p.variant === "hero" },
    changedText: {
        type: ControlType.String,
        title: "Outcome",
        displayTextArea: true,
        defaultValue: "[The business outcome in one line: sell-out, app installs, search lift, store footfall.]",
        hidden: (p: any) => p.variant === "hero",
    },
})
