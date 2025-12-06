import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z, ZodError } from 'zod'
import { createFilme } from '../../services/api'
import { Genero } from '../../models'

// Esquema de validação completo para Filmes
const filmeSchema = z
  .object({
    titulo: z
      .string()
      .min(1, { message: 'Título é obrigatório' })
      .max(100, { message: 'Título deve ter no máximo 100 caracteres' }),

    sinopse: z
      .string()
      .min(10, { message: 'A sinopse deve ter no mínimo 10 caracteres' })
      .max(1000, { message: 'Sinopse deve ter no máximo 1000 caracteres' }),

    classificacao: z
      .string()
      .min(1, { message: 'Classificação é obrigatória' })
      .max(20, { message: 'Classificação deve ter no máximo 20 caracteres' }),

    duracao: z
      .number()
      .positive({ message: 'Duração deve ser um número positivo (maior que 0)' })
      .int({ message: 'Duração deve ser um número inteiro' })
      .max(300, { message: 'Duração não pode exceder 300 minutos' }),

    genero: z
      .string()
      .refine((val) => Object.values(Genero).includes(val as Genero), {
        message: 'Selecione um gênero válido',
      }),

    dataIniciaExibicao: z.string().min(1, { message: 'Data de início é obrigatória' }),

    dataFinalExibicao: z.string().min(1, { message: 'Data final é obrigatória' }),
  })
  .refine(
    (data) => {
      const dataInicio = new Date(data.dataIniciaExibicao)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      return dataInicio >= hoje
    },
    {
      message: 'Data de início não pode ser retroativa',
      path: ['dataIniciaExibicao'],
    },
  )
  .refine(
    (data) => {
      const dataInicio = new Date(data.dataIniciaExibicao)
      const dataFim = new Date(data.dataFinalExibicao)
      return dataFim > dataInicio
    },
    {
      message: 'Data final deve ser posterior à data inicial',
      path: ['dataFinalExibicao'],
    },
  )

type FormData = {
  titulo: string
  sinopse: string
  classificacao: string
  duracao: number
  genero: string
  dataIniciaExibicao: string
  dataFinalExibicao: string
}

const CadastrarFilme = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    sinopse: '',
    classificacao: '',
    duracao: 0,
    genero: '',
    dataIniciaExibicao: '',
    dataFinalExibicao: '',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duracao' ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validatedData = filmeSchema.parse(formData)

      const filmeParaEnviar = {
        ...validatedData,
        genero: validatedData.genero as Genero,
      }

      await createFilme(filmeParaEnviar)
      navigate('/filmes')
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
      } else {
        console.error('Erro ao cadastrar filme:', error)
        alert('Erro ao cadastrar filme. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const minEndDate = formData.dataIniciaExibicao || today

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-camera-reels me-2"></i>
            Cadastrar Novo Filme
          </h3>
          <small className="opacity-75">Todos os campos marcados com * são obrigatórios</small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Digite o título do filme"
                />
                {errors.titulo && <div className="invalid-feedback">{errors.titulo}</div>}
                <small className="text-muted">Máximo 100 caracteres</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Classificação *</label>
                <input
                  type="text"
                  name="classificacao"
                  className={`form-control ${errors.classificacao ? 'is-invalid' : ''}`}
                  value={formData.classificacao}
                  onChange={handleChange}
                  placeholder="Ex: Livre, 12 anos, 16 anos, 18 anos"
                />
                {errors.classificacao && (
                  <div className="invalid-feedback">{errors.classificacao}</div>
                )}
                <small className="text-muted">Ex: Livre, 10, 12, 14, 16, 18 anos</small>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Sinopse *</label>
              <textarea
                name="sinopse"
                className={`form-control ${errors.sinopse ? 'is-invalid' : ''}`}
                value={formData.sinopse}
                onChange={handleChange}
                rows={4}
                placeholder="Digite a sinopse do filme (mínimo 10 caracteres)"
              />
              {errors.sinopse && <div className="invalid-feedback">{errors.sinopse}</div>}
              <small className="text-muted">Mínimo 10, máximo 1000 caracteres</small>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Duração (minutos) *</label>
                <input
                  type="number"
                  name="duracao"
                  className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
                  value={formData.duracao || ''}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  step="1"
                />
                {errors.duracao && <div className="invalid-feedback">{errors.duracao}</div>}
                <small className="text-muted">Número inteiro positivo (1-300)</small>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Gênero *</label>
                <select
                  name="genero"
                  className={`form-control ${errors.genero ? 'is-invalid' : ''}`}
                  value={formData.genero}
                  onChange={handleChange}
                >
                  <option value="">Selecione um gênero</option>
                  {Object.values(Genero).map((genero) => (
                    <option key={genero} value={genero}>
                      {genero}
                    </option>
                  ))}
                </select>
                {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Data de Início de Exibição *</label>
                <input
                  type="date"
                  name="dataIniciaExibicao"
                  className={`form-control ${
                    errors.dataIniciaExibicao ? 'is-invalid' : ''
                  }`}
                  value={formData.dataIniciaExibicao}
                  onChange={handleChange}
                  min={today}
                />
                {errors.dataIniciaExibicao && (
                  <div className="invalid-feedback">{errors.dataIniciaExibicao}</div>
                )}
                <small className="text-muted">Não pode ser retroativa</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Data de Término de Exibição *</label>
                <input
                  type="date"
                  name="dataFinalExibicao"
                  className={`form-control ${
                    errors.dataFinalExibicao ? 'is-invalid' : ''
                  }`}
                  value={formData.dataFinalExibicao}
                  onChange={handleChange}
                  min={minEndDate}
                />
                {errors.dataFinalExibicao && (
                  <div className="invalid-feedback">{errors.dataFinalExibicao}</div>
                )}
                <small className="text-muted">Deve ser posterior à data inicial</small>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/filmes')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Cadastrar Filme
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

export default CadastrarFilme
