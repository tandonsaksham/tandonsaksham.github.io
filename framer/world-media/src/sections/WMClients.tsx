//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 20, "Don't take our word for it" — three client quotes headed by the
// brand name in handwriting, then "trusted by:" over a grid of blank logo tiles.
//@@ BODY

type Quote = { brand: string; quote: string; name: string; role: string }

type ClientsProps = {
    tag: string
    headline: string
    quotes: Quote[]
    trusted: string
    logoCount: number
    style?: React.CSSProperties
}

const CLIENTS_CSS = `
.wmcl-h{margin-top:clamp(22px,2.6cqw,36px);font-weight:780;font-size:clamp(34px,4.3cqw,64px);line-height:1;letter-spacing:-.04em}
.wmcl-quotes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(24px,3.4cqw,56px);margin-top:clamp(32px,4cqw,60px)}
.wmcl-brand{font-size:clamp(24px,2.3cqw,34px);color:var(--cream)}
.wmcl-q{margin-top:12px;font-size:clamp(15.5px,1.3cqw,18px);line-height:1.5;color:var(--mut);max-width:24em}
.wmcl-name{display:block;margin-top:16px;font-weight:700;font-size:14px}
.wmcl-role{display:block;margin-top:4px;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.08em;color:var(--mut);text-transform:uppercase}
.wmcl-trusted{display:inline-block;margin-top:clamp(48px,6cqw,90px);color:var(--red);font-size:clamp(22px,2.2cqw,32px)}
.wmcl-logos{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:clamp(8px,1cqw,14px);margin-top:clamp(14px,1.6cqw,22px)}
.wmcl-logo{aspect-ratio:2.7/1;border-radius:10px;background:var(--ink2);border:1px solid rgba(242,238,229,.04);transition:background .5s}
.wmcl-logo:hover{background:var(--ink3)}
@container (max-width:860px){.wmcl-quotes{grid-template-columns:1fr}.wmcl-logos{grid-template-columns:repeat(3,minmax(0,1fr))}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMClients(props: ClientsProps) {
    const {
        tag = "Clients",
        headline = "Don't take our word for it",
        quotes = [
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
        ],
        trusted = "trusted by:",
        logoCount = 12,
        style,
    } = props

    return (
        <Section theme="ink" className="wmcl" css={CLIENTS_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <Words as="h2" className="wmcl-h" text={headline} />
                <Stagger className="wmcl-quotes" step={0.12}>
                    {quotes.map((q, i) => (
                        <figure key={i}>
                            <div className="wm-script wmcl-brand">{q.brand}</div>
                            <blockquote className="wmcl-q">{q.quote}</blockquote>
                            <figcaption>
                                <span className="wmcl-name">{q.name}</span>
                                <span className="wmcl-role">{q.role}</span>
                            </figcaption>
                        </figure>
                    ))}
                </Stagger>
                <Script className="wmcl-trusted" delay={0.2} rotate={-3}>
                    {trusted}
                </Script>
                <Stagger className="wmcl-logos" step={0.035} aria-hidden="true">
                    {Array.from({ length: Math.max(0, Math.min(24, logoCount)) }).map((_, i) => (
                        <div className="wmcl-logo" key={i} />
                    ))}
                </Stagger>
            </div>
        </Section>
    )
}

addPropertyControls(WMClients, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Clients" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Don't take our word for it" },
    quotes: {
        type: ControlType.Array,
        title: "Quotes",
        control: {
            type: ControlType.Object,
            controls: {
                brand: { type: ControlType.String, title: "Brand" },
                quote: { type: ControlType.String, title: "Quote", displayTextArea: true },
                name: { type: ControlType.String, title: "Name" },
                role: { type: ControlType.String, title: "Designation" },
            },
        },
        defaultValue: [
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
            { brand: "[brand name]", quote: "“[Two or three lines from the client on working with us.]”", name: "[Name]", role: "[Designation]" },
        ],
    },
    trusted: { type: ControlType.String, title: "Handwritten", defaultValue: "trusted by:" },
    logoCount: { type: ControlType.Number, title: "Logo slots", defaultValue: 12, min: 0, max: 24, step: 1 },
})
