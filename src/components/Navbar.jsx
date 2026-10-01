import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useContent } from '../lib/content.jsx'
import './Navbar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { site } = useContent()

  function closeAll() {
    setOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={closeAll}>
          <img src={site.logo} alt={site.siteName} />
        </NavLink>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <ul>
            {site.nav.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={closeAll}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink to="/contact" className="btn btn-primary nav-cta" onClick={closeAll}>
            {site.navCta}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
