import { useContent } from '../lib/content.jsx'

function LoadState({ loading, error }) {
  const { ui } = useContent()
  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        {ui.loading}
      </div>
    )
  }
  if (error) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        {ui.loadError}
      </div>
    )
  }
  return null
}

export default LoadState
