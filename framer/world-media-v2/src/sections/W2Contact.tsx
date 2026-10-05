//@@ INSTRUCTIONS
// User instructions: rebuild the World Media website as one landing page from the website
// brief: a creative landing like rabenrifaie.com, project navigation like another.gr,
// the tonality and plain-spoken copy of twoplusone.co (pictorial, big text, a bit of colour).
// This file: Contact and Join us, as the brief asks: one square card at the end with a
// switch between Brand and Creator, and the form changes with the choice. Brands send a
// brief; creators apply to join the roster. "Contact" in the menu opens the brand side,
// "Join us" the creator side. Entries go to the Form endpoint (e.g. Formspree) if one is set,
// otherwise they open a pre-filled email to the Send to address.
//@@ BODY

type Mode = "brand" | "creator"

type ContactItem = { label: string; value: string; href: string }

type ContactProps = {
    first: boolean
    title: string
    sub: string
    contacts: ContactItem[]
    endpoint: string
    sendTo: string
    brandTitle: string
    creatorTitle: string
    needs: string
    budgets: string
    platforms: string
    followers: string
    brandButton: string
    creatorButton: string
    brandThanks: string
    creatorThanks: string
    promise: string
    style?: React.CSSProperties
}

const CONTACT_CSS = `
.w2c-wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,auto);gap:clamp(28px,4cqw,72px);align-items:start;padding:clamp(72px,8cqw,128px) var(--gut) clamp(40px,4cqw,64px)}
.w2c-left{position:sticky;top:96px;display:flex;flex-direction:column;gap:clamp(22px,2.4cqw,34px);max-width:640px}
.w2c-left .w2-lbl{color:var(--mut)}
.w2c-left .w2-h2 .w2-it{color:var(--red)}
.w2c-sub{max-width:34ch;font-size:clamp(16px,1.3cqw,19px);line-height:1.4;font-weight:400;color:var(--mut)}
.w2c-reach{display:grid;grid-template-columns:1fr 1fr;gap:18px 24px;margin-top:6px}
.w2c-reach li{display:flex;flex-direction:column;gap:4px;padding-top:12px;border-top:1px solid var(--line);min-width:0}
.w2c-reach small{font-size:12px;color:var(--mut)}
.w2c-reach a,.w2c-reach span{font-size:clamp(15px,1.15cqw,17px);letter-spacing:-.015em;overflow-wrap:anywhere}
.w2c-reach a{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;transition:background-size .5s var(--ease)}
.w2c-reach a:hover{background-size:100% 1px}
.w2c-card{--ac:var(--red);--acf:var(--ink);--dot:var(--red);position:relative;display:flex;flex-direction:column;width:min(620px,46cqw);aspect-ratio:1/1;padding:clamp(20px,2cqw,30px);border-radius:var(--r);background:#FFFFFF;
box-shadow:0 1px 0 rgba(0,0,0,.05),0 40px 80px -48px rgba(0,0,0,.35);border:1px solid rgba(0,0,0,.1);transition:box-shadow .6s}
.w2c-card[data-mode="creator"]{--ac:var(--ink);--acf:var(--paper);--dot:var(--paper)}
.w2c-top{display:flex;align-items:center;justify-content:space-between;gap:14px}
.w2c-am{font-size:13px;color:var(--mut)}
.w2c-tog{position:relative;display:grid;grid-template-columns:1fr 1fr;padding:4px;border-radius:99px;background:var(--paper2);flex:none;width:230px}
.w2c-knob{position:absolute;top:4px;bottom:4px;left:4px;width:calc(50% - 4px);border-radius:99px;background:var(--ac);transition:translate .55s cubic-bezier(.3,1.4,.5,1),background-color .45s}
.w2c-card[data-mode="creator"] .w2c-knob{translate:100% 0}
.w2c-tog button{position:relative;z-index:1;height:38px;border:0;background:none;border-radius:99px;font-size:14.5px;font-weight:500;cursor:pointer;color:var(--ink);opacity:.55;transition:opacity .3s}
.w2c-tog button[aria-checked="true"]{opacity:1;color:var(--acf);transition:opacity .3s,color .3s .1s}
.w2c-h{margin:clamp(16px,1.6cqw,24px) 0 clamp(12px,1.2cqw,18px);font-size:clamp(24px,2.2cqw,34px);line-height:1.04;letter-spacing:-.04em}
.w2c-form{flex:1;display:flex;flex-direction:column;min-height:0}
.w2c-fields{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;align-content:start}
.w2c-f{display:flex;flex-direction:column;gap:4px;min-width:0}
.w2c-f.wide{grid-column:1/-1}
.w2c-f label,.w2c-lab{font-size:11.5px;letter-spacing:.03em;text-transform:uppercase;color:var(--mut)}
.w2c-f label i{font-style:normal;color:var(--red);margin-left:3px}
.w2c-f input,.w2c-f select,.w2c-f textarea{width:100%;border:0;border-bottom:1px solid rgba(10,10,10,.22);border-radius:0;background:transparent;padding:7px 0 8px;font:inherit;font-size:16px;font-weight:400;color:var(--ink);outline:none;transition:border-color .3s}
.w2c-f textarea{resize:none;min-height:64px;line-height:1.4}
.w2c-f select{appearance:none;-webkit-appearance:none;cursor:pointer;background-color:#FFFFFF;color:var(--ink);background:#FFFFFF url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%230A0A0A' stroke-width='1.6'><path d='M1 1.5l5 5 5-5'/></svg>") right 2px center no-repeat}
.w2c-f input::placeholder,.w2c-f textarea::placeholder{color:rgba(10,10,10,.4)}
.w2c-f input:focus,.w2c-f select:focus,.w2c-f textarea:focus{border-color:var(--ink)}
.w2c-f [aria-invalid="true"]{border-color:var(--red)}
.w2c-err{font-size:12px;color:#C2321A}
.w2c-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.w2c-chips button{height:30px;padding:0 12px;border-radius:99px;border:1px solid rgba(10,10,10,.2);background:transparent;font-size:13px;font-weight:500;cursor:pointer;transition:background-color .3s,border-color .3s}
.w2c-chips button[aria-pressed="true"]{background:var(--ac);color:var(--acf);border-color:transparent}
.w2c-chips button:hover{border-color:var(--ink)}
.w2c-foot{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:auto;padding-top:16px}
.w2c-send.w2-pill{--pc:var(--ink);--pt:var(--paper);height:48px;padding:0 24px;font-size:15px}
.w2c-send .w2c-dot{width:9px;height:9px;border-radius:50%;background:var(--dot);transition:background-color .4s}
.w2c-send[disabled]{opacity:.6;cursor:progress}
.w2c-note{font-size:12px;color:var(--mut);text-align:right}
.w2c-done{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px}
.w2c-done .w2c-badge{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:var(--ac);color:var(--acf)}
.w2c-done p{font-size:clamp(22px,2cqw,30px);line-height:1.12;letter-spacing:-.035em;max-width:20ch}
.w2c-done button{align-self:flex-start;border:0;background:none;padding:0;font-size:14px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;color:var(--mut)}
@container (max-width:1000px){.w2c-wrap{grid-template-columns:1fr}.w2c-left{position:relative;top:0}.w2c-card{width:100%;aspect-ratio:auto}}
@container (max-width:560px){.w2c-fields{grid-template-columns:1fr}.w2c-reach{grid-template-columns:1fr}.w2c-top{flex-direction:column;align-items:flex-start}.w2c-tog{width:100%}.w2c-foot{flex-direction:column;align-items:stretch}.w2c-note{text-align:left}}
`

const list = (s: string) =>
    String(s || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

function Field(p: { id: string; label: string; need?: boolean; error?: string; wide?: boolean; children: React.ReactNode }) {
    return (
        <div className={"w2c-f" + (p.wide ? " wide" : "")}>
            <label htmlFor={p.id}>
                {p.label}
                {p.need ? <i aria-hidden="true">*</i> : null}
            </label>
            {p.children}
            {p.error ? (
                <span className="w2c-err" id={p.id + "-e"} role="alert">
                    {p.error}
                </span>
            ) : null}
        </div>
    )
}

function Chips(p: { label: string; items: string[]; value: string[]; onChange: (v: string[]) => void; single?: boolean }) {
    return (
        <div className="w2c-f wide" role="group" aria-label={p.label}>
            <span className="w2c-lab">{p.label}</span>
            <div className="w2c-chips">
                {p.items.map((it) => {
                    const on = p.value.includes(it)
                    return (
                        <button
                            key={it}
                            type="button"
                            aria-pressed={on}
                            onClick={() => p.onChange(p.single ? (on ? [] : [it]) : on ? p.value.filter((v) => v !== it) : p.value.concat(it))}
                        >
                            {it}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function W2Contact(props: ContactProps) {
    const {
        title = "Got a brand worth talking about? *Or a following worth backing?*",
        sub = "Pick your side, fill in the card, and a real person gets back to you within a day.",
        contacts = [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
        ],
        endpoint = "",
        sendTo = "social@worldmedia.co.in",
        brandTitle = "Tell us what you’re building.",
        creatorTitle = "Tell us what you make.",
        needs = "Influencer marketing, Celebrity marketing, Talent management, Creative strategy, Video production, Performance marketing, Content writing",
        budgets = "Under ₹5L, ₹5–15L, ₹15–50L, ₹50L+, Not sure yet",
        platforms = "Instagram, YouTube, Snapchat, X, LinkedIn, Other",
        followers = "Under 10K, 10K–100K, 100K–1M, 1M+",
        brandButton = "Send the brief",
        creatorButton = "Join the roster",
        brandThanks = "Got it. Your brief is with the team, and you’ll hear back within a day.",
        creatorThanks = "Welcome aboard (almost). We’ll look through your work and get back to you within a week.",
        promise = "* needed · we reply within a day",
        first = false,
        style,
    } = props

    const still = useStill()
    const [mode, setMode] = React.useState<Mode>("brand")
    const [sent, setSent] = React.useState<"" | "sent" | "mail">("")
    const [busy, setBusy] = React.useState(false)
    const [fail, setFail] = React.useState(false)
    const [errs, setErrs] = React.useState<Record<string, string>>({})
    const [picks, setPicks] = React.useState<Record<string, string[]>>({ needs: [], platforms: [] })
    const formRef = React.useRef<HTMLFormElement>(null)
    const uid = React.useId().replace(/:/g, "")
    const id = (k: string) => "w2c" + uid + k

    // The menu's Contact and Join us links, and #join in the address, pick the side.
    React.useEffect(() => {
        const pickMode = (m: Mode) =>
            React.startTransition(() => {
                setMode(m)
                setSent("")
                setErrs({})
            })
        const onEvent = (e: Event) => {
            const d = (e as CustomEvent).detail
            if (d === "creator" || d === "brand") pickMode(d)
        }
        const onHash = () => {
            if (window.location.hash === "#join") pickMode("creator")
            else if (window.location.hash === "#contact") pickMode("brand")
        }
        onHash()
        window.addEventListener("w2:form", onEvent)
        window.addEventListener("hashchange", onHash)
        return () => {
            window.removeEventListener("w2:form", onEvent)
            window.removeEventListener("hashchange", onHash)
        }
    }, [])

    const choose = (m: Mode) => {
        setMode(m)
        setErrs({})
        setFail(false)
    }
    const onKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault()
            choose(mode === "brand" ? "creator" : "brand")
        }
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const f = formRef.current
        if (!f) return
        const fd = new FormData(f)
        const v = (k: string) => String(fd.get(k) || "").trim()
        const er: Record<string, string> = {}
        if (!v("name")) er.name = "Tell us your name."
        if (mode === "brand") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) er.email = "That email doesn’t look right."
            if (!v("message")) er.message = "A line or two is plenty."
        } else {
            if (!v("handle")) er.handle = "Where can we see your work?"
            const c = v("reach")
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.replace(/\D/g, "").length < 8) er.reach = "An email or a WhatsApp number, please."
        }
        setErrs(er)
        const bad = Object.keys(er)
        if (bad.length) {
            const first = f.querySelector('[name="' + bad[0] + '"]') as HTMLElement | null
            if (first) first.focus()
            return
        }
        const fields: [string, string][] =
            mode === "brand"
                ? [
                      ["Name", v("name")],
                      ["Email", v("email")],
                      ["Company", v("company")],
                      ["Budget", v("budget")],
                      ["Looking for", (picks.needs || []).join(", ")],
                      ["Message", v("message")],
                  ]
                : [
                      ["Name", v("name")],
                      ["Handle", v("handle")],
                      ["Email or WhatsApp", v("reach")],
                      ["Followers", v("followers")],
                      ["Platforms", (picks.platforms || []).join(", ")],
                      ["About their content", v("message")],
                  ]
        const subject = mode === "brand" ? "New brief from " + v("name") + (v("company") ? " (" + v("company") + ")" : "") : "Creator application: " + v("handle")
        if (!endpoint) {
            const body = fields
                .filter(([, x]) => x)
                .map(([k, x]) => k + ": " + x)
                .join("\n")
            window.location.href = "mailto:" + sendTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
            setSent("mail")
            return
        }
        setBusy(true)
        setFail(false)
        try {
            const out = new FormData()
            out.append("form_type", mode)
            fields.forEach(([k, x]) => out.append(k, x))
            out.append("_subject", subject)
            if (mode === "brand") out.append("_replyto", v("email"))
            const r = await fetch(endpoint, { method: "POST", body: out, headers: { Accept: "application/json" } })
            if (!r.ok) throw new Error("status " + r.status)
            f.reset()
            setPicks({ needs: [], platforms: [] })
            setSent("sent")
        } catch {
            setFail(true)
        } finally {
            setBusy(false)
        }
    }

    const inv = (k: string) => (errs[k] ? { "aria-invalid": true as const, "aria-describedby": id(k) + "-e" } : {})
    const dur = still ? 0 : 0.32
    const dir = mode === "brand" ? -1 : 1

    const brand = (
        <div className="w2c-fields">
            <Field id={id("name")} label="Name" need error={errs.name}>
                <input id={id("name")} name="name" autoComplete="name" placeholder="Your name…" {...inv("name")} />
            </Field>
            <Field id={id("email")} label="Email" need error={errs.email}>
                <input id={id("email")} name="email" type="email" autoComplete="email" spellCheck={false} placeholder="you@brand.com" {...inv("email")} />
            </Field>
            <Field id={id("company")} label="Company">
                <input id={id("company")} name="company" autoComplete="organization" placeholder="Brand or company…" />
            </Field>
            <Field id={id("budget")} label="Budget">
                <select id={id("budget")} name="budget" defaultValue="">
                    <option value="" disabled>
                        Pick a range
                    </option>
                    {list(budgets).map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </Field>
            <Chips label="What are you looking for?" items={list(needs)} value={picks.needs || []} onChange={(x) => setPicks({ ...picks, needs: x })} />
            <Field id={id("message")} label="Message" need wide error={errs.message}>
                <textarea id={id("message")} name="message" rows={3} placeholder="The product, the audience, the dream outcome…" {...inv("message")} />
            </Field>
        </div>
    )

    const creator = (
        <div className="w2c-fields">
            <Field id={id("name")} label="Name" need error={errs.name}>
                <input id={id("name")} name="name" autoComplete="name" placeholder="Your name…" {...inv("name")} />
            </Field>
            <Field id={id("handle")} label="Handle or link" need error={errs.handle}>
                <input id={id("handle")} name="handle" placeholder="@yourhandle" autoCapitalize="none" autoComplete="off" spellCheck={false} {...inv("handle")} />
            </Field>
            <Field id={id("reach")} label="Email or WhatsApp" need error={errs.reach}>
                <input id={id("reach")} name="reach" placeholder="you@mail.com or +91 98…" autoComplete="off" spellCheck={false} {...inv("reach")} />
            </Field>
            <Field id={id("followers")} label="Followers">
                <select id={id("followers")} name="followers" defaultValue="">
                    <option value="" disabled>
                        Roughly
                    </option>
                    {list(followers).map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </Field>
            <Chips label="Where do you post?" items={list(platforms)} value={picks.platforms || []} onChange={(x) => setPicks({ ...picks, platforms: x })} />
            <Field id={id("message")} label="Your niche, your best work" wide>
                <textarea id={id("message")} name="message" rows={3} placeholder="What you make, who watches, a link to a post you’re proud of…" />
            </Field>
        </div>
    )

    const [cardRef, cardOn] = useReveal<HTMLDivElement>(0.15)
    return (
        <Section tone="paper" id="contact" className="w2c" css={CONTACT_CSS} label="Contact" style={style}>
            <div className="w2c-wrap">
                <div className="w2c-left">
                    <Label name="Contact" index={5} />
                    <Words as={first ? "h1" : "h2"} className="w2-h2" text={title} stagger={0.045} />
                    <Reveal as="p" className="w2c-sub w2-rise" delay={0.2}>
                        {sub}
                    </Reveal>
                    <Reveal as="ul" className="w2c-reach w2-rise" delay={0.3}>
                        {contacts.map((c, i) => (
                            <li key={i}>
                                <small>{c.label}</small>
                                {c.href ? (
                                    <a href={c.href} target={c.href.indexOf("http") === 0 ? "_blank" : undefined} rel="noreferrer">
                                        {c.value}
                                    </a>
                                ) : (
                                    <span>{c.value}</span>
                                )}
                            </li>
                        ))}
                    </Reveal>
                </div>
                <div ref={cardRef} id="join" className={"w2c-card w2-rise" + cardOn} data-mode={mode}>
                    <div className="w2c-top">
                        <span className="w2c-am" id={id("am")}>
                            I’m a
                        </span>
                        <div className="w2c-tog" role="radiogroup" aria-labelledby={id("am")} onKeyDown={onKey}>
                            <span className="w2c-knob" aria-hidden="true" />
                            <button type="button" role="radio" aria-checked={mode === "brand"} tabIndex={mode === "brand" ? 0 : -1} onClick={() => choose("brand")}>
                                Brand
                            </button>
                            <button type="button" role="radio" aria-checked={mode === "creator"} tabIndex={mode === "creator" ? 0 : -1} onClick={() => choose("creator")}>
                                Creator
                            </button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        {sent ? (
                            <motion.div
                                key={"done-" + mode}
                                className="w2c-done"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: dur }}
                                role="status"
                            >
                                <span className="w2c-badge" aria-hidden="true">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 13.5l4.6 4.6L20 8.6" />
                                    </svg>
                                </span>
                                <p>{sent === "mail" ? "Your email app should be open with everything filled in. Hit send and we’ll take it from there." : mode === "brand" ? brandThanks : creatorThanks}</p>
                                <button type="button" onClick={() => setSent("")}>
                                    Send another
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key={mode}
                                ref={formRef}
                                className="w2c-form"
                                noValidate
                                onSubmit={submit}
                                initial={{ opacity: 0, x: 24 * dir }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 * dir }}
                                transition={{ duration: dur }}
                            >
                                <h3 className="w2c-h">{mode === "brand" ? brandTitle : creatorTitle}</h3>
                                {mode === "brand" ? brand : creator}
                                <div className="w2c-foot">
                                    <button type="submit" className="w2-pill w2c-send" disabled={busy}>
                                        <span className="w2c-dot" aria-hidden="true" />
                                        <Roll>{busy ? "Sending…" : mode === "brand" ? brandButton : creatorButton}</Roll>
                                    </button>
                                    <span className="w2c-note">{fail ? "That didn’t go through. Try again, or write to " + sendTo : promise}</span>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Section>
    )
}

addPropertyControls(W2Contact, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Got a brand worth talking about? *Or a following worth backing?*",
        displayTextArea: true,
        description: "Words between *stars* are set in red italic.",
    },
    sub: { type: ControlType.String, title: "Intro", defaultValue: "Pick your side, fill in the card, and a real person gets back to you within a day.", displayTextArea: true },
    contacts: {
        type: ControlType.Array,
        title: "Contacts",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Label" },
                value: { type: ControlType.String, title: "Text" },
                href: { type: ControlType.String, title: "Link" },
            },
        },
        defaultValue: [
            { label: "Write to us", value: "social@worldmedia.co.in", href: "mailto:social@worldmedia.co.in" },
            { label: "Call us", value: "+91 8800 040 301", href: "tel:+918800040301" },
            { label: "Instagram", value: "@[worldmedia]", href: "" },
            { label: "Where we sit", value: "Gurugram, India", href: "" },
        ],
    },
    endpoint: {
        type: ControlType.String,
        title: "Form endpoint",
        defaultValue: "",
        placeholder: "https://formspree.io/f/…",
        description: "Where entries are sent (Formspree, Getform, a webhook). Empty = opens a pre-filled email instead.",
    },
    sendTo: { type: ControlType.String, title: "Send to", defaultValue: "social@worldmedia.co.in" },
    brandTitle: { type: ControlType.String, title: "Brand title", defaultValue: "Tell us what you’re building." },
    needs: {
        type: ControlType.String,
        title: "Brand options",
        displayTextArea: true,
        defaultValue: "Influencer marketing, Celebrity marketing, Talent management, Creative strategy, Video production, Performance marketing, Content writing",
    },
    budgets: { type: ControlType.String, title: "Budgets", defaultValue: "Under ₹5L, ₹5–15L, ₹15–50L, ₹50L+, Not sure yet" },
    brandButton: { type: ControlType.String, title: "Brand button", defaultValue: "Send the brief" },
    brandThanks: { type: ControlType.String, title: "Brand thanks", displayTextArea: true, defaultValue: "Got it. Your brief is with the team, and you’ll hear back within a day." },
    creatorTitle: { type: ControlType.String, title: "Creator title", defaultValue: "Tell us what you make." },
    platforms: { type: ControlType.String, title: "Platforms", defaultValue: "Instagram, YouTube, Snapchat, X, LinkedIn, Other" },
    followers: { type: ControlType.String, title: "Follower ranges", defaultValue: "Under 10K, 10K–100K, 100K–1M, 1M+" },
    creatorButton: { type: ControlType.String, title: "Creator button", defaultValue: "Join the roster" },
    creatorThanks: {
        type: ControlType.String,
        title: "Creator thanks",
        displayTextArea: true,
        defaultValue: "Welcome aboard (almost). We’ll look through your work and get back to you within a week.",
    },
    promise: { type: ControlType.String, title: "Small print", defaultValue: "* needed · we reply within a day" },
    first: {
        type: ControlType.Boolean,
        title: "Opens the page",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No",
        description: "When Contact is the first thing on a page, its title becomes the page's main heading.",
    },
})
