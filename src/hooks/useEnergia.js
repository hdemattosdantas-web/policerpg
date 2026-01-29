import { useState, useEffect, useCallback } from 'react'
import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'

const ENERGIA_MAXIMA = 100
const CUSTO_PATRULHA = 20
const RECUPERACAO_POR_MINUTO = 1
const INTERVALO_RECUPERACAO = 60 * 1000 // 1 minuto em milissegundos

function userRef(uid) {
  return doc(db, 'users', uid)
}

export function useEnergia(uid) {
  const [energia, setEnergia] = useState(ENERGIA_MAXIMA)
  const [ultimaRecuperacao, setUltimaRecuperacao] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Calcula energia recuperada desde a última atualização
  const calcularEnergiaRecuperada = useCallback((ultimaVez) => {
    if (!ultimaVez) return 0
    
    const agora = new Date()
    const ultima = ultimaVez.toDate()
    const minutosPassados = Math.floor((agora - ultima) / (1000 * 60))
    
    return Math.min(minutosPassados * RECUPERACAO_POR_MINUTO, ENERGIA_MAXIMA)
  }, [])

  // Inscreve para mudanças na energia do usuário
  useEffect(() => {
    if (!uid) return

    const unsub = onSnapshot(userRef(uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        const energiaAtual = data.energia ?? ENERGIA_MAXIMA
        const ultimaRecuperacaoData = data.ultimaRecuperacao
        
        // Calcula energia recuperada offline
        const energiaRecuperada = calcularEnergiaRecuperada(ultimaRecuperacaoData)
        const energiaFinal = Math.min(energiaAtual + energiaRecuperada, ENERGIA_MAXIMA)
        
        setEnergia(energiaFinal)
        setUltimaRecuperacao(ultimaRecuperacaoData)
        setCarregando(false)
        
        // Se recuperou energia, atualiza no Firestore
        if (energiaRecuperada > 0) {
          updateDoc(userRef(uid), {
            energia: energiaFinal,
            ultimaRecuperacao: serverTimestamp()
          }).catch(console.error)
        }
      }
    })

    return () => unsub()
  }, [uid, calcularEnergiaRecuperada])

  // Recuperação automática de energia
  useEffect(() => {
    if (!uid || energia >= ENERGIA_MAXIMA) return

    const interval = setInterval(async () => {
      try {
        const novaEnergia = Math.min(energia + RECUPERACAO_POR_MINUTO, ENERGIA_MAXIMA)
        
        await updateDoc(userRef(uid), {
          energia: novaEnergia,
          ultimaRecuperacao: serverTimestamp()
        })
      } catch (error) {
        console.error('Erro ao recuperar energia:', error)
      }
    }, INTERVALO_RECUPERACAO)

    return () => clearInterval(interval)
  }, [uid, energia])

  // Função para consumir energia
  const consumirEnergia = useCallback(async () => {
    if (!uid || energia < CUSTO_PATRULHA) {
      return false
    }

    try {
      const novaEnergia = energia - CUSTO_PATRULHA
      
      await updateDoc(userRef(uid), {
        energia: novaEnergia,
        ultimaRecuperacao: serverTimestamp()
      })
      
      setEnergia(novaEnergia)
      return true
    } catch (error) {
      console.error('Erro ao consumir energia:', error)
      return false
    }
  }, [uid, energia])

  // Verifica se tem energia suficiente
  const temEnergiaSuficiente = energia >= CUSTO_PATRULHA

  // Calcula tempo até próxima recuperação
  const tempoProximaRecuperacao = energia < ENERGIA_MAXIMA ? INTERVALO_RECUPERACAO : null

  return {
    energia,
    energiaMaxima: ENERGIA_MAXIMA,
    custoPatrulha: CUSTO_PATRULHA,
    temEnergiaSuficiente,
    consumirEnergia,
    carregando,
    tempoProximaRecuperacao,
    porcentagem: (energia / ENERGIA_MAXIMA) * 100
  }
}
