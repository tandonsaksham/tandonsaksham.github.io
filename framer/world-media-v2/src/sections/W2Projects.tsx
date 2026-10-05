//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Projects, navigated the way another.gr/projects does it. Each project is a full
// screen of its own colour that slides up over the one before; its name runs across the
// screen in huge type behind a centred picture, with the services and year underneath.
// Which projects to show will be agreed with the client, so the four here are placeholders
// with sample photos: add a picture or a video to each one in the Projects list.
//@@ BODY

type Project = {
    name: string
    services: string
    year: string
    hue: "red" | "lime" | "sky" | "lilac" | "ink"
    image?: { src?: string; srcSet?: string; alt?: string }
    video?: string
}

type ProjectsProps = {
    title: string
    intro: string
    projects: Project[]
    samples: boolean
    style?: React.CSSProperties
}

const PROJ_CSS = `
.w2p{--bgc:var(--ink)}
.w2p-intro{position:relative;min-height:88vh;min-height:88svh;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(76px,7cqw,110px) var(--gut) clamp(28px,3cqw,48px);isolation:isolate}
.w2p-orb{position:absolute;z-index:-1;border-radius:50%;filter:blur(70px);opacity:.55;animation:w2pOrb 16s ease-in-out infinite alternate}
@keyframes w2pOrb{to{translate:6% -8%;scale:1.15}}
.w2p-intro .w2-lbl{color:var(--mut)}
.w2p-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap}
.w2p-blurb{max-width:30ch;font-size:clamp(16px,1.45cqw,22px);line-height:1.25;letter-spacing:-.02em;color:var(--mut)}
.w2p-blurb b{font-weight:500;color:var(--paper)}
.w2p-count{font-size:clamp(16px,1.45cqw,22px);color:var(--mut)}
.w2p-stack{position:relative}
.w2p-panel{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:var(--pbg);color:var(--pfg);isolation:isolate}
.w2p-panel[data-hue="red"]{--pbg:var(--red);--pfg:var(--ink);--pcard:#D9431D}
.w2p-panel[data-hue="lime"]{--pbg:var(--lime);--pfg:var(--ink);--pcard:#C2EA22}
.w2p-panel[data-hue="sky"]{--pbg:var(--sky);--pfg:var(--ink);--pcard:#6CCBF6}
.w2p-panel[data-hue="lilac"]{--pbg:var(--lilac);--pfg:var(--ink);--pcard:#B7A0FB}
.w2p-panel[data-hue="ink"]{--pbg:#1E1C1A;--pfg:var(--paper);--pcard:#2E2B27}
.w2p-blur{position:absolute;inset:-8%;z-index:-2;background-size:cover;background-position:center;filter:blur(38px);opacity:.6;scale:1.1;mix-blend-mode:luminosity}
.w2p-grain{position:absolute;inset:0;z-index:-1;opacity:.14;mix-blend-mode:multiply;pointer-events:none;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
.w2p-grid{position:absolute;inset:0;z-index:-1;display:grid;grid-template-columns:1fr 1fr 1fr;pointer-events:none}
.w2p-grid i{border-right:1px solid currentColor;opacity:.12}
.w2p-grid i:last-child{border:0}
.w2p-in{position:absolute;inset:0}
.w2p-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;padding:clamp(76px,6.4cqw,96px) var(--gut) 0;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.w2p-mq{position:absolute;left:0;right:0;top:50%;translate:0 -52%;overflow:hidden;white-space:nowrap;pointer-events:none}
.w2p-mq-t{display:inline-flex;animation:w2pMq var(--dur,26s) linear infinite;animation-direction:var(--dir,normal)}
.w2p-panel:not(.live) .w2p-mq-t{animation-play-state:paused}
.w2p-mq-t span{padding-right:.35em;font-size:clamp(64px,11.6cqw,190px);line-height:1;letter-spacing:-.05em;text-transform:uppercase;font-weight:600}
@keyframes w2pMq{to{translate:-50% 0}}
.w2p-card{position:absolute;left:50%;top:50%;width:clamp(260px,44cqw,760px);aspect-ratio:16/10;translate:-50% -54%;border-radius:clamp(10px,1cqw,16px);overflow:hidden;
background:var(--pcard);box-shadow:0 40px 80px -40px rgba(22,21,20,.55)}
.w2p-card img,.w2p-card video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2p-ph{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:space-between;padding:16px 18px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;
background:repeating-linear-gradient(135deg,transparent 0 22px,rgba(255,255,255,.07) 22px 23px)}
.w2p-ph b{font-weight:500;opacity:.7}
.w2p-meta{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;padding:0 var(--gut) clamp(26px,3.2cqw,46px);font-size:12px;letter-spacing:.04em;text-transform:uppercase;line-height:1.5}
.w2p-meta span:nth-child(2){padding-left:4px}
.w2p-meta span:last-child{text-align:right}
.w2p-veil{position:absolute;inset:0;background:#000;pointer-events:none}
@container (max-width:760px){
.w2p-card{width:calc(100% - 2 * var(--gut));aspect-ratio:4/3;translate:-50% -50%}
.w2p-mq{top:27%}
.w2p-mq-t span{font-size:clamp(58px,19cqw,120px)}
.w2p-meta{grid-template-columns:1fr 1fr;row-gap:4px}
.w2p-meta span:nth-child(2){grid-column:1/-1;order:3;padding:0}
.w2p-grid{grid-template-columns:1fr 1fr}.w2p-grid i:nth-child(3){display:none}}
@media (prefers-reduced-motion:reduce){.w2p-mq-t{animation:none}.w2p-orb{animation:none}}
`

type Pic = { src?: string; srcSet?: string; alt?: string; sample?: boolean }

function Panel(p: { item: Project; img?: Pic; index: number; total: number; nextRef?: React.RefObject<HTMLElement>; selfRef: React.RefObject<HTMLElement>; still: boolean }) {
    const { item, index, img } = p
    const [live, setLive] = React.useState(false)
    // The panels' refs live in the parent, so measure after layout rather than during it.
    const { scrollYProgress: enter } = useScroll({ target: p.selfRef, offset: ["start end", "start start"], layoutEffect: false })
    const { scrollYProgress: cover } = useScroll({ target: p.nextRef || p.selfRef, offset: ["start end", "start start"], layoutEffect: false })
    const cardScale = useTransform(enter, [0, 1], [0.78, 1])
    const cardY = useTransform(enter, [0, 1], [90, 0])
    const innerScale = useTransform(cover, [0, 1], [1, p.nextRef ? 0.9 : 1])
    const veil = useTransform(cover, [0, 1], [0, p.nextRef ? 0.45 : 0])
    const vref = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
        const el = p.selfRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const io = new IntersectionObserver(([e]) => {
            setLive(e.isIntersecting)
            const v = vref.current
            if (v) {
                if (e.isIntersecting && !p.still) v.play().catch(() => {})
                else v.pause()
            }
        })
        io.observe(el)
        return () => io.disconnect()
    }, [p.still])

    const nm = item.name || "Project"
    const pad = (n: number) => String(n).padStart(2, "0")
    const reps = [0, 1, 2, 3]
    const dur = Math.max(18, nm.length * 2.4)
    return (
        <article
            ref={p.selfRef as React.RefObject<HTMLElement>}
            className={"w2p-panel" + (live ? " live" : "")}
            data-hue={item.hue || "red"}
            aria-label={nm + (item.year ? ", " + item.year : "")}
            style={{ zIndex: index + 1 }}
        >
            {img && img.src ? <div className="w2p-blur" style={{ backgroundImage: "url(" + img.src + ")" }} /> : null}
            <div className="w2p-grain" />
            <motion.div className="w2p-in" style={p.still ? undefined : { scale: innerScale }}>
                <div className="w2p-grid" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
                <div className="w2p-top">
                    <span>({pad(index + 1)})</span>
                    <span>
                        {pad(index + 1)} / {pad(p.total)}
                    </span>
                </div>
                <div className="w2p-mq" aria-hidden="true">
                    <div className="w2p-mq-t" style={cssVars({ "--dur": dur + "s", "--dir": index % 2 ? "reverse" : "normal" })}>
                        {reps.map((k) => (
                            <span key={k}>{nm}</span>
                        ))}
                        {reps.map((k) => (
                            <span key={"b" + k}>{nm}</span>
                        ))}
                    </div>
                </div>
                <motion.div className="w2p-card" style={p.still ? undefined : { scale: cardScale, y: cardY }}>
                    {item.video ? (
                        <video ref={vref} src={item.video} muted loop playsInline preload="metadata" poster={img && img.src} />
                    ) : img && img.src ? (
                        <img src={img.src} srcSet={img.srcSet} alt={img.sample ? "" : img.alt || nm} loading="lazy" width={1600} height={1000} />
                    ) : (
                        <div className="w2p-ph">
                            <b>{nm}</b>
                            <b>Picture or film</b>
                        </div>
                    )}
                </motion.div>
                <div className="w2p-meta">
                    <span>{nm}</span>
                    <span>{item.services}</span>
                    <span>{item.year}</span>
                </div>
            </motion.div>
            {p.still ? null : <motion.div className="w2p-veil" style={{ opacity: veil }} aria-hidden="true" />}
        </article>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Projects(props: ProjectsProps) {
    const {
        title = "Projects.",
        intro = "A few of the stories we’ve told. *The rest are better over a call.*",
        projects = [
            { name: "Brand One", services: "Influencer marketing · Video production", year: "2026", hue: "red" as const },
            { name: "Brand Two", services: "Celebrity marketing · Content", year: "2025", hue: "lime" as const },
            { name: "Brand Three", services: "Creator-led ads · Live reporting", year: "2025", hue: "sky" as const },
            { name: "Brand Four", services: "Talent management · Content writing", year: "2024", hue: "lilac" as const },
        ],
        samples = true,
        style,
    } = props
    const still = useStill()
    const refs = React.useMemo(() => projects.map(() => React.createRef<HTMLElement>()), [projects.length])
    const pad = (n: number) => String(n).padStart(2, "0")
    const parts = String(intro).split(/\*([^*]+)\*/)

    return (
        <Section tone="ink" id="projects" className="w2p" css={PROJ_CSS} label="Projects" style={style}>
            <div className="w2p-intro">
                <span className="w2p-orb" style={{ width: "46vw", height: "46vw", left: "-12vw", top: "-14vw", background: "var(--red)" }} aria-hidden="true" />
                <span className="w2p-orb" style={{ width: "34vw", height: "34vw", right: "-8vw", bottom: "-10vw", background: "var(--lilac)", animationDelay: "-6s" }} aria-hidden="true" />
                <Label name="Projects" index={3} />
                <div className="w2p-head">
                    <Words as="h2" className="w2-mega" text={title} stagger={0.08} />
                    <Reveal className="w2-rise" delay={0.3}>
                        <p className="w2p-blurb">
                            {parts.map((t, i) => (i % 2 ? <b key={i}>{t}</b> : <React.Fragment key={i}>{t}</React.Fragment>))}
                        </p>
                        <p className="w2p-count">({pad(projects.length)})</p>
                    </Reveal>
                </div>
            </div>
            <div className="w2p-stack">
                {projects.map((item, i) => (
                    <Panel
                        key={i}
                        item={item}
                        img={item.image && item.image.src ? item.image : samples && i < 4 ? { src: SAMPLE + "project-" + (i + 1) + ".jpg", sample: true } : undefined}
                        index={i}
                        total={projects.length}
                        selfRef={refs[i]}
                        nextRef={refs[i + 1]}
                        still={still}
                    />
                ))}
            </div>
        </Section>
    )
}

addPropertyControls(W2Projects, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Projects." },
    intro: {
        type: ControlType.String,
        title: "Intro",
        defaultValue: "A few of the stories we’ve told. *The rest are better over a call.*",
        displayTextArea: true,
        description: "Words between *stars* are set brighter.",
    },
    projects: {
        type: ControlType.Array,
        title: "Projects",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name" },
                services: { type: ControlType.String, title: "Services" },
                year: { type: ControlType.String, title: "Year" },
                hue: {
                    type: ControlType.Enum,
                    title: "Colour",
                    options: ["red", "lime", "sky", "lilac", "ink"],
                    optionTitles: ["Red", "Lime", "Sky", "Lilac", "Ink"],
                },
                image: { type: ControlType.ResponsiveImage, title: "Picture" },
                video: { type: ControlType.File, title: "Film", allowedFileTypes: ["mp4", "webm", "mov"] },
            },
        },
        defaultValue: [
            { name: "Brand One", services: "Influencer marketing · Video production", year: "2026", hue: "red" },
            { name: "Brand Two", services: "Celebrity marketing · Content", year: "2025", hue: "lime" },
            { name: "Brand Three", services: "Creator-led ads · Live reporting", year: "2025", hue: "sky" },
            { name: "Brand Four", services: "Talent management · Content writing", year: "2024", hue: "lilac" },
        ],
    },
    samples: {
        type: ControlType.Boolean,
        title: "Sample photos",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Give the first four projects a sample photo until you add your own.",
    },
})
