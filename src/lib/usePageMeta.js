import { useEffect } from 'react'
import { useContent } from './content.jsx'

// Sets the tab title / meta description. The site name and default description come from Site Settings.
export function usePageMeta(title, description) {
  const { site } = useContent()
  const siteName = site.siteName
  const fallback = site.meta.description

  useEffect(() => {
    document.title = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : siteName

    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description || fallback
  }, [title, description, siteName, fallback])
}
