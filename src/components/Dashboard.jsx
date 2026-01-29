import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { RPGNarrativa } from './RPGNarrativa'

function formatMoneyBRL(value) {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function Dashboard() {
  const { firebaseUser, userDoc, loading, error, logout } = useAuth()
  const [abaAtiva, setAbaAtiva] = useState('rpg')

  if (loading) {
    return (
      <div className='container'>
        <div className='panel'>Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container'>
        <div className='panel'>Erro: {String(error?.message ?? error)}</div>
      </div>
    )
  }

  if (!firebaseUser || !userDoc) {
    return (
      <div className='container'>
        <div className='panel'>Sem sessao.</div>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='panel'>
        <header className='header'>
          <div>
            <div className='header__name'>
              {userDoc.nome_policial || 'Policial'}
            </div>
            <div className='header__sub'>
              Status: Em Servico
            </div>
          </div>
          <div className='header__right'>
            <button className='btn' onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        <div className='dashboard__abas'>
          <button
            className={dashboard__aba }
            onClick={() => setAbaAtiva('rpg')}
          >
             RPG Narrativo
          </button>
        </div>

        {abaAtiva === 'rpg' && (
          <section className='section'>
            <RPGNarrativa />
          </section>
        )}
      </div>
    </div>
  )
}

export { formatMoneyBRL }
