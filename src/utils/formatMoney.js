export function formatMoneyBRL(value) {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
