import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { signInWithGoogle, error } = useAuth()
  const [signingIn, setSigningIn] = useState(false)

  async function onLogin() {
    try {
      setSigningIn(true)
      await signInWithGoogle()
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="section__title">RPG Policial</div>
        <div style={{ opacity: 0.85, marginBottom: 12 }}>
          Entre com Google para criar seu policial e salvar seu progresso.
        </div>

        <button className="btn btn--primary" onClick={onLogin} disabled={signingIn}>
          {signingIn ? 'Entrando...' : 'Entrar com Google'}
        </button>

        {error ? (
          <div className="result result--error" style={{ marginTop: 12 }}>
            Erro: {String(error?.message ?? error)}
          </div>
        ) : null}
      </div>
    </div>
  )
}
