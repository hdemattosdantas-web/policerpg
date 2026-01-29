import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { Badge } from './Badge'
import { verificarPromocao, getCorPatente } from '../constants/hierarquia'
import { formatMoneyBRL } from '../utils/formatMoney'

function calcularTempoServico(dataAlistamento) {
  if (!dataAlistamento) return 'Recém-alistado'
  
  const agora = new Date()
  const alistamento = dataAlistamento.toDate ? dataAlistamento.toDate() : new Date(dataAlistamento)
  const diffMs = agora - alistamento
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDias < 30) return `${diffDias} dias de serviço`
  if (diffDias < 365) {
    const meses = Math.floor(diffDias / 30)
    return `${meses} ${meses === 1 ? 'mês' : 'meses'} de serviço`
  }
  
  const anos = Math.floor(diffDias / 365)
  const mesesRestantes = Math.floor((diffDias % 365) / 30)
  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'} de serviço`
}

export function PerfilDetalhado() {
  const { firebaseUser, userDoc, logout } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const nome_policial = userDoc?.nome_policial ?? 'Policial'
  const username = userDoc?.username ?? null
  const xp = userDoc?.xp ?? 0
  const saldo = userDoc?.saldo ?? 0
  const data_alistamento = userDoc?.data_alistamento
  const isPremium = userDoc?.isPremium ?? false

  // Estatísticas da carreira
  const total_patrulhas = userDoc?.total_patrulhas ?? 0
  const ocorrencias_sucesso = userDoc?.ocorrencias_sucesso ?? 0
  const dinheiro_acumulado = userDoc?.dinheiro_acumulado ?? saldo
  const itens_comprados = userDoc?.itens_comprados ?? (userDoc?.inventario?.length ?? 0)

  const patente_atual = verificarPromocao(xp)
  const corNome = getCorPatente(patente_atual)

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair da viatura?')) {
      logout()
    }
  }

  return (
    <div className="perfil-detalhado">
      {/* Cabeçalho estilo documento oficial */}
      <div className="perfil-header">
        <div className="perfil-header__topo">
          <div className="perfil-header__clip"></div>
          <div className="perfil-header__titulo">
            FOLHA DE SERVIÇOS - POLÍCIA CIVIL DE NOVA AETHEL
          </div>
          <div className="perfil-header__clip"></div>
        </div>
      </div>

      {/* Identidade do Agente */}
      <section className="perfil-section">
        <div className="perfil-section__titulo">IDENTIDADE DO AGENTE</div>
        <div className="identidade-grid">
          <div className="identidade__principal">
            <div className="identidade__nome" style={{ color: corNome }}>
              {nome_policial}
            </div>
            <div className="identidade__cargo">
              <Badge size="large">{patente_atual.nome}</Badge>
            </div>
          </div>
          
          <div className="identidade__dados">
            <div className="identidade__item">
              <span className="identidade__label">UID:</span>
              <span className="identidade__valor">{username || 'N/A'}</span>
            </div>
            <div className="identidade__item">
              <span className="identidade__label">Tempo de Serviço:</span>
              <span className="identidade__valor">{calcularTempoServico(data_alistamento)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Painel de Estatísticas */}
      <section className="perfil-section">
        <div className="perfil-section__titulo">ESTATÍSTICAS DA CARREIRA</div>
        <div className="estatisticas-grid">
          <div className="estatistica-card">
            <div className="estatistica__numero">{total_patrulhas}</div>
            <div className="estatistica__label">Total de Patrulhas</div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica__numero">{ocorrencias_sucesso}</div>
            <div className="estatistica__label">Ocorrências Resolvidas</div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica__numero">{formatMoneyBRL(dinheiro_acumulado)}</div>
            <div className="estatistica__label">Dinheiro Acumulado</div>
          </div>
          <div className="estatistica-card">
            <div className="estatistica__numero">{itens_comprados}</div>
            <div className="estatistica__label">Itens no Inventário</div>
          </div>
        </div>
      </section>

      {/* Gestão de Carreira */}
      <section className="perfil-section">
        <div className="perfil-section__titulo">STATUS DA CONTA</div>
        <div className="conta-status">
          <div className="conta__plano">
            <span className="conta__label">Plano:</span>
            <Badge className={isPremium ? 'badge-premium' : 'badge-gratuito'}>
              {isPremium ? 'Oficial Pro' : 'Gratuito'}
            </Badge>
          </div>
          
          {!isPremium && (
            <div className="conta__upgrade">
              <button 
                className="btn btn-premium"
                onClick={() => setShowUpgradeModal(true)}
              >
                🚀 Upgrade de Carreira
              </button>
              <div className="conta__beneficios">
                <small>
                  • Estatísticas Avançadas<br/>
                  • Avatar Personalizado<br/>
                  • Benefícios Exclusivos
                </small>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Botão Sair da Viatura */}
      <section className="perfil-section perfil-section--footer">
        <button 
          className="btn btn-sair"
          onClick={handleLogout}
        >
          🚗 Sair da Viatura
        </button>
      </section>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>🚀 Upgrade de Carreira</h3>
              <button 
                className="modal__close"
                onClick={() => setShowUpgradeModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Em breve: Torne-se um Oficial e ganhe benefícios exclusivos!</p>
              <div className="beneficios-lista">
                <div className="beneficio-item">📊 Estatísticas Avançadas</div>
                <div className="beneficio-item">👤 Avatar Personalizado</div>
                <div className="beneficio-item">⭐ Acesso Prioritário</div>
                <div className="beneficio-item">🏖️ Bônus Semanais</div>
              </div>
            </div>
            <div className="modal__footer">
              <button 
                className="btn"
                onClick={() => setShowUpgradeModal(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
