//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the chapter opener used five times (01 The shift … 05 What's next). Giant
// vermilion numeral, spaced label across it, the stack of short lines whose vermilion line
// marks the chapter's position, and the long rule dividing headline from body.
//@@ BODY

type ChapterProps = {
    number: string
    label: string
    headline: string
    body: string
    total: number
    anchor: string
    style?: React.CSSProperties
}

const CHAPTER_CSS = `
.wmc.wm-sec{background:radial-gradient(60% 55% at 70% 52%,rgba(242,238,229,.05),rgba(242,238,229,.018) 55%,transparent 88%),var(--ink)}
.wmc .wm-wrap{padding-top:clamp(88px,9cqw,136px)}
.wmc-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4cqw,64px);align-items:stretch}
.wmc-rule{position:absolute;left:0;right:0;top:50%;z-index:0}
.wmc-num{position:relative;z-index:1;display:flex;align-items:center;min-height:clamp(150px,24cqw,380px);padding-left:clamp(56px,7cqw,112px)}
.wmc-lines{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:clamp(6px,.7cqw,10px);width:clamp(40px,5cqw,76px)}
.wmc-lines i{display:block;height:1px;width:78%;background:var(--line2);transform:scaleX(0);transform-origin:0 50%;transition:transform 1s var(--ease);transition-delay:calc(var(--k) * .07s + .1s)}
.wmc-lines i.on{height:2px;width:100%;background:var(--red)}
.wmc-lines.wm-in i{transform:none}
.wmc-drift{position:relative;z-index:0}
.wmc-digits{display:flex;font-weight:800;font-size:clamp(150px,24cqw,380px);line-height:.78;letter-spacing:-.06em;color:var(--red)}
.wmc-d{display:inline-block;overflow:hidden;padding:.06em .02em .04em;margin:-.06em -.02em -.04em}
.wmc-d span{display:inline-block;transform:translate3d(0,105%,0);transition:transform 1.3s var(--ease);transition-delay:calc(var(--k) * .1s)}
.wmc-digits.wm-in .wmc-d span{transform:none}
.wmc-label{position:absolute;left:clamp(80px,10cqw,160px);top:50%;transform:translateY(-50%);z-index:2;white-space:nowrap;font-weight:300;font-size:clamp(14px,1.55cqw,23px);text-transform:uppercase;letter-spacing:.34em;color:var(--cream);
opacity:0;letter-spacing:.7em;transition:opacity 1.2s var(--ease) .5s,letter-spacing 1.6s var(--ease) .5s}
.wmc-label.wm-in{opacity:1;letter-spacing:.34em}
.wmc-text{position:relative;z-index:1;display:grid;grid-template-rows:1fr 1fr}
.wmc-h{align-self:end;padding-bottom:clamp(28px,3.4cqw,52px);font-weight:760;font-size:clamp(30px,3.7cqw,58px);line-height:1;letter-spacing:-.035em;max-width:14em}
.wmc-b{align-self:start;padding-top:clamp(20px,2.2cqw,32px);max-width:34em;color:var(--mut)}
@container (max-width:760px){
.wmc-grid{grid-template-columns:1fr;gap:28px}
.wmc-rule{top:clamp(75px,24cqw,190px)}
.wmc-num{min-height:0;padding-left:clamp(48px,14cqw,72px)}
.wmc-digits{font-size:clamp(130px,40cqw,300px)}
.wmc-label{left:clamp(64px,20cqw,110px)}
.wmc-text{grid-template-rows:auto auto}
.wmc-h{padding-bottom:16px}.wmc-b{padding-top:0}
}
@container (max-width:560px){.wmc-h br{display:none}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMChapter(props: ChapterProps) {
    const {
        number = "01",
        label = "The shift",
        headline = "People tune out ads.\nThey listen to people.",
        body = "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
        total = 5,
        anchor = "the-shift",
        style,
    } = props

    const pos = Math.max(1, Math.min(total, parseInt(number, 10) || 1))
    const numRef = React.useRef<HTMLDivElement>(null)
    const drift = useDrift(numRef, 28)
    const [linesRef, linesIn] = useIn<HTMLDivElement>(0.5)
    const [digitsRef, digitsIn] = useIn<HTMLDivElement>(0.4)
    const [labelRef, labelIn] = useIn<HTMLSpanElement>(0.5)
    const digits = Array.from(number)

    return (
        <Section theme="ink" id={anchor} className="wmc" css={CHAPTER_CSS} style={style} label={"Chapter " + number + " — " + label}>
            <div className="wm-wrap">
                <div className="wmc-grid">
                    <Rule className="wmc-rule" delay={0.35} />
                    <div ref={numRef} className="wmc-num">
                        <div ref={linesRef} className={"wmc-lines" + linesIn} aria-hidden="true">
                            {Array.from({ length: total }).map((_, k) => (
                                <i key={k} className={k + 1 === pos ? "on" : undefined} style={cssVars({ "--k": k })} />
                            ))}
                        </div>
                        <motion.div className="wmc-drift" style={{ y: drift }}>
                            <div ref={digitsRef} className={"wmc-digits" + digitsIn} aria-hidden="true">
                                {digits.map((d, k) => (
                                    <span className="wmc-d" key={k}>
                                        <span style={cssVars({ "--k": k })}>{d}</span>
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                        <span ref={labelRef} className={"wmc-label" + labelIn}>
                            {label}
                        </span>
                    </div>
                    <div className="wmc-text">
                        <Words as="h2" className="wmc-h" text={headline} delay={0.3} stagger={0.05} />
                        <Rise as="p" className="wmc-b wm-body" delay={0.55}>
                            {body}
                        </Rise>
                    </div>
                </div>
                <PageLabel text={"Chapter " + number + " / " + String(total).padStart(2, "0")} />
            </div>
        </Section>
    )
}

addPropertyControls(WMChapter, {
    number: { type: ControlType.String, title: "Number", defaultValue: "01" },
    label: { type: ControlType.String, title: "Label", defaultValue: "The shift" },
    headline: {
        type: ControlType.String,
        title: "Headline",
        displayTextArea: true,
        defaultValue: "People tune out ads.\nThey listen to people.",
    },
    body: {
        type: ControlType.String,
        title: "Body",
        displayTextArea: true,
        defaultValue:
            "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
    },
    total: { type: ControlType.Number, title: "Chapters", defaultValue: 5, min: 1, max: 9, step: 1 },
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "the-shift" },
})
