import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { useContent, telHref } from '../lib/content.jsx'
import SocialIcons from './SocialIcons.jsx'
import Icon from './Icon.jsx'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()
  const { site, ui } = useContent()
  const { footer } = site
  const { data: services } = useApi(api.getServices)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribeError, setSubscribeError] = useState('')

  function handleSubscribe(event) {
    event.preventDefault()
    setSubscribeError('')
    api
      .subscribe(email)
      .then(() => {
        setSubscribed(true)
        setEmail('')
      })
      .catch((err) => setSubscribeError(err.message))
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col footer-brand">
          <Link to="/" className="brand">
            <img src={site.logo} alt={site.siteName} />
          </Link>
          <p>{footer.about}</p>
          <ul className="contact-list">
            <li><Icon name="map-pin" size={16} />{site.address}</li>
            <li><Icon name="phone" size={16} /><a href={telHref(site.phone)}>{site.phone}</a></li>
            <li><Icon name="mail" size={16} /><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
          <SocialIcons className="footer-social" />
        </div>

        <div className="footer-col">
          <h3>{footer.quickLinksHeading}</h3>
          <ul>
            {footer.quickLinks.map((link) => (
              <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>{footer.servicesHeading}</h3>
          <ul>
            {(services || []).map((service) => (
              <li key={service.slug}><Link to={`/services/${service.slug}`}>{service.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>{footer.newsletterHeading}</h3>
          <p className="footer-newsletter-text">{footer.newsletterText}</p>
          <form className="footer-newsletter" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ui.subscribePlaceholder}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary">{ui.subscribeButton}</button>
          </form>
          {subscribed && <p className="footer-subscribed">{footer.subscribedText}</p>}
          {subscribeError && <p className="footer-subscribed">{subscribeError}</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} {footer.copyrightName}. All rights reserved.</p>
        <p className="footer-legal">
          <Link to="/privacy-policy">{ui.privacyLink}</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms-of-service">{ui.termsLink}</Link>
        </p>
        <p className="footer-credit">{footer.credit}</p>
      </div>
    </footer>
  )
}

export default Footer
