import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { claimUsername } from '../services/users'

function normalizePreview(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

export function UsernameSetup() {
  const { firebaseUser } = useAuth()
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const preview = useMemo(() => normalizePreview(username), [username])

  async function onConfirm() {
    if (!firebaseUser) return

    try {
      setError(null)
      setSaving(true)
      await claimUsername(firebaseUser.uid, username)
    } catch (e) {
      setError(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="section__title">Defina seu username</div>
        <div style={{ opacity: 0.85, marginBottom: 12 }}>
          Esse nome será único e usado para identificar seu policial.
        </div>

        <div className="rename" style={{ justifyContent: 'flex-start' }}>
          <input
            className="input"
            placeholder="ex: sgt_silva"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn--primary" onClick={onConfirm} disabled={saving || !username.trim()}>
            {saving ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>

        <div style={{ opacity: 0.75, marginTop: 10 }}>
          Preview: <span className="badge">{preview || '...'}</span>
        </div>

        {error ? (
          <div className="result result--error" style={{ marginTop: 12 }}>
            Erro: {String(error?.message ?? error)}
          </div>
        ) : null}
      </div>
    </div>
  )
}
