import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox.jsx'
import MediaGallery from '../components/MediaGallery.jsx'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import { responsiveImage } from '../lib/images.js'
import { useContent } from '../lib/content.jsx'
import './Gallery.css'
import SectionLabel from '../components/SectionLabel.jsx'

const filters = ['All', 'Residential', 'Commercial']

const capacityMatchers = [
  { key: 'capacityAny', match: () => true },
  { key: 'capacitySmall', match: (kw) => kw <= 10 },
  { key: 'capacityMedium', match: (kw) => kw > 10 && kw <= 50 },
  { key: 'capacityLarge', match: (kw) => kw > 50 },
]

function Gallery() {
  const { gallery_page: c, ui } = useContent()
  const capacityFilters = capacityMatchers.map((f) => ({ ...f, label: ui[f.key] }))
  const filterLabel = { All: ui.filterAll, Residential: ui.filterResidential, Commercial: ui.filterCommercial }
  const { data, loading, error } = useApi(api.getProjects)
  const { data: mediaItems } = useApi(api.getMedia)
  usePageMeta(c.meta.title, c.meta.description)
  const [activeFilter, setActiveFilter] = useState('All')
  const [capacityIndex, setCapacityIndex] = useState(0)
  const [lightbox, setLightbox] = useState(null) // { images, index }

  const filteredProjects = useMemo(() => {
    const capacityMatch = capacityFilters[capacityIndex].match
    return (data || []).filter((project) => {
      const matchesType = activeFilter === 'All' || project.category === activeFilter
      return matchesType && capacityMatch(parseFloat(project.capacity))
    })
  }, [data, activeFilter, capacityIndex])

  function openLightbox(images, index) {
    setLightbox({ images, index })
  }

  function closeLightbox() {
    setLightbox(null)
  }

  function showPrev() {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }))
  }

  function showNext() {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }))
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="page-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{ui.breadcrumbHome}</Link>
            <span aria-hidden="true">/</span>
            <span>{ui.breadcrumbGallery}</span>
          </nav>
          <SectionLabel tone="light">{c.hero.label}</SectionLabel>
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.media.label}</SectionLabel>
            <h2>{c.media.title}</h2>
            <p>{c.media.text}</p>
          </div>
          <MediaGallery items={mediaItems || []} />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.projects.label}</SectionLabel>
            <h2>{c.projects.title}</h2>
          </div>
          <div className="gallery-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                className={filter === activeFilter ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setActiveFilter(filter)}
              >
                {filterLabel[filter]}
              </button>
            ))}
          </div>

          <div className="gallery-filters gallery-filters-secondary">
            {capacityFilters.map((filter, i) => (
              <button
                key={filter.label}
                className={i === capacityIndex ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setCapacityIndex(i)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <LoadState loading={loading} error={error} />
          {!loading && !error && filteredProjects.length === 0 && (
            <p className="gallery-empty">{ui.noProjects}</p>
          )}
          <div className="gallery-grid">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="project-thumb"
                onClick={() => openLightbox(project.images, 0)}
                aria-label={`View photos: ${project.title}`}
              >
                <img
                  {...responsiveImage(project.images[0], '(max-width: 640px) 100vw, (max-width: 960px) 50vw, 380px')}
                  alt={project.title}
                />
                <span className="project-thumb-overlay" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </>
  )
}

export default Gallery
