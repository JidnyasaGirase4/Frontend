import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { useContent } from '../lib/content.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import { responsiveImage } from '../lib/images.js'
import LoadState from '../components/LoadState.jsx'
import { SocialIcon } from '../components/SocialIcons.jsx'
import './BlogPost.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text) {
  const parts = []
  let lastIndex = 0
  for (const match of text.matchAll(LINK_PATTERN)) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const [, label, href] = match
    parts.push(
      href.startsWith('/') ? (
        <Link key={match.index} to={href}>{label}</Link>
      ) : (
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
      ),
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

function ContentBlock({ block }) {
  if (typeof block === 'string') return <p>{renderInline(block)}</p>

  switch (block.type) {
    case 'heading':
      return <h2 className="post-heading">{block.text}</h2>
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className="post-list">
          {block.items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ListTag>
      )
    }
    case 'image':
      return (
        <figure className="post-figure">
          <img {...responsiveImage(block.src, '(max-width: 860px) 100vw, 640px')} alt={block.alt || ''} />
        </figure>
      )
    default:
      return null
  }
}

function ShareButtons({ title }) {
  const { ui } = useContent()
  const [copied, setCopied] = useState(false)
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(title)

  const links = [
    { label: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: 'X', icon: 'x', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
    { label: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: 'WhatsApp', icon: 'whatsapp', href: `https://wa.me/?text=${text}%20${url}` },
  ]

  function copyLink() {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div className="share-buttons">
      <span>{ui.shareLabel}</span>
      {links.map((link) => (
        <a
          key={link.label}
          className={`share-${link.icon}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
        >
          <SocialIcon name={link.icon} size={16} />
          {link.label}
        </a>
      ))}
      <button type="button" className="share-copy" onClick={copyLink}>
        <Icon name={copied ? 'check' : 'link'} size={16} strokeWidth={2} />
        {copied ? ui.copied : ui.copyLink}
      </button>
    </div>
  )
}

function BlogPost() {
  const { ui } = useContent()
  const { slug } = useParams()
  const { data: post, loading, error } = useApi(() => api.getBlogPost(slug), [slug])
  const { data: allPosts } = useApi(api.getBlogPosts)

  usePageMeta(post?.meta_title || post?.title, post?.meta_description || post?.excerpt)

  if (loading || error) {
    return <LoadState loading={loading} error={error} />
  }

  const others = (allPosts || []).filter((p) => p.slug !== post.slug)
  const sameCategory = others.filter((p) => p.category === post.category)
  const relatedPosts = [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, 3)

  return (
    <>
      <section className="page-hero blog-post-hero">
        <div className="container">
          <span className="blog-mini-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p className="blog-post-meta">By {post.author} &middot; {formatDate(post.date)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container blog-post-layout">
          <article className="blog-post-content">
            <img {...responsiveImage(post.image, '(max-width: 860px) 100vw, 640px')} loading="eager" alt={post.title} className="blog-post-image" />
            {post.content.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}

            <ShareButtons title={post.title} />

            <div className="blog-post-footer">
              <Link to="/blog" className="btn btn-outline-dark"><Icon name="arrow-left" size={16} /> {ui.backToBlog}</Link>
              <Link to="/contact" className="btn btn-primary">{ui.quoteButton}</Link>
            </div>
          </article>

          <aside className="related-posts">
            <h3>{ui.relatedArticles}</h3>
            {relatedPosts.map((related) => (
              <Link to={`/blog/${related.slug}`} key={related.slug} className="related-post-card">
                <img {...responsiveImage(related.image, '72px')} alt={related.title} />
                <div>
                  <span className="blog-mini-category">{related.category}</span>
                  <h4>{related.title}</h4>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </section>
    </>
  )
}

export default BlogPost
