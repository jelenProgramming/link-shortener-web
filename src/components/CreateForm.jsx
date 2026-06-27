import { useState } from 'react'

export default function CreateForm({ onCreate }) {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setBusy(true)
    setError('')
    try {
      await onCreate(url.trim(), slug.trim())
      setUrl('')
      setSlug('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="create" onSubmit={submit}>
      <div className="create__row">
        <input
          className="create__url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-long-url.com/goes/here"
          spellCheck={false}
        />
        <button className="create__btn" type="submit" disabled={busy}>
          {busy ? 'Shortening…' : 'Shorten'}
        </button>
      </div>
      <div className="create__row create__row--slug">
        <span className="create__slughint">optional custom slug</span>
        <input
          className="create__slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="my-link"
          spellCheck={false}
        />
      </div>
      {error && <div className="create__error">{error}</div>}
    </form>
  )
}
