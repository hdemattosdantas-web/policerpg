import './Loading.css'

export function Loading({ mensagem = 'Carregando...', tamanho = 'medio' }) {
  return (
    <div className={`loading loading--${tamanho}`}>
      <div className="loading__content">
        <div className="loading__spinner">
          <div className="loading__escudo">
            <div className="loading__estrela">⭐</div>
          </div>
        </div>
        <div className="loading__texto">{mensagem}</div>
        <div className="loading__dots">
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
          <span className="loading__dot"></span>
        </div>
      </div>
    </div>
  )
}

export function LoadingOverlay({ mensagem = 'Processando...', visivel = true }) {
  if (!visivel) return null

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__backdrop">
        <Loading mensagem={mensagem} tamanho="grande" />
      </div>
    </div>
  )
}

export function LoadingInline({ mensagem = 'Carregando...', visivel = true }) {
  if (!visivel) return null

  return (
    <div className="loading-inline">
      <div className="loading-inline__spinner"></div>
      <span className="loading-inline__texto">{mensagem}</span>
    </div>
  )
}
