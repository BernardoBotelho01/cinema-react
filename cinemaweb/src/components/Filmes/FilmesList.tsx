import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchFilmes, deleteFilme } from '../../services/api'
import { Filme } from '../../models'

const FilmesList = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    carregarFilmes()
  }, [])

  const carregarFilmes = async () => {
    try {
      setLoading(true)
      const dados = await fetchFilmes()
      setFilmes(dados)
    } catch (err) {
      setError('Erro ao carregar filmes. Verifique se o servidor está rodando.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, titulo: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o filme "${titulo}"?`)) {
      try {
        await deleteFilme(id)
        carregarFilmes()
        alert('Filme excluído com sucesso!')
      } catch (err) {
        alert('Erro ao excluir filme')
      }
    }
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2 text-muted">Carregando filmes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-2">
            <small>
              Certifique-se de que o json-server está rodando: <code>npm run server</code>
            </small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">
            <i className="bi bi-film text-primary me-2"></i>
            Catálogo de Filmes
          </h2>
          <p className="text-muted mb-0">
            {filmes.length} {filmes.length === 1 ? 'filme cadastrado' : 'filmes cadastrados'}
          </p>
        </div>
        <Link to="/filmes/cadastrar" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Novo Filme
        </Link>
      </div>

      {filmes.length === 0 ? (
        <div className="card shadow border-0">
          <div className="card-body text-center py-5">
            <i className="bi bi-film display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Nenhum filme cadastrado</h4>
            <p className="text-muted mb-4">Comece cadastrando seu primeiro filme</p>
            <Link to="/filmes/cadastrar" className="btn btn-primary btn-lg">
              <i className="bi bi-camera-reels me-2"></i>
              Cadastrar Primeiro Filme
            </Link>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filmes.map((filme) => (
            <div key={filme.id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-light border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 text-truncate">{filme.titulo}</h5>
                    <span className="badge bg-secondary">{filme.classificacao}</span>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">
                    {filme.sinopse.length > 150
                      ? `${filme.sinopse.substring(0, 150)}...`
                      : filme.sinopse}
                  </p>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-clock text-primary me-2"></i>
                      <span>
                        <strong>Duração:</strong> {filme.duracao} minutos
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-tags text-primary me-2"></i>
                      <span>
                        <strong>Gênero:</strong> {filme.genero}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar text-primary me-2"></i>
                      <span>
                        <strong>Exibição:</strong>{' '}
                        {new Date(filme.dataIniciaExibicao).toLocaleDateString()} a{' '}
                        {new Date(filme.dataFinalExibicao).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={() => handleDelete(filme.id!, filme.titulo)}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Excluir Filme
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilmesList
