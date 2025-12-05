export enum Genero {
  Acao = "Ação",
  Aventura = "Aventura",
  Comedia = "Comédia",
  Drama = "Drama",
  Terror = "Terror",
  Romance = "Romance",
  Fantasia = "Fantasia",
}

export interface Filme {
  id?: number
  titulo: string
  sinopse: string
  classificacao: string
  duracao: number
  genero: Genero
  dataIniciaExibicao: string
  dataFinalExibicao: string
}

export interface Sala {
  id?: number
  numero: number
  capacidade: number
  poutronas: number[][]
}

export interface Sessao {
  id?: number
  horarioExibicao: string
  filmeId: number
  salaId: number
  filme?: Filme
  sala?: Sala
}

export interface Ingresso {
  id?: number
  sessaoId: number
  tipo: 'INTEIRA' | 'MEIA'
  valor: number
  dataVenda: string
  sessao?: Sessao
}