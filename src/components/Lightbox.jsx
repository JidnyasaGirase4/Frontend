import { useEffect } from 'react'
import Icon from './Icon.jsx'
import { responsiveImage } from '../lib/images.js'
import './Lightbox.css'

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close"><Icon name="x" size={22} /></button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Previous image"
      >
        <Icon name="arrow-left" size={24} />
      </button>
      <img
        {...responsiveImage(images[index], '90vw')}
        loading="eager"
        alt={`Gallery image ${index + 1}`}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Next image"
      >
        <Icon name="arrow-right" size={24} />
      </button>
    </div>
  )
}

export default Lightbox
