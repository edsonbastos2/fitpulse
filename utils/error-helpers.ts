/**
 * Detect if an error is a network/connection error
 */
export const isNetworkError = (err: unknown): boolean => {
  const message = (err as Error).message?.toLowerCase() || ''
  const networkIndicators = [
    'network',
    'fetch',
    'connection',
    'offline',
    'refused',
    'reset',
    'abort',
    'failed to fetch',
    'networkerror',
    'err_network',
    'err_internet_disconnected',
  ]
  return networkIndicators.some((indicator) => message.includes(indicator))
}

/**
 * Get a user-friendly error message from a fetch error
 */
export const getFetchErrorMessage = (err: unknown): { title: string; message: string } => {
  if (isNetworkError(err)) {
    return {
      title: 'Erro de conexão',
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    }
  }
  const message = (err as Error).message || 'Ocorreu um erro inesperado.'
  return {
    title: 'Erro ao carregar dados',
    message,
  }
}
