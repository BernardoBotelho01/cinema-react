import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z, ZodError } from 'zod'
import { createLanche } from '../../services/api'

// validação com Zod
const lancheSchema = z.object({
  nome: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  valor: z
    .number()
    .positive({ message: 'Valor deve ser maior que zero' })
    .max(1000, { message: 'Valor máximo permitido é 1000' }),
})

type FormData = {
  nome: string
  valor: number
}

const CadastrarLanche = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    valor: 0,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validated = lancheSchema.parse(formData)
      await createLanche(validated)
      alert('Lanche cadastrado com sucesso!')
      navigate('/lanches')
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
        alert('Erro ao cadastrar lanche. Tente novamente.')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="bi bi-cup-straw me-2" />
            Cadastrar Novo Lanche
          </h3>
          <small className="opacity-75">
            Todos os campos marcados com * são obrigatórios
          </small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome *</label>
              <input
                type="text"
                name="nome"
                className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Pipoca grande, Refrigerante, Combo 1..."
              />
              {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Valor (R$) *</label>
              <input
                type="number"
                name="valor"
                className={`form-control ${errors.valor ? 'is-invalid' : ''}`}
                value={formData.valor || ''}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="Ex: 15.90"
              />
              {errors.valor && <div className="invalid-feedback">{errors.valor}</div>}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/lanches')}
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
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Cadastrar Lanche
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

export default CadastrarLanche
