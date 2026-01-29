import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateNomePolicial, updateStatus } from '../services/users'
import { usePatenteProgress } from '../hooks/usePatenteProgress'
import { verificarPromocao, isOficial, getCorPatente } from '../constants/hierarquia'
import { Badge } from './Badge'
import { ProgressBar } from './ProgressBar'
import { StatusCard } from './StatusCard'
import { RadioChat } from './RadioChat'
import { Convites } from './Convites'
import { Ocorrencias } from './Ocorrencias'
import { Quartel } from './Quartel'
import { Ranking } from './Ranking'
import { PerfilDetalhado } from './PerfilDetalhado'
import { formatMoneyBRL } from '../utils/formatMoney'

export function Dashboard() {
  const { firebaseUser, userDoc, loading, error, logout } = useAuth()
  const [nome, setNome] = useState('')
  const [savingNome, setSavingNome] = useState(false)

  const [mesa, setMesa] = useState(null)
  const [abaAtiva, setAbaAtiva] = useState('ocorrencias')

  const xp = userDoc?.xp ?? 0
  const saldo = userDoc?.saldo ?? 0
  const nome_policial = userDoc?.nome_policial ?? 'Policial'
  const patente_atual = verificarPromocao(xp)
  const status = userDoc?.status ?? 'Em Serviço'
  const username = userDoc?.username ?? null

  const progress = usePatenteProgress(xp)
  const corNome = getCorPatente(patente_atual)
  const mostrarAvisoAcademia = patente_atual.nome === 'Subtenente'

  const proxLabel = useMemo(() => {
    if (!progress.proximaPatente) return 'Patente máxima'
    return `${progress.proximaPatente.nome} em ${progress.xpParaProxima} XP`
  }, [progress.proximaPatente, progress.xpParaProxima])

  async function onSalvarNome() {
    if (!firebaseUser) return
    const trimmed = nome.trim()
    if (!trimmed) return
    setSavingNome(true)
    try {
      await updateNomePolicial(firebaseUser.uid, trimmed)
      setNome('')
    } catch (e) {
      console.error(e)
    } finally {
      setSavingNome(false)
    }
  }

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

  if (!firebaseUser || !userDoc) {
    return (
      <div className="container">
        <div className="panel">Sem sessão.</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="panel">
        <header className="header">
          <div>
            <div className="header__name" style={{ color: corNome }}>
              {nome_policial}
            </div>
            <div className="header__sub">
              Patente atual: <Badge>{patente_atual.nome}</Badge>
            </div>
            <div className="header__sub">
              Status: <Badge>{status}</Badge>
            </div>
            {username ? (
              <div className="header__sub">
                Username: <Badge>{username}</Badge>
              </div>
            ) : null}
            {mostrarAvisoAcademia && (
              <div className="header__sub header__aviso">
                🎓 Prepare-se para a Academia de Oficiais
              </div>
            )}
          </div>

          <div className="header__right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 'min(520px, 100%)' }}>
              <div className="rename">
                <input
                  className="input"
                  placeholder="Alterar nome do policial"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <button className="btn" onClick={onSalvarNome} disabled={savingNome || !nome.trim()}>
                  Salvar
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn" onClick={logout}>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="section">
          <div className="section__title">Progressão</div>
          <div className="xpRow">
            <div className="xpRow__left">
              <div className="xpValue">{xp} XP</div>
              <div className="xpNext">{proxLabel}</div>
            </div>
            <div className="xpRow__right">{progress.pct}%</div>
          </div>
          <ProgressBar value={progress.pct} />
        </section>

        <section className="grid">
          <StatusCard title="Saldo" value={formatMoneyBRL(saldo)} subtitle="Disponível para equipamentos e melhorias" />
          <StatusCard title="Recompensa" value="+50 XP / +R$ 100" subtitle="Por patrulha concluída" />
        </section>

        {/* Abas de Navegação */}
        <div className="dashboard__abas">
          <button 
            className={`dashboard__aba ${abaAtiva === 'ocorrencias' ? 'dashboard__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('ocorrencias')}
          >
            🚔 Ocorrências
          </button>
          <button 
            className={`dashboard__aba ${abaAtiva === 'quartel' ? 'dashboard__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('quartel')}
          >
            🏪 Quartel
          </button>
          <button 
            className={`dashboard__aba ${abaAtiva === 'ranking' ? 'dashboard__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('ranking')}
          >
            🏆 Ranking
          </button>
          <button 
            className={`dashboard__aba ${abaAtiva === 'social' ? 'dashboard__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('social')}
          >
            👥 Social
          </button>
          <button 
            className={`dashboard__aba ${abaAtiva === 'perfil' ? 'dashboard__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('perfil')}
          >
            📋 Perfil
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {abaAtiva === 'ocorrencias' && (
          <section className="section">
            <div className="section__title">Sistema de Ocorrências</div>
            <Ocorrencias />
          </section>
        )}

        {abaAtiva === 'quartel' && (
          <section className="section">
            <Quartel />
          </section>
        )}

        {abaAtiva === 'ranking' && (
          <section className="section">
            <Ranking />
          </section>
        )}

        {abaAtiva === 'social' && (
          <>
            <section className="section">
              <div className="section__title">Mesa e Convites</div>
              <Convites onMesaChange={setMesa} />
            </section>

            <section className="section">
              <div className="section__title">Rádio Comunicador</div>
              <RadioChat 
                mesaId={mesa?.id} 
                isSolo={mesa?.tipo === 'solo'}
                mesa={mesa}
              />
            </section>
          </>
        )}

        {abaAtiva === 'perfil' && (
          <section className="section">
            <PerfilDetalhado />
          </section>
        )}
      </div>
    </div>
  )
}
