//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: About. Why World Media exists, in one big paragraph that fills in word by word
// as you read down (with two small pictures set into the text), then how a campaign runs in
// five steps, and a progress bar that marks where you are on the page.
//@@ BODY

type Step = { title: string; body: string }

type AboutProps = {
    text: string
    steps: Step[]
    stepsTitle: string
    photo1?: { src?: string; srcSet?: string; alt?: string }
    photo2?: { src?: string; srcSet?: string; alt?: string }
    samples: boolean
    style?: React.CSSProperties
}

const ABOUT_CSS = `
.w2a-wrap{padding:clamp(72px,8cqw,128px) var(--gut) var(--m)}
.w2a-wrap>.w2-lbl{color:var(--mut)}
.w2a-text{margin-top:clamp(34px,4.4cqw,72px);max-width:22em;font-size:clamp(28px,3.5cqw,58px);line-height:1.12;letter-spacing:-.04em}
.w2a-text .tw{opacity:clamp(.18,calc(var(--p,0) - var(--i)),1);transition:opacity .25s linear}
.w2a-text .w2-it{font-size:1.06em}
.w2a-text .w2-media{height:.8em;vertical-align:-.08em}
.w2a-steps{margin-top:clamp(56px,7cqw,120px)}
.w2a-steps h3{font-size:clamp(20px,1.7cqw,26px);letter-spacing:-.02em;text-transform:uppercase}
.w2a-row{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--m);margin-top:clamp(18px,2cqw,28px)}
.w2a-step{position:relative;display:flex;flex-direction:column;gap:10px;min-height:clamp(190px,17cqw,250px);padding:clamp(18px,1.7cqw,26px);border-radius:var(--r);background:var(--paper2);
transition:background-color .5s var(--ease),translate .5s var(--ease)}
.w2a-step:hover{background:var(--sc);translate:0 -4px}
.w2a-step em{font-style:normal;font-size:12px;color:var(--mut)}
.w2a-step b{margin-top:auto;font-size:clamp(22px,2cqw,30px);font-weight:500;letter-spacing:-.035em}
.w2a-step p{font-size:14.5px;line-height:1.42;font-weight:400;color:rgba(22,21,20,.72)}
.w2a-bar{display:flex;align-items:center;gap:18px;margin-top:var(--m);height:58px;padding:0 24px;border:1px solid var(--line2);border-radius:99px;font-size:12px}
.w2a-track{position:relative;flex:1;height:4px;border-radius:4px;background:var(--line);overflow:hidden}
.w2a-fill{position:absolute;inset:0;background:var(--sky);border-radius:4px;transform-origin:0 50%}
@container (max-width:1000px){.w2a-row{grid-template-columns:repeat(2,1fr)}.w2a-step:last-child{grid-column:1/-1}}
@container (max-width:560px){.w2a-row{grid-template-columns:1fr}.w2a-step{min-height:0}.w2a-step b{margin-top:6px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2About(props: AboutProps) {
    const {
        text = "We started World Media to fix one thing: brands renting attention instead of earning trust. [1] So we treat creators as partners, cast for trust over reach, and prove every campaign in numbers *your business actually cares about.* [2]",
        stepsTitle = "How a campaign runs",
        steps = [
            { title: "Listen", body: "We start with your business goal and your audience’s feed." },
            { title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { title: "Amplify", body: "The best posts get paid reach, whitelisting and cross-posting." },
            { title: "Measure", body: "A live dashboard, then a straight read on what worked." },
        ],
        photo1,
        photo2,
        samples = true,
        style,
    } = props
    const still = useStill()
    const pref = React.useRef<HTMLParagraphElement>(null)
    const sref = React.useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: pref, offset: ["start 0.82", "end 0.42"] })
    const { scrollYProgress: whole } = useScroll({ target: sref, offset: ["start end", "end end"] })
    const fill = useTransform(whole, [0, 1], [0.04, 1])

    // Split into words and picture slots: [1] and [2] mark where the pictures go.
    const tokens: { t: string; it: boolean; media?: number }[] = []
    String(text || "")
        .split(/(\[\d\])/)
        .forEach((seg) => {
            const m = /^\[(\d)\]$/.exec(seg)
            if (m) tokens.push({ t: "", it: false, media: +m[1] })
            else parseWords(seg).forEach((w) => tokens.push(w))
        })
    const count = tokens.filter((t) => !t.media).length

    useMotionValueEvent(scrollYProgress, "change", (v) => {
        const el = pref.current
        if (el) el.style.setProperty("--p", (v * (count + 2)).toFixed(2))
    })
    React.useEffect(() => {
        const el = pref.current
        if (el) el.style.setProperty("--p", still ? String(count + 2) : (scrollYProgress.get() * (count + 2)).toFixed(2))
    }, [still, count])

    let wi = 0
    // An empty slot shows a sample photo, unless samples are switched off.
    const photos = [photo1, photo2].map((ph, i) => (ph && ph.src ? ph : samples ? { src: SAMPLE + "about-" + (i + 1) + ".jpg", alt: "" } : undefined))
    const hues = ["lime", "lilac"]
    return (
        <Section tone="paper" id="about" className="w2a" css={ABOUT_CSS} label="About" style={style}>
            <div className="w2a-wrap" ref={sref as React.RefObject<HTMLDivElement>}>
                <Label name="About" index={4} />
                <h2 className="w2-sr">About World Media</h2>
                <p ref={pref} className="w2a-text">
                    {tokens.map((tk, i) => {
                        if (tk.media) {
                            const ph = photos[tk.media - 1]
                            return (
                                <React.Fragment key={i}>
                                    {" "}
                                    <Media src={ph && ph.src} alt={ph && ph.alt} hue={hues[(tk.media - 1) % 2]} width="1.5em" />
                                </React.Fragment>
                            )
                        }
                        const idx = wi++
                        return (
                            <React.Fragment key={i}>
                                {i ? " " : null}
                                <span className={"tw" + (tk.it ? " w2-it" : "")} style={cssVars({ "--i": idx })}>
                                    {tk.t}
                                </span>
                            </React.Fragment>
                        )
                    })}
                </p>
                <div className="w2a-steps">
                    <Reveal as="h3" className="w2-rise">
                        {stepsTitle}
                    </Reveal>
                    <ol className="w2a-row">
                        {steps.map((s, i) => (
                            <Reveal
                                as="li"
                                key={i}
                                className="w2a-step w2-rise"
                                delay={i * 0.08}
                                style={cssVars({ "--sc": ["var(--red)", "var(--lime)", "var(--sky)", "var(--lilac)", "var(--red)"][i % 5] })}
                            >
                                <em>({String(i + 1).padStart(2, "0")})</em>
                                <b>{s.title}</b>
                                <p>{s.body}</p>
                            </Reveal>
                        ))}
                    </ol>
                </div>
                <div className="w2a-bar">
                    <span>(About)</span>
                    <span className="w2a-track" aria-hidden="true">
                        <motion.span className="w2a-fill" style={still ? undefined : { scaleX: fill }} />
                    </span>
                    <span>04 / 05</span>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2About, {
    text: {
        type: ControlType.String,
        title: "Paragraph",
        displayTextArea: true,
        defaultValue:
            "We started World Media to fix one thing: brands renting attention instead of earning trust. [1] So we treat creators as partners, cast for trust over reach, and prove every campaign in numbers *your business actually cares about.* [2]",
        description: "[1] and [2] mark the two pictures. Words between *stars* are set in italic.",
    },
    photo1: { type: ControlType.ResponsiveImage, title: "Picture 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Picture 2" },
    samples: {
        type: ControlType.Boolean,
        title: "Sample photos",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Fill empty picture slots until you add your own.",
    },
    stepsTitle: { type: ControlType.String, title: "Steps title", defaultValue: "How a campaign runs" },
    steps: {
        type: ControlType.Array,
        title: "Steps",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { title: "Listen", body: "We start with your business goal and your audience’s feed." },
            { title: "Cast", body: "Data-led shortlists. Every creator vetted for fit and fraud." },
            { title: "Create", body: "Creators lead the idea. We shape it, shoot it, approve it." },
            { title: "Amplify", body: "The best posts get paid reach, whitelisting and cross-posting." },
            { title: "Measure", body: "A live dashboard, then a straight read on what worked." },
        ],
    },
})
