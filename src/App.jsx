import { useEffect, useState } from 'react'
import { listLinks, createLink, linkStats, deleteLink } from './api'
import CreateForm from './components/CreateForm'
import LinkRow from './components/LinkRow'
import Stats from './components/Stats'

export default function App() {
  const [links, setLinks] = useState([])
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      setLinks(await listLinks())
      setError('')
    } catch (err) {
      setError(`Can't reach the API. Is the Laravel server running? (${err.message})`)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(url, slug) {
    const created = await createLink(url, slug)
    await refresh()
    selectLink(created.slug)
  }

  async function selectLink(slug) {
    setSelected(slug)
    setStatsLoading(true)
    setStats(null)
    try {
      setStats(await linkStats(slug))
    } catch {
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  async function handleDelete(slug) {
    await deleteLink(slug)
    if (selected === slug) {
      setSelected(null)
      setStats(null)
    }
    refresh()
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="brand">
          <span className="brand__mark">↳</span>
          <span className="brand__name">Linkshort</span>
        </div>
        <p className="tagline">Shorten a URL, then watch the clicks roll in.</p>
      </header>

      <CreateForm onCreate={handleCreate} />

      {error && <div className="banner banner--error">{error}</div>}

      <div className="layout">
        <section className="list">
          <div className="list__head">Your links</div>
          {links.length === 0 && !error && (
            <div className="list__empty">No links yet. Shorten one above.</div>
          )}
          {links.map((link) => (
            <LinkRow
              key={link.slug}
              link={link}
              active={selected === link.slug}
              onSelect={selectLink}
              onDelete={handleDelete}
            />
          ))}
        </section>

        <section className="panel">
          {selected ? (
            <Stats data={stats} loading={statsLoading} />
          ) : (
            <div className="panel__empty">Pick a link to see its analytics.</div>
          )}
        </section>
      </div>

      <footer className="footer">
        Laravel API + React · short links resolve on the API host
      </footer>
    </div>
  )
}
