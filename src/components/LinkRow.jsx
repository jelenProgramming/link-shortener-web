import { useState } from 'react'

function timeAgo(iso) {
  const d = (Date.now() - new Date(iso)) / 1000
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}

export default function LinkRow({ link, active, onSelect, onDelete }) {
  const [copied, setCopied] = useState(false)

  function copy(e) {
    e.stopPropagation()
    navigator.clipboard?.writeText(link.short_url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <div className={`row ${active ? 'row--active' : ''}`} onClick={() => onSelect(link.slug)}>
      <div className="row__main">
        <div className="row__short">
          <span className="row__slug">/{link.slug}</span>
          <button className={`row__copy ${copied ? 'row__copy--done' : ''}`} onClick={copy}>
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
        <div className="row__orig">{link.original_url}</div>
      </div>
      <div className="row__side">
        <div className="row__clicks">
          <span className="row__clicksnum">{link.clicks}</span>
          <span className="row__clickslbl">clicks</span>
        </div>
        <div className="row__time">{timeAgo(link.created_at)}</div>
        <button
          className="row__del"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(link.slug)
          }}
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  )
}
