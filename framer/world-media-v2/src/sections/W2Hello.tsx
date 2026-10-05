//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: "Hello! We are world media." in very big type, with small pictures set right
// into the words (sample photos until the real ones are added), a quick way to get in touch,
// and a bright card with the three things World Media believes.
//@@ BODY

type Img = { src?: string; srcSet?: string; alt?: string }

type Belief = { text: string; note?: string }

type HelloProps = {
    hello: string
    weAre: string
    name: string
    side: string
    ask: string
    cta: string
    ctaHref: string
    title: string
    beliefs: Belief[]
    photo1?: Img
    photo2?: Img
    photo3?: Img
    samples: boolean
    style?: React.CSSProperties
}

const HELLO_CSS = `
.w2he-wrap{padding:clamp(72px,8cqw,128px) var(--gut) var(--m)}
.w2he-rows{display:flex;flex-direction:column}
.w2he-row{position:relative;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:clamp(4px,.6cqw,10px) 0 clamp(10px,1.2cqw,18px)}
.w2he-row::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--line);transform-origin:0 50%;scale:0 1;transition:scale 1.4s var(--ease);transition-delay:var(--d,0s)}
.w2he-row.w2-in::before{scale:1 1}
.w2he-row .w2-mega{white-space:nowrap}
.w2he-hi{color:var(--red)}
.w2he-side{max-width:23ch;padding-bottom:.6em;font-size:clamp(16px,1.5cqw,24px);line-height:1.18;letter-spacing:-.025em}
.w2he-ask{display:flex;gap:var(--m);margin-top:clamp(28px,3.2cqw,52px)}
.w2he-q{flex:1;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:62px;padding:0 26px;border:1px solid var(--line2);border-radius:99px;font-size:clamp(13px,1.05cqw,16px);letter-spacing:.02em;text-transform:uppercase}
.w2he-plus{display:inline-flex;gap:10px;color:var(--red);font-size:22px;line-height:1}
.w2he-plus span{animation:w2heP 2.4s var(--ease) infinite;animation-delay:calc(var(--i) * .18s)}
@keyframes w2heP{0%,60%,100%{translate:0 0;opacity:1}30%{translate:6px 0;opacity:.35}}
.w2he-go.w2-pill{height:auto;min-height:62px;padding:0 34px;font-size:clamp(14px,1.1cqw,17px);letter-spacing:.02em;text-transform:uppercase}
.w2he-card{margin-top:var(--m);padding:clamp(28px,3.4cqw,56px) clamp(22px,3cqw,48px) clamp(20px,2cqw,30px);background:var(--red);color:var(--ink);border-radius:var(--r)}
.w2he-card .w2-h1{max-width:12ch}
.w2he-list{margin-top:clamp(34px,5cqw,90px)}
.w2he-b{position:relative;display:flex;align-items:baseline;gap:clamp(12px,1.6cqw,24px);padding:clamp(14px,1.5cqw,22px) 0;border-top:1px solid rgba(22,21,20,.28)}
.w2he-b em{font-style:normal;font-size:12px;opacity:.7;min-width:3ch}
.w2he-b p{font-size:clamp(24px,3cqw,48px);line-height:1.05;letter-spacing:-.035em}
.w2he-b small{font-size:13px;opacity:.75;letter-spacing:0}
.w2he-card .w2-lbl{margin-top:clamp(24px,3cqw,44px)}
@container (max-width:820px){.w2he-row{flex-direction:column;align-items:flex-start;gap:8px}.w2he-side{padding-bottom:0}.w2he-ask{flex-direction:column}.w2he-q{min-height:56px;padding:0 20px}.w2he-go.w2-pill{min-height:56px}}
@container (max-width:520px){.w2he-row .w2-mega{white-space:normal}.w2he-q{font-size:12px}.w2he-plus{display:none}}
`

function Row(p: { children: React.ReactNode; delay?: number; className?: string }) {
    const [ref, on] = useReveal<HTMLDivElement>(0.4)
    return (
        <div ref={ref} className={"w2he-row " + (p.className || "") + on} style={cssVars({ "--d": (p.delay || 0) + "s" })}>
            {p.children}
        </div>
    )
}

/** Big words with a picture pill tucked in; the pill opens once the words have risen. */
function BigLine(p: { text: string; photo?: Img; hue: string; width?: string; className?: string; before?: boolean; delay?: number }) {
    const [ref, on] = useReveal<HTMLParagraphElement>(0.4)
    const words = parseWords(p.text)
    const pill = <Media src={p.photo && p.photo.src} alt={p.photo && p.photo.alt} hue={p.hue} width={p.width} delay={(p.delay || 0) + 0.35} />
    return (
        <p ref={ref} className={"w2-mega " + (p.className || "") + on}>
            {p.before ? pill : null}
            {words.map((w, i) => (
                <React.Fragment key={i}>
                    {i || p.before ? " " : null}
                    <span className={"w2-w" + (w.it ? " w2-it" : "")}>
                        <span style={cssVars({ "--d": ((p.delay || 0) + i * 0.07).toFixed(3) + "s" })}>{w.t}</span>
                    </span>
                </React.Fragment>
            ))}
            {p.before ? null : <> {pill}</>}
        </p>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Hello(props: HelloProps) {
    const {
        hello = "Hello!",
        weAre = "We are",
        name = "world media.",
        side = "A creator-first media agency from India. We work wherever your audience scrolls.",
        ask = "Want to talk about your brand right away?",
        cta = "Let’s talk",
        ctaHref = "#contact",
        title = "We believe in three things:",
        beliefs = [
            { text: "People skip ads, not people.", note: "" },
            { text: "Trust beats reach.", note: "(every single time)" },
            { text: "If it didn’t move the numbers, it didn’t work.", note: "" },
        ],
        photo1,
        photo2,
        photo3,
        samples = true,
        style,
    } = props

    // An empty slot shows a sample photo, unless samples are switched off.
    const pic = (ph: Img | undefined, n: number): Img | undefined =>
        ph && ph.src ? ph : samples ? { src: SAMPLE + "hello-" + n + ".jpg", alt: "" } : undefined

    const go = () => {
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("w2:form", { detail: "brand" }))
    }

    return (
        <Section tone="paper" id="hello" className="w2he" css={HELLO_CSS} label="Hello" style={style}>
            <div className="w2he-wrap">
                <div className="w2he-rows">
                    <Row>
                        <BigLine text={hello} className="w2he-hi" photo={pic(photo1, 1)} hue="sky" width="1.9em" />
                    </Row>
                    <Row delay={0.1}>
                        <BigLine text={weAre} photo={pic(photo2, 2)} hue="lime" width="1.3em" delay={0.08} />
                        <Reveal as="p" className="w2he-side w2-rise" delay={0.45}>
                            {side}
                        </Reveal>
                    </Row>
                    <Row delay={0.2}>
                        <BigLine text={name} photo={pic(photo3, 3)} hue="lilac" width="1.15em" before delay={0.14} />
                    </Row>
                </div>
                <Reveal className="w2he-ask w2-rise" amount={0.5}>
                    <a className="w2he-q" href={ctaHref} onClick={go}>
                        <span>{ask}</span>
                        <span className="w2he-plus" aria-hidden="true">
                            {[0, 1, 2].map((i) => (
                                <span key={i} style={cssVars({ "--i": i })}>
                                    +
                                </span>
                            ))}
                        </span>
                    </a>
                    <a className="w2-pill w2he-go" data-hue="red" href={ctaHref} onClick={go}>
                        <Roll>{cta}</Roll>
                    </a>
                </Reveal>
                <div className="w2he-card">
                    <Words as="h2" className="w2-h1" text={title} stagger={0.06} />
                    <ol className="w2he-list">
                        {beliefs.map((b, i) => (
                            <Reveal as="li" key={i} className="w2he-b w2-rise" delay={i * 0.12} amount={0.6}>
                                <em>({String(i + 1).padStart(2, "0")})</em>
                                <p>
                                    {b.text} {b.note ? <small>{b.note}</small> : null}
                                </p>
                            </Reveal>
                        ))}
                    </ol>
                    <Label name="Hello" index={1} />
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2Hello, {
    hello: { type: ControlType.String, title: "Line 1", defaultValue: "Hello!" },
    weAre: { type: ControlType.String, title: "Line 2", defaultValue: "We are" },
    name: { type: ControlType.String, title: "Line 3", defaultValue: "world media." },
    side: { type: ControlType.String, title: "Side note", defaultValue: "A creator-first media agency from India. We work wherever your audience scrolls.", displayTextArea: true },
    photo1: { type: ControlType.ResponsiveImage, title: "Photo 1" },
    photo2: { type: ControlType.ResponsiveImage, title: "Photo 2" },
    photo3: { type: ControlType.ResponsiveImage, title: "Photo 3" },
    samples: {
        type: ControlType.Boolean,
        title: "Sample photos",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Fill empty photo slots until you add your own.",
    },
    ask: { type: ControlType.String, title: "Question", defaultValue: "Want to talk about your brand right away?" },
    cta: { type: ControlType.String, title: "Button", defaultValue: "Let’s talk" },
    ctaHref: { type: ControlType.String, title: "Button link", defaultValue: "#contact" },
    title: { type: ControlType.String, title: "Card title", defaultValue: "We believe in three things:" },
    beliefs: {
        type: ControlType.Array,
        title: "Beliefs",
        control: {
            type: ControlType.Object,
            controls: {
                text: { type: ControlType.String, title: "Belief" },
                note: { type: ControlType.String, title: "Aside" },
            },
        },
        defaultValue: [
            { text: "People skip ads, not people.", note: "" },
            { text: "Trust beats reach.", note: "(every single time)" },
            { text: "If it didn’t move the numbers, it didn’t work.", note: "" },
        ],
    },
})
