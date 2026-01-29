import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { ITENS, ITENS_PREMIUM, calcularBonusTotais } from '../constants/itens'
import { comprarItem, verificarPossuiItem, getInventario } from '../services/loja'
import { formatMoneyBRL } from '../utils/formatMoney'

export function Quartel() {
  const { firebaseUser, userDoc } = useAuth()
  const [inventario, setInventario] = useState([])
  const [comprando, setComprando] = useState(null)
  const [erro, setErro] = useState(null)
  const [abaAtiva, setAbaAtiva] = useState('equipamentos')

  useEffect(() => {
    if (!firebaseUser) return

    const carregarInventario = async () => {
      try {
        const itens = await getInventario(firebaseUser.uid)
        setInventario(itens)
      } catch (error) {
        console.error('Erro ao carregar inventário:', error)
      }
    }

    carregarInventario()
  }, [firebaseUser])

  async function handleComprarItem(itemId) {
    if (!firebaseUser) return

    setErro(null)
    setComprando(itemId)

    try {
      const resultado = await comprarItem(firebaseUser.uid, itemId)
      setInventario(resultado.novoInventario)
      
      // O AuthContext vai atualizar o saldo automaticamente
    } catch (error) {
      setErro(error)
    } finally {
      setComprando(null)
    }
  }

  function possuiItem(itemId) {
    return inventario.includes(itemId)
  }

  function getItensPorAba(aba) {
    switch (aba) {
      case 'equipamentos':
        return ITENS.filter(item => 
          ['protecao', 'equipamento', 'arma'].includes(item.categoria)
        )
      case 'veiculos':
        return ITENS.filter(item => item.categoria === 'veiculo')
      case 'comunicacao':
        return ITENS.filter(item => item.categoria === 'comunicacao')
      case 'cosmeticos':
        return ITENS.filter(item => item.categoria === 'cosmetico')
      case 'premium':
        return ITENS_PREMIUM
      default:
        return ITENS
    }
  }

  const bonusTotais = calcularBonusTotais(inventario)
  const saldo = userDoc?.saldo || 0

  return (
    <div className="quartel">
      <div className="section__title">Quartel - Loja de Equipamentos</div>

      {/* Resumo do Jogador */}
      <div className="quartel__resumo">
        <div className="quartel__saldo">
          <span className="quartel__saldo-label">Saldo Disponível:</span>
          <span className="quartel__saldo-valor">{formatMoneyBRL(saldo)}</span>
        </div>
        
        <div className="quartel__bonus">
          <h4>Bônus Ativos:</h4>
          {bonusTotais.chance_sucesso > 0 && (
            <div>+{(bonusTotais.chance_sucesso * 100).toFixed(0)}% Chance de Sucesso</div>
          )}
          {bonusTotais.reducao_tempo > 0 && (
            <div>-{bonusTotais.reducao_tempo}s Tempo de Patrulha</div>
          )}
          {bonusTotais.bonus_xp > 0 && (
            <div>+{(bonusTotais.bonus_xp * 100).toFixed(0)}% XP em Prisões</div>
          )}
          {bonusTotais.reducao_penalidade > 0 && (
            <div>-{(bonusTotais.reducao_penalidade * 100).toFixed(0)}% Penalidades</div>
          )}
        </div>
      </div>

      {/* Abas */}
      <div className="quartel__abas">
        {['equipamentos', 'veiculos', 'comunicacao', 'cosmeticos'].map(aba => (
          <button
            key={aba}
            className={`quartel__aba ${abaAtiva === aba ? 'quartel__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba.charAt(0).toUpperCase() + aba.slice(1)}
          </button>
        ))}
        <button
          className={`quartel__aba quartel__aba--premium ${abaAtiva === 'premium' ? 'quartel__aba--ativa' : ''}`}
          onClick={() => setAbaAtiva('premium')}
        >
          ⭐ Premium
        </button>
      </div>

      {/* Grid de Itens */}
      <div className="quartel__grid">
        {getItensPorAba(abaAtiva).map(item => {
          const possui = possuiItem(item.id)
          const podeComprar = saldo >= item.preco && !possui
          
          return (
            <div key={item.id} className={`quartel__item ${possui ? 'quartel__item--possui' : ''}`}>
              <div className="quartel__item-header">
                <div className="quartel__item-icone">{item.icone}</div>
                <div className="quartel__item-nome">{item.nome}</div>
                {item.premium && (
                  <div className="quartel__item-premium">⭐ PREMIUM</div>
                )}
              </div>
              
              <div className="quartel__item-descricao">
                {item.descricao}
              </div>
              
              {item.bonus && (
                <div className="quartel__item-bonus">
                  <strong>Bônus:</strong> {formatarBonus(item.bonus)}
                </div>
              )}
              
              <div className="quartel__item-footer">
                <div className="quartel__item-preco">
                  {formatMoneyBRL(item.preco)}
                </div>
                
                <button
                  className={`quartel__item-btn ${
                    possui 
                      ? 'quartel__item-btn--equipado' 
                      : podeComprar 
                        ? 'quartel__item-btn--comprar'
                        : 'quartel__item-btn--desabilitado'
                  }`}
                  onClick={() => !possui && handleComprarItem(item.id)}
                  disabled={!podeComprar || comprando === item.id}
                >
                  {comprando === item.id 
                    ? 'Comprando...' 
                    : possui 
                      ? 'Equipado' 
                      : podeComprar
                        ? 'Adquirir'
                        : 'Saldo Insuficiente'
                  }
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensagem de erro */}
      {erro && (
        <div className="result result--error">
          Erro: {String(erro?.message ?? erro)}
        </div>
      )}

      {/* Itens Premium - Aviso */}
      {abaAtiva === 'premium' && (
        <div className="quartel__premium-aviso">
          <h4>🌟 Itens Premium</h4>
          <p>Itens exclusivos para membros VIP ou patentes altas. Em breve disponíveis!</p>
        </div>
      )}
    </div>
  )
}

function formatarBonus(bonus) {
  switch (bonus.tipo) {
    case 'chance_sucesso':
      return `+${(bonus.valor * 100).toFixed(0)}% chance de sucesso`
    case 'reducao_tempo':
      return `-${bonus.valor}s no tempo de patrulha`
    case 'bonus_xp':
      return `+${(bonus.valor * 100).toFixed(0)}% XP em prisões`
    case 'reducao_penalidade':
      return `-${(bonus.valor * 100).toFixed(0)}% penalidades`
    case 'liberar_ocorrencias':
      return `Libera ocorrências ${bonus.valor}`
    case 'cosmetico':
      return 'Item cosmético'
    default:
      return 'Bônus especial'
  }
}
