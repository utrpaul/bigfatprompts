/* BigFatPrompts dataset — placeholder; replaced by generated dataset before launch */
window.SITE = {
  github: "https://github.com/wayfdigital/bigfatprompts",
  submit: ""
};

window.CATEGORIES = [
  { slug: "landing-pages", name: "Landing Pages & Heroes", description: "Hero sections, above-the-fold, full landing pages." },
  { slug: "layout-structure", name: "Layout & Structure", description: "Page structure, sections, grids, visual hierarchy." },
  { slug: "animation-effects", name: "Animation & Effects", description: "Scroll animations, hovers, transitions, motion." },
  { slug: "cms-content", name: "CMS & Dynamic Content", description: "Blogs, collections, dynamic lists, filtering." },
  { slug: "copywriting", name: "Copywriting & Messaging", description: "Headlines, value props, CTAs, microcopy." },
  { slug: "seo-performance", name: "SEO & Performance", description: "Meta tags, OG images, speed, semantic structure." },
  { slug: "forms-conversion", name: "Forms & Conversion", description: "Forms, lead capture, pricing, social proof." },
  { slug: "responsive-mobile", name: "Responsive & Mobile", description: "Breakpoints, mobile layouts, touch targets." },
  { slug: "design-systems", name: "Design Systems & Theming", description: "Tokens, type scale, components, dark mode." },
  { slug: "interactions-scroll", name: "Interactions & Scroll", description: "Sticky nav, scroll triggers, modals, tabs." }
];

window.PROMPTS = [
  {
    title: "SaaS Hero That Converts",
    slug: "saas-hero-converts",
    category: "landing-pages",
    description: "A focused above-the-fold hero with a clear value prop and one primary CTA.",
    prompt: "Build a hero section for [product name], a [one-line description]. Include an eyebrow tag, a benefit-led headline (max 8 words) focused on the outcome for [target audience], a one-sentence subhead, one primary CTA button ‘[CTA text]’ and a subtle secondary link. Keep it center-aligned, generous whitespace, large bold type, and a soft gradient background. Add a faint product screenshot or abstract visual below the fold edge.",
    tags: ["hero", "saas", "cta"],
    useCase: "Launching a product",
    difficulty: "Starter",
    featured: true
  },
  {
    title: "Scroll Reveal Sections",
    slug: "scroll-reveal-sections",
    category: "animation-effects",
    description: "Fade-and-rise reveal as each section enters the viewport.",
    prompt: "Add a scroll reveal animation to every main section: elements should start at 0% opacity and 24px lower, then animate to full opacity and position as they enter the viewport. Use a 0.5s ease-out curve, stagger child elements by 60ms, and only animate once. Keep it subtle and performant — no animation on mobile if it causes layout shift.",
    tags: ["scroll", "reveal", "motion"],
    useCase: "Adding polish",
    difficulty: "Intermediate",
    featured: true
  },
  {
    title: "Blog From a CMS Collection",
    slug: "blog-cms-collection",
    category: "cms-content",
    description: "A full blog index + detail setup backed by a CMS collection.",
    prompt: "Create a Blog CMS collection with fields: Title, Slug, Excerpt, Cover Image, Author, Date, Body (rich text), Tags. Build an index page with a responsive 3-column card grid sorted by newest first, and a detail page template that renders the body with good typography (max 720px reading width). Add tag filtering on the index.",
    tags: ["cms", "blog", "collection"],
    useCase: "Content sites",
    difficulty: "Intermediate",
    featured: true
  },
  {
    title: "Rewrite Copy to Be Benefit-Led",
    slug: "rewrite-benefit-led-copy",
    category: "copywriting",
    description: "Turn feature-heavy copy into outcome-focused messaging.",
    prompt: "Review all the copy on this page and rewrite it to be benefit-led, not feature-led. For each section, lead with the outcome for [target audience], keep sentences short, cut filler and adjectives, and make every CTA action-specific. Keep my brand voice [confident but friendly]. Show me the before/after for each change.",
    tags: ["copy", "messaging", "voice"],
    useCase: "Improving conversion",
    difficulty: "Starter",
    featured: true
  },
  {
    title: "Pricing Table With 3 Tiers",
    slug: "pricing-table-3-tiers",
    category: "forms-conversion",
    description: "A clean, scannable pricing section with a highlighted plan.",
    prompt: "Create a 3-tier pricing section (Starter, Pro, Scale). Each card shows plan name, price with /mo, a one-line description, a feature list with checkmarks, and a CTA button. Highlight the Pro plan with an accent border and a ‘Most popular’ badge. Add a monthly/annual toggle that updates prices. Make it fully responsive — cards stack on mobile.",
    tags: ["pricing", "conversion", "cards"],
    useCase: "Selling plans",
    difficulty: "Intermediate",
    featured: true
  },
  {
    title: "Fix Mobile Layout Overflow",
    slug: "fix-mobile-overflow",
    category: "responsive-mobile",
    description: "Diagnose and fix horizontal scroll and cramped spacing on mobile.",
    prompt: "Audit this page at 390px width and fix all mobile issues: eliminate horizontal overflow, ensure text is at least 16px, tap targets are at least 44px, stack multi-column sections into a single column, and reduce section padding to comfortable mobile spacing. Tell me exactly what you changed for each breakpoint.",
    tags: ["mobile", "responsive", "fix"],
    useCase: "Pre-launch QA",
    difficulty: "Starter",
    featured: true
  },
  {
    title: "Sticky Nav With Scroll State",
    slug: "sticky-nav-scroll-state",
    category: "interactions-scroll",
    description: "A header that shrinks and gains a background after scrolling.",
    prompt: "Make the top navigation sticky. On page load it should be transparent with no border; after the user scrolls 80px, animate it to a solid blurred background with a bottom border and slightly reduced height. Keep the transition smooth (0.25s). Ensure links stay accessible and the active section is highlighted.",
    tags: ["nav", "sticky", "scroll"],
    useCase: "Navigation polish",
    difficulty: "Intermediate",
    featured: false
  },
  {
    title: "Set Up SEO Meta + OG",
    slug: "seo-meta-og",
    category: "seo-performance",
    description: "Per-page titles, descriptions, and social share images.",
    prompt: "Set up SEO for this site: give every page a unique title (under 60 chars) and meta description (under 155 chars) targeting [primary keyword]. Add Open Graph and Twitter card tags with a 1200×630 share image, set the canonical URL, add descriptive alt text to all images, and make sure headings follow a logical H1→H2 structure.",
    tags: ["seo", "meta", "open-graph"],
    useCase: "Before launch",
    difficulty: "Intermediate",
    featured: true
  },
  {
    title: "Design Tokens & Type Scale",
    slug: "design-tokens-type-scale",
    category: "design-systems",
    description: "Establish consistent color and typography variables across the site.",
    prompt: "Create a design system for this site: define color tokens (background, surface, text, muted, accent, border), a modular type scale (display, h1–h4, body, caption), and a spacing scale. Apply them consistently to every section so styling is uniform. Use [accent color] as the primary accent and ensure text meets WCAG AA contrast.",
    tags: ["tokens", "typography", "system"],
    useCase: "Consistency",
    difficulty: "Advanced",
    featured: false
  },
  {
    title: "Logo Marquee Social Proof",
    slug: "logo-marquee-social-proof",
    category: "landing-pages",
    description: "An auto-scrolling row of customer/partner logos.",
    prompt: "Add a ‘Trusted by’ social proof strip below the hero: a single row of [6–8] grayscale logos that auto-scroll horizontally in a seamless loop, pausing on hover. Keep logos evenly sized and low-contrast so they don’t compete with the hero. Add a short label above: ‘Trusted by teams at’.",
    tags: ["social-proof", "logos", "marquee"],
    useCase: "Building trust",
    difficulty: "Starter",
    featured: false
  },
  {
    title: "Two-Column Feature Sections",
    slug: "two-column-feature-sections",
    category: "layout-structure",
    description: "Alternating image/text rows that tell a product story.",
    prompt: "Build a feature section with [3] alternating two-column rows: each row has a heading, supporting paragraph, and a small bullet list on one side, and a visual on the other. Alternate the image side each row. Add generous vertical spacing, align content to a consistent baseline, and stack to single column on mobile with the image first.",
    tags: ["layout", "features", "grid"],
    useCase: "Explaining a product",
    difficulty: "Starter",
    featured: false
  },
  {
    title: "Newsletter Capture That Works",
    slug: "newsletter-capture",
    category: "forms-conversion",
    description: "A focused email capture with a clear incentive and success state.",
    prompt: "Add a newsletter signup section with a benefit-led headline (‘[what they get]’), a single email field, and a subscribe button. Validate the email, show an inline success message after submit, and connect it to [email tool]. Keep it one line on desktop, stacked on mobile. Add a tiny privacy reassurance line under the field.",
    tags: ["email", "forms", "capture"],
    useCase: "Growing a list",
    difficulty: "Starter",
    featured: false
  }
];
