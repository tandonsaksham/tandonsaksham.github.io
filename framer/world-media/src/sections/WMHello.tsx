//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 2, "00 — Hello". "hi, [brand]," with the cream block, the hooked arrow and
// "here's our story, and where you fit into it". The chapter list from the slide lives in the
// navigation's folder-tab index, so this section stays a short, personal greeting.
//@@ BODY

type HelloProps = {
    tag: string
    hi: string
    name: string
    note: string
    style?: React.CSSProperties
}

const HELLO_CSS = `
.wmhi .wm-wrap{padding-bottom:clamp(56px,6.4cqw,104px)}
.wmhi-grid{display:flex;flex-wrap:wrap;align-items:flex-end;column-gap:clamp(24px,3.4cqw,60px);row-gap:clamp(18px,2.4cqw,34px);margin-top:clamp(30px,3.8cqw,60px)}
.wmhi-big{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:.2em;font-weight:800;font-size:clamp(68px,10.2cqw,158px);line-height:.9;letter-spacing:-.05em}
.wmhi-noteRow{display:flex;align-items:flex-start;gap:clamp(8px,1cqw,16px);padding-bottom:clamp(6px,1.2cqw,20px)}
.wmhi-noteRow svg{width:clamp(40px,4.6cqw,64px);flex:none;color:var(--cream);margin-top:-.2em}
.wmhi-note{color:var(--cream);max-width:11.5em}
@container (max-width:820px){.wmhi-big{flex-direction:column;align-items:flex-start}.wmhi-big .wm-mark{margin-top:.08em}.wmhi-note{max-width:15em}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMHello(props: HelloProps) {
    const {
        tag = "Made for [Brand name]",
        hi = "hi,",
        name = "[brand],",
        note = "here's our story, and where you fit into it",
        style,
    } = props

    return (
        <Section theme="ink" className="wmhi" css={HELLO_CSS} style={style} label="Hello">
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmhi-grid">
                    <h2 className="wmhi-big" aria-label={hi + " " + name}>
                        <Words text={hi} stagger={0.05} />
                        <Mark delay={0.35}>{name}</Mark>
                    </h2>
                    <div className="wmhi-noteRow">
                        <Arrow kind="hook" delay={0.9} stroke={3} />
                        <Script className="wmhi-note" delay={1.25} rotate={-3}>
                            {note}
                        </Script>
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMHello, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Made for [Brand name]" },
    hi: { type: ControlType.String, title: "Greeting", defaultValue: "hi," },
    name: { type: ControlType.String, title: "Name (block)", defaultValue: "[brand]," },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "here's our story, and where you fit into it" },
})
