import { db } from './db.js'
import * as seed from './seed-data.js'

function count(table) {
  return db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n
}

function seedServices() {
  if (count('services') > 0) return
  const stmt = db.prepare(`
    INSERT INTO services (slug, title, icon, summary, description, benefits, process, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  seed.services.forEach((s, i) => {
    stmt.run(s.slug, s.title, s.icon, s.summary, s.description, JSON.stringify(s.benefits), JSON.stringify(s.process), i)
  })
}

function seedProjects() {
  if (count('projects') > 0) return
  const stmt = db.prepare(`
    INSERT INTO projects (title, location, category, capacity, description, images, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  seed.projects.forEach((p, i) => {
    stmt.run(p.title, p.location, p.category, p.capacity, p.description, JSON.stringify(p.images), i)
  })
}

function seedTestimonials() {
  if (count('testimonials') > 0) return
  const stmt = db.prepare(`
    INSERT INTO testimonials (name, location, rating, text, featured)
    VALUES (?, ?, ?, ?, ?)
  `)
  seed.testimonials.forEach((t) => {
    stmt.run(t.name, t.location, t.rating, t.text, t.featured ? 1 : 0)
  })
}

function seedBlogPosts() {
  if (count('blog_posts') > 0) return
  const stmt = db.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, date, category, author, image, content, tags, meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  seed.blogPosts.forEach((p) => {
    stmt.run(
      p.slug, p.title, p.excerpt, p.date, p.category, p.author, p.image,
      JSON.stringify(p.content), JSON.stringify(p.tags || []), p.metaTitle || null, p.metaDescription || null,
    )
  })
}

function seedTeam() {
  if (count('team_members') > 0) return
  const stmt = db.prepare(`INSERT INTO team_members (name, role, initials, sort_order) VALUES (?, ?, ?, ?)`)
  seed.team.forEach((m, i) => stmt.run(m.name, m.role, m.initials, i))
}

function seedStats() {
  if (count('stats') > 0) return
  const stmt = db.prepare(`INSERT INTO stats (label, value, suffix, sort_order) VALUES (?, ?, ?, ?)`)
  seed.stats.forEach((s, i) => stmt.run(s.label, s.value, s.suffix, i))
}

function seedServiceAreas() {
  if (count('service_areas') > 0) return
  const stmt = db.prepare(`INSERT INTO service_areas (name, sort_order) VALUES (?, ?)`)
  seed.serviceAreas.forEach((name, i) => stmt.run(name, i))
}

function seedCertifications() {
  if (count('certifications') > 0) return
  const stmt = db.prepare(`INSERT INTO certifications (name, sort_order) VALUES (?, ?)`)
  seed.certifications.forEach((name, i) => stmt.run(name, i))
}

seedServices()
seedProjects()
seedTestimonials()
seedBlogPosts()
seedTeam()
seedStats()
seedServiceAreas()
seedCertifications()

console.log('Database seeded:', {
  services: count('services'),
  projects: count('projects'),
  testimonials: count('testimonials'),
  blog_posts: count('blog_posts'),
  team_members: count('team_members'),
  stats: count('stats'),
  service_areas: count('service_areas'),
  certifications: count('certifications'),
})
