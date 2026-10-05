//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Services. A black "What we do" band, three columns (creators, content, growth)
// that read as one story from first idea to proof, and a light grey line to close.
//@@ BODY

type Service = { title: string; lead: string; items: string; shape: "circle" | "square" | "triangle" }

type ServicesProps = {
    first: boolean
    banner: string
    services: Service[]
    closing: string
    style?: React.CSSProperties
}

const SERV_CSS = `
.w2s-wrap{padding:clamp(48px,6cqw,96px) var(--gut) var(--m)}
.w2s-first .w2s-wrap{padding-top:clamp(72px,8cqw,128px)}
.w2s-band{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:clamp(66px,6.4cqw,104px);padding:0 clamp(22px,2.6cqw,40px);border-radius:99px;background:var(--ink);color:var(--paper)}
.w2s-band :is(h1,h2){font-size:clamp(30px,3.6cqw,58px);line-height:1;letter-spacing:-.045em;text-align:center}
.w2s-chev{display:flex;gap:clamp(6px,.7cqw,12px)}
.w2s-chev svg{width:clamp(14px,1.3cqw,20px);height:auto;animation:w2sC 2.2s var(--ease) infinite;animation-delay:calc(var(--i) * .14s)}
@keyframes w2sC{0%,55%,100%{translate:0 0}25%{translate:0 5px}}
.w2s-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--m);margin-top:var(--m)}
.w2s-col{position:relative;display:flex;flex-direction:column;min-height:clamp(380px,33cqw,520px);padding:clamp(22px,2.2cqw,34px);border:1px solid var(--line2);border-radius:var(--r);transition:background-color .5s var(--ease),border-color .5s}
.w2s-col:hover{background:var(--paper2);border-color:var(--ink)}
.w2s-col h3{font-size:clamp(20px,1.7cqw,26px);letter-spacing:-.02em;text-transform:uppercase}
.w2s-lead{margin-top:12px;max-width:30ch;color:var(--mut);font-size:clamp(14.5px,1.05cqw,16px);line-height:1.45;font-weight:400}
.w2s-items{margin-top:auto;padding-top:28px}
.w2s-items li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid var(--line);font-size:clamp(15px,1.12cqw,17px);letter-spacing:-.015em;transition:padding .45s var(--ease)}
.w2s-items li span{opacity:0;translate:-6px 0;transition:opacity .35s,translate .45s var(--ease);color:var(--mut)}
.w2s-col:hover .w2s-items li:hover{padding-left:8px}
.w2s-col .w2s-items li:hover span{opacity:1;translate:0 0}
.w2s-shape{margin-top:26px;width:clamp(34px,3cqw,46px);height:clamp(34px,3cqw,46px);transition:rotate .9s var(--ease),scale .6s var(--ease)}
.w2s-col:hover .w2s-shape{rotate:90deg;scale:1.12}
.w2s-close{position:relative;display:flex;align-items:center;gap:clamp(16px,2cqw,32px);margin-top:var(--m);min-height:clamp(66px,6.4cqw,104px);padding:0 clamp(22px,2.6cqw,40px);border-radius:99px;background:var(--paper2);color:var(--ink)}
.w2s-close i{flex:1;height:1px;background:currentColor;opacity:.4;transform-origin:var(--o) 50%;scale:0 1;transition:scale 1.4s var(--ease) .2s}
.w2s-close.w2-in i{scale:1 1}
.w2s-close p{font-size:clamp(15px,1.5cqw,24px);letter-spacing:.01em;text-transform:uppercase;text-align:center}
.w2s-wrap>.w2-lbl{margin-top:clamp(18px,2cqw,28px);color:var(--mut)}
@container (max-width:900px){.w2s-grid{grid-template-columns:1fr}.w2s-col{min-height:0}.w2s-items{margin-top:8px}}
@container (max-width:560px){.w2s-chev{display:none}.w2s-band{justify-content:center}.w2s-close{border-radius:26px;padding:18px 20px}.w2s-close i{display:none}}
`

function Shape(p: { kind: Service["shape"]; color: string }) {
    return (
        <svg className="w2s-shape" viewBox="0 0 40 40" aria-hidden="true">
            {p.kind === "circle" ? <circle cx="20" cy="20" r="18" fill={p.color} /> : null}
            {p.kind === "square" ? <rect x="3" y="3" width="34" height="34" rx="3" fill={p.color} /> : null}
            {p.kind === "triangle" ? <path d="M6 3.5 L36 20 L6 36.5 Z" fill={p.color} /> : null}
        </svg>
    )
}

function Chevrons() {
    return (
        <span className="w2s-chev" aria-hidden="true">
            {[0, 1, 2].map((i) => (
                <svg key={i} viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={cssVars({ "--i": i })}>
                    <path d="M2 2l8 8 8-8" />
                </svg>
            ))}
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Services(props: ServicesProps) {
    const {
        banner = "What we do",
        services = [
            {
                title: "Creators",
                lead: "First, we find the voices your audience already trusts, and make the match.",
                items: "Influencer marketing, Celebrity marketing, Talent management, Casting from nano to celebrity",
                shape: "circle" as const,
            },
            {
                title: "Content",
                lead: "Then we make things people actually want to watch, and protect the creator’s voice while we’re at it.",
                items: "Creative strategy, Video production, Content writing, Brand storytelling",
                shape: "square" as const,
            },
            {
                title: "Growth",
                lead: "Finally, we make it travel, and show you, in plain numbers, what it did for the business.",
                items: "Performance marketing, Creator-led ads, Campaign ops, Live reporting",
                shape: "triangle" as const,
            },
        ],
        closing = "Local voices. Worldwide noise.",
        first = false,
        style,
    } = props
    const [closeRef, closeOn] = useReveal<HTMLDivElement>(0.6)
    const colors = ["var(--red)", "var(--ink)", "var(--ink)"]

    return (
        <Section tone="paper" id="services" className={"w2s" + (first ? " w2s-first" : "")} css={SERV_CSS} label="Services" style={style}>
            <div className="w2s-wrap">
                <Reveal className="w2s-band w2-rise" amount={0.6}>
                    <Chevrons />
                    <Words as={first ? "h1" : "h2"} text={banner} stagger={0.08} />
                    <Chevrons />
                </Reveal>
                <div className="w2s-grid">
                    {services.map((s, i) => (
                        <Reveal key={i} className="w2s-col w2-rise" delay={i * 0.12} amount={0.25}>
                            <h3>{s.title}</h3>
                            <p className="w2s-lead">{s.lead}</p>
                            <ul className="w2s-items">
                                {String(s.items || "")
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean)
                                    .map((t, k) => (
                                        <li key={k}>
                                            {t}
                                            <span aria-hidden="true">→</span>
                                        </li>
                                    ))}
                            </ul>
                            <Shape kind={s.shape || "circle"} color={colors[i % colors.length]} />
                        </Reveal>
                    ))}
                </div>
                <div ref={closeRef} className={"w2s-close" + closeOn}>
                    <i aria-hidden="true" style={cssVars({ "--o": "100%" })} />
                    <p>{closing}</p>
                    <i aria-hidden="true" style={cssVars({ "--o": "0%" })} />
                </div>
                <Label name="Services" index={2} />
            </div>
        </Section>
    )
}

addPropertyControls(W2Services, {
    banner: { type: ControlType.String, title: "Band", defaultValue: "What we do" },
    services: {
        type: ControlType.Array,
        title: "Columns",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                lead: { type: ControlType.String, title: "Lead", displayTextArea: true },
                items: { type: ControlType.String, title: "Items (comma separated)", displayTextArea: true },
                shape: {
                    type: ControlType.Enum,
                    title: "Shape",
                    options: ["circle", "square", "triangle"],
                    optionTitles: ["Circle", "Square", "Triangle"],
                },
            },
        },
        defaultValue: [
            {
                title: "Creators",
                lead: "First, we find the voices your audience already trusts, and make the match.",
                items: "Influencer marketing, Celebrity marketing, Talent management, Casting from nano to celebrity",
                shape: "circle",
            },
            {
                title: "Content",
                lead: "Then we make things people actually want to watch, and protect the creator’s voice while we’re at it.",
                items: "Creative strategy, Video production, Content writing, Brand storytelling",
                shape: "square",
            },
            {
                title: "Growth",
                lead: "Finally, we make it travel, and show you, in plain numbers, what it did for the business.",
                items: "Performance marketing, Creator-led ads, Campaign ops, Live reporting",
                shape: "triangle",
            },
        ],
    },
    closing: { type: ControlType.String, title: "Closing line", defaultValue: "Local voices. Worldwide noise." },
    first: {
        type: ControlType.Boolean,
        title: "Opens the page",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        description: "When Services is the first thing on a page: room for the menu, and the band becomes the page's main heading.",
    },
})
