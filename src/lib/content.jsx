import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api.js'

const ContentContext = createContext(null)

// Loads all editable page copy (site info, home, about, legal ...) once, before the site renders,
// so every page and the header/footer read the same data the admin panel edits.
export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: null, error: null })

  useEffect(() => {
    let cancelled = false
    api
      .getContent()
      .then((content) => !cancelled && setState({ content, error: null }))
      .catch((error) => !cancelled && setState({ content: null, error }))
    return () => {
      cancelled = true
    }
  }, [])

  // Appearance settings from Site Settings → CSS variables on <html>. Anything left empty keeps the stylesheet default.
  const theme = state.content?.site?.theme
  useEffect(() => {
    if (!theme) return
    const root = document.documentElement
    const set = (name, value) => (value ? root.style.setProperty(name, value) : root.style.removeProperty(name))
    const hex = (v) => (/^#[0-9a-f]{6}$/i.test(v || '') ? v : '')
    const px = (v) => (Number(v) > 0 ? `${Number(v)}px` : '')

    const primary = hex(theme.primaryColor)
    set('--color-primary', primary)
    set('--color-primary-dark', primary && `color-mix(in srgb, ${primary} 70%, black)`)
    set('--color-primary-soft', primary && `color-mix(in srgb, ${primary} 14%, transparent)`)
    set('--gradient-primary', primary && `linear-gradient(135deg, color-mix(in srgb, ${primary} 85%, white) 0%, ${primary} 50%, color-mix(in srgb, ${primary} 88%, black) 100%)`)
    set('--gradient-primary-hover', primary && `linear-gradient(135deg, ${primary} 0%, color-mix(in srgb, ${primary} 88%, black) 55%, color-mix(in srgb, ${primary} 78%, black) 100%)`)
    set('--shadow-primary', primary && `0 10px 24px color-mix(in srgb, ${primary} 38%, transparent)`)

    const dark = hex(theme.darkColor)
    set('--color-dark', dark)
    set('--gradient-dark', dark && `linear-gradient(135deg, ${dark} 0%, color-mix(in srgb, ${dark} 85%, white) 55%, color-mix(in srgb, ${dark} 70%, white) 100%)`)
    set('--color-text', hex(theme.textColor))

    // The whole site is sized in rem/px from the root, so the root font size scales the base text.
    root.style.fontSize = Number(theme.fontSize) > 0 ? `${Number(theme.fontSize)}px` : ''

    const logoH = Number(theme.logoHeight) > 0 ? Number(theme.logoHeight) : 0
    set('--logo-height', px(logoH))
    set('--logo-height-mobile', logoH ? `${Math.round(logoH * 0.85)}px` : '')
    set('--logo-width', px(theme.logoWidth))
    set('--footer-logo-height', px(theme.footerLogoHeight))
  }, [theme])

  const favicon = state.content?.site?.favicon
  useEffect(() => {
    if (!favicon) return
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.removeAttribute('type')
    link.href = favicon
  }, [favicon])

  if (state.error) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Could not load the website content. Please make sure the API server (Backend) and MySQL are running, then refresh.
      </div>
    )
  }
  if (!state.content) return null

  return <ContentContext.Provider value={state.content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}

export const telHref = (phone) => `tel:${String(phone).replace(/\s/g, '')}`
