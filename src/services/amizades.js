import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'

function amizadesRef(uid) {
  return collection(db, 'users', uid, 'amizades')
}

function solicitacoesRef(uid) {
  return collection(db, 'users', uid, 'solicitacoes')
}

export async function buscarUsuarioPorUsername(username) {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('username', '==', username))
  const snap = await getDocs(q)
  
  if (snap.empty) {
    throw new Error('Usuário não encontrado')
  }
  
  const userDoc = snap.docs[0]
  return { id: userDoc.id, ...userDoc.data() }
}

export async function enviarSolicitacaoAmizade(deUid, paraUid, paraUsername) {
  if (deUid === paraUid) {
    throw new Error('Você não pode enviar solicitação para si mesmo')
  }
  
  // Verificar se já são amigos
  const amizadeSnap = await getDoc(doc(amizadesRef(deUid), paraUid))
  if (amizadeSnap.exists()) {
    throw new Error('Vocês já são amigos')
  }
  
  // Verificar se já existe solicitação
  const solicitacaoSnap = await getDoc(doc(solicitacoesRef(paraUid), deUid))
  if (solicitacaoSnap.exists()) {
    throw new Error('Solicitação já enviada')
  }
  
  const data = {
    deUid,
    deUsername: null, // Será preenchido depois
    paraUid,
    paraUsername,
    status: 'pendente',
    createdAt: serverTimestamp(),
  }
  
  await addDoc(solicitacoesRef(paraUid), data)
}

export async function aceitarSolicitacaoAmizade(uid, solicitacaoId) {
  await runTransaction(db, async (tx) => {
    const solicitacaoRef = doc(solicitacoesRef(uid), solicitacaoId)
    const solicitacaoSnap = await tx.get(solicitacaoRef)
    
    if (!solicitacaoSnap.exists()) {
      throw new Error('Solicitação não encontrada')
    }
    
    const solicitacao = solicitacaoSnap.data()
    const { deUid, paraUid } = solicitacao
    
    // Adicionar amizade para ambos
    tx.set(doc(amizadesRef(deUid), paraUid), {
      uid: paraUid,
      username: solicitacao.paraUsername,
      createdAt: serverTimestamp(),
    })
    
    tx.set(doc(amizadesRef(paraUid), deUid), {
      uid: deUid,
      username: solicitacao.deUsername,
      createdAt: serverTimestamp(),
    })
    
    // Remover solicitação
    tx.delete(solicitacaoRef)
  })
}

export async function rejeitarSolicitacaoAmizade(uid, solicitacaoId) {
  await deleteDoc(doc(solicitacoesRef(uid), solicitacaoId))
}

export async function removerAmizade(uid, amigoUid) {
  await deleteDoc(doc(amizadesRef(uid), amigoUid))
}

export function subscribeSolicitacoes(uid, onChange, onError) {
  const q = query(
    solicitacoesRef(uid),
    where('status', '==', 'pendente'),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snap) => {
    const solicitacoes = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    onChange(solicitacoes)
  }, onError)
}

export function subscribeAmigos(uid, onChange, onError) {
  const q = query(
    amizadesRef(uid),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snap) => {
    const amigos = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    onChange(amigos)
  }, onError)
}

export async function buscarAmigosOnline(uid) {
  // Esta função pode ser expandida para verificar status online
  // Por enquanto, retorna todos os amigos
  const amigosRef = collection(db, 'users', uid, 'amizades')
  const snap = await getDocs(amigosRef)
  
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
