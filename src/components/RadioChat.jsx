import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { enviarMensagemUsuario, subscribeChat } from '../services/chat'
import { useSoundEffects } from '../hooks/useSoundEffects'
import VoiceRadio from './VoiceRadio'

export function RadioChat({ mesaId, isSolo, mesa }) {
  const { firebaseUser, userDoc } = useAuth()
  const [mensagens, setMensagens] = useState([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const chatEndRef = useRef(null)
  const timeoutRef = useRef(null)
  
  // Hook de sons
  const { tocarRadio } = useSoundEffects()

  useEffect(() => {
    if (!mesaId) return

    const unsub = subscribeChatMesa(mesaId, (novasMensagens) => {
      setMensagens(novasMensagens)
      
      // Toca som para novas mensagens (exceto as próprias)
      const ultimaMensagem = novasMensagens[novasMensagens.length - 1]
      if (ultimaMensagem && ultimaMensagem.uid !== firebaseUser?.uid) {
        tocarRadio()
      }
    })

    // Inicia chat solo com mensagens da Central
    if (isSolo) {
      iniciarChatSolo(mesaId)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      unsub()
    }
  }, [mesaId, isSolo, firebaseUser?.uid])

  useEffect(() => {
    // Auto-scroll para a última mensagem
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  async function handleEnviar() {
    if (!texto.trim() || enviando || !firebaseUser) return

    setEnviando(true)
    try {
      await enviarMensagem(mesaId, {
        uid: firebaseUser.uid,
        username: userDoc?.username || 'Anônimo',
        texto: texto.trim(),
        tipo: 'usuario',
      })
      setTexto('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setEnviando(false)
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  function formatarTimestamp(timestamp) {
    if (!timestamp) return ''
    const date = timestamp.toDate()
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  function getCorMensagem(tipo) {
    switch (tipo) {
      case 'central': return '#00FF41' // Verde neon
      case 'sistema': return '#FFB800' // Âmbar
      default: return '#00FFFF' // Ciano
    }
  }

  return (
    <div className="radio-chat">
      <div className="radio-chat__header">
        <div className="radio-chat__title">RÁDIO COMUNICADOR</div>
        <div className="radio-chat__status">
          <span className={`radio-chat__led ${mesaId ? 'online' : 'offline'}`}></span>
          {mesaId ? (isSolo ? 'SOLO' : 'MESA') : 'OFFLINE'}
        </div>
      </div>
      
      <div className="radio-chat__messages">
        <div className="radio-chat__noise"></div>
        {mensagens.map((msg) => (
          <div key={msg.id} className="radio-chat__message">
            <span className="radio-chat__time" style={{ color: '#666' }}>
              [{formatarTimestamp(msg.timestamp)}]
            </span>
            <span 
              className="radio-chat__sender" 
              style={{ color: getCorMensagem(msg.tipo) }}
            >
              {msg.username}:
            </span>
            <span 
              className="radio-chat__text"
              style={{ color: getCorMensagem(msg.tipo) }}
            >
              {msg.texto}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      <div className="radio-chat__input">
        <input
          type="text"
          className="radio-chat__textfield"
          placeholder="Transmitir mensagem..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!mesaId || enviando}
        />
        <button
          className="radio-chat__send"
          onClick={handleEnviar}
          disabled={!mesaId || enviando || !texto.trim()}
        >
          {enviando ? '...' : 'TX'}
        </button>
      </div>
      
      <div className="radio-chat__ptt">
        <button 
          className="radio-chat__ptt-btn"
          disabled={!mesaId}
        >
          🎤 PTT (em breve)
        </button>
        <span className="radio-chat__ptt-label">Push-to-Talk (em breve)</span>
      </div>
      
      <VoiceRadio mesa={mesa} />
    </div>
  )
}
