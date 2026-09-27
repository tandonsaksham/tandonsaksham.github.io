//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 1 — "WE ARE / World Media." with the cream label block, the vermilion
// circle and the handwritten "psst… this is our portfolio too" with its arrow.
//@@ BODY

type HeroProps = {
    eyebrow: string
    location: string
    line1: string
    line2: string
    note: string
    intro: string
    style?: React.CSSProperties
}

const HERO_CSS = `
.wmh .wm-wrap{min-height:min(100svh,1000px);display:flex;flex-direction:column;padding-top:clamp(112px,11cqw,156px);padding-bottom:clamp(36px,4cqw,60px)}
.wmh-top{display:flex;justify-content:space-between;align-items:center;gap:16px}
.wmh-stage{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;padding:clamp(36px,5cqw,80px) 0 clamp(28px,4cqw,56px)}
.wmh-title{position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-start}
.wmh-l1{display:inline-block;overflow:hidden;padding:.08em .06em .02em;margin:-.08em -.06em -.02em;white-space:nowrap}
.wmh-l1 .l{display:inline-block;transform:translate3d(0,110%,0);transition:transform 1.25s var(--ease);transition-delay:var(--d)}
.wmh-title.wm-in .wmh-l1 .l{transform:none}
.wmh-title .wm-mark{margin-top:.06em;padding-right:.9em}
.wmh-noteanchor{position:absolute;left:2.95em;top:-.02em;width:0;height:0}
.wmh-note{position:absolute;left:.12em;top:.06em;white-space:nowrap;font-size:clamp(18px,1.95cqw,30px);color:var(--red)}
.wmh-arrow{position:absolute;left:.62em;top:.5em;width:.55em;height:.44em;color:var(--red)}
.wmh-dotwrap{position:absolute;z-index:1;right:clamp(0px,4cqw,72px);top:50%;margin-top:calc(clamp(118px,17cqw,264px) / -2 + 3cqw)}
.wmh-dot{width:clamp(118px,17cqw,264px);aspect-ratio:1;border-radius:50%;background:var(--red);transform:scale(0);transition:transform 1.5s cubic-bezier(.34,1.56,.64,1) 1s}
.wmh-dotscope.wm-in .wmh-dot{transform:scale(1)}
.wmh-bottom{display:flex;justify-content:space-between;align-items:flex-end;gap:32px}
.wmh-intro{max-width:34em;font-size:clamp(16px,1.45cqw,20px);line-height:1.5;color:var(--mut)}
.wmh-cue{display:flex;align-items:center;gap:12px;white-space:nowrap}
.wmh-cue i{display:block;width:1px;height:38px;background:var(--line2);position:relative;overflow:hidden}
.wmh-cue i::after{content:"";position:absolute;left:0;top:-40%;width:1px;height:40%;background:var(--red);animation:wmhcue 2.2s var(--ease) infinite}
@keyframes wmhcue{0%{top:-40%}70%,100%{top:110%}}
@container (max-width:760px){
.wmh-stage{justify-content:flex-end;padding:40px 0 26px}
.wmh-title{font-size:clamp(76px,25.5cqw,196px)}
.wmh-title .wm-mark{padding-right:.3em}
.wmh-noteanchor{position:relative;left:auto;top:auto;width:auto;height:auto;display:flex;align-items:flex-start;gap:8px;margin-top:14px;padding-left:6px}
.wmh-note{position:relative;left:0;top:0;margin-top:16px;font-size:clamp(20px,5.6cqw,28px);transform:rotate(-3deg)!important}
.wmh-arrow{position:relative;left:0;top:0;flex:none;width:40px;height:32px;transform:scaleY(-1)}
.wmh-dotwrap{top:4%;right:-16cqw;margin-top:0}
.wmh-dot{width:60cqw}
.wmh-bottom{flex-direction:column;align-items:flex-start}
.wmh-cue{display:none}
}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMHero(props: HeroProps) {
    const {
        eyebrow = "We are",
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
    const [dotRef, dotIn] = useIn<HTMLDivElement>(0.2)

    const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end start"] })
    const titleY = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, -70])
    const dotScroll = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [0, 150])
    const mx = useSpring(0, { stiffness: 50, damping: 15, mass: 0.8 })
    const my = useSpring(0, { stiffness: 50, damping: 15, mass: 0.8 })
    const dotY = useTransform([dotScroll, my], (v: number[]) => v[0] + v[1])

    React.useEffect(() => {
        if (still || typeof window === "undefined") return
        const fine = window.matchMedia ? window.matchMedia("(pointer: fine)").matches : false
        if (!fine) return
        const onMove = (e: MouseEvent) => {
            mx.set((e.clientX / window.innerWidth - 0.5) * 44)
            my.set((e.clientY / window.innerHeight - 0.5) * 44)
        }
        window.addEventListener("mousemove", onMove, { passive: true })
        return () => window.removeEventListener("mousemove", onMove)
    }, [still, mx, my])

    const letters = Array.from(line1)

    return (
        <Section theme="ink" className="wmh" css={HERO_CSS} style={style} label={line1 + " " + line2}>
            <div className="wm-wrap">
                <div className="wmh-top">
                    <Fade className="wm-mono wm-cap wm-mut" delay={0.1}>
                        {eyebrow}
                    </Fade>
                    <Fade delay={0.25}>
                        <span className="wm-pill">{location}</span>
                    </Fade>
                </div>

                <div className="wmh-stage" ref={stageRef}>
                    <motion.div className="wmh-dotwrap" style={{ x: mx, y: dotY }}>
                        <div ref={dotRef} className={"wmh-dotscope" + dotIn}>
                            <div className="wmh-dot" aria-hidden="true" />
                        </div>
                    </motion.div>

                    <motion.h1 ref={titleRef} className={"wmh-title wm-mega" + titleIn} style={{ y: titleY }} aria-label={line1 + " " + line2}>
                        <span className="wmh-l1" aria-hidden="true">
                            {letters.map((ch, i) => (
                                <span className="l" key={i} style={cssVars({ "--d": (0.2 + i * 0.055).toFixed(3) + "s" })}>
                                    {ch === " " ? " " : ch}
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
                    <Fade className="wmh-cue wm-mono wm-mut" delay={1.6} aria-hidden="true">
                        <i />
                        Scroll
                    </Fade>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMHero, {
    eyebrow: { type: ControlType.String, title: "Eyebrow", defaultValue: "We are" },
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
