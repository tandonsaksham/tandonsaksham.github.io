//@@ INSTRUCTIONS
// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: the chapter opener used five times (01 The shift … 05 What's next). The giant
// vermilion numeral is cut into eleven slices that fly in from alternating sides and lock
// together over a faint outline of itself. The cursor smears the slices sideways like wet paint
// and they spring back; scrolling sends a ripple through them. The spaced label blurs into focus,
// the stack of short lines marks the chapter's position, and the long rule divides headline from body.
//@@ BODY

type ChapterProps = {
    number: string
    label: string
    headline: string
    body: string
    total: number
    anchor: string
    style?: React.CSSProperties
}

const SLICES = 11

const CHAPTER_CSS = `
.wmc.wm-sec{background:radial-gradient(60% 55% at 70% 52%,rgba(242,238,229,.05),rgba(242,238,229,.018) 55%,transparent 88%),var(--ink)}
.wmc .wm-wrap{padding-top:clamp(88px,9cqw,136px);padding-bottom:clamp(88px,9cqw,136px)}
.wmc-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(28px,4cqw,64px);align-items:stretch}
.wmc-rule{position:absolute;left:0;right:0;top:50%;z-index:0}
.wmc-num{position:relative;z-index:1;display:flex;align-items:center;min-height:clamp(150px,24cqw,380px);padding-left:clamp(56px,7cqw,112px)}
.wmc-lines{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:clamp(6px,.7cqw,10px);width:clamp(40px,5cqw,76px)}
.wmc-lines i{display:block;height:1px;width:78%;background:var(--line2);transform:scaleX(0);transform-origin:0 50%;transition:transform 1s var(--ease);transition-delay:calc(var(--k) * .07s + .1s)}
.wmc-lines i.on{height:2px;width:100%;background:var(--red)}
.wmc-lines.wm-in i{transform:none}
.wmc-drift{position:relative;z-index:0}
.wmc-obj{position:relative;display:block;font-weight:800;font-size:clamp(150px,24cqw,380px);line-height:.78;letter-spacing:-.06em;color:var(--red);--sh:calc(.9em / 11)}
.wmc-size{display:block;visibility:hidden;white-space:nowrap;padding:.08em .03em .04em}
.wmc-ghost{position:absolute;left:0;top:0;white-space:nowrap;padding:.08em .03em .04em;color:transparent;-webkit-text-stroke:1.5px rgba(233,67,27,.45);opacity:0;transform:translate3d(.07em,.07em,0);transition:opacity 1.2s var(--ease) .95s,transform 1.8s var(--ease) .95s}
.wmc-obj.wm-in .wmc-ghost{opacity:1;transform:translate3d(.035em,.035em,0)}
.wmc-slice{position:absolute;left:-.25em;right:-.25em;top:calc(var(--k) * var(--sh));height:calc(var(--sh) + 1px);overflow:hidden;will-change:transform}
.wmc-sl{position:absolute;left:.25em;top:calc(var(--k) * var(--sh) * -1);white-space:nowrap;padding:.08em .03em .04em;transform:translate3d(calc(var(--dir) * 140%),0,0);transition:transform 1.35s cubic-bezier(.16,1,.3,1);transition-delay:calc(60ms + var(--k) * 55ms)}
.wmc-obj.wm-in .wmc-sl{transform:none}
.wmc-obj.wm-now .wmc-sl,.wmc-obj.wm-now .wmc-ghost{transition:none}
.wmc-label{position:absolute;left:clamp(80px,10cqw,160px);top:50%;transform:translateY(-50%);z-index:2;white-space:nowrap;font-weight:300;font-size:clamp(14px,1.55cqw,23px);text-transform:uppercase;letter-spacing:.34em;color:var(--cream);pointer-events:none}
.wmc-label>span{display:inline-block;opacity:0;filter:blur(10px);transform:translate3d(0,.45em,0);transition:opacity .9s var(--ease),filter 1.1s var(--ease),transform 1.1s var(--ease);transition-delay:calc(.8s + var(--k) * 45ms)}
.wmc-label.wm-in>span{opacity:1;filter:blur(0);transform:none}
.wmc-label.wm-now>span{transition:none}
.wmc-text{position:relative;z-index:1;display:grid;grid-template-rows:1fr 1fr}
.wmc-h{align-self:end;padding-bottom:clamp(28px,3.4cqw,52px);font-weight:760;font-size:clamp(30px,3.7cqw,58px);line-height:1;letter-spacing:-.035em;max-width:14em}
.wmc-b{align-self:start;padding-top:clamp(20px,2.2cqw,32px);max-width:34em;color:var(--mut)}
@container (max-width:760px){
.wmc-grid{grid-template-columns:1fr;gap:28px}
.wmc-rule{top:clamp(75px,24cqw,190px)}
.wmc-num{min-height:0;padding-left:clamp(48px,14cqw,72px)}
.wmc-obj{font-size:clamp(130px,40cqw,300px)}
.wmc-label{left:clamp(64px,20cqw,110px)}
.wmc-text{grid-template-rows:auto auto}
.wmc-h{padding-bottom:16px}.wmc-b{padding-top:0}
}
@container (max-width:560px){.wmc-h br{display:none}}
@media (prefers-reduced-motion:reduce){.wmc-sl,.wmc-lines i{transform:none!important}.wmc-ghost{opacity:1!important}.wmc-label>span{opacity:1!important;filter:none!important;transform:none!important}}
@container (max-width:640px){.wmc .wm-wrap{padding-top:64px;padding-bottom:64px}.wmc-grid{gap:22px}.wmc-obj{font-size:34cqw}.wmc-rule{top:20.4cqw}.wmc-label{left:17cqw}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function WMChapter(props: ChapterProps) {
    const {
        number = "01",
        label = "The shift",
        headline = "People tune out ads.\nThey listen to people.",
        body = "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
        total = 5,
        anchor = "the-shift",
        style,
    } = props

    const still = useStill()
    const fine = useFinePointer()
    const pos = Math.max(1, Math.min(total, parseInt(number, 10) || 1))
    const numRef = React.useRef<HTMLDivElement>(null)
    const drift = useDrift(numRef, 28)
    const [linesRef, linesIn] = useIn<HTMLDivElement>(0.5)
    const [objRef, objIn] = useIn<HTMLDivElement>(0.35)
    const [labelRef, labelIn] = useIn<HTMLSpanElement>(0.5)
    const slices = React.useRef<(HTMLDivElement | null)[]>([])

    // Wet-paint slices: the cursor's sideways speed pushes nearby slices, scroll speed sends a ripple
    // down them, and each slice springs back on its own.
    React.useEffect(() => {
        const obj = objRef.current
        const sec = obj ? (obj.closest("section") as HTMLElement | null) : null
        if (!obj || !sec || still) return
        const off = new Float32Array(SLICES)
        const vel = new Float32Array(SLICES)
        let raf = 0
        let last = 0
        let lx: number | null = null
        const run = (now: number) => {
            const dt = Math.min(0.034, (now - last) / 1000 || 0.016)
            last = now
            let busy = false
            for (let i = 0; i < SLICES; i++) {
                vel[i] += (-190 * off[i] - 13 * vel[i]) * dt
                off[i] = Math.max(-140, Math.min(140, off[i] + vel[i] * dt))
                if (Math.abs(off[i]) > 0.2 || Math.abs(vel[i]) > 2) busy = true
                else {
                    off[i] = 0
                    vel[i] = 0
                }
                const el = slices.current[i]
                if (el) el.style.transform = off[i] ? "translate3d(" + off[i].toFixed(2) + "px,0,0)" : ""
            }
            raf = busy ? requestAnimationFrame(run) : 0
        }
        const kick = () => {
            if (!raf) {
                last = performance.now()
                raf = requestAnimationFrame(run)
            }
        }
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const dx = lx === null ? 0 : e.clientX - lx
            lx = e.clientX
            const r = obj.getBoundingClientRect()
            if (!dx || e.clientY < r.top - 60 || e.clientY > r.bottom + 60) return
            const y = e.clientY - r.top
            const h = r.height / SLICES
            const sig = r.height * 0.13
            const push = Math.max(-40, Math.min(40, dx)) * 9
            for (let i = 0; i < SLICES; i++) {
                const d = y - (i + 0.5) * h
                vel[i] += push * Math.exp(-(d * d) / (2 * sig * sig))
            }
            kick()
        }
        const onLeave = () => {
            lx = null
        }
        let sy = window.scrollY
        const onScroll = () => {
            const ny = window.scrollY
            const dy = Math.max(-80, Math.min(80, ny - sy))
            sy = ny
            const r = obj.getBoundingClientRect()
            if (!dy || r.bottom < 0 || r.top > window.innerHeight) return
            for (let i = 0; i < SLICES; i++) vel[i] += Math.sin(i * 0.9 + ny * 0.01) * dy * 5
            kick()
        }
        if (fine) {
            sec.addEventListener("pointermove", onMove)
            sec.addEventListener("pointerleave", onLeave)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            cancelAnimationFrame(raf)
            sec.removeEventListener("pointermove", onMove)
            sec.removeEventListener("pointerleave", onLeave)
            window.removeEventListener("scroll", onScroll)
            slices.current.forEach((el) => {
                if (el) el.style.transform = ""
            })
        }
    }, [still, fine])

    return (
        <Section theme="ink" id={anchor} className="wmc" css={CHAPTER_CSS} style={style} label={"Chapter " + number + " — " + label}>
            <Grain still={still} amount={0.06} />
            <div className="wm-wrap">
                <div className="wmc-grid">
                    <Rule className="wmc-rule" delay={0.35} />
                    <div ref={numRef} className="wmc-num">
                        <div ref={linesRef} className={"wmc-lines" + linesIn} aria-hidden="true">
                            {Array.from({ length: total }).map((_, k) => (
                                <i key={k} className={k + 1 === pos ? "on" : undefined} style={cssVars({ "--k": k })} />
                            ))}
                        </div>
                        <motion.div className="wmc-drift" style={{ y: drift }}>
                            <div ref={objRef} className={"wmc-obj" + objIn} aria-hidden="true">
                                <span className="wmc-ghost">{number}</span>
                                <span className="wmc-size">{number}</span>
                                {Array.from({ length: SLICES }).map((_, k) => (
                                    <div
                                        className="wmc-slice"
                                        key={k}
                                        ref={(el) => {
                                            slices.current[k] = el
                                        }}
                                        style={cssVars({ "--k": k, "--dir": k % 2 ? 1 : -1 })}
                                    >
                                        <span className="wmc-sl">{number}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <span ref={labelRef} className={"wmc-label" + labelIn} aria-hidden="true">
                            {Array.from(label).map((ch, k) => (
                                <span key={k} style={cssVars({ "--k": k })}>
                                    {ch === " " ? String.fromCharCode(160) : ch}
                                </span>
                            ))}
                        </span>
                    </div>
                    <div className="wmc-text">
                        <Words as="h2" className="wmc-h" text={headline} delay={0.3} stagger={0.05} />
                        <Rise as="p" className="wmc-b wm-body" delay={0.55}>
                            {body}
                        </Rise>
                    </div>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(WMChapter, {
    number: { type: ControlType.String, title: "Number", defaultValue: "01" },
    label: { type: ControlType.String, title: "Label", defaultValue: "The shift" },
    headline: {
        type: ControlType.String,
        title: "Headline",
        displayTextArea: true,
        defaultValue: "People tune out ads.\nThey listen to people.",
    },
    body: {
        type: ControlType.String,
        title: "Body",
        displayTextArea: true,
        defaultValue:
            "The feed is where India now discovers what to buy, watch and believe. The voices that move people there are creators, and audiences can tell when a brand is only renting their space.",
    },
    total: { type: ControlType.Number, title: "Chapters", defaultValue: 5, min: 1, max: 9, step: 1 },
    anchor: { type: ControlType.String, title: "Anchor id", defaultValue: "the-shift" },
})
