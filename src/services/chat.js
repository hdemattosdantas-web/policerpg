import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const MENSAGENS_CENTRAL = [
  'Central: Unidade disponível na região Centro.',
  'Central: Relato de trânsito intenso na Av. Principal.',
  'Central: Veículo suspeito avistado próximo ao posto.',
  'Central: Condições climáticas adversas na zona sul.',
  'Central: Manutenção de semáforos na via expressa.',
  'Central: Operação padrão em andamento.',
  'Central: Mantenham vigilância na área comercial.',
  'Central: Relatório de ocorrências atualizado.',
]

export function chatMesaRef(mesaId) {
  return collection(db, 'mesas', mesaId, 'chat')
}

export async function enviarMensagem(mesaId, { uid, username, texto, tipo = 'usuario' }) {
  const data = {
    uid,
    username: username || 'Anônimo',
    texto,
    tipo, // 'usuario', 'sistema', 'central'
    timestamp: serverTimestamp(),
  }
  
  return await addDoc(chatMesaRef(mesaId), data)
}

export async function enviarMensagemCentral(mesaId, texto) {
  return await enviarMensagem(mesaId, {
    uid: 'central',
    username: 'Central',
    texto,
    tipo: 'central',
  })
}

export function subscribeChatMesa(mesaId, onChange, onError) {
  const q = query(
    chatMesaRef(mesaId),
    orderBy('timestamp', 'desc'),
    limit(50)
  )
  
  return onSnapshot(
    q,
    (snap) => {
      const mensagens = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .reverse() // Mais antigas primeiro
      onChange(mensagens)
    },
    onError
  )
}

export function gerarMensagemAutomaticaCentral() {
  const randomIndex = Math.floor(Math.random() * MENSAGENS_CENTRAL.length)
  return MENSAGENS_CENTRAL[randomIndex]
}

export async function iniciarChatSolo(mesaId) {
  // Envia uma mensagem de boas-vindas da Central
  await enviarMensagemCentral(mesaId, 'Central: Sistema de rádio ativado. Aguardando instruções.')
  
  // Agenda mensagens automáticas periódicas
  setTimeout(async () => {
    await enviarMensagemCentral(mesaId, gerarMensagemAutomaticaCentral())
  }, 15000) // 15 segundos depois
  
  setTimeout(async () => {
    await enviarMensagemCentral(mesaId, gerarMensagemAutomaticaCentral())
  }, 45000) // 45 segundos depois
}

// Função para tocar som de "bip" (será implementada no componente)
export function tocarSomRadio() {
  try {
    const audio = new Audio('/sounds/radio-beep.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {
      // Silenciosamente ignora erros de autoplay
    })
  } catch (error) {
    // Silenciosamente ignora erros
  }
}


// Alias para compatibilidade com imports existentes
export { enviarMensagem as enviarMensagemUsuario }
export { subscribeChatMesa as subscribeChat }
