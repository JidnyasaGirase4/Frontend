import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import StatCounter from '../components/StatCounter.jsx'
import { api } from '../lib/api.js'
import { useContent } from '../lib/content.jsx'
import { useApi } from '../lib/useApi.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import LoadState from '../components/LoadState.jsx'
import './About.css'
import SectionLabel from '../components/SectionLabel.jsx'

function About() {
  const { about: c } = useContent()
  const { data, loading, error } = useApi(api.getAbout)
  usePageMeta(c.meta.title, c.meta.description)
  const { team = [], stats = [],certifications = [] } = data || {}

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>{c.hero.title}</h1>
          <p>{c.hero.text}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div className="about-media">
            <img src={c.story.image} alt={c.story.imageAlt} className="about-img" />
            <div className="about-badge">
              <Icon name="sun" size={26} />
              <span>
                <strong>{c.story.badgeTitle}</strong>
                {c.story.badgeText}
              </span>
            </div>
          </div>
          <div>
            <SectionLabel>{c.story.label}</SectionLabel>
            <h2>{c.story.title}</h2>
            <p className="about-lead">{c.story.lead}</p>
            <p>{c.story.text}</p>
            <Link to="/contact" className="btn btn-primary">
              {c.story.button} <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.mission.label}</SectionLabel>
            <h2>{c.mission.title}</h2>
          </div>
          <div className="mission-vision">
            {c.mission.cards.map((card, index) => (
              <div className="mv-card" key={index}>
                <span className="mv-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="mv-icon"><Icon name={card.icon} size={30} /></span>
                <div>
                  <span className="mv-label">{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoadState loading={loading} error={error} />

      <section className="section stats-section">
        <div className="container">
          <div className="section-title section-title-light">
            <SectionLabel tone="light">{c.impact.label}</SectionLabel>
            <h2>{c.impact.title}</h2>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.values.label}</SectionLabel>
            <h2>{c.values.title}</h2>
          </div>
          <div className="values-grid">
            {c.values.items.map((item, index) => (
              <div className="value-card" key={index}>
                <span className="value-icon"><Icon name={item.icon} size={26} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cert-section">
        <div className="container">
          <div className="section-title section-title-light">
            <SectionLabel tone="light">{c.certs.label}</SectionLabel>
            <h2>{c.certs.title}</h2>
          </div>
          <div className="cert-grid">
            {certifications.map((cert) => (
              <div className="cert-badge" key={cert}>
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z" />
                  <path d="M8.5 12l2.5 2.5L15.5 9.5" />
                </svg>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="team">
        <div className="container">
          <div className="section-title">
            <SectionLabel>{c.team.label}</SectionLabel>
            <h2>{c.team.title}</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.name}>
                {member.photo ? (
                  <img className="team-photo" src={member.photo} alt={member.name} />
                ) : (
                  <div className="team-avatar">{member.initials}</div>
                )}
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}

export default About
