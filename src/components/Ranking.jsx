import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getRankingTop10Cached, getUserRankingPosition, limparCacheRanking, getUserWithRanking } from '../services/ranking'
import { getCorPatente } from '../constants/hierarquia'

export function Ranking() {
  const { firebaseUser, userDoc } = useAuth()
  const [ranking, setRanking] = useState([])
  const [posicaoUsuario, setPosicaoUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [erro, setErro] = useState(null)

  async function carregarRanking() {
    try {
      setErro(null)
      const dados = await getRankingTop10Cached()
      setRanking(dados)
      
      // Busca posição do usuário se estiver logado
      if (firebaseUser) {
        const posicao = await getUserRankingPosition(firebaseUser.uid)
        setPosicaoUsuario(posicao)
      }
    } catch (error) {
      setErro(error)
    } finally {
      setCarregando(false)
    }
  }

  async function handleAtualizar() {
    if (!firebaseUser) return
    
    setAtualizando(true)
    setErro(null)
    
    try {
      // Limpa o cache para forçar busca atualizada
      limparCacheRanking()
      
      // Recarrega os dados
      await carregarRanking()
    } catch (error) {
      setErro(error)
    } finally {
      setAtualizando(false)
    }
  }

  useEffect(() => {
    carregarRanking()
  }, [firebaseUser])

  function getMedalha(posicao) {
    switch (posicao) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${posicao}`
    }
  }

  function getCorNome(isOficial) {
    return isOficial ? '#FFD700' : '#C0C0C0' // Dourado para oficiais, prata para praças
  }

  function formatarXP(xp) {
    return xp.toLocaleString('pt-BR')
  }

  if (carregando) {
    return (
      <div className="ranking">
        <div className="section__title">Ranking Geral do Batalhão</div>
        <div className="ranking__carregando">
          <div className="ranking__loading-spinner"></div>
          <div className="ranking__loading-text">Carregando ranking...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="ranking">
      <div className="ranking__header">
        <div className="section__title">Ranking Geral do Batalhão</div>
        <button
          className="ranking__atualizar"
          onClick={handleAtualizar}
          disabled={atualizando}
        >
          {atualizando ? '🔄 Atualizando...' : '🔄 Atualizar'}
        </button>
      </div>

      {/* Tabela do Ranking */}
      <div className="ranking__tabela-wrapper">
        <table className="ranking__tabela">
          <thead>
            <tr>
              <th className="ranking__coluna-posicao">Posição</th>
              <th className="ranking__coluna-patente">Patente</th>
              <th className="ranking__coluna-nome">Nome de Guerra</th>
              <th className="ranking__coluna-xp">XP Total</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((usuario) => (
              <tr 
                key={usuario.uid}
                className={`ranking__linha ${usuario.uid === firebaseUser?.uid ? 'ranking__linha--usuario' : ''}`}
              >
                <td className="ranking__posicao">
                  <span className="ranking__medalha">
                    {getMedalha(usuario.posicao)}
                  </span>
                </td>
                <td className="ranking__patente">
                  <span className="ranking__patente-texto">
                    {usuario.patente}
                  </span>
                </td>
                <td className="ranking__nome">
                  <span 
                    className="ranking__nome-texto"
                    style={{ color: getCorNome(usuario.isOficial) }}
                  >
                    {usuario.nome_policial}
                    {usuario.uid === firebaseUser?.uid && (
                      <span className="ranking__voce"> (Você)</span>
                    )}
                  </span>
                </td>
                <td className="ranking__xp">
                  <span className="ranking__xp-valor">
                    {formatarXP(usuario.xp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Posição do usuário fora do Top 10 */}
      {posicaoUsuario && posicaoUsuario > 10 && (
        <div className="ranking__posicao-usuario">
          <div className="ranking__posicao-usuario-texto">
            📍 Sua posição: <strong>{posicaoUsuario}º</strong> no ranking geral
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && (
        <div className="result result--error">
          Erro ao carregar ranking: {String(erro?.message ?? erro)}
        </div>
      )}

      {/* Ranking vazio */}
      {ranking.length === 0 && !erro && (
        <div className="ranking__vazio">
          <div className="ranking__vazio-texto">
            Nenhum policial no ranking ainda. Seja o primeiro!
          </div>
        </div>
      )}
    </div>
  )
}
