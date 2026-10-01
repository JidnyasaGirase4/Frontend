import { useEffect, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { adminApi, auth } from '../lib/api.js'
import AdminIcon from './AdminIcon.jsx'
import { navigation } from './schema.js'
import { ToastProvider } from './toast.jsx'
import { AccountPage, ContentPage, Dashboard, EditPage, InboxPage, ListPage } from './pages.jsx'
import './admin.css'

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token, user } = await adminApi.login(form.email, form.password)
      auth.set(token)
      onLogin(user)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="adm adm-login-page">
      <form className="adm-login" onSubmit={submit}>
        <img src="/images/ignitelogo.png" alt="Ignite Solar" />
        <h1>Admin Sign In</h1>
        {error && <div className="adm-alert">{error}</div>}
        <label className="adm-label">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus autoComplete="username" />
        <label className="adm-label">Password</label>
        <div className="adm-password">
          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
          <button type="button" className="adm-password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a href="/" className="adm-link adm-center">← Back to website</a>
      </form>
    </div>
  )
}

function Shell({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const [badges, setBadges] = useState({})

  useEffect(() => setMenuOpen(false), [location.pathname])

  // New-enquiry / new-message counts for the sidebar: refreshed on navigation, every minute,
  // and whenever an inbox entry is read or deleted.
  useEffect(() => {
    const load = () => adminApi.badges().then(setBadges).catch(() => {})
    load()
    const timer = setInterval(load, 60000)
    window.addEventListener('adm-inbox-changed', load)
    return () => {
      clearInterval(timer)
      window.removeEventListener('adm-inbox-changed', load)
    }
  }, [location.pathname])

  const badgeFor = (to) => {
    if (to.endsWith('/enquiries')) return badges.enquiries
    if (to.endsWith('/messages')) return badges.messages
    if (to.endsWith('/subscribers')) return badges.subscribers
    return 0
  }

  return (
    <div className={`adm adm-shell${menuOpen ? ' menu-open' : ''}`}>
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <img src="/images/ignitelogo.png" alt="Ignite Solar" />
          <span>Admin</span>
        </div>
        <nav>
          {navigation.map((group) => (
            <div className="adm-nav-group" key={group.heading}>
              <h3>{group.heading}</h3>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `adm-nav-link${isActive ? ' active' : ''}`}>
                  <AdminIcon name={item.icon} size={17} />
                  {item.label}
                  {badgeFor(item.to) > 0 && <span className="adm-nav-badge">{badgeFor(item.to) > 99 ? '99+' : badgeFor(item.to)}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      {menuOpen && <div className="adm-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="adm-main">
        <header className="adm-topbar">
          <button type="button" className="adm-icon-btn adm-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <AdminIcon name="menu" size={20} />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-link adm-view-site"><AdminIcon name="external" size={15} /> View website</a>
          <div className="adm-user">
            <span>{user.name || user.email}</span>
            <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={onLogout}><AdminIcon name="logout" size={15} /> Sign out</button>
          </div>
        </header>
        <main className="adm-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="list/:resource" element={<ListPage />} />
            <Route path="list/:resource/:id" element={<EditPage />} />
            <Route path="page/:key" element={<ContentPage />} />
            <Route path="inbox/:kind" element={<InboxPage />} />
            <Route path="account" element={<AccountPage user={user} />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function AdminApp() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(auth.token))

  useEffect(() => {
    document.title = 'Admin | Ignite Solar'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [])

  useEffect(() => {
    if (!auth.token) return
    adminApi.me().then(({ user: me }) => setUser(me)).catch(() => auth.clear()).finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    const onSignOut = () => setUser(null)
    window.addEventListener('ignite-admin-signout', onSignOut)
    return () => window.removeEventListener('ignite-admin-signout', onSignOut)
  }, [])

  function logout() {
    auth.clear()
    setUser(null)
    navigate('/admin')
  }

  if (checking) return <div className="adm adm-login-page"><p className="adm-muted">Loading…</p></div>
  if (!user) return <Login onLogin={setUser} />

  return (
    <ToastProvider>
      <Shell user={user} onLogout={logout} />
    </ToastProvider>
  )
}

export default AdminApp
