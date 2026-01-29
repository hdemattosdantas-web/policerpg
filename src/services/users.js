import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { verificarPromocao } from '../constants/hierarquia'

function userRef(uid) {
  return doc(db, 'users', uid)
}

export async function ensureUserDoc({ uid, nome_policial }) {
  const ref = userRef(uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const data = snap.data()
    const patch = {}

    if (typeof data.username === 'undefined') patch.username = null
    if (!data.status) {
      patch.status = 'Em Serviço'
    }
    if (Object.keys(patch).length) {
      await updateDoc(ref, patch)
      return { ...data, ...patch }
    }

    return data
  }

  const xp = 0
  const patente_atual = verificarPromocao(xp).nome

  const data = {
    uid,
    nome_policial: nome_policial ?? 'Policial',
    username: null,
    xp,
    patente_atual,
    saldo: 500, // Bônus de adesão
    status: 'Em Serviço',
    inventario: [], // Array vazio para novos usuários
    energia: 100, // Energia máxima inicial
    ultimaRecuperacao: serverTimestamp(),
    data_alistamento: serverTimestamp(),
    data_ingresso: serverTimestamp(),
  }

  await setDoc(ref, data)
  return data
}

export function subscribeUserDoc(uid, onChange, onError) {
  const ref = userRef(uid)
  return onSnapshot(
    ref,
    (snap) => {
      onChange(snap.exists() ? snap.data() : null)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}

export async function updateNomePolicial(uid, nome_policial) {
  const ref = userRef(uid)
  await updateDoc(ref, { nome_policial })
}

export async function updateStatus(uid, status) {
  const ref = userRef(uid)
  await updateDoc(ref, { status })
}

function normalizeUsername(input) {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}

function validateUsername(normalized) {
  if (normalized.length < 3) return 'Username deve ter no mínimo 3 caracteres.'
  if (normalized.length > 20) return 'Username deve ter no máximo 20 caracteres.'
  if (!/^[a-z0-9_]+$/.test(normalized)) return 'Username deve conter apenas letras, números e _.'
  return null
}

export async function claimUsername(uid, rawUsername) {
  const username = normalizeUsername(rawUsername)
  const validationError = validateUsername(username)
  if (validationError) throw new Error(validationError)

  const userDocRef = userRef(uid)
  const usernameRef = doc(db, 'usernames', username)

  await runTransaction(db, async (tx) => {
    const unameSnap = await tx.get(usernameRef)
    if (unameSnap.exists()) {
      throw new Error('Este username já está em uso.')
    }

    const uSnap = await tx.get(userDocRef)
    if (!uSnap.exists()) {
      throw new Error('Documento do usuário não existe no Firestore.')
    }

    tx.set(usernameRef, {
      uid,
      createdAt: serverTimestamp(),
    })

    tx.update(userDocRef, {
      username,
    })
  })

  return username
}

export async function applyPatrolReward(uid, { xpDelta, saldoDelta }) {
  const ref = userRef(uid)

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) {
      throw new Error('Documento do usuário não existe no Firestore.')
    }

    const data = snap.data()
    const xpAtual = Number.isFinite(data.xp) ? data.xp : 0
    const saldoAtual = Number.isFinite(data.saldo) ? data.saldo : 0

    const novoXp = xpAtual + xpDelta
    const novoSaldo = saldoAtual + saldoDelta
    const patente_atual = verificarPromocao(novoXp).nome

    tx.update(ref, {
      xp: novoXp,
      saldo: novoSaldo,
      patente_atual,
    })
  })
}
