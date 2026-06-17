import { useState, useEffect, useCallback, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

const API = "https://bfp-votes.wayf-974.workers.dev"
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
const SANS = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

const CATEGORIES = [
    "Landing Pages & Heroes", "Layout & Structure", "Animation & Effects",
    "CMS & Dynamic Content", "Copywriting & Messaging", "SEO & Performance",
    "Forms & Conversion", "Responsive & Mobile", "Design Systems & Theming", "Interactions & Scroll",
]

interface Props { label: string; style?: CSSProperties }

/**
 * Submit a prompt — opens a modal form, posts to the moderation queue
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function SubmitModal(props: Props) {
    const { label = "Submit" } = props
    const isStatic = useIsStaticRenderer()
    const [open, setOpen] = useState(false)
    const [hover, setHover] = useState(false)
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [f, setF] = useState({ title: "", category: "", prompt: "", displayName: "", link: "" })

    useEffect(() => {
        if (!open || typeof document === "undefined") return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
        window.addEventListener("keydown", onKey)
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey) }
    }, [open])

    const set = (k: string) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }))

    const submit = useCallback((e: any) => {
        e.preventDefault()
        if (!f.title.trim() || !f.prompt.trim()) return
        setStatus("sending")
        fetch(API + "/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, displayName: f.displayName.trim() || "anonymous" }) })
            .then((r) => r.json())
            .then((d) => { setStatus(d && d.ok ? "done" : "error") })
            .catch(() => setStatus("error"))
    }, [f])

    const close = () => { setOpen(false); setTimeout(() => { setStatus("idle"); setF({ title: "", category: "", prompt: "", displayName: "", link: "" }) }, 200) }

    const inputStyle: CSSProperties = { width: "100%", boxSizing: "border-box", background: "rgb(15,15,17)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "12px 13px", fontFamily: SANS, fontSize: 14, color: "rgb(237,237,239)", outline: "none" }
    const labelStyle: CSSProperties = { display: "block", fontFamily: SANS, fontSize: 13, fontWeight: 500, color: "rgb(150,150,156)", marginBottom: 7 }

    const trigger = (
        <button type="button" onClick={() => setOpen(true)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{ ...props.style, background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: SANS, fontSize: 14, color: hover ? "rgb(240,240,242)" : "rgb(150,150,156)", transition: "color 180ms ease", whiteSpace: "nowrap" }}>
            {label}
        </button>
    )

    if (isStatic || typeof document === "undefined") return trigger

    const modal = open ? createPortal(
        <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.66)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", fontFamily: SANS }}>
            <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
                style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto", background: "rgb(16,16,18)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: 28, boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
                <button onClick={close} aria-label="Close" style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "rgb(140,140,147)", fontSize: 24, lineHeight: 1, cursor: "pointer" }}>×</button>
                {status === "done" ? (
                    <div style={{ textAlign: "center", padding: "24px 8px" }}>
                        <div style={{ fontSize: 30, marginBottom: 12 }}>✓</div>
                        <h2 style={{ margin: "0 0 8px", fontFamily: SANS, fontSize: 22, fontWeight: 500, color: "rgb(240,240,242)" }}>Thanks — got it.</h2>
                        <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgb(150,150,156)", lineHeight: 1.5 }}>We review every submission and add the good ones to the directory. If you left a link, we'll credit you.</p>
                        <button onClick={close} style={{ background: "rgb(240,240,242)", color: "rgb(10,10,11)", border: "none", borderRadius: 10, padding: "11px 20px", fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <h2 style={{ margin: "0 0 6px", fontFamily: SANS, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", color: "rgb(240,240,242)" }}>Submit a prompt</h2>
                        <p style={{ margin: "0 0 20px", fontSize: 14, color: "rgb(150,150,156)", lineHeight: 1.5 }}>Got a prompt that reliably gets great results from the Framer agent? Share it — the best ones get added to the directory.</p>
                        <div style={{ marginBottom: 15 }}>
                            <label style={labelStyle}>Title</label>
                            <input required value={f.title} onChange={set("title")} placeholder="e.g. SaaS Hero That Converts" style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <label style={labelStyle}>Category</label>
                            <select value={f.category} onChange={set("category")} style={{ ...inputStyle, appearance: "none" }}>
                                <option value="">Choose a category</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <label style={labelStyle}>Prompt</label>
                            <textarea required value={f.prompt} onChange={set("prompt")} placeholder="Paste the full prompt. Use [brackets] for things people should customize." rows={5} style={{ ...inputStyle, resize: "vertical", minHeight: 110, lineHeight: 1.5 }} />
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <label style={labelStyle}>Display name <span style={{ color: "rgb(108,108,116)", fontWeight: 400 }}>· optional</span></label>
                            <input value={f.displayName} onChange={set("displayName")} placeholder="@yourhandle — leave blank to post anonymously" style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: 22 }}>
                            <label style={labelStyle}>Link (optional)</label>
                            <input type="url" value={f.link} onChange={set("link")} placeholder="https://your-site.com" style={inputStyle} />
                        </div>
                        {status === "error" ? <p style={{ color: "rgb(255,120,120)", fontSize: 13, marginBottom: 12 }}>Something went wrong — please try again.</p> : null}
                        <button type="submit" disabled={status === "sending"} style={{ width: "100%", background: "rgb(240,240,242)", color: "rgb(10,10,11)", border: "none", borderRadius: 10, padding: "14px 20px", fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: status === "sending" ? "default" : "pointer", opacity: status === "sending" ? 0.7 : 1, transition: `transform 160ms ${EASE}` }}>
                            {status === "sending" ? "Sending…" : "Submit prompt"}
                        </button>
                    </form>
                )}
            </div>
        </div>, document.body) : null

    return (<>{trigger}{modal}</>)
}

addPropertyControls(SubmitModal, {
    label: { type: ControlType.String, title: "Label", defaultValue: "Submit" },
})
