import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useContent } from '../lib/content.jsx'
import { useApi } from '../lib/useApi.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import './Services.css'
import ServiceCard from '../components/ServiceCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'

function Services() {
  const { services_page: c } = useContent()
  const { data: services, loading, error } = useApi(api.getServices)
  usePageMeta(c.meta.title, c.meta.description)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.intro.label}</SectionLabel>
            <h2>{c.intro.title}</h2>
            <p>{c.intro.text}</p>
          </div>
          <LoadState loading={loading} error={error} />
          <div className="editorial-grid">
            {(services || []).map((service) => (
              <ServiceCard service={service} key={service.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.process.label}</SectionLabel>
            <h2>{c.process.title}</h2>
          </div>
          <div className="process-grid">
            {c.process.items.map((item, index) => (
              <div className="process-card" key={index}>
                <span className="process-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-simple">
        <div className="container">
          <h2>{c.cta.title}</h2>
          <p>{c.cta.text}</p>
          <Link to="/contact" className="btn btn-primary">{c.cta.button}</Link>
        </div>
      </section>
    </>
  )
}

export default Services
