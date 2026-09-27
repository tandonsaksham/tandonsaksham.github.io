//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 22, "The road ahead" — the red dot of the section tag hops onto a dashed road
// and rolls toward 2030 as you scroll, turning the road it has covered solid; each year lights up
// and its cream milestone card swings down from the line. 2030 is in vermilion.
//@@ BODY

type Milestone = { year: string; title: string; body: string }

type VisionProps = {
    tag: string
    headline: string
    note: string
    milestones: Milestone[]
    style?: React.CSSProperties
}

const VISION_CSS = `
.wmv-tag{display:block}
.wmv-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-top:clamp(22px,2.6cqw,36px)}
.wmv-h{font-weight:780;font-size:clamp(40px,6.2cqw,98px);line-height:.96;letter-spacing:-.045em}
.wmv-note{color:var(--red);font-size:clamp(21px,2.1cqw,31px);margin-bottom:.4em}
.wmv-track{--vt:0;position:relative;margin-top:clamp(44px,5.4cqw,80px)}
.wmv-rail{position:absolute;left:calc(-50vw + 50%);right:calc(-50vw + 50%);top:6px;height:1.5px;background:repeating-linear-gradient(90deg,rgba(242,238,229,.34) 0 7px,transparent 7px 14px)}
.wmv-fill{position:absolute;z-index:3;display:block;width:1.5px;height:1.5px;background:var(--cream);transform-origin:0 0;pointer-events:none}
.wmv-cols{position:relative;z-index:2;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px)}
.wmv-col{position:relative;display:flex;flex-direction:column}
.wmv-node{position:relative;z-index:4;align-self:center;width:13px;height:13px;border-radius:50%;background:var(--ink);border:1.5px solid var(--cream);margin-bottom:18px}
.wmv-node i{position:absolute;inset:-1.5px;border-radius:50%;background:var(--cream);transform:scale(0)}
.wmv-node::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1.5px solid var(--cream);opacity:0;pointer-events:none}
.wmv-col:last-child .wmv-node,.wmv-col:last-child .wmv-node::after{border-color:var(--red)}
.wmv-col:last-child .wmv-node i{background:var(--red)}
.wmv-year{text-align:center;font-family:"DM Mono",ui-monospace,monospace;font-size:12px;padding:6px 8px;border-radius:99px;background:rgba(242,238,229,.1);margin-bottom:10px;opacity:0}
.wmv-col:last-child .wmv-year{background:var(--red);color:var(--ink)}
.wmv-card{display:flex;flex-direction:column;justify-content:space-between;gap:24px;min-height:clamp(190px,16cqw,240px);padding:clamp(18px,1.8cqw,24px);border-radius:16px;background:var(--cream);color:var(--ink);opacity:0;transform-origin:50% 0;transition:transform .7s var(--ease)}
.wmv-card h3{font-weight:760;font-size:clamp(21px,2cqw,28px);line-height:1.05;letter-spacing:-.028em}
.wmv-card p{font-size:13.5px;line-height:1.45;color:rgba(15,15,15,.64)}
.wmv-col.on .wmv-node i{transform:none;animation:wmv-pop .7s cubic-bezier(.34,1.56,.64,1) backwards}
.wmv-col.on .wmv-node::after{animation:wmv-ring .9s var(--ease) backwards}
.wmv-col.end .wmv-node::after{animation:wmv-ring 1.1s var(--ease) .15s 2 backwards}
.wmv-col.on .wmv-year{opacity:1;animation:wmv-pill .55s var(--ease) backwards}
.wmv-col.on .wmv-card{opacity:1;animation:wmv-drop 1.3s linear .06s backwards}
.wmv-col.on .wmv-card:hover{transform:translateY(-6px)}
.wmv-ball{position:absolute;left:0;top:0;z-index:6;display:block;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:var(--red);box-shadow:0 0 0 5px rgba(233,67,27,.18),0 8px 22px -4px rgba(233,67,27,.7);pointer-events:none}
.wmv.hop .wm-chrome .wm-dots i:last-child{background:transparent;box-shadow:inset 0 0 0 1.5px var(--red)}
.wmv.done .wm-chrome .wm-dots i:last-child{animation:wmv-pop .6s cubic-bezier(.34,1.56,.64,1) .35s backwards}
.wmv.still *{animation:none!important}
@keyframes wmv-pop{from{transform:scale(0)}}
@keyframes wmv-ring{from{transform:scale(.3);opacity:.9}to{transform:scale(1.5);opacity:0}}
@keyframes wmv-pill{from{opacity:0;transform:translateY(-12px)}}
@keyframes wmv-drop{0%{opacity:0;transform:perspective(1000px) rotateX(-84deg);animation-timing-function:cubic-bezier(.3,0,.6,1)}40%{opacity:1;transform:perspective(1000px) rotateX(15deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}62%{transform:perspective(1000px) rotateX(-6deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}82%{transform:perspective(1000px) rotateX(2deg);animation-timing-function:cubic-bezier(.4,0,.5,1)}100%{opacity:1;transform:perspective(1000px) rotateX(0)}}
@keyframes wmv-slide{from{opacity:0;transform:translateX(-22px)}}
@container (max-width:860px){
.wmv-head{flex-direction:column;align-items:flex-start}
.wmv-track{--vt:1;padding-left:40px}
.wmv-rail{left:6px;right:auto;top:0;bottom:0;width:1.5px;height:auto;background:repeating-linear-gradient(180deg,rgba(242,238,229,.34) 0 7px,transparent 7px 14px)}
.wmv-cols{grid-template-columns:1fr;gap:22px}
.wmv-node{position:absolute;left:-40px;top:6px;margin:0}
.wmv-year{align-self:flex-start;padding:6px 14px}
.wmv-card{min-height:0;gap:28px}
.wmv-col.on .wmv-card,.wmv-col.on .wmv-year{animation:wmv-slide .8s var(--ease) backwards}
.wmv-col.on .wmv-card{animation-delay:.08s}
}
@container (max-width:640px){.wmv-track{margin-top:30px}.wmv-cols{gap:14px}.wmv-card{gap:14px;padding:16px 16px 18px}}
`

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
        style,
    } = props

    const still = useStill()
    const n = Math.max(1, milestones.length)
    const t = useBallTrack(n, still)
    const L = t.lay

    return (
        <Section
            theme="ink"
            className={"wmv" + (still ? " still" : "") + (t.stage >= 1 && t.stage < 3 ? " hop" : "") + (t.stage === 3 && !still ? " done" : "")}
            css={VISION_CSS}
            style={style}
            label={headline}
        >
            <div className="wm-wrap" ref={t.wrapRef}>
                <div className="wmv-tag" ref={t.chromeRef}>
                    <Chrome label={tag} />
                </div>
                <div className="wmv-head">
                    <Words as="h2" className="wmv-h" text={headline} stagger={0.06} />
                    <Script className="wmv-note" delay={0.6} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <div className="wmv-track" ref={t.trackRef}>
                    <span className="wmv-rail" aria-hidden="true" />
                    <ol className="wmv-cols">
                        {milestones.map((m, i) => (
                            <li className={"wmv-col" + (i < t.lit ? " on" : "") + (i === n - 1 && t.stage === 3 && !still ? " end" : "")} key={i}>
                                <span className="wmv-node" data-node="" aria-hidden="true">
                                    <i />
                                </span>
                                <span className="wmv-year">{m.year}</span>
                                <div className="wmv-card">
                                    <h3>{m.title}</h3>
                                    <p>{fill(m.body)}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                {L ? (
                    <motion.span
                        className="wmv-fill"
                        aria-hidden="true"
                        style={L.v ? { left: L.s.x - 0.75, top: L.s.y, height: L.len, scaleY: t.along } : { left: L.s.x, top: L.s.y - 0.75, width: L.len, scaleX: t.along }}
                    />
                ) : null}
                {!still ? <motion.span className="wmv-ball" aria-hidden="true" style={{ x: t.x, y: t.y, scaleX: t.sx, scaleY: t.sy, opacity: t.o }} /> : null}
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
})
