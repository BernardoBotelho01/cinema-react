import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchSessoes, deleteSessao } from '../services/api'
import VendaIngressoModal from '../components/Ingressos/VendaIngressoModal'
import { Sessao } from '../models'

const SessoesPage = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    carregarSessoes()
  }, [])

  const carregarSessoes = async () => {
    try {
      setLoading(true)
      console.log('Carregando sessões...')
      const dados = await fetchSessoes()
      console.log('Sessões carregadas:', dados)
      setSessoes(dados)
    } catch (err) {
      console.error('Erro ao carregar sessões:', err)
      setError('Erro ao carregar sessões. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, filmeTitulo: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a sessão do filme "${filmeTitulo}"?`)) {
      try {
        await deleteSessao(id)
        carregarSessoes()
      } catch (err) {
        alert('Erro ao excluir sessão')
      }
    }
  }

  const abrirModalVenda = (sessao: Sessao) => {
    console.log('Abrindo modal para sessão:', sessao)
    setSessaoSelecionada(sessao)
    setShowModal(true)
  }

  const fecharModal = () => {
    setShowModal(false)
    setSessaoSelecionada(null)
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2 text-muted">Carregando sessões...</p>
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
            <small>Certifique-se de que o json-server está rodando: <code>npm run server</code></small>
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
            <i className="bi bi-calendar-event text-primary me-2"></i>
            Sessões Agendadas
          </h2>
          <p className="text-muted mb-0">
            {sessoes.length} {sessoes.length === 1 ? 'sessão agendada' : 'sessões agendadas'}
          </p>
        </div>
        <Link to="/sessoes/cadastrar" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nova Sessão
        </Link>
      </div>

      {sessoes.length === 0 ? (
        <div className="card shadow border-0">
          <div className="card-body text-center py-5">
            <i className="bi bi-calendar-event display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Nenhuma sessão agendada</h4>
            <p className="text-muted mb-4">Comece agendando sua primeira sessão</p>
            <Link to="/sessoes/cadastrar" className="btn btn-primary btn-lg">
              <i className="bi bi-calendar-plus me-2"></i>
              Agendar Primeira Sessão
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Filme</th>
                  <th>Sala</th>
                  <th>Data e Horário</th>
                  <th style={{ width: '150px' }} className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao, index) => (
                  <tr key={sessao.id}>
                    <td className="fw-bold">{index + 1}</td>
                    <td>
                      <div>
                        <strong className="d-block">{sessao.filme?.titulo || 'Sem filme'}</strong>
                        <small className="text-muted">
                          ID: {sessao.id} | FilmeID: {sessao.filmeId}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong className="d-block">Sala {sessao.sala?.numero || 'N/A'}</strong>
                        <small className="text-muted">
                          SalaID: {sessao.salaId}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="text-nowrap">
                        {new Date(sessao.horarioExibicao).toLocaleDateString('pt-BR')}
                        <br />
                        <small className="text-muted">
                          {new Date(sessao.horarioExibicao).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => abrirModalVenda(sessao)}
                          title="Vender Ingresso"
                        >
                          <i className="bi bi-ticket-perforated me-1"></i>
                          Vender
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(sessao.id!, sessao.filme?.titulo || 'Sessão')}
                          title="Excluir Sessão"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sessaoSelecionada && (
        <VendaIngressoModal
          show={showModal}
          onClose={fecharModal}
          sessao={sessaoSelecionada}
          onVendaConcluida={carregarSessoes}
        />
      )}
    </div>
  )
}

export default SessoesPage