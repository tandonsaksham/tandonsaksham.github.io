//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the footer. A thank-you for reading this far, the name set huge with a small
// spinning globe for the "o", the menu again, and the small print. In the separate-pages
// version (Links go to: Separate pages) the links open the pages, as in the menu.
//@@ BODY

type FootLink = { label: string; href: string }

type FooterProps = {
    mode: "sections" | "pages"
    thanks: string
    name: string
    links: FootLink[]
    copyright: string
    note: string
    style?: React.CSSProperties
}

const FOOT_CSS = `
.w2f-wrap{padding:clamp(28px,3cqw,48px) var(--gut) clamp(20px,2cqw,30px)}
.w2f-top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.w2f-thanks{font-size:clamp(18px,1.8cqw,28px);letter-spacing:-.03em;max-width:28ch}
.w2f-up.w2-pill svg{transition:translate .5s var(--ease)}
.w2f-up.w2-pill:hover svg{translate:0 -3px}
.w2f-name{display:flex;align-items:center;justify-content:center;margin:clamp(30px,4cqw,70px) 0 clamp(18px,2cqw,30px);font-size:clamp(64px,16.6cqw,268px);line-height:.86;letter-spacing:-.065em;white-space:nowrap}
.w2f-name .w2-w{padding-bottom:.12em}
.w2f-o{display:inline-flex;align-items:center;justify-content:center;width:.62em;height:.62em;margin:0 .02em;translate:0 .05em;color:var(--red)}
.w2f-o .w2-globe{width:100%;height:100%}
.w2f-dot{color:var(--red)}
.w2f-bot{display:flex;align-items:center;justify-content:space-between;gap:16px 28px;flex-wrap:wrap;padding-top:18px;border-top:1px solid var(--line);font-size:13px;color:var(--mut)}
.w2f-links{display:flex;flex-wrap:wrap;gap:6px 18px}
.w2f-links a{color:var(--paper);transition:color .3s}
.w2f-links a:hover{color:var(--red)}
.w2f-note{font-size:18px;color:var(--paper)}
@container (max-width:640px){.w2f-bot{flex-direction:column;align-items:flex-start}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Footer(props: FooterProps) {
    const {
        mode = "sections",
        thanks = "Thanks for making it all the way down here.",
        name = "world media",
        links = [
            { label: "Services", href: "#services" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Join us", href: "#join" },
        ],
        copyright = "© 2026 World Media · Delhi, India",
        note = "psst… this site is our portfolio too",
        style,
    } = props
    const [ref, on] = useReveal<HTMLParagraphElement>(0.4)
    const toTop = (e: React.MouseEvent) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
    const items = mode === "pages" ? PAGE_LINKS : links
    // The first "o" of the name becomes a turning globe.
    const chars = Array.from(name)
    const oAt = chars.findIndex((c) => c.toLowerCase() === "o")
    return (
        <Section tone="ink" className="w2f" css={FOOT_CSS} label="Footer" style={style}>
            <footer className="w2f-wrap">
                <div className="w2f-top">
                    <Reveal as="p" className="w2f-thanks w2-rise">
                        {thanks}
                    </Reveal>
                    <a className="w2-pill w2f-up" data-hue="paper" href="#top" onClick={toTop}>
                        <Roll>Back to the top</Roll>
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 13V1.5M1.5 6L6 1.5 10.5 6" />
                        </svg>
                    </a>
                </div>
                <p ref={ref} className={"w2f-name" + on} translate="no">
                    <span className="w2-sr">{name}.</span>
                    {chars.map((c, i) =>
                        i === oAt ? (
                            <span key={i} className="w2-w" aria-hidden="true">
                                <span style={cssVars({ "--d": (i * 0.04).toFixed(2) + "s" })}>
                                    <span className="w2f-o">
                                        <Globe size={100} speed={7} width={2.4} />
                                    </span>
                                </span>
                            </span>
                        ) : (
                            <span key={i} className="w2-w" aria-hidden="true">
                                <span style={cssVars({ "--d": (i * 0.04).toFixed(2) + "s" })}>{c === " " ? "\u00a0" : c}</span>
                            </span>
                        )
                    )}
                    <span className="w2-w" aria-hidden="true">
                        <span className="w2f-dot" style={cssVars({ "--d": (chars.length * 0.04).toFixed(2) + "s" })}>
                            .
                        </span>
                    </span>
                </p>
                <div className="w2f-bot">
                    <span>{copyright}</span>
                    <nav className="w2f-links" aria-label="Footer">
                        {items.map((l, i) => (
                            <PageLink key={i} href={l.href} onClick={() => pickSide(l.href)}>
                                {l.label}
                            </PageLink>
                        ))}
                    </nav>
                    <span className="w2f-note w2-it">{note}</span>
                </div>
            </footer>
        </Section>
    )
}

addPropertyControls(W2Footer, {
    mode: {
        type: ControlType.Enum,
        title: "Links go to",
        options: ["sections", "pages"],
        optionTitles: ["Sections on this page", "Separate pages"],
        defaultValue: "sections",
        description: "Separate pages: the same links as the menu.",
    },
    thanks: { type: ControlType.String, title: "Thank-you", defaultValue: "Thanks for making it all the way down here." },
    name: { type: ControlType.String, title: "Name", defaultValue: "world media" },
    links: {
        type: ControlType.Array,
        title: "Links",
        hidden: (p: Partial<FooterProps>) => p.mode === "pages",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                href: { type: ControlType.String, title: "Link (#id)" },
            },
        },
        defaultValue: [
            { label: "Services", href: "#services" },
            { label: "Projects", href: "#projects" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
            { label: "Join us", href: "#join" },
        ],
    },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: "© 2026 World Media · Delhi, India" },
    note: { type: ControlType.String, title: "Note", defaultValue: "psst… this site is our portfolio too" },
})
