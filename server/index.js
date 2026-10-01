import express from 'express'
import cors from 'cors'
import { db } from './db.js'
import { sendEnquiryEmails, sendContactEmails } from './mailer.js'
import './seed.js'

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

function parseService(row) {
  return { ...row, benefits: JSON.parse(row.benefits), process: JSON.parse(row.process) }
}

function parseProject(row) {
  return { ...row, images: JSON.parse(row.images) }
}

function parseBlogPost(row) {
  return { ...row, content: JSON.parse(row.content), tags: JSON.parse(row.tags) }
}

// ---- Services ----
app.get('/api/services', (req, res) => {
  const rows = db.prepare('SELECT * FROM services ORDER BY sort_order').all()
  res.json(rows.map(parseService))
})

app.get('/api/services/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE slug = ?').get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Service not found' })
  res.json(parseService(row))
})

// ---- Projects ----
app.get('/api/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order').all()
  res.json(rows.map(parseProject))
})

// ---- Testimonials ----
app.get('/api/testimonials', (req, res) => {
  const rows = db.prepare('SELECT id, name, location, rating, text, featured, photo FROM testimonials WHERE approved = 1 ORDER BY id').all()
  res.json(rows.map((r) => ({ ...r, featured: Boolean(r.featured) })))
})

// ---- Blog ----
app.get('/api/blog', (req, res) => {
  const rows = db.prepare('SELECT * FROM blog_posts ORDER BY date DESC').all()
  res.json(rows.map(parseBlogPost))
})

app.get('/api/blog/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Post not found' })
  res.json(parseBlogPost(row))
})

// ---- About page content ----
app.get('/api/about', (req, res) => {
  res.json({
    team: db.prepare('SELECT name, role, initials, photo FROM team_members ORDER BY sort_order').all(),
    stats: db.prepare('SELECT label, value, suffix FROM stats ORDER BY sort_order').all(),
    serviceAreas: db.prepare('SELECT name FROM service_areas ORDER BY sort_order').all().map((r) => r.name),
    certifications: db.prepare('SELECT name FROM certifications ORDER BY sort_order').all().map((r) => r.name),
  })
})

// ---- Validation + spam protection for public forms ----
const EMAIL_RE = /^\S+@\S+\.\S+$/
const PHONE_RE = /^[+\d][\d\s-]{7,}$/

// Coerces to a trimmed, length-capped string so odd payloads (objects, huge text) can't break handlers.
const str = (value, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }
const hits = new Map()

function rateLimitForms(req, res, next) {
  const now = Date.now()
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  if (recent.length >= RATE_LIMIT.max) {
    return res.status(429).json({ error: 'Too many submissions. Please try again in a few minutes.' })
  }
  recent.push(now)
  hits.set(req.ip, recent)
  next()
}

// ---- Enquiries ----
app.post('/api/enquiries', rateLimitForms, (req, res) => {
  const body = req.body || {}
  const enquiry = {
    fullName: str(body.fullName, 120),
    phone: str(body.phone, 30),
    email: str(body.email, 200),
    propertyType: ['Residential', 'Commercial'].includes(body.propertyType) ? body.propertyType : null,
    address: str(body.address, 300),
    monthlyBill: str(body.monthlyBill, 50) || null,
    serviceInterested: str(body.serviceInterested, 200) || null,
    message: str(body.message, 2000) || null,
  }

  if (!enquiry.fullName || !enquiry.phone || !enquiry.email || !enquiry.address) {
    return res.status(400).json({ error: 'Full name, phone, email, and address are required.' })
  }
  if (!EMAIL_RE.test(enquiry.email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (!PHONE_RE.test(enquiry.phone)) {
    return res.status(400).json({ error: 'Enter a valid phone number.' })
  }

  const result = db
    .prepare(`
      INSERT INTO enquiries (full_name, phone, email, property_type, address, monthly_bill, service_interested, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      enquiry.fullName, enquiry.phone, enquiry.email, enquiry.propertyType,
      enquiry.address, enquiry.monthlyBill, enquiry.serviceInterested, enquiry.message,
    )

  // The enquiry is already saved, so an email failure must not fail the request.
  sendEnquiryEmails(enquiry).catch((err) => console.error('Enquiry email failed:', err.message))
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

// Reading submissions exposes customer PII, so it requires ADMIN_TOKEN (disabled if unset).
function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN
  if (!token || req.get('x-admin-token') !== token) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

app.get('/api/enquiries', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all())
})

// ---- Contact messages ----
app.post('/api/contact', rateLimitForms, (req, res) => {
  const body = req.body || {}
  const contact = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    phone: str(body.phone, 30) || null,
    message: str(body.message, 2000),
  }

  if (!contact.name || !contact.message) {
    return res.status(400).json({ error: 'Name and message are required.' })
  }
  if (!EMAIL_RE.test(contact.email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (contact.phone && !PHONE_RE.test(contact.phone)) {
    return res.status(400).json({ error: 'Enter a valid phone number.' })
  }

  const result = db
    .prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)')
    .run(contact.name, contact.email, contact.phone, contact.message)

  sendContactEmails(contact).catch((err) => console.error('Contact email failed:', err.message))
  res.status(201).json({ id: Number(result.lastInsertRowid) })
})

app.get('/api/contact', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all())
})

app.listen(PORT, () => {
  console.log(`Ignite Solar API listening on http://localhost:${PORT}`)
})
