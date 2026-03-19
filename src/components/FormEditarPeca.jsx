import { useState } from 'react'
import { pecasService } from '../services/api'
import Modal from './Modal'

const campo = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }
const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }
const inputStyle = { padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13.5px', outline: 'none', fontFamily: 'sans-serif' }

const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XGG', '34', '36', '38', '40', '42', '44', '46', '48', '50']

export default function FormEditarPeca({ peca, onClose, onSalvo }) {
  const [dados, setDados] = useState({ ...peca })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const atualiza = (campo, valor) => setDados(d => ({ ...d, [campo]: valor }))

  const handleValor = (e) => {
    const nums = e.target.value.replace(/\D/g, '')
    const formatado = (Number(nums) / 100).toFixed(2)
    atualiza('valor_diaria', formatado)
  }

  const salvar = async () => {
    if (!dados.nome || !dados.codigo || !dados.valor_diaria) {
      setErro('Nome, código e valor são obrigatórios.')
      return
    }
    setSalvando(true)
    setErro('')
    try {
      await pecasService.atualizar(peca.id, dados)
      onSalvo()
      onClose()
    } catch {
      setErro('Erro ao salvar. Verifique os dados.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal titulo="Editar peça" onClose={onClose}>
      <div style={campo}>
        <span style={labelStyle}>Nome *</span>
        <input style={inputStyle} value={dados.nome} onChange={e => atualiza('nome', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Código *</span>
          <input style={inputStyle} value={dados.codigo} onChange={e => atualiza('codigo', e.target.value.toUpperCase())} />
        </div>
        <div style={campo}>
          <span style={labelStyle}>Valor da diária *</span>
          <input
            style={{ ...inputStyle, fontFamily: 'monospace' }}
            value={dados.valor_diaria ? `R$ ${dados.valor_diaria}` : ''}
            onChange={handleValor}
            placeholder="R$ 0,00"
          />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={campo}>
          <span style={labelStyle}>Tamanho</span>
          <select style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }} value={dados.tamanho || ''} onChange={e => atualiza('tamanho', e.target.value)}>
            <option value="">Selecionar...</option>
            {TAMANHOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={campo}>
          <span style={labelStyle}>Cor</span>
          <input style={inputStyle} value={dados.cor || ''} onChange={e => atualiza('cor', e.target.value)} />
        </div>
      </div>
      <div style={campo}>
        <span style={labelStyle}>Descrição</span>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={dados.descricao || ''} onChange={e => atualiza('descricao', e.target.value)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <input type="checkbox" id="disponivel" checked={dados.disponivel} onChange={e => atualiza('disponivel', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
        <label htmlFor="disponivel" style={{ fontSize: '13.5px', cursor: 'pointer' }}>Disponível para reserva</label>
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