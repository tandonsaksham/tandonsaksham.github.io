//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 1 — "World Media." with the cream label block, the "Delhi, India" pill and
// the handwritten "psst… this is our portfolio too" with its arrow.
//@@ BODY

type HeroProps = {
    location: string
    line1: string
    line2: string
    note: string
    intro: string
    style?: React.CSSProperties
}

const HERO_CSS = `
.wmh .wm-wrap{min-height:min(100svh,1000px);display:flex;flex-direction:column;padding-top:clamp(112px,11cqw,156px);padding-bottom:clamp(36px,4cqw,60px)}
.wmh-top{display:flex;justify-content:flex-end;align-items:center;gap:16px}
.wmh-stage{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(36px,5cqw,80px) 0 clamp(28px,4cqw,56px)}
.wmh-title{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start}
.wmh-l1{display:inline-block;overflow:hidden;padding:.08em .06em .02em;margin:-.08em -.06em -.02em;white-space:nowrap}
.wmh-l1 .l{display:inline-block;transform:translate3d(0,110%,0);transition:transform 1.25s var(--ease);transition-delay:var(--d)}
.wmh-title.wm-in .wmh-l1 .l{transform:none}
.wmh-title .wm-mark{margin-top:.06em;padding-right:.9em}
.wmh-noteanchor{position:absolute;left:2.95em;top:-.02em;width:0;height:0}
.wmh-note{position:absolute;left:.12em;top:.06em;white-space:nowrap;font-size:clamp(18px,1.95cqw,30px);color:var(--red)}
.wmh-arrow{position:absolute;left:.62em;top:.5em;width:.55em;height:.44em;color:var(--red)}
.wmh-bottom{display:flex;align-items:flex-end}
.wmh-intro{max-width:34em;font-size:clamp(16px,1.45cqw,20px);line-height:1.5;color:var(--mut)}
@container (max-width:760px){
.wmh .wm-wrap{min-height:0}
.wmh-stage{padding:56px 0 44px}
.wmh-title{font-size:clamp(76px,25.5cqw,196px)}
.wmh-title .wm-mark{padding-right:.3em}
.wmh-noteanchor{position:relative;left:auto;top:auto;width:auto;height:auto;display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding-left:6px}
.wmh-note{position:relative;left:0;top:0;margin-top:16px;font-size:clamp(20px,5.6cqw,28px);transform:rotate(-3deg)!important}
.wmh-arrow{position:relative;left:0;top:0;flex:none;width:40px;height:32px;transform:scaleY(-1)}
}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMHero(props: HeroProps) {
    const {
        location = "Delhi, India",
        line1 = "World",
        line2 = "Media.",
        note = "psst… this is our portfolio too",
        intro = "Culture moves through people. We put brands right where the conversation is happening.",
        style,
    } = props

    const still = useStill()
    const stageRef = React.useRef<HTMLDivElement>(null)
    const [titleRef, titleIn] = useIn<HTMLDivElement>(0.2)

    const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end start"] })
    const titleY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, -70])

    const letters = Array.from(line1)

    return (
        <Section theme="ink" className="wmh" css={HERO_CSS} style={style} label={line1 + " " + line2}>
            <div className="wm-wrap">
                <div className="wmh-top">
                    <Fade delay={0.25}>
                        <span className="wm-pill">{location}</span>
                    </Fade>
                </div>

                <div className="wmh-stage" ref={stageRef}>
                    <motion.h1 ref={titleRef} className={"wmh-title wm-mega" + titleIn} style={{ y: titleY }} aria-label={line1 + " " + line2}>
                        <span className="wmh-l1" aria-hidden="true">
                            {letters.map((ch, i) => (
                                <span className="l" key={i} style={cssVars({ "--d": (0.2 + i * 0.055).toFixed(3) + "s" })}>
                                    {ch === " " ? String.fromCharCode(160) : ch}
                                </span>
                            ))}
                        </span>
                        <span style={{ position: "relative", display: "inline-block" }} aria-hidden="true">
                            <Mark delay={0.62}>{line2}</Mark>
                        </span>
                        <span className="wmh-noteanchor" aria-hidden="true">
                            <Arrow kind="curl" className="wmh-arrow" delay={1.95} stroke={3.2} />
                            <Script className="wmh-note" delay={1.35} rotate={-6}>
                                {note}
                            </Script>
                        </span>
                    </motion.h1>
                </div>

                <div className="wmh-bottom">
                    <Rise as="p" className="wmh-intro" delay={1.15}>
                        {intro}
                    </Rise>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMHero, {
    location: { type: ControlType.String, title: "Location", defaultValue: "Delhi, India" },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: "World" },
    line2: { type: ControlType.String, title: "Line 2 (block)", defaultValue: "Media." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "psst… this is our portfolio too" },
    intro: {
        type: ControlType.String,
        title: "Intro",
        displayTextArea: true,
        defaultValue: "Culture moves through people. We put brands right where the conversation is happening.",
    },
})
