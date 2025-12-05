import { useState, useEffect } from 'react'
import { createIngresso } from '../../services/api'
import { Sessao } from '../../models'

interface VendaIngressoModalProps {
  show: boolean
  onClose: () => void
  sessao: Sessao
  onVendaConcluida: () => void
}

const VendaIngressoModal = ({ show, onClose, sessao, onVendaConcluida }: VendaIngressoModalProps) => {
  const [tipo, setTipo] = useState<'INTEIRA' | 'MEIA'>('INTEIRA')
  const [quantidade, setQuantidade] = useState(1)
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (show) {
      resetForm()
    }
  }, [show])

  const calcularValor = () => {
    return tipo === 'INTEIRA' ? 25.00 : 12.50
  }

  const calcularTotal = () => {
    return calcularValor() * quantidade
  }

  const handleVenda = async () => {
    if (!sessao.id) {
      setMensagem('Erro: Sessão não encontrada.')
      return
    }
    
    setLoading(true)
    setMensagem('')

    try {
      console.log('Iniciando venda para sessão ID:', sessao.id)
      
      // Criar um ingresso de cada vez
      for (let i = 0; i < quantidade; i++) {
        const ingressoData = {
          sessaoId: sessao.id,
          tipo,
          valor: calcularValor(),
          dataVenda: new Date().toISOString()
        }
        
        console.log('Criando ingresso:', ingressoData)
        await createIngresso(ingressoData)
      }

      setMensagem(`✅ Venda realizada com sucesso! ${quantidade} ingresso(s) vendido(s).`)
      
      setTimeout(() => {
        onVendaConcluida()
        onClose()
      }, 2000)
      
    } catch (error: any) {
      console.error('Erro detalhado na venda:', error)
      setMensagem(`❌ Erro ao realizar venda: ${error.message || 'Verifique o console'}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTipo('INTEIRA')
    setQuantidade(1)
    setMensagem('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-ticket-perforated me-2"></i>
              Venda de Ingressos
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-4">
              <h6>Informações da Sessão</h6>
              <div className="card bg-light">
                <div className="card-body">
                  <p className="mb-1">
                    <strong>Filme:</strong> {sessao.filme?.titulo || 'Filme não carregado'}
                  </p>
                  <p className="mb-1">
                    <strong>Sala:</strong> {sessao.sala?.numero || 'Sala não carregada'}
                  </p>
                  <p className="mb-1">
                    <strong>Horário:</strong> {new Date(sessao.horarioExibicao).toLocaleString()}
                  </p>
                  <p className="mb-0">
                    <strong>Capacidade:</strong> {sessao.sala?.capacidade || 'N/A'} lugares
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo de Ingresso</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoIngresso"
                    id="inteira"
                    checked={tipo === 'INTEIRA'}
                    onChange={() => setTipo('INTEIRA')}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="inteira">
                    Inteira - R$ 25,00
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipoIngresso"
                    id="meia"
                    checked={tipo === 'MEIA'}
                    onChange={() => setTipo('MEIA')}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="meia">
                    Meia - R$ 12,50
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="10"
                value={quantidade}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  if (!isNaN(value) && value >= 1 && value <= 10) {
                    setQuantidade(value)
                  }
                }}
                disabled={loading}
              />
              <small className="text-muted">Máximo 10 ingressos por venda</small>
            </div>

            <div className="card bg-info bg-opacity-10 border-info">
              <div className="card-body">
                <h6 className="card-title">Resumo da Venda</h6>
                <div className="d-flex justify-content-between mb-1">
                  <span>Valor unitário:</span>
                  <span>R$ {calcularValor().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Quantidade:</span>
                  <span>{quantidade}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>R$ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {mensagem && (
              <div className={`alert ${mensagem.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                {mensagem}
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-success" 
              onClick={handleVenda}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processando...
                </>
              ) : (
                <>
                  <i className="bi bi-cash-coin me-2"></i>
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