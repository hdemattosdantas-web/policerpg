import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { ensureUserDoc } from '../services/users'
import { verificarPromocao } from '../constants/hierarquia'

const UNIDADES = [
  'Patrulha Urbana',
  'Policiamento Rodoviário', 
  'Guarda Ambiental'
]

const NOMES_OFENSIVOS = [
  'porra', 'caralho', 'puta', 'merda', 'cu', 'buceta', 'foda', 'fuder',
  'desgraça', 'idiota', 'burro', 'retardado', 'otario', 'viado', 'bicha'
]

export function Alistamento() {
  const { firebaseUser } = useAuth()
  const [nomeGuerra, setNomeGuerra] = useState('')
  const [unidade, setUnidade] = useState(UNIDADES[0])
  const [processando, setProcessando] = useState(false)
  const [digitando, setDigitando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    // Efeito de digitação no topo
    setDigitando(true)
    const timer = setTimeout(() => setDigitando(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  function validarNomeGuerra(nome) {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome de Guerra é obrigatório')
    }
    
    const nomeLimpo = nome.trim()
    
    if (nomeLimpo.length > 15) {
      throw new Error('Nome de Guerra deve ter no máximo 15 caracteres')
    }
    
    if (nomeLimpo.length < 3) {
      throw new Error('Nome de Guerra deve ter pelo menos 3 caracteres')
    }
    
    const nomeLower = nomeLimpo.toLowerCase()
    const contemOfensiva = NOMES_OFENSIVOS.some(palavra => 
      nomeLower.includes(palavra)
    )
    
    if (contemOfensiva) {
      throw new Error('Nome de Guerra contém termos inadequados')
    }
    
    // Validação básica de caracteres (permite letras, números, espaços e . -)
    if (!/^[a-zA-Z0-9\s\.\-]+$/.test(nomeLimpo)) {
      throw new Error('Nome de Guerra deve conter apenas letras, números, espaços, ponto ou hífen')
    }
    
    return nomeLimpo.toUpperCase()
  }

  async function handleFinalizarAlistamento() {
    if (!firebaseUser) return
    
    setErro(null)
    setProcessando(true)
    
    try {
      const nomeValidado = validarNomeGuerra(nomeGuerra)
      
      // Cria o documento do usuário com os dados do alistamento
      await ensureUserDoc({
        uid: firebaseUser.uid,
        nome_policial: nomeValidado,
      })
      
      // Opcional: poderíamos salvar a unidade preferência também
      // await updateDoc(userRef(firebaseUser.uid), {
      //   unidade_preferencia: unidade
      // })
      
      // O AuthContext vai detectar a mudança e redirecionar automaticamente
      
    } catch (error) {
      setErro(error)
    } finally {
      setProcessando(false)
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleFinalizarAlistamento()
    }
  }

  return (
    <div className="alistamento">
      <div className="alistamento__container">
        <header className="alistamento__header">
          <div className="alistamento__titulo">ALISTAMENTO MILITAR</div>
          <div className="alistamento__subtitulo">Batalhão de Polícia - Código de Honra</div>
        </header>

        {digitando && (
          <div className="alistamento__digitando">
            Processando dados no sistema do Batalhão
            <span className="alistamento__cursor">|</span>
          </div>
        )}

        <div className="alistamento__form">
          <div className="alistamento__campo">
            <label className="alistamento__label" htmlFor="nome-guerra">
              Nome de Guerra *
            </label>
            <input
              id="nome-guerra"
              className="alistamento__input"
              type="text"
              placeholder="Ex: SD ALMEIDA"
              value={nomeGuerra}
              onChange={(e) => setNomeGuerra(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={15}
              disabled={processando}
            />
            <small className="alistamento__help">
              Máximo 15 caracteres. Será exibido no rádio e documentos.
            </small>
          </div>

          <div className="alistamento__campo">
            <label className="alistamento__label" htmlFor="unidade">
              Unidade de Preferência
            </label>
            <select
              id="unidade"
              className="alistamento__select"
              value={unidade}
              onChange={(e) => setUnidade(e.target.value)}
              disabled={processando}
            >
              {UNIDADES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <small className="alistamento__help">
              Escolha esteticamente sua unidade de atuação.
            </small>
          </div>

          <button
            className="alistamento__btn"
            onClick={handleFinalizarAlistamento}
            disabled={processando || !nomeGuerra.trim()}
          >
            {processando ? 'PROCESSANDO...' : 'FINALIZAR ALISTAMENTO'}
          </button>

          {erro && (
            <div className="alistamento__erro">
              Erro: {String(erro?.message ?? erro)}
            </div>
          )}

          <div className="alistamento__info">
            <h4>Dados do Recruta:</h4>
            <ul>
              <li>Patente Inicial: Soldado</li>
              <li>Bônus de Adesão: R$ 500</li>
              <li>Status: Em Serviço</li>
              <li>ID: {firebaseUser?.uid?.substring(0, 8)}...</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
