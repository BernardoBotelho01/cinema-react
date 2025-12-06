import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z, ZodError } from 'zod'
import { createSessao, fetchFilmes, fetchSalas } from '../../services/api'
import { Filme, Sala } from '../../models'

// Esquema de validação completo para Sessões
const sessaoSchema = z
  .object({
    filmeId: z.string().min(1, { message: 'Selecione um filme' }),
    salaId: z.string().min(1, { message: 'Selecione uma sala' }),
    horarioExibicao: z.string().min(1, { message: 'Data e hora são obrigatórias' }),
  })
  .refine(
    (data) => {
      const dataSessao = new Date(data.horarioExibicao)
      const agora = new Date()
      agora.setMinutes(agora.getMinutes() - 5) // margem de 5 minutos
      return dataSessao >= agora
    },
    {
      message: 'A data da sessão não pode ser retroativa (anterior à data atual)',
      path: ['horarioExibicao'],
    },
  )

type FormData = {
  filmeId: string
  salaId: string
  horarioExibicao: string
}

const CadastrarSessao = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const [filmes, setFilmes] = useState<Filme[]>([])
  const [salas, setSalas] = useState<Sala[]>([])

  const [formData, setFormData] = useState<FormData>({
    filmeId: '',
    salaId: '',
    horarioExibicao: '',
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [filmesData, salasData] = await Promise.all([fetchFilmes(), fetchSalas()])
      setFilmes(filmesData)
      setSalas(salasData)
    } catch (err) {
      alert('Erro ao carregar dados. Verifique se o json-server está rodando.')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validatedData = sessaoSchema.parse(formData)

      await createSessao({
        filmeId: validatedData.filmeId, // string ou number, tanto faz
        salaId: validatedData.salaId,
        horarioExibicao: validatedData.horarioExibicao,
      })

      alert('Sessão agendada com sucesso!')
      navigate('/sessoes')
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path && issue.path[0]) {
            const path = issue.path[0] as string
            newErrors[path] = issue.message
          }
        })
        setErrors(newErrors)
        console.error('Erros de validação:', error.issues)
      } else {
        console.error('Erro ao agendar sessão:', error)
        alert('Erro ao agendar sessão. Verifique o console para mais detalhes.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2 text-muted">Carregando filmes e salas...</p>
      </div>
    )
  }

  const now = new Date()
  const minDateTime = new Date(now.getTime() - 5 * 60000).toISOString().slice(0, 16)

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-calendar-event me-2"></i>
            Agendar Nova Sessão
          </h3>
          <small className="opacity-75">Todos os campos marcados com * são obrigatórios</small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* FILME */}
            <div className="mb-3">
              <label className="form-label">Filme *</label>
              <select
                name="filmeId"
                className={`form-control ${errors.filmeId ? 'is-invalid' : ''}`}
                value={formData.filmeId}
                onChange={handleChange}
                disabled={filmes.length === 0}
              >
                <option value="">
                  {filmes.length === 0 ? 'Nenhum filme cadastrado' : 'Selecione um filme'}
                </option>
                {filmes.map((filme) => (
                  <option key={filme.id} value={String(filme.id)}>
                    {filme.titulo} - {filme.classificacao} - {filme.duracao}min
                  </option>
                ))}
              </select>
              {errors.filmeId && <div className="invalid-feedback">{errors.filmeId}</div>}
              {filmes.length === 0 && (
                <div className="alert alert-warning mt-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Nenhum filme cadastrado.
                  <a href="/filmes/cadastrar" className="ms-1 fw-bold">
                    Cadastre um filme primeiro
                  </a>
                </div>
              )}
            </div>

            {/* SALA */}
            <div className="mb-3">
              <label className="form-label">Sala *</label>
              <select
                name="salaId"
                className={`form-control ${errors.salaId ? 'is-invalid' : ''}`}
                value={formData.salaId}
                onChange={handleChange}
                disabled={salas.length === 0}
              >
                <option value="">
                  {salas.length === 0 ? 'Nenhuma sala cadastrada' : 'Selecione uma sala'}
                </option>
                {salas.map((sala) => (
                  <option key={sala.id} value={String(sala.id)}>
                    Sala {sala.numero} - {sala.capacidade} lugares
                  </option>
                ))}
              </select>
              {errors.salaId && <div className="invalid-feedback">{errors.salaId}</div>}
              {salas.length === 0 && (
                <div className="alert alert-warning mt-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Nenhuma sala cadastrada.
                  <a href="/salas/cadastrar" className="ms-1 fw-bold">
                    Cadastre uma sala primeiro
                  </a>
                </div>
              )}
            </div>

            {/* DATA/HORA */}
            <div className="mb-4">
              <label className="form-label">Data e Hora da Sessão *</label>
              <input
                type="datetime-local"
                name="horarioExibicao"
                className={`form-control ${errors.horarioExibicao ? 'is-invalid' : ''}`}
                value={formData.horarioExibicao}
                onChange={handleChange}
                min={minDateTime}
                step="300"
              />
              {errors.horarioExibicao && (
                <div className="invalid-feedback">{errors.horarioExibicao}</div>
              )}
              <small className="text-muted">
                Não pode ser retroativa. Use o formato DD/MM/AAAA HH:MM
              </small>
            </div>

            {/* BOTÕES */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/sessoes')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || filmes.length === 0 || salas.length === 0}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Agendando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-plus me-2"></i>
                    Agendar Sessão
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastrarSessao
