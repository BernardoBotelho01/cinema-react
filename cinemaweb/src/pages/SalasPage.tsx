import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchSalas, deleteSala } from '../services/api'
import type { Sala } from '../models'

const SalasPage = () => {
  const [salas, setSalas] = useState<Sala[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarSalas()
  }, [])

  const carregarSalas = async () => {
    try {
      const dados = await fetchSalas()
      setSalas(dados)
    } catch (err) {
      alert('Erro ao carregar salas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, numero: number) => {
    if (window.confirm(`Tem certeza que deseja excluir a Sala ${numero}?`)) {
      try {
        await deleteSala(id)
        carregarSalas()
      } catch (err) {
        alert('Erro ao excluir sala')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-door-closed text-primary me-2"></i>
          Lista de Salas
        </h2>
        <Link to="/salas/cadastrar" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nova Sala
        </Link>
      </div>

      {salas.length === 0 ? (
        <div className="card shadow">
          <div className="card-body text-center py-5">
            <i className="bi bi-door-closed display-1 text-muted mb-3"></i>
            <h4>Nenhuma sala cadastrada</h4>
            <p className="text-muted">Comece cadastrando sua primeira sala</p>
            <Link to="/salas/cadastrar" className="btn btn-primary mt-2">
              Cadastrar Primeira Sala
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Número</th>
                <th>Capacidade</th>
                <th>Poltronas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id}>
                  <td>
                    <strong>Sala {sala.numero}</strong>
                  </td>
                  <td>{sala.capacidade} lugares</td>
                  <td>
                    <small className="text-muted">
                      {sala.poutronas.length} fila(s) x 10 poltronas
                    </small>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(sala.id!, sala.numero)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SalasPage
