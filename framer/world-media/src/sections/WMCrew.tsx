//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 7, "The team" — "the crew." with the cream block, the hooked arrow note,
// six staggered portrait placeholders (left blank) drifting at different speeds, and the
// taped "Founded in [year]" sticky note.
//@@ BODY

type Person = { name: string; role: string }

type CrewProps = {
    tag: string
    the: string
    crew: string
    note: string
    people: Person[]
    founded: string
    origin: string
    stats: string
    style?: React.CSSProperties
}

const CREW_CSS = `
.wmcr-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:clamp(36px,4.6cqw,84px);align-items:start;margin-top:clamp(36px,4.4cqw,64px)}
.wmcr-big{font-weight:800;font-size:clamp(64px,8.6cqw,136px);line-height:.9;letter-spacing:-.05em;display:flex;flex-direction:column;align-items:flex-start}
.wmcr-big .wm-mark{margin-top:.06em;padding-right:.5em}
.wmcr-noteRow{display:flex;align-items:flex-start;gap:12px;margin-top:clamp(18px,2.2cqw,30px);padding-left:.15em}
.wmcr-noteRow svg{width:clamp(38px,4.2cqw,58px);flex:none;color:var(--cream);margin-top:-.2em}
.wmcr-note{color:var(--cream);max-width:12em}
.wmcr-right{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.62fr);gap:clamp(16px,2cqw,32px);align-items:start}
.wmcr-people{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.3cqw,18px)}
.wmcr-col{display:flex;flex-direction:column;gap:clamp(14px,1.8cqw,26px)}
.wmcr-col.c2{padding-top:clamp(40px,5cqw,84px)}
.wmcr-p .wm-ph{aspect-ratio:1/1.05;border-radius:12px}
.wmcr-p b{display:block;margin-top:10px;font-size:13.5px;font-weight:650;letter-spacing:-.01em}
.wmcr-p figcaption>span{display:block;font-size:12.5px;color:var(--mut)}
.wmcr-sticky{position:relative;margin-top:clamp(0px,1cqw,16px);background:var(--cream);color:var(--ink);padding:clamp(26px,2.4cqw,34px) clamp(20px,2cqw,28px) clamp(22px,2cqw,28px);border-radius:3px;
box-shadow:0 30px 50px -28px rgba(0,0,0,.7);transform:rotate(3deg);transition:transform .8s cubic-bezier(.34,1.56,.64,1)}
.wmcr-sticky:hover{transform:rotate(-1.5deg) translateY(-4px)}
.wmcr-tape{position:absolute;left:50%;top:-12px;width:78px;height:24px;margin-left:-39px;background:rgba(200,190,168,.82);transform:rotate(-4deg)}
.wmcr-founded{font-size:clamp(22px,2cqw,28px);color:var(--ink)}
.wmcr-origin{margin-top:10px;font-size:13.5px;line-height:1.45;color:rgba(15,15,15,.78)}
.wmcr-stats{margin-top:14px;font-size:13.5px;font-weight:650}
.wmcr-in{opacity:0;transform:translateY(40px) rotate(12deg);transition:opacity .8s var(--ease),transform 1.2s cubic-bezier(.34,1.56,.64,1);transition-delay:.35s}
.wmcr-in.wm-in{opacity:1;transform:none}
@container (max-width:900px){.wmcr-grid{grid-template-columns:1fr}.wmcr-right{grid-template-columns:1fr}.wmcr-sticky{max-width:320px}}
@container (max-width:640px){.wmcr-grid{margin-top:26px;gap:30px}.wmcr-big{flex-direction:row;flex-wrap:wrap;align-items:baseline;column-gap:.2em}.wmcr-big .wm-mark{margin-top:0}.wmcr-noteRow{margin-top:14px}}
@container (max-width:560px){.wmcr-people{gap:8px}.wmcr-col{gap:12px}.wmcr-col.c2{padding-top:32px}.wmcr-p b{font-size:12px}.wmcr-p figcaption>span{font-size:11px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMCrew(props: CrewProps) {
    const {
        tag = "The team",
        the = "the",
        crew = "crew.",
        note = "the people you'll actually be working with",
        people = [
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
        ],
        founded = "Founded in [year]",
        origin = "[One-line origin story: who started World Media, and why.]",
        stats = "[__] people · [__] cities",
        style,
    } = props

    const peopleRef = React.useRef<HTMLDivElement>(null)
    const d1 = useDrift(peopleRef, 26)
    const d2 = useDrift(peopleRef, -34)
    const d3 = useDrift(peopleRef, 14)
    const [stickyRef, stickyIn] = useIn<HTMLDivElement>(0.4)
    const cols: Person[][] = [[], [], []]
    people.forEach((p, i) => cols[i % 3].push(p))
    const drifts = [d1, d2, d3]

    return (
        <Section theme="ink" className="wmcr" css={CREW_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmcr-grid">
                    <div>
                        <h2 className="wmcr-big" aria-label={the + " " + crew}>
                            <Words text={the} />
                            <Mark delay={0.3}>{crew}</Mark>
                        </h2>
                        <div className="wmcr-noteRow">
                            <Arrow kind="hook" delay={0.85} stroke={3} />
                            <Script className="wmcr-note" delay={1.2} rotate={-3}>
                                {note}
                            </Script>
                        </div>
                    </div>
                    <div className="wmcr-right">
                        <div className="wmcr-people" ref={peopleRef}>
                            {cols.map((col, ci) => (
                                <motion.div className="wmcr-colwrap" key={ci} style={{ y: drifts[ci] }}>
                                    <Stagger className={"wmcr-col c" + (ci + 1)} step={0.12} delay={ci * 0.1}>
                                        {col.map((p, pi) => (
                                            <figure className="wmcr-p" key={pi}>
                                                <div className="wm-ph" aria-hidden="true" />
                                                <figcaption>
                                                    <b>{p.name}</b>
                                                    <span>{p.role}</span>
                                                </figcaption>
                                            </figure>
                                        ))}
                                    </Stagger>
                                </motion.div>
                            ))}
                        </div>
                        <div ref={stickyRef} className={"wmcr-in" + stickyIn}>
                            <div className="wmcr-sticky">
                                <span className="wmcr-tape" aria-hidden="true" />
                                <div className="wm-script wmcr-founded">{founded}</div>
                                <p className="wmcr-origin">{origin}</p>
                                <p className="wmcr-stats">{fill(stats)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMCrew, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "The team" },
    the: { type: ControlType.String, title: "Line 1", defaultValue: "the" },
    crew: { type: ControlType.String, title: "Line 2 (block)", defaultValue: "crew." },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "the people you'll actually be working with" },
    people: {
        type: ControlType.Array,
        title: "People",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Name" },
                role: { type: ControlType.String, title: "Role" },
            },
        },
        defaultValue: [
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
            { name: "[Name]", role: "[Role]" },
        ],
    },
    founded: { type: ControlType.String, title: "Note title", defaultValue: "Founded in [year]" },
    origin: { type: ControlType.String, title: "Origin", displayTextArea: true, defaultValue: "[One-line origin story: who started World Media, and why.]" },
    stats: { type: ControlType.String, title: "Stats", defaultValue: "[__] people · [__] cities" },
})
