export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const getRiskColor = (score: number): string => {
  if (score >= 70) return 'text-red-600 dark:text-red-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

export const getFlagLabel = (flagKey: string): string => {
  const labels: Record<string, string> = {
    unique_bidder: 'Único proponente recurrente',
    overcost: 'Sobrecosto detectado',
    unusual_deadline: 'Plazo inusual',
    tailor_made_clause: 'Cláusula a medida',
  }
  return labels[flagKey] || flagKey
}