// Single source of truth for all copy, links and attribution on the site.
// Edit here — no copy should be hardcoded inside components.

export const site = {
  companyName: 'Podocyte AI',
  tagline: 'Design Services',
  location: 'Grand Rapids · Michigan',

  hero: {
    headline: ['Aurathus', 'AI'],
    subtitle: 'Technology Design Services',
    tagline: 'Sculpting Ideas to Reality',
    cta: { label: 'Request Consult', href: '/consult' },
  },

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#testimonials' },
    { label: 'Studio', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  services: {
    title: 'Services',
    items: [
      {
        title: 'Websites',
        body: 'Landing pages and full sites with real motion, real typography and a brand that holds up at any size.',
        meta: 'Design · Build · Launch',
      },
      {
        title: 'Software',
        body: 'Accounts, payments, dashboards and the backend that runs quietly behind the brand.',
        meta: 'Full stack · Secure by default',
      },
      {
        title: 'AI Engineering',
        body: 'Agents and automations that do the repetitive work for small and mid-sized businesses.',
        meta: 'Consulting · Implementation',
      },
    ],
  },

  // PLACEHOLDER copy for the three boxes below (testimonials, whyUs, about):
  // auto-filled to show the layout. Replace with real content before launch.
  // Testimonials may gain `image` (a path under /public) and `imageAlt`.
  testimonials: {
    title: 'Client Testimonials',
    items: [
      {
        quote: 'They understood the brief faster than we could explain it, and the finished site feels exactly like us.',
        name: 'Client Name',
        role: 'Title, Company',
      },
      {
        quote: 'Clear scope, honest timelines and no surprises. It was the calmest launch we have ever had.',
        name: 'Client Name',
        role: 'Title, Company',
      },
      {
        quote: 'The automation they built gave our team back hours every week. We stopped noticing the work and started noticing the results.',
        name: 'Client Name',
        role: 'Title, Company',
      },
      {
        quote: 'Considered design, careful engineering and a partner who answered every message personally.',
        name: 'Client Name',
        role: 'Title, Company',
      },
    ],
  },

  whyUs: {
    title: 'Why Choose Us?',
    items: [
      {
        title: 'Built by hand',
        body: 'Every page, component and line of copy is considered. No templates, no filler, nothing you will have to apologise for later.',
      },
      {
        title: 'One accountable partner',
        body: 'Design, software and AI engineering under one roof, so decisions are made once and nothing falls between teams.',
      },
      {
        title: 'Secure by default',
        body: 'Accounts, payments and data follow proven patterns, with the least access needed and no secrets in the browser.',
      },
      {
        title: 'Plain-spoken and fast',
        body: 'Clear scopes, honest timelines and direct access to the person doing the work.',
      },
    ],
  },

  about: {
    title: 'About',
    paragraphs: [
      'We are a small technology design studio. We build websites, software and AI systems for businesses that would rather be remembered than merely found.',
      'Our work sits where craft meets engineering: considered typography and motion on the surface, secure and dependable systems underneath. Every engagement is led by the person doing the work.',
    ],
  },

  contact: {
    label: 'Consultations',
    name: 'Anthony Neubacher',
    email: 'tjneubacher@gmail.com',
  },

  /** The /consult page. Submissions POST to `endpoint`; the Resend function behind it is not built yet. */
  consult: {
    endpoint: '/api/consult',
    eyebrow: 'Consultations',
    title: 'Request a consultation',
    intro: 'Tell us what you are building and we will reply personally, usually within two business days.',
    fields: {
      name: 'Your name',
      email: 'Email',
      company: 'Company (optional)',
      interest: 'What do you need?',
      message: 'About the project',
    },
    interests: ['Website', 'Software', 'AI engineering', 'Not sure yet'],
    submit: 'Send request',
    sending: 'Sending',
    sent: 'Thank you. Your request is in and we will be in touch shortly.',
    failed: 'We could not send that just now. Please email us directly at',
    back: 'Back to home',
  },

  footer: {
    text: '© 2026 Podocyte AI',
  },

  brand: {
    logo: '/brand/podocyte-logo.png', // full lockup on #0A0A0C, used for social previews
    wordmark: '/brand/podocyte-wordmark.png', // trimmed, transparent cut of the same logo
    logoAlt: 'Podocyte AI',
    mark: '/brand/podocyte-mark.png',
  },

  /** 3D figure in the hero. CC BY 4.0 requires this credit stay visible on every page that shows it. */
  statue: {
    modelUrl: '/models/david-head/scene.gltf',
    credit: {
      title: 'David Head',
      titleUrl: 'https://skfb.ly/oKvzW',
      author: '1d_inc',
      authorUrl: 'https://sketchfab.com/1d_inc',
      license: 'CC BY 4.0',
      licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
      changes: 'Modified: re-lit, re-textured and animated.',
    },
  },
}
