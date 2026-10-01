import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { thumbSrc } from '../lib/mediaGallery.js'
import { useContent } from '../lib/content.jsx'
import './MediaGallery.css'

const FILTERS = ['All', 'Images', 'Videos']

const filterIcon = { All: 'sparkles', Images: 'image', Videos: 'film' }

function MediaGallery({ items }) {
  const { ui } = useContent()
  const filterLabel = { All: ui.mediaAll, Images: ui.mediaImages, Videos: ui.mediaVideos }
  const [filter, setFilter] = useState('All')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleItems = useMemo(() => {
    if (filter === 'Images') return items.filter((item) => item.type === 'image')
    if (filter === 'Videos') return items.filter((item) => item.type === 'video')
    return items
  }, [items, filter])

  const visibleImages = useMemo(() => visibleItems.filter((item) => item.type === 'image'), [visibleItems])

  function openImage(item) {
    setLightboxIndex(visibleImages.indexOf(item))
  }

  function showPrev() {
    setLightboxIndex((i) => (i - 1 + visibleImages.length) % visibleImages.length)
  }

  function showNext() {
    setLightboxIndex((i) => (i + 1) % visibleImages.length)
  }

  return (
    <>
      <div className="media-toolbar">
        <div className="media-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="media-dropdown-toggle"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((v) => !v)}
          >
            <span className="media-dropdown-label">
              <Icon name={filterIcon[filter]} size={18} />
              {ui.mediaViewGallery} — {filterLabel[filter]}
            </span>
            <Icon name="chevron-down" size={18} className={`media-dropdown-chevron${dropdownOpen ? ' open' : ''}`} />
          </button>
          {dropdownOpen && (
            <ul className="media-dropdown-panel" role="listbox">
              {FILTERS.map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={filter === f}
                    className={`media-dropdown-option${filter === f ? ' active' : ''}`}
                    onClick={() => {
                      setFilter(f)
                      setDropdownOpen(false)
                    }}
                  >
                    <span className="media-dropdown-option-icon">
                      <Icon name={filterIcon[f]} size={16} />
                    </span>
                    <span className="media-dropdown-option-label">{filterLabel[f]}</span>
                    {filter === f && <Icon name="check" size={14} className="media-dropdown-option-check" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div className="media-empty">
          <Icon name={filterIcon[filter]} size={30} />
          <p>{ui.noMedia.replace('{filter}', filterLabel[filter].toLowerCase())}</p>
        </div>
      ) : (
        <div className="media-masonry">
          {visibleItems.map((item) => (
            <MediaCard
              key={item.src}
              item={item}
              onOpen={() => (item.type === 'image' ? openImage(item) : setActiveVideo(item))}
            />
          ))}
        </div>
      )}

      {lightboxIndex !== null && visibleImages[lightboxIndex] && (
        <ImageLightbox
          items={visibleImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      {activeVideo && <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />}
    </>
  )
}

function MediaCard({ item, onOpen }) {
  const { ui } = useContent()
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="media-card media-card-broken">
        <Icon name={item.type === 'video' ? 'film' : 'image'} size={26} />
        <p>{item.type === 'video' ? ui.videoUnavailable : ui.imageUnavailable}</p>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`media-card media-card-${item.type}`}
      onClick={onOpen}
      aria-label={`${item.type === 'video' ? ui.playVideo : ui.viewImage}: ${item.title}`}
    >
      <img src={thumbSrc(item)} alt={item.type === 'image' ? item.title : ''} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      <span className="media-card-overlay" aria-hidden="true">
        <span className="media-card-icon">
          <Icon name={item.type === 'video' ? 'play' : 'expand'} size={item.type === 'video' ? 24 : 20} />
        </span>
        <span className="media-card-label">{item.type === 'video' ? ui.playVideo : ui.viewImage}</span>
      </span>
      {item.type === 'video' && (
        <span className="media-card-badge">
          <Icon name="film" size={12} /> {ui.videoBadge}
        </span>
      )}
    </button>
  )
}

function ImageLightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  const item = items[index]

  return (
    <div className="media-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image viewer">
      <button className="media-lightbox-close" onClick={onClose} aria-label="Close image viewer">
        <Icon name="x" size={22} />
      </button>
      {items.length > 1 && (
        <button
          className="media-lightbox-nav media-lightbox-prev"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous image"
        >
          <Icon name="arrow-left" size={24} />
        </button>
      )}
      <figure className="media-lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.title} className="media-lightbox-image" loading="eager" />
        <figcaption className="media-lightbox-counter">
          {index + 1} / {items.length}
        </figcaption>
      </figure>
      {items.length > 1 && (
        <button
          className="media-lightbox-nav media-lightbox-next"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next image"
        >
          <Icon name="arrow-right" size={24} />
        </button>
      )}
    </div>
  )
}

function VideoModal({ item, onClose }) {
  const { ui } = useContent()
  const [failed, setFailed] = useState(false)
  const [buffering, setBuffering] = useState(true)

  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="media-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Video player">
      <button className="media-lightbox-close" onClick={onClose} aria-label="Close video player">
        <Icon name="x" size={22} />
      </button>
      <div className="media-video-shell" onClick={(e) => e.stopPropagation()}>
        {failed ? (
          <div className="media-video-fallback">
            <Icon name="film" size={32} />
            <p>{ui.videoCantPreview}</p>
            <a href={item.src} download className="btn btn-primary">
              <Icon name="download" size={16} />
              {ui.downloadVideo}
            </a>
          </div>
        ) : (
          <div className="media-video-wrap">
            {buffering && (
              <div className="media-video-spinner" aria-hidden="true">
                <span className="media-spinner" />
                <span className="media-spinner-label">{ui.loadingVideo}</span>
              </div>
            )}
            <video
              src={item.src}
              poster={thumbSrc(item)}
              controls
              preload="metadata"
              playsInline
              className="media-video-player"
              onError={() => setFailed(true)}
              onCanPlay={() => setBuffering(false)}
              onWaiting={() => setBuffering(true)}
              onPlaying={() => setBuffering(false)}
            >
              Your browser does not support this video format.
            </video>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaGallery
