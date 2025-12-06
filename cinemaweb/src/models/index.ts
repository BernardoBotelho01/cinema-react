export enum Genero {
  Acao = 'Ação',
  Aventura = 'Aventura',
  Comedia = 'Comédia',
  Drama = 'Drama',
  Terror = 'Terror',
  Romance = 'Romance',
  Fantasia = 'Fantasia',
}

export interface Filme {
  id?: number | string
  titulo: string
  sinopse: string
  classificacao: string
  duracao: number
  genero: Genero
  dataIniciaExibicao: string
  dataFinalExibicao: string
}

export interface Sala {
  id?: number | string
  numero: number
  capacidade: number
  poutronas: number[][]
}

export interface Sessao {
  id?: number | string
  horarioExibicao: string
  filmeId: number | string
  salaId: number | string
  filme?: Filme
  sala?: Sala
}

export interface Ingresso {
  id?: number | string
  sessaoId: number | string
  tipo: 'INTEIRA' | 'MEIA'
  valor: number
  dataVenda: string
  sessao?: Sessao
}
