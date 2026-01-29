export const PATENTES = [
  { nome: 'Soldado 2ª Classe', xp: 0 },
  { nome: 'Soldado 1ª Classe', xp: 1000 },
  { nome: 'Cabo', xp: 3500 },
  { nome: '3º Sargento', xp: 8000 },
]

export function getPatenteAtualByXp(xp) {
  const safeXp = Number.isFinite(xp) ? xp : 0

  let atual = PATENTES[0]
  for (const p of PATENTES) {
    if (safeXp >= p.xp) atual = p
  }
  return atual
}

export function getProximaPatenteByXp(xp) {
  const atual = getPatenteAtualByXp(xp)
  const idx = PATENTES.findIndex((p) => p.nome === atual.nome)
  if (idx === -1) return null
  return PATENTES[idx + 1] ?? null
}

export function getXpProgress(xp) {
  const safeXp = Number.isFinite(xp) ? xp : 0
  const atual = getPatenteAtualByXp(safeXp)
  const prox = getProximaPatenteByXp(safeXp)

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
