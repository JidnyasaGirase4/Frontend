import { useCallback, useEffect, useRef, useState } from 'react'
import CustomerAvatar from './CustomerAvatar.jsx'
import Icon from './Icon.jsx'
import './TestimonialCarousel.css'

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rating ? 'star filled' : 'star'}><Icon name="star" size={20} filled strokeWidth={1.2} /></span>
      ))}
    </div>
  )
}

function cardsPerView() {
  if (typeof window === 'undefined') return 3
  if (window.matchMedia('(max-width: 640px)').matches) return 1
  if (window.matchMedia('(max-width: 960px)').matches) return 2
  return 3
}

// Splits into pages of `size`. A short final page is filled by stepping back, so
// the last page always shows a full row (it repeats cards from the page before).
function chunk(items, size) {
  const pages = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.length - i >= size ? items.slice(i, i + size) : items.slice(-size))
  }
  return pages
}

// Shows `perView` cards at a time; the arrows (and swipe / scroll) move a whole
// page. The arrows sit in their own columns beside the cards so they never overlap.
function TestimonialCarousel({ testimonials }) {
  const trackRef = useRef(null)
  const [perView, setPerView] = useState(cardsPerView)
  const [page, setPage] = useState(0)

  const pages = chunk(testimonials, perView)
  const lastPage = pages.length - 1

  useEffect(() => {
    const onResize = () => setPerView(cardsPerView())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    // Scrolling back to the start fires onScroll, which resets the page.
    if (track) track.scrollTo({ left: 0 })
  }, [perView])

  const goTo = useCallback((next) => {
    const track = trackRef.current
    if (!track) return
    const target = Math.max(0, Math.min(next, lastPage))
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' })
  }, [lastPage])

  const handleScroll = (e) => {
    const track = e.currentTarget
    setPage(Math.round(track.scrollLeft / track.clientWidth))
  }

  if (testimonials.length === 0) return null

  const multiPage = pages.length > 1

  return (
    <div className="tcarousel">
      <div className="tcarousel-stage">
        {multiPage && (
          <button
            type="button"
            className="tcarousel-arrow"
            aria-label="Previous testimonials"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
          >
            <Icon name="arrow-left" size={20} />
          </button>
        )}

        <div className="tcarousel-track" ref={trackRef} onScroll={handleScroll}>
          {pages.map((group, pageIndex) => (
            <div
              className="tcarousel-page"
              key={pageIndex}
              style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
            >
              {group.map((item) => (
                <figure className="tcarousel-card" key={item.id}>
                  <Icon name="quote" size={34} filled strokeWidth={0} className="tcarousel-quote" />
                  <Stars rating={item.rating} />
                  <blockquote>{item.text}</blockquote>
                  <figcaption>
                    <CustomerAvatar name={item.name} photo={item.photo} size={46} />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.location}</small>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>

        {multiPage && (
          <button
            type="button"
            className="tcarousel-arrow"
            aria-label="Next testimonials"
            onClick={() => goTo(page + 1)}
            disabled={page === lastPage}
          >
            <Icon name="arrow-right" size={20} />
          </button>
        )}
      </div>

      {multiPage && (
        <div className="testimonial-dots">
          {pages.map((_, i) => (
            <button
              type="button"
              key={i}
              className={i === page ? 'dot active' : 'dot'}
              aria-label={`Show testimonials page ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TestimonialCarousel
