import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLanches, deleteLanche } from '../services/api'
import { Lanche } from '../models'

const LanchesPage = () => {
  const [lanches, setLanches] = useState<Lanche[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarLanches()
  }, [])

  const carregarLanches = async () => {
    try {
      const dados = await fetchLanches()
      setLanches(dados)
    } catch (err) {
      alert('Erro ao carregar lanches')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number | string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o lanche "${nome}"?`)) {
      try {
        await deleteLanche(id)
        carregarLanches()
      } catch (err) {
        alert('Erro ao excluir lanche')
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
          <i className="bi bi-cup-straw text-primary me-2"></i>
          Lanches
        </h2>
        <Link to="/lanches/cadastrar" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Novo Lanche
        </Link>
      </div>

      {lanches.length === 0 ? (
        <div className="card shadow">
          <div className="card-body text-center py-5">
            <i className="bi bi-cup-straw display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Nenhum lanche cadastrado</h4>
            <p className="text-muted">Comece cadastrando seu primeiro lanche</p>
            <Link to="/lanches/cadastrar" className="btn btn-primary mt-2">
              Cadastrar Primeiro Lanche
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th style={{ width: '120px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lanches.map((lanche) => (
                <tr key={lanche.id}>
                  <td>{lanche.nome}</td>
                  <td>R$ {lanche.valor.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(lanche.id!, lanche.nome)}
                    >
                      <i className="bi bi-trash me-1" />
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

export default LanchesPage
