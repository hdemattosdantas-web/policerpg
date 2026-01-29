export const HIERARQUIA = [
  // Praças
  { nome: 'Soldado', xp: 0, categoria: 'praca' },
  { nome: 'Cabo', xp: 2000, categoria: 'praca' },
  { nome: 'Sargento', xp: 5000, categoria: 'praca' },
  { nome: 'Subtenente', xp: 12000, categoria: 'praca' },
  // Oficiais (Requerem 'Curso de Formação')
  { nome: 'Aspirante a Oficial', xp: 25000, categoria: 'oficial' },
  { nome: 'Tenente', xp: 40000, categoria: 'oficial' },
  { nome: 'Capitão', xp: 70000, categoria: 'oficial' },
  { nome: 'Major', xp: 120000, categoria: 'oficial' },
  { nome: 'Tenente-Coronel', xp: 200000, categoria: 'oficial' },
  { nome: 'Coronel', xp: 350000, categoria: 'oficial' }, // Patente Máxima
]

export function verificarPromocao(xpAtual) {
  const safeXp = Number.isFinite(xpAtual) ? xpAtual : 0

  let patenteAtual = HIERARQUIA[0]
  for (const patente of HIERARQUIA) {
    if (safeXp >= patente.xp) {
      patenteAtual = patente
    }
  }

  return patenteAtual
}

export function getProximaPatente(xpAtual) {
  const atual = verificarPromocao(xpAtual)
  const idx = HIERARQUIA.findIndex((p) => p.nome === atual.nome)
  if (idx === -1) return null
  return HIERARQUIA[idx + 1] ?? null
}

export function getXpProgress(xpAtual) {
  const safeXp = Number.isFinite(xpAtual) ? xpAtual : 0
  const atual = verificarPromocao(safeXp)
  const prox = getProximaPatente(safeXp)

  if (!prox) {
    return {
      patenteAtual: atual,
      proximaPatente: null,
      xpAtual: safeXp,
      xpParaProxima: null,
      pct: 100,
    }
  }

  const base = atual.xp
  const topo = prox.xp
  const faixa = Math.max(1, topo - base)
  const dentro = Math.min(faixa, Math.max(0, safeXp - base))
  const pct = Math.round((dentro / faixa) * 100)

  return {
    patenteAtual: atual,
    proximaPatente: prox,
    xpAtual: safeXp,
    xpParaProxima: topo,
    pct,
  }
}

export function isOficial(patente) {
  return patente?.categoria === 'oficial'
}

export function isPraca(patente) {
  return patente?.categoria === 'praca'
}

export function getCorPatente(patente) {
  if (isOficial(patente)) return '#FFD700' // Ouro
  if (isPraca(patente)) return '#C0C0C0' // Prata
  return '#FFFFFF' // Branco (fallback)
}
