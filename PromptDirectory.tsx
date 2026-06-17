import { useState, useEffect, useMemo, useCallback, type CSSProperties } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"

const API = "https://bfp-votes.wayf-974.workers.dev"
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)"
const SANS = '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace'

interface Prompt {
    slug: string
    title: string
    category: string
    difficulty: "Starter" | "Intermediate" | "Advanced"
    description: string
    prompt: string
    tags: string[]
    featured?: boolean
}

const CATEGORIES = [
    "Landing Pages & Heroes",
    "Layout & Structure",
    "Animation & Effects",
    "CMS & Dynamic Content",
    "Copywriting & Messaging",
    "SEO & Performance",
    "Forms & Conversion",
    "Responsive & Mobile",
    "Design Systems & Theming",
    "Interactions & Scroll",
]

const PROMPTS: Prompt[] = [
    { slug: "saas-hero-that-converts", title: "SaaS Hero That Converts", category: "Landing Pages & Heroes", difficulty: "Starter", featured: true, tags: ["hero", "saas", "cta"], description: "A focused above-the-fold hero with one clear value prop and a single primary CTA.", prompt: `Build a complete, conversion-focused hero section for [product] — a [one-line description] for [target audience].

Structure, top to bottom:
1. A small eyebrow tag with a category or credibility cue.
2. An H1 of 6–9 words that leads with the single biggest OUTCOME the user gets — not a feature.
3. A one-sentence subhead naming who it's for and the main objection it removes.
4. A primary CTA button '[primary action]' paired with a lower-emphasis secondary link '[secondary action]'.
5. A thin trust strip (e.g. '[N] teams' or 5–6 grayscale logos).
6. A product visual anchored at the fold edge.

Style: center-aligned, one max-width container, generous vertical padding, large confident type with tight tracking on the headline, calm background — no rainbow gradients, one accent color used only on the primary CTA. Hierarchy must read headline → subhead → CTA. Responsive: stack and shrink the headline on mobile, full-width CTA under 480px. Add a subtle fade-and-rise on load for the headline, subhead and CTA, staggered ~60ms. Ensure AA contrast throughout.` },
    { slug: "above-the-fold-story", title: "Above-the-Fold Story", category: "Landing Pages & Heroes", difficulty: "Intermediate", tags: ["editorial", "hero"], description: "An editorial opening that leads with a statement, not a sales pitch.", prompt: `Create an opening section for [brand] that leads with one bold statement — a single large sentence — about the change you make for [customers], followed by a restrained supporting line and one text link. No stacked buttons, no stat row; let typography and space carry it. Left-align everything to a narrow column and keep the surrounding whitespace generous.` },
    { slug: "alternating-feature-rows", title: "Alternating Feature Rows", category: "Layout & Structure", difficulty: "Starter", tags: ["layout", "features"], description: "Alternating image/text rows that explain a product without clutter.", prompt: `Add a features section with [3] alternating two-column rows. Each row has a short heading, one supporting paragraph, a 3-item benefit list, and a visual on the opposite side. Alternate the image side each row, keep a consistent vertical rhythm, align everything to one max-width, and stack to a single column on mobile with the image first.` },
    { slug: "bento-grid-section", title: "Bento Grid Section", category: "Layout & Structure", difficulty: "Intermediate", tags: ["bento", "grid"], description: "A modern bento grid mixing feature tiles of different sizes.", prompt: `Build a bento grid of [6] tiles in an asymmetric layout: one large tile spanning 2 columns, the rest standard. Each tile has an icon, a short title and one line of copy on a subtle surface with a 1px border and a consistent radius. Keep the gaps even, balance the visual weight across the grid, and reflow it to a single column on small screens.` },
    { slug: "scroll-reveal-sections", title: "Scroll Reveal Sections", category: "Animation & Effects", difficulty: "Intermediate", featured: true, tags: ["scroll", "reveal", "motion"], description: "Subtle fade-and-rise as each section enters the viewport.", prompt: `Add a cohesive scroll-reveal system across the whole page so content animates in as the user scrolls.

For every top-level section: start its contents at opacity 0 and translated 24px down, then animate to full opacity and position when ~25% of the section enters the viewport. Use a 0.5s ease-out curve (cubic-bezier(0.16, 1, 0.3, 1)), and stagger direct children by 60–80ms so elements cascade instead of appearing all at once. Play each reveal only once — don't re-trigger on scroll up.

Rules: never delay the above-the-fold hero (it should be instant); when prefers-reduced-motion is on, drop the movement and keep a simple opacity fade; only animate transform and opacity for performance; keep distances subtle; and make sure nothing causes layout shift or a horizontal scrollbar on mobile. Apply it consistently to headings, paragraphs, cards and images so the page feels like one intentional system.` },
    { slug: "magnetic-hover-buttons", title: "Magnetic Hover Buttons", category: "Animation & Effects", difficulty: "Advanced", tags: ["hover", "buttons", "motion"], description: "Buttons that react gently to the cursor for a premium feel.", prompt: `Give the primary buttons a refined hover state: scale to 1.03, lift 2px, and ease the background slightly lighter over 0.25s with a spring. Add a matching pressed state that scales to 0.98. Keep it tasteful — no big bounces or color flips — and disable the motion under prefers-reduced-motion.` },
    { slug: "blog-from-a-cms-collection", title: "Blog From a CMS Collection", category: "CMS & Dynamic Content", difficulty: "Intermediate", featured: true, tags: ["cms", "blog"], description: "A full blog index and detail setup backed by a CMS collection.", prompt: `Set up a complete, editable blog powered by the Framer CMS.

1. Create a 'Posts' collection with fields: Title, Slug (auto), Excerpt, Cover (image), Author, Date, Reading time, Tags (multi-option), and Body (rich text).
2. Build an index page at /blog: a responsive 3-column card grid (2 on tablet, 1 on mobile) sorted by Date descending. Each card shows the cover (16:9, rounded), tags, title, a 2-line-clamped excerpt, and an author + date meta row. Add a tag filter bar at the top.
3. Build a detail template at /blog/:slug: a centered reading column (max 720px), large title, meta row, cover, then the Body styled for long-form reading — comfortable line-height, generous paragraph spacing, styled headings, blockquotes, code blocks, and images that can break slightly wider than the text. End with previous/next post navigation and a back-to-blog link.
4. Add SEO: per-post title and meta description from the fields, plus an Open Graph image from the cover.

Seed 3 example posts so I can see it working end to end.` },
    { slug: "rewrite-copy-to-be-benefit-led", title: "Rewrite Copy to Be Benefit-Led", category: "Copywriting & Messaging", difficulty: "Starter", featured: true, tags: ["copy", "messaging"], description: "Turn feature-heavy copy into outcome-focused messaging.", prompt: `Audit and rewrite all the copy on this page so it's benefit-led and sharp, not feature-led or generic.

For each section, in order: (1) show me the current copy, (2) name the one outcome the reader cares about most, (3) rewrite it.

Rules: lead every section with the outcome or transformation for [target audience], then support it with the 'how'. Cut filler and hedging; ban empty adjectives like 'powerful', 'seamless', 'robust' and 'cutting-edge' unless proven. Prefer short, concrete sentences and specific nouns and numbers over vague claims. Make every CTA action-specific — never 'Learn more'; say what happens next. Hold one consistent voice: [confident but warm, plain-spoken].

Also: tighten the H1 to under 10 words, give each section exactly one job, and flag any two sections that say the same thing. Use smart quotes and em-dashes. Don't invent facts, testimonials or stats — mark anything needing a real number as [TODO]. Show me a before/after for each change.` },
    { slug: "set-up-seo-meta-and-og", title: "Set Up SEO Meta and OG", category: "SEO & Performance", difficulty: "Intermediate", featured: true, tags: ["seo", "meta", "open-graph"], description: "Per-page titles, descriptions, and social share images.", prompt: `Do a full on-page SEO and social-sharing pass on this site.

For every page: write a unique title under 60 characters that leads with the primary keyword, and a compelling meta description under 155 characters. Set the canonical URL. Add Open Graph and Twitter (summary_large_image) tags — title, description, and a 1200×630 share image.

Structure and semantics: exactly one H1 per page with a logical H2/H3 outline; descriptive alt text on every meaningful image and empty alt on decorative ones; semantic landmarks (header, main, nav, footer).

Technical: generate sitemap.xml and robots.txt, set a favicon and apple-touch-icon, and make sure no important page is noindex by accident. Add JSON-LD where it fits — Organization on the home page, Article on blog posts, BreadcrumbList where relevant. Finish with a short per-page checklist of exactly what changed.` },
    { slug: "speed-and-image-audit", title: "Speed and Image Audit", category: "SEO & Performance", difficulty: "Advanced", tags: ["performance", "images"], description: "Find and fix what is slowing the page down.", prompt: `Audit this page for performance: flag oversized images and export them at appropriate dimensions, lazy-load anything below the fold, remove unused fonts and weights, and point out heavy embeds or scripts. Give me a short prioritized list of fixes and the expected impact of each.` },
    { slug: "pricing-table-with-3-tiers", title: "Pricing Table With 3 Tiers", category: "Forms & Conversion", difficulty: "Intermediate", featured: true, tags: ["pricing", "conversion"], description: "A clean, scannable pricing section with a highlighted plan.", prompt: `Build a polished, conversion-optimized pricing section with three tiers: Starter, Pro and Scale.

Each card shows the plan name, a one-line 'best for' description, the price with a '/mo' suffix in tabular numbers, a short feature list with checkmark icons, and a CTA button. Highlight Pro as recommended: a subtle accent border, a 'Most popular' badge, and a slightly elevated surface.

Add a monthly/annual toggle above the cards that updates every price and shows the annual saving (e.g. 'Save 20%'). Below the cards, add one reassurance line (e.g. 'No credit card required · Cancel anytime'). Layout: three equal-height cards in a row on desktop with consistent padding and radius; stack on mobile with Pro first. Use one accent color, only on the Pro highlight and the CTAs. Align feature rows across cards, keep the CTAs as the focal point, and meet AA contrast.` },
    { slug: "newsletter-capture-that-works", title: "Newsletter Capture That Works", category: "Forms & Conversion", difficulty: "Starter", tags: ["email", "forms"], description: "A focused email capture with a clear incentive and success state.", prompt: `Add a newsletter section with a benefit-led headline ('[what they get]'), a single email field, and a subscribe button. Validate the email, show an inline success message after submit, and connect it to [email tool]. Keep it one line on desktop, stacked on mobile, with a small privacy reassurance under the field.` },
    { slug: "fix-mobile-layout-overflow", title: "Fix Mobile Layout Overflow", category: "Responsive & Mobile", difficulty: "Starter", featured: true, tags: ["mobile", "responsive"], description: "Diagnose and fix horizontal scroll and cramped spacing on mobile.", prompt: `Do a thorough mobile QA pass and fix everything broken at small sizes. Test at 390px and 320px wide.

Find and fix: (1) any horizontal overflow or sideways scroll — track down the offending element, usually a fixed width, a negative margin, or an image missing max-width 100%; (2) body text smaller than 16px; (3) tap targets under 44×44px; (4) multi-column sections that should collapse to one column; (5) sections with desktop-sized padding that feel cramped on mobile; (6) headings too large that wrap awkwardly; (7) the navigation — collapse it into a working hamburger/drawer if it doesn't fit.

Keep the desktop layout untouched and only adjust the relevant breakpoint(s), preserving visual order when stacking. Give me a per-section list of exactly what changed, and confirm there's no horizontal scroll at 320px.` },
    { slug: "design-tokens-and-type-scale", title: "Design Tokens and Type Scale", category: "Design Systems & Theming", difficulty: "Advanced", tags: ["tokens", "typography"], description: "Establish consistent color and type variables across the site.", prompt: `Create a design system for this site: color tokens (background, surface, text, muted, border, accent), a modular type scale (display, h1–h4, body, caption), and a spacing scale. Apply them consistently to every section so styling is uniform. Use [accent] as the only accent color and make sure all text meets WCAG AA contrast.` },
    { slug: "add-a-real-dark-mode", title: "Add a Real Dark Mode", category: "Design Systems & Theming", difficulty: "Advanced", tags: ["dark-mode", "theming"], description: "A proper dark theme driven by shared color tokens.", prompt: `Add a dark mode driven by color tokens, not hard-coded colors. Define dark values for every token (background, surfaces, text, borders), keep contrast at AA, and add a toggle in the nav that remembers the visitor's choice. Check that images and logos still read well on the dark background.` },
    { slug: "sticky-nav-with-scroll-state", title: "Sticky Nav With Scroll State", category: "Interactions & Scroll", difficulty: "Intermediate", featured: true, tags: ["nav", "sticky", "scroll"], description: "A header that turns solid after the user scrolls.", prompt: `Turn the top navigation into a polished sticky header with a scroll-aware state.

At the top of the page (scroll = 0): transparent background, no border, full height, logo and links in their resting style. After scrolling past ~80px: animate to a condensed state — a blurred or solid background (backdrop-blur with a semi-opaque fill), a subtle 1px bottom border, slightly reduced height and logo size — transitioning smoothly over ~0.25s; never snap.

Behavior: the nav stays fixed at the top and sits above all content with the right z-index; highlight the link for the section currently in view (scroll-spy) and smooth-scroll on click. On mobile, collapse the links into a hamburger that opens an accessible drawer — focus-trapped, closes on Esc and on link tap, background scroll locked. Keep it a real nav element with full keyboard support and visible focus states.` },
    { slug: "faq-accordion-section", title: "FAQ Accordion Section", category: "Interactions & Scroll", difficulty: "Intermediate", tags: ["faq", "accordion"], description: "An accessible FAQ where one answer opens at a time.", prompt: `Build an FAQ section from a list of [questions]. Each row shows the question with a +/− indicator; tapping expands the answer with a smooth height transition and rotates the icon. Use generous padding, a 1px divider between rows, allow only one open at a time, and make the whole thing keyboard accessible.` },
]

const DIFF_COLORS: Record<string, { c: string; b: string; bg: string }> = {
    Starter: { c: "rgb(110,231,168)", b: "rgba(110,231,168,0.30)", bg: "rgba(110,231,168,0.08)" },
    Intermediate: { c: "rgb(122,184,255)", b: "rgba(122,184,255,0.30)", bg: "rgba(122,184,255,0.08)" },
    Advanced: { c: "rgb(211,160,255)", b: "rgba(211,160,255,0.30)", bg: "rgba(211,160,255,0.08)" },
}

/**
 * BigFatPrompts Directory — search, category filter, copy + real upvotes
 *
 * @framerIntrinsicWidth 1100
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function PromptDirectory(props: { style?: CSSProperties }) {
    const isStatic = useIsStaticRenderer()
    const [query, setQuery] = useState("")
    const [category, setCategory] = useState("All")
    const [counts, setCounts] = useState<Record<string, number>>({})
    const [voted, setVoted] = useState<Record<string, boolean>>({})
    const [copied, setCopied] = useState<string | null>(null)
    const [openSlug, setOpenSlug] = useState<string | null>(null)
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
    const openPrompt = openSlug ? PROMPTS.find((p) => p.slug === openSlug) || null : null

    useEffect(() => {
        if (typeof document === "undefined" || !openSlug) return
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenSlug(null) }
        window.addEventListener("keydown", onKey)
        return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey) }
    }, [openSlug])

    useEffect(() => {
        if (isStatic || typeof window === "undefined") return
        const slugs = PROMPTS.map((p) => p.slug).join(",")
        fetch(API + "/?slugs=" + encodeURIComponent(slugs))
            .then((r) => r.json())
            .then((d) => { if (d && typeof d === "object") setCounts(d) })
            .catch(() => {})
        try {
            const v: Record<string, boolean> = {}
            PROMPTS.forEach((p) => { if (window.localStorage.getItem("bfp_voted_" + p.slug) === "1") v[p.slug] = true })
            setVoted(v)
        } catch (e) {}
    }, [isStatic])

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return PROMPTS.filter((p) => {
            if (category !== "All" && p.category !== category) return false
            if (!q) return true
            const hay = (p.title + " " + p.description + " " + p.tags.join(" ") + " " + p.category + " " + p.prompt).toLowerCase()
            return hay.indexOf(q) !== -1
        }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }, [query, category])

    const copy = useCallback((p: Prompt) => {
        try { if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(p.prompt) } catch (e) {}
        setCopied(p.slug)
        if (typeof window !== "undefined") window.setTimeout(() => setCopied((c) => (c === p.slug ? null : c)), 1400)
    }, [])

    const vote = useCallback((p: Prompt) => {
        if (typeof window === "undefined") return
        const isVoted = !!voted[p.slug]
        const next = !isVoted
        const delta = next ? 1 : -1
        setVoted((v) => ({ ...v, [p.slug]: next }))
        setCounts((c) => ({ ...c, [p.slug]: Math.max(0, (c[p.slug] || 0) + delta) }))
        try {
            if (next) window.localStorage.setItem("bfp_voted_" + p.slug, "1")
            else window.localStorage.removeItem("bfp_voted_" + p.slug)
        } catch (e) {}
        fetch(API + "/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: p.slug, delta }) })
            .then((r) => r.json())
            .then((d) => { if (d && typeof d.count === "number") setCounts((c) => ({ ...c, [p.slug]: d.count })) })
            .catch(() => {})
    }, [voted])

    return (
        <div style={{ ...props.style, width: "100%", fontFamily: SANS, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Search */}
            <div style={{ width: "100%", maxWidth: 580, display: "flex", alignItems: "center", gap: 11, padding: "0 18px", background: "rgb(15,15,17)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 13, overflow: "hidden" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="7" stroke="rgb(120,120,128)" strokeWidth="2" />
                    <path d="m20 20-3.5-3.5" stroke="rgb(120,120,128)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search prompts — try “hero”, “scroll”, “pricing”…"
                    aria-label="Search prompts"
                    style={{ flex: 1, width: "100%", background: "transparent", border: "none", outline: "none", padding: "16px 0", fontFamily: SANS, fontSize: 15, color: "rgb(237,237,239)" }}
                />
                {query ? (
                    <button onClick={() => setQuery("")} aria-label="Clear search" style={{ flexShrink: 0, background: "transparent", border: "none", color: "rgb(120,120,128)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
                ) : null}
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 26 }}>
                {["All", ...CATEGORIES].map((cat) => {
                    const active = category === cat
                    return (
                        <button key={cat} onClick={() => setCategory(cat)} aria-pressed={active}
                            style={{ fontFamily: SANS, fontSize: 13, fontWeight: active ? 500 : 400, color: active ? "rgb(237,237,239)" : "rgb(150,150,156)", background: active ? "rgba(255,255,255,0.10)" : "transparent", border: "1px solid " + (active ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"), borderRadius: 999, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap", transition: `color 160ms ease, background 160ms ease, border-color 160ms ease`, lineHeight: 1.1 }}>
                            {cat}
                        </button>
                    )
                })}
            </div>

            {/* Count */}
            <div style={{ marginTop: 22, marginBottom: 18, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgb(120,120,128)" }}>
                {filtered.length} {filtered.length === 1 ? "prompt" : "prompts"}{category !== "All" ? " in " + category : ""}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{ padding: "60px 20px 80px", textAlign: "center", color: "rgb(120,120,128)", fontSize: 15 }}>
                    No prompts match “{query}”. Try a different term or category.
                </div>
            ) : (
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>
                    {filtered.map((p) => {
                        const isCopied = copied === p.slug
                        const isVoted = !!voted[p.slug]
                        const dc = DIFF_COLORS[p.difficulty]
                        const count = counts[p.slug] || 0
                        return (
                            <article key={p.slug} onClick={() => setOpenSlug(p.slug)} onMouseEnter={() => setHoveredSlug(p.slug)} onMouseLeave={() => setHoveredSlug((s) => (s === p.slug ? null : s))} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 18, background: hoveredSlug === p.slug ? "rgb(20,20,23)" : "rgb(15,15,17)", border: "1px solid " + (hoveredSlug === p.slug ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"), borderRadius: 14, cursor: "pointer", transition: "background 180ms ease, border-color 180ms ease" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgb(150,150,156)" }}>{p.category}</span>
                                    <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: dc.c, background: dc.bg, border: "1px solid " + dc.b, borderRadius: 999, padding: "3px 8px", whiteSpace: "nowrap" }}>{p.difficulty}</span>
                                </div>
                                <h3 style={{ margin: 0, fontFamily: SANS, fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3, color: "rgb(237,237,239)" }}>{p.title}</h3>
                                <p style={{ margin: 0, fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: "rgb(150,150,156)" }}>{p.description}</p>
                                <div style={{ fontFamily: MONO, fontSize: 12, lineHeight: 1.6, color: "rgb(166,166,173)", background: "rgb(10,10,11)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "11px 12px", whiteSpace: "pre-wrap", maxHeight: 132, overflow: "hidden", position: "relative", WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent)", maskImage: "linear-gradient(180deg, #000 70%, transparent)" }}>{p.prompt}</div>
                                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                                    <ActionButton active={isCopied} activeColor="rgb(110,231,168)" activeBorder="rgba(110,231,168,0.42)" activeBg="rgba(110,231,168,0.10)" onClick={() => copy(p)} label={isCopied ? "Copied" : "Copy"}
                                        icon={isCopied ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>} />
                                    <ActionButton active={isVoted} activeColor="rgb(237,237,239)" activeBorder="rgba(255,255,255,0.24)" activeBg="rgba(255,255,255,0.09)" onClick={() => vote(p)} label={String(count)}
                                        icon={<path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />} />
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}

            {openPrompt && !isStatic ? (
                <div onClick={() => setOpenSlug(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.66)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", fontFamily: SANS }}>
                    <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" style={{ position: "relative", width: "100%", maxWidth: 640, maxHeight: "86vh", display: "flex", flexDirection: "column", background: "rgb(16,16,18)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18, boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}>
                        <button onClick={() => setOpenSlug(null)} aria-label="Close" style={{ position: "absolute", top: 14, right: 16, background: "none", border: "none", color: "rgb(140,140,147)", fontSize: 24, lineHeight: 1, cursor: "pointer", zIndex: 2 }}>×</button>
                        <div style={{ padding: "28px 28px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgb(150,150,156)" }}>{openPrompt.category}</span>
                                <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: DIFF_COLORS[openPrompt.difficulty].c, background: DIFF_COLORS[openPrompt.difficulty].bg, border: "1px solid " + DIFF_COLORS[openPrompt.difficulty].b, borderRadius: 999, padding: "3px 8px" }}>{openPrompt.difficulty}</span>
                            </div>
                            <h2 style={{ margin: "0 0 8px", fontFamily: SANS, fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, color: "rgb(240,240,242)" }}>{openPrompt.title}</h2>
                            <p style={{ margin: 0, fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: "rgb(160,160,166)" }}>{openPrompt.description}</p>
                        </div>
                        <div style={{ overflowY: "auto", padding: "0 28px", flex: 1, minHeight: 0 }}>
                            <div style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.65, color: "rgb(206,206,212)", background: "rgb(10,10,11)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{openPrompt.prompt}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 28px 22px", marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            <button onClick={() => copy(openPrompt)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: copied === openPrompt.slug ? "rgb(46,168,104)" : "rgb(240,240,242)", color: copied === openPrompt.slug ? "#fff" : "rgb(10,10,11)", border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 180ms ease" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">{copied === openPrompt.slug ? <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="2" /><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>}</svg>
                                {copied === openPrompt.slug ? "Copied" : "Copy prompt"}
                            </button>
                            <button onClick={() => vote(openPrompt)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: voted[openPrompt.slug] ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.02)", color: voted[openPrompt.slug] ? "rgb(237,237,239)" : "rgb(170,170,176)", border: "1px solid " + (voted[openPrompt.slug] ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.12)"), borderRadius: 10, padding: "12px 16px", fontFamily: MONO, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span style={{ fontVariantNumeric: "tabular-nums" }}>{counts[openPrompt.slug] || 0}</span>
                            </button>
                            <span style={{ marginLeft: "auto", fontFamily: SANS, fontSize: 12.5, color: "rgb(110,110,118)" }}>Paste into the Framer agent</span>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

function ActionButton(props: { active: boolean; activeColor: string; activeBorder: string; activeBg: string; onClick: () => void; label: string; icon: any }) {
    const [hover, setHover] = useState(false)
    const [pressed, setPressed] = useState(false)
    const { active } = props
    return (
        <button type="button" onClick={props.onClick}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPressed(false) }}
            onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 12, fontWeight: 500, lineHeight: 1, color: active ? props.activeColor : hover ? "rgb(224,224,228)" : "rgb(150,150,156)", background: active ? props.activeBg : hover ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: "1px solid " + (active ? props.activeBorder : hover ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)"), borderRadius: 8, padding: "7px 11px", cursor: "pointer", transform: pressed ? "scale(0.97)" : "scale(1)", transition: `transform 160ms ${EASE}, color 180ms ease, background 180ms ease, border-color 180ms ease` }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">{props.icon}</svg>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{props.label}</span>
        </button>
    )
}

addPropertyControls(PromptDirectory, {})
