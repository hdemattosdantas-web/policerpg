import { useState } from 'react'

export function RPGNarrativa() {
  const [personagem, setPersonagem] = useState(null)
  
  return (
    <div className='rpg-narrativa'>
      <h2> RPG de Mesa Narrativo</h2>
      <p>Sistema de RPG com IA mestre em desenvolvimento...</p>
    </div>
  )
}
