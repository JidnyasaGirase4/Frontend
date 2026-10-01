import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import { useContent, telHref } from '../lib/content.jsx'
import Icon from '../components/Icon.jsx'
import SocialIcons from '../components/SocialIcons.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import './Contact.css'

const initialForm = { name: '', email: '', phone: '', message: '' }

// A pasted map link (or the whole <iframe> code) wins over the address search.
function mapSrc(c) {
  const pasted = (c.mapUrl || '').trim()
  const url = pasted.match(/src=["']([^"']+)["']/)?.[1] || pasted
  if (/^https:\/\/(www\.)?google\.[a-z.]+\/maps\//i.test(url)) return url
  return `https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`
}

function Contact() {
  const { contact: c, site, ui } = useContent()
  const contactItems = [
    { icon: 'map-pin', label: 'Address', value: site.address },
    { icon: 'phone', label: 'Phone', value: site.phone, href: telHref(site.phone) },
    { icon: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: 'clock', label: 'Working Hours', value: site.hours },
  ]

  // Quote buttons on service pages link here as /contact?service=<name>, so start the message with it.
  const [searchParams] = useSearchParams()
  const service = searchParams.get('service')
  const [form, setForm] = useState(() => ({
    ...initialForm,
    message: service ? `I'd like a free quote for ${service}.` : '',
  }))
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  usePageMeta(c.meta.title, c.meta.description)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = ui.nameRequired
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = ui.emailInvalid
    if (form.phone.trim() && !/^[+\d][\d\s-]{7,}$/.test(form.phone)) nextErrors.phone = ui.phoneInvalid
    if (!form.message.trim()) nextErrors.message = ui.messageRequired
    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('loading')
    api
      .submitContact(form)
      .then(() => {
        setStatus('success')
        setForm(initialForm)
      })
      .catch((err) => {
        setErrorMessage(err.message)
        setStatus('error')
      })
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <div className="contact-shell">
            <aside className="contact-panel">
              <SectionLabel tone="light">{c.panel.label}</SectionLabel>
              <h2>{c.panel.titleBefore}<span>{c.panel.accent}</span></h2>
              <p className="contact-panel-lead">{c.panel.lead}</p>

              <ul className="contact-info">
                {contactItems.map(({ icon, label, value, href }) => (
                  <li key={label}>
                    <span className="contact-info-icon"><Icon name={icon} size={20} /></span>
                    <div>
                      <small>{label}</small>
                      {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="contact-follow">
                <small>{c.panel.followLabel}</small>
                <SocialIcons className="contact-social" />
              </div>
            </aside>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h3 className="form-heading">{c.form.heading}</h3>
              <p className="form-sub">{c.form.sub}</p>
              {status === 'success' && (
                <div className="form-success">{c.form.success}</div>
              )}
              {status === 'error' && (
                <div className="form-error">
                  {errorMessage || 'Something went wrong. Please try again in a moment.'}
                </div>
              )}

              <label>
                {ui.nameLabel}
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={ui.namePlaceholder}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>

              <label>
                {ui.emailLabel}
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={ui.emailPlaceholder}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>

              <label>
                {ui.phoneLabel}
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={ui.phonePlaceholder}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>

              <label>
                {ui.messageLabel}
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={ui.messagePlaceholder}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </label>

              <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? ui.sending : c.form.button}
              </button>
            </form>
          </div>

          <div className="contact-map">
            <iframe
              title="Ignite Solar location map"
              src={mapSrc(c)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
