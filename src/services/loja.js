import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore'
import { db } from './firebase'
import { getItemById } from '../constants/itens'

function userRef(uid) {
  return doc(db, 'users', uid)
}

export async function comprarItem(uid, itemId) {
  const item = getItemById(itemId)
  if (!item) {
    throw new Error('Item não encontrado')
  }

  return await runTransaction(db, async (tx) => {
    // Busca o usuário
    const userRef = userRef(uid)
    const userSnap = await tx.get(userRef)
    
    if (!userSnap.exists()) {
      throw new Error('Usuário não encontrado')
    }
    
    const userData = userSnap.data()
    const saldoAtual = userData.saldo || 0
    const inventarioAtual = userData.inventario || []
    
    // Verifica se tem saldo suficiente
    if (saldoAtual < item.preco) {
      throw new Error('Saldo insuficiente')
    }
    
    // Verifica se já possui o item
    if (inventarioAtual.includes(itemId)) {
      throw new Error('Você já possui este item')
    }
    
    // Processa a compra
    const novoSaldo = saldoAtual - item.preco
    const novoInventario = [...inventarioAtual, itemId]
    
    // Atualiza o documento
    tx.update(userRef, {
      saldo: novoSaldo,
      inventario: novoInventario,
    })
    
    return {
      item,
      novoSaldo,
      novoInventario,
    }
  })
}

export async function verificarPossuiItem(uid, itemId) {
  const userRef = userRef(uid)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return false
  }
  
  const userData = userSnap.data()
  const inventario = userData.inventario || []
  
  return inventario.includes(itemId)
}

export async function getInventario(uid) {
  const userRef = userRef(uid)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return []
  }
  
  const userData = userSnap.data()
  return userData.inventario || []
}

export async function getSaldo(uid) {
  const userRef = userRef(uid)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    return 0
  }
  
  const userData = userSnap.data()
  return userData.saldo || 0
}
