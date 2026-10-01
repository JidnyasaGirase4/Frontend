import { useContent, telHref } from '../lib/content.jsx'
import SocialIcons from './SocialIcons.jsx'
import './TopBar.css'

function TopBar() {
  const { site } = useContent()

  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <div className="topbar-contact">
          <a href={telHref(site.phone)}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            <span>{site.phone}</span>
          </a>
          <a href={`mailto:${site.email}`}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 6L2 7" />
            </svg>
            <span>{site.email}</span>
          </a>
        </div>

        <SocialIcons />
      </div>
    </div>
  )
}

export default TopBar
