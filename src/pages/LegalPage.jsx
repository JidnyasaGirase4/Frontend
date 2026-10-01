import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useContent, telHref } from '../lib/content.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import './LegalPage.css'

function LegalPage({ contentKey }) {
  const content = useContent()
  const { site, ui } = content
  const { title, updated, intro, sections, contactHeading, contactText } = content[contentKey]
  usePageMeta(title)

  const legalContact = [
    { icon: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: 'phone', label: 'Phone', value: site.phone, href: telHref(site.phone) },
    { icon: 'map-pin', label: 'Address', value: site.address },
  ]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{title}</h1>
          <p>{ui.lastUpdated} {updated}</p>
        </div>
      </section>

      <section className="section">
        <div className="container legal-layout">
          <p className="legal-intro">{intro}</p>

          <nav className="legal-toc" aria-label={`${title} contents`}>
            <h2>{ui.onThisPage}</h2>
            <ol>
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">
            {sections.map((section, index) => (
              <section className="legal-section" id={section.id} key={section.id}>
                <h2>
                  <span className="legal-num">{String(index + 1).padStart(2, '0')}</span>
                  {section.heading}
                </h2>
                {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
                {section.items?.length > 0 && (
                  <ul>
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <aside className="legal-contact">
            <h2>{contactHeading}</h2>
            <p>{contactText}</p>
            <ul>
              {legalContact.map(({ icon, label, value, href }) => (
                <li key={label}>
                  <span className="legal-contact-icon"><Icon name={icon} size={18} /></span>
                  <div>
                    <small>{label}</small>
                    {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary">{ui.legalContactButton}</Link>
          </aside>
        </div>
      </section>
    </>
  )
}

export default LegalPage
