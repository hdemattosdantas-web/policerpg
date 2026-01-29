import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { verificarPromocao } from '../constants/hierarquia'

function usersRef() {
  return collection(db, 'users')
}

export async function getRankingTop10() {
  const q = query(
    usersRef(),
    where('nome_policial', '!=', null), // Apenas usuários com nome definido
    orderBy('xp', 'desc'),
    limit(10)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc, index) => {
    const data = doc.data()
    const patente = verificarPromocao(data.xp || 0)
    
    return {
      posicao: index + 1,
      uid: doc.id,
      nome_policial: data.nome_policial,
      patente: patente.nome,
      xp: data.xp || 0,
      nivel: patente.nivel,
      isOficial: patente.nivel >= 5, // Aspirante pra cima
    }
  })
}

export async function getUserRankingPosition(uid) {
  // Busca todos os usuários com XP para calcular posição
  const q = query(
    usersRef(),
    where('nome_policial', '!=', null),
    orderBy('xp', 'desc')
  )
  
  const snapshot = await getDocs(q)
  const users = snapshot.docs.map(doc => ({
    uid: doc.id,
    xp: doc.data().xp || 0
  }))
  
  // Encontra a posição do usuário
  const position = users.findIndex(user => user.uid === uid) + 1
  
  return position > 0 ? position : null
}

export async function getUserWithRanking(uid) {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return null
  }
  
  const data = userSnap.data()
  const patente = verificarPromocao(data.xp || 0)
  
  return {
    uid: userSnap.id,
    nome_policial: data.nome_policial,
    patente: patente.nome,
    xp: data.xp || 0,
    nivel: patente.nivel,
    isOficial: patente.nivel >= 5,
    saldo: data.saldo || 0,
    status: data.status || 'Desconhecido',
    data_alistamento: data.data_alistamento,
  }
}

// Função para buscar ranking com cache (otimização de custo)
let rankingCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutos
}

export async function getRankingTop10Cached() {
  const agora = Date.now()
  
  // Se o cache ainda é válido, retorna os dados em cache
  if (rankingCache.data && rankingCache.timestamp && 
      (agora - rankingCache.timestamp) < rankingCache.ttl) {
    return rankingCache.data
  }
  
  // Se não, busca novos dados e atualiza o cache
  const dados = await getRankingTop10()
  rankingCache = {
    data: dados,
    timestamp: agora,
    ttl: 5 * 60 * 1000
  }
  
  return dados
}

export function limparCacheRanking() {
  rankingCache = {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000
  }
}
