import { useRef, useState } from 'react'
import { adminApi, assetUrl } from '../lib/api.js'
import AdminIcon from './AdminIcon.jsx'

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Moves item `from` to index `to` in a copy of the array.
function move(list, from, to) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function IconButton({ icon, label, text, onClick, danger, disabled }) {
  return (
    <button type="button" className={`adm-icon-btn${danger ? ' danger' : ''}${text ? ' with-text' : ''}`} onClick={onClick} title={label} aria-label={label} disabled={disabled}>
      <AdminIcon name={icon} size={15} />
      {text && <span>{text}</span>}
    </button>
  )
}

// ---- Upload + path input for images and videos ----
function FileInput({ value, onChange, accept, video }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const { url } = await adminApi.upload(file)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const isVideo = video || /\.(mp4|webm|mov)$/i.test(value || '')

  return (
    <div className="adm-file">
      <div className="adm-file-row">
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/images/example.jpeg or upload a file" />
        <button type="button" className="adm-btn adm-btn-light" onClick={() => inputRef.current?.click()} disabled={busy}>
          <AdminIcon name="upload" size={15} /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept={accept} hidden onChange={handleFile} />
      </div>
      {error && <p className="adm-field-error">{error}</p>}
      {value && (
        <div className="adm-file-preview">
          {isVideo ? <video src={assetUrl(value)} controls preload="metadata" /> : <img src={assetUrl(value)} alt="" />}
        </div>
      )}
    </div>
  )
}

// ---- List of plain strings ----
function StringsEditor({ value = [], onChange, multiline, imageList }) {
  const list = Array.isArray(value) ? value : []
  const set = (i, v) => onChange(list.map((x, idx) => (idx === i ? v : x)))

  return (
    <div className="adm-list">
      {list.map((item, i) => (
        <div className="adm-list-row" key={i}>
          <div className="adm-list-main">
            {imageList ? (
              <FileInput value={item} onChange={(v) => set(i, v)} accept="image/*" />
            ) : multiline ? (
              <textarea rows={3} value={item} onChange={(e) => set(i, e.target.value)} />
            ) : (
              <input type="text" value={item} onChange={(e) => set(i, e.target.value)} />
            )}
          </div>
          <div className="adm-list-actions">
            <IconButton icon="up" label="Move up" onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0} />
            <IconButton icon="down" label="Move down" onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1} />
            <IconButton icon="trash" label="Delete" text="Delete" danger onClick={() => onChange(list.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={() => onChange([...list, ''])}>
        <AdminIcon name="plus" size={14} /> Create {imageList ? 'photo' : 'item'}
      </button>
    </div>
  )
}

// ---- List of objects (cards, menu links, legal sections ...) ----
function ListEditor({ field, value = [], onChange }) {
  const list = Array.isArray(value) ? value : []
  const [open, setOpen] = useState(null)
  const blank = () => Object.fromEntries(field.fields.map((f) => [f.name, f.type === 'strings' ? [] : '']))
  const set = (i, item) => onChange(list.map((x, idx) => (idx === i ? item : x)))

  return (
    <div className="adm-list">
      {list.map((item, i) => {
        const isOpen = open === i
        return (
          <div className={`adm-card${isOpen ? ' open' : ''}`} key={i}>
            <div className="adm-card-head">
              <button type="button" className="adm-card-toggle" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                <AdminIcon name="chevron" size={16} />
                <span>{item[field.itemLabel] || `Item ${i + 1}`}</span>
              </button>
              {!field.fixed && (
                <div className="adm-list-actions">
                  <IconButton icon="up" label="Move up" onClick={() => onChange(move(list, i, i - 1))} disabled={i === 0} />
                  <IconButton icon="down" label="Move down" onClick={() => onChange(move(list, i, i + 1))} disabled={i === list.length - 1} />
                  <IconButton icon="edit" label="Edit" text="Edit" onClick={() => setOpen(isOpen ? null : i)} />
                  <IconButton icon="trash" label="Delete" text="Delete" danger onClick={() => onChange(list.filter((_, idx) => idx !== i))} />
                </div>
              )}
            </div>
            {isOpen && (
              <div className="adm-card-body">
                <FormFields fields={field.fields} value={item} onChange={(v) => set(i, v)} />
              </div>
            )}
          </div>
        )
      })}
      {!field.fixed && (
        <button
          type="button"
          className="adm-btn adm-btn-light adm-btn-sm"
          onClick={() => {
            onChange([...list, blank()])
            setOpen(list.length)
          }}
        >
          <AdminIcon name="plus" size={14} /> Create new
        </button>
      )}
    </div>
  )
}

// ---- Blog article body: paragraphs, headings, lists, images ----
function BlocksEditor({ value = [], onChange }) {
  const blocks = Array.isArray(value) ? value : []
  const set = (i, block) => onChange(blocks.map((b, idx) => (idx === i ? block : b)))
  const kind = (b) => (typeof b === 'string' ? 'paragraph' : b.type)

  return (
    <div className="adm-list">
      {blocks.map((block, i) => (
        <div className="adm-card open" key={i}>
          <div className="adm-card-head">
            <span className="adm-block-kind">{kind(block)}</span>
            <div className="adm-list-actions">
              <IconButton icon="up" label="Move up" onClick={() => onChange(move(blocks, i, i - 1))} disabled={i === 0} />
              <IconButton icon="down" label="Move down" onClick={() => onChange(move(blocks, i, i + 1))} disabled={i === blocks.length - 1} />
              <IconButton icon="trash" label="Delete" text="Delete" danger onClick={() => onChange(blocks.filter((_, idx) => idx !== i))} />
            </div>
          </div>
          <div className="adm-card-body">
            {kind(block) === 'paragraph' && (
              <>
                <textarea rows={4} value={block} onChange={(e) => set(i, e.target.value)} />
                <p className="adm-help">Link to another page with [link text](/services/some-service).</p>
              </>
            )}
            {kind(block) === 'heading' && <input type="text" value={block.text || ''} onChange={(e) => set(i, { ...block, text: e.target.value })} />}
            {kind(block) === 'list' && (
              <>
                <label className="adm-check">
                  <input type="checkbox" checked={Boolean(block.ordered)} onChange={(e) => set(i, { ...block, ordered: e.target.checked })} />
                  Numbered list
                </label>
                <StringsEditor value={block.items || []} onChange={(items) => set(i, { ...block, items })} />
              </>
            )}
            {kind(block) === 'image' && (
              <>
                <FileInput value={block.src} onChange={(src) => set(i, { ...block, src })} accept="image/*" />
                <label className="adm-label">Image description<input type="text" value={block.alt || ''} onChange={(e) => set(i, { ...block, alt: e.target.value })} /></label>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="adm-add-row">
        <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={() => onChange([...blocks, ''])}><AdminIcon name="plus" size={14} /> Paragraph</button>
        <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={() => onChange([...blocks, { type: 'heading', text: '' }])}><AdminIcon name="plus" size={14} /> Heading</button>
        <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={() => onChange([...blocks, { type: 'list', ordered: false, items: [''] }])}><AdminIcon name="plus" size={14} /> List</button>
        <button type="button" className="adm-btn adm-btn-light adm-btn-sm" onClick={() => onChange([...blocks, { type: 'image', src: '', alt: '' }])}><AdminIcon name="plus" size={14} /> Image</button>
      </div>
    </div>
  )
}

function Field({ field, value, onChange, record }) {
  switch (field.type) {
    case 'textarea':
      return <textarea rows={field.rows || 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    case 'number':
      return (
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      )
    case 'color':
      return (
        <div className="adm-color">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#000000'} onChange={(e) => onChange(e.target.value)} aria-label={field.label} />
          <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="#f8a218" maxLength={7} />
        </div>
      )
    case 'date':
      return <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} disabled={field.readOnly}>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )
    case 'checkbox':
      return (
        <label className="adm-check">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.checkLabel || 'Yes'}
        </label>
      )
    case 'image':
      return <FileInput value={value} onChange={onChange} accept="image/*" />
    case 'media':
      return <FileInput value={value} onChange={onChange} accept="image/*,video/mp4,video/webm,video/quicktime" video={record?.[field.typeField] === 'video'} />
    case 'strings':
      return <StringsEditor value={value} onChange={onChange} multiline={field.multiline} imageList={field.imageList} />
    case 'list':
      return <ListEditor field={field} value={value} onChange={onChange} />
    case 'blocks':
      return <BlocksEditor value={value} onChange={onChange} />
    default:
      return <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} readOnly={field.readOnly} />
  }
}

// Renders a list of field definitions bound to `value` (an object).
export function FormFields({ fields, value, onChange, isNew }) {
  const record = value || {}
  const setField = (name, v) => onChange({ ...record, [name]: v })

  return (
    <div className="adm-fields">
      {fields.map((field) => {
        if (field.type === 'group') {
          return (
            <fieldset className="adm-group" key={field.name}>
              <legend>{field.label}</legend>
              <FormFields fields={field.fields} value={record[field.name]} onChange={(v) => setField(field.name, v)} />
            </fieldset>
          )
        }

        const wide = ['strings', 'list', 'blocks', 'textarea', 'image', 'media'].includes(field.type)
        const onFieldChange = (v) => {
          const next = { ...record, [field.name]: v }
          // Suggest a slug from the title while creating a new record.
          const slugField = fields.find((f) => f.slugFrom === field.name)
          if (isNew && slugField) next[slugField.name] = slugify(v)
          onChange(next)
        }

        return (
          <div className={`adm-field${wide ? ' wide' : ''}`} key={field.name}>
            <label className="adm-label">
              {field.label}
              {field.required && <em> *</em>}
            </label>
            <Field field={field} value={record[field.name]} onChange={onFieldChange} record={record} />
          </div>
        )
      })}
    </div>
  )
}
