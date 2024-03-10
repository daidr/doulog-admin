export const isDev = process.env.NODE_ENV === 'development'

export const isProd = process.env.NODE_ENV === 'production'

export const isTest = process.env.NODE_ENV === 'test'

export const API_BASE = import.meta.env.VITE_API_BASE
