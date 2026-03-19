import { useState } from 'react'
import { clientesService } from '../services/api'
import Modal from './Modal'
import { mascaraCPF, mascaraTelefone } from '../utils/mascaras'

const campo = {
  display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px',
}
const labelStyle = {
  fontSize: '12px', fontWeight: 600, color: '#8A8880',
  textTransform: 'uppercase', letterSpacing: '0.06em',
}
const inputStyle = {
  padding: '9px 12px', borderRadius: '8px', border: '1px solid #E4E2DC',
  fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif',
  transition: 'border-color 0.15s',
}

export default function FormCliente({ onClose, onSalvo }) {
  const [dados, setDados] = useState({
    nome: '', telefone: '', email: '', cpf: '', endereco: '', observacoes: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const handleTelefone = (e) => {
    atualiza('telefone', mascaraTelefone(e.target.value))
  }

  const handleCPF = (e) => {
    atualiza('cpf', mascaraCPF(e.target.value))
  }

  const salvar = async () => {
    if (!dados.nome || !dados.telefone) {
      setErro('Nome e telefone são obrigatórios.')
      return
    }
    if (dados.cpf && dados.cpf.replace(/\D/g, '').length !== 11) {
      setErro('CPF inválido. Digite os 11 dígitos.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      await clientesService.criar(dados)
      onSalvo()
      onClose()
    } catch (e) {
      setErro('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal titulo="Novo cliente" onClose={onClose}>
      <div style={campo}>
        <span style={labelStyle}>Nome *</span>
        <input
          style={inputStyle}
          value={dados.nome}
          onChange={e => atualiza('nome', e.target.value)}
          placeholder="Nome completo"
        />
      </div>

      <div style={campo}>
        <span style={labelStyle}>Telefone *</span>
        <input
          style={inputStyle}
          value={dados.telefone}
          onChange={handleTelefone}
          placeholder="(81) 99999-9999"
          maxLength={15}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Email</span>
          <input
            style={inputStyle}
            value={dados.email}
            onChange={e => atualiza('email', e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        <div style={campo}>
          <span style={labelStyle}>CPF</span>
          <input
            style={inputStyle}
            value={dados.cpf}
            onChange={handleCPF}
            placeholder="000.000.000-00"
            maxLength={14}
          />
        </div>
      </div>

      <div style={campo}>
        <span style={labelStyle}>Endereço</span>
        <input
          style={inputStyle}
          value={dados.endereco}
          onChange={e => atualiza('endereco', e.target.value)}
          placeholder="Rua, número, bairro"
        />
      </div>

      <div style={campo}>
        <span style={labelStyle}>Observações</span>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
          value={dados.observacoes}
          onChange={e => atualiza('observacoes', e.target.value)}
          placeholder="Alguma observação sobre o cliente..."
        />
      </div>

      {erro && (
        <div style={{
          background: '#FEE2E2', color: '#9B1C1C',
          padding: '10px 14px', borderRadius: '8px',
          fontSize: '13px', marginBottom: '16px',
        }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '9px 16px', borderRadius: '8px',
            border: '1px solid #E4E2DC', background: '#fff',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}
        >Cancelar</button>
        <button
          onClick={salvar}
          disabled={salvando}
          style={{
            padding: '9px 16px', borderRadius: '8px',
            border: 'none', background: '#1A1916', color: '#fff',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            opacity: salvando ? 0.6 : 1,
          }}
        >{salvando ? 'Salvando...' : 'Salvar cliente'}</button>
      </div>
    </Modal>
  )
}