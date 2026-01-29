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
  limit,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'

const mesasCollection = collection(db, 'mesas')

export function mesaRef(id) {
  return doc(db, 'mesas', id)
}

export async function criarMesa({ donoUid, nome, tipo = 'solo', discordChannelLink = null }) {
  const data = {
    donoUid,
    nome,
    tipo, // 'solo' ou 'multiplayer'
    membros: [donoUid],
    codigoConvite: null,
    discordChannelLink, // Link opcional para canal de voz do Discord
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(mesasCollection, data)
  return docRef.id
}

export async function gerarCodigoConvite(mesaId) {
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  await updateDoc(mesaRef(mesaId), {
    codigoConvite: codigo,
    updatedAt: serverTimestamp(),
  })
  
  return codigo
}

export async function entrarNaMesaPorCodigo(codigo, uid) {
  const q = query(mesasCollection, where('codigoConvite', '==', codigo))
  const snap = await getDocs(q)
  
  if (snap.empty) {
    throw new Error('Código de convite inválido')
  }
  
  const mesaDoc = snap.docs[0]
  const mesa = { id: mesaDoc.id, ...mesaDoc.data() }
  
  if (mesa.tipo !== 'multiplayer') {
    throw new Error('Esta mesa não aceita novos membros')
  }
  
  if (mesa.membros.includes(uid)) {
    return mesa // Já é membro
  }
  
  await updateDoc(mesaRef(mesa.id), {
    membros: [...mesa.membros, uid],
    updatedAt: serverTimestamp(),
  })
  
  return { ...mesa, membros: [...mesa.membros, uid] }
}

export async function sairDaMesa(mesaId, uid) {
  const mesaSnap = await getDoc(mesaRef(mesaId))
  if (!mesaSnap.exists()) {
    throw new Error('Mesa não encontrada')
  }
  
  const mesa = mesaSnap.data()
  
  if (mesa.donoUid === uid) {
    // Dono saindo = deletar mesa
    await deleteDoc(mesaRef(mesaId))
    return null
  }
  
  const novosMembros = mesa.membros.filter(m => m !== uid)
  await updateDoc(mesaRef(mesaId), {
    membros: novosMembros,
    updatedAt: serverTimestamp(),
  })
  
  return { ...mesa, membros: novosMembros }
}

export function subscribeMesa(mesaId, onChange, onError) {
  return onSnapshot(
    mesaRef(mesaId),
    (snap) => {
      onChange(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    },
    onError
  )
}

export function subscribeMesaDoUsuario(uid, onChange, onError) {
  const q = query(
    mesasCollection,
    where('membros', 'array-contains', uid),
    orderBy('updatedAt', 'desc'),
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
