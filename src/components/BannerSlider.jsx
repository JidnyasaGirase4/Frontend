import { useEffect, useRef, useState } from 'react'
import './BannerSlider.css'

const INTERVAL = 5000

function BannerSlider({ slides }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  function goTo(index) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' })
  }

  function onScroll() {
    const track = trackRef.current
    if (!track) return
    setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  useEffect(() => {
    if (paused || slides.length < 2) return undefined
    const timer = setInterval(() => goTo((active + 1) % slides.length), INTERVAL)
    return () => clearInterval(timer)
  }, [active, paused, slides.length])

  return (
    <section
      className="banner-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="banner-track" ref={trackRef} onScroll={onScroll}>
        {slides.map((slide, i) => (
          <img key={slide.image} src={slide.image} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>
      {slides.length > 1 && (
        <div className="banner-dots">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              className={i === active ? 'active' : ''}
              onClick={() => goTo(i)}
              aria-label={`Show banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default BannerSlider
