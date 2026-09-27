//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 24, the vermilion close — "Let's make noise →" in giant ink type with a
// hand-drawn arrow, "your brand, our next case file", and the four contact details.
//@@ BODY

type Contact = { label: string; value: string; href: string }

type TalkProps = {
    anchor: string
    tag: string
    line1: string
    line2: string
    note: string
    href: string
    contacts: Contact[]
    style?: React.CSSProperties
}

const TALK_CSS = `
.wmt .wm-wrap{padding-top:clamp(80px,9cqw,140px);padding-bottom:clamp(56px,6cqw,90px)}
.wmt-big{display:block;margin-top:clamp(28px,3.6cqw,56px);font-weight:800;font-size:clamp(78px,13.4cqw,214px);line-height:.86;letter-spacing:-.058em;color:var(--ink)}
.wmt-l2{display:flex;align-items:center;gap:clamp(18px,2.6cqw,44px);flex-wrap:wrap}
.wmt-arrow{width:clamp(110px,15cqw,240px);height:auto;color:var(--ink);transition:transform .8s var(--ease)}
.wmt-big:hover .wmt-arrow,.wmt-big:focus-visible .wmt-arrow{transform:translateX(18px)}
.wmt-note{color:var(--cream);font-size:clamp(22px,2.4cqw,36px);max-width:12em;line-height:1.1;text-wrap:balance}
.wmt-rowswrap{margin-top:clamp(48px,6cqw,96px)}
.wmt-rule{position:absolute;left:0;right:0;top:0}
.wmt-rows{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;padding-top:clamp(18px,2cqw,26px)}
.wmt-c .wm-mono{display:block;text-transform:uppercase;letter-spacing:.1em;font-size:11.5px;color:rgba(15,15,15,.7)}
.wmt-c a,.wmt-c span.v{display:inline-block;margin-top:8px;font-weight:700;font-size:clamp(15px,1.35cqw,19px);letter-spacing:-.01em;background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .6s var(--ease)}
.wmt-c a:hover{background-size:100% 1.5px}
@container (max-width:860px){.wmt-rows{grid-template-columns:1fr 1fr;row-gap:28px}}
@container (max-width:460px){.wmt-rows{grid-template-columns:1fr}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMTalk(props: TalkProps) {
    const {
        anchor = "lets-talk",
        tag = "Let's talk",
        line1 = "Let's make",
        line2 = "noise",
        note = "your brand, our next case file",
        href = "mailto:social@worldmedia.co.in",
        contacts = [
            { label: "Email", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Phone", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Web", value: "worldmedia.co.in", href: "https://worldmedia.co.in" },
        ],
        style,
    } = props

    return (
        <Section theme="red" id={anchor} className="wmt" css={TALK_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <a className="wmt-big" href={href} data-cursor="Say hi" aria-label={line1 + " " + line2}>
                    <Words text={line1} stagger={0.08} style={{ display: "block" }} />
                    <span className="wmt-l2">
                        <Words text={line2} delay={0.2} />
                        <Arrow kind="long" className="wmt-arrow" delay={0.7} stroke={5} />
                        <Script className="wmt-note" delay={1.2} rotate={-6}>
                            {note}
                        </Script>
                    </span>
                </a>
                <div className="wmt-rowswrap" style={{ position: "relative" }}>
                <Rule strong className="wmt-rule" />
                <Stagger className="wmt-rows" step={0.08} delay={0.2}>
                    {contacts.map((c, i) => (
                        <div className="wmt-c" key={i}>
                            <span className="wm-mono">{c.label}</span>
                            {c.href ? (
                                <a href={c.href} target={c.href.indexOf("http") === 0 ? "_blank" : undefined} rel="noreferrer">
                                    {c.value}
                                </a>
                            ) : (
                                <span className="v">{c.value}</span>
                            )}
                        </div>
                    ))}
                </Stagger>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMTalk, {
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "lets-talk" },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Let's talk" },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: "Let's make" },
    line2: { type: ControlType.String, title: "Line 2", defaultValue: "noise" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "your brand, our next case file" },
    href: { type: ControlType.String, title: "Headline link", defaultValue: "mailto:social@worldmedia.co.in" },
    contacts: {
        type: ControlType.Array,
        title: "Contacts",
        maxCount: 4,
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Value" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: [
            { label: "Email", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Phone", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Web", value: "worldmedia.co.in", href: "https://worldmedia.co.in" },
        ],
    },
})
