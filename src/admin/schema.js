// Describes every editable thing in the admin panel. The generic form engine (fields.jsx) renders
// these definitions, so adding a field here is all it takes to make it editable.
//
// Field types: text, textarea, number, select, checkbox, image, media, strings, list, blocks.

const ICONS = [
  'sun', 'shield-check', 'dollar', 'award', 'clipboard-check', 'home', 'building', 'wrench',
  'battery', 'file-check', 'sparkles', 'target', 'eye', 'star', 'check',
]

const meta = (extra = {}) => ({
  name: 'meta',
  type: 'group',
  label: 'Page title & SEO',
  fields: [
    { name: 'title', label: 'Browser tab title', type: 'text' },
    { name: 'description', label: 'Meta description', type: 'textarea', rows: 2 },
  ],
  ...extra,
})

const heading = (name, label, { withText = false } = {}) => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', label: 'Small label', type: 'text' },
    { name: 'title', label: 'Heading', type: 'text' },
    ...(withText ? [{ name: 'text', label: 'Paragraph', type: 'textarea', rows: 2 }] : []),
  ],
})

const linkFields = [
  { name: 'label', label: 'Label', type: 'text' },
  { name: 'to', label: 'Link (e.g. /about)', type: 'text' },
]

// ---- Records stored in their own tables: list + add / edit / delete ----
export const resources = {
  services: {
    title: 'Services',
    singular: 'service',
    api: 'services',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'URL slug' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug (e.g. solar-panel-cleaning)', type: 'text', required: true, slugFrom: 'title' },
      { name: 'icon', label: 'Icon', type: 'select', options: ['home', 'building', 'wrench', 'battery', 'file-check', 'sparkles', 'sun'] },
      { name: 'summary', label: 'Short summary (shown on cards)', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
      { name: 'benefits', label: 'Benefits', type: 'strings' },
      { name: 'process', label: 'Process steps', type: 'strings' },
    ],
    empty: { title: '', slug: '', icon: 'sun', summary: '', description: '', benefits: [], process: [] },
    reorder: true,
  },
  projects: {
    title: 'Projects',
    singular: 'project',
    api: 'projects',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'location', label: 'Location' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', options: ['Residential', 'Commercial'], required: true },
      { name: 'capacity', label: 'Capacity (e.g. 10 kW — used by the gallery filter)', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      { name: 'images', label: 'Photos (first one is the cover)', type: 'strings', imageList: true },
    ],
    empty: { title: '', category: 'Residential', capacity: '', location: '', description: '', images: [] },
    reorder: true,
  },
  testimonials: {
    title: 'Testimonials',
    singular: 'testimonial',
    api: 'testimonials',
    columns: [
      { key: 'name', label: 'Customer' },
      { key: 'location', label: 'Location' },
      { key: 'rating', label: 'Rating' },
      { key: 'approved', label: 'Shown on site', bool: true },
    ],
    fields: [
      { name: 'name', label: 'Customer name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5 },
      { name: 'text', label: 'Review', type: 'textarea', rows: 4, required: true },
      { name: 'photo', label: 'Photo (optional)', type: 'image' },
      { name: 'featured', label: 'Featured (shown first in the carousel)', type: 'checkbox' },
      { name: 'approved', label: 'Show on website', type: 'checkbox' },
    ],
    empty: { name: '', location: '', rating: 5, text: '', photo: '', featured: false, approved: true },
    reorder: true,
  },
  blog: {
    title: 'Blog Posts',
    singular: 'blog post',
    api: 'blog',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category' },
      { key: 'date', label: 'Date' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'URL slug', type: 'text', required: true, slugFrom: 'title' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'date', label: 'Publish date', type: 'date' },
      { name: 'image', label: 'Cover image', type: 'image' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
      { name: 'content', label: 'Article content', type: 'blocks' },
      { name: 'tags', label: 'Tags', type: 'strings' },
      { name: 'meta_title', label: 'SEO title', type: 'text' },
      { name: 'meta_description', label: 'SEO description', type: 'textarea', rows: 2 },
    ],
    empty: {
      title: '', slug: '', category: '', author: 'Ignite Solar Team', date: '', image: '', excerpt: '',
      content: [], tags: [], meta_title: '', meta_description: '',
    },
  },
  team: {
    title: 'Team Members',
    singular: 'team member',
    api: 'team',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'initials', label: 'Initials (shown when there is no photo)', type: 'text' },
      { name: 'photo', label: 'Photo (optional)', type: 'image' },
    ],
    empty: { name: '', role: '', initials: '', photo: '' },
    reorder: true,
  },
  stats: {
    title: 'Numbers (Stats)',
    singular: 'stat',
    api: 'stats',
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'value', label: 'Value' },
      { key: 'suffix', label: 'Suffix' },
    ],
    fields: [
      { name: 'label', label: 'Label (e.g. Projects Completed)', type: 'text', required: true },
      { name: 'value', label: 'Number', type: 'number' },
      { name: 'suffix', label: 'Suffix (e.g. +)', type: 'text' },
    ],
    empty: { label: '', value: 0, suffix: '+' },
    reorder: true,
  },
  areas: {
    title: 'Service Areas',
    singular: 'service area',
    api: 'areas',
    columns: [{ key: 'name', label: 'Area' }],
    fields: [{ name: 'name', label: 'Area / city', type: 'text', required: true }],
    empty: { name: '' },
    reorder: true,
  },
  certifications: {
    title: 'Certifications',
    singular: 'certification',
    api: 'certifications',
    columns: [{ key: 'name', label: 'Certification' }],
    fields: [{ name: 'name', label: 'Name', type: 'text', required: true }],
    empty: { name: '' },
    reorder: true,
  },
  media: {
    title: 'Gallery Media',
    singular: 'media item',
    api: 'media',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'src', label: 'File' },
    ],
    fields: [
      { name: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
      { name: 'src', label: 'File (upload or paste a path)', type: 'media', typeField: 'type' },
      { name: 'thumb', label: 'Thumbnail / poster image (needed for uploaded videos)', type: 'image' },
      { name: 'title', label: 'Title / alt text', type: 'text', required: true },
    ],
    empty: { type: 'image', src: '', thumb: '', title: '' },
    reorder: true,
  },
}

// ---- Page copy blocks (site_content): one form per key ----
export const contentPages = {
  site: {
    title: 'Site Settings',
    hint: 'Logo, contact details, menu, social links and footer text shown on every page.',
    fields: [
      { name: 'siteName', label: 'Website name (browser tab & logo alt text)', type: 'text' },
      { name: 'logo', label: 'Logo', type: 'image' },
      { name: 'favicon', label: 'Favicon (browser tab icon)', type: 'image' },
      {
        name: 'theme', type: 'group', label: 'Appearance (colours, font size, logo size)',
        fields: [
          { name: 'primaryColor', label: 'Main brand colour (buttons, highlights)', type: 'color' },
          { name: 'darkColor', label: 'Dark colour (dark sections, footer)', type: 'color' },
          { name: 'textColor', label: 'Body text colour', type: 'color' },
          { name: 'fontSize', label: 'Base font size (px, default 16)', type: 'number', min: 12, max: 22 },
          { name: 'logoHeight', label: 'Header logo height (px, default 55)', type: 'number', min: 20, max: 140 },
          { name: 'logoWidth', label: 'Header logo width (px, leave empty for automatic)', type: 'number', min: 40, max: 500 },
          { name: 'footerLogoHeight', label: 'Footer logo height (px, default 38)', type: 'number', min: 20, max: 140 },
        ],
      },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'hours', label: 'Working hours', type: 'text' },
      {
        name: 'socials', label: 'Social links (Facebook, X, Instagram, Pinterest, YouTube)', type: 'list', fixed: true,
        itemLabel: 'label',
        fields: [{ name: 'label', label: 'Network', type: 'text', readOnly: true }, { name: 'href', label: 'Profile URL', type: 'text' }],
      },
      { name: 'nav', label: 'Main menu', type: 'list', itemLabel: 'label', fields: linkFields },
      { name: 'navCta', label: 'Menu button text', type: 'text' },
      {
        name: 'footer', type: 'group', label: 'Footer',
        fields: [
          { name: 'about', label: 'About text', type: 'textarea', rows: 3 },
          { name: 'quickLinksHeading', label: 'Quick links heading', type: 'text' },
          { name: 'quickLinks', label: 'Quick links', type: 'list', itemLabel: 'label', fields: linkFields },
          { name: 'servicesHeading', label: 'Services column heading', type: 'text' },
          { name: 'newsletterHeading', label: 'Newsletter heading', type: 'text' },
          { name: 'newsletterText', label: 'Newsletter text', type: 'text' },
          { name: 'subscribedText', label: 'Message after subscribing', type: 'text' },
          { name: 'copyrightName', label: 'Copyright name', type: 'text' },
          { name: 'credit', label: 'Credit line', type: 'text' },
        ],
      },
    ],
  },
  home: {
    title: 'Home Page',
    hint: 'Every section of the home page, top to bottom. Services, projects, blog and testimonials come from their own lists.',
    fields: [
      meta(),
      {
        name: 'banner', type: 'group', label: 'Top banner',
        fields: [
          {
            name: 'slides', label: 'Banner slides (scroll automatically, in this order)', type: 'list', itemLabel: 'alt',
            fields: [
              { name: 'image', label: 'Banner image', type: 'image' },
              { name: 'alt', label: 'Image description', type: 'text' },
            ],
          },
        ],
      },
      {
        name: 'about', type: 'group', label: 'Who we are',
        fields: [
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'imageAlt', label: 'Image description', type: 'text' },
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'text', label: 'Text', type: 'textarea', rows: 4 },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
      heading('impact', 'Numbers heading'),
      {
        name: 'hero', type: 'group', label: 'Main intro (headline)',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'titleBefore', label: 'Headline — start', type: 'text' },
          { name: 'accent', label: 'Headline — highlighted word', type: 'text' },
          { name: 'titleAfter', label: 'Headline — end', type: 'text' },
          { name: 'text', label: 'Paragraph', type: 'textarea', rows: 3 },
          { name: 'primaryButton', label: 'Button text', type: 'text' },
          { name: 'linkText', label: 'Link text', type: 'text' },
          { name: 'points', label: 'Check-list points', type: 'strings' },
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'imageAlt', label: 'Image description', type: 'text' },
          { name: 'chip', label: 'Badge on image (top)', type: 'text' },
          { name: 'badgeValue', label: 'Badge value (e.g. 100%)', type: 'text' },
          { name: 'badgeText', label: 'Badge text', type: 'text' },
        ],
      },
      heading('services', 'Services section', { withText: true }),
      {
        name: 'why', type: 'group', label: 'Why choose us',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'titleBefore', label: 'Heading — start', type: 'text' },
          { name: 'accent', label: 'Heading — highlighted', type: 'text' },
          { name: 'text', label: 'Paragraph', type: 'textarea', rows: 2 },
          { name: 'button', label: 'Button text', type: 'text' },
          {
            name: 'items', label: 'Cards', type: 'list', itemLabel: 'title',
            fields: [
              { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
      {
        name: 'journey', type: 'group', label: 'Your solar journey',
        fields: [
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'imageAlt', label: 'Image description', type: 'text' },
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'steps', label: 'Steps', type: 'strings' },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
      {
        name: 'projects', type: 'group', label: 'Featured projects',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'text', label: 'Paragraph', type: 'text' },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
      heading('blog', 'Blog section'),
      heading('testimonials', 'Testimonials section'),
      {
        name: 'cta', type: 'group', label: 'Bottom call-to-action',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'text', label: 'Paragraph', type: 'textarea', rows: 2 },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
    ],
  },
  about: {
    title: 'About Page',
    hint: 'Team, numbers, service areas and certifications are edited from their own lists.',
    fields: [
      meta(),
      { name: 'hero', type: 'group', label: 'Page banner', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 }] },
      {
        name: 'story', type: 'group', label: 'Our story',
        fields: [
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'imageAlt', label: 'Image description', type: 'text' },
          { name: 'badgeTitle', label: 'Badge — bold text', type: 'text' },
          { name: 'badgeText', label: 'Badge — text', type: 'text' },
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'lead', label: 'Lead paragraph', type: 'textarea', rows: 4 },
          { name: 'text', label: 'Second paragraph', type: 'textarea', rows: 3 },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
      {
        name: 'mission', type: 'group', label: 'Mission & vision',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          {
            name: 'cards', label: 'Cards', type: 'list', itemLabel: 'title',
            fields: [
              { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
              { name: 'label', label: 'Small label', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
            ],
          },
        ],
      },
      heading('impact', 'Numbers heading'),
      {
        name: 'values', type: 'group', label: 'What sets us apart',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          {
            name: 'items', label: 'Cards', type: 'list', itemLabel: 'title',
            fields: [
              { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
      heading('team', 'Team heading'),
      heading('certs', 'Certifications heading'),
      heading('areas', 'Service areas heading'),
    ],
  },
  services_page: {
    title: 'Services Page',
    hint: 'The list of services itself is managed under Services.',
    fields: [
      meta(),
      { name: 'hero', type: 'group', label: 'Page banner', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 }] },
      heading('intro', 'Intro', { withText: true }),
      {
        name: 'process', type: 'group', label: 'Our process',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Heading', type: 'text' },
          {
            name: 'items', label: 'Steps', type: 'list', itemLabel: 'title',
            fields: [
              { name: 'step', label: 'Number (e.g. 01)', type: 'text' },
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
            ],
          },
        ],
      },
      {
        name: 'cta', type: 'group', label: 'Bottom call-to-action',
        fields: [
          { name: 'title', label: 'Heading', type: 'text' },
          { name: 'text', label: 'Text', type: 'text' },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
    ],
  },
  service_detail: {
    title: 'Service Detail Labels',
    hint: 'Headings and button text on each individual service page.',
    fields: [
      { name: 'overviewHeading', label: 'Overview heading', type: 'text' },
      { name: 'benefitsHeading', label: 'Benefits heading', type: 'text' },
      { name: 'processHeading', label: 'Process heading', type: 'text' },
      { name: 'sidebarHeading', label: 'Sidebar heading ({title} = service name)', type: 'text' },
      { name: 'sidebarText', label: 'Sidebar text', type: 'text' },
      { name: 'quoteButton', label: 'Quote button', type: 'text' },
      { name: 'relatedHeading', label: 'Related projects heading', type: 'text' },
      { name: 'galleryLink', label: 'Gallery link text', type: 'text' },
    ],
  },
  gallery_page: {
    title: 'Gallery Page',
    hint: 'Photos and videos are managed under Gallery Media, projects under Projects.',
    fields: [
      meta(),
      {
        name: 'hero', type: 'group', label: 'Page banner',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
        ],
      },
      heading('media', 'Media gallery section', { withText: true }),
      heading('projects', 'Projects section'),
    ],
  },
  blog_page: {
    title: 'Blog Page',
    hint: 'Articles are managed under Blog Posts.',
    fields: [
      meta(),
      { name: 'hero', type: 'group', label: 'Page banner', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 }] },
      heading('section', 'Section heading'),
    ],
  },
  testimonials_page: {
    title: 'Testimonials Page',
    hint: 'Reviews are managed under Testimonials.',
    fields: [
      meta(),
      { name: 'hero', type: 'group', label: 'Page banner', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 }] },
      heading('section', 'Section heading'),
    ],
  },
  contact: {
    title: 'Contact Page',
    hint: 'Phone, email, address and hours come from Site Settings.',
    fields: [
      meta(),
      { name: 'hero', type: 'group', label: 'Page banner', fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 }] },
      {
        name: 'panel', type: 'group', label: 'Left panel',
        fields: [
          { name: 'label', label: 'Small label', type: 'text' },
          { name: 'titleBefore', label: 'Heading — start', type: 'text' },
          { name: 'accent', label: 'Heading — highlighted', type: 'text' },
          { name: 'lead', label: 'Paragraph', type: 'textarea', rows: 3 },
          { name: 'followLabel', label: '"Follow us" label', type: 'text' },
        ],
      },
      {
        name: 'form', type: 'group', label: 'Form',
        fields: [
          { name: 'heading', label: 'Heading', type: 'text' },
          { name: 'sub', label: 'Sub-heading', type: 'text' },
          { name: 'success', label: 'Success message', type: 'text' },
          { name: 'button', label: 'Button text', type: 'text' },
        ],
      },
      { name: 'mapQuery', label: 'Map location (address shown on Google Maps)', type: 'text' },
      { name: 'mapUrl', label: 'Map link (optional) — Google Maps → Share → Embed a map → paste the link or the whole code here. Overrides the address above.', type: 'textarea', rows: 3 },
    ],
  },
  ui: {
    title: 'Buttons & Labels',
    hint: 'Small texts used across pages: buttons, filters, form labels and placeholders.',
    fields: [
      'readArticle', 'readMore', 'loadMore', 'searchPlaceholder', 'noArticles', 'backToBlog', 'quoteButton',
      'shareLabel', 'copyLink', 'copied', 'relatedArticles', 'subscribeButton', 'subscribePlaceholder',
      'onThisPage', 'lastUpdated', 'legalContactButton', 'filterAll', 'filterResidential', 'filterCommercial',
      'capacityAny', 'capacitySmall', 'capacityMedium', 'capacityLarge', 'noProjects', 'nameLabel',
      'namePlaceholder', 'emailLabel', 'emailPlaceholder', 'phoneLabel', 'phonePlaceholder', 'messageLabel',
      'messagePlaceholder', 'sending', 'nameRequired', 'emailInvalid', 'phoneInvalid', 'messageRequired',
      'privacyLink', 'termsLink', 'breadcrumbHome', 'breadcrumbGallery', 'learnMore', 'mediaViewGallery',
      'mediaAll', 'mediaImages', 'mediaVideos', 'playVideo', 'viewImage', 'videoBadge', 'videoUnavailable',
      'imageUnavailable', 'noMedia', 'videoCantPreview', 'downloadVideo', 'loadingVideo', 'loading', 'loadError',
    ].map((name) => ({ name, label: name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()), type: 'text' })),
  },
  privacy: { title: 'Privacy Policy', hint: 'Legal text for /privacy-policy.', fields: legalFields() },
  terms: { title: 'Terms of Service', hint: 'Legal text for /terms-of-service.', fields: legalFields() },
}

function legalFields() {
  return [
    { name: 'title', label: 'Page title', type: 'text' },
    { name: 'updated', label: 'Last updated (e.g. September 2026)', type: 'text' },
    { name: 'intro', label: 'Introduction', type: 'textarea', rows: 4 },
    {
      name: 'sections', label: 'Sections', type: 'list', itemLabel: 'heading',
      fields: [
        { name: 'id', label: 'Anchor id (lowercase-with-dashes)', type: 'text' },
        { name: 'heading', label: 'Heading', type: 'text' },
        { name: 'paragraphs', label: 'Paragraphs', type: 'strings', multiline: true },
        { name: 'items', label: 'Bullet points', type: 'strings' },
      ],
    },
    { name: 'contactHeading', label: 'Contact box heading', type: 'text' },
    { name: 'contactText', label: 'Contact box text', type: 'textarea', rows: 2 },
  ]
}

export const navigation = [
  { heading: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: 'grid', end: true }] },
  {
    heading: 'Inbox',
    items: [
      { to: '/admin/inbox/messages', label: 'Contact Messages', icon: 'mail' },
      { to: '/admin/inbox/subscribers', label: 'Subscribers', icon: 'users' },
    ],
  },
  {
    heading: 'Pages',
    items: [
      { to: '/admin/page/home', label: 'Home', icon: 'file' },
      { to: '/admin/page/about', label: 'About', icon: 'file' },
      { to: '/admin/page/services_page', label: 'Services', icon: 'file' },
      { to: '/admin/page/service_detail', label: 'Service Detail', icon: 'file' },
      { to: '/admin/page/gallery_page', label: 'Gallery', icon: 'file' },
      { to: '/admin/page/blog_page', label: 'Blog', icon: 'file' },
      { to: '/admin/page/testimonials_page', label: 'Testimonials', icon: 'file' },
      { to: '/admin/page/contact', label: 'Contact', icon: 'file' },
      { to: '/admin/page/privacy', label: 'Privacy Policy', icon: 'file' },
      { to: '/admin/page/terms', label: 'Terms of Service', icon: 'file' },
    ],
  },
  {
    heading: 'Content',
    items: [
      { to: '/admin/list/services', label: 'Services', icon: 'bolt' },
      { to: '/admin/list/projects', label: 'Projects', icon: 'image' },
      { to: '/admin/list/media', label: 'Gallery Media', icon: 'film' },
      { to: '/admin/list/blog', label: 'Blog Posts', icon: 'pen' },
      { to: '/admin/list/testimonials', label: 'Testimonials', icon: 'star' },
      { to: '/admin/list/team', label: 'Team', icon: 'users' },
      { to: '/admin/list/stats', label: 'Numbers (Stats)', icon: 'chart' },
      { to: '/admin/list/areas', label: 'Service Areas', icon: 'pin' },
      { to: '/admin/list/certifications', label: 'Certifications', icon: 'award' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { to: '/admin/page/site', label: 'Site Settings', icon: 'cog' },
      { to: '/admin/page/ui', label: 'Buttons & Labels', icon: 'cog' },
      { to: '/admin/account', label: 'My Account', icon: 'user' },
    ],
  },
]
