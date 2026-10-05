//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: the landing. First a small, minimal loading screen in the centre: the World Media
// globe spinning above a thin bar and a percentage, filling while the page and the video load.
// Then the globe video in a rounded frame, with the World Media name set over it, one line
// about World Media and the time in Delhi. Until the real video is added in the Video field,
// a sample plays: NASA's spinning Earth.
//@@ BODY

type HeroProps = {
    video: string
    poster?: { src?: string; srcSet?: string; alt?: string }
    samples: boolean
    nameOver: boolean
    wordmark: string
    statement: string
    location: string
    timeZone: string
    zone: string
    intro: boolean
    style?: React.CSSProperties
}

/* The sample globe video sits in a square box (the smaller of 76% of the card height and 88% of
   its width, centred 48% down the card) on black, so the edges of the clip disappear. */
const HERO_CSS = `
@property --w2p{syntax:"<number>";inherits:true;initial-value:0}
@property --w2n{syntax:"<integer>";inherits:true;initial-value:0}
.w2h{padding:var(--m);height:100vh;height:100svh;min-height:560px}
.w2h-card{position:relative;height:100%;border-radius:var(--r);overflow:hidden;background:#0C0C0B;isolation:isolate}
.w2h-card.smp{background:#000}
.w2h-stage{position:absolute;inset:0;scale:1.08;transition:scale 2.4s var(--ease)}
.w2h.on .w2h-stage{scale:1}
.w2h-stage video,.w2h-stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.w2h-stage .w2h-smp{inset:auto;left:50%;top:48%;width:auto;height:min(76%,calc(.88 * (100cqw - 2 * var(--m))));aspect-ratio:1;translate:-50% -50%;object-fit:contain}
.w2h-glow{position:absolute;inset:0;background:radial-gradient(60% 55% at 50% 46%,rgba(139,220,255,.16),rgba(201,182,255,.06) 45%,transparent 70%)}
.w2h-cv{position:absolute;inset:0;width:100%;height:100%;display:block}
.w2h-mark{position:absolute;left:0;right:0;top:50%;translate:0 -54%;text-align:center;color:var(--paper);mix-blend-mode:difference;pointer-events:none;
font-size:clamp(54px,12.4cqw,210px);line-height:.9;letter-spacing:-.06em;font-weight:500;white-space:nowrap}
.w2h-mark .l{display:inline-block;opacity:0;translate:0 .5em;filter:blur(8px);transition:opacity .9s var(--ease),translate 1.1s var(--ease),filter .9s var(--ease);transition-delay:var(--d)}
.w2h.on .w2h-mark .l{opacity:1;translate:0 0;filter:none}
.w2h-mark .dot{color:var(--red)}
.w2h-shade{position:absolute;inset:auto 0 0 0;height:46%;background:linear-gradient(to top,rgba(12,12,11,.72),transparent);pointer-events:none}
.w2h-ui{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:clamp(18px,2.4cqw,36px);color:var(--paper)}
.w2h-say{max-width:24ch;font-size:clamp(19px,1.9cqw,30px);line-height:1.12;letter-spacing:-.03em}
.w2h-say .w2-it{font-size:1.08em}
.w2h-meta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right}
.w2h-where{display:flex;align-items:center;gap:8px;font-size:13px;letter-spacing:.01em;opacity:0;transition:opacity 1s var(--ease) .9s}
.w2h.on .w2h-where{opacity:1}
.w2h-where i{width:7px;height:7px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 4px rgba(217,255,63,.18)}
.w2h-where b{font-weight:500;font-variant-numeric:tabular-nums;color:rgba(255,248,241,.6)}
.w2h-snd{pointer-events:auto}
.w2h-btns{display:flex;gap:6px}
.w2h-pause.w2-pill{width:38px;padding:0}
.w2h-hint{position:absolute;top:18px;left:50%;translate:-50% 0;padding:6px 12px;border-radius:99px;background:rgba(255,248,241,.12);color:var(--paper);font-size:12px;letter-spacing:.02em;white-space:nowrap}
@container (max-width:640px){.w2h-ui{flex-direction:column;align-items:flex-start}.w2h-meta{align-items:flex-start;text-align:left}.w2h-mark{top:44%}}
.w2i.w2{position:fixed;inset:0 0 auto 0;height:100vh;height:100svh;z-index:2147483400;display:grid;place-items:center;background:var(--ink);color:var(--paper);overflow:hidden;
animation:w2iLoad 7s cubic-bezier(.1,.6,.2,1) both,w2iBail .6s 9s both;transition:background-color .9s var(--ease-io) .1s}
.w2i.js{animation:none}
.w2i.out{background-color:transparent;pointer-events:none}
@keyframes w2iLoad{from{--w2p:0;--w2n:0}to{--w2p:.94;--w2n:94}}
@keyframes w2iBail{to{opacity:0;visibility:hidden}}
.w2i-box{display:flex;flex-direction:column;align-items:center;gap:22px;color:var(--lime);transition:opacity .45s var(--ease),translate .7s var(--ease)}
.w2i.out .w2i-box{opacity:0;translate:0 -12px}
.w2i-meter{display:flex;flex-direction:column;align-items:center;gap:10px}
.w2i-bar{position:relative;display:block;width:120px;height:2px;border-radius:2px;background:rgba(255,248,241,.16);overflow:hidden}
.w2i-fill{position:absolute;inset:0;border-radius:2px;background:var(--lime);transform-origin:0 50%;scale:var(--w2p) 1}
.w2i-num{font-size:11px;line-height:1;letter-spacing:.08em;font-variant-numeric:tabular-nums;color:rgba(255,248,241,.5)}
.w2i-num::before{counter-reset:w2n var(--w2n);content:counter(w2n) "%"}
html:has(.w2i:not(.out)) .w2n-fixed{opacity:0;translate:0 -16px;visibility:hidden}
.w2n-fixed{transition:opacity .8s cubic-bezier(.16,1,.3,1) .45s,translate 1s cubic-bezier(.16,1,.3,1) .45s,visibility 0s linear .45s}
@media (prefers-reduced-motion:reduce){.w2i{display:none}}
`

/** Live time at the studio, e.g. "10:42". */
function useClock(timeZone: string): string {
    const [now, setNow] = React.useState("")
    React.useEffect(() => {
        let fmt: Intl.DateTimeFormat
        try {
            fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone })
        } catch {
            fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" })
        }
        const tick = () => React.startTransition(() => setNow(fmt.format(new Date())))
        tick()
        const id = window.setInterval(tick, 15000)
        return () => window.clearInterval(id)
    }, [timeZone])
    return now
}

/** Placeholder for the globe video: a dotted planet turning, with three pieces of content in orbit. */
function DotGlobe(p: { still: boolean; paused: boolean }) {
    const ref = React.useRef<HTMLCanvasElement>(null)
    const pausedRef = React.useRef(p.paused)
    const kick = React.useRef<() => void>(() => {})
    pausedRef.current = p.paused
    React.useEffect(() => {
        if (!p.paused) kick.current()
    }, [p.paused])
    React.useEffect(() => {
        const cv = ref.current
        if (!cv) return
        const ctx = cv.getContext("2d")
        if (!ctx) return
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        let W = 0
        let H = 0
        let pts: number[][] = []
        const build = () => {
            const r = cv.getBoundingClientRect()
            W = Math.max(1, Math.round(r.width))
            H = Math.max(1, Math.round(r.height))
            cv.width = W * dpr
            cv.height = H * dpr
            const n = W < 640 ? 640 : 1100
            pts = []
            const ga = Math.PI * (3 - Math.sqrt(5))
            for (let i = 0; i < n; i++) {
                const y = 1 - (i / (n - 1)) * 2
                const rr = Math.sqrt(1 - y * y)
                const t = ga * i
                pts.push([Math.cos(t) * rr, y, Math.sin(t) * rr, i % 11 === 0 ? 1 : 0])
            }
        }
        const tilt = 0.36
        const ct = Math.cos(tilt)
        const st = Math.sin(tilt)
        const orbits = [
            { inc: 0.5, rot: 0.3, rad: 1.38, speed: 0.42, ph: 0, col: "#F2522A" },
            { inc: -0.72, rot: -0.5, rad: 1.56, speed: 0.3, ph: 2.1, col: "#D9FF3F" },
            { inc: 1.15, rot: 1.2, rad: 1.24, speed: 0.55, ph: 4.2, col: "#8BDCFF" },
        ]
        const draw = (time: number) => {
            const a = time * 0.00012
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, W, H)
            const R = Math.min(W, H) * (W < 640 ? 0.36 : 0.33)
            const cx = W / 2
            const cy = H * 0.47
            const ca = Math.cos(a)
            const sa = Math.sin(a)
            // Orbit paths and satellites, split into the half behind the planet and the half in front.
            const sats: { x: number; y: number; z: number; col: string }[] = []
            const ring = (o: (typeof orbits)[0], front: boolean) => {
                ctx.beginPath()
                let moved = false
                for (let k = 0; k <= 96; k++) {
                    const u = (k / 96) * Math.PI * 2
                    const x0 = Math.cos(u) * o.rad
                    const z0 = Math.sin(u) * o.rad
                    const y1 = -z0 * Math.sin(o.inc)
                    const z1 = z0 * Math.cos(o.inc)
                    const x2 = x0 * Math.cos(o.rot) - y1 * Math.sin(o.rot)
                    const y2 = x0 * Math.sin(o.rot) + y1 * Math.cos(o.rot)
                    const y3 = y2 * ct - z1 * st
                    const z3 = y2 * st + z1 * ct
                    if (z3 > 0 === front) {
                        if (!moved) ctx.moveTo(cx + x2 * R, cy + y3 * R)
                        else ctx.lineTo(cx + x2 * R, cy + y3 * R)
                        moved = true
                    } else moved = false
                }
                ctx.strokeStyle = front ? "rgba(255,248,241,.22)" : "rgba(255,248,241,.08)"
                ctx.lineWidth = 1
                ctx.stroke()
            }
            orbits.forEach((o) => {
                const u = time * 0.001 * o.speed + o.ph
                const x0 = Math.cos(u) * o.rad
                const z0 = Math.sin(u) * o.rad
                const y1 = -z0 * Math.sin(o.inc)
                const z1 = z0 * Math.cos(o.inc)
                const x2 = x0 * Math.cos(o.rot) - y1 * Math.sin(o.rot)
                const y2 = x0 * Math.sin(o.rot) + y1 * Math.cos(o.rot)
                sats.push({ x: cx + x2 * R, y: cy + (y2 * ct - z1 * st) * R, z: y2 * st + z1 * ct, col: o.col })
            })
            const sat = (s: (typeof sats)[0]) => {
                const r = (W < 640 ? 5 : 7) * (0.8 + 0.25 * s.z)
                ctx.beginPath()
                ctx.fillStyle = s.col
                ctx.globalAlpha = s.z > 0 ? 1 : 0.35
                ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
                ctx.fill()
                ctx.globalAlpha = 1
            }
            orbits.forEach((o) => ring(o, false))
            sats.filter((s) => s.z <= 0).forEach(sat)
            for (let i = 0; i < pts.length; i++) {
                const q = pts[i]
                const x1 = q[0] * ca + q[2] * sa
                const z1 = -q[0] * sa + q[2] * ca
                const y2 = q[1] * ct - z1 * st
                const z2 = q[1] * st + z1 * ct
                const front = z2 > 0
                const d = (z2 + 1) / 2
                ctx.globalAlpha = front ? 0.42 + d * 0.58 : 0.06 + d * 0.18
                ctx.fillStyle = q[3] && front ? "#D9FF3F" : "#FFF8F1"
                const s = (0.9 + d * 1.9) * (W < 640 ? 0.85 : 1)
                ctx.fillRect(cx + x1 * R - s / 2, cy + y2 * R - s / 2, s, s)
            }
            ctx.globalAlpha = 1
            orbits.forEach((o) => ring(o, true))
            sats.filter((s) => s.z > 0).forEach(sat)
        }
        build()
        let raf = 0
        let vis = true
        let clock = 9000
        let last = 0
        const loop = (t: number) => {
            clock += last ? Math.min(50, t - last) : 0
            last = t
            draw(clock)
            raf = vis && !pausedRef.current ? requestAnimationFrame(loop) : 0
            if (!raf) last = 0
        }
        kick.current = () => {
            if (!raf && vis && !p.still) raf = requestAnimationFrame(loop)
        }
        const io = new IntersectionObserver(([e]) => {
            vis = e.isIntersecting
            if (vis) kick.current()
        })
        io.observe(cv)
        const ro = new ResizeObserver(() => {
            build()
            draw(clock)
        })
        ro.observe(cv)
        if (p.still) draw(clock)
        else if (!pausedRef.current) raf = requestAnimationFrame(loop)
        else draw(clock)
        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
            ro.disconnect()
        }
    }, [p.still])
    return <canvas ref={ref} className="w2h-cv" aria-hidden="true" />
}

/**
 * The loading screen: small and centred, the World Media globe spinning above a thin bar and a
 * percentage. It is part of the page's HTML, so it covers the page from the very first paint;
 * CSS spins the globe and moves the bar towards 94 until the script takes over, waits for the
 * fonts, the page and the video, then fills the bar and fades into the hero.
 */
function Loader(p: { video: React.RefObject<HTMLVideoElement>; onReveal: () => void; onGone: () => void }) {
    const ref = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        const el = ref.current
        if (!el) return
        const html = document.documentElement
        const css = typeof el.getAnimations === "function" ? el.getAnimations().find((a) => (a as CSSAnimation).animationName === "w2iLoad") : undefined
        const shown = css && typeof css.currentTime === "number" ? css.currentTime : 0
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        // Reduced motion, or a script so late the CSS fail-safe has already hidden the screen.
        if (reduce || shown > 8800) {
            p.onReveal()
            p.onGone()
            return
        }
        const start = performance.now() - shown
        let seen = false
        try {
            seen = window.sessionStorage.getItem("w2-intro") === "1"
            window.sessionStorage.setItem("w2-intro", "1")
        } catch {}
        const MIN = seen ? 1000 : 2000
        const MAX = 6000
        const prev = html.style.overflow
        html.style.overflow = "hidden"
        let alive = true
        let raf = 0
        const timers: number[] = []
        const after = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, Math.max(0, ms))))
        const since = () => performance.now() - start

        const leave = () => {
            el.classList.add("out")
            html.style.overflow = prev
            if (!window.location.hash && window.scrollY > 0) window.scrollTo(0, 0)
            p.onReveal()
            timers.push(window.setTimeout(p.onGone, 1300))
        }
        const finish = () => {
            const cs = getComputedStyle(el)
            const from = Math.min(1, parseFloat(cs.getPropertyValue("--w2p")) || 0)
            el.style.setProperty("--w2p", String(from))
            el.style.setProperty("--w2n", String(Math.round(from * 100)))
            el.classList.add("js")
            const t0 = performance.now()
            const dur = 650
            const step = (now: number) => {
                const k = Math.min(1, (now - t0) / dur)
                const v = from + (1 - from) * (1 - Math.pow(1 - k, 3))
                el.style.setProperty("--w2p", v.toFixed(4))
                el.style.setProperty("--w2n", String(Math.round(v * 100)))
                if (k < 1) raf = requestAnimationFrame(step)
                else timers.push(window.setTimeout(leave, 180))
            }
            raf = requestAnimationFrame(step)
        }

        const waits: Promise<unknown>[] = []
        const fonts = (document as any).fonts
        if (fonts && fonts.ready) waits.push(fonts.ready)
        if (document.readyState !== "complete") waits.push(new Promise((r) => window.addEventListener("load", r, { once: true })))
        const v = p.video.current
        if (v && v.readyState < 2 && !v.error) {
            waits.push(
                Promise.race([
                    new Promise((r) => {
                        v.addEventListener("loadeddata", r, { once: true })
                        v.addEventListener("error", r, { once: true })
                    }),
                    after(3500),
                ])
            )
        }
        Promise.race([Promise.all(waits), after(MAX - since())])
            .then(() => after(MIN - since()))
            .then(() => {
                if (alive) finish()
            })
        return () => {
            alive = false
            cancelAnimationFrame(raf)
            timers.forEach((t) => window.clearTimeout(t))
            html.style.overflow = prev
        }
    }, [])
    return (
        <div ref={ref} className="w2 w2i" data-tone="ink" aria-hidden="true">
            <div className="w2i-box">
                <Globe size={56} speed={3.6} width={1.3} />
                <div className="w2i-meter">
                    <span className="w2i-bar">
                        <i className="w2i-fill" />
                    </span>
                    <span className="w2i-num" />
                </div>
            </div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Hero(props: HeroProps) {
    const {
        video = "",
        poster,
        samples = true,
        nameOver = true,
        wordmark = "world media",
        statement = "A creator-first media agency. We put brands *where the conversation is.*",
        location = "Delhi, India",
        timeZone = "Asia/Kolkata",
        zone = "IST",
        intro = true,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const still = useStill()
    const time = useClock(timeZone)
    const withLoader = intro && !isStatic
    const [loader, setLoader] = React.useState(withLoader)
    const [on, setOn] = React.useState(false)
    const [muted, setMuted] = React.useState(true)
    const [paused, setPaused] = React.useState(false)
    const [failed, setFailed] = React.useState(false)
    const vref = React.useRef<HTMLVideoElement>(null)

    // Your own video wins; otherwise the sample globe, unless samples are switched off.
    const sample = !video && samples
    const src = failed ? "" : video || (sample ? SAMPLE + "globe-loop.mp4" : "")
    const posterSrc = (poster && poster.src) || (sample ? SAMPLE + "globe-poster.jpg" : undefined)
    const showName = !src || nameOver

    React.useEffect(() => {
        if (!withLoader) React.startTransition(() => setOn(true))
        // A video that failed before the page woke up still falls back to the dotted globe.
        const v = vref.current
        if (v && v.error) React.startTransition(() => setFailed(true))
    }, [])

    // The server HTML always asks the video to autoplay; respect reduced motion once known.
    React.useEffect(() => {
        const v = vref.current
        if (v && still) v.pause()
    }, [still, src])

    const reveal = React.useCallback(() => React.startTransition(() => setOn(true)), [])
    const fail = React.useCallback(() => React.startTransition(() => setFailed(true)), [])
    const gone = React.useCallback(() => React.startTransition(() => setLoader(false)), [])

    const toggleSound = () => {
        const v = vref.current
        if (!v) return
        v.muted = !v.muted
        if (!v.muted) v.play().catch(() => {})
        setMuted(v.muted)
    }

    // Anything that moves on its own for long gets a pause button.
    const togglePause = () => {
        const v = vref.current
        const next = !paused
        if (v) {
            if (next) v.pause()
            else v.play().catch(() => {})
        }
        setPaused(next)
    }

    const letters = Array.from(wordmark)
    const ready = still || on

    return (
        <>
            <Section tone="ink" id="top" className={"w2h" + (ready ? " on" : "")} css={HERO_CSS} label="World Media" style={style}>
                <div className={"w2h-card" + (src && sample ? " smp" : "")}>
                    <div className="w2h-stage">
                        {src ? (
                            <video
                                ref={vref}
                                className={sample ? "w2h-smp" : undefined}
                                src={sample ? undefined : src}
                                poster={posterSrc}
                                autoPlay={!still}
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-label="World Media globe animation"
                                // React passes a <source> error on to the video, and a skipped MP4 is not a failure.
                                onError={sample ? undefined : fail}
                            >
                                {sample ? <source src={SAMPLE + "globe-loop.mp4"} type={'video/mp4; codecs="avc1.640028"'} /> : null}
                                {sample ? <source src={SAMPLE + "globe-loop.webm"} type={'video/webm; codecs="vp9"'} onError={fail} /> : null}
                            </video>
                        ) : (
                            <>
                                <div className="w2h-glow" />
                                <DotGlobe still={still} paused={paused} />
                            </>
                        )}
                        {showName ? (
                            <div className="w2h-mark" aria-hidden="true" translate="no">
                                {letters.map((c, i) => (
                                    <span key={i} className="l" style={cssVars({ "--d": (0.25 + i * 0.045).toFixed(3) + "s" })}>
                                        {c === " " ? "\u00a0" : c}
                                    </span>
                                ))}
                                <span className="l dot" style={cssVars({ "--d": (0.3 + letters.length * 0.045).toFixed(3) + "s" })}>
                                    .
                                </span>
                            </div>
                        ) : null}
                        {isStatic && !video ? <div className="w2h-hint">{src ? "Sample video: add yours in the Video field" : "Video placeholder: add the globe video in the Video field"}</div> : null}
                    </div>
                    <div className="w2h-shade" />
                    <div className="w2h-ui">
                        {ready ? (
                            <Words as="h1" className="w2h-say" text={statement} delay={0.5} stagger={0.045} />
                        ) : (
                            <h1 className="w2h-say" style={{ opacity: 0 }}>
                                {statement.replace(/\*/g, "")}
                            </h1>
                        )}
                        <div className="w2h-meta">
                            <div className="w2h-btns">
                                {still ? null : (
                                    <button type="button" className="w2-pill w2h-snd w2h-pause" data-hue="paper" onClick={togglePause} aria-pressed={paused} aria-label={paused ? "Play the animation" : "Pause the animation"}>
                                        {paused ? (
                                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                                <path d="M2.5 1.5v9l8-4.5z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                                <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                                {video && !failed ? (
                                    <button type="button" className="w2-pill w2h-snd" data-hue="paper" onClick={toggleSound} aria-pressed={!muted}>
                                        <Roll>{muted ? "Sound on" : "Sound off"}</Roll>
                                    </button>
                                ) : null}
                            </div>
                            <div className="w2h-where">
                                <i aria-hidden="true" />
                                <span>{location}</span>
                                {time ? (
                                    <b>
                                        {time} {zone}
                                    </b>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            {withLoader && loader ? <Loader video={vref} onReveal={reveal} onGone={gone} /> : null}
        </>
    )
}

addPropertyControls(W2Hero, {
    video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "webm", "mov"] },
    poster: { type: ControlType.ResponsiveImage, title: "Poster" },
    samples: {
        type: ControlType.Boolean,
        title: "Sample video",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "NASA’s spinning Earth plays until you add your own video.",
    },
    nameOver: {
        type: ControlType.Boolean,
        title: "Name on video",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        description: "Turn off if your video already shows the name.",
    },
    wordmark: { type: ControlType.String, title: "Name", defaultValue: "world media" },
    statement: {
        type: ControlType.String,
        title: "Line",
        defaultValue: "A creator-first media agency. We put brands *where the conversation is.*",
        displayTextArea: true,
        description: "Words between *stars* are set in italic.",
    },
    location: { type: ControlType.String, title: "Location", defaultValue: "Delhi, India" },
    timeZone: { type: ControlType.String, title: "Time zone", defaultValue: "Asia/Kolkata" },
    zone: { type: ControlType.String, title: "Zone label", defaultValue: "IST" },
    intro: { type: ControlType.Boolean, title: "Loading screen", defaultValue: true, enabledTitle: "Show", disabledTitle: "Skip" },
})
