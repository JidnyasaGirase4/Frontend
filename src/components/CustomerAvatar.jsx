function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function CustomerAvatar({ name, photo, size = 52 }) {
  const style = { width: size, height: size, borderRadius: '50%', flexShrink: 0 }

  if (photo) {
    return <img src={photo} alt={name} style={{ ...style, objectFit: 'cover' }} />
  }

  return (
    <span
      aria-hidden="true"
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary)',
        color: 'var(--color-white)',
        fontWeight: 700,
        fontSize: size * 0.34,
      }}
    >
      {initialsOf(name)}
    </span>
  )
}

export default CustomerAvatar
