import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'
import { sortearOcorrencia, calcularResultadoSucesso } from '../constants/ocorrencias'
import { calcularBonusTotais } from '../constants/itens'

function ocorrenciasRef(uid) {
  return collection(db, 'users', uid, 'ocorrencias')
}

function historicoRef(uid) {
  return collection(db, 'users', uid, 'historico')
}

export async function iniciarPatrulha(uid, patente, inventario = []) {
  // Calcula bônus dos itens
  const bonus = calcularBonusTotais(inventario)
  
  // Sorteia uma ocorrência
  const ocorrencia = sortearOcorrencia()
  
  // Calcula se terá sucesso com bônus dos itens
  const sucesso = calcularResultadoSucesso(ocorrencia, patente, bonus.chance_sucesso)
  const resultado = sucesso ? ocorrencia.sucesso : ocorrencia.falha
  
  // Aplica bônus de XP se for prisão e sucesso
  let resultadoFinal = { ...resultado }
  if (sucesso && bonus.bonus_xp > 0 && ocorrencia.titulo.toLowerCase().includes('prisão')) {
    resultadoFinal.xp = Math.floor(resultadoFinal.xp * (1 + bonus.bonus_xp))
  }
  
  // Aplica redução de penalidade se falhar
  if (!sucesso && bonus.reducao_penalidade > 0) {
    resultadoFinal.xp = Math.floor(resultadoFinal.xp * (1 - bonus.reducao_penalidade))
    resultadoFinal.dinheiro = Math.floor(resultadoFinal.dinheiro * (1 - bonus.reducao_penalidade))
  }
  
  // Cria o registro da ocorrência
  const ocorrenciaData = {
    ...ocorrencia,
    sucesso,
    resultado: resultadoFinal,
    patenteNaEpoca: patente,
    bonusAplicados: bonus,
    timestamp: serverTimestamp(),
  }
  
  await addDoc(ocorrenciasRef(uid), ocorrenciaData)
  
  return {
    ...ocorrenciaData,
    tempoReduzido: bonus.reducao_tempo // Retorna o tempo reduzido para o componente
  }
}

export async function resolverOcorrencia(uid, ocorrenciaId) {
  return await runTransaction(db, async (tx) => {
    // Busca a ocorrência
    const ocorrenciaRef = doc(ocorrenciasRef(uid), ocorrenciaId)
    const ocorrenciaSnap = await tx.get(ocorrenciaRef)
    
    if (!ocorrenciaSnap.exists()) {
      throw new Error('Ocorrência não encontrada')
    }
    
    const ocorrencia = ocorrenciaSnap.data()
    
    // Busca o usuário
    const userRef = doc(db, 'users', uid)
    const userSnap = await tx.get(userRef)
    
    if (!userSnap.exists()) {
      throw new Error('Usuário não encontrado')
    }
    
    const userData = userSnap.data()
    
    // Atualiza XP e saldo
    const novoXp = (userData.xp || 0) + ocorrencia.resultado.xp
    const novoSaldo = (userData.saldo || 0) + ocorrencia.resultado.dinheiro
    
    // Atualiza patente se necessário
    const { verificarPromocao } = await import('../constants/hierarquia')
    const novaPatente = verificarPromocao(novoXp).nome
    
    tx.update(userRef, {
      xp: novoXp,
      saldo: novoSaldo,
      patente_atual: novaPatente,
    })
    
    // Marca ocorrência como resolvida
    tx.update(ocorrenciaRef, {
      resolvida: true,
      dataResolucao: serverTimestamp(),
    })
    
    // Adiciona ao histórico
    await addDoc(historicoRef(uid), {
      titulo: ocorrencia.titulo,
      sucesso: ocorrencia.sucesso,
      resultado: ocorrencia.resultado,
      timestamp: serverTimestamp(),
    })
    
    return {
      novoXp,
      novoSaldo,
      novaPatente,
      resultado: ocorrencia.resultado,
    }
  })
}

export function subscribeOcorrenciasAtivas(uid, onChange, onError) {
  const q = query(
    ocorrenciasRef(uid),
    where('resolvida', '==', false),
    orderBy('timestamp', 'desc'),
    limit(1)
  )
  
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      onChange(null)
      return
    }
    
    const doc = snap.docs[0]
    onChange({ id: doc.id, ...doc.data() })
  }, onError)
}

export function subscribeHistorico(uid, onChange, onError) {
  const q = query(
    historicoRef(uid),
    orderBy('timestamp', 'desc'),
    limit(5)
  )
  
  return onSnapshot(q, (snap) => {
    const historico = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    onChange(historico)
  }, onError)
}

export async function getHistorico(uid) {
  const q = query(
    historicoRef(uid),
    orderBy('timestamp', 'desc'),
    limit(5)
  )
  
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
