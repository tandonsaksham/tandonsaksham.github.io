// World Media, the globe showcase. One component for a whole page, in black and dark grey.
// The landing is the World Media globe: a wireframe globe with dotted continents (India in
// orange), routes flying out of Delhi, orbit rings, video tiles and the four pages in miniature,
// all turning with it. Scrolling spins the globe from city to city; at each one a page comes round,
// lifts off the globe and grows to full size, then sinks back as the globe turns on. After the
// globe comes the rest of the site: the enquiry form, careers and the footer. Place it on its own
// page, width 100%. Videos are placeholders until the real ones are added in the Globe media field.

import * as React from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

type Props = {
    media: string[]
    samples: boolean
    rest: boolean
    email: string
    phone: string
    endpoint: string
    style?: React.CSSProperties
}

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;500;600;700&family=Funnel+Sans:wght@400;500;600&display=swap"

const NO_MEDIA: string[] = []
/** Sample clips (Mixkit, free licence), streamed from Mixkit until the real videos are added. */
const CLIP = (id: number) => `https://assets.mixkit.co/videos/${id}/${id}-360.mp4`
const POSTER = (src: string) => {
    const m = src.match(/assets\.mixkit\.co\/videos\/(\d+)\//)
    return m ? `https://assets.mixkit.co/videos/${m[1]}/${m[1]}-thumb-360-0.jpg` : undefined
}

const D2R = Math.PI / 180
const cssVars = (o: Record<string, string | number>): React.CSSProperties => o as React.CSSProperties
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (v: number) => {
    const x = clamp(v)
    return x * x * (3 - 2 * x)
}
const easeInOut = (v: number) => {
    const x = clamp(v)
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
/** A soft ease for the globe's turns: it never moves faster than half as fast again as on average. */
const glide = (v: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(v))
const mod = (a: number, n: number) => ((a % n) + n) % n
const LAST = new WeakMap<object, Record<string, string>>()
/** Sets a style only when it changes, so a still moment costs the browser nothing. */
const put = (el: HTMLElement | SVGElement | null, k: string, v: string) => {
    if (!el) return
    let m = LAST.get(el)
    if (!m) LAST.set(el, (m = {}))
    if (m[k] === v) return
    m[k] = v
    ;(el.style as unknown as Record<string, string>)[k] = v
}
/** An angle brought into -180…180. */
const wrap = (a: number) => mod(a + 180, 360) - 180
const isVideo = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src)

/* ─────────────────────────────── Icons ─────────────────────────────── */

const ICONS: Record<string, string> = {
    play: "M8.5 5.8v12.4L18.6 12z",
    camera: "M3.5 8.5h3.2l1.8-2.8h7l1.8 2.8h3.2v10.5h-17z M12 16.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z",
    heart: "M12 19.5s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 7.6a3.9 3.9 0 0 1 7 2.3c0 5.3-7 9.6-7 9.6z",
    megaphone: "M3.5 10v4h3l7.5 4.5v-13L6.5 10z M17 9.2a4 4 0 0 1 0 5.6 M19.4 6.8a7.4 7.4 0 0 1 0 10.4",
    star: "M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z",
    film: "M4 5.5h16v13H4z M8 5.5v13 M16 5.5v13 M4 9.5h4 M4 14.5h4 M16 9.5h4 M16 14.5h4",
    eye: "M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z",
    arrow: "M5 12h14 M13 6l6 6-6 6",
    out: "M7 17L17 7 M9 7h8v8",
    down: "M12 5v14 M6 13l6 6 6-6",
    up: "M12 19V5 M6 11l6-6 6 6",
    plus: "M12 5v14 M5 12h14",
    check: "M5 12.5l4.5 4.5L19 7.5",
}

function Icon(p: { name: string; size?: number; width?: number }) {
    return (
        <svg width={p.size || 24} height={p.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.width || 1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICONS[p.name] || ICONS.arrow} />
        </svg>
    )
}

/** The small spinning globe of the menu: the meridians turn like a planet. */
function MiniGlobe(p: { size?: number }) {
    return (
        <svg className="w3-mg" width={p.size || 26} height={p.size || 26} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="17" ry="6.2" strokeOpacity=".55" />
            {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} className="m" cx="20" cy="20" rx="17" ry="17" style={cssVars({ "--gd": -2.25 * k + "s" })} />
            ))}
        </svg>
    )
}

/* ─────────────────────────────── The world ─────────────────────────────── */

// Land on a one-degree grid (Natural Earth, via world-atlas), row by row from the north pole:
// run lengths of sea, land, sea… written one character each. India is kept apart, on its own
// small grid, so it can glow in the signal colour.
const RUNS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
const LAND =
    ",,,,,,_0_0fc,_0v21lfp,_0qp4D29,_0l76d3Pz213m4F6,_0ml8Lu824_057,_0435513341d2Rw7_0i5,Z341g16a9Ox441_0h2,W48273252a9N_0n4wb,_71353221615mD_0e6ron8,_032m611pB_0d3ro,U8924415232213mz_0c3ow1544d3,T6191335124931mx_0b4d48Ma6,1dG41e53133g11hx_0b4c4121R31221d,jaBb743ket21L7A61_0n,ho4f3e3414545ad21rGfr4361_0v28,1_0_0_0iae23a251,4_0_0_0hb322p2,513_0_0_0c3263s1,017_0_0_0d55,61813_0a244318ebj7qa3b2_0_0f,829_07522197eaOb2_0_0v,f_0a824173h7Nc3_0_0u11,e_09g6n6Mc4_0_0a2329,fh2Qg8o3Md4_0_0779,i822aJh932_06d721_0W2453,n3gJfa14W293267_0Si3,m213iFgfU4c115511_0Rh6,k2qIbfU3b3145_0Si7,h2tK8iS4a2137_0Qj7,f1xN2nM323a1631_0Sj5,L13L3nL3337_0_0811d4,QK3nL2362_0_0b11d2,QM1m11P53_0_0b11e1,Q11_0331P24_0_0e12,R21V324211Q_0_0g22,VS1366M_0_0j21,U11V9111O_0_0g31,UX1121Wx133c3_0m42,U_Ye1g322b5_0l,UU22_d3e993_0n61,US-339342cc83_0l64,UR-c834ae65_0f94,UR-ba43945485_0d,UO_02a725315212l3_0517b2,UO_0298261333n4_033123c2,VM_039l33m5_0173c1,VL_048e2624n4_02124393,WK_0716ab162122_0m5375,XJ_0713dp_0l7248,YH_07hq_0l614312,-D_08jo_0n94,_B_08o62c_0n92,_21x_08q47314_0o81,_0112w_08t1_0C,_0212h4262_08G1f2_09,_0311gd2_07J1d3_08,_0231ee3_04K3d4_05,_0413cf211_01M2e7_,_0512cg1_02O2d117Y,_0513a_0kO2e33aQ21,_0a9_0jQ3k9N31,_0b8e113_Q3lal1n51,_0c8i2YS2kbh5g12,_0b973a2XR3jee6e,o1O954e3SR4hfc9c32,_0d925e611OS3ggbac31,_0gd_09T3diabdd2,_0ib_08U4ak9cec2,_0o9_04V39m6ibb2,_0p9_03W26p6ibb2,_0r6_04X14s5ibd2,_0u4_03Yw5i227f1,_0v2b1UX62p4j136d121,_0v3741523KX16p4i153c1,_0x221341aL_02p311h161c161,_0x42iL_r121h2n111,_0A12jK_u2h1m113,_0EjLYv2i2e261,_0DpHa5IP3d3,_0EpI1dGM232b5,_0EqZBO222a4,_0CsZAQ22277,_0CtXAS31159a1,_0BuXyU4692441,_0BvWxW459e1,_0AASxX3672393,_0AA11RvY54723b124,_0BFOt-482311141312a,_0AHNs_013g1d9,_0AKLr_022g1b1382112,_0AKLr_043p13a71,_0BJMq_056p9b1,_0CIMq_0c122111131d332,_0CHNr_0g141m2b2,_0DGNr_0L1,_0EEPq_0t191,_0EDPs81_0i651,_0FBQs81_0h662,_0FBPt72_0d21763,_0GAPs73_0bc63,0_0_0_0_0_0I,_0KwPq65_0ai15w1,_0LuQo85_0ao,_0LuRm95_09q,_0LuRm95_06vf1,_0LtTl85_04yg1,_0LsUm75_03A,_0LpXl94_03B,_0Ko-k93_03D,_0Kn_ic1_05D,_0Km_01i_0hE,_0Km_01i_0iD,_0Km_02g_0kD,_0Kl_04e_0lC,_0Jm_04e_0lC,_0Jl_06c_0nB,_0Kj_07b_0oa8i,_0Jj_089_0p9b21d,_0Je13_0a2_0w3g11e,_0Ig_0_0_06cn1,_0Ig_0_0_08ao1,_0Hh_0_0_08ap1,_0Ie_0_0_0d112s3,_0Ib_0_0_0L3,_0Hc_0_0_0M2,_0H9_0_0_0l3o211,_0Hb_0_0_0j3n3,_0I8_0_0_0m1n3,_0H9_0_0_0I3,_0G8_0_0_0J4,_0G8_0_0_0K2,_0G9,_0F9,_0F8_0_0b1,_0G6,_0G683,_0H4,_0H6,_0J6,_0M1,,,,,,,,_0W2,_0T1,_0R1_0_0_091,_0O3_0Q6I464f6,_0N3_0Ocm_01,_0N3_0Jqa_08,_0J225_0w62u7_0i,_0J316_0542a2I5_0p,_0G716O22_0c4_0A,_0O6M_0_0W,R222i53a435cJ_0_0X,Ia132711aCL_0_0U,y_0iK_0_0V,y_0dG_0_0_03,m_0kH_0_0_07,g34_0gt58_0_0_0e,i3a_09q8d_0_0_02,x_0b7668g_0_0_01,p_0ro_0_0_0d,r_0v4_0_0_0u,q_0_0_0_0_08,0517k_0_0_0_0_0a,v1,,,,"
const INDIA = "65,65,73,65,66,57,49c3,2d5135,2h17,3i15,3h42,0l22,2j,2h,5e,5c,5b,5a,59,66,66,75,75,84,84,83,91"
const INDIA_ROW = 55
const INDIA_COL = 248
const INDIA_COLS = 29

function grid(s: string, cols: number): Uint8Array[] {
    return s.split(",").map((row) => {
        const out = new Uint8Array(cols)
        let x = 0
        let land = false
        for (const ch of row) {
            const n = RUNS.indexOf(ch)
            if (land) out.fill(1, x, Math.min(cols, x + n))
            x += n
            land = !land
        }
        return out
    })
}

type Dots = { n: number; x: Float32Array; y: Float32Array; z: Float32Array; k: Uint8Array }
let DOTS: Dots | null = null
/**
 * The dots of the globe, spread evenly: the land close together (k 1, India k 2), the sea in a
 * wider, fainter grid (k 0) so the whole globe reads as one surface. Built once, on first use.
 */
function globeDots(): Dots {
    if (DOTS) return DOTS
    const land = grid(LAND, 360)
    const india = grid(INDIA, INDIA_COLS)
    const xs: number[] = []
    const ys: number[] = []
    const zs: number[] = []
    const ks: number[] = []
    const pass = (from: number, to: number, step: number, sea: boolean) => {
        for (let lat = from; lat > to; lat -= step) {
            const r = Math.min(179, Math.floor(90 - lat))
            const c = Math.cos(lat * D2R)
            const n = Math.max(1, Math.round((360 * c) / step))
            for (let i = 0; i < n; i++) {
                const lo = -180 + ((i + (sea ? 0 : 0.5)) * 360) / n
                const col = Math.min(359, Math.floor(lo + 180))
                const isLand = !!(land[r] && land[r][col])
                if (isLand === sea) continue
                const ir = r - INDIA_ROW
                const ic = col - INDIA_COL
                xs.push(c * Math.sin(lo * D2R))
                ys.push(-Math.sin(lat * D2R))
                zs.push(c * Math.cos(lo * D2R))
                ks.push(sea ? 0 : ir >= 0 && ir < india.length && ic >= 0 && ic < INDIA_COLS && india[ir][ic] ? 2 : 1)
            }
        }
    }
    pass(82, -57, 1.15, false)
    pass(78, -78, 2.6, true)
    DOTS = { n: xs.length, x: Float32Array.from(xs), y: Float32Array.from(ys), z: Float32Array.from(zs), k: Uint8Array.from(ks) }
    return DOTS
}

const CITY: Record<string, [number, number]> = {
    Delhi: [77.2, 28.6],
    Mumbai: [72.9, 19.1],
    Dubai: [55.3, 25.2],
    London: [-0.1, 51.5],
    "New York": [-74, 40.7],
    "São Paulo": [-46.6, -23.5],
    Singapore: [103.8, 1.35],
    Tokyo: [139.7, 35.7],
    Sydney: [151.2, -33.9],
    Lagos: [3.4, 6.5],
    "Los Angeles": [-118.2, 34],
    Moscow: [37.6, 55.8],
    Nairobi: [36.8, -1.3],
    "Mexico City": [-99.1, 19.4],
    Jakarta: [106.8, -6.2],
    Cairo: [31.2, 30],
    Beijing: [116.4, 39.9],
    "Buenos Aires": [-58.4, -34.6],
    Paris: [2.35, 48.9],
    Toronto: [-79.4, 43.7],
    "Cape Town": [18.4, -33.9],
}
const ROUTES: [string, string][] = [
    ["Delhi", "London"],
    ["Delhi", "New York"],
    ["Delhi", "Dubai"],
    ["Delhi", "Singapore"],
    ["Delhi", "Tokyo"],
    ["Delhi", "Sydney"],
    ["Delhi", "Lagos"],
    ["Delhi", "São Paulo"],
    ["London", "New York"],
    ["Tokyo", "Los Angeles"],
    ["Mumbai", "Nairobi"],
    ["Delhi", "Beijing"],
    ["Delhi", "Moscow"],
    ["Delhi", "Cape Town"],
    ["London", "Lagos"],
    ["New York", "São Paulo"],
    ["Los Angeles", "Mexico City"],
    ["Dubai", "Paris"],
    ["Singapore", "Sydney"],
    ["Tokyo", "Jakarta"],
    ["Toronto", "London"],
    ["Cairo", "Buenos Aires"],
]
/** Small tags that float over the globe, each pinned to a city. */
const BADGES: { at: string; text: string; live?: boolean; left?: boolean }[] = [
    { at: "Dubai", text: "Live · 1,248 watching", live: true, left: true },
    { at: "Beijing", text: "#collab", left: true },
    { at: "Mexico City", text: "@creator" },
    { at: "Moscow", text: "Podcast" },
    { at: "Cape Town", text: "UGC" },
]

/** A point on the globe as x, y, z on a sphere of radius 1 (before the globe turns). */
const onGlobe = (lon: number, lat: number): [number, number, number] => {
    const c = Math.cos(lat * D2R)
    return [c * Math.sin(lon * D2R), -Math.sin(lat * D2R), c * Math.cos(lon * D2R)]
}

/** The grid of the globe: meridians every 20°, parallels every 20°. */
function graticule(): Float32Array[] {
    const lines: Float32Array[] = []
    for (let lon = -180; lon < 180; lon += 20) {
        const pts: number[] = []
        for (let lat = -84; lat <= 84; lat += 4) pts.push(...onGlobe(lon, lat))
        lines.push(Float32Array.from(pts))
    }
    for (let lat = -60; lat <= 60; lat += 20) {
        const pts: number[] = []
        for (let lon = -180; lon <= 180; lon += 4) pts.push(...onGlobe(lon, lat))
        lines.push(Float32Array.from(pts))
    }
    return lines
}

/** The routes: great circles that lift off the globe in the middle, higher the further they go. */
function routes(): Float32Array[] {
    return ROUTES.map(([a, b]) => {
        const p = onGlobe(CITY[a][0], CITY[a][1])
        const q = onGlobe(CITY[b][0], CITY[b][1])
        const om = Math.acos(clamp(p[0] * q[0] + p[1] * q[1] + p[2] * q[2], -1, 1))
        const lift = 0.06 + 0.22 * (om / Math.PI)
        const pts: number[] = []
        const n = 44
        for (let i = 0; i <= n; i++) {
            const t = i / n
            const ka = Math.sin((1 - t) * om) / Math.sin(om)
            const kb = Math.sin(t * om) / Math.sin(om)
            const h = 1 + lift * Math.sin(Math.PI * t)
            pts.push((ka * p[0] + kb * q[0]) * h, (ka * p[1] + kb * q[1]) * h, (ka * p[2] + kb * q[2]) * h)
        }
        return Float32Array.from(pts)
    })
}

type Scene = {
    w: number
    h: number
    cx: number
    cy: number
    R: number
    P: number
    rot: number
    tilt: number
    wz: number
    lift: number
    intro: number
    time: number
}

type Kit = { dots: Dots; grid: Float32Array[]; routes: Float32Array[]; cities: [number, number, number][]; hot: number[] }

/** The orbit rings: radius (in globe radii), tilt, lean, how fast their moon goes round, brightness. */
const RINGS = [
    { r: 1.2, ax: 76, az: -14, sp: 0.00016, ph: 0.4, a: 0.3 },
    { r: 1.36, ax: 62, az: 26, sp: -0.00011, ph: 2.6, a: 0.2 },
    { r: 1.28, ax: 88, az: 52, sp: 0.00008, ph: 4.4, a: 0.1 },
]

/**
 * Draws the globe's moving lines and dots on the canvas: the grid, the land, the routes, the cities
 * and the orbit rings. The globe's glass body, its halo and the lines across the screen are CSS
 * underneath, drawn once. The canvas uses the same perspective as the CSS layers above it, so the
 * video tiles and the pages sit exactly on the globe.
 */
function drawScene(ctx: CanvasRenderingContext2D, sc: Scene, kit: Kit) {
    const { w, h, cx, cy, R, P, wz, time } = sc
    ctx.clearRect(0, 0, w, h)
    const rr = sc.rot * D2R
    const cr = Math.cos(rr)
    const sr = Math.sin(rr)
    const tt = sc.tilt * D2R
    const ct = Math.cos(tt)
    const st = Math.sin(tt)
    const D = P - wz
    const zc = (R * R) / D // a point on the globe is in view when it is nearer than this
    const rs = (R * P) / Math.sqrt(Math.max(1, D * D - R * R)) // the globe's outline on screen
    // Whether a point on screen lies over the globe (so a far-side point there is hidden by it).
    const behind = (x: number, y: number) => (x - cx) * (x - cx) + (y - cy) * (y - cy) < rs * rs
    const near = 1 - 0.65 * sc.lift
    const intro = sc.intro
    const o = { x: 0, y: 0, z: 0, s: 1 }
    // A point of the globe (x, y, z on the unit sphere, times k) onto the screen.
    const pr = (x: number, y: number, z: number, k: number) => {
        const x1 = (x * cr + z * sr) * k
        const z0 = (z * cr - x * sr) * k
        const y1 = y * k * ct - z0 * st
        const z1 = y * k * st + z0 * ct
        const s = P / (P - (z1 + wz))
        o.x = cx + x1 * s
        o.y = cy + y1 * s
        o.z = z1
        o.s = s
    }

    // The orbit rings. Their far halves go behind the globe, their near halves in front.
    const rings = RINGS.map((g) => {
        const ax = g.ax * D2R
        const az = g.az * D2R
        const yd = time * 0.00002 + g.ph
        // (1,0,0) and (0,0,1) tipped by ax round x, az round z, then turned yd round y
        const base = (vx: number, vy: number, vz: number): [number, number, number] => {
            const y1 = vy * Math.cos(ax) - vz * Math.sin(ax)
            const z1 = vy * Math.sin(ax) + vz * Math.cos(ax)
            const x2 = vx * Math.cos(az) - y1 * Math.sin(az)
            const y2 = vx * Math.sin(az) + y1 * Math.cos(az)
            return [x2 * Math.cos(yd) + z1 * Math.sin(yd), y2, -x2 * Math.sin(yd) + z1 * Math.cos(yd)]
        }
        return { g, u: base(1, 0, 0), v: base(0, 0, 1), m: g.ph + time * g.sp }
    })
    const ringPass = (front: boolean) => {
        for (const { g, u, v, m } of rings) {
            const rad = g.r * R
            ctx.beginPath()
            let pen = false
            for (let i = 0; i <= 128; i++) {
                const a = (i / 128) * Math.PI * 2
                const x = rad * (u[0] * Math.cos(a) + v[0] * Math.sin(a))
                const y = rad * (u[1] * Math.cos(a) + v[1] * Math.sin(a))
                const z = rad * (u[2] * Math.cos(a) + v[2] * Math.sin(a))
                const s = P / (P - (z + wz))
                if (z >= 0 !== front || (!front && behind(cx + x * s, cy + y * s))) {
                    pen = false
                    continue
                }
                if (pen) ctx.lineTo(cx + x * s, cy + y * s)
                else ctx.moveTo(cx + x * s, cy + y * s)
                pen = true
            }
            ctx.strokeStyle = `rgba(255,255,255,${g.a * (front ? 1 : 0.45) * near * intro})`
            ctx.lineWidth = 1
            ctx.stroke()
            // the ring's moon: a small polished ball
            const x = rad * (u[0] * Math.cos(m) + v[0] * Math.sin(m))
            const y = rad * (u[1] * Math.cos(m) + v[1] * Math.sin(m))
            const z = rad * (u[2] * Math.cos(m) + v[2] * Math.sin(m))
            const ms = P / (P - (z + wz))
            if (z >= 0 === front && (front || !behind(cx + x * ms, cy + y * ms))) {
                const s = ms
                const bx = cx + x * s
                const by = cy + y * s
                const br = Math.max(2.5, R * 0.018) * s
                const ball = ctx.createRadialGradient(bx - br * 0.35, by - br * 0.4, br * 0.1, bx, by, br)
                ball.addColorStop(0, `rgba(255,255,255,${near * intro})`)
                ball.addColorStop(0.55, `rgba(170,170,170,${near * intro})`)
                ball.addColorStop(1, `rgba(40,40,40,${near * intro})`)
                ctx.fillStyle = ball
                ctx.beginPath()
                ctx.arc(bx, by, br, 0, Math.PI * 2)
                ctx.fill()
            }
        }
    }
    ringPass(false)

    // The grid: the far side faintly, through the glassy globe, then the near side.
    const back = new Path2D()
    const front = new Path2D()
    for (const line of kit.grid) {
        let last = -1
        let px = 0
        let py = 0
        let pz = 0
        for (let i = 0; i < line.length; i += 3) {
            pr(line[i], line[i + 1], line[i + 2], R)
            if (i > 0) {
                const side = (pz + o.z) / 2 > zc ? 1 : 0
                const path = side ? front : back
                if (side !== last) path.moveTo(px, py)
                path.lineTo(o.x, o.y)
                last = side
            }
            px = o.x
            py = o.y
            pz = o.z
        }
    }
    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(255,255,255,${0.06 * intro})`
    ctx.stroke(back)

    ctx.strokeStyle = `rgba(255,255,255,${0.17 * intro})`
    ctx.stroke(front)

    // The dots: the land brighter where it faces you, India in the signal colour, the sea faint.
    const dots = kit.dots
    const size = clamp(R / 215, 1.1, 2.4)
    const shades = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]
    const hot = new Path2D()
    const sea = new Path2D()
    const show = intro * 1.25
    for (let i = 0; i < dots.n; i++) {
        const x = dots.x[i]
        const z = dots.z[i]
        const y0 = dots.y[i] * R
        const z0 = (z * cr - x * sr) * R
        const z1 = y0 * st + z0 * ct
        if (z1 < zc) continue
        const f = (z1 - zc) / (R - zc)
        if (f < 1 - show) continue
        const x1 = (x * cr + z * sr) * R
        const y1 = y0 * ct - z0 * st
        const s = P / (P - (z1 + wz))
        const k = dots.k[i]
        const d = (k ? size : size * 0.8) * s
        const px = cx + x1 * s - d / 2
        const py = cy + y1 * s - d / 2
        if (k === 2) hot.rect(px, py, d * 1.15, d * 1.15)
        else if (k === 1) shades[Math.min(3, Math.floor(f * 4))].rect(px, py, d, d)
        else sea.rect(px, py, d, d)
    }
    ctx.fillStyle = `rgba(243,241,236,${0.11 * intro})`
    ctx.fill(sea)
    const alphas = [0.24, 0.44, 0.68, 0.92]
    shades.forEach((p, i) => {
        ctx.fillStyle = `rgba(243,241,236,${alphas[i] * intro})`
        ctx.fill(p)
    })
    ctx.fillStyle = `rgba(234,86,40,${intro})`
    ctx.fill(hot)

    // The routes: a faint line each, and a bright streak that travels along it.
    if (intro > 0.4) {
        const ra = clamp((intro - 0.4) / 0.5)
        kit.routes.forEach((line, ri) => {
            const n = line.length / 3
            const xs: number[] = []
            const ys: number[] = []
            const vis: boolean[] = []
            for (let i = 0; i < n; i++) {
                pr(line[i * 3], line[i * 3 + 1], line[i * 3 + 2], R)
                xs.push(o.x)
                ys.push(o.y)
                const dx = o.x - cx
                const dy = o.y - cy
                vis.push(o.z > 0 || dx * dx + dy * dy > rs * rs)
            }
            const fromHome = ROUTES[ri][0] === "Delhi"
            const seg = (from: number, to: number, style: string, width: number) => {
                ctx.beginPath()
                let pen = false
                for (let i = Math.max(0, Math.floor(from)); i <= Math.min(n - 1, Math.ceil(to)); i++) {
                    if (!vis[i]) {
                        pen = false
                        continue
                    }
                    if (pen) ctx.lineTo(xs[i], ys[i])
                    else ctx.moveTo(xs[i], ys[i])
                    pen = true
                }
                ctx.strokeStyle = style
                ctx.lineWidth = width
                ctx.stroke()
            }
            seg(0, n - 1, `rgba(255,255,255,${0.13 * ra})`, 1)
            const cyc = mod(time / 3400 + ri * 0.37, 1.7)
            const head = cyc * (n - 1)
            if (head - n * 0.35 < n - 1) {
                seg(head - n * 0.35, head, fromHome ? `rgba(234,86,40,${0.85 * ra})` : `rgba(255,255,255,${0.6 * ra})`, 1.4)
                const hi = Math.min(n - 1, Math.round(head))
                if (head <= n - 1 && vis[hi]) {
                    ctx.fillStyle = `rgba(255,255,255,${ra})`
                    ctx.beginPath()
                    ctx.arc(xs[hi], ys[hi], 1.8, 0, Math.PI * 2)
                    ctx.fill()
                }
            }
        })
    }

    // The cities: a dot each, and a slow pulse where something is happening.
    kit.cities.forEach(([x, y, z], i) => {
        pr(x, y, z, R)
        if (o.z < zc) return
        const home = i === 0
        ctx.fillStyle = home ? `rgba(234,86,40,${intro})` : `rgba(255,255,255,${0.9 * intro})`
        ctx.beginPath()
        ctx.arc(o.x, o.y, (home ? 3.2 : 2) * o.s, 0, Math.PI * 2)
        ctx.fill()
        if (kit.hot.includes(i)) {
            const pp = mod(time / 2200 + i * 0.29, 1)
            ctx.strokeStyle = home ? `rgba(234,86,40,${0.6 * (1 - pp) * intro})` : `rgba(255,255,255,${0.45 * (1 - pp) * intro})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(o.x, o.y, (3 + 13 * pp) * o.s, 0, Math.PI * 2)
            ctx.stroke()
        }
    })

    ringPass(true)
}

/* ─────────────────────────────── Video tiles ─────────────────────────────── */

type TileDef = { lon: number; lat: number; ar: number; tag: string; page?: number; clip?: number }

/**
 * What sits on the globe, spread so nothing touches. The first four are the pages themselves, in
 * miniature, which grow out of the globe; the rest are video tiles, each with a sample clip.
 */
const TILES: TileDef[] = [
    { lon: 77.2, lat: 28.6, ar: 1.5, tag: "", page: 0 },
    { lon: -74, lat: 40.7, ar: 1.5, tag: "", page: 1 },
    { lon: 139.7, lat: 35.7, ar: 1.5, tag: "", page: 2 },
    { lon: -0.1, lat: 51.5, ar: 1.5, tag: "", page: 3 },
    { lon: 6, lat: 2, ar: 16 / 9, tag: "Live 0:15", clip: 14084 },
    { lon: 150, lat: -28, ar: 9 / 16, tag: "Reel", clip: 34487 },
    { lon: -52, lat: -16, ar: 9 / 16, tag: "UGC", clip: 40556 },
    { lon: -116, lat: 28, ar: 16 / 9, tag: "Shorts", clip: 40369 },
    { lon: 105, lat: -5, ar: 9 / 16, tag: "Reel 0:22", clip: 42319 },
    { lon: 44, lat: 6, ar: 16 / 9, tag: "GRWM", clip: 52057 },
    { lon: -36, lat: 20, ar: 16 / 9, tag: "Food", clip: 49231 },
    { lon: -90, lat: -5, ar: 16 / 9, tag: "Vlog", clip: 46352 },
    { lon: -160, lat: 10, ar: 16 / 9, tag: "Unboxing", clip: 4919 },
    { lon: 60, lat: -30, ar: 16 / 9, tag: "Podcast", clip: 2960 },
    { lon: -170, lat: 48, ar: 9 / 16, tag: "Shorts", clip: 44556 },
]
/** The reels on "The work", portrait sample clips until the real ones arrive. */
const REEL_CLIPS = [34486, 2963, 10428, 44555, 41289]

/** A tile's width and height for its shape, all tiles having about the same area. */
const tileSize = (R: number, ar: number) => {
    const a = R * 0.42
    return { w: a * Math.sqrt(ar), h: a / Math.sqrt(ar) }
}

function Media(p: { src: string; play: boolean; onShape?: (ar: number) => void; vref?: (el: HTMLVideoElement | null) => void }) {
    if (!p.src) return <b className="w3-blank" />
    if (isVideo(p.src))
        return (
            <video
                ref={p.vref}
                src={p.src}
                poster={POSTER(p.src)}
                autoPlay={p.play}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                    const v = e.currentTarget
                    if (p.onShape && v.videoWidth && v.videoHeight) p.onShape(v.videoWidth / v.videoHeight)
                }}
            />
        )
    return (
        <img
            src={p.src}
            alt=""
            decoding="async"
            draggable={false}
            onLoad={(e) => {
                const im = e.currentTarget
                if (p.onShape && im.naturalWidth && im.naturalHeight) p.onShape(im.naturalWidth / im.naturalHeight)
            }}
        />
    )
}

/* ─────────────────────────────── The pages ─────────────────────────────── */

type PageDef = { id: string; nav: string; title: string; tone: "char" | "signal" | "ink" | "paper" }

const PAGES: PageDef[] = [
    { id: "why", nav: "About", title: "The why", tone: "char" },
    { id: "services", nav: "Services", title: "What we do", tone: "signal" },
    { id: "work", nav: "Work", title: "The work", tone: "ink" },
    { id: "brands", nav: "Brands", title: "The brands", tone: "paper" },
]

const ORIGINALS = [
    "https://www.instagram.com/reel/DX3_tzGSK98/",
    "https://www.instagram.com/reel/DZqB10SyBlc/",
    "https://www.instagram.com/reel/DZKX-sKyx_N/",
    "https://www.instagram.com/reel/DYMk2X6Seet/",
    "https://www.instagram.com/reel/DaKzM9HSTlw/",
]

function Top(p: { n: number; title: string }) {
    return (
        <div className="w3-top">
            <b>{String(p.n).padStart(2, "0")}</b>
            {p.title}
        </div>
    )
}

// The headlines show from the start, so a page is recognisable as a miniature on the globe; the
// rest comes in once the page is up front.
function PageWhy() {
    return (
        <>
            <Top n={1} title="The why" />
            <h2 className="w3-big">
                People skip ads.
                <br />
                <em>They don’t skip people.</em>
            </h2>
            <ul className="w3-beliefs">
                {["Cast for trust", "Stories that stick", "Measured to the rupee"].map((h, i) => (
                    <li key={h} className="w3-r" style={cssVars({ "--d": 0.1 + i * 0.07 + "s" })}>
                        <i>{String(i + 1).padStart(2, "0")}</i>
                        <b>{h}</b>
                    </li>
                ))}
            </ul>
        </>
    )
}

function PageServices() {
    const list = [
        ["megaphone", "Influencer Marketing", "Our core"],
        ["film", "Production", ""],
        ["camera", "Studio", ""],
        ["star", "Talent Management", ""],
        ["heart", "Social Media", ""],
    ]
    return (
        <>
            <Top n={2} title="What we do" />
            <div className="w3-svc">
                <h2 className="w3-big">
                    Five things.
                    <br />
                    Done properly.
                </h2>
                <ol>
                    {list.map(([ic, h, tag], i) => (
                        <li key={h} className="w3-r" style={cssVars({ "--d": 0.06 + i * 0.06 + "s" })}>
                            <span className="w3-svi">
                                <Icon name={ic} size={20} />
                            </span>
                            <b>{h}</b>
                            {tag ? <i>{tag}</i> : null}
                        </li>
                    ))}
                </ol>
            </div>
        </>
    )
}

function PageWork(p: { samples: boolean }) {
    return (
        <>
            <Top n={3} title="The work" />
            <h2 className="w3-big">
                Reels people
                <br />
                <em>actually stopped for.</em>
            </h2>
            <div className="w3-reels">
                {ORIGINALS.map((href, i) => (
                    <a key={href} className="w3-reel w3-r" style={cssVars({ "--d": 0.08 + i * 0.06 + "s" })} href={href} target="_blank" rel="noreferrer" aria-label={"Watch World Media original " + (i + 1) + " on Instagram"}>
                        <div className="w3-rv">
                            {p.samples ? <video src={CLIP(REEL_CLIPS[i])} poster={POSTER(CLIP(REEL_CLIPS[i]))} muted loop playsInline preload="none" /> : null}
                            <span className="w3-views">
                                <Icon name="eye" size={13} />
                                [0.0]M
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </>
    )
}

function PageBrands() {
    const stats = [
        ["[00]M+", "Views"],
        ["[000]+", "Campaigns"],
        ["[00]+", "Creators"],
    ]
    return (
        <>
            <Top n={4} title="The brands" />
            <h2 className="w3-big">
                Big names.
                <br />
                <em>One orbit.</em>
            </h2>
            <div className="w3-stats">
                {stats.map(([n, l], i) => (
                    <div key={l} className="w3-stat w3-r" style={cssVars({ "--d": i * 0.07 + "s" })}>
                        <strong>{n}</strong>
                        <span>{l}</span>
                    </div>
                ))}
            </div>
            <div className="w3-logos">
                {["Coca-Cola", "Tinder", "OPPO", "Maaza"].map((b, i) => (
                    <span key={b} className="w3-logo w3-r" style={cssVars({ "--d": 0.22 + i * 0.05 + "s" })}>
                        <i>logo</i>
                        {b}
                    </span>
                ))}
                <span className="w3-logo w3-more w3-r" style={cssVars({ "--d": ".42s" })}>
                    + more
                </span>
            </div>
        </>
    )
}

function PageBody(p: { id: string; samples: boolean }) {
    if (p.id === "why") return <PageWhy />
    if (p.id === "services") return <PageServices />
    if (p.id === "work") return <PageWork samples={p.samples} />
    return <PageBrands />
}

/* ─────────────────────────────── After the globe ─────────────────────────────── */

const SERVICES = ["Influencer marketing", "Production", "Social media", "UGC", "Paid ads", "Celebrities & talent"]
const BUDGETS = ["Under ₹2L", "₹2L – 5L", "₹5L – 15L", "₹15L – 50L", "₹50L+"]
const FOLLOWERS = ["Under 10K", "10K – 100K", "100K – 1M", "1M+"]

function Chips(p: { items: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; label: string }) {
    return (
        <div className="w3-chips" role="group" aria-label={p.label}>
            {p.items.map((it) => {
                const on = p.value.includes(it)
                return (
                    <button
                        key={it}
                        type="button"
                        aria-pressed={on}
                        onClick={() => p.onChange(p.multi ? (on ? p.value.filter((v) => v !== it) : [...p.value, it]) : on ? [] : [it])}
                    >
                        {on ? <Icon name="check" size={14} width={2} /> : null}
                        {it}
                    </button>
                )
            })}
        </div>
    )
}

function Field(p: { name: string; label: string; type?: string; need?: boolean; area?: boolean; wide?: boolean; auto?: string; hint?: string }) {
    return (
        <label className={"w3-field" + (p.area || p.wide ? " w3-wide" : "")}>
            <span>
                {p.label}
                {p.need ? " *" : ""}
            </span>
            {p.area ? (
                <textarea name={p.name} required={p.need} rows={3} placeholder={p.hint} />
            ) : (
                <input name={p.name} type={p.type || "text"} required={p.need} autoComplete={p.auto} placeholder={p.hint} />
            )}
        </label>
    )
}

/** The enquiry form: one short column, for brands or for creators. */
function Contact(p: { email: string; endpoint: string; side: "brand" | "creator"; setSide: (s: "brand" | "creator") => void }) {
    const [services, setServices] = React.useState<string[]>([])
    const [budget, setBudget] = React.useState<string[]>([])
    const [followers, setFollowers] = React.useState<string[]>([])
    const [sent, setSent] = React.useState<"" | "sending" | "done" | "mail">("")
    const brand = p.side === "brand"

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const fields: [string, string][] = []
        data.forEach((v, k) => fields.push([k, String(v)]))
        if (brand) {
            fields.push(["Looking for", services.join(", ")])
            fields.push(["Monthly budget", budget.join(", ")])
        } else fields.push(["Followers", followers.join(", ")])
        const filled = fields.filter(([, v]) => v.trim())
        const subject = brand ? "New brief from the website" : "Creator application from the website"
        if (p.endpoint) {
            React.startTransition(() => setSent("sending"))
            try {
                const res = await fetch(p.endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: p.side, subject, ...Object.fromEntries(filled) }),
                })
                if (res.ok) {
                    React.startTransition(() => setSent("done"))
                    return
                }
            } catch {
                // fall through to email
            }
        }
        const body = filled.map(([k, v]) => k + ": " + v).join("\n")
        window.location.href = "mailto:" + p.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
        React.startTransition(() => setSent("mail"))
    }

    return (
        <section className="w3-sec w3-contact" id="w3-contact" aria-labelledby="w3-ct-h">
            <h2 className="w3-h2" id="w3-ct-h">
                Got a brand <em>worth talking about?</em>
            </h2>
            {sent === "done" || sent === "mail" ? (
                <div className="w3-thanks" role="status">
                    <span className="w3-tick">
                        <Icon name="check" size={28} width={2} />
                    </span>
                    <h3>{brand ? "Got it. Your brief is with the team." : "Welcome aboard (almost)."}</h3>
                    <p>{sent === "mail" ? "Your email app should have opened with everything filled in. Hit send and a real person replies within a day." : brand ? "A real person replies within a day." : "We’ll look through your work and reply within a week."}</p>
                    <button type="button" className="w3-link" onClick={() => setSent("")}>
                        Send another
                    </button>
                </div>
            ) : (
                <form className="w3-form" onSubmit={submit}>
                    <div className="w3-seg" role="group" aria-label="Who’s saying hello?">
                        <button type="button" aria-pressed={brand} onClick={() => p.setSide("brand")}>
                            I’m a brand
                        </button>
                        <button type="button" aria-pressed={!brand} onClick={() => p.setSide("creator")}>
                            I’m a creator
                        </button>
                    </div>
                    {brand ? (
                        <>
                            <div className="w3-q">
                                <span className="w3-lab">What do you need?</span>
                                <Chips items={SERVICES} value={services} onChange={setServices} multi label="What do you need?" />
                            </div>
                            <div className="w3-fields">
                                <Field name="Brand name" label="Brand name" need auto="organization" />
                                <Field name="Work email" label="Work email" type="email" need auto="email" />
                            </div>
                            <div className="w3-q">
                                <span className="w3-lab">Monthly budget</span>
                                <Chips items={BUDGETS} value={budget} onChange={setBudget} label="Monthly budget" />
                            </div>
                            <div className="w3-fields">
                                <Field name="Brief" label="Anything else?" area hint="What are you launching, and who should hear about it?" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w3-fields">
                                <Field name="Name" label="Your name" need auto="name" />
                                <Field name="Email" label="Email" type="email" need auto="email" />
                                <Field name="Handle" label="Instagram or YouTube handle" need wide hint="@" />
                            </div>
                            <div className="w3-q">
                                <span className="w3-lab">Followers</span>
                                <Chips items={FOLLOWERS} value={followers} onChange={setFollowers} label="Followers" />
                            </div>
                        </>
                    )}
                    <div className="w3-send">
                        <button type="submit" className="w3-btn" data-tone="signal" disabled={sent === "sending"}>
                            {sent === "sending" ? "Sending…" : brand ? "Send brief" : "Join the roster"} <Icon name="arrow" size={18} />
                        </button>
                        <span>A real person replies within a day.</span>
                    </div>
                </form>
            )}
        </section>
    )
}

const ROLES = [
    { role: "Influencer Marketing Manager", team: "Brand Partnerships", years: "4–7 years" },
    { role: "Influencer Marketing Executive", team: "Brand Partnerships", years: "1–3 years" },
    { role: "Talent Manager", team: "Creator Management", years: "2–5 years" },
    { role: "Social Media Executive", team: "Social & Content", years: "1–3 years" },
    { role: "Video Editor", team: "Production & Studio", years: "2–4 years" },
]

/** The open roles: one line each, which opens an email to apply. */
function Careers(p: { email: string }) {
    return (
        <section className="w3-sec w3-careers" id="w3-careers" aria-labelledby="w3-cr-h">
            <h2 className="w3-h2" id="w3-cr-h">
                Join the <em>crew.</em>
            </h2>
            <ul className="w3-roles">
                {ROLES.map((r) => (
                    <li key={r.role}>
                        <a href={"mailto:" + p.email + "?subject=" + encodeURIComponent("Application: " + r.role) + "&body=" + encodeURIComponent("Hi World Media,\n\nI’d like to apply for the " + r.role + " role. My CV (and portfolio or showreel) is attached.\n\n")}>
                            <b>{r.role}</b>
                            <span>
                                {r.team} · {r.years}
                            </span>
                            <i aria-hidden="true">
                                <Icon name="arrow" size={18} />
                            </i>
                        </a>
                    </li>
                ))}
            </ul>
            <p className="w3-note">
                Not on the list? Send your CV to <a href={"mailto:" + p.email}>{p.email}</a>.
            </p>
        </section>
    )
}

function Footer(p: { email: string; phone: string; go: (to: number | string) => void }) {
    return (
        <footer className="w3-foot">
            <div className="w3-fword" aria-hidden="true">
                world media<span>.</span>
            </div>
            <div className="w3-frow">
                <nav aria-label="Footer">
                    {PAGES.map((pg, i) => (
                        <button key={pg.id} type="button" onClick={() => p.go(i)}>
                            {pg.nav}
                        </button>
                    ))}
                    <button type="button" onClick={() => p.go("careers")}>
                        Careers
                    </button>
                </nav>
                <div>
                    <a href={"mailto:" + p.email}>{p.email}</a>
                    <a href={"tel:" + p.phone.replace(/[^+\d]/g, "")}>{p.phone}</a>
                    <a href="https://www.instagram.com/worldmedia.co.in" target="_blank" rel="noreferrer">
                        Instagram <Icon name="out" size={14} />
                    </a>
                </div>
            </div>
            <div className="w3-fbase">
                <span>© 2026 World Media · New Friends Colony, New Delhi</span>
                <button type="button" onClick={() => p.go(-1)}>
                    Back to the globe <Icon name="up" size={14} />
                </button>
            </div>
        </footer>
    )
}

/* ─────────────────────────────── Styles ─────────────────────────────── */

const CSS = `
.w3{--bg:#0A0A0A;--char:#161616;--line:rgba(255,255,255,.12);--text:#F3F1EC;--mute:rgba(243,241,236,.6);--signal:#EA5628;--paper:#F3F1EC;--ink:#0A0A0A;
--ease:cubic-bezier(.16,1,.3,1);--disp:"Funnel Display","Helvetica Neue",Arial,sans-serif;--sans:"Funnel Sans","Helvetica Neue",Arial,sans-serif;
position:relative;width:100%;background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color-scheme:dark}
.w3 *,.w3 *::before,.w3 *::after{box-sizing:border-box}
.w3 :where(h1,h2,h3,p,ul,ol,li,dl,dd,figure){margin:0;padding:0;list-style:none}
.w3 :where(a){color:inherit;text-decoration:none}
.w3 :where(button){font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.w3 :focus-visible{outline:2px solid var(--signal);outline-offset:3px;border-radius:8px}
.w3 ::selection{background:var(--signal);color:var(--ink)}
.w3-lab{font-size:15px;font-weight:500;line-height:1.3}

/* the stage: held in place while the track scrolls past */
.w3-track{position:relative}
.w3-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none;
background:radial-gradient(ellipse 70% 60% at 50% var(--gy),#181818 0%,#0E0E0E 48%,#080808 100%)}
.w3-stage.fix{position:absolute;top:0;left:0;width:100%}
.w3-still .w3-stage{position:relative;height:820px}
.w3-word{position:absolute;left:0;right:0;top:var(--gy);translate:0 -52%;text-align:center;font-family:var(--disp);font-weight:600;font-size:min(19vw,30vh);line-height:.8;letter-spacing:-.06em;color:rgba(255,255,255,.035);white-space:nowrap;pointer-events:none}
.w3-cv{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab}
.w3-cross{position:absolute;pointer-events:none;will-change:opacity}
.w3-cross.x{left:0;right:0;top:var(--gy);height:1px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.13),rgba(255,255,255,0))}
.w3-cross.y{top:0;bottom:0;left:50%;width:1px;background:linear-gradient(rgba(255,255,255,0),rgba(255,255,255,.13),rgba(255,255,255,0))}
.w3-halo,.w3-ball{position:absolute;left:50%;top:var(--gy);border-radius:50%;pointer-events:none;will-change:transform,opacity}
.w3-halo{width:calc(var(--R) * 3.2);height:calc(var(--R) * 3.2);margin:calc(var(--R) * -1.6) 0 0 calc(var(--R) * -1.6);background:radial-gradient(closest-side,rgba(255,255,255,.07) 57%,rgba(255,255,255,0))}
.w3-ball{width:calc(var(--R) * 2);height:calc(var(--R) * 2);margin:calc(var(--R) * -1) 0 0 calc(var(--R) * -1);
background:radial-gradient(farthest-corner at 32% 27%,rgba(40,40,40,.95),rgba(18,18,18,.93) 45%,rgba(8,8,8,.92) 75%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.w3-cv:active{cursor:grabbing}
.w3-3d{position:absolute;inset:0;perspective:var(--P);perspective-origin:50% var(--gy);transform-style:preserve-3d;pointer-events:none}
.w3-o{position:absolute;left:50%;top:var(--gy);width:0;height:0;transform-style:preserve-3d}
.w3-world,.w3-spin{position:absolute;left:0;top:0;transform-style:preserve-3d;will-change:transform}
.w3-tile{position:absolute;border-radius:10px;overflow:hidden;background:#1C1C1C;backface-visibility:hidden;-webkit-backface-visibility:hidden;
box-shadow:0 0 0 1px rgba(255,255,255,.16)}
.w3-tile img,.w3-tile video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
.w3-blank{position:absolute;inset:0;background:linear-gradient(135deg,#222,#141414)}
.w3-tag{position:absolute;left:6px;right:6px;bottom:6px;display:flex;align-items:center;gap:4px;font:600 11.5px/1 var(--sans);color:#fff}
.w3-tag i{display:grid;place-items:center;width:17px;height:17px;border-radius:50%;background:rgba(10,10,10,.72);flex:none}
.w3-tag span{padding:4px 6px;border-radius:99px;background:rgba(10,10,10,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.w3-tile[data-page] .w3-tag span{background:var(--signal);color:var(--ink)}
.w3-badges{position:absolute;inset:0;pointer-events:none}
.w3-bd{position:absolute;left:0;top:0;opacity:0;will-change:transform,opacity}
.w3-bd::before{content:"";position:absolute;left:0;bottom:0;width:1px;height:16px;background:rgba(255,255,255,.45);transform-origin:50% 100%;rotate:40deg}
.w3-bd span{position:absolute;left:9px;bottom:12px;display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:7px;white-space:nowrap;
background:rgba(16,16,16,.9);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);font:500 13px/1 var(--sans);color:var(--text)}
.w3-bd span i{width:6px;height:6px;border-radius:50%;background:#fff}
.w3-bd[data-live] span i{background:var(--signal);box-shadow:0 0 0 3px rgba(234,86,40,.25);animation:w3blink 1.6s ease-in-out infinite}
.w3-bd[data-left]::before{rotate:-40deg}
.w3-bd[data-left] span{left:auto;right:9px}
@keyframes w3blink{50%{opacity:.35}}
.w3-veil{position:absolute;inset:0;background:#080808;opacity:0;pointer-events:none}
.w3-pages{z-index:1}

/* the pages */
.w3-pn{position:absolute;left:calc(var(--W) / -2);top:calc(var(--H) / -2);width:var(--W);height:var(--H);border-radius:26px;overflow:hidden;background:var(--tone);
box-shadow:0 0 0 1px rgba(255,255,255,.12);backface-visibility:hidden;-webkit-backface-visibility:hidden;pointer-events:none;opacity:0}
.w3-pn.live{pointer-events:auto;box-shadow:0 0 0 1px rgba(255,255,255,.1),0 60px 120px -50px rgba(0,0,0,.9)}
.w3-pn[data-tone="char"],.w3-flatpn[data-tone="char"]{--tone:var(--char);color:var(--text);--hair:rgba(255,255,255,.14)}
.w3-pn[data-tone="ink"],.w3-flatpn[data-tone="ink"]{--tone:#0D0D0D;color:var(--text);--hair:rgba(255,255,255,.14)}
.w3-pn[data-tone="signal"],.w3-flatpn[data-tone="signal"]{--tone:var(--signal);color:var(--ink);--mute:rgba(10,10,10,.68);--hair:rgba(10,10,10,.2)}
.w3-pn[data-tone="paper"],.w3-flatpn[data-tone="paper"]{--tone:var(--paper);color:var(--ink);--mute:rgba(10,10,10,.58);--hair:rgba(10,10,10,.14)}
.w3-pg{position:absolute;inset:0;container-type:inline-size;padding:clamp(20px,3.2cqw,46px);display:flex;flex-direction:column;justify-content:space-between;gap:clamp(14px,2.4cqw,32px);overflow:auto;scrollbar-width:none}
.w3-top{display:flex;align-items:baseline;gap:12px;font-family:var(--disp);font-weight:600;font-size:clamp(17px,1.8cqw,24px);line-height:1;letter-spacing:-.025em}
.w3-top b{font-weight:700;color:var(--signal)}
.w3-pn[data-tone="signal"] .w3-top b,.w3-flatpn[data-tone="signal"] .w3-top b{color:#fff}
.w3-big{font-family:var(--disp);font-weight:700;font-size:clamp(42px,9.6cqw,150px);line-height:.86;letter-spacing:-.055em;text-wrap:balance}
.w3-big em,.w3-h2 em{font-style:normal;color:var(--signal)}
.w3-pn[data-tone="signal"] .w3-big em,.w3-flatpn[data-tone="signal"] .w3-big em{color:#fff}
.w3-r{opacity:0;translate:0 26px;transition:opacity .9s var(--ease),translate 1s var(--ease);transition-delay:var(--d,0s)}
.w3-pn.on .w3-r,.w3-still .w3-r{opacity:1;translate:0 0}
.w3-beliefs{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,1.6cqw,22px)}
.w3-beliefs li{display:flex;flex-direction:column;gap:10px;padding-top:16px;border-top:1px solid var(--hair)}
.w3-beliefs i{font-family:var(--disp);font-weight:700;font-size:clamp(18px,1.7cqw,24px);line-height:1;font-style:normal;color:var(--signal)}
.w3-beliefs b{font-family:var(--disp);font-weight:600;font-size:clamp(22px,2.8cqw,40px);line-height:1;letter-spacing:-.035em}
.w3-svc{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(20px,4cqw,64px);align-items:end;flex:1}
.w3-svc ol{display:flex;flex-direction:column}
.w3-svc li{display:flex;align-items:center;gap:16px;padding:clamp(10px,1.3cqw,18px) 0;border-top:1px solid var(--hair)}
.w3-svi{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--ink);color:var(--signal);flex:none}
.w3-svc b{font-family:var(--disp);font-weight:600;font-size:clamp(22px,2.7cqw,38px);letter-spacing:-.035em;line-height:1}
.w3-svc li i{font:600 12px/1 var(--sans);font-style:normal;padding:6px 10px;border-radius:99px;background:var(--ink);color:#fff}
.w3-reels{display:grid;grid-template-columns:repeat(5,1fr);gap:clamp(8px,1.2cqw,16px)}
.w3-reel{display:flex;flex-direction:column;gap:10px;min-width:0}
.w3-rv{position:relative;aspect-ratio:9/14;border-radius:16px;overflow:hidden;background:#1C1C1C;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.w3-rv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:scale .8s var(--ease)}
.w3-reel:hover .w3-rv video{scale:1.05}
.w3-views{position:absolute;left:8px;bottom:8px;display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:99px;background:rgba(10,10,10,.72);font:600 12px/1 var(--sans);color:#fff}
.w3-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(12px,2cqw,28px)}
.w3-stat{display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid var(--hair)}
.w3-stat strong{font-family:var(--disp);font-weight:700;font-size:clamp(40px,6.4cqw,96px);line-height:.9;letter-spacing:-.055em}
.w3-stat span{font-size:14.5px;color:var(--mute)}
.w3-logos{display:flex;flex-wrap:wrap;gap:8px}
.w3-logo{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:132px;height:64px;padding:0 20px;border-radius:14px;background:rgba(10,10,10,.06);font-family:var(--disp);font-weight:600;font-size:19px;letter-spacing:-.02em}
.w3-logo i{position:absolute;top:6px;right:9px;font:500 10.5px/1 var(--sans);font-style:normal;color:var(--mute)}
.w3-more{background:none;box-shadow:inset 0 0 0 1px var(--hair);color:var(--mute);font-weight:500}

/* the landing and the way out */
.w3-land,.w3-outro{position:absolute;inset:0;pointer-events:none;will-change:opacity,transform}
.w3-head{position:absolute;left:clamp(16px,2.6vw,40px);bottom:clamp(24px,4.5vh,52px);font-family:var(--disp);font-weight:700;font-size:clamp(48px,7.4vw,132px);line-height:.86;letter-spacing:-.055em}
.w3-head em{font-style:normal;color:var(--signal)}
.w3-side{position:absolute;right:clamp(16px,2.6vw,40px);bottom:clamp(28px,5vh,56px);display:flex;flex-direction:column;align-items:flex-end;gap:16px;max-width:320px;text-align:right;pointer-events:auto}
.w3-side p{font-size:15px;line-height:1.45;color:var(--mute)}
.w3-side div{display:flex;gap:6px}
.w3-outro{opacity:0;visibility:hidden}
.w3-pill{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:99px;font-weight:500;font-size:14.5px;transition:background-color .3s,color .3s,box-shadow .3s}
.w3-pill[data-tone="signal"]{background:var(--signal);color:var(--ink)}
.w3-pill[data-tone="signal"]:hover{background:#fff}
.w3-pill[data-tone="line"]{box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}
.w3-pill[data-tone="line"]:hover{background:#fff;color:var(--ink)}
.w3-pill[data-tone="paper"]{background:#fff;color:var(--ink)}

/* the dots on the right */
.w3-idx{position:absolute;right:clamp(12px,1.6vw,24px);top:50%;translate:0 -50%;display:flex;flex-direction:column;gap:4px;opacity:0;transition:opacity .5s;pointer-events:none}
.w3-idx.on{opacity:1}
.w3-idx.on button{pointer-events:auto}
.w3-idx button{display:flex;align-items:center;justify-content:flex-end;gap:10px;height:28px;color:rgba(255,255,255,.45)}
.w3-idx button span{font:500 13.5px/1 var(--sans);opacity:0;translate:6px 0;transition:opacity .3s,translate .3s var(--ease)}
.w3-idx button i{width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px currentColor;transition:background-color .3s,scale .3s}
.w3-idx button:hover span{opacity:1;translate:0 0}
.w3-idx button[aria-current]{color:#fff}
.w3-idx button[aria-current] i{background:var(--signal);box-shadow:none;scale:1.3}

/* the menu: it steps aside while you scroll down, and comes back when you scroll up or reach for it */
.w3-nav{position:fixed;top:0;left:0;right:0;z-index:2147482000;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:clamp(12px,1.4vw,20px) clamp(16px,2.6vw,40px);pointer-events:none;font-family:var(--sans);color:var(--text);transition:transform .55s var(--ease),opacity .4s}
.w3-nav.hide{transform:translateY(-130%);opacity:0}
.w3-nav:focus-within{transform:none;opacity:1}
.w3-still .w3-nav{position:absolute}
.w3-brand{display:inline-flex;align-items:center;gap:10px;padding:4px 16px 4px 4px;border-radius:99px;background:rgba(18,18,18,.9);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);pointer-events:auto;font-family:var(--disp);font-weight:600;font-size:21px;letter-spacing:-.04em}
.w3-brand .ic{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#fff;color:var(--ink)}
.w3-brand .ic svg.w3-prog{position:absolute;inset:-4px;width:52px;height:52px;rotate:-90deg}
.w3-brand b{font-weight:600}
.w3-brand b span{color:var(--signal)}
.w3-mg .m{transform-box:fill-box;transform-origin:50% 50%;animation:w3mer 9s linear infinite;animation-delay:var(--gd,0s)}
@keyframes w3mer{0%{transform:scaleX(1)}25%{transform:scaleX(0)}50%{transform:scaleX(-1)}75%{transform:scaleX(0)}100%{transform:scaleX(1)}}
.w3-links{display:flex;align-items:center;gap:4px;padding:4px;border-radius:99px;background:rgba(18,18,18,.9);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);pointer-events:auto}
.w3-links button{height:38px;padding:0 15px;border-radius:99px;font-size:14px;font-weight:500;transition:background-color .3s,color .3s}
.w3-links button:hover{background:rgba(255,255,255,.08)}
.w3-links button[aria-current]{background:#fff;color:var(--ink)}
.w3-links button.cta{background:var(--signal);color:var(--ink)}
.w3-links button.cta:hover{background:#fff}
.w3-menu{display:none;pointer-events:auto}
.w3-sheet{position:fixed;top:72px;left:12px;right:12px;z-index:2147482001;display:flex;flex-direction:column;padding:8px;border-radius:22px;background:#151515;color:var(--text);box-shadow:0 30px 80px -30px rgba(0,0,0,.8),inset 0 0 0 1px rgba(255,255,255,.08)}
.w3-sheet button{display:flex;justify-content:space-between;align-items:center;height:54px;padding:0 16px;border-radius:14px;font-family:var(--disp);font-weight:500;font-size:22px;letter-spacing:-.03em}
.w3-sheet button:hover{background:rgba(255,255,255,.06)}

/* after the globe: one calm column */
.w3-rest{position:relative;background:var(--bg);border-top:1px solid rgba(255,255,255,.06)}
.w3-sec{padding:clamp(80px,11vw,160px) clamp(16px,4vw,64px) 0;max-width:880px;margin:0 auto;scroll-margin-top:24px}
.w3-sec:last-of-type{padding-bottom:clamp(80px,11vw,160px)}
.w3-h2{font-family:var(--disp);font-weight:700;font-size:clamp(44px,6.4vw,96px);line-height:.9;letter-spacing:-.055em;text-wrap:balance;text-align:center;margin-bottom:clamp(36px,5vw,60px)}
.w3-form{display:flex;flex-direction:column;gap:32px}
.w3-seg{align-self:center;display:inline-flex;padding:4px;border-radius:99px;background:rgba(255,255,255,.06)}
.w3-seg button{height:44px;padding:0 22px;border-radius:99px;font-weight:500;font-size:15px;color:var(--mute);transition:background-color .3s,color .3s}
.w3-seg button[aria-pressed="true"]{background:#fff;color:var(--ink)}
.w3-q{display:flex;flex-direction:column;gap:12px}
.w3-q .w3-lab{color:var(--mute)}
.w3-chips{display:flex;flex-wrap:wrap;gap:6px}
.w3-chips button{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 16px;border-radius:99px;font-size:14.5px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);transition:background-color .3s,color .3s,box-shadow .3s}
.w3-chips button:hover{box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}
.w3-chips button[aria-pressed="true"]{background:var(--signal);color:var(--ink);box-shadow:none}
.w3-fields{display:grid;grid-template-columns:1fr 1fr;gap:24px 24px}
.w3-field{display:flex;flex-direction:column;gap:8px}
.w3-field.w3-wide{grid-column:1/-1}
.w3-field span{font-size:15px;font-weight:500;line-height:1.3;color:var(--mute)}
.w3-field input,.w3-field textarea{width:100%;font:inherit;font-size:17px;color:var(--text);background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.18);border-radius:0;padding:8px 0 10px;outline:none;transition:border-color .3s;resize:vertical}
.w3-field input:focus,.w3-field textarea:focus{border-color:var(--signal)}
.w3-field ::placeholder{color:rgba(243,241,236,.3)}
.w3-send{display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding-top:4px}
.w3-send span{font-size:13.5px;color:var(--mute)}
.w3-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;height:58px;padding:0 22px 0 26px;border-radius:99px;font-family:var(--disp);font-weight:600;font-size:18px;letter-spacing:-.02em;transition:background-color .3s,color .3s}
.w3-btn[data-tone="signal"]{background:var(--signal);color:var(--ink)}
.w3-btn[data-tone="signal"]:hover{background:#fff}
.w3-btn[data-tone="signal"]:disabled{opacity:.6;cursor:progress}
.w3-btn svg{transition:translate .4s var(--ease)}
.w3-btn:hover svg{translate:4px 0}
.w3-thanks{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.w3-thanks h3{font-family:var(--disp);font-weight:600;font-size:clamp(28px,3vw,40px);letter-spacing:-.04em;line-height:1}
.w3-thanks p{color:var(--mute);max-width:44ch;line-height:1.5}
.w3-tick{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:var(--signal);color:var(--ink)}
.w3-link{text-decoration:underline;text-underline-offset:4px;color:var(--mute)}
.w3-roles li{border-top:1px solid var(--line)}
.w3-roles li:last-child{border-bottom:1px solid var(--line)}
.w3-roles a{display:grid;grid-template-columns:1fr auto;column-gap:16px;row-gap:4px;align-items:center;padding:22px 0}
.w3-roles b{font-family:var(--disp);font-weight:600;font-size:clamp(21px,2.3vw,30px);letter-spacing:-.03em;line-height:1.1;transition:color .3s}
.w3-roles span{grid-row:2;font-size:14px;color:var(--mute)}
.w3-roles i{grid-row:1/span 2;grid-column:2;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);transition:background-color .3s,color .3s,box-shadow .3s,rotate .4s var(--ease)}
.w3-roles a:hover b{color:var(--signal)}
.w3-roles a:hover i{background:var(--signal);color:var(--ink);box-shadow:none;rotate:-45deg}
.w3-note{margin-top:24px;text-align:center;font-size:14.5px;line-height:1.5;color:var(--mute)}
.w3-note a{color:var(--text);text-decoration:underline;text-underline-offset:4px;text-decoration-color:rgba(255,255,255,.3)}
.w3-note a:hover{text-decoration-color:currentColor}
.w3-foot{position:relative;overflow:hidden;padding:clamp(48px,6vw,80px) clamp(16px,4vw,64px) 28px;background:#060606;border-top:1px solid rgba(255,255,255,.06)}
.w3-fword{max-width:1440px;margin:0 auto;font-family:var(--disp);font-weight:700;font-size:clamp(60px,15.5vw,236px);line-height:.8;letter-spacing:-.065em;white-space:nowrap}
.w3-fword span{color:var(--signal)}
.w3-frow{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px 40px;max-width:1440px;margin:clamp(32px,4vw,52px) auto 0;padding-top:24px;border-top:1px solid var(--line)}
.w3-frow>*{display:flex;flex-wrap:wrap;gap:8px 24px;font-size:15px}
.w3-frow a,.w3-frow button{display:inline-flex;align-items:center;gap:6px;transition:color .3s}
.w3-frow a:hover,.w3-frow button:hover{color:var(--signal)}
.w3-fbase{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;max-width:1440px;margin:28px auto 0;font-size:13.5px;line-height:1.4;color:var(--mute)}
.w3-fbase button{display:inline-flex;align-items:center;gap:6px;font:inherit}
.w3-fbase button:hover{color:var(--text)}

@media (max-width:820px){
.w3-links{display:none}.w3-menu{display:inline-flex}
.w3-head{left:16px;right:16px;bottom:96px;font-size:clamp(46px,13.5vw,76px)}
.w3-side{left:16px;right:16px;bottom:22px;align-items:stretch;text-align:left;max-width:none}
.w3-side p{display:none}.w3-side div>*{flex:1;justify-content:center}
.w3-idx button span{display:none}
.w3-bd span{font-size:11.5px;padding:5px 8px}
.w3-fields{grid-template-columns:1fr}
.w3-send .w3-btn{flex:1}
.w3-frow{flex-direction:column}
}
@container (max-width:760px){
.w3-svc{grid-template-columns:1fr}
.w3-beliefs{grid-template-columns:1fr;gap:10px}.w3-beliefs li{padding-top:10px;flex-direction:row;align-items:baseline;gap:12px}
.w3-stats{grid-template-columns:1fr;gap:6px}.w3-stat{flex-direction:row;align-items:baseline;gap:14px;padding-top:10px}.w3-stat strong{font-size:44px}
.w3-logo{min-width:0;height:48px;padding:0 14px;font-size:15px}
.w3-svi{width:34px;height:34px}.w3-svi svg{width:16px;height:16px}.w3-svc li{gap:12px;padding:9px 0}
.w3-reels{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -20px;padding:0 20px;scroll-padding:0 20px;scrollbar-width:none}
.w3-reel{flex:0 0 46%;scroll-snap-align:start}
}
.w3-flat{display:flex;flex-direction:column;gap:14px;padding:14px}
.w3-flatpn{position:relative;border-radius:26px;overflow:hidden;background:var(--tone);min-height:min(780px,92vh)}
.w3-flatpn .w3-pg{position:relative;left:auto;top:auto;translate:none;width:auto;height:auto;min-height:inherit;overflow:visible}
@media (prefers-reduced-motion:reduce){.w3 *{transition:none!important;animation:none!important}}
`

/* ─────────────────────────────── The motion ─────────────────────────────── */

// The scroll, in screens: a moment on the landing, then for each page a turn of the globe and
// a hold with the page up front, then a last turn back to the globe before the rest of the site.
const N = PAGES.length
const REST = 0.12 // the landing at rest
const TURN = 1.4 // a turn of the globe from one city to the next
const HOLD = 1.4 // a page held up front
const OUT = 0.9 // the globe again, spinning on its own, before the rest of the site
const TILT = -16 // the globe leans towards you, so you see a little of the north
const holdStart = (k: number) => REST + TURN + k * (HOLD + TURN)
const holdEnd = (k: number) => holdStart(k) + HOLD
const TOTAL = holdEnd(N - 1) + TURN + OUT
const PAGE_TILES = PAGES.map((_, k) => TILES.findIndex((t) => t.page === k))
const VIDEO_TILES = TILES.map((t, i) => (t.page === undefined ? i : -1)).filter((i) => i >= 0)
const PAGE_LON = PAGE_TILES.map((i) => TILES[i].lon)
/** How far the globe turns between two pages: from one page's city to the next one's, and from the last back home to Delhi. */
const GAP = PAGE_LON.map((lon, k) => mod(lon - PAGE_LON[(k + 1) % N], 360))

type Frame = { rot: number; free: 0 | 1 | 2; lifts: number[] }

/** Where the globe is turned to, and how far each page is lifted off it, at scroll u. */
function motion(u: number, spin: number, spin2: number): Frame {
    const lifts = PAGES.map((_, k) => {
        const up = smooth((u - (holdStart(k) - 0.45)) / 0.85)
        const down = 1 - smooth((u - (holdEnd(k) - 0.4)) / 0.85)
        return Math.max(0, Math.min(up, down))
    })
    if (u < holdStart(0)) {
        // From the landing into the first page: whatever way the globe faces, it turns at least a
        // third of a turn forward to India.
        const e = glide((u - REST) / TURN)
        const w0 = mod(spin + PAGE_LON[0] + 120, 360) - 480
        return { rot: -PAGE_LON[0] + w0 * (1 - e), free: e <= 0 ? 1 : 0, lifts }
    }
    const last = holdEnd(N - 1)
    if (u >= last) {
        const e = glide((u - last) / TURN)
        return { rot: -PAGE_LON[N - 1] + GAP[N - 1] * e + wrap(spin2) * e, free: e >= 1 ? 2 : 0, lifts }
    }
    const k = Math.min(N - 1, Math.floor((u - holdStart(0)) / (HOLD + TURN)))
    const into = u - holdStart(k)
    if (into <= HOLD) return { rot: -PAGE_LON[k], free: 0, lifts }
    return { rot: -PAGE_LON[k] + GAP[k] * glide((into - HOLD) / TURN), free: 0, lifts }
}

/** The element whose scrolling moves this page: a scrolling box around it, or the window. */
function scrollBox(el: HTMLElement | null): HTMLElement | null {
    let n = el ? el.parentElement : null
    while (n && n !== document.body && n !== document.documentElement) {
        const o = getComputedStyle(n).overflowY
        if ((o === "auto" || o === "scroll" || o === "overlay") && n.scrollHeight > n.clientHeight + 1) return n
        n = n.parentElement
    }
    return null
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W3Globe(props: Props) {
    const { media = NO_MEDIA, samples = true, rest = true, email = "social@worldmedia.co.in", phone = "+91 88000 40301", endpoint = "", style } = props
    const isStatic = useIsStaticRenderer()
    const [reduce, setReduce] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [side, setSide] = React.useState<"brand" | "creator">("brand")
    const [size, setSize] = React.useState({ w: 1440, h: 900 })
    const [shapes, setShapes] = React.useState<number[]>(() => TILES.map((t) => t.ar))

    const rootRef = React.useRef<HTMLDivElement>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)
    const stageRef = React.useRef<HTMLDivElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const haloRef = React.useRef<HTMLDivElement>(null)
    const ballRef = React.useRef<HTMLDivElement>(null)
    const crossX = React.useRef<HTMLDivElement>(null)
    const crossY = React.useRef<HTMLDivElement>(null)
    const worldRef = React.useRef<HTMLDivElement>(null)
    const spinRef = React.useRef<HTMLDivElement>(null)
    const veilRef = React.useRef<HTMLDivElement>(null)
    const landRef = React.useRef<HTMLDivElement>(null)
    const outroRef = React.useRef<HTMLDivElement>(null)
    const wordRef = React.useRef<HTMLDivElement>(null)
    const idxRef = React.useRef<HTMLDivElement>(null)
    const navRef = React.useRef<HTMLElement>(null)
    const progRef = React.useRef<SVGCircleElement>(null)
    const tileEls = React.useRef<(HTMLDivElement | null)[]>([])
    const tileVids = React.useRef<(HTMLVideoElement | null)[]>([])
    const badgeEls = React.useRef<(HTMLDivElement | null)[]>([])
    const panels = React.useRef<(HTMLDivElement | null)[]>([])
    const bodies = React.useRef<(HTMLDivElement | null)[]>([])
    const navBtns = React.useRef<(HTMLButtonElement | null)[]>([])
    const idxBtns = React.useRef<(HTMLButtonElement | null)[]>([])
    const openRef = React.useRef(false)
    openRef.current = open

    const still = isStatic || reduce

    // Whether the visitor prefers less motion.
    React.useEffect(() => {
        if (isStatic) return
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        const onMq = () => React.startTransition(() => setReduce(mq.matches))
        onMq()
        React.startTransition(() => setMounted(true))
        mq.addEventListener("change", onMq)
        return () => mq.removeEventListener("change", onMq)
    }, [isStatic])
    // The stage's size: the globe, the pages and the scroll are all measured from it.
    React.useEffect(() => {
        const st = stageRef.current
        if (!st || typeof ResizeObserver === "undefined") return
        const read = () => {
            const w = st.clientWidth
            const h = st.clientHeight
            if (w && h) React.startTransition(() => setSize((o) => (o.w === w && o.h === h ? o : { w, h })))
        }
        read()
        const ro = new ResizeObserver(read)
        ro.observe(st)
        return () => ro.disconnect()
    }, [])

    const phoneW = size.w <= 820
    const R = Math.round(phoneW ? Math.min(size.w * 0.4, size.h * 0.27) : Math.min(size.h * 0.33, size.w * 0.26))
    const P = phoneW ? 1100 : 1700
    const gyF = phoneW ? 0.4 : 0.47
    const W = phoneW ? size.w - 16 : Math.min(1240, size.w - 2 * Math.max(56, size.w * 0.04))
    const navH = phoneW ? 68 : 84
    const H = phoneW ? Math.min(size.h - navH - 8, 760) : Math.min(820, size.h - navH - 16)
    // How far a page drops from the globe's centre to sit just under the menu.
    const dy = Math.round(navH + (size.h - navH - H) / 2 + H / 2 - size.h * gyF)

    const key = (media || NO_MEDIA).filter(Boolean).join("\n")
    const items = React.useMemo(() => (key ? key.split("\n") : NO_MEDIA), [key])
    const srcOf = (i: number) => {
        const v = VIDEO_TILES.indexOf(i)
        if (v >= 0 && items[v]) return items[v]
        const c = TILES[i].clip
        return samples && c ? CLIP(c) : ""
    }
    const setShape = React.useCallback((i: number, ar: number) => {
        const v = clamp(ar, 0.4, 2.4)
        React.startTransition(() => setShapes((o) => (Math.abs(o[i] - v) < 0.01 ? o : o.map((x, j) => (j === i ? v : x)))))
    }, [])
    // A new set of media starts again from the tiles' own shapes, until each video says its own.
    React.useEffect(() => {
        React.startTransition(() => setShapes((o) => (o.every((v, i) => v === TILES[i].ar) ? o : TILES.map((t) => t.ar))))
    }, [items])

    // The motion: one loop reads the scroll and moves the globe, the tiles, the pages and the menu.
    const state = React.useRef({ cur: 0, spin: -110, spin2: 0, vel: 0, drag: 0 as 0 | 1 | 2, px: 0, last: 0, t0: 0, onIdx: -2, py: 0, tilt: 0, fix: 0 as 0 | 1 | 2, free: 1 as 0 | 1 | 2 })
    React.useEffect(() => {
        const cv = canvasRef.current
        const track = trackRef.current
        const stage = stageRef.current
        if (!cv || !track || !stage) return
        if (!still && !mounted) return
        const ctx = cv.getContext("2d")
        if (!ctx) return
        const kit: Kit = {
            dots: globeDots(),
            grid: graticule(),
            routes: routes(),
            cities: Object.values(CITY).map(([lon, lat]) => onGlobe(lon, lat)),
            hot: [0, ...BADGES.map((b) => Object.keys(CITY).indexOf(b.at))],
        }
        // Sharp, but never more than about 2.4 million pixels a frame, however big the screen.
        const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2400000 / (size.w * size.h))))
        cv.width = Math.round(size.w * dpr)
        cv.height = Math.round(size.h * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        const cx = size.w / 2
        const cy = size.h * gyF
        const s = state.current
        // How small a page is while it rides the globe: the size of a tile.
        const mini = tileSize(R, W / H).w / W
        const badgeAt = BADGES.map((b) => onGlobe(CITY[b.at][0], CITY[b.at][1]))
        const tileAt = TILES.map((t) => onGlobe(t.lon, t.lat))

        if (still) {
            drawScene(ctx, { w: size.w, h: size.h, cx, cy, R, P, rot: -PAGE_LON[0] + 18, tilt: TILT, wz: 0, lift: 0, intro: 1, time: 0 }, kit)
            return
        }

        let raf = 0
        let visible = true
        let lastLift = -1
        const frame = (now: number) => {
            raf = 0
            const dt = s.last ? Math.min(64, now - s.last) : 16.7
            s.last = now
            if (!s.t0) s.t0 = now
            const vh = size.h
            const rect = track.getBoundingClientRect()
            const target = clamp(-rect.top / vh, 0, TOTAL)
            s.cur += (target - s.cur) * (1 - Math.pow(0.9, dt / 16.7))
            if (Math.abs(target - s.cur) < 0.0005) s.cur = target
            const u = s.cur

            // If the page around us stops the stage from staying put, hold it in place ourselves: pinned
            // to the window while the track passes, or, where the page does not allow that, moved.
            if (!s.fix && rect.top < -4 && rect.bottom > vh + 4 && Math.abs(stage.getBoundingClientRect().top) > 2) {
                s.fix = 1
                stage.classList.add("fix")
            }
            if (s.fix === 1) {
                const inside = rect.top <= 0 && rect.bottom >= vh
                put(stage, "position", inside ? "fixed" : "absolute")
                put(stage, "top", inside || rect.top > 0 ? "0px" : rect.height - vh + "px")
                put(stage, "left", inside ? rect.left + "px" : "0px")
                put(stage, "width", rect.width + "px")
                if (inside && Math.abs(stage.getBoundingClientRect().top) > 2) {
                    s.fix = 2
                    put(stage, "position", "absolute")
                    put(stage, "top", "0px")
                    put(stage, "left", "0px")
                }
            }
            if (s.fix === 2) put(stage, "transform", `translateY(${clamp(-rect.top, 0, rect.height - vh).toFixed(1)}px)`)

            // The globe spins on its own and can be dragged while it is free: on the landing and at the end.
            const m0 = motion(u, s.spin, s.spin2)
            s.free = m0.free
            if (m0.free) {
                const key = m0.free === 1 ? "spin" : "spin2"
                if (s.drag !== m0.free) {
                    s[key] += s.vel
                    s.vel *= Math.pow(0.93, dt / 16.7)
                }
                s[key] += dt * 0.006
            } else s.vel = 0
            const m = motion(u, s.spin, s.spin2)
            const rot = m.rot
            const lift = Math.max(...m.lifts)
            const wz = -900 * lift
            s.tilt += (s.py * 5 * (1 - lift) - s.tilt) * (1 - Math.pow(0.9, dt / 16.7))
            const tilt = TILT + s.tilt
            const intro = smooth((now - s.t0) / 1900)

            if (lift < 0.995 || lastLift < 0.995) drawScene(ctx, { w: size.w, h: size.h, cx, cy, R, P, rot, tilt, wz, lift, intro, time: now }, kit)
            lastLift = lift
            put(worldRef.current, "transform", `translateZ(${wz.toFixed(1)}px)`)
            // The glass body and its halo shrink with the globe as it sinks back.
            const D = P - wz
            const ballScale = (P / Math.sqrt(Math.max(1, D * D - R * R))).toFixed(4)
            put(ballRef.current, "transform", `scale(${ballScale})`)
            put(haloRef.current, "transform", `scale(${ballScale})`)
            put(haloRef.current, "opacity", intro.toFixed(3))
            const near = ((1 - 0.65 * lift) * intro).toFixed(3)
            put(crossX.current, "opacity", near)
            put(crossY.current, "opacity", near)
            put(spinRef.current, "transform", `rotateX(${tilt.toFixed(2)}deg) rotateY(${rot.toFixed(2)}deg)`)
            put(veilRef.current, "opacity", (0.74 * lift).toFixed(3))

            // How squarely a point of the globe faces you: 1 at the front, 0 at the edge.
            const cr = Math.cos(rot * D2R)
            const sr = Math.sin(rot * D2R)
            const ct = Math.cos(tilt * D2R)
            const st = Math.sin(tilt * D2R)
            const facing = (p: [number, number, number]) => p[1] * st + (p[2] * cr - p[0] * sr) * ct

            // The tiles fade as they near the globe's edge, and their videos rest while out of sight.
            tileEls.current.forEach((el, i) => {
                if (!el) return
                const f = facing(tileAt[i])
                put(el, "opacity", (smooth((f + 0.05) / 0.4) * smooth(intro * 1.6 - 0.5 - i * 0.06)).toFixed(3))
                const v = tileVids.current[i]
                if (v) {
                    if (f < -0.2 && !v.paused) v.pause()
                    else if (f > -0.1 && v.paused) v.play().catch(() => {})
                }
            })

            // The tags float over their cities, always facing you.
            badgeAt.forEach((p, i) => {
                const el = badgeEls.current[i]
                if (!el) return
                const x0 = (p[0] * cr + p[2] * sr) * R
                const z0 = (p[2] * cr - p[0] * sr) * R
                const y1 = p[1] * R * ct - z0 * st
                const z1 = p[1] * R * st + z0 * ct
                const sc = P / (P - (z1 + wz))
                const a = smooth((z1 / R - 0.15) / 0.3) * (1 - lift) * smooth((intro - 0.6) / 0.4)
                put(el, "opacity", a.toFixed(3))
                put(el, "transform", `translate3d(${(cx + x0 * sc).toFixed(1)}px,${(cy + y1 * sc).toFixed(1)}px,0)`)
            })

            // The landing steps back as the globe starts to turn; the way out comes in at the end.
            const fade = smooth((u - 0.04) / 0.4)
            if (landRef.current) {
                put(landRef.current, "opacity", (1 - fade).toFixed(3))
                put(landRef.current, "transform", `translateY(${(fade * 30).toFixed(1)}px)`)
                put(landRef.current, "visibility", fade > 0.99 ? "hidden" : "visible")
            }
            const out = smooth((u - (holdEnd(N - 1) + TURN * 0.55)) / 0.5)
            if (outroRef.current) {
                put(outroRef.current, "opacity", out.toFixed(3))
                put(outroRef.current, "transform", `translateY(${((1 - out) * 30).toFixed(1)}px)`)
                put(outroRef.current, "visibility", out < 0.01 ? "hidden" : "visible")
            }
            put(wordRef.current, "opacity", (1 - lift).toFixed(3))

            // The pages: each rides the globe as a miniature of itself, comes round to the front,
            // then lifts straight towards you and grows to full size while the globe sinks back.
            // Only its transform and opacity change, so the browser never lays it out again.
            PAGES.forEach((_, k) => {
                const el = panels.current[k]
                if (!el) return
                const ti = PAGE_TILES[k]
                const t = TILES[ti]
                const lk = m.lifts[k]
                const l = lk > 0.999 ? 1 : lk
                const theta = wrap(rot + t.lon)
                const f = facing(tileAt[ti])
                const seen = lk > 0 ? 1 : smooth((f + 0.05) / 0.4) * smooth(intro * 1.6 - 0.5 - ti * 0.06)
                put(el, "opacity", seen.toFixed(3))
                put(el, "visibility", seen > 0.001 ? "visible" : "hidden")
                const sc = mini + (1 - mini) * l
                put(
                    el,
                    "transform",
                    l === 1 && Math.abs(theta) < 0.01
                        ? `translateY(${dy}px)`
                        : `translateY(${(dy * l).toFixed(1)}px) translateZ(${(lk > 0 ? 0 : wz).toFixed(1)}px) rotateX(${(tilt * (1 - l)).toFixed(2)}deg) rotateY(${theta.toFixed(2)}deg) rotateX(${(t.lat * (1 - l)).toFixed(2)}deg) translateZ(${(R * 1.02 * (1 - l)).toFixed(1)}px) scale(${sc.toFixed(4)})`
                )
                const on = l > 0.85
                if (on !== el.classList.contains("on")) {
                    el.classList.toggle("on", on)
                    // The page's own videos play only while it is open.
                    el.querySelectorAll("video").forEach((v) => {
                        if (on) v.play().catch(() => {})
                        else v.pause()
                    })
                }
                el.classList.toggle("live", l > 0.95)
            })

            // The menu and the dots follow the page in front.
            let cur = -1
            m.lifts.forEach((v, k) => {
                if (v > 0.5) cur = k
            })
            if (cur !== s.onIdx) {
                s.onIdx = cur
                navBtns.current.forEach((b, i) => b && (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")))
                idxBtns.current.forEach((b, i) => b && (i === cur ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")))
            }
            if (idxRef.current) idxRef.current.classList.toggle("on", u > REST + TURN * 0.5 && u < holdEnd(N - 1) + TURN * 0.6)
            put(progRef.current, "strokeDashoffset", (151 * (1 - u / TOTAL)).toFixed(1))

            if (visible || Math.abs(s.vel) > 0.01 || Math.abs(target - s.cur) > 0.001) raf = requestAnimationFrame(frame)
        }
        const kick = () => {
            if (!raf) {
                s.last = 0
                raf = requestAnimationFrame(frame)
            }
        }
        const io = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting
            if (visible) kick()
        })
        io.observe(track)
        kick()
        return () => {
            io.disconnect()
            if (raf) cancelAnimationFrame(raf)
        }
    }, [still, mounted, size, R, P, gyF, W, H, dy, shapes])

    // Drag the globe sideways to spin it (up and down still scrolls the page), and lean it a
    // little towards the pointer.
    const onDown = (e: React.PointerEvent) => {
        const s = state.current
        if (still || !s.free || (e.target as HTMLElement).closest(".w3-pn,a,button")) return
        s.drag = s.free
        s.px = e.clientX
        s.vel = 0
    }
    React.useEffect(() => {
        if (still) return
        const s = state.current
        const move = (e: PointerEvent) => {
            if (e.pointerType === "mouse") s.py = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1)
            if (!s.drag) return
            if (s.drag !== s.free) {
                s.drag = 0
                return
            }
            const dx = e.clientX - s.px
            s.px = e.clientX
            if (s.drag === 1) s.spin += dx * 0.22
            else s.spin2 += dx * 0.22
            s.vel = dx * 0.16
        }
        const up = () => {
            s.drag = 0
        }
        window.addEventListener("pointermove", move, { passive: true })
        window.addEventListener("pointerup", up)
        window.addEventListener("pointercancel", up)
        return () => {
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", up)
            window.removeEventListener("pointercancel", up)
        }
    }, [still])

    // The menu steps aside while you scroll down, and comes back when you scroll up, near the top,
    // when the pointer reaches for it, or while the phone menu is open.
    React.useEffect(() => {
        if (still || !mounted) return
        const root = rootRef.current
        if (!root) return
        let last = -root.getBoundingClientRect().top
        let up = true
        let peek = false
        const apply = () => {
            const y = -root.getBoundingClientRect().top
            const show = y < 60 || up || peek || openRef.current
            if (navRef.current) navRef.current.classList.toggle("hide", !show)
        }
        const onScroll = () => {
            const y = -root.getBoundingClientRect().top
            if (y > last + 6) up = false
            else if (y < last - 6) up = true
            if (Math.abs(y - last) > 6) last = y
            apply()
        }
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            const p = e.clientY < 96
            if (p !== peek) {
                peek = p
                apply()
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true, capture: true })
        window.addEventListener("pointermove", onMove, { passive: true })
        apply()
        return () => {
            window.removeEventListener("scroll", onScroll, { capture: true })
            window.removeEventListener("pointermove", onMove)
        }
    }, [still, mounted, open])

    // The menu sends the globe round to a page (the middle of its hold), or scrolls to a section.
    const go = React.useCallback(
        (to: number | string) => {
            React.startTransition(() => setOpen(false))
            const root = rootRef.current
            const track = trackRef.current
            if (!root || !track) return
            if (typeof to === "string") {
                const el = document.getElementById("w3-" + to)
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                return
            }
            if (still) {
                const el = document.getElementById("w3-" + (to < 0 ? "top" : PAGES[to].id))
                if (el) el.scrollIntoView({ behavior: "smooth" })
                return
            }
            const u = to < 0 ? 0 : holdStart(to) + HOLD / 2
            const box = scrollBox(root)
            const rect = track.getBoundingClientRect()
            const off = u * (stageRef.current ? stageRef.current.clientHeight : window.innerHeight)
            if (box) box.scrollTo({ top: box.scrollTop + rect.top - box.getBoundingClientRect().top + off, behavior: "smooth" })
            else window.scrollTo({ top: window.scrollY + rect.top + off, behavior: "smooth" })
        },
        [still]
    )
    // "Let's talk" and "Start a campaign" go to the form, on the right side; on the demo, to an email.
    const talk = (as: "brand" | "creator") => {
        React.startTransition(() => setSide(as))
        if (rest) go("contact")
        else window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(as === "brand" ? "New campaign" : "Creator application")
    }

    const navItems: [string, number | string][] = [
        ["About", 0],
        ["Services", 1],
        ["Work", 2],
        ["Brands", 3],
    ]
    if (rest) navItems.push(["Careers", "careers"])

    const nav = (
        <nav className="w3-nav" aria-label="Main" ref={navRef}>
            <button type="button" className="w3-brand" onClick={() => go(-1)} aria-label="World Media, back to the globe">
                <span className="ic">
                    <MiniGlobe size={26} />
                    <svg className="w3-prog" viewBox="0 0 52 52" aria-hidden="true">
                        <circle cx="26" cy="26" r="24" fill="none" stroke="#EA5628" strokeWidth="2" strokeDasharray="151" strokeDashoffset="151" ref={progRef} strokeLinecap="round" />
                    </svg>
                </span>
                <b>
                    world media<span>.</span>
                </b>
            </button>
            <div className="w3-links">
                {navItems.map(([l, to]) => (
                    <button
                        key={l}
                        type="button"
                        ref={(el) => {
                            if (typeof to === "number") navBtns.current[to] = el
                        }}
                        onClick={() => go(to)}
                    >
                        {l}
                    </button>
                ))}
                <button type="button" className="cta" onClick={() => talk("brand")}>
                    Let’s talk
                </button>
            </div>
            <button type="button" className="w3-menu w3-pill" data-tone="paper" onClick={() => setOpen(!open)} aria-expanded={open}>
                {open ? "Close" : "Menu"}
            </button>
        </nav>
    )
    const sheet = open ? (
        <div className="w3 w3-sheet" role="dialog" aria-label="Menu">
            {navItems.map(([l, to]) => (
                <button key={l} type="button" onClick={() => go(to)}>
                    {l}
                    <Icon name="arrow" size={20} />
                </button>
            ))}
            <button type="button" onClick={() => talk("brand")}>
                Let’s talk
                <Icon name="arrow" size={20} />
            </button>
        </div>
    ) : null

    const tiles = (
        <div className="w3-3d">
            <div className="w3-o">
                <div className="w3-world" ref={worldRef}>
                    <div className="w3-spin" ref={spinRef} style={{ transform: `rotateX(${TILT}deg) rotateY(${-PAGE_LON[0] + 18}deg)` }}>
                        {TILES.map((t, i) => {
                            if (t.page !== undefined) return null
                            const sz = tileSize(R, shapes[i])
                            const src = srcOf(i)
                            return (
                                <div
                                    key={i}
                                    className="w3-tile"
                                    ref={(el) => {
                                        tileEls.current[i] = el
                                    }}
                                    style={{
                                        width: sz.w,
                                        height: sz.h,
                                        left: -sz.w / 2,
                                        top: -sz.h / 2,
                                        opacity: still ? 1 : 0,
                                        transform: `rotateY(${t.lon}deg) rotateX(${t.lat}deg) translateZ(${(R * 1.02).toFixed(1)}px)`,
                                    }}
                                >
                                    <Media
                                        src={src}
                                        play={!still}
                                        onShape={(ar) => setShape(i, ar)}
                                        vref={(el) => {
                                            tileVids.current[i] = el
                                        }}
                                    />
                                    {sz.h > 46 ? (
                                        <span className="w3-tag">
                                            {isVideo(src) ? (
                                                <i>
                                                    <Icon name="play" size={8} width={2.4} />
                                                </i>
                                            ) : null}
                                            <span>{t.tag}</span>
                                        </span>
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

    // The pages sit in a 3D layer of their own above the globe, with the same perspective, so a
    // page that has left the globe can never be cut by it.
    const pageLayer = still ? null : (
        <>
            <div className="w3-veil" ref={veilRef} />
            <div className="w3-3d w3-pages">
                <div className="w3-o">
                    {PAGES.map((pg, k) => (
                        <div
                            key={pg.id}
                            className="w3-pn"
                            data-tone={pg.tone}
                            ref={(el) => {
                                panels.current[k] = el
                            }}
                            aria-label={pg.title}
                            role="region"
                        >
                            <div
                                className="w3-pg"
                                ref={(el) => {
                                    bodies.current[k] = el
                                }}
                            >
                                <PageBody id={pg.id} samples={samples} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

    const vars = cssVars({ "--R": R + "px", "--P": P + "px", "--gy": gyF * 100 + "%", "--W": W + "px", "--H": H + "px" })

    return (
        <div ref={rootRef} className={"w3" + (still ? " w3-still" : "")} style={{ ...style, ...vars }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            <div className="w3-track" ref={trackRef} style={{ height: still ? "auto" : Math.round((TOTAL + 1) * size.h) + "px" }}>
                <div className="w3-stage" ref={stageRef} id="w3-top" onPointerDown={onDown}>
                    <div className="w3-word" ref={wordRef} aria-hidden="true">
                        world media.
                    </div>
                    <div className="w3-cross x" ref={crossX} aria-hidden="true" />
                    <div className="w3-cross y" ref={crossY} aria-hidden="true" />
                    <div className="w3-halo" ref={haloRef} aria-hidden="true" />
                    <div className="w3-ball" ref={ballRef} aria-hidden="true" />
                    <canvas className="w3-cv" ref={canvasRef} aria-hidden="true" />
                    {tiles}
                    <div className="w3-badges" aria-hidden="true">
                        {BADGES.map((b, i) => (
                            <div
                                key={b.at}
                                className="w3-bd"
                                data-live={b.live ? "" : undefined}
                                data-left={b.left ? "" : undefined}
                                ref={(el) => {
                                    badgeEls.current[i] = el
                                }}
                            >
                                <span>
                                    <i />
                                    {b.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    {pageLayer}
                    <div className="w3-land" ref={landRef}>
                        <h1 className="w3-head">
                            Culture moves
                            <br />
                            <em>through people.</em>
                        </h1>
                        <div className="w3-side">
                            <div>
                                <button type="button" className="w3-pill" data-tone="signal" onClick={() => talk("brand")}>
                                    Start a campaign
                                </button>
                                <button type="button" className="w3-pill" data-tone="line" onClick={() => talk("creator")}>
                                    I’m a creator
                                </button>
                            </div>
                        </div>
                    </div>
                    {still ? null : (
                        <div className="w3-outro" ref={outroRef}>
                            <h2 className="w3-head">
                                Your brand,
                                <br />
                                <em>next on the globe?</em>
                            </h2>
                            <div className="w3-side">
                                <div>
                                    <button type="button" className="w3-pill" data-tone="signal" onClick={() => talk("brand")}>
                                        Let’s talk {rest ? <Icon name="down" size={16} /> : null}
                                    </button>
                                    <button type="button" className="w3-pill" data-tone="line" onClick={() => (rest ? go("careers") : go(-1))}>
                                        {rest ? "Join the crew" : "Go round again"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="w3-idx" ref={idxRef}>
                        {PAGES.map((pg, i) => (
                            <button
                                key={pg.id}
                                type="button"
                                ref={(el) => {
                                    idxBtns.current[i] = el
                                }}
                                onClick={() => go(i)}
                                aria-label={"Go to " + pg.title}
                            >
                                <span>
                                    {String(i + 1).padStart(2, "0")} {pg.title}
                                </span>
                                <i />
                            </button>
                        ))}
                    </div>
                    {still ? nav : null}
                </div>
                {still ? (
                    <div className="w3-flat">
                        {PAGES.map((pg) => (
                            <section key={pg.id} id={"w3-" + pg.id} className="w3-flatpn" data-tone={pg.tone} aria-label={pg.title}>
                                <div className="w3-pg">
                                    <PageBody id={pg.id} samples={samples} />
                                </div>
                            </section>
                        ))}
                    </div>
                ) : null}
            </div>
            {rest ? (
                <div className="w3-rest">
                    <Contact email={email} endpoint={endpoint} side={side} setSide={setSide} />
                    <Careers email={email} />
                    <Footer email={email} phone={phone} go={go} />
                </div>
            ) : null}
            {!still && mounted ? createPortal(<div className="w3">{nav}{sheet}</div>, document.body) : null}
        </div>
    )
}

addPropertyControls(W3Globe, {
    media: {
        type: ControlType.Array,
        title: "Globe media",
        control: { type: ControlType.File, allowedFileTypes: ["mp4", "webm", "mov", "jpg", "jpeg", "png", "webp"] },
        description: "Videos and photos for the globe’s eleven video tiles, in order. Any shape works: each tile takes the shape of its video.",
    },
    samples: { type: ControlType.Boolean, title: "Sample videos", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    rest: { type: ControlType.Boolean, title: "Rest of site", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide", description: "Hide for a globe-only demo: no form, careers or footer." },
    email: { type: ControlType.String, title: "Email", defaultValue: "social@worldmedia.co.in" },
    phone: { type: ControlType.String, title: "Phone", defaultValue: "+91 88000 40301" },
    endpoint: {
        type: ControlType.String,
        title: "Form endpoint",
        defaultValue: "",
        placeholder: "https://…",
        description: "Optional: a form service address to send enquiries to. Empty, the form opens an email to the address above.",
    },
})
