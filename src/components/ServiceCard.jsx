import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { serviceIconName } from '../lib/serviceIcon.js'
import { useContent } from '../lib/content.jsx'
import './ServiceCard.css'

function ServiceCard({ service }) {
  const { ui } = useContent()
  const iconName = serviceIconName(service)
  return (
    <div className="editorial-card">
      <div className="editorial-card-top">
        <span className="editorial-card-icon"><Icon name={iconName} size={26} /></span>
        <Icon name={iconName} size={110} strokeWidth={1} className="editorial-card-watermark" />
      </div>
      <div className="editorial-card-body">
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <Link to={`/services/${service.slug}`}>{ui.learnMore} <Icon name="arrow-right" size={16} /></Link>
      </div>
    </div>
  )
}

export default ServiceCard
