//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 13, "Case files" — six case cards with blank thumbnails, CF numbers and
// vermilion result pills, plus the handwritten "pick one, we'll tell you the whole story".
// On phones the cards become a swipeable strip.
//@@ BODY

type CaseFile = { code: string; stat: string; title: string; href: string }

type CaseFilesProps = {
    tag: string
    headline: string
    note: string
    files: CaseFile[]
    style?: React.CSSProperties
}

const CASEFILES_CSS = `
.wmcf-head{display:flex;align-items:baseline;gap:clamp(18px,3cqw,48px);flex-wrap:wrap;margin-top:clamp(22px,2.6cqw,36px)}
.wmcf-h{font-weight:780;font-size:clamp(38px,4.8cqw,72px);line-height:1;letter-spacing:-.04em}
.wmcf-note{color:var(--red);font-size:clamp(21px,2.1cqw,31px)}
.wmcf-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(22px,2.6cqw,40px) clamp(12px,1.5cqw,22px);margin-top:clamp(32px,4cqw,60px)}
.wmcf-card{display:block;cursor:pointer}
.wmcf-thumb{aspect-ratio:16/7.4;transition:transform .8s var(--ease),background .6s}
.wmcf-card:hover .wmcf-thumb{transform:translateY(-6px);background:#262521}
.wmcf-view{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;font-family:"DM Mono",ui-monospace,monospace;font-size:12px;color:var(--cream);opacity:0;transform:translateY(8px);transition:opacity .5s,transform .7s var(--ease)}
.wmcf-card:hover .wmcf-view{opacity:1;transform:none}
.wmcf-meta{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px}
.wmcf-code{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;color:var(--mut)}
.wmcf-stat{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:99px;background:var(--red);color:var(--ink);font-size:12px;font-weight:600;white-space:nowrap}
.wmcf-t{margin-top:8px;font-weight:700;font-size:clamp(15.5px,1.35cqw,19px);letter-spacing:-.015em;line-height:1.25;display:inline;background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .6s var(--ease)}
.wmcf-card:hover .wmcf-t{background-size:100% 1px}
@container (max-width:860px){.wmcf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (max-width:640px){.wmcf-grid{margin-top:26px}.wmcf-thumb{aspect-ratio:5/4}.wmcf-card:hover .wmcf-thumb{transform:none}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMCaseFiles(props: CaseFilesProps) {
    const {
        tag = "Selected work",
        headline = "Case files",
        note = "pick one, we'll tell you the whole story",
        files = [
            { code: "CF-001", stat: "[__]M views", title: "[Brand] — [Campaign name]", href: "#case-001" },
            { code: "CF-002", stat: "[__]% sales lift", title: "[Brand] — [Campaign name]", href: "#case-002" },
            { code: "CF-003", stat: "[__]% engagement", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-004", stat: "[__]K UGC posts", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-005", stat: "[__]x ROAS", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-006", stat: "[__]M reach", title: "[Brand] — [Campaign name]", href: "#lets-talk" },
        ],
        style,
    } = props

    return (
        <Section theme="ink" className="wmcf" css={CASEFILES_CSS + SWIPE_CSS} style={style} label={headline}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmcf-head">
                    <Words as="h2" className="wmcf-h" text={headline} />
                    <Script className="wmcf-note" delay={0.5} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <Stagger className="wmcf-grid wm-swipe" step={0.08}>
                    {files.map((f, i) => (
                        <a className="wmcf-card" key={i} href={f.href} data-cursor="Open">
                            <div className="wm-ph wmcf-thumb">
                                <span className="wmcf-view" aria-hidden="true">
                                    Open file <LineArrow />
                                </span>
                            </div>
                            <div className="wmcf-meta">
                                <span className="wmcf-code">{f.code}</span>
                                <span className="wmcf-stat">{fill(f.stat)}</span>
                            </div>
                            <h3 className="wmcf-t">{f.title}</h3>
                        </a>
                    ))}
                </Stagger>
                <SwipeUI hint="swipe" />
            </div>
        </Section>
    )
}

addPropertyControls(WMCaseFiles, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Selected work" },
    headline: { type: ControlType.String, title: "Headline", defaultValue: "Case files" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "pick one, we'll tell you the whole story" },
    files: {
        type: ControlType.Array,
        title: "Case files",
        control: {
            type: ControlType.Object,
            controls: {
                code: { type: ControlType.String, title: "Code" },
                stat: { type: ControlType.String, title: "Result" },
                title: { type: ControlType.String, title: "Title" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { code: "CF-001", stat: "[__]M views", title: "[Brand] — [Campaign name]", href: "#case-001" },
            { code: "CF-002", stat: "[__]% sales lift", title: "[Brand] — [Campaign name]", href: "#case-002" },
            { code: "CF-003", stat: "[__]% engagement", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-004", stat: "[__]K UGC posts", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-005", stat: "[__]x ROAS", title: "[Brand] — [Campaign name]", href: "#quick-reads" },
            { code: "CF-006", stat: "[__]M reach", title: "[Brand] — [Campaign name]", href: "#lets-talk" },
        ],
    },
})
