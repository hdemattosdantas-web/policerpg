import { useMemo } from 'react'
import { getXpProgress } from '../constants/hierarquia'

export function usePatenteProgress(xp) {
  return useMemo(() => getXpProgress(xp), [xp])
}
