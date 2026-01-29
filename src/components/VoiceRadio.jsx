import { useState } from 'react'

export function VoiceRadio({ mesa }) {
  const [loading, setLoading] = useState(false)

  const isSolo = mesa?.tipo === 'solo'
  const hasDiscordLink = mesa?.discordChannelLink

  function handleOpenDiscord() {
    if (!hasDiscordLink) return

    setLoading(true)
    try {
      window.open(hasDiscordLink, '_blank')
    } catch (error) {
      console.error('Erro ao abrir Discord:', error)
    } finally {
      setTimeout(() => setLoading(false), 1000)
    }
  }

  if (isSolo) {
    return (
      <div className="voice-radio voice-radio--disabled">
        <button className="voice-radio__btn voice-radio__btn--disabled" disabled>
          🎤 Rádio Silencioso
        </button>
        <div className="voice-radio__info">
          Modo Solo: rádio de voz desativado
        </div>
      </div>
    )
  }

  if (!hasDiscordLink) {
    return (
      <div className="voice-radio voice-radio--no-link">
        <button className="voice-radio__btn voice-radio__btn--disabled" disabled>
          🎤 Voz Indisponível
        </button>
        <div className="voice-radio__info">
          Canal de voz não configurado para esta mesa
        </div>
      </div>
    )
  }

  return (
    <div className="voice-radio">
      <button 
        className="voice-radio__btn"
        onClick={handleOpenDiscord}
        disabled={loading}
      >
        {loading ? '⏳ Conectando...' : '🎤 Entrar no Rádio de Voz'}
      </button>
      <div className="voice-radio__info">
        Para usar o rádio de voz, autorize a entrada no servidor oficial do Batalhão
      </div>
      {hasDiscordLink && (
        <div className="voice-radio__link-preview">
          Canal: {new URL(hasDiscordLink).pathname.split('/').pop() || 'Canal de Voz'}
        </div>
      )}
    </div>
  )
}


export default VoiceRadio
