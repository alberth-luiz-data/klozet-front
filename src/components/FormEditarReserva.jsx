import { useState, useEffect } from 'react'
import { reservasService, clientesService, pecasService } from '../services/api'
import Modal from './Modal'

const campo = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif', background: '#fff' }

export default function FormEditarReserva({ reserva, onClose, onSalvo }) {
  const [dados, setDados] = useState({ ...reserva, cliente: reserva.cliente, peca: reserva.peca })
  const [clientes, setClientes] = useState([])
  const [pecas, setPecas] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    clientesService.listar().then(r => setClientes(r.data))
    pecasService.listar().then(r => setPecas(r.data))
  }, [])

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

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
      await reservasService.atualizar(reserva.id, dados)
      onSalvo()
      onClose()
    } catch {
      setErro('Erro ao salvar. Verifique os dados.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal titulo="Editar reserva" onClose={onClose}>
      <div style={campo}>
        <span style={labelStyle}>Cliente *</span>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={dados.cliente} onChange={e => atualiza('cliente', e.target.value)}>
          <option value="">Selecionar...</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — {c.telefone}</option>)}
        </select>
      </div>
      <div style={campo}>
        <span style={labelStyle}>Peça *</span>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={dados.peca} onChange={e => atualiza('peca', e.target.value)}>
          <option value="">Selecionar...</option>
          {pecas.map(p => <option key={p.id} value={p.id}>{p.codigo} — {p.nome} {p.tamanho ? `(${p.tamanho})` : ''}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Data de retirada *</span>
          <input type="date" style={inputStyle} value={dados.data_retirada} onChange={e => atualiza('data_retirada', e.target.value)} />
        </div>
        <div style={campo}>
          <span style={labelStyle}>Data de devolução *</span>
          <input type="date" style={inputStyle} value={dados.data_devolucao} onChange={e => atualiza('data_devolucao', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Valor total</span>
          <input
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            value={dados.valor_total || ''}
            onChange={e => atualiza('valor_total', e.target.value.replace(/[^\d.,]/g, ''))}
            placeholder="0,00"
          />
        </div>
        <div style={campo}>
          <span style={labelStyle}>Status</span>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={dados.status} onChange={e => atualiza('status', e.target.value)}>
            <option value="reservado">Reservado</option>
            <option value="retirado">Retirado</option>
            <option value="devolvido">Devolvido</option>
            <option value="atrasado">Atrasado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      <div style={campo}>
        <span style={labelStyle}>Observações</span>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }} value={dados.observacoes || ''} onChange={e => atualiza('observacoes', e.target.value)} />
      </div>
      {erro && <div style={{ background: '#FEE2E2', color: '#9B1C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{erro}</div>}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
        <button onClick={salvar} disabled={salvando} style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: '#6B46C1', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', opacity: salvando ? 0.6 : 1 }}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </Modal>
  )
}