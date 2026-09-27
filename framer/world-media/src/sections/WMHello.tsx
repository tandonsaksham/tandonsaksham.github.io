//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 2, "00 — Hello". "hi, [brand]," with the cream block, the hooked arrow and
// "here's our story, and where you fit into it", plus the chapter index that links down the page.
//@@ BODY

type HelloRow = { title: string; hint: string; href: string }

type HelloProps = {
    tag: string
    hi: string
    name: string
    note: string
    rows: HelloRow[]
    pageLabel: string
    style?: React.CSSProperties
}

const HELLO_CSS = `
.wmhi-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(40px,6cqw,110px);align-items:center;margin-top:clamp(40px,5cqw,72px)}
.wmhi-big{font-weight:800;font-size:clamp(68px,10.2cqw,158px);line-height:.9;letter-spacing:-.05em;display:flex;flex-direction:column;align-items:flex-start}
.wmhi-big .wm-mark{margin-top:.08em}
.wmhi-noteRow{display:flex;align-items:flex-start;gap:clamp(8px,1cqw,16px);margin-top:clamp(18px,2.2cqw,30px);padding-left:.2em}
.wmhi-noteRow svg{width:clamp(40px,4.6cqw,64px);flex:none;color:var(--cream);margin-top:-.2em}
.wmhi-note{color:var(--cream);max-width:15em}
.wmhi-list{border-top:1px solid var(--line)}
.wmhi-row{position:relative;display:grid;grid-template-columns:44px 1fr auto;align-items:center;gap:14px;padding:clamp(15px,1.55cqw,21px) 4px;border-bottom:1px solid var(--line);cursor:pointer}
.wmhi-n{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;color:var(--red)}
.wmhi-t{font-weight:720;font-size:clamp(20px,2.05cqw,30px);letter-spacing:-.025em;line-height:1.05;transition:transform .6s var(--ease)}
.wmhi-h{font-size:13.5px;color:var(--mut);white-space:nowrap;transition:opacity .4s,transform .6s var(--ease)}
.wmhi-go{position:absolute;right:4px;top:50%;margin-top:-.45em;color:var(--red);font-size:20px;opacity:0;transform:translateX(-18px);transition:opacity .4s,transform .6s var(--ease)}
.wmhi-row::before{content:"";position:absolute;left:0;right:0;top:-1px;height:1px;background:var(--cream);transform:scaleX(0);transform-origin:0 50%;transition:transform .8s var(--ease)}
.wmhi-row:hover::before,.wmhi-row:focus-visible::before{transform:scaleX(1)}
.wmhi-row:hover .wmhi-t,.wmhi-row:focus-visible .wmhi-t{transform:translateX(12px)}
.wmhi-row:hover .wmhi-h,.wmhi-row:focus-visible .wmhi-h{opacity:0;transform:translateX(12px)}
.wmhi-row:hover .wmhi-go,.wmhi-row:focus-visible .wmhi-go{opacity:1;transform:none}
@container (max-width:820px){.wmhi-grid{grid-template-columns:1fr}.wmhi-row{grid-template-columns:36px 1fr auto}}
@container (max-width:480px){.wmhi-h{display:none}}
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
        rows = [
            { title: "The shift", hint: "why now", href: "#the-shift" },
            { title: "Who we are", hint: "belief, crew", href: "#who-we-are" },
            { title: "What we do", hint: "services, process", href: "#what-we-do" },
            { title: "What we've done", hint: "case files", href: "#the-work" },
            { title: "What's next", hint: "vision, 90 days", href: "#whats-next" },
            { title: "Let's talk", hint: "contact", href: "#lets-talk" },
        ],
        pageLabel = "00 — Hello",
        style,
    } = props

    return (
        <Section theme="ink" className="wmhi" css={HELLO_CSS} style={style} label="Hello">
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmhi-grid">
                    <div>
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
                    <nav aria-label="Chapters">
                        <Stagger as="ol" className="wmhi-list" step={0.075} delay={0.2}>
                            {rows.map((r, i) => (
                                <li key={i}>
                                    <a className="wmhi-row" href={r.href}>
                                        <span className="wmhi-n">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="wmhi-t">{r.title}</span>
                                        <span className="wmhi-h">{r.hint}</span>
                                        <span className="wmhi-go" aria-hidden="true">
                                            <LineArrow />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </Stagger>
                    </nav>
                </div>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMHello, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Made for [Brand name]" },
    hi: { type: ControlType.String, title: "Greeting", defaultValue: "hi," },
    name: { type: ControlType.String, title: "Name (block)", defaultValue: "[brand]," },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "here's our story, and where you fit into it" },
    rows: {
        type: ControlType.Array,
        title: "Chapters",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                hint: { type: ControlType.String, title: "Hint" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { title: "The shift", hint: "why now", href: "#the-shift" },
            { title: "Who we are", hint: "belief, crew", href: "#who-we-are" },
            { title: "What we do", hint: "services, process", href: "#what-we-do" },
            { title: "What we've done", hint: "case files", href: "#the-work" },
            { title: "What's next", hint: "vision, 90 days", href: "#whats-next" },
            { title: "Let's talk", hint: "contact", href: "#lets-talk" },
        ],
    },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "00 — Hello" },
})
