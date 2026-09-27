// User instructions: build the World Media website on world-class parameters while staying
// true to the pitch deck — its colours, hand-drawn arrow markers and cursive notes.
// Award-level but classy animation, classy-yet-fun fonts, image placeholders left blank.
// This file: a restrained cursor companion. The normal pointer stays; over anything marked
// with data-cursor (case files, the talk card, the closing headline) a small vermilion
// label follows it. Desktop pointers only. Place one tiny instance anywhere on the page.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, useIsStaticRenderer } from "framer"
import { motion, useSpring, useMotionValue } from "framer-motion"

type CursorProps = { style?: React.CSSProperties }

const CURSOR_CSS = `
.wmcu{position:fixed;left:0;top:0;z-index:2147483600;pointer-events:none;will-change:transform}
.wmcu-b{display:flex;align-items:center;justify-content:center;min-width:64px;height:64px;padding:0 16px;margin:-32px 0 0 -32px;border-radius:99px;background:#E9431B;color:#0F0F0F;
font-family:"DM Mono",ui-monospace,monospace;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;transform:translate(26px,26px) scale(0);transition:transform .5s cubic-bezier(.16,1,.3,1)}
.wmcu.on .wmcu-b{transform:translate(26px,26px) scale(1)}
@media (prefers-reduced-motion:reduce){.wmcu{display:none}}
`

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1
 * @framerIntrinsicHeight 1
 */
export default function WMCursor(props: CursorProps) {
    const isStatic = useIsStaticRenderer()
    const [mounted, setMounted] = React.useState(false)
    const [label, setLabel] = React.useState("")
    const x = useMotionValue(-200)
    const y = useMotionValue(-200)
    const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.45 })
    const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.45 })

    React.useEffect(() => {
        React.startTransition(() => setMounted(true))
    }, [])

    React.useEffect(() => {
        if (isStatic || typeof window === "undefined") return
        if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return
        let current = ""
        const onMove = (e: MouseEvent) => {
            x.set(e.clientX)
            y.set(e.clientY)
            const t = e.target as Element | null
            const host = t && t.closest ? t.closest("[data-cursor]") : null
            const next = host ? host.getAttribute("data-cursor") || "" : ""
            if (next !== current) {
                current = next
                React.startTransition(() => setLabel(next))
            }
        }
        const onLeave = () => {
            current = ""
            React.startTransition(() => setLabel(""))
        }
        window.addEventListener("mousemove", onMove, { passive: true })
        document.addEventListener("mouseleave", onLeave)
        return () => {
            window.removeEventListener("mousemove", onMove)
            document.removeEventListener("mouseleave", onLeave)
        }
    }, [isStatic, x, y])

    const bubble = (
        <motion.div className={"wmcu" + (label ? " on" : "")} style={{ x: sx, y: sy }} aria-hidden="true">
            <style>{CURSOR_CSS}</style>
            <div className="wmcu-b">{label || " "}</div>
        </motion.div>
    )

    return (
        <div style={{ position: "relative", width: 1, height: 1, ...props.style }} aria-hidden="true">
            {mounted && !isStatic && typeof document !== "undefined" ? createPortal(bubble, document.body) : null}
        </div>
    )
}

addPropertyControls(WMCursor, {})
