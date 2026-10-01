import { siteInfo } from './siteInfo.js'

// Draft policy text for the legal pages. Each section: { id, heading, paragraphs?, items? }.
// Have it reviewed by a legal adviser before the site goes live.

export const privacyContent = {
  intro:
    'Ignite Solar ("we", "us") respects your privacy. This policy explains what personal information we collect through this website, how we use it, who we share it with, and the choices you have.',
  sections: [
    {
      id: 'information-we-collect',
      heading: 'Information we collect',
      paragraphs: ['We collect only what we need to respond to you and to design and deliver your solar project:'],
      items: [
        'Contact details you give us: your name, email address and phone number.',
        'Project details: your address or city, property type, average monthly electricity bill and the service you are interested in.',
        'Messages you send through our contact form, by email, phone or WhatsApp.',
        'Basic technical data such as your browser, device, pages visited and approximate location, collected through cookies and similar tools.',
      ],
    },
    {
      id: 'how-we-use-it',
      heading: 'How we use your information',
      items: [
        'To reply to your enquiry and prepare a quote or site survey.',
        'To design, install, commission and maintain your solar system.',
        'To help with net-metering and government subsidy applications on your behalf.',
        'To send service updates, maintenance reminders and, only where you agree, offers and solar tips.',
        'To keep the website secure, fix problems and understand how it is used so we can improve it.',
        'To meet legal, accounting and regulatory requirements.',
      ],
    },
    {
      id: 'sharing',
      heading: 'Who we share it with',
      paragraphs: ['We do not sell your personal information. We share it only where needed, and only with:'],
      items: [
        'Service providers who help us run the website and send email, under confidentiality obligations.',
        'Installation, logistics and financing partners working on your project.',
        'Electricity distribution companies and government agencies, when we file net-metering or subsidy applications for you.',
        'Authorities or advisers where the law requires it or to protect our legal rights.',
      ],
    },
    {
      id: 'cookies',
      heading: 'Cookies and analytics',
      paragraphs: [
        'We use cookies and similar technologies to keep the site working and to understand which pages are useful. You can block or delete cookies in your browser settings; some parts of the site may not work properly if you do.',
      ],
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      paragraphs: [
        'We keep enquiry details for as long as needed to respond to you and follow up on your project. For customers, we keep project, warranty and billing records for the period needed to support warranties and meet legal and tax obligations. After that we delete or anonymise the information.',
      ],
    },
    {
      id: 'security',
      heading: 'How we protect it',
      paragraphs: [
        'We use reasonable technical and organisational safeguards to protect your information from loss, misuse and unauthorised access. No online service can be completely secure, so we cannot guarantee absolute security, but we act promptly if we learn of a problem.',
      ],
    },
    {
      id: 'your-rights',
      heading: 'Your rights and choices',
      paragraphs: ['Subject to applicable Indian law, including the Digital Personal Data Protection Act, 2023, you can ask us to:'],
      items: [
        'tell you what personal information we hold about you;',
        'correct information that is wrong or out of date;',
        'delete your information, where we no longer need it;',
        'stop sending you marketing messages, at any time, using the unsubscribe option or by contacting us;',
        'withdraw a consent you gave us earlier.',
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Links to other websites',
      paragraphs: [
        'This site contains links to other websites, such as social networks used for sharing articles. Their privacy practices are their own, and we encourage you to read their policies.',
      ],
    },
    {
      id: 'children',
      heading: "Children's privacy",
      paragraphs: ['Our services are meant for adults. We do not knowingly collect personal information from children.'],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy from time to time. The "Last updated" date at the top shows when it last changed. Significant changes will be highlighted on this page.',
      ],
    },
  ],
  contactHeading: 'Questions or complaints about your data',
  contactText: 'To use any of your rights or raise a concern about how we handle your information, contact us:',
}

export const termsContent = {
  intro:
    'These terms apply to your use of the Ignite Solar website and to enquiries and quotes you request through it. Any solar project we carry out for you will also be governed by a separate written agreement or work order. Please read both carefully.',
  sections: [
    {
      id: 'acceptance',
      heading: 'Accepting these terms',
      paragraphs: [
        'By using this website or sending us an enquiry, you agree to these terms. If you do not agree, please do not use the site.',
      ],
    },
    {
      id: 'our-services',
      heading: 'What we do',
      paragraphs: ['Ignite Solar is a solar EPC (engineering, procurement and construction) company. Depending on your requirement, our services include:'],
      items: [
        'site assessment and energy audit;',
        'system design and supply of panels, inverters, batteries and other equipment;',
        'installation and commissioning of residential and commercial rooftop systems;',
        'maintenance, repair and panel cleaning;',
        'help with net-metering and subsidy paperwork.',
      ],
    },
    {
      id: 'quotes',
      heading: 'Quotes and savings estimates',
      paragraphs: [
        'A free quote is an estimate based on the information you give us and is not a binding offer. The final scope and price are confirmed only after a site survey and are set out in a written agreement. Estimated savings, payback periods and generation figures are indicative: actual results depend on sunlight, shading, roof condition, electricity tariffs, usage and how the system is maintained.',
      ],
    },
    {
      id: 'orders-payments',
      heading: 'Orders, payments and timelines',
      paragraphs: [
        'Orders are accepted when both parties sign the agreement or work order. Prices, payment milestones and delivery schedules are as stated there. Timelines are estimates and may change because of weather, material availability, site access or delays in approvals outside our control.',
      ],
    },
    {
      id: 'approvals',
      heading: 'Subsidies, net-metering and approvals',
      paragraphs: [
        'We help prepare and submit applications, but approvals, subsidies and net-metering connections are decided by the electricity distribution company and government authorities. Schemes, eligibility and amounts change, and we cannot guarantee that an application will be approved or when.',
      ],
    },
    {
      id: 'warranty',
      heading: 'Warranties',
      paragraphs: [
        'Equipment such as panels and inverters carries the manufacturer’s warranty, and our installation workmanship is covered as stated in your agreement. Warranties do not cover damage caused by misuse, unauthorised repairs or modifications, lack of reasonable upkeep, or events such as lightning, floods and other natural causes, unless your agreement says otherwise.',
      ],
    },
    {
      id: 'your-responsibilities',
      heading: 'Your responsibilities',
      items: [
        'Give us accurate information about your property and electricity use.',
        'Confirm that you own the site or have the owner’s permission for the installation.',
        'Provide safe access to the roof and the electrical connection point.',
        'Keep the system free of new shading or obstruction, and follow our maintenance guidance.',
      ],
    },
    {
      id: 'website-use',
      heading: 'Using this website',
      paragraphs: ['You agree not to misuse the site. In particular, you will not:'],
      items: [
        'submit false, misleading or unlawful information;',
        'try to gain unauthorised access to the site or its systems;',
        'copy, scrape or resell our content without permission;',
        'send spam or harmful code through our forms.',
      ],
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      paragraphs: [
        'The Ignite Solar name, logo, text, images and design on this site belong to us or our licensors. You may view and share the pages for personal, non-commercial use, but you may not reproduce or modify them without our written permission.',
      ],
    },
    {
      id: 'liability',
      heading: 'Limits on our liability',
      paragraphs: [
        'The website and its information are provided "as is". To the extent the law allows, we are not liable for indirect or consequential loss arising from use of the website, or for losses caused by events outside our reasonable control. Nothing in these terms limits liability that cannot be limited by law. Liability for a project is governed by your agreement.',
      ],
    },
    {
      id: 'third-party',
      heading: 'Third-party links',
      paragraphs: [
        'Links to other websites are provided for convenience. We do not control them and are not responsible for their content or practices.',
      ],
    },
    {
      id: 'privacy',
      heading: 'Privacy',
      paragraphs: ['How we handle your personal information is explained in our Privacy Policy, which forms part of these terms.'],
    },
    {
      id: 'governing-law',
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India. The courts at Bengaluru, Karnataka have exclusive jurisdiction over any dispute, subject to any dispute-resolution clause in your project agreement.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The "Last updated" date shows the latest version, and continued use of the site means you accept the changes.',
      ],
    },
  ],
  contactHeading: 'Questions about these terms',
  contactText: 'If anything here is unclear, or you would like to talk to us before requesting a quote, get in touch:',
}

export const legalContact = [
  { icon: 'mail', label: 'Email', value: siteInfo.email, href: `mailto:${siteInfo.email}` },
  { icon: 'phone', label: 'Phone', value: siteInfo.phone, href: `tel:${siteInfo.phone.replace(/\s/g, '')}` },
  { icon: 'map-pin', label: 'Address', value: siteInfo.address },
]
