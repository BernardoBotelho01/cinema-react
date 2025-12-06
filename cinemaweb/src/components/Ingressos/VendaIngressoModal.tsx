import { useEffect, useState, ChangeEvent } from 'react'
import { Sessao, Lanche } from '../../models'
import { createIngresso, fetchLanches } from '../../services/api'

type Props = {
  show: boolean
  onClose: () => void
  sessao: Sessao
  onVendaConcluida: () => void
}

const VALOR_INTEIRA = 25
const VALOR_MEIA = 12.5

const VendaIngressoModal = ({ show, onClose, sessao, onVendaConcluida }: Props) => {
  const [tipo, setTipo] = useState<'INTEIRA' | 'MEIA'>('INTEIRA')
  const [quantidade, setQuantidade] = useState(1)
  const [lanches, setLanches] = useState<Lanche[]>([])
  const [lancheSelecionadoId, setLancheSelecionadoId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show) {
      carregarLanches()
      // resetar campos quando abrir
      setTipo('INTEIRA')
      setQuantidade(1)
      setLancheSelecionadoId('')
    }
  }, [show])

  const carregarLanches = async () => {
    try {
      const dados = await fetchLanches()
      setLanches(dados)
    } catch (err) {
      console.error('Erro ao carregar lanches', err)
    }
  }

  const handleTipoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTipo(e.target.value as 'INTEIRA' | 'MEIA')
  }

  const handleQuantidadeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value)
    if (valor >= 1 && valor <= 10) {
      setQuantidade(valor)
    }
  }

  const handleLancheChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLancheSelecionadoId(e.target.value)
  }

  const valorIngressoUnitario = tipo === 'INTEIRA' ? VALOR_INTEIRA : VALOR_MEIA
  const valorIngressos = valorIngressoUnitario * quantidade

  const lancheSelecionado = lanches.find(
    (l) => String(l.id) === String(lancheSelecionadoId),
  )
  const valorLanche = lancheSelecionado?.valor ?? 0

  const total = valorIngressos + valorLanche

  const handleConfirmarVenda = async () => {
    if (!sessao.id) {
      alert('Sessão inválida')
      return
    }

    setLoading(true)

    try {
      const dataVenda = new Date().toISOString()

      await createIngresso({
        sessaoId: sessao.id,
        tipo,
        valor: valorIngressoUnitario,
        dataVenda,
        total,
        lancheId: lancheSelecionado?.id,
        lancheNome: lancheSelecionado?.nome,
        lancheValor: valorLanche,
      })

      alert('Venda registrada com sucesso!')
      onVendaConcluida()
      onClose()
    } catch (err) {
      console.error('Erro ao registrar venda', err)
      alert('Erro ao registrar venda.')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  const filmeTitulo = sessao.filme?.titulo || 'Filme não carregado'
  const salaNome =
    sessao.sala?.numero !== undefined ? `Sala ${sessao.sala.numero}` : 'Sala não carregada'
  const horario = new Date(sessao.horarioExibicao)

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-ticket-perforated me-2" />
              Venda de Ingressos
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            {/* Informações da sessão */}
            <div className="mb-3">
              <h6>Informações da Sessão</h6>
              <div className="border rounded p-3 bg-light">
                <p className="mb-1">
                  <strong>Filme:</strong> {filmeTitulo}
                </p>
                <p className="mb-1">
                  <strong>Sala:</strong> {salaNome}
                </p>
                <p className="mb-1">
                  <strong>Horário:</strong>{' '}
                  {horario.toLocaleDateString('pt-BR')} às{' '}
                  {horario.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mb-0">
                  <strong>Capacidade:</strong>{' '}
                  {sessao.sala?.capacidade ?? 'N/A'} lugares
                </p>
              </div>
            </div>

            {/* Tipo de ingresso */}
            <div className="mb-3">
              <h6>Tipo de Ingresso</h6>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inteira"
                  value="INTEIRA"
                  checked={tipo === 'INTEIRA'}
                  onChange={handleTipoChange}
                />
                <label className="form-check-label" htmlFor="inteira">
                  Inteira - R$ {VALOR_INTEIRA.toFixed(2)}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="meia"
                  value="MEIA"
                  checked={tipo === 'MEIA'}
                  onChange={handleTipoChange}
                />
                <label className="form-check-label" htmlFor="meia">
                  Meia - R$ {VALOR_MEIA.toFixed(2)}
                </label>
              </div>
            </div>

            {/* Quantidade */}
            <div className="mb-3">
              <label className="form-label">Quantidade de ingressos</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={10}
                value={quantidade}
                onChange={handleQuantidadeChange}
              />
              <small className="text-muted">Máximo 10 ingressos por venda.</small>
            </div>

            {/* Lanche */}
            <div className="mb-3">
              <h6>Lanche (opcional)</h6>
              <select
                className="form-control"
                value={lancheSelecionadoId}
                onChange={handleLancheChange}
              >
                <option value="">
                  {lanches.length === 0
                    ? 'Nenhum lanche cadastrado'
                    : 'Selecione um lanche (opcional)'}
                </option>
                {lanches.map((lanche) => (
                  <option key={lanche.id} value={String(lanche.id)}>
                    {lanche.nome} - R$ {lanche.valor.toFixed(2)}
                  </option>
                ))}
              </select>
              {lancheSelecionado && (
                <small className="text-muted">
                  Lanche selecionado: {lancheSelecionado.nome} (R${' '}
                  {lancheSelecionado.valor.toFixed(2)})
                </small>
              )}
            </div>

            {/* Resumo */}
            <div className="mb-0">
              <h6>Resumo da Venda</h6>
              <div className="border rounded p-3 bg-light">
                <p className="mb-1">
                  <strong>Valor unitário do ingresso:</strong> R${' '}
                  {valorIngressoUnitario.toFixed(2)}
                </p>
                <p className="mb-1">
                  <strong>Quantidade de ingressos:</strong> {quantidade}
                </p>
                <p className="mb-1">
                  <strong>Total ingressos:</strong> R$ {valorIngressos.toFixed(2)}
                </p>
                <p className="mb-1">
                  <strong>Lanche:</strong>{' '}
                  {lancheSelecionado
                    ? `${lancheSelecionado.nome} - R$ ${valorLanche.toFixed(2)}`
                    : 'Nenhum'}
                </p>
                <hr />
                <p className="mb-0 fs-5">
                  <strong>Total a pagar: R$ {total.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleConfirmarVenda}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Confirmando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2" />
                  Confirmar Venda
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendaIngressoModal
