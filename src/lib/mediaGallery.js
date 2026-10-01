// Gallery photos and drone clips are managed in the admin panel (Gallery Media) and served by
// GET /api/media. Files shipped with the site live in public/gallery; uploads come from the backend.
// Small WebP preview shown in the grid: an explicit `thumb` if one was set, otherwise `-thumb.webp`
// for the bundled photos or a poster frame for the bundled videos. Uploaded photos use themselves.
export function thumbSrc(item) {
  if (item.thumb) return item.thumb
  const bundled = item.src.startsWith('/gallery/')
  if (item.type === 'image') return bundled ? item.src.replace(/\.jpeg$/, '-thumb.webp') : item.src
  return bundled ? item.src.replace(/\.mp4$/, '.webp') : ''
}
