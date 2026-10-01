import { useEffect } from 'react'

// Elements that slide up as they scroll into view. Keep in sync with the @supports block in index.css,
// which does the same with CSS scroll-driven animations in browsers that support them.
const REVEAL_SELECTOR = [
  '.section-title', '.why-card', '.editorial-card', '.process-card', '.value-card', '.mv-card',
  '.team-card', '.cert-badge', '.blog-card', '.blog-mini-card', '.split-section > *', '.about-grid > *',
  '.stat-counter', '.project-thumb', '.gallery-preview-grid img', '.media-card', '.contact-shell', '.contact-map',
  '.contact-info li', '.tcarousel', '.area-list li', '.enquiry-form', '.cta-panel', '.cta-simple .container',
].join(', ')

// Start each page at the top when the route changes.
export function useScrollToTop(pathname) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
}

// Fallback for browsers without CSS scroll-driven animations: an IntersectionObserver adds
// `reveal-in`, and index.css plays the same slide-up.
export function useRevealFallback(pathname) {
  useEffect(() => {
    if (typeof CSS === 'undefined' || CSS.supports('animation-timeline: view()')) return undefined
    const main = document.querySelector('main')
    if (!main) return undefined

    const seen = new WeakSet()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('reveal-in')
          io.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    const scan = () => {
      main.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        el.classList.add('reveal-pending')
        io.observe(el)
      })
    }
    scan()
    // Sections mount after their data loads, so watch for new ones.
    const mo = new MutationObserver(scan)
    mo.observe(main, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}
