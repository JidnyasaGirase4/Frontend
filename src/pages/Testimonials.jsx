import { api } from '../lib/api.js'
import { useContent } from '../lib/content.jsx'
import { useApi } from '../lib/useApi.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import SectionLabel from '../components/SectionLabel.jsx'

function Testimonials() {
  const { testimonials_page: c } = useContent()
  const { data: testimonials, loading, error } = useApi(api.getTestimonials)
  usePageMeta(c.meta.title, c.meta.description)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="quote-band quote-band-light">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.section.label}</SectionLabel>
            <h2>{c.section.title}</h2>
          </div>
          <LoadState loading={loading} error={error} />
          <TestimonialCarousel testimonials={testimonials || []} />
        </div>
      </section>
    </>
  )
}

export default Testimonials
