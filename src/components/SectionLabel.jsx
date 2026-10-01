import Icon from './Icon.jsx'

// Sun icon tile followed by a small uppercase label, shown above section titles.
// tone: 'light' for navy backgrounds, 'accent' for the orange CTA band.
function SectionLabel({ tone, children }) {
  const className = ['section-label', tone && `section-label-${tone}`].filter(Boolean).join(' ')
  return (
    <div className={className}>
      <span className="asterisk-icon"><Icon name="sun" size={22} /></span>
      <span className="section-label-text">{children}</span>
    </div>
  )
}

export default SectionLabel
