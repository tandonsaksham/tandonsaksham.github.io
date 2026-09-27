//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the site footer. Chapter links, contact, back to top, and the "world media."
// wordmark set at full width with its vermilion full stop, rising letter by letter.
//@@ BODY

type FooterLink = { label: string; href: string }

type FooterProps = {
    links: FooterLink[]
    email: string
    phone: string
    social: string
    socialHref: string
    note: string
    copyright: string
    style?: React.CSSProperties
}

const FOOTER_CSS = `
.wmf .wm-wrap{padding-top:clamp(64px,7cqw,104px);padding-bottom:0}
.wmf-cols{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:clamp(24px,3cqw,48px);align-items:start}
.wmf-t{display:block;margin-bottom:14px;font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
.wmf-list{display:flex;flex-direction:column;gap:6px}
.wmf-list a{display:inline-flex;align-items:baseline;gap:10px;font-size:15.5px;font-weight:500;letter-spacing:-.01em;width:max-content;transition:color .3s}
.wmf-list a em{font-style:normal;font-family:"DM Mono",ui-monospace,monospace;font-size:11px;color:var(--red)}
.wmf-list a:hover{color:var(--red)}
.wmf-top{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;border:1px solid var(--line2);color:var(--cream);transition:background .4s,color .4s,border-color .4s}
.wmf-top:hover{background:var(--red);border-color:var(--red);color:var(--ink)}
.wmf-mark{display:block;margin-top:clamp(56px,7cqw,110px);font-weight:800;font-size:calc((min(100cqw,1400px) - 2 * clamp(20px,5.2cqw,80px)) * .1904);font-variation-settings:"opsz" 96;line-height:.8;letter-spacing:-.05em;white-space:nowrap;overflow:hidden;padding:.06em 0 .03em}
.wmf-mark .l{display:inline-block;transform:translate3d(0,100%,0);transition:transform 1.2s var(--ease);transition-delay:calc(var(--k) * .045s)}
.wmf-mark.wm-in .l{transform:none}
.wmf-mark .l.dot{color:var(--red);letter-spacing:0}
.wmf-bottom{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:18px 0 28px;border-top:1px solid var(--line)}
.wmf-note{color:var(--red);font-size:clamp(19px,1.7cqw,24px)}
@container (max-width:820px){.wmf-cols{grid-template-columns:1fr 1fr}.wmf-topcol{grid-column:1/-1}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMFooter(props: FooterProps) {
    const {
        links = [
            { label: "The shift", href: "#the-shift" },
            { label: "Who we are", href: "#who-we-are" },
            { label: "What we do", href: "#what-we-do" },
            { label: "The work", href: "#the-work" },
            { label: "What's next", href: "#whats-next" },
            { label: "Let's talk", href: "#lets-talk" },
        ],
        email = "social@worldmedia.co.in",
        phone = "+91 8800 040 301",
        social = "@[worldmedia]",
        socialHref = "",
        note = "psst… this is our portfolio too",
        copyright = "© 2026 World Media · Delhi, India",
        style,
    } = props

    const [markRef, markIn] = useIn<HTMLSpanElement>(0.3)
    const word = "world media"

    return (
        <Section theme="ink" className="wmf" css={FOOTER_CSS} style={style} label="Footer">
            <footer className="wm-wrap">
                <Stagger className="wmf-cols" step={0.08}>
                    <nav aria-label="Chapters">
                        <span className="wmf-t">Chapters</span>
                        <div className="wmf-list">
                            {links.map((l, i) => (
                                <a key={i} href={l.href}>
                                    <em>{String(i + 1).padStart(2, "0")}</em>
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                    <div>
                        <span className="wmf-t">Say hello</span>
                        <div className="wmf-list">
                            <a href={"mailto:" + email}>{email}</a>
                            <a href={"tel:" + phone.replace(/[^+\d]/g, "")}>{phone}</a>
                        </div>
                    </div>
                    <div>
                        <span className="wmf-t">Follow</span>
                        <div className="wmf-list">
                            {socialHref ? (
                                <a href={socialHref} target="_blank" rel="noreferrer">
                                    {social}
                                </a>
                            ) : (
                                <span style={{ fontSize: 15.5, fontWeight: 500 }}>{social}</span>
                            )}
                        </div>
                    </div>
                    <div className="wmf-topcol">
                        <a className="wmf-top" href="#top" aria-label="Back to top">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 20V4M5 11l7-7 7 7" />
                            </svg>
                        </a>
                    </div>
                </Stagger>
                <span ref={markRef} className={"wmf-mark" + markIn} aria-label="world media.">
                    {Array.from(word).map((ch, k) => (
                        <span className="l" key={k} style={cssVars({ "--k": k })} aria-hidden="true">
                            {ch === " " ? String.fromCharCode(160) : ch}
                        </span>
                    ))}
                    <span className="l dot" style={cssVars({ "--k": word.length })} aria-hidden="true">
                        .
                    </span>
                </span>
                <div className="wmf-bottom">
                    <span className="wm-mono wm-mut">{copyright}</span>
                    <Script className="wmf-note" delay={0.3} rotate={-2}>
                        {note}
                    </Script>
                </div>
            </footer>
        </Section>
    )
}

addPropertyControls(WMFooter, {
    links: {
        type: ControlType.Array,
        title: "Chapters",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { label: "The shift", href: "#the-shift" },
            { label: "Who we are", href: "#who-we-are" },
            { label: "What we do", href: "#what-we-do" },
            { label: "The work", href: "#the-work" },
            { label: "What's next", href: "#whats-next" },
            { label: "Let's talk", href: "#lets-talk" },
        ],
    },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 8800 040 301" },
    social: { type: ControlType.String, title: "Instagram", defaultValue: "@[worldmedia]" },
    socialHref: { type: ControlType.String, title: "Instagram link", defaultValue: "" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "psst… this is our portfolio too" },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: "© 2026 World Media · Delhi, India" },
})
