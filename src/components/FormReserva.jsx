import { useState, useEffect } from 'react'
import { reservasService, clientesService, pecasService } from '../services/api'
import Modal from './Modal'

const campo = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#8A8880', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #E4E2DC', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif', background: '#fff' }

export default function FormReserva({ onClose, onSalvo }) {
  const [dados, setDados] = useState({
    cliente: '', peca: '', status: 'reservado',
    data_retirada: '', data_devolucao: '', valor_total: '', observacoes: '',
  })
  const [clientes, setClientes] = useState([])
  const [pecas, setPecas] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    clientesService.listar().then(r => setClientes(r.data))
    pecasService.listar().then(r => setPecas(r.data.filter(p => p.disponivel)))
  }, [])

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const calcularValor = (retirada, devolucao, pecaId) => {
    if (!retirada || !devolucao || !pecaId) return
    const peca = pecas.find(p => p.id === Number(pecaId))
    if (!peca) return
    const dias = Math.ceil(
      (new Date(devolucao) - new Date(retirada)) / (1000 * 60 * 60 * 24)
    )
    if (dias > 0) {
      atualiza('valor_total', (dias * parseFloat(peca.valor_diaria)).toFixed(2))
    }
  }

  const handlePeca = (e) => {
    atualiza('peca', e.target.value)
    calcularValor(dados.data_retirada, dados.data_devolucao, e.target.value)
  }

  const handleRetirada = (e) => {
    atualiza('data_retirada', e.target.value)
    calcularValor(e.target.value, dados.data_devolucao, dados.peca)
  }

  const handleDevolucao = (e) => {
    atualiza('data_devolucao', e.target.value)
    calcularValor(dados.data_retirada, e.target.value, dados.peca)
  }

  const salvar = async () => {
    if (!dados.cliente || !dados.peca || !dados.data_retirada || !dados.data_devolucao) {
      setErro('Cliente, peça e datas são obrigatórios.')
      return
    }
    if (new Date(dados.data_devolucao) <= new Date(dados.data_retirada)) {
      setErro('A data de devolução deve ser após a data de retirada.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      await reservasService.criar(dados)
      onSalvo()
      onClose()
    } catch (e) {
      setErro('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const pecaSelecionada = pecas.find(p => p.id === Number(dados.peca))

  return (
    <Modal titulo="Nova reserva" onClose={onClose}>

      <div style={campo}>
        <span style={labelStyle}>Cliente *</span>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={dados.cliente}
          onChange={e => atualiza('cliente', e.target.value)}
        >
          <option value="">Selecionar cliente...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome} — {c.telefone}</option>
          ))}
        </select>
      </div>

      <div style={campo}>
        <span style={labelStyle}>Peça *</span>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={dados.peca}
          onChange={handlePeca}
        >
          <option value="">Selecionar peça disponível...</option>
          {pecas.map(p => (
            <option key={p.id} value={p.id}>
              {p.codigo} — {p.nome} {p.tamanho ? `(${p.tamanho})` : ''} · R$ {parseFloat(p.valor_diaria).toFixed(2)}/dia
            </option>
          ))}
        </select>
      </div>

      {pecaSelecionada && (
        <div style={{
          background: '#F7F6F3', border: '1px solid #E4E2DC',
          borderRadius: '8px', padding: '12px 14px', marginBottom: '16px',
          fontSize: '13px', color: '#8A8880',
          display: 'flex', gap: '16px',
        }}>
          <span>📏 {pecaSelecionada.tamanho || '—'}</span>
          <span>🎨 {pecaSelecionada.cor || '—'}</span>
          <span>💰 R$ {parseFloat(pecaSelecionada.valor_diaria).toFixed(2)}/dia</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Data de retirada *</span>
          <input
            type="date"
            style={inputStyle}
            value={dados.data_retirada}
            onChange={handleRetirada}
          />
        </div>
        <div style={campo}>
          <span style={labelStyle}>Data de devolução *</span>
          <input
            type="date"
            style={inputStyle}
            value={dados.data_devolucao}
            onChange={handleDevolucao}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
        <span style={labelStyle}>Valor total</span>
        <div style={{ position: 'relative' }}>
            <span style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '13.5px', color: '#8A8880',
            }}>R$</span>
            <input
            style={{ ...inputStyle, fontFamily: 'monospace', paddingLeft: '32px', width: '100%' }}
            value={dados.valor_total}
            onChange={e => {
                const nums = e.target.value.replace(/[^\d,\.]/g, '')
                atualiza('valor_total', nums)
            }}
            placeholder="0,00"
            />
        </div>
        {pecaSelecionada && dados.data_retirada && dados.data_devolucao && (
            <span
            style={{ fontSize: '11.5px', color: '#8A8880', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => calcularValor(dados.data_retirada, dados.data_devolucao, dados.peca)}
            >
            Usar valor calculado pela diária
            </span>
        )}
        </div>
        <div style={campo}>
          <span style={labelStyle}>Status</span>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={dados.status}
            onChange={e => atualiza('status', e.target.value)}
          >
            <option value="reservado">Reservado</option>
            <option value="retirado">Retirado</option>
          </select>
        </div>
      </div>

      <div style={campo}>
        <span style={labelStyle}>Observações</span>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
          value={dados.observacoes}
          onChange={e => atualiza('observacoes', e.target.value)}
          placeholder="Alguma observação sobre a reserva..."
        />
      </div>

      {dados.valor_total && dados.data_retirada && dados.data_devolucao && (
        <div style={{
          background: '#D8F3DC', color: '#2D6A4F',
          padding: '10px 14px', borderRadius: '8px',
          fontSize: '13px', marginBottom: '16px', fontWeight: 500,
        }}>
          ✓ {Math.ceil((new Date(dados.data_devolucao) - new Date(dados.data_retirada)) / (1000 * 60 * 60 * 24))} dias · Total: R$ {dados.valor_total}
        </div>
      )}

      {erro && (
        <div style={{ background: '#FEE2E2', color: '#9B1C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #E4E2DC', background: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        >Cancelar</button>
        <button
          onClick={salvar}
          disabled={salvando}
          style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: '#1A1916', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}
        >{salvando ? 'Salvando...' : 'Salvar reserva'}</button>
      </div>
    </Modal>
  )
}