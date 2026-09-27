//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: slide 6, "What we believe", written as the answer to the problem slide.
// "Attention is rented." stays grey and gets a vermilion price sticker slapped on it; the rest
// of the manifesto fills in word by word as you scroll, and "earned." is underlined in pen as
// it fills. Each belief card strikes through the problem it fixes (cast by follower count, then
// Cast for trust) and carries a small line icon that draws itself: a community with a
// heartbeat and a double check, a story pinned so it sticks, a rupee measured on a ruler.
// On phones the cards become a swipeable strip and each icon draws as its card comes forward.
//@@ BODY

type BeliefIcon = "trust" | "stick" | "rupee" | "none"

type Belief = { title: string; body: string; was?: string; icon?: BeliefIcon }

type BeliefProps = {
    tag: string
    note: string
    rented: string
    sticker: string
    earned: string
    underline: string
    cards: Belief[]
    style?: React.CSSProperties
}

const BELIEF_ICONS: BeliefIcon[] = ["trust", "stick", "rupee"]

const BELIEF_CSS = `
.wmb-top{display:flex;justify-content:space-between;align-items:flex-start;gap:24px}
.wmb-note{color:var(--red);font-size:clamp(20px,2.1cqw,31px);margin-top:4px}
.wmb-m{margin-top:clamp(40px,4.4cqw,68px);font-weight:760;font-size:clamp(34px,4.75cqw,72px);line-height:1.02;letter-spacing:-.038em;max-width:19em}
.wmb-hook,.wmb-ul{position:relative;display:inline-block}
.wmb-stk{position:absolute;right:-.08em;bottom:82%;display:block;padding:.6em 1em .55em;border-radius:99px;background:var(--red);color:var(--ink);font-family:"DM Mono",ui-monospace,monospace;font-weight:500;
font-size:max(11px,.17em);letter-spacing:.02em;line-height:1;white-space:nowrap;rotate:-8deg;opacity:0;box-shadow:0 12px 20px -14px rgba(15,15,15,.7)}
.wmb-m.wm-in .wmb-stk{opacity:1;animation:wmb-slap .75s cubic-bezier(.2,1.45,.4,1) .5s backwards}
.wmb-m.wm-now .wmb-stk{animation:none}
.wmb-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.4cqw,20px);margin-top:clamp(48px,6cqw,96px)}
.wmb-card{position:relative;display:flex;flex-direction:column;background:var(--surf);border-radius:18px;padding:clamp(22px,2.2cqw,32px);min-height:clamp(270px,22cqw,330px);transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.wmb-card:hover{transform:translateY(-6px);box-shadow:0 22px 40px -24px rgba(15,15,15,.35)}
.wmb-head{display:flex;flex-direction:row-reverse;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:auto;padding-bottom:28px}
.wmb-num{font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;color:var(--red)}
.wmb-was{font-family:"DM Mono",ui-monospace,monospace;font-size:12.5px;letter-spacing:.01em;color:var(--stone);margin-bottom:9px}
.wmb-was span{position:relative;display:inline-block}
.wmb-was span::after{content:"";position:absolute;left:-4px;right:-4px;top:54%;height:1.6px;border-radius:2px;background:var(--red);transform:scaleX(0) rotate(-2.5deg);transform-origin:0 50%;
transition:transform .8s var(--ease-io);transition-delay:calc(1s + var(--i,0) * .15s)}
.wmb-cards.wm-in .wmb-was span::after{transform:scaleX(1) rotate(-2.5deg)}
.wmb-card h3{margin-bottom:10px}
.wmb-card .wm-small{color:var(--mut)}
.wmb-ico{display:block;flex:none;width:clamp(64px,6cqw,88px);height:auto;margin:-6px 0 0 -8px;overflow:visible;fill:none;stroke:var(--ink);stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.wmb-ico .a{stroke:var(--red)}
.wmb-ico .af{fill:var(--red);stroke:none}
.wmb-ico .hb{transform-box:fill-box;transform-origin:50% 60%}
.wmb-ico .pin{transform-box:fill-box;transform-origin:50% 100%}
.wmb-ico .card{transform-box:view-box;transform-origin:28px 15px}
.wmb-ico .mk{transform-box:fill-box}
.wmb-cards.wm-in .wmb-ico .d{stroke-dasharray:1;animation:bi-draw 1s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + var(--k,0) * .12s)}
.wmb-cards.wm-in .wmb-ico .fi{animation:bi-fade .7s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + var(--k,0) * .12s)}
.wmb-cards.wm-in .wmb-ico .hb{animation:bi-beat 1.4s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .45s)}
.wmb-cards.wm-in .wmb-ico .pin{animation:bi-pin .9s linear backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .55s)}
.wmb-cards.wm-in .wmb-ico .card{animation:bi-wob 1s var(--ease) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .92s)}
.wmb-cards.wm-in .wmb-ico .mk{animation:bi-slide 1.5s var(--ease-io) backwards;animation-delay:calc(var(--b,.55s) + var(--i,0) * .15s + .75s)}
.wmb-cards.wm-now .wmb-ico *{animation:none!important}
@keyframes wmb-slap{0%{opacity:0;transform:scale(1.9) translateY(-18px)}55%{opacity:1}100%{opacity:1;transform:none}}
@keyframes bi-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes bi-fade{from{opacity:0}}
@keyframes bi-beat{0%{transform:scale(0)}24%{transform:scale(1.28)}38%{transform:scale(.9)}52%{transform:scale(1.16)}70%,100%{transform:none}}
@keyframes bi-pin{0%{opacity:0;transform:translateY(-16px)}40%{opacity:1;transform:none;animation-timing-function:ease-out}55%{transform:translateY(-4px);animation-timing-function:ease-in}70%,100%{transform:none}}
@keyframes bi-wob{0%{transform:none}25%{transform:rotate(-7deg)}50%{transform:rotate(4deg)}75%{transform:rotate(-2deg)}100%{transform:none}}
@keyframes bi-slide{from{transform:translateX(-32px)}}
@container (max-width:820px){.wmb-top{flex-direction:column}.wmb-card{min-height:0}.wmb-head{padding-bottom:22px}}
@container (max-width:640px){.wmb-cards{margin-top:34px}.wmb-card:hover{transform:none;box-shadow:none}}
`

function ScrubWord(p: { progress: any; from: number; to: number; still: boolean; children: React.ReactNode }) {
    const opacity = useTransform(p.progress, [p.from, p.to], [0.14, 1])
    if (p.still) return <span>{p.children}</span>
    return <motion.span style={{ opacity }}>{p.children}</motion.span>
}

/** The belief's line icon. Its finished drawing is the resting state; the entrance plays once the cards are in. */
function BeliefGlyph(p: { kind: BeliefIcon; replay: boolean }) {
    const k = (n: number) => cssVars({ "--k": n })
    const style = p.replay ? cssVars({ "--b": "0s", "--i": 0 }) : undefined
    if (p.kind === "trust")
        return (
            <svg className="wmb-ico wm-replay" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <path className="d" pathLength={1} style={k(1)} d="M10.5 28 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
                <path className="d" pathLength={1} style={k(1)} d="M7 40 C 7 34.5, 22 34.5, 22 40" />
                <path className="d" pathLength={1} style={k(2)} d="M37.5 28 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
                <path className="d" pathLength={1} style={k(2)} d="M34 40 C 34 34.5, 49 34.5, 49 40" />
                <path className="d" pathLength={1} d="M23 25 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" />
                <path className="d" pathLength={1} d="M18.5 40 C 18.5 32, 37.5 32, 37.5 40" />
                <path className="af hb" d="M28 17 C 22.6 13.4, 23.8 8.6, 26.7 9.3 C 27.4 9.5, 27.8 10.1, 28 10.6 C 28.2 10.1, 28.6 9.5, 29.3 9.3 C 32.2 8.6, 33.4 13.4, 28 17 Z" />
                <path className="a d" pathLength={1} style={k(5)} d="M17.5 47 l3.4 3.4 6.8-7.2" />
                <path className="a d" pathLength={1} style={k(6)} d="M25 47 l3.4 3.4 6.8-7.2" />
            </svg>
        )
    if (p.kind === "stick")
        return (
            <svg className="wmb-ico wm-replay" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <g className="card">
                    <path className="d" pathLength={1} d="M18 14 H38 A4 4 0 0 1 42 18 V46 A4 4 0 0 1 38 50 H18 A4 4 0 0 1 14 46 V18 A4 4 0 0 1 18 14 Z" />
                    <path className="d" pathLength={1} style={k(2)} d="M20 21 H36 V33 H20 Z" />
                    <path className="a d" pathLength={1} style={k(3)} d="M25.5 24 L31 27 L25.5 30 Z" />
                    <path className="d" pathLength={1} style={k(4)} d="M20 39 H36 M20 44 H30" />
                </g>
                <g className="pin">
                    <path d="M28 12 V19" strokeWidth={1.6} />
                    <circle className="af" cx="28" cy="8.5" r="4.4" />
                </g>
            </svg>
        )
    if (p.kind === "rupee")
        return (
            <svg className="wmb-ico wm-replay" viewBox="0 0 56 56" aria-hidden="true" style={style}>
                <path className="a d" pathLength={1} style={k(1)} d="M19 9 H37" strokeWidth={2} />
                <path className="a d" pathLength={1} style={k(2)} d="M19 15 H37" strokeWidth={2} />
                <path className="a d" pathLength={1} style={k(3)} d="M23 9 C 33 9, 33 21, 23 21 H19.5 L34 34" strokeWidth={2} />
                <path className="d" pathLength={1} d="M7.5 40 H48.5 A1.5 1.5 0 0 1 50 41.5 V48.5 A1.5 1.5 0 0 1 48.5 50 H7.5 A1.5 1.5 0 0 1 6 48.5 V41.5 A1.5 1.5 0 0 1 7.5 40 Z" />
                <path className="fi" style={k(2)} d="M10 40 V44 M14 40 V43 M18 40 V43 M22 40 V43 M26 40 V45 M30 40 V43 M34 40 V43 M38 40 V43 M42 40 V43 M46 40 V44" />
                <path className="af mk" d="M42.5 33.5 H49.5 L46 38 Z" />
            </svg>
        )
    return null
}

function BeliefCard(p: { c: Belief; i: number; still: boolean; fine: boolean; style?: React.CSSProperties }) {
    const [run, setRun] = React.useState(0)
    const kind: BeliefIcon = p.c.icon || BELIEF_ICONS[p.i] || "none"
    const replay = () => {
        if (p.fine && !p.still) setRun((r) => r + 1)
    }
    return (
        <article className="wmb-card" style={p.style} onPointerEnter={replay}>
            <div className="wmb-head">
                <span className="wmb-num">{String(p.i + 1).padStart(2, "0")}</span>
                {kind !== "none" ? <BeliefGlyph key={run} kind={kind} replay={run > 0} /> : null}
            </div>
            {p.c.was ? (
                <p className="wmb-was">
                    <span>{p.c.was}</span>
                </p>
            ) : null}
            <h3 className="wm-h3">{p.c.title}</h3>
            <p className="wm-small">{p.c.body}</p>
        </article>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMBelief(props: BeliefProps) {
    const {
        tag = "What we believe",
        note = "our answer to all of that",
        rented = "Attention is rented.",
        sticker = "₹ per post",
        earned = "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
        underline = "earned.",
        cards = [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice.", was: "Cast by follower count", icon: "trust" },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember.", was: "One post, then silence", icon: "stick" },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read.", was: "Reports full of vanity", icon: "rupee" },
        ],
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const [mRef, mIn] = useIn<HTMLParagraphElement>(0.3)
    const { scrollYProgress } = useScroll({ target: mRef, offset: ["start 85%", "end 50%"] })
    const [slap, setSlap] = React.useState(0)
    const heads = rented.split(/\s+/).filter(Boolean)
    const words = earned.split(/\s+/).filter(Boolean)
    const n = Math.max(1, words.length)
    const ul = underline ? words.indexOf(underline) : -1
    const ulDraw = useTransform(scrollYProgress, [Math.max(0, ul) / n, Math.min(1, (Math.max(0, ul) + 1.8) / n)], [0, 1])

    return (
        <Section theme="cream" className="wmb" css={PEN_CSS + BELIEF_CSS + SWIPE_CSS} style={style} label={tag}>
            <div className="wm-wrap">
                <div className="wmb-top">
                    <Chrome label={tag} />
                    <Script className="wmb-note" delay={0.5} rotate={-4}>
                        {note}
                    </Script>
                </div>
                <p ref={mRef} className={"wmb-m" + mIn} aria-label={rented + " " + earned}>
                    <span aria-hidden="true">
                        {heads.map((w, i) => (
                            <React.Fragment key={"r" + i}>
                                {i === heads.length - 1 && sticker ? (
                                    <span className="wmb-hook" onPointerEnter={() => fine && !still && setSlap((s) => s + 1)}>
                                        <span className="wm-stone">{w}</span>
                                        <span className="wmb-stk" key={slap}>
                                            {sticker}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="wm-stone">{w}</span>
                                )}{" "}
                            </React.Fragment>
                        ))}
                        {words.map((w, i) => (
                            <React.Fragment key={i}>
                                {i === ul ? (
                                    <span className="wmb-ul">
                                        <ScrubWord progress={scrollYProgress} from={i / n} to={(i + 1) / n} still={still}>
                                            {w}
                                        </ScrubWord>
                                        <PenMark kind="under" draw={still ? undefined : ulDraw} on={still} />
                                    </span>
                                ) : (
                                    <ScrubWord progress={scrollYProgress} from={i / n} to={(i + 1) / n} still={still}>
                                        {w}
                                    </ScrubWord>
                                )}
                                {i < words.length - 1 ? " " : null}
                            </React.Fragment>
                        ))}
                    </span>
                </p>
                <Stagger className={"wmb-cards wm-swipe" + (still ? " wm-now" : "")} step={0.1}>
                    {cards.map((c, i) => (
                        <BeliefCard key={i} c={c} i={i} still={still} fine={fine} />
                    ))}
                </Stagger>
                <SwipeUI hint="swipe" />
            </div>
        </Section>
    )
}

addPropertyControls(WMBelief, {
    tag: { type: ControlType.String, title: "Tag", defaultValue: "What we believe" },
    note: { type: ControlType.String, title: "Handwritten", defaultValue: "our answer to all of that" },
    rented: { type: ControlType.String, title: "Grey part", defaultValue: "Attention is rented." },
    sticker: { type: ControlType.String, title: "Sticker", defaultValue: "₹ per post" },
    earned: {
        type: ControlType.String,
        title: "Manifesto",
        displayTextArea: true,
        defaultValue: "Trust is earned. We help brands earn it, one creator, one story, one community at a time.",
    },
    underline: { type: ControlType.String, title: "Pen underline", defaultValue: "earned." },
    cards: {
        type: ControlType.Array,
        title: "Beliefs",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                body: { type: ControlType.String, title: "Body", displayTextArea: true },
                was: { type: ControlType.String, title: "Replaces" },
                icon: {
                    type: ControlType.Enum,
                    title: "Icon",
                    options: ["trust", "stick", "rupee", "none"],
                    optionTitles: ["Community + double check", "Pinned story", "Rupee on a ruler", "None"],
                },
            },
        },
        defaultValue: [
            { title: "Cast for trust", body: "We pick creators for the community they've built, then check the data twice.", was: "Cast by follower count", icon: "trust" },
            { title: "Stories that stick", body: "Series, moments and formats people follow, share and remember.", was: "One post, then silence", icon: "stick" },
            { title: "Measured to the rupee", body: "Every campaign ends with a report your finance team will actually read.", was: "Reports full of vanity", icon: "rupee" },
        ],
    },
})
