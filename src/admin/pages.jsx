import { Fragment, useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../lib/api.js'
import { FormFields } from './fields.jsx'
import { resources, contentPages } from './schema.js'
import AdminIcon from './AdminIcon.jsx'
import { useToast } from './toast.jsx'

function Loading({ error }) {
  return <p className="adm-muted">{error ? `Error: ${error.message}` : 'Loading…'}</p>
}

function PageHead({ title, hint, children }) {
  return (
    <div className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {hint && <p className="adm-muted">{hint}</p>}
      </div>
      <div className="adm-page-actions">{children}</div>
    </div>
  )
}

// Loads something async once (and again when `deps` change), exposing a reload function.
function useLoad(loader, deps) {
  const [state, setState] = useState({ data: null, error: null })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    setState({ data: null, error: null })
    loader().then((data) => setState({ data, error: null })).catch((error) => setState({ data: null, error }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(load, [load])
  return { ...state, reload: load }
}

const formatDate = (value) => (value ? new Date(String(value).replace(' ', 'T')).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '')

/* ------------------------------------------------------------------ Dashboard */

export function Dashboard() {
  const { data, error } = useLoad(adminApi.dashboard, [])
  if (!data) return <Loading error={error} />

  const cards = [
    { label: 'New messages', value: data.newMessages, sub: `${data.messages} total`, to: '/admin/inbox/messages', accent: true },
    { label: 'Subscribers', value: data.subscribers, to: '/admin/inbox/subscribers' },
    { label: 'Services', value: data.totals.services, to: '/admin/list/services' },
    { label: 'Projects', value: data.totals.projects, to: '/admin/list/projects' },
    { label: 'Blog posts', value: data.totals.blog, to: '/admin/list/blog' },
    { label: 'Testimonials', value: data.totals.testimonials, to: '/admin/list/testimonials' },
    { label: 'Gallery media', value: data.totals.media, to: '/admin/list/media' },
  ]

  return (
    <>
      <PageHead title="Dashboard" hint="Welcome back. Here is what is happening on the website." />
      <div className="adm-stat-grid">
        {cards.map((card) => (
          <Link to={card.to} className={`adm-stat${card.accent ? ' accent' : ''}`} key={card.label}>
            <span className="adm-stat-value">{card.value}</span>
            <span className="adm-stat-label">{card.label}</span>
            {card.sub && <span className="adm-stat-sub">{card.sub}</span>}
          </Link>
        ))}
      </div>

      <div className="adm-two-col">
        <section className="adm-panel">
          <h2>Latest contact messages</h2>
          {data.recentMessages.length === 0 && <p className="adm-muted">No messages yet.</p>}
          <ul className="adm-recent">
            {data.recentMessages.map((m) => (
              <li key={m.id}>
                <strong>{m.name}</strong>
                <span>{m.message.length > 70 ? `${m.message.slice(0, 70)}…` : m.message}</span>
                <small>{formatDate(m.created_at)}</small>
              </li>
            ))}
          </ul>
          <Link to="/admin/inbox/messages" className="adm-link">View all messages</Link>
        </section>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ Lists (CRUD) */

export function ListPage() {
  const { resource } = useParams()
  const cfg = resources[resource]
  const toast = useToast()
  const { data, error, reload } = useLoad(() => adminApi.list(cfg?.api), [resource])

  if (!cfg) return <Loading error={new Error('Unknown section')} />
  if (!data) return <Loading error={error} />

  async function remove(row) {
    if (!window.confirm(`Delete this ${cfg.singular}? This cannot be undone.`)) return
    try {
      await adminApi.remove(cfg.api, row.id)
      toast('Deleted.')
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  // Renumbers the whole list so ordering is always consistent, saving only rows that changed.
  async function moveRow(index, delta) {
    const next = [...data]
    const [row] = next.splice(index, 1)
    next.splice(index + delta, 0, row)
    try {
      await Promise.all(
        next.map((item, i) => (item.sort_order === i ? null : adminApi.update(cfg.api, item.id, { sort_order: i }))),
      )
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const cell = (row, col) => {
    const v = row[col.key]
    if (col.bool) return <span className={`adm-badge ${v ? 'ok' : 'off'}`}>{v ? 'Yes' : 'Hidden'}</span>
    return v === null || v === undefined || v === '' ? '—' : String(v)
  }

  return (
    <>
      <PageHead title={cfg.title} hint={`${data.length} item${data.length === 1 ? '' : 's'}`}>
        <Link to={`/admin/list/${resource}/new`} className="adm-btn adm-btn-primary"><AdminIcon name="plus" size={16} /> Create {cfg.singular}</Link>
      </PageHead>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              {cfg.columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th className="adm-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr><td colSpan={cfg.columns.length + 1} className="adm-empty">Nothing here yet.</td></tr>
            )}
            {data.map((row, index) => (
              <tr key={row.id}>
                {cfg.columns.map((c) => <td key={c.key} data-label={c.label}>{cell(row, c)}</td>)}
                <td className="adm-td-actions">
                  {cfg.reorder && (
                    <>
                      <button type="button" className="adm-icon-btn" title="Move up" onClick={() => moveRow(index, -1)} disabled={index === 0}><AdminIcon name="up" size={15} /></button>
                      <button type="button" className="adm-icon-btn" title="Move down" onClick={() => moveRow(index, 1)} disabled={index === data.length - 1}><AdminIcon name="down" size={15} /></button>
                    </>
                  )}
                  <Link to={`/admin/list/${resource}/${row.id}`} className="adm-icon-btn with-text" title="Edit"><AdminIcon name="edit" size={15} /><span>Edit</span></Link>
                  <button type="button" className="adm-icon-btn with-text danger" title="Delete" onClick={() => remove(row)}><AdminIcon name="trash" size={15} /><span>Delete</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function EditPage() {
  const { resource, id } = useParams()
  const cfg = resources[resource]
  const isNew = id === 'new'
  const navigate = useNavigate()
  const toast = useToast()
  const [record, setRecord] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setRecord(null)
    if (isNew) {
      setRecord(structuredClone(cfg.empty))
      return
    }
    adminApi.list(cfg.api).then((rows) => {
      const found = rows.find((r) => String(r.id) === id)
      if (found) setRecord(found)
      else setError(new Error('Not found'))
    }).catch(setError)
  }, [resource, id, isNew, cfg])

  if (!record) return <Loading error={error} />

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    try {
      if (isNew) await adminApi.create(cfg.api, record)
      else await adminApi.update(cfg.api, id, record)
      toast('Saved.')
      navigate(`/admin/list/${resource}`)
    } catch (err) {
      toast(err.message, 'error')
      setSaving(false)
    }
  }

  return (
    <>
      <PageHead title={`${isNew ? 'Create' : 'Edit'} ${cfg.singular}`}>
        <Link to={`/admin/list/${resource}`} className="adm-btn adm-btn-light">Cancel</Link>
      </PageHead>
      <form className="adm-panel" onSubmit={save}>
        <FormFields fields={cfg.fields} value={record} onChange={setRecord} isNew={isNew} />
        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <Link to={`/admin/list/${resource}`} className="adm-btn adm-btn-light">Cancel</Link>
        </div>
      </form>
    </>
  )
}

/* ------------------------------------------------------------------ Page copy */

const PUBLIC_PATH = {
  home: '/', about: '/about', services_page: '/services', gallery_page: '/gallery', blog_page: '/blog',
  testimonials_page: '/testimonials', contact: '/contact', privacy: '/privacy-policy', terms: '/terms-of-service',
}

export function ContentPage() {
  const { key } = useParams()
  const cfg = contentPages[key]
  const toast = useToast()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setData(null)
    setError(null)
    setSaved(false)
    adminApi.getContent(key).then(setData).catch(setError)
  }, [key])

  if (!cfg) return <Loading error={new Error('Unknown page')} />
  if (!data) return <Loading error={error} />

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      setData(await adminApi.saveContent(key, data))
      toast('Changes saved successfully. The website is updated.')
      setSaved(true)
      setTimeout(() => setSaved(false), 5000)
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageHead title={cfg.title} hint={cfg.hint}>
        {PUBLIC_PATH[key] && (
          <a href={PUBLIC_PATH[key]} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-light"><AdminIcon name="external" size={15} /> View page</a>
        )}
      </PageHead>
      <form className="adm-panel" onSubmit={save}>
        <FormFields fields={cfg.fields} value={data} onChange={setData} />
        <div className="adm-form-actions adm-sticky">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          {saved && <span className="adm-saved" role="status">✓ Changes saved successfully</span>}
        </div>
      </form>
    </>
  )
}

/* ------------------------------------------------------------------ Inboxes */

const inboxes = {
  enquiries: {
    title: 'Enquiries',
    columns: [
      { key: 'full_name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'service_interested', label: 'Service' },
    ],
    details: [
      ['Property type', 'property_type'], ['Address / city', 'address'], ['Monthly bill', 'monthly_bill'], ['Message', 'message'],
    ],
  },
  messages: {
    title: 'Contact Messages',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
    ],
    details: [['Message', 'message']],
  },
  subscribers: {
    title: 'Newsletter Subscribers',
    columns: [{ key: 'email', label: 'Email' }],
    details: [],
  },
}

export function InboxPage() {
  const { kind } = useParams()
  const cfg = inboxes[kind]
  const toast = useToast()
  const [openId, setOpenId] = useState(null)
  const { data, error, reload } = useLoad(() => adminApi.list(kind), [kind])

  // Opening an inbox counts as having seen what's new in it, so its sidebar count clears.
  // The rows keep their "new" highlight on screen until the next visit.
  useEffect(() => {
    if (!inboxes[kind] || !data) return
    const fresh = data.filter((row) => row.status === 'new')
    if (!fresh.length) return
    Promise.all(fresh.map((row) => adminApi.setStatus(kind, row.id, 'read')))
      .then(() => window.dispatchEvent(new Event('adm-inbox-changed')))
      .catch(() => {})
  }, [kind, data])

  if (!cfg) return <Loading error={new Error('Unknown inbox')} />
  if (!data) return <Loading error={error} />

  async function setStatus(row, status) {
    try {
      await adminApi.setStatus(kind, row.id, status)
      window.dispatchEvent(new Event('adm-inbox-changed'))
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  async function remove(row) {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
    try {
      await adminApi.remove(kind, row.id)
      toast('Deleted.')
      window.dispatchEvent(new Event('adm-inbox-changed'))
      reload()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  function toggle(row) {
    setOpenId(openId === row.id ? null : row.id)
    if (row.status === 'new' && cfg.details.length) setStatus(row, 'read')
  }

  return (
    <>
      <PageHead title={cfg.title} hint={`${data.length} total`} />
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Received</th>
              {cfg.columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th>Status</th>
              <th className="adm-th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && <tr><td colSpan={cfg.columns.length + 3} className="adm-empty">Nothing received yet.</td></tr>}
            {data.map((row) => (
              <Fragment key={row.id}>
                <tr className={row.status === 'new' ? 'adm-row-new' : ''}>
                  <td data-label="Received">{formatDate(row.created_at)}</td>
                  {cfg.columns.map((c) => <td key={c.key} data-label={c.label}>{row[c.key] || '—'}</td>)}
                  <td data-label="Status">
                    <select className="adm-status" value={row.status} onChange={(e) => setStatus(row, e.target.value)}>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="adm-td-actions">
                    {cfg.details.length > 0 && (
                      <button type="button" className="adm-icon-btn" title="View details" onClick={() => toggle(row)}><AdminIcon name="chevron" size={15} /></button>
                    )}
                    <button type="button" className="adm-icon-btn with-text danger" title="Delete" onClick={() => remove(row)}><AdminIcon name="trash" size={15} /><span>Delete</span></button>
                  </td>
                </tr>
                {openId === row.id && (
                  <tr className="adm-detail-row">
                    <td colSpan={cfg.columns.length + 3}>
                      <dl className="adm-detail">
                        {cfg.details.map(([label, key]) => (
                          <div key={key}><dt>{label}</dt><dd>{row[key] || '—'}</dd></div>
                        ))}
                      </dl>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ Account */

export function AccountPage({ user }) {
  const toast = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    if (form.newPassword !== form.confirm) return toast('New passwords do not match.', 'error')
    setSaving(true)
    try {
      await adminApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      toast('Password changed.')
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const set = (name) => (e) => setForm({ ...form, [name]: e.target.value })

  return (
    <>
      <PageHead title="My Account" hint={`Signed in as ${user.email}`} />
      <form className="adm-panel adm-narrow" onSubmit={submit}>
        <h2>Change password</h2>
        <div className="adm-fields">
          <div className="adm-field wide"><label className="adm-label">Current password</label><input type="password" value={form.currentPassword} onChange={set('currentPassword')} required /></div>
          <div className="adm-field wide"><label className="adm-label">New password (min 8 characters)</label><input type="password" value={form.newPassword} onChange={set('newPassword')} required minLength={8} /></div>
          <div className="adm-field wide"><label className="adm-label">Confirm new password</label><input type="password" value={form.confirm} onChange={set('confirm')} required /></div>
        </div>
        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Update password'}</button>
        </div>
      </form>
    </>
  )
}
