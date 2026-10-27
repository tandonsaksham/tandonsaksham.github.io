// World Media, the globe showcase. One component for a whole page, in black and dark grey.
// The landing is the World Media globe: a wireframe globe with dotted continents (India in
// orange), routes flying out of Delhi, orbit rings and video tiles, all turning with it.
// Scrolling turns the globe from city to city, and at each one a chapter arrives in its own way:
// the globe dives into India for the why, an orange strip runs sideways for what we do, reels fan
// out of the globe for the work, and a light curtain rises for the brands. After the globe comes
// the rest of the site: the founder, the enquiry form, careers and the footer. Place it on its own
// page, width 100%. The videos are World Media's own films; a + card on The work opens them all.

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
    brands: string
    creators: string
    style?: React.CSSProperties
}

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;500;600;700&family=Funnel+Sans:wght@400;500;600&display=swap"

const NO_MEDIA: string[] = []
/** World Media's films, logos and photos, kept on the repository's main branch and served by GitHub Pages. */
const CDN = "https://tandonsaksham.github.io/framer/world-media-v3/"
/** Each film comes three ways: a six-second silent loop for previews, the full film with sound, and a still. */
const LOOP = (id: string) => CDN + "films/" + id + "-loop.mp4"
const FULL = (id: string) => CDN + "films/" + id + ".mp4"
const STILL = (id: string) => CDN + "films/" + id + ".webp"

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
    back: "M19 12H5 M11 6l-6 6 6 6",
    close: "M6 6l12 12 M18 6L6 18",
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

/** The small spinning globe of the menu: the meridians turn like a planet, once every period seconds. */
function MiniGlobe(p: { size?: number; period?: number }) {
    const t = p.period || 9
    return (
        <svg className="w3-mg" width={p.size || 26} height={p.size || 26} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <circle cx="20" cy="20" r="17" />
            <ellipse cx="20" cy="20" rx="17" ry="6.2" strokeOpacity=".55" />
            {[0, 1, 2, 3].map((k) => (
                <ellipse key={k} className="m" cx="20" cy="20" rx="17" ry="17" style={cssVars({ "--gd": (-t / 4) * k + "s", "--gp": t + "s" })} />
            ))}
        </svg>
    )
}

/* ─────────────────────────────── The films ─────────────────────────────── */

/** The brands the films were made for, in the order the gallery shows them. k sizes each logo so they all look about the same size. */
const BRANDS: { name: string; logo: string; k: number; word?: boolean }[] = [
    { name: "Coca-Cola", logo: "coca-cola.png", k: 1 },
    { name: "Sprite", logo: "sprite.png", k: 1 },
    { name: "Maaza", logo: "maaza.png", k: 1.12 },
    { name: "Kinley", logo: "kinley.png", k: 1.02 },
    { name: "Tinder", logo: "tinder.png", k: 0.74 },
    { name: "OPPO", logo: "oppo.png", k: 0.62 },
    // Ashiana's logo is a small mark, so its name sits beside it.
    { name: "Ashiana", logo: "ashiana.png", k: 1.05, word: true },
]
type Film = { id: string; b: number; title: string; ar: number }
const TALL = 9 / 16
/** World Media's films. Each id names its files in the films folder; b is its brand, ar its shape. */
const FILMS: Film[] = [
    { id: "coca-cola-varun-sood", b: 0, title: "Trophy Tour, with Varun Sood", ar: TALL },
    { id: "coca-cola-trophy-tour", b: 0, title: "FIFA World Cup Trophy Tour, Delhi", ar: TALL },
    { id: "coca-cola-striker", b: 0, title: "Trophy Tour: Delhi and Guwahati", ar: TALL },
    { id: "sprite-durga-puja", b: 1, title: "Durga Puja in Kolkata", ar: TALL },
    { id: "sprite-ganesh-chaturthi", b: 1, title: "Ganesh Chaturthi", ar: TALL },
    { id: "maaza-50-years", b: 2, title: "50 years of Maaza", ar: TALL },
    { id: "maaza-mothers-day", b: 2, title: "Mother’s Day", ar: TALL },
    { id: "kinley-teachers-day", b: 3, title: "Teacher’s Day", ar: TALL },
    { id: "kinley-teachers-day-2", b: 3, title: "Teacher’s Day, film two", ar: TALL },
    { id: "tinder-green-flag", b: 4, title: "You met a green flag on the first date", ar: TALL },
    { id: "tinder-punjabi-malayali", b: 4, title: "When a Punjabi guy falls for a Malayali girl", ar: TALL },
    { id: "tinder-first-date", b: 4, title: "A tomboy’s first Tinder date", ar: TALL },
    { id: "tinder-single-friend", b: 4, title: "That single friend in every group", ar: TALL },
    { id: "tinder-moms-at-25", b: 4, title: "Indian moms when their daughters turn 25", ar: TALL },
    { id: "tinder-bestie", b: 4, title: "Treating my bhabhi’s sister like a princess", ar: TALL },
    { id: "oppo-abhay-deol", b: 5, title: "Snap to Mind Space, with Abhay Deol", ar: 3 / 2 },
    { id: "ashiana-dinesh-karthik", b: 6, title: "With Dinesh Karthik", ar: 4 / 3 },
]
const filmAt = (id: string) => Math.max(0, FILMS.findIndex((f) => f.id === id))
/** The films on The work, from the middle out: five on a wide screen, fewer on a tablet or phone, then the card that opens them all. */
const FAN = ["sprite-durga-puja", "tinder-first-date", "coca-cola-varun-sood", "maaza-mothers-day", "kinley-teachers-day-2"]

/** A brand's logo on a small light plate, so every logo reads on the dark site. */
function Logo(p: { b: number }) {
    const b = BRANDS[p.b]
    return (
        <span className="w3-lg">
            <img src={CDN + "logos/" + b.logo} alt={b.word ? "" : b.name} draggable={false} style={cssVars({ "--k": b.k })} />
            {b.word ? <b>{b.name}</b> : null}
        </span>
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

type TileDef = { lon: number; lat: number; ar: number; tag: string; page?: number; film?: string }

/** A video tile on the globe, playing one of the films, in the film's shape and tagged with its brand. */
const tile = (lon: number, lat: number, id: string): TileDef => {
    const f = FILMS[filmAt(id)]
    return { lon, lat, ar: f.ar, tag: BRANDS[f.b].name, film: id }
}

/**
 * What sits on the globe, spread so nothing touches. The first four mark the chapters' cities and
 * show nothing; the rest are video tiles, each playing a film.
 */
const TILES: TileDef[] = [
    { lon: 77.2, lat: 28.6, ar: 1.5, tag: "", page: 0 },
    { lon: -74, lat: 40.7, ar: 1.5, tag: "", page: 1 },
    { lon: 139.7, lat: 35.7, ar: 1.5, tag: "", page: 2 },
    { lon: -0.1, lat: 51.5, ar: 1.5, tag: "", page: 3 },
    tile(6, 2, "oppo-abhay-deol"),
    tile(150, -28, "tinder-moms-at-25"),
    tile(-52, -16, "sprite-durga-puja"),
    tile(-116, 28, "ashiana-dinesh-karthik"),
    tile(105, -5, "maaza-50-years"),
    tile(44, 6, "coca-cola-trophy-tour"),
    tile(-36, 20, "tinder-single-friend"),
    tile(-90, -5, "kinley-teachers-day"),
    tile(-160, 10, "tinder-bestie"),
    tile(60, -30, "sprite-ganesh-chaturthi"),
    tile(-170, 48, "coca-cola-striker"),
]

/** A tile's width and height for its shape, all tiles having about the same area. */
const tileSize = (R: number, ar: number) => {
    const a = R * 0.42
    return { w: a * Math.sqrt(ar), h: a / Math.sqrt(ar) }
}

function Media(p: { src: string; poster?: string; play: boolean; onShape?: (ar: number) => void; vref?: (el: HTMLVideoElement | null) => void }) {
    if (!p.src) return <b className="w3-blank" />
    if (isVideo(p.src))
        return (
            <video
                ref={p.vref}
                src={p.src}
                poster={p.poster}
                autoPlay={p.play}
                muted
                loop
                playsInline
                preload="auto"
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

/* ─────────────────────────────── The chapters ─────────────────────────────── */

type PageDef = { id: string; nav: string; title: string }

const PAGES: PageDef[] = [
    { id: "why", nav: "About", title: "The why" },
    { id: "services", nav: "Services", title: "What we do" },
    { id: "work", nav: "Work", title: "The work" },
    { id: "brands", nav: "Brands", title: "The brands" },
]

const TENETS = [
    ["Cast for trust", "Creators your buyers already believe."],
    ["Stories that stick", "Made to be watched to the end."],
    ["Measured to the rupee", "Reach, views and sales, reported."],
]
const OFFER = [
    { name: "Influencer Marketing", head: "The right people change everything.", line: "From finding the right voices to getting the campaign live, we make creator partnerships count.", core: true, film: "tinder-green-flag" },
    { name: "Production", head: "Good ideas deserve great frames.", line: "From the first concept to the final cut, we turn ideas into films, reels and branded content.", core: false, film: "oppo-abhay-deol" },
    { name: "Studio", head: "Your next idea. Ready for its close-up.", line: "A Delhi-based creative space for shoots, content days and everything worth putting in front of a camera.", core: false, film: "maaza-50-years" },
    { name: "Talent Management", head: "More than the next brand deal.", line: "We build creator relationships, unlock opportunities and help talent grow beyond the feed.", core: false, film: "ashiana-dinesh-karthik" },
    { name: "Social Media", head: "Don’t just fill the feed. Give it a point of view.", line: "Strategy, creative and content that make a brand’s social presence feel unmistakably its own.", core: false, film: "tinder-punjabi-malayali" },
]
/** The client logos from World Media's portfolio deck. */
const LOGO_CDN = CDN + "logos/"
/** k sizes each logo so they all look about the same size: wide wordmarks shorter, tall marks taller. */
const LOGOS = [
    { name: "NPCI", file: "npci.png", k: 0.96 },
    { name: "Canva", file: "canva.png", k: 0.98 },
    { name: "Coca-Cola", file: "coca-cola.png", k: 0.99 },
    { name: "Ashiana", file: "ashiana.png", k: 1.50 },
    { name: "OPPO", file: "oppo.png", k: 0.85 },
    { name: "Havells", file: "havells.png", k: 1.40 },
    { name: "Sprite", file: "sprite.png", k: 1.07 },
    { name: "Mahindra", file: "mahindra.png", k: 1.41 },
    { name: "BookMyShow", file: "bookmyshow.png", k: 0.94 },
    { name: "Flipkart Minutes", file: "flipkart-minutes.png", k: 1.01 },
    { name: "Amazon Pay", file: "amazon-pay.png", k: 0.76 },
    { name: "Maaza", file: "maaza.png", k: 1.14 },
    { name: "Kinley", file: "kinley.png", k: 1.02 },
    { name: "Dot & Key", file: "dot-and-key.png", k: 1.00 },
    { name: "Abu Dhabi Tourism & Culture", file: "abu-dhabi.png", k: 1.02 },
    { name: "Tinder", file: "tinder.png", k: 0.85 },
    { name: "Urban Company", file: "urban-company.png", k: 0.92 },
    { name: "", file: "red-mark.png", k: 1.50 },
    { name: "Bingo!", file: "bingo.png", k: 1.35 },
]
const nn = (n: number) => String(n).padStart(2, "0")
/** A figure that can count up ("120M+"), or null for a placeholder still in brackets ("[00]M+"). */
const countable = (s: string) => (s.includes("[") ? null : s.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/))

/** A line of words, each in its own mask so it can rise into view on its own. */
function Words(p: { text: string }) {
    const list = p.text.split(" ")
    return (
        <>
            {list.map((w, i) => (
                <React.Fragment key={i}>
                    <span className="w3-wd">
                        <span data-w="">{w}</span>
                    </span>
                    {i < list.length - 1 ? " " : null}
                </React.Fragment>
            ))}
        </>
    )
}

function Mark(p: { n: number; title: string }) {
    return (
        <div className="w3-mark">
            <b>{nn(p.n)}</b>
            {p.title}
        </div>
    )
}

/** The why: the globe dives into India and the words build up out of the dark. */
function ChapterWhy() {
    return (
        <>
            <h2 className="w3-say">
                <span className="w3-ln">
                    <Words text="People skip ads." />
                </span>
                <span className="w3-ln w3-em">
                    <Words text="They don’t skip people." />
                </span>
            </h2>
            <ol className="w3-tenets">
                {TENETS.map(([h, d], i) => (
                    <li key={h} data-b="">
                        <i>{nn(i + 1)}</i>
                        <b>{h}</b>
                        <span>{d}</span>
                    </li>
                ))}
            </ol>
            <Mark n={1} title="The why" />
        </>
    )
}

/** What we do: the five services pass by sideways while you scroll down. */
function ChapterServices(p: { samples: boolean }) {
    return (
        <>
            <div className="w3-strip" data-strip="">
                <div className="w3-sp w3-sp0">
                    <h2 className="w3-say">
                        Five things.
                        <br />
                        <em>Done properly.</em>
                    </h2>
                    <p className="w3-hint">
                        Keep scrolling <Icon name="arrow" size={18} />
                    </p>
                </div>
                {OFFER.map((s, i) => (
                    <article key={s.name} className="w3-sp">
                        <span className="w3-num" aria-hidden="true">
                            {nn(i + 1)}
                        </span>
                        <div className="w3-spv">{p.samples ? <video src={LOOP(s.film)} poster={STILL(s.film)} muted loop playsInline preload="none" /> : <img src={STILL(s.film)} alt="" loading="lazy" draggable={false} />}</div>
                        <span className="w3-spn">
                            {s.name}
                            {s.core ? <i>Our core</i> : null}
                        </span>
                        <h3>{s.head}</h3>
                        <p>{s.line}</p>
                    </article>
                ))}
            </div>
            <div className="w3-prog2" aria-hidden="true">
                <span data-count="">01 / 05</span>
                <b>
                    <i data-bar="" />
                </b>
            </div>
            <Mark n={2} title="What we do" />
        </>
    )
}

/** The work: the films fan out of the globe like a hand of cards, the last card opening them all. */
function ChapterWork(p: { samples: boolean; count: number; play: (i: number) => void; all: () => void }) {
    const from = Math.floor((FAN.length - p.count) / 2)
    const fan = FAN.slice(from, from + p.count)
    return (
        <>
            <div className="w3-c3h">
                <h2 className="w3-say">
                    <Words text="Reels people" />{" "}
                    <em>
                        <Words text="actually stopped for." />
                    </em>
                </h2>
                <p className="w3-sub" data-sub="">
                    Ideas don’t execute themselves.
                </p>
            </div>
            <div className="w3-fan">
                {fan.map((id) => {
                    const i = filmAt(id)
                    const f = FILMS[i]
                    return (
                        <button key={id} type="button" className="w3-reel" data-r="" onClick={() => p.play(i)} aria-label={"Play " + BRANDS[f.b].name + ": " + f.title}>
                            <span className="w3-rv">
                                {p.samples ? <video src={LOOP(id)} poster={STILL(id)} muted loop playsInline preload="none" /> : <img src={STILL(id)} alt="" loading="lazy" draggable={false} />}
                                <span className="w3-rl">
                                    <Logo b={f.b} />
                                </span>
                                <span className="w3-go">
                                    <Icon name="play" size={15} />
                                </span>
                            </span>
                        </button>
                    )
                })}
                <button type="button" className="w3-reel w3-more" data-r="" onClick={p.all} aria-label={"See all " + FILMS.length + " films"}>
                    <span className="w3-rv">
                        <span className="w3-plus">
                            <Icon name="plus" size={30} width={2} />
                        </span>
                        <b>See all</b>
                        <span>{FILMS.length} films</span>
                    </span>
                </button>
            </div>
            <Mark n={3} title="The work" />
        </>
    )
}

/** The brands: a light curtain rises over the globe, the numbers count up and the logos roll by. */
function ChapterBrands(p: { stats: [string, string][] }) {
    return (
        <div className="w3-cur" data-cur="">
            <h2 className="w3-say">
                So far, <em>so good.</em>
            </h2>
            <div className="w3-nums">
                {p.stats.map(([n, l]) => (
                    <div key={l} data-b="">
                        <strong data-to={n}>{n}</strong>
                        <span>{l}</span>
                    </div>
                ))}
            </div>
            <div className="w3-belt" role="img" aria-label={"Brands we’ve worked with, including " + LOGOS.filter((l) => l.name).map((l) => l.name).join(", ")}>
                {[LOGOS.slice(0, 9), LOGOS.slice(9)].map((row, r) => (
                    <div key={r} className="w3-belt-in" data-rev={r ? "" : undefined}>
                        {[0, 1].map((c) => row.map((l) => <img key={c + l.file} src={LOGO_CDN + l.file} alt="" draggable={false} style={cssVars({ "--k": l.k })} />))}
                    </div>
                ))}
            </div>
            <Mark n={4} title="The brands" />
        </div>
    )
}

/* ─────────────────────────────── After the globe ─────────────────────────────── */

const SERVICES = ["Influencer marketing", "Production", "Social media", "UGC", "Paid ads", "Celebrities & talent"]
const BUDGETS = ["Under ₹2L", "₹2L – 5L", "₹5L – 15L", "₹15L – 50L", "₹50L+"]
const FOLLOWERS = ["Under 10K", "10K – 100K", "100K – 1M", "1M+"]

function Chips(p: { items: string[]; value: string[]; onChange: (v: string[]) => void; multi?: boolean; join?: boolean; label: string }) {
    return (
        <div className="w3-chips" data-join={p.join ? "" : undefined} role="group" aria-label={p.label}>
            {p.items.map((it) => {
                const on = p.value.includes(it)
                return (
                    <button
                        key={it}
                        type="button"
                        aria-pressed={on}
                        onClick={() => p.onChange(p.multi ? (on ? p.value.filter((v) => v !== it) : [...p.value, it]) : on ? [] : [it])}
                    >
                        {on && !p.join ? <Icon name="check" size={14} width={2} /> : null}
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

/** A numbered step of the form. */
function Step(p: { n: number; label: string; children: React.ReactNode }) {
    return (
        <div className="w3-q">
            <span className="w3-lab">
                <b>{p.n}</b>
                {p.label}
            </span>
            {p.children}
        </div>
    )
}

/** The enquiry form: a few numbered steps on one panel, for brands or for creators. */
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
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
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
                <div className="w3-form w3-thanks" role="status">
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
                <>
                    <div className="w3-seg" role="group" aria-label="Who’s saying hello?">
                        <button type="button" aria-pressed={brand} onClick={() => p.setSide("brand")}>
                            I’m a brand
                        </button>
                        <button type="button" aria-pressed={!brand} onClick={() => p.setSide("creator")}>
                            I’m a creator
                        </button>
                    </div>
                    <form className="w3-form" onSubmit={submit}>
                        <div className="w3-intro">
                            <h3>{brand ? "Have a brief. Or just a feeling." : "Make great content. Meet great brands."}</h3>
                            <p>{brand ? "Tell us what you’re thinking. We’ll help figure out what it could become." : "Tell us your story, your style and what you bring to the feed."}</p>
                        </div>
                        {brand ? (
                            <>
                                <Step n={1} label="What do you need?">
                                    <Chips items={SERVICES} value={services} onChange={setServices} multi label="What do you need?" />
                                </Step>
                                <Step n={2} label="About you">
                                    <div className="w3-fields">
                                        <Field name="Brand name" label="Brand name" need auto="organization" />
                                        <Field name="Work email" label="Work email" type="email" need auto="email" />
                                    </div>
                                </Step>
                                <Step n={3} label="Monthly budget">
                                    <Chips items={BUDGETS} value={budget} onChange={setBudget} join label="Monthly budget" />
                                </Step>
                                <Step n={4} label="Anything else?">
                                    <div className="w3-fields">
                                        <Field name="Brief" label="Optional" area hint="What are you launching, and who should hear about it?" />
                                    </div>
                                </Step>
                            </>
                        ) : (
                            <>
                                <Step n={1} label="About you">
                                    <div className="w3-fields">
                                        <Field name="Name" label="Your name" need auto="name" />
                                        <Field name="Email" label="Email" type="email" need auto="email" />
                                        <Field name="Handle" label="Instagram or YouTube handle" need wide hint="@" />
                                    </div>
                                </Step>
                                <Step n={2} label="Followers">
                                    <Chips items={FOLLOWERS} value={followers} onChange={setFollowers} join label="Followers" />
                                </Step>
                            </>
                        )}
                        <div className="w3-send">
                            <button type="submit" className="w3-btn" data-tone="signal" disabled={sent === "sending"}>
                                {sent === "sending" ? "Sending…" : brand ? "Let’s build something" : "Introduce yourself"} <Icon name="out" size={18} />
                            </button>
                            <span>A real person replies within a day.</span>
                        </div>
                    </form>
                </>
            )}
        </section>
    )
}

/** Every film, with the brands' logos across the top to filter by. Tapping a film plays it in the player. */
function Gallery(p: { onClose: () => void; onPlay: (i: number) => void; paused: boolean; still: boolean }) {
    const [brand, setBrand] = React.useState(-1)
    const ref = React.useRef<HTMLDivElement>(null)
    const paused = React.useRef(p.paused)
    paused.current = p.paused
    const list = FILMS.map((_, i) => i).filter((i) => brand < 0 || FILMS[i].b === brand)
    const count = (b: number) => FILMS.filter((f) => f.b === b).length
    // Each card's loop loads and plays only while the card is on screen, and rests while a film plays.
    React.useEffect(() => {
        const box = ref.current
        if (!box || p.still || typeof IntersectionObserver === "undefined") return
        const io = new IntersectionObserver(
            (list) =>
                list.forEach((e) => {
                    const v = e.target.querySelector("video")
                    if (!v) return
                    v.toggleAttribute("data-vis", e.isIntersecting)
                    if (!e.isIntersecting) return v.pause()
                    if (!v.getAttribute("src")) v.src = v.dataset.src || ""
                    if (!paused.current) v.play().catch(() => {})
                }),
            { root: box, threshold: 0.35 }
        )
        box.querySelectorAll("[data-film]").forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [brand, p.still])
    React.useEffect(() => {
        const box = ref.current
        if (!box) return
        box.querySelectorAll("video").forEach((v) => {
            if (p.paused || !v.hasAttribute("data-vis")) v.pause()
            else v.play().catch(() => {})
        })
    }, [p.paused])
    const pick = (b: number) => {
        React.startTransition(() => setBrand(b))
        if (ref.current) ref.current.scrollTo({ top: 0, behavior: "smooth" })
    }
    return (
        <div className="w3-gal" role="dialog" aria-modal="true" aria-labelledby="w3-gal-h" ref={ref}>
            <button type="button" className="w3-x" onClick={p.onClose} aria-label="Close">
                <Icon name="close" size={22} width={2} />
            </button>
            <div className="w3-gal-in">
                <h2 className="w3-gal-h" id="w3-gal-h">
                    Every film, <em>every brand.</em>
                </h2>
                <p className="w3-gal-sub">Tap a film to watch it with sound.</p>
                <div className="w3-gal-f" role="group" aria-label="Show the films for one brand" data-on={brand >= 0 ? "" : undefined}>
                    <button type="button" aria-pressed={brand < 0} onClick={() => pick(-1)}>
                        All<i>{FILMS.length}</i>
                    </button>
                    {BRANDS.map((b, j) => (
                        <button key={b.name} type="button" aria-pressed={brand === j} onClick={() => pick(j)}>
                            <Logo b={j} />
                            <i aria-hidden="true">{count(j)}</i>
                        </button>
                    ))}
                </div>
                <ul className="w3-gal-g">
                    {list.map((i) => {
                        const f = FILMS[i]
                        return (
                            <li key={f.id} data-wide={f.ar > 1 ? "" : undefined}>
                                <button type="button" className="w3-film" data-film="" onClick={() => p.onPlay(i)}>
                                    <span className="w3-film-v">
                                        <video data-src={LOOP(f.id)} poster={STILL(f.id)} muted loop playsInline preload="none" />
                                        <span className="w3-film-p" aria-hidden="true">
                                            <Icon name="play" size={20} />
                                        </span>
                                    </span>
                                    <span className="w3-film-m">
                                        <Logo b={f.b} />
                                        <b>{f.title}</b>
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

/** One film, full size and with sound, with the next and the previous film a tap away. */
function Player(p: { i: number; onClose: () => void; step: (d: number) => void }) {
    const f = FILMS[p.i]
    const ref = React.useRef<HTMLVideoElement>(null)
    // Plays with sound; where the browser won't allow that yet, it plays muted and the controls turn the sound on.
    React.useEffect(() => {
        const v = ref.current
        if (!v) return
        v.muted = false
        v.play().catch(() => {
            v.muted = true
            v.play().catch(() => {})
        })
    }, [p.i])
    return (
        <div className="w3-pl" role="dialog" aria-modal="true" aria-label={BRANDS[f.b].name + ": " + f.title}>
            <button type="button" className="w3-x" onClick={p.onClose} aria-label="Close the film">
                <Icon name="close" size={22} width={2} />
            </button>
            <div className="w3-pl-v" style={cssVars({ "--ar": f.ar })}>
                <video key={f.id} ref={ref} src={FULL(f.id)} poster={STILL(f.id)} controls playsInline preload="auto" />
            </div>
            <div className="w3-pl-m">
                <Logo b={f.b} />
                <b>{f.title}</b>
                <span className="w3-pl-n">
                    {nn(p.i + 1)} / {FILMS.length}
                </span>
                <span className="w3-pl-nav">
                    <button type="button" onClick={() => p.step(-1)} aria-label="Previous film">
                        <Icon name="back" size={20} />
                    </button>
                    <button type="button" onClick={() => p.step(1)} aria-label="Next film">
                        <Icon name="arrow" size={20} />
                    </button>
                </span>
            </div>
        </div>
    )
}

/** The people behind World Media, from the portfolio deck. */
const PEOPLE_CDN = CDN + "people/"

/** Meet the founder: Deepanker Mitra, then the founding member, Shabd Monga, as polaroids like in the deck. */
function Founder() {
    const ref = React.useRef<HTMLElement>(null)
    // Each polaroid drops into place, like a photo put down on a table, when its part comes into view.
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const io = new IntersectionObserver(
            (list) =>
                list.forEach((e) => {
                    if (!e.isIntersecting) return
                    e.target.classList.add("in")
                    io.unobserve(e.target)
                }),
            { threshold: 0.3 }
        )
        el.querySelectorAll("[data-in]").forEach((b) => io.observe(b))
        return () => io.disconnect()
    }, [])
    return (
        <section ref={ref} className="w3-sec w3-people" id="w3-founder" aria-labelledby="w3-pp-h">
            <div className="w3-pp-main" data-in="">
                <div className="w3-pp-text">
                    <h2 className="w3-h2" id="w3-pp-h">
                        Meet the <em>founder.</em>
                    </h2>
                    <p className="w3-pp-lead">11+ years. Hundreds of creator conversations. A front-row view of how influencer marketing became an industry.</p>
                    <p>Deepanker brings deep experience across talent, brand partnerships and creator ecosystems, now channelled into building a creative world through World Media.</p>
                    <p>His lens sits at the intersection of strategy, creativity and growth, with a focus on turning creator influence into work that moves brands forward.</p>
                </div>
                <figure className="w3-polaroid w3-pol-a">
                    <span className="w3-pol-img">
                        <img src={PEOPLE_CDN + "deepanker-mitra.webp"} alt="Deepanker Mitra, smiling" loading="lazy" decoding="async" draggable={false} />
                    </span>
                    <figcaption>
                        <b>Deepanker Mitra</b>
                        <span>Founder & CEO</span>
                    </figcaption>
                </figure>
            </div>
            <div className="w3-pp-member" data-in="">
                <figure className="w3-polaroid w3-pol-b">
                    <span className="w3-pol-img">
                        <img src={PEOPLE_CDN + "shabd-monga.webp"} alt="Shabd Monga at work, in black and white" loading="lazy" decoding="async" draggable={false} />
                    </span>
                    <figcaption>
                        <b>Shabd Monga</b>
                        <span>Creative strategy & brand partnerships</span>
                    </figcaption>
                </figure>
                <div className="w3-pp-text">
                    <h3>
                        Founding <em>member.</em>
                    </h3>
                    <p>With over 5 years of experience in creative strategy, Shabd has worked across product-led startups, global brands, and influencer marketing. His experience spans brand building, campaign strategy, and new-age content creation, with a strong understanding of how culture, creativity, and digital-first storytelling come together to build relevant brands.</p>
                </div>
            </div>
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

/** The open roles: one row each, which fills with orange on hover and opens an email to apply. */
function Careers(p: { email: string }) {
    return (
        <section className="w3-sec w3-careers" id="w3-careers" aria-labelledby="w3-cr-h">
            <div className="w3-crh">
                <h2 className="w3-h2" id="w3-cr-h">
                    Join the <em>crew.</em>
                </h2>
                <p>
                    <b>{ROLES.length}</b>open roles · New Friends Colony, New Delhi
                </p>
            </div>
            <ul className="w3-roles">
                {ROLES.map((r, i) => (
                    <li key={r.role}>
                        <a href={"mailto:" + p.email + "?subject=" + encodeURIComponent("Application: " + r.role) + "&body=" + encodeURIComponent("Hi World Media,\n\nI’d like to apply for the " + r.role + " role. My CV (and portfolio or showreel) is attached.\n\n")}>
                            <span className="w3-rn">{nn(i + 1)}</span>
                            <b>{r.role}</b>
                            <span className="w3-rm">
                                <span className="w3-rt">{r.team}</span>
                                <span className="w3-ry">{r.years}</span>
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
                    <button type="button" onClick={() => p.go("founder")}>
                        Founder
                    </button>
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
.w3-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* the loader: the globe of the menu turning, and a thin line that fills as the page gets ready */
.w3-load{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;background:var(--bg);color:var(--text);transition:opacity .6s var(--ease),visibility .6s;animation:w3fail .5s 12s forwards}
.w3-load.out{opacity:0;visibility:hidden;pointer-events:none}
.w3-load>div{display:flex;flex-direction:column;align-items:center;gap:22px}
.w3-load b{display:block;width:120px;height:2px;border-radius:2px;background:rgba(255,255,255,.14);overflow:hidden}
.w3-load b i{display:block;height:100%;background:var(--signal);transform:scaleX(0);transform-origin:0 50%}
@keyframes w3fail{to{opacity:0;visibility:hidden}}
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

/* the chapters: each one arrives in its own way */
.w3-gl{position:absolute;inset:0;pointer-events:none;will-change:transform}
.w3-veil{position:absolute;inset:0;background:#0A0A0A;opacity:0;pointer-events:none}
.w3-c{position:absolute;inset:0;visibility:hidden;pointer-events:none;overflow:hidden}
.w3-c.live a,.w3-c.live button{pointer-events:auto}
.w3-mark{position:absolute;left:clamp(16px,2.6vw,40px);bottom:clamp(18px,3.4vh,34px);display:flex;align-items:baseline;gap:10px;font-family:var(--disp);font-weight:600;font-size:18px;letter-spacing:-.02em}
.w3-mark b{font-weight:700;color:var(--signal)}
.w3-say{font-family:var(--disp);font-weight:700;font-size:clamp(48px,7.4vw,140px);line-height:.9;letter-spacing:-.058em;text-wrap:balance}
.w3-say em,.w3-em{font-style:normal;color:var(--signal)}
.w3-ln{display:block}
.w3-wd{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.w3-wd>span{display:inline-block;will-change:transform}
.w3-c1 .w3-say{position:absolute;left:clamp(16px,4vw,64px);right:clamp(16px,4vw,64px);top:22vh}
.w3-tenets{position:absolute;left:clamp(16px,4vw,64px);right:clamp(16px,4vw,64px);bottom:clamp(76px,12vh,124px);display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,40px)}
.w3-tenets li{display:grid;grid-template-columns:auto 1fr;column-gap:16px;row-gap:6px;padding-top:18px;border-top:1px solid rgba(255,255,255,.2)}
.w3-tenets i{grid-row:1/span 2;font-family:var(--disp);font-style:normal;font-weight:700;font-size:clamp(28px,3vw,46px);line-height:.85;letter-spacing:-.04em;color:var(--signal)}
.w3-tenets b{font-family:var(--disp);font-weight:600;font-size:clamp(21px,2.1vw,32px);letter-spacing:-.03em;line-height:1.05}
.w3-tenets span{font-size:15px;line-height:1.4;color:var(--mute)}
.w3-c2{color:var(--ink)}
.w3-strip{position:absolute;left:0;top:0;bottom:0;display:flex;background:var(--signal);will-change:transform}
.w3-sp{position:relative;flex:none;width:var(--spw);height:100%;padding:clamp(84px,12vh,120px) clamp(20px,2.4vw,36px) clamp(70px,11vh,104px);display:flex;flex-direction:column;justify-content:flex-end;gap:14px;border-left:1px solid rgba(10,10,10,.18)}
.w3-sp0{width:var(--sp0w);border-left:0;justify-content:center;padding-left:clamp(16px,4vw,64px)}
.w3-sp0 .w3-say em{color:#fff}
.w3-hint{display:inline-flex;align-items:center;gap:8px;margin-top:28px;font-size:16px;font-weight:600}
.w3-num{position:absolute;top:clamp(76px,11vh,110px);left:clamp(20px,2.4vw,36px);font-family:var(--disp);font-weight:700;font-size:clamp(80px,14vh,160px);line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.5px var(--ink)}
.w3-spv{position:relative;width:100%;height:min(28vh,calc(var(--spw) * .75));margin-bottom:6px;border-radius:18px;overflow:hidden;background:rgba(10,10,10,.14)}
.w3-spv video,.w3-spv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 30%}
.w3-spn{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600}
.w3-spn i{font:600 12px/1 var(--sans);font-style:normal;padding:6px 10px;border-radius:99px;background:var(--ink);color:#fff}
.w3-sp h3{font-family:var(--disp);font-weight:700;font-size:clamp(25px,2.5vw,36px);letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.w3-sp p{font-size:15.5px;line-height:1.45;max-width:34ch;color:rgba(10,10,10,.76)}
.w3-prog2{position:absolute;right:clamp(16px,2.6vw,40px);bottom:clamp(18px,3.4vh,34px);display:flex;align-items:center;gap:14px;font-family:var(--disp);font-weight:600;font-size:16px;font-variant-numeric:tabular-nums}
.w3-prog2 b{display:block;width:clamp(120px,16vw,240px);height:2px;background:rgba(10,10,10,.22);overflow:hidden}
.w3-prog2 i{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.w3-c2 .w3-mark b{color:#fff}
.w3-c3h{position:absolute;left:16px;right:16px;top:clamp(76px,11vh,110px);text-align:center}
.w3-c3 .w3-say{font-size:clamp(44px,6.4vw,112px)}
.w3-sub{margin-top:clamp(10px,1.6vh,18px);font-family:var(--disp);font-weight:600;font-size:clamp(18px,1.7vw,24px);letter-spacing:-.02em;color:var(--mute);opacity:0}
.w3-fan{position:absolute;left:50%;top:var(--gy);width:0;height:0}
.w3-reel{position:absolute;width:var(--rw);height:calc(var(--rw) * 16 / 9);left:calc(var(--rw) / -2);top:calc(var(--rw) * -8 / 9);opacity:0;will-change:transform,opacity}
.w3-rv{position:absolute;inset:0;border-radius:calc(var(--rw) * .1);overflow:hidden;background:#1C1C1C;box-shadow:0 0 0 1px rgba(255,255,255,.16),0 30px 60px -24px rgba(0,0,0,.85);transition:translate .5s var(--ease),box-shadow .4s}
.w3-reel:hover .w3-rv,.w3-reel:focus-visible .w3-rv{translate:0 -16px;box-shadow:0 0 0 2px var(--signal),0 40px 70px -24px rgba(0,0,0,.9)}
.w3-rv>video,.w3-rv>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.w3-lg{display:inline-flex;align-items:center;gap:7px;flex:none;height:30px;padding:0 11px;border-radius:99px;background:#F6F4EF;color:var(--ink)}
.w3-lg img{display:block;width:auto;height:calc(15px * var(--k,1))}
.w3-lg b{font:600 13px/1 var(--sans);letter-spacing:-.01em}
.w3-rl{position:absolute;left:10px;bottom:10px}
.w3-rl .w3-lg{height:26px;padding:0 9px}
.w3-rl .w3-lg img{height:calc(12px * var(--k,1))}
.w3-more .w3-rv{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:16px;text-align:center;background:var(--signal);color:var(--ink);box-shadow:0 30px 60px -24px rgba(0,0,0,.85)}
.w3-plus{display:grid;place-items:center;width:clamp(52px,calc(var(--rw) * .34),72px);height:clamp(52px,calc(var(--rw) * .34),72px);margin-bottom:10px;border-radius:50%;background:var(--ink);color:#fff;transition:rotate .5s var(--ease)}
.w3-more b{font-family:var(--disp);font-weight:700;font-size:clamp(20px,calc(var(--rw) * .12),28px);letter-spacing:-.03em;line-height:1}
.w3-more .w3-rv>span:last-child{font-size:14px;font-weight:500;opacity:.75}
.w3-more:hover .w3-plus,.w3-more:focus-visible .w3-plus{rotate:90deg}
.w3-more:hover .w3-rv,.w3-more:focus-visible .w3-rv{box-shadow:0 0 0 2px #fff,0 40px 70px -24px rgba(0,0,0,.9)}
.w3-go{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(10,10,10,.72);color:#fff;transition:background-color .3s,color .3s}
.w3-reel:hover .w3-go{background:var(--signal);color:var(--ink)}
.w3-cur{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:clamp(26px,5vh,56px);padding:clamp(76px,11vh,120px) 0 clamp(70px,11vh,104px);background:var(--paper);color:var(--ink);transform:translate3d(0,100%,0);will-change:transform;overflow:hidden}
.w3-cur .w3-say,.w3-nums{padding:0 clamp(16px,4vw,64px)}
.w3-nums{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(16px,2.4vw,40px)}
.w3-nums div{display:flex;flex-direction:column;gap:6px;padding-top:16px;border-top:1px solid rgba(10,10,10,.16)}
.w3-nums strong{font-family:var(--disp);font-weight:700;font-size:clamp(52px,8vw,140px);line-height:.9;letter-spacing:-.06em;font-variant-numeric:tabular-nums}
.w3-nums span{font-size:16px;color:rgba(10,10,10,.6)}
.w3-belt{--lh:clamp(26px,2.9vw,42px);display:flex;flex-direction:column;gap:clamp(14px,2.4vh,26px);overflow:hidden;padding:clamp(16px,2.6vh,28px) 0;border-top:1px solid rgba(10,10,10,.12);border-bottom:1px solid rgba(10,10,10,.12);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.w3-belt-in{display:flex;align-items:center;width:max-content;height:calc(var(--lh) * 1.9);animation:w3belt 48s linear infinite;animation-play-state:paused}
.w3-belt-in[data-rev]{animation-direction:reverse;animation-duration:54s}
.w3-c4.on .w3-belt-in{animation-play-state:running}
.w3-belt img{display:block;flex:none;width:auto;height:calc(var(--lh) * var(--k));margin-right:clamp(48px,6.4vw,104px)}
@keyframes w3belt{to{transform:translateX(-50%)}}
.w3-c4 .w3-mark b{color:var(--signal)}

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
.w3-mg .m{transform-box:fill-box;transform-origin:50% 50%;animation:w3mer var(--gp,9s) linear infinite;animation-delay:var(--gd,0s)}
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

/* after the globe */
.w3-rest{position:relative;overflow-x:hidden;overflow-x:clip;background:var(--bg);border-top:1px solid rgba(255,255,255,.06)}
.w3-sec{padding:clamp(80px,11vw,160px) clamp(16px,4vw,64px) 0;max-width:880px;margin:0 auto;scroll-margin-top:24px}
.w3-sec:last-of-type{padding-bottom:clamp(80px,11vw,160px)}
.w3-h2{font-family:var(--disp);font-weight:700;font-size:clamp(44px,6.4vw,96px);line-height:.9;letter-spacing:-.055em;text-wrap:balance;text-align:center;margin-bottom:clamp(32px,4.4vw,52px)}
.w3-h2 em{font-style:normal;color:var(--signal)}
.w3-people{max-width:1240px}
.w3-pp-main{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(32px,6vw,96px);align-items:center}
.w3-pp-text .w3-h2{text-align:left;margin-bottom:28px}
.w3-pp-text p{font-size:17px;line-height:1.6;color:var(--mute);max-width:52ch}
.w3-pp-text p+p{margin-top:14px}
.w3-pp-text .w3-pp-lead{margin-bottom:22px;font-family:var(--disp);font-weight:600;font-size:clamp(22px,2.2vw,30px);line-height:1.2;letter-spacing:-.025em;color:var(--text)}
.w3-polaroid{justify-self:center;width:min(100%,400px);margin:0;padding:14px 14px 0;border-radius:4px;background:#F6F4EF;color:var(--ink);box-shadow:0 34px 70px -30px rgba(0,0,0,.9);rotate:3deg;transition:rotate .6s var(--ease),translate .6s var(--ease)}
.w3-pol-b{width:min(100%,320px);rotate:-4deg}
.w3-polaroid:hover{rotate:0deg;translate:0 -6px}
.w3-pol-img{display:block;aspect-ratio:4/5;overflow:hidden;background:#121212}
.w3-pol-img img{display:block;width:100%;height:100%;object-fit:cover}
.w3-pol-a img{object-fit:contain;object-position:50% 100%}
.w3-pol-b img{object-position:50% 30%}
.w3-polaroid figcaption{display:flex;flex-direction:column;gap:3px;padding:14px 4px 18px}
.w3-polaroid figcaption b{font-family:var(--disp);font-weight:700;font-size:20px;letter-spacing:-.02em}
.w3-polaroid figcaption span{font-size:14px;color:rgba(10,10,10,.62)}
.w3-pp-member{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(28px,5vw,80px);align-items:center;margin-top:clamp(64px,8vw,120px);padding-top:clamp(48px,6vw,80px);border-top:1px solid var(--line)}
.w3-pp-member h3{margin-bottom:18px;font-family:var(--disp);font-weight:700;font-size:clamp(34px,4.4vw,64px);line-height:.95;letter-spacing:-.05em}
.w3-pp-member h3 em{font-style:normal;color:var(--signal)}
.w3:not(.w3-still) [data-in] .w3-polaroid{opacity:0;translate:0 70px;rotate:14deg;transition:opacity .9s var(--ease),translate 1.1s var(--ease),rotate 1.2s var(--ease)}
.w3:not(.w3-still) [data-in] .w3-pp-text{opacity:0;translate:0 30px;transition:opacity .9s var(--ease),translate 1s var(--ease)}
.w3:not(.w3-still) [data-in].in .w3-pp-text{opacity:1;translate:0 0}
.w3:not(.w3-still) [data-in].in .w3-pol-a{opacity:1;translate:0 0;rotate:3deg;transition-delay:.12s}
.w3:not(.w3-still) [data-in].in .w3-pol-b{opacity:1;translate:0 0;rotate:-4deg;transition-delay:.12s}
.w3:not(.w3-still) [data-in].in .w3-polaroid:hover{rotate:0deg;translate:0 -6px;transition-delay:0s}
.w3-contact{display:flex;flex-direction:column;align-items:stretch}
.w3-seg{align-self:center;display:inline-flex;padding:4px;margin-bottom:24px;border-radius:99px;background:rgba(255,255,255,.06)}
.w3-seg button{height:46px;padding:0 24px;border-radius:99px;font-weight:600;font-size:15px;color:var(--mute);transition:background-color .3s,color .3s}
.w3-seg button[aria-pressed="true"]{background:#fff;color:var(--ink)}
.w3-form{display:flex;flex-direction:column;gap:34px;padding:clamp(22px,3.6vw,48px);border-radius:28px;background:#111;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.w3-intro{padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,.08)}
.w3-intro h3{font-family:var(--disp);font-weight:700;font-size:clamp(26px,3vw,40px);letter-spacing:-.04em;line-height:1.02;text-wrap:balance}
.w3-intro p{margin-top:10px;font-size:16px;line-height:1.5;color:var(--mute)}
.w3-q{display:flex;flex-direction:column;gap:14px}
.w3-lab{display:flex;align-items:center;gap:10px;color:var(--text)}
.w3-lab b{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--signal);color:var(--ink);font:700 13px/1 var(--sans)}
.w3-chips{display:flex;flex-wrap:wrap;gap:6px}
.w3-chips button{display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 17px;border-radius:99px;font-size:14.5px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);transition:background-color .3s,color .3s,box-shadow .3s}
.w3-chips button:hover{box-shadow:inset 0 0 0 1px rgba(255,255,255,.45)}
.w3-chips button[aria-pressed="true"]{background:var(--signal);color:var(--ink);box-shadow:none}
.w3-chips[data-join]{display:flex;flex-wrap:wrap;gap:1px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
.w3-chips[data-join] button{flex:1 1 104px;justify-content:center;height:54px;border-radius:0;background:#111;box-shadow:none}
.w3-chips[data-join] button:hover{background:#1A1A1A;box-shadow:none}
.w3-chips[data-join] button[aria-pressed="true"]{background:var(--signal);color:var(--ink)}
.w3-fields{display:grid;grid-template-columns:1fr 1fr;gap:22px 24px}
.w3-field{display:flex;flex-direction:column;gap:8px}
.w3-field.w3-wide{grid-column:1/-1}
.w3-field span{font-size:14px;font-weight:500;line-height:1.3;color:var(--mute)}
.w3-field input,.w3-field textarea{width:100%;font:inherit;font-size:17px;color:var(--text);background:transparent;border:0;border-bottom:1px solid rgba(255,255,255,.18);border-radius:0;padding:8px 0 10px;outline:none;transition:border-color .3s;resize:vertical}
.w3-field input:focus,.w3-field textarea:focus{border-color:var(--signal)}
.w3-field ::placeholder{color:rgba(243,241,236,.3)}
.w3-send{display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding-top:22px;border-top:1px solid rgba(255,255,255,.08)}
.w3-send span{font-size:13.5px;color:var(--mute)}
.w3-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;height:58px;padding:0 22px 0 26px;border-radius:99px;font-family:var(--disp);font-weight:600;font-size:18px;letter-spacing:-.02em;transition:background-color .3s,color .3s}
.w3-btn[data-tone="signal"]{background:var(--signal);color:var(--ink)}
.w3-btn[data-tone="signal"]:hover{background:#fff}
.w3-btn[data-tone="signal"]:disabled{opacity:.6;cursor:progress}
.w3-btn svg{transition:translate .4s var(--ease)}
.w3-btn:hover svg{translate:4px 0}
.w3-thanks{align-items:center;gap:14px;text-align:center}
.w3-thanks h3{font-family:var(--disp);font-weight:600;font-size:clamp(28px,3vw,40px);letter-spacing:-.04em;line-height:1}
.w3-thanks p{color:var(--mute);max-width:44ch;line-height:1.5}
.w3-tick{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:var(--signal);color:var(--ink)}
.w3-link{text-decoration:underline;text-underline-offset:4px;color:var(--mute)}
.w3-careers{max-width:1240px}
.w3-crh{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px 40px;margin-bottom:clamp(28px,4vw,48px)}
.w3-crh .w3-h2{margin:0;text-align:left}
.w3-crh p{display:flex;align-items:center;gap:10px;padding-bottom:8px;font-size:16px;color:var(--mute)}
.w3-crh p b{display:grid;place-items:center;min-width:32px;height:32px;padding:0 9px;border-radius:99px;background:var(--signal);color:var(--ink);font-weight:700}
.w3-roles li{border-top:1px solid var(--line)}
.w3-roles li:last-child{border-bottom:1px solid var(--line)}
.w3-roles a{position:relative;isolation:isolate;display:grid;grid-template-columns:clamp(40px,5vw,72px) 1fr auto 48px;align-items:center;gap:12px 20px;padding:clamp(20px,2.6vw,30px) clamp(10px,1.4vw,22px);transition:color .35s}
.w3-roles a::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--signal);transform:scaleY(0);transform-origin:50% 100%;transition:transform .5s var(--ease)}
.w3-roles a:hover,.w3-roles a:focus-visible{color:var(--ink)}
.w3-roles a:hover::before,.w3-roles a:focus-visible::before{transform:scaleY(1)}
.w3-rn{font-family:var(--disp);font-weight:700;font-size:clamp(18px,1.6vw,22px);color:var(--signal);transition:color .35s}
.w3-roles a:hover .w3-rn{color:var(--ink)}
.w3-roles b{font-family:var(--disp);font-weight:600;font-size:clamp(22px,2.6vw,40px);letter-spacing:-.035em;line-height:1.05}
.w3-rm{display:flex;align-items:center;gap:16px;white-space:nowrap}
.w3-rt{padding:7px 12px;border-radius:99px;box-shadow:inset 0 0 0 1px currentColor;font-size:13.5px;opacity:.8}
.w3-ry{min-width:76px;font-size:14.5px;opacity:.7;text-align:right}
.w3-roles i{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22);transition:background-color .35s,color .35s,box-shadow .35s,rotate .45s var(--ease)}
.w3-roles a:hover i{background:var(--ink);color:var(--signal);box-shadow:none;rotate:-45deg}
.w3-note{margin-top:24px;font-size:14.5px;line-height:1.5;color:var(--mute)}
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

/* all the work: the gallery, and the player over it */
.w3-layer{position:static;background:none}
.w3-x{position:fixed;top:clamp(14px,2vw,24px);right:clamp(14px,2vw,24px);z-index:3;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#fff;color:var(--ink);transition:background-color .3s,rotate .4s var(--ease)}
.w3-x:hover{background:var(--signal);rotate:90deg}
.w3-gal{position:fixed;inset:0;z-index:2147482100;overflow-y:auto;overscroll-behavior:contain;background:#080808;animation:w3in .55s var(--ease)}
@keyframes w3in{from{opacity:0;transform:translate3d(0,48px,0)}}
.w3-gal-in{max-width:1440px;margin:0 auto;padding:clamp(72px,9vw,120px) clamp(16px,4vw,64px) clamp(64px,8vw,120px)}
.w3-gal-h{font-family:var(--disp);font-weight:700;font-size:clamp(44px,6.4vw,96px);line-height:.9;letter-spacing:-.055em;text-wrap:balance}
.w3-gal-h em{font-style:normal;color:var(--signal)}
.w3-gal-sub{margin-top:16px;font-size:17px;color:var(--mute)}
.w3-gal-f{position:sticky;top:0;z-index:2;display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(28px,4vw,44px);padding:14px 64px 14px 0;background:#080808}
.w3-gal-f::after{content:"";position:absolute;left:0;right:0;top:100%;height:28px;background:linear-gradient(#080808,rgba(8,8,8,0));pointer-events:none}
.w3-gal-f button{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 8px 0 9px;border-radius:99px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);font-weight:600;font-size:15px;transition:opacity .3s,background-color .3s,box-shadow .3s}
.w3-gal-f button:first-child{padding-left:18px}
.w3-gal-f button i{display:grid;place-items:center;min-width:26px;height:26px;padding:0 7px;border-radius:99px;background:rgba(255,255,255,.1);font:600 12.5px/1 var(--sans);font-style:normal;font-variant-numeric:tabular-nums}
.w3-gal-f button:hover{background:rgba(255,255,255,.12)}
.w3-gal-f button[aria-pressed="true"]{background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 2px var(--signal)}
.w3-gal-f button[aria-pressed="true"] i{background:var(--signal);color:var(--ink)}
.w3-gal-f[data-on] button:not([aria-pressed="true"]){opacity:.55}
.w3-gal-f[data-on] button:hover{opacity:1}
.w3-gal-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(196px,1fr));grid-auto-flow:dense;gap:32px 16px;margin-top:20px}
.w3-gal-g li[data-wide]{grid-column:span 2}
.w3-film{display:flex;flex-direction:column;gap:12px;width:100%;height:100%;text-align:left}
.w3-film-v{position:relative;display:block;width:100%;aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:#1A1A1A;box-shadow:0 0 0 1px rgba(255,255,255,.1);transition:box-shadow .35s}
li[data-wide] .w3-film-v{aspect-ratio:16/10;flex:1 0 auto}
.w3-film-v video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:scale .6s var(--ease)}
.w3-film-p{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:rgba(10,10,10,.72);color:#fff;transition:background-color .3s,color .3s}
.w3-film:hover .w3-film-v,.w3-film:focus-visible .w3-film-v{box-shadow:0 0 0 2px var(--signal)}
.w3-film:hover .w3-film-v video{scale:1.04}
.w3-film:hover .w3-film-p,.w3-film:focus-visible .w3-film-p{background:var(--signal);color:var(--ink)}
.w3-film-m{display:flex;flex-direction:column;align-items:flex-start;gap:10px}
.w3-film-m b{font-weight:500;font-size:15.5px;line-height:1.35;text-wrap:pretty}
.w3-pl{position:fixed;inset:0;z-index:2147482200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:76px 16px 22px;background:rgba(6,6,6,.96);animation:w3fade .35s var(--ease)}
@keyframes w3fade{from{opacity:0}}
.w3-pl-v{height:min(calc(100vh - 200px),calc((100vw - 32px) / var(--ar)));height:min(calc(100svh - 200px),calc((100vw - 32px) / var(--ar)));aspect-ratio:var(--ar);max-width:100%;border-radius:18px;overflow:hidden;background:#000;box-shadow:0 0 0 1px rgba(255,255,255,.1)}
.w3-pl-v video{display:block;width:100%;height:100%;object-fit:contain;background:#000}
.w3-pl-m{display:flex;align-items:center;gap:14px;width:min(100%,720px)}
.w3-pl-m>b{flex:1;min-width:0;font-family:var(--disp);font-weight:600;font-size:clamp(18px,1.6vw,22px);letter-spacing:-.02em;line-height:1.2}
.w3-pl-n{font-size:14px;color:var(--mute);font-variant-numeric:tabular-nums}
.w3-pl-nav{display:flex;gap:6px}
.w3-pl-nav button{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25);transition:background-color .3s,color .3s,box-shadow .3s}
.w3-pl-nav button:hover{background:#fff;color:var(--ink);box-shadow:none}

@media (max-width:820px){
.w3-links{display:none}.w3-menu{display:inline-flex}
.w3-gal-f{flex-wrap:nowrap;overflow-x:auto;margin-left:-16px;margin-right:-16px;padding:12px 76px 12px 16px;scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 84px),transparent calc(100% - 20px));mask-image:linear-gradient(90deg,#000 calc(100% - 84px),transparent calc(100% - 20px))}
.w3-gal-f::-webkit-scrollbar{display:none}
.w3-gal-f button{flex:none}
.w3-gal-g{grid-template-columns:repeat(2,minmax(0,1fr));gap:26px 12px}
.w3-film-m b{font-size:14.5px}
.w3-film-m .w3-lg{height:26px;padding:0 9px}
.w3-film-m .w3-lg img{height:calc(12px * var(--k,1))}
.w3-pl{padding-top:72px}
.w3-pl-m{flex-wrap:wrap;row-gap:12px}
.w3-pl-m>b{order:-1;flex-basis:100%}
.w3-pl-nav{margin-left:auto}
.w3-head{left:16px;right:16px;bottom:96px;font-size:clamp(46px,13.5vw,76px)}
.w3-side{left:16px;right:16px;bottom:22px;align-items:stretch;text-align:left;max-width:none}
.w3-side p{display:none}.w3-side div>*{flex:1;justify-content:center}
.w3-idx button span{display:none}
.w3-bd span{font-size:11.5px;padding:5px 8px}
.w3-c1 .w3-say{top:17vh}
.w3-tenets{grid-template-columns:1fr;gap:12px;bottom:72px}
.w3-tenets li{padding-top:12px}.w3-tenets span{font-size:14px}
.w3-num{font-size:clamp(80px,13vh,120px)}
.w3-prog2 b{width:72px}
.w3-nums{grid-template-columns:1fr;gap:4px}
.w3-nums div{flex-direction:row;align-items:baseline;gap:14px;padding-top:10px}
.w3-nums strong{font-size:46px}
.w3-fields{grid-template-columns:1fr}
.w3-send .w3-btn{flex:1}
.w3-crh .w3-h2{text-align:left}
.w3-roles a{grid-template-columns:34px minmax(0,1fr) 44px;row-gap:10px}
.w3-rm{grid-column:2;grid-row:2;gap:8px 12px;flex-wrap:wrap;white-space:normal}
.w3-roles i{grid-column:3;grid-row:1/span 2;width:44px;height:44px}
.w3-frow{flex-direction:column;gap:12px}
.w3-frow>*{gap:0 22px}
.w3-frow a,.w3-frow button,.w3-fbase button{min-height:44px}
.w3-fbase{align-items:center}
.w3-idx{display:none}
.w3-pp-main,.w3-pp-member{grid-template-columns:1fr}
.w3-pol-a{width:min(100%,320px)}
.w3-pol-b{width:min(100%,260px)}
}
/* tablets held upright: the phone layout, with room to breathe */
@media (min-width:600px) and (max-width:820px){
.w3-head{font-size:clamp(64px,10vw,96px)}
.w3-c1 .w3-say,.w3-cur .w3-say{font-size:clamp(56px,9vw,84px)}
.w3-c1 .w3-say{top:20vh}
.w3-c3 .w3-say{font-size:clamp(52px,8vw,80px)}
.w3-tenets{grid-template-columns:repeat(3,1fr);gap:20px}
.w3-nums{grid-template-columns:repeat(2,1fr);gap:24px}
.w3-nums div{flex-direction:column;align-items:flex-start;gap:6px;padding-top:16px}
.w3-nums strong{font-size:clamp(56px,11vw,96px)}
.w3-belt{--lh:clamp(30px,4.6vw,40px)}
.w3-fields{grid-template-columns:1fr 1fr}
.w3-pp-main,.w3-pp-member{grid-template-columns:1fr 1fr}
}
.w3-flat{display:flex;flex-direction:column}
.w3-still .w3-c{position:relative;inset:auto;visibility:visible;pointer-events:auto;overflow:visible}
.w3-still .w3-c1,.w3-still .w3-c3{padding:96px clamp(16px,4vw,64px)}
.w3-still .w3-c1 .w3-say,.w3-still .w3-c3h,.w3-still .w3-tenets,.w3-still .w3-mark,.w3-still .w3-prog2{position:static}
.w3-still .w3-tenets{margin-top:56px}
.w3-still .w3-mark{margin-top:40px}
.w3-still .w3-prog2{display:none}
.w3-still .w3-strip{position:relative;height:680px;overflow-x:auto}
.w3-still .w3-fan{position:static;display:flex;gap:14px;width:auto;height:auto;margin-top:48px;overflow-x:auto}
.w3-still .w3-reel{position:relative;left:auto;top:auto;flex:none;opacity:1}
.w3-still .w3-cur{position:relative;transform:none}
.w3-still .w3-sub{opacity:1}
.w3-still .w3-c2 .w3-mark{color:var(--text);padding:0 clamp(16px,4vw,64px)}
@media (prefers-reduced-motion:reduce){.w3 *{transition:none!important;animation:none!important}}
`

/* ─────────────────────────────── The motion ─────────────────────────────── */

// The scroll, in screens: a moment on the landing, then for each page a turn of the globe and
// a hold with the page up front, then a last turn back to the globe before the rest of the site.
const N = PAGES.length
const REST = 0.12 // the landing at rest
const TURN = 1.5 // a turn of the globe from one city to the next
/** How long each chapter stays, in screens: What we do is longer, as it scrolls sideways. */
const HOLDS = [1.6, 3.4, 1.8, 1.8]
const OUT = 0.9 // the globe again, spinning on its own, before the rest of the site
const TILT = -16 // the globe leans towards you, so you see a little of the north
const ENTER = 0.9 // how long a chapter takes to come in, or to go
const holdStart = (k: number) => REST + TURN + HOLDS.slice(0, k).reduce((a, b) => a + b, 0) + k * TURN
const holdEnd = (k: number) => holdStart(k) + HOLDS[k]
const TOTAL = holdEnd(N - 1) + TURN + OUT
const PAGE_TILES = PAGES.map((_, k) => TILES.findIndex((t) => t.page === k))
const VIDEO_TILES = TILES.map((t, i) => (t.page === undefined ? i : -1)).filter((i) => i >= 0)
const PAGE_LON = PAGE_TILES.map((i) => TILES[i].lon)
const HOME_LAT = TILES[PAGE_TILES[0]].lat
/** How far the globe turns between two chapters: from one city to the next one's, and from the last back home to Delhi. */
const GAP = PAGE_LON.map((lon, k) => mod(lon - PAGE_LON[(k + 1) % N], 360))

type Frame = { rot: number; free: 0 | 1 | 2 }

/** Where the globe is turned to at scroll u. */
function motion(u: number, spin: number, spin2: number): Frame {
    if (u < holdStart(0)) {
        // From the landing into the first chapter: whatever way the globe faces, it turns at least
        // a third of a turn forward to India.
        const e = glide((u - REST) / TURN)
        const w0 = mod(spin + PAGE_LON[0] + 120, 360) - 480
        return { rot: -PAGE_LON[0] + w0 * (1 - e), free: e <= 0 ? 1 : 0 }
    }
    const last = holdEnd(N - 1)
    if (u >= last) {
        const e = glide((u - last) / TURN)
        return { rot: -PAGE_LON[N - 1] + GAP[N - 1] * e + wrap(spin2) * e, free: e >= 1 ? 2 : 0 }
    }
    let k = 0
    while (k < N - 1 && u >= holdStart(k + 1)) k++
    const into = u - holdStart(k)
    if (into <= HOLDS[k]) return { rot: -PAGE_LON[k], free: 0 }
    return { rot: -PAGE_LON[k] + GAP[k] * glide((into - HOLDS[k]) / TURN), free: 0 }
}

/** How far into chapter k we are at scroll u: a coming in, b going out, t through its stay. */
function phase(u: number, k: number) {
    return {
        a: smooth((u - (holdStart(k) - ENTER * 0.6)) / ENTER),
        b: smooth((u - (holdEnd(k) - ENTER * 0.4)) / ENTER),
        t: clamp((u - holdStart(k)) / HOLDS[k]),
    }
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
    const { media = NO_MEDIA, samples = true, rest = true, email = "social@worldmedia.co.in", phone = "+91 88000 40301", endpoint = "", brands = "100+", creators = "10,000", style } = props
    const isStatic = useIsStaticRenderer()
    const [reduce, setReduce] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    // The loader: 0 while the page gets ready, 1 while it lifts, 2 once it is gone.
    const [loading, setLoading] = React.useState<0 | 1 | 2>(0)
    const barRef = React.useRef<HTMLElement>(null)
    const [open, setOpen] = React.useState(false)
    const [side, setSide] = React.useState<"brand" | "creator">("brand")
    const [gal, setGal] = React.useState(false)
    const [film, setFilm] = React.useState(-1)
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
    const bodyRef = React.useRef<HTMLDivElement>(null)
    const tilesRef = React.useRef<HTMLDivElement>(null)
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
    const chEls = React.useRef<(HTMLElement | null)[]>([])
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
    // The stage's size: the globe, the chapters and the scroll are all measured from it.
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
    // The sizes of the chapters' parts: a service column, the opening column, a reel.
    const tabletW = phoneW && size.w >= 600
    const spw = phoneW ? Math.round(size.w * (tabletW ? 0.6 : 0.82)) : Math.round(clamp(size.w * 0.3, 340, 480))
    const sp0w = phoneW ? size.w : Math.round(size.w * 0.52)
    const rw = Math.round(phoneW ? Math.min(size.w * 0.34, tabletW ? 220 : 150) : Math.min(size.h * 0.28, 250))

    const key = (media || NO_MEDIA).filter(Boolean).join("\n")
    const items = React.useMemo(() => (key ? key.split("\n") : NO_MEDIA), [key])
    const srcOf = (i: number) => {
        const v = VIDEO_TILES.indexOf(i)
        if (v >= 0 && items[v]) return items[v]
        const id = TILES[i].film
        return id ? (samples ? LOOP(id) : STILL(id)) : ""
    }
    // How many films the fan has room for: two on a phone, three on an upright tablet, five on anything wider.
    const fanCount = !phoneW ? 5 : tabletW ? 3 : 2
    // The gallery and the player sit over the page; while either is open the globe rests.
    const covered = gal || film >= 0
    const setShape = React.useCallback((i: number, ar: number) => {
        const v = clamp(ar, 0.4, 2.4)
        React.startTransition(() => setShapes((o) => (Math.abs(o[i] - v) < 0.01 ? o : o.map((x, j) => (j === i ? v : x)))))
    }, [])
    // A new set of media starts again from the tiles' own shapes, until each video says its own.
    React.useEffect(() => {
        React.startTransition(() => setShapes((o) => (o.every((v, i) => v === TILES[i].ar) ? o : TILES.map((t) => t.ar))))
    }, [items])

    // The motion: one loop reads the scroll and moves the globe, the tiles, the chapters and the menu.
    const state = React.useRef({ cur: 0, spin: -110, spin2: 0, vel: 0, drag: 0 as 0 | 1 | 2, px: 0, last: 0, t0: 0, onIdx: -2, py: 0, tilt: 0, fix: 0 as 0 | 1 | 2, free: 1 as 0 | 1 | 2 })
    React.useEffect(() => {
        const cv = canvasRef.current
        const track = trackRef.current
        const stage = stageRef.current
        if (!cv || !track || !stage) return
        if (!still && !mounted) return
        if (covered) {
            // Nothing here shows while the gallery or a film is open, so the globe and its videos rest.
            if (rootRef.current) rootRef.current.querySelectorAll("video").forEach((v) => v.pause())
            return
        }
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
        const badgeAt = BADGES.map((b) => onGlobe(CITY[b.at][0], CITY[b.at][1]))
        const tileAt = TILES.map((t) => onGlobe(t.lon, t.lat))
        // How wide each tag's label is, so a tag near the screen's edge can turn its label inwards.
        let badgeW = BADGES.map(() => 0)
        const measureBadges = () => {
            badgeW = badgeEls.current.map((el) => (el && el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 0))
        }
        const badgeLeft = BADGES.map((b) => !!b.left)

        if (still) {
            drawScene(ctx, { w: size.w, h: size.h, cx, cy, R, P, rot: -PAGE_LON[0] + 18, tilt: TILT, wz: 0, lift: 0, intro: 1, time: 0 }, kit)
            return
        }

        // The parts of the chapters that the scroll moves.
        const ch = chEls.current
        const all = (k: number, sel: string) => {
            const el = ch[k]
            return el ? Array.from(el.querySelectorAll<HTMLElement>(sel)) : []
        }
        const words1 = all(0, "[data-w]")
        const tenets = all(0, "[data-b]")
        const strip = all(1, "[data-strip]")[0] || null
        const cols = strip ? (Array.from(strip.children) as HTMLElement[]) : []
        const bar = all(1, "[data-bar]")[0] || null
        const count = all(1, "[data-count]")[0] || null
        const extras2 = all(1, ".w3-prog2,.w3-mark")
        const words3 = all(2, "[data-w]")
        const reels = all(2, "[data-r]")
        const sub3 = all(2, "[data-sub]")[0] || null
        const curtain = all(3, "[data-cur]")[0] || null
        const nums = all(3, "[data-b]")
        const counters = all(3, "[data-to]").map((el) => ({ el, m: countable(el.dataset.to || "") }))
        let stripW = size.w
        let mids: number[] = []
        const measure = () => {
            if (!strip) return
            stripW = strip.scrollWidth
            mids = cols.map((c) => c.offsetLeft + c.offsetWidth / 2)
        }
        measure()
        measureBadges()
        if (document.fonts) document.fonts.ready.then(measureBadges).catch(() => {})
        const ro = strip && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
        if (ro && strip) ro.observe(strip)
        const playing = PAGES.map(() => false)

        let raf = 0
        let visible = true
        let blank = false
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
            const rot = motion(u, s.spin, s.spin2).rot

            // Each chapter moves the globe its own way: the why dives into India, what we do pushes
            // it off to the left (it comes back from the right), the work sinks it back, and the
            // brands draw a curtain over it.
            const ph = PAGES.map((_, k) => phase(u, k))
            const on = ph.map((p) => p.a * (1 - p.b))
            const gxMax = size.w / 2 + R * 1.7
            const gx = ph[1].b > 0 ? gxMax * (1 - ph[1].b) : -gxMax * ph[1].a
            const wz = on[0] * (P - 2.2 * R) - 520 * on[2]
            const busy = Math.max(on[0], on[2], on[3], Math.min(1, Math.abs(gx) / gxMax))
            s.tilt += (s.py * 5 * (1 - busy) - s.tilt) * (1 - Math.pow(0.9, dt / 16.7))
            const tilt = TILT + s.tilt + (-HOME_LAT - TILT) * on[0]
            const intro = smooth((now - s.t0) / 1900)
            const gcx = cx + gx

            if (on[3] > 0.999 || Math.abs(gx) > gxMax - 1) {
                if (!blank) ctx.clearRect(0, 0, size.w, size.h)
                blank = true
            } else {
                drawScene(ctx, { w: size.w, h: size.h, cx: gcx, cy, R, P, rot, tilt, wz, lift: busy, intro, time: now }, kit)
                blank = false
            }
            const shift = `translate3d(${gx.toFixed(1)}px,0,0)`
            put(bodyRef.current, "transform", shift)
            put(tilesRef.current, "transform", shift)
            put(worldRef.current, "transform", `translateZ(${wz.toFixed(1)}px)`)
            // The glass body and its halo grow and shrink with the globe as it comes near or sinks back.
            const D = P - wz
            const ballScale = (P / Math.sqrt(Math.max(1, D * D - R * R))).toFixed(4)
            put(ballRef.current, "transform", `scale(${ballScale})`)
            put(haloRef.current, "transform", `scale(${ballScale})`)
            put(haloRef.current, "opacity", (intro * (1 - on[0])).toFixed(3))
            const near = ((1 - busy) * intro).toFixed(3)
            put(crossX.current, "opacity", near)
            put(crossY.current, "opacity", near)
            put(spinRef.current, "transform", `rotateX(${tilt.toFixed(2)}deg) rotateY(${rot.toFixed(2)}deg)`)
            put(veilRef.current, "opacity", Math.max(0.84 * smooth((on[0] - 0.45) / 0.55), 0.6 * on[2]).toFixed(3))

            // How squarely a point of the globe faces you: 1 at the front, 0 at the edge.
            const cr = Math.cos(rot * D2R)
            const sr = Math.sin(rot * D2R)
            const ct = Math.cos(tilt * D2R)
            const st = Math.sin(tilt * D2R)
            const facing = (p: [number, number, number]) => p[1] * st + (p[2] * cr - p[0] * sr) * ct

            // The tiles fade as they near the globe's edge, and their videos rest while out of sight.
            const tileShow = 1 - smooth(on[0] * 1.8)
            tileEls.current.forEach((el, i) => {
                if (!el) return
                const f = facing(tileAt[i])
                put(el, "opacity", (smooth((f + 0.05) / 0.4) * smooth(intro * 1.6 - 0.5 - i * 0.06) * tileShow).toFixed(3))
                const v = tileVids.current[i]
                if (v) {
                    const want = f > -0.1 && tileShow > 0.01 && on[3] < 0.99
                    if (!want && !v.paused) v.pause()
                    else if (want && v.paused) v.play().catch(() => {})
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
                const a = smooth((z1 / R - 0.15) / 0.3) * (1 - busy) * smooth((intro - 0.6) / 0.4)
                const bx = gcx + x0 * sc
                let left = !!BADGES[i].left
                if (left && bx - badgeW[i] - 12 < 8) left = false
                else if (!left && bx + badgeW[i] + 12 > size.w - 8) left = true
                if (left !== badgeLeft[i]) {
                    badgeLeft[i] = left
                    el.toggleAttribute("data-left", left)
                }
                put(el, "opacity", a.toFixed(3))
                put(el, "transform", `translate3d(${bx.toFixed(1)}px,${(cy + y1 * sc).toFixed(1)}px,0)`)
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
            put(wordRef.current, "opacity", (1 - busy).toFixed(3))

            // The chapters. Only transforms and opacity change, so nothing is laid out again.
            ch.forEach((el, k) => {
                if (!el) return
                put(el, "visibility", on[k] > 0.0005 ? "visible" : "hidden")
                el.classList.toggle("live", on[k] > 0.9)
                // Each chapter's own videos play only while it is in view.
                const want = on[k] > 0.05
                if (want !== playing[k]) {
                    playing[k] = want
                    el.querySelectorAll("video").forEach((v) => {
                        if (want) v.play().catch(() => {})
                        else v.pause()
                    })
                }
            })

            // 1. The why: the words rise one by one out of the dark, then the three beliefs.
            if (ch[0]) {
                put(ch[0], "opacity", (1 - ph[0].b).toFixed(3))
                put(ch[0], "transform", `translate3d(0,${(-ph[0].b * 60).toFixed(1)}px,0)`)
                const q = clamp((u - (holdStart(0) - 0.35)) / (HOLDS[0] * 0.8))
                words1.forEach((el, i) => {
                    const v = smooth((q - (0.5 * i) / words1.length) / 0.16)
                    put(el, "transform", `translate3d(0,${((1 - v) * 105).toFixed(1)}%,0)`)
                })
                tenets.forEach((el, j) => {
                    const v = smooth((q - 0.55 - j * 0.08) / 0.2)
                    put(el, "opacity", v.toFixed(3))
                    put(el, "transform", `translate3d(0,${((1 - v) * 40).toFixed(1)}px,0)`)
                })
            }

            // 2. What we do: the orange strip slides in from the right and runs sideways.
            if (ch[1]) {
                const p = ph[1]
                const tt = clamp((p.t - 0.06) / 0.88)
                const span = Math.max(0, stripW - size.w)
                // The strip rests with each service in the middle of the screen, then moves on to the next.
                const stops = mids.map((m, i) => (i === 0 ? 0 : -clamp(m - size.w / 2, 0, span)))
                let off = -tt * span
                if (stops.length > 1) {
                    const seg = tt * (stops.length - 1)
                    const i0 = Math.min(stops.length - 2, Math.floor(seg))
                    off = stops[i0] + (stops[i0 + 1] - stops[i0]) * smooth((seg - i0 - 0.15) / 0.7)
                }
                const x = size.w * (1 - p.a) + off - p.b * size.w
                put(strip, "transform", `translate3d(${x.toFixed(1)}px,0,0)`)
                const show = smooth((on[1] - 0.7) / 0.3).toFixed(3)
                extras2.forEach((el) => put(el, "opacity", show))
                put(bar, "transform", `scaleX(${tt.toFixed(4)})`)
                if (count && mids.length > 1) {
                    const at = size.w / 2 - x
                    let best = 1
                    for (let i = 2; i < mids.length; i++) if (Math.abs(mids[i] - at) < Math.abs(mids[best] - at)) best = i
                    const label = nn(best) + " / " + nn(mids.length - 1)
                    if (count.textContent !== label) count.textContent = label
                }
            }

            // 3. The work: the reels grow out of the globe's centre and fan out.
            if (ch[2]) {
                const p = ph[2]
                const e = on[2]
                const q = clamp((u - (holdStart(2) - 0.4)) / 0.9)
                words3.forEach((el, i) => {
                    const v = smooth((q - (0.5 * i) / words3.length) / 0.2) * (1 - p.b)
                    put(el, "transform", `translate3d(0,${((1 - v) * 105).toFixed(1)}%,0)`)
                })
                put(sub3, "opacity", (smooth((q - 0.55) / 0.35) * (1 - p.b)).toFixed(3))
                // The cards spread as far as they can while the outermost, tilted, still fits on screen.
                const dMax = Math.max(1, (reels.length - 1) / 2)
                const lean = ((dMax * 7 + 2) * Math.PI) / 180
                const reach = rw * (0.5 * Math.cos(lean) + 0.89 * Math.sin(lean))
                const spread = Math.min(phoneW ? size.w : Math.min(rw * 0.8, size.w * 0.145), (size.w / 2 - 16 - reach) / dMax)
                const drop = size.h * ((phoneW ? 0.63 : 0.57) - gyF)
                reels.forEach((el, i) => {
                    const d = i - (reels.length - 1) / 2
                    const x = d * spread * e
                    const y = (d * d * rw * 0.04 + drop) * e
                    const r = (d * 7 + (p.t - 0.5) * 4) * e
                    put(el, "transform", `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg) scale(${(0.12 + 0.88 * e).toFixed(4)})`)
                    put(el, "opacity", smooth(e * 5).toFixed(3))
                    // The card that opens all the films always sits on top, so it is never half hidden.
                    put(el, "zIndex", String(el.classList.contains("w3-more") ? 12 : 10 - Math.round(Math.abs(d) * 2)))
                })
            }

            // 4. The brands: the curtain rises, the numbers count up, the logos roll by.
            if (ch[3]) {
                const p = ph[3]
                put(curtain, "transform", `translate3d(0,${((1 - p.a - p.b) * 100).toFixed(3)}%,0)`)
                const q = clamp((u - (holdStart(3) - 0.45)) / 1.0)
                nums.forEach((el, j) => {
                    const v = smooth((q - j * 0.12) / 0.5)
                    put(el, "opacity", v.toFixed(3))
                    put(el, "transform", `translate3d(0,${((1 - v) * 50).toFixed(1)}px,0)`)
                })
                counters.forEach(({ el, m }) => {
                    if (!m) return
                    const dec = (m[2].split(".")[1] || "").length
                    const v = parseFloat(m[2].replace(/,/g, "")) * smooth(q * 1.1)
                    const text = m[1] + (m[2].includes(",") ? Math.round(v).toLocaleString("en-US") : v.toFixed(dec)) + m[3]
                    if (el.textContent !== text) el.textContent = text
                })
                ch[3].classList.toggle("on", on[3] > 0.01)
            }

            // The menu and the dots follow the chapter in view.
            let cur = -1
            on.forEach((v, k) => {
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
            if (ro) ro.disconnect()
            if (raf) cancelAnimationFrame(raf)
        }
    }, [still, mounted, size, R, P, gyF, rw, phoneW, fanCount, shapes, brands, creators, covered])

    // The loader waits for the fonts, the logos and the first frame of each video on the globe, never
    // more than seven seconds, then lifts while the globe fades in behind it.
    React.useEffect(() => {
        if (isStatic) return
        const root = rootRef.current
        if (!root) return
        const t0 = performance.now()
        let total = 0
        let done = 0
        const track = (p: Promise<unknown>) => {
            total++
            p.then(
                () => done++,
                () => done++
            )
        }
        if (document.fonts) track(document.fonts.ready)
        if (document.readyState !== "complete") track(new Promise((r) => window.addEventListener("load", r, { once: true })))
        root.querySelectorAll<HTMLVideoElement>(".w3-tile video").forEach((v) => {
            if (v.readyState >= 2) return
            track(
                new Promise((r) => {
                    v.addEventListener("loadeddata", r, { once: true })
                    v.addEventListener("error", r, { once: true })
                })
            )
        })
        const html = document.documentElement
        const was = html.style.overflow
        html.style.overflow = "hidden"
        let shown = 0
        let raf = 0
        let timer = 0
        const tick = (now: number) => {
            const want = now - t0 > 7000 || !total ? 1 : done / total
            shown += (want - shown) * 0.08
            if (want === 1 && shown > 0.99) shown = 1
            put(barRef.current, "transform", `scaleX(${shown.toFixed(3)})`)
            if (shown === 1 && now - t0 > 800) {
                html.style.overflow = was
                state.current.t0 = 0
                React.startTransition(() => setLoading(1))
                timer = window.setTimeout(() => React.startTransition(() => setLoading(2)), 700)
                return
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            clearTimeout(timer)
            html.style.overflow = was
        }
    }, [isStatic])

    // Drag the globe sideways to spin it (up and down still scrolls the page), and lean it a
    // little towards the pointer.
    const onDown = (e: React.PointerEvent) => {
        const s = state.current
        if (still || !s.free || (e.target as HTMLElement).closest(".w3-c,a,button")) return
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

    // The menu sends the globe round to a chapter, or scrolls to a section.
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
            // What we do opens at its start, so the strip can still run sideways; the rest open in the middle.
            const u = to < 0 ? 0 : holdStart(to) + HOLDS[to] * (to === 1 ? 0.05 : 0.5)
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

    // The gallery and the player each remember what opened them, so closing one puts focus back there.
    const openers = React.useRef<(HTMLElement | null)[]>([])
    const remember = () => {
        openers.current.push(document.activeElement as HTMLElement | null)
    }
    const restore = () => {
        const el = openers.current.pop()
        if (el && el.isConnected) setTimeout(() => el.focus({ preventScroll: true }), 0)
    }
    const openAll = () => {
        remember()
        React.startTransition(() => setGal(true))
    }
    const closeAll = () => {
        React.startTransition(() => setGal(false))
        restore()
    }
    const play = (i: number) => {
        if (film < 0) remember()
        React.startTransition(() => setFilm(i))
    }
    const closeFilm = () => {
        React.startTransition(() => setFilm(-1))
        restore()
    }
    const step = (d: number) => React.startTransition(() => setFilm((i) => mod(i + d, FILMS.length)))
    const layer = film >= 0 ? 2 : gal ? 1 : 0
    const closeTop = React.useRef(closeAll)
    closeTop.current = layer === 2 ? closeFilm : closeAll
    // While one is open: Escape closes it, the arrow keys move between films, Tab stays inside, and the
    // page underneath holds still.
    React.useEffect(() => {
        if (!layer) return
        const top = document.querySelector<HTMLElement>(layer === 2 ? ".w3-pl" : ".w3-gal")
        const x = top ? top.querySelector<HTMLElement>(".w3-x") : null
        if (x && top && !top.contains(document.activeElement)) x.focus({ preventScroll: true })
        const html = document.documentElement
        const was = html.style.overflow
        html.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault()
                closeTop.current()
                return
            }
            if (layer === 2 && (e.key === "ArrowRight" || e.key === "ArrowLeft") && !(e.target instanceof HTMLVideoElement)) {
                e.preventDefault()
                step(e.key === "ArrowRight" ? 1 : -1)
                return
            }
            if (e.key !== "Tab" || !top) return
            const els = Array.from(top.querySelectorAll<HTMLElement>("button,video[controls]"))
            if (!els.length) return
            const first = els[0]
            const last = els[els.length - 1]
            if (!top.contains(document.activeElement) || (e.shiftKey ? document.activeElement === first : document.activeElement === last)) {
                e.preventDefault()
                ;(e.shiftKey ? last : first).focus()
            }
        }
        document.addEventListener("keydown", onKey)
        return () => {
            document.removeEventListener("keydown", onKey)
            html.style.overflow = was
        }
    }, [layer])

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
        <div className="w3-gl" ref={tilesRef}>
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
                                            poster={t.film && src === LOOP(t.film) ? STILL(t.film) : undefined}
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
        </div>
    )

    const stats: [string, string][] = [
        [brands, "Brands"],
        [creators, "Creators"],
    ]
    const bodies = [<ChapterWhy key="why" />, <ChapterServices key="services" samples={samples} />, <ChapterWork key="work" samples={samples} count={fanCount} play={play} all={openAll} />, <ChapterBrands key="brands" stats={stats} />]
    const chapters = PAGES.map((pg, k) => (
        <section
            key={pg.id}
            id={"w3-" + pg.id}
            className={"w3-c w3-c" + (k + 1)}
            aria-label={pg.title}
            ref={(el) => {
                chEls.current[k] = el
            }}
        >
            {bodies[k]}
        </section>
    ))

    const vars = cssVars({ "--R": R + "px", "--P": P + "px", "--gy": gyF * 100 + "%", "--spw": spw + "px", "--sp0w": sp0w + "px", "--rw": rw + "px" })

    return (
        <div ref={rootRef} className={"w3" + (still ? " w3-still" : "")} style={{ ...style, ...vars }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={FONT_HREF} />
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            {!isStatic && loading < 2 ? (
                <div className={"w3-load" + (loading ? " out" : "")} role="status">
                    <div>
                        <MiniGlobe size={56} period={3.2} />
                        <b>
                            <i ref={barRef} />
                        </b>
                        <span className="w3-sr">Loading World Media</span>
                    </div>
                </div>
            ) : null}
            <div className="w3-track" ref={trackRef} style={{ height: still ? "auto" : Math.round((TOTAL + 1) * size.h) + "px" }}>
                <div className="w3-stage" ref={stageRef} id="w3-top" onPointerDown={onDown}>
                    <div className="w3-word" ref={wordRef} aria-hidden="true">
                        world media.
                    </div>
                    <div className="w3-cross x" ref={crossX} aria-hidden="true" />
                    <div className="w3-cross y" ref={crossY} aria-hidden="true" />
                    <div className="w3-gl" ref={bodyRef} aria-hidden="true">
                        <div className="w3-halo" ref={haloRef} />
                        <div className="w3-ball" ref={ballRef} />
                    </div>
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
                    {still ? null : (
                        <>
                            <div className="w3-veil" ref={veilRef} />
                            {chapters}
                        </>
                    )}
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
                                    {nn(i + 1)} {pg.title}
                                </span>
                                <i />
                            </button>
                        ))}
                    </div>
                    {still ? nav : null}
                </div>
                {still ? <div className="w3-flat">{chapters}</div> : null}
            </div>
            {rest ? (
                <div className="w3-rest">
                    <Founder />
                    <Contact email={email} endpoint={endpoint} side={side} setSide={setSide} />
                    <Careers email={email} />
                    <Footer email={email} phone={phone} go={go} />
                </div>
            ) : null}
            {!still && mounted ? createPortal(<div className="w3">{nav}{sheet}</div>, document.body) : null}
            {mounted && layer
                ? createPortal(
                      <div className="w3 w3-layer">
                          {gal ? <Gallery onClose={closeAll} onPlay={play} paused={film >= 0} still={still} /> : null}
                          {film >= 0 ? <Player i={film} onClose={closeFilm} step={step} /> : null}
                      </div>,
                      document.body
                  )
                : null}
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
    samples: { type: ControlType.Boolean, title: "Videos", defaultValue: true, enabledTitle: "Play", disabledTitle: "Stills", description: "Stills shows a still from each film instead of playing it." },
    brands: { type: ControlType.String, title: "Brands", defaultValue: "100+", description: "The numbers on The brands. They count up as the curtain rises." },
    creators: { type: ControlType.String, title: "Creators", defaultValue: "10,000" },
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
