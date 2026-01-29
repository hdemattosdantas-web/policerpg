import { useCallback, useRef, useState } from 'react'

// Cache para áudios pré-carregados
const audioCache = new Map()

// Função para pré-carregar um áudio
function preloadAudio(src) {
  if (audioCache.has(src)) {
    return audioCache.get(src)
  }

  const audio = new Audio(src)
  audio.preload = 'auto'
  audioCache.set(src, audio)
  return audio
}

// Toca um som com tratamento de erros
async function playSound(audio) {
  try {
    // Reseta o áudio se já estiver tocando
    if (!audio.paused) {
      audio.currentTime = 0
    }
    
    // Tenta tocar
    await audio.play()
  } catch (error) {
    // Silenciosamente ignora erros (ex: usuário não interagiu com a página ainda)
    console.log('Erro ao tocar som:', error.message)
  }
}

export function useSoundEffects() {
  // Pré-carrega os áudios
  const somRadio = useRef(preloadAudio('/sounds/radio-beep.mp3'))
  const somSucesso = useRef(preloadAudio('/sounds/success.mp3'))
  const somCompra = useRef(preloadAudio('/sounds/purchase.mp3'))
  const somErro = useRef(preloadAudio('/sounds/error.mp3'))

  // Toca som de rádio
  const tocarRadio = useCallback(() => {
    playSound(somRadio.current)
  }, [])

  // Toca som de sucesso
  const tocarSucesso = useCallback(() => {
    playSound(somSucesso.current)
  }, [])

  // Toca som de compra
  const tocarCompra = useCallback(() => {
    playSound(somCompra.current)
  }, [])

  // Toca som de erro
  const tocarErro = useCallback(() => {
    playSound(somErro.current)
  }, [])

  return {
    tocarRadio,
    tocarSucesso,
    tocarCompra,
    tocarErro
  }
}

// Hook para gerenciar permissão de áudio
export function useAudioPermission() {
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Verifica se já tem permissão
    const checkPermission = () => {
      const audio = new Audio()
      audio.volume = 0
      audio.play().then(() => {
        setHasPermission(true)
        audio.pause()
      }).catch(() => {
        setHasPermission(false)
      })
    }

    checkPermission()

    // Adiciona listener para primeiro clique do usuário
    const enableAudio = () => {
      setHasPermission(true)
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }

    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }
  }, [])

  return hasPermission
}
