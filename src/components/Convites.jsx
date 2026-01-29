import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  criarMesa, 
  gerarCodigoConvite, 
  entrarNaMesaPorCodigo,
  sairDaMesa,
  subscribeMesaDoUsuario 
} from '../services/mesas'
import { 
  buscarAmigosOnline,
  enviarSolicitacaoAmizade,
  subscribeSolicitacoes,
  aceitarSolicitacaoAmizade,
  rejeitarSolicitacaoAmizade,
  buscarUsuarioPorUsername 
} from '../services/amizades'

export function Convites({ onMesaChange }) {
  const { firebaseUser } = useAuth()
  const [mesa, setMesa] = useState(null)
  const [codigoConvite, setCodigoConvite] = useState('')
  const [codigoEntrar, setCodigoEntrar] = useState('')
  const [amigos, setAmigos] = useState([])
  const [solicitacoes, setSolicitacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [usernameBuscar, setUsernameBuscar] = useState('')
  const [erro, setErro] = useState(null)
  const [discordLink, setDiscordLink] = useState('')

  useEffect(() => {
    if (!firebaseUser) return

    const unsubMesa = subscribeMesaDoUsuario(
      firebaseUser.uid,
      (mesaData) => {
        setMesa(mesaData)
        onMesaChange?.(mesaData)
      },
      (error) => setErro(error)
    )

    const unsubAmigos = buscarAmigosOnline(firebaseUser.uid)
      .then(setAmigos)
      .catch(setErro)

    const unsubSolicitacoes = subscribeSolicitacoes(
      firebaseUser.uid,
      setSolicitacoes,
      setErro
    )

    return () => {
      unsubMesa()
    }
  }, [firebaseUser, onMesaChange])

  async function handleCriarMesa(tipo) {
    if (!firebaseUser) return
    
    setLoading(true)
    try {
      const mesaId = await criarMesa({
        donoUid: firebaseUser.uid,
        nome: `Mesa de ${firebaseUser.displayName || 'Anônimo'}`,
        tipo,
        discordChannelLink: tipo === 'multiplayer' ? discordLink.trim() || null : null,
      })
      
      if (tipo === 'multiplayer') {
        const codigo = await gerarCodigoConvite(mesaId)
        setCodigoConvite(codigo)
      }
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleEntrarNaMesa() {
    if (!codigoEntrar.trim() || !firebaseUser) return
    
    setLoading(true)
    try {
      await entrarNaMesaPorCodigo(codigoEntrar.trim(), firebaseUser.uid)
      setCodigoEntrar('')
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSairDaMesa() {
    if (!mesa || !firebaseUser) return
    
    setLoading(true)
    try {
      await sairDaMesa(mesa.id, firebaseUser.uid)
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleBuscarUsuario() {
    if (!usernameBuscar.trim()) return
    
    setLoading(true)
    try {
      const usuario = await buscarUsuarioPorUsername(usernameBuscar.trim())
      setErro(null)
      // Aqui você poderia mostrar um modal para convidar
      alert(`Usuário encontrado: ${usuario.username}`)
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleEnviarSolicitacao(amigoUid) {
    if (!firebaseUser) return
    
    setLoading(true)
    try {
      await enviarSolicitacaoAmizade(
        firebaseUser.uid,
        amigoUid,
        '' // username será preenchido no backend
      )
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAceitarSolicitacao(solicitacaoId) {
    setLoading(true)
    try {
      await aceitarSolicitacaoAmizade(firebaseUser.uid, solicitacaoId)
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRejeitarSolicitacao(solicitacaoId) {
    setLoading(true)
    try {
      await rejeitarSolicitacaoAmizade(firebaseUser.uid, solicitacaoId)
    } catch (error) {
      setErro(error)
    } finally {
      setLoading(false)
    }
  }

  if (mesa) {
    return (
      <div className="panel">
        <div className="section__title">Mesa Atual</div>
        <div className="convites__mesa-info">
          <div><strong>Nome:</strong> {mesa.nome}</div>
          <div><strong>Tipo:</strong> {mesa.tipo === 'solo' ? 'Solo' : 'Multiplayer'}</div>
          <div><strong>Membros:</strong> {mesa.membros.length}</div>
          {mesa.codigoConvite && (
            <div>
              <strong>Código de Convite:</strong> 
              <span className="badge">{mesa.codigoConvite}</span>
            </div>
          )}
        </div>
        
        <button 
          className="btn" 
          onClick={handleSairDaMesa}
          disabled={loading}
        >
          Sair da Mesa
        </button>
        
        {erro && (
          <div className="result result--error">
            Erro: {String(erro?.message ?? erro)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="section__title">Criar Mesa</div>
      
      <div className="convites__buttons">
        <button 
          className="btn btn--primary"
          onClick={() => handleCriarMesa('solo')}
          disabled={loading}
        >
          Mesa Solo
        </button>
        <button 
          className="btn btn--primary"
          onClick={() => handleCriarMesa('multiplayer')}
          disabled={loading}
        >
          Mesa Multiplayer
        </button>
      </div>
      
      <div className="convites__discord-field">
        <label className="convites__label">Link do Canal do Discord (opcional):</label>
        <input
          className="input"
          placeholder="https://discord.com/channels/..."
          value={discordLink}
          onChange={(e) => setDiscordLink(e.target.value)}
        />
        <small className="convites__help">
          Para mesas multiplayer, adicione o link do canal de voz do Discord
        </small>
      </div>
      
      {codigoConvite && (
        <div className="convites__codigo">
          <strong>Código de Convite:</strong>
          <span className="badge">{codigoConvite}</span>
        </div>
      )}
      
      <div className="section__title">Entrar na Mesa</div>
      <div className="rename">
        <input
          className="input"
          placeholder="Código de Patrulha"
          value={codigoEntrar}
          onChange={(e) => setCodigoEntrar(e.target.value)}
        />
        <button 
          className="btn"
          onClick={handleEntrarNaMesa}
          disabled={loading || !codigoEntrar.trim()}
        >
          Entrar
        </button>
      </div>
      
      <div className="section__title">Amigos</div>
      
      <div className="rename">
        <input
          className="input"
          placeholder="Buscar por username"
          value={usernameBuscar}
          onChange={(e) => setUsernameBuscar(e.target.value)}
        />
        <button 
          className="btn"
          onClick={handleBuscarUsuario}
          disabled={loading || !usernameBuscar.trim()}
        >
          Buscar
        </button>
      </div>
      
      {solicitacoes.length > 0 && (
        <div className="convites__solicitacoes">
          <div className="section__title">Solicitações de Amizade</div>
          {solicitacoes.map((sol) => (
            <div key={sol.id} className="convites__solicitacao">
              <span>{sol.deUsername} quer ser seu amigo</span>
              <div>
                <button 
                  className="btn btn--primary"
                  onClick={() => handleAceitarSolicitacao(sol.id)}
                  disabled={loading}
                >
                  Aceitar
                </button>
                <button 
                  className="btn"
                  onClick={() => handleRejeitarSolicitacao(sol.id)}
                  disabled={loading}
                >
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {erro && (
        <div className="result result--error">
          Erro: {String(erro?.message ?? erro)}
        </div>
      )}
    </div>
  )
}
