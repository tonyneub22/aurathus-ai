// Single source of truth for all copy, links and attribution on the site.
// Edit here — no copy should be hardcoded inside components.

// Off until real client quotes exist: hides the section and its menu link.
const showTestimonials = false

export const site = {
  companyName: 'Aurathus AI LLC',
  shortName: 'Aurathus AI',
  siteUrl: 'https://aurathus-ai.com',
  // Home page <title> and description. index.html gets them at build time too.
  meta: {
    title: 'Aurathus AI LLC — Design Services',
    // Describes /og-image.png for link previews (index.html's og:image:alt).
    ogImageAlt: 'Aurathus AI logo: a classical profile inside a gold ring beside the wordmark, on black',
    description:
      'Aurathus AI designs and builds websites, software and AI systems for businesses in Grand Rapids, Michigan and beyond.',
  },
  tagline: 'Design Services',
  location: 'Grand Rapids · Michigan',

  hero: {
    headline: ['Aurathus', 'AI'],
    subtitle: 'Technology Design Services',
    tagline: 'Sculpting Ideas to Reality',
    cta: { label: 'Request Consult', href: '/consult' },
  },

  // Header and menu. Links use /#id so they work from /consult as well as the home page.
  nav: {
    home: { label: 'Home', href: '/#top' },
    menuLabel: 'Menu',
    links: [
      { label: 'Services', href: '/#services' },
      { label: 'Why Us', href: '/#why-us' },
      ...(showTestimonials ? [{ label: 'Work', href: '/#testimonials' }] : []),
      { label: 'Contact', href: '/#contact' },
    ],
    cta: { label: 'Request Consult', href: '/consult' },
  },

  // The services themselves live in services.js. These are the labels around them.
  services: {
    title: 'Services',
    readMore: 'Read more',
    readMoreAbout: (name) => `Read more about ${name}`,
  },

  /** Template for /services/:slug. */
  servicePage: {
    plans: 'Plans',
    technical: 'Technical details',
    back: { label: 'Back to services', href: '/#services' },
    /** The page's Request Consult target. One place to change when booking moves elsewhere. */
    consultHref: (service) => `/consult?service=${encodeURIComponent(service.slug)}`,
  },

  notFound: {
    title: 'Page not found',
    body: "This page doesn't exist or has moved.",
  },

  // PLACEHOLDER copy for the three sections below (testimonials, whyUs, about):
  // auto-filled to show the layout. Replace with real content before launch.
  // Testimonials may gain `image` (a path under /public) and `imageAlt`.
  testimonials: {
    enabled: showTestimonials,
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
    title: 'Request a consultation',
    intro: 'Tell us what you are building and we will reply personally, usually within two business days.',
    fields: {
      name: 'Your name',
      email: 'Email',
      company: 'Company (optional)',
      interest: 'What do you need?',
      message: 'About the project',
    },
    interests: ['Website', 'Software', 'AI engineering', 'Video', 'Not sure yet'],
    submit: 'Send request',
    sending: 'Sending',
    sent: 'Thank you. Your request is in and we will be in touch shortly.',
    failed: 'We could not send that just now. Please email us directly at',
    back: 'Back to home',
  },

  footer: {
    text: '© 2026 Aurathus AI LLC',
  },

  // Brand pack: brand-source/aurathus-logo-v2/ (copies in public/brand/). Every logo is made for dark
  // backgrounds only. Sizes are each file's viewBox, so images reserve their space before loading.
  brand: {
    header: { src: '/brand/aurathus-logo-header.svg', width: 890, height: 200 },
    footer: { src: '/brand/aurathus-logo-footer.svg', width: 1058, height: 200 },
    icon: { src: '/brand/aurathus-icon.svg', width: 512, height: 512 },
    logoAlt: 'Aurathus AI LLC',
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
