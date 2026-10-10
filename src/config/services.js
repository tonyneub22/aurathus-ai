// The four services: home-page cards and the /services/:slug pages render from
// this. Copy is final as supplied; edit here, never in components.
// `interest` is the matching option on the /consult form.

const PRICING = 'Pricing is tailored to each project and discussed after your consultation.'

export const services = [
  {
    slug: 'web-development',
    name: 'Web Development',
    interest: 'Website',
    cardLine: 'Full-stack websites built to your vision, down to the last pixel. Fast, secure, and unmistakably yours.',
    startLine:
      'Every site we build is designed by hand, coded from the ground up, and refined until it reflects your vision. You tell us how it should feel. We make it real.',
    pricingNote: PRICING,
    tiers: [
      {
        label: 'Tier I',
        name: 'Launch Plan',
        timeline: '1–2 weeks',
        body: "One page that says everything. A custom landing page with real motion, your brand, and the one feature you need most, whether that's a booking form, a signup, or a quote request. Built mobile-first, launched on your domain, with SEO and analytics set up for you.",
      },
      {
        label: 'Tier II',
        name: 'Presence Plan',
        timeline: '3–5 weeks',
        body: 'A full multi-page site with room to grow. Services, about, portfolio, blog and contact, each page designed rather than duplicated. Includes a content system so you can update text and images yourself, forms that route straight to your inbox, and performance and accessibility checks on every page.',
      },
      {
        label: 'Tier III',
        name: 'Platform Plan',
        timeline: '6–12 weeks',
        body: 'A website that runs part of your business. Customer accounts, payments, dashboards, scheduling, client portals, and the back end that holds it all together. Secure by design, tested before launch, and built so new features plug in without a rebuild.',
      },
    ],
    includes: {
      heading: 'Every plan includes',
      body: 'Defined revision rounds at each stage, launch on your domain, and full ownership of your code and content. After launch, our optional Care Plan covers hosting, security updates and small changes, so your site stays fast and current.',
    },
    technical: [
      "The front end is built in React with Vite and Tailwind, with animation handled by Motion and WebGL effects in three.js where they add real value. Sites deploy on Vercel's edge network, with DNS through Cloudflare or the provider of your choice. Every build runs ESLint, Vitest unit tests and Playwright end-to-end tests before it ships, and we aim for passing Core Web Vitals scores on mobile.",
      'Platform projects add a typed API layer, a managed Postgres database, authentication with secure session handling, and Stripe for payments. Secrets stay on the server and never reach the browser. Accessibility follows WCAG 2.2 AA: semantic HTML, keyboard navigation, visible focus states and reduced-motion support.',
    ],
  },
  {
    slug: 'ai-integration',
    name: 'AI Integration',
    interest: 'AI engineering',
    cardLine: 'Put AI to work inside your business. Hand off the repetitive tasks, tackle the hard problems, and keep the results.',
    startLine:
      'Most businesses don\'t need "an AI strategy." They need the repetitive work to disappear. We find the tasks that eat up your week, build AI systems that handle them reliably, and train your team to run them. You get your time back, and we make sure it keeps working.',
    pricingNote: PRICING,
    tiers: [
      {
        label: 'Tier I',
        name: 'Assist Plan',
        timeline: '1–2 weeks',
        body: 'AI where you already work. A fixed-scope engagement: we set up the right tools for your team, connect them to your documents and email, write prompts and workflows that fit your business, and run a hands-on training session so everyone uses them well. Fast to deploy, with an immediate payoff, and a clear map of what to automate next.',
      },
      {
        label: 'Tier II',
        name: 'Automate Plan',
        timeline: '3–6 weeks',
        body: 'Custom AI agents for specific jobs: answering customer questions from your own knowledge base, drafting proposals, sorting incoming requests, summarizing calls, or filling out forms. Each one is built, tested against real examples from your business, and connected to the systems you already use. Includes monitoring after launch so quality holds.',
      },
      {
        label: 'Tier III',
        name: 'Transform Plan',
        timeline: '2–4 months',
        body: 'AI built into your product or operations. Multi-agent systems, custom interfaces, integrations with your database and third-party platforms, and ongoing monitoring so quality holds as your business changes. This is where AI stops being a tool and becomes part of how your company runs.',
      },
    ],
    includes: null,
    technical: [
      'We build on the Claude API with a defined tool-use layer, so every agent action is explicit and auditable. Knowledge retrieval uses retrieval-augmented generation over your documents, with chunking and embedding strategies chosen for your content rather than defaults. Integrations run through the Model Context Protocol where available and typed API adapters where not.',
      'Every system ships with an evaluation suite: real inputs from your business, expected outputs, and automated scoring. That lets us prove quality before launch and catch regressions after. Guardrails cover prompt injection, data leakage and out-of-scope requests, and access follows least-privilege principles. The Transform Plan adds observability, cost monitoring, human-in-the-loop checkpoints, and a full handover so your team can maintain it.',
    ],
  },
  {
    slug: 'software-development',
    name: 'Software Development',
    interest: 'Software',
    cardLine:
      'Custom software built around how your business actually works. Internal tools, apps and dashboards that do exactly what you need.',
    startLine:
      "Off-the-shelf software makes you work its way. We build tools that work yours. Whether it's replacing a tangle of spreadsheets, giving your team a dashboard they'll actually use, or turning an idea into a working product, we design it with you, build it properly, and hand you something you own.",
    pricingNote: PRICING,
    tiers: [
      {
        label: 'Tier I',
        name: 'Blueprint Plan',
        timeline: '2–4 weeks',
        body: "A focused tool for one job. A dashboard, an internal tracker, a calculator, or an automation that replaces a manual process. We map the workflow with you, build a clean, working version, and get it into your team's hands fast.",
      },
      {
        label: 'Tier II',
        name: 'Build Plan',
        timeline: '6–10 weeks',
        body: "A complete application with user accounts, roles and permissions, a secure database, and integrations with the tools you already use, such as your CRM, calendar, accounting or email. Includes an admin area, automated testing and documentation, so it's reliable from day one.",
      },
      {
        label: 'Tier III',
        name: 'Scale Plan',
        timeline: '3–6 months',
        body: 'A full product or business-critical system, built to grow. Customer-facing apps, payments and subscriptions, reporting, third-party APIs, and the infrastructure to support real traffic. Delivered in stages, so you see progress every couple of weeks and can steer as we go.',
      },
    ],
    includes: {
      heading: 'Every plan includes',
      body: 'A discovery session to map your workflow, regular check-ins with working previews, defined revision rounds, and full ownership of the code. After launch, our optional Care Plan covers hosting, monitoring, updates and new features.',
    },
    technical: [
      'Applications are written in TypeScript end to end, with React on the front end and Node.js on the back end. Data lives in a managed Postgres database with versioned schema migrations, and APIs are typed and validated at every boundary so bad data never gets in. Authentication uses secure, server-side sessions with role-based access control.',
      'Every change runs through continuous integration on GitHub: linting, type checks, unit and integration tests, and end-to-end tests before it can deploy. Security follows OWASP guidance, including input validation, parameterized queries, rate limiting, dependency scanning and secrets kept out of code. Production systems include error tracking, logging and uptime monitoring, and every project ships with documentation and a handover so another developer could pick it up.',
    ],
  },
  {
    slug: 'video',
    name: 'Video Services',
    interest: 'Video',
    cardLine: 'Beautiful video, seen through the lens of your ideas. We capture it, craft it, and polish every frame.',
    startLine:
      "Some moments deserve more than a phone camera. Whether it's your business, your space or your biggest day, we shoot and edit cinematic video that looks the way it felt, then deliver it in every format you need, from your website to social media to the big screen.",
    pricingNote: PRICING,
    tiers: [
      {
        label: 'Tier I',
        name: 'Spotlight Plan',
        timeline: '1–2 hour shoot, delivered in 1–2 weeks',
        body: 'A single 1–2 hour shoot and one finished piece. Ideal for a website feature video, a tour of your space, or a product showcase. Color graded, lightly titled, and delivered in web and social formats.',
      },
      {
        label: 'Tier II',
        name: 'Story Plan',
        timeline: 'full-day shoot, delivered in 3–4 weeks',
        body: 'A full day of coverage and a stunning, finished film. Perfect for weddings, events and brand stories. We bring professional lighting, wireless microphones and backup cameras, so nothing is missed. Includes a highlight film, licensed music, and short cuts for social.',
      },
    ],
    includes: {
      heading: 'Both plans include',
      body: 'A planning call before the shoot, a defined round of edit revisions, licensed music, and secure online delivery of your final files.',
    },
    technical: [
      "Footage is captured in 4K on cinema-grade mirrorless cameras, recorded in a log profile with 10-bit color, so there's room to grade without banding or lost detail. Audio is recorded separately on wireless lavalier and shotgun microphones, then synced and mixed to broadcast loudness standards. Multi-camera productions are timecode-synced, with redundant recording, so nothing is lost if a card or camera fails.",
      'Editing and color grading are done in a professional editing suite, with color correction checked on scopes for accurate skin tones and consistent shots. Final files are exported as high-bitrate masters plus web-optimized versions at multiple resolutions, with social cuts in each platform\'s native aspect ratio and optional burned-in captions. Website videos are compressed to load quickly on mobile without visible quality loss.',
    ],
  },
]

export const serviceBySlug = (slug) => services.find((s) => s.slug === slug) ?? null
