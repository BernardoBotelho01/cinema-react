import axios from 'axios'
import { Filme, Sala, Sessao, Ingresso, Lanche } from '../models'

const api = axios.create({
  baseURL: 'http://localhost:3000/',
})

// -------- Filmes --------
export const fetchFilmes = async (): Promise<Filme[]> => {
  const response = await api.get('filmes')
  return response.data
}

export const createFilme = async (filme: Omit<Filme, 'id'>): Promise<Filme> => {
  const response = await api.post('filmes', filme)
  return response.data
}

export const deleteFilme = async (id: number | string): Promise<void> => {
  await api.delete(`filmes/${id}`)
}

// -------- Salas --------
export const fetchSalas = async (): Promise<Sala[]> => {
  const response = await api.get('salas')
  return response.data
}

export const createSala = async (sala: Omit<Sala, 'id'>): Promise<Sala> => {
  const response = await api.post('salas', sala)
  return response.data
}

export const deleteSala = async (id: number | string): Promise<void> => {
  await api.delete(`salas/${id}`)
}

// -------- Sessões --------
export const fetchSessoes = async (): Promise<Sessao[]> => {
  // buscamos seco, e o join é feito no front
  const response = await api.get('sessoes')
  return response.data
}

export const createSessao = async (
  sessao: Omit<Sessao, 'id'>,
): Promise<Sessao> => {
  const response = await api.post('sessoes', sessao)
  return response.data
}

export const deleteSessao = async (id: number | string): Promise<void> => {
  await api.delete(`sessoes/${id}`)
}

// -------- Lanches (NOVO) --------
export const fetchLanches = async (): Promise<Lanche[]> => {
  const response = await api.get('lanches')
  return response.data
}

export const createLanche = async (
  lanche: Omit<Lanche, 'id'>,
): Promise<Lanche> => {
  const response = await api.post('lanches', lanche)
  return response.data
}

export const deleteLanche = async (id: number | string): Promise<void> => {
  await api.delete(`lanches/${id}`)
}

// -------- Ingressos --------
export const fetchIngressos = async (): Promise<Ingresso[]> => {
  const response = await api.get('ingressos?_expand=sessao')
  return response.data
}

export const createIngresso = async (
  ingresso: Omit<Ingresso, 'id'>,
): Promise<Ingresso> => {
  const response = await api.post('ingressos', ingresso)
  return response.data
}

// Atualizar sala (se for usar depois)
export const updateSala = async (
  id: number | string,
  sala: Sala,
): Promise<Sala> => {
  const response = await api.put(`salas/${id}`, sala)
  return response.data
}

export default api
