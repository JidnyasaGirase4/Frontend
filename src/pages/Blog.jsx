import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { useContent } from '../lib/content.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import './Blog.css'
import SectionLabel from '../components/SectionLabel.jsx'

const PAGE_SIZE = 6

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function Blog() {
  const { blog_page: c, ui } = useContent()
  const { data, loading, error } = useApi(api.getBlogPosts)
  usePageMeta(c.meta.title, c.meta.description)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const blogPosts = useMemo(() => data || [], [data])
  const categories = useMemo(
    () => ['All', ...new Set(blogPosts.map((post) => post.category))],
    [blogPosts],
  )

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = category === 'All' || post.category === category
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [blogPosts, category, search])

  const visiblePosts = filteredPosts.slice(0, visibleCount)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.section.label}</SectionLabel>
            <h2>{c.section.title}</h2>
          </div>
          <div className="blog-toolbar">
            <input
              type="search"
              placeholder={ui.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleCount(PAGE_SIZE)
              }}
              className="blog-search"
            />
            <div className="blog-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={cat === category ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => {
                    setCategory(cat)
                    setVisibleCount(PAGE_SIZE)
                  }}
                >
                  {cat === 'All' ? ui.filterAll : cat}
                </button>
              ))}
            </div>
          </div>

          <LoadState loading={loading} error={error} />
          {!loading && !error && visiblePosts.length === 0 && <p className="no-results">{ui.noArticles}</p>}

          <div className="blog-grid">
            {visiblePosts.map((post) => (
              <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                <img src={post.image} alt={post.title} />
                <div className="blog-card-body">
                  <span className="blog-mini-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span>{formatDate(post.date)}</span>
                    <span>{ui.readMore} <Icon name="arrow-right" size={16} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleCount < filteredPosts.length && (
            <div className="load-more-wrap">
              <button className="btn btn-outline-dark" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                {ui.loadMore}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog
