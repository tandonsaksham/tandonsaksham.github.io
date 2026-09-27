//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slides 14 and 16, "Case file — the story". Variant "panel" (CF-001) has the
// brief / idea / move rows beside a blank image panel with a taped note; variant "creators"
// (CF-002) shows three blank phone frames for the creators, the middle one in vermilion.
//@@ BODY

type StoryRow = { label: string; text: string }
type Creator = { handle: string; stat: string }

type CaseStoryProps = {
    variant: "panel" | "creators"
    anchor: string
    tag: string
    meta: string
    title: string
    hook: string
    rowsPanel: StoryRow[]
    rowsCreators: StoryRow[]
    noteLines: string
    creators: Creator[]
    style?: React.CSSProperties
}

const STORY_CSS = `
.wmst-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(32px,5cqw,90px);align-items:start;margin-top:clamp(28px,3.4cqw,48px)}
.wmst-meta{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:var(--red);text-transform:uppercase}
.wmst-h{margin-top:14px;font-weight:780;font-size:clamp(38px,5cqw,76px);line-height:.98;letter-spacing:-.042em}
.wmst-hook{display:inline-block;margin-top:clamp(12px,1.4cqw,20px);color:var(--red);font-size:clamp(21px,2.1cqw,31px)}
.wmst-rows{margin-top:clamp(24px,3cqw,40px)}
.wmst-row{position:relative;display:grid;grid-template-columns:clamp(96px,10cqw,130px) 1fr;gap:16px;padding:16px 0}
.wmst-row>.wm-hr{position:absolute;left:0;right:0;bottom:0}
.wmst-row:last-child>.wm-hr{display:none}
.wmst-l{font-family:"DM Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.06em;color:var(--mut);padding-top:3px;text-transform:uppercase}
.wmst.stack .wmst-row{grid-template-columns:1fr;gap:6px;padding:10px 0}
.wmst.stack .wmst-row>.wm-hr{display:none}
.wmst-panelwrap{position:relative}
.wmst-panel{aspect-ratio:1/1.02;border-radius:16px}
.wmst-panel-in{clip-path:inset(100% 0 0 0);transition:clip-path 1.3s var(--ease-io) .15s}
.wmst-panel-in.wm-in{clip-path:inset(0 0 0 0)}
.wmst-note{position:absolute;left:clamp(-18px,-1.2cqw,-8px);bottom:clamp(40px,5cqw,80px);background:var(--cream);color:var(--ink);padding:22px 26px 18px;border-radius:3px;box-shadow:0 30px 50px -28px rgba(0,0,0,.75);
transform:rotate(-4deg);transition:transform .9s cubic-bezier(.34,1.56,.64,1)}
.wmst-note:hover{transform:rotate(1deg) translateY(-4px)}
.wmst-note .wm-script{display:block;font-size:clamp(20px,1.9cqw,26px);line-height:1.18}
.wmst-tape{position:absolute;left:50%;top:-11px;width:70px;height:22px;margin-left:-35px;background:rgba(200,190,168,.82);transform:rotate(3deg)}
.wmst-notein{opacity:0;transform:translateY(40px) rotate(-14deg);transition:opacity .8s var(--ease),transform 1.2s cubic-bezier(.34,1.56,.64,1);transition-delay:.7s}
.wmst-notein.wm-in{opacity:1;transform:none}
.wmst-phones{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.3cqw,18px);align-items:start}
.wmst-phone .wm-ph{aspect-ratio:9/16.5;border-radius:clamp(16px,1.8cqw,26px);background:var(--ink2);border:1px solid var(--line)}
.wmst-phone.mid .wm-ph{border:2px solid var(--red)}
.wmst-phone b{display:block;margin-top:12px;font-size:13.5px;font-weight:650;letter-spacing:-.01em}
.wmst-phone figcaption>span{display:block;font-size:12.5px;color:var(--mut);margin-top:2px}
@container (max-width:860px){.wmst-grid{grid-template-columns:1fr}.wmst-note{left:12px}}
@container (max-width:560px){.wmst-phone b{font-size:12px;overflow-wrap:anywhere}.wmst-phone figcaption>span{font-size:11.5px}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMCaseStory(props: CaseStoryProps) {
    const variant = props.variant || "panel"
    const isPanel = variant === "panel"
    const {
        anchor = isPanel ? "case-001" : "case-002",
        tag = isPanel ? "Case file 001 — the story" : "Case file 002 — the story",
        meta = isPanel ? "[Brand] × World Media · [Category] · [Year]" : "[Brand] × World Media · [Year]",
        title = "[Campaign name]",
        hook = "the one where [one-line hook]",
        rowsPanel = [
            { label: "The brief", text: "[What the brand needed: the business problem in one or two lines.]" },
            { label: "The idea", text: "[The creative insight that made creators want to post it.]" },
            { label: "Our move", text: "[Who we cast, which platforms, and what made the execution different.]" },
        ],
        rowsCreators = [
            { label: "The brief", text: "[What the brand needed, in two lines.]" },
            { label: "The idea", text: "[The format or trend we built around, and why these three creators.]" },
        ],
        noteLines = "[__] creators\n[__] cities\n[__] days live",
        creators = [
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
        ],
        style,
    } = props

    const rows = isPanel ? rowsPanel : rowsCreators
    const phonesRef = React.useRef<HTMLDivElement>(null)
    const up = useDrift(phonesRef, 22)
    const down = useDrift(phonesRef, -34)
    const [panelRef, panelIn] = useIn<HTMLDivElement>(0.25)
    const [noteRef, noteIn] = useIn<HTMLDivElement>(0.3)

    return (
        <Section theme="ink" id={anchor} className={"wmst" + (isPanel ? "" : " stack")} css={STORY_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <Chrome label={tag} />
                <div className="wmst-grid" ref={phonesRef}>
                    <div>
                        <Fade className="wmst-meta" delay={0.1}>
                            {meta}
                        </Fade>
                        <Words as="h2" className="wmst-h" text={title} delay={0.15} />
                        <Script className="wmst-hook" delay={0.6} rotate={-2}>
                            {hook}
                        </Script>
                        <Stagger className="wmst-rows" step={0.1} delay={0.3}>
                            {rows.map((r, i) => (
                                <div className="wmst-row" key={i}>
                                    <span className="wmst-l">{r.label}</span>
                                    <p className="wm-body">{fill(r.text)}</p>
                                    <div className="wm-hr" />
                                </div>
                            ))}
                        </Stagger>
                    </div>

                    {isPanel ? (
                        <div className="wmst-panelwrap" ref={panelRef}>
                            <div className={"wmst-panel-in" + panelIn}>
                                <div className="wm-ph wmst-panel" aria-hidden="true" />
                            </div>
                            <div ref={noteRef} className={"wmst-notein" + noteIn} style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, pointerEvents: "none" }}>
                                <div className="wmst-note" style={{ pointerEvents: "auto" }}>
                                    <span className="wmst-tape" aria-hidden="true" />
                                    {noteLines.split("\n").map((l, i) => (
                                        <span className="wm-script" key={i}>
                                            {fill(l)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="wmst-phones">
                            {creators.slice(0, 3).map((c, i) => (
                                <motion.figure className={"wmst-phone" + (i === 1 ? " mid" : "")} key={i} style={{ y: i === 1 ? down : up, marginTop: i === 1 ? "clamp(20px,3cqw,44px)" : 0 }}>
                                    <Rise delay={0.15 + i * 0.12}>
                                        <div className="wm-ph" aria-hidden="true" />
                                        <figcaption>
                                            <b>{c.handle}</b>
                                            <span>{fill(c.stat)}</span>
                                        </figcaption>
                                    </Rise>
                                </motion.figure>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMCaseStory, {
    variant: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["panel", "creators"],
        optionTitles: ["Image panel", "Three creators"],
        defaultValue: "panel",
        displaySegmentedControl: true,
    },
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "case-001" },
    tag: { type: ControlType.String, title: "Tag", defaultValue: "Case file 001 — the story" },
    meta: { type: ControlType.String, title: "Meta", defaultValue: "[Brand] × World Media · [Category] · [Year]" },
    title: { type: ControlType.String, title: "Campaign", defaultValue: "[Campaign name]" },
    hook: { type: ControlType.String, title: "Handwritten hook", defaultValue: "the one where [one-line hook]" },
    rowsPanel: {
        type: ControlType.Array,
        title: "Story rows",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
            },
        },
        defaultValue: [
            { label: "The brief", text: "[What the brand needed: the business problem in one or two lines.]" },
            { label: "The idea", text: "[The creative insight that made creators want to post it.]" },
            { label: "Our move", text: "[Who we cast, which platforms, and what made the execution different.]" },
        ],
        hidden: (p: any) => p.variant === "creators",
    },
    rowsCreators: {
        type: ControlType.Array,
        title: "Story rows",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
            },
        },
        defaultValue: [
            { label: "The brief", text: "[What the brand needed, in two lines.]" },
            { label: "The idea", text: "[The format or trend we built around, and why these three creators.]" },
        ],
        hidden: (p: any) => p.variant !== "creators",
    },
    noteLines: {
        type: ControlType.String,
        title: "Note (one per line)",
        displayTextArea: true,
        defaultValue: "[__] creators\n[__] cities\n[__] days live",
        hidden: (p: any) => p.variant === "creators",
    },
    creators: {
        type: ControlType.Array,
        title: "Creators",
        maxCount: 3,
        control: {
            type: ControlType.Object,
            controls: {
                handle: { type: ControlType.String, title: "Handle" },
                stat: { type: ControlType.String, title: "Stat" },
            },
        },
        defaultValue: [
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
            { handle: "@[creator_handle]", stat: "[__]K · [platform]" },
        ],
        hidden: (p: any) => p.variant !== "creators",
    },
})
