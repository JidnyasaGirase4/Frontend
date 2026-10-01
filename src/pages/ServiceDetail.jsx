import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { serviceIconName } from '../lib/serviceIcon.js'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { useContent } from '../lib/content.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import './ServiceDetail.css'

function ServiceDetail() {
  const { service_detail: c } = useContent()
  const { slug } = useParams()
  const { data: service, loading, error } = useApi(() => api.getService(slug), [slug])
  const { data: projects } = useApi(api.getProjects)
  usePageMeta(service?.title, service?.summary)

  if (loading || error) {
    return <LoadState loading={loading} error={error} />
  }

  const allProjects = projects || []
  const serviceCategory = slug.includes('commercial') ? 'Commercial' : slug.includes('residential') ? 'Residential' : null
  const sameCategory = serviceCategory ? allProjects.filter((p) => p.category === serviceCategory) : []
  const relatedProjects = [...sameCategory, ...allProjects.filter((p) => !sameCategory.includes(p))].slice(0, 3)
  const relatedImages = relatedProjects.map((p) => p.images[0])

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="service-icon-hero"><Icon name={serviceIconName(service)} size={30} /></span>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <h2>{c.overviewHeading}</h2>
            <p className="service-description">{service.description}</p>

            <h2>{c.benefitsHeading}</h2>
            <ul className="benefit-list">
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <h2>{c.processHeading}</h2>
            <ol className="process-steps">
              {service.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <aside className="service-sidebar">
            <h3>{c.sidebarHeading.replace('{title}', service.title)}</h3>
            <p>{c.sidebarText}</p>
            <Link
              to={`/contact?service=${encodeURIComponent(service.title)}`}
              className="btn btn-primary"
            >
              {c.quoteButton}
            </Link>

            <div className="related-gallery">
              <h4>{c.relatedHeading}</h4>
              <div className="related-gallery-grid">
                {relatedImages.map((img, i) => (
                  <img key={i} src={img} alt={`${service.title} example ${i + 1}`} />
                ))}
              </div>
              <Link to="/gallery" className="view-gallery-link">{c.galleryLink} <Icon name="arrow-right" size={15} /></Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default ServiceDetail
