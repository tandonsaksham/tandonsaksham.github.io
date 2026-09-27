//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 9, "One roof, six capabilities." — the bento of cream cards (a)–(f)
// with Content Studio running wide, and the vermilion "( → ) Let's talk →" card.
//@@ BODY

type Service = { title: string; body: string }

type ServicesProps = {
    tag: string
    headline: string
    items: Service[]
    talkLabel: string
    talkHref: string
    pageLabel: string
    style?: React.CSSProperties
}

const SERVICES_CSS = `
.wms-h{margin-top:clamp(22px,2.6cqw,36px);font-weight:760;font-size:clamp(34px,4.3cqw,64px);line-height:1;letter-spacing:-.038em}
.wms-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.2cqw,16px);margin-top:clamp(32px,3.8cqw,56px)}
.wms-card{position:relative;display:flex;flex-direction:column;min-height:clamp(170px,15cqw,230px);padding:clamp(18px,1.8cqw,26px);border-radius:16px;background:var(--cream);color:var(--ink);
transition:transform .7s var(--ease),box-shadow .7s var(--ease),background .5s}
.wms-card.w{grid-column:span 2}
.wms-card:hover{transform:translateY(-6px);box-shadow:0 26px 44px -26px rgba(0,0,0,.8)}
.wms-l{font-family:"DM Mono",ui-monospace,monospace;font-size:13px;letter-spacing:.06em;transition:color .4s}
.wms-card:hover .wms-l{color:var(--red)}
.wms-t{margin-top:clamp(14px,1.5cqw,22px);font-weight:760;font-size:clamp(17px,1.6cqw,23px);letter-spacing:-.005em;text-transform:uppercase;line-height:1.05}
.wms-b{margin-top:8px;color:rgba(15,15,15,.62);font-size:14.5px;line-height:1.45;max-width:26em}
.wms .wms-talk{display:flex;align-items:flex-start;background:var(--red);color:var(--ink);cursor:pointer;justify-content:space-between}
.wms-talk .wms-l{color:var(--ink)!important}
.wms-talk b{font-weight:760;font-size:clamp(22px,2.2cqw,32px);letter-spacing:-.03em;display:inline-flex;align-items:center;gap:.35em}
.wms-talk:hover{background:#F0512A}
@container (max-width:900px){.wms-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:480px){.wms-grid{grid-template-columns:1fr}.wms-card.w{grid-column:auto}.wms-card{min-height:0}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMServices(props: ServicesProps) {
    const {
        tag = "Services",
        headline = "One roof, six capabilities.",
        items = [
            { title: "Strategy", body: "Creators, platforms and story, mapped to one business goal." },
            { title: "Casting", body: "Nano to celebrity. Vetted for real audiences over follower counts." },
            { title: "Content Studio", body: "Scripts, shoots and edits for Reels, Shorts and YouTube. We brief creators like collaborators and protect their voice." },
            { title: "Campaign Ops", body: "Contracts, timelines, approvals, payouts. Handled end to end." },
            { title: "Amplification", body: "Whitelisting and creator-led ads that make great posts perform." },
            { title: "Insights", body: "Live dashboards and post-campaign reads on what moved, and why." },
        ],
        talkLabel = "Let's talk",
        talkHref = "#lets-talk",
        pageLabel = "03 — What we do",
        style,
    } = props

    const letters = "abcdefghijklmnopqrstuvwxyz"
    const cards: React.ReactNode[] = []
    items.forEach((it, i) => {
        if (i === 5)
            cards.push(
                <a key="talk" className="wms-card wms-talk wm-link" href={talkHref} data-cursor="Talk">
                    <span className="wms-l">( → )</span>
                    <b>
                        {talkLabel}
                        <LineArrow />
                    </b>
                </a>
            )
        cards.push(
            <article key={i} className={"wms-card" + (i === 2 ? " w" : "")}>
                <span className="wms-l">( {letters[i] || "·"} )</span>
                <h3 className="wms-t">{it.title}</h3>
                <p className="wms-b">{it.body}</p>
            </article>
        )
    })

    return (
        <Section theme="ink" className="wms" css={SERVICES_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <Words as="h2" className="wms-h" text={headline} stagger={0.05} />
                <Stagger className="wms-grid" step={0.07} delay={0.1}>
                    {cards}
                </Stagger>
                <PageLabel text={pageLabel} />
            </div>
        </Section>
    )
}

addPropertyControls(WMServices, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Services" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "One roof, six capabilities." },
    items: {
        type: ControlType.Array,
        title: "Services",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
            },
        },
        defaultValue: [
            { title: "Strategy", body: "Creators, platforms and story, mapped to one business goal." },
            { title: "Casting", body: "Nano to celebrity. Vetted for real audiences over follower counts." },
            { title: "Content Studio", body: "Scripts, shoots and edits for Reels, Shorts and YouTube. We brief creators like collaborators and protect their voice." },
            { title: "Campaign Ops", body: "Contracts, timelines, approvals, payouts. Handled end to end." },
            { title: "Amplification", body: "Whitelisting and creator-led ads that make great posts perform." },
            { title: "Insights", body: "Live dashboards and post-campaign reads on what moved, and why." },
        ],
    },
    talkLabel: { type: ControlType.String, title: "Talk card", defaultValue: "Let's talk" },
    talkHref: { type: ControlType.String, title: "Talk link", defaultValue: "#lets-talk" },
    pageLabel: { type: ControlType.String, title: "Page label", defaultValue: "03 — What we do" },
})
