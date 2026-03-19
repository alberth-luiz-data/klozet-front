import { useState } from 'react'
import { clientesService } from '../services/api'
import Modal from './Modal'
import { mascaraCPF, mascaraTelefone } from '../utils/mascaras'

const campo = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif' }

export default function FormEditarCliente({ cliente, onClose, onSalvo }) {
  const [dados, setDados] = useState({ ...cliente })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const salvar = async () => {
    if (!dados.nome || !dados.telefone) {
      setErro('Nome e telefone são obrigatórios.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      await clientesService.atualizar(cliente.id, dados)
      onSalvo()
      onClose()
    } catch {
      setErro('Erro ao salvar. Verifique os dados.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal titulo="Editar cliente" onClose={onClose}>
      <div style={campo}>
        <span style={labelStyle}>Nome *</span>
        <input style={inputStyle} value={dados.nome} onChange={e => atualiza('nome', e.target.value)} />
      </div>
      <div style={campo}>
        <span style={labelStyle}>Telefone *</span>
        <input style={inputStyle} value={dados.telefone} onChange={e => atualiza('telefone', mascaraTelefone(e.target.value))} maxLength={15} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Email</span>
          <input style={inputStyle} value={dados.email || ''} onChange={e => atualiza('email', e.target.value)} />
        </div>
        <div style={campo}>
          <span style={labelStyle}>CPF</span>
          <input style={inputStyle} value={dados.cpf || ''} onChange={e => atualiza('cpf', mascaraCPF(e.target.value))} maxLength={14} />
        </div>
      </div>
      <div style={campo}>
        <span style={labelStyle}>Endereço</span>
        <input style={inputStyle} value={dados.endereco || ''} onChange={e => atualiza('endereco', e.target.value)} />
      </div>
      <div style={campo}>
        <span style={labelStyle}>Observações</span>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={dados.observacoes || ''} onChange={e => atualiza('observacoes', e.target.value)} />
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