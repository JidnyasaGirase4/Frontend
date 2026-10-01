// Images that have pre-generated -480 / -960 variants in public/images.
const RESPONSIVE = new Set(['/images/banner-1.jpeg', '/images/installation-1.jpeg'])

export function responsiveImage(src, sizes) {
  const base = { src, loading: 'lazy', decoding: 'async' }
  if (!RESPONSIVE.has(src)) return base

  const stem = src.replace(/\.jpeg$/, '')
  return {
    ...base,
    srcSet: `${stem}-480.jpeg 480w, ${stem}-960.jpeg 960w, ${src} 2560w`,
    sizes,
  }
}
