import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z, ZodError } from 'zod'
import { createSala } from '../../services/api'

// Esquema de validação para Salas
const salaSchema = z.object({
  numero: z
    .number()
    .positive({ message: 'Número da sala deve ser positivo' })
    .int({ message: 'Número deve ser inteiro' })
    .min(1, { message: 'Número da sala é obrigatório' })
    .max(50, { message: 'Número máximo é 50' }),

  capacidade: z
    .number()
    .positive({ message: 'Capacidade deve ser um número positivo' })
    .int({ message: 'Capacidade deve ser inteira' })
    .min(1, { message: 'Capacidade mínima é 1 lugar' })
    .max(300, { message: 'Capacidade máxima é 300 lugares' }),
})

type FormData = {
  numero: number
  capacidade: number
}

const CadastrarSala = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    numero: 0,
    capacidade: 0,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const criarPoltronas = (capacidade: number) => {
    const filas = Math.ceil(capacidade / 10)
    const poltronas: number[][] = []

    for (let i = 0; i < filas; i++) {
      const poltronasFila: number[] = []
      for (let j = 0; j < 10; j++) {
        if (i * 10 + j < capacidade) {
          poltronasFila.push(0) // 0 = disponível
        } else {
          poltronasFila.push(-1) // -1 = inexistente
        }
      }
      poltronas.push(poltronasFila)
    }

    return poltronas
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validatedData = salaSchema.parse(formData)
      const poltronas = criarPoltronas(validatedData.capacidade)

      await createSala({
        ...validatedData,
        poutronas: poltronas,
      })

      navigate('/salas')
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
        alert('Erro ao cadastrar sala. Tente novamente.')
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
            <i className="bi bi-door-closed me-2"></i>
            Cadastrar Nova Sala
          </h3>
          <small className="opacity-75">Todos os campos marcados com * são obrigatórios</small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Número da Sala *</label>
                <input
                  type="number"
                  name="numero"
                  className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                  value={formData.numero || ''}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  placeholder="Digite o número da sala"
                />
                {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
                <small className="text-muted">Número inteiro positivo (1-50)</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Capacidade *</label>
                <input
                  type="number"
                  name="capacidade"
                  className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                  value={formData.capacidade || ''}
                  onChange={handleChange}
                  min="1"
                  max="300"
                  placeholder="Digite a capacidade máxima"
                />
                {errors.capacidade && (
                  <div className="invalid-feedback">{errors.capacidade}</div>
                )}
                <small className="text-muted">Número inteiro positivo (1-300 lugares)</small>
              </div>
            </div>

            {formData.capacidade > 0 && (
              <div className="mb-4">
                <label className="form-label">
                  Layout da Sala ({formData.capacidade} lugares)
                </label>
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <div className="bg-dark text-white py-1 mb-3 rounded">
                        <small>TELA</small>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-center gap-2">
                      {(() => {
                        const poltronas = criarPoltronas(formData.capacidade)
                        return poltronas.map((fila, indexFila) => (
                          <div key={indexFila} className="d-flex gap-1">
                            {fila.map((poltrona, indexPoltrona) => (
                              <div
                                key={indexPoltrona}
                                className={`d-flex align-items-center justify-content-center 
                                  ${
                                    poltrona === 0
                                      ? 'bg-success text-white'
                                      : 'bg-secondary text-white'
                                  } 
                                  rounded`}
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  fontSize: '0.8rem',
                                  opacity: poltrona === -1 ? 0.3 : 1,
                                }}
                                title={`Fila ${indexFila + 1}, Poltrona ${indexPoltrona + 1}`}
                              >
                                {poltrona === 0 ? 'L' : 'X'}
                              </div>
                            ))}
                          </div>
                        ))
                      })()}
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        <span className="d-inline-flex align-items-center me-3">
                          <span
                            className="bg-success rounded me-1"
                            style={{ width: '15px', height: '15px' }}
                          ></span>
                          Disponível ({formData.capacidade})
                        </span>
                        <span className="d-inline-flex align-items-center">
                          <span
                            className="bg-secondary rounded me-1"
                            style={{ width: '15px', height: '15px' }}
                          ></span>
                          Indisponível
                        </span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card bg-light mb-4">
              <div className="card-body">
                <h6 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Observações
                </h6>
                <ul className="mb-0">
                  <li>
                    Layout automático:{' '}
                    {formData.capacidade > 0 ? Math.ceil(formData.capacidade / 10) : 0} fila(s) de
                    10 poltronas
                  </li>
                  <li>Cada poltrona é identificada por Fila/Posição</li>
                  <li>Poltronas marcadas com X não existem fisicamente</li>
                </ul>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/salas')}
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
                    Cadastrar Sala
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

export default CadastrarSala
