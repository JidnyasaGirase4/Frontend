// Services come from the API with emoji (or, for newer ones, an icon name).
// Resolve to an Icon name by slug so existing data renders proper icons
// without needing a reseed.
const byName = new Set(['home', 'building', 'wrench', 'battery', 'file-check', 'sparkles'])

const bySlug = {
  'residential-solar-installation': 'home',
  'commercial-solar-installation': 'building',
  'solar-maintenance-repair': 'wrench',
  'battery-storage-solutions': 'battery',
  'net-metering-subsidy-assistance': 'file-check',
  'solar-panel-cleaning': 'sparkles',
}

export function serviceIconName(service) {
  if (byName.has(service.icon)) return service.icon
  return bySlug[service.slug] || 'sun'
}
