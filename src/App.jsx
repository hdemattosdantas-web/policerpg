import './App.css'
import { Dashboard } from './components/Dashboard'
import { Login } from './components/Login'
import { UsernameSetup } from './components/UsernameSetup'
import { Alistamento } from './components/Alistamento'
import { useAuth } from './context/AuthContext'

function App() {
  const { firebaseUser, userDoc, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="container">
        <div className="panel">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="panel">Erro: {String(error?.message ?? error)}</div>
      </div>
    )
  }

  if (!firebaseUser) return <Login />

  if (!userDoc) {
    return (
      <div className="container">
        <div className="panel">Carregando perfil...</div>
      </div>
    )
  }

  if (!userDoc.username) return <UsernameSetup />

  // Verifica se o usuário já está alistado (tem nome_policial válido)
  if (!userDoc.nome_policial || userDoc.nome_policial === 'Policial') {
    return <Alistamento />
  }

  return <Dashboard />
}

export default App
