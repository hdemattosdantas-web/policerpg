import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { iniciarPatrulha, resolverOcorrencia, subscribeOcorrenciasAtivas, subscribeHistorico } from '../services/ocorrencias'
import { getCorDificuldade } from '../constants/ocorrencias'
import { useEnergia } from '../hooks/useEnergia'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { Loading, LoadingOverlay } from './Loading'

export function Ocorrencias() {
  const { firebaseUser, userDoc } = useAuth()
  const [patrulhando, setPatrulhando] = useState(false)
  const [ocorrenciaAtiva, setOcorrenciaAtiva] = useState(null)
  const [historico, setHistorico] = useState([])
  const [contador, setContador] = useState(0)
  const [resolvendo, setResolvendo] = useState(false)
  const [erro, setErro] = useState(null)

  // Hooks de energia e sons
  const { energia, temEnergiaSuficiente, consumirEnergia, carregando: carregandoEnergia } = useEnergia(firebaseUser?.uid)
  const { tocarSucesso, tocarErro } = useSoundEffects()

  // Efeito para atualizar o contador
  useEffect(() => {
    if (!patrulhando || contador <= 0) return

    const timer = setTimeout(() => {
      setContador(contador - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [patrulhando, contador])

  // Efeito para buscar ocorrência quando o contador chegar a zero
  useEffect(() => {
    if (patrulhando && contador === 0) {
      handleBuscarOcorrencia()
    }
  }, [patrulhando, contador])

  // Efeito para inscrever nas ocorrências ativas
  useEffect(() => {
    if (!firebaseUser) return

    const unsubOcorrencias = subscribeOcorrenciasAtivas(
      firebaseUser.uid,
      setOcorrenciaAtiva,
      setErro
    )

    const unsubHistorico = subscribeHistorico(
      firebaseUser.uid,
      setHistorico,
      setErro
    )

    return () => {
      unsubOcorrencias?.()
      unsubHistorico?.()
    }
  }, [firebaseUser])

  async function handleIniciarPatrulha() {
    if (!firebaseUser || !userDoc || !temEnergiaSuficiente) return

    setErro(null)
    
    // Consome energia antes de iniciar
    const energiaConsumida = await consumirEnergia()
    if (!energiaConsumida) {
      setErro(new Error('Energia insuficiente para patrulhar'))
      return
    }

    setPatrulhando(true)
    setOcorrenciaAtiva(null)
    
    // Tempo aleatório entre 5 e 10 segundos, reduzido pelos itens
    const tempoBase = Math.floor(Math.random() * 6) + 5
    const inventario = userDoc.inventario || []
    
    // Calcula bônus de redução de tempo
    const { calcularBonusTotais } = await import('../constants/itens')
    const bonus = calcularBonusTotais(inventario)
    const tempoFinal = Math.max(3, tempoBase - bonus.reducao_tempo) // Mínimo 3 segundos
    
    setContador(tempoFinal)
  }

  async function handleBuscarOcorrencia() {
    if (!firebaseUser || !userDoc) return

    try {
      const patente = userDoc.patente_atual || 'Soldado'
      const inventario = userDoc.inventario || []
      await iniciarPatrulha(firebaseUser.uid, patente, inventario)
      setPatrulhando(false)
    } catch (error) {
      setErro(error)
      setPatrulhando(false)
    }
  }

  async function handleIntervir() {
    if (!ocorrenciaAtiva || !firebaseUser) return

    setResolvendo(true)
    setErro(null)

    try {
      const resultado = await resolverOcorrencia(
        firebaseUser.uid,
        ocorrenciaAtiva.id
      )
      
      // Toca som baseado no resultado
      if (resultado.resultado.xp > 0) {
        tocarSucesso()
      } else {
        tocarErro()
      }
      
      // O resultado já foi aplicado no Firebase
      // O AuthContext vai atualizar automaticamente
      setOcorrenciaAtiva(null)
    } catch (error) {
      setErro(error)
      tocarErro()
    } finally {
      setResolvendo(false)
    }
  }

  function formatarTempo(segundos) {
    const mins = Math.floor(segundos / 60)
    const segs = segundos % 60
    return `${mins}:${segs.toString().padStart(2, '0')}`
  }

  return (
    <div className="ocorrencias">
      <div className="section__title">Sistema de Ocorrências</div>

      {/* Barra de Energia */}
      {!carregandoEnergia && (
        <div className="ocorrencias__energia">
          <div className="ocorrencias__energia-header">
            <span className="ocorrencias__energia-label">⚡ Energia</span>
            <span className="ocorrencias__energia-valor">{energia}/100</span>
          </div>
          <div className="ocorrencias__energia-barra">
            <div 
              className="ocorrencias__energia-progress"
              style={{ width: `${energia}%` }}
            />
          </div>
          <div className="ocorrencias__energia-info">
            Cada patrulha consome 20 de energia. Recupera 1 por minuto.
          </div>
        </div>
      )}

      {/* Loading de energia */}
      {carregandoEnergia && (
        <Loading mensagem="Carregando energia..." tamanho="pequeno" />
      )}

      {/* Estado de Patrulhando */}
      {patrulhando && (
        <div className="ocorrencias__patrulhando">
          <div className="ocorrencias__contador">
            <div className="ocorrencias__tempo">{formatarTempo(contador)}</div>
            <div className="ocorrencias__mensagem">
              Patrulhando as ruas de Nova Aethel...
            </div>
          </div>
          <div className="ocorrencias__progress">
            <div 
              className="ocorrencias__progress-bar"
              style={{ width: `${((10 - contador) / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Ocorrência Ativa */}
      {ocorrenciaAtiva && (
        <div className="ocorrencias__ativa">
          <div className="ocorrencias__header">
            <h3 className="ocorrencias__titulo">{ocorrenciaAtiva.titulo}</h3>
            <span 
              className="ocorrencias__dificuldade"
              style={{ color: getCorDificuldade(ocorrenciaAtiva.dificuldade) }}
            >
              {ocorrenciaAtiva.dificuldade}
            </span>
          </div>
          
          <div className="ocorrencias__descricao">
            {ocorrenciaAtiva.descricao}
          </div>

          <div className="ocorrencias__acoes">
            <button
              className="btn btn--primary"
              onClick={handleIntervir}
              disabled={resolvendo}
            >
              {resolvendo ? 'Intervindo...' : 'Intervir'}
            </button>
          </div>

          {ocorrenciaAtiva.resultado && (
            <div className={`ocorrencias__resultado ${ocorrenciaAtiva.sucesso ? 'sucesso' : 'falha'}`}>
              <div className="ocorrencias__resultado-titulo">
                {ocorrenciaAtiva.sucesso ? '✅ Missão Concluída' : '❌ Missão Falhou'}
              </div>
              <div className="ocorrencias__resultado-mensagem">
                {ocorrenciaAtiva.resultado.mensagem}
              </div>
              <div className="ocorrencias__resultado-recompensas">
                <span>XP: {ocorrenciaAtiva.resultado.xp > 0 ? '+' : ''}{ocorrenciaAtiva.resultado.xp}</span>
                <span>R$: {ocorrenciaAtiva.resultado.dinheiro > 0 ? '+' : ''}{ocorrenciaAtiva.resultado.dinheiro}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botão Iniciar Patrulha - Prevenção de Spam */}
      {!patrulhando && !ocorrenciaAtiva && (
        <button
          className="btn btn--primary ocorrencias__iniciar"
          onClick={handleIniciarPatrulha}
          disabled={!temEnergiaSuficiente || carregandoEnergia}
        >
          🚔 {carregandoEnergia ? 'Carregando...' : !temEnergiaSuficiente ? 'Energia Insuficiente' : 'Iniciar Patrulha'}
        </button>
      )}

      {/* Histórico */}
      {historico.length > 0 && (
        <div className="ocorrencias__historico">
          <h4 className="ocorrencias__historico-titulo">Histórico de Serviço</h4>
          <div className="ocorrencias__historico-lista">
            {historico.map((item) => (
              <div 
                key={item.id} 
                className={`ocorrencias__historico-item ${item.sucesso ? 'sucesso' : 'falha'}`}
              >
                <div className="ocorrencias__historico-titulo-item">
                  {item.sucesso ? '✅' : '❌'} {item.titulo}
                </div>
                <div className="ocorrencias__historico-recompensas">
                  XP: {item.resultado.xp > 0 ? '+' : ''}{item.resultado.xp} | 
                  R$: {item.resultado.dinheiro > 0 ? '+' : ''}{item.resultado.dinheiro}
                </div>
                <div className="ocorrencias__historico-tempo">
                  {item.timestamp?.toDate()?.toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="result result--error">
          Erro: {String(erro?.message ?? erro)}
        </div>
      )}

      {/* Overlay de carregamento */}
      <LoadingOverlay visivel={resolvendo} mensagem="Resolvendo ocorrência..." />
    </div>
  )
}
