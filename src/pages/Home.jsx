import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import LoadState from '../components/LoadState.jsx'
import StatCounter from '../components/StatCounter.jsx'
import { responsiveImage } from '../lib/images.js'
import { api } from '../lib/api.js'
import { useContent, telHref } from '../lib/content.jsx'
import { useApi } from '../lib/useApi.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import './Home.css'
import ServiceCard from '../components/ServiceCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import BannerSlider from '../components/BannerSlider.jsx'

const BANNER_SLIDES = [
  { image: '/images/slide-1.jpeg', alt: 'Ignite Solar banner 1' },
  { image: '/images/slide-2.jpeg', alt: 'Ignite Solar banner 2' },
  { image: '/images/slide-3.jpeg', alt: 'Ignite Solar banner 3' },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function Home() {
  const { home: c, site, ui } = useContent()
  usePageMeta(c.meta.title, c.meta.description)
  const { data: services, loading: servicesLoading, error: servicesError } = useApi(api.getServices)
  const { data: projects } = useApi(api.getProjects)
  const { data: testimonials } = useApi(api.getTestimonials)
  const { data: blogPosts } = useApi(api.getBlogPosts)
  const { data: about } = useApi(api.getAbout)

  const featuredServices = (services || []).slice(0, 6)
  const featuredProjects = (projects || []).slice(0, 6)
  // Featured reviews first, then the rest, so the carousel has more than one page.
  const carouselTestimonials = [...(testimonials || [])].sort((x, y) => Number(y.featured) - Number(x.featured))
  const latestPosts = (blogPosts || []).slice(0, 3)

  return (
    <>
      <BannerSlider slides={c.banner?.slides?.length ? c.banner.slides : BANNER_SLIDES} />

      <section className="section home-about">
        <div className="container split-section">
          <div className="split-image">
            <img src={c.about.image} alt={c.about.imageAlt} loading="lazy" />
          </div>
          <div>
            <SectionLabel>{c.about.label}</SectionLabel>
            <h2 className="editorial-title">{c.about.title}</h2>
            <p className="home-about-text">{c.about.text}</p>
            <Link to="/about" className="btn btn-dark">{c.about.button}</Link>
          </div>
        </div>

        {about?.stats?.length > 0 && (
          <div className="container home-about-stats">
            <div className="home-stats-heading section-title section-title-light">
              <SectionLabel tone="light">{c.impact.label}</SectionLabel>
              <h2>{c.impact.title}</h2>
            </div>
            {about.stats.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        )}
      </section>

      <section className="editorial-hero">
        <div className="container">
          <div className="editorial-copy">
            <SectionLabel>{c.hero.label}</SectionLabel>
            <h1 className="editorial-title">
              {c.hero.titleBefore}<span className="editorial-accent">{c.hero.accent}</span>{c.hero.titleAfter}
            </h1>
            <p>{c.hero.text}</p>
            <div className="editorial-actions">
              <Link to="/contact" className="btn btn-primary">{c.hero.primaryButton}</Link>
              <Link to="/services" className="editorial-link">{c.hero.linkText} <Icon name="arrow-right" size={16} /></Link>
            </div>
            <ul className="editorial-points">
              {c.hero.points.map((point, index) => (
                <li key={index}><Icon name="check" size={12} strokeWidth={3} />{point}</li>
              ))}
            </ul>
          </div>
          <div className="editorial-media">
            <span className="editorial-ring" aria-hidden="true" />
            <span className="editorial-dots" aria-hidden="true" />
            <div className="editorial-photo">
              <img src={c.hero.image} alt={c.hero.imageAlt} loading="lazy" />
            </div>
            <div className="editorial-chip">
              <Icon name="shield-check" size={20} />
              <span>{c.hero.chip}</span>
            </div>
            <div className="editorial-badge">
              <strong>{c.hero.badgeValue}</strong>
              <span>{c.hero.badgeText}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.services.label}</SectionLabel>
            <h2 className="editorial-title">{c.services.title}</h2>
            <p>{c.services.text}</p>
          </div>
          <LoadState loading={servicesLoading} error={servicesError} />
          <div className="editorial-grid">
            {featuredServices.map((service) => (
              <ServiceCard service={service} key={service.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section why-choose-us">
        <div className="container why-layout">
          <div className="why-intro">
            <SectionLabel tone="light">{c.why.label}</SectionLabel>
            <h2 className="editorial-title">
              {c.why.titleBefore}<span className="editorial-accent">{c.why.accent}</span>
            </h2>
            <p>{c.why.text}</p>
            <Link to="/contact" className="btn btn-primary">{c.why.button}</Link>
          </div>
          <div className="why-grid">
            {c.why.items.map((item, index) => (
              <div className="why-card" key={index}>
                <span className="why-icon" aria-hidden="true"><Icon name={item.icon} size={28} /></span>
                <div className="why-body">
                  <span className="why-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split-section">
          <div className="split-image">
            <img src={c.journey.image} alt={c.journey.imageAlt} loading="lazy" />
          </div>
          <div>
            <SectionLabel>{c.journey.label}</SectionLabel>
            <h2 className="editorial-title">{c.journey.title}</h2>
            <ul className="check-list">
              {c.journey.steps.map((point, index) => (
                <li key={index}><Icon name="check" size={16} strokeWidth={2.6} />{point}</li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-dark">{c.journey.button}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.projects.label}</SectionLabel>
            <h2 className="editorial-title">{c.projects.title}</h2>
            <p>{c.projects.text}</p>
          </div>
          <div className="gallery-preview-grid">
            {featuredProjects.map((project) => (
              <img
                key={project.id}
                {...responsiveImage(project.images[0], '(max-width: 640px) 50vw, 33vw')}
                alt={project.title}
              />
            ))}
          </div>
          <div className="view-all-wrap">
            <Link to="/gallery" className="btn btn-outline-dark">{c.projects.button}</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.blog.label}</SectionLabel>
            <h2 className="editorial-title">{c.blog.title}</h2>
          </div>
          <div className="blog-preview-grid">
            {latestPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-mini-card" key={post.slug}>
                <div className="blog-mini-media">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-mini-category">{post.category}</span>
                </div>
                <div className="blog-mini-body">
                  <span className="blog-mini-date">
                    <Icon name="clock" size={14} />
                    {formatDate(post.date)}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-mini-more">
                    {ui.readArticle} <Icon name="arrow-right" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="container">
          <div className="section-title section-title-light">
            <SectionLabel tone="light">{c.testimonials.label}</SectionLabel>
            <h2>{c.testimonials.title}</h2>
          </div>
          <TestimonialCarousel testimonials={carouselTestimonials} />
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-panel">
          <Icon name="sun" size={260} strokeWidth={1} className="cta-panel-sun" />
          <div className="cta-panel-copy">
            <SectionLabel tone="accent">{c.cta.label}</SectionLabel>
            <h2 className="editorial-title">{c.cta.title}</h2>
            <p>{c.cta.text}</p>
          </div>
          <div className="cta-panel-actions">
            <Link to="/contact" className="btn btn-light">
              {c.cta.button} <Icon name="arrow-right" size={18} />
            </Link>
            <a href={telHref(site.phone)} className="btn btn-outline">
              <Icon name="phone" size={18} /> {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
