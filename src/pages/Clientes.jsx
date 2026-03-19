import { useEffect, useState } from 'react'
import { clientesService } from '../services/api'
import FormCliente from '../components/FormCliente'
import FormEditarCliente from '../components/FormEditarCliente'
import ModalConfirmar from '../components/ModalConfirmar'
import { Pencil, Trash2 } from 'lucide-react'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [apagando, setApagando] = useState(null)

  const carregar = () => {
    setLoading(true)
    clientesService.listar()
      .then(res => setClientes(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  const confirmarApagar = async () => {
    try {
      await clientesService.deletar(apagando.id)
      carregar()
    } catch {
      alert('Erro ao apagar. O cliente pode ter reservas vinculadas.')
    } finally {
      setApagando(null)
    }
  }

  const filtrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.telefone.includes(busca)
  )

  return (
    <div>
      {modalAberto && <FormCliente onClose={() => setModalAberto(false)} onSalvo={carregar} />}
      {editando && <FormEditarCliente cliente={editando} onClose={() => setEditando(null)} onSalvo={carregar} />}
      {apagando && (
        <ModalConfirmar
          mensagem={`Tem certeza que deseja apagar o cliente "${apagando.nome}"? Esta ação não pode ser desfeita.`}
          onConfirmar={confirmarApagar}
          onCancelar={() => setApagando(null)}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.4px' }}>Clientes</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '3px' }}>{clientes.length} clientes cadastrados</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{ background: '#6B46C1', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
        >+ Novo cliente</button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB' }}>
          <input
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none', fontFamily: 'sans-serif' }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Nenhum cliente encontrado</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Nome', 'Telefone', 'Email', 'CPF', 'Cadastrado em', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280', padding: '11px 20px', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(cliente => (
                <tr key={cliente.id} style={{ borderBottom: '1px solid #E5E7EB' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EDE9FE', border: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#6B46C1', flexShrink: 0 }}>
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, fontSize: '13.5px' }}>{cliente.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 20px', fontSize: '13.5px' }}>{cliente.telefone}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13.5px', color: '#6B7280' }}>{cliente.email || '—'}</td>
                  <td style={{ padding: '13px 20px', fontSize: '13px', fontFamily: 'monospace', color: '#6B7280' }}>{cliente.cpf || '—'}</td>
                  <td style={{ padding: '13px 20px', fontSize: '12.5px', color: '#6B7280' }}>{new Date(cliente.criado_em).toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setEditando(cliente)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.color = '#6B46C1'; e.currentTarget.style.borderColor = '#DDD6FE' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                        <Pencil size={14} strokeWidth={1.8} />
                      </button>
                      <button onClick={() => setApagando(cliente)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FCA5A5' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}